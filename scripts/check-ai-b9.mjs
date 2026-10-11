import assert from 'node:assert/strict';
import {
  parse, parseLines, format, displayName, evaluate, symbolsOf, ttEntails, cnfSteps, toClauses, formatClause,
  resolve, plResolution, plFcEntails, plBcEntails, dpll, dpllEntails, walkSat, walkSatEntails, definiteRules,
  PRESETS, UMBRELLA_PROOF, LogicSyntaxError,
} from '../src/features/lessons/b9/logic-engine.js';

const P = (s) => parse(s);
const kbOf = (lines) => lines.map(P);
const clauses = (s) => toClauses(P(s)).map(formatClause);
const iffSame = (a, b) => {
  const syms = symbolsOf([a, b]);
  for (let i = 0; i < 2 ** syms.length; i++) {
    const m = Object.fromEntries(syms.map((s, k) => [s, Boolean((i >> k) & 1)]));
    if (evaluate(a, m) !== evaluate(b, m)) return false;
  }
  return true;
};

/* ── parser & printer ── */
assert.equal(format(P('B1,1 <=> (P1,2 | P2,1)')), 'B₁,₁ ⇔ (P₁,₂ ∨ P₂,₁)');
assert.equal(format(P('A & B => C')), 'A ∧ B ⇒ C');
assert.equal(format(P('A ⇒ B ∨ C')), 'A ⇒ (B ∨ C)');
assert.equal(format(P('~(A & B)')), '¬(A ∧ B)');
assert.equal(format(P('A => B => C')), 'A ⇒ (B ⇒ C)');
assert.equal(format(P('(A => B) => C')), '(A ⇒ B) ⇒ C');
assert.equal(displayName('alarm_beeps'), 'alarm_beeps');
assert.equal(displayName('P3,1'), 'P₃,₁');
assert.deepEqual(symbolsOf([P('B2,1 ⇔ (P1,1 ∨ P2,2 ∨ P3,1)')]), ['B2,1', 'P1,1', 'P2,2', 'P3,1']);
for (const [src, code] of [['', 'empty'], ['A ∧', 'end'], ['(A ∨ B', 'unclosed'], ['A B', 'unexpected'], ['A $ B', 'char'], [')', 'unexpected']]) {
  assert.throws(() => P(src), (e) => e instanceof LogicSyntaxError && e.code === code, src);
}
const lines = parseLines('A\n\n# comment\nA ∧\nB');
assert.equal(lines.sentences.length, 2);
assert.equal(lines.errors.length, 1);
assert.equal(lines.errors[0].line, 3);
// Precedence ¬ > ∧ > ∨ > ⇒ > ⇔ (slide 26).
assert.ok(iffSame(P('¬A ∧ B ∨ C ⇒ D ⇔ E'), P('((((¬A) ∧ B) ∨ C) ⇒ D) ⇔ E')));

/* ── semantics (slide 27, corrected example) ── */
const m1 = { 'P1,2': false, 'P2,2': false, 'P3,1': true };
assert.equal(evaluate(P('¬P1,2 ∧ (P2,2 ∨ P3,1)'), m1), true);
assert.equal(evaluate(P('P2,2 ∨ P3,1'), m1), true);
assert.equal(evaluate(P('P2,2'), m1), false); // the slide's "true ∨ false" has the operands swapped
// Implication: false only for T ⇒ F.
assert.deepEqual([[false, false], [false, true], [true, false], [true, true]].map(([p, q]) => evaluate(P('p ⇒ q'), { p, q })), [true, true, false, true]);

/* ── Wumpus entailment (slides 21, 28, 30) ── */
const wumpus = kbOf(PRESETS.wumpus.kb);
const tt = ttEntails(wumpus, P('¬P1,2'));
assert.equal(tt.symbols.length, 7);
assert.equal(tt.total, 128);
assert.equal(tt.kbModels, 3);
assert.equal(tt.entailed, true);
assert.ok(tt.rows.every((r) => r.model['P1,2'] === false && r.model['B1,1'] === false && r.model['B2,1'] === true));
assert.equal(ttEntails(wumpus, P('¬P2,2')).entailed, false);
assert.equal(ttEntails(wumpus, P('P2,2')).entailed, false); // ⊭ α does not mean ⊨ ¬α
assert.equal(ttEntails(wumpus, P('P2,2 ∨ P3,1')).entailed, true);
// Eight-model picture: only P1,2, P2,2, P3,1 vary; KB keeps 3, α₁ keeps 4 that contain them.
let kbCount = 0, a1 = 0, a2Inside = 0;
for (let i = 0; i < 8; i++) {
  const m = { 'B1,1': false, 'B2,1': true, 'P1,1': false, 'P2,1': false, 'P1,2': Boolean(i & 4), 'P2,2': Boolean(i & 2), 'P3,1': Boolean(i & 1) };
  const inKb = wumpus.every((s) => evaluate(s, m));
  if (inKb) kbCount++;
  if (!m['P1,2']) a1++;
  if (inKb && !m['P2,2']) a2Inside++;
}
assert.deepEqual([kbCount, a1, a2Inside], [3, 4, 1]);

/* ── Quiz 01 / 05 — fire alarm ── */
const fire = kbOf(PRESETS.fire.kb);
const fireTt = ttEntails(fire, P('R'));
assert.deepEqual([fireTt.total, fireTt.kbModels, fireTt.entailed], [32, 1, true]);
const fc = plFcEntails(fire, P('R'));
assert.equal(fc.entailed, true);
assert.deepEqual(fc.trace.filter((e) => e.kind === 'pop').map((e) => e.p), ['A', 'H', 'S', 'F']);
const bc = plBcEntails(fire, P('R'));
assert.equal(bc.entailed, true);
assert.deepEqual(bc.trace.filter((e) => e.kind === 'goal').map((e) => e.goal), ['R', 'F', 'H', 'S', 'A']);

/* ── Quiz 02 — validity & satisfiability ── */
const q2 = ['A ∨ B ⇒ A ∧ C', 'A ∧ B ⇒ A ∨ C', '(A ∨ B) ∧ (¬B ∨ C) ⇒ A ∨ C', '(A ∨ ¬B) ⇒ A ∧ B'].map((s) => ttEntails([], P(s)).alphaClass);
assert.deepEqual(q2, ['satisfiable', 'valid', 'valid', 'satisfiable']);
// Slide 36 lists P ⇒ ¬P as valid; it is only satisfiable. P ⇒ P is the valid example.
assert.equal(ttEntails([], P('P ⇒ ¬P')).alphaClass, 'satisfiable');
assert.equal(ttEntails([], P('P ⇒ P')).alphaClass, 'valid');
assert.equal(ttEntails([], P('P ∨ ¬P')).alphaClass, 'valid');
assert.equal(ttEntails([], P('(P ∧ (P ⇒ Q)) ⇒ Q')).alphaClass, 'valid');
assert.equal(ttEntails([], P('P ∧ ¬P')).alphaClass, 'unsatisfiable');
// Deduction theorem and refutation agree with direct entailment.
assert.equal(ttEntails([P('A ∧ B')], P('A ∨ C')).entailed, ttEntails([], P('A ∧ B ⇒ A ∨ C')).alphaClass === 'valid');

/* ── equivalence table (slide 35) ── */
for (const [l, r] of [
  ['α ∧ β', 'β ∧ α'], ['α ∨ β', 'β ∨ α'], ['(α ∧ β) ∧ γ', 'α ∧ (β ∧ γ)'], ['(α ∨ β) ∨ γ', 'α ∨ (β ∨ γ)'], ['¬¬α', 'α'],
  ['α ⇒ β', '¬β ⇒ ¬α'], ['α ⇒ β', '¬α ∨ β'], ['α ⇔ β', '(α ⇒ β) ∧ (β ⇒ α)'], ['¬(α ∧ β)', '¬α ∨ ¬β'], ['¬(α ∨ β)', '¬α ∧ ¬β'],
  ['α ∧ (β ∨ γ)', '(α ∧ β) ∨ (α ∧ γ)'], ['α ∨ (β ∧ γ)', '(α ∨ β) ∧ (α ∨ γ)'],
].map(([l, r]) => [l.replace(/α/g, 'a').replace(/β/g, 'b').replace(/γ/g, 'c'), r.replace(/α/g, 'a').replace(/β/g, 'b').replace(/γ/g, 'c')])) {
  assert.ok(iffSame(P(l), P(r)), `${l} ≡ ${r}`);
}

/* ── inference-rule proofs (slides 40–41) ── */
assert.equal(ttEntails(kbOf(['P ∧ Q', 'P ⇒ R', 'Q ∧ R ⇒ S']), P('S')).entailed, true);
for (const step of ['(B1,1 ⇒ (P1,2 ∨ P2,1)) ∧ ((P1,2 ∨ P2,1) ⇒ B1,1)', '(P1,2 ∨ P2,1) ⇒ B1,1', '¬B1,1 ⇒ ¬(P1,2 ∨ P2,1)', '¬(P1,2 ∨ P2,1)', '¬P1,2 ∧ ¬P2,1']) {
  assert.equal(ttEntails(wumpus, P(step)).entailed, true, step);
}
// R11–R17 (slide 46): after ¬B1,2 at [1,2], P3,1 follows.
const extended = [...wumpus, P('¬B1,2'), P('B1,2 ⇔ (P1,1 ∨ P2,2 ∨ P1,3)')];
for (const s of ['¬P2,2', '¬P1,3', 'P1,1 ∨ P2,2 ∨ P3,1', 'P1,1 ∨ P3,1', 'P3,1']) assert.equal(ttEntails(extended, P(s)).entailed, true, s);
assert.deepEqual(resolve(toClauses(P('P1,1 ∨ P2,2 ∨ P3,1'))[0], toClauses(P('¬P2,2'))[0]).map((r) => formatClause(r.clause)), ['P₁,₁ ∨ P₃,₁']);
assert.deepEqual(resolve(toClauses(P('P1,1 ∨ P3,1'))[0], toClauses(P('¬P1,1'))[0]).map((r) => formatClause(r.clause)), ['P₃,₁']);
// Monotonicity: adding sentences never removes an entailment.
assert.equal(ttEntails([...wumpus, P('Z ∨ ¬Z'), P('Q')], P('¬P1,2')).entailed, true);

/* ── CNF (slides 48, 50) ── */
assert.deepEqual(clauses('B1,1 ⇔ (P1,2 ∨ P2,1)'), ['¬B₁,₁ ∨ P₁,₂ ∨ P₂,₁', '¬P₁,₂ ∨ B₁,₁', '¬P₂,₁ ∨ B₁,₁']);
assert.deepEqual(clauses('(A ∧ B) ⇒ (C ⇒ D)'), ['¬A ∨ ¬B ∨ ¬C ∨ D']);
// Quiz 03.2 parsed with the slide's precedence: (P ∨ Q) ⇔ ((R ∧ ¬Q) ⇒ P). Tautological clauses drop out.
assert.deepEqual(clauses('P ∨ Q ⇔ R ∧ ¬Q ⇒ P'), ['R ∨ P ∨ Q']);
assert.ok(iffSame(P('P ∨ Q ⇔ R ∧ ¬Q ⇒ P'), P('P ∨ Q ∨ R')));
assert.deepEqual(cnfSteps(P('A ⇒ B')).map((s) => s.changed), [false, true, false, false]);
assert.deepEqual(clauses('(A ∨ B) ∧ (A ∨ ¬B)'), ['A ∨ B', 'A ∨ ¬B']);
assert.deepEqual(resolve(toClauses(P('A ∨ B'))[0], toClauses(P('A ∨ ¬B'))[0]).map((r) => formatClause(r.clause)), ['A']); // factoring A ∨ A → A
assert.deepEqual(resolve(toClauses(P('A ∨ B'))[0], toClauses(P('¬A ∨ ¬B'))[0]), []); // both pairs give tautologies

/* ── resolution (slides 52, 54) ── */
const res52 = plResolution([P('B1,1 ⇔ (P1,2 ∨ P2,1)'), P('¬B1,1')], P('¬P1,2'));
assert.equal(res52.entailed, true);
assert.equal(res52.initial, 5);
const umbrella = kbOf(PRESETS.umbrella.kb);
const resJoe = plResolution(umbrella, P('¬W'));
assert.equal(resJoe.entailed, true);
// The lecture's printed proof is a valid chain of resolvents.
const proofClauses = UMBRELLA_PROOF.map((x) => (x.clause === '□' ? [] : toClauses(P(x.clause))[0]));
UMBRELLA_PROOF.forEach((step, i) => {
  if (!Array.isArray(step.from)) return;
  const got = resolve(proofClauses[step.from[0]], proofClauses[step.from[1]]).map((r) => formatClause(r.clause));
  assert.ok(got.includes(formatClause(proofClauses[i])), `umbrella step ${i + 1}`);
});
assert.equal(plResolution(wumpus, P('¬P2,2')).entailed, false);

/* ── Horn / definite clauses (slides 55, 57) ── */
assert.equal(definiteRules([P('¬P ∨ ¬Q ∨ R')]).ok, true);
assert.equal(definiteRules([P('¬P ∨ Q ∨ R')]).kind, 'non-horn');
assert.equal(definiteRules([P('¬P ∨ ¬Q')]).kind, 'goal');
assert.equal(plFcEntails(wumpus, P('B2,1')).status, 'not-definite');
assert.equal(plFcEntails(wumpus, P('¬P1,2')).status, 'not-definite'); // KB shape is reported before query shape
assert.equal(plFcEntails(wumpus, P('¬P1,2')).kind, 'goal'); // R1 = ¬P1,1 has no positive literal
assert.equal(plFcEntails(fire, P('¬R')).status, 'bad-query');

/* ── forward / backward chaining on the AND-OR graph (slides 59–80) ── */
const chain = kbOf(PRESETS.chain.kb);
const fcChain = plFcEntails(chain, P('Q'));
assert.equal(fcChain.entailed, true);
assert.deepEqual(fcChain.trace[0].count, [1, 2, 2, 2, 2, 0, 0]);
assert.deepEqual(fcChain.trace.filter((e) => e.kind === 'pop').map((e) => e.p), ['A', 'B', 'L', 'M', 'P']);
assert.deepEqual(fcChain.trace.at(-1).count.slice(0, 5), [0, 0, 0, 0, 0]); // slide 68: every counter reaches 0
const bcChain = plBcEntails(chain, P('Q'));
assert.equal(bcChain.entailed, true);
assert.ok(bcChain.trace.some((e) => e.kind === 'loop' && e.goal === 'P')); // A ∧ P ⇒ L would loop back to P
assert.ok(bcChain.trace.some((e) => e.kind === 'memo-true' && e.goal === 'L')); // M re-uses L instead of re-proving it
// Slide 69 / 81 example.
const abc = kbOf(['A ∧ B ⇒ C', 'C ∧ D ⇒ E', 'C ∧ F ⇒ G', 'A', 'B', 'D']);
assert.equal(plFcEntails(abc, P('E')).entailed, true);
assert.equal(plBcEntails(abc, P('E')).entailed, true);
assert.equal(plBcEntails(abc, P('G')).entailed, false);

/* ── DPLL heuristics (slide 87) & Quiz 06 ── */
const pureDemo = ['A ∨ ¬B', '¬B ∨ ¬C', 'A ∨ C'].map((s) => toClauses(P(s))[0]);
const pureRun = dpll(pureDemo, ['A', 'B', 'C']);
assert.equal(pureRun.satisfiable, true);
assert.deepEqual(pureRun.trace.filter((e) => e.kind === 'pure').map((e) => [e.symbol, e.value]).slice(0, 2), [['A', true], ['B', false]]);
// Unit propagation chain from the slide: B = true → ¬B ∨ ¬C becomes ¬C → A ∨ C becomes A.
// ¬A ∨ C keeps every symbol impure, so pure-symbol never fires first.
const unitDemo = dpll(['B', '¬B ∨ ¬C', 'A ∨ C', '¬A ∨ C'].map((s) => toClauses(P(s))[0]), ['A', 'B', 'C']);
assert.deepEqual(unitDemo.trace.map((e) => (e.kind === 'unit' ? `unit:${e.symbol}=${e.value}` : e.kind)), ['unit:B=true', 'unit:C=false', 'unit:A=true', 'conflict']);
assert.equal(unitDemo.satisfiable, false);
const q6 = kbOf(PRESETS.dpll.kb);
assert.equal(dpllEntails(q6, P('C')).entailed, false);
assert.equal(dpllEntails(q6, P('B ⇒ ¬C')).entailed, true);
const counter = dpllEntails(q6, P('C')).model;
assert.ok(q6.every((s) => evaluate(s, { ...Object.fromEntries(symbolsOf(q6).map((x) => [x, false])), ...counter })) && counter.C === false);

// Quiz 06 by hand: DPLL trace for (a) and the DP elimination sketch for (b) printed in the lesson.
assert.deepEqual(dpllEntails(q6, P('C')).trace.map((e) => (e.symbol ? `${e.kind}:${e.symbol}=${e.value}` : e.kind)), ['unit:A=true', 'unit:D=true', 'unit:C=false', 'pure:F=true', 'pure:B=true', 'sat']);
assert.ok(dpllEntails(q6, P('B ⇒ ¬C')).trace.every((e) => e.kind !== 'split')); // contradiction without any split
function dpEliminate(clauses, order) {
  let set = clauses.map((c) => c.slice());
  const steps = [];
  for (const v of order) {
    const pos = set.filter((c) => c.some((l) => l.s === v && !l.neg));
    const neg = set.filter((c) => c.some((l) => l.s === v && l.neg));
    const added = [];
    for (const a of pos) for (const b of neg) for (const r of resolve(a, b)) if (r.pivot === v && !added.some((x) => formatClause(x) === formatClause(r.clause))) added.push(r.clause);
    set = [...set.filter((c) => !c.some((l) => l.s === v)), ...added];
    steps.push(added.map(formatClause));
    if (set.some((c) => c.length === 0)) return { unsat: true, steps };
  }
  return { unsat: set.some((c) => c.length === 0), steps };
}
const q6b = [...q6.flatMap(toClauses), ...toClauses(P('B ∧ C'))];
const dpB = dpEliminate(q6b, ['C', 'F', 'D', 'A', 'B']);
assert.equal(dpB.unsat, true);
assert.deepEqual(dpB.steps, [['¬A ∨ B ∨ ¬D ∨ ¬F', '¬D ∨ ¬F'], ['¬B ∨ ¬D'], ['¬A ∨ ¬B'], ['¬B'], ['□']]);
assert.equal(dpEliminate([...q6.flatMap(toClauses), ...toClauses(P('¬C'))], ['C', 'F', 'D', 'A', 'B']).unsat, false);
// Backward chaining must not cache a failure caused by a loop cut (review counterexample).
const loopKb = kbOf(['A ∧ B ⇒ G', 'B ⇒ A', 'A ⇒ B', 'C ⇒ A', 'C']);
assert.equal(ttEntails(loopKb, P('G')).entailed, true);
assert.equal(plBcEntails(loopKb, P('G')).entailed, true);

/* ── homework 6 ── */
const hw2 = kbOf(['A', 'B', 'A ∨ C', 'K ∧ E ⇔ A ∧ B', '¬C ⇒ D', 'E ∨ F ⇒ ¬D']);
assert.equal(ttEntails(hw2, P('B ∧ C')).entailed, true);
assert.equal(ttEntails(hw2, P('C ∨ E ⇒ F ∧ B')).entailed, false);
const hw3 = kbOf(['C ∧ D ⇒ Y', 'R ∧ Z ⇒ C', '¬B ∨ D', '¬D ∨ ¬R ∨ Z', 'B', 'R ⇒ D', 'D ⇒ R']);
assert.equal(plFcEntails(hw3, P('Y')).entailed, true);
assert.equal(plBcEntails(hw3, P('Y')).entailed, true);
// Murder puzzle, encoded exactly as the lesson hint: A/B/C guilty; K Brown knew the victim; H Clark hated
// him; T Brown out of town; D Adams & Brown downtown with him. One guilty; innocents tell the truth.
const murder = kbOf(['A ∨ B ∨ C', '¬(A ∧ B)', '¬(A ∧ C)', '¬(B ∧ C)', '¬A ⇒ K ∧ H', '¬B ⇒ ¬K ∧ T', '¬C ⇒ D ∧ (A ∨ B)', 'D ⇒ ¬T']);
assert.equal(ttEntails(murder, P('B')).entailed, true);
assert.equal(ttEntails(murder, P('A')).entailed, false);
assert.equal(ttEntails(murder, P('C')).entailed, false);
assert.ok(ttEntails(murder, P('B')).kbModels > 0); // the story is consistent
assert.equal(plResolution(murder, P('B')).entailed, true);

/* ── WalkSAT (slides 92–93) ── */
const ws = walkSatEntails(q6, P('C'), { seed: 3 });
if (ws.status === 'model') assert.ok(ws.clauses.every((e) => e.clause.some((l) => ws.model[l.s] !== l.neg)));
const unsat = walkSatEntails(q6, P('B ⇒ ¬C'));
assert.equal(unsat.status, 'failure');
assert.equal(unsat.entailed, null); // failure is no verdict

/* ── randomized cross-checks: every procedure agrees with the truth table ── */
let seed = 9;
const rnd = (n) => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed % n; };
const SYMS = ['A', 'B', 'C', 'D'];
function randomFormula(depth) {
  if (depth === 0 || rnd(4) === 0) return { t: 'sym', n: SYMS[rnd(SYMS.length)] };
  const kind = ['not', 'and', 'or', 'imp', 'iff'][rnd(5)];
  return kind === 'not' ? { t: 'not', a: randomFormula(depth - 1) } : { t: kind, a: randomFormula(depth - 1), b: randomFormula(depth - 1) };
}
let cases = 0;
for (let i = 0; i < 400; i++) {
  const f = randomFormula(3);
  // Printing then re-parsing preserves meaning; CNF preserves meaning.
  assert.ok(iffSame(f, P(format(f).replace(/[₀-₉]/g, (d) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(d))))), format(f));
  const cnf = toClauses(f);
  const syms = symbolsOf([f]);
  for (let k = 0; k < 2 ** syms.length; k++) {
    const m = Object.fromEntries(syms.map((s, j) => [s, Boolean((k >> j) & 1)]));
    assert.equal(cnf.every((c) => c.some((l) => m[l.s] !== l.neg)), evaluate(f, m), `CNF of ${format(f)}`);
  }
  const kb = [randomFormula(2), randomFormula(2)];
  const alpha = randomFormula(2);
  const truth = ttEntails(kb, alpha).entailed;
  assert.equal(plResolution(kb, alpha, { limit: 5000 }).entailed, truth, `resolution ${kb.map(format)} ⊨ ${format(alpha)}`);
  assert.equal(dpllEntails(kb, alpha).entailed, truth, `dpll ${kb.map(format)} ⊨ ${format(alpha)}`);
  const w = walkSatEntails(kb, alpha, { seed: i });
  if (w.entailed === false) assert.equal(truth, false);
  cases++;
}
for (let i = 0; i < 300; i++) {
  const kb = [];
  for (let r = 0; r < 5; r++) {
    const head = SYMS[rnd(4)];
    const body = SYMS.filter(() => rnd(3) === 0).filter((s) => s !== head);
    kb.push(body.length ? P(`${body.join(' ∧ ')} ⇒ ${head}`) : P(head));
  }
  const q = P(SYMS[rnd(4)]);
  const truth = ttEntails(kb, q).entailed;
  assert.equal(plFcEntails(kb, q).entailed, truth, `fc ${kb.map(format)} ⊨ ${format(q)}`);
  assert.equal(plBcEntails(kb, q).entailed, truth, `bc ${kb.map(format)} ⊨ ${format(q)}`);
  cases++;
}

console.log(`PASS: parser/printer, slide examples (Wumpus 3/128, fire, umbrella, AND-OR graph, Quiz 01–06), homework 6, slide corrections; ${cases} randomized cases agree with the truth table.`);

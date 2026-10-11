/**
 * Propositional-logic engine for Buổi 9: parser, evaluator, CNF and the inference
 * procedures of the lecture (TT-ENTAILS, PL-RESOLUTION, PL-FC-ENTAILS, backward
 * chaining, DPLL, WalkSAT). Pure data in, pure data out — React only renders traces.
 *
 * AST: { t:'sym', n } | { t:'const', v } | { t:'not', a } | { t:'and'|'or'|'imp'|'iff', a, b }
 * Literal: { s, neg }   Clause: Literal[] (deduplicated, never tautological)
 */

const PREC = { iff: 1, imp: 2, or: 3, and: 4, not: 5, sym: 6, const: 6 };
const OP = { and: '∧', or: '∨', imp: '⇒', iff: '⇔' };
const SUB = '₀₁₂₃₄₅₆₇₈₉';

export class LogicSyntaxError extends Error {
  /** @param {'empty'|'char'|'unexpected'|'end'|'unclosed'} code @param {number} pos @param {string} token */
  constructor(code, pos, token = '') { super(code); this.code = code; this.pos = pos; this.token = token; }
}

/* ───────────── lexer + parser ───────────── */

const MULTI = [['<=>', 'iff'], ['<->', 'iff'], ['=>', 'imp'], ['->', 'imp'], ['&&', 'and'], ['||', 'or']];
const SINGLE = { '¬': 'not', '~': 'not', '!': 'not', '∧': 'and', '&': 'and', '∨': 'or', '|': 'or', '⇒': 'imp', '→': 'imp', '⇔': 'iff', '↔': 'iff', '⟺': 'iff', '(': 'lp', ')': 'rp', '[': 'lp', ']': 'rp', '⊤': 'true', '⊥': 'false' };
const WORDS = { true: 'true', True: 'true', TRUE: 'true', false: 'false', False: 'false', FALSE: 'false' };

function lex(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }
    const multi = MULTI.find(([s]) => src.startsWith(s, i));
    if (multi) { out.push({ k: multi[1], pos: i, s: multi[0] }); i += multi[0].length; continue; }
    if (SINGLE[ch]) { out.push({ k: SINGLE[ch], pos: i, s: ch }); i++; continue; }
    if (/[A-Za-z]/.test(ch)) {
      let j = i + 1;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      // "P1,2" is one symbol: a comma is part of the name only between two digits.
      if (/\d/.test(src[j - 1]) && src[j] === ',' && /\d/.test(src[j + 1] ?? '')) { j++; while (j < src.length && /\d/.test(src[j])) j++; }
      const s = src.slice(i, j);
      out.push(WORDS[s] ? { k: WORDS[s], pos: i, s } : { k: 'sym', pos: i, s });
      i = j; continue;
    }
    throw new LogicSyntaxError('char', i, ch);
  }
  return out;
}

/** @param {string} src @returns {any} AST */
export function parse(src) {
  const toks = lex(String(src));
  if (!toks.length) throw new LogicSyntaxError('empty', 0);
  let k = 0;
  const peek = () => toks[k];
  const take = () => toks[k++];
  function iff() { const a = imp(); if (peek()?.k === 'iff') { take(); return { t: 'iff', a, b: iff() }; } return a; }
  function imp() { const a = or(); if (peek()?.k === 'imp') { take(); return { t: 'imp', a, b: imp() }; } return a; }
  function or() { let a = and(); while (peek()?.k === 'or') { take(); a = { t: 'or', a, b: and() }; } return a; }
  function and() { let a = not(); while (peek()?.k === 'and') { take(); a = { t: 'and', a, b: not() }; } return a; }
  function not() { if (peek()?.k === 'not') { take(); return { t: 'not', a: not() }; } return atom(); }
  function atom() {
    const tok = take();
    if (!tok) throw new LogicSyntaxError('end', String(src).length);
    if (tok.k === 'sym') return { t: 'sym', n: tok.s };
    if (tok.k === 'true' || tok.k === 'false') return { t: 'const', v: tok.k === 'true' };
    if (tok.k === 'lp') {
      const inner = iff();
      if (peek()?.k !== 'rp') throw new LogicSyntaxError(peek() ? 'unexpected' : 'unclosed', peek()?.pos ?? String(src).length, peek()?.s ?? '');
      take();
      return inner;
    }
    throw new LogicSyntaxError('unexpected', tok.pos, tok.s);
  }
  const ast = iff();
  if (k < toks.length) throw new LogicSyntaxError('unexpected', toks[k].pos, toks[k].s);
  return ast;
}

/** Parse one sentence per non-empty line. Lines starting with # are comments. */
export function parseLines(text) {
  const sentences = [], errors = [];
  String(text).split('\n').forEach((raw, line) => {
    const src = raw.trim();
    if (!src || src.startsWith('#')) return;
    try { sentences.push({ src, ast: parse(src), line }); } catch (error) { errors.push({ line, src, error }); }
  });
  return { sentences, errors };
}

/* ───────────── printing ───────────── */

/** "P1,2" → "P₁,₂" — only the trailing index group becomes subscript. */
export function displayName(n) {
  const m = /^(.*?[A-Za-z_])(\d+(?:,\d+)?)$/.exec(n);
  return m ? m[1] + m[2].replace(/\d/g, (d) => SUB[Number(d)]) : n;
}

function needsParens(parent, child) {
  if (child.t === 'sym' || child.t === 'const' || child.t === 'not') return false;
  const p = PREC[parent.t], c = PREC[child.t];
  if (parent.t === 'not' || c < p) return true;
  // Same level: ∧/∨ chain freely; nested ⇒ or ⇔ always gets explicit parentheses.
  if (c === p) return parent.t === 'imp' || parent.t === 'iff';
  // Readability beyond strict precedence: B ⇔ (P ∨ Q), A ⇒ (B ∨ C), (A ∧ B) ∨ C.
  if (parent.t === 'iff') return true;
  if (parent.t === 'imp' && child.t === 'or') return true;
  if (parent.t === 'or' && child.t === 'and') return true;
  return false;
}

/** @returns {string} */
export function format(ast) {
  switch (ast.t) {
    case 'sym': return displayName(ast.n);
    case 'const': return ast.v ? 'True' : 'False';
    case 'not': return '¬' + (needsParens(ast, ast.a) ? `(${format(ast.a)})` : format(ast.a));
    default: {
      const l = needsParens(ast, ast.a) ? `(${format(ast.a)})` : format(ast.a);
      const r = needsParens(ast, ast.b) ? `(${format(ast.b)})` : format(ast.b);
      return `${l} ${OP[ast.t]} ${r}`;
    }
  }
}

export const formatLiteral = (l) => (l.neg ? '¬' : '') + displayName(l.s);
/** Empty clause prints as □ — the contradiction marker of resolution. */
export const formatClause = (c) => (c.length ? c.map(formatLiteral).join(' ∨ ') : '□');

/* ───────────── semantics ───────────── */

/** Symbols in order of first appearance. */
export function symbolsOf(asts) {
  const seen = [];
  const walk = (x) => { if (x.t === 'sym') { if (!seen.includes(x.n)) seen.push(x.n); } else if (x.t !== 'const') { walk(x.a); if (x.b) walk(x.b); } };
  asts.forEach(walk);
  return seen;
}

/** @param {any} ast @param {Record<string, boolean>} model */
export function evaluate(ast, model) {
  switch (ast.t) {
    case 'sym': if (!(ast.n in model)) throw new Error(`Unassigned symbol ${ast.n}`); return model[ast.n];
    case 'const': return ast.v;
    case 'not': return !evaluate(ast.a, model);
    case 'and': return evaluate(ast.a, model) && evaluate(ast.b, model);
    case 'or': return evaluate(ast.a, model) || evaluate(ast.b, model);
    case 'imp': return !evaluate(ast.a, model) || evaluate(ast.b, model);
    case 'iff': return evaluate(ast.a, model) === evaluate(ast.b, model);
    default: throw new Error(`Unknown node ${ast.t}`);
  }
}

const conj = (asts) => asts.reduce((acc, x) => (acc ? { t: 'and', a: acc, b: x } : x), null) ?? { t: 'const', v: true };

/**
 * TT-ENTAILS: enumerate every model; KB ⊨ α iff α holds in every model where KB holds.
 * Rows run in truth-table order (all false first). Also classifies α on its own.
 */
export function ttEntails(kb, alpha, { maxSymbols = 12 } = {}) {
  const symbols = symbolsOf([...kb, alpha]);
  if (symbols.length > maxSymbols) return { status: 'too-many', symbols, total: 2 ** symbols.length };
  const total = 2 ** symbols.length;
  const kbAst = conj(kb);
  const rows = [];
  let alphaTrue = 0, counter = 0;
  for (let i = 0; i < total; i++) {
    /** @type {Record<string, boolean>} */
    const model = {};
    symbols.forEach((s, k) => { model[s] = Boolean((i >> (symbols.length - 1 - k)) & 1); });
    const a = evaluate(alpha, model);
    if (a) alphaTrue++;
    if (evaluate(kbAst, model)) { rows.push({ model, alpha: a }); if (!a) counter++; }
  }
  const alphaClass = alphaTrue === total ? 'valid' : alphaTrue === 0 ? 'unsatisfiable' : 'satisfiable';
  return { status: 'done', entailed: counter === 0, symbols, total, rows, kbModels: rows.length, counterexamples: counter, alphaTrue, alphaClass };
}

/* ───────────── CNF ───────────── */

function elimIff(x) {
  if (x.t === 'sym' || x.t === 'const') return x;
  if (x.t === 'not') return { t: 'not', a: elimIff(x.a) };
  const a = elimIff(x.a), b = elimIff(x.b);
  return x.t === 'iff' ? { t: 'and', a: { t: 'imp', a, b }, b: { t: 'imp', a: b, b: a } } : { t: x.t, a, b };
}
function elimImp(x) {
  if (x.t === 'sym' || x.t === 'const') return x;
  if (x.t === 'not') return { t: 'not', a: elimImp(x.a) };
  const a = elimImp(x.a), b = elimImp(x.b);
  return x.t === 'imp' ? { t: 'or', a: { t: 'not', a }, b } : { t: x.t, a, b };
}
function pushNot(x) {
  if (x.t === 'sym' || x.t === 'const') return x;
  if (x.t !== 'not') return { t: x.t, a: pushNot(x.a), b: pushNot(x.b) };
  const y = x.a;
  if (y.t === 'sym') return x;
  if (y.t === 'const') return { t: 'const', v: !y.v };
  if (y.t === 'not') return pushNot(y.a);
  if (y.t === 'and') return { t: 'or', a: pushNot({ t: 'not', a: y.a }), b: pushNot({ t: 'not', a: y.b }) };
  if (y.t === 'or') return { t: 'and', a: pushNot({ t: 'not', a: y.a }), b: pushNot({ t: 'not', a: y.b }) };
  throw new Error('pushNot expects ⇒/⇔ to be eliminated');
}
function distribute(x) {
  if (x.t === 'sym' || x.t === 'const' || x.t === 'not') return x;
  const a = distribute(x.a), b = distribute(x.b);
  if (x.t === 'or') {
    if (a.t === 'and') return distribute({ t: 'and', a: { t: 'or', a: a.a, b }, b: { t: 'or', a: a.b, b } });
    if (b.t === 'and') return distribute({ t: 'and', a: { t: 'or', a, b: b.a }, b: { t: 'or', a, b: b.b } });
  }
  return { t: x.t, a, b };
}

/** The four textbook steps; each entry records whether that step changed the sentence. */
export function cnfSteps(ast) {
  const s1 = elimIff(ast), s2 = elimImp(s1), s3 = pushNot(s2), s4 = distribute(s3);
  const same = (p, q) => format(p) === format(q);
  return [
    { step: 'iff', ast: s1, changed: !same(ast, s1) },
    { step: 'imp', ast: s2, changed: !same(s1, s2) },
    { step: 'not', ast: s3, changed: !same(s2, s3) },
    { step: 'dist', ast: s4, changed: !same(s3, s4) },
  ];
}

const litKey = (l) => (l.neg ? '~' : '') + l.s;
export const clauseKey = (c) => c.map(litKey).sort().join('|');
const isTautology = (c) => c.some((l) => c.some((m) => m.s === l.s && m.neg !== l.neg));

/** Normalise one clause: factor duplicate literals; null when tautological (always true). */
function normalise(lits) {
  const out = [];
  for (const l of lits) if (!out.some((m) => m.s === l.s && m.neg === l.neg)) out.push(l);
  return isTautology(out) ? null : out;
}

/** CNF clauses of one sentence. True constants vanish; a false conjunct yields the empty clause. */
export function toClauses(ast) {
  const cnf = cnfSteps(ast)[3].ast;
  const conjuncts = [];
  const splitAnd = (x) => { if (x.t === 'and') { splitAnd(x.a); splitAnd(x.b); } else conjuncts.push(x); };
  splitAnd(cnf);
  const clauses = [];
  for (const c of conjuncts) {
    const lits = []; let satisfied = false;
    const splitOr = (x) => {
      if (x.t === 'or') { splitOr(x.a); splitOr(x.b); }
      else if (x.t === 'const') { if (x.v) satisfied = true; }
      else if (x.t === 'sym') lits.push({ s: x.n, neg: false });
      else lits.push({ s: x.a.n, neg: true });
    };
    splitOr(c);
    if (satisfied) continue;
    const n = normalise(lits);
    if (n && !clauses.some((k) => clauseKey(k) === clauseKey(n))) clauses.push(n);
  }
  return clauses;
}

/** CNF of KB ∧ ¬α with provenance, duplicates removed (first origin kept). */
export function refutationClauses(kb, alpha) {
  const out = [];
  const add = (ast, from) => toClauses(ast).forEach((clause) => { if (!out.some((e) => clauseKey(e.clause) === clauseKey(clause))) out.push({ clause, from }); });
  kb.forEach((ast, i) => add(ast, { kind: 'kb', index: i }));
  add({ t: 'not', a: alpha }, { kind: 'query' });
  return out;
}

/* ───────────── resolution ───────────── */

/** PL-RESOLVE: one resolvent per complementary pair; tautologies are discarded. */
export function resolve(ci, cj) {
  const out = [];
  for (const l of ci) for (const m of cj) {
    if (l.s !== m.s || l.neg === m.neg) continue;
    const r = normalise([...ci.filter((x) => x !== l), ...cj.filter((x) => x !== m)]);
    if (r && !out.some((x) => clauseKey(x.clause) === clauseKey(r))) out.push({ clause: r, pivot: l.s });
  }
  return out;
}

/**
 * PL-RESOLUTION on KB ∧ ¬α. Saturates level by level (each round pairs a new clause with
 * any clause), which reaches the same closure as the textbook loop without redoing old pairs.
 */
export function plResolution(kb, alpha, { limit = 500 } = {}) {
  const entries = refutationClauses(kb, alpha).map((e) => ({ ...e, parents: null, pivot: null }));
  const initial = entries.length;
  const keys = new Set(entries.map((e) => clauseKey(e.clause)));
  const finish = (status, emptyIndex = -1) => {
    let proof = [];
    if (emptyIndex >= 0) {
      const need = new Set();
      const mark = (i) => { if (need.has(i)) return; need.add(i); const p = entries[i].parents; if (p) { mark(p[0]); mark(p[1]); } };
      mark(emptyIndex);
      proof = [...need].sort((a, b) => a - b);
    }
    return { status, entailed: status === 'proved' ? true : status === 'saturated' ? false : null, initial, entries, proof, generated: entries.length - initial };
  };
  const emptyAtStart = entries.findIndex((e) => e.clause.length === 0);
  if (emptyAtStart >= 0) return finish('proved', emptyAtStart);
  let frontierStart = 0;
  while (true) {
    const end = entries.length, fresh = [];
    for (let j = frontierStart; j < end; j++) for (let i = 0; i < j; i++) {
      for (const r of resolve(entries[i].clause, entries[j].clause)) {
        const key = clauseKey(r.clause);
        if (keys.has(key)) continue;
        keys.add(key);
        entries.push({ clause: r.clause, from: { kind: 'derived' }, parents: [i, j], pivot: r.pivot });
        fresh.push(entries.length - 1);
        if (r.clause.length === 0) return finish('proved', entries.length - 1);
        if (entries.length > limit) return finish('limit');
      }
    }
    if (!fresh.length) return finish('saturated');
    frontierStart = end;
  }
}

/* ───────────── definite clauses: forward & backward chaining ───────────── */

/** Read a KB as definite clauses (exactly one positive literal each), or say which clause breaks it. */
export function definiteRules(kb) {
  const rules = [];
  for (let i = 0; i < kb.length; i++) {
    for (const clause of toClauses(kb[i])) {
      const pos = clause.filter((l) => !l.neg);
      if (pos.length !== 1) return { ok: false, sentence: i, clause, kind: pos.length === 0 ? 'goal' : 'non-horn' };
      rules.push({ premise: [...new Set(clause.filter((l) => l.neg).map((l) => l.s))], conclusion: pos[0].s, sentence: i });
    }
  }
  return { ok: true, rules };
}

export const formatRule = (r) => (r.premise.length ? `${r.premise.map(displayName).join(' ∧ ')} ⇒ ${displayName(r.conclusion)}` : displayName(r.conclusion));

/** PL-FC-ENTAILS? with a full trace of agenda pops and premise counters. */
export function plFcEntails(kb, query) {
  // The KB shape is the deeper restriction, so it is reported before the query shape.
  const def = definiteRules(kb);
  if (!def.ok) return { status: 'not-definite', ...def };
  if (query.t !== 'sym') return { status: 'bad-query' };
  const { rules } = def, q = query.n;
  const count = rules.map((r) => r.premise.length);
  /** @type {Record<string, boolean>} */
  const inferred = {};
  const agenda = rules.filter((r) => !r.premise.length).map((r) => r.conclusion);
  const trace = [];
  const snap = (kind, extra = {}) => trace.push({ kind, count: [...count], inferred: { ...inferred }, agenda: [...agenda], ...extra });
  snap('init');
  while (agenda.length) {
    const p = agenda.shift();
    if (p === q) { snap('found', { p }); return { status: 'done', entailed: true, rules, trace }; }
    if (inferred[p]) { snap('skip', { p }); continue; }
    inferred[p] = true;
    snap('pop', { p });
    rules.forEach((r, c) => {
      if (!r.premise.includes(p)) return;
      count[c]--;
      if (count[c] === 0) { agenda.push(r.conclusion); snap('fire', { p, rule: c }); }
      else snap('decrement', { p, rule: c });
    });
  }
  snap('exhausted');
  return { status: 'done', entailed: false, rules, trace };
}

/**
 * Backward chaining with loop check (goal already on the stack) and memo of proved goals.
 * A failure is memoised only when it did not depend on a loop cut, which keeps it complete.
 */
export function plBcEntails(kb, query) {
  const def = definiteRules(kb);
  if (!def.ok) return { status: 'not-definite', ...def };
  if (query.t !== 'sym') return { status: 'bad-query' };
  const { rules } = def;
  const facts = new Set(rules.filter((r) => !r.premise.length).map((r) => r.conclusion));
  const proved = new Set(), failed = new Set(), trace = [];
  const snap = (kind, goal, stack, extra = {}) => trace.push({ kind, goal, stack: [...stack], proved: [...proved], failed: [...failed], ...extra });
  function prove(goal, stack) {
    snap('goal', goal, stack);
    if (proved.has(goal)) { snap('memo-true', goal, stack); return { ok: true, loop: false }; }
    if (failed.has(goal)) { snap('memo-fail', goal, stack); return { ok: false, loop: false }; }
    if (stack.includes(goal)) { snap('loop', goal, stack); return { ok: false, loop: true }; }
    if (facts.has(goal)) { proved.add(goal); snap('fact', goal, stack); return { ok: true, loop: false }; }
    let loopSeen = false;
    for (let c = 0; c < rules.length; c++) {
      const r = rules[c];
      if (r.conclusion !== goal || !r.premise.length) continue;
      snap('try', goal, stack, { rule: c });
      let all = true;
      for (const p of r.premise) {
        const res = prove(p, [...stack, goal]);
        if (res.loop) loopSeen = true;
        if (!res.ok) { all = false; break; }
      }
      if (all) { proved.add(goal); snap('proved', goal, stack, { rule: c }); return { ok: true, loop: false }; }
      snap('rule-fail', goal, stack, { rule: c });
    }
    if (!loopSeen) failed.add(goal);
    snap('fail', goal, stack);
    return { ok: false, loop: loopSeen };
  }
  const res = prove(query.n, []);
  return { status: 'done', entailed: res.ok, rules, trace };
}

/* ───────────── DPLL ───────────── */

const litValue = (l, model) => (l.s in model ? model[l.s] !== l.neg : undefined);
function clauseValue(c, model) {
  let open = false;
  for (const l of c) { const v = litValue(l, model); if (v === true) return true; if (v === undefined) open = true; }
  return open ? undefined : false;
}

/** DPLL(clauses, symbols, model) in the lecture's order: early termination → pure symbol → unit clause → split. */
export function dpll(clauses, symbols, { maxEvents = 400 } = {}) {
  const trace = [];
  let truncated = false;
  const snap = (kind, model, extra = {}) => { if (trace.length < maxEvents) trace.push({ kind, model: { ...model }, ...extra }); else truncated = true; };
  function rec(syms, model, depth) {
    const values = clauses.map((c) => clauseValue(c, model));
    if (values.every((v) => v === true)) { snap('sat', model, { depth }); return model; }
    const bad = values.indexOf(false);
    if (bad >= 0) { snap('conflict', model, { depth, clause: bad }); return null; }
    const open = clauses.filter((_, i) => values[i] !== true);
    for (const s of syms) {
      const signs = new Set();
      for (const c of open) for (const l of c) if (l.s === s) signs.add(l.neg);
      if (signs.size === 1) {
        const value = !signs.has(true);
        snap('pure', model, { depth, symbol: s, value });
        return rec(syms.filter((x) => x !== s), { ...model, [s]: value }, depth);
      }
    }
    for (let i = 0; i < clauses.length; i++) {
      if (values[i] !== undefined) continue;
      const free = clauses[i].filter((l) => litValue(l, model) === undefined);
      if (free.length === 1) {
        const l = free[0];
        snap('unit', model, { depth, symbol: l.s, value: !l.neg, clause: i });
        return rec(syms.filter((x) => x !== l.s), { ...model, [l.s]: !l.neg }, depth);
      }
    }
    const [p, ...rest] = syms;
    snap('split', model, { depth, symbol: p, value: true });
    const yes = rec(rest, { ...model, [p]: true }, depth + 1);
    if (yes) return yes;
    snap('split', model, { depth, symbol: p, value: false });
    return rec(rest, { ...model, [p]: false }, depth + 1);
  }
  const model = rec(symbols, {}, 0);
  return { satisfiable: Boolean(model), model, trace, truncated };
}

/** KB ⊨ α iff KB ∧ ¬α is unsatisfiable. */
export function dpllEntails(kb, alpha) {
  const entries = refutationClauses(kb, alpha);
  const clauses = entries.map((e) => e.clause);
  const symbols = symbolsOf([...kb, alpha]);
  const res = dpll(clauses, symbols);
  return { status: 'done', entailed: !res.satisfiable, clauses: entries, symbols, ...res };
}

/* ───────────── WalkSAT ───────────── */

function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** WALKSAT(clauses, p, max_flips): returns a model or failure — failure proves nothing. */
export function walkSat(clauses, symbols, { p = 0.5, maxFlips = 100, seed = 7 } = {}) {
  const rand = rng(seed);
  /** @type {Record<string, boolean>} */
  const model = {};
  symbols.forEach((s) => { model[s] = rand() < 0.5; });
  const unsatisfied = (m) => clauses.filter((c) => clauseValue(c, m) !== true);
  const trace = [{ kind: 'start', model: { ...model }, unsat: unsatisfied(model).length }];
  for (let i = 0; i < maxFlips; i++) {
    const bad = unsatisfied(model);
    if (!bad.length) return { status: 'model', model, trace, flips: i };
    const flippable = bad.filter((c) => c.length);
    if (!flippable.length) break;
    const clause = flippable[Math.floor(rand() * flippable.length)];
    let symbol, mode;
    if (rand() < p) { symbol = clause[Math.floor(rand() * clause.length)].s; mode = 'random'; }
    else {
      mode = 'greedy';
      let best = -1;
      for (const l of clause) {
        const trial = { ...model, [l.s]: !model[l.s] };
        const sat = clauses.length - unsatisfied(trial).length;
        if (sat > best) { best = sat; symbol = l.s; }
      }
    }
    model[symbol] = !model[symbol];
    trace.push({ kind: 'flip', symbol, mode, clause: clauses.indexOf(clause), model: { ...model }, unsat: unsatisfied(model).length });
  }
  return unsatisfied(model).length ? { status: 'failure', model, trace, flips: maxFlips } : { status: 'model', model, trace, flips: maxFlips };
}

export function walkSatEntails(kb, alpha, options) {
  const entries = refutationClauses(kb, alpha);
  const symbols = symbolsOf([...kb, alpha]);
  const res = walkSat(entries.map((e) => e.clause), symbols, options);
  // A model of KB ∧ ¬α is a counterexample; failure is "no verdict", never "entailed".
  return { status: 'done', entailed: res.status === 'model' ? false : null, clauses: entries, symbols, ...res };
}

/* ───────────── shared examples ───────────── */

/** Language-neutral sources; names and explanations live in the text bundles. */
export const PRESETS = {
  wumpus: { kb: ['¬P1,1', 'B1,1 ⇔ (P1,2 ∨ P2,1)', 'B2,1 ⇔ (P1,1 ∨ P2,2 ∨ P3,1)', '¬B1,1', 'B2,1'], query: '¬P1,2' },
  fire: { kb: ['H ∧ S ⇒ F', 'A ⇒ S', 'F ⇒ R', 'A', 'H'], query: 'R' },
  umbrella: { kb: ['R ⇒ U', 'U ⇒ ¬W', '¬R ⇒ ¬W'], query: '¬W' },
  chain: { kb: ['P ⇒ Q', 'L ∧ M ⇒ P', 'B ∧ L ⇒ M', 'A ∧ P ⇒ L', 'A ∧ B ⇒ L', 'A', 'B'], query: 'Q' },
  dpll: { kb: ['A ⇒ B ∨ C', 'A ⇒ D', 'C ∧ D ⇒ ¬F', 'B ⇒ F', 'A'], query: 'B ⇒ ¬C' },
};

/** The refutation printed in the lecture for the umbrella example, reused by the explanatory loop. */
export const UMBRELLA_PROOF = [
  { clause: '¬R ∨ U', from: 'kb' }, { clause: '¬U ∨ ¬W', from: 'kb' }, { clause: 'R ∨ ¬W', from: 'kb' },
  { clause: 'W', from: 'query' },
  { clause: '¬R ∨ ¬W', from: [0, 1] }, { clause: '¬W', from: [2, 4] }, { clause: '□', from: [3, 5] },
];

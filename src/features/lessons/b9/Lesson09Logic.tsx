import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CheckList } from '@/components/CheckList';
import { Html } from '@/components/Html';
import { LessonNav } from '@/components/LessonNav';
import { MathPrimer } from '@/components/MathPrimer';
import { DeckToggle, LessonDeck, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { SessionQuiz } from '@/components/SessionQuiz';
import { MATH_PRIMERS } from '@/content/courses/csc14003/math-primers.locale';
import { getCourse } from '@/content/courses';
import { PRESETS, cnfSteps, evaluate, format, parse, ttEntails, displayName } from './logic-engine.js';
import { ChainLoop, ChainTrace, ModelsLoop, ResolutionLoop, WumpusLoop } from './LogicVisuals';
import { LogicLab } from './LogicLab';
import { Code, P, Recall, Table, tf, value } from './logic-view';
import { DPLL_CODE, FC_CODE, KB_AGENT_CODE, TT_ENTAILS_CODE } from './lesson09.code';
import { T } from './lesson09.text';
import './lesson09.css';

const NAV = [
  { href: '#toan', label: T.nav.math }, { href: '#kb', label: T.nav.kb }, { href: '#wumpus', label: T.nav.wumpus },
  { href: '#entail', label: T.nav.entail }, { href: '#syntax', label: T.nav.syntax }, { href: '#modelcheck', label: T.nav.modelcheck },
  { href: '#rules', label: T.nav.rules }, { href: '#resolution', label: T.nav.resolution }, { href: '#chaining', label: T.nav.chaining },
  { href: '#dpll', label: T.nav.dpll }, { href: '#lab', label: T.nav.lab, hot: true }, { href: '#summary', label: T.nav.summary },
  { href: '#quiz', label: T.nav.quiz, hot: true }, { href: '#practice', label: T.nav.practice },
];
const SLIDES = [{ id: 'hero', label: T.hero.badge }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];
const LINKS = getCourse('csc14003')?.sessions.find((s) => s.id === 'b9')?.links ?? [];

/* Language-neutral formulas; every word around them lives in the text bundles. */
const WUMPUS_KB = PRESETS.wumpus.kb.map(parse);
const WUMPUS_TT = ttEntails(WUMPUS_KB, parse(PRESETS.wumpus.query));
// Alphabetical order gives the textbook column order: B₁,₁ B₂,₁ P₁,₁ P₁,₂ P₂,₁ P₂,₂ P₃,₁.
const WUMPUS_SYMBOLS: string[] = [...WUMPUS_TT.symbols].sort();
const WUMPUS_ROWS: { model: Record<string, boolean>; alpha: boolean }[] = WUMPUS_TT.rows ?? [];
const R2_STEPS = cnfSteps(parse(PRESETS.wumpus.kb[1]));
const CONNECTIVES = ['¬P', 'P ∧ Q', 'P ∨ Q', 'P ⇒ Q', 'P ⇔ Q'].map((s) => ({ s, ast: parse(s) }));
const EQUIV = ['(α ∧ β) ≡ (β ∧ α)', '(α ∨ β) ≡ (β ∨ α)', '((α ∧ β) ∧ γ) ≡ (α ∧ (β ∧ γ))', '((α ∨ β) ∨ γ) ≡ (α ∨ (β ∨ γ))', '¬(¬α) ≡ α', '(α ⇒ β) ≡ (¬β ⇒ ¬α)', '(α ⇒ β) ≡ (¬α ∨ β)', '(α ⇔ β) ≡ ((α ⇒ β) ∧ (β ⇒ α))', '¬(α ∧ β) ≡ (¬α ∨ ¬β)', '¬(α ∨ β) ≡ (¬α ∧ ¬β)', '(α ∧ (β ∨ γ)) ≡ ((α ∧ β) ∨ (α ∧ γ))', '(α ∨ (β ∧ γ)) ≡ ((α ∨ β) ∧ (α ∨ γ))'];
const QUIZ2 = ['A ∨ B ⇒ A ∧ C', 'A ∧ B ⇒ A ∨ C', '(A ∨ B) ∧ (¬B ∨ C) ⇒ A ∨ C', '(A ∨ ¬B) ⇒ A ∧ B'].map((s) => format(parse(s)));
const QUIZ3 = ['(A ∧ B) ⇒ (C ⇒ D)', 'P ∨ Q ⇔ R ∧ ¬Q ⇒ P'];
const RULES = [{ top: ['α ⇒ β', 'α'], bottom: 'β' }, { top: ['α ⇒ β', '¬β'], bottom: '¬α' }, { top: ['α', 'β'], bottom: 'α ∧ β' }, { top: ['α ∧ β'], bottom: 'α' }];
const PROOF1 = ['P ∧ Q', 'P ⇒ R', 'Q ∧ R ⇒ S', 'P', 'R', 'Q', 'Q ∧ R', 'S'];
const PROOF2 = ['(B₁,₁ ⇒ (P₁,₂ ∨ P₂,₁)) ∧ ((P₁,₂ ∨ P₂,₁) ⇒ B₁,₁)', '(P₁,₂ ∨ P₂,₁) ⇒ B₁,₁', '¬B₁,₁ ⇒ ¬(P₁,₂ ∨ P₂,₁)', '¬(P₁,₂ ∨ P₂,₁)', '¬P₁,₂ ∧ ¬P₂,₁'];
const GRAMMAR_PL = `Sentence        → AtomicSentence | ComplexSentence
AtomicSentence  → True | False | P | Q | R | …
ComplexSentence → ( Sentence ) | [ Sentence ]
                | ¬ Sentence
                | Sentence ∧ Sentence
                | Sentence ∨ Sentence
                | Sentence ⇒ Sentence
                | Sentence ⇔ Sentence`;
const GRAMMAR_CNF = `CNFSentence        → Clause₁ ∧ … ∧ Clauseₙ
Clause             → Literal₁ ∨ … ∨ Literalₘ
Literal            → Symbol | ¬Symbol
Symbol             → P | Q | R | …
HornClauseForm     → DefiniteClauseForm | GoalClauseForm
DefiniteClauseForm → (Symbol₁ ∧ … ∧ Symbolₗ) ⇒ Symbol
GoalClauseForm     → (Symbol₁ ∧ … ∧ Symbolₗ) ⇒ False`;
const DP_ROWS = [
  ['Prime', '30.00', '0.00', '0.00'], ['Prime4', '0.02', '0.06', '0.04'], ['Prime9', '18.94', '2.98', '0.51'], ['Prime10', '11.40', '3.03', '0.96'],
  ['Prime11', '28.11', '2.98', '0.51'], ['Prime16', '> 1 hour', '*', '9.15'], ['Prime17', '> 1 hour', '*', '3.87'], ['Mkadder32', '>> 1 hour', '6.50', '7.34'],
  ['Mkadder42', '>> 1 hour', '22.95', '46.86'], ['Mkadder52', '>> 1 hour', '44.83', '170.98'], ['Mkadder53', '>> 1 hour', '38.27', '250.16'],
  ['Mkadder63', '>> 1 hour', '*', '1186.4'], ['Mkadder73', '>> 1 hour', '*', '3759.9'],
];

function Chapter({ id, no, text, children }: { id: string; no: string; text: { title: string; en: string; lead: string }; children: ReactNode }) {
  return <section id={id} className={`lesson-section ${id === 'practice' ? 'lesson-section--last' : ''}`}>
    <SectionHead no={no} title={text.title} en={text.en} lead={text.lead} />
    <div className="ls-chapter-body lg-body">{children}</div>
  </section>;
}
const Cards = ({ items }: { items: { title: string; body: string }[] }) => <div className="lg-cards">{items.map((c) => <div className="card" key={c.title}><h3>{c.title}</h3><P text={c.body} /></div>)}</div>;
const Paras = ({ items }: { items: string[] }) => <>{items.map((p) => <P key={p} text={p} />)}</>;
const Formula = ({ children }: { children: ReactNode }) => <div className="lg-formula mono">{children}</div>;

function TruthTable() {
  const rows = [[false, false], [false, true], [true, false], [true, true]].map(([p, q]) => [value(p), value(q), ...CONNECTIVES.map((c) => value(evaluate(c.ast, { P: p, Q: q })))]);
  return <Table headers={['P', 'Q', ...CONNECTIVES.map((c) => c.s)]} rows={rows} />;
}

export default function Lesson09Logic() {
  const [deck, setDeck] = useDeckMode();
  return <div className="ls-lesson lg-lesson">
    <LessonNav badge={T.hero.badge} title={T.hero.title} backTo="/courses/csc14003" items={NAV} right={<DeckToggle on={deck} onChange={setDeck} />} />
    <LessonDeck on={deck} slides={SLIDES}>
      <div className="lesson-hero ls-hero"><div className="lg-hero">
        <div className="mono ls-eyebrow">{T.hero.eyebrow}</div>
        <h1>{T.hero.title}<br /><em>{T.hero.accent}</em></h1>
        <p className="ls-hero-lead">{T.hero.lead}</p>
        <div className="ls-choices">{[T.hero.time, T.hero.families, T.hero.quiz].map((t) => <span className="chip" key={t}>{t}</span>)}</div>
        <div className="ls-choices"><a className="btn btn--primary" href="#kb">{T.hero.cta}</a><Link to="/courses/csc14003">{T.hero.back}</Link></div>
        <div className="card lg-goals"><h3>{T.goals.title}</h3><ul>{T.goals.items.map((g) => <li key={g}>{g}</li>)}</ul><p className="ls-note">{T.goals.path}</p></div>
      </div></div>

      <div id="toan" className="lesson-section lesson-section--first"><MathPrimer {...MATH_PRIMERS.b9} /></div>

      <Chapter id="kb" no="01" text={T.kb}>
        <Paras items={T.kb.paras} />
        <Cards items={T.kb.cards} />
        <div className="card"><h3>{T.kb.exampleTitle}</h3><P text={T.kb.example} /></div>
        <P text={T.kb.decomp} />
        <h3>{T.kb.codeTitle}</h3><P text={T.kb.codeLead} /><Code src={KB_AGENT_CODE} label={T.kb.codeTitle} />
        <h3>{T.kb.approachesTitle}</h3><Table headers={T.kb.headers} rows={T.kb.rows} />
        <div className="ls-callout"><P text={T.kb.bridge} /></div>
      </Chapter>

      <Chapter id="wumpus" no="02" text={T.wumpus}>
        <Paras items={T.wumpus.paras} />
        <Cards items={T.wumpus.peas} />
        <h3>{T.wumpus.envTitle}</h3><Table headers={T.wumpus.headers} rows={T.wumpus.rows} />
        <h3>{T.wumpus.exploreTitle}</h3>
        <WumpusLoop />
        <ol className="lg-steps">{T.wumpus.steps.map((s) => <Html as="li" key={s} t={s} />)}</ol>
        <div className="ls-callout"><P text={T.wumpus.after} /></div>
      </Chapter>

      <Chapter id="entail" no="03" text={T.entail}>
        <Paras items={T.entail.paras} />
        <h3>{T.entail.modelsTitle}</h3><P text={T.entail.modelsIntro} />
        <ModelsLoop />
        <P text={T.entail.modelsResult} />
        <Recall question={T.entail.check} />
        <h3>{T.entail.soundTitle}</h3><P text={T.entail.sound} />
        <Cards items={T.entail.cards} />
        <P text={T.entail.socrates} />
        <div className="ls-callout"><P text={T.entail.noAccess} /></div>
      </Chapter>

      <Chapter id="syntax" no="04" text={T.syntax}>
        <Paras items={T.syntax.paras} />
        <Table headers={T.syntax.headers} rows={T.syntax.rows} />
        <h3>{T.syntax.grammarTitle}</h3><pre className="codeblock lg-grammar" tabIndex={0}><code>{GRAMMAR_PL}</code></pre>
        <P text={T.syntax.precedence} />
        <P text={T.syntax.semantics} />
        <TruthTable />
        <P text={T.syntax.evalExample} />
        <Recall question={T.syntax.check} />
        <h3>{T.syntax.kbTitle}</h3><P text={T.syntax.kbIntro} />
        <Table headers={['', '', '']} label={T.syntax.kbTitle} rows={WUMPUS_KB.map((s: unknown, i: number) => [`R${i + 1}`, `<span class='mono'>${format(s)}</span>`, T.syntax.kbNotes[i]])} />
        <div className="ls-callout"><P text={T.syntax.kbNote} /></div>
      </Chapter>

      <Chapter id="modelcheck" no="05" text={T.modelcheck}>
        <h3>{T.modelcheck.approachesTitle}</h3><Cards items={T.modelcheck.approaches} />
        <Paras items={T.modelcheck.paras} />
        <h3>{T.modelcheck.ttTitle}</h3>
        <Table headers={[...WUMPUS_SYMBOLS.map(displayName), 'KB', format(parse(PRESETS.wumpus.query))]} rows={WUMPUS_ROWS.map((r) => [...WUMPUS_SYMBOLS.map((s) => tf(r.model[s])), 'T', tf(r.alpha)])} />
        <p className="ls-note">{T.common.tf} · {T.modelcheck.ttNote}</p>
        <h3>{T.modelcheck.codeTitle}</h3><P text={T.modelcheck.codeLead} /><Code src={TT_ENTAILS_CODE} label={T.modelcheck.codeTitle} />
        <div className="ls-callout"><P text={T.modelcheck.complexity} /></div>
        <div className="card"><h3>{T.modelcheck.quiz01Title}</h3><P text={T.modelcheck.quiz01} /><details><summary>{T.common.answer}</summary><P text={T.modelcheck.quiz01Answer} /></details></div>
        <h3>{T.modelcheck.equivTitle}</h3><P text={T.modelcheck.equiv} />
        <Table headers={['', '']} label={T.modelcheck.equivTitle} rows={EQUIV.map((e, i) => [`<span class='mono'>${e}</span>`, T.modelcheck.equivNames[i]])} />
        <Cards items={T.modelcheck.cards} />
        <div className="ls-callout"><P text={T.modelcheck.trap} /></div>
        <h3>{T.modelcheck.quizTitle}</h3><P text={T.modelcheck.quizIntro} />
        <ol className="lg-steps mono">{QUIZ2.map((q) => <li key={q}>{q}</li>)}</ol>
        <details className="card lg-details"><summary>{T.common.answer}</summary>
          <Table headers={T.modelcheck.quizHeaders} rows={QUIZ2.map((q, i) => [`<span class='mono'>${q}</span>`, ...T.modelcheck.quizRows[i]])} /></details>
        <P text={T.modelcheck.labHint} />
      </Chapter>

      <Chapter id="rules" no="06" text={T.rules}>
        <Paras items={T.rules.paras} />
        <div className="lg-rules-grid">{RULES.map((r, i) => <figure key={i} className="card lg-rule-card">
          <div className="mono">{r.top.map((t) => <div key={t}>{t}</div>)}<div className="lg-rule-line">∴ {r.bottom}</div></div>
          <figcaption>{T.rules.ruleNames[i]}</figcaption></figure>)}</div>
        <h3>{T.rules.proof1Title}</h3>
        <Table headers={T.rules.headers} rows={PROOF1.map((s, i) => [String(i + 1), `<span class='mono'>${s}</span>`, T.rules.proof1[i]])} />
        <h3>{T.rules.proof2Title}</h3>
        <Table headers={T.rules.headers} rows={PROOF2.map((s, i) => [`R${i + 6}`, `<span class='mono'>${s}</span>`, T.rules.proof2[i]])} />
        <P text={T.rules.proof2Note} />
        <h3>{T.rules.searchTitle}</h3><Cards items={T.rules.search} /><P text={T.rules.searchNote} />
        <div className="ls-callout"><P text={T.rules.monotonic} /></div>
        <P text={T.rules.incomplete} />
      </Chapter>

      <Chapter id="resolution" no="07" text={T.resolution}>
        <Paras items={T.resolution.paras} />
        <Formula>{'l₁ ∨ … ∨ lₖ,   m₁ ∨ … ∨ mₙ   ⟹   l₁ ∨ … ∨ lᵢ₋₁ ∨ lᵢ₊₁ ∨ … ∨ lₖ ∨ m₁ ∨ … ∨ mⱼ₋₁ ∨ mⱼ₊₁ ∨ … ∨ mₙ'}</Formula>
        <P text={T.resolution.wumpus} />
        <h3>{T.resolution.cnfTitle}</h3><P text={T.resolution.cnf} />
        <ol className="lg-steps">{T.resolution.cnfSteps.map((s) => <li key={s}>{s}</li>)}</ol>
        <div className="card lg-cnf"><p className="ls-note">{T.resolution.cnfDemo}</p>
          <p className="mono lg-cnf-source">R2: {format(parse(PRESETS.wumpus.kb[1]))}</p>
          <ol>{R2_STEPS.map((s: { step: string; ast: unknown; changed: boolean }, i: number) => <li key={s.step} className={s.changed ? '' : 'lg-muted'}><span className="mono">{format(s.ast)}</span>{!s.changed && <small> · {T.resolution.unchanged}</small>}<small className="lg-step-name"> ({i + 1})</small></li>)}</ol></div>
        <h3>{T.resolution.quizTitle}</h3>
        <div className="lg-cards">{QUIZ3.map((q, i) => <div className="card" key={q}><h3 className="mono">{i + 1}. {q}</h3><details><summary>{T.common.hint}</summary><P text={T.resolution.quiz[i].hint} /></details></div>)}</div>
        <h3>{T.resolution.algoTitle}</h3><P text={T.resolution.algo} />
        <div className="ls-callout"><P text={T.resolution.algoNote} /></div>
        <h3>{T.resolution.umbrellaTitle}</h3><P text={T.resolution.umbrella} />
        <ResolutionLoop />
        <P text={T.resolution.umbrellaAfter} />
      </Chapter>

      <Chapter id="chaining" no="08" text={T.chaining}>
        <Cards items={T.chaining.cards} />
        <P text={T.chaining.rule} />
        <h3>{T.chaining.grammarTitle}</h3><pre className="codeblock lg-grammar" tabIndex={0}><code>{GRAMMAR_CNF}</code></pre>
        <P text={T.chaining.hornVsCnf} />
        <h3>{T.chaining.fcTitle}</h3><P text={T.chaining.fc} />
        <P text={T.chaining.graph} />
        <ChainLoop />
        <P text={T.chaining.fcOrder} />
        <h3>{T.chaining.bcTitle}</h3><P text={T.chaining.bc} />
        <div className="ls-callout"><P text={T.chaining.bcNote} /></div>
        <P text={T.chaining.bcOrder} />
        <details className="card lg-details"><summary>{T.chaining.traceTitle}</summary><ChainTrace /></details>
        <h3>{T.chaining.codeTitle}</h3><P text={T.chaining.codeLead} /><Code src={FC_CODE} label={T.chaining.codeTitle} />
        <h3>{T.chaining.compareTitle}</h3><Table headers={T.chaining.compareHeaders} rows={T.chaining.compareRows} />
        <div className="card"><h3>{T.chaining.anotherTitle}</h3><P text={T.chaining.another} /><details><summary>{T.common.answer}</summary><P text={T.chaining.anotherAnswer} /></details></div>
        <div className="card"><h3>{T.chaining.quizTitle}</h3><P text={T.chaining.quiz} /><details><summary>{T.common.answer}</summary><P text={T.chaining.quizAnswer} /></details></div>
      </Chapter>

      <Chapter id="dpll" no="09" text={T.dpll}>
        <Paras items={T.dpll.paras} />
        <Cards items={T.dpll.cards} />
        <h3>{T.dpll.codeTitle}</h3><P text={T.dpll.codeLead} /><Code src={DPLL_CODE} label={T.dpll.codeTitle} />
        <h3>{T.dpll.dpTitle}</h3><P text={T.dpll.dp} />
        <Table headers={T.dpll.dpHeaders} rows={DP_ROWS} />
        <div className="ls-callout"><P text={T.dpll.dpNote} /></div>
        <div className="card"><h3>{T.dpll.quiz06Title}</h3><P text={T.dpll.quiz06} /><details><summary>{T.common.answer}</summary><P text={T.dpll.quiz06Answer} /></details></div>
        <h3>{T.dpll.walkTitle}</h3><P text={T.dpll.walk} />
        <Recall question={T.dpll.check} />
        <h3>{T.dpll.scaleTitle}</h3><P text={T.dpll.scale} />
        <div className="ls-callout"><P text={T.dpll.scalePunch} /></div>
        <h3>{T.dpll.limitsTitle}</h3><P text={T.dpll.limits} />
        <Formula>{T.dpll.limitsFormula}</Formula>
        <P text={T.dpll.bridge} />
      </Chapter>

      <Chapter id="lab" no="10" text={T.lab}>
        <P text={T.lab.intro} />
        <LogicLab />
        <details className="card lg-details"><summary>{T.common.hint}</summary><P text={T.lab.answer} /></details>
      </Chapter>

      <Chapter id="summary" no="11" text={T.summary}>
        <Table headers={T.summary.headers} rows={T.summary.rows} wide />
        <div className="ls-callout"><P text={T.summary.recall} /></div>
      </Chapter>

      <Chapter id="quiz" no="12" text={T.quiz}><SessionQuiz sessionId="b9" /></Chapter>

      <Chapter id="practice" no="13" text={T.hw}>
        <div className="lg-cards">{T.hw.cards.map((card) => <div className="card" key={card.title}><h3>{card.title}</h3><P text={card.body} /><details><summary>{T.common.hint}</summary><P text={card.hint} /></details></div>)}</div>
        <div className="ls-choices">
          {LINKS[0] && <a href={LINKS[0].href} target="_blank" rel="noreferrer" className="btn">{T.hw.file}</a>}
          {LINKS[1] && <a href={LINKS[1].href} target="_blank" rel="noreferrer" className="btn">{T.hw.lab2}</a>}
        </div>
        <p className="ls-note">{T.hw.lab2Note}</p>
        <CheckList storageKey="csc14003-b9-checks" items={T.hw.checks} />
        <P text={T.hw.next} />
        <Link to="/courses/csc14003">{T.hw.roadmap}</Link>
      </Chapter>
    </LessonDeck>
  </div>;
}

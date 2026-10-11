import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CheckList } from '@/components/CheckList';
import { LessonNav } from '@/components/LessonNav';
import { DeckToggle, LessonDeck, useDeckMode } from '@/components/LessonDeck';
import { SessionQuiz } from '@/components/SessionQuiz';
import { T } from './lesson03.text';
import './lesson03.css';

const IDS = ['ch1', 'ch2', 'abstraction', 'nodes', 'ch3', 'tree', 'queens', 'quiz', 'hw'];
const NAV = IDS.map((id, i) => ({ href: `#${id}`, label: T.nav[i] }));
// Each deck item has one direct child. Keep original ch1/ch2/ch3/quiz/hw anchors working.
const SLIDES = [{ id: 'hero', label: T.hero.cover }, ...NAV.flatMap((item) => [
  { id: item.href.slice(1), label: item.label },
  ...(item.href === '#queens' ? [{ id: 'queens-move', label: T.queens.complete }] : []),
])];
const POINTS = { A: [60, 140], B: [220, 55], C: [220, 225], D: [380, 140] } as const;
type Place = keyof typeof POINTS;
const EDGES: [Place, Place, number, number, number][] = [
  ['A', 'B', 2, 125, 79], ['A', 'C', 5, 125, 205], ['B', 'C', 1, 240, 140],
  ['B', 'D', 6, 315, 79], ['C', 'D', 2, 315, 205],
];
const TRACE: { active?: Place; frontier: string[]; explored: Place[] }[] = [
  { frontier: ['A · 0'], explored: [] },
  { active: 'A', frontier: ['B · 2', 'C · 5'], explored: ['A'] },
  { active: 'B', frontier: ['C · 3', 'D · 8'], explored: ['A', 'B'] },
  { active: 'C', frontier: ['D · 5'], explored: ['A', 'B', 'C'] },
  { active: 'D', frontier: [], explored: ['A', 'B', 'C'] },
];
const QUEENS = [2, 4, 1, 3];

function Head({ no, title, outcome }: { no: string; title: string; outcome: string }) {
  return <header className="b3-heading">
    <span className="b3-eyebrow">{no}</span>
    <h2>{title}</h2>
    <p className="b3-outcome"><strong>{T.common.outcome}:</strong> {outcome}</p>
  </header>;
}

function Checkpoint({ question, answer }: { question: string; answer: string }) {
  return <aside className="b3-checkpoint">
    <h3>{T.common.try}</h3>
    <p>{question}</p>
    <details><summary>{T.common.answer}</summary><p>{answer}</p></details>
  </aside>;
}

function RoadMap({ active }: { active?: Place }) {
  return <figure className="b3-map">
    <svg viewBox="0 0 440 290" role="img" aria-label={T.common.mapAlt}>
      {EDGES.map(([a, b, cost, x, y]) => <g key={`${a}-${b}`}>
        <line x1={POINTS[a][0]} y1={POINTS[a][1]} x2={POINTS[b][0]} y2={POINTS[b][1]} className="b3-edge" />
        <rect x={x - 14} y={y - 15} width={28} height={30} rx={8} className="b3-edge-label" />
        <text x={x} y={y + 6} textAnchor="middle" className="b3-weight">{cost}</text>
      </g>)}
      {(Object.entries(POINTS) as [Place, readonly [number, number]][]).map(([name, [x, y]]) => <g key={name}>
        <circle cx={x} cy={y} r={24} className={`b3-point${active === name ? ' is-active' : ''}`} />
        <text x={x} y={y + 7} textAnchor="middle" className="b3-place">{name}</text>
        {name === 'A' || name === 'D' ? <text x={x} y={y + 46} textAnchor="middle" className="b3-map-hint">{name === 'A' ? T.common.startLabel : T.common.goalLabel}</text> : null}
      </g>)}
    </svg>
    <figcaption>{T.common.mapLabel}</figcaption>
  </figure>;
}

function SearchTree() {
  const nodes: [string, number, number, number | null][] = [
    ['A', 300, 25, null], ['B', 170, 95, 0], ['C', 440, 95, 0],
    ['A', 70, 175, 1], ['C', 170, 175, 1], ['D', 270, 175, 1], ['B', 70, 245, 3],
  ];
  return <figure className="b3-tree">
    <svg viewBox="0 0 560 310" role="img" aria-label={T.tree.treeAlt}>
      {nodes.map(([name, x, y, parent], i) => <g key={i}>
        {parent !== null && <line x1={nodes[parent][1]} y1={nodes[parent][2] + 20} x2={x} y2={y - 20} className="b3-edge" />}
        <circle cx={x} cy={y} r={20} className={`b3-point${name === 'A' ? ' is-active' : ''}`} />
        <text x={x} y={y + 6} textAnchor="middle" className="b3-place">{name}</text>
      </g>)}
      <line x1="70" y1="265" x2="70" y2="277" className="b3-edge" strokeDasharray="3 3" />
      <text x="70" y="296" textAnchor="middle" className="b3-weight">A …</text>
    </svg>
    <figcaption>{T.tree.caption}</figcaption>
  </figure>;
}

function DataTable({ headers, rows, label }: { headers: string[]; rows: string[][]; label: string }) {
  return <div className="b3-table-scroll" role="region" aria-label={label} tabIndex={0}>
    <table className="b3-table"><thead><tr>{headers.map((h) => <th scope="col" key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th scope="row" key={j}>{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function Controls({ value, max, onChange, label }: { value: number; max: number; onChange: (value: number) => void; label: string }) {
  return <div className="b3-controls" role="group" aria-label={label}>
    <button className="btn" type="button" onClick={() => onChange(value - 1)} disabled={value === 0}>{T.common.previous}</button>
    <span className="b3-step-count">{T.common.step} {value}/{max}</span>
    <button className="btn btn--primary" type="button" onClick={() => onChange(value + 1)} disabled={value === max}>{T.common.next}</button>
    <button className="btn b3-reset" type="button" onClick={() => onChange(0)} disabled={value === 0}>{T.common.reset}</button>
  </div>;
}

function Board({ rows, label }: { rows: number[]; label: string }) {
  return <figure className="b3-board-figure">
    <div className="b3-board" role="img" aria-label={`${label}: [${rows.join(', ')}]`}>
      {Array.from({ length: 16 }, (_, i) => {
        const row = Math.floor(i / 4), column = i % 4;
        return <span aria-hidden="true" className={(row + column) % 2 ? 'b3-square is-dark' : 'b3-square'} key={i}>
          <small>{row + 1},{column + 1}</small>{rows[column] === row + 1 ? <span className="b3-queen">♛</span> : null}
        </span>;
      })}
    </div>
    <figcaption>{label}</figcaption>
  </figure>;
}

function Section({ id, children, last = false }: { id: string; children: ReactNode; last?: boolean }) {
  return <section id={id} className={`lesson-section b3-section${last ? ' lesson-section--last' : ''}`}>{children}</section>;
}

export default function Lesson03Problem() {
  const [deck, setDeck] = useDeckMode();
  // Keep interactive progress when switching between scroll and deck layouts.
  const [traceStep, setTraceStep] = useState(0);
  const [queenStep, setQueenStep] = useState(0);
  const trace = TRACE[traceStep];
  return <div className="b3-lesson">
    <LessonNav badge={T.hero.badge} title={T.hero.navTitle} backTo="/courses/csc14003" items={NAV}
      right={<DeckToggle on={deck} onChange={setDeck} />} />
    <LessonDeck on={deck} slides={SLIDES}>
      <section id="hero" className="lesson-hero b3-hero">
        <div className="b3-eyebrow">CSC14003 · {T.hero.badge}</div>
        <h1>{T.hero.title}</h1><p>{T.hero.lead}</p>
        <p className="b3-duration">{T.hero.duration}</p>
        <div className="b3-objectives"><h2>{T.hero.goalLabel}</h2><ul>{T.hero.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></div>
        <a href="#ch1" className="btn btn--primary">{T.hero.start}</a>
      </section>

      <Section id="ch1">
        <Head no="01" title={T.goal.title} outcome={T.goal.outcome} />
        <p>{T.goal.intro}</p><RoadMap />
        <div className="b3-comparison">{T.goal.compare.map(([path, cost, explanation]) => <div key={path}>
          <h3>{path}</h3><p className="b3-cost">{cost}</p><p>{explanation}</p>
        </div>)}</div>
        <p className="b3-takeaway">{T.goal.takeaway}</p>
        <details id="toan"><summary>{T.goal.primerTitle}</summary><p>{T.goal.primer}</p></details>
        <h3>{T.goal.agentTitle}</h3>
        <ol className="b3-agent">{T.goal.agent.map(([title, body]) => <li key={title}><strong>{title}</strong><span>{body}</span></li>)}</ol>
        <p className="b3-note">{T.goal.assumptions}</p>
        <Checkpoint question={T.goal.question} answer={T.goal.answer} />
      </Section>

      <Section id="ch2">
        <Head no="02" title={T.model.title} outcome={T.model.outcome} /><p>{T.model.intro}</p>
        <p className="b3-map-key">{T.common.mapEdges}</p>
        <ol className="b3-components">{T.model.rows.map(([question, term, example, explanation], i) => <li key={term}>
          <span className="b3-component-no" aria-hidden="true">{i + 1}</span><div>
            <h3>{question}</h3><p className="b3-term">{term}</p><code>{example}</code><p>{explanation}</p>
          </div>
        </li>)}</ol>
        <h3>{T.model.workedTitle}</h3><p>{T.model.worked}</p>
        <Checkpoint question={T.model.question} answer={T.model.answer} />
      </Section>

      <Section id="abstraction">
        <Head no="03" title={T.abstraction.title} outcome={T.abstraction.outcome} /><p>{T.abstraction.intro}</p>
        <dl className="b3-abstractions">{T.abstraction.rows.map(([name, verdict, explanation]) => <div key={name}>
          <dt>{name}</dt><dd><strong>{verdict}</strong> {explanation}</dd>
        </div>)}</dl><p className="b3-note">{T.abstraction.note}</p>
        <Checkpoint question={T.abstraction.question} answer={T.abstraction.answer} />
      </Section>

      <Section id="nodes">
        <Head no="04" title={T.nodes.title} outcome={T.nodes.outcome} /><p>{T.nodes.intro}</p>
        <div className="b3-path-pair"><code>A → C · g = 5</code><code>A → B → C · g = 3</code></div>
        <DataTable headers={T.nodes.headers} rows={T.nodes.rows} label={T.nodes.title} />
        <p className="b3-takeaway">{T.nodes.takeaway}</p>
        <h3>{T.nodes.parentTitle}</h3><p>{T.nodes.parent}</p>
        <Checkpoint question={T.nodes.question} answer={T.nodes.answer} />
      </Section>

      <Section id="ch3">
        <Head no="05" title={T.trace.title} outcome={T.trace.outcome} /><p>{T.trace.intro}</p>
        <div className="b3-lab">
          <Controls value={traceStep} max={TRACE.length - 1} onChange={setTraceStep} label={T.trace.title} />
          <div className="b3-trace-body"><RoadMap active={trace.active} />
            <div className="b3-trace-state" aria-live="polite" aria-atomic="true">
              <h3>{T.common.step} {traceStep} · {T.trace.stages[traceStep][0]}</h3>
              <p>{T.trace.stages[traceStep][1]}</p>
              <dl><dt>{T.trace.active}</dt><dd>{trace.active ?? '—'}</dd>
                <dt>{T.trace.frontier}</dt><dd>{trace.frontier.join(' / ') || T.common.empty}</dd>
                <dt>{T.trace.explored}</dt><dd>{trace.explored.join(', ') || T.common.empty}</dd></dl>
            </div>
          </div>
          <p className="b3-note">{T.trace.note}</p>
        </div>
        <Checkpoint question={T.trace.question} answer={T.trace.answer} />
      </Section>

      <Section id="tree">
        <Head no="06" title={T.tree.title} outcome={T.tree.outcome} /><p>{T.tree.intro}</p>
        <SearchTree /><p>{T.tree.distinction}</p>
        <h3>{T.tree.pseudoTitle}</h3><pre className="b3-code"><code>{T.tree.pseudo}</code></pre>
        <p className="b3-note">{T.tree.warning}</p>
        <Checkpoint question={T.tree.question} answer={T.tree.answer} />
        <h3>{T.tree.evaluationTitle}</h3><dl className="b3-criteria">{T.tree.criteria.map(([name, question]) => <div key={name}><dt>{name}</dt><dd>{question}</dd></div>)}</dl>
        <details><summary>{T.tree.mathTitle}</summary><p>{T.tree.math}</p></details>
      </Section>

      <Section id="queens">
        <Head no="07" title={T.queens.title} outcome={T.queens.outcome} /><p>{T.queens.intro}</p>
        <h3>{T.queens.incremental}</h3><p>{T.queens.incrementalBody}</p>
        <div className="b3-lab">
          <Controls value={queenStep} max={4} onChange={setQueenStep} label={T.queens.incremental} />
          <div className="b3-queens-step"><Board rows={QUEENS.slice(0, queenStep)} label={`[${QUEENS.slice(0, queenStep).join(', ')}]`} />
            <p aria-live="polite" aria-atomic="true">{T.queens.stages[queenStep]}</p></div>
        </div><p className="b3-note">{T.queens.rule}</p>
        <a href="#queens-move">{T.queens.complete} →</a>
      </Section>

      <Section id="queens-move">
        <Head no="07B" title={T.queens.complete} outcome={T.queens.outcome} /><p>{T.queens.completeBody}</p>
        <div className="b3-comparison b3-board-pair"><Board rows={[1, 1, 1, 1]} label={T.queens.before} /><Board rows={[1, 3, 1, 1]} label={T.queens.after} /></div>
        <p>{T.queens.completeNote}</p>
        <DataTable headers={T.queens.headers} rows={T.queens.rows} label={T.queens.title} /><p>{T.queens.cost}</p>
        <Checkpoint question={T.queens.question} answer={T.queens.answer} />
      </Section>

      <Section id="quiz">
        <Head no="08" title={T.quiz.title} outcome={T.quiz.outcome} /><p>{T.quiz.intro}</p>
        <SessionQuiz sessionId="b3" color="var(--cyan)" />
      </Section>

      <Section id="hw" last>
        <Head no="09" title={T.homework.title} outcome={T.homework.outcome} />
        {T.homework.exercises.map((exercise) => <article className="b3-exercise" key={exercise.title}>
          <h3>{exercise.title}</h3><p>{exercise.prompt}</p>
          <details><summary>{T.homework.hint}</summary><p>{exercise.hint}</p></details>
          <details><summary>{T.common.answer}</summary><p>{exercise.answer}</p></details>
        </article>)}
        <details className="b3-advanced"><summary>{T.homework.advanced}</summary><p>{T.homework.advancedPrompt}</p>
          <details><summary>{T.common.answer}</summary><p>{T.homework.advancedAnswer}</p></details>
        </details>
        <CheckList storageKey="b3-problem-checks-v2" items={T.homework.checks} />
        <footer className="b3-next"><p>{T.homework.nextBody}</p><Link to="/courses/csc14003/lessons/b4">{T.homework.next}</Link><Link to="/courses/csc14003">{T.homework.back}</Link></footer>
      </Section>
    </LessonDeck>
  </div>;
}

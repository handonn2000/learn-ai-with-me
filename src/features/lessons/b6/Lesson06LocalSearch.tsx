import { useMemo, useState, type ReactNode } from 'react';
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
import { tokenize } from '@/features/search-lab/search-engine.js';
import { Landscape, AnnealingLab, BeamVisual, Tabs, keepLabTouch } from './LocalSearchVisuals';
import { QueensLab } from './QueensLab';
import { GeneticLab } from './GeneticLab';
import { PYTHON } from './lesson06.code';
import { T } from './lesson06.text';

const NAV = [
  { href: '#toan', label: T.nav.math }, { href: '#ch1', label: T.nav.optimization },
  { href: '#ch2', label: T.nav.hill }, { href: '#lab', label: T.nav.lab, hot: true },
  { href: '#ch3', label: T.nav.variants }, { href: '#ch4', label: T.nav.annealing },
  { href: '#ch5', label: T.nav.beam }, { href: '#ch6', label: T.nav.genetic },
  { href: '#ch7', label: T.nav.summary }, { href: '#codelab', label: T.nav.code },
  { href: '#quiz', label: T.nav.quiz, hot: true }, { href: '#hw', label: T.nav.practice },
];
const HOMEWORK = getCourse('csc14003')?.sessions.find(s => s.id === 'b6')?.links[0]?.href;
const SLIDES = [{ id: 'hero', label: T.hero.cover }, ...NAV.map(n => ({ id: n.href.slice(1), label: n.label }))];
const P = ({ text }: { text: string }) => <Html as="p" t={text} className="ls-prose" />;
function Cards({ cards }: { cards: { title: string; body: string }[] }) {
  return <div className="ls-grid">{cards.map(card => <div className="card" key={card.title}><h3>{card.title}</h3><P text={card.body} /></div>)}</div>;
}
function Chapter({ id, no, text, children }: { id: string; no: string; text: { title: string; en: string; lead: string }; children: ReactNode }) {
  return <div id={id} className="lesson-section"><SectionHead no={no} title={text.title} en={text.en} lead={text.lead} /><div className="ls-chapter-body">{children}</div></div>;
}
function CodeLab() {
  const [selected, setSelected] = useState(0);
  const tokens: { c: string; s: string }[] = useMemo(() => tokenize(PYTHON[selected]), [selected]);
  return <Tabs label={T.code.label} options={T.code.tabs} value={selected} onChange={setSelected}>
    <P text={T.code.notes[selected]} /><pre className="codeblock ls-python"><code>{tokens.map((token, i) => <span key={i} className={`ls-token-${token.c}`}>{token.s}</span>)}</code></pre>
  </Tabs>;
}
const GRAPH_POINTS = [[60, 45], [60, 140], [60, 235], [175, 45], [290, 45], [290, 140], [175, 140], [175, 235]];
const GRAPH_EDGES = [[0, 1], [1, 2], [0, 3], [1, 3], [1, 6], [2, 6], [3, 4], [3, 5], [3, 6], [5, 6], [6, 7]];
function ColoringGraph() {
  return <svg viewBox="0 0 350 280" className="ls-coloring" role="img" aria-label={T.hw.graphNote}>
    {GRAPH_EDGES.map(([a, b]) => <line key={`${a}-${b}`} x1={GRAPH_POINTS[a][0]} y1={GRAPH_POINTS[a][1]} x2={GRAPH_POINTS[b][0]} y2={GRAPH_POINTS[b][1]} className={(a === 2 && b === 6) || (a === 6 && b === 7) ? 'ls-graph-conflict' : 'ls-graph-edge'} />)}
    {GRAPH_POINTS.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="21" className={`ls-graph-node ls-color-${[1, 2, 1, 0, 1, 2, 1, 1][i]}`} /><text x={x} y={y + 5} textAnchor="middle">{String.fromCharCode(65 + i)}</text></g>)}
  </svg>;
}
export default function Lesson06LocalSearch() {
  const [deck, setDeck] = useDeckMode();
  return <div className="ls-lesson">
    <LessonNav badge={T.hero.badge} title={T.hero.title} backTo="/courses/csc14003" items={NAV} right={<DeckToggle on={deck} onChange={setDeck} />} />
    <LessonDeck on={deck} slides={SLIDES}>
      <div className="lesson-hero ls-hero">
        <div className="ls-hero-inner"><div>
          <div className="mono ls-eyebrow">{T.hero.eyebrow}</div>
          <h1>{T.hero.heading}<br /><em>{T.hero.accent}</em></h1>
          <p className="ls-hero-lead">{T.hero.lead}</p>
          <div className="ls-choices">{[T.hero.time, T.hero.families, T.hero.quiz].map(t => <span className="chip" key={t}>{t}</span>)}</div>
          <div className="ls-choices"><a className="btn btn--primary" href="#lab">{T.hero.cta}</a><Link to="/courses/csc14003/lessons/b5">{T.hero.back}</Link></div>
        </div><div className="ls-hero-map" aria-hidden="true">
          <div className="kicker">{T.hero.map}</div>
          <svg viewBox="0 0 420 270"><path d="M15 235 L70 160 L125 100 L178 170 L219 196 L276 82 L326 35 L398 218 L398 250 L15 250Z" className="ls-land-fill"/><path d="M15 235 L70 160 L125 100 L178 170 L219 196 L276 82 L326 35 L398 218" className="ls-land-line"/>
            <path d="M125 100 L178 170 L219 196 L276 82 L326 35" className="ls-trail" strokeDasharray="5 6"/><circle cx="125" cy="100" r="8" className="ls-current"/><circle cx="326" cy="35" r="12" className="ls-global"/>
            <text x="125" y="79" textAnchor="middle">{T.hero.current}</text><text x="326" y="14" textAnchor="middle">{T.hero.global}</text>
          </svg><div className="ls-hero-formula mono">P = e<sup>−ΔC/T</sup></div>
        </div></div>
      </div>
      <div id="toan" className="lesson-section lesson-section--first"><MathPrimer {...MATH_PRIMERS.b6} /></div>
      <Chapter id="ch1" no="01" text={T.ch1}><P text={T.ch1.body} /><Cards cards={T.ch1.cards} /><div className="ls-callout"><P text={T.ch1.memory} /></div><P text={T.ch1.examples} /><p className="ls-note">{T.ch1.scale}</p></Chapter>
      <Chapter id="ch2" no="02" text={T.ch2}><P text={T.ch2.body} /><Landscape /><P text={T.ch2.rule} /><Cards cards={T.ch2.traps} /><P text={T.ch2.distinction} /></Chapter>
      <Chapter id="lab" no="LAB" text={T.lab}><P text={T.lab.model} /><P text={T.lab.pairs} /><QueensLab /><P text={T.lab.experiments} /></Chapter>
      <Chapter id="ch3" no="03" text={T.ch3}><Cards cards={T.ch3.variants} /><div className="card"><div className="kicker">{T.ch3.statsTitle}</div><div className="ls-grid">{T.ch3.stats.map(([label, value, note]) => <div key={label} className="ls-experiment"><span>{label}</span><strong>{value}</strong><span>{note}</span></div>)}</div><p className="ls-note">{T.ch3.caveat}</p></div><P text={T.ch3.restart} /><P text={T.ch3.probability} /></Chapter>
      <Chapter id="ch4" no="04" text={T.ch4}><P text={T.ch4.body} /><div className="ls-formula mono">P = min(1, exp(−ΔC/T)) · T &gt; 0</div><AnnealingLab /><P text={T.ch4.sign} /><P text={T.ch4.schedule} /><div className="ls-callout"><P text={T.ch4.guarantee} /></div><P text={T.ch4.experiment} /></Chapter>
      <Chapter id="ch5" no="05" text={T.ch5}><P text={T.ch5.body} /><BeamVisual /><P text={T.ch5.diversity} /><P text={T.ch5.stochastic} /></Chapter>
      <Chapter id="ch6" no="06" text={T.ch6}><P text={T.ch6.body} /><P text={T.ch6.encoding} /><P text={T.ch6.fitness} /><P text={T.ch6.roulette} /><GeneticLab /><P text={T.ch6.crossover} /><P text={T.ch6.mutation} /><div className="ls-callout"><P text={T.ch6.caveat} /></div><P text={T.ch6.conclusion} /></Chapter>
      <Chapter id="ch7" no="07" text={T.ch7}><div className="card ls-table-scroll" onTouchStart={keepLabTouch} onTouchEnd={keepLabTouch}><table className="dtable ls-comparison"><thead><tr>{T.ch7.headers.map(t => <th key={t}>{t}</th>)}</tr></thead><tbody>{T.ch7.rows.map(row => <tr key={row[0]}>{row.map((text, i) => <td key={i}>{text}</td>)}</tr>)}</tbody></table></div><P text={T.ch7.cost} /><P text={T.ch7.bridge} /></Chapter>
      <Chapter id="codelab" no="08" text={T.code}><CodeLab /><P text={T.code.task} /></Chapter>
      <Chapter id="quiz" no="09" text={T.quiz}><SessionQuiz sessionId="b6" /></Chapter>
      <div id="hw" className="lesson-section lesson-section--last"><SectionHead no="10" title={T.hw.title} en={T.hw.en} lead={T.hw.lead} /><div className="ls-chapter-body">
        <div className="ls-grid">{T.hw.cards.map((card, i) => <div key={card.title} className="card"><h3>{card.title}</h3><P text={card.body} />{i === 1 && <><ColoringGraph /><p className="ls-note">{T.hw.graphNote}</p></>}<details><summary>{T.hw.hint}</summary><P text={card.hint} /></details></div>)}</div>
        <a href={HOMEWORK} target="_blank" rel="noreferrer">{T.hw.file}</a>
        <CheckList storageKey="b6-checks" items={T.hw.checks} /><P text={T.hw.next} /><Link to="/courses/csc14003">{T.hw.roadmap}</Link>
      </div></div>
    </LessonDeck>
  </div>;
}

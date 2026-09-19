import { LessonNav } from '@/components/LessonNav';
import { LessonDeck, DeckToggle, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { CheckList } from '@/components/CheckList';
import { SessionQuiz } from '@/components/SessionQuiz';
import { Html } from '@/components/Html';
import { IntervalLab, LessonCode, PoolLab, SchedulerLab, ValidationLab } from './OrchestrationLabs';
import { CONTRACT, GATE, OPERATORS, XCOM } from './lesson12.code';
import { T } from './lesson12.text';
import './Lesson12Orchestration.css';

const NAV = [
  { href: '#toan', label: T.readyTitle },
  ...T.chapters.map((chapter, i) => ({ href: `#ch${String(i + 1).padStart(2, '0')}`, label: `${String(i + 1).padStart(2, '0')} ${chapter.title}`, hot: [0, 5, 8].includes(i) })),
  { href: '#summary', label: T.summaryTitle }, { href: '#checks', label: T.checkTitle },
  { href: '#quiz', label: T.quizTitle }, { href: '#hw', label: T.practiceTitle },
];
const SLIDES = [{ id: 'hero', label: T.cover }, ...NAV.map(item => ({ id: item.href.slice(1), label: item.label }))];
const topicLabels: Record<string, string> = T.topicLabels;

export default function Lesson12Orchestration() {
  const [deck, setDeck] = useDeckMode();
  return <div className="def12-lesson">
    <LessonNav badge={T.badge} title={T.title} backTo="/courses/data-engineering-foundation" items={NAV} right={<DeckToggle on={deck} onChange={setDeck} />} />
    <LessonDeck on={deck} slides={SLIDES}>
      <header id="hero" className="lesson-hero def12-hero">
        <div><p className="kicker">{T.eyebrow}</p><Html as="h1" t={T.hero} /><p className="def12-intro">{T.intro}</p><p className="mono def12-meta">{T.meta}</p><div className="def12-actions"><a className="btn btn--primary" href="#toan">{T.start}</a><a className="btn" href="#ch09">{T.jump}</a></div></div>
        <div className="def12-hero-art" aria-hidden="true"><div className="def12-board-title"><img src={`${import.meta.env.BASE_URL}frameworks/airflow.svg`} alt="" /><span className="mono">AIRFLOW / CONTROL ROOM</span></div><div className="def12-ticket"><time>02:00</time><span>extract_orders</span><b>→</b></div><div className="def12-ticket def12-ticket-wait"><time>03:00</time><span>transform</span><b>⊥</b></div><div className="def12-ticket"><time>03:20</time><span>dependencies_ready</span><b>→</b></div><div className="def12-ticket def12-ticket-gate"><time>04:00</time><span>quality_gate</span><b>?</b></div><div className="def12-board-footer mono">RUN / 2026-05-15<br/>extract → validate → publish</div></div>
        <p className="def12-premise">{T.premise}</p>
      </header>
      <section id="toan" className="lesson-section lesson-section--first"><SectionHead no="↳" title={T.readyTitle} lead={T.readyLead} /><div className="def12-grid">{T.terms.map(([term, text]) => <article className="card" key={term}><h3>{term}</h3><p>{text}</p></article>)}</div></section>
      {T.chapters.map((chapter, i) => <section key={i} id={`ch${String(i + 1).padStart(2, '0')}`} className="lesson-section">
        <SectionHead no={String(i + 1).padStart(2, '0')} title={chapter.title} lead={chapter.lead} color={i >= 6 ? 'var(--purple)' : 'var(--cyan)'} />
        <div className="def12-prose">{chapter.body.map((p, n) => <Html key={n} as="p" t={p} />)}</div>
        {i === 0 && <SchedulerLab />}
        {i === 2 && <IntervalLab />}
        {i === 3 && <figure className="def12-architecture"><figcaption><img src={`${import.meta.env.BASE_URL}frameworks/airflow.svg`} alt="" />{T.architecture.title}</figcaption>{[T.architecture.plan, T.architecture.dispatch, T.architecture.state, T.architecture.ui, T.architecture.data].map((line, n) => <div key={line} className={n === 4 ? 'def12-data-path' : ''}><span className="mono">{String(n + 1).padStart(2, '0')}</span>{line}</div>)}<p className="def12-note">{T.architecture.note}</p></figure>}
        <div className="def12-table" tabIndex={0} role="region" aria-label={chapter.title}><table className="dtable"><thead><tr>{chapter.headers.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{chapter.rows.map((row, n) => <tr key={n}>{row.map((cell, k) => k === 0 ? <th key={k} scope="row">{cell}</th> : <td key={k}>{cell}</td>)}</tr>)}</tbody></table></div>
        {i === 4 && <><h3>{T.code.title}</h3><p className="def12-prose">{T.code.lead}</p><LessonCode value={OPERATORS} /><p className="def12-callout">{T.code.operatorNote}</p><h3>{T.code.xcomTitle}</h3><LessonCode value={XCOM} /><p className="def12-note">{T.code.xcomNote}</p></>}
        {i === 5 && <PoolLab />}
        {i === 8 && <><h3>{T.code.gateTitle}</h3><p className="def12-prose">{T.code.gateLead}</p><LessonCode value={GATE} /><ValidationLab /></>}
        {i === 9 && <><h3>{T.code.contractTitle}</h3><LessonCode value={CONTRACT} language="JSON" /></>}
      </section>)}
      <section id="summary" className="lesson-section"><SectionHead no="↳" title={T.summaryTitle} /><ol className="def12-summary">{T.summary.map(s => <li key={s}>{s}</li>)}</ol></section>
      <section id="checks" className="lesson-section"><SectionHead no="✓" title={T.checkTitle} /><CheckList storageKey="data-engineering-foundation-b12-checks" items={T.checks} /></section>
      <section id="quiz" className="lesson-section"><SectionHead no="?" title={T.quizTitle} /><SessionQuiz courseSlug="data-engineering-foundation" sessionId="b12" questions={T.quiz} labelTopic={id => topicLabels[id] || id} /></section>
      <section id="hw" className="lesson-section lesson-section--last"><SectionHead no="→" title={T.practiceTitle} /><ol className="def12-summary">{T.practice.map(p => <li key={p}>{p}</li>)}</ol><details className="card"><summary>{T.practiceAnswer}</summary><p>{T.practiceGuide}</p></details><p className="def12-callout">{T.next}</p></section>
    </LessonDeck>
  </div>;
}

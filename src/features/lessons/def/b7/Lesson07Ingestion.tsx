import { LessonNav } from '@/components/LessonNav';
import { LessonDeck, DeckToggle, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { CheckList } from '@/components/CheckList';
import { SessionQuiz } from '@/components/SessionQuiz';
import { Html } from '@/components/Html';
import { RoutingLab, CrashLab, CdcLab } from './IngestionLabs';
import { T } from './lesson07.text';
import { SyntaxCode } from './SyntaxCode';
import { ChapterVisual, FrameworkLogo } from './IngestionVisuals';

const NAV = [
  { href: '#toan', label: T.readyTitle },
  ...T.chapters.map((c, i) => ({ href: `#ch${String(i + 1).padStart(2, '0')}`, label: `${String(i + 1).padStart(2, '0')} ${c.title}`, hot: i === 6 || i === 8 || i === 9 })),
  { href: '#summary', label: T.summaryTitle }, { href: '#checks', label: T.checkTitle },
  { href: '#quiz', label: T.quizTitle }, { href: '#hw', label: T.practiceTitle },
];
const SLIDES = [{ id: 'hero', label: T.cover }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];
const topicLabels: Record<string, string> = T.lab.topicLabels;
const eventExample = JSON.stringify({ key: { order_id: 42 }, value: { op: 'u', before: { amount: 10 }, after: { amount: 12 } } }, null, 2);

export default function Lesson07Ingestion() {
  const [deck, setDeck] = useDeckMode();
  return <div className="def-lesson">
    <LessonNav badge={T.badge} title={T.title} backTo="/courses/data-engineering-foundation" items={NAV} right={<DeckToggle on={deck} onChange={setDeck} />} />
    <LessonDeck on={deck} slides={SLIDES}>
      <header id="hero" className="lesson-hero def-hero">
        <div className="def-hero-copy"><p className="kicker">{T.eyebrow}</p><Html as="h1" t={T.hero} /><p className="def-intro">{T.intro}</p><p className="mono def-meta">{T.meta}</p>
        <div className="def-controls"><a className="btn btn--primary" href="#toan">{T.start}</a><a className="btn" href="#ch09">{T.jump}</a></div><p className="def-small">{T.premise}</p></div>
        <div className="def-hero-log" aria-hidden="true"><FrameworkLogo brand="kafka" /><div className="mono">orders / partition 0</div>{['001  order_created','002  payment_received','003  inventory_updated'].map((s,i) => <div className="def-hero-event" key={s} style={{ animationDelay: `${i * .25}s` }}>{s}<span>→</span></div>)}<div className="def-hero-branches">Analytics · Inventory · Fraud</div></div>
      </header>
      <section id="toan" className="lesson-section lesson-section--first"><SectionHead no="↳" title={T.readyTitle} lead={T.readyLead} /><div className="def-grid">{T.terms.map(([term, text]) => <div className="card" key={term}><h3>{term}</h3><p>{text}</p></div>)}</div></section>
      {T.chapters.map((c, i) => <section key={c.title} id={`ch${String(i + 1).padStart(2, '0')}`} className="lesson-section">
        <SectionHead no={String(i + 1).padStart(2, '0')} title={c.title} lead={c.lead} color="var(--cyan)" />
        <ChapterVisual chapter={i} />
        {![0, 3, 9].includes(i) && c.flow.length > 0 && <ol className="def-flow" aria-label={T.diagramLabel}>{c.flow.map((s) => <li key={s}>{s}</li>)}</ol>}
        <aside className="def-key-idea"><span>{T.visuals.keyIdea}</span><p>{T.visuals.callouts[i]}</p></aside>
        <div className="def-prose">{c.body.map((p) => <Html as="p" t={p} key={p} />)}</div>
        {c.cards.length > 0 && <div className="def-grid">{c.cards.map((card) => <article className="card" key={card.title}><h3>{card.title}</h3><Html as="p" t={card.text} /></article>)}</div>}
        {c.table.headers.length > 0 && <div className="def-table-wrap"><table className="dtable"><thead><tr>{c.table.headers.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{c.table.rows.map((row) => <tr key={row[0]}>{row.map((v,j) => j === 0 ? <th key={j} scope="row">{v}</th> : <td key={j}>{v}</td>)}</tr>)}</tbody></table></div>}
        {c.figures.map((f) => <figure className="def-figure" key={f.title}><figcaption><h3>{f.title}</h3><p>{f.text}</p></figcaption><div className="def-table-wrap"><table className="dtable"><thead><tr>{f.headers.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{f.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((v,j) => <td key={j}>{v}</td>)}</tr>)}</tbody></table></div></figure>)}
        {i === 6 && <RoutingLab />}{i === 8 && <CrashLab />}{i === 9 && <><h3>{T.codeTitle}</h3><SyntaxCode value={eventExample} /><CdcLab /></>}
      </section>)}
      <section id="summary" className="lesson-section"><SectionHead no="↳" title={T.summaryTitle} /><ol className="def-summary">{T.summary.map((s) => <li key={s}>{s}</li>)}</ol></section>
      <section id="checks" className="lesson-section"><SectionHead no="✓" title={T.checkTitle} /><CheckList storageKey="data-engineering-foundation-b7-checks" items={T.checks} /></section>
      <section id="quiz" className="lesson-section"><SectionHead no="?" title={T.quizTitle} /><SessionQuiz sessionId="b7" courseSlug="data-engineering-foundation" questions={T.quiz} labelTopic={(id) => topicLabels[id] || id} /></section>
      <section id="hw" className="lesson-section lesson-section--last"><SectionHead no="→" title={T.practiceTitle} /><ol className="def-summary">{T.practice.map((p) => <li key={p}>{p}</li>)}</ol><details className="card"><summary>{T.practiceAnswer}</summary><p>{T.practiceGuide}</p></details><p className="def-callout">{T.next}</p></section>
    </LessonDeck>
  </div>;
}

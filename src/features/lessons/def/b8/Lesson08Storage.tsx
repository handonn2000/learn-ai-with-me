import { LessonNav } from '@/components/LessonNav';
import { LessonDeck, DeckToggle, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { CheckList } from '@/components/CheckList';
import { SessionQuiz } from '@/components/SessionQuiz';
import { Html } from '@/components/Html';
import { SyntaxCode } from '../b7/SyntaxCode';
import { StorageExplorer, HdfsReadVisual, ModelingVisual, GovernanceLab, MedallionLab } from './StorageLabs';
import { T } from './lesson08.text';
import './Lesson08Storage.css';

const NAV = [
  { href: '#toan', label: T.readyTitle },
  ...T.chapters.map((chapter, i) => ({ href: `#ch${String(i + 1).padStart(2, '0')}`, label: `${String(i + 1).padStart(2, '0')} ${chapter.title}`, hot: [0, 6, 9].includes(i) })),
  { href: '#summary', label: T.summaryTitle },
  { href: '#checks', label: T.checkTitle },
  { href: '#quiz', label: T.quizTitle },
  { href: '#hw', label: T.practiceTitle },
];
const SLIDES = [{ id: 'hero', label: T.cover }, ...NAV.map(item => ({ id: item.href.slice(1), label: item.label }))];
const topicLabels: Record<string, string> = T.topicLabels;
const tones = ['var(--cyan)', 'var(--orange)', 'var(--purple)', 'var(--green)', 'var(--yellow)'];
const bronzeExample = JSON.stringify([
  { order_id: 101, amount: 120000 },
  { order_id: 101, amount: 120000 },
  { order_id: 102, amount: 80000 },
  { order_id: 103, amount: 'invalid' },
  { order_id: null, amount: 50000 },
], null, 2);

export default function Lesson08Storage() {
  const [deck, setDeck] = useDeckMode();
  return <div className="def8-lesson">
    <LessonNav badge={T.badge} title={T.title} backTo="/courses/data-engineering-foundation" items={NAV} right={<DeckToggle on={deck} onChange={setDeck} />} />
    <LessonDeck on={deck} slides={SLIDES}>
      <header id="hero" className="lesson-hero def8-hero">
        <div>
          <p className="kicker">{T.eyebrow}</p>
          <Html as="h1" t={T.hero} />
          <p className="def8-intro">{T.intro}</p>
          <p className="mono def8-meta">{T.meta}</p>
          <div className="def8-actions"><a href="#toan" className="btn btn--primary">{T.start}</a><a href="#ch10" className="btn">{T.jump}</a></div>
        </div>
        <div className="def8-hero-art" aria-hidden="true">
          <div className="def8-shelf def8-shelf--bronze"><span className="mono">01 / BRONZE</span><div className="def8-records">{['101', '101', '102', '103', '—'].map((id, i) => <span key={i}>{id}</span>)}</div></div>
          <div className="def8-shelf def8-shelf--silver"><span className="mono">02 / SILVER</span><div className="def8-records"><span>101</span><span>102</span></div></div>
          <div className="def8-shelf def8-shelf--gold"><span className="mono">03 / GOLD</span><strong>200,000 <small>VND</small></strong></div>
          <p className="def8-art-foot mono">orders / schema v1</p>
        </div>
        <p className="def8-premise">{T.premise}</p>
      </header>
      <section id="toan" className="lesson-section lesson-section--first">
        <SectionHead no="↳" title={T.readyTitle} lead={T.readyLead} />
        <div className="def8-grid">{T.terms.map(([term, text]) => <article className="card" key={term}><h3>{term}</h3><Html as="p" t={text} /></article>)}</div>
      </section>
      {T.chapters.map((chapter, i) => <section key={chapter.title} id={`ch${String(i + 1).padStart(2, '0')}`} className="lesson-section">
        <SectionHead no={String(i + 1).padStart(2, '0')} title={chapter.title} lead={chapter.lead} color={tones[i % tones.length]} />
        <div className="def8-prose">{chapter.body.map((paragraph, j) => <Html as="p" key={j} t={paragraph} />)}</div>
        {i === 0 && <StorageExplorer />}
        {i === 2 && <HdfsReadVisual />}
        {i === 4 && <ModelingVisual />}
        {chapter.cards.length > 0 && <div className={`def8-grid ${[3, 8, 9].includes(i) ? 'def8-stages' : ''}`}>{chapter.cards.map((card, j) => <article className="card" key={card.title}>
          {[3, 8, 9].includes(i) && <span className="def8-stage-no mono" aria-hidden="true">{String(j + 1).padStart(2, '0')}</span>}
          <h3>{card.title}</h3><Html as="p" t={card.text} />
        </article>)}</div>}
        {chapter.table.headers.length > 0 && <div className="def8-table-wrap" tabIndex={0} role="region" aria-label={chapter.title}><table className="dtable">
          <thead><tr>{chapter.table.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead>
          <tbody>{chapter.table.rows.map((row, j) => <tr key={j}>{row.map((value, k) => k === 0 ? <th scope="row" key={k}>{value}</th> : <td key={k}>{value}</td>)}</tr>)}</tbody>
        </table></div>}
        {i === 6 && <GovernanceLab />}
        {i === 9 && <><h3 className="def8-code-title">{T.codeTitle}</h3><p className="def8-prose">{T.codeLead}</p><SyntaxCode value={bronzeExample} /><MedallionLab /></>}
      </section>)}
      <section id="summary" className="lesson-section"><SectionHead no="↳" title={T.summaryTitle} /><ol className="def8-summary">{T.summary.map(item => <li key={item}><Html t={item} /></li>)}</ol></section>
      <section id="checks" className="lesson-section"><SectionHead no="✓" title={T.checkTitle} /><CheckList storageKey="data-engineering-foundation-b8-checks" items={T.checks} /></section>
      <section id="quiz" className="lesson-section"><SectionHead no="?" title={T.quizTitle} /><SessionQuiz sessionId="b8" courseSlug="data-engineering-foundation" questions={T.quiz} labelTopic={id => topicLabels[id] || id} /></section>
      <section id="hw" className="lesson-section lesson-section--last"><SectionHead no="→" title={T.practiceTitle} /><ol className="def8-summary">{T.practice.map(item => <li key={item}><Html t={item} /></li>)}</ol><details className="card def8-practice-answer"><summary>{T.practiceAnswer}</summary><Html as="p" t={T.practiceGuide} /></details><p className="def8-next">{T.next}</p></section>
    </LessonDeck>
  </div>;
}

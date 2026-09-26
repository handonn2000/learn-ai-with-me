import type { ReactNode } from 'react';
import { LessonNav } from '@/components/LessonNav';
import { LessonDeck, DeckToggle, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { CheckList } from '@/components/CheckList';
import { SessionQuiz, type QuizQ } from '@/components/SessionQuiz';
import { Html } from '@/components/Html';
import { useLessonLoop } from '@/lib/useLessonLoop';
import './DataLesson.css';

export interface Chapter {
  title: string; lead: string; body: string[];
  headers: string[]; rows: string[][];
}
export interface LessonText {
  badge: string; title: string; hero: string; intro: string; meta: string; premise: string;
  cover: string; start: string; readyTitle: string; readyLead: string; terms: string[][];
  chapters: Chapter[]; summaryTitle: string; summary: string[]; checkTitle: string; checks: string[];
  quizTitle: string; quiz: QuizQ[]; practiceTitle: string; practice: string[];
  answerTitle: string; answer: string; next: string; demo: string; loopNote: string;
}
export function DataTable({ headers, rows, label }: { headers: string[]; rows: (string | number)[][]; label: string }) {
  return <div className="def-data-table" tabIndex={0} role="region" aria-label={label}><table className="dtable"><thead><tr>{headers.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((v, j) => j === 0 ? <th scope="row" key={j}>{v}</th> : <td key={j}>{v}</td>)}</tr>)}</tbody></table></div>;
}
export function CodeBlock({ value, language = 'Python' }: { value: string; language?: string }) {
  const tokens = value.split(/(#[^\n]*|--[^\n]*|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:from|import|def|return|if|else|or|and|in|for|as|True|False|None|true|false|null|SELECT|FROM|WHERE|JOIN|ON|GROUP|BY|AS|CREATE|TABLE|WITH|WATERMARK|INTERVAL|DESCRIPTOR|ORDER|LEFT|AND|SET|new|public|class|void)\b|\b\d+(?:\.\d+)?\b)/g);
  return <div className="def-data-code"><div className="mono">{language}</div><pre><code>{tokens.map((token, i) => <span key={i} className={/^(#|--|\/\/)/.test(token) ? 'token-comment' : /^["']/.test(token) ? 'token-string' : /^\d/.test(token) ? 'token-number' : /^(from|import|def|return|if|else|or|and|in|for|as|True|False|None|true|false|null|SELECT|FROM|WHERE|JOIN|ON|GROUP|BY|AS|CREATE|TABLE|WITH|WATERMARK|INTERVAL|DESCRIPTOR|ORDER|LEFT|AND|SET|new|public|class|void)$/.test(token) ? 'token-keyword' : ''}>{token}</span>)}</code></pre></div>;
}
export function TraceLoop({ title, steps, note }: { title: string; steps: string[][]; note: string }) {
  const { ref, step } = useLessonLoop(steps.length, title + JSON.stringify(steps), 2600);
  return <div className="def-data-trace" ref={ref} data-step={step}><h3>{title}</h3><ol>{steps.map(([label, detail], i) => <li key={i} className={i === step ? 'is-current' : ''}><span className="mono">{String(i + 1).padStart(2, '0')}</span><div><strong>{label}</strong><p>{detail}</p></div></li>)}</ol><p className="def-data-note">{note}</p></div>;
}
export function Lab({ title, help, demo, children }: { title: string; help: string; demo: string; children: ReactNode }) {
  return <div className="def-data-lab" onKeyDown={e => { if (['INPUT', 'SELECT', 'BUTTON'].includes((e.target as HTMLElement).tagName)) e.stopPropagation(); }}><p className="kicker">{demo}</p><h3>{title}</h3><p>{help}</p>{children}</div>;
}
export function DataLesson({ text: T, id, artwork, extra }: { text: LessonText; id: string; artwork: ReactNode; extra: (chapter: number) => ReactNode }) {
  const [deck, setDeck] = useDeckMode();
  const nav = [{ href: '#toan', label: T.readyTitle }, ...T.chapters.map((c, i) => ({ href: `#ch${String(i + 1).padStart(2, '0')}`, label: `${String(i + 1).padStart(2, '0')} ${c.title}` })), { href: '#summary', label: T.summaryTitle }, { href: '#checks', label: T.checkTitle }, { href: '#quiz', label: T.quizTitle }, { href: '#hw', label: T.practiceTitle }];
  const slides = [{ id: 'hero', label: T.cover }, ...nav.map(n => ({ id: n.href.slice(1), label: n.label }))];
  return <div className={`def-data-lesson def-${id}`}>
    <LessonNav badge={T.badge} title={T.title} backTo="/courses/data-engineering-foundation" items={nav} right={<DeckToggle on={deck} onChange={setDeck} />} />
    <LessonDeck on={deck} slides={slides}>
      <header id="hero" className="lesson-hero def-data-hero"><div><p className="kicker">DATA ENGINEERING FOUNDATION / {T.badge}</p><Html as="h1" t={T.hero} /><p className="def-data-intro">{T.intro}</p><p className="mono">{T.meta}</p><a className="btn btn--primary" href="#toan">{T.start}</a></div><div className="def-data-art">{artwork}</div><p className="def-data-premise">{T.premise}</p></header>
      <section id="toan" className="lesson-section lesson-section--first"><SectionHead no="↳" title={T.readyTitle} lead={T.readyLead} /><div className="def-data-grid">{T.terms.map(([term, detail]) => <article className="card" key={term}><h3>{term}</h3><p>{detail}</p></article>)}</div></section>
      {T.chapters.map((c, i) => <section id={`ch${String(i + 1).padStart(2, '0')}`} className="lesson-section" key={i}><SectionHead no={String(i + 1).padStart(2, '0')} title={c.title} lead={c.lead} /><div className="def-data-prose">{c.body.map((p, j) => <Html as="p" t={p} key={j} />)}</div><DataTable label={c.title} headers={c.headers} rows={c.rows} />{extra(i + 1)}</section>)}
      <section id="summary" className="lesson-section"><SectionHead no="↳" title={T.summaryTitle} /><ol className="def-data-summary">{T.summary.map(s => <li key={s}>{s}</li>)}</ol></section>
      <section id="checks" className="lesson-section"><SectionHead no="✓" title={T.checkTitle} /><CheckList storageKey={`data-engineering-foundation-${id}-checks`} items={T.checks} /></section>
      <section id="quiz" className="lesson-section"><SectionHead no="?" title={T.quizTitle} /><SessionQuiz courseSlug="data-engineering-foundation" sessionId={id} questions={T.quiz} labelTopic={topic => T.chapters[Number(topic.replace(id + '-', '')) - 1]?.title || topic} /></section>
      <section id="hw" className="lesson-section lesson-section--last"><SectionHead no="→" title={T.practiceTitle} /><ol className="def-data-summary">{T.practice.map(s => <li key={s}>{s}</li>)}</ol><details className="card"><summary>{T.answerTitle}</summary><p>{T.answer}</p></details><p className="def-data-callout">{T.next}</p></section>
    </LessonDeck>
  </div>;
}

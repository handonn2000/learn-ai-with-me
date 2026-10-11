import { useState } from 'react';
import { Html } from '@/components/Html';
import { tokenize } from '@/features/search-lab/search-engine.js';
import { displayName, formatClause, formatLiteral, formatRule } from './logic-engine.js';
import { T } from './lesson09.text';

type Rule = { premise: string[]; conclusion: string; sentence: number };
type Literal = { s: string; neg: boolean };

/** Keep horizontal swipes and arrow keys inside scrollable figures instead of paging the deck. */
export const scrollShield = {
  tabIndex: 0,
  onTouchStart: (event: React.TouchEvent) => event.stopPropagation(),
  onTouchEnd: (event: React.TouchEvent) => event.stopPropagation(),
  onKeyDown: (event: React.KeyboardEvent) => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') event.stopPropagation(); },
};

export const P = ({ text }: { text: string }) => <Html as="p" t={text} className="ls-prose" />;
export const value = (v: boolean) => (v ? T.common.t : T.common.f);
export const tf = (v: boolean) => (v ? 'T' : 'F');

export function Table({ headers, rows, label, wide = false }: { headers: string[]; rows: (string | number)[][]; label?: string; wide?: boolean }) {
  return <div className={`lg-scroll ${wide ? 'lg-scroll-wide' : ''}`} aria-label={label ?? headers.filter(Boolean).join(' · ')} {...scrollShield}>
    <table className="dtable">{headers.some(Boolean) && <thead><tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>}
      <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, k) => <td key={k}><Html as="span" t={String(cell)} /></td>)}</tr>)}</tbody></table>
  </div>;
}

export function Code({ src, label }: { src: string; label: string }) {
  const tokens: { c: string; s: string }[] = tokenize(src);
  return <pre className="codeblock ls-python lg-code" aria-label={label} {...scrollShield}><code>{tokens.map((token, i) => <span key={i} className={`ls-token-${token.c}`}>{token.s}</span>)}</code></pre>;
}

export function Recall({ question }: { question: { q: string; opts: string[]; a: number; ex: string } }) {
  const [picked, setPicked] = useState<number | null>(null);
  return <div className="card lg-recall"><h3>{question.q}</h3>
    <div className="lg-answers">{question.opts.map((opt, i) => <button type="button" key={opt} aria-pressed={picked === i}
      className={`btn ${picked === i ? (i === question.a ? 'lg-correct' : 'lg-wrong') : ''}`} onClick={() => setPicked(i)}>
      {picked === i ? (i === question.a ? '✓ ' : '× ') : ''}{opt}</button>)}</div>
    {picked !== null && <Html as="p" className="ls-prose" t={question.ex} />}
  </div>;
}

export function Verdict({ entailed }: { entailed: boolean | null }) {
  const kind = entailed === true ? 'yes' : entailed === false ? 'no' : 'unknown';
  return <span className={`lg-verdict lg-verdict-${kind}`}>{T.lab.verdict[kind]}</span>;
}

/* ── trace captions shared by the chaining loop and the lab ── */

type FcEvent = { kind: string; p?: string; rule?: number; agenda: string[]; count: number[] };
export function fcCaption(e: FcEvent, rules: Rule[], q: string) {
  const ev = T.lab.fc.events;
  switch (e.kind) {
    case 'init': return `${ev.init}: [${e.agenda.map(displayName).join(', ')}]`;
    case 'pop': return `${ev.pop} ${displayName(e.p ?? '')}`;
    case 'skip': return `${ev.pop} ${displayName(e.p ?? '')} — ${ev.skip}`;
    case 'decrement': return `${displayName(e.p ?? '')} → ${ev.decrement} ${formatRule(rules[e.rule ?? 0])}: ${e.count[e.rule ?? 0]}`;
    case 'fire': return `${displayName(e.p ?? '')} → ${ev.fire} ${formatRule(rules[e.rule ?? 0])} · ${T.lab.fc.agenda} + ${displayName(rules[e.rule ?? 0].conclusion)}`;
    case 'found': return `${ev.found} ${displayName(q)} ✓`;
    default: return ev.exhausted;
  }
}

type BcEvent = { kind: string; goal: string; rule?: number; stack: string[] };
export function bcCaption(e: BcEvent, rules: Rule[]) {
  const ev = T.lab.bc.events;
  const g = displayName(e.goal);
  switch (e.kind) {
    case 'goal': return `${ev.goal} ${g}?`;
    case 'try': return `${g}: ${ev.try} ${formatRule(rules[e.rule ?? 0])}`;
    case 'rule-fail': return `${g}: ${formatRule(rules[e.rule ?? 0])} — ${ev['rule-fail']}`;
    case 'loop': return `${g} ${ev.loop}`;
    default: return `${g}: ${ev[e.kind as keyof typeof ev]}`;
  }
}

export const clauseText = (c: Literal[]) => formatClause(c);
export const literalText = (l: Literal) => formatLiteral(l);

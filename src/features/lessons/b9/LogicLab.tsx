import { useMemo, useState } from 'react';
import {
  PRESETS, displayName, dpllEntails, format, formatClause, formatRule, parse, parseLines, plBcEntails, plFcEntails,
  plResolution, ttEntails, walkSatEntails, LogicSyntaxError,
} from './logic-engine.js';
import { Verdict, bcCaption, fcCaption, scrollShield, tf, value } from './logic-view';
import { T } from './lesson09.text';

type PresetKey = keyof typeof PRESETS | 'custom';
type Method = keyof typeof T.lab.methods;
type Literal = { s: string; neg: boolean };
type Entry = { clause: Literal[]; from: { kind: string; index?: number }; parents: number[] | null; pivot: string | null };
const METHODS = Object.keys(T.lab.methods) as Method[];
const PRESET_KEYS = [...Object.keys(PRESETS), 'custom'] as PresetKey[];
const MAX_LINES = 60;

function errorText(error: unknown) {
  if (error instanceof LogicSyntaxError) return `${T.lab.errors[error.code]}${error.token ? ` “${error.token}”` : ''} · ${T.lab.errors.at} ${error.pos + 1}`;
  return String(error);
}

function TraceList({ lines, ordered = true }: { lines: { text: string; depth?: number; tone?: string }[]; ordered?: boolean }) {
  const shown = lines.slice(0, MAX_LINES);
  const List = ordered ? 'ol' : 'ul';
  return <div className="lg-trace" {...scrollShield} aria-label={T.lab.trace}>
    <List>{shown.map((l, i) => <li key={i} className={l.tone ? `lg-trace-${l.tone}` : ''} style={l.depth ? { paddingLeft: l.depth * 14 } : undefined}>{l.text}</li>)}</List>
    {lines.length > MAX_LINES && <p className="ls-note">+ {lines.length - MAX_LINES} {T.lab.more}</p>}
  </div>;
}

function ClauseList({ entries }: { entries: Entry[] }) {
  if (!entries.length) return <p className="ls-note">{T.lab.res.empty}</p>;
  return <ol className="lg-clauses">{entries.map((e, i) => <li key={i}><span className="mono">{formatClause(e.clause)}</span>
    <small>{e.from.kind === 'kb' ? `${T.lab.res.kb} ${(e.from.index ?? 0) + 1}` : T.lab.res.query}</small></li>)}</ol>;
}

export function LogicLab() {
  const [preset, setPreset] = useState<PresetKey>('wumpus');
  const [kbText, setKbText] = useState(PRESETS.wumpus.kb.join('\n'));
  const [queryText, setQueryText] = useState(PRESETS.wumpus.query);
  const [method, setMethod] = useState<Method>('tt');
  const [seed, setSeed] = useState(7);

  const choose = (key: PresetKey) => {
    setPreset(key);
    if (key !== 'custom') { setKbText(PRESETS[key].kb.join('\n')); setQueryText(PRESETS[key].query); }
  };
  const parsed = useMemo(() => parseLines(kbText), [kbText]);
  const query = useMemo(() => { try { return { ast: parse(queryText), error: null }; } catch (error) { return { ast: null, error }; } }, [queryText]);
  const kb = parsed.sentences.map((s: { ast: unknown }) => s.ast);
  const ready = !parsed.errors.length && query.ast;

  const result = useMemo(() => {
    if (!ready) return null;
    switch (method) {
      case 'tt': return { method, data: ttEntails(kb, query.ast) };
      case 'resolution': return { method, data: plResolution(kb, query.ast) };
      case 'fc': return { method, data: plFcEntails(kb, query.ast) };
      case 'bc': return { method, data: plBcEntails(kb, query.ast) };
      case 'dpll': return { method, data: dpllEntails(kb, query.ast) };
      default: return { method, data: walkSatEntails(kb, query.ast, { seed }) };
    }
  // kb and query are derived from the two texts, so the texts are the real dependencies.
  }, [ready, method, kbText, queryText, seed]);

  return <div className="card lg-lab">
    <div className="lg-lab-inputs">
      <label>{T.lab.preset}<select value={preset} onChange={(e) => choose(e.target.value as PresetKey)}>
        {PRESET_KEYS.map((k) => <option key={k} value={k}>{T.lab.presets[k]}</option>)}</select></label>
      <label className="lg-lab-kb">{T.lab.kb}<textarea rows={6} spellCheck={false} value={kbText}
        onChange={(e) => { setKbText(e.target.value); setPreset('custom'); }} {...scrollShield} /></label>
      <label>{T.lab.query}<input type="text" spellCheck={false} value={queryText}
        onChange={(e) => { setQueryText(e.target.value); setPreset('custom'); }} /></label>
      <p className="ls-note lg-lab-syntax">{T.lab.syntax}</p>
    </div>
    <div className="lg-tabs" role="group" aria-label={T.lab.method}>{METHODS.map((m) => <button key={m} type="button" aria-pressed={method === m}
      className={`btn ${method === m ? 'btn--toggle-on' : ''}`} onClick={() => setMethod(m)}>{T.lab.methods[m]}</button>)}</div>

    {(parsed.errors.length > 0 || Boolean(query.error)) && <ul className="lg-errors">
      {parsed.errors.map((e: { line: number; error: unknown; src: string }) => <li key={e.line}>{T.lab.errors.line} {e.line + 1}: {errorText(e.error)}</li>)}
      {Boolean(query.error) && <li>{T.lab.errors.query}: {errorText(query.error)}</li>}
    </ul>}

    {ready && <p className="lg-lab-sentences mono">{kb.map((s: unknown) => format(s)).join(' · ') || '∅'} <span className="lg-turnstile">⊨?</span> {format(query.ast)}</p>}

    {result && <div className="lg-lab-result">{renderResult(result, query.ast?.n ?? '')}
      {result.method === 'walksat' && <button type="button" className="btn" onClick={() => setSeed((s) => s + 1)}>{T.lab.ws.reseed}</button>}
    </div>}
    <button type="button" className="btn" onClick={() => { choose('wumpus'); setMethod('tt'); setSeed(7); }}>{T.lab.reset}</button>
  </div>;
}

function renderResult({ method, data }: { method: Method; data: any }, q: string) {
  if (method === 'tt') {
    if (data.status === 'too-many') return <p className="lg-warn">{data.symbols.length} {T.lab.tt.tooMany}</p>;
    const shown = data.rows.slice(0, 32);
    return <>
      <div className="lg-stats"><Verdict entailed={data.entailed} />
        <span>{T.lab.tt.models}: <b>{data.total}</b></span><span>{T.lab.tt.kbModels}: <b>{data.kbModels}</b></span>
        <span>{T.lab.tt.counter}: <b>{data.counterexamples}</b></span><span>{T.lab.tt.alpha} <b>{T.lab.tt.classes[data.alphaClass as keyof typeof T.lab.tt.classes]}</b></span></div>
      <h4>{T.lab.tt.rows} <small className="ls-note">{T.common.tf}</small></h4>
      <div className="lg-scroll" {...scrollShield} aria-label={T.lab.tt.rows}><table className="dtable lg-tt"><thead><tr>{data.symbols.map((s: string) => <th key={s}>{displayName(s)}</th>)}<th>α</th></tr></thead>
        <tbody>{shown.map((r: { model: Record<string, boolean>; alpha: boolean }, i: number) => <tr key={i} className={r.alpha ? '' : 'lg-row-bad'}>{data.symbols.map((s: string) => <td key={s}>{tf(r.model[s])}</td>)}<td><b>{tf(r.alpha)}</b></td></tr>)}</tbody></table></div>
      {data.rows.length > shown.length && <p className="ls-note">+ {data.rows.length - shown.length} {T.lab.tt.more}</p>}
    </>;
  }
  if (method === 'resolution') {
    const entries: Entry[] = data.entries;
    const proof: number[] = data.proof;
    const number = new Map(proof.map((idx, k) => [idx, k + 1]));
    const lines = proof.map((idx) => {
      const e = entries[idx];
      const from = e.parents ? `${number.get(e.parents[0])}, ${number.get(e.parents[1])} · ${T.lab.res.on} ${displayName(e.pivot ?? '')}` : e.from.kind === 'kb' ? `${T.lab.res.kb} ${(e.from.index ?? 0) + 1}` : T.lab.res.query;
      return [String(number.get(idx)), formatClause(e.clause), from];
    });
    return <>
      <div className="lg-stats"><Verdict entailed={data.entailed} /><span>{T.lab.res.generated}: <b>{data.generated}</b></span></div>
      <h4>{T.lab.res.clauses}</h4><ClauseList entries={entries.slice(0, data.initial)} />
      {data.status === 'proved' && <><h4>{T.lab.res.proof}</h4>
        <div className="lg-scroll" {...scrollShield} aria-label={T.lab.res.proof}><table className="dtable lg-proof"><tbody>{lines.map((l) => <tr key={l[0]} className={l[1] === '□' ? 'lg-row-new' : ''}><td>{l[0]}</td><td className="mono">{l[1]}</td><td>{l[2]}</td></tr>)}</tbody></table></div></>}
      {data.status === 'saturated' && <p className="lg-warn">{T.lab.res.saturated}</p>}
      {data.status === 'limit' && <p className="lg-warn">{T.lab.res.limit}</p>}
    </>;
  }
  if (method === 'fc' || method === 'bc') {
    if (data.status === 'bad-query') return <p className="lg-warn">{T.lab.fc.badQuery}</p>;
    if (data.status === 'not-definite') return <p className="lg-warn">{T.lab.fc.notDefinite} <span className="mono">{formatClause(data.clause)}</span> ({T.lab.res.kb} {data.sentence + 1} · {data.kind === 'goal' ? T.lab.fc.goal : T.lab.fc.nonHorn})</p>;
    const rules = data.rules;
    const lines = method === 'fc'
      ? data.trace.map((e: never) => ({ text: fcCaption(e, rules, q) }))
      : data.trace.map((e: { kind: string; stack: string[]; goal: string }) => ({ text: bcCaption(e as never, rules), depth: e.stack.length, tone: e.kind === 'loop' || e.kind === 'fail' || e.kind === 'rule-fail' ? 'bad' : e.kind === 'proved' || e.kind === 'fact' || e.kind === 'memo-true' ? 'good' : undefined }));
    return <>
      <div className="lg-stats"><Verdict entailed={data.entailed} /></div>
      {method === 'fc' && <><h4>{T.lab.fc.rules}</h4><ul className="lg-rules">{rules.map((r: { premise: string[] }, i: number) => <li key={i} className="mono">{formatRule(r as never)} <small>({r.premise.length})</small></li>)}</ul></>}
      <h4>{T.lab.trace}</h4><TraceList lines={lines} />
    </>;
  }
  if (method === 'dpll') {
    const clauses: Entry[] = data.clauses;
    const ev = T.lab.dp.events;
    const lines = data.trace.map((e: { kind: string; depth: number; symbol?: string; value?: boolean; clause?: number }) => {
      const sym = e.symbol ? `${displayName(e.symbol)} = ${value(Boolean(e.value))}` : '';
      const text = e.kind === 'unit' ? `${ev.unit} ${formatClause(clauses[e.clause ?? 0].clause)} → ${sym}`
        : e.kind === 'conflict' ? `${ev.conflict}: ${formatClause(clauses[e.clause ?? 0].clause)}`
        : e.kind === 'sat' ? ev.sat : `${ev[e.kind as 'pure' | 'split']} ${sym}`;
      return { text, depth: e.depth, tone: e.kind === 'conflict' ? 'bad' : e.kind === 'sat' ? 'good' : undefined };
    });
    return <>
      <div className="lg-stats"><Verdict entailed={data.entailed} /></div>
      <h4>{T.lab.res.clauses}</h4><ClauseList entries={clauses} />
      <h4>{T.lab.trace}</h4><TraceList lines={lines} />
      {data.truncated && <p className="ls-note">{T.lab.dp.truncated}</p>}
      <p className="lg-result-line">{data.satisfiable ? `${T.lab.dp.sat} ${Object.entries(data.model as Record<string, boolean>).map(([k, v]) => `${displayName(k)} = ${value(v)}`).join(', ')}` : T.lab.dp.unsat}</p>
    </>;
  }
  const W = T.lab.ws;
  const clauses: Entry[] = data.clauses;
  const lines = data.trace.map((e: { kind: string; symbol?: string; mode?: string; clause?: number; unsat: number; model: Record<string, boolean> }) => ({
    text: e.kind === 'start'
      ? `${W.start}: ${Object.entries(e.model).map(([k, v]) => `${displayName(k)}=${tf(v)}`).join(' ')} · ${e.unsat} ${W.unsat}`
      : `${W.flip} ${displayName(e.symbol ?? '')} (${e.mode === 'random' ? W.random : W.greedy}) ← ${formatClause(clauses[e.clause ?? 0].clause)} · ${e.unsat} ${W.unsat}`,
  }));
  return <>
    <div className="lg-stats"><Verdict entailed={data.entailed} /></div>
    <h4>{T.lab.trace}</h4><TraceList lines={lines} />
    <p className={data.status === 'model' ? 'lg-result-line' : 'lg-warn'}>{data.status === 'model' ? W.model : W.failure}</p>
  </>;
}

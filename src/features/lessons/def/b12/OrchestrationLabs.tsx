import { useMemo, useState } from 'react';
import { ScenarioTabs, useLessonLoop } from '../b7/LessonAnimation';
import { T } from './lesson12.text';
import { advancePool, canPublish, CHECK_TIME, INTERVALS, makeBatch, poolFrame, replacePartition, validateBatch } from './orchestration-engine';

export function LessonCode({ value, language = 'Python' }: { value: string; language?: string }) {
  // Tokenize source once; React escapes every token. Joining tokens reproduces the source.
  const tokens = value.split(/(#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:from|import|def|return|if|or|and|in|for|raise|as|True|False|None|true|false|null)\b|\b\d+(?:\.\d+)?\b|@[\w.]+|[{}\[\]():,])/g);
  return <div className="def12-code"><div className="mono def12-code-label">{language}</div><pre><code>{tokens.map((token, i) => {
    const isKey = language.startsWith('JSON') && /^"/.test(token) && /^\s*:/.test(tokens.slice(i + 1).join(''));
    const kind = isKey ? 'key' : /^#/.test(token) ? 'comment' : /^["']/.test(token) ? 'string' : /^\d/.test(token) ? 'number' : /^@|^(from|import|def|return|if|or|and|in|for|raise|as|True|False|None|true|false|null)$/.test(token) ? 'keyword' : 'plain';
    return <span key={i} className={`def12-token-${kind}`}>{token}</span>;
  })}</code></pre></div>;
}

export function SchedulerLab() {
  const [mode, setMode] = useState(1);
  const rows = mode ? T.labs.safeTimeline : T.labs.timeline;
  const { ref, step } = useLessonLoop(rows.length, String(mode), 2600);
  return <div className="def12-lab" data-testid="scheduler-lab" onKeyDown={event => { if ((event.target as HTMLElement).getAttribute('role') === 'tab') event.stopPropagation(); }}>
    <p className="kicker">{T.labs.demo}</p><h3>{T.labs.schedulerTitle}</h3><p>{T.labs.schedulerHelp}</p>
    <ScenarioTabs label={T.labs.schedulerTitle} options={T.labs.modes} selected={mode} onChange={setMode}>
      <div ref={ref} className="def12-timeline" data-step={step}>
        <div className="def12-clock" aria-hidden="true"><span className="mono">{rows[step][0]}</span><strong className={mode ? 'hl-green' : 'hl-yellow'}>{rows[step][2]}</strong></div>
        <div className="def12-table" tabIndex={0} role="region" aria-label={T.labs.schedulerTitle}><table className="dtable"><thead><tr>{T.labs.timelineHeaders.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i} className={i === step ? 'def12-current' : ''}>{row.map((cell, j) => j === 0 ? <th scope="row" key={j}>{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>
      </div>
    </ScenarioTabs><p className="def12-note">{T.labs.timelineNote}</p>
  </div>;
}

export function IntervalLab() {
  const [interval, setInterval] = useState(INTERVALS[0]);
  const [state, setState] = useState<{ partitions: Record<string, number>; attempts: number }>({ partitions: {}, attempts: 0 });
  return <div className="def12-lab def12-interval">
    <p className="kicker">{T.labs.demo}</p><p>{T.labs.idempotent}</p>
    <div className="def12-controls"><label>{T.labs.interval}<select value={interval} onChange={e => setInterval(e.target.value)}>{INTERVALS.map((date, i) => <option key={date} value={date}>{`[${date}, 2026-05-${16 - i})`}</option>)}</select></label><button className="btn btn--primary" onClick={() => setState(s => ({ partitions: replacePartition(s.partitions, interval), attempts: s.attempts + 1 }))}>{T.labs.publish}</button></div>
    <div className="def12-metrics" aria-live="polite"><div><span>{T.labs.rows}</span><strong>{Object.values(state.partitions).reduce((a, b) => a + b, 0)}</strong></div><div><span>{T.labs.attempts}</span><strong>{state.attempts}</strong></div></div>
    <LessonCode value={JSON.stringify(state.partitions, null, 2)} language="JSON / partitions" />
  </div>;
}

export function PoolLab() {
  const [limits, setLimits] = useState({ parallelism: 64, maxRuns: 1, slots: 5 });
  const [completed, setCompleted] = useState([0, 0]);
  const frame = poolFrame(completed, limits);
  const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
  const update = (key: keyof typeof limits, value: number) => { setLimits(current => ({ ...current, [key]: value })); setCompleted([0, 0]); };
  return <div className="def12-lab" data-testid="pool-lab">
    <p className="kicker">{T.labs.demo}</p><h3>{T.labs.poolTitle}</h3><p>{T.labs.poolHelp}</p>
    <div className="def12-controls">
      <label>{T.labs.capacity}<select value={limits.parallelism} onChange={e => update('parallelism', Number(e.target.value))}>{[1, 4, 16, 64].map(n => <option key={n}>{n}</option>)}</select></label>
      <label>{T.labs.runs}<select value={limits.maxRuns} onChange={e => update('maxRuns', Number(e.target.value))}>{[1, 2].map(n => <option key={n}>{n}</option>)}</select></label>
      <label>{T.labs.slots}<select value={limits.slots} onChange={e => update('slots', Number(e.target.value))}>{[1, 5, 10, 20].map(n => <option key={n}>{n}</option>)}</select></label>
    </div>
    <div className="def12-metrics" aria-live="polite">{[[T.labs.running, sum(frame.running)], [T.labs.waiting, sum(frame.waiting)], [T.labs.blocked, sum(frame.blocked)], [T.labs.done, sum(completed)]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className="def12-run-grid">{completed.map((done, r) => <div key={r}><h4>{T.labs.run} {r + 1} <small>{done}/100</small></h4><div className="def12-task-grid" aria-hidden="true">{Array.from({ length: 100 }, (_, i) => <i key={i} className={i < done ? 'is-done' : i < done + frame.running[r] ? 'is-running' : frame.blocked[r] ? 'is-blocked' : ''} />)}</div></div>)}</div>
    <div className="def12-slot-meter"><img src={`${import.meta.env.BASE_URL}frameworks/postgresql.svg`} alt="" /><span>{T.labs.poolEvidence}: <strong>{sum(frame.running)} / {limits.slots}</strong></span></div>
    <div className="def12-actions"><button className="btn btn--primary" disabled={sum(completed) === 200} onClick={() => setCompleted(current => advancePool(current, limits))}>{T.labs.tick}</button><button className="btn" onClick={() => setCompleted([0, 0])}>{T.labs.reset}</button></div>
    <p className="def12-note">{T.labs.poolNote}</p>
  </div>;
}

export function ValidationLab() {
  const [fault, setFault] = useState(0);
  const batch = useMemo(() => makeBatch(fault), [fault]);
  const [result, setResult] = useState<ReturnType<typeof validateBatch> | null>(null);
  const [published, setPublished] = useState(false);
  function choose(n: number) { setFault(n); setResult(null); setPublished(false); }
  function fix() { setFault(0); setResult(validateBatch(makeBatch(0))); setPublished(false); }
  const allowed = canPublish(batch, result);
  return <div className="def12-lab" data-testid="validation-lab">
    <p className="kicker">{T.labs.demo}</p><h3>{T.labs.gateTitle}</h3><p>{T.labs.gateHelp}</p>
    <label className="def12-fault-label">{T.labs.evidence}<select value={fault} onChange={e => choose(Number(e.target.value))}>{T.labs.faults.map((name, i) => <option key={name} value={i}>{name}</option>)}</select></label>
    <LessonCode value={JSON.stringify({ check_time: CHECK_TIME, ...batch }, null, 2)} language="JSON / batch" />
    <div className="def12-actions"><button className="btn btn--primary" onClick={() => { setResult(validateBatch(batch)); setPublished(false); }}>{T.labs.check}</button><button className="btn" disabled={fault === 0} onClick={fix}>{T.labs.fix}</button><button className="btn" disabled={!allowed || published} onClick={() => { if (canPublish(batch, result)) setPublished(true); }}>{T.labs.export}</button></div>
    <p role="status" className={`def12-verdict ${result && !result.pass ? 'is-failed' : ''}`}>{published ? T.labs.published : result ? result.pass ? T.labs.pass : T.labs.fail : T.labs.unchecked}</p>
    {result && <div className="def12-table" tabIndex={0} role="region" aria-label={T.labs.evidence}><table className="dtable"><thead><tr>{T.labs.ruleHeaders.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{result.checks.map((check, i) => <tr key={i}><th scope="row">{T.labs.rules[i]}<small>{T.labs.expected}: {check.expected}</small></th><td>{check.observed}</td><td className={check.pass ? 'hl-green' : 'hl-red'}>{check.pass ? `✓ ${T.labs.pass}` : `✕ ${T.labs.fail}`}</td></tr>)}</tbody></table></div>}
    <div className="def12-lineage" aria-label={T.labs.gateTitle}><div className="def12-lineage-source">{T.labs.lineage[0]}</div><div className={`def12-gate ${published ? 'is-open' : ''}`}><span aria-hidden="true">{published ? '↓' : '⊥'}</span>{published ? T.labs.published : result && !result.pass ? T.labs.quarantined : result?.pass ? T.labs.export : T.labs.pending}</div><div className="def12-consumers">{T.labs.lineage.slice(1).map(name => <div key={name}><strong>{name}</strong><span>{published ? T.labs.consumerReady : T.labs.consumerBlocked}</span></div>)}</div></div>
    <p className="def12-note">{T.labs.gateNote}</p>
  </div>;
}

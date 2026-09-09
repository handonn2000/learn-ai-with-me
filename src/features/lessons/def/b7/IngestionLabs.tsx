import { useMemo, useState } from 'react';
import { T } from './lesson07.text';
import { LoopProgress, ScenarioTabs, useLessonLoop } from './LessonAnimation';
import { EVENTS, initialRouting, sendEvent, readGroup, crashTrace, cdcCapture, retainedLog, RETENTION_LOG, type RoutingState } from './ingestion-engine';
import './IngestionLabs.css';

const L = T.lab;
const GROUPS = ['Analytics', 'Fraud'];

function LabLogo({ brand, name }: { brand: 'kafka' | 'postgresql'; name: string }) {
  return <span className={`def-lab-logo def-lab-logo--${brand}`}><img src={`${import.meta.env.BASE_URL}frameworks/${brand}.svg`} alt="" width="32" height="32" loading="lazy" /><strong>{name}</strong></span>;
}

type RoutingFrame = { state: RoutingState; activeGroup: number | null };
function routingTrace(keyed: boolean): RoutingFrame[] {
  let state = initialRouting(3);
  const trace: RoutingFrame[] = [{ state, activeGroup: null }];
  for (const _event of EVENTS) {
    state = sendEvent(state, keyed);
    trace.push({ state, activeGroup: null });
  }
  for (let group = 0; group < GROUPS.length; group++) {
    while (state.logs.some((log, p) => state.commits[group][p] < log.length)) {
      state = readGroup(state, group);
      trace.push({ state, activeGroup: group });
    }
  }
  trace.push({ state: { ...state, action: 3 }, activeGroup: null });
  return trace;
}

export function RoutingLab() {
  const [scenario, setScenario] = useState(0);
  const keyed = scenario !== 1, consumers = scenario === 2 ? 4 : 3;
  const trace = useMemo(() => routingTrace(keyed), [keyed]);
  const loop = useLessonLoop(trace.length, `routing-${scenario}`, 2200);
  const { state: s, activeGroup } = trace[loop.step];
  const complete = trace[trace.length - 1].state;
  return <div ref={loop.ref}><section className="def-lab def-routing-lab" aria-labelledby="routing-title" id="routing-lab">
    <span className="kicker">{L.model}</span><h3 id="routing-title">{L.routingTitle}</h3><p>{L.routingHelp}</p>
    <ScenarioTabs label={L.key} options={[L.keyed, L.unkeyed, L.extraConsumers]} selected={scenario} onChange={setScenario}>
      <div className="def-routing-caption"><LabLogo brand="kafka" name="Apache Kafka" /><span>{L.partitions}: <strong>3</strong> · {L.consumers}: <strong>{consumers}</strong></span></div>
      <div className="def-producer-spool">
        <span className="def-spool-label">{L.producer}<small>{L.event}: {s.sent} / {EVENTS.length}</small></span>
        <ol>{EVENTS.map((e, i) => <li key={e.id} className={`${i < s.sent ? 'is-sent' : ''} ${i === s.sent - 1 && s.action === 1 ? 'is-sending' : ''}`}>
          <span className="mono">{e.id}</span><strong>{e.key}<span>:{e.value}</span></strong>
        </li>)}</ol>
      </div>
      <div className="def-partition-tracks">{complete.logs.map((log, p) => <div className="def-partition-track" key={p}>
        <div className="def-partition-label"><strong className="mono">P{p}</strong><span>{L.consumer} {p % consumers}</span></div>
        <div className="def-track-records">{log.map((e) => {
          const present = e.offset < s.logs[p].length;
          const fresh = s.action === 1 && e.id === EVENTS[s.sent - 1]?.id;
          return <div key={e.id} className={`def-track-slot ${present ? 'is-present' : ''} ${fresh ? 'is-arriving' : ''}`}>
            <small>{L.offset} <b>{e.offset}</b></small>
            <div className="def-track-event">{present ? <><span>{e.id}</span><strong>{e.key}<span>:{e.value}</span></strong></> : <span className="def-track-pending">{L.pending}</span>}</div>
          </div>;
        })}</div>
      </div>)}</div>
      <h4 className="def-reader-title">{L.groupProgress}</h4>
      <div className="def-reader-groups">{GROUPS.map((name, g) => {
        const lag = s.logs.reduce((n, log, p) => n + log.length - s.commits[g][p], 0);
        return <div key={name} className={`def-reader-group ${activeGroup === g ? 'is-reading' : ''}`}>
          <div className="def-reader-heading"><strong>{name}</strong><span>{L.lag}: <b>{lag}</b></span></div>
          {complete.logs.map((log, p) => <div className="def-reader-row" key={p}>
            <span className="mono">P{p} → C{p % consumers}</span>
            <span className="def-reader-segments" aria-hidden="true">{log.map((e) => <i key={e.id} className={e.offset < s.commits[g][p] ? 'is-read' : ''} />)}</span>
            <span className="mono">{s.commits[g][p]}<small> / {s.logs[p].length}</small></span>
          </div>)}
          <small className="def-reader-legend">{L.commit} / log end</small>
          {consumers > 3 && <p className="def-idle-consumer"><span className="mono">C3</span><span>{L.idle}</span></p>}
        </div>;
      })}</div>
      <p className="def-loop-caption">{activeGroup !== null && <strong>{GROUPS[activeGroup]} · </strong>}{L.routingSteps[s.action]}</p>
      <LoopProgress step={loop.step} length={trace.length} />
    </ScenarioTabs>
    <p>{L.routingNote}</p>
    <details><summary>{L.trace}</summary>
      <div className="def-table-wrap"><table className="dtable"><thead><tr><th>{L.event}</th><th>{L.key}</th><th>{L.partition}</th><th>{L.offset}</th></tr></thead><tbody>{complete.logs.flat().sort((a, b) => a.id.localeCompare(b.id)).map((e) => <tr key={e.id}><td>{e.id}</td><td>{e.key}</td><td>{e.partition}</td><td>{e.offset}</td></tr>)}</tbody></table></div>
      <div className="def-table-wrap"><table className="dtable"><thead><tr><th>{L.step}</th><th>{L.action}</th><th>Analytics · P0/P1/P2</th><th>Fraud · P0/P1/P2</th></tr></thead><tbody>{trace.map((f, i) => <tr key={i}><td>{i + 1}</td><td>{f.activeGroup !== null && <strong>{GROUPS[f.activeGroup]} · </strong>}{L.routingSteps[f.state.action]}</td><td className="mono">{f.state.commits[0].join(' / ')}</td><td className="mono">{f.state.commits[1].join(' / ')}</td></tr>)}</tbody></table></div>
    </details>
  </section></div>;
}

export function CrashLab() {
  const [before, setBefore] = useState(false), [after, setAfter] = useState(true), [safe, setSafe] = useState(false);
  const trace = crashTrace(before, after, safe);
  const loop = useLessonLoop(trace.length, `${before}-${after}-${safe}`, 2200);
  const frame = trace[loop.step];
  const finished = frame.action === 8;
  return <div ref={loop.ref}><section className="def-lab def-crash-lab" id="crash-lab" aria-labelledby="crash-title">
    <span className="kicker">{L.model}</span><h3 id="crash-title">{L.crashTitle}</h3><p>{L.crashHelp}</p>
    <ScenarioTabs label={L.commit} options={[L.commitBefore, L.commitAfter]} selected={before ? 0 : 1} onChange={(n) => setBefore(n === 0)}>
      <ScenarioTabs label={L.action} options={[L.crashBefore, L.crashAfter]} selected={after ? 1 : 0} onChange={(n) => setAfter(n === 1)}>
        <ScenarioTabs label={L.state} options={[L.plain, L.dedup]} selected={safe ? 1 : 0} onChange={(n) => setSafe(n === 1)}>
          <div className={`def-receipt-scene ${frame.action === 3 ? 'is-crashed' : ''}`}>
            <div className="def-event-ticket">
              <LabLogo brand="kafka" name={L.event} />
              <strong className="def-ticket-id mono">e1</strong><span className="mono">{L.offset} 0</span>
              <div className="def-ticket-effect mono">+10</div>
              <small>log end = 1</small>
            </div>
            <div className="def-receipt-ledger">
              <h4>{L.effect}</h4>
              <div className="def-receipts">{[0, 1].map((i) => <div key={i} aria-hidden={frame.balance < (i + 1) * 10} className={`def-effect-receipt ${frame.balance >= (i + 1) * 10 ? 'is-applied' : ''} ${i === 1 ? 'is-duplicate' : ''}`}>
                <div className="def-receipt-rule" /><small className="mono">e1</small><strong className="mono">+10</strong><span>{L.applied}</span>
              </div>)}</div>
              <div className="def-ledger-total"><span>{L.balance}</span><strong className={frame.balance > 10 ? 'is-duplicate' : ''}>{frame.balance}</strong></div>
              <p className="def-durable-id">{safe ? <>{L.durableId}: <strong className="mono">{frame.applied ? 'e1' : '∅'}</strong></> : L.plain}</p>
            </div>
            <div className="def-commit-ticket">
              <h4>{L.commit}</h4><div className="def-commit-holes" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
              <strong className="mono">{frame.committed}</strong>
              <div className="def-commit-track"><span className={frame.committed === 0 ? 'is-current' : ''}>0</span><span aria-hidden="true">→</span><span className={frame.committed === 1 ? 'is-current' : ''}>1</span></div>
              <small className="mono">e1 {frame.committed ? '✓' : '…'}</small>
            </div>
          </div>
          <ol className="def-crash-filmstrip" aria-label={L.trace}>{trace.map((f, i) => <li key={i} className={`${i === loop.step ? 'is-current' : ''} ${i < loop.step ? 'is-past' : ''}`} aria-current={i === loop.step ? 'step' : undefined}>
            <span aria-hidden="true">{f.action === 3 ? '×' : f.action === 4 ? '↻' : f.action === 8 ? '✓' : i + 1}</span><span className="def-sr-only">{L.step} {i + 1}: {L.crashSteps[f.action]}</span>
          </li>)}</ol>
          <p className="def-loop-caption">{L.crashSteps[frame.action]}</p>
          <div className={`def-crash-outcome ${finished ? 'is-visible' : ''} ${frame.balance === 10 ? 'is-correct' : ''}`}>{finished ? <strong>{L.crashOutcomes[frame.balance / 10]}</strong> : <span>{L.result} · …</span>}</div>
          <LoopProgress step={loop.step} length={trace.length} />
        </ScenarioTabs>
      </ScenarioTabs>
    </ScenarioTabs>
    <details><summary>{L.trace}</summary><div className="def-table-wrap"><table className="dtable"><thead><tr><th>{L.step}</th><th>{L.action}</th><th>{L.balance}</th><th>{L.commit}</th></tr></thead><tbody>{trace.map((f, i) => <tr key={i}><td>{i + 1}</td><td>{L.crashSteps[f.action]}</td><td>{f.balance}</td><td>{f.committed}</td></tr>)}</tbody></table></div></details>
  </section></div>;
}

function RetentionAnimation() {
  const [policy, setPolicy] = useState(0);
  const loop = useLessonLoop(6, `retention-${policy}`, 1900);
  const kept = retainedLog(policy);
  const currentlyKept = RETENTION_LOG.filter((r, i) => loop.step <= i || kept.includes(r));
  return <div ref={loop.ref} className="def-retention-animation">
    <h4>{L.retentionTitle}</h4><p>{L.retentionHelp}</p>
    <ScenarioTabs label={L.state} options={L.retentionModes} selected={policy} onChange={setPolicy}>
      <div className="def-retention-reel">
        {RETENTION_LOG.map((r, i) => {
          const inspected = loop.step > i, removed = inspected && !kept.includes(r);
          return <div className={`def-archive-slot ${removed ? 'is-pruned' : ''} ${inspected ? 'is-inspected' : ''} ${loop.step === i + 1 ? 'is-inspecting' : ''}`} key={r.offset}>
            <span className="def-archive-offset mono">{L.offset} <strong>{r.offset}</strong></span>
            <div className="def-archive-record"><span className="def-archive-key mono">{r.key}</span><strong className="mono">{r.value}</strong><small>{L.days}: {r.age}</small><small className="mono">1 MB</small></div>
            <span className="def-archive-verdict">{inspected ? removed ? L.pruned : '✓' : '…'}</span>
          </div>;
        })}
      </div>
      <p className="def-loop-caption">{L.retentionPhases[loop.step === 0 ? 0 : loop.step === 5 ? 2 : 1]}<br /><strong>{L.retained}: <span className="mono">{currentlyKept.map((r) => r.offset).join(', ')}</span></strong></p>
      <LoopProgress step={loop.step} length={6} />
    </ScenarioTabs>
    <p>{L.retentionNote}</p>
    <details><summary>{L.trace}</summary><div className="def-table-wrap"><table className="dtable"><thead><tr><th>{L.offset}</th><th>{L.key}</th><th>{L.value}</th><th>{L.days}</th><th>{L.result}</th></tr></thead><tbody>{RETENTION_LOG.map((r) => <tr key={r.offset}><td>{r.offset}</td><td>{r.key}</td><td>{r.value}</td><td>{r.age}</td><td>{kept.includes(r) ? L.retained : L.pruned}</td></tr>)}</tbody></table></div></details>
  </div>;
}

export function CdcLab() {
  const [mode, setMode] = useState(0);
  const loop = useLessonLoop(5, `cdc-${mode}`, 2600);
  const step = Math.min(loop.step, 3);
  const captured = cdcCapture(step, mode);
  return <section className="def-lab def-cdc-lab" id="cdc-lab" aria-labelledby="cdc-title">
    <span className="kicker">{L.model}</span><h3 id="cdc-title">{L.cdcTitle}</h3><p>{L.cdcHelp}</p>
    <div ref={loop.ref}>
      <ScenarioTabs label={L.captured} options={L.cdcModes} selected={mode} onChange={setMode}>
        <div className="def-cdc-scene">
          <div className={`def-source-cylinder ${step === 3 ? 'is-deleted' : ''}`}>
            <LabLogo brand="postgresql" name="PostgreSQL" /><h4>{L.sourceRow}</h4>
            <div className="def-source-code mono">{step === 0 || step === 3 ? <span className="def-code-null">∅</span> : <><div><span className="def-code-key">id</span>: <span className="def-code-number">42</span></div><div><span className="def-code-key">amount</span>: <span className="def-code-number">{step === 1 ? 10 : 12}</span></div><div><span className="def-code-key">updated_at</span>: <span className="def-code-number">{step}</span></div></>}</div>
          </div>
          <div className="def-cdc-pipe" aria-hidden="true"><span /><span /><span /><b>→</b></div>
          <div className="def-change-stream"><h4>{L.captured}</h4><ol>{[0, 1, 2].map((i) => {
            const e = captured[i];
            return <li key={`${mode}-${i}`} className={`def-change-card ${e ? 'is-captured' : ''} ${e?.op === 'DELETE' ? 'is-delete' : ''}`}>
              {e ? <><strong className="def-change-op mono">{mode === 0 ? 'UPSERT' : e.op}</strong><code><span className="def-code-key">id</span>: <span className="def-code-number">42</span><br /><span className="def-code-key">amount</span>: <span className={e.op === 'DELETE' ? 'def-code-null' : 'def-code-number'}>{e.amount}</span></code></> : <><span className="def-change-empty">{step === 3 && mode === 0 && i === 2 ? '∅ DELETE' : '· · ·'}</span><small>{step === 3 && mode === 0 && i === 2 ? L.notCaptured : step === 0 ? L.empty : L.pending}</small></>}
            </li>;
          })}</ol></div>
        </div>
        <p className="def-loop-caption">{L.cdcSteps[step]}</p>
        <p className={`def-cdc-delete-note ${mode === 0 && step === 3 ? 'is-visible' : ''}`}>{mode === 0 && step === 3 ? <strong>{L.missedDelete}</strong> : <span aria-hidden="true"> </span>}</p>
        <LoopProgress step={loop.step} length={5} />
      </ScenarioTabs>
    </div>
    <details><summary>{L.trace}</summary><ol>{L.cdcSteps.map((s) => <li key={s}>{s}</li>)}</ol></details>
    <RetentionAnimation />
  </section>;
}

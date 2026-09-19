import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { LOCALE } from '@/lib/locale';
import { L } from './storage-labs.text';
import { BRONZE, GOVERNANCE_CONTROLS, GOVERNANCE_ISSUES, emptyPolicy, governanceStatus, hdfsTrace, pipelineTrace, type PipelineFrame } from './storage-engine';
import './StorageLabs.css';

/** One clock per visible illustration. A hidden lesson/deck panel owns no timer. */
function useLessonLoop(length: number, scenario: string, intervalMs = 2400) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(() => !document.hidden);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [frame, setFrame] = useState({ scenario, step: 0 });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(element);
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const motionChanged = () => setReduced(media.matches);
    const visibilityChanged = () => setForeground(!document.hidden);
    media.addEventListener('change', motionChanged);
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => { observer.disconnect(); media.removeEventListener('change', motionChanged); document.removeEventListener('visibilitychange', visibilityChanged); };
  }, []);
  useEffect(() => { setFrame({ scenario, step: 0 }); }, [scenario]);
  const running = visible && foreground && !reduced;
  useEffect(() => {
    if (ref.current) ref.current.dataset.loopState = reduced ? 'reduced' : running ? 'running' : 'suspended';
    if (!running) return;
    const timer = window.setInterval(() => setFrame(current => ({ scenario, step: ((current.scenario === scenario ? current.step : 0) + 1) % length })), intervalMs);
    return () => window.clearInterval(timer);
  }, [running, reduced, length, scenario, intervalMs]);
  return { ref, reduced, step: reduced ? length - 1 : frame.scenario === scenario ? Math.min(frame.step, length - 1) : 0 };
}

function ScenarioTabs({ options, selected, onChange, children }: { options: string[]; selected: number; onChange: (n: number) => void; children: ReactNode }) {
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % options.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + options.length) % options.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else return;
    event.preventDefault(); event.stopPropagation(); onChange(next); buttons.current[next]?.focus();
  }
  return <div className="def8-scenarios">
    <div className="def8-tabs" role="tablist" aria-label={L.common.scenario}>{options.map((option, i) => <button key={option} ref={element => { buttons.current[i] = element; }} type="button" role="tab" id={`${id}-tab-${i}`} aria-selected={selected === i} aria-controls={`${id}-panel`} tabIndex={selected === i ? 0 : -1} onKeyDown={event => navigate(event, i)} onClick={() => onChange(i)}>{option}</button>)}</div>
    <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${selected}`}>{children}</div>
  </div>;
}
function LoopNote({ reduced }: { reduced: boolean }) { return <p className="def8-loop-note">{reduced ? L.common.static : L.common.loop}</p>; }
function money(value: number) { return new Intl.NumberFormat(LOCALE === 'en' ? 'en-US' : 'vi-VN').format(value); }
function Fixture() { return <span className="def8-fixture">{L.common.fixture}</span>; }

export function StorageExplorer() {
  const [mode, setMode] = useState(0);
  const loop = useLessonLoop(4, `storage-${mode}`);
  const entry = L.storage.cases[mode];
  const phase = Math.min(loop.step, 2);
  return <div ref={loop.ref}><section className="def8-lab" id="storage-explorer" aria-labelledby="storage-explorer-title">
    <Fixture /><h3 id="storage-explorer-title">{L.storage.title}</h3><p>{L.storage.help}</p>
    <ScenarioTabs options={L.storage.tabs} selected={mode} onChange={setMode}>
      <div className="def8-storage-scene">
        <div className={`def8-access-card ${phase === 0 ? 'is-active' : ''}`}><span>{L.storage.address}</span><code>{entry.location}</code></div>
        <div className="def8-storage-device" aria-hidden="true">
          {mode === 0 ? <div className="def8-file-tree"><span>orders/</span><span>└ 2026/09/08/</span><strong className={phase > 0 ? 'is-active' : ''}>└ 101.json</strong></div> : mode === 1 ? <div className="def8-block-grid">{Array.from({ length: 12 }, (_, i) => <span key={i} className={i === 4 && phase > 0 ? 'is-active' : ''}>{2044 + i}</span>)}</div> : <div className="def8-object-bucket"><span>orders-bucket</span><div className={phase > 0 ? 'is-active' : ''}><strong>exports/101.json</strong><small>key + metadata + payload</small></div></div>}
        </div>
        <div className={`def8-payload ${phase === 2 ? 'is-active' : ''}`}><span>{L.storage.payload}</span><pre><code>{'{\n  '}<span className="def8-code-key">"order_id"</span>{': '}<span className="def8-code-number">101</span>{',\n  '}<span className="def8-code-key">"amount"</span>{': '}<span className="def8-code-number">120000</span>{'\n}'}</code></pre></div>
      </div>
      <p className="def8-caption"><strong>{phase + 1} / 3 · </strong>{entry.phases[phase]}</p>
      <dl className="def8-explanations"><div><dt>{L.common.metadata}</dt><dd>{entry.meta}</dd></div><div><dt>{L.storage.update}</dt><dd>{entry.unit}</dd></div><div><dt>{L.common.tradeoff}</dt><dd>{entry.fit}</dd></div></dl>
      <ol className="def8-static-phases">{entry.phases.map((text, i) => <li key={text} className={phase === i ? 'is-current' : ''}>{text}</li>)}</ol>
    </ScenarioTabs><LoopNote reduced={loop.reduced} /><p className="def8-small">{L.storage.note}</p>
  </section></div>;
}

export function HdfsReadVisual() {
  const [mode, setMode] = useState(0);
  const trace = hdfsTrace(mode === 1);
  const loop = useLessonLoop(trace.length, `hdfs-${mode}`);
  const frame = trace[loop.step];
  const metadata = frame.route === 'metadata-request' || frame.route === 'metadata-response';
  return <div ref={loop.ref}><section className="def8-lab" id="hdfs-read" aria-labelledby="hdfs-read-title">
    <Fixture /><h3 id="hdfs-read-title">{L.hdfs.title}</h3><p>{L.hdfs.help}</p>
    <ScenarioTabs options={L.hdfs.tabs} selected={mode} onChange={setMode}>
      <div className="def8-hdfs-scene">
        <div className={`def8-hdfs-client ${frame.bytesAtClient ? 'is-received' : ''}`}><strong>{L.hdfs.client}</strong><code>/orders/day.parquet</code><span className="def8-client-bytes">{frame.bytesAtClient ? '101 · 120000' : '…'}</span><small>{frame.bytesAtClient ? L.hdfs.received : L.hdfs.waiting}</small></div>
        <div className={`def8-metadata-wire ${metadata ? 'is-active' : ''}`}><span aria-hidden="true">{frame.route === 'metadata-request' ? '→' : '←'}</span><small>{L.hdfs.metadataPath}</small></div>
        <div className={`def8-namenode ${metadata ? 'is-active' : ''}`}><strong>{L.hdfs.namenode}</strong><code>blk_01 → A / B</code><small>{L.hdfs.permission} · rw-r-----</small></div>
        <div className={`def8-data-wire ${frame.source !== 'none' ? 'is-active' : ''}`}><span aria-hidden="true">{frame.bytesAtClient ? '←' : '→'}</span><small>{L.hdfs.bytePath}</small></div>
        <div className="def8-hdfs-racks">{['A', 'B'].map((node, i) => <div key={node} className={`def8-rack ${frame.source === node ? 'is-active' : ''} ${mode === 1 && node === 'A' && loop.step >= 4 ? 'is-unavailable' : ''}`}>
          <span>{L.hdfs.rack} {i + 1}</span><strong>{L.hdfs.datanode} {node}</strong><div className="def8-block-replica"><small>{L.hdfs.block}</small><code>blk_01</code></div><small>{mode === 1 && node === 'A' && loop.step >= 4 ? L.hdfs.unavailable : L.hdfs.stored}</small>
        </div>)}</div>
      </div>
      <p className="def8-caption">{L.hdfs.routes[frame.route]}</p>
      <ol className="def8-static-phases">{trace.slice(0, -1).map((item, i) => <li key={`${item.route}-${i}`} className={loop.step === i ? 'is-current' : ''}>{L.hdfs.routes[item.route]}</li>)}</ol>
    </ScenarioTabs><LoopNote reduced={loop.reduced} /><p className="def8-small">{L.hdfs.note}</p>
  </section></div>;
}

function ModelTable({ title, name, fields, className = '' }: { title: string; name: string; fields: string[]; className?: string }) {
  return <div className={`def8-model-table ${className}`}><span>{title}</span><strong className="mono">{name}</strong><ul>{fields.map(field => <li key={field}><code>{field}</code></li>)}</ul></div>;
}
export function ModelingVisual() {
  const [mode, setMode] = useState(0);
  return <section className="def8-lab" id="modeling-visual" aria-labelledby="modeling-visual-title">
    <Fixture /><h3 id="modeling-visual-title">{L.modeling.title}</h3><p>{L.modeling.help}</p>
    <ScenarioTabs options={L.modeling.tabs} selected={mode} onChange={setMode}>
      <div className={`def8-model-scene ${mode ? 'is-snowflake' : ''}`}>
        <ModelTable className="def8-model-fact" title={L.modeling.fact} name="fact_order_line" fields={['PK order_line_id', 'FK product_id', 'FK customer_id', 'FK date_id', 'amount_vnd']} />
        <div className="def8-dimension-branches">
          <div className="def8-dimension-branch"><div className="def8-join-label"><span aria-hidden="true">→</span><code>product_id</code></div><ModelTable title={L.modeling.product} name="dim_product" fields={mode ? ['PK product_id', 'product_name', 'FK category_id'] : ['PK product_id', 'product_name', 'category_name']} />
            {mode === 1 && <><div className="def8-join-label"><span aria-hidden="true">→</span><code>category_id</code></div><ModelTable className="def8-category-table" title={L.modeling.category} name="dim_category" fields={['PK category_id', 'category_name']} /></>}
          </div>
          <div className="def8-dimension-branch"><div className="def8-join-label"><span aria-hidden="true">→</span><code>customer_id</code></div><ModelTable title={L.modeling.customer} name="dim_customer" fields={['PK customer_id', 'customer_name']} /></div>
          <div className="def8-dimension-branch"><div className="def8-join-label"><span aria-hidden="true">→</span><code>date_id</code></div><ModelTable title={L.modeling.date} name="dim_date" fields={['PK date_id', 'calendar_date']} /></div>
        </div>
      </div><p className="def8-small">{L.modeling.join}</p><p className="def8-caption">{mode ? L.modeling.snowflake : L.modeling.star}</p>
    </ScenarioTabs><p className="def8-small">{L.modeling.note}</p>
  </section>;
}

export function GovernanceLab() {
  const [policy, setPolicy] = useState(emptyPolicy);
  return <section className="def8-lab" id="governance-lab" aria-labelledby="governance-title">
    <Fixture /><h3 id="governance-title">{L.governance.title}</h3><p>{L.governance.help}</p>
    <fieldset className="def8-governance-controls"><legend>{L.governance.policy}</legend>{GOVERNANCE_CONTROLS.map(control => <label key={control} className={policy[control] ? 'is-enabled' : ''}><input type="checkbox" checked={policy[control]} onChange={event => setPolicy(current => ({ ...current, [control]: event.target.checked }))} /><strong>{L.governance.controls[control]}</strong><span>{L.governance.effects[control]}</span></label>)}</fieldset>
    <div className="def8-issue-list">{GOVERNANCE_ISSUES.map(issue => {
      const status = governanceStatus(issue, policy), text = L.governance.issues[issue];
      return <article key={issue} className={`def8-issue is-${status}`}><div><span className="def8-issue-status">{L.governance.statuses[status]}</span><h4>{text.label}</h4><code>{text.dataset}</code></div><p>{text[status]}</p></article>;
    })}</div><p className="def8-caption">{L.governance.conclusion}</p>
  </section>;
}

function SmallTable({ headers, children, empty }: { headers: string[]; children: ReactNode; empty: boolean }) {
  return <div className="def8-table-wrap"><table><thead><tr>{headers.map(header => <th key={header}>{header}</th>)}</tr></thead><tbody>{empty ? <tr><td colSpan={headers.length} className="def8-empty">{L.common.empty}</td></tr> : children}</tbody></table></div>;
}
export function MedallionLab() {
  const [trace, setTrace] = useState<PipelineFrame[]>(() => pipelineTrace());
  const [step, setStep] = useState(0);
  const [replays, setReplays] = useState(0);
  const frame = trace[step], state = frame.state, complete = step === trace.length - 1;
  function replay() { setTrace(pipelineTrace(state)); setStep(0); setReplays(value => value + 1); }
  function reset() { setTrace(pipelineTrace()); setStep(0); setReplays(0); }
  return <section className="def8-lab" id="medallion-lab" aria-labelledby="medallion-title">
    <Fixture /><h3 id="medallion-title">{L.medallion.title}</h3><p>{L.medallion.help}</p>
    <div className="def8-lab-controls"><button type="button" onClick={() => setStep(value => value + 1)} disabled={complete}>{L.medallion.next}</button><button type="button" onClick={() => setStep(trace.length - 1)} disabled={complete}>{L.medallion.run}</button><button type="button" onClick={replay} disabled={!complete}>{L.medallion.replay}</button><button type="button" onClick={reset}>{L.medallion.reset}</button></div>
    <p className="def8-caption" role="status">{step === 0 ? replays ? L.medallion.replayReady : L.medallion.ready : <>{frame.rawId && <strong>{frame.rawId} · </strong>}{L.medallion.actions[frame.action]}</>}</p>
    <div className="def8-pipeline-metrics"><div><span>Bronze</span><strong>{BRONZE.length}</strong></div><div><span>Silver</span><strong>{state.silver.length}</strong></div><div><span>Quarantine</span><strong>{state.quarantine.length}</strong></div><div><span>{L.medallion.duplicate}</span><strong>{state.duplicates.length}</strong></div><div className="def8-gold-metric"><span>{L.medallion.gold}</span><strong>{money(state.gold)} <small>VND</small></strong></div></div>
    <div className="def8-bronze-panel"><h4>{L.medallion.bronze}</h4><SmallTable headers={[L.medallion.rawId, L.medallion.orderId, L.medallion.amount, 'load_time', 'process_id']} empty={false}>{BRONZE.map(row => <tr key={row.rawId} className={frame.rawId === row.rawId ? 'is-current' : ''}><td><strong>{row.rawId}</strong></td><td className={row.orderId === null ? 'def8-invalid' : ''}>{row.orderId ?? 'null'}</td><td className={typeof row.amount === 'string' ? 'def8-invalid' : ''}>{typeof row.amount === 'number' ? money(row.amount) : row.amount}</td><td className="mono">{row.loadTime}</td><td className="mono">{row.processId}</td></tr>)}</SmallTable></div>
    <div className="def8-output-ledgers">
      <div><h4>{L.medallion.silver}</h4><SmallTable headers={[L.medallion.orderId, L.medallion.amount, L.medallion.rawId]} empty={!state.silver.length}>{state.silver.map(row => <tr key={row.orderId}><td>{row.orderId}</td><td>{money(row.amount)}</td><td>{row.rawId}</td></tr>)}</SmallTable></div>
      <div><h4>{L.medallion.quarantine}</h4><SmallTable headers={[L.medallion.rawId, L.medallion.reason]} empty={!state.quarantine.length}>{state.quarantine.map(row => <tr key={row.rawId}><td>{row.rawId}</td><td>{L.medallion.reasons[row.reason]}</td></tr>)}</SmallTable></div>
      <div><h4>{L.medallion.duplicate}</h4><SmallTable headers={[L.medallion.rawId, L.medallion.original, L.medallion.orderId]} empty={!state.duplicates.length}>{state.duplicates.map(row => <tr key={row.rawId}><td>{row.rawId}</td><td>{row.originalRawId}</td><td>{row.orderId}</td></tr>)}</SmallTable></div>
    </div>
    <div className="def8-processing-ledger"><strong>{L.medallion.processed}</strong><code>{state.processed.join(' · ') || '∅'}</code><span>{L.medallion.replayCount}: {replays}</span><span>{complete ? L.medallion.completed : L.medallion.aggregatePending}</span></div>
    <p><strong>{L.medallion.invariant}</strong></p><p className="def8-small">{L.medallion.boundary}</p><p className="def8-small">{L.medallion.idempotency}</p>
    <details className="def8-trace"><summary>{L.medallion.ledger}</summary><SmallTable headers={[L.common.step, L.medallion.rawId, L.common.action, 'Silver', 'Quarantine', 'Gold (VND)']} empty={false}>{trace.map((entry, i) => <tr key={i} className={step === i ? 'is-current' : ''}><td>{i}</td><td>{entry.rawId ?? '—'}</td><td>{L.medallion.actions[entry.action]}</td><td>{entry.state.silver.length}</td><td>{entry.state.quarantine.length}</td><td>{money(entry.state.gold)}</td></tr>)}</SmallTable></details>
  </section>;
}

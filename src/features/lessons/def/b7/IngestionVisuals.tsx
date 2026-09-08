import { useId, useState, type ReactNode } from 'react';
import { useLessonLoop, ScenarioTabs, LoopProgress } from './LessonAnimation';
import { SyntaxCode } from './SyntaxCode';
import { T } from './lesson07.text';
import './IngestionVisuals.css';

const V = T.visuals;
const BRANDS = { kafka: 'Apache Kafka', airflow: 'Apache Airflow', postgresql: 'PostgreSQL', debezium: 'Debezium', elasticsearch: 'Elasticsearch', redis: 'Redis', snowflake: 'Snowflake', mysql: 'MySQL', mongodb: 'MongoDB' };
type Brand = keyof typeof BRANDS;
export function FrameworkLogo({ brand, label = true }: { brand: Brand; label?: boolean }) {
  return <span className={`def-brand def-brand--${brand}`}><span className="def-brand-art"><img src={`${import.meta.env.BASE_URL}frameworks/${brand}.${brand === 'debezium' ? 'png' : 'svg'}`} width="40" height="40" alt={label ? '' : BRANDS[brand]} loading="lazy" /></span>{label && <span>{BRANDS[brand]}</span>}</span>;
}
function Visual({ title, help, children, name, loop }: { title: string; help: string; children: ReactNode; name: string; loop: ReturnType<typeof useLessonLoop> }) {
  const id = useId();
  return <div ref={loop.ref} className="def-animation-observer"><figure className={`def-visual def-scene--${name}`} data-visual={name} data-phase={loop.step} aria-labelledby={id}><figcaption><span className="kicker">{V.label}</span><h3 id={id}>{title}</h3><p>{help}</p></figcaption>{children}</figure></div>;
}
function Node({ brand, title, detail, active = false }: { brand?: Brand; title: string; detail?: string; active?: boolean }) {
  return <div className={`def-v-node ${active ? 'is-active' : ''}`}>{brand && <FrameworkLogo brand={brand} label={false} />}<strong>{title}</strong>{detail && <small>{detail}</small>}</div>;
}
function Path({ titles, details, brands, step }: { titles: string[]; details?: string[]; brands: (Brand | undefined)[]; step: number }) {
  return <ol className="def-v-path def-signal-path">{titles.map((title, i) => <li key={title} aria-current={step === i ? 'step' : undefined}><Node title={title} detail={details?.[i]} brand={brands[i]} active={step === i} />{i < titles.length - 1 && <span className="def-v-arrow" aria-hidden="true"><i />→</span>}</li>)}</ol>;
}
function Caption({ text }: { text: string }) { return <p className="def-live def-loop-caption">{text}</p>; }

export function JourneyVisual({ cdc = false }: { cdc?: boolean }) {
  const steps = cdc ? V.cdcSteps : V.journeySteps;
  const loop = useLessonLoop(steps.length, cdc ? 'cdc-path' : 'journey', 2300);
  return <Visual name={cdc ? 'cdc-path' : 'journey'} title={cdc ? V.cdcTitle : V.journeyTitle} help={cdc ? V.cdcHelp : V.journeyHelp} loop={loop}>
    {cdc ? <>
      <Path titles={V.cdcStages} details={V.cdcDetails} brands={['postgresql', undefined, 'debezium', 'kafka', 'snowflake']} step={loop.step} />
      <SyntaxCode compact value={JSON.stringify({ key: { order_id: 42 }, value: { op: 'u', before: { amount: 10 }, after: { amount: 12 } } }, null, 2)} />
    </> : <>
      <div className="def-orchestrator"><FrameworkLogo brand="airflow" /><span>{V.airflowRole}</span><span aria-hidden="true">↓</span></div>
      <div className="def-transit-map"><div className="def-transit-rail" aria-hidden="true"><i style={{ left: `${loop.step * 25}%` }} /></div><ol>{V.stages.map((stage, i) => <li key={stage} className={loop.step === i ? 'is-current' : ''}><div className="def-transit-stop">{i === 0 ? <FrameworkLogo brand="postgresql" label={false} /> : i === 2 ? <FrameworkLogo brand="snowflake" label={false} /> : <span className="mono">0{i + 1}</span>}</div><strong>{stage}</strong><small>{V.details[i]}</small></li>)}</ol></div>
    </>}
    <Caption text={steps[loop.step]} /><LoopProgress step={loop.step} length={steps.length} />
    <p className="def-small">{cdc ? V.cdcNote : V.airflowNote}</p>
    {cdc && <div className="def-v-heading" role="group" aria-label={V.source}><FrameworkLogo brand="mysql" /><FrameworkLogo brand="postgresql" /><FrameworkLogo brand="mongodb" /></div>}
  </Visual>;
}
const STORAGE_CELLS = [
  { id: 'a', value: 'a', col: 0 }, { id: '1', value: '1', col: 1 }, { id: 'jan', value: '2020-01', col: 2 },
  { id: 'b', value: 'b', col: 0 }, { id: '2', value: '2', col: 1 }, { id: 'feb', value: '2020-02', col: 2 },
  { id: 'c', value: 'c', col: 0 }, { id: '3', value: '3', col: 1 }, { id: 'mar', value: '2020-03', col: 2 },
];
const STORAGE_ORDER = [[0,1,2,3,4,5,6,7,8], [0,3,6,1,4,7,2,5,8], [0,3,1,4,2,5,6,7,8]];
export function StorageVisual() {
  const [layout, setLayout] = useState(0);
  const loop = useLessonLoop(4, `storage-${layout}`, 1700);
  const arranged = loop.step > 0;
  return <Visual name="storage" title={V.storageTitle} help={V.storageHelp} loop={loop}>
    <ScenarioTabs label={V.storageTitle} options={V.layouts} selected={layout} onChange={setLayout}>
      <div className={`def-storage def-storage--${arranged ? layout : 0} ${loop.step >= 2 ? 'is-scanning' : ''}`} role="img" aria-label={`${V.layouts[layout]}: ${STORAGE_ORDER[layout].map(i => STORAGE_CELLS[i].value).join(', ')}`}>
        {STORAGE_CELLS.map((cell, i) => { const position = (arranged ? STORAGE_ORDER[layout] : STORAGE_ORDER[0]).indexOf(i); return <div key={cell.id} className={`def-storage-cell def-field-${cell.col} ${cell.col === 1 ? 'is-amount' : ''}`} style={{ left: `${position % 3 * 100 / 3}%`, top: `${Math.floor(position / 3) * 76}px` }}><small>{V.fields[cell.col]}</small><strong className="mono">{cell.value}</strong></div>; })}
      </div>
      <Caption text={loop.step >= 2 ? V.storageReading : V.storageGrouping} />
    </ScenarioTabs><LoopProgress step={loop.step} length={4} /><p className="def-small">{V.storageNote}</p>
  </Visual>;
}
export function FanoutVisual() {
  const loop = useLessonLoop(4, 'fanout', 1900);
  return <Visual name="fanout" title={V.fanTitle} help={V.fanHelp} loop={loop}>
    <div className="def-branch-map">
      <svg viewBox="0 0 900 350" preserveAspectRatio="none" aria-hidden="true"><path className="def-wire" d="M145 175 H415 M415 175 C540 175 545 65 735 65 M415 175 H735 M415 175 C540 175 545 285 735 285" /><path className="def-wire-flow" d="M145 175 H415 M415 175 C540 175 545 65 735 65 M415 175 H735 M415 175 C540 175 545 285 735 285" /></svg>
      <div className="def-branch-source"><FrameworkLogo brand="postgresql" /><small>{V.log}</small><span className="def-event-pulse mono">42 · UPDATE</span></div>
      <div className="def-branch-hub"><div>CDC</div><small>INSERT · UPDATE · DELETE</small></div>
      <div className="def-branch-targets">{(['elasticsearch', 'redis', 'snowflake'] satisfies Brand[]).map((brand, i) => <div key={brand} className={loop.step > 0 ? 'is-delivered' : ''}><FrameworkLogo brand={brand} /><small>{[V.search, V.cache, V.warehouse][i]}</small></div>)}</div>
    </div><LoopProgress step={loop.step} length={4} />
  </Visual>;
}
export function EcosystemVisual() {
  const [scenario, setScenario] = useState(0);
  const loop = useLessonLoop(scenario === 0 ? 5 : 4, `ecosystem-${scenario}`, 1800);
  return <Visual name="ecosystem" title={V.ecosystemTitle} help={V.ecosystemHelp} loop={loop}>
    <ScenarioTabs label={V.ecosystemTitle} options={V.ecosystemCases} selected={scenario} onChange={setScenario}>
      {scenario === 0 ? <Path titles={[V.source, V.connectSource, V.cluster1, V.connectSink, V.target]} brands={['postgresql', 'kafka', 'kafka', 'kafka', 'snowflake']} step={loop.step} /> : scenario === 1 ? <div className="def-stream-orbit"><div className="def-orbit-system"><FrameworkLogo brand="kafka" /><strong>{V.cluster1}</strong></div><div className="def-stream-arcs" aria-hidden="true"><span>→</span><i /><span>←</span></div><div className="def-stream-app"><span className="mono">{'f(event)'}</span><strong>{V.streams}</strong><small>{V.streamsRole}</small></div></div> : <div className="def-mirror-map"><div className="def-cluster-stack"><FrameworkLogo brand="kafka" /><strong>{V.cluster1}</strong><div aria-hidden="true"><i /><i /><i /></div></div><div className="def-mirror-transfer"><strong>{V.mirror}</strong><span aria-hidden="true"><i />→</span><small>{V.mirrorRole}</small></div><div className="def-cluster-stack"><FrameworkLogo brand="kafka" /><strong>{V.cluster2}</strong><div aria-hidden="true"><i /><i /><i /></div></div></div>}
    </ScenarioTabs><LoopProgress step={loop.step} length={scenario === 0 ? 5 : 4} /><p className="def-small">{scenario === 0 ? V.workers : scenario === 1 ? V.streamsRole : V.mirrorRole}</p>
  </Visual>;
}
const OFFSET_TRACE = [{read:0, commit:0}, {read:1, commit:0}, {read:2, commit:0}, {read:2, commit:2}, {read:2, commit:2}];
export function OffsetVisual() {
  const loop = useLessonLoop(OFFSET_TRACE.length, 'offsets', 1800);
  const state = OFFSET_TRACE[loop.step];
  return <Visual name="offsets" title={V.offsetTitle} help={V.offsetHelp} loop={loop}>
    <div className="def-v-heading"><FrameworkLogo brand="kafka" /><span className="mono">orders / P0</span></div>
    <div className="def-log-conveyor"><div className="def-offset-log">{[0,1,2,3,4].map(n => <div key={n} className={`def-offset-cell ${n < state.read ? 'is-processed' : ''}`}><small>offset</small><strong className="mono">{n}</strong><small>{n < state.read ? V.processed : V.pending}</small></div>)}<div className="def-offset-end"><strong>5</strong><small>{V.logEnd}</small></div></div><div className="def-marker-track"><span className="def-offset-marker" style={{ left: `${state.read / 6 * 100}%` }}>{V.readPosition} · {state.read}</span></div><div className="def-marker-track"><span className="def-offset-marker def-offset-marker--commit" style={{ left: `${state.commit / 6 * 100}%` }}>{V.committed} · {state.commit}</span></div></div>
    <Caption text={V.offsetSteps[Math.min(loop.step, 3)]} /><LoopProgress step={loop.step} length={OFFSET_TRACE.length} />
  </Visual>;
}
const REPLICAS = [[0,2], [0,1], [0,1,2], [1,2]];
export function ReplicaVisual() {
  const loop = useLessonLoop(4, 'replicas', 2400);
  const step = Math.min(loop.step, 2);
  return <Visual name="replicas" title={V.replicaTitle} help={V.replicaHelp} loop={loop}>
    <div className="def-v-heading"><FrameworkLogo brand="kafka" /><span className="mono">P0 · P1 · P2 / RF = 3</span></div>
    <div className="def-rack-floor"><div className="def-brokers def-isometric-brokers">{REPLICAS.map((partitions, b) => <div key={b} className={`def-broker ${b === 0 && step > 0 ? 'is-offline' : ''}`}><h4><i aria-hidden="true" />{V.broker} {b + 1}</h4><span className="def-rack-status">{b === 0 && step > 0 ? V.offline : '●'}</span>{partitions.map(p => { const leader = p === 0 ? step === 2 ? b === 1 : step === 0 && b === 0 : b === p; return <div key={p} className={`def-replica ${leader ? 'is-leader' : ''}`}><strong className="mono">P{p}</strong><span>{b === 0 && step > 0 ? V.offline : leader ? V.leader : V.follower}</span><div className="def-mini-log" aria-hidden="true"><i /><i /><i /></div></div>; })}</div>)}</div></div>
    <p className="def-election">{step === 1 ? V.electing : '\u00a0'}</p><Caption text={V.replicaSteps[step]} /><LoopProgress step={loop.step} length={4} />
  </Visual>;
}
export function ChapterVisual({ chapter }: { chapter: number }) {
  switch (chapter) { case 0: return <JourneyVisual />; case 1: return <StorageVisual />; case 2: return <FanoutVisual />; case 3: return <EcosystemVisual />; case 5: return <OffsetVisual />; case 7: return <ReplicaVisual />; case 9: return <JourneyVisual cdc />; default: return null; }
}

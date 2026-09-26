import { useState } from 'react';
import { DataLesson, Lab, DataTable, TraceLoop, CodeBlock } from '../shared/DataLesson';
import { batchPlan, cacheModel, skewModel } from './batch-engine';
import { SPARK, READERS, KRYO, SQL } from './lesson09.code';
import { T } from './lesson09.text';

function BatchLab() {
  const [mode, setMode] = useState(0);
  const plan = batchPlan(mode === 0);
  return <Lab title={T.labs.planTitle} help={T.labs.planHelp} demo={T.demo}><div className="def-data-controls"><label>{T.labs.planTitle}<select value={mode} onChange={e => setMode(Number(e.target.value))}>{T.labs.planModes.map((v, i) => <option value={i} key={v}>{v}</option>)}</select></label></div><TraceLoop title={T.labs.planTitle} steps={T.labs.planSteps} note={T.loopNote} /><div className="def-data-metrics"><div><span>{T.labs.moved}</span><strong>{plan.moved}</strong></div></div><DataTable label={T.labs.output} headers={T.labs.headers} rows={plan.output.map(r => [r.region, r.total])} /></Lab>;
}
function CacheLab() {
  const [capacity, setCapacity] = useState(2), [uses, setUses] = useState(3), [strategy, setStrategy] = useState('MEMORY_ONLY');
  const result = cacheModel(capacity, uses, strategy);
  return <Lab title={T.labs.cacheTitle} help={T.labs.cacheHelp} demo={T.demo}><div className="def-data-controls"><label>{T.labs.capacity}<select value={capacity} onChange={e => setCapacity(Number(e.target.value))}>{[0,1,2,3,4].map(n => <option key={n}>{n}</option>)}</select></label><label>{T.labs.uses}<select value={uses} onChange={e => setUses(Number(e.target.value))}>{[1,2,3,4].map(n => <option key={n}>{n}</option>)}</select></label><label>{T.labs.strategy}<select value={strategy} onChange={e => setStrategy(e.target.value)}>{['MEMORY_ONLY','MEMORY_AND_DISK','DISK_ONLY'].map(s => <option key={s}>{s}</option>)}</select></label></div><div className="def-data-metrics" aria-live="polite">{[[T.labs.computed,result.computed],[T.labs.ram,result.ram],[T.labs.disk,result.disk],[T.labs.diskReads,result.diskReads]].map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></Lab>;
}
function SkewLab() {
  const [salts, setSalts] = useState(1); const result = skewModel(salts);
  return <Lab title={T.labs.skewTitle} help={T.labs.skewHelp} demo={T.demo}><div className="def-data-controls"><label>{T.labs.salts}<select value={salts} onChange={e => setSalts(Number(e.target.value))}>{[1,2,4].map(n => <option key={n}>{n}</option>)}</select></label></div><div className="def-data-bars">{result.tasks.map((n,i) => <div className="def-data-bar" key={i}><span>T{i+1}</span><div><i style={{width:`${n / 700 * 100}%`}} /></div><strong>{n}M</strong></div>)}</div><div className="def-data-metrics" aria-live="polite">{[[T.labs.largest,result.largest],[T.labs.total,result.total],[T.labs.merged,result.partialSum]].map(([l,v]) => <div key={l}><span>{l}</span><strong>{v}</strong></div>)}</div></Lab>;
}
export default function Lesson09() {
  return <DataLesson text={T} id="b9" artwork={<><div className="def-data-brand"><img src={`${import.meta.env.BASE_URL}frameworks/spark.svg`} alt="" /><h2>Apache Spark</h2></div><div className="def-data-bars">{[700,10,8,12].map((n,i) => <div className="def-data-bar" key={i}><span>P{i+1}</span><div><i style={{width:`${n/700*100}%`}} /></div><strong>{n}M</strong></div>)}</div><p className="mono">700 + 10 + 8 + 12 = 730M</p></>} extra={n => <>
    {n === 2 && <BatchLab />}
    {n === 3 && <><h3>{T.labs.codeTitle}</h3><p className="def-data-callout">{T.labs.codeNote}</p><CodeBlock value={SPARK} /><h3>{T.labs.connectorTitle}</h3><CodeBlock value={READERS} /></>}
    {n === 4 && <><h3>{T.labs.serializerTitle}</h3><CodeBlock value={KRYO} /></>}
    {n === 5 && <CacheLab />}
    {n === 7 && <><h3>{T.labs.planCodeTitle}</h3><p className="def-data-callout">{T.labs.planCodeNote}</p><CodeBlock value={SQL} language="Spark SQL" /></>}
    {n === 9 && <SkewLab />}
  </>} />;
}

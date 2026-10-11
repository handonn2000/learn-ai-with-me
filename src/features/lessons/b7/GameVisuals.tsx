import { useMemo, useState } from 'react';
import { Html } from '@/components/Html';
import { useLessonLoop } from '@/lib/useLessonLoop';
import { analyzeGame } from './game-engine.js';
import { T } from './lesson07.text';

type Frame = ReturnType<typeof analyzeGame>['trace'][number];
const LEAVES = ['a1', 'a2', 'b1', 'b2'];
const POINTS: Record<string, [number, number]> = { r: [300, 45], A: [160, 145], B: [440, 145], a1: [90, 250], a2: [230, 250], b1: [370, 250], b2: [510, 250] };
const EDGES = [['r','A'],['r','B'],['A','a1'],['A','a2'],['B','b1'],['B','b2']];
const bound = (n: number) => Number.isFinite(n) ? String(n) : n < 0 ? '−∞' : '+∞';

export function GameTree({ frame, scores, rootMax = true, pruning = false }: { frame: Frame; scores: number[]; rootMax?: boolean; pruning?: boolean }) {
  return <div className="ag-tree-scroll" tabIndex={0} aria-label={T.visual.title} onTouchStart={event=>event.stopPropagation()} onTouchEnd={event=>event.stopPropagation()} onKeyDown={event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight') event.stopPropagation();}}><svg viewBox="0 0 600 305" role="img" aria-label={T.visual.title} className="ag-tree">
    {EDGES.map(([from,to]) => <line key={to} x1={POINTS[from][0]} y1={POINTS[from][1]+23} x2={POINTS[to][0]} y2={POINTS[to][1]-25} className={`ag-edge ${frame.id === to ? 'ag-edge-active' : ''} ${frame.skipped.includes(to) ? 'ag-edge-cut' : ''}`} />)}
    {Object.entries(POINTS).map(([id,[x,y]]) => {
      const leaf = LEAVES.indexOf(id);
      const evaluated = id in frame.values;
      const skipped = frame.skipped.includes(id);
      const current = frame.id === id && frame.kind !== 'start';
      const label = leaf >= 0 ? T.lab.labels[leaf] : id === 'r' ? rootMax ? 'MAX' : 'MIN' : `${id} · ${rootMax ? 'MIN' : 'MAX'}`;
      const value = leaf >= 0 ? String(scores[leaf]) : evaluated ? `${frame.exact[id] ? '' : (id === 'r' ? rootMax : !rootMax) ? '≥' : '≤'}${frame.values[id]}` : '?';
      return <g key={id} className={`ag-node ${evaluated ? 'ag-node-read' : ''} ${current ? 'ag-node-active' : ''} ${skipped ? 'ag-node-cut' : ''}`}>
        <rect x={x-47} y={y-24} width="94" height="48" rx={leaf >= 0 ? 9 : 22}/>
        <text x={x} y={y-3} className="ag-role">{label}</text><text x={x} y={y+15} className="ag-number">{value}</text>
        {skipped && <path d={`M${x-37} ${y-20} l74 40 M${x+37} ${y-20} l-74 40`} className="ag-cross"/>}
        {pruning && leaf < 0 && frame.bounds[id] && <text x={x} y={y+43} className="ag-bound">α {bound(frame.bounds[id].alpha)} · β {bound(frame.bounds[id].beta)}</text>}
      </g>;
    })}
  </svg></div>;
}

export function GameLoop({ pruning = false }: { pruning?: boolean }) {
  const model = useMemo(() => analyzeGame([3,5,0,7], true, false, pruning), [pruning]);
  // Hold the completed result for an extra beat before a clearly labeled replay.
  const { ref, step } = useLessonLoop(model.trace.length + 1, pruning ? 'alpha-beta' : 'minimax', 2400);
  const frame = model.trace[Math.min(step, model.trace.length-1)];
  const caption = frame.kind === 'start' ? T.visual.start : frame.kind === 'leaf' ? `${T.visual.leaf} ${T.lab.labels[LEAVES.indexOf(frame.id)]}: ${frame.score}` : frame.kind === 'cut' ? `${T.visual.cut}: α≥β · ${T.visual.bound} ≤${frame.score}` : frame.kind === 'done' ? `${T.visual.done} ${frame.chosen} = ${frame.score}` : `${T.visual.backup} ${frame.id} = ${frame.score}`;
  return <div ref={ref} className="card ag-visual" data-visual={pruning ? 'alpha-beta' : 'minimax'}>
    <div className="ag-visual-title"><strong>{pruning ? T.visual.alpha : T.visual.minimax}</strong><span className="mono">{Math.min(step+1,model.trace.length)}/{model.trace.length}</span></div>
    <GameTree frame={frame} scores={[3,5,0,7]} pruning={pruning}/>
    <p className="ag-caption">{caption}</p><p className="ls-note">{T.visual.legend}</p><p className="ls-note">{T.visual.cycle}</p>
  </div>;
}

export function GameExperiment() {
  const [scores, setScores] = useState([3,5,0,7]);
  const [rootMax, setRootMax] = useState(true);
  const [reverse, setReverse] = useState(false);
  const full = analyzeGame(scores, rootMax, reverse, false);
  const alpha = analyzeGame(scores, rootMax, reverse, true);
  return <div className="card ag-experiment">
    <div className="ag-inputs">{scores.map((value,i) => <label key={i}>{T.lab.score} {T.lab.labels[i]}<input type="number" min="-100" max="100" value={value} onChange={event => { const n=Number(event.target.value); if(Number.isFinite(n)) setScores(old=>old.map((v,k)=>k===i ? Math.max(-100,Math.min(100,n)) : v)); }}/></label>)}
      <label>{T.lab.root}<select value={rootMax ? 'MAX' : 'MIN'} onChange={e=>setRootMax(e.target.value==='MAX')}><option>MAX</option><option>MIN</option></select></label>
      <label>{T.lab.order}<select value={reverse ? 'reverse' : 'normal'} onChange={e=>setReverse(e.target.value==='reverse')}><option value="normal">{T.lab.orders[0]}</option><option value="reverse">{T.lab.orders[1]}</option></select></label>
    </div>
    <GameTree frame={alpha.trace[alpha.trace.length-1]} scores={scores} rootMax={rootMax} pruning/>
    <div className="ag-results">{[{title:T.lab.full,data:full},{title:T.lab.alpha,data:alpha}].map(({title,data})=><div className="panel-inner" key={title}><strong>{title}</strong><dl><dt>{T.lab.result}</dt><dd>{data.chosen}</dd><dt>{T.lab.value}</dt><dd>{data.value}</dd><dt>{T.lab.leaves}</dt><dd>{data.read.length}/4</dd><dt>{T.lab.pruned}</dt><dd>{data.skipped.map(id=>T.lab.labels[LEAVES.indexOf(id)]).join(', ') || '—'}</dd></dl></div>)}</div>
    <p className="ls-note">{T.lab.note}</p><button type="button" className="btn" onClick={()=>{setScores([3,5,0,7]);setRootMax(true);setReverse(false);}}>{T.lab.reset}</button>
  </div>;
}

export function Recall({ question }: { question: {q:string;opts:string[];a:number;ex:string} }) {
  const [picked,setPicked]=useState<number|null>(null);
  return <div className="card ag-recall"><h3>{question.q}</h3><div className="ag-answers">{question.opts.map((opt,i)=><button type="button" key={opt} className={`btn ${picked===i ? i===question.a ? 'ag-correct' : 'ag-wrong' : ''}`} onClick={()=>setPicked(i)}>{picked===i ? i===question.a ? '✓ ' : '× ' : ''}{opt}</button>)}</div>{picked!==null && <Html as="p" className="ls-prose" t={question.ex}/>}</div>;
}

export function ChanceVisual() {
  const [half,setHalf]=useState(false);
  const p=half ? 0.5 : 0.25;
  const expected=p*10+(1-p)*-1;
  return <div className="card ag-chance"><div className="ag-answers">{['1/4','1/2'].map((v,i)=><button type="button" className="btn" key={v} aria-pressed={half===(i===1)} onClick={()=>setHalf(i===1)}>P(10) = {v}</button>)}</div><div className="ag-probability" role="img" aria-label={`P(10)=${p}, P(−1)=${1-p}`}><span style={{flex:p}} className="ag-gain">10 · {p}</span><span style={{flex:1-p}} className="ag-loss">−1 · {1-p}</span></div><div className="ag-formula mono">E = {p}×10 + {1-p}×(−1) = {expected}<br/>{T.lab.result}: {expected>2 ? T.chance.gamble : T.chance.safe} ({Math.max(2,expected)})</div></div>;
}

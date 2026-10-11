import { useMemo, useState } from 'react';
import { Html } from '@/components/Html';
import { useLessonLoop } from '@/lib/useLessonLoop';
import { PRESETS, UMBRELLA_PROOF, displayName, evaluate, parse, plBcEntails, plFcEntails } from './logic-engine.js';
import { bcCaption, fcCaption, scrollShield } from './logic-view';
import { T } from './lesson09.text';

/* ───────────── 02 · Wumpus exploration (source deck pp. 14–17) ───────────── */

type Frame = { agent: string; cells: Record<string, string[]> };
const WUMPUS_FRAMES: Frame[] = [
  { agent: '1,1', cells: { '1,1': ['A', 'OK'], '1,2': ['OK'], '2,1': ['OK'] } },
  { agent: '2,1', cells: { '1,1': ['V', 'OK'], '2,1': ['A', 'B', 'OK'], '1,2': ['OK'], '2,2': ['P?'], '3,1': ['P?'] } },
  { agent: '1,2', cells: { '1,1': ['V', 'OK'], '2,1': ['B', 'V', 'OK'], '1,2': ['A', 'S', 'OK'], '2,2': ['OK'], '1,3': ['W!'], '3,1': ['P!'] } },
  { agent: '2,3', cells: { '1,1': ['V', 'OK'], '2,1': ['B', 'V', 'OK'], '1,2': ['S', 'V', 'OK'], '2,2': ['V', 'OK'], '1,3': ['W!'], '3,1': ['P!'], '2,3': ['A', 'S', 'G', 'B'], '2,4': ['P?'], '3,3': ['P?'] } },
];
const tagClass = (t: string) => t === 'OK' ? 'ok' : t.endsWith('!') ? 'sure' : t.endsWith('?') ? 'maybe' : t === 'A' ? 'agent' : t === 'V' ? 'visited' : 'percept';

export function WumpusLoop() {
  const { ref, step } = useLessonLoop(WUMPUS_FRAMES.length, 'wumpus', 3200);
  const frame = WUMPUS_FRAMES[step];
  const C = 76, PAD = 8;
  return <div ref={ref} className="card lg-visual" data-visual="wumpus">
    <div className="lg-visual-title"><strong>{T.wumpus.visualTitle}</strong><span className="mono">{step + 1}/{WUMPUS_FRAMES.length}</span></div>
    <div className="lg-wumpus-layout">
      <svg viewBox={`0 0 ${C * 4 + PAD * 2} ${C * 4 + PAD * 2}`} role="img" aria-label={T.wumpus.grid} className="lg-wumpus">
        {/* The agent's room is drawn last so its highlighted border is never painted over by a neighbour. */}
        {[4, 3, 2, 1].flatMap((y, row) => [1, 2, 3, 4].map((x) => ({ x, y, row })))
          .sort((a, b) => Number(`${a.x},${a.y}` === frame.agent) - Number(`${b.x},${b.y}` === frame.agent))
          .map(({ x, y, row }) => {
          const key = `${x},${y}`;
          const tags = frame.cells[key] ?? [];
          const px = PAD + (x - 1) * C, py = PAD + row * C;
          return <g key={key} className={`lg-room ${frame.agent === key ? 'lg-room-agent' : ''} ${tags.includes('V') ? 'lg-room-visited' : ''}`}>
            <rect x={px} y={py} width={C} height={C} />
            <text x={px + 6} y={py + 14} className="lg-room-id">{key}</text>
            {tags.map((t, i) => <text key={t} x={px + C / 2} y={py + 30 + i * 14} className={`lg-tag lg-tag-${tagClass(t)}`}>{t}</text>)}
          </g>;
        })}
      </svg>
      <div className="lg-wumpus-side">
        <Html as="p" className="lg-caption" t={T.wumpus.steps[step]} />
        <p className="ls-note">{T.wumpus.legend}</p>
        <p className="ls-note">{T.wumpus.cycle}</p>
      </div>
    </div>
  </div>;
}

/* ───────────── 03 · Eight models, KB and α (source deck p. 21) ───────────── */

const WUMPUS_KB = PRESETS.wumpus.kb.map(parse);
const MODELS = Array.from({ length: 8 }, (_, i) => {
  const pits = { '1,2': Boolean(i & 4), '2,2': Boolean(i & 2), '3,1': Boolean(i & 1) };
  const m = { 'B1,1': false, 'B2,1': true, 'P1,1': false, 'P2,1': false, 'P1,2': pits['1,2'], 'P2,2': pits['2,2'], 'P3,1': pits['3,1'] };
  return { pits, kb: WUMPUS_KB.every((s: unknown) => evaluate(s, m)), alpha: [!pits['1,2'], !pits['2,2']] };
});
const MINI = ['1,2', '2,2', '3,2', '1,1', '2,1', '3,1'];

export function ModelsLoop() {
  const [tab, setTab] = useState(0);
  const { ref, step: tick } = useLessonLoop(5, `models-${tab}`, 2600);
  const step = Math.min(tick, 3);
  const V = T.visual.models;
  return <div ref={ref} className="card lg-visual" data-visual="models">
    <div className="lg-visual-title"><strong>{V.title}</strong><span className="mono">{step + 1}/4</span></div>
    <div className="lg-tabs" role="group" aria-label={V.title}>{V.tabs.map((label, i) => <button key={label} type="button" aria-pressed={tab === i} className={`btn ${tab === i ? 'btn--toggle-on' : ''}`} onClick={() => setTab(i)}>{label}</button>)}</div>
    <div className="lg-worlds" role="img" aria-label={`${V.title} · ${V.tabs[tab]}`}>
      {MODELS.map((m, i) => {
        const showKb = step >= 1, showAlpha = step >= 2, verdict = step >= 3;
        const outside = verdict && m.kb && !m.alpha[tab];
        return <div key={i} className={`lg-world ${showKb && m.kb ? 'lg-world-kb' : ''} ${showKb && !m.kb ? 'lg-world-out' : ''} ${showAlpha && m.alpha[tab] ? 'lg-world-alpha' : ''} ${outside ? 'lg-world-bad' : ''}`}>
          <div className="lg-mini">{MINI.map((cell) => <span key={cell} className={cell === '3,2' ? 'lg-mini-blank' : ''}>{(m.pits as Record<string, boolean>)[cell] ? '●' : ''}</span>)}</div>
          {showAlpha && m.alpha[tab] && <b className="lg-world-alpha-mark" aria-hidden="true">α</b>}
          {outside && <b className="lg-world-mark">✕</b>}
        </div>;
      })}
    </div>
    <p className="lg-caption">{V.phases[step]}{step >= 3 ? ` ${V.verdicts[tab]}` : ''}</p>
    <p className="ls-note">{V.legend}</p>
  </div>;
}

/* ───────────── 07 · Umbrella refutation (source deck p. 54) ───────────── */

export function ResolutionLoop() {
  const { ref, step: tick } = useLessonLoop(5, 'umbrella', 3000);
  const step = Math.min(tick, 3);
  const V = T.visual.res;
  const visible = 4 + step;
  const newest = step === 0 ? -1 : visible - 1;
  const parents = newest >= 0 ? (UMBRELLA_PROOF[newest].from as number[]) : [];
  return <div ref={ref} className="card lg-visual" data-visual="resolution">
    <div className="lg-visual-title"><strong>{V.title}</strong><span className="mono">{step + 1}/4</span></div>
    <div className="lg-scroll" aria-label={V.title} {...scrollShield}>
      <table className="dtable lg-proof"><thead><tr>{V.headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{UMBRELLA_PROOF.map((row, i) => <tr key={i} className={`${i >= visible ? 'lg-row-pending' : ''} ${i === newest ? 'lg-row-new' : ''} ${parents.includes(i) ? 'lg-row-parent' : ''}`}>
          <td>{i + 1}</td><td className="mono">{row.clause}</td>
          <td>{row.from === 'kb' ? V.kb : row.from === 'query' ? V.query : `${V.pair} ${(row.from as number[]).map((n) => n + 1).join(', ')}`}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <p className="lg-caption">{V.captions[step]}</p>
    <p className="ls-note">{T.visual.cycle}</p>
  </div>;
}

/* ───────────── 08 · AND-OR graph with forward / backward tabs (source deck pp. 59–80) ───────────── */

const CHAIN_KB = PRESETS.chain.kb.map(parse);
type Layout = { id: string; viewBox: string; nodes: Record<string, [number, number]>; rules: [number, number][] };
/* Two layouts of the same graph: landscape for wide screens, portrait so a 375px phone sees every node unscrolled. */
const LAYOUTS: Layout[] = [
  { id: 'wide', viewBox: '0 0 600 440', nodes: { Q: [300, 34], P: [300, 150], M: [452, 262], L: [190, 300], A: [150, 412], B: [442, 412] }, rules: [[300, 92], [300, 214], [434, 338], [78, 300], [292, 372]] },
  { id: 'narrow', viewBox: '0 0 360 560', nodes: { Q: [180, 30], P: [180, 150], M: [292, 300], L: [96, 330], A: [62, 528], B: [292, 528] }, rules: [[180, 90], [180, 222], [290, 420], [60, 236], [158, 446]] },
];
const arrow = (x1: number, y1: number, x2: number, y2: number, r1: number, r2: number) => {
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
  return { x1: x1 + (dx / d) * r1, y1: y1 + (dy / d) * r1, x2: x2 - (dx / d) * r2, y2: y2 - (dy / d) * r2 };
};
type GraphRule = { premise: string[]; conclusion: string; sentence: number };
type GraphState = { done: Set<string>; current: string; stack: string[]; activeRule: number; counts: number[]; showCounts: boolean };

function Graph({ layout, rules, state, label }: { layout: Layout; rules: GraphRule[]; state: GraphState; label: string }) {
  const marker = `lg-arrow-${layout.id}`;
  return <svg viewBox={layout.viewBox} role="img" aria-label={label} className={`lg-graph lg-graph-${layout.id}`}>
    <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" className="lg-arrowhead" /></marker></defs>
    {rules.map((r, i) => {
      const [rx, ry] = layout.rules[i];
      return <g key={i} className={i === state.activeRule ? 'lg-edge-active' : ''}>
        {r.premise.map((p) => { const [px, py] = layout.nodes[p]; return <line key={p} {...arrow(px, py, rx, ry, 22, 18)} className="lg-edge" markerEnd={`url(#${marker})`} />; })}
        {(() => { const [cx, cy] = layout.nodes[r.conclusion]; return <line {...arrow(rx, ry, cx, cy, 16, 23)} className="lg-edge" markerEnd={`url(#${marker})`} />; })()}
      </g>;
    })}
    {rules.map((r, i) => {
      const [rx, ry] = layout.rules[i];
      return <g key={i} className={`lg-rule ${i === state.activeRule ? 'lg-rule-active' : ''} ${state.showCounts && state.counts[i] === 0 ? 'lg-rule-fired' : ''}`}>
        <rect x={rx - 46} y={ry - 15} width="92" height="30" rx="7" />
        <text x={rx} y={ry + 5} className="lg-rule-text">{`${r.premise.map(displayName).join('∧')}⇒${displayName(r.conclusion)}`}</text>
        {state.showCounts && <><circle cx={rx + 44} cy={ry - 15} r="11" className="lg-count" /><text x={rx + 44} y={ry - 11} className="lg-count-text">{state.counts[i]}</text></>}
      </g>;
    })}
    {Object.entries(layout.nodes).map(([id, [x, y]]) => <g key={id} className={`lg-node ${state.done.has(id) ? 'lg-node-done' : ''} ${state.current === id ? 'lg-node-current' : ''} ${state.stack.includes(id) ? 'lg-node-stack' : ''}`}>
      <circle cx={x} cy={y} r="21" /><text x={x} y={y + 6}>{id}</text>
    </g>)}
  </svg>;
}

function useChainTraces() {
  const fc = useMemo(() => plFcEntails(CHAIN_KB, parse('Q')), []);
  const bc = useMemo(() => plBcEntails(CHAIN_KB, parse('Q')), []);
  return { rules: (fc.rules ?? []) as GraphRule[], fcTrace: fc.trace ?? [], bcTrace: bc.trace ?? [] };
}

export function ChainLoop() {
  const [tab, setTab] = useState(0);
  const { rules, fcTrace, bcTrace } = useChainTraces();
  const length = tab === 0 ? fcTrace.length : bcTrace.length;
  // One extra beat on the finished state before the replay starts.
  const { ref, step: tick } = useLessonLoop(length + 1, `chain-${tab}`, 2200);
  const step = Math.min(tick, length - 1);
  const V = T.visual.chain;
  const graphRules = rules.slice(0, 5);

  const state: GraphState = { done: new Set(), current: '', stack: [], activeRule: -1, counts: rules.map((r) => r.premise.length), showCounts: tab === 0 };
  let caption = '';
  if (tab === 0) {
    const e = fcTrace[step];
    state.done = new Set(Object.keys(e.inferred));
    if (e.kind === 'found') state.done.add('Q');
    state.current = e.p ?? '';
    state.activeRule = e.rule ?? -1;
    state.counts = e.count;
    caption = fcCaption(e, rules, 'Q');
  } else {
    const e = bcTrace[step];
    state.done = new Set(e.proved);
    state.current = e.goal;
    state.stack = e.stack;
    state.activeRule = e.rule ?? -1;
    caption = bcCaption(e, rules);
  }
  const label = `${V.title} · ${V.tabs[tab]}`;

  return <div ref={ref} className="card lg-visual" data-visual="chaining">
    <div className="lg-visual-title"><strong>{V.title}</strong><span className="mono">{step + 1}/{length}</span></div>
    <div className="lg-tabs" role="group" aria-label={V.title}>{V.tabs.map((name, i) => <button key={name} type="button" aria-pressed={tab === i} className={`btn ${tab === i ? 'btn--toggle-on' : ''}`} onClick={() => setTab(i)}>{name}</button>)}</div>
    <div className="lg-graph-box">{LAYOUTS.map((layout) => <Graph key={layout.id} layout={layout} rules={graphRules} state={state} label={label} />)}</div>
    <p className="lg-caption">{caption}</p>
    {tab === 1 && <p className="ls-note mono">{V.stack}: [{[...state.stack, state.current].map(displayName).join(' → ')}]</p>}
    <p className="ls-note">{V.legend}</p>
    <p className="ls-note">{T.visual.cycle}</p>
  </div>;
}

/** The full forward and backward traces as stable HTML — the static explanation behind the loop. */
export function ChainTrace() {
  const { rules, fcTrace, bcTrace } = useChainTraces();
  return <div className="lg-trace-pair">
    <div><h4>{T.visual.chain.tabs[0]}</h4><ol className="lg-trace-static">{fcTrace.map((e, i) => <li key={i}>{fcCaption(e, rules, 'Q')}</li>)}</ol></div>
    <div><h4>{T.visual.chain.tabs[1]}</h4><ol className="lg-trace-static">{bcTrace.map((e, i) => <li key={i} style={{ marginLeft: e.stack.length * 12 }}>{bcCaption(e, rules)}</li>)}</ol></div>
  </div>;
}

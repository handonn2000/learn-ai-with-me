// Manim Lab — trình chạy từng bước 7 thuật toán tìm kiếm trên canvas.
// Engine sinh trace nằm ở search-engine.js (module JS thuần, thay được bằng WASM sau).
import { useEffect, useMemo, useRef, useState } from 'react';
import { PRESETS, runTrace } from '@/features/search-lab/search-engine.js';
import { T } from './lesson03.text';

const MONO = "'JetBrains Mono',monospace";

interface Step {
  a: string; cur: number | null; edge: [number, number] | null; txt: string; limit: number | null;
  path: number[] | null; cost: number | null;
  fr: { n: number; k: string }[]; ex: number[]; lit: string[];
}
interface Preset {
  key: string; name: string; src: number; dst: number; labelIn: boolean;
  labels: string[]; pos: [number, number][]; m: number[][]; h: number[];
}

const AL: [string, string][] = [['BFS', 'FIFO'], ['DFS', 'LIFO'], ['UCS', 'g(n)'], ['IDS', 'ℓ↑'], ['GBFS', 'h(n)'], ['ASTAR', 'f=g+h'], ['HC', T.searchlab.s1]];
const FT_MAP: Record<string, string> = {
  BFS: T.searchlab.s2, DFS: T.searchlab.s3,
  UCS: T.searchlab.s4, IDS: T.searchlab.s5,
  GBFS: T.searchlab.s6, ASTAR: T.searchlab.s7,
  HC: T.searchlab.s8,
};

export function SearchLab() {
  const [algo, setAlgo] = useState('BFS');
  const [preset, setPreset] = useState('lab');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);

  const P = (PRESETS as unknown as Record<string, Preset>)[preset];
  const steps = useMemo(() => runTrace(algo, P) as Step[], [algo, P]);
  const limitAt = useMemo(() => {
    const out: (number | null)[] = [];
    let lim: number | null = null;
    steps.forEach((s, i) => { if (s.a === 'deepen') lim = s.limit; out[i] = s.limit ?? lim; });
    return out;
  }, [steps]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tRef = useRef(0);
  const stateRef = useRef({ step, playing, speed, steps, P, algo, limitAt });
  stateRef.current = { step, playing, speed, steps, P, algo, limitAt };

  // Đổi thuật toán / đồ thị → chạy lại từ đầu
  useEffect(() => { tRef.current = 0; setStep(0); setPlaying(true); }, [algo, preset]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    let w = 0;
    const H = 470;
      // Đo bề rộng bằng ResizeObserver chứ không phải một lần lúc mount: ở chế độ trình chiếu
      // (ADR-0006) canvas mount lúc mục còn display:none nên clientWidth = 0. Bản cũ rơi vào
      // giá trị dự phòng 640 rồi không bao giờ đo lại — mục hiện ra là cảnh bị kéo giãn, và
      // vẽ theo w = 640 trong khi hiển thị ở 1070. KHÔNG đặt lại giá trị dự phòng: chưa có bề
      // rộng thật thì đừng vẽ, vòng lặp dưới đã có guard `if (ctx && w)`.
    const size = () => {
      const next = c.clientWidth;
      if (!next || next === w) return; // chưa có bề rộng thật, hoặc không đổi → khỏi xóa canvas
      w = next;
      const d = Math.min(2, window.devicePixelRatio || 1);
      c.width = w * d; c.height = H * d;
      c.getContext('2d')!.setTransform(d, 0, 0, d, 0, 0);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(c);
    let pts: number | undefined;
    let raf = 0;
    const tick = (ts: number) => {
      const dt = Math.min(0.05, (ts - (pts ?? ts)) / 1000);
      pts = ts;
      const S = stateRef.current;
      if (tRef.current < 1) tRef.current = Math.min(1, tRef.current + dt * 1.7 * S.speed);
      else if (S.playing) {
        if (S.step < S.steps.length - 1) { tRef.current = 0; setStep((s) => s + 1); }
        else setPlaying(false);
      }
      const ctx = c.getContext('2d');
      if (ctx && w) drawViz(ctx, w, H, S.P, S.steps, S.step, tRef.current, S.algo, S.limitAt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const st = steps[Math.min(step, steps.length - 1)];
  const L = (i: number) => P.labels[i];
  const isEnd = step >= steps.length - 1 && ['goal', 'stuck', 'fail'].includes(st.a);
  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 11px', borderRadius: 9, cursor: 'pointer', display: 'flex', gap: 7, alignItems: 'center',
    border: `1px solid ${active ? '#58C4DD' : '#232836'}`,
    background: active ? 'rgba(88,196,221,.13)' : '#12151A',
    color: active ? '#9FDDEE' : '#97A0B5', fontFamily: MONO, fontSize: 12, fontWeight: 600,
  });
  const navBtn: React.CSSProperties = { padding: '8px 13px', borderRadius: 9, border: '1px solid #2A3242', background: '#161B26', color: '#D9DFEC', fontFamily: MONO, fontSize: 12.5, cursor: 'pointer' };

  return (
    <div className="canvas-panel" style={{ borderRadius: 16 }}>
      <div style={{ padding: '13px 16px', borderBottom: '1px solid #1E2430', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {AL.map(([id, tag]) => (
          <button key={id} onClick={() => setAlgo(id)} style={btnStyle(algo === id)}>
            {id === 'ASTAR' ? 'A*' : id}
            <span style={{ fontSize: 9.5, opacity: 0.65, fontWeight: 400 }}>{tag}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {[['lab', T.searchlab.s9], ['romania', T.searchlab.s10]].map(([k, label]) => (
          <button key={k} onClick={() => setPreset(k)} style={btnStyle(preset === k)}>{label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <canvas ref={canvasRef} style={{ flex: '1 1 560px', minWidth: 'min(440px, 100%)', height: 470, display: 'block' }} />
        <div style={{ flex: '1 1 300px', maxWidth: 400, borderLeft: '1px solid #1E2430', padding: 18, display: 'flex', flexDirection: 'column', gap: 15, background: '#0E1117' }}>
          <div style={{ fontFamily: MONO, fontSize: 11, color: '#5C6579' }}>{T.fn.stepOf(step + 1, steps.length)}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.65, color: '#D9DFEC', minHeight: 86 }}>{st.txt}</div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.6px', color: '#58C4DD' }}>{FT_MAP[algo]}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, minHeight: 30 }}>
              {st.fr.map((o, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 8, border: '1px solid rgba(88,196,221,.45)', background: 'rgba(88,196,221,.08)' }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: '#9FDDEE' }}>{L(o.n)}</span>
                  {o.k ? <span style={{ fontFamily: MONO, fontSize: 10, color: '#6E93A3' }}>{o.k}</span> : null}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.6px', color: '#5C6579' }}>{T.fn.explored(st.ex.length)}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, minHeight: 26 }}>
              {st.ex.map((n, i) => (
                <div key={i} style={{ padding: '4px 8px', borderRadius: 8, border: '1px solid #2A3242', background: '#12151A' }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: '#8B93A7' }}>{L(n)}</span>
                </div>
              ))}
            </div>
          </div>
          {isEnd ? (
            <div style={{
              borderRadius: 10, padding: '10px 12px', fontFamily: MONO, fontSize: 12.5, lineHeight: 1.5,
              ...(st.a === 'goal'
                ? { background: 'rgba(131,193,103,.1)', border: '1px solid rgba(131,193,103,.4)', color: '#A9D896' }
                : { background: 'rgba(252,98,85,.08)', border: '1px solid rgba(252,98,85,.4)', color: '#F09088' }),
            }}>
              {st.a === 'goal' && st.path
                ? T.fn.goalPath(st.path.map(L).join(' → '), st.cost, st.ex.length)
                : st.a === 'stuck' ? T.searchlab.s11 : T.searchlab.s12}
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1E2430', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => { tRef.current = 0; setStep(0); setPlaying(false); }} style={navBtn}>{T.searchlab.s13}</button>
        <button onClick={() => { if (step > 0) { tRef.current = 1; setStep(step - 1); setPlaying(false); } }} style={navBtn}>{T.searchlab.s14}</button>
        <button
          onClick={() => {
            if (step >= steps.length - 1 && tRef.current >= 1) { tRef.current = 0; setStep(0); setPlaying(true); }
            else setPlaying((p) => !p);
          }}
          style={{ ...navBtn, border: '1px solid rgba(244,211,69,.5)', background: 'rgba(244,211,69,.1)', color: '#F4D345', fontWeight: 700, padding: '8px 16px' }}>
          {playing ? T.searchlab.s15 : T.searchlab.s16}
        </button>
        <button onClick={() => { if (step < steps.length - 1) { tRef.current = 0; setStep(step + 1); setPlaying(false); } }} style={navBtn}>{T.searchlab.s17}</button>
        <div style={{ flex: 1 }} />
        {[[0.5, '0.5×'], [1, '1×'], [2, '2×']].map(([v, label]) => (
          <button key={String(v)} onClick={() => setSpeed(v as number)} style={btnStyle(speed === v)}>{label as string}</button>
        ))}
      </div>
    </div>
  );
}

function drawViz(x: CanvasRenderingContext2D, w: number, h: number, P: Preset, steps: Step[], stepIdx: number, tt: number, algo: string, limitAt: (number | null)[]) {
  if (!steps.length) return;
  const st = steps[Math.min(stepIdx, steps.length - 1)];
  x.clearRect(0, 0, w, h);
  x.fillStyle = '#12151A'; x.fillRect(0, 0, w, h);
  const padX = P.labelIn ? 62 : 78, padY = P.labelIn ? 54 : 56;
  const X = (i: number) => padX + P.pos[i][0] * (w - 2 * padX);
  const Y = (i: number) => padY + P.pos[i][1] * (h - 2 * padY);
  const e = tt < 0.5 ? 2 * tt * tt : 1 - Math.pow(-2 * tt + 2, 2) / 2;
  const N = P.m.length, r = P.labelIn ? 18 : 13;
  const informed = algo === 'GBFS' || algo === 'ASTAR' || algo === 'HC';
  for (let a = 0; a < N; a++)
    for (let b = a + 1; b < N; b++)
      if (P.m[a][b] > 0) {
        const lit = st.lit.includes(a + '-' + b);
        x.strokeStyle = lit ? 'rgba(88,196,221,.55)' : 'rgba(120,132,155,.2)'; x.lineWidth = lit ? 2.2 : 1.4;
        x.beginPath(); x.moveTo(X(a), Y(a)); x.lineTo(X(b), Y(b)); x.stroke();
        const mx = (X(a) + X(b)) / 2, my = (Y(a) + Y(b)) / 2;
        const dx = X(b) - X(a), dy = Y(b) - Y(a), LL = Math.hypot(dx, dy) || 1;
        const ox = (-dy / LL) * 9, oy = (dx / LL) * 9;
        x.font = '10px ' + MONO; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.lineWidth = 3; x.strokeStyle = '#0B0D12'; x.strokeText(String(P.m[a][b]), mx + ox, my + oy);
        x.fillStyle = '#7A8399'; x.fillText(String(P.m[a][b]), mx + ox, my + oy);
      }
  if (st.a === 'goal' && st.path) {
    const pe = st.path.length - 1;
    const prog = (st.edge ? Math.max(0, (e - 0.3) / 0.7) : e) * pe;
    x.strokeStyle = '#83C167'; x.lineWidth = 3.5; x.shadowColor = 'rgba(131,193,103,.8)'; x.shadowBlur = 10;
    for (let i = 0; i < pe; i++) {
      const f = Math.min(1, Math.max(0, prog - i));
      if (f <= 0) break;
      const ax = X(st.path[i]), ay = Y(st.path[i]), bx = X(st.path[i + 1]), by = Y(st.path[i + 1]);
      x.beginPath(); x.moveTo(ax, ay); x.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f); x.stroke();
    }
    x.shadowBlur = 0;
  }
  if (st.edge && st.a !== 'goal' && tt < 1) {
    const [p0, n0] = st.edge;
    const px = X(p0), py = Y(p0), nx = X(n0), ny = Y(n0);
    const col = st.a === 'update' ? '#C792EA' : '#F4D345';
    x.strokeStyle = col; x.globalAlpha = 0.85; x.lineWidth = 2.4;
    x.beginPath(); x.moveTo(px, py); x.lineTo(px + (nx - px) * e, py + (ny - py) * e); x.stroke(); x.globalAlpha = 1;
    x.fillStyle = col; x.shadowColor = col; x.shadowBlur = 12;
    x.beginPath(); x.arc(px + (nx - px) * e, py + (ny - py) * e, 4.5, 0, 7); x.fill(); x.shadowBlur = 0;
  }
  const frSet = new Set(st.fr.map((o) => o.n)), exSet = new Set(st.ex);
  const inPath = new Set(st.a === 'goal' && st.path ? st.path : []);
  for (let i = 0; i < N; i++) {
    const cx = X(i), cy = Y(i);
    let ring = 'rgba(160,170,190,.35)', fill = '#10141C', lw = 1.6;
    let glow: string | null = null;
    if (exSet.has(i)) { ring = '#3A4254'; fill = '#151A24'; }
    if (frSet.has(i)) { ring = '#58C4DD'; lw = 2.2; }
    if (inPath.has(i) && (st.edge ? e > 0.3 : true)) { ring = '#83C167'; lw = 2.4; }
    if (i === st.cur) { ring = st.a === 'stuck' ? '#FC6255' : st.a === 'goal' ? '#83C167' : '#F4D345'; lw = 2.6; glow = ring; }
    if (i === P.dst) { x.setLineDash([4, 4]); x.strokeStyle = 'rgba(131,193,103,.45)'; x.lineWidth = 1.2; x.beginPath(); x.arc(cx, cy, r + 6, 0, 7); x.stroke(); x.setLineDash([]); }
    if (glow) { x.shadowColor = glow; x.shadowBlur = 14; }
    x.fillStyle = fill; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
    x.strokeStyle = ring; x.lineWidth = lw; x.stroke(); x.shadowBlur = 0;
    if (i === st.cur && tt < 1 && (st.a === 'expand' || st.a === 'start')) {
      x.globalAlpha = (1 - e) * 0.8; x.strokeStyle = '#F4D345'; x.lineWidth = 1.6;
      x.beginPath(); x.arc(cx, cy, r + 4 + 10 * e, 0, 7); x.stroke(); x.globalAlpha = 1;
    }
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = exSet.has(i) ? '#8B93A7' : '#ECEFF4';
    if (P.labelIn) { x.font = '700 14px ' + MONO; x.fillText(P.labels[i], cx, cy + 0.5); }
    else {
      x.font = '700 11px ' + MONO; x.fillText(P.labels[i][0], cx, cy + 0.5);
      x.font = '9.5px ' + MONO; x.lineWidth = 3; x.strokeStyle = '#0B0D12'; x.strokeText(P.labels[i], cx, cy + r + 11);
      x.fillStyle = '#97A0B5'; x.fillText(P.labels[i], cx, cy + r + 11);
    }
    if (informed) { x.font = '9.5px ' + MONO; x.fillStyle = 'rgba(244,211,69,.9)'; x.textAlign = 'left'; x.fillText('h=' + P.h[i], cx + r + 4, cy - r + 2); x.textAlign = 'center'; }
    if (i === P.src) { x.font = '8.5px ' + MONO; x.fillStyle = '#5C6579'; x.fillText('START', cx, cy - r - 10); }
    if (i === P.dst) { x.font = '8.5px ' + MONO; x.fillStyle = '#83C167'; x.fillText('GOAL', cx, cy - r - 12); }
    if (st.a === 'stuck' && i === st.cur) { x.font = '700 10px ' + MONO; x.fillStyle = '#FC6255'; x.fillText(T.searchlab.s18, cx, cy - r - 12); }
  }
  const lim = limitAt[stepIdx];
  if (algo === 'IDS' && lim != null) {
    x.font = '700 12px ' + MONO; x.fillStyle = '#F4D345'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    x.fillText('ℓ = ' + lim, 14, 20);
  }
}

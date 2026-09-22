import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode, type TouchEvent } from 'react';
import { Html } from '@/components/Html';
import { prefersReducedMotion } from '@/lib/motion';
import { acceptance, BEAM_POOL, LANDSCAPE, LANDSCAPE_PATHS } from './local-search-engine';
import { T } from './lesson06.text';

// Keep native lab scrolling and range inputs from triggering deck navigation.
export function keepLabTouch(event: TouchEvent) { event.stopPropagation(); }

export function Choices({ label, options, value, onChange }: { label: string; options: string[]; value: number; onChange: (i: number) => void }) {
  return <div className="ls-choices" role="group" aria-label={label}>
    {options.map((option, i) => <button type="button" key={option} className={`btn ${value === i ? 'btn--toggle-on' : ''}`} aria-pressed={value === i} onClick={() => onChange(i)}>{option}</button>)}
  </div>;
}
export function Tabs({ label, options, value, onChange, children }: { label: string; options: string[]; value: number; onChange: (i: number) => void; children: ReactNode }) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function key(event: KeyboardEvent<HTMLButtonElement>, i: number) {
    const next = event.key === 'ArrowRight' ? (i + 1) % options.length : event.key === 'ArrowLeft' ? (i + options.length - 1) % options.length : event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault(); event.stopPropagation(); onChange(next); refs.current[next]?.focus();
  }
  return <div onTouchStart={keepLabTouch} onTouchEnd={keepLabTouch}>
    <div className="ls-choices" role="tablist" aria-label={label}>{options.map((option, i) => <button type="button" role="tab" key={option} ref={el => { refs.current[i] = el; }} id={`${id}-${i}`} aria-controls={`${id}-panel`} aria-selected={value === i} tabIndex={value === i ? 0 : -1} className={`btn ${value === i ? 'btn--toggle-on' : ''}`} onClick={() => onChange(i)} onKeyDown={e => key(e, i)}>{option}</button>)}</div>
    <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${value}`}>{children}</div>
  </div>;
}
function useSceneLoop(count: number, scenario: number, interval = 1100) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(!document.hidden);
  const [frame, setFrame] = useState({ scenario, step: 0 });
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    const change = () => setForeground(!document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', change); };
  }, []);
  useEffect(() => { setFrame({ scenario, step: 0 }); }, [scenario]);
  useEffect(() => {
    if (!visible || !foreground || prefersReducedMotion) return;
    const timer = window.setInterval(() => setFrame(f => ({ scenario, step: ((f.scenario === scenario ? f.step : 0) + 1) % count })), interval);
    return () => window.clearInterval(timer);
  }, [visible, foreground, scenario, count, interval]);
  return { ref, step: prefersReducedMotion ? count - 1 : frame.scenario === scenario ? Math.min(frame.step, count - 1) : 0, running: visible && foreground && !prefersReducedMotion };
}
export function Landscape() {
  const [mode, setMode] = useState(0);
  const path = LANDSCAPE_PATHS[mode];
  const { ref, step, running } = useSceneLoop(path.length, mode);
  const current = path[step], best = Math.max(...path.slice(0, step + 1).map(i => LANDSCAPE[i]));
  const x = (i: number) => 45 + i * 53;
  const y = (value: number) => 263 - value * 17;
  const points = LANDSCAPE.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  return <div className="card ls-visual" ref={ref} data-loop-state={running ? 'running' : 'suspended'} data-frame={step}>
    <div className="kicker">{T.landscape.title}</div>
    <Tabs label={T.landscape.label} options={T.landscape.tabs} value={mode} onChange={setMode}>
      <svg className="ls-landscape" viewBox="0 0 700 310" role="img" aria-label={T.landscape.captions[mode]}>
        <path d={`M45,263 L${points.replaceAll(' ', ' L')} L628,263 Z`} className="ls-land-fill" />
        {[4, 8, 12].map(v => <g key={v}><line x1="45" x2="655" y1={y(v)} y2={y(v)} className="ls-gridline"/><text x="17" y={y(v) + 4}>{v}</text></g>)}
        <polyline points={points} className="ls-land-line" />
        {path.slice(1, step + 1).map((p, i) => <line key={i} x1={x(path[i])} y1={y(LANDSCAPE[path[i]])} x2={x(p)} y2={y(LANDSCAPE[p])} className="ls-trail" strokeDasharray={Math.abs(p - path[i]) > 1 ? '7 6' : undefined} />)}
        <circle cx={x(9)} cy={y(12)} r="11" className="ls-global" />
        <circle cx={x(current)} cy={y(LANDSCAPE[current])} r="7" className="ls-current" />
        <text x="45" y="24">{T.landscape.y}</text><text x="650" y="295" textAnchor="end">{T.landscape.x}</text>
        <text x={x(3)} y={y(8) - 17} textAnchor="middle">V = 8</text><text x={x(9)} y={y(12) - 17} textAnchor="middle">V = 12</text>
      </svg>
      <div className="ls-metrics"><span>{T.landscape.current}: <strong>V = {LANDSCAPE[current]}</strong></span><span>{T.landscape.best}: <strong>{best}</strong></span></div>
      <p className="ls-prose">{T.landscape.captions[mode]}</p>
    </Tabs>
    <p className="ls-note">{T.landscape.note}</p>
  </div>;
}
export function AnnealingLab() {
  const [temperature, setTemperature] = useState(10), [delta, setDelta] = useState(2);
  const probability = acceptance(delta, temperature);
  return <div className="card ls-visual" onTouchStart={keepLabTouch} onTouchEnd={keepLabTouch}>
    <div className="kicker">{T.annealing.title}</div>
    <div className="ls-grid ls-annealing">
      <div className="ls-controls">
        <label>{T.annealing.temperature}: <strong>{temperature}</strong><input type="range" min="0" max="10" step="0.5" value={temperature} onChange={e => setTemperature(Number(e.target.value))} /></label>
        <label>{T.annealing.delta}: <strong>{delta}</strong><input type="range" min="1" max="8" step="1" value={delta} onChange={e => setDelta(Number(e.target.value))} /></label>
        <p className="ls-note">{T.annealing.sample} · {T.annealing.accept}</p>
      </div>
      <div className="ls-probability">
        <span className="kicker">{T.annealing.probability}</span><strong>{(probability * 100).toFixed(2)}%</strong>
        <div className="ls-probability-bar"><span style={{ width: `${probability * 100}%` }} /><i /></div>
        <code>{temperature > 0 ? `P = exp(−${delta}/${temperature})` : 'P = 0'}</code>
        <p>{temperature === 0 ? T.annealing.frozen : probability > 0.3 ? T.annealing.accepted : T.annealing.reject}</p>
      </div>
    </div><p className="ls-note">{T.annealing.note}</p>
  </div>;
}
export function BeamVisual() {
  const [mode, setMode] = useState(0);
  const { ref, step, running } = useSceneLoop(4, mode, 1800);
  const selected = mode === 0 ? [0, 1] : [0, 3];
  return <div className="card ls-visual" ref={ref} data-loop-state={running ? 'running' : 'suspended'} data-frame={step}>
    <div className="kicker">{T.beam.title}</div>
    <Tabs label={T.beam.label} options={T.beam.tabs} value={mode} onChange={setMode}>
      <p className="ls-phase">{step + 1} / 4 · {T.beam.phases[step]}</p>
      <div className="ls-beam-stage"><span className="kicker">{T.beam.parents}</span><div className="ls-genes"><b>A</b><b>B</b></div></div>
      <div className={`ls-beam-stage ${step >= 1 ? 'ls-stage-active' : ''}`}><span className="kicker">↓ {T.beam.pool}</span><div className="ls-beam-pool">{BEAM_POOL.map((c, i) => <div key={i} className={`ls-candidate ${step >= 2 && selected.includes(i) ? 'ls-selected' : ''}`}><span>{c.parent}</span><strong>{c.value}</strong>{step >= 2 && selected.includes(i) ? <span aria-hidden="true">✓</span> : <span>·</span>}</div>)}</div></div>
      <div className="ls-beam-stage"><span className="kicker">↓ {T.beam.chosen}</span><div className="ls-genes">{selected.map(i => <b key={i}>{step >= 2 ? `${BEAM_POOL[i].parent}:${BEAM_POOL[i].value}` : '—'}</b>)}</div></div>
      <Html as="p" className="ls-prose" t={T.beam.notes[mode]} />
    </Tabs><p className="ls-note">{T.beam.note}</p>
  </div>;
}

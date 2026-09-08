import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { T } from './lesson07.text';

/** One visible scene owns one clock. Hidden slides/tabs never keep a background clock. */
export function useLessonLoop(length: number, scenario: string, intervalMs = 2200) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(() => !document.hidden);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [frame, setFrame] = useState({ scenario, step: 0 });
  const count = Math.max(1, length);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
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
    if (!running || count <= 1) return;
    const timer = window.setInterval(() => setFrame(current => ({ scenario, step: ((current.scenario === scenario ? current.step : 0) + 1) % count })), intervalMs);
    return () => window.clearInterval(timer);
  }, [running, reduced, count, scenario, intervalMs]);
  return { ref, step: reduced ? count - 1 : frame.scenario === scenario ? Math.min(frame.step, count - 1) : 0 };
}

export function ScenarioTabs({ label, options, selected, onChange, children }: { label: string; options: string[]; selected: number; onChange: (n: number) => void; children: ReactNode }) {
  const id = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % options.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + options.length) % options.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else return;
    event.preventDefault(); onChange(next); buttons.current[next]?.focus();
  }
  return <div className="def-scenarios">
    <div className="def-scenario-tabs" role="tablist" aria-label={label}>{options.map((option, i) => <button key={option} ref={element => { buttons.current[i] = element; }} type="button" role="tab" id={`${id}-tab-${i}`} aria-selected={selected === i} aria-controls={`${id}-panel`} tabIndex={selected === i ? 0 : -1} onKeyDown={event => navigate(event, i)} onClick={() => onChange(i)}>{option}</button>)}</div>
    <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${selected}`}>{children}</div>
  </div>;
}
export function LoopProgress({ step, length }: { step: number; length: number }) {
  return <div className="def-loop-progress"><span className="def-loop-running">{T.visuals.loopLabel}</span><span className="def-loop-static">{T.visuals.staticLabel}</span><div aria-hidden="true">{Array.from({ length }, (_, i) => <i key={i} className={i === step ? 'is-current' : ''} />)}</div></div>;
}

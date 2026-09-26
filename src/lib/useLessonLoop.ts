import { useEffect, useRef, useState } from 'react';

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


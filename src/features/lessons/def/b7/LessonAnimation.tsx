import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { T } from './lesson07.text';

export { useLessonLoop } from '@/lib/useLessonLoop';

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

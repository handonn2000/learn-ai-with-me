/** Shared presentation timeline: scene and HTML always explain the same transfer. */
export type WorldPacket = 'row' | 'event' | 'result' | 'batch' | 'control';
export type WorldStage = { node: number; edge?: string; packet: WorldPacket; duration: number };
export const WORLD_TIMELINES: WorldStage[][] = [
  [
    { node: 0, packet: 'row', duration: 3000 },
    { node: 1, edge: '0>1', packet: 'row', duration: 3600 },
    { node: 2, edge: '1>2', packet: 'event', duration: 3600 },
    { node: 4, edge: '2>4', packet: 'event', duration: 4200 },
    { node: 4, packet: 'row', duration: 4200 },
  ],
  [
    { node: 0, packet: 'row', duration: 2600 },
    { node: 1, edge: '0>1', packet: 'row', duration: 3200 },
    { node: 2, edge: '1>2', packet: 'event', duration: 3200 },
    { node: 3, edge: '2>3', packet: 'event', duration: 3600 },
    { node: 3, packet: 'result', duration: 3200 },
    { node: 2, edge: '3>2', packet: 'result', duration: 3600 },
    { node: 4, edge: '2>4', packet: 'result', duration: 4000 },
    { node: 4, packet: 'result', duration: 4000 },
  ],
  [
    { node: 0, edge: '5>0', packet: 'control', duration: 3200 },
    { node: 0, packet: 'batch', duration: 3200 },
    { node: 4, edge: '5>4', packet: 'control', duration: 3200 },
    { node: 4, edge: '0>4', packet: 'batch', duration: 5000 },
    { node: 4, packet: 'batch', duration: 4200 },
  ],
];
export type WorldFrame = { scenario: number; stage: number; progress: number; cycle: number; complete: boolean };
export function getWorldFrame(scenario: number, elapsedMs: number, reduced = false): WorldFrame {
  const steps = WORLD_TIMELINES[scenario];
  const duration = steps.reduce((sum, step) => sum + step.duration, 0);
  const time = Math.max(0, elapsedMs);
  if (reduced) return { scenario, stage: steps.length - 1, progress: 1, cycle: 0, complete: true };
  let remaining = time % duration;
  let stage = 0;
  while (stage < steps.length - 1 && remaining >= steps[stage].duration) remaining -= steps[stage++].duration;
  return { scenario, stage, progress: remaining / steps[stage].duration, cycle: Math.floor(time / duration), complete: stage === steps.length - 1 };
}

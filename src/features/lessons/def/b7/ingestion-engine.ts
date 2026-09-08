// Deterministic teaching fixtures. No Kafka protocol or external sink is executed.
export const EVENTS = [
  { id: 'e1', key: 'A', value: 10 }, { id: 'e2', key: 'B', value: 20 },
  { id: 'e3', key: 'A', value: 12 }, { id: 'e4', key: 'C', value: 30 },
  { id: 'e5', key: 'B', value: 25 }, { id: 'e6', key: 'A', value: 15 },
];
export interface Routed { id: string; key: string; value: number; partition: number; offset: number }
export interface RoutingState { sent: number; logs: Routed[][]; commits: number[][]; action: number }
export function initialRouting(partitions: number): RoutingState {
  return { sent: 0, logs: Array.from({ length: partitions }, () => []), commits: [Array(partitions).fill(0), Array(partitions).fill(0)], action: 0 };
}
export function sendEvent(s: RoutingState, keyed: boolean): RoutingState {
  if (s.sent === EVENTS.length) return s;
  const e = EVENTS[s.sent];
  const p = (keyed ? [...e.key].reduce((n, c) => n + c.charCodeAt(0), 0) : s.sent) % s.logs.length;
  return { ...s, sent: s.sent + 1, action: 1, logs: s.logs.map((log, i) => i === p ? [...log, { ...e, partition: p, offset: log.length }] : log) };
}
export function readGroup(s: RoutingState, group: number): RoutingState {
  return { ...s, action: 2, commits: s.commits.map((positions, g) => g === group ? positions.map((v, p) => Math.min(v + 1, s.logs[p].length)) : positions) };
}
export interface CrashFrame { action: number; balance: number; committed: number; applied: boolean }
export function crashTrace(commitBefore: boolean, crashAfter: boolean, protectedSink: boolean): CrashFrame[] {
  let balance = 0, committed = 0, applied = false;
  const trace: CrashFrame[] = [];
  const push = (action: number) => trace.push({ action, balance, committed, applied });
  push(0);
  if (commitBefore) { committed = 1; push(1); }
  if (crashAfter) { balance += 10; applied = protectedSink; push(2); }
  push(3); push(4);
  if (!committed) {
    if (protectedSink && applied) push(6);
    else { balance += 10; applied = protectedSink; push(crashAfter ? 5 : 2); }
    committed = 1; push(7);
  }
  push(8);
  return trace;
}
export function cdcCapture(step: number, mode: number) {
  const changes = [
    { op: 'INSERT', amount: '10', updated: '1' },
    { op: 'UPDATE', amount: '12', updated: '2' },
    { op: 'DELETE', amount: 'null', updated: '—' },
  ];
  return changes.slice(0, mode === 0 ? Math.min(step, 2) : step);
}
export const RETENTION_LOG = [
  { offset: 0, key: 'A', value: 10, age: 9 }, { offset: 1, key: 'B', value: 20, age: 6 },
  { offset: 2, key: 'A', value: 12, age: 2 }, { offset: 3, key: 'C', value: 30, age: 1 },
];
export function retainedLog(policy: number) {
  if (policy === 1) return RETENTION_LOG.filter((e) => e.age <= 7);
  if (policy === 2) return RETENTION_LOG.slice(-2);
  if (policy === 3) return RETENTION_LOG.filter((e, i, all) => !all.slice(i + 1).some((later) => later.key === e.key));
  return RETENTION_LOG;
}

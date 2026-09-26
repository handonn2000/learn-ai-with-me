/** Small deterministic teaching models, not Spark runtime performance estimates. */
export const ORDERS = [
  { id: 'o1', region: 'VN', amount: 100, paid: true },
  { id: 'o2', region: 'US', amount: 90, paid: false },
  { id: 'o3', region: 'VN', amount: 50, paid: true },
  { id: 'o4', region: 'US', amount: 70, paid: true },
  { id: 'o5', region: 'US', amount: 30, paid: true },
  { id: 'o6', region: 'VN', amount: 20, paid: false },
];
export function batchPlan(early = true) {
  const paid = ORDERS.filter(r => r.paid);
  return { input: ORDERS.length, moved: early ? paid.length : ORDERS.length,
    output: ['VN', 'US'].map(region => ({ region, total: paid.filter(r => r.region === region).reduce((s, r) => s + r.amount, 0) })) };
}
export function cacheModel(capacity, uses, strategy) {
  const partitions = 4;
  const ram = strategy === 'DISK_ONLY' ? 0 : Math.min(partitions, Math.max(0, capacity));
  const disk = strategy === 'MEMORY_ONLY' ? 0 : partitions - ram;
  const missing = partitions - ram - disk;
  return { ram, disk, computed: partitions + missing * (uses - 1), ramReads: ram * (uses - 1), diskReads: disk * (uses - 1) };
}
export function skewModel(salts = 1) {
  const hot = Array.from({ length: salts }, () => 700 / salts);
  const tasks = [...hot, 10, 8, 12];
  return { tasks, total: tasks.reduce((a, b) => a + b, 0), largest: Math.max(...tasks), partialSum: hot.reduce((a, b) => a + b, 0) };
}

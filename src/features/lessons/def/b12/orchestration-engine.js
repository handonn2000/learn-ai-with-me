/** Deterministic teaching models. No external systems, clocks, or side effects. */
export const CHECK_TIME = '2026-05-16T04:00:00Z';
export const INTERVALS = ['2026-05-15', '2026-05-14', '2026-05-13'];

/** @param {Record<string, number>} partitions @param {string} interval */
export function replacePartition(partitions, interval) {
  if (!INTERVALS.includes(interval)) throw new Error('Unknown interval');
  return { ...partitions, [interval]: 3 };
}

/**
 * Single scheduler; two runs of 100 independent tasks; one slot/task, one tick/task.
 * Admission order is stable; eligible runs share capacity round-robin.
 * @param {number[]} completed
 * @param {{parallelism: number, maxRuns: number, slots: number}} limits
 */
export function poolFrame(completed, limits) {
  const { parallelism, maxRuns, slots } = limits;
  if (![parallelism, maxRuns, slots].every(n => Number.isInteger(n) && n > 0) || maxRuns > 2 || completed.length !== 2 || completed.some(n => !Number.isInteger(n) || n < 0 || n > 100)) throw new Error('Invalid simulation state');
  const active = completed.map((n, i) => ({ n, i })).filter(r => r.n < 100).slice(0, maxRuns).map(r => r.i);
  const running = [0, 0];
  let available = Math.min(parallelism, slots);
  while (available > 0) {
    let allocated = false;
    for (const i of active) {
      if (available > 0 && completed[i] + running[i] < 100) { running[i]++; available--; allocated = true; }
    }
    if (!allocated) break;
  }
  const waiting = completed.map((n, i) => active.includes(i) ? 100 - n - running[i] : 0);
  const blocked = completed.map((n, i) => active.includes(i) || n === 100 ? 0 : 100 - n);
  return { running, waiting, blocked, completed: [...completed] };
}

/** @param {number[]} completed @param {{parallelism: number, maxRuns: number, slots: number}} limits */
export function advancePool(completed, limits) {
  const frame = poolFrame(completed, limits);
  return completed.map((n, i) => n + frame.running[i]);
}

/** @param {number} fault */
export function makeBatch(fault = 0) {
  /** @type {Array<Record<string, number | string | null>>} */
  const rows = [
    { order_id: 101, customer_id: 7, amount: 120000, event_time: '2026-05-15T12:00:00Z' },
    { order_id: 102, customer_id: 8, amount: 80000, event_time: '2026-05-15T13:00:00Z' },
    { order_id: 103, customer_id: 9, amount: 50000, event_time: '2026-05-15T14:00:00Z' },
  ];
  let updatedAt = '2026-05-16T03:20:00Z';
  if (fault === 1) rows[1].customer_id = null;
  if (fault === 2) rows[1].order_id = 101;
  if (fault === 3) rows[1].amount = -80000;
  if (fault === 4) updatedAt = '2026-05-14T03:20:00Z';
  if (fault === 5) for (const row of rows) { row.customerId = row.customer_id; delete row.customer_id; }
  if (fault === 6) rows.pop();
  if (fault === 7) rows[1].event_time = '2026-05-17T13:00:00Z';
  return { interval: '2026-05-15', updatedAt, baseline: 3, rows };
}

/** @param {ReturnType<typeof makeBatch>} batch */
export function validateBatch(batch) {
  const { rows } = batch;
  const fields = ['order_id', 'customer_id', 'amount', 'event_time'];
  const schemaCount = rows.filter(r => fields.every(f => Object.hasOwn(r, f)) && typeof r.order_id === 'number' && Number.isInteger(r.order_id) && (r.customer_id === null || (typeof r.customer_id === 'number' && Number.isInteger(r.customer_id))) && typeof r.amount === 'number' && Number.isFinite(r.amount) && typeof r.event_time === 'string' && Number.isFinite(Date.parse(r.event_time))).length;
  const nulls = rows.filter(r => r.customer_id == null).length;
  const duplicates = rows.length - new Set(rows.map(r => r.order_id)).size;
  const invalidAmounts = rows.filter(r => typeof r.amount !== 'number' || !Number.isFinite(r.amount) || r.amount <= 0).length;
  const ageHours = (Date.parse(CHECK_TIME) - Date.parse(batch.updatedAt)) / 3600000;
  const drop = batch.baseline > 0 ? (batch.baseline - rows.length) / batch.baseline : NaN;
  const future = rows.filter(r => typeof r.event_time !== 'string' || !Number.isFinite(Date.parse(r.event_time)) || Date.parse(r.event_time) > Date.parse(CHECK_TIME)).length;
  const checks = [
    { pass: rows.length > 0 && schemaCount === rows.length, observed: `${schemaCount}/${rows.length}`, expected: fields.join(', ') },
    { pass: nulls === 0, observed: String(nulls), expected: '= 0' },
    { pass: duplicates === 0, observed: String(duplicates), expected: '= 0' },
    { pass: invalidAmounts === 0, observed: String(invalidAmounts), expected: '= 0' },
    { pass: Number.isFinite(ageHours) && ageHours >= 0 && ageHours <= 24, observed: `${ageHours.toFixed(2)} h`, expected: '0–24 h' },
    { pass: Number.isFinite(drop) && drop <= 0.30, observed: `${(drop * 100).toFixed(1)}%`, expected: '≤ 30%' },
    { pass: future === 0, observed: String(future), expected: '= 0' },
  ];
  return { pass: checks.every(c => c.pass), checks, snapshot: JSON.stringify(batch) };
}

/** Bind the publication decision to the exact validated snapshot.
 * @param {ReturnType<typeof makeBatch>} batch
 * @param {ReturnType<typeof validateBatch> | null} result
 */
export function canPublish(batch, result) {
  return !!result?.pass && result.snapshot === JSON.stringify(batch);
}

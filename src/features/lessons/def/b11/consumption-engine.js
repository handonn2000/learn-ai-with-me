export function aggregateMeasure(kind, method) {
  const values = kind === 'revenue' ? [500, 700] : [100, 80, 120];
  const result = method === 'sum' ? values.reduce((a, b) => a + b, 0) : method === 'average' ? values.reduce((a, b) => a + b, 0) / values.length : values[values.length - 1];
  return { values, result, appropriate: kind === 'revenue' ? method === 'sum' : method !== 'sum' };
}
export function scdRows(type, changes = 1) {
  const history = [{ currency: 'GBP', from: '2025-09-01' }, { currency: 'USD', from: '2025-09-26' }, { currency: 'EUR', from: '2025-10-10' }].slice(0, changes + 1);
  const latest = history[history.length - 1].currency;
  if (type === 0) return [{ sk: '1', currency: 'GBP', current: 'GBP', previous: '—', from: '—', to: '—', table: 'dim_customer' }];
  if (type === 1 || type === 3) return [{ sk: '1', currency: latest, current: latest, previous: type === 3 ? history[history.length - 2]?.currency || '—' : '—', from: '—', to: '—', table: 'dim_customer' }];
  return history.map((h, i) => ({ sk: String(i + 1), currency: h.currency, current: type === 6 ? latest : h.currency, previous: type === 6 ? history[i - 1]?.currency || '—' : '—', from: h.from, to: history[i + 1]?.from || '∞', table: type === 4 && i < history.length - 1 ? 'customer_history' : 'dim_customer' }));
}
export const FEATURES = [{ time: 9 * 60 + 45, value: 40 }, { time: 9 * 60 + 55, value: 45.73 }, { time: 10 * 60 + 5, value: 47.10 }];
export function featureAt(mode = 'historical', ttl = 10, eventTime = 600) {
  const rows = mode === 'historical' ? FEATURES.filter(f => f.time <= eventTime && eventTime - f.time <= ttl) : FEATURES;
  const selected = rows[rows.length - 1] || null;
  return { selected, leakage: Boolean(selected && selected.time > eventTime) };
}

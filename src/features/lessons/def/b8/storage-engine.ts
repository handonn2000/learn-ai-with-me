/** Small deterministic teaching fixture; no storage service or network calls. */
export type BronzeRow = { rawId: string; orderId: number | null; amount: number | string; loadTime: string; processId: string };
export const BRONZE: readonly BronzeRow[] = [
  { rawId: 'B01', orderId: 101, amount: 120000, loadTime: '2026-09-08T08:00:00Z', processId: 'load-01' },
  { rawId: 'B02', orderId: 101, amount: 120000, loadTime: '2026-09-08T08:00:01Z', processId: 'load-01' },
  { rawId: 'B03', orderId: 102, amount: 80000, loadTime: '2026-09-08T08:00:02Z', processId: 'load-01' },
  { rawId: 'B04', orderId: 103, amount: 'invalid', loadTime: '2026-09-08T08:00:03Z', processId: 'load-01' },
  { rawId: 'B05', orderId: null, amount: 50000, loadTime: '2026-09-08T08:00:04Z', processId: 'load-01' },
];
export type QuarantineReason = 'amount' | 'key' | 'conflict';
export type SilverRow = { orderId: number; amount: number; rawId: string };
export type PipelineState = {
  silver: SilverRow[];
  quarantine: { rawId: string; reason: QuarantineReason }[];
  duplicates: { rawId: string; originalRawId: string; orderId: number }[];
  processed: string[];
  gold: number;
};
export type PipelineAction = 'ready' | 'accepted' | 'duplicate' | 'amount' | 'key' | 'conflict' | 'replayed' | 'aggregate';
export type PipelineFrame = { state: PipelineState; action: PipelineAction; rawId: string | null };
export const emptyPipeline = (): PipelineState => ({ silver: [], quarantine: [], duplicates: [], processed: [], gold: 0 });

/** Stable raw IDs stop replay; the business key stops a separately ingested exact retry. */
export function processRow(previous: PipelineState, row: BronzeRow): PipelineFrame {
  if (previous.processed.includes(row.rawId)) return { state: previous, action: 'replayed', rawId: row.rawId };
  const state: PipelineState = { ...previous, silver: [...previous.silver], quarantine: [...previous.quarantine], duplicates: [...previous.duplicates], processed: [...previous.processed, row.rawId] };
  let action: PipelineAction;
  if (row.orderId === null || !Number.isInteger(row.orderId)) action = 'key';
  else if (typeof row.amount !== 'number' || !Number.isFinite(row.amount) || row.amount < 0) action = 'amount';
  else {
    const old = state.silver.find(item => item.orderId === row.orderId);
    if (!old) {
      action = 'accepted';
      state.silver.push({ orderId: row.orderId, amount: row.amount, rawId: row.rawId });
    } else if (old.amount === row.amount) {
      action = 'duplicate';
      state.duplicates.push({ rawId: row.rawId, originalRawId: old.rawId, orderId: row.orderId });
    } else action = 'conflict';
  }
  if (action === 'key' || action === 'amount' || action === 'conflict') state.quarantine.push({ rawId: row.rawId, reason: action });
  return { state, action, rawId: row.rawId };
}
export function pipelineTrace(initial = emptyPipeline(), rows: readonly BronzeRow[] = BRONZE): PipelineFrame[] {
  const trace: PipelineFrame[] = [{ state: initial, action: 'ready', rawId: null }];
  for (const row of rows) trace.push(processRow(trace[trace.length - 1].state, row));
  const last = trace[trace.length - 1].state;
  trace.push({ state: { ...last, gold: last.silver.reduce((total, row) => total + row.amount, 0) }, action: 'aggregate', rawId: null });
  return trace;
}

export const GOVERNANCE_CONTROLS = ['catalog', 'owner', 'validation', 'lineage', 'retention'] as const;
export type GovernanceControl = typeof GOVERNANCE_CONTROLS[number];
export type GovernancePolicy = Record<GovernanceControl, boolean>;
export const emptyPolicy = (): GovernancePolicy => ({ catalog: false, owner: false, validation: false, lineage: false, retention: false });
export const GOVERNANCE_ISSUES = ['discovery', 'accountability', 'badAmount', 'duplicate', 'stale', 'lineage', 'expired'] as const;
export type GovernanceIssue = typeof GOVERNANCE_ISSUES[number];
export type GovernanceStatus = 'open' | 'fixed' | 'detected';
export function governanceStatus(issue: GovernanceIssue, policy: GovernancePolicy): GovernanceStatus {
  if (issue === 'stale') return policy.validation ? 'detected' : 'open';
  const responsible: Record<Exclude<GovernanceIssue, 'stale'>, GovernanceControl> = { discovery: 'catalog', accountability: 'owner', badAmount: 'validation', duplicate: 'validation', lineage: 'lineage', expired: 'retention' };
  return policy[responsible[issue]] ? 'fixed' : 'open';
}

export type HdfsPhase = { route: 'idle' | 'metadata-request' | 'metadata-response' | 'data-request' | 'unavailable' | 'replica-request' | 'data-response' | 'complete'; bytesAtClient: boolean; source: 'none' | 'A' | 'B' };
export function hdfsTrace(fallback: boolean): HdfsPhase[] {
  const trace: HdfsPhase[] = [
    { route: 'idle', bytesAtClient: false, source: 'none' },
    { route: 'metadata-request', bytesAtClient: false, source: 'none' },
    { route: 'metadata-response', bytesAtClient: false, source: 'none' },
    { route: 'data-request', bytesAtClient: false, source: 'A' },
  ];
  if (fallback) trace.push({ route: 'unavailable', bytesAtClient: false, source: 'A' }, { route: 'replica-request', bytesAtClient: false, source: 'B' });
  trace.push({ route: 'data-response', bytesAtClient: true, source: fallback ? 'B' : 'A' }, { route: 'complete', bytesAtClient: true, source: fallback ? 'B' : 'A' }, { route: 'complete', bytesAtClient: true, source: fallback ? 'B' : 'A' });
  return trace;
}

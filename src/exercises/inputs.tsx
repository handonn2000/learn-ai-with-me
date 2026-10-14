import { CheckIcon, CrossIcon } from '@/ui/icons'
import { GraphView, type NodeState } from '@/widgets/GraphView'
import { Rich } from '@/ui/Rich'
import type { Answer } from './grade'
import type { ChoiceEx, ClassifyEx, Exercise, NumberEx, OrderEx, PickNodesEx } from './types'

type Std = Exclude<Exercise, { kind: 'trace' }>

export function emptyAnswer(ex: Std): Answer {
  switch (ex.kind) {
    case 'choice':
      return { kind: 'choice', picked: [] }
    case 'number':
      return { kind: 'number', value: NaN }
    case 'pick-nodes':
      return { kind: 'pick-nodes', picked: [] }
    case 'order':
      return { kind: 'order', sequence: [] }
    case 'classify':
      return { kind: 'classify', assigned: ex.items.map(() => null) }
  }
}

export function solutionAnswer(ex: Std): Answer {
  switch (ex.kind) {
    case 'choice':
      return { kind: 'choice', picked: ex.answer }
    case 'number':
      return { kind: 'number', value: ex.answer }
    case 'pick-nodes':
      return { kind: 'pick-nodes', picked: ex.answer }
    case 'order':
      return { kind: 'order', sequence: ex.answer }
    case 'classify':
      return { kind: 'classify', assigned: ex.items.map((i) => i.group) }
  }
}

export function isReady(ex: Std, a: Answer): boolean {
  if (a.kind === 'choice') return a.picked.length > 0
  if (a.kind === 'number') return Number.isFinite(a.value)
  if (a.kind === 'pick-nodes') return a.picked.length > 0
  if (a.kind === 'order') return ex.kind === 'order' && a.sequence.length === ex.items.length
  if (a.kind === 'classify') return a.assigned.every((x) => x !== null)
  return false
}

interface P<E, A extends Answer['kind']> {
  ex: E
  value: Answer
  onChange: (a: Extract<Answer, { kind: A }>) => void
  locked: boolean
}

export function ChoiceInput({ ex, value, onChange, locked }: P<ChoiceEx, 'choice'>) {
  const picked = value.kind === 'choice' ? value.picked : []
  const multi = ex.answer.length > 1
  return (
    <fieldset className="grid gap-2.5">
      <legend className="sr-only">{multi ? 'Chọn mọi đáp án đúng' : 'Chọn một đáp án'}</legend>
      {multi && <p className="text-[14px] text-muted">Chọn mọi đáp án đúng.</p>}
      {ex.options.map((opt, i) => {
        const on = picked.includes(i)
        const showRight = locked && ex.answer.includes(i)
        return (
          <label
            key={i}
            className={[
              'flex cursor-pointer items-start gap-3 rounded-xl border-2 bg-surface px-4 py-3 transition-colors',
              showRight ? 'border-correct bg-correct-soft' : on ? 'border-ink' : 'border-line hover:border-muted',
              locked && 'cursor-default',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <input
              type={multi ? 'checkbox' : 'radio'}
              name={ex.id}
              className="mt-1.5 size-4 accent-[var(--ink)]"
              checked={on}
              disabled={locked}
              onChange={() =>
                onChange({ kind: 'choice', picked: multi ? (on ? picked.filter((x) => x !== i) : [...picked, i]) : [i] })
              }
            />
            <Rich html={opt} />
          </label>
        )
      })}
    </fieldset>
  )
}

export function NumberInput({ ex, value, onChange, locked, onSubmit }: P<NumberEx, 'number'> & { onSubmit: () => void }) {
  const v = value.kind === 'number' && Number.isFinite(value.value) ? String(value.value) : ''
  return (
    <div className="space-y-5">
      {ex.problem && (
        <div className="rounded-2xl border border-line bg-surface p-3">
          <GraphView problem={ex.problem} showCosts={ex.showCosts} showH={ex.showH} />
        </div>
      )}
      <label className="flex items-center gap-3">
        <span className="text-muted">Đáp số</span>
        <input
          inputMode="decimal"
          className="h-12 w-32 rounded-xl border-2 border-line bg-surface px-3 font-mono text-lg focus:border-ink focus:outline-none disabled:opacity-70"
          value={v}
          disabled={locked}
          onChange={(e) => {
            const t = e.target.value.replace(',', '.').trim()
            onChange({ kind: 'number', value: t === '' ? NaN : Number(t) })
          }}
          onKeyDown={(e) => e.key === 'Enter' && Number.isFinite(value.kind === 'number' ? value.value : NaN) && onSubmit()}
        />
        {ex.unit && <span className="text-muted">{ex.unit}</span>}
      </label>
    </div>
  )
}

export function PickNodesInput({ ex, value, onChange, locked }: P<PickNodesEx, 'pick-nodes'>) {
  const picked = value.kind === 'pick-nodes' ? value.picked : []
  const states: Record<string, NodeState> = {}
  for (const s of ex.highlight?.explored ?? []) states[s] = 'explored'
  for (const s of ex.highlight?.frontier ?? []) states[s] = 'frontier'
  if (ex.highlight?.current) states[ex.highlight.current] = 'current'
  for (const s of picked) states[s] = 'selected'
  return (
    <div className="rounded-2xl border border-line bg-surface p-3">
      <GraphView
        problem={ex.problem}
        showCosts={ex.showCosts}
        showH={ex.showH}
        states={states}
        onNodeClick={locked ? undefined : (id) => onChange({ kind: 'pick-nodes', picked: picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id] })}
        label="Bản đồ — bấm vào nút để chọn"
      />
      <p className="px-1 pt-2 text-[14px] text-muted">
        Bấm vào nút để chọn hoặc bỏ chọn. Đã chọn: <span className="font-mono text-ink">{picked.length ? [...picked].sort().join(', ') : '—'}</span>
      </p>
    </div>
  )
}

export function OrderInput({ ex, value, onChange, locked }: P<OrderEx, 'order'>) {
  const seq = value.kind === 'order' ? value.sequence : []
  return (
    <div className="space-y-5">
      {ex.problem && (
        <div className="rounded-2xl border border-line bg-surface p-3">
          <GraphView problem={ex.problem} showCosts={ex.showCosts} path={seq} />
        </div>
      )}
      <div>
        <p className="mb-2 text-[14px] text-muted">Bấm lần lượt theo thứ tự</p>
        <div className="flex flex-wrap gap-2">
          {ex.items.map((it) => {
            const used = seq.includes(it)
            return (
              <button
                key={it}
                disabled={locked || used}
                onClick={() => onChange({ kind: 'order', sequence: [...seq, it] })}
                className="h-11 min-w-11 rounded-xl border-2 border-line bg-surface px-3 font-mono font-semibold hover:border-ink disabled:opacity-30"
              >
                <Rich html={it} />
              </button>
            )
          })}
        </div>
      </div>
      <ol className="flex min-h-14 flex-wrap items-center gap-2 rounded-xl border-2 border-dashed border-line p-2" aria-label="Thứ tự bạn đã chọn">
        {seq.length === 0 && <li className="px-2 text-[14px] text-muted">Chưa chọn gì</li>}
        {seq.map((it, i) => (
          <li key={it}>
            <button
              disabled={locked}
              onClick={() => onChange({ kind: 'order', sequence: seq.filter((x) => x !== it) })}
              className="flex h-10 items-center gap-2 rounded-lg bg-ink px-3 font-mono text-surface disabled:cursor-default"
              aria-label={`Vị trí ${i + 1}: ${it}. Bấm để bỏ`}
            >
              <span className="text-[12px] opacity-60">{i + 1}</span>
              <Rich html={it} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function ClassifyInput({ ex, value, onChange, locked }: P<ClassifyEx, 'classify'>) {
  const assigned = value.kind === 'classify' ? value.assigned : ex.items.map(() => null)
  return (
    <ul className="space-y-3">
      {ex.items.map((it, i) => {
        const right = locked ? assigned[i] === it.group : null
        return (
          <li key={i} className="rounded-xl border border-line bg-surface p-3">
            <div className="mb-2 flex items-start gap-2">
              {right !== null && (right ? <CheckIcon width={18} height={18} className="mt-1 text-correct" /> : <CrossIcon width={18} height={18} className="mt-1 text-wrong" />)}
              <Rich html={it.text} className="font-medium" />
            </div>
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={`Nhóm cho: ${it.text.replace(/<[^>]+>/g, '')}`}>
              {(it.groups ?? ex.groups).map((g, gi) => {
                const on = assigned[i] === gi
                return (
                  <button
                    key={gi}
                    role="radio"
                    aria-checked={on}
                    disabled={locked}
                    onClick={() => onChange({ kind: 'classify', assigned: assigned.map((x, j) => (j === i ? gi : x)) })}
                    className={`rounded-full border px-3 py-1 text-[14px] ${on ? 'border-ink bg-ink text-surface' : 'border-line text-muted hover:border-muted hover:text-ink'}`}
                  >
                    {g}
                  </button>
                )
              })}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

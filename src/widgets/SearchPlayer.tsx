import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { runSearch, type Algo, type GraphProblem, type TraceStep } from '@/algorithms/search'
import { describeStep } from '@/algorithms/describe'
import { GraphView, Legend, type NodeState } from './GraphView'
import { FrontierList } from './FrontierList'

/** Trạng thái tô màu nút tại một bước của trace. */
export function statesAt(step: TraceStep): Record<string, NodeState> {
  const st: Record<string, NodeState> = {}
  for (const s of step.explored) st[s] = 'explored'
  for (const f of step.frontier) st[f.state] = 'frontier'
  if (step.expanded) st[step.expanded] = 'current'
  if (step.done?.found) for (const s of step.done.path) st[s] = 'path'
  return st
}

/** Chạy từng bước một thuật toán trên bản đồ. Người học bấm để đi tiếp — không tự chạy. */
export function SearchPlayer({ problem, algo, showCosts = true, showH = false }: { problem: GraphProblem; algo: Algo; showCosts?: boolean; showH?: boolean }) {
  const trace = useMemo(() => runSearch(problem, algo), [problem, algo])
  const [i, setI] = useState(0)
  const step = trace[i]
  const caption = describeStep(algo, step, i > 0 ? trace[i - 1].frontier : null)
  const last = i === trace.length - 1

  return (
    <figure className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
      <GraphView
        problem={problem}
        showCosts={showCosts}
        showH={showH}
        states={statesAt(step)}
        path={step.done?.found ? step.done.path : []}
        label={`Bản đồ, bước ${i} của ${trace.length - 1}`}
      />
      <div className="mt-2 space-y-3 px-1">
        <FrontierList algo={algo} items={step.frontier} />
        <p className="min-h-[3.2em] text-[15px] leading-snug" aria-live="polite">
          <span className="mr-2 font-mono text-[13px] text-muted">
            {i}/{trace.length - 1}
          </span>
          {caption}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Legend />
          <div className="flex items-center gap-1">
            <button className="grid size-10 place-items-center rounded-full text-muted hover:bg-paper hover:text-ink disabled:opacity-30" onClick={() => setI(0)} disabled={i === 0} aria-label="Về bước đầu">
              <RotateCcw size={18} />
            </button>
            <button className="grid size-10 place-items-center rounded-full text-muted hover:bg-paper hover:text-ink disabled:opacity-30" onClick={() => setI(i - 1)} disabled={i === 0} aria-label="Bước trước">
              <ChevronLeft size={20} />
            </button>
            <button
              className="inline-flex h-10 items-center gap-1 rounded-full bg-ink px-4 text-[14px] font-semibold text-surface disabled:opacity-30"
              onClick={() => setI(i + 1)}
              disabled={last}
            >
              Bước tiếp <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </figure>
  )
}

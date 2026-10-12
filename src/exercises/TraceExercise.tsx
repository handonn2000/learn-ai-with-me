import { useMemo, useState } from 'react'
import { runSearch } from '@/algorithms/search'
import { describeStep } from '@/algorithms/describe'
import { GraphView, Legend, type NodeState } from '@/widgets/GraphView'
import { FrontierList } from '@/widgets/FrontierList'
import { statesAt } from '@/widgets/SearchPlayer'
import { Button } from '@/ui/Button'
import { Feedback, StepFrame } from '@/ui/StepFrame'
import { ExerciseEyebrow, HintNote } from './ExerciseView'
import { Rich } from '@/ui/Rich'
import type { Outcome } from '@/learning/progress'
import type { TraceEx } from './types'

const algoName = { bfs: 'BFS', ucs: 'UCS', gbfs: 'GBFS', astar: 'A*' } as const

/** Đóng vai thuật toán: mỗi lần bấm là đoán nút được mở rộng tiếp theo. */
export function TraceExercise({ exercise: ex, onDone, doneLabel, eyebrow, caption }: { exercise: TraceEx; onDone: (o: Outcome) => void; doneLabel: string; eyebrow?: string; caption?: string }) {
  const trace = useMemo(() => runSearch(ex.problem, ex.algo), [ex])
  const from = ex.from ?? 0
  // trace[k] = trạng thái sau k lần mở rộng
  const [at, setAt] = useState(from)
  const [mistakes, setMistakes] = useState(0)
  const [wrongNode, setWrongNode] = useState<string | null>(null)
  const [hintShown, setHintShown] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [lastCaption, setLastCaption] = useState<string | null>(null)

  const done = at >= from + ex.steps
  const view = trace[at]
  const nextNode = trace[at + 1]?.expanded ?? null
  const correctSoFar = at - from

  const advance = () => {
    setLastCaption(describeStep(ex.algo, trace[at + 1], trace[at].frontier))
    setAt(at + 1)
    setWrongNode(null)
  }
  const click = (id: string) => {
    if (done) return
    if (id === nextNode) advance()
    else {
      setMistakes((m) => m + 1)
      setWrongNode(id)
      setLastCaption(null)
    }
  }

  const states: Record<string, NodeState> = statesAt(view)
  if (!done && view.expanded) states[view.expanded] = 'explored' // nút vừa mở rộng → đã xong
  if (wrongNode) states[wrongNode] = 'wrong'

  const outcome: Outcome = revealed ? 'revealed' : hintShown || mistakes >= 2 ? 'hinted' : 'clean'

  let feedback = null
  if (done) feedback = <Feedback kind="correct" html={`${lastCaption ?? ''} ${ex.explain}`} />
  else if (wrongNode)
    feedback = (
      <Feedback
        kind="wrong"
        html={`${wrongNode} chưa phải nút ${algoName[ex.algo]} mở rộng lúc này. ${hintShown ? ex.hint : 'So lại giá trị của các nút trong frontier.'}`}
      />
    )
  else if (lastCaption) feedback = <Feedback kind="correct" html={lastCaption} />
  else if (hintShown) feedback = <Feedback kind="hint" html={ex.hint} />

  return (
    <StepFrame
      feedback={feedback}
      footer={
        <>
          <div className="flex gap-1">
            {!done && !hintShown && (
              <Button variant="ghost" onClick={() => setHintShown(true)}>
                Gợi ý
              </Button>
            )}
            {!done && (hintShown || mistakes > 0) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setRevealed(true)
                  advance()
                }}
              >
                Làm hộ bước này
              </Button>
            )}
          </div>
          {done ? (
            <Button onClick={() => onDone(outcome)}>
              {doneLabel}
            </Button>
          ) : (
            <span className="font-mono text-[14px] text-muted">
              {correctSoFar}/{ex.steps}
            </span>
          )}
        </>
      }
    >
      <ExerciseEyebrow eyebrow={eyebrow ?? 'Bài tập'} caption={caption ?? `bạn là ${algoName[ex.algo]}`} />
      <Rich as="p" html={ex.prompt} className="mb-5 max-w-[64ch] text-[22px] leading-[1.25] font-extrabold tracking-[-0.01em]" />
      <div className="rounded-2xl bg-subtle p-3 sm:p-4">
        <GraphView
          problem={ex.problem}
          showCosts={ex.showCosts}
          showH={ex.showH}
          states={states}
          path={done && view.done?.found ? view.done.path : []}
          onNodeClick={done ? undefined : click}
          label="Bản đồ — bấm vào nút sẽ được mở rộng tiếp theo"
        />
        <div className="mt-2 space-y-2 px-1">
          <FrontierList algo={ex.algo} items={view.frontier} revealOrder={done} values={done ? 'key' : ex.values} />
          <Legend />
        </div>
      </div>
      {!done && <HintNote used={hintShown || mistakes > 0} />}
    </StepFrame>
  )
}

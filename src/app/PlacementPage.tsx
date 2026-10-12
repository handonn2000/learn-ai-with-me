import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { goalIndex, skillIndex } from '@/content/skills'
import { learningPath, nextPlacementQuestion, placementKnown } from '@/learning/graph'
import { useProgress } from '@/learning/progress'
import { ExerciseView } from '@/exercises/ExerciseView'
import { Button } from '@/ui/Button'
import { CloseIcon } from '@/ui/icons'
import { StepFrame } from '@/ui/StepFrame'
import { NotFound } from './NotFound'

/**
 * Kiểm tra xếp lớp theo backward chaining: hỏi ga cuối trước.
 * Đúng ⇒ coi như nắm cả nhánh dưới. Sai ⇒ hỏi các ga tiên quyết của nó.
 */
export function PlacementPage() {
  const { goalId = '' } = useParams()
  const goal = goalIndex[goalId]
  const navigate = useNavigate()
  const markKnown = useProgress((s) => s.markKnown)
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  if (!goal)
    return (
      <div className="mx-auto max-w-5xl px-4">
        <NotFound />
      </div>
    )

  const asking = nextPlacementQuestion(skillIndex, goal.target, answers)
  const asked = Object.keys(answers).length
  const known = placementKnown(skillIndex, goal.target, answers)

  const close = (
    <header className="mx-auto flex max-w-3xl items-center gap-3 px-4 pt-3 sm:px-6">
      <button onClick={() => navigate(`/goal/${goalId}`)} className="grid size-11 place-items-center rounded-full text-ink" aria-label="Thoát">
        <CloseIcon width={22} height={22} />
      </button>
      <span className="font-bold">Kiểm tra nhanh · {goal.title}</span>
    </header>
  )

  if (!started)
    return (
      <div className="min-h-dvh">
        {close}
        <StepFrame
          footer={
            <>
              <span />
              <Button onClick={() => setStarted(true)}>
                Bắt đầu
              </Button>
            </>
          }
        >
          <h1 className="text-[34px] leading-tight font-bold tracking-tight">Bạn đã biết tới đâu?</h1>
          <div className="prose-lesson mt-5 text-lg">
            <p>Tôi sẽ hỏi câu khó nhất trước: câu về ga cuối. Trả lời đúng, bạn bỏ qua được cả tuyến.</p>
            <p>Trả lời sai, tôi lùi lại hỏi những ga mà ga đó cần. Cứ thế cho tới khi tìm ra chỗ bạn nên bắt đầu.</p>
            <p>Mỗi câu chỉ trả lời một lần, không có gợi ý. Không chắc thì cứ chọn đại — sai cũng chỉ có nghĩa là bạn học thêm một ga.</p>
          </div>
        </StepFrame>
      </div>
    )

  if (asking === null) {
    const skipped = [...known]
    return (
      <div className="min-h-dvh">
        {close}
        <StepFrame
          footer={
            <>
              <span />
              <Button
               
                onClick={() => {
                  markKnown(skipped)
                  navigate(`/goal/${goalId}`)
                }}
              >
                Xem tuyến của tôi
              </Button>
            </>
          }
        >
          <h1 className="text-[34px] leading-tight font-bold tracking-tight">
            {skipped.length === 0 ? 'Bắt đầu từ ga đầu tiên.' : `Bạn bỏ qua được ${skipped.length} ga.`}
          </h1>
          <p className="mt-4 max-w-[58ch] text-lg text-muted">
            {asked} câu hỏi.{' '}
            {skipped.length > 0
              ? 'Những ga này được đánh dấu "Đã biết" và vẫn sẽ xuất hiện trong lịch ôn, để chắc là bạn nhớ thật.'
              : 'Không sao cả: tuyến được làm ra để đi từ đầu.'}
          </p>
          {skipped.length > 0 && (
            <ul className="mt-6 space-y-1.5">
              {skipped.map((id) => (
                <li key={id} className="text-[15px]">
                  <span className="mr-2 text-route">✓</span>
                  {skillIndex[id].title}
                </li>
              ))}
            </ul>
          )}
        </StepFrame>
      </div>
    )
  }

  const sk = skillIndex[asking]
  const path = learningPath(skillIndex, goal.target)
  const noOf = (id: string) => path.indexOf(id) + 1
  const lastWrong = [...path].reverse().find((id) => answers[id] === false)
  return (
    <div className="min-h-dvh">
      {close}
      <section aria-label="Hỏi ngược từ ga cuối" className="mx-auto mt-3 w-[calc(100%-2rem)] max-w-3xl rounded-[20px] bg-surface p-4 sm:w-full">
        <h2 className="m-0 text-[15px] font-bold">Hỏi ngược từ ga cuối</h2>
        <ol className="m-0 mt-2.5 grid list-none gap-1 p-0" style={{ gridTemplateColumns: `repeat(${path.length}, minmax(0, 1fr))` }}>
          {path.map((id) => {
            const state = id === asking ? 'ask' : answers[id] === false ? 'wrong' : known.has(id) ? 'known' : 'todo'
            const cls = { ask: 'border-2 border-ink bg-sun text-ink', wrong: 'border-2 border-wrong bg-surface text-wrong-ink', known: 'bg-violet-soft text-violet', todo: 'bg-track text-muted' }[state]
            const word = { ask: 'đang hỏi', wrong: 'chưa đúng', known: 'coi như đã biết', todo: 'chưa hỏi' }[state]
            return (
              <li key={id} aria-label={`Ga ${noOf(id)}, ${word}`} className={`grid h-9 place-items-center rounded-lg font-mono text-[13px] font-bold ${cls}`}>
                {noOf(id)}
              </li>
            )
          })}
        </ol>
        <p className="mt-2.5 mb-0 text-[15px] text-muted">
          {lastWrong
            ? `Ga ${noOf(lastWrong)} chưa đúng, nên hỏi lùi về ga ${noOf(asking)}. Trả lời đúng ga nào thì bỏ qua mọi ga trước nó.`
            : `Bắt đầu từ ga cuối (ga ${noOf(asking)}). Trả lời đúng ga nào thì bỏ qua mọi ga trước nó.`}
        </p>
      </section>
      <ExerciseView
        key={asking}
        mode="test"
        exercise={sk.checks[0]}
        eyebrow={`Câu ${asked + 1} · ${sk.title}`}
        onDone={(o) => setAnswers((a) => ({ ...a, [asking]: o === 'clean' }))}
      />
    </div>
  )
}

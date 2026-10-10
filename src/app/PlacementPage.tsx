import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { X } from 'lucide-react'
import { goalIndex, skillIndex } from '@/content/skills'
import { nextPlacementQuestion, placementKnown } from '@/learning/graph'
import { useProgress } from '@/learning/progress'
import { ExerciseView } from '@/exercises/ExerciseView'
import { Button } from '@/ui/Button'
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
      <button onClick={() => navigate(`/goal/${goalId}`)} className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface hover:text-ink" aria-label="Thoát">
        <X size={20} />
      </button>
      <span className="text-[14px] text-muted">Kiểm tra nhanh · {goal.title}</span>
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
  return (
    <div className="min-h-dvh">
      {close}
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

import { useMemo, useState } from 'react'
import { Button } from '@/ui/Button'
import { Feedback, StepFrame, type FeedbackKind } from '@/ui/StepFrame'
import { Rich } from '@/ui/Rich'
import type { Outcome } from '@/learning/progress'
import { grade, type Answer } from './grade'
import type { Exercise } from './types'
import { ChoiceInput, ClassifyInput, NumberInput, OrderInput, PickNodesInput, emptyAnswer, solutionAnswer, isReady } from './inputs'
import { TraceExercise } from './TraceExercise'

type Phase = 'answering' | 'wrong' | 'correct' | 'revealed'

/**
 * mode = 'learn': có gợi ý, làm lại được, xem lời giải.
 * mode = 'test' (xếp lớp): một lần trả lời, không gợi ý; sai thì hiện lời giải và đi tiếp.
 */
export function ExerciseView({
  exercise,
  onDone,
  doneLabel = 'Tiếp tục',
  mode = 'learn',
  eyebrow,
  caption,
}: {
  exercise: Exercise
  onDone: (o: Outcome) => void
  doneLabel?: string
  mode?: 'learn' | 'test'
  eyebrow?: string
  caption?: string
}) {
  if (exercise.kind === 'trace') return <TraceExercise key={exercise.id} exercise={exercise} onDone={onDone} doneLabel={doneLabel} eyebrow={eyebrow} caption={caption} />
  return <StandardExercise key={exercise.id} exercise={exercise} onDone={onDone} doneLabel={doneLabel} mode={mode} eyebrow={eyebrow} caption={caption} />
}

/** Nhãn "Bài tập 1 / 3" dạng viên thuốc + tên ngắn của bài. */
export function ExerciseEyebrow({ eyebrow, caption }: { eyebrow: string; caption?: string }) {
  return (
    <p className="m-0 mb-3 flex flex-wrap items-center gap-2.5">
      <span className="rounded-full border-2 border-ink px-3 py-[3px] text-sm font-bold">{eyebrow}</span>
      {caption && <span className="text-[15px] text-muted">{caption}</span>}
    </p>
  )
}

/** Dòng nhắc cách tính: dùng gợi ý thì lịch ôn gần hơn. */
export function HintNote({ used }: { used: boolean }) {
  return (
    <p className="m-0 mt-5 rounded-xl bg-subtle px-4 py-2.5 text-sm text-muted">
      {used ? 'Bạn đã dùng gợi ý nên lịch ôn của kỹ năng này sẽ gần hơn.' : <>Không mở gợi ý nên bài này được tính là <b className="text-ink">nhớ tốt</b>. Dùng gợi ý thì lịch ôn sẽ gần hơn.</>}
    </p>
  )
}

function StandardExercise({
  exercise,
  onDone,
  doneLabel,
  mode,
  eyebrow = 'Bài tập',
  caption,
}: {
  exercise: Exclude<Exercise, { kind: 'trace' }>
  onDone: (o: Outcome) => void
  doneLabel: string
  mode: 'learn' | 'test'
  eyebrow?: string
  caption?: string
}) {
  const [answer, setAnswer] = useState<Answer>(() => emptyAnswer(exercise))
  const [phase, setPhase] = useState<Phase>('answering')
  const [wrongCount, setWrongCount] = useState(0)
  const [hintShown, setHintShown] = useState(false)
  const reveal = () => {
    setAnswer(solutionAnswer(exercise))
    setPhase('revealed')
  }
  const locked = phase === 'correct' || phase === 'revealed'

  const change = (a: Answer) => {
    setAnswer(a)
    if (phase === 'wrong') setPhase('answering')
  }
  const check = () => {
    if (grade(exercise, answer)) setPhase('correct')
    else if (mode === 'test') reveal()
    else {
      setWrongCount((n) => n + 1)
      setPhase('wrong')
    }
  }
  const outcome: Outcome = phase === 'revealed' ? 'revealed' : hintShown || wrongCount >= 2 ? 'hinted' : 'clean'

  const feedback = useMemo((): { kind: FeedbackKind; html: string } | null => {
    if (phase === 'correct') return { kind: 'correct', html: exercise.explain }
    if (phase === 'revealed')
      return { kind: mode === 'test' ? 'wrong' : 'solution', html: (mode === 'test' ? 'Đã điền đáp án đúng. ' : '') + exercise.explain }
    if (phase === 'wrong')
      return { kind: 'wrong', html: hintShown ? 'Đọc lại gợi ý rồi thử lần nữa, hoặc xem lời giải.' : 'Thử lại, hoặc mở gợi ý.' }
    if (hintShown) return { kind: 'hint', html: exercise.hint }
    return null
  }, [phase, hintShown, exercise, mode])

  const input = (() => {
    switch (exercise.kind) {
      case 'choice':
        return <ChoiceInput ex={exercise} value={answer} onChange={change} locked={locked} />
      case 'number':
        return <NumberInput ex={exercise} value={answer} onChange={change} locked={locked} onSubmit={check} />
      case 'pick-nodes':
        return <PickNodesInput ex={exercise} value={answer} onChange={change} locked={locked} />
      case 'order':
        return <OrderInput ex={exercise} value={answer} onChange={change} locked={locked} />
      case 'classify':
        return <ClassifyInput ex={exercise} value={answer} onChange={change} locked={locked} />
    }
  })()

  return (
    <StepFrame
      feedback={feedback && <Feedback {...feedback} />}
      footer={
        <>
          <div className="flex gap-1">
            {mode === 'learn' && !locked && !hintShown && (
              <Button variant="ghost" onClick={() => setHintShown(true)}>
                Gợi ý
              </Button>
            )}
            {mode === 'learn' && !locked && (hintShown || wrongCount > 0) && (
              <Button variant="ghost" onClick={reveal}>
                Xem lời giải
              </Button>
            )}
          </div>
          {locked ? (
            <Button onClick={() => onDone(outcome)}>
              {doneLabel}
            </Button>
          ) : (
            <Button onClick={check} disabled={!isReady(exercise, answer)}>
              Kiểm tra
            </Button>
          )}
        </>
      }
    >
      <ExerciseEyebrow eyebrow={eyebrow} caption={caption} />
      <Rich as="p" html={exercise.prompt} className="mb-6 max-w-[64ch] text-[22px] leading-[1.25] font-extrabold tracking-[-0.01em]" />
      {input}
      {mode === 'learn' && !locked && <HintNote used={hintShown || wrongCount > 0} />}
    </StepFrame>
  )
}

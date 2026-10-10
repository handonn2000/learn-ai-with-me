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
}: {
  exercise: Exercise
  onDone: (o: Outcome) => void
  doneLabel?: string
  mode?: 'learn' | 'test'
  eyebrow?: string
}) {
  if (exercise.kind === 'trace') return <TraceExercise key={exercise.id} exercise={exercise} onDone={onDone} doneLabel={doneLabel} />
  return <StandardExercise key={exercise.id} exercise={exercise} onDone={onDone} doneLabel={doneLabel} mode={mode} eyebrow={eyebrow} />
}

function StandardExercise({
  exercise,
  onDone,
  doneLabel,
  mode,
  eyebrow = 'Bài tập',
}: {
  exercise: Exclude<Exercise, { kind: 'trace' }>
  onDone: (o: Outcome) => void
  doneLabel: string
  mode: 'learn' | 'test'
  eyebrow?: string
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
      <p className="mb-1 text-[14px] font-medium text-muted">{eyebrow}</p>
      <Rich as="p" html={exercise.prompt} className="mb-6 max-w-[64ch] text-lg leading-snug font-medium" />
      {input}
    </StepFrame>
  )
}

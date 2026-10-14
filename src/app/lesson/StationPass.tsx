import { Link } from 'react-router'
import { goalOf, skillIndex } from '@/content/skills'
import { useGoalRoute } from '@/learning/hooks'
import { dueLabel, useProgress, worstOutcome, type Outcome } from '@/learning/progress'
import type { Lesson } from '@/learning/types'
import { Button } from '@/ui/Button'
import { CheckIcon, ChevronRightIcon } from '@/ui/icons'
import { StepFrame } from '@/ui/StepFrame'

const outcomeNote: Record<Outcome, string> = {
  clean: 'Đúng, không cần gợi ý',
  hinted: 'Đúng sau gợi ý, nên sẽ được hỏi lại sớm hơn',
  revealed: 'Phải xem lời giải, nên sẽ được hỏi lại sớm',
}

/** Qua ga (docs/design/screens/15): đối chiếu mục tiêu đầu ga với bằng chứng từng bài, lịch ôn, ga vừa mở. */
export function StationPass({ lesson, outcomes, primary, onPrimary, onLater }: { lesson: Lesson; outcomes: Outcome[]; primary: string; onPrimary: () => void; onLater: () => void }) {
  const skill = skillIndex[lesson.skill]
  const rec = useProgress((s) => s.skills[lesson.skill])
  const { goal, stations, nextId } = useGoalRoute(goalOf(lesson.skill).id)
  const no = stations.findIndex((s) => s.id === lesson.skill) + 1
  const next = nextId ? skillIndex[nextId] : null
  const labels = lesson.steps.flatMap((s) => (s.kind === 'exercise' ? [s.label] : []))
  const worst = worstOutcome(outcomes)
  return (
    <StepFrame
      card={false}
      footer={
        <>
          <button type="button" onClick={onLater} className="font-bold text-violet underline underline-offset-4">Để sau, về trang chủ</button>
          <Button onClick={onPrimary}>{primary}</Button>
        </>
      }
    >
      <div className="flex items-center gap-3.5">
        <span aria-hidden className="grid size-16 shrink-0 place-items-center rounded-[18px] border-2 border-ink bg-sun text-[28px] font-extrabold shadow-block">{no || <CheckIcon />}</span>
        <div className="min-w-0">
          <p className="m-0 text-[15px] font-semibold text-muted">Qua ga {no > 0 && `${no} / ${stations.length} · `}{goal.title}</p>
          <h1 className="m-0 text-[30px] leading-[1.05] font-extrabold tracking-[-0.03em] min-[720px]:text-[40px]">{skill.title}</h1>
        </div>
      </div>
      <section aria-label="Mục tiêu đầu ga" className="mt-5 rounded-3xl border-2 border-ink bg-surface p-5 shadow-block-lg">
        <p className="m-0 text-sm font-bold text-violet">Mục tiêu đầu ga, đối chiếu với bài bạn làm</p>
        <ul className="m-0 mt-3 flex list-none flex-col gap-3 p-0">
          {outcomes.map((o, i) => (
            <li key={i} className="flex items-start gap-3">
              <span aria-hidden className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${o === 'clean' ? 'text-correct' : 'border-2 border-wrong text-wrong-ink'}`}>
                {o === 'clean' ? <CheckIcon width={20} height={20} /> : <b className="text-sm">!</b>}
              </span>
              <span className="leading-snug">
                <b className="text-[17px]">{labels[i] ?? `Bài tập ${i + 1}`}</b>
                <br />
                <span className={o === 'clean' ? 'text-muted' : 'text-wrong-ink'}>{outcomeNote[o]}</span>
              </span>
            </li>
          ))}
        </ul>
        {outcomes.length === 0 && <p className="m-0 mt-2 text-muted">{skill.can}</p>}
      </section>
      <section aria-label="Tiếp theo" className="mt-4 overflow-hidden rounded-[20px] bg-surface">
        {rec && (
          <div className="flex items-center justify-between gap-3 border-b-2 border-bg px-5 py-4">
            <span className="leading-snug">
              <b className="text-[17px]">Ôn lại</b>
              <br />
              <span className="text-[15px] text-muted">
                {dueLabel(rec)}
                {worst !== 'clean' && ' · sớm hơn vì có bài cần gợi ý'}
              </span>
            </span>
          </div>
        )}
        {next && (
          <Link to={`/goal/${goal.id}`} className="flex items-center justify-between gap-3 px-5 py-4 text-ink no-underline">
            <span className="leading-snug">
              <b className="text-[17px]">Đã mở ga {stations.findIndex((s) => s.id === next.id) + 1}</b>
              <br />
              <span className="text-[15px] text-muted">{next.title}</span>
            </span>
            <ChevronRightIcon width={20} height={20} aria-hidden />
          </Link>
        )}
      </section>
    </StepFrame>
  )
}

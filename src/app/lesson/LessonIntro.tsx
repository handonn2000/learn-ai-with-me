import { Link } from 'react-router'
import { goals, skillIndex } from '@/content/skills'
import { useGoalRoute } from '@/learning/hooks'
import { retrievability, statusOf, useProgress } from '@/learning/progress'
import type { Lesson } from '@/learning/types'
import { Button } from '@/ui/Button'
import { CheckIcon } from '@/ui/icons'
import { StepFrame } from '@/ui/StepFrame'

/** Mở đầu ga (docs/design/screens/10): học xong làm được gì, cần biết trước kèm % nhớ. */
export function LessonIntro({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
  const skill = skillIndex[lesson.skill]
  const records = useProgress((s) => s.skills)
  const { goal, stations } = useGoalRoute(goals[0].id)
  const no = stations.findIndex((s) => s.id === lesson.skill) + 1
  const exercises = lesson.steps.filter((s) => s.kind === 'exercise').length
  return (
    <StepFrame
      card={false}
      footer={
        <>
          <span />
          <Button onClick={onStart} className="min-w-44">Vào ga</Button>
        </>
      }
    >
      <p className="m-0 text-[15px] font-semibold text-muted">
        {no > 0 && `Ga ${no} trên tuyến ${goal.title} · `}{lesson.minutes} phút · {exercises} bài tập
      </p>
      <h1 className="mt-1 mb-4 text-[34px] leading-[1.05] font-extrabold tracking-[-0.03em] min-[720px]:text-[44px]">{skill.title}</h1>
      <div className="rounded-[var(--radius-sketch)] border-2 border-ink bg-surface px-5 py-4 shadow-[0_4px_0_var(--color-ink)]">
        <p className="m-0 text-sm font-bold text-violet">Học xong bạn làm được</p>
        <p className="mt-1.5 mb-0 text-[22px] leading-[1.25] font-bold">{skill.can}</p>
      </div>
      <div className="mt-4 rounded-[20px] bg-surface p-4 min-[720px]:p-5">
        {skill.prereqs.length > 0 ? (
          <>
            <b className="text-[17px]">Cần biết trước</b>
            <ul className="m-0 mt-3 flex list-none flex-col gap-3 p-0">
              {skill.prereqs.map((p) => {
                const ps = skillIndex[p]
                const rec = records[p]
                const known = statusOf(rec) !== 'new'
                const mem = rec && known ? retrievability(rec) : null
                const low = !known || (mem != null && mem < 0.9)
                return (
                  <li key={p} className="flex items-start gap-3">
                    <span aria-hidden className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${low ? 'border-2 border-wrong text-wrong-ink' : 'text-violet'}`}>
                      {low ? <b className="text-sm">!</b> : <CheckIcon width={20} height={20} />}
                    </span>
                    <span className="leading-snug">
                      <b>{ps.title}</b>
                      <span className="text-muted"> · {known ? `nhớ ${Math.round((mem ?? 0) * 100)}%` : 'chưa học'}</span>
                      {low && known && (
                        <>
                          <br />
                          <Link to="/review" className="font-bold text-violet">Ôn nhanh 1 câu trước khi vào</Link>
                        </>
                      )}
                      {!known && ps.lesson && (
                        <>
                          <br />
                          <Link to={`/learn/${ps.lesson}`} className="font-bold text-violet">Học ga này trước</Link>
                        </>
                      )}
                    </span>
                  </li>
                )
              })}
            </ul>
          </>
        ) : (
          <p className="m-0 text-muted">Không cần biết gì trước. Bắt đầu từ đây được.</p>
        )}
      </div>
    </StepFrame>
  )
}

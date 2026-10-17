import { Link } from 'react-router'
import { courses } from '@/content/courses'
import { useFollowedGoalId } from '@/learning/hooks'
import { Chip } from '@/ui/Chip'
import { CheckIcon } from '@/ui/icons'
import { ButtonLink } from '@/ui/Button'
import type { GoalModel, StationVM } from './useGoalModel'

/** Tiêu đề ga; có bài thì là link phủ cả hàng (hàng `li` phải `relative`). Ga nào cũng vào được, tiên quyết chỉ là lời nhắc. */
function Title({ s }: { s: StationVM }) {
  const lesson = s.skill.lesson
  if (!lesson) return <b className="block leading-tight">{s.skill.title}</b>
  return (
    <Link to={`/learn/${lesson}`} className="block font-bold leading-tight text-ink no-underline after:absolute after:inset-0 after:rounded-2xl after:content-['']">
      {s.skill.title}
    </Link>
  )
}

function Row({ s, last }: { s: StationVM; last: boolean }) {
  const badge = 'grid size-11 flex-none place-items-center rounded-[10px] text-lg font-extrabold'
  if (s.state === 'done') {
    const low = s.memory != null && s.memory < 0.9
    return (
      <li className="relative flex items-center gap-3.5 rounded-2xl bg-surface px-4 py-3.5">
        <span aria-hidden className={`${badge} bg-violet text-white`}><CheckIcon width={22} height={22} /></span>
        <span className="min-w-0 flex-1">
          <Title s={s} />
          <span className={`text-[13px] ${low ? 'text-wrong-ink' : 'text-muted'}`}>
            {s.memory != null && `nhớ ${Math.round(s.memory * 100)}%`}
            {low && ' · cần ôn'}
          </span>
        </span>
        <span className="text-sm text-muted">Đã xong</span>
      </li>
    )
  }
  if (s.state === 'today')
    return (
      <li className="relative flex items-center gap-3.5 rounded-2xl border-2 border-ink bg-sun-soft px-4 py-3.5">
        <span aria-hidden className={`${badge} border-2 border-ink bg-sun`}>{s.no}</span>
        <span className="min-w-0 flex-1">
          <Title s={s} />
          <span className="text-[13px] text-muted max-[719px]:hidden">{s.skill.can}</span>
        </span>
        <b className="text-sm whitespace-nowrap">Hôm nay{s.minutes != null && ` · ${s.minutes}′`}</b>
      </li>
    )
  const needNote = s.state === 'locked' ? `nên qua ga ${s.needs.join(' và ')} trước` : null
  return (
    <li className={`relative flex items-center gap-3.5 px-4 py-3.5 ${last ? 'rounded-2xl border-2 border-dashed border-disabled-line' : 'rounded-2xl bg-surface'}`}>
      <span aria-hidden className={`${badge} bg-track text-muted`}>{s.no}</span>
      <span className="min-w-0 flex-1">
        <Title s={s} />
        {(last || needNote) && <span className="block text-[13px] text-muted">{[last && 'Ga cuối', needNote].filter(Boolean).join(' · ')}</span>}
      </span>
      {s.minutes != null && <span className="text-sm text-muted">{s.minutes}′</span>}
    </li>
  )
}

export function GoalList({ model }: { model: GoalModel }) {
  const { goal, today, stations } = model
  const leads = courses.flatMap((c) => c.goals.filter((g) => g.sharedFrom === goal.title).map((g) => ({ id: g.goalId ?? g.id, title: g.title })))
  const course = courses.find((c) => c.goals.some((g) => g.goalId === goal.id))
  const grid = stations.map((s) => s.skill.short ?? s.skill.title)
  const following = useFollowedGoalId() === goal.id
  const doneN = model.done
  return (
    <div className="flex flex-col gap-6 min-[1180px]:flex-row min-[1180px]:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <section aria-labelledby="g-title" className="rounded-3xl border-2 border-ink bg-surface p-5 shadow-block-lg min-[720px]:p-[30px]">
          {following && <Chip tone="sun">Đang theo</Chip>}
          <h1 id="g-title" className={`${following ? 'mt-3' : 'mt-0'} mb-0 text-4xl leading-none font-extrabold tracking-[-0.03em] min-[720px]:text-[46px]`}>{goal.title}</h1>
          <p className="mt-3 mb-0 max-w-[40em] text-lg text-muted">Tới ga cuối, bạn {goal.outcome.charAt(0).toLowerCase() + goal.outcome.slice(1)}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            {today && today.skill.lesson && <ButtonLink to={`/learn/${today.skill.lesson}`}>Học tiếp ga {today.no}</ButtonLink>}
            <Link to={`/check/${goal.id}`} className="font-bold text-violet">Kiểm tra nhanh để bỏ qua ga đã biết</Link>
          </div>
        </section>
        <section aria-labelledby="route">
          <h2 id="route" className="m-0 mb-3 text-[26px] font-extrabold tracking-[-0.02em]">Tuyến học · {stations.length} ga</h2>
          <ol className="m-0 flex list-none flex-col gap-2 p-0">
            {stations.map((s, i) => <Row key={s.id} s={s} last={i === stations.length - 1} />)}
          </ol>
        </section>
      </div>
      <aside className="flex flex-col gap-5 min-[1180px]:w-[320px] min-[1180px]:flex-none">
        <section aria-labelledby="whole" className="rounded-[20px] bg-surface p-[22px]">
          <h2 id="whole" className="m-0 text-xl font-extrabold tracking-[-0.01em]">Sketch cả tuyến</h2>
          <p className="mt-2 mb-3 text-sm text-muted">Ghép từ sketch của từng ga đã qua. Ga chưa học để trống.</p>
          <ul className="m-0 grid list-none grid-cols-3 gap-2 rounded-2xl border-2 border-ink bg-lined p-2.5 font-hand text-xs">
            {grid.map((t, i) => (
              <li key={stations[i].id} className={`grid min-h-10 place-items-center rounded-[10px] px-1 text-center ${i < doneN ? 'border-2 border-ink bg-surface' : i === doneN ? 'border-2 border-dashed border-violet text-violet' : 'border-2 border-dashed border-disabled-line text-disabled-ink'}`}>{t}</li>
            ))}
          </ul>
        </section>
        {(leads.length > 0 || course) && (
          <section aria-labelledby="leads" className="rounded-[20px] bg-surface p-[22px]">
            <h2 id="leads" className="m-0 text-xl leading-snug font-extrabold tracking-[-0.01em]">Mục tiêu này mở đường cho</h2>
            <ul className="m-0 mt-3 flex list-none flex-col gap-2.5 p-0 text-[15px] font-semibold">
              {leads.map((l) => <li key={l.id}><Link to={`/goal/${l.id}`} className="text-ink">{l.title}</Link></li>)}
              {course && <li><Link to={`/courses/${course.id}`} className="text-ink">{course.finalGoal}</Link></li>}
            </ul>
          </section>
        )}
      </aside>
    </div>
  )
}

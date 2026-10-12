import { Link } from 'react-router'
import { courses, type Course } from '@/content/courses'
import { skillIndex } from '@/content/skills'
import { lessons } from '@/content/lessons'
import { useGoalRoute } from '@/learning/hooks'
import { pickNearest, type Reason } from '@/learning/courses'
import { ButtonLink } from '@/ui/Button'
import { Chip } from '@/ui/Chip'
import { ChevronRightIcon } from '@/ui/icons'
import { MiniMountain } from '@/ui/roughArt'
import { StationStrip, type StripState } from '@/ui/StationStrip'
import { useCourseProgress } from './useCourseProgress'

const card = 'rounded-[20px] bg-surface'

function reasonText(r: Reason) {
  return r.kind === 'shared' ? r.text : r.kind === 'next' ? 'kế tiếp trên đường mòn' : r.kind === 'other-trail' ? 'mở đầu đường mòn khác' : null
}

export function CoursesPage() {
  return (
    <div className="flex flex-col gap-7 pt-4 min-[720px]:pt-5">
      <div>
        <h1 className="m-0 text-[34px] leading-none font-extrabold tracking-[-0.035em] min-[720px]:text-[52px]">Bạn muốn làm được gì?</h1>
        <p className="mt-3.5 mb-0 max-w-[40em] text-base text-muted min-[720px]:text-lg">Chọn một mục tiêu. Những gì bạn đã học ở mục tiêu khác sẽ được tính luôn, không phải học lại.</p>
      </div>
      <Following />
      {courses.map((c) => (
        <CourseSection key={c.id} course={c} />
      ))}
    </div>
  )
}

function Following() {
  const { goal, stations, done, total } = useGoalRoute('astar')
  const strip: StripState[] = stations.map((s) => (s.status !== 'new' ? 'done' : s.next ? 'today' : 'todo'))
  const minutesLeft = stations.filter((s) => s.status === 'new').reduce((n, s) => n + (lessons[skillIndex[s.id].lesson ?? '']?.minutes ?? 0), 0)
  const sketches = courses[0].goals.find((g) => g.goalId)!
  return (
    <section aria-labelledby="following" className="flex flex-wrap items-center gap-x-8 gap-y-5 rounded-3xl border-2 border-ink bg-surface p-5 shadow-block-lg min-[720px]:px-7 min-[720px]:py-[26px]">
      <div className="min-w-0 flex-[999_1_300px]">
        <Chip tone="sun">Đang theo</Chip>
        <h2 id="following" className="mt-3 mb-0 text-[28px] leading-[1.05] font-extrabold tracking-[-0.02em] min-[720px]:text-4xl">{goal.title}</h2>
        <p className="mt-2 mb-0 text-muted">{goal.outcome}</p>
        <StationStrip states={strip} size="sm" label={`${done} trên ${total} ga đã qua`} className="mt-4 max-w-[420px]" />
        <p className="mt-2 mb-0 text-[15px] text-muted">
          {done} trên {total} ga · {sketches.sketchesOpen}/{sketches.sketches} sketch{minutesLeft > 0 && ` · còn khoảng ${minutesLeft} phút`}
        </p>
      </div>
      <ButtonLink to="/session" className="w-full min-[720px]:w-auto min-[720px]:px-8">Học tiếp</ButtonLink>
    </section>
  )
}

function CourseSection({ course }: { course: Course }) {
  const progress = useCourseProgress(course)
  const near = pickNearest(course, progress)
  const hasFollowed = progress.some((p) => p.state === 'current')
  const doneCount = progress.filter((p) => p.state === 'done').length
  const rest = course.goals.length - near.length
  return (
    <section aria-labelledby={`c-${course.id}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 id={`c-${course.id}`} className="m-0 text-2xl font-extrabold tracking-[-0.02em] min-[720px]:text-[30px]">{course.title}</h2>
        <span className="text-[15px] text-muted">
          {course.caption} · {doneCount}/{course.goals.length} mục tiêu{course.totalSketches > 0 && ` · ${course.openSketches}/${course.totalSketches} sketch`}
        </span>
      </div>
      <p className="mt-1.5 mb-0 text-[15px] font-semibold text-muted">{hasFollowed ? '3 mục tiêu gần bạn nhất' : '3 mục tiêu đầu đường mòn'}</p>
      <ul className="mt-3 mb-0 grid list-none gap-4 p-0 min-[820px]:grid-cols-3">
        {near.map(({ item, reason }) => {
          const trail = course.trails.find((t) => t.id === item.goal.trail)
          const note = reasonText(reason)
          return (
            <li key={item.goal.id} className={`${card} flex flex-col gap-2 p-5 ${reason.kind === 'shared' ? 'border-2 border-violet' : ''}`}>
              <span className="flex flex-wrap gap-1.5">
                <Chip tone="gray" className="text-[13px] font-semibold">{trail?.title}</Chip>
                {note && <Chip tone={reason.kind === 'shared' ? 'violet' : 'gray'} className="bg-subtle text-[13px]">{note}</Chip>}
              </span>
              <Link to={`/goal/${item.goal.goalId ?? item.goal.id}`} className="text-[22px] leading-[1.15] font-bold tracking-[-0.01em] text-ink no-underline">{item.goal.title}</Link>
              <p className="m-0 text-[15px] text-muted">{item.goal.blurb}</p>
              <span className="mt-auto flex items-center justify-between gap-2 pt-1.5 text-sm text-muted">
                <span>{item.gaDone}/{item.ga} ga{item.sketches > 0 && ` · ${item.sketchesOpen}/${item.sketches} sketch`}</span>
                <Link to={`/goal/${item.goal.goalId ?? item.goal.id}`} className="text-[15px] font-bold text-violet">Theo mục tiêu này</Link>
              </span>
            </li>
          )
        })}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-[20px] border-2 border-ink bg-paper px-4 py-3.5 shadow-block min-[720px]:pr-[22px] min-[720px]:pl-[18px]" style={{ backgroundImage: 'radial-gradient(var(--color-paper-dot) 1.2px, transparent 1.2px)', backgroundSize: '18px 18px' }}>
        <MiniMountain shift={course.id === 'csc14003' ? 0 : 40} />
        <span className="min-w-0 flex-[1_1_220px]">
          <b className="text-lg">Còn {rest} mục tiêu nữa</b>
          <span className="mt-0.5 block text-[15px] text-muted">
            {course.id === 'csc14003' ? 'Ba đường mòn cùng dẫn tới đích ' : 'Đích của khóa là '}
            <b className="text-ink">{course.finalGoal}</b>. Xem ở dạng bản đồ hoặc danh sách.
          </span>
        </span>
        <ButtonLink to={`/courses/${course.id}`} variant="secondary" className="h-12 flex-none text-base max-[719px]:w-full">
          Xem thêm <ChevronRightIcon width={18} height={18} />
        </ButtonLink>
      </div>
    </section>
  )
}

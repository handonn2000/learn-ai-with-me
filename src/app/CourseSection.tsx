import { Link } from 'react-router'
import type { Course } from '@/content/courses'
import { pickNearest, type Reason } from '@/learning/courses'
import { ButtonLink } from '@/ui/Button'
import { Chip } from '@/ui/Chip'
import { ChevronRightIcon } from '@/ui/icons'
import { MiniMountain } from '@/ui/roughArt'
import { useCourseProgress } from './useCourseProgress'

const card = 'rounded-[20px] bg-surface'

function reasonText(r: Reason) {
  return r.kind === 'shared' ? r.text : r.kind === 'next' ? 'kế tiếp trên đường mòn' : r.kind === 'other-trail' ? 'mở đầu đường mòn khác' : null
}

/** Một khóa trên màn Hôm nay: 3 mục tiêu gần người học nhất + "Xem thêm" mở bản đồ/danh sách khóa (màn 02). */
export function CourseSection({ course }: { course: Course }) {
  const progress = useCourseProgress(course)
  const near = pickNearest(course, progress)
  const hasFollowed = progress.some((p) => p.state === 'current')
  const doneCount = progress.filter((p) => p.state === 'done').length
  const rest = course.goals.length - near.length
  return (
    <section aria-labelledby={`c-${course.id}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 id={`c-${course.id}`} className="m-0 text-xl font-extrabold tracking-[-0.02em] min-[720px]:text-2xl">{course.title}</h3>
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

/** Link tới phần khóa học trên màn Hôm nay (thay cho màn /courses cũ). */
export const coursesLink = { to: '/', state: { section: 'courses' } } as const

export function wantsCourses(state: unknown) {
  return typeof state === 'object' && state !== null && 'section' in state && state.section === 'courses'
}

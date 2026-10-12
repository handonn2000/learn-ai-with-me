import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { courseIndex, type Course } from '@/content/courses'
import { ButtonLink } from '@/ui/Button'
import { Chip } from '@/ui/Chip'
import { ChevronRightIcon } from '@/ui/icons'
import { createArt } from '@/ui/roughArt'
import { MapAt, SketchMap } from '@/ui/SketchMap'
import { ViewToggle, useView } from '@/ui/ViewToggle'
import type { GoalProgress } from '@/learning/courses'
import { useTodayPlan } from './useTodayPlan'
import { useCourseProgress } from './useCourseProgress'
import { NotFound } from './NotFound'

export function CoursePage() {
  const { courseId = '' } = useParams()
  const course = courseIndex[courseId]
  if (!course) return <NotFound />
  return <Course course={course} />
}

const W = 780
const H = 1000
/** Đường mòn: danh sách điểm đi qua, theo id mục tiêu ở hai đầu (toạ độ giữa lấy từ coursemap.js). */
const EDGES: [string, [number, number][], string][] = [
  ['peas', [[300, 872]], 'astar'],
  ['astar', [[150, 744]], 'algo-choice'],
  ['algo-choice', [[150, 590]], 'csp'],
  ['csp', [[150, 470]], 'alphabeta'],
  ['alphabeta', [[150, 336]], 'local'],
  ['peas', [[402, 830]], 'kb'],
  ['kb', [[372, 690]], 'fol'],
  ['fol', [[400, 520]], 'bayes'],
  ['peas', [[560, 860]], 'id3'],
  ['id3', [[676, 590]], 'perceptron'],
]
const SUMMIT_TAILS: [string, [number, number][]][] = [
  ['local', [[262, 232], [305, 206]]],
  ['bayes', [[396, 330], [392, 214]]],
  ['perceptron', [[714, 396], [690, 286], [500, 208]]],
]

function Course({ course }: { course: Course }) {
  const [view, setView] = useView()
  const progress = useCourseProgress(course)
  const mode = course.hasMap ? view : 'list'
  return (
    <div className="pt-3 min-[720px]:pt-5">
      <Link to="/courses" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline">
        <span aria-hidden>←</span> Khóa học
      </Link>
      <div className="mt-1.5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <h1 className="m-0 text-[30px] leading-[1.05] font-extrabold tracking-[-0.03em] min-[720px]:text-[44px]">
          {course.title} {course.code && <span className="font-mono text-lg font-bold tracking-normal text-muted">· {course.code}</span>}
        </h1>
        {course.hasMap && (
          <div className="hidden min-[720px]:block">
            <ViewToggle value={view} onChange={setView} />
          </div>
        )}
      </div>
      <div className="mt-5 flex flex-col gap-6 min-[1180px]:flex-row min-[1180px]:items-start">
        <div className="min-w-0 min-[1180px]:w-[780px] min-[1180px]:flex-none">
          {mode === 'map' && course.hasMap && (
            <div className="max-[719px]:hidden">
              <CourseMap course={course} progress={progress} />
            </div>
          )}
          <div className={mode === 'map' && course.hasMap ? 'min-[720px]:hidden' : ''}>
            <CourseList course={course} progress={progress} />
          </div>
        </div>
        <CourseAside course={course} progress={progress} />
      </div>
    </div>
  )
}

const pageIcon = (
  <svg width="12" height="15" viewBox="0 0 12 15" aria-hidden>
    <path d="M1 1h7l3 3v10H1z" fill="#fff" stroke="#14162b" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M3 7h5M3 10h4" stroke="#4a33c9" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)

function CourseMap({ course, progress }: { course: Course; progress: GoalProgress[] }) {
  const by = useMemo(() => Object.fromEntries(progress.map((p) => [p.goal.id, p])), [progress])
  const decor = useMemo(() => {
    const a = createArt()
    const pos = (id: string): [number, number] => [by[id].goal.layout!.x, by[id].goal.layout!.y]
    const kind = (from: string, to: string) => (by[from].state === 'done' && by[to].state !== 'open' ? 'done' : 'open')
    return (
      <>
        {a.mountain()}
        {a.grove([[52, 205, 30], [86, 232, 24], [290, 575, 28], [312, 330, 26], [52, 960, 30], [92, 975, 22], [720, 820, 30], [748, 850, 22], [740, 945, 28]])}
        {a.hill(300, 978, 56, 34)}
        {a.hill(342, 986, 40, 24)}
        {a.hill(500, 560, 54, 34)}
        {a.hill(548, 566, 36, 22)}
        {a.lake(560, 330, 110, 58)}
        {a.bush(616, 366, 30, 16)}
        {a.bush(506, 368, 26, 14)}
        {a.sign(470, 950)}
        {EDGES.map(([from, mid, to]) => a.trail([pos(from), ...mid, pos(to)], kind(from, to)))}
        {SUMMIT_TAILS.map(([from, pts]) => a.trail([pos(from), ...pts], 'open'))}
        {course.goals.map((g) => a.disc(g.layout!.x, g.layout!.y, g.layout!.d ?? 62, by[g.id].state === 'done' ? 'done' : by[g.id].state === 'current' ? 'current' : 'open'))}
      </>
    )
  }, [course, by])
  const total = course.goals.length
  const doneN = progress.filter((p) => p.state === 'done').length
  return (
    <SketchMap width={W} height={H} decor={decor} label={`Bản đồ khóa ${course.title}: ${doneN} trên ${total} mục tiêu đã xong`}>
      <MapAt x={24} y={24} w={250}>
        <div className="border-2 border-ink bg-surface px-4 py-3 shadow-[0_4px_0_var(--color-ink)] rounded-[var(--radius-sketch)]">
          <div className="text-xs font-bold tracking-[0.06em] text-violet">ĐÍCH CỦA KHÓA</div>
          <div className="text-[22px] leading-[1.05] font-extrabold tracking-[-0.02em]">{course.finalGoal}</div>
          <div className="mt-1 text-[13px] leading-[1.35] text-muted">{course.finalNote}</div>
        </div>
      </MapAt>
      <MapAt x={560} y={60} w={200} className="font-hand text-[13px] leading-[1.3] font-semibold">
        cần qua cả {total} mục tiêu
        <br />
        để lên tới đỉnh
      </MapAt>
      {course.trails.filter((t) => t.at).map((t) => (
        <MapAt key={t.id} x={t.at!.x} y={t.at!.y} w={160} className="font-hand text-[22px] font-semibold" >
          <span className="inline-block" style={{ color: t.color, transform: `rotate(${t.at!.rotate}deg)` }}>{t.title}</span>
        </MapAt>
      ))}
      <MapAt x={470} y={930} w={90} align="center">
        <span className="inline-block -rotate-3 rounded border-[1.6px] border-ink bg-paper px-2 py-0.5 font-hand text-xs font-semibold">xuất phát</span>
      </MapAt>
      {course.goals.map((g) => {
        const p = by[g.id]
        const l = g.layout!
        const d = l.d ?? 62
        const text = p.state === 'done' ? 'đã xong' : p.state === 'current' ? 'đang học' : 'chưa học'
        const to = `/goal/${g.goalId ?? g.id}`
        return (
          <div key={g.id}>
            <MapAt x={l.x} y={l.y} center>
              <Link
                to={to}
                aria-label={`${g.title}, ${text}, ${p.gaDone} trên ${p.ga} ga`}
                aria-current={p.state === 'current' ? 'step' : undefined}
                className={`grid place-items-center rounded-full text-center leading-[1.05] font-extrabold tracking-[-0.02em] no-underline ${p.state === 'done' ? 'text-white' : 'text-ink'}`}
                style={{ width: d, height: d, fontSize: l.fs ?? (d >= 66 ? 22 : 17) }}
              >
                <span dangerouslySetInnerHTML={{ __html: g.badge }} />
              </Link>
            </MapAt>
            {p.state === 'current' && (
              <MapAt x={l.x} y={l.y - 58} w={100} align="center">
                <Chip tone="ink" className="text-xs">Bạn ở đây</Chip>
              </MapAt>
            )}
            <MapAt x={l.label.x} y={l.label.y} w={l.label.w} align={l.label.align} canvasWidth={W}>
              <div className={`text-sm leading-tight ${p.state === 'current' ? 'font-extrabold' : 'font-bold'}`}>{g.short ?? g.title}</div>
              <div className="mt-[3px] inline-flex items-center gap-[5px] text-xs font-semibold text-muted">
                {p.gaDone}/{p.ga} ga · {pageIcon} {p.sketchesOpen}/{p.sketches}
              </div>
            </MapAt>
          </div>
        )
      })}
    </SketchMap>
  )
}

function CourseList({ course, progress }: { course: Course; progress: GoalProgress[] }) {
  const groups = [
    ...(progress.some((p) => p.goal.trail === 'start') ? [{ id: 'start', title: 'Xuất phát', color: '#3f4560' }] : []),
    ...course.trails.map((t) => ({ id: t.id, title: `Đường ${t.title}`, color: t.color })),
  ]
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center gap-4 rounded-[var(--radius-sketch)] border-2 border-ink bg-surface px-[18px] py-3.5 shadow-[0_4px_0_var(--color-ink)]">
        <span className="min-w-0 flex-1">
          <span className="text-xs font-bold tracking-[0.06em] text-violet">ĐÍCH CỦA KHÓA</span>
          <br />
          <b className="text-xl leading-[1.1] font-extrabold">{course.finalGoal}</b>
        </span>
        <span className="hidden text-right text-sm text-muted min-[560px]:block">
          cần qua cả {course.goals.length} mục tiêu
          <br />
          đi đường nào trước cũng được
        </span>
      </div>
      {groups.map((grp) => {
        const items = progress.filter((p) => p.goal.trail === grp.id)
        if (items.length === 0) return null
        const doneAll = items.every((p) => p.state === 'done')
        return (
          <section key={grp.id} aria-label={grp.title} className="rounded-[20px] bg-surface px-2 pt-3.5 pb-2.5">
            <div className="flex items-baseline justify-between gap-3 px-4 pb-1.5">
              <h2 className="m-0 font-hand text-xl font-semibold" style={{ color: grp.color }}>{grp.title}</h2>
              <span className="text-[13px] text-muted">
                {items.length} mục tiêu{grp.id === 'start' ? (doneAll ? ' · xong' : '') : ' · thứ tự gợi ý từ trên xuống'}
              </span>
            </div>
            <ol className="m-0 flex list-none flex-col gap-1 p-0">
              {items.map((p, i) => (
                <ListRow key={p.goal.id} p={p} line={i < items.length - 1} />
              ))}
            </ol>
          </section>
        )
      })}
    </div>
  )
}

function ListRow({ p, line }: { p: GoalProgress; line: boolean }) {
  const g = p.goal
  const pct = p.ga ? (p.gaDone / p.ga) * 100 : 0
  const disc = p.state === 'done' ? 'bg-violet text-white' : p.state === 'current' ? 'bg-sun text-ink' : 'bg-surface text-ink'
  return (
    <li className={`relative flex items-center gap-3.5 rounded-2xl px-4 py-2.5 ${p.state === 'current' ? 'bg-sun-soft' : ''}`}>
      {line && <span aria-hidden className="absolute top-[58px] -bottom-3.5 left-[39px] border-l-2 border-dashed border-disabled-line" />}
      <span aria-hidden className={`relative z-[1] grid size-[46px] flex-none place-items-center rounded-full border-2 border-ink text-center text-[13px] leading-none font-extrabold shadow-[0_3px_0_var(--color-ink)] ${disc}`}>
        <span dangerouslySetInnerHTML={{ __html: g.badge }} />
      </span>
      <span className="min-w-0 flex-1">
        <Link to={`/goal/${g.goalId ?? g.id}`} className="font-bold leading-tight text-ink no-underline">{g.title}</Link>
        {p.state === 'current' && <Chip tone="ink" className="ml-1.5 px-2 py-px align-[2px] text-[11px]">Bạn ở đây</Chip>}
        {g.sharedFrom && <Chip tone="violet" className="ml-1.5 px-2 py-px align-[2px] text-[11px]">chung {p.gaDone} ga</Chip>}
        <span className="block truncate text-[13px] text-muted max-[719px]:hidden">{g.blurb}</span>
        <span className="block text-[13px] text-muted min-[720px]:hidden">{p.gaDone}/{p.ga} ga</span>
      </span>
      <span className="w-[120px] flex-none max-[719px]:hidden">
        <span className="block text-xs font-bold text-muted">{p.gaDone}/{p.ga} ga</span>
        <span className="mt-1 block h-2 overflow-hidden rounded bg-track">
          <span className="block h-2 bg-violet" style={{ width: `${pct}%` }} />
        </span>
      </span>
      {p.sketches > 0 && (
        <span className="inline-flex w-[70px] flex-none items-center gap-[5px] text-[13px] font-semibold text-muted max-[719px]:hidden">
          {pageIcon} {p.sketchesOpen}/{p.sketches}
        </span>
      )}
      <ChevronRightIcon width={18} height={18} aria-hidden className="flex-none" />
    </li>
  )
}

function CourseAside({ course, progress }: { course: Course; progress: GoalProgress[] }) {
  const plan = useTodayPlan()
  const followed = progress.find((p) => p.state === 'current')
  const doneN = progress.filter((p) => p.state === 'done').length
  const shared = progress.find((p) => p.goal.sharedFrom && p.gaDone > 0)
  const stationNo = plan.next ? plan.stations.findIndex((s) => s.id === plan.next!.id) + 1 : 0
  return (
    <aside className="flex min-w-0 flex-1 flex-col gap-4">
      {followed && plan.next && (
        <section aria-labelledby="why" className="rounded-[22px] border-2 border-ink bg-sun-soft p-[18px] shadow-block-lg">
          <h2 id="why" className="m-0 text-[21px] leading-[1.15] font-extrabold tracking-[-0.01em]">Vì sao hôm nay học {shortName(plan.next.title)}?</h2>
          <ol className="m-0 mt-3 flex list-none flex-col p-0 text-sm">
            <li className="rounded-xl border-2 border-ink bg-surface px-3 py-2">
              <span className="text-xs font-bold text-violet">ĐÍCH</span>
              <br />
              <b>{course.finalGoal}</b>
            </li>
            <li aria-hidden className="py-0.5 pl-[18px] font-hand text-xs font-semibold text-muted">↑ cần</li>
            <li className="rounded-xl bg-surface px-3 py-2">
              <span className="text-xs font-bold text-muted">MỤC TIÊU · 1 trong {course.goals.length}</span>
              <br />
              <b>{followed.goal.title}</b>
            </li>
            <li aria-hidden className="py-0.5 pl-[18px] font-hand text-xs font-semibold text-muted">↑ cần</li>
            <li className="rounded-xl border-2 border-ink bg-sun px-3 py-2">
              <span className="text-xs font-bold">GA {stationNo} · HÔM NAY</span>
              <br />
              <b>{plan.next.title}</b>
            </li>
          </ol>
          <ButtonLink to={`/goal/${followed.goal.goalId}`} className="mt-3.5 h-[52px] w-full text-[17px]">Mở bản đồ {followed.goal.title}</ButtonLink>
        </section>
      )}
      <section aria-labelledby="dst" className="rounded-[18px] bg-surface p-4">
        <h2 id="dst" className="m-0 text-[15px] font-bold">Lên tới đỉnh nghĩa là</h2>
        <ul className="m-0 mt-2 flex list-disc flex-col gap-1 pl-[18px] text-sm">
          {course.summit.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
          <div className="rounded-xl bg-subtle px-2.5 py-2">
            <b className="text-xl font-extrabold">{doneN}/{course.goals.length}</b>
            <br />
            mục tiêu
          </div>
          {course.totalSketches > 0 && (
            <div className="rounded-xl bg-subtle px-2.5 py-2">
              <b className="text-xl font-extrabold">{course.openSketches}/{course.totalSketches}</b>
              <br />
              sketch đã mở
            </div>
          )}
        </div>
      </section>
      {shared && (
        <section className="rounded-[18px] bg-surface px-4 py-3.5 text-sm">
          <b>Mục tiêu chung ga thì không học lại.</b> “{shared.goal.title.replace(/ tìm kiếm$/, '')}” đã có {shared.gaDone}/{shared.ga} ga nhờ {shared.goal.sharedFrom}.
        </section>
      )}
    </aside>
  )
}

/** "Tìm kiếm chi phí đều (UCS)" → "UCS" nếu có viết tắt trong ngoặc, ngược lại giữ nguyên. */
function shortName(title: string) {
  return /\(([^)]+)\)\s*$/.exec(title)?.[1] ?? title
}

import { useMemo } from 'react'
import { Link } from 'react-router'
import { skillIndex } from '@/content/skills'
import { lessons } from '@/content/lessons'
import { todayMock } from '@/content/mock/today'
import { retrievability, useProgress } from '@/learning/progress'
import { useTodayPlan } from './useTodayPlan'
import { ButtonLink } from '@/ui/Button'
import { Chip } from '@/ui/Chip'
import { MemoryBar } from '@/ui/MemoryBar'
import { StationStrip, type StripState } from '@/ui/StationStrip'
import { CalendarIcon, ChevronRightIcon } from '@/ui/icons'

const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

const card = 'rounded-card bg-surface'
const h2 = 'm-0 font-display text-[22px] font-bold tracking-[-0.01em]'

export function HomePage() {
  const { goalId, goal, stations, done, total, due, lesson, segments, totalMinutes } = useTodayPlan()
  const skills = useProgress((s) => s.skills)
  const lessonStep = useProgress((s) => s.lessonStep)
  const now = new Date()

  const resuming = !!lesson && (lessonStep[lesson.id] ?? 0) > 0
  const minutesLeft = stations
    .filter((s) => s.status === 'new')
    .reduce((n, s) => n + (lessons[skillIndex[s.id].lesson ?? '']?.minutes ?? 0), 0)
  const steps = segments

  const memory = useMemo(
    () =>
      Object.entries(skills)
        .map(([id, rec]) => ({ id, value: retrievability(rec, now) }))
        .sort((a, b) => a.value - b.value),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [skills],
  )
  const lowCount = memory.filter((m) => m.value < 0.9).length

  const strip: StripState[] = stations.map((s) => (s.status !== 'new' ? 'done' : s.next ? 'today' : 'todo'))
  const { calibration, notebook, nextGoal } = todayMock

  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-3.5 min-[720px]:gap-6">
        <section aria-labelledby="today" className="rounded-[22px] border-2 border-ink bg-surface p-[18px] pb-5 shadow-[0_5px_0_var(--color-ink)] min-[720px]:rounded-card-lg min-[720px]:p-[30px] min-[720px]:pb-8 min-[720px]:shadow-block-lg">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="m-0 text-sm font-semibold text-muted min-[720px]:text-[17px]">
              <span className="min-[720px]:hidden">{totalMinutes > 0 ? `Khoảng ${totalMinutes} phút` : 'Hôm nay nhẹ nhàng'}</span>
              <span className="hidden min-[720px]:inline">
                {WEEKDAYS[now.getDay()]} {now.getDate()}/{now.getMonth() + 1}
                {totalMinutes > 0 && ` · khoảng ${totalMinutes} phút`}
              </span>
            </p>
            <p className="m-0 hidden items-center gap-1.5 font-bold min-[720px]:flex">
              <CalendarIcon width={18} height={18} />
              {todayMock.streakDays} ngày học liền
            </p>
          </div>
          <h1 id="today" className="mt-1 mb-0 text-[32px] leading-none font-extrabold tracking-[-0.03em] min-[720px]:mt-2 min-[720px]:text-[46px] min-[720px]:leading-[1.02]">
            Buổi học hôm nay
          </h1>

          {steps.length > 0 ? (
            <>
              <ol className="m-0 mt-4 grid list-none gap-2 p-0 text-[15px] min-[720px]:mt-6 min-[720px]:grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] min-[720px]:gap-2.5 min-[720px]:text-[17px]">
                {steps.map((st, i) => (
                  <li
                    key={st.title}
                    className={`flex items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 min-[720px]:flex-col min-[720px]:items-stretch min-[720px]:justify-start min-[720px]:gap-1.5 min-[720px]:rounded-2xl min-[720px]:p-3.5 ${
                      i === 0 ? 'border-2 border-ink bg-sun-soft' : st.kind === 'lesson' ? 'bg-violet-soft' : 'bg-bg'
                    }`}
                  >
                    <span className={`order-2 font-mono text-[13px] font-bold min-[720px]:order-1 ${st.kind === 'lesson' ? 'text-violet' : i === 0 ? '' : 'text-muted'}`}>
                      <span className="min-[720px]:hidden">{st.minutes}′</span>
                      <span className="hidden min-[720px]:inline">
                        {i + 1} · {st.minutes} phút
                      </span>
                    </span>
                    <b className="order-1 leading-tight font-bold min-[720px]:order-2 min-[720px]:leading-[1.25]">{st.title}</b>
                  </li>
                ))}
              </ol>
              <div className="mt-[18px] flex flex-wrap items-center gap-x-[18px] gap-y-3 min-[720px]:mt-[26px]">
                <ButtonLink to="/session" className="w-full min-[720px]:h-[58px] min-[720px]:w-auto min-[720px]:px-[34px] min-[720px]:text-[19px]">
                  {resuming && steps[0]?.kind === 'lesson' ? 'Học tiếp' : 'Bắt đầu buổi học'}
                </ButtonLink>
                {due.length > 0 && (
                  <Link to="/review" className="hidden font-semibold text-muted underline min-[720px]:inline">
                    Chỉ ôn thôi
                  </Link>
                )}
                <Link to={`/goal/${goalId}`} className="hidden font-semibold text-muted underline min-[720px]:inline">
                  Đổi ga mới
                </Link>
              </div>
            </>
          ) : (
            <p className="mt-4 mb-0 max-w-[52ch] text-lg text-muted">Bạn đã tới ga cuối của tuyến này và không có kỹ năng nào đến hạn ôn. Quay lại khi có thẻ đến hạn.</p>
          )}
        </section>

        <section aria-labelledby="goal" className={`${card} flex flex-wrap items-center gap-x-7 gap-y-4 p-4 min-[720px]:px-[26px] min-[720px]:py-6`}>
          <div className="min-w-0 flex-[999_1_300px]">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="hidden min-[720px]:inline-flex"><Chip tone="sun">Đang theo</Chip></span>
              <h2 id="goal" className="m-0 text-xl font-extrabold tracking-[-0.02em] min-[720px]:text-[26px]">{goal.title}</h2>
              <span className="ml-auto text-sm font-bold min-[720px]:hidden">{done}/{total} ga</span>
            </div>
            <StationStrip states={strip} size="md" label={`${done} trên ${total} ga đã qua`} className="mt-2.5 max-w-[460px] min-[720px]:mt-3.5" />
            <p className="mt-2.5 mb-0 hidden text-[15px] text-muted min-[720px]:block">
              {done} trên {total} ga{minutesLeft > 0 && ` · còn khoảng ${minutesLeft} phút`} · đích: {lower(goal.outcome)}
            </p>
          </div>
          <div className="hidden min-w-0 flex-[1_1_220px] flex-col gap-2 rounded-[14px] bg-subtle px-4 py-3.5 min-[720px]:flex">
            <span className="text-[13px] text-muted">Mục tiêu gợi ý tiếp theo</span>
            <Link to="/courses" className="font-bold leading-[1.3] text-ink no-underline">{nextGoal.title}</Link>
            <Chip tone="violet" className="self-start text-[13px]">{done} ga đã xong</Chip>
          </div>
        </section>

        {/* Điện thoại: Sức nhớ gọn thành một hàng */}
        <Link to="/review" className="flex items-center justify-between gap-2.5 rounded-[18px] bg-surface px-4 py-3.5 text-ink no-underline min-[720px]:hidden">
          <span className="flex flex-col">
            <b>Sức nhớ</b>
            <span className={`text-sm ${lowCount > 0 ? 'text-wrong-ink' : 'text-muted'}`}>{lowCount > 0 ? `${lowCount} kỹ năng dưới 90%` : 'Chưa có kỹ năng nào dưới 90%'}</span>
          </span>
          <ChevronRightIcon width={18} height={18} />
        </Link>
      </div>

      <aside className="hidden min-w-0 flex-[1_1_320px] flex-col gap-5 min-[720px]:flex">
        <section aria-labelledby="mem" className={`${card} p-[22px]`}>
          <div className="flex items-baseline justify-between gap-2.5">
            <h2 id="mem" className={h2}>Sức nhớ</h2>
            <Link to={`/goal/${goalId}`} className="text-sm font-bold text-violet">Bảng kỹ năng</Link>
          </div>
          {memory.length > 0 ? (
            <>
              <ul className="m-0 mt-3.5 flex list-none flex-col gap-3 p-0">
                {memory.slice(0, 5).map((m) => (
                  <li key={m.id}>
                    <MemoryBar label={skillIndex[m.id]?.title ?? m.id} value={m.value} />
                  </li>
                ))}
              </ul>
              <p className="mt-3 mb-0 text-[13px] text-muted">
                Ước tính từ lịch ôn.{lowCount > 0 && ` ${lowCount} kỹ năng màu cam nên được ôn sớm.`}
              </p>
            </>
          ) : (
            <p className="mt-3 mb-0 text-[15px] text-muted">Chưa có kỹ năng nào để nhớ. Học xong ga đầu tiên, sức nhớ của nó sẽ hiện ở đây.</p>
          )}
        </section>

        {/* Dữ liệu mẫu: xem src/content/mock/today.ts */}
        <section aria-labelledby="cal" className={`${card} p-[22px]`}>
          <h2 id="cal" className={h2}>Chắc chắn có đúng không</h2>
          <p className="mt-2.5 mb-0 text-[15px] text-muted">Tuần này bạn chọn <b className="text-ink">Rất chắc</b> {calibration.sure} lần.</p>
          <div aria-hidden className="mt-2.5 grid gap-1" style={{ gridTemplateColumns: `repeat(${calibration.sure}, minmax(0, 1fr))` }}>
            {Array.from({ length: calibration.sure }, (_, i) => (
              <span key={i} className={`h-[18px] rounded-[5px] ${i < calibration.right ? 'bg-correct' : 'box-border border-2 border-wrong bg-surface'}`} />
            ))}
          </div>
          <p className="mt-2.5 mb-0 text-[15px]">Đúng {calibration.right}, sai {calibration.wrong}. Cả {calibration.wrong} lần sai đều ở chỗ <b>{calibration.weakSpot}</b>.</p>
        </section>

        <section aria-labelledby="nb" className={`${card} p-[22px]`}>
          <div className="flex items-baseline justify-between gap-2.5">
            <h2 id="nb" className={h2}>Sổ tay</h2>
            <Link to="/notebook" className="text-sm font-bold text-violet">Mở sổ tay</Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <Link
              to="/notebook"
              className="grid aspect-[4/3] place-items-center rounded-xl border-2 border-ink bg-lined p-2 text-center font-hand text-sm font-bold text-ink no-underline"
              style={{ backgroundImage: 'linear-gradient(var(--color-lined-rule) 1px, transparent 1px)', backgroundSize: '100% 14px' }}
            >
              {notebook.sketchTitle}
            </Link>
            <Link to="/notebook" className="grid aspect-[4/3] place-items-center rounded-xl border-2 border-dashed border-disabled-line bg-subtle p-2 text-center text-[13px] text-muted no-underline">
              {notebook.photoLabel}
            </Link>
          </div>
        </section>
      </aside>
    </div>
  )
}

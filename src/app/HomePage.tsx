import { Link } from 'react-router'
import { goals, skillIndex } from '@/content/skills'
import { lessons } from '@/content/lessons'
import { useDue, useGoalRoute } from '@/learning/hooks'
import { useProgress } from '@/learning/progress'
import { ButtonLink } from '@/ui/Button'

function MiniRoute({ goalId }: { goalId: string }) {
  const { stations } = useGoalRoute(goalId)
  return (
    <div className="flex items-center" aria-hidden>
      {stations.map((s, i) => (
        <span key={s.id} className={`flex items-center ${i === 0 ? '' : 'flex-1'}`}>
          {i > 0 && <span className={`h-1 flex-1 ${stations[i - 1].status !== 'new' ? 'bg-route' : 'bg-line'}`} />}
          <span
            className={`block size-3 rounded-full border-[3px] ${
              s.status !== 'new' ? 'border-route bg-route' : s.next ? 'border-signal bg-surface' : 'border-line bg-surface'
            }`}
          />
        </span>
      ))}
    </div>
  )
}

export function HomePage() {
  const goalId = goals[0].id
  const { goal, nextId, done, total } = useGoalRoute(goalId)
  const due = useDue()
  const lessonStep = useProgress((s) => s.lessonStep)
  const next = nextId ? skillIndex[nextId] : null
  const lesson = next?.lesson ? lessons[next.lesson] : null
  const resuming = lesson && (lessonStep[lesson.id] ?? 0) > 0

  return (
    <div className="grid gap-10 pt-6 sm:pt-12">
      {/* Một tiêu điểm: việc nên làm ngay bây giờ */}
      <section aria-labelledby="next-h">
        {next && lesson ? (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-10">
            <p className="text-[15px] text-muted">
              {resuming ? 'Bạn đang học dở' : done === 0 ? 'Ga đầu tiên của bạn' : 'Ga tiếp theo'} trên tuyến{' '}
              <Link to={`/goal/${goalId}`} className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
                {goal.title}
              </Link>
            </p>
            <h1 id="next-h" className="mt-3 max-w-[22ch] text-[34px] leading-[1.15] font-bold tracking-tight sm:text-[44px]">
              {next.title}
            </h1>
            <p className="mt-4 max-w-[58ch] text-lg leading-snug text-muted">
              Học xong, bạn {next.can.charAt(0).toLowerCase() + next.can.slice(1)}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ButtonLink to={`/learn/${lesson.id}`} className="h-12 px-6 text-base">
                {resuming ? 'Học tiếp' : 'Bắt đầu'}
              </ButtonLink>
              <span className="text-[15px] text-muted">khoảng {lesson.minutes} phút</span>
            </div>
            {done === 0 && (
              <p className="mt-8 border-t border-line pt-5 text-[15px] text-muted">
                Đã biết một phần rồi?{' '}
                <Link to={`/check/${goalId}`} className="font-medium text-route underline-offset-4 hover:underline">
                  Trả lời vài câu để bỏ qua những ga bạn đã nắm
                </Link>
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-line bg-surface p-6 sm:p-10">
            <p className="text-[15px] text-muted">Tuyến {goal.title}</p>
            <h1 id="next-h" className="mt-3 text-[34px] leading-tight font-bold tracking-tight sm:text-[44px]">
              Bạn đã tới ga cuối.
            </h1>
            <p className="mt-4 max-w-[58ch] text-lg text-muted">Giờ việc chính là ôn đúng hạn để không quên.</p>
          </div>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5" aria-labelledby="review-h">
          <h2 id="review-h" className="font-semibold">
            Ôn tập
          </h2>
          {due.length > 0 ? (
            <>
              <p className="mt-1 text-[15px] text-muted">
                {due.length} kỹ năng đến hạn. Mỗi kỹ năng một câu, chưa tới 5 phút.
              </p>
              <ButtonLink to="/review" variant="secondary" className="mt-4">
                Ôn ngay
              </ButtonLink>
            </>
          ) : (
            <p className="mt-1 text-[15px] text-muted">Hôm nay không có gì đến hạn. Kỹ năng bạn học xong sẽ tự xuất hiện ở đây khi tới lúc ôn.</p>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5" aria-labelledby="goal-h">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="goal-h" className="font-semibold">
              Mục tiêu: {goal.title}
            </h2>
            <span className="font-mono text-[14px] text-muted">
              {done}/{total}
            </span>
          </div>
          <p className="mt-1 text-[15px] leading-snug text-muted">{goal.outcome}</p>
          <div className="mt-4">
            <MiniRoute goalId={goalId} />
          </div>
          <Link to={`/goal/${goalId}`} className="mt-4 inline-block text-[15px] font-medium text-route underline-offset-4 hover:underline">
            Xem cả tuyến
          </Link>
        </section>
      </div>
    </div>
  )
}

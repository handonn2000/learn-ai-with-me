import { Link, useParams } from 'react-router'
import { goalIndex, skillIndex } from '@/content/skills'
import { lessons } from '@/content/lessons'
import { useGoalRoute } from '@/learning/hooks'
import { courses } from '@/content/courses'
import { ComingSoon } from './ComingSoon'
import { RouteLine } from '@/ui/RouteLine'
import { NotFound } from './NotFound'

export function GoalPage() {
  const { goalId = '' } = useParams()
  if (!goalIndex[goalId]) {
    const mock = courses.flatMap((c) => c.goals).find((g) => g.id === goalId)
    return mock ? <ComingSoon title={mock.title} /> : <NotFound />
  }
  return <Goal goalId={goalId} />
}

function Goal({ goalId }: { goalId: string }) {
  const { goal, stations, done, total } = useGoalRoute(goalId)
  const minutesLeft = stations
    .filter((s) => s.status === 'new')
    .reduce((n, s) => n + (lessons[skillIndex[s.id].lesson ?? '']?.minutes ?? 0), 0)
  return (
    <div className="grid gap-10 pt-6 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div>
        <p className="text-[15px] text-muted">Mục tiêu</p>
        <h1 className="mt-1 text-[34px] leading-tight font-bold tracking-tight sm:text-[40px]">{goal.title}</h1>
        <p className="mt-3 max-w-[56ch] text-lg leading-snug text-muted">Tới ga cuối, bạn sẽ {goal.outcome.charAt(0).toLowerCase() + goal.outcome.slice(1)}</p>
        <div className="mt-10">
          <RouteLine stations={stations} />
        </div>
      </div>
      <aside className="h-fit space-y-4 rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-6">
        <div>
          <p className="font-mono text-[28px] font-semibold">
            {done}
            <span className="text-muted">/{total}</span>
          </p>
          <p className="text-[15px] text-muted">ga đã qua{minutesLeft > 0 && `, còn khoảng ${minutesLeft} phút học`}</p>
        </div>
        <p className="text-[15px] leading-snug text-muted">
          Tuyến này được lần ngược từ ga cuối: mỗi ga chỉ có mặt vì một ga phía sau thật sự cần nó.
        </p>
        <Link to={`/check/${goalId}`} className="block text-[15px] font-medium text-route underline-offset-4 hover:underline">
          Kiểm tra nhanh để bỏ qua ga đã biết
        </Link>
        <Link to="/map" className="block text-[15px] font-medium text-route underline-offset-4 hover:underline">
          Xem bản đồ đầy đủ
        </Link>
      </aside>
    </div>
  )
}

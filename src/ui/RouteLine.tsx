import { Link } from 'react-router'
import { Check, Clock } from 'lucide-react'
import { skillIndex } from '@/content/skills'
import { useProgress, dueLabel } from '@/learning/progress'
import type { Station } from '@/learning/hooks'

function Marker({ st, isGoal }: { st: Station; isGoal: boolean }) {
  const size = isGoal ? 'size-7' : 'size-6'
  if (st.status === 'learned')
    return (
      <span className={`${size} grid place-items-center rounded-full bg-route text-surface ${isGoal ? 'ring-4 ring-route-soft' : ''}`}>
        <Check size={14} strokeWidth={3} />
      </span>
    )
  if (st.status === 'due')
    return (
      <span className={`${size} grid place-items-center rounded-full border-[3px] border-signal bg-signal-soft`}>
        <Clock size={12} strokeWidth={3} />
      </span>
    )
  return (
    <span
      className={`${size} block rounded-full border-[3px] bg-surface ${st.next ? 'border-signal' : 'border-line'} ${isGoal ? 'ring-4 ring-line/60' : ''}`}
    />
  )
}

/** Sơ đồ tuyến dọc: mỗi kỹ năng là một ga, đi từ trên xuống tới ga đích. */
export function RouteLine({ stations }: { stations: Station[] }) {
  const records = useProgress((s) => s.skills)
  return (
    <ol className="relative">
      {stations.map((st, i) => {
        const sk = skillIndex[st.id]
        const isGoal = i === stations.length - 1
        const lineDone = st.status !== 'new'
        const rec = records[st.id]
        const status =
          st.status === 'learned'
            ? rec?.via === 'placement'
              ? 'Đã biết'
              : `Đã học · ôn ${dueLabel(rec!)}`
            : st.status === 'due'
              ? 'Đến hạn ôn'
              : st.next
                ? 'Ga tiếp theo'
                : null
        return (
          <li key={st.id} className="relative grid grid-cols-[2.25rem_1fr] gap-x-3" aria-current={st.next ? 'step' : undefined}>
            <div className="relative flex justify-center">
              {i < stations.length - 1 && (
                <span className={`absolute top-6 bottom-0 w-1 rounded-full ${lineDone ? 'bg-route' : 'bg-line'}`} aria-hidden />
              )}
              <span className="relative z-10 pt-0.5">
                <Marker st={st} isGoal={isGoal} />
              </span>
            </div>
            <div className={`pb-7 ${st.next ? '' : ''}`}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className={`text-[17px] leading-snug font-semibold ${st.status === 'new' && !st.next ? 'text-muted' : ''}`}>
                  {sk.title}
                </h3>
                {status && (
                  <span
                    className={`text-[13px] font-medium ${st.next ? 'text-ink' : st.status === 'due' ? 'text-ink' : 'text-muted'}`}
                  >
                    {st.next ? <span className="rounded-full bg-signal-soft px-2 py-0.5">{status}</span> : status}
                  </span>
                )}
              </div>
              <p className="mt-1 max-w-[60ch] text-[15px] leading-snug text-muted">{sk.can}</p>
              {sk.lesson && (st.next || st.status !== 'new') && (
                <Link
                  to={`/learn/${sk.lesson}`}
                  className={
                    st.next
                      ? 'mt-3 inline-flex h-10 items-center rounded-full bg-route px-4 text-[15px] font-semibold text-white dark:text-[#0d1a17]'
                      : 'mt-2 inline-block text-[14px] font-medium text-route underline-offset-4 hover:underline'
                  }
                >
                  {st.next ? 'Học ga này' : 'Học lại'}
                </Link>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

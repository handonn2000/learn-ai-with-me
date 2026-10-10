import { motion } from 'motion/react'

export type StationKind = 'explain' | 'exercise'
export type StationState = 'done' | 'current' | 'todo'

/**
 * Tiến độ trong lesson vẽ như một đoạn tuyến: mỗi bước là một ga.
 * Ga tròn = bước giải thích, ga vuông = bài tập.
 */
export function RouteBar({ stations }: { stations: { kind: StationKind; state: StationState; label: string }[] }) {
  return (
    <ol className="flex w-full items-center" aria-label="Tiến độ bài học">
      {stations.map((s, i) => {
        const lineDone = i > 0 && stations[i - 1].state === 'done'
        return (
          <li key={i} className={`flex items-center ${i === 0 ? '' : 'flex-1'}`} aria-current={s.state === 'current' ? 'step' : undefined}>
            {i > 0 && (
              <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-line" aria-hidden>
                <motion.span
                  className="absolute inset-y-0 left-0 bg-route"
                  initial={false}
                  animate={{ width: lineDone ? '100%' : '0%' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </span>
            )}
            <span className="sr-only">
              {s.label}: {s.state === 'done' ? 'xong' : s.state === 'current' ? 'đang làm' : 'chưa làm'}
            </span>
            <motion.span
              aria-hidden
              initial={false}
              animate={{ scale: s.state === 'current' ? 1.25 : 1 }}
              className={[
                'block size-3.5 shrink-0 border-[3px]',
                s.kind === 'exercise' ? 'rounded-[4px]' : 'rounded-full',
                s.state === 'done' && 'border-route bg-route',
                s.state === 'current' && 'border-signal bg-surface',
                s.state === 'todo' && 'border-line bg-surface',
              ]
                .filter(Boolean)
                .join(' ')}
            />
          </li>
        )
      })}
    </ol>
  )
}

import { AnimatePresence, motion } from 'motion/react'
import type { Algo, FrontierItem } from '@/algorithms/search'
import { keyName, shortValue } from '@/algorithms/describe'

const rule: Record<Algo, string> = {
  bfs: 'vào trước ra trước',
  ucs: 'g nhỏ nhất ra trước',
  gbfs: 'h nhỏ nhất ra trước',
  astar: 'f = g + h nhỏ nhất ra trước',
}

/** Frontier xếp theo thứ tự sẽ được lấy ra; phần tử đầu là nút được mở rộng tiếp theo. */
export function FrontierList({
  algo,
  items,
  revealOrder = true,
  values = 'key',
}: {
  algo: Algo
  items: FrontierItem[]
  revealOrder?: boolean
  values?: 'key' | 'parts' | 'none'
}) {
  // Trong bài tập, không lộ thứ tự lấy ra: xếp theo tên và không tô phần tử đầu.
  if (!revealOrder) items = [...items].sort((a, b) => a.state.localeCompare(b.state))
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="text-[13px] text-muted">
        Frontier{revealOrder && <span className="hidden sm:inline"> · {rule[algo]}</span>}
      </span>
      <ol className="flex flex-wrap gap-1.5 font-mono text-[14px]">
        <AnimatePresence initial={false} mode="popLayout">
          {items.length === 0 && (
            <motion.li key="empty" className="text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              (rỗng)
            </motion.li>
          )}
          {items.map((it, i) => (
            <motion.li
              key={it.state}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={`rounded-md border px-2 py-0.5 ${i === 0 && revealOrder ? 'border-sun bg-sun-soft' : 'border-line bg-surface'}`}
            >
              <span className="font-semibold">{it.state}</span>
              {algo !== 'bfs' && values === 'key' && (
                <span className="text-muted">
                  {' '}
                  {keyName(algo)}={shortValue(algo, it)}
                </span>
              )}
              {algo !== 'bfs' && values === 'parts' && (
                <span className="text-muted">
                  {' '}
                  g={it.g} h={it.h}
                </span>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </div>
  )
}

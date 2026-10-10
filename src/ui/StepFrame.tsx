import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, X, Lightbulb, BookOpen } from 'lucide-react'
import { Rich } from './Rich'

/**
 * Khung một bước: nội dung ở giữa, thanh hành động cố định ở đáy.
 * Nút chính luôn ở góc phải dưới — người học không phải đi tìm.
 */
export function StepFrame({ children, footer, feedback }: { children: ReactNode; footer: ReactNode; feedback?: ReactNode }) {
  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-4 pb-48 pt-6 sm:px-6 sm:pt-10">{children}</div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur">
        <AnimatePresence initial={false}>{feedback}</AnimatePresence>
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">{footer}</div>
      </div>
    </>
  )
}

export type FeedbackKind = 'correct' | 'wrong' | 'hint' | 'solution'

const look: Record<FeedbackKind, { cls: string; icon: ReactNode; title: string }> = {
  correct: { cls: 'bg-route-soft', icon: <Check size={18} className="text-route" />, title: 'Đúng rồi.' },
  wrong: { cls: 'bg-stop-soft', icon: <X size={18} className="text-stop" />, title: 'Chưa đúng.' },
  hint: { cls: 'bg-signal-soft', icon: <Lightbulb size={18} className="text-[color:var(--ink)]" />, title: 'Gợi ý' },
  solution: { cls: 'bg-paper', icon: <BookOpen size={18} className="text-muted" />, title: 'Lời giải' },
}

export function Feedback({ kind, html }: { kind: FeedbackKind; html: string }) {
  const l = look[kind]
  return (
    <motion.div
      key={kind + html}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`${l.cls} overflow-hidden`}
      role="status"
    >
      <div className="mx-auto flex max-w-3xl gap-3 px-4 py-3 sm:px-6">
        <span className="mt-1 shrink-0">{l.icon}</span>
        <p className="text-[15px] leading-snug">
          <b className="font-semibold">{l.title}</b> <Rich html={html} />
        </p>
      </div>
    </motion.div>
  )
}

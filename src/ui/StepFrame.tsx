import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { BulbIcon, CheckIcon, CrossIcon, DocIcon } from './icons'
import { Rich } from './Rich'

/**
 * Khung một bước: nội dung trong thẻ ở giữa (`card`), thanh hành động cố định ở đáy.
 * Nút chính luôn ở góc phải dưới. Phản hồi (`feedback`) nằm ngay trên thanh hành động.
 */
export function StepFrame({ children, footer, feedback, card = true }: { children: ReactNode; footer: ReactNode; feedback?: ReactNode; card?: boolean }) {
  return (
    <>
      <div className="mx-auto w-full max-w-[864px] px-4 pt-4 pb-56 min-[720px]:pt-6">
        {card ? <div className="rounded-3xl border-2 border-ink bg-surface p-5 shadow-block-lg min-[720px]:px-8 min-[720px]:py-7">{children}</div> : children}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ink bg-surface">
        <AnimatePresence initial={false}>{feedback}</AnimatePresence>
        <div className="mx-auto flex max-w-[864px] items-center justify-between gap-3 px-4 pt-3 pb-[max(14px,env(safe-area-inset-bottom))]">{footer}</div>
      </div>
    </>
  )
}

export type FeedbackKind = 'correct' | 'wrong' | 'hint' | 'solution'

const look: Record<FeedbackKind, { cls: string; badge: string; icon: ReactNode; title: string; tone: string }> = {
  correct: { cls: 'bg-correct-soft', badge: 'bg-correct text-white', icon: <CheckIcon width={18} height={18} />, title: 'Đúng rồi', tone: 'text-correct-ink' },
  wrong: { cls: 'bg-wrong-soft', badge: 'bg-wrong text-white', icon: <CrossIcon width={18} height={18} />, title: 'Chưa đúng', tone: 'text-wrong-ink' },
  hint: { cls: 'bg-sun-soft', badge: 'bg-sun text-ink', icon: <BulbIcon width={18} height={18} />, title: 'Gợi ý', tone: 'text-ink' },
  solution: { cls: 'bg-subtle', badge: 'bg-ink text-white', icon: <DocIcon width={18} height={18} />, title: 'Lời giải', tone: 'text-ink' },
}

/** Dải phản hồi dưới thẻ bài. Đúng = xanh dương, sai = cam; luôn kèm icon và chữ. */
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
      role={kind === 'wrong' ? 'alert' : 'status'}
    >
      <div className="mx-auto flex max-w-[864px] gap-3 px-4 py-3">
        <span aria-hidden className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${l.badge}`}>{l.icon}</span>
        <p className="m-0 text-[15px] leading-snug">
          <b className={`block text-lg ${l.tone}`}>{l.title}</b> <Rich html={html} />
        </p>
      </div>
    </motion.div>
  )
}

import type { ReactNode } from 'react'
import { BulbIcon, CheckIcon, CrossIcon, DocIcon } from './icons'

export type FeedbackKind = 'correct' | 'wrong' | 'hint' | 'solution'

const kinds: Record<FeedbackKind, { cls: string; icon: ReactNode }> = {
  correct: { cls: 'bg-correct-soft border-correct text-correct', icon: <CheckIcon className="text-correct" /> },
  wrong: { cls: 'bg-wrong-soft border-wrong', icon: <CrossIcon className="text-wrong" /> },
  hint: { cls: 'bg-sun-soft border-ink', icon: <BulbIcon className="text-ink" /> },
  solution: { cls: 'bg-bg border-disabled-line', icon: <DocIcon className="text-muted" /> },
}

/** Dải phản hồi sau khi chấm. Dùng `sheet` để trượt lên từ đáy (điện thoại). */
export function FeedbackBar({ kind, title, children, sheet = false, className = '' }: { kind: FeedbackKind; title: string; children?: ReactNode; sheet?: boolean; className?: string }) {
  const k = kinds[kind]
  return (
    <div role={kind === 'wrong' ? 'alert' : 'status'} className={`flex gap-2.5 border-t-2 px-3.5 py-3 text-[15px] ${sheet ? 'rounded-t-3xl pb-6' : 'rounded-[14px]'} ${k.cls} ${className}`}>
      <span className="mt-0.5 shrink-0">{k.icon}</span>
      <span className="text-ink">
        <b>{title}</b> {children}
      </span>
    </div>
  )
}

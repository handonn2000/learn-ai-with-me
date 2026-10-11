import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { CheckIcon, CrossIcon } from './icons'

export type TileState = 'default' | 'selected' | 'correct' | 'wrong' | 'locked'

const styles: Record<TileState, string> = {
  default: 'border-line shadow-[0_4px_0_var(--color-line)]',
  selected: 'border-violet bg-violet-soft shadow-[0_4px_0_var(--color-violet)]',
  correct: 'border-correct bg-correct-soft',
  wrong: 'border-wrong',
  locked: 'border-fill text-disabled-line',
}

/** Ô đáp án. Đúng/sai luôn có icon, không chỉ dựa vào màu. */
export function AnswerTile({ state = 'default', children, className = '', ...rest }: { state?: TileState; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={state === 'selected'}
      disabled={state === 'locked' || rest.disabled}
      className={`flex min-h-16 w-full items-center gap-2.5 rounded-2xl border-2 bg-surface px-4 py-3 text-left font-bold ${styles[state]} ${className}`}
      {...rest}
    >
      {state === 'correct' && <CheckIcon width={22} height={22} className="shrink-0 text-correct" />}
      {state === 'wrong' && <CrossIcon width={22} height={22} className="shrink-0 text-wrong" />}
      {children}
    </button>
  )
}

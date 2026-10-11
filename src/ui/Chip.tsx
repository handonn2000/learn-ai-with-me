import type { ReactNode } from 'react'

type Tone = 'sun' | 'ink' | 'violet' | 'wrong' | 'gray'

const tones: Record<Tone, string> = {
  sun: 'bg-sun border-2 border-ink text-ink font-bold',
  ink: 'bg-ink text-white font-bold',
  violet: 'bg-violet-soft text-violet font-bold',
  wrong: 'bg-wrong-soft text-wrong-ink font-bold',
  gray: 'bg-bg text-muted font-semibold',
}

/** Nhãn tròn. `sun` cho "Đoán trước", "Đang theo". */
export function Chip({ tone = 'gray', icon, children, className = '' }: { tone?: Tone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-[3px] text-sm ${tones[tone]} ${className}`}>
      {icon}
      {children}
    </span>
  )
}

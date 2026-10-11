import type { ReactNode } from 'react'

/** Khung "ĐÍCH" bo kiểu vẽ tay. */
export function Cartouche({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-block border-2 border-ink bg-sun px-3 py-1 rounded-[var(--radius-sketch)] font-hand text-sm font-semibold ${className}`}>
      {children}
    </span>
  )
}

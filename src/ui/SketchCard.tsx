import type { ReactNode } from 'react'
import { Button } from './Button'
import { LockIcon } from './icons'

const lined = { backgroundImage: 'linear-gradient(var(--color-lined-rule) 1px, transparent 1px)', backgroundSize: '100% 14px' }
const stripes = (c: string) => ({ backgroundImage: `repeating-linear-gradient(45deg, ${c} 0 8px, transparent 8px 16px)` })

/** Thẻ sketch: đã lật (giấy kẻ), còn úp (sọc tím + nút Lật), đang khoá (sọc xám + điều kiện mở). */
export function SketchCard({ state, title, children, unlockHint, onFlip, className = '' }: { state: 'open' | 'covered' | 'locked'; title: string; children?: ReactNode; unlockHint?: string; onFlip?: () => void; className?: string }) {
  const frame = `flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl p-3 text-center ${className}`
  if (state === 'open')
    return (
      <div className={`${frame} border-2 border-ink bg-lined font-hand text-sm font-semibold`} style={lined}>
        <b>{title}</b>
        {children}
      </div>
    )
  if (state === 'covered')
    return (
      <div className={`${frame} border-2 border-violet bg-violet-soft`} style={stripes('rgba(74,51,201,0.08)')}>
        <b className="font-hand text-sm">{title}</b>
        <Button variant="secondary" className="h-11 text-sm" onClick={onFlip}>Lật</Button>
      </div>
    )
  return (
    <div className={`${frame} border-2 border-dashed border-disabled-line bg-subtle text-muted`} style={stripes('rgba(154,161,181,0.12)')}>
      <LockIcon />
      <b className="text-sm">{title}</b>
      {unlockHint && <span className="text-[13px]">{unlockHint}</span>}
    </div>
  )
}

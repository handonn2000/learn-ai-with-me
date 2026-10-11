import { CloseIcon } from './icons'

/** Đầu màn học: nút đóng + thanh tiến độ dày + "n / N". */
export function SessionHeader({ current, total, onClose, className = '' }: { current: number; total: number; onClose: () => void; className?: string }) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button type="button" onClick={onClose} aria-label="Đóng buổi học" className="grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:text-ink">
        <CloseIcon />
      </button>
      <span role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={current} className="h-4 flex-1 overflow-hidden rounded-lg bg-track">
        <span className="block h-full rounded-lg bg-violet transition-[width] duration-200" style={{ width: `${pct}%` }} />
      </span>
      <span className="font-mono text-sm font-bold">
        {current} / {total}
      </span>
    </div>
  )
}

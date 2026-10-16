import { CloseIcon } from './icons'

/**
 * Đầu màn học: nút đóng + thanh tiến độ dày + "n / N".
 * `current` là số hiển thị "n / N"; `done` là số bước đã xong để tô thanh (mặc định bằng `current`, được phép lẻ:
 * 1.5 = xong bước 1 và nửa bước 2). `segmented` chia thanh thành `total` đoạn, dùng khi ít bước và mỗi bước dài.
 */
export function SessionHeader({ current, total, done = current, onClose, showCount = true, segmented = false, label, className = '' }: { current: number; total: number; done?: number; onClose: () => void; showCount?: boolean; segmented?: boolean; label?: string; className?: string }) {
  const pct = total > 0 ? Math.min(100, (done / total) * 100) : 0
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <button type="button" onClick={onClose} aria-label="Đóng buổi học" className="grid size-11 shrink-0 place-items-center rounded-xl text-muted hover:text-ink">
        <CloseIcon />
      </button>
      {label && <b className="text-lg">{label}</b>}
      <span role="progressbar" aria-label="Tiến độ buổi học" aria-valuemin={0} aria-valuemax={total} aria-valuenow={Math.floor(done)} className={`flex h-4 flex-1 ${segmented ? 'gap-1.5' : ''}`}>
        {segmented && total > 1 ? (
          Array.from({ length: total }, (_, k) => (
            <span key={k} className="h-full flex-1 overflow-hidden rounded-lg bg-track">
              <span className="block h-full rounded-lg bg-violet transition-[width] duration-200" style={{ width: `${Math.max(0, Math.min(1, done - k)) * 100}%` }} />
            </span>
          ))
        ) : (
          <span className="h-full flex-1 overflow-hidden rounded-lg bg-track">
            <span className="block h-full rounded-lg bg-violet transition-[width] duration-200" style={{ width: `${pct}%` }} />
          </span>
        )}
      </span>
      {showCount && (
        <span className="font-mono text-sm font-bold whitespace-nowrap">
          {current} / {total}
        </span>
      )}
    </div>
  )
}

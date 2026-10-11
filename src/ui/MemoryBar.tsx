/** Thanh sức nhớ (0..1). Dưới 90% chuyển cam, kèm chữ %. */
export function MemoryBar({ label, value, className = '' }: { label?: string; value: number; className?: string }) {
  const pct = Math.round(value * 100)
  const low = value < 0.9
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <span className="flex justify-between gap-2 text-[15px]">
          <span>{label}</span>
          <span className={`font-mono text-[13px] ${low ? 'text-wrong-ink' : ''}`}>{pct}%</span>
        </span>
      )}
      <span className="flex items-center gap-2.5">
        <span role="meter" aria-label={label ?? 'Sức nhớ'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="h-2 flex-1 overflow-hidden rounded bg-fill">
          <span className={`block h-full ${low ? 'bg-wrong' : 'bg-violet'}`} style={{ width: `${pct}%` }} />
        </span>
        {!label && <span className="font-mono text-sm">{pct}%</span>}
      </span>
    </div>
  )
}

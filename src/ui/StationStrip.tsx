export type StripState = 'done' | 'today' | 'todo'

/** Dải ô của một tuyến: đã qua (tím), hôm nay (vàng + viền), chưa (xám). */
export function StationStrip({ states, label, size = 'md', className = '' }: { states: StripState[]; label?: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const h = size === 'sm' ? 'h-4' : size === 'lg' ? 'h-[26px]' : 'h-[22px]'
  return (
    <ol aria-label={label} className={`m-0 grid list-none gap-[5px] p-0 ${className}`} style={{ gridTemplateColumns: `repeat(${states.length}, minmax(0, 1fr))` }}>
      {states.map((s, i) => (
        <li
          key={i}
          className={`${h} rounded-md ${s === 'done' ? 'bg-violet' : s === 'today' ? 'box-border border-2 border-ink bg-sun' : 'bg-fill'}`}
        />
      ))}
    </ol>
  )
}

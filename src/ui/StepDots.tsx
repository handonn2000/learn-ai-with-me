/** Chấm tiến độ trong một bước (ý 1/3, sketch 1/3). */
export function StepDots({ total, current, className = '' }: { total: number; current: number; className?: string }) {
  return (
    <span role="img" aria-label={`${current} trên ${total}`} className={`inline-flex items-center gap-1.5 ${className}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`size-2.5 rounded-full ${i + 1 === current ? 'bg-violet' : i + 1 < current ? 'bg-violet/50' : 'bg-track'}`} />
      ))}
    </span>
  )
}

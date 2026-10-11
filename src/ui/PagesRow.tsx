/** Hàng trang sketch dưới mỗi ga: đã mở (đặc) / chưa mở (nét đứt). */
export function PagesRow({ open, total, className = '' }: { open: number; total: number; className?: string }) {
  return (
    <span role="img" aria-label={`${open} trên ${total} trang sketch đã mở`} className={`inline-flex gap-1 ${className}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-[18px] w-3.5 rounded-[3px] border-2 ${i < open ? 'border-ink bg-lined' : 'border-dashed border-disabled-line'}`} />
      ))}
    </span>
  )
}

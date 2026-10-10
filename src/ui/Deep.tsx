import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

/** Khối "Đào sâu" — chi tiết nâng cao, thu gọn sẵn. Đọc hay bỏ qua đều được. */
export function Deep({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group rounded-xl border border-line bg-paper/60 px-4 py-3 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center gap-2 text-[15px] font-medium text-muted hover:text-ink">
        <ChevronRight size={16} className="transition-transform group-open:rotate-90" aria-hidden />
        Đào sâu: {title}
      </summary>
      <div className="prose-lesson mt-3 text-[16px]">{children}</div>
    </details>
  )
}

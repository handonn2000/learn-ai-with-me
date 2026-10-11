import { useEffect, useState } from 'react'
import { ListIcon, MapIcon } from './icons'

export type View = 'map' | 'list'
const KEY = 'learn-ai-v2-view'

function read(): View {
  try {
    return localStorage.getItem(KEY) === 'list' ? 'list' : 'map'
  } catch {
    return 'map'
  }
}

/** Nhớ lựa chọn Bản đồ | Danh sách trong localStorage (có thể bị chặn, nên bọc try/catch). */
export function useView(initial?: View) {
  const [view, setView] = useState<View>(initial ?? read)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, view)
    } catch {
      /* chế độ riêng tư: bỏ qua */
    }
  }, [view])
  return [view, setView] as const
}

export function ViewToggle({ value, onChange }: { value: View; onChange: (v: View) => void }) {
  const items: { v: View; label: string; icon: React.ReactNode }[] = [
    { v: 'map', label: 'Bản đồ', icon: <MapIcon width={18} height={18} /> },
    { v: 'list', label: 'Danh sách', icon: <ListIcon width={18} height={18} /> },
  ]
  return (
    <div role="group" aria-label="Kiểu xem" className="inline-flex overflow-hidden rounded-[14px] border-2 border-ink bg-surface text-[15px]">
      {items.map((it, i) => (
        <button key={it.v} type="button" aria-pressed={value === it.v} onClick={() => onChange(it.v)} className={`inline-flex min-h-11 items-center gap-2 px-4 font-semibold ${i > 0 ? 'border-l-2 border-ink' : ''} ${value === it.v ? 'bg-ink text-white' : ''}`}>
          {it.icon}
          {it.label}
        </button>
      ))}
    </div>
  )
}

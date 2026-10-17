import type { ReactNode } from 'react'
import { dims, envRows, tableDims } from '@/content/agents'

/**
 * Bảng nhỏ trong phần giải thích. MDX ở repo này không bật GFM nên bảng markdown không hiện được.
 * Bảng rộng thì cuộn ngang trong khung của nó, cột đầu đứng yên; trang không bị cuộn ngang.
 */
export function DataTable({ head, rows, mono, label }: { head: string[]; rows: ReactNode[][]; mono?: boolean; label?: string }) {
  return (
    <div role="region" aria-label={label ?? head.join(', ')} tabIndex={0} className="overflow-x-auto rounded-2xl border-2 border-ink bg-surface">
      <table className={`w-full border-collapse text-left text-[15px] leading-snug ${mono ? 'font-mono text-[14px]' : ''}`}>
        <thead>
          <tr className="bg-subtle">
            {head.map((h, i) => (
              <th key={h} scope="col" className={`border-b-2 border-ink px-3 py-2 font-sans text-[13px] font-bold whitespace-nowrap ${i === 0 ? 'sticky left-0 bg-subtle' : ''}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-t border-line first:border-t-0">
              {r.map((c, ci) =>
                ci === 0 ? (
                  <th key={ci} scope="row" className="sticky left-0 bg-surface px-3 py-2 font-semibold whitespace-nowrap">{c}</th>
                ) : (
                  <td key={ci} className="px-3 py-2 whitespace-nowrap">{c}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Bảng mười môi trường × sáu chiều (trang 40). Vế khó nhất tô nền nhạt, vế giữa (nửa động) chỉ có viền đứt;
 * chữ trong ô vẫn ghi rõ vế, màu không phải tín hiệu duy nhất.
 */
export function EnvTable() {
  const head = ['Môi trường', ...tableDims.map((d) => dims[d].head)]
  const rows = envRows.map((r) => [
    r.name,
    ...tableDims.map((d) => {
      const i = r.v[d]
      const last = dims[d].values.length - 1
      const tone = i === 0 ? 'border-transparent' : i === last ? 'border-transparent bg-violet-soft' : 'border-dashed border-violet'
      return <span key={d} className={`rounded-md border px-1.5 py-0.5 ${tone}`}>{dims[d].values[i]}</span>
    }),
  ])
  return <DataTable head={head} rows={rows} label="Mười môi trường xếp theo sáu chiều" />
}

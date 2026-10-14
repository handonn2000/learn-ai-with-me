import type { PeasRow } from '@/content/agents'

const letters: { key: keyof Omit<PeasRow, 'agent'>; letter: string; name: string }[] = [
  { key: 'p', letter: 'P', name: 'Thước đo' },
  { key: 'e', letter: 'E', name: 'Môi trường' },
  { key: 'a', letter: 'A', name: 'Bộ chấp hành' },
  { key: 's', letter: 'S', name: 'Cảm biến' },
]

/** Mô tả PEAS dạng thẻ: mỗi tác tử một thẻ, bốn dòng P/E/A/S. Màn hẹp: nhãn trên, nội dung dưới; rộng: hai cột. */
export function PeasCards({ rows }: { rows: PeasRow[] }) {
  return (
    // div + role thay cho ul/li: luật .prose-lesson (ngoài @layer) thắng utility của Tailwind và sẽ thêm chấm đầu dòng
    <div role="list" className={`grid gap-3 ${rows.length > 1 ? 'min-[720px]:grid-cols-2' : ''}`}>
      {rows.map((r) => (
        <div role="listitem" key={r.agent} className="rounded-2xl border-2 border-ink bg-surface p-4">
          <b className="text-[17px]">{r.agent}</b>
          <dl className="m-0 mt-2 flex flex-col gap-1.5 text-[15px] leading-snug">
            {letters.map((l) => (
              <div key={l.key} className="flex flex-col gap-0.5 min-[480px]:flex-row min-[480px]:gap-2.5">
                <dt className="shrink-0 whitespace-nowrap min-[480px]:w-[8rem]">
                  <span className="mr-1.5 inline-grid size-6 place-items-center rounded-md bg-ink font-mono text-[13px] font-bold text-white">{l.letter}</span>
                  <span className="text-[13px] text-muted">{l.name}</span>
                </dt>
                <dd className="m-0 min-w-0 pl-8 min-[480px]:pl-0">{r[l.key]}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}

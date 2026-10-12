import { useState } from 'react'
import { Button, Chip, NumberInput } from '@/ui'
import { PenIcon } from '@/ui/icons'
import { StepFrame } from '@/ui/StepFrame'
import type { PaperData } from '@/learning/types'

/**
 * Bước "làm trên giấy" (docs/design/screens/14). Chỉ nhập kết quả cuối, và kết quả này chưa được lưu:
 * in phiếu, ảnh trang giấy và sổ tay thuộc mốc 6.
 */
export function PaperStep({ data, onDone, onSkip }: { data: PaperData; onDone: () => void; onSkip?: () => void }) {
  const [result, setResult] = useState('')
  return (
    <StepFrame
      footer={
        <>
          <Button variant="link" onClick={onSkip ?? onDone}>
            Bỏ qua
          </Button>
          <Button onClick={onDone}>{result ? 'Kiểm tra' : 'Làm xong rồi'}</Button>
        </>
      }
    >
      <p className="m-0 flex flex-wrap items-center gap-2.5">
        <Chip tone="sun" icon={<PenIcon width={14} height={14} />} className="border-2 border-ink">Làm trên giấy</Chip>
        <span className="text-[15px] text-muted">khoảng {data.minutes} phút</span>
      </p>
      <h1 className="mt-3 mb-2 text-[28px] leading-tight font-extrabold tracking-[-0.02em]">{data.title}</h1>
      <p className="mt-0 mb-5 max-w-[56ch] text-muted">Tự tay làm lại một lượt, không nhìn bài. Chỗ nào kẹt thì chỗ đó là chỗ cần nhớ thêm.</p>
      <ol className="m-0 mb-6 flex max-w-[60ch] list-none flex-col gap-3 p-0">
        {data.steps.map((s, i) => (
          <li key={s} className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink font-mono text-sm font-bold text-white">{i + 1}</span>
            <span className="leading-snug">{s}</span>
          </li>
        ))}
      </ol>
      <div className="rounded-2xl bg-subtle p-4">
        <b className="text-[15px]">Kết quả trên giấy của bạn</b>
        <label className="mt-2 flex items-center justify-between gap-4">
          <span>{data.resultLabel} <span className="text-sm text-muted">(không bắt buộc)</span></span>
          <NumberInput unit={data.unit} value={result} onChange={(e) => setResult(e.target.value)} />
        </label>
      </div>
    </StepFrame>
  )
}

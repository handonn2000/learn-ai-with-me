import { useState } from 'react'
import { paperMock } from '@/content/mock/session'
import { Button, Chip, NumberInput } from '@/ui'
import { PenIcon } from '@/ui/icons'
import { StepFrame } from '@/ui/StepFrame'

/**
 * Bước "Hệ thống lại trên giấy" (docs/design/screens/14). Chỉ nhập kết quả cuối, và kết quả này chưa được lưu:
 * ảnh trang giấy và sổ tay thuộc mốc 6. Nội dung là dữ liệu mẫu.
 */
export function PaperStep({ onDone }: { onDone: () => void }) {
  const [result, setResult] = useState('')
  return (
    <StepFrame
      footer={
        <>
          <Button variant="link" onClick={onDone}>
            Bỏ qua
          </Button>
          <Button onClick={onDone}>{result ? 'Xong' : 'Làm xong rồi'}</Button>
        </>
      }
    >
      <Chip tone="ink" icon={<PenIcon width={14} height={14} />}>Làm trên giấy</Chip>
      <h1 className="mt-3 mb-2 text-[28px] leading-tight font-extrabold tracking-[-0.02em]">Hệ thống lại trên giấy</h1>
      <p className="mt-0 mb-6 max-w-[56ch] text-muted">Tự tay làm lại một lượt, không nhìn bài. Chỗ nào kẹt thì chỗ đó là chỗ cần nhớ thêm.</p>
      <ol className="m-0 mb-8 flex max-w-[60ch] list-none flex-col gap-3 p-0">
        {paperMock.steps.map((s, i) => (
          <li key={s} className="flex gap-3">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink font-mono text-sm font-bold text-white">{i + 1}</span>
            <span className="leading-snug">{s}</span>
          </li>
        ))}
      </ol>
      <label className="flex flex-col gap-2">
        <span className="text-[13px] text-muted">{paperMock.resultLabel} (không bắt buộc)</span>
        <NumberInput unit={paperMock.unit} value={result} onChange={(e) => setResult(e.target.value)} />
      </label>
    </StepFrame>
  )
}

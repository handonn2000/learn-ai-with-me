import { useState } from 'react'
import { guessMock } from '@/content/mock/session'
import { AnswerTile, Button, Chip, ConfidenceControl, FeedbackBar, type Confidence } from '@/ui'
import { StepFrame } from '@/ui/StepFrame'

/**
 * Bước "Đoán trước cho ga sau" (docs/design/screens/12, 12b). Nội dung là dữ liệu mẫu và chưa ghi vào tiến độ:
 * thống kê "Chắc chắn có đúng không" cần lịch sử độ chắc chắn, sẽ thêm khi có nội dung thật.
 */
export function GuessStep({ onDone }: { onDone: () => void }) {
  const [pick, setPick] = useState<number | null>(null)
  const [conf, setConf] = useState<Confidence>()
  const [checked, setChecked] = useState(false)
  const right = pick === guessMock.answer

  return (
    <StepFrame
      feedback={
        checked ? (
          <div className="mx-auto max-w-3xl px-4 pt-3 sm:px-6">
            {right ? (
              <FeedbackBar kind="correct" title="Đúng rồi.">{guessMock.right}</FeedbackBar>
            ) : (
              <FeedbackBar kind="wrong" title="Chưa đúng.">
                {conf === 'sure' ? guessMock.wrongSure : guessMock.wrong}
              </FeedbackBar>
            )}
          </div>
        ) : null
      }
      footer={
        checked ? (
          <>
            <span />
            <Button onClick={onDone}>Tiếp tục</Button>
          </>
        ) : (
          <>
            <Button variant="link" onClick={onDone}>
              Bỏ qua
            </Button>
            <Button disabled={pick === null || !conf} onClick={() => setChecked(true)}>
              Chốt đáp án
            </Button>
          </>
        )
      }
    >
      <Chip tone="sun">Đoán trước</Chip>
      <h1 className="mt-3 mb-2 text-[28px] leading-tight font-extrabold tracking-[-0.02em]">Đoán thử trước khi học ga sau</h1>
      <p className="mt-0 mb-6 max-w-[56ch] text-muted">Bạn chưa học phần này nên cứ đoán. Đoán sai cũng không sao: nó giúp bạn nhớ phần giải thích lâu hơn.</p>
      <p className="mb-4 max-w-[60ch] text-lg leading-snug font-semibold">{guessMock.prompt}</p>
      <div className="flex flex-col gap-3" role="group" aria-label="Các đáp án">
        {guessMock.options.map((o, i) => (
          <AnswerTile
            key={o}
            state={checked ? (i === guessMock.answer ? 'correct' : i === pick ? 'wrong' : 'locked') : i === pick ? 'selected' : 'default'}
            onClick={() => setPick(i)}
          >
            {o}
          </AnswerTile>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <span className="text-[13px] text-muted">Bạn chắc đến mức nào?</span>
        <ConfidenceControl value={conf} onChange={(v) => !checked && setConf(v)} />
      </div>
    </StepFrame>
  )
}

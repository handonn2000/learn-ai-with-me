import { useState } from 'react'
import { AnswerTile, Button, Chip, ConfidenceControl, FeedbackBar, type Confidence } from '@/ui'
import { StepFrame } from '@/ui/StepFrame'
import { GraphView, type NodeState } from '@/widgets/GraphView'
import type { GuessData } from '@/learning/types'

/**
 * Bước "đoán trước" (docs/design/screens/12, 12b): chưa học nên cứ đoán, chọn đáp án rồi chọn độ chắc chắn.
 * Chưa ghi vào tiến độ: thống kê "Chắc chắn có đúng không" cần lịch sử độ chắc chắn, sẽ thêm khi có nội dung thật.
 * `lesson` = trong bài học (câu hỏi làm tiêu đề); mặc định là bước "đoán trước cho ga sau" của buổi học.
 */
export function GuessStep({ data, onDone, lesson = false }: { data: GuessData; onDone: () => void; lesson?: boolean }) {
  const [pick, setPick] = useState<number | null>(null)
  const [conf, setConf] = useState<Confidence>()
  const [checked, setChecked] = useState(false)
  const right = pick === data.answer
  const fig = data.figure
  const states: Record<string, NodeState> = {}
  fig?.frontier?.forEach((id) => (states[id] = 'frontier'))
  if (fig?.current) states[fig.current] = 'current'

  return (
    <StepFrame
      feedback={
        checked ? (
          <div className="mx-auto max-w-[864px] px-4 pt-3">
            {right ? (
              <FeedbackBar kind="correct" title="Đúng rồi.">{data.right}</FeedbackBar>
            ) : conf === 'sure' ? (
              <FeedbackBar kind="wrong" title="Sai lúc đang rất chắc.">
                {data.wrongSure} {data.wrong}
              </FeedbackBar>
            ) : (
              <FeedbackBar kind="wrong" title="Chưa đúng.">{data.wrong}</FeedbackBar>
            )}
          </div>
        ) : null
      }
      footer={
        checked ? (
          <>
            <span />
            <Button onClick={onDone}>{lesson ? 'Xem bài giải thích' : 'Tiếp tục'}</Button>
          </>
        ) : (
          <>
            <Button variant="link" onClick={onDone}>
              Bỏ qua
            </Button>
            <Button disabled={pick === null || !conf} onClick={() => setChecked(true)}>
              Chốt câu trả lời
            </Button>
          </>
        )
      }
    >
      <p className="m-0 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <Chip tone="sun">Đoán trước</Chip>
        <span className="text-sm text-muted">Chưa học phần này. Cứ đoán, sai cũng được.</span>
      </p>
      {lesson ? (
        <h1 className="mt-4 mb-5 max-w-[34ch] text-[28px] leading-[1.15] font-extrabold tracking-[-0.02em]">{data.prompt}</h1>
      ) : (
        <>
          <h1 className="mt-3 mb-2 text-[28px] leading-tight font-extrabold tracking-[-0.02em]">Đoán thử trước khi học ga sau</h1>
          <p className="mt-0 mb-5 max-w-[60ch] text-lg leading-snug font-semibold">{data.prompt}</p>
        </>
      )}
      {fig && (
        <div className="mb-5 rounded-2xl bg-subtle p-3">
          <GraphView problem={fig.problem} showCosts states={states} notes={fig.notes} label="Bản đồ của câu hỏi" />
        </div>
      )}
      <div className="grid gap-3 min-[720px]:grid-cols-2" role="group" aria-label="Các đáp án">
        {data.options.map((o, i) => (
          <AnswerTile
            key={o.title}
            className="flex-col items-start gap-0.5"
            state={checked ? (i === data.answer ? 'correct' : i === pick ? 'wrong' : 'locked') : i === pick ? 'selected' : 'default'}
            onClick={() => setPick(i)}
          >
            <span className="flex items-center gap-2 text-lg">{o.title}</span>
            {o.note && <span className="text-sm font-normal text-muted">{o.note}</span>}
          </AnswerTile>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-start gap-2">
        <span className="font-bold">Bạn chắc tới đâu?</span>
        <ConfidenceControl value={conf} onChange={(v) => !checked && setConf(v)} />
      </div>
    </StepFrame>
  )
}

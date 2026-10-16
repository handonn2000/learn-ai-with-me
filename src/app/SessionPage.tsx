import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { MAX_REVIEW } from '@/learning/session'
import { ButtonLink, SessionHeader } from '@/ui'
import { LessonPlayer } from './LessonPage'
import { ReviewRun } from './ReviewPage'
import { GuessStep } from './lesson/GuessStep'
import { PaperStep } from './lesson/PaperStep'
import { useTodayPlan } from './useTodayPlan'

/**
 * Trình chạy buổi học hôm nay: nối ôn → ga mới → đoán trước → giấy.
 * Kế hoạch chốt lúc mở trang, vì ghi kết quả làm tuyến và danh sách đến hạn đổi giữa chừng.
 */
export function SessionPage() {
  const live = useTodayPlan()
  const [plan] = useState(live)
  const navigate = useNavigate()
  const [i, setI] = useState(0)
  const total = plan.segments.length
  const seg = plan.segments[i]
  const exit = () => navigate('/')
  // Phần đã xong của bước đang chạy (0–1), để đoạn của bước đó trên thanh lấp dần
  const [part, setPart] = useState(0)
  const next = () => {
    setPart(0)
    setI((n) => n + 1)
  }
  const onProgress = useCallback((f: number) => setPart(f), [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [i])

  return (
    <div className="min-h-dvh">
      <div className="sticky top-0 z-40 bg-bg/95 backdrop-blur">
        <div className="mx-auto max-w-[864px] px-4 py-2.5">
          <SessionHeader segmented current={Math.min(i + 1, total)} done={seg ? i + part : total} total={total} onClose={exit} />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {seg ? `Bước ${i + 1} trên ${total}: ${seg.title}` : 'Xong buổi học'}
      </p>

      {total === 0 && <Finish title="Hôm nay không có gì phải học." text="Không có kỹ năng nào đến hạn và bạn đã tới ga cuối của tuyến." />}
      {total > 0 && !seg && <Finish title="Xong buổi học." text={`Bạn đã đi hết ${total} bước. Kỹ năng nào cần ôn lại sẽ quay lại đúng hạn.`} />}
      {seg?.kind === 'review' && <ReviewRun key={i} queue={plan.due.slice(0, MAX_REVIEW)} onFinish={next} onProgress={onProgress} />}
      {seg?.kind === 'lesson' && plan.lesson && <LessonPlayer key={i} lesson={plan.lesson} embedded={{ onExit: exit, onComplete: next, onProgress }} />}
      {seg?.kind === 'guess' && plan.guess && <GuessStep key={i} data={plan.guess} onDone={next} />}
      {seg?.kind === 'paper' && plan.paper && <PaperStep key={i} data={plan.paper} onDone={next} />}
    </div>
  )
}

function Finish({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
      <h1 className="m-0 text-[34px] leading-tight font-extrabold tracking-[-0.03em]">{title}</h1>
      <p className="mt-3 max-w-[56ch] text-lg text-muted">{text}</p>
      <ButtonLink to="/" className="mt-8">
        Về Hôm nay
      </ButtonLink>
    </div>
  )
}

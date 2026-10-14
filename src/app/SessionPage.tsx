import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { MAX_REVIEW } from '@/learning/session'
import { ButtonLink, SessionHeader } from '@/ui'
import { LessonPlayer } from './LessonPage'
import { ReviewRun } from './ReviewPage'
import { GuessStep } from './lesson/GuessStep'
import { PaperStep } from './lesson/PaperStep'
import { useTodayPlan } from './useTodayPlan'

/** Chiều cao thanh buổi học (nút 44px + đệm 8px hai đầu). Thanh của bài học dính ngay dưới nó. */
const HEADER_H = 60

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
  const next = () => setI((n) => n + 1)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [i])

  return (
    <div className="min-h-dvh">
      <div className="sticky top-0 z-40 bg-bg/95 backdrop-blur" style={{ height: HEADER_H }}>
        <div className="mx-auto flex h-full max-w-3xl items-center px-4 sm:px-6">
          <SessionHeader className="w-full" current={Math.min(i + 1, total)} done={i} total={total} onClose={exit} />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {seg ? `Bước ${i + 1} trên ${total}: ${seg.title}` : 'Xong buổi học'}
      </p>

      {total === 0 && <Finish title="Hôm nay không có gì phải học." text="Không có kỹ năng nào đến hạn và bạn đã tới ga cuối của tuyến." />}
      {total > 0 && !seg && <Finish title="Xong buổi học." text={`Bạn đã đi hết ${total} bước. Kỹ năng nào cần ôn lại sẽ quay lại đúng hạn.`} />}
      {seg?.kind === 'review' && <ReviewRun key={i} queue={plan.due.slice(0, MAX_REVIEW)} onFinish={next} />}
      {seg?.kind === 'lesson' && plan.lesson && <LessonPlayer key={i} lesson={plan.lesson} embedded={{ onExit: exit, onComplete: next, stickyTop: HEADER_H }} />}
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

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Rating, type Grade } from 'ts-fsrs'
import { lessons } from '@/content/lessons'
import { recalls, type Recall } from '@/content/recall'
import { skillIndex } from '@/content/skills'
import { useDue } from '@/learning/hooks'
import { MAX_REVIEW } from '@/learning/session'
import { previewDays, retrievability, useProgress, type Outcome } from '@/learning/progress'
import type { Exercise } from '@/exercises/types'
import { ExerciseView } from '@/exercises/ExerciseView'
import { Button } from '@/ui/Button'
import { Chip } from '@/ui/Chip'
import { CheckIcon } from '@/ui/icons'
import { Rich } from '@/ui/Rich'
import { SessionHeader } from '@/ui/SessionHeader'
import { StepFrame } from '@/ui/StepFrame'

type Item = { id: string; kind: 'exercise'; ex: Exercise } | { id: string; kind: 'recall'; data: Recall }

const kindLabel: Record<Exercise['kind'], string> = {
  choice: 'chọn đáp án',
  number: 'điền số',
  trace: 'bản đồ',
  'pick-nodes': 'chọn nút',
  order: 'xếp thứ tự',
  classify: 'phân loại',
}

/** Câu ôn cho một kỹ năng: xoay vòng giữa câu kiểm tra và bài tập của lesson; kỹ năng có câu nhớ lại thì xen kẽ. */
function pickItem(skillId: string, reps: number): Item {
  const sk = skillIndex[skillId]
  const recall = recalls[skillId]
  if (recall && reps % 2 === 1) return { id: skillId, kind: 'recall', data: recall }
  const pool: Exercise[] = [
    ...sk.checks,
    ...(sk.lesson ? lessons[sk.lesson].steps.flatMap((s) => (s.kind === 'exercise' ? [s.exercise] : [])) : []),
  ]
  return { id: skillId, kind: 'exercise', ex: pool[reps % pool.length] }
}

export function ReviewPage() {
  const due = useDue()
  // Chốt danh sách lúc mở trang để không nhảy khi vừa ghi kết quả
  const [queue] = useState(() => due.slice(0, MAX_REVIEW))
  return <ReviewRun queue={queue} />
}

/**
 * Chạy một loạt câu ôn (docs/design/screens/20). Có `onFinish` thì đang nhúng trong buổi học:
 * không có thanh đầu trang và thanh bên (tiến độ 0–1 báo qua `onProgress`), và màn kết thúc là nút "Tiếp tục".
 */
export function ReviewRun({ queue, onFinish, onProgress }: { queue: string[]; onFinish?: () => void; onProgress?: (fraction: number) => void }) {
  const skills = useProgress((s) => s.skills)
  const items = useMemo(() => queue.map((id) => pickItem(id, skills[id]?.card.reps ?? 0)), [queue]) // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0)
  const [results, setResults] = useState<Outcome[]>([])
  const record = useProgress((s) => s.record)
  const recordRating = useProgress((s) => s.recordRating)
  const navigate = useNavigate()
  const embedded = !!onFinish
  useEffect(() => onProgress?.(items.length > 0 ? Math.min(1, i / items.length) : 1), [onProgress, i, items.length])
  const close = () => navigate('/')
  const head = !embedded && <div className="mx-auto max-w-[1184px] px-4 py-2.5"><SessionHeader label="Ôn tập" current={Math.min(i + 1, items.length)} total={Math.max(items.length, 1)} done={i} onClose={close} showCount={items.length > 0 && i < items.length} /></div>

  if (queue.length === 0) {
    const upcoming = Object.entries(skills).sort(([, a], [, b]) => +new Date(a.card.due) - +new Date(b.card.due))[0]
    return (
      <div className="min-h-dvh">
        {head}
        <div className="mx-auto max-w-[720px] px-4 pt-8">
          <div className="rounded-3xl border-2 border-ink bg-surface p-6 shadow-block-lg">
            <h1 className="m-0 text-[32px] leading-tight font-extrabold tracking-[-0.03em]">Không có gì đến hạn.</h1>
            <p className="mt-3 mb-6 max-w-[52ch] text-lg text-muted">
              {upcoming
                ? `Kỹ năng gần đến hạn nhất là "${skillIndex[upcoming[0]].title}", vào ${new Date(upcoming[1].card.due).toLocaleDateString('vi-VN')}.`
                : 'Học xong một ga, kỹ năng đó sẽ được xếp lịch ôn ở đây.'}
            </p>
            <Button onClick={close}>Về Hôm nay</Button>
          </div>
        </div>
      </div>
    )
  }

  if (i >= items.length) {
    const ok = results.filter((r) => r === 'clean').length
    return (
      <div className={embedded ? '' : 'min-h-dvh'}>
        {head}
        <div className="mx-auto max-w-[720px] px-4 pt-8">
          <div className="rounded-3xl border-2 border-ink bg-surface p-6 shadow-block-lg">
            <Chip tone="sun" className="border-2 border-ink">Hôm nay ôn {results.length} câu</Chip>
            <h1 className="mt-3 mb-0 text-[32px] leading-tight font-extrabold tracking-[-0.03em]">Ôn xong.</h1>
            <p className="mt-3 mb-6 max-w-[52ch] text-lg text-muted">
              {ok}/{results.length} câu tự làm đúng. Câu nào cần trợ giúp sẽ quay lại sớm hơn.
            </p>
            {embedded ? <Button onClick={onFinish}>Tiếp tục</Button> : <Button onClick={close}>Về Hôm nay</Button>}
          </div>
        </div>
      </div>
    )
  }

  const item = items[i]
  const onRated = (o: Outcome) => {
    setResults((r) => [...r, o])
    setI(i + 1)
  }
  const main =
    item.kind === 'recall' ? (
      <RecallCard
        key={item.id + i}
        id={item.id}
        data={item.data}
        last={i === items.length - 1}
        onRate={(g, o) => {
          recordRating(item.id, g)
          onRated(o)
        }}
      />
    ) : (
      <ExerciseView
        key={item.ex.id + i}
        exercise={item.ex}
        eyebrow="Ôn tập"
        caption={memoryCaption(item.id)}
        doneLabel={i === items.length - 1 ? 'Xong' : 'Câu tiếp'}
        onDone={(o) => {
          record(item.id, o, 'lesson')
          onRated(o)
        }}
      />
    )

  return (
    <div className={embedded ? '' : 'min-h-dvh'}>
      {head}
      <div className={embedded ? '' : 'mx-auto grid max-w-[1184px] gap-4 px-0 min-[900px]:grid-cols-[250px_1fr] min-[900px]:px-4'}>
        {!embedded && (
          <aside aria-label="Các câu hôm nay" className="mt-4 hidden h-fit rounded-3xl bg-surface p-4 min-[900px]:block">
            <h2 className="m-0 text-base font-bold">Hôm nay ôn {items.length} câu</h2>
            <p className="mt-1.5 mb-3 text-sm text-muted">Trộn nhiều kỹ năng, để bạn tự nhận ra lúc nào dùng cách nào.</p>
            <ol className="m-0 flex list-none flex-col gap-1 p-0">
              {items.map((it, k) => {
                const state = k < i ? 'done' : k === i ? 'now' : 'todo'
                return (
                  <li key={it.id} aria-current={state === 'now' ? 'step' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${state === 'now' ? 'border-2 border-ink bg-sun-soft' : ''}`}>
                    <span aria-hidden className="grid size-5 flex-none place-items-center">
                      {state === 'done' ? <CheckIcon width={18} height={18} className="text-correct" /> : <span className={`size-4 rounded-full border-2 ${state === 'now' ? 'border-ink bg-sun' : 'border-disabled-line'}`} />}
                    </span>
                    <span className="leading-tight">
                      <span className={`block text-[15px] ${state === 'now' ? 'font-bold' : ''}`}>{skillIndex[it.id].title}</span>
                      <span className="text-xs text-muted">{it.kind === 'recall' ? 'nhớ lại, không nhìn' : kindLabel[it.ex.kind]}</span>
                    </span>
                  </li>
                )
              })}
            </ol>
          </aside>
        )}
        <div className="min-w-0">{main}</div>
      </div>
    </div>
  )
}

function memoryCaption(id: string) {
  const rec = useProgress.getState().skills[id]
  const m = rec ? Math.round(retrievability(rec) * 100) : null
  return `${skillIndex[id].title}${m != null ? ` · nhớ ${m}%` : ''}`
}

const ratings: { g: Grade; label: string; key: 'again' | 'hard' | 'good' | 'easy'; outcome: Outcome }[] = [
  { g: Rating.Again, label: 'Quên', key: 'again', outcome: 'revealed' },
  { g: Rating.Hard, label: 'Khó', key: 'hard', outcome: 'hinted' },
  { g: Rating.Good, label: 'Được', key: 'good', outcome: 'clean' },
  { g: Rating.Easy, label: 'Dễ', key: 'easy', outcome: 'clean' },
]

/** Nhớ lại tự do: viết ra, xem đáp án, tự đánh dấu ý đã viết; app chỉ gợi ý mức chấm, người học quyết định. */
function RecallCard({ id, data, last, onRate }: { id: string; data: Recall; last: boolean; onRate: (g: Grade, o: Outcome) => void }) {
  const [text, setText] = useState('')
  const [shown, setShown] = useState(false)
  const [have, setHave] = useState<Set<number>>(new Set())
  const rec = useProgress((s) => s.skills[id])
  const days = useMemo(() => previewDays(rec), [rec])
  const n = data.points.length
  const suggested = have.size === 0 ? 'again' : have.size < n ? 'hard' : 'good'
  const suggestedLabel = ratings.find((r) => r.key === suggested)!.label
  const mem = rec ? Math.round(retrievability(rec) * 100) : null
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <StepFrame
      feedback={null}
      footer={
        shown ? (
          <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <span className="min-w-0 leading-tight">
              <b className="block text-[17px]">Bạn nhớ được {have.size} / {n} ý</b>
              <span className="text-sm text-muted">Gợi ý chọn <b className="text-ink">{suggestedLabel}</b>. Bạn tự chấm, app chỉ đề xuất.</span>
            </span>
            <div role="group" aria-label="Tự chấm" className="grid grid-cols-4 gap-2 max-[720px]:w-full min-[721px]:w-[420px]">
              {ratings.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => { setPicked(r.key); onRate(r.g, r.outcome) }}
                  className={`flex min-h-14 flex-col items-center justify-center rounded-2xl border-2 border-ink px-2 py-1.5 shadow-block active:translate-y-[5px] active:shadow-none ${r.key === suggested ? 'bg-sun' : 'bg-surface'}`}
                >
                  <b className="text-base">{r.label}</b>
                  <span className="font-mono text-[11px]">{days[r.key]} ngày</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <span className="text-sm text-muted">{last ? 'Câu cuối.' : 'Viết xong thì xem đáp án.'}</span>
            <Button onClick={() => setShown(true)}>Xem đáp án</Button>
          </>
        )
      }
    >
      <p className="m-0 mb-3 flex flex-wrap items-center gap-2.5">
        <Chip tone="sun" className="border-2 border-ink">Nhớ lại, không nhìn</Chip>
        <span className="text-[15px] text-muted">{skillIndex[id].title}{mem != null && ` · nhớ ${mem}%`}</span>
      </p>
      <h1 className="m-0 mb-5 text-[26px] leading-[1.15] font-extrabold tracking-[-0.02em]">{data.prompt}</h1>
      <div className="grid gap-5 min-[720px]:grid-cols-2">
        <label className="flex flex-col gap-2">
          <b className="text-[13px] text-muted">Bạn viết</b>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            readOnly={shown}
            rows={6}
            className="min-h-[190px] resize-none rounded-2xl border-2 border-line bg-paper p-4 font-hand text-[17px] leading-relaxed text-[#2c3a9c] outline-none focus-visible:border-violet"
          />
          <span className="text-[13px] text-muted">Viết trên giấy cũng được, gõ chỉ để so cho tiện.</span>
        </label>
        <div className="flex flex-col gap-2">
          <b className="text-[13px] text-muted">Đáp án. Bạn có viết ý này không?</b>
          {shown ? (
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {data.points.map((pt, k) => {
                const on = have.has(k)
                return (
                  <li key={k}>
                    <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 ${on ? 'border-correct bg-correct-soft' : 'border-line bg-surface'}`}>
                      <input type="checkbox" checked={on} onChange={() => setHave((s) => { const x = new Set(s); if (x.has(k)) x.delete(k); else x.add(k); return x })} className="mt-0.5 size-5 shrink-0 accent-correct" />
                      <span className="leading-snug"><b>{k + 1}.</b> <Rich html={pt} /></span>
                    </label>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="m-0 rounded-2xl border-2 border-dashed border-disabled-line p-4 text-[15px] text-muted">Đáp án sẽ hiện sau khi bạn bấm “Xem đáp án”. Viết ra trước thì nhớ lâu hơn.</p>
          )}
        </div>
      </div>
    </StepFrame>
  )
}

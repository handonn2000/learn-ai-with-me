import { useMemo, useState } from 'react'
import { lessons } from '@/content/lessons'
import { skillIndex } from '@/content/skills'
import { useDue } from '@/learning/hooks'
import { useProgress, type Outcome } from '@/learning/progress'
import type { Exercise } from '@/exercises/types'
import { ExerciseView } from '@/exercises/ExerciseView'
import { ButtonLink } from '@/ui/Button'
import { RouteBar } from '@/ui/RouteBar'

const MAX = 5

/** Câu ôn cho một kỹ năng: xoay vòng giữa câu kiểm tra và bài tập của lesson. */
function pickExercise(skillId: string, reps: number): Exercise {
  const sk = skillIndex[skillId]
  const pool: Exercise[] = [
    ...sk.checks,
    ...(sk.lesson ? lessons[sk.lesson].steps.flatMap((s) => (s.kind === 'exercise' ? [s.exercise] : [])) : []),
  ]
  return pool[reps % pool.length]
}

export function ReviewPage() {
  const due = useDue()
  const skills = useProgress((s) => s.skills)
  // Chốt danh sách lúc mở trang để không nhảy khi vừa ghi kết quả
  const [queue] = useState(() => due.slice(0, MAX))
  const items = useMemo(() => queue.map((id) => ({ id, ex: pickExercise(id, skills[id]?.card.reps ?? 0) })), [queue]) // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0)
  const [results, setResults] = useState<Outcome[]>([])
  const record = useProgress((s) => s.record)

  if (queue.length === 0) {
    const upcoming = Object.entries(skills).sort(([, a], [, b]) => +new Date(a.card.due) - +new Date(b.card.due))[0]
    return (
      <div className="pt-12">
        <h1 className="text-[34px] font-bold tracking-tight">Không có gì đến hạn.</h1>
        <p className="mt-3 max-w-[56ch] text-lg text-muted">
          {upcoming
            ? `Kỹ năng gần đến hạn nhất là "${skillIndex[upcoming[0]].title}", vào ${new Date(upcoming[1].card.due).toLocaleDateString('vi-VN')}.`
            : 'Học xong một ga, kỹ năng đó sẽ được xếp lịch ôn ở đây.'}
        </p>
        <ButtonLink to="/" className="mt-8">
          Về trang chính
        </ButtonLink>
      </div>
    )
  }

  if (i >= items.length) {
    const ok = results.filter((r) => r === 'clean').length
    return (
      <div className="pt-12">
        <h1 className="text-[34px] font-bold tracking-tight">Ôn xong.</h1>
        <p className="mt-3 max-w-[56ch] text-lg text-muted">
          {ok}/{results.length} câu tự làm đúng. Câu nào cần trợ giúp sẽ quay lại sớm hơn.
        </p>
        <ButtonLink to="/" className="mt-8">
          Về trang chính
        </ButtonLink>
      </div>
    )
  }

  const item = items[i]
  return (
    <div className="-mx-4 sm:-mx-6">
      <div className="mx-auto max-w-3xl px-4 pt-2 sm:px-6">
        <RouteBar
          stations={items.map((_, k) => ({ kind: 'exercise', state: k < i ? 'done' : k === i ? 'current' : 'todo', label: `Câu ${k + 1}` }))}
        />
      </div>
      <ExerciseView
        key={item.ex.id + i}
        exercise={item.ex}
        eyebrow={`Ôn: ${skillIndex[item.id].title}`}
        doneLabel={i === items.length - 1 ? 'Xong' : 'Câu tiếp'}
        onDone={(o) => {
          record(item.id, o, 'lesson')
          setResults((r) => [...r, o])
          setI(i + 1)
        }}
      />
    </div>
  )
}

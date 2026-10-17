import { useMemo } from 'react'
import { skillIndex } from '@/content/skills'
import { lessons } from '@/content/lessons'
import { guessMock, paperMock } from '@/content/mock/session'
import { todayMock } from '@/content/mock/today'
import { useDue, useFollowedGoalId, useGoalRoute } from '@/learning/hooks'
import { useProgress } from '@/learning/progress'
import { buildPlan } from '@/learning/session'
import type { GuessData, Lesson, PaperData, RelateData, ReorganizeData } from '@/learning/types'

/** Bước đoán trước của buổi học: đoán một đáp án, hoặc đoán quan hệ (cần id lesson để lưu bản đoán). */
export type SessionGuess = { kind: 'guess'; data: GuessData } | { kind: 'relate'; lessonId: string; data: RelateData }
/** Bước giấy cuối buổi: bước `paper` của lesson; lesson không có thì dùng phần hệ thống lại của nó. */
export type SessionPaper = { kind: 'paper'; data: PaperData } | { kind: 'reorganize'; lesson: Lesson; data: ReorganizeData }

/**
 * Bước đoán trước của lesson; `undefined` nếu lesson không có. Đoán quan hệ đã làm rồi thì `null`
 * (không đoán lại, và cũng không thay bằng dữ liệu mẫu): đầu lesson sẽ hiện bản đoán đó.
 */
function guessOf(l: Lesson | null, guessed: Record<string, unknown>): SessionGuess | null | undefined {
  for (const s of l?.steps ?? []) {
    if (s.kind === 'guess') return { kind: 'guess', data: s.data }
    if (s.kind === 'relate' && l) return guessed[l.id] ? null : { kind: 'relate', lessonId: l.id, data: s.data }
  }
  return undefined
}
const paperOf = (l: Lesson | null): PaperData | null => l?.steps.flatMap((s) => (s.kind === 'paper' ? [s.data] : []))[0] ?? null
function paperStepOf(l: Lesson | null): SessionPaper | null {
  const p = paperOf(l)
  if (p) return { kind: 'paper', data: p }
  return l?.reorganize ? { kind: 'reorganize', lesson: l, data: l.reorganize } : null
}

/** Buổi học hôm nay, tính từ tiến độ hiện tại. Dùng chung cho màn Hôm nay và trình chạy buổi học. */
export function useTodayPlan() {
  const goalId = useFollowedGoalId()
  const route = useGoalRoute(goalId)
  const due = useDue()
  const guessed = useProgress((s) => s.guesses)
  return useMemo(() => {
    const next = route.nextId ? skillIndex[route.nextId] : null
    const lesson = next?.lesson ? lessons[next.lesson] : null
    const after = route.stations.find((s) => s.status === 'new' && !s.next)
    const afterLesson = after && skillIndex[after.id].lesson ? lessons[skillIndex[after.id].lesson!] : null
    // Đoán trước lấy từ ga sau, giấy lấy từ ga hôm nay. Tuyến A* chưa có đủ hai bước này cho mọi ga
    // nên còn dùng dữ liệu mẫu của ga UCS (content/mock/session.ts); tuyến khác thiếu thì bỏ bước đó.
    const fallback = goalId === 'astar'
    const own = guessOf(afterLesson, guessed)
    const guess: SessionGuess | null = own === undefined ? (fallback ? { kind: 'guess', data: guessMock } : null) : own
    const paper = paperStepOf(lesson) ?? (fallback ? { kind: 'paper', data: paperMock } : null)
    const segments = buildPlan({
      dueCount: due.length,
      newStation: next && lesson ? { title: next.title, minutes: lesson.minutes } : null,
      hasAfter: !!after && !!guess,
      guessMinutes: todayMock.guessMinutes,
      paperMinutes: paper?.data.minutes ?? todayMock.paperMinutes,
      hasPaper: !!paper,
    })
    return { goalId, ...route, due, next, lesson, guess, paper, segments, totalMinutes: segments.reduce((n, s) => n + s.minutes, 0) }
  }, [goalId, route, due, guessed])
}

import { useMemo } from 'react'
import { skillIndex } from '@/content/skills'
import { lessons } from '@/content/lessons'
import { guessMock, paperMock } from '@/content/mock/session'
import { todayMock } from '@/content/mock/today'
import { useDue, useFollowedGoalId, useGoalRoute } from '@/learning/hooks'
import { buildPlan } from '@/learning/session'
import type { GuessData, Lesson, PaperData } from '@/learning/types'

const guessOf = (l: Lesson | null): GuessData | null => l?.steps.flatMap((s) => (s.kind === 'guess' ? [s.data] : []))[0] ?? null
const paperOf = (l: Lesson | null): PaperData | null => l?.steps.flatMap((s) => (s.kind === 'paper' ? [s.data] : []))[0] ?? null

/** Buổi học hôm nay, tính từ tiến độ hiện tại. Dùng chung cho màn Hôm nay và trình chạy buổi học. */
export function useTodayPlan() {
  const goalId = useFollowedGoalId()
  const route = useGoalRoute(goalId)
  const due = useDue()
  return useMemo(() => {
    const next = route.nextId ? skillIndex[route.nextId] : null
    const lesson = next?.lesson ? lessons[next.lesson] : null
    const after = route.stations.find((s) => s.status === 'new' && !s.next)
    const afterLesson = after && skillIndex[after.id].lesson ? lessons[skillIndex[after.id].lesson!] : null
    // Đoán trước lấy từ ga sau, giấy lấy từ ga hôm nay. Tuyến A* chưa có đủ hai bước này cho mọi ga
    // nên còn dùng dữ liệu mẫu của ga UCS (content/mock/session.ts); tuyến khác thiếu thì bỏ bước đó.
    const fallback = goalId === 'astar'
    const guess = guessOf(afterLesson) ?? (fallback ? guessMock : null)
    const paper = paperOf(lesson) ?? (fallback ? paperMock : null)
    const segments = buildPlan({
      dueCount: due.length,
      newStation: next && lesson ? { title: next.title, minutes: lesson.minutes } : null,
      hasAfter: !!after && !!guess,
      guessMinutes: todayMock.guessMinutes,
      paperMinutes: paper?.minutes ?? todayMock.paperMinutes,
      hasPaper: !!paper,
    })
    return { goalId, ...route, due, next, lesson, guess, paper, segments, totalMinutes: segments.reduce((n, s) => n + s.minutes, 0) }
  }, [goalId, route, due])
}

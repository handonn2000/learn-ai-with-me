import { useMemo } from 'react'
import { goals, skillIndex } from '@/content/skills'
import { lessons } from '@/content/lessons'
import { todayMock } from '@/content/mock/today'
import { useDue, useGoalRoute } from '@/learning/hooks'
import { buildPlan } from '@/learning/session'

/** Buổi học hôm nay, tính từ tiến độ hiện tại. Dùng chung cho màn Hôm nay và trình chạy buổi học. */
export function useTodayPlan() {
  const goalId = goals[0].id
  const route = useGoalRoute(goalId)
  const due = useDue()
  return useMemo(() => {
    const next = route.nextId ? skillIndex[route.nextId] : null
    const lesson = next?.lesson ? lessons[next.lesson] : null
    const hasAfter = route.stations.some((s) => s.status === 'new' && !s.next)
    const segments = buildPlan({
      dueCount: due.length,
      newStation: next && lesson ? { title: next.title, minutes: lesson.minutes } : null,
      hasAfter,
      guessMinutes: todayMock.guessMinutes,
      paperMinutes: todayMock.paperMinutes,
    })
    return { goalId, ...route, due, next, lesson, segments, totalMinutes: segments.reduce((n, s) => n + s.minutes, 0) }
  }, [goalId, route, due])
}

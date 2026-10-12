import { useMemo } from 'react'
import { goals } from '@/content/skills'
import type { Course } from '@/content/courses'
import { useGoalRoute } from '@/learning/hooks'
import { resolveGoal } from '@/learning/courses'

/** Tiến độ từng mục tiêu của khóa: "Hiểu A*" lấy từ tiến độ thật, các mục tiêu khác là số mẫu. */
export function useCourseProgress(course: Course) {
  const { done, total } = useGoalRoute(goals[0].id)
  return useMemo(() => {
    const followedId = course.goals.find((g) => g.goalId)?.id ?? null
    return course.goals.map((g) => resolveGoal(g, followedId, { done, total }))
  }, [course, done, total])
}

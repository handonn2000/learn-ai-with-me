import { useMemo } from 'react'
import { goalIndex } from '@/content/skills'
import type { Course } from '@/content/courses'
import { GOAL_SKETCHES, sketchTitles } from '@/content/mock/sketches'
import { routeOf, useFollowedGoalId } from '@/learning/hooks'
import { resolveGoal, type RealProgress } from '@/learning/courses'
import { useProgress, type SkillRecord } from '@/learning/progress'

/** Số ga và số sketch thật của một mục tiêu có dữ liệu (sketch mở khi qua ga, cộng sketch riêng của mục tiêu). */
export function realProgress(goalId: string, records: Record<string, SkillRecord>): RealProgress {
  const r = routeOf(goalId, records)
  const titles = r.stations.map((s) => sketchTitles[s.id] ?? [])
  return {
    done: r.done,
    total: r.total,
    sketches: titles.reduce((n, t) => n + t.length, 0) + GOAL_SKETCHES,
    sketchesOpen: r.stations.reduce((n, s, i) => n + (s.status !== 'new' ? titles[i].length : 0), 0),
  }
}

/** Tiến độ từng mục tiêu của khóa: mục tiêu có `goalId` lấy từ tiến độ thật, các mục tiêu khác là số mẫu. */
export function useCourseProgress(course: Course) {
  const records = useProgress((s) => s.skills)
  const followed = useFollowedGoalId()
  return useMemo(() => {
    const followedId = course.goals.find((g) => g.goalId === followed)?.id ?? null
    return course.goals.map((g) => resolveGoal(g, followedId, g.goalId && goalIndex[g.goalId] ? realProgress(g.goalId, records) : undefined))
  }, [course, records, followed])
}

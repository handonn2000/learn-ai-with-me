import { useMemo } from 'react'
import { goalIndex, goals, skillIndex } from '@/content/skills'
import { learningPath } from './graph'
import { pickFollowed } from './goals'
import { dueSkills, statusOf, useProgress, type SkillRecord, type SkillStatus } from './progress'
import type { SkillId } from './types'

export interface Station {
  id: SkillId
  status: SkillStatus
  /** Ga tiếp theo người học nên làm trên tuyến này. */
  next: boolean
}

/** Tuyến của một mục tiêu: toàn bộ nút dưới đích theo thứ tự học, kèm trạng thái. */
export function routeOf(goalId: string, records: Record<SkillId, SkillRecord>, now = new Date()) {
  const goal = goalIndex[goalId]
  const ids = learningPath(skillIndex, goal.target)
  let nextSet = false
  const stations: Station[] = ids.map((id) => {
    const status = statusOf(records[id], now)
    const next = !nextSet && status === 'new'
    if (next) nextSet = true
    return { id, status, next }
  })
  const done = stations.filter((s) => s.status !== 'new').length
  return { goal, stations, done, total: stations.length, nextId: stations.find((s) => s.next)?.id ?? null }
}

export function useGoalRoute(goalId: string) {
  const skills = useProgress((s) => s.skills)
  return useMemo(() => routeOf(goalId, skills), [goalId, skills])
}

/** Id mục tiêu đang theo (xem `pickFollowed`). */
export function useFollowedGoalId() {
  const skills = useProgress((s) => s.skills)
  const follow = useProgress((s) => s.follow)
  return useMemo(() => pickFollowed(goals, skillIndex, follow, (id) => statusOf(skills[id]) !== 'new').id, [skills, follow])
}

export function useDue() {
  const skills = useProgress((s) => s.skills)
  return useMemo(() => dueSkills(skills), [skills])
}

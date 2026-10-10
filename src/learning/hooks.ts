import { useMemo } from 'react'
import { goalIndex, skillIndex } from '@/content/skills'
import { learningPath } from './graph'
import { dueSkills, statusOf, useProgress, type SkillStatus } from './progress'
import type { SkillId } from './types'

export interface Station {
  id: SkillId
  status: SkillStatus
  /** Ga tiếp theo người học nên làm trên tuyến này. */
  next: boolean
}

/** Tuyến của một mục tiêu: toàn bộ nút dưới đích theo thứ tự học, kèm trạng thái. */
export function useGoalRoute(goalId: string) {
  const skills = useProgress((s) => s.skills)
  return useMemo(() => {
    const goal = goalIndex[goalId]
    const ids = learningPath(skillIndex, goal.target)
    const now = new Date()
    let nextSet = false
    const stations: Station[] = ids.map((id) => {
      const status = statusOf(skills[id], now)
      const next = !nextSet && status === 'new'
      if (next) nextSet = true
      return { id, status, next }
    })
    const done = stations.filter((s) => s.status !== 'new').length
    return { goal, stations, done, total: stations.length, nextId: stations.find((s) => s.next)?.id ?? null }
  }, [goalId, skills])
}

export function useDue() {
  const skills = useProgress((s) => s.skills)
  return useMemo(() => dueSkills(skills), [skills])
}

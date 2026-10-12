import { useMemo } from 'react'
import { goalIndex, skillIndex } from '@/content/skills'
import { lessons } from '@/content/lessons'
import { GOAL_SKETCHES, sketchTitles } from '@/content/mock/sketches'
import { useGoalRoute } from '@/learning/hooks'
import { retrievability, useProgress } from '@/learning/progress'
import { stationStates, type StationState } from '@/learning/stations'
import type { Skill } from '@/learning/types'

export interface StationVM {
  id: string
  /** Số ga (1…n) trên tuyến. */
  no: number
  skill: Skill
  state: StationState
  /** Số ga còn thiếu để mở ga này. */
  needs: number[]
  minutes: number | null
  exercises: number
  sketches: string[]
  sketchesOpen: number
  /** Sức nhớ 0–1 của ga đã qua. */
  memory: number | null
}

/** Mô hình hiển thị của một mục tiêu: các ga kèm trạng thái, số sketch, sức nhớ. */
export function useGoalModel(goalId: string) {
  const route = useGoalRoute(goalId)
  const records = useProgress((s) => s.skills)
  return useMemo(() => {
    const goal = goalIndex[goalId]
    const path = route.stations.map((s) => s.id)
    const states = stationStates(skillIndex, path, (id) => route.stations.find((s) => s.id === id)!.status !== 'new')
    const noOf = Object.fromEntries(path.map((id, i) => [id, i + 1]))
    const stations: StationVM[] = path.map((id, i) => {
      const skill = skillIndex[id]
      const lesson = skill.lesson ? lessons[skill.lesson] : undefined
      const titles = sketchTitles[id] ?? []
      const st = states[id]
      return {
        id,
        no: i + 1,
        skill,
        state: st.state,
        needs: st.needs.map((n) => noOf[n]),
        minutes: lesson?.minutes ?? null,
        exercises: lesson?.steps.filter((s) => s.kind === 'exercise').length ?? 0,
        sketches: titles,
        sketchesOpen: st.state === 'done' ? titles.length : 0,
        memory: records[id] && st.state === 'done' ? retrievability(records[id]) : null,
      }
    })
    const sketchTotal = stations.reduce((n, s) => n + s.sketches.length, 0) + GOAL_SKETCHES
    const sketchOpen = stations.reduce((n, s) => n + s.sketchesOpen, 0)
    const today = stations.find((s) => s.state === 'today') ?? null
    return { goal, stations, today, done: route.done, total: route.total, sketchTotal, sketchOpen, noOf }
  }, [goalId, route, records])
}

export type GoalModel = ReturnType<typeof useGoalModel>

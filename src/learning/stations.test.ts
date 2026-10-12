import { describe, expect, it } from 'vitest'
import { goalIndex, skillIndex } from '@/content/skills'
import { learningPath } from './graph'
import { backChain, stationStates } from './stations'

const goal = goalIndex.astar
const path = learningPath(skillIndex, goal.target)
const done = (ids: string[]) => (id: string) => ids.includes(id)
const FIVE = ['formulate', 'state-graph', 'frontier', 'graph-search', 'priority-queue']

describe('trạng thái ga', () => {
  it('ga 6 là hôm nay, ga 7 học được ngay, ga 8 và 9 bị khoá', () => {
    const s = stationStates(skillIndex, path, done(FIVE))
    expect(s.ucs.state).toBe('today')
    expect(s.heuristic.state).toBe('ready')
    expect(s.astar).toEqual({ state: 'locked', needs: ['ucs', 'heuristic'] })
    expect(s.admissible.state).toBe('locked')
    expect(s.formulate.state).toBe('done')
  })
  it('chưa học gì thì chỉ ga đầu là hôm nay, ga 5 không cần ga trước nên học được ngay', () => {
    const s = stationStates(skillIndex, path, done([]))
    expect(s.formulate.state).toBe('today')
    expect(s['priority-queue'].state).toBe('ready')
    expect(s.ucs.state).toBe('locked')
  })
  it('lần ngược từ đích tới ga 6 đi qua ga 9, 8, 6', () => {
    expect(backChain(skillIndex, goal.target, 'ucs')).toEqual(['admissible', 'astar', 'ucs'])
    expect(backChain(skillIndex, goal.target, goal.target)).toEqual([goal.target])
    expect(backChain(skillIndex, goal.target, 'bfs')).toEqual([])
  })
})

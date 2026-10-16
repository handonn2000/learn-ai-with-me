import { describe, expect, it } from 'vitest'
import { skillIndex, skills } from '@/content/skills'
import { indexSkills, learningPath, nextPlacementQuestion, placementKnown } from './graph'
import type { Skill } from './types'

describe('đồ thị kỹ năng', () => {
  it('lộ trình tới A* theo thứ tự topo, không có BFS/GBFS', () => {
    const path = learningPath(skillIndex, 'admissible')
    expect(path).toEqual([
      'formulate',
      'state-graph',
      'frontier',
      'graph-search',
      'priority-queue',
      'ucs',
      'heuristic',
      'astar',
      'admissible',
    ])
    for (const id of path)
      for (const p of skillIndex[id].prereqs) expect(path.indexOf(p)).toBeLessThan(path.indexOf(id))
  })

  it('tuyến agent (buổi 2): 5 ga theo thứ tự, ga nào cũng có lesson', () => {
    const path = learningPath(skillIndex, 'env-classify')
    expect(path).toEqual(['agent', 'rationality', 'peas', 'env-dims', 'env-classify'])
    for (const id of path) expect(skillIndex[id].lesson).toBeDefined()
  })

  it('dừng ở nút đã nắm', () => {
    const known = new Set(['graph-search'])
    const p = learningPath(skillIndex, 'admissible', (id) => known.has(id))
    // frontier chỉ cần cho graph-search (đã nắm) nên bị cắt;
    // state-graph vẫn cần vì heuristic dựa trực tiếp vào nó.
    expect(p).toEqual(['priority-queue', 'ucs', 'formulate', 'state-graph', 'heuristic', 'astar', 'admissible'])
  })

  it('mọi kỹ năng có câu kiểm tra; kỹ năng trên lộ trình đều có lesson', () => {
    for (const s of skills) expect(s.checks.length).toBeGreaterThan(0)
    for (const id of learningPath(skillIndex, 'admissible')) expect(skillIndex[id].lesson).toBeDefined()
  })

  it('phát hiện chu trình', () => {
    const bad: Skill[] = [
      { id: 'a', title: '', can: '', prereqs: ['b'], checks: [] },
      { id: 'b', title: '', can: '', prereqs: ['a'], checks: [] },
    ]
    expect(() => indexSkills(bad)).toThrow(/Chu trình/)
  })
})

describe('xếp lớp backward chaining', () => {
  it('hỏi đích trước; đúng thì dừng và coi như nắm cả nhánh', () => {
    expect(nextPlacementQuestion(skillIndex, 'admissible', {})).toBe('admissible')
    const answers = { admissible: true }
    expect(nextPlacementQuestion(skillIndex, 'admissible', answers)).toBeNull()
    expect(placementKnown(skillIndex, 'admissible', answers).size).toBe(9)
  })

  it('sai thì lần xuống tiên quyết', () => {
    const answers: Record<string, boolean> = { admissible: false }
    expect(nextPlacementQuestion(skillIndex, 'admissible', answers)).toBe('astar')
    answers.astar = false
    expect(nextPlacementQuestion(skillIndex, 'admissible', answers)).toBe('ucs')
    answers.ucs = true
    // UCS đúng ⇒ graph-search, frontier, state-graph, formulate, priority-queue được coi là đã nắm
    expect(nextPlacementQuestion(skillIndex, 'admissible', answers)).toBe('heuristic')
    answers.heuristic = false
    // state-graph đã được suy ra từ UCS nên không hỏi lại
    expect(nextPlacementQuestion(skillIndex, 'admissible', answers)).toBeNull()
    const known = placementKnown(skillIndex, 'admissible', answers)
    expect([...known].sort()).toEqual(['formulate', 'frontier', 'graph-search', 'priority-queue', 'state-graph', 'ucs'])
  })
})

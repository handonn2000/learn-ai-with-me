import { describe, expect, it } from 'vitest'
import { goals, skillIndex } from '@/content/skills'
import { learningPath } from './graph'
import { goalOfSkill, pickFollowed } from './goals'

const peasPath = learningPath(skillIndex, 'env-classify')
const astarPath = learningPath(skillIndex, 'admissible')
const doneOf = (ids: string[]) => (id: string) => ids.includes(id)

describe('mục tiêu', () => {
  it('mỗi kỹ năng trên tuyến tìm được đúng mục tiêu của nó', () => {
    expect(goalOfSkill(goals, skillIndex, 'agent')?.id).toBe('peas')
    expect(goalOfSkill(goals, skillIndex, 'env-classify')?.id).toBe('peas')
    expect(goalOfSkill(goals, skillIndex, 'ucs')?.id).toBe('astar')
    // BFS nằm trên bản đồ nhưng không thuộc tuyến nào
    expect(goalOfSkill(goals, skillIndex, 'bfs')).toBeNull()
  })

  it('chưa học gì: theo mục tiêu đầu tiên', () => {
    expect(pickFollowed(goals, skillIndex, null, doneOf([])).id).toBe(goals[0].id)
  })

  it('dữ liệu cũ chỉ có tiến độ A*: vẫn theo A*', () => {
    expect(pickFollowed(goals, skillIndex, null, doneOf(['formulate', 'state-graph'])).id).toBe('astar')
  })

  it('vào ga của mục tiêu khác thì đổi theo; mục tiêu đã xong thì chuyển sang mục tiêu còn dở', () => {
    expect(pickFollowed(goals, skillIndex, 'peas', doneOf(['formulate'])).id).toBe('peas')
    expect(pickFollowed(goals, skillIndex, 'astar', doneOf(astarPath)).id).toBe('peas')
    expect(pickFollowed(goals, skillIndex, 'peas', doneOf([...astarPath, ...peasPath])).id).toBe('peas')
  })
})

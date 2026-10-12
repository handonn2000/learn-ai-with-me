import { describe, expect, it } from 'vitest'
import { courses } from '@/content/courses'
import { pickNearest, resolveGoal } from './courses'

const csc = courses[0]
const progress = (done: number) => csc.goals.map((g) => resolveGoal(g, 'astar', g.goalId ? { done, total: 9 } : undefined))

describe('khóa học', () => {
  it('mục tiêu có dữ liệu thật lấy số ga từ tuyến', () => {
    const a = progress(5).find((p) => p.goal.id === 'astar')!
    expect([a.gaDone, a.ga, a.state]).toEqual([5, 9, 'current'])
    expect(progress(9).find((p) => p.goal.id === 'astar')!.state).toBe('done')
  })
  it('chọn 3 mục tiêu gần nhất: hai kế tiếp trên đường mòn đang đi, một mở đầu đường khác', () => {
    const picks = pickNearest(csc, progress(5))
    expect(picks.map((p) => p.item.goal.id)).toEqual(['algo-choice', 'csp', 'kb'])
    expect(picks.map((p) => p.reason.kind)).toEqual(['shared', 'next', 'other-trail'])
  })
  it('chưa theo mục tiêu nào thì lấy đầu mỗi đường mòn', () => {
    const de = courses[1]
    const picks = pickNearest(de, de.goals.map((g) => resolveGoal(g, null)))
    expect(picks.map((p) => p.item.goal.id)).toEqual(['csv', 'events', 'layers'])
  })
})

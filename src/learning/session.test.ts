import { describe, expect, it } from 'vitest'
import { buildPlan, MAX_REVIEW } from './session'

const base = { dueCount: 2, newStation: { title: 'UCS', minutes: 12 }, hasAfter: true, guessMinutes: 2, paperMinutes: 3 }

describe('kế hoạch buổi học hôm nay', () => {
  it('đủ bốn bước theo thứ tự', () => {
    expect(buildPlan(base).map((s) => s.kind)).toEqual(['review', 'lesson', 'guess', 'paper'])
  })

  it('bỏ bước ôn khi không có gì đến hạn', () => {
    expect(buildPlan({ ...base, dueCount: 0 }).map((s) => s.kind)).toEqual(['lesson', 'guess', 'paper'])
  })

  it('bỏ đoán trước khi không còn ga sau', () => {
    expect(buildPlan({ ...base, hasAfter: false }).map((s) => s.kind)).toEqual(['review', 'lesson', 'paper'])
  })

  it('bỏ bước giấy khi ga hôm nay không có', () => {
    expect(buildPlan({ ...base, hasPaper: false }).map((s) => s.kind)).toEqual(['review', 'lesson', 'guess'])
  })

  it('không có ga mới thì chỉ còn ôn, và hết việc thì kế hoạch rỗng', () => {
    expect(buildPlan({ ...base, newStation: null }).map((s) => s.kind)).toEqual(['review'])
    expect(buildPlan({ ...base, newStation: null, dueCount: 0 })).toEqual([])
  })

  it('giới hạn số kỹ năng ôn và tính phút theo số đó', () => {
    const [review] = buildPlan({ ...base, dueCount: 9 })
    expect(review.title).toBe(`Ôn ${MAX_REVIEW} kỹ năng sắp quên`)
    expect(review.minutes).toBe(Math.ceil(MAX_REVIEW * 1.5))
  })
})

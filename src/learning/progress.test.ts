import { describe, expect, it } from 'vitest'
import { dueLabel, dueSkills, outcomeToRating, useProgress, worstOutcome } from './progress'
import { Rating } from 'ts-fsrs'

describe('tiến độ', () => {
  it('quy kết quả ra điểm FSRS', () => {
    expect(outcomeToRating('clean')).toBe(Rating.Good)
    expect(outcomeToRating('hinted')).toBe(Rating.Hard)
    expect(outcomeToRating('revealed')).toBe(Rating.Again)
    expect(worstOutcome(['clean', 'hinted', 'clean'])).toBe('hinted')
    expect(worstOutcome(['clean', 'revealed', 'hinted'])).toBe('revealed')
  })

  it('lịch ôn tính theo ngày, không theo phút', () => {
    const now = new Date('2026-10-10T08:00:00')
    const { record } = useProgress.getState()
    record('ucs', 'clean', 'lesson', now)
    record('astar', 'revealed', 'lesson', now)
    const s = useProgress.getState().skills
    expect(dueLabel(s.ucs, now)).toBe('sau 3 ngày')
    expect(dueLabel(s.astar, now)).toBe('ngày mai')
    expect(dueSkills(s, now)).toEqual([])
    expect(dueSkills(s, new Date('2026-10-11T09:00:00'))).toEqual(['astar'])
  })

  it('xếp lớp: đánh dấu đã biết, không ghi đè kỹ năng đã học', () => {
    const now = new Date('2026-10-10T08:00:00')
    const before = useProgress.getState().skills.ucs
    useProgress.getState().markKnown(['ucs', 'formulate'], now)
    const s = useProgress.getState().skills
    expect(s.ucs).toBe(before)
    expect(s.formulate.via).toBe('placement')
    expect(dueLabel(s.formulate, now)).toBe('sau 8 ngày')
  })
})

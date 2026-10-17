import { describe, expect, it } from 'vitest'
import { type GuessRecord, dueLabel, dueSkills, migrateProgress, outcomeToRating, previewDays, retrievability, useProgress, worstOutcome } from './progress'
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

  it('sức nhớ giảm dần theo thời gian và nằm trong 0..1', () => {
    const now = new Date('2026-10-10T08:00:00')
    const rec = useProgress.getState().skills.ucs
    const soon = retrievability(rec, now)
    const later = retrievability(rec, new Date('2026-11-10T08:00:00'))
    expect(soon).toBeGreaterThan(0.9)
    expect(soon).toBeLessThanOrEqual(1)
    expect(later).toBeLessThan(soon)
    expect(later).toBeGreaterThanOrEqual(0)
  })

  it('tự chấm: Dễ cách xa hơn Được, Quên gần nhất; kết quả được ghi theo mức chọn', () => {
    const now = new Date('2026-10-10T08:00:00')
    const d = previewDays(undefined, now)
    expect(d.again).toBeLessThanOrEqual(d.hard)
    expect(d.hard).toBeLessThanOrEqual(d.good)
    expect(d.good).toBeLessThan(d.easy)
    useProgress.getState().recordRating('rating-test', Rating.Hard, now)
    expect(useProgress.getState().skills['rating-test'].lastOutcome).toBe('hinted')
    useProgress.getState().recordRating('rating-test', Rating.Easy, now)
    expect(useProgress.getState().skills['rating-test'].lastOutcome).toBe('clean')
  })

  it('lần đoán: chỉ giữ lần đầu ở mỗi lesson', () => {
    useProgress.getState().reset()
    const first: GuessRecord = { picks: { p1: 'leads' }, confidence: 'guess', at: '2026-10-01T08:00:00.000Z' }
    useProgress.getState().saveGuess('admissible', first)
    useProgress.getState().saveGuess('admissible', { ...first, picks: { p1: 'not' } })
    expect(useProgress.getState().guesses.admissible).toEqual(first)
  })
})

describe('nâng phiên bản store learn-ai-v2', () => {
  const v1 = {
    skills: { ucs: { card: { due: '2026-10-05T08:00:00.000Z', reps: 1, state: 2 }, via: 'lesson', lastOutcome: 'clean' } },
    lessonStep: { ucs: 2 },
    follow: 'astar',
  }

  it('1 → 2: giữ nguyên kỹ năng, bước dở, mục tiêu; thêm guesses trống', () => {
    expect(migrateProgress(v1, 1)).toEqual({ ...v1, guesses: {} })
  })

  it('dữ liệu rất cũ thiếu follow thì điền null; dữ liệu hỏng thì về trống', () => {
    const { follow: _, ...old } = v1
    expect(migrateProgress(old, 0)).toEqual({ ...old, follow: null, guesses: {} })
    expect(migrateProgress('rác', 1)).toEqual({ skills: {}, lessonStep: {}, follow: null, guesses: {} })
  })
})

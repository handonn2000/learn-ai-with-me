import { describe, expect, it } from 'vitest'
import { createEmptyCard, fsrs, Rating } from 'ts-fsrs'
import { CLOUD_VERSION, mergeProgress, parseCloud, toPlain, type ProgressData } from './sync'
import type { SkillRecord } from './progress'

const scheduler = fsrs({ enable_fuzz: false, enable_short_term: false })

function learned(at: string, times = 1): SkillRecord {
  const now = new Date(at)
  let card = createEmptyCard(now)
  for (let i = 0; i < times; i++) card = scheduler.next(card, now, Rating.Good).card
  return { card, via: 'lesson', lastOutcome: 'clean' }
}

const empty: ProgressData = { skills: {}, lessonStep: {}, follow: null }

describe('gộp tiến độ máy và mây', () => {
  it('giữ kỹ năng của cả hai bên, bên nào ôn sau thì thắng', () => {
    const local: ProgressData = {
      skills: { bfs: learned('2026-10-10T08:00:00Z'), ucs: learned('2026-10-01T08:00:00Z') },
      lessonStep: {},
      follow: null,
    }
    const remote: ProgressData = {
      skills: { ucs: learned('2026-10-05T08:00:00Z'), astar: learned('2026-10-02T08:00:00Z') },
      lessonStep: {},
      follow: null,
    }
    const m = mergeProgress(local, remote)
    expect(Object.keys(m.skills).sort()).toEqual(['astar', 'bfs', 'ucs'])
    expect(m.skills.ucs).toBe(remote.skills.ucs)
    expect(m.skills.bfs).toBe(local.skills.bfs)
  })

  it('so được ngày dạng chuỗi (đã qua JSON) với ngày dạng Date', () => {
    const local = toPlain({ ...empty, skills: { ucs: learned('2026-10-09T08:00:00Z') } })
    const remote: ProgressData = { ...empty, skills: { ucs: learned('2026-10-05T08:00:00Z') } }
    expect(mergeProgress(local, remote).skills.ucs).toBe(local.skills.ucs)
  })

  it('cùng lúc ôn thì giữ bản ôn nhiều lần hơn', () => {
    const local: ProgressData = { ...empty, skills: { ucs: learned('2026-10-05T08:00:00Z', 1) } }
    const remote: ProgressData = { ...empty, skills: { ucs: learned('2026-10-05T08:00:00Z', 3) } }
    expect(mergeProgress(local, remote).skills.ucs).toBe(remote.skills.ucs)
  })

  it('bước dở lấy bước xa hơn; mục tiêu lấy của bên học gần nhất', () => {
    const local: ProgressData = {
      skills: { bfs: learned('2026-10-10T08:00:00Z') },
      lessonStep: { bfs: 2, ucs: 1 },
      follow: 'astar',
    }
    const remote: ProgressData = {
      skills: { ucs: learned('2026-10-01T08:00:00Z') },
      lessonStep: { bfs: 4 },
      follow: 'csp',
    }
    const m = mergeProgress(local, remote)
    expect(m.lessonStep).toEqual({ bfs: 4, ucs: 1 })
    expect(m.follow).toBe('astar')
    expect(mergeProgress({ ...local, follow: null }, remote).follow).toBe('csp')
  })

  it('máy trống thì nhận nguyên bản trên mây và ngược lại', () => {
    const remote: ProgressData = { skills: { ucs: learned('2026-10-05T08:00:00Z') }, lessonStep: { ucs: 3 }, follow: 'astar' }
    expect(mergeProgress(empty, remote)).toEqual(remote)
    expect(mergeProgress(remote, empty)).toEqual(remote)
  })
})

describe('đọc dữ liệu từ Firestore', () => {
  it('đọc lại đúng thứ đã gửi lên', () => {
    const data: ProgressData = { skills: { ucs: learned('2026-10-05T08:00:00Z') }, lessonStep: { ucs: 2 }, follow: 'astar' }
    const back = parseCloud({ version: CLOUD_VERSION, progress: toPlain(data) })
    expect(back.follow).toBe('astar')
    expect(back.lessonStep).toEqual({ ucs: 2 })
    expect(back.skills.ucs.card.due).toEqual(data.skills.ucs.card.due)
    expect(back.skills.ucs.card.last_review).toEqual(data.skills.ucs.card.last_review)
    expect(back.skills.ucs.card.reps).toBe(1)
  })

  it('bỏ phần hỏng, document lạ hoặc khác phiên bản thì coi như trống', () => {
    const progress = {
      skills: { ucs: { card: { due: 'x' } }, bfs: 'rác' },
      lessonStep: { ucs: 'hai', bfs: 1 },
      follow: 42,
    }
    expect(parseCloud({ version: CLOUD_VERSION, progress })).toEqual({ skills: {}, lessonStep: { bfs: 1 }, follow: null })
    expect(parseCloud(undefined)).toEqual(empty)
    expect(parseCloud({ version: 99, progress: {} })).toEqual(empty)
  })
})

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createEmptyCard, fsrs, Rating, type Card, type Grade } from 'ts-fsrs'
import type { SkillId } from './types'

/**
 * Tiến độ người học — lưu ở localStorage, key `learn-ai-v2`.
 * Mỗi kỹ năng có một thẻ FSRS; lịch ôn tính theo kỹ năng chứ không theo buổi.
 */

export type Outcome = 'clean' | 'hinted' | 'revealed'

/** Kết quả một lesson / câu ôn → điểm FSRS. */
export function outcomeToRating(o: Outcome): Grade {
  return o === 'clean' ? Rating.Good : o === 'hinted' ? Rating.Hard : Rating.Again
}

/** Gộp kết quả nhiều bài tập: lấy mức tệ nhất. */
export function worstOutcome(list: Outcome[]): Outcome {
  if (list.includes('revealed')) return 'revealed'
  if (list.includes('hinted')) return 'hinted'
  return 'clean'
}

export interface SkillRecord {
  card: Card
  /** Cách đạt: học qua lesson, hay vượt qua câu kiểm tra xếp lớp. */
  via: 'lesson' | 'placement'
  lastOutcome: Outcome
}

export type SkillStatus = 'new' | 'learned' | 'due'

interface State {
  skills: Record<SkillId, SkillRecord>
  /** Bước đang làm dở trong mỗi lesson. */
  lessonStep: Record<string, number>
  setLessonStep: (lessonId: string, step: number) => void
  /** Ghi kết quả học/ôn một kỹ năng. */
  record: (id: SkillId, outcome: Outcome, via: SkillRecord['via'], now?: Date) => void
  /** Xếp lớp: đánh dấu đã nắm (FSRS: Easy). */
  markKnown: (ids: SkillId[], now?: Date) => void
  reset: () => void
}

// Không dùng bước học ngắn hạn (vài phút): lịch tính theo ngày cho từng kỹ năng.
// Thẻ mới: Again → 1 ngày, Hard → 2, Good → 3, Easy → 8.
const scheduler = fsrs({ enable_fuzz: false, enable_short_term: false })

// Thẻ lưu qua JSON nên các trường ngày bị thành chuỗi — chuyển lại.
function revive(card: Card): Card {
  return { ...card, due: new Date(card.due), last_review: card.last_review ? new Date(card.last_review) : undefined }
}

export const useProgress = create<State>()(
  persist(
    (set) => ({
      skills: {},
      lessonStep: {},
      setLessonStep: (lessonId, step) => set((s) => ({ lessonStep: { ...s.lessonStep, [lessonId]: step } })),
      record: (id, outcome, via, now = new Date()) =>
        set((s) => {
          const prev = s.skills[id]
          const card = prev ? revive(prev.card) : createEmptyCard(now)
          const next = scheduler.next(card, now, outcomeToRating(outcome)).card
          return {
            skills: { ...s.skills, [id]: { card: next, via: prev?.via === 'lesson' ? 'lesson' : via, lastOutcome: outcome } },
          }
        }),
      markKnown: (ids, now = new Date()) =>
        set((s) => {
          const skills = { ...s.skills }
          for (const id of ids) {
            if (skills[id]) continue
            const card = scheduler.next(createEmptyCard(now), now, Rating.Easy).card
            skills[id] = { card, via: 'placement', lastOutcome: 'clean' }
          }
          return { skills }
        }),
      reset: () => set({ skills: {}, lessonStep: {} }),
    }),
    { name: 'learn-ai-v2', version: 1 },
  ),
)

export function statusOf(rec: SkillRecord | undefined, now = new Date()): SkillStatus {
  if (!rec) return 'new'
  return new Date(rec.card.due) <= now ? 'due' : 'learned'
}

export function dueSkills(skills: Record<SkillId, SkillRecord>, now = new Date()): SkillId[] {
  return Object.entries(skills)
    .filter(([, r]) => new Date(r.card.due) <= now)
    .sort(([, a], [, b]) => +new Date(a.card.due) - +new Date(b.card.due))
    .map(([id]) => id)
}


/** Nhãn ngày ôn theo lịch: "hôm nay", "ngày mai", "sau N ngày". */
export function dueLabel(rec: SkillRecord, now = new Date()): string {
  const day = (d: Date) => Math.floor((+d - d.getTimezoneOffset() * 60_000) / 86_400_000)
  const diff = day(new Date(rec.card.due)) - day(now)
  return diff <= 0 ? 'hôm nay' : diff === 1 ? 'ngày mai' : `sau ${diff} ngày`
}

/** Xác suất nhớ (0..1) của một kỹ năng tại thời điểm `now`, ước tính từ thẻ FSRS. */
export function retrievability(rec: SkillRecord, now = new Date()): number {
  return scheduler.get_retrievability(revive(rec.card), now, false)
}

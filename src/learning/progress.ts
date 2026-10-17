import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createEmptyCard, fsrs, Rating, type Card, type Grade } from 'ts-fsrs'
import type { Confidence, SkillId } from './types'
import type { ProgressData } from './sync'

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

/** Một lần đoán trước của người học (bước đoán quan hệ): lựa chọn theo từng cặp, độ chắc chắn, lúc đoán (ISO). */
export interface GuessRecord {
  picks: Record<string, string>
  confidence: Confidence
  at: string
}

interface State {
  skills: Record<SkillId, SkillRecord>
  /** Bước đang làm dở trong mỗi lesson. */
  lessonStep: Record<string, number>
  setLessonStep: (lessonId: string, step: number) => void
  /** Mục tiêu đang theo: ghi khi người học vào một ga. Thiếu (dữ liệu cũ) thì suy ra từ tiến độ, xem `pickFollowed`. */
  follow: string | null
  setFollow: (goalId: string) => void
  /** Lần đoán đầu tiên ở mỗi lesson. Chỉ giữ lần đầu: đó là bản để quay lại sửa ở bước hệ thống lại. */
  guesses: Record<string, GuessRecord>
  saveGuess: (lessonId: string, guess: GuessRecord) => void
  /** Ghi kết quả học/ôn một kỹ năng. */
  record: (id: SkillId, outcome: Outcome, via: SkillRecord['via'], now?: Date) => void
  /** Ghi một điểm FSRS do người học tự chấm (câu nhớ lại: Quên / Khó / Được / Dễ). */
  recordRating: (id: SkillId, rating: Grade, now?: Date) => void
  /** Xếp lớp: đánh dấu đã nắm (FSRS: Easy). */
  markKnown: (ids: SkillId[], now?: Date) => void
  reset: () => void
}

/** Phiên bản shape của store. 1: skills, lessonStep, follow. 2: thêm guesses. */
export const PROGRESS_VERSION = 2

type DataV1 = Omit<ProgressData, 'guesses'>
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const hasV1Shape = (v: unknown): v is DataV1 => isObj(v) && isObj(v.skills) && isObj(v.lessonStep)
const hasGuesses = (v: DataV1): v is ProgressData => 'guesses' in v && isObj(v.guesses)

/**
 * Nâng dữ liệu đã lưu từ phiên bản cũ lên shape hiện tại; persist chỉ gọi khi phiên bản khác `PROGRESS_VERSION`.
 * Thiếu trường nào thì điền giá trị trống, không bỏ kỹ năng nào đã học.
 */
export function migrateProgress(persisted: unknown, version: number): ProgressData {
  if (!hasV1Shape(persisted)) return { skills: {}, lessonStep: {}, follow: null, guesses: {} }
  const { skills, lessonStep, follow } = persisted
  // `follow` có từ trước khi đánh số phiên bản nên dữ liệu rất cũ có thể thiếu.
  const base = { skills, lessonStep, follow: typeof follow === 'string' ? follow : null }
  return { ...base, guesses: version >= 2 && hasGuesses(persisted) ? persisted.guesses : {} }
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
      follow: null,
      setFollow: (goalId) => set((s) => (s.follow === goalId ? s : { follow: goalId })),
      guesses: {},
      saveGuess: (lessonId, guess) => set((s) => (s.guesses[lessonId] ? s : { guesses: { ...s.guesses, [lessonId]: guess } })),
      record: (id, outcome, via, now = new Date()) =>
        set((s) => {
          const prev = s.skills[id]
          const card = prev ? revive(prev.card) : createEmptyCard(now)
          const next = scheduler.next(card, now, outcomeToRating(outcome)).card
          return {
            skills: { ...s.skills, [id]: { card: next, via: prev?.via === 'lesson' ? 'lesson' : via, lastOutcome: outcome } },
          }
        }),
      recordRating: (id, rating, now = new Date()) =>
        set((s) => {
          const prev = s.skills[id]
          const card = prev ? revive(prev.card) : createEmptyCard(now)
          const next = scheduler.next(card, now, rating).card
          const lastOutcome: Outcome = rating === Rating.Again ? 'revealed' : rating === Rating.Hard ? 'hinted' : 'clean'
          return { skills: { ...s.skills, [id]: { card: next, via: prev?.via ?? 'lesson', lastOutcome } } }
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
      reset: () => set({ skills: {}, lessonStep: {}, follow: null, guesses: {} }),
    }),
    {
      name: 'learn-ai-v2',
      version: PROGRESS_VERSION,
      migrate: migrateProgress,
      partialize: (s): ProgressData => ({ skills: s.skills, lessonStep: s.lessonStep, follow: s.follow, guesses: s.guesses }),
    },
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

/** Số ngày tới lần ôn sau nếu người học chọn từng mức tự chấm. */
export function previewDays(rec: SkillRecord | undefined, now = new Date()): Record<'again' | 'hard' | 'good' | 'easy', number> {
  const r = scheduler.repeat(rec ? revive(rec.card) : createEmptyCard(now), now)
  return { again: r[Rating.Again].card.scheduled_days, hard: r[Rating.Hard].card.scheduled_days, good: r[Rating.Good].card.scheduled_days, easy: r[Rating.Easy].card.scheduled_days }
}

import type { Card } from 'ts-fsrs'
import type { Confidence, SkillId } from './types'
import type { GuessRecord, Outcome, SkillRecord } from './progress'

/**
 * Phần thuần của việc đồng bộ tiến độ lên Firestore: dữ liệu gửi đi, đọc về, và gộp hai bản.
 * Không import Firebase — phần chạy thật ở `cloud.ts`, tải lười.
 */

/** Đúng phần dữ liệu của store `learn-ai-v2` (bỏ các hàm). */
export interface ProgressData {
  skills: Record<SkillId, SkillRecord>
  lessonStep: Record<string, number>
  follow: string | null
  guesses: Record<string, GuessRecord>
}

/**
 * Phiên bản dữ liệu trên Firestore; khớp `PROGRESS_VERSION` trong `progress.ts`.
 * Đọc được mọi phiên bản trong `READABLE`: bản 1 chỉ thiếu `guesses`, nên vẫn gộp được kỹ năng của nó.
 */
export const CLOUD_VERSION = 2
const READABLE = [1, 2]

export function pickData(s: ProgressData): ProgressData {
  return { skills: s.skills, lessonStep: s.lessonStep, follow: s.follow, guesses: s.guesses }
}

/** Ngày thành chuỗi ISO, bỏ trường `undefined` — Firestore không nhận `undefined`, và localStorage cũng lưu như vậy. */
export function toPlain(d: ProgressData): ProgressData {
  return JSON.parse(JSON.stringify(pickData(d)))
}

/** Lần ôn gần nhất của một kỹ năng (ms); chưa ôn thì 0. Ngày có thể là Date hoặc chuỗi (sau JSON). */
function reviewedAt(r: SkillRecord): number {
  const t = r.card.last_review ? new Date(r.card.last_review).getTime() : 0
  return Number.isNaN(t) ? 0 : t
}

function newer(a: SkillRecord, b: SkillRecord): SkillRecord {
  const ta = reviewedAt(a)
  const tb = reviewedAt(b)
  if (ta !== tb) return ta > tb ? a : b
  return b.card.reps > a.card.reps ? b : a
}

function latest(skills: Record<SkillId, SkillRecord>): number {
  return Math.max(0, ...Object.values(skills).map(reviewedAt))
}

/**
 * Gộp tiến độ trong máy với bản trên mây.
 * - Kỹ năng: giữ bản có lần ôn mới hơn (cùng lúc thì bản ôn nhiều lần hơn), không mất kỹ năng nào.
 * - Bước dở trong lesson: lấy bước xa hơn.
 * - Mục tiêu đang theo: lấy của bên vừa học gần nhất; một bên trống thì lấy bên kia.
 * - Lần đoán: giữ lần đoán sớm hơn, vì đó là bản để quay lại sửa.
 */
export function mergeProgress(local: ProgressData, remote: ProgressData): ProgressData {
  const skills: Record<SkillId, SkillRecord> = { ...remote.skills }
  for (const [id, rec] of Object.entries(local.skills)) {
    skills[id] = skills[id] ? newer(rec, skills[id]) : rec
  }
  const lessonStep: Record<string, number> = { ...remote.lessonStep }
  for (const [id, step] of Object.entries(local.lessonStep)) {
    lessonStep[id] = Math.max(step, lessonStep[id] ?? 0)
  }
  const follow =
    local.follow && remote.follow
      ? latest(local.skills) >= latest(remote.skills)
        ? local.follow
        : remote.follow
      : (local.follow ?? remote.follow)
  const guesses: Record<string, GuessRecord> = { ...remote.guesses }
  for (const [id, g] of Object.entries(local.guesses)) {
    const other = guesses[id]
    guesses[id] = other && other.at <= g.at ? other : g
  }
  return { skills, lessonStep, follow, guesses }
}

// ---- Đọc dữ liệu từ Firestore: không tin hình dạng, chỉ nhận phần hợp lệ ----

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const OUTCOMES: readonly Outcome[] = ['clean', 'hinted', 'revealed']
const isOutcome = (v: unknown): v is Outcome => OUTCOMES.some((o) => o === v)
const CONFIDENCES: readonly Confidence[] = ['guess', 'fair', 'sure']
const isConfidence = (v: unknown): v is Confidence => CONFIDENCES.some((c) => c === v)

function parseGuess(v: unknown): GuessRecord | null {
  if (!isObj(v) || !isObj(v.picks) || !isConfidence(v.confidence) || typeof v.at !== 'string') return null
  const picks: Record<string, string> = {}
  for (const [id, pick] of Object.entries(v.picks)) if (typeof pick === 'string') picks[id] = pick
  return { picks, confidence: v.confidence, at: v.at }
}

function parseRecord(v: unknown): SkillRecord | null {
  if (!isObj(v) || !isObj(v.card)) return null
  const c = v.card
  if (typeof c.due !== 'string' || typeof c.reps !== 'number' || typeof c.state !== 'number') return null
  if (v.via !== 'lesson' && v.via !== 'placement') return null
  if (!isOutcome(v.lastOutcome)) return null
  const card: Card = {
    due: new Date(c.due),
    stability: Number(c.stability) || 0,
    difficulty: Number(c.difficulty) || 0,
    elapsed_days: Number(c.elapsed_days) || 0,
    scheduled_days: Number(c.scheduled_days) || 0,
    learning_steps: Number(c.learning_steps) || 0,
    reps: c.reps,
    lapses: Number(c.lapses) || 0,
    state: c.state,
    last_review: typeof c.last_review === 'string' ? new Date(c.last_review) : undefined,
  }
  return { card, via: v.via, lastOutcome: v.lastOutcome }
}

/** Dữ liệu document `users/{uid}` → tiến độ; hỏng hoặc khác phiên bản thì coi như trống. */
export function parseCloud(doc: unknown): ProgressData {
  const empty: ProgressData = { skills: {}, lessonStep: {}, follow: null, guesses: {} }
  if (!isObj(doc) || !isObj(doc.progress) || !READABLE.some((v) => v === doc.version)) return empty
  const p = doc.progress
  const skills: Record<SkillId, SkillRecord> = {}
  if (isObj(p.skills)) {
    for (const [id, raw] of Object.entries(p.skills)) {
      const rec = parseRecord(raw)
      if (rec) skills[id] = rec
    }
  }
  const lessonStep: Record<string, number> = {}
  if (isObj(p.lessonStep)) {
    for (const [id, step] of Object.entries(p.lessonStep)) if (typeof step === 'number') lessonStep[id] = step
  }
  const guesses: Record<string, GuessRecord> = {}
  if (isObj(p.guesses)) {
    for (const [id, raw] of Object.entries(p.guesses)) {
      const g = parseGuess(raw)
      if (g) guesses[id] = g
    }
  }
  return { skills, lessonStep, follow: typeof p.follow === 'string' ? p.follow : null, guesses }
}

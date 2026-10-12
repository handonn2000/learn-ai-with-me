import type { ComponentType } from 'react'
import type { GraphProblem } from '@/algorithms/search'
import type { Exercise } from '@/exercises/types'

export type SkillId = string

export interface Skill {
  id: SkillId
  /** Tên ngắn, dùng trên bản đồ và tuyến. */
  title: string
  /** "Học xong bạn làm được…" — một câu bắt đầu bằng động từ. */
  can: string
  /** Tiên quyết THẬT: không nắm thì không làm được kỹ năng này. */
  prereqs: SkillId[]
  /** Lesson dạy kỹ năng này (nếu đã có). */
  lesson?: string
  /** Buổi học gốc trong CSC14003, để tham chiếu slide. */
  source?: string
  /** 1–3 câu kiểm tra nhanh: dùng cho xếp lớp và ôn tập. */
  checks: Exercise[]
}

export interface Goal {
  id: string
  title: string
  /** Mô tả một câu: đạt mục tiêu thì bạn làm được gì. */
  outcome: string
  target: SkillId
}

/** Bước "đoán trước": chưa học nên cứ đoán, kèm độ chắc chắn. Không tính vào kết quả của ga. */
export interface GuessData {
  prompt: string
  options: { title: string; note?: string }[]
  answer: number
  right: string
  wrong: string
  /** Hiện khi sai mà đã chọn "Rất chắc" (màn 12b). */
  wrongSure: string
  /** Bản đồ minh hoạ, vẽ bằng GraphView. */
  figure?: { problem: GraphProblem; notes?: Record<string, string>; frontier?: string[]; current?: string }
}

/** Bước "làm trên giấy": chỉ nhập kết quả cuối, không bắt buộc. */
export interface PaperData {
  title: string
  steps: string[]
  resultLabel: string
  unit: string
  minutes: number
}

/** Hệ thống lại cuối buổi: sketch một trang. `{{ô trống}}` là chỗ che khi tự kiểm tra, `==nhấn==` là chỗ tô vàng. */
export interface ReorganizeData {
  minutes: number
  frame: string[]
  sketch: { title: string; sub: string; boxes: Record<'top' | 'left' | 'core' | 'next' | 'a' | 'b' | 'c', { text: string; sub?: string }> }
  ideas: string[]
}

export type LessonStep =
  | { kind: 'explain'; title: string; Body: ComponentType }
  | { kind: 'exercise'; exercise: Exercise; /** Tên ngắn của kỹ năng bài tập kiểm tra, hiện ở màn "Qua ga". */ label?: string }
  | { kind: 'guess'; data: GuessData }
  | { kind: 'paper'; data: PaperData }

export interface Lesson {
  id: string
  skill: SkillId
  minutes: number
  steps: LessonStep[]
  reorganize?: ReorganizeData
}

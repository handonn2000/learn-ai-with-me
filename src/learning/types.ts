import type { ComponentType } from 'react'
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

export type LessonStep =
  | { kind: 'explain'; title: string; Body: ComponentType }
  | { kind: 'exercise'; exercise: Exercise }

export interface Lesson {
  id: string
  skill: SkillId
  minutes: number
  steps: LessonStep[]
}

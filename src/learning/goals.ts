import type { Goal, SkillId } from './types'
import { learningPath, type SkillIndex } from './graph'

/** Mục tiêu có kỹ năng này trên tuyến (mục tiêu khai báo trước được ưu tiên khi kỹ năng nằm ở nhiều tuyến). */
export function goalOfSkill(goals: Goal[], idx: SkillIndex, id: SkillId): Goal | null {
  return goals.find((g) => learningPath(idx, g.target).includes(id)) ?? null
}

/**
 * Mục tiêu đang theo. Ưu tiên mục tiêu người học vào ga gần nhất (`follow`) nếu nó chưa xong.
 * Không có thì lấy mục tiêu chưa xong đầu tiên đã có tiến độ, rồi mục tiêu chưa xong đầu tiên,
 * cuối cùng (xong hết) là mục tiêu ghi trong `follow` hoặc mục tiêu đầu tiên.
 * Ôn tập không đổi mục tiêu đang theo: chỉ vào ga mới đổi.
 */
export function pickFollowed(goals: Goal[], idx: SkillIndex, follow: string | null, isDone: (id: SkillId) => boolean): Goal {
  const info = goals.map((g) => {
    const path = learningPath(idx, g.target)
    return { g, done: path.every(isDone), started: path.some(isDone) }
  })
  const open = info.filter((x) => !x.done)
  return (
    open.find((x) => x.g.id === follow)?.g ??
    open.find((x) => x.started)?.g ??
    open[0]?.g ??
    goals.find((g) => g.id === follow) ??
    goals[0]
  )
}

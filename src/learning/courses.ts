import type { Course, CourseGoal } from '@/content/courses'

export interface GoalProgress {
  goal: CourseGoal
  ga: number
  gaDone: number
  sketches: number
  sketchesOpen: number
  state: 'done' | 'current' | 'open'
}

/** Tiến độ một mục tiêu. Mục tiêu có dữ liệu thật dùng `real`; còn lại dùng số mẫu trong dữ liệu. */
export function resolveGoal(goal: CourseGoal, followedId: string | null, real?: { done: number; total: number }): GoalProgress {
  const ga = goal.goalId && real ? real.total : goal.ga
  const gaDone = goal.goalId && real ? real.done : goal.gaDone
  const state = gaDone >= ga ? 'done' : goal.id === followedId ? 'current' : 'open'
  return { goal, ga, gaDone, sketches: goal.sketches, sketchesOpen: goal.sketchesOpen, state }
}

export type Reason = { kind: 'shared'; text: string } | { kind: 'next' } | { kind: 'other-trail' } | { kind: 'start' }

/**
 * Chọn tối đa `n` mục tiêu gần người học nhất: trước hết các mục tiêu kế tiếp trên đường mòn đang đi,
 * rồi mục tiêu đầu tiên chưa xong của mỗi đường mòn khác. Nếu chưa theo mục tiêu nào thì lấy đầu mỗi đường mòn.
 */
export function pickNearest(course: Course, progress: GoalProgress[], n = 3): { item: GoalProgress; reason: Reason }[] {
  const followed = progress.find((p) => p.state === 'current')
  const open = progress.filter((p) => p.state === 'open' && p.goal.trail !== 'start')
  const out: { item: GoalProgress; reason: Reason }[] = []
  const reasonOf = (item: GoalProgress, sameTrail: boolean): Reason =>
    item.goal.sharedFrom && item.gaDone > 0
      ? { kind: 'shared', text: `đã có ${item.gaDone}/${item.ga} ga nhờ ${item.goal.sharedFrom}` }
      : followed ? (sameTrail ? { kind: 'next' } : { kind: 'other-trail' }) : { kind: 'start' }
  if (followed) {
    for (const p of open.filter((x) => x.goal.trail === followed.goal.trail).slice(0, 2)) out.push({ item: p, reason: reasonOf(p, true) })
  }
  for (const t of course.trails) {
    if (out.length >= n) break
    if (followed && t.id === followed.goal.trail) continue
    const first = open.find((x) => x.goal.trail === t.id)
    if (first) out.push({ item: first, reason: reasonOf(first, false) })
  }
  return out.slice(0, n)
}

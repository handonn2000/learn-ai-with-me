/** Số kỹ năng ôn tối đa trong một lần (cả trang Ôn tập lẫn buổi học hôm nay). */
export const MAX_REVIEW = 5

export type SegmentKind = 'review' | 'lesson' | 'guess' | 'paper'

export interface Segment {
  kind: SegmentKind
  title: string
  minutes: number
}

export interface PlanInput {
  dueCount: number
  /** Ga mới sẽ học hôm nay; null nếu hết ga hoặc ga chưa có bài. */
  newStation: { title: string; minutes: number } | null
  /** Còn ga nào sau ga mới trên tuyến không (để có gì mà đoán trước). */
  hasAfter: boolean
  guessMinutes: number
  paperMinutes: number
  /** Ga hôm nay có bước làm trên giấy không (mặc định có). */
  hasPaper?: boolean
}

/**
 * Buổi học hôm nay gồm tối đa 4 bước: ôn kỹ năng đến hạn → ga mới → đoán trước cho ga sau → hệ thống lại trên giấy.
 * Bước nào không có việc thì bỏ. Đoán trước và giấy chỉ có khi hôm nay có ga mới.
 */
export function buildPlan({ dueCount, newStation, hasAfter, guessMinutes, paperMinutes, hasPaper = true }: PlanInput): Segment[] {
  const plan: Segment[] = []
  const n = Math.min(dueCount, MAX_REVIEW)
  if (n > 0) plan.push({ kind: 'review', title: `Ôn ${n} kỹ năng sắp quên`, minutes: Math.ceil(n * 1.5) })
  if (newStation) {
    plan.push({ kind: 'lesson', title: `Ga mới: ${newStation.title}`, minutes: newStation.minutes })
    if (hasAfter) plan.push({ kind: 'guess', title: 'Đoán trước cho ga sau', minutes: guessMinutes })
    if (hasPaper) plan.push({ kind: 'paper', title: 'Hệ thống lại trên giấy', minutes: paperMinutes })
  }
  return plan
}

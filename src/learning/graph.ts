import type { Skill, SkillId } from './types'

export type SkillIndex = Record<SkillId, Skill>

export function indexSkills(skills: Skill[]): SkillIndex {
  const idx: SkillIndex = {}
  for (const s of skills) {
    if (idx[s.id]) throw new Error(`Trùng id kỹ năng: ${s.id}`)
    idx[s.id] = s
  }
  for (const s of skills)
    for (const p of s.prereqs) if (!idx[p]) throw new Error(`${s.id} cần ${p} nhưng ${p} không tồn tại`)
  assertAcyclic(idx)
  return idx
}

function assertAcyclic(idx: SkillIndex) {
  const state = new Map<SkillId, 'visiting' | 'done'>()
  const visit = (id: SkillId, trail: SkillId[]) => {
    if (state.get(id) === 'done') return
    if (state.get(id) === 'visiting') throw new Error(`Chu trình tiên quyết: ${[...trail, id].join(' → ')}`)
    state.set(id, 'visiting')
    for (const p of idx[id].prereqs) visit(p, [...trail, id])
    state.set(id, 'done')
  }
  for (const id of Object.keys(idx)) visit(id, [])
}

/**
 * Backward chaining: từ đích lần ngược qua cạnh tiên quyết.
 * Dừng ở nút `known` (đã nắm) — không đi xuống nhánh dưới nó.
 * Trả về lộ trình theo thứ tự học (sắp xếp topo: tiên quyết đứng trước).
 */
export function learningPath(idx: SkillIndex, target: SkillId, known: (id: SkillId) => boolean = () => false): SkillId[] {
  const out: SkillId[] = []
  const seen = new Set<SkillId>()
  const visit = (id: SkillId) => {
    if (seen.has(id)) return
    seen.add(id)
    if (known(id) && id !== target) return
    // duyệt tiên quyết theo thứ tự khai báo để lộ trình ổn định
    for (const p of idx[id].prereqs) visit(p)
    out.push(id)
  }
  visit(target)
  return out
}

/** Toàn bộ nút nằm dưới đích (kể cả đích), không cắt theo trạng thái. */
export function ancestors(idx: SkillIndex, target: SkillId): Set<SkillId> {
  return new Set(learningPath(idx, target))
}

/** Độ sâu tính từ nút gốc (không có tiên quyết = 0) — dùng để xếp tầng trên bản đồ. */
export function depthOf(idx: SkillIndex): Record<SkillId, number> {
  const memo: Record<SkillId, number> = {}
  const d = (id: SkillId): number =>
    (memo[id] ??= idx[id].prereqs.length ? 1 + Math.max(...idx[id].prereqs.map(d)) : 0)
  for (const id of Object.keys(idx)) d(id)
  return memo
}

/**
 * Kiểm tra xếp lớp theo backward chaining.
 * Gọi `next(answers)` để biết nút cần hỏi tiếp; `answers[id] = true` nghĩa là trả lời đúng.
 * Đúng ở một nút ⇒ coi như nắm cả nhánh dưới nó. Sai ⇒ hỏi tiếp các tiên quyết.
 */
export function nextPlacementQuestion(
  idx: SkillIndex,
  target: SkillId,
  answers: Record<SkillId, boolean>,
): SkillId | null {
  const known = placementKnown(idx, target, answers)
  const queue: SkillId[] = [target]
  const seen = new Set<SkillId>()
  while (queue.length) {
    const id = queue.shift()!
    if (seen.has(id) || known.has(id)) continue
    seen.add(id)
    const a = answers[id]
    if (a === undefined) {
      if (idx[id].checks.length) return id
      queue.push(...idx[id].prereqs) // nút không có câu kiểm tra: không xác nhận được, xuống tiếp
    } else if (a === false) queue.push(...idx[id].prereqs)
  }
  return null
}

/** Sau xếp lớp: những nút được coi là đã nắm. */
export function placementKnown(idx: SkillIndex, target: SkillId, answers: Record<SkillId, boolean>): Set<SkillId> {
  const known = new Set<SkillId>()
  const mark = (id: SkillId) => {
    if (known.has(id)) return
    known.add(id)
    idx[id].prereqs.forEach(mark)
  }
  for (const id of ancestors(idx, target)) if (answers[id] === true) mark(id)
  return known
}

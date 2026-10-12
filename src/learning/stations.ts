import type { SkillId } from './types'
import type { SkillIndex } from './graph'

/** done: đã qua · today: ga nên học bây giờ · ready: đủ tiên quyết, học được ngay · locked: còn thiếu tiên quyết. */
export type StationState = 'done' | 'today' | 'ready' | 'locked'

export interface StationInfo {
  state: StationState
  /** Tiên quyết chưa xong. */
  needs: SkillId[]
}

/**
 * Trạng thái từng ga trên tuyến. `path` theo thứ tự học; ga đầu tiên chưa xong là "hôm nay".
 * Đủ tiên quyết nhưng không phải ga kế tiếp thì là "ready" (vd ga 7 không cần chờ ga 6).
 */
export function stationStates(idx: SkillIndex, path: SkillId[], isDone: (id: SkillId) => boolean): Record<SkillId, StationInfo> {
  const todayId = path.find((id) => !isDone(id))
  const out: Record<SkillId, StationInfo> = {}
  for (const id of path) {
    const needs = idx[id].prereqs.filter((p) => !isDone(p))
    out[id] = { needs, state: isDone(id) ? 'done' : id === todayId ? 'today' : needs.length === 0 ? 'ready' : 'locked' }
  }
  return out
}

/** Chuỗi "lần ngược từ đích": từ đích xuống `id` qua các tiên quyết. Rỗng nếu `id` không nằm dưới đích. */
export function backChain(idx: SkillIndex, target: SkillId, id: SkillId): SkillId[] {
  const walk = (cur: SkillId): SkillId[] | null => {
    if (cur === id) return [cur]
    for (const p of idx[cur].prereqs) {
      const rest = walk(p)
      if (rest) return [cur, ...rest]
    }
    return null
  }
  return walk(target) ?? []
}

import { expansionOrder, runSearch } from '@/algorithms/search'
import type { Exercise, TraceEx } from './types'

/** Câu trả lời của người học, theo từng dạng bài. */
export type Answer =
  | { kind: 'choice'; picked: number[] }
  | { kind: 'number'; value: number }
  | { kind: 'pick-nodes'; picked: string[] }
  | { kind: 'order'; sequence: string[] }
  | { kind: 'classify'; assigned: (number | null)[] }
  | { kind: 'trace'; sequence: string[] }

const sameSet = <T>(a: T[], b: T[]) => a.length === b.length && a.every((x) => b.includes(x))
const sameSeq = <T>(a: T[], b: T[]) => a.length === b.length && a.every((x, i) => x === b[i])

/** Đáp án trace: các nút được mở rộng trong khoảng [from, from + steps). */
export function traceAnswer(ex: TraceEx): string[] {
  const order = expansionOrder(runSearch(ex.problem, ex.algo))
  const from = ex.from ?? 0
  return order.slice(from, from + ex.steps)
}

export function grade(ex: Exercise, a: Answer): boolean {
  switch (ex.kind) {
    case 'choice':
      return a.kind === 'choice' && sameSet(a.picked, ex.answer)
    case 'number':
      return a.kind === 'number' && Math.abs(a.value - ex.answer) < 1e-6
    case 'pick-nodes':
      return a.kind === 'pick-nodes' && sameSet(a.picked, ex.answer)
    case 'order':
      return a.kind === 'order' && sameSeq(a.sequence, ex.answer)
    case 'classify':
      return a.kind === 'classify' && ex.items.every((it, i) => a.assigned[i] === it.group)
    case 'trace':
      return a.kind === 'trace' && sameSeq(a.sequence, traceAnswer(ex))
  }
}

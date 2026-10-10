import { describe, expect, it } from 'vitest'
import { city, overestimate, overestimateFixed } from '@/content/graphs'
import { expansionOrder, isAdmissible, isConsistent, pathCost, result, runSearch, trueCostToGoal } from './search'

const dist = (a: string, b: string) => {
  const n = (id: string) => city.nodes.find((x) => x.id === id)!
  return Math.hypot(n(a).x - n(b).x, n(a).y - n(b).y)
}

describe('bản đồ city', () => {
  it('trọng số ≥ khoảng cách thẳng, h ≤ khoảng cách thẳng tới G', () => {
    for (const e of city.edges) expect(e.cost).toBeGreaterThanOrEqual(dist(e.a, e.b))
    for (const n of city.nodes) expect(city.h![n.id]).toBeLessThanOrEqual(dist(n.id, 'G'))
  })
  it('h admissible và nhất quán', () => {
    expect(isAdmissible(city)).toBe(true)
    expect(isConsistent(city)).toBe(true)
  })
  it('chi phí thật tới G', () => {
    expect(trueCostToGoal(city)).toMatchObject({ S: 12, A: 9, B: 10, C: 6, D: 7, E: 3, F: 15, G: 0, H: 18 })
  })
  it('BFS: ít chặng nhất, không rẻ nhất', () => {
    const t = runSearch(city, 'bfs')
    expect(expansionOrder(t)).toEqual(['S', 'A', 'B', 'F', 'C'])
    expect(result(t)).toEqual({ found: true, path: ['S', 'A', 'C', 'G'], cost: 13 })
  })
  it('UCS: rẻ nhất, mở rộng 9 nút', () => {
    const t = runSearch(city, 'ucs')
    expect(expansionOrder(t)).toEqual(['S', 'A', 'B', 'F', 'C', 'H', 'D', 'E', 'G'])
    expect(result(t)).toEqual({ found: true, path: ['S', 'A', 'C', 'E', 'G'], cost: 12 })
  })
  it('GBFS: nhanh nhưng không rẻ nhất', () => {
    const t = runSearch(city, 'gbfs')
    expect(expansionOrder(t)).toEqual(['S', 'A', 'E', 'G'])
    expect(result(t)).toEqual({ found: true, path: ['S', 'A', 'E', 'G'], cost: 13 })
  })
  it('A*: rẻ nhất, bỏ qua F và H', () => {
    const t = runSearch(city, 'astar')
    expect(expansionOrder(t)).toEqual(['S', 'A', 'B', 'C', 'D', 'E', 'G'])
    expect(result(t)).toEqual({ found: true, path: ['S', 'A', 'C', 'E', 'G'], cost: 12 })
  })
  it('A*: E được thay thế khi tìm thấy đường rẻ hơn qua C', () => {
    const t = runSearch(city, 'astar')
    const atC = t.find((s) => s.expanded === 'C')!
    expect(atC.generated.find((g) => g.state === 'E')).toMatchObject({ outcome: 'replaced', g: 9, key: 11 })
  })
  it('pathCost', () => {
    expect(pathCost(city, ['S', 'B', 'D', 'G'])).toBe(14)
  })
})

describe('heuristic nói quá', () => {
  it('A* trả về đường đắt hơn khi h không admissible', () => {
    expect(isAdmissible(overestimate)).toBe(false)
    expect(result(runSearch(overestimate, 'astar'))).toEqual({ found: true, path: ['S', 'G'], cost: 3 })
  })
  it('sửa h thì A* ra đường rẻ nhất', () => {
    expect(isAdmissible(overestimateFixed)).toBe(true)
    expect(result(runSearch(overestimateFixed, 'astar'))).toEqual({ found: true, path: ['S', 'A', 'G'], cost: 2 })
  })
})

import type { GraphProblem } from '@/algorithms/search'

/**
 * Bản đồ dùng xuyên suốt chuỗi "Hiểu A*".
 * S = nhà bạn, G = trường. Trọng số = số phút đi xe.
 * Tọa độ tính theo km trên một lưới; trọng số mỗi cạnh ≥ khoảng cách thẳng giữa hai đầu,
 * còn h = khoảng cách thẳng tới G làm tròn xuống ⇒ h nhất quán (đã kiểm trong test).
 *
 * Kết quả đã kiểm:
 *  - BFS:  S → A → C → G (3 chặng, 13 phút)
 *  - UCS:  S → A → C → E → G (12 phút), mở rộng 9 nút
 *  - GBFS: S → A → E → G (13 phút)
 *  - A*:   S → A → C → E → G (12 phút), mở rộng 7 nút — bỏ qua F và H
 */
export const city: GraphProblem = {
  id: 'city',
  nodes: [
    { id: 'S', x: 3, y: 2, label: 'Nhà' },
    { id: 'A', x: 5, y: 0 },
    { id: 'B', x: 5, y: 4 },
    { id: 'C', x: 7, y: 1 },
    { id: 'D', x: 8, y: 3.5 },
    { id: 'E', x: 9, y: 0 },
    { id: 'F', x: 1, y: 1 },
    { id: 'G', x: 11, y: 2, label: 'Trường' },
    { id: 'H', x: 0, y: -1 },
  ],
  edges: [
    { a: 'S', b: 'A', cost: 3 },
    { a: 'S', b: 'B', cost: 3 },
    { a: 'S', b: 'F', cost: 3 },
    { a: 'F', b: 'H', cost: 3 },
    { a: 'A', b: 'C', cost: 3 },
    { a: 'A', b: 'E', cost: 7 },
    { a: 'B', b: 'C', cost: 4 },
    { a: 'B', b: 'D', cost: 4 },
    { a: 'C', b: 'E', cost: 3 },
    { a: 'C', b: 'G', cost: 7 },
    { a: 'D', b: 'G', cost: 7 },
    { a: 'E', b: 'G', cost: 3 },
  ],
  start: 'S',
  goal: 'G',
  h: { S: 8, A: 6, B: 6, C: 4, D: 3, E: 2, F: 10, G: 0, H: 11 },
}

/** Ví dụ trong slide: h(A) = 6 nói quá chi phí thật (1) ⇒ A* trả về đường đắt hơn. */
export const overestimate: GraphProblem = {
  id: 'overestimate',
  nodes: [
    { id: 'S', x: 0, y: 1 },
    { id: 'A', x: 2, y: 0 },
    { id: 'G', x: 4, y: 1 },
  ],
  edges: [
    { a: 'S', b: 'A', cost: 1 },
    { a: 'A', b: 'G', cost: 1 },
    { a: 'S', b: 'G', cost: 3 },
  ],
  start: 'S',
  goal: 'G',
  h: { S: 7, A: 6, G: 0 },
}

/** Cùng ví dụ nhưng h(A) sửa lại cho "biết điều". */
export const overestimateFixed: GraphProblem = { ...overestimate, id: 'overestimate-fixed', h: { S: 2, A: 1, G: 0 } }

export const problems = { city, overestimate, overestimateFixed }
export type ProblemId = keyof typeof problems

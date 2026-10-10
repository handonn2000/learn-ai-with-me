import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
import { city } from '@/content/graphs'
const S1 = lazy(() => import('./1.mdx'))

export const lesson: Lesson = {
  id: 'graph-search',
  skill: 'graph-search',
  minutes: 8,
  steps: [
    { kind: 'explain', title: 'Danh sách explored', Body: S1 },
    {
      kind: 'exercise',
      exercise: {
        id: 'graph-search-e1',
        kind: 'pick-nodes',
        prompt: 'Explored = {S}. Frontier = {A, B, F}. Giờ lấy A ra và mở rộng. Nút nào được thêm vào frontier?',
        problem: city,
        highlight: { explored: ['S'], frontier: ['B', 'F'], current: 'A' },
        answer: ['C', 'E'],
        hint: 'A nối với S, C và E. Bỏ những trạng thái đã ở explored.',
        explain: 'S đã ở explored nên bị bỏ. <b>C và E</b> là trạng thái mới.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'graph-search-e2',
        kind: 'classify',
        prompt: 'Explored = {S, A}. Frontier = {B, F, C, E}. Lấy B ra và mở rộng, sinh ra S, C và D. Mỗi nút được xử lý thế nào?',
        groups: ['Thêm vào frontier', 'Bỏ: đã ở explored', 'Bỏ: đang ở frontier'],
        items: [
          { text: 'S', group: 1 },
          { text: 'C', group: 2 },
          { text: 'D', group: 0 },
        ],
        hint: 'So từng nút với hai danh sách. Nút nào không có trong cả hai thì mới thêm.',
        explain: 'S đã được mở rộng, C đã nằm chờ trong frontier, chỉ <b>D</b> là mới.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'graph-search-e3',
        kind: 'choice',
        prompt: 'Nếu bỏ explored đi, chuyện gì có thể xảy ra trên bản đồ này?',
        options: [
          'Thuật toán có thể đi S → A → S → A… và mở rộng lại cùng một trạng thái nhiều lần',
          'Thuật toán không tìm được G vì thiếu cạnh',
          'Đường đi tìm được luôn dài hơn',
          'Không có gì khác',
        ],
        answer: [0],
        hint: 'Bản đồ có cạnh hai chiều. Tree search có nhớ mình đã ở đâu không?',
        explain: 'Không có explored, mỗi cạnh hai chiều là một vòng lặp tiềm năng. Thuật toán vẫn có thể tìm ra G, nhưng phải trả giá bằng rất nhiều việc lặp lại.',
      },
    },
  ],
}

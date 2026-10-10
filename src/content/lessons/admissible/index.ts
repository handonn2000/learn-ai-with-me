import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
import { city } from '@/content/graphs'
const S1 = lazy(() => import('./1.mdx'))
const S2 = lazy(() => import('./2.mdx'))

export const lesson: Lesson = {
  id: 'admissible',
  skill: 'admissible',
  minutes: 12,
  steps: [
    { kind: 'explain', title: 'Khi h đoán quá tay', Body: S1 },
    { kind: 'explain', title: 'Không được đoán lố', Body: S2 },
    {
      kind: 'exercise',
      exercise: {
        id: 'admissible-e1',
        kind: 'number',
        prompt: 'Trên bản đồ đi học, h*(C) bằng bao nhiêu? Đó là chi phí thật của đường rẻ nhất từ C tới G.',
        problem: city,
        showCosts: true,
        showH: true,
        answer: 6,
        unit: 'phút',
        hint: 'Từ C có thể đi thẳng tới G, hoặc vòng qua E. So hai đường.',
        explain: 'C → G tốn 7, C → E → G tốn 3 + 3 = <b>6</b>. h(C) = 4 ≤ 6, nên ở C heuristic không nói quá.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'admissible-e2',
        kind: 'classify',
        prompt: 'Với bài đi học, heuristic nào admissible?',
        groups: ['Admissible', 'Không admissible'],
        items: [
          { text: 'Khoảng cách đường chim bay tới trường', group: 0 },
          { text: 'h(n) = 0 ở mọi nút', group: 0 },
          { text: 'h(n) = h*(n)', group: 0 },
          { text: 'h(n) = h*(n) + 1', group: 1 },
          { text: 'h(n) = 2 × khoảng cách đường chim bay', group: 1 },
        ],
        hint: 'Với mỗi cái, hỏi: có lúc nào nó lớn hơn h*(n) không? Thử ở chính đích, nơi h* = 0, và thử ở S, nơi h*(S) = 12.',
        explain:
          'h* + 1 nói quá ở mọi nút, kể cả đích. Gấp đôi chim bay cho h(S) = 16 &gt; 12. Ba cái còn lại không bao giờ vượt h*.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'admissible-e3',
        kind: 'choice',
        prompt: 'Ở ví dụ đoán quá tay (S–A tốn 1, A–G tốn 1, S–G tốn 3), sửa h(A) thành giá trị nào thì heuristic admissible?',
        options: ['5', '3', '2', '1'],
        answer: [3],
        hint: 'h*(A) bằng bao nhiêu?',
        explain: 'h*(A) = 1, nên h(A) phải ≤ 1. Trong các lựa chọn, chỉ có <b>1</b>. Với h(A) = 1, f(A) = 2 nhỏ hơn f(G) = 3 và A* đi đúng đường S → A → G.',
      },
    },
  ],
}

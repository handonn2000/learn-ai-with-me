import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
import { city } from '@/content/graphs'
const S1 = lazy(() => import('./1.mdx'))
const S2 = lazy(() => import('./2.mdx'))

export const lesson: Lesson = {
  id: 'astar',
  skill: 'astar',
  minutes: 12,
  steps: [
    { kind: 'explain', title: 'Đã đi cộng còn lại', Body: S1 },
    { kind: 'explain', title: 'Xem A* chạy', Body: S2 },
    {
      kind: 'exercise',
      exercise: {
        id: 'astar-e1',
        kind: 'number',
        prompt: 'Đi S → B → D. Với nút D trên đường này, f(D) bằng bao nhiêu?',
        problem: city,
        showCosts: true,
        showH: true,
        answer: 10,
        hint: 'g(D) = tổng hai cạnh S–B và B–D. h(D) đọc cạnh nút D.',
        explain: 'g(D) = 3 + 4 = 7, h(D) = 3, nên f(D) = <b>10</b>.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'astar-e2',
        kind: 'trace',
        prompt: 'S đã được mở rộng. Frontier cho bạn g và h — tự cộng ra f. Bấm lần lượt các nút A* mở rộng cho tới khi nó dừng.',
        problem: city,
        algo: 'astar',
        from: 1,
        steps: 6,
        showCosts: true,
        showH: true,
        values: 'parts',
        hint: 'Tính f = g + h cho mọi nút trong frontier, chọn f nhỏ nhất. Hòa thì chữ cái đứng trước.',
        explain: 'A (9), B (9), C (10), D (10), E (11), rồi G (12). F nằm trong frontier với f = 13 suốt từ đầu nhưng không bao giờ tới lượt.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'astar-e3',
        kind: 'choice',
        prompt: 'Vì sao A* không bao giờ mở rộng F?',
        options: [
          'F không nối với G',
          'f(F) = 13 lớn hơn 12, chi phí đường tốt nhất, nên G được lấy ra trước',
          'A* không xét các nút ở phía sau nhà',
          'h(F) lớn hơn h(S)',
        ],
        answer: [1],
        hint: 'A* dừng khi lấy G ra. G có f bằng bao nhiêu lúc đó?',
        explain: 'Lúc G được lấy ra với f = 12, F vẫn chờ với f = 13. A* dừng trước khi tới lượt F.',
      },
    },
  ],
}

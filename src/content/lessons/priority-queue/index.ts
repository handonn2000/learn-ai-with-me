import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
const S1 = lazy(() => import('./1.mdx'))

export const lesson: Lesson = {
  id: 'priority-queue',
  skill: 'priority-queue',
  minutes: 6,
  steps: [
    { kind: 'explain', title: 'Khóa nhỏ nhất ra trước', Body: S1 },
    {
      kind: 'exercise',
      exercise: {
        id: 'priority-queue-e1',
        kind: 'order',
        prompt: 'Thêm lần lượt D:7, A:4, C:2, B:4. Sau đó lấy ra hết. Xếp theo thứ tự được lấy ra.',
        items: ['D', 'A', 'C', 'B'],
        answer: ['C', 'A', 'B', 'D'],
        hint: 'Khóa nhỏ nhất ra trước. A và B cùng khóa 4.',
        explain: 'C (2) trước. A và B hòa ở 4, A đứng trước theo bảng chữ cái. Cuối cùng là D (7).',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'priority-queue-e2',
        kind: 'order',
        prompt:
          'Hàng đợi có C:6, E:10, G:13. Lấy ra một phần tử. Sau đó cập nhật E thành 9, G thành 12, và thêm D:7. Rồi lấy ra hết. Xếp mọi phần tử theo thứ tự được lấy ra.',
        items: ['G', 'D', 'C', 'E'],
        answer: ['C', 'D', 'E', 'G'],
        hint: 'Lần lấy đầu tiên xảy ra trước khi cập nhật. Sau đó so các khóa mới: D:7, E:9, G:12.',
        explain: 'C (6) ra đầu tiên. Còn lại D:7, E:9, G:12 nên thứ tự là <b>C, D, E, G</b>.',
      },
    },
  ],
}

import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
import { city } from '@/content/graphs'
const S1 = lazy(() => import('./1.mdx'))
const S2 = lazy(() => import('./2.mdx'))

export const lesson: Lesson = {
  id: 'frontier',
  skill: 'frontier',
  minutes: 10,
  steps: [
    { kind: 'explain', title: 'Mở rộng và frontier', Body: S1 },
    { kind: 'explain', title: 'Mỗi nút nhớ gì', Body: S2 },
    {
      kind: 'exercise',
      exercise: {
        id: 'frontier-e1',
        kind: 'pick-nodes',
        prompt:
          'Bạn đã mở rộng S, sau đó mở rộng A. Chưa có gì ngăn việc sinh lại trạng thái cũ. Frontier giờ có những trạng thái nào?',
        problem: city,
        highlight: { explored: ['S', 'A'] },
        answer: ['B', 'F', 'C', 'E', 'S'],
        hint: 'Mở rộng S cho {A, B, F}. Lấy A ra rồi mở rộng: A nối với những nút nào? Đừng quên cạnh quay về.',
        explain:
          'Còn B và F từ lần đầu, cộng thêm C, E và <b>S</b> từ A. S xuất hiện lại vì A nối với S, mà thuật toán chưa biết là mình đã từng ở S.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'frontier-e2',
        kind: 'order',
        prompt: 'Nút cha: cha của G là D, cha của D là B, cha của B là S. Bấm lần lượt để đọc ra đường đi từ S tới G.',
        items: ['D', 'G', 'S', 'B'],
        answer: ['S', 'B', 'D', 'G'],
        problem: city,
        showCosts: true,
        hint: 'Đi ngược từ G theo nút cha cho tới S, rồi đảo lại.',
        explain: 'Ngược từ G: G ← D ← B ← S. Đảo lại: <b>S → B → D → G</b>.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'frontier-e3',
        kind: 'number',
        prompt: 'Vẫn theo đường cha ở câu trước, g(G) bằng bao nhiêu?',
        problem: city,
        showCosts: true,
        answer: 14,
        unit: 'phút',
        hint: 'g của mỗi nút = g của cha + chi phí cạnh nối. Bắt đầu từ g(S) = 0.',
        explain: 'g(B) = 3, g(D) = 3 + 4 = 7, g(G) = 7 + 7 = <b>14</b>.',
      },
    },
  ],
}

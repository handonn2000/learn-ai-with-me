import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
import { city } from '@/content/graphs'
const S1 = lazy(() => import('./1.mdx'))
const S2 = lazy(() => import('./2.mdx'))

export const lesson: Lesson = {
  id: 'ucs',
  skill: 'ucs',
  minutes: 12,
  steps: [
    { kind: 'explain', title: 'Rẻ nhất ra trước', Body: S1 },
    { kind: 'explain', title: 'Xem UCS chạy', Body: S2 },
    {
      kind: 'exercise',
      exercise: {
        id: 'ucs-e1',
        kind: 'trace',
        prompt: 'S đã được mở rộng. Bấm lần lượt bốn nút mà UCS sẽ mở rộng tiếp theo.',
        problem: city,
        algo: 'ucs',
        from: 1,
        steps: 4,
        showCosts: true,
        hint: 'Chọn nút có g nhỏ nhất trong frontier. Hòa thì chữ cái đứng trước.',
        explain: 'Thứ tự là A, B, F, C. Ba nút đầu cùng g = 3 nên đi theo bảng chữ cái. C và H cùng g = 6, C ra trước.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'ucs-e2',
        kind: 'trace',
        prompt: 'Chạy tiếp tới khi UCS dừng.',
        problem: city,
        algo: 'ucs',
        from: 5,
        steps: 4,
        showCosts: true,
        hint: 'G đã nằm trong frontier nhưng chưa phải nút rẻ nhất. UCS chỉ dừng khi lấy G ra.',
        explain: 'H, D, E rồi mới tới G. Qua E, đường tới G giảm từ 13 xuống 12 trước khi G được lấy ra.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'ucs-e3',
        kind: 'choice',
        prompt: 'Mở rộng C, UCS thấy đường tới E chỉ tốn 9 (qua C), trong khi frontier đang giữ E với g = 10 (qua A). Nó làm gì?',
        options: [
          'Giữ E với g = 10, vì E vào frontier trước',
          'Đổi g của E thành 9 và đổi cha của E thành C',
          'Thêm một bản E thứ hai vào frontier',
          'Bỏ E khỏi frontier',
        ],
        answer: [1],
        hint: 'Nhớ chi tiết thứ hai trong bài: gặp đường rẻ hơn thì sao?',
        explain: 'UCS cập nhật cả <b>g và nút cha</b>. Không đổi cha thì lúc đọc đường đi sẽ ra đường cũ, đắt hơn.',
      },
    },
  ],
}

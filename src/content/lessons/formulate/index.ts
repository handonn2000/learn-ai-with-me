import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
const S1 = lazy(() => import('./1.mdx'))
const S2 = lazy(() => import('./2.mdx'))

export const lesson: Lesson = {
  id: 'formulate',
  skill: 'formulate',
  minutes: 8,
  steps: [
    { kind: 'explain', title: 'Năm thứ máy cần biết', Body: S1 },
    { kind: 'explain', title: 'Cùng khuôn, bài khác', Body: S2 },
    {
      kind: 'exercise',
      exercise: {
        id: 'formulate-e1',
        kind: 'classify',
        prompt: 'Một robot hút bụi ở hành lang có hai ô. Gán mỗi mô tả vào đúng thành phần.',
        groups: ['Trạng thái đầu', 'Hành động', 'Kết quả', 'Kiểm tra đích', 'Chi phí'],
        items: [
          { text: 'Robot đứng ở ô trái, cả hai ô đều bẩn', group: 0 },
          { text: 'Sang trái, sang phải, hút bụi', group: 1 },
          { text: 'Hút ở ô bẩn thì ô đó sạch; sang phải khi đã ở ô phải thì đứng yên', group: 2 },
          { text: 'Cả hai ô đã sạch chưa?', group: 3 },
          { text: 'Mỗi hành động tính 1', group: 4 },
        ],
        hint: 'Hỏi từng câu: nó mô tả <i>chỗ bắt đầu</i>, <i>việc làm được</i>, <i>điều xảy ra sau khi làm</i>, <i>cách biết đã xong</i>, hay <i>cái giá phải trả</i>?',
        explain: 'Cả năm mục đều có mặt nên máy đã đủ thông tin để bắt đầu tìm.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'formulate-e2',
        kind: 'choice',
        prompt: 'Với bài đi từ nhà tới trường, một trạng thái cần ghi những gì?',
        options: [
          'Bạn đang đứng ở nút nào',
          'Bạn đang ở nút nào, trời có mưa không, đang nghe bài gì',
          'Toàn bộ bản đồ',
          'Số phút bạn đã đi',
        ],
        answer: [0],
        hint: 'Trạng thái chỉ cần <i>vừa đủ</i> để quyết định bước tiếp theo. Số phút đã đi thuộc về thành phần nào?',
        explain: 'Chỉ cần vị trí hiện tại. Thời tiết và bài hát không đổi lời giải. Số phút đã đi là <b>chi phí đường đi</b>, không phải trạng thái.',
      },
    },
  ],
}

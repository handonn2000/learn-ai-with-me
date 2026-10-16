import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
const S1 = lazy(() => import('./1.mdx'))
const S2 = lazy(() => import('./2.mdx'))

export const lesson: Lesson = {
  id: 'agent',
  skill: 'agent',
  minutes: 8,
  steps: [
    { kind: 'explain', title: 'Nhìn vào, làm ra', Body: S1 },
    { kind: 'explain', title: 'Từ percept ra hành động', Body: S2 },
    {
      kind: 'exercise',
      exercise: {
        id: 'agent-e1',
        kind: 'classify',
        prompt: 'Một robot hút bụi đời mới. Mỗi bộ phận dưới đây là cảm biến hay bộ chấp hành?',
        groups: ['Cảm biến', 'Bộ chấp hành'],
        items: [
          { text: 'Camera nhìn phía trước', group: 0 },
          { text: 'Bánh xe', group: 1 },
          { text: 'Cảm biến bụi dưới thân', group: 0 },
          { text: 'Chổi quét và quạt hút', group: 1 },
          { text: 'Loa báo "Đã dọn xong"', group: 1 },
          { text: 'Cảm biến va chạm ở cản trước', group: 0 },
        ],
        hint: 'Hỏi từng bộ phận: nó đưa thông tin <i>vào</i> robot, hay đưa tác động <i>ra</i> môi trường?',
        explain: 'Camera và hai cảm biến đưa thông tin vào. Bánh xe, chổi, quạt và cả cái loa đều tác động ra ngoài: phát tiếng báo cũng là một hành động.',
      },
      label: 'Phân biệt cảm biến và bộ chấp hành',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'agent-e2',
        kind: 'choice',
        prompt: 'Một chatbot trả lời khách trên trang bán hàng. Đâu là bộ chấp hành của nó?',
        options: ['Câu khách gõ vào khung chat', 'Tin nhắn nó gửi lại cho khách', 'Lịch sử các câu đã chat', 'Kho dữ liệu sản phẩm'],
        answer: [1],
        hint: 'Agent phần mềm cũng "làm ra" một thứ gì đó trong môi trường của nó. Với chatbot, đó là gì?',
        explain: 'Tin nhắn gửi đi là thứ chatbot <b>làm ra</b>. Câu khách gõ là thứ nó <b>nhận vào</b> qua cảm biến. Lịch sử chat và kho dữ liệu là thứ nó đọc hoặc nhớ, không phải thứ nó làm ra.',
      },
      label: 'Tìm bộ chấp hành của agent phần mềm',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'agent-e3',
        kind: 'number',
        prompt: 'Trong thế giới hai ô, bảng hàm agent cần bao nhiêu dòng cho mọi chuỗi percept dài đúng 3?',
        answer: 64,
        unit: 'dòng',
        hint: 'Mỗi vị trí trong chuỗi có 4 percept có thể. Dài 2 là 4 × 4.',
        explain: '4 × 4 × 4 = <b>64</b> dòng. Thêm một bước, bảng lại nhân 4.',
      },
      label: 'Đếm số dòng của bảng hàm agent',
    },
    {
      kind: 'paper',
      data: {
        title: 'Vẽ vòng agent – môi trường cho một ứng dụng bạn dùng hằng ngày.',
        minutes: 3,
        steps: [
          'Chọn một ứng dụng chỉ đường trên điện thoại (hoặc bất kỳ ứng dụng nào bạn hay dùng).',
          'Vẽ hai khối "Agent" và "Môi trường", nối bằng hai mũi tên như trong bài.',
          'Ghi ít nhất hai cảm biến trên mũi tên đi vào và hai bộ chấp hành trên mũi tên đi ra.',
        ],
        reference: [
          '<b>Môi trường</b>: đường sá, tình trạng kẹt xe, người dùng đang cầm máy.',
          '<b>Cảm biến</b>: GPS của điện thoại, dữ liệu giao thông nhận qua mạng, chỗ người dùng gõ điểm đến.',
          '<b>Bộ chấp hành</b>: bản đồ và mũi tên hiện trên màn hình, giọng đọc "rẽ phải sau 200 mét".',
        ],
      },
    },
  ],
}

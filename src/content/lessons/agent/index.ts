import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
const S1 = lazy(() => import('./1.mdx'))
const S2 = lazy(() => import('./2.mdx'))

export const lesson: Lesson = {
  id: 'agent',
  skill: 'agent',
  minutes: 10,
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
        kind: 'classify',
        prompt: 'Một chatbot trả lời khách trên trang bán quần áo. Mỗi mục dưới đây là cảm biến, percept, bộ chấp hành hay hành động?',
        groups: ['Cảm biến', 'Percept', 'Bộ chấp hành', 'Hành động'],
        items: [
          { text: 'Ô nhập tin nhắn trên trang', group: 0 },
          { text: 'Câu khách vừa gõ: "Áo này còn size M không?"', group: 1 },
          { text: 'Tấm ảnh chiếc áo khách vừa gửi', group: 1 },
          { text: 'Khung chat hiện tin trả lời', group: 2 },
          { text: 'Trả lời "Còn ạ, bạn muốn đặt không?"', group: 3 },
          { text: 'Gửi kèm đường link tới trang sản phẩm', group: 3 },
        ],
        hint: 'Hỏi hai câu cho từng mục: nó là một bộ phận có sẵn, hay là thứ đi qua bộ phận đó ở một lúc? Nó đi vào chatbot hay đi ra?',
        explain: 'Ô nhập tin và khung chat là <b>bộ phận</b>, có sẵn trước khi khách tới: ô nhập là cảm biến, khung chat là bộ chấp hành. Câu khách gõ và tấm ảnh là thứ đi vào qua cảm biến ở một lúc: <b>percept</b>. Câu trả lời và đường link là thứ chatbot làm ra: <b>hành động</b>.',
      },
      label: 'Tách percept khỏi cảm biến, hành động khỏi bộ chấp hành',
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
      kind: 'exercise',
      exercise: {
        id: 'agent-e4',
        kind: 'choice',
        prompt: 'Robot hai ô vừa nhận chuỗi percept <code>[A, Sạch], [B, Bẩn]</code>. Dòng này nằm trong phần "…" của bảng hàm agent ứng với chương trình ba dòng. Bảng ghi hành động nào?',
        options: ['Sang trái', 'Sang phải', 'Hút', 'Đứng yên'],
        answer: [2],
        hint: 'Chạy chương trình ba dòng. Nó cần nhìn những gì trong chuỗi percept?',
        explain: 'Chương trình chỉ nhìn percept mới nhất, <code>[B, Bẩn]</code>: ô đang đứng bẩn thì <b>hút</b>. Chương trình cho cùng hành động với bảng ở mọi dòng, nên ba dòng thay được cả cái bảng.',
      },
      label: 'Đọc hàm agent qua chương trình',
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

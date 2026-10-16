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
    {
      kind: 'guess',
      data: {
        prompt: 'G vừa vào frontier với g = 13. UCS dừng lại chưa?',
        options: [
          { title: 'Dừng', note: 'G là đích (goal), trả về đường vừa tìm được' },
          { title: 'Chưa dừng', note: 'Còn nút rẻ hơn G phải xét trước' },
        ],
        answer: 1,
        right: 'UCS luôn lấy nút có g nhỏ nhất ra trước. G (13) còn nằm sau H (6), D (7) và E (9).',
        wrong: 'Thấy đích chưa phải là xong. UCS chỉ dừng khi lấy G ra khỏi frontier, mà D (7) và E (9) còn rẻ hơn 13. Qua E, đường tới G chỉ tốn 12.',
        wrongSure: 'Lỗi kiểu này thường được nhớ lâu nhất sau khi sửa, nên ý này sẽ quay lại sớm hơn.',
        figure: { problem: city, frontier: ['H', 'D', 'E', 'G'], current: 'C', notes: { H: 'g=6', D: 'g=7', E: 'g=9', G: 'g=13' } },
      },
    },
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
      label: 'Chạy tay UCS',
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
      label: 'Biết khi nào UCS dừng',
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
      label: 'Cập nhật khi có đường rẻ hơn',
    },
    {
      kind: 'paper',
      data: {
        title: 'Chạy UCS từ Nhà tới Trường trên giấy, rồi nhập kết quả.',
        minutes: 4,
        steps: [
          'Chép lại bản đồ thành phố lên một tờ giấy trắng.',
          'Chạy UCS: sau mỗi lần mở rộng, ghi frontier kèm g.',
          'Dừng khi G được lấy ra khỏi frontier, rồi ghi chi phí đường đi cuối cùng.',
        ],
        resultLabel: 'Chi phí tới Trường',
        unit: 'phút',
      },
    },
  ],
  reorganize: {
    minutes: 3,
    frame: ['Khái niệm chính, đặt ở giữa trang', 'Những ga trước mà nó dựa vào', 'Ba quy tắc dễ sai nhất', 'Ga tiếp theo nó dẫn tới'],
    sketch: {
      title: 'UCS trên một trang',
      sub: 'Ga 6 của tuyến Hiểu A*',
      boxes: {
        top: { text: 'Dựa trên frontier và explored', sub: 'đã học ở ga 3, 4' },
        left: { text: 'Hàng đợi ưu tiên', sub: 'khóa chính là g' },
        core: { text: 'UCS', sub: 'lấy ra nút có {{g nhỏ nhất}}' },
        next: { text: 'Ga sau: A*', sub: '= UCS + {{h(n)}}' },
        a: { text: 'Dừng khi {{LẤY đích ra}} khỏi frontier, không phải khi vừa thấy' },
        b: { text: 'Gặp đường rẻ hơn tới nút đang chờ → {{thay g và cha}}' },
        c: { text: 'Loang đều mọi hướng, kể cả ngược đích (F, H) → {{tốn công}}' },
      },
    },
    ideas: [
      'UCS lấy ra nút có g nhỏ nhất',
      'Dựa trên frontier và explored',
      'Hàng đợi ưu tiên, khóa là g',
      'Dừng khi lấy đích ra, không phải khi vừa thấy',
      'Gặp đường rẻ hơn thì thay g và nút cha',
      'Loang đều mọi hướng nên tốn công',
      'Ga sau: A* thêm h(n)',
    ],
  },
}

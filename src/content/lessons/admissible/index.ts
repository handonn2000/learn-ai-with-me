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
    {
      kind: 'relate',
      data: {
        prompt: 'Nối thử từng cặp: ý trên quan hệ thế nào với ý dưới?',
        legend: 'Đoán quá (overestimate): h lớn hơn chi phí thật còn lại từ nút đó tới đích (goal). Đoán hụt (underestimate): nhỏ hơn. “Không phải”: không dẫn tới, cũng không là ví dụ.',
        pairs: [
          {
            id: 'over',
            left: 'h đoán quá ở một nút',
            right: 'A* có thể trả về đường không rẻ nhất',
            answer: 'leads',
            why: 'Nút bị h dọa là còn xa có thể nằm chờ trong frontier, trong khi A* đã lấy một đích đắt hơn ra trước.',
          },
          {
            id: 'under',
            left: 'h đoán hụt nhiều, như h = 0 ở mọi nút',
            right: 'A* thường phải mở rộng (expand) nhiều nút hơn',
            answer: 'leads',
            why: 'Đoán hụt làm A* kém định hướng. Với h = 0, A* chính là UCS: trên bản đồ đi học nó mở 9 nút, còn với h chim bay chỉ 7.',
          },
          {
            id: 'crow',
            left: 'Khoảng cách đường chim bay tới đích',
            right: 'h không bao giờ đoán quá',
            answer: 'example',
            why: 'Khi chi phí là quãng đường, không đường nào ngắn hơn đường thẳng, nên chim bay không bao giờ vượt chi phí thật.',
          },
          {
            id: 'double',
            left: 'Gấp đôi khoảng cách đường chim bay',
            right: 'h không bao giờ đoán quá',
            answer: 'not',
            why: 'Gấp đôi có thể vượt chi phí thật còn lại. Chỉ cần vượt ở một nút là đã đoán quá.',
          },
        ],
        wrongSure: 'Lỗi lúc rất chắc thường được nhớ lâu nhất sau khi sửa. Để ý cặp đó khi đọc phần giải thích.',
      },
    },
    { kind: 'explain', title: 'Khi h đoán quá', Body: S1 },
    { kind: 'explain', title: 'Không được đoán quá', Body: S2 },
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
        explain: 'C → G tốn 7, C → E → G tốn 3 + 3 = <b>6</b>. h(C) = 4 ≤ 6, nên ở C heuristic không đoán quá.',
      },
      label: 'Tính h* và so với h',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'admissible-e2',
        kind: 'classify',
        prompt: 'Một bạn kiểm heuristic trên bản đồ đi học và ghi kết luận kèm lý do. Mỗi dòng thuộc loại nào?',
        groups: ['Đúng', 'Sai: chỉ thử một nút', 'Sai: hiểu nhầm điều kiện'],
        items: [
          { text: '"Một nửa chim bay là admissible, vì ở mọi nút nó ≤ chim bay, mà chim bay ≤ h*."', group: 0 },
          { text: '"Chim bay + 1 là admissible, vì ở S nó bằng 9 ≤ 12."', group: 1 },
          { text: '"Nếu h(C) = 7 thì h không admissible, vì h*(C) = 6."', group: 0 },
          { text: '"h = h* không admissible, vì h phải nhỏ hơn h* hẳn."', group: 2 },
          { text: '"h = 0 không admissible, vì nó chẳng cho A* biết gì về đích."', group: 2 },
        ],
        hint: 'Mỗi dòng, hỏi hai câu: lý do có xét mọi nút không? Điều kiện thật là ≤ hay &lt;?',
        explain:
          'Chim bay + 1 cho h(G) = 1 &gt; 0, nên thử riêng S là chưa đủ. Điều kiện là h ≤ h*, nên h = h* vẫn admissible. h = 0 kém hữu ích nhưng không bao giờ đoán quá. Hai dòng còn lại đúng: vượt h* ở một nút là đủ để hỏng, và bắc cầu qua chim bay là hợp lệ.',
      },
      label: 'Tìm lỗi trong lập luận',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'admissible-e3',
        kind: 'choice',
        prompt:
          'A* không bỏ trạng thái nào đã gặp, h admissible. Đường rẻ nhất tốn C* = 12. Frontier có một đích tệ G2 với f = 15, và một nút n nằm trên đường rẻ nhất. Điều gì chắc chắn?',
        options: ['f(n) ≤ 12, nên n được lấy ra trước G2', 'f(n) = 15, hai nút ngang nhau', 'f(n) có thể lớn hơn 15, nên G2 có thể ra trước', 'Chưa chạy thì không nói được gì'],
        answer: [0],
        hint: 'h(n) ≤ h*(n). Cộng g(n) vào hai vế.',
        explain: 'f(n) = g(n) + h(n) ≤ g(n) + h*(n) = C* = 12 &lt; 15. Nên n luôn ra trước G2, và đích tệ không bao giờ được lấy ra trước đường rẻ nhất.',
      },
      label: 'Giải thích vì sao A* đúng',
    },
  ],
  reorganize: {
    minutes: 3,
    frame: ['Admissible, đặt ở giữa trang', 'Ga trước nó dựa vào', 'Đoán quá và đoán hụt dẫn tới đâu', 'Cách kiểm nhanh một h'],
    sketch: {
      title: 'Admissible trên một trang',
      sub: 'Ga 9, ga cuối của tuyến Hiểu A*',
      boxes: {
        top: { text: 'Dựa trên A*', sub: 'f = g + h' },
        left: { text: 'h*(n)', sub: 'chi phí thật rẻ nhất từ n tới đích' },
        core: { text: 'Admissible', sub: 'h(n) {{≤ h*(n)}} ở mọi nút' },
        next: { text: 'Có explored → cần nhất quán', sub: 'h(n) ≤ c + h(n′)' },
        a: { text: 'Đoán quá → A* có thể {{trả về đường không rẻ nhất}}' },
        b: { text: 'Đoán hụt → A* kém định hướng, thường {{mở nhiều nút hơn}} (h = 0 là UCS)' },
        c: { text: 'Loại nhanh: ở {{đích}}, h phải bằng 0' },
      },
    },
    ideas: [
      'h ≤ h* ở mọi nút',
      'h* là chi phí thật rẻ nhất tới đích',
      'Đoán quá thì A* có thể trả về đường không rẻ nhất',
      'Đoán hụt thì A* thường mở nhiều nút hơn',
      'Chim bay và h = 0 là admissible',
      'Loại nhanh: ở đích h phải bằng 0',
      'Có explored (graph search) thì cần thêm nhất quán',
    ],
  },
}

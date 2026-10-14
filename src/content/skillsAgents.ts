import type { Skill } from '@/learning/types'
import { dimItems } from './agents'

/**
 * Đồ thị kỹ năng — tuyến "Mô tả một tác tử thông minh" (CSC14003 buổi 2, Lecture02-IntelligentAgents.pdf).
 * Phần cấu trúc tác tử (bảng tra, năm kiến trúc, tác tử học) chưa nằm trên tuyến này.
 */
export const agentSkills: Skill[] = [
  {
    id: 'agent',
    title: 'Tác tử và môi trường',
    short: 'tác tử',
    can: 'Chỉ ra cảm biến, bộ chấp hành và tri giác của một tác tử, và đọc hàm tác tử như một bảng từ chuỗi tri giác ra hành động.',
    prereqs: [],
    lesson: 'agent',
    source: 'Buổi 2',
    checks: [
      {
        id: 'agent-c1',
        kind: 'choice',
        prompt: 'Với một robot gắp linh kiện trên băng chuyền, "cánh tay có khớp" là gì?',
        options: ['Cảm biến', 'Bộ chấp hành', 'Tri giác', 'Một phần của môi trường'],
        answer: [1],
        hint: 'Nó đưa thông tin <i>vào</i> tác tử, hay tác động <i>ra</i> môi trường?',
        explain: 'Cánh tay tác động lên linh kiện, nên nó là <b>bộ chấp hành</b>. Camera và cảm biến góc khớp mới là cảm biến.',
      },
    ],
  },
  {
    id: 'rationality',
    title: 'Tác tử duy lý',
    short: 'duy lý',
    can: 'Chọn thước đo hiệu năng chấm trạng thái của môi trường, và xét một hành động có duy lý không dựa trên thước đo, tri thức có sẵn, hành động làm được và chuỗi tri giác.',
    prereqs: ['agent'],
    lesson: 'rationality',
    source: 'Buổi 2',
    checks: [
      {
        id: 'rationality-c1',
        kind: 'choice',
        prompt: 'Thước đo hiệu năng của một tác tử nên chấm điểm thứ gì?',
        options: [
          'Chuỗi trạng thái của môi trường mà tác tử tạo ra',
          'Cách tác tử cư xử, xem có đúng ý người thiết kế không',
          'Mức tác tử tự tin vào kết quả của mình',
          'Số hành động tác tử làm được trong một giờ',
        ],
        answer: [0],
        hint: 'Nhớ luật đặt thước đo: theo thứ bạn muốn có trong môi trường.',
        explain: 'Thước đo chấm <b>chuỗi trạng thái của môi trường</b>. Chấm cách cư xử hay để tác tử tự chấm thì nó có thể đạt điểm cao mà việc không xong.',
      },
    ],
  },
  {
    id: 'peas',
    title: 'Viết PEAS',
    short: 'PEAS',
    can: 'Viết mô tả PEAS cho một tác tử: thước đo hiệu năng, môi trường, bộ chấp hành và cảm biến, không đặt nhầm ô.',
    prereqs: ['agent', 'rationality'],
    lesson: 'peas',
    source: 'Buổi 2',
    checks: [
      {
        id: 'peas-c1',
        kind: 'classify',
        prompt: 'PEAS của một robot hút bụi. Gán mỗi mục vào đúng chữ.',
        groups: ['P · thước đo', 'E · môi trường', 'A · bộ chấp hành', 'S · cảm biến'],
        items: [
          { text: 'Số ô sạch ở mỗi bước', group: 0 },
          { text: 'Căn phòng, bụi, chân bàn ghế', group: 1 },
          { text: 'Bánh xe, chổi, quạt hút', group: 2 },
          { text: 'Cảm biến bụi, cảm biến va chạm', group: 3 },
        ],
        hint: 'P chấm kết quả, E là thứ ở ngoài robot, A là thứ robot dùng để tác động, S là thứ robot dùng để nhận biết.',
        explain: 'Mỗi chữ một mục. Bánh xe và chổi là thứ robot <b>làm ra</b>; hai cảm biến là thứ nó <b>nhận vào</b>.',
      },
    ],
  },
  {
    id: 'env-dims',
    title: 'Bốn chiều đầu của môi trường',
    short: '4 chiều',
    can: 'Xếp môi trường của một tác tử theo bốn chiều: quan sát đầy đủ hay một phần, một hay nhiều tác tử, tất định hay ngẫu nhiên, từng hồi hay tuần tự.',
    prereqs: ['peas'],
    lesson: 'env-dims',
    source: 'Buổi 2',
    checks: [
      {
        id: 'env-dims-c1',
        kind: 'classify',
        prompt: 'Xếp loại môi trường của một tác tử chơi cờ vua (không bấm giờ).',
        groups: [],
        items: dimItems({ obs: 0, agents: 1, det: 0, ep: 1 }),
        hint: 'Bàn cờ có giấu gì không? Nước đi của bạn có quyết định chắc chắn thế cờ kế tiếp không?',
        explain: 'Thấy hết bàn cờ: <b>đầy đủ</b>. Có đối thủ: <b>nhiều</b> tác tử. Nước đi quyết định chắc chắn thế cờ kế tiếp: <b>tất định</b>. Nước bây giờ ảnh hưởng ván sau: <b>tuần tự</b>.',
      },
    ],
  },
  {
    id: 'env-classify',
    title: 'Xếp loại môi trường đủ bảy chiều',
    short: '7 chiều',
    can: 'Xếp môi trường của một tác tử theo đủ bảy chiều, thêm tĩnh hay động, rời rạc hay liên tục, biết luật hay chưa, và giải thích từng lựa chọn.',
    prereqs: ['env-dims'],
    lesson: 'env-classify',
    source: 'Buổi 2',
    checks: [
      {
        id: 'env-classify-c1',
        kind: 'classify',
        prompt: 'Xếp loại môi trường của một taxi tự lái theo sáu chiều.',
        groups: [],
        items: dimItems({ obs: 1, agents: 1, det: 1, ep: 1, static: 2, disc: 1 }),
        hint: 'Đây là ví dụ kinh điển của "tình huống ngoài đời thật".',
        explain: 'Lái taxi nằm ở vế khó trên cả sáu chiều: <b>một phần, nhiều, ngẫu nhiên, tuần tự, động, liên tục</b>.',
      },
    ],
  },
]

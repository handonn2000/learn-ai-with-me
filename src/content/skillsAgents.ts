import type { Skill } from '@/learning/types'
import { dimItems } from './agents'

/**
 * Đồ thị kỹ năng — tuyến "Mô tả một agent thông minh" (CSC14003 buổi 2, Lecture02-IntelligentAgents.pdf).
 * Phần cấu trúc agent (bảng tra, năm kiến trúc, agent học) chưa nằm trên tuyến này.
 */
export const agentSkills: Skill[] = [
  {
    id: 'agent',
    title: 'Agent và môi trường',
    short: 'agent',
    can: 'Chỉ ra cảm biến, bộ chấp hành và percept của một agent, và đọc hàm agent như một bảng từ chuỗi percept ra hành động.',
    prereqs: [],
    lesson: 'agent',
    source: 'Buổi 2',
    checks: [
      {
        id: 'agent-c1',
        kind: 'choice',
        prompt: 'Với một robot gắp linh kiện trên băng chuyền, "cánh tay có khớp" là gì?',
        options: ['Cảm biến', 'Bộ chấp hành', 'Percept', 'Một phần của môi trường'],
        answer: [1],
        hint: 'Nó đưa thông tin <i>vào</i> agent, hay tác động <i>ra</i> môi trường?',
        explain: 'Cánh tay tác động lên linh kiện, nên nó là <b>bộ chấp hành</b>. Camera và cảm biến góc khớp mới là cảm biến.',
      },
    ],
  },
  {
    id: 'rationality',
    title: 'Agent duy lý',
    short: 'duy lý',
    can: 'Chọn thước đo hiệu năng chấm trạng thái của môi trường, và xét một hành động có duy lý không dựa trên thước đo, tri thức có sẵn, hành động làm được và chuỗi percept.',
    prereqs: ['agent'],
    lesson: 'rationality',
    source: 'Buổi 2',
    checks: [
      {
        id: 'rationality-c1',
        kind: 'choice',
        prompt: 'Thước đo hiệu năng của một agent nên chấm điểm thứ gì?',
        options: [
          'Chuỗi trạng thái của môi trường mà agent tạo ra',
          'Cách agent cư xử, xem có đúng ý người thiết kế không',
          'Mức agent tự tin vào kết quả của mình',
          'Số hành động agent làm được trong một giờ',
        ],
        answer: [0],
        hint: 'Nhớ luật đặt thước đo: theo thứ bạn muốn có trong môi trường.',
        explain: 'Thước đo chấm <b>chuỗi trạng thái của môi trường</b>. Chấm cách cư xử hay để agent tự chấm thì nó có thể đạt điểm cao mà việc không xong.',
      },
    ],
  },
  {
    id: 'peas',
    title: 'Viết PEAS',
    short: 'PEAS',
    can: 'Viết mô tả PEAS cho một agent: thước đo hiệu năng, môi trường, bộ chấp hành và cảm biến, không đặt nhầm ô.',
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
    can: 'Xếp môi trường của một agent theo bốn chiều: quan sát đầy đủ hay một phần, một hay nhiều agent, tất định hay ngẫu nhiên, từng hồi hay tuần tự.',
    prereqs: ['peas'],
    lesson: 'env-dims',
    source: 'Buổi 2',
    checks: [
      {
        id: 'env-dims-c1',
        kind: 'classify',
        prompt: 'Xếp loại môi trường của một agent chơi cờ vua (không bấm giờ).',
        groups: [],
        items: dimItems({ obs: 0, agents: 1, det: 0, ep: 1 }),
        hint: 'Bàn cờ có giấu gì không? Nước đi của bạn có quyết định chắc chắn thế cờ kế tiếp không?',
        explain: 'Thấy hết bàn cờ: <b>đầy đủ</b>. Có đối thủ: <b>nhiều</b> agent. Nước đi quyết định chắc chắn thế cờ kế tiếp: <b>tất định</b>. Nước bây giờ ảnh hưởng ván sau: <b>tuần tự</b>.',
      },
    ],
  },
  {
    id: 'env-classify',
    title: 'Xếp loại môi trường đủ bảy chiều',
    short: '7 chiều',
    can: 'Xếp môi trường của một agent theo đủ bảy chiều, thêm tĩnh hay động, rời rạc hay liên tục, biết luật hay chưa, và giải thích từng lựa chọn.',
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

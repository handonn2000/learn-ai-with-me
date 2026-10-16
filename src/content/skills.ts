import type { Goal, Skill, SkillId } from '@/learning/types'
import { indexSkills } from '@/learning/graph'
import { goalOfSkill } from '@/learning/goals'
import { city } from './graphs'
import { agentSkills } from './skillsAgents'

/**
 * Đồ thị kỹ năng — Phần II CSC14003 (buổi 3–5), cộng tuyến agent của buổi 2 (`skillsAgents.ts`).
 * Cạnh = tiên quyết thật. BFS và GBFS nằm trên bản đồ nhưng KHÔNG nằm trên đường tới A*:
 * hiểu A* không đòi hỏi biết BFS hay GBFS.
 */
export const skills: Skill[] = [
  {
    id: 'formulate',
    title: 'Mô hình hóa bài toán',
    short: 'mô hình hóa',
    can: 'Viết ra 5 thành phần của một bài toán tìm kiếm: trạng thái đầu, hành động, kết quả của hành động, kiểm tra đích và chi phí đường đi.',
    prereqs: [],
    lesson: 'formulate',
    source: 'Buổi 3',
    checks: [
      {
        id: 'formulate-c1',
        kind: 'choice',
        prompt: 'Bài toán: đi từ nhà tới trường. "Đi từ ngã tư A sang ngã tư C" là thành phần nào?',
        options: ['Trạng thái đầu', 'Hành động', 'Kiểm tra đích', 'Chi phí đường đi'],
        answer: [1],
        hint: 'Nó là thứ bạn <i>làm</i> để đổi từ chỗ này sang chỗ khác.',
        explain: 'Đó là một <b>hành động</b>: từ trạng thái "đang ở A", nó đưa bạn sang trạng thái "đang ở C".',
      },
    ],
  },
  {
    id: 'state-graph',
    title: 'Đọc bản đồ trạng thái',
    short: 'bản đồ',
    can: 'Đọc một bản đồ trạng thái: liệt kê các trạng thái kế tiếp của một nút và tính chi phí của một đường đi.',
    prereqs: ['formulate'],
    lesson: 'state-graph',
    source: 'Buổi 3',
    checks: [
      {
        id: 'state-graph-c1',
        kind: 'number',
        prompt: 'Đường S → B → D → G tốn bao nhiêu phút?',
        problem: city,
        showCosts: true,
        answer: 14,
        unit: 'phút',
        hint: 'Cộng số trên ba cạnh S–B, B–D và D–G.',
        explain: '3 + 4 + 7 = <b>14</b> phút.',
      },
    ],
  },
  {
    id: 'frontier',
    title: 'Mở rộng nút và frontier',
    short: 'frontier',
    can: 'Mở rộng một nút, chỉ ra frontier sau mỗi lần mở rộng và lần theo con trỏ cha để đọc ra đường đi.',
    prereqs: ['state-graph'],
    lesson: 'frontier',
    source: 'Buổi 3',
    checks: [
      {
        id: 'frontier-c1',
        kind: 'pick-nodes',
        prompt: 'Bắt đầu ở S. Mở rộng S xong, frontier gồm những nút nào?',
        problem: city,
        highlight: { current: 'S' },
        answer: ['A', 'B', 'F'],
        hint: 'Mở rộng S = sinh ra mọi nút nối trực tiếp với S.',
        explain: 'S nối với A, B và F. Ba nút này vừa được sinh ra mà chưa mở rộng, nên chúng là frontier.',
      },
    ],
  },
  {
    id: 'graph-search',
    title: 'Tránh lặp với tập explored',
    short: 'explored',
    can: 'Dùng tập explored để bỏ những trạng thái đã gặp, và giải thích vì sao thiếu nó thì việc tìm kiếm có thể lặp mãi.',
    prereqs: ['frontier'],
    lesson: 'graph-search',
    source: 'Buổi 3',
    checks: [
      {
        id: 'graph-search-c1',
        kind: 'pick-nodes',
        prompt:
          'Explored = {S, A}. Frontier = {B, F, C, E}. Giờ mở rộng B (nối với S, C, D). Nút nào được <b>thêm mới</b> vào frontier?',
        problem: city,
        highlight: { explored: ['S', 'A'], frontier: ['F', 'C', 'E'], current: 'B' },
        answer: ['D'],
        hint: 'Bỏ nút đã ở trong explored, và bỏ nút đã có sẵn trong frontier.',
        explain: 'S đã ở explored, C đã ở frontier. Chỉ <b>D</b> là trạng thái mới.',
      },
    ],
  },
  {
    id: 'priority-queue',
    title: 'Hàng đợi ưu tiên',
    short: 'hàng đợi',
    can: 'Mô phỏng hàng đợi ưu tiên: biết phần tử nào được lấy ra trước, kể cả khi hai khóa bằng nhau.',
    prereqs: [],
    lesson: 'priority-queue',
    source: 'Buổi 4',
    checks: [
      {
        id: 'priority-queue-c1',
        kind: 'order',
        prompt:
          'Hàng đợi ưu tiên đang chứa C:6, E:10, B:3, F:3 (số là khóa). Hòa khóa thì chữ cái đứng trước ra trước. Xếp theo thứ tự được lấy ra.',
        items: ['C', 'E', 'B', 'F'],
        answer: ['B', 'F', 'C', 'E'],
        hint: 'Khóa nhỏ nhất ra trước. B và F cùng khóa 3.',
        explain: 'B (3) và F (3) hòa, B đứng trước theo bảng chữ cái. Sau đó C (6), cuối cùng E (10).',
      },
    ],
  },
  {
    id: 'bfs',
    title: 'Tìm kiếm theo chiều rộng (BFS)',
    short: 'BFS',
    can: 'Chạy tay BFS với hàng đợi vào trước ra trước, và giải thích vì sao BFS ra đường ít chặng nhất chứ chưa chắc rẻ nhất.',
    prereqs: ['graph-search'],
    source: 'Buổi 4',
    checks: [
      {
        id: 'bfs-c1',
        kind: 'choice',
        prompt: 'BFS chọn nút để mở rộng theo quy tắc nào?',
        options: ['Nút có g(n) nhỏ nhất', 'Nút vào frontier sớm nhất', 'Nút vào frontier muộn nhất', 'Nút có h(n) nhỏ nhất'],
        answer: [1],
        hint: 'Frontier của BFS là một hàng đợi bình thường.',
        explain: 'Frontier của BFS là hàng đợi <b>vào trước ra trước</b> (FIFO), nên các nút nông được mở rộng trước.',
      },
    ],
  },
  {
    id: 'ucs',
    title: 'Tìm kiếm chi phí đều (UCS)',
    short: 'UCS',
    can: 'Chạy tay UCS: luôn lấy ra nút có g(n) nhỏ nhất, chỉ dừng khi lấy đích ra, và cập nhật khi thấy đường rẻ hơn.',
    prereqs: ['graph-search', 'priority-queue'],
    lesson: 'ucs',
    source: 'Buổi 4',
    checks: [
      {
        id: 'ucs-c1',
        kind: 'choice',
        prompt: 'Frontier của UCS đang có D: 7, E: 9, G: 13. G là đích. UCS làm gì tiếp?',
        options: [
          'Dừng ngay, trả về đường tới G với chi phí 13',
          'Lấy D ra mở rộng, vì 7 nhỏ nhất',
          'Lấy G ra trước, vì G là đích',
          'Lấy E ra, vì E gần G nhất',
        ],
        answer: [1],
        hint: 'UCS chỉ dừng khi đích được <i>lấy ra</i> khỏi frontier.',
        explain: 'G mới nằm trong frontier, chưa được lấy ra. UCS vẫn lấy nút có g nhỏ nhất là <b>D</b>. Có thể còn đường tới G rẻ hơn 13.',
      },
    ],
  },
  {
    id: 'heuristic',
    title: 'Hàm heuristic h(n)',
    short: 'h(n)',
    can: 'Giải thích h(n) là ước lượng chi phí còn lại từ n tới đích, đọc h trên bản đồ, và biết h(đích) = 0.',
    prereqs: ['state-graph'],
    lesson: 'heuristic',
    source: 'Buổi 5',
    checks: [
      {
        id: 'heuristic-c1',
        kind: 'choice',
        prompt: 'Điểm khác nhau giữa g(n) và h(n) là gì?',
        options: [
          'g(n) là chi phí đã đi từ đầu tới n; h(n) là ước lượng phần còn lại từ n tới đích',
          'g(n) là ước lượng; h(n) là chi phí thật',
          'g(n) đo số chặng; h(n) đo số phút',
          'Hai cái như nhau, chỉ khác tên',
        ],
        answer: [0],
        hint: 'Một cái nhìn về phía sau, một cái nhìn về phía trước.',
        explain: '<b>g</b> là quãng đã đi (biết chắc). <b>h</b> là phỏng đoán quãng còn lại.',
      },
    ],
  },
  {
    id: 'gbfs',
    title: 'Tìm kiếm tham lam (GBFS)',
    short: 'GBFS',
    can: 'Chạy tay GBFS với f(n) = h(n), và chỉ ra một trường hợp nó trả về đường không rẻ nhất.',
    prereqs: ['heuristic', 'graph-search', 'priority-queue'],
    source: 'Buổi 5',
    checks: [
      {
        id: 'gbfs-c1',
        kind: 'choice',
        prompt: 'GBFS chọn nút có giá trị nào nhỏ nhất?',
        options: ['g(n)', 'h(n)', 'g(n) + h(n)', 'Độ sâu'],
        answer: [1],
        hint: 'Tham lam = chỉ nhìn về phía trước.',
        explain: 'GBFS dùng f(n) = <b>h(n)</b>: nút trông gần đích nhất được mở rộng trước.',
      },
    ],
  },
  {
    id: 'astar',
    title: 'Chạy tay A*',
    short: 'A*',
    can: 'Chạy tay A* với f(n) = g(n) + h(n) và chỉ ra nút được mở rộng tiếp theo.',
    prereqs: ['ucs', 'heuristic'],
    lesson: 'astar',
    source: 'Buổi 5',
    checks: [
      {
        id: 'astar-c1',
        kind: 'number',
        prompt: 'Đi S → A → C. Với nút C trên đường này, f(C) bằng bao nhiêu?',
        problem: city,
        showCosts: true,
        showH: true,
        answer: 10,
        hint: 'g(C) = tổng hai cạnh S–A và A–C. h(C) đọc trên bản đồ.',
        explain: 'g(C) = 3 + 3 = 6, h(C) = 4, nên f(C) = <b>10</b>.',
      },
    ],
  },
  {
    id: 'admissible',
    title: 'Khi nào A* chắc chắn đúng',
    short: 'đúng?',
    can: 'Kiểm tra một heuristic có admissible (không bao giờ ước lượng quá chi phí thật) không, và giải thích vì sao điều đó giúp A* ra đường rẻ nhất.',
    prereqs: ['astar'],
    lesson: 'admissible',
    source: 'Buổi 5',
    checks: [
      {
        id: 'admissible-c1',
        kind: 'choice',
        prompt: 'Gọi h*(n) là chi phí thật rẻ nhất từ n tới đích. Heuristic nào <b>không</b> admissible?',
        options: ['h(n) = 0', 'h(n) = h*(n)', 'h(n) = max(2, h*(n))', 'h(n) = min(2, h*(n))'],
        answer: [2],
        hint: 'Thử ngay tại đích, nơi h*(đích) = 0.',
        explain: 'Tại đích h* = 0 nhưng max(2, 0) = 2 > 0: nó <b>nói quá</b>. Ba cái còn lại luôn ≤ h*.',
      },
    ],
  },
  ...agentSkills,
]

export const skillIndex = indexSkills(skills)

/** Thứ tự = thứ tự gợi ý khi người học chưa theo mục tiêu nào: agent (buổi 2) trước A* (buổi 3–5). */
export const goals: Goal[] = [
  {
    id: 'peas',
    title: 'Mô tả một agent thông minh',
    outcome: 'Viết PEAS cho một agent và xếp loại môi trường của nó theo bảy chiều.',
    target: 'env-classify',
  },
  {
    id: 'astar',
    title: 'Hiểu A*',
    outcome: 'Chạy tay A* trên một bản đồ và giải thích khi nào nó chắc chắn tìm ra đường rẻ nhất.',
    target: 'admissible',
  },
]

export const goalIndex = Object.fromEntries(goals.map((g) => [g.id, g]))

/** Mục tiêu chứa kỹ năng này; kỹ năng không thuộc tuyến nào (BFS, GBFS) thì lấy mục tiêu đầu. */
export const goalOf = (id: SkillId): Goal => goalOfSkill(goals, skillIndex, id) ?? goals[0]

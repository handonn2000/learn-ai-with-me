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
        prompt: 'Bạn đặt thước đo hiệu năng cho một máy lọc không khí trong phòng ngủ. Thước đo nào đúng luật?',
        options: [
          'Lượng bụi mịn trong không khí của phòng ở mỗi giờ',
          'Máy hiện chữ "Không khí trong phòng đã sạch" bao nhiêu lần',
          'Số giờ quạt của máy chạy hết công suất',
          'Máy có chuyển chế độ đúng lịch người dùng đặt không',
        ],
        answer: [0],
        hint: 'Có hai cách đặt thước đo dễ sai: chấm cách agent làm, và để agent tự chấm mình. Loại từng phương án theo hai cách đó.',
        explain: 'Chỉ <b>lượng bụi mịn trong phòng</b> là trạng thái của môi trường. Dòng chữ trên màn hình là máy tự chấm mình; giờ chạy quạt và đổi chế độ là cách máy làm. Cả ba đều đạt điểm cao được mà phòng vẫn bụi.',
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
        prompt: 'PEAS của một robot cắt cỏ trong vườn. Gán mỗi mục vào đúng chữ.',
        groups: ['P · thước đo', 'E · môi trường', 'A · bộ chấp hành', 'S · cảm biến'],
        items: [
          { text: 'Cỏ cắt đều, đúng độ cao, không cán vào bồn hoa', group: 0 },
          { text: 'Tốn ít điện', group: 0 },
          { text: 'Bãi cỏ, bồn hoa, vòi tưới', group: 1 },
          { text: 'Cơn mưa bất chợt', group: 1 },
          { text: 'Lưỡi cắt và bánh xe', group: 2 },
          { text: 'Còi báo khi bị nhấc lên', group: 2 },
          { text: 'Cảm biến mưa', group: 3 },
          { text: 'GPS và cảm biến va chạm', group: 3 },
        ],
        hint: 'Hỏi từng mục: nó là kết quả cần chấm, thứ ở ngoài robot, hay bộ phận của robot? Nếu là bộ phận, nó đưa thông tin vào hay tác động ra?',
        explain: 'Cơn mưa ở ngoài robot, thuộc <b>E</b>. Cảm biến mưa là bộ phận robot dùng để nhận biết cơn mưa, thuộc <b>S</b>. Lưỡi cắt và bánh xe tác động ra vườn (<b>A</b>); cỏ cắt đều là kết quả cần chấm (<b>P</b>).',
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
        prompt: 'Xếp loại môi trường của một agent chơi Tetris: các mảnh gạch rơi xuống từng cái một, agent xoay và đặt mảnh cho khít, mảnh tiếp theo là mảnh nào thì do máy bốc ngẫu nhiên.',
        groups: [],
        items: dimItems({ obs: 0, agents: 0, det: 1, ep: 1 }),
        hint: 'Tách chiều 1 khỏi chiều 3: lúc này agent có thấy hết bảng không, và trạng thái kế tiếp có do riêng hành động của nó quyết định không?',
        explain: 'Bảng và mảnh đang rơi hiện hết: <b>đầy đủ</b>. Không ai khác chơi cùng: <b>một</b> agent. Mảnh kế tiếp do máy bốc ngẫu nhiên: <b>ngẫu nhiên</b>, dù thấy hết bảng. Đặt mảnh này chỗ nào quyết định chỗ trống cho các mảnh sau: <b>tuần tự</b>.',
      },
    ],
  },
  {
    id: 'env-classify',
    title: 'Xếp loại môi trường đủ bảy chiều',
    short: '7 chiều',
    can: 'Xếp môi trường của một agent theo đủ bảy chiều, thêm tĩnh, nửa động hay động, rời rạc hay liên tục, biết luật hay chưa, và giải thích từng lựa chọn.',
    prereqs: ['env-dims'],
    lesson: 'env-classify',
    source: 'Buổi 2',
    checks: [
      {
        id: 'env-classify-c1',
        kind: 'classify',
        prompt: 'Xếp loại môi trường theo sáu chiều cho một agent chơi trò trượt số trên điện thoại: tám mảnh số trong khung 3 × 3, mỗi lượt trượt một mảnh vào ô trống, xếp xong càng nhanh thì điểm càng cao.',
        groups: [],
        items: dimItems({ obs: 0, agents: 0, det: 0, ep: 1, static: 1, disc: 0 }),
        hint: 'Đi từng chiều, mỗi chiều hỏi đúng câu hỏi của nó. Chiều dễ chọn sai nhất ở đây là chiều thời gian.',
        explain: 'Thấy hết khung: <b>đầy đủ</b>. Chơi một mình: <b>một</b> agent. Trượt mảnh nào thì khung thành đúng như thế: <b>tất định</b>. Mỗi lần trượt đổi các nước đi sau: <b>tuần tự</b>. Khung đứng yên chờ, nhưng điểm giảm theo thời gian: <b>nửa động</b>. Số cách xếp và số nước đi đếm được: <b>rời rạc</b>.',
      },
    ],
  },
]

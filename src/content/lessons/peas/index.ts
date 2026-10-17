import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
const S1 = lazy(() => import('./1.mdx'))
const S2 = lazy(() => import('./2.mdx'))

const PEAS = ['P · thước đo', 'E · môi trường', 'A · bộ chấp hành', 'S · cảm biến']

export const lesson: Lesson = {
  id: 'peas',
  skill: 'peas',
  minutes: 12,
  steps: [
    {
      kind: 'guess',
      data: {
        prompt: 'Hệ chẩn đoán y khoa hiện câu hỏi và kết quả chẩn đoán lên màn hình. Trong PEAS, màn hình nằm ở chữ nào?',
        options: [
          { title: 'S · cảm biến (sensor)', note: 'đó là chỗ hệ thống và người dùng gặp nhau' },
          { title: 'A · bộ chấp hành (actuator)', note: 'hệ thống dùng nó để tác động ra ngoài' },
        ],
        answer: 1,
        right: 'Màn hình là thứ hệ thống dùng để "làm ra": hiện câu hỏi, xét nghiệm, chẩn đoán. Thứ nó nhận vào là bàn phím.',
        wrong: 'Màn hình chỉ đưa thông tin ra, nên nó là bộ chấp hành. Thứ hệ thống nhận vào là bàn phím: triệu chứng, kết quả khám, câu trả lời của bệnh nhân.',
        wrongSure: 'Màn hình và bàn phím là cặp hay bị đảo nhất khi viết PEAS, nên ý này sẽ quay lại sớm hơn.',
      },
    },
    { kind: 'explain', title: 'Bốn chữ cái trước dòng code đầu tiên', Body: S1 },
    { kind: 'explain', title: 'Cùng khuôn, năm agent khác', Body: S2 },
    {
      kind: 'exercise',
      exercise: {
        id: 'peas-e1',
        kind: 'classify',
        prompt: 'Viết PEAS cho một drone phun thuốc trên ruộng lúa. Gán mỗi mục vào đúng chữ.',
        groups: PEAS,
        items: [
          { text: 'Lúa hết sâu', group: 0 },
          { text: 'Tốn ít thuốc và ít pin', group: 0 },
          { text: 'Ruộng lúa, cây cao, trạm sạc', group: 1 },
          { text: 'Gió', group: 1 },
          { text: 'Người nông dân đứng trên bờ ruộng', group: 1 },
          { text: 'Cánh quạt', group: 2 },
          { text: 'Vòi phun', group: 2 },
          { text: 'Camera, GPS', group: 3 },
          { text: 'Cảm biến mức pin', group: 3 },
        ],
        hint: 'P chấm kết quả, E là thứ ở ngoài drone, A là thứ drone dùng để tác động, S là thứ drone dùng để nhận biết.',
        explain: 'Để ý <b>gió</b> và <b>người nông dân</b> nằm ở E: drone không điều khiển được hai thứ này, nhưng phải tính tới. Pin xuất hiện hai lần: "tốn ít pin" là kết quả cần chấm (P), "cảm biến mức pin" là thứ drone nhìn qua (S).',
      },
      label: 'Viết PEAS cho một agent mới',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'peas-e2',
        kind: 'classify',
        prompt: 'Một bạn viết PEAS cho taxi tự lái nhưng đặt nhầm từng mục dưới đây. Mục đó thật ra thuộc chữ nào?',
        groups: PEAS,
        items: [
          { text: 'Ghi ở P: "Phanh gấp khi có người qua đường"', group: 2 },
          { text: 'Ghi ở E: "Camera trước xe"', group: 3 },
          { text: 'Ghi ở S: "Màn hình báo giá cho khách"', group: 2 },
          { text: 'Ghi ở A: "Khách tới đúng chỗ"', group: 0 },
          { text: 'Ghi ở S: "Người đi bộ"', group: 1 },
        ],
        hint: 'Soát bốn chỗ hay nhầm: kết quả hay hành động, bộ phận của agent hay thứ bên ngoài, đưa vào hay đưa ra.',
        explain: 'Phanh và màn hình là thứ taxi làm ra (<b>A</b>). Camera là thứ nó nhìn qua (<b>S</b>). Khách tới đúng chỗ là kết quả cần chấm (<b>P</b>). Người đi bộ ở ngoài xe, thuộc <b>E</b>.',
      },
      label: 'Sửa mục đặt nhầm ô',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'peas-e3',
        kind: 'choice',
        prompt: 'Bạn viết P cho robot lau sàn là "Lau theo hình zíc zắc từng hàng". Chỗ sai là gì?',
        options: [
          'Đó là cách robot làm; P phải chấm kết quả trong môi trường, như sàn sạch và khô',
          'Thiếu đơn vị đo',
          'Mục này phải đặt ở S',
          'Không sai, vì lau zíc zắc thì sàn sẽ sạch',
        ],
        answer: [0],
        hint: 'Nhớ lại luật đặt thước đo ở ga agent duy lý.',
        explain: 'Lau zíc zắc là đoán hộ cách làm. Robot có thể lau zíc zắc rất đẹp mà sàn vẫn bẩn. P nên là <b>sàn sạch</b>, có thể thêm tốn ít nước, ít điện.',
      },
      label: 'Viết P bằng kết quả',
    },
    {
      kind: 'paper',
      data: {
        title: 'Viết PEAS cho người đi tìm trong trò trốn tìm.',
        minutes: 4,
        steps: [
          'Đề: Một cậu bé chơi trốn tìm với bạn trên sân chơi. Cậu là người đi tìm, phải tìm ra hết các bạn đi trốn, và hô "Thấy rồi!" mỗi lần tìm ra một người.',
          'Kẻ bốn cột P, E, A, S. Mỗi cột ghi ít nhất hai mục.',
          'Soát bốn chỗ hay nhầm, rồi mới mở đáp án gợi ý.',
        ],
        reference: [
          '<b>P</b>: tìm ra hết các bạn đi trốn; tìm hết càng nhanh càng tốt; hô đúng mỗi lần tìm thấy.',
          '<b>E</b>: sân chơi, các chỗ nấp (cầu tuột, gốc cây, bụi rậm), các bạn đi trốn.',
          '<b>A</b>: chân để đi, chạy; tay để vạch bụi cây, mở chỗ nấp; giọng để hô "Thấy rồi!".',
          '<b>S</b>: mắt; tai để nghe tiếng động, tiếng cười khúc khích của bạn đang trốn.',
        ],
      },
    },
  ],
}

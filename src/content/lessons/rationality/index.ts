import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
const S1 = lazy(() => import('./1.mdx'))
const S2 = lazy(() => import('./2.mdx'))
const S3 = lazy(() => import('./3.mdx'))

export const lesson: Lesson = {
  id: 'rationality',
  skill: 'rationality',
  minutes: 10,
  steps: [
    {
      kind: 'guess',
      data: {
        prompt: 'Bạn thuê robot dọn nhà và chấm điểm nó theo một trong hai cách. Cách nào an toàn hơn?',
        options: [
          { title: 'Lượng rác hút được trong một ca 8 tiếng', note: 'hút càng nhiều, điểm càng cao' },
          { title: 'Số ô sạch ở mỗi thời điểm', note: 'sàn càng sạch, điểm càng cao' },
        ],
        answer: 1,
        right: 'Chấm theo lượng rác thì robot có thể hút rác, đổ ra sàn, rồi hút lại: điểm tăng mãi mà nhà vẫn bẩn. Chấm số ô sạch thì chỉ có một cách lên điểm là làm sàn sạch thật.',
        wrong: 'Nghe hợp lý, nhưng robot có thể hút rác, đổ ra sàn, rồi hút lại: điểm tăng mãi mà nhà không sạch hơn. Chấm thẳng vào thứ bạn muốn là sàn sạch thì không lách được.',
        wrongSure: 'Đây là cái bẫy người đặt thước đo hay rơi vào nhất, nên ý này sẽ quay lại sớm hơn.',
      },
    },
    { kind: 'explain', title: 'Chấm kết quả, đừng chấm dáng điệu', Body: S1 },
    { kind: 'explain', title: 'Bốn thứ quyết định duy lý', Body: S2 },
    { kind: 'explain', title: 'Duy lý không phải biết trước', Body: S3 },
    {
      kind: 'exercise',
      exercise: {
        id: 'rationality-e1',
        kind: 'classify',
        prompt: 'Taxi tự lái. Mỗi thông tin dưới đây thuộc thứ nào trong bốn thứ quyết định một hành động có duy lý không?',
        groups: ['Thước đo', 'Tri thức có sẵn', 'Hành động làm được', 'Chuỗi percept'],
        items: [
          { text: 'Khách tới đúng chỗ, nhanh, an toàn', group: 0 },
          { text: 'Càng ít lỗi vi phạm luật giao thông càng tốt', group: 0 },
          { text: 'Bản đồ thành phố cài sẵn từ trước', group: 1 },
          { text: 'Luật giao thông đã nạp vào từ trước', group: 1 },
          { text: 'Đánh lái, tăng ga, phanh', group: 2 },
          { text: 'Bật xi-nhan, bấm còi', group: 2 },
          { text: 'Camera vừa thấy đèn chuyển đỏ', group: 3 },
          { text: 'Ba giây trước, camera thấy xe phía trước phanh gấp', group: 3 },
        ],
        hint: 'Hỏi từng mục: đây là tiêu chí chấm, điều biết từ trước khi chạy, việc làm được, hay điều thấy được trong lúc chạy?',
        explain: 'Hai mục về luật giao thông khác nhau: "ít vi phạm" là tiêu chí chấm, "luật đã nạp" là tri thức có sẵn. Đủ bốn thứ thì mới xét được hành động có duy lý không. Thiếu thước đo thì không biết "tốt" là gì; thiếu chuỗi percept thì không biết taxi đang đứng trước tình huống nào.',
      },
      label: 'Tách bốn thứ quyết định duy lý',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'rationality-e2',
        kind: 'classify',
        prompt: 'Mỗi thước đo dưới đây chấm thứ bạn muốn có trong môi trường, hay chấm việc bạn nghĩ agent nên làm?',
        groups: ['Thứ muốn có trong môi trường', 'Việc nghĩ agent nên làm'],
        items: [
          { text: 'Robot hút bụi: số ô sạch ở mỗi bước', group: 0 },
          { text: 'Robot hút bụi: lượng rác hút được', group: 1 },
          { text: 'Gia sư tiếng Anh: điểm thi của học viên', group: 0 },
          { text: 'Gia sư tiếng Anh: số bài tập đã giao', group: 1 },
          { text: 'Robot gắp linh kiện: tỉ lệ linh kiện vào đúng thùng', group: 0 },
        ],
        hint: 'Hỏi: agent có thể đạt điểm cao ở thước đo này mà thứ bạn thật sự muốn vẫn không xảy ra không?',
        explain: 'Lượng rác hút được và số bài tập đã giao đều tăng được mà nhà không sạch hơn, học viên không giỏi hơn. Ba thước đo còn lại chấm thẳng vào kết quả bạn muốn.',
      },
      label: 'Đặt thước đo theo thứ muốn có',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'rationality-e3',
        kind: 'choice',
        prompt: 'Robot giao hàng chọn con đường thường vắng nhất theo mọi dữ liệu nó có. Hôm đó, một vụ va quẹt vừa xảy ra làm tắc đường, hàng tới trễ. Robot có duy lý không?',
        options: [
          'Không, vì kết quả xấu',
          'Có, vì nó chọn hành động tốt nhất theo những gì nó biết và thấy được tới lúc đó',
          'Không, vì agent duy lý phải biết trước vụ va quẹt',
          'Chưa nói được, vì không biết robot nhìn thấy được những gì',
        ],
        answer: [1],
        hint: 'Duy lý là cao nhất <i>theo kỳ vọng</i>, dựa trên chuỗi percept tới thời điểm chọn.',
        explain: 'Biết trước vụ va quẹt là <b>toàn tri</b>, không ai làm được. Robot đã chọn tốt nhất với những gì nó có, nên nó vẫn duy lý dù kết quả không như ý.',
      },
      label: 'Phân biệt duy lý với toàn tri',
    },
    {
      kind: 'paper',
      data: {
        title: 'Đặt thước đo cho một ứng dụng gợi ý video.',
        minutes: 3,
        steps: [
          'Viết một thước đo chấm cách agent làm, rồi chỉ ra cách nó có thể đạt điểm cao mà người xem không vui hơn.',
          'Viết lại thước đo đó sao cho nó chấm thứ bạn thật sự muốn có trong môi trường.',
          'Gạch chân chỗ trong thước đo mới mà agent khó lách nhất.',
        ],
        reference: [
          'Thước đo chấm cách làm: <b>số video được bấm vào</b>. Cách lách: gợi ý tiêu đề giật gân, người xem bấm vào rồi thoát ngay.',
          'Thước đo chấm môi trường: <b>người xem xem hết video và quay lại vào hôm sau</b>, hoặc tự chấm hài lòng sau khi xem.',
          'Thước đo nào cũng có thể bị lách. Chấm càng gần thứ bạn thật sự muốn thì càng khó lách.',
        ],
      },
    },
  ],
}

/**
 * DỮ LIỆU MẪU cho hai bước mới của buổi học: đoán trước (docs/design/screens/12) và làm trên giấy (14).
 * Nội dung thật theo từng ga chưa có; tạm dùng ga 6 (UCS) như trong thiết kế. Không ghi vào tiến độ.
 */
import type { GuessData, PaperData } from '@/learning/types'

export const guessMock: GuessData = {
  prompt: 'UCS vừa thêm đích G vào frontier với g = 10. Trong frontier vẫn còn một nút khác có g = 8. UCS có dừng ngay không?',
  options: [{ title: 'Dừng ngay', note: 'Vì đã thấy đích' }, { title: 'Chưa dừng', note: 'Đợi G được lấy ra khỏi frontier' }],
  answer: 1,
  right: 'UCS luôn lấy nút có g nhỏ nhất. Nút g = 8 còn có thể dẫn tới G rẻ hơn 10, nên chỉ khi G được lấy ra mới chắc.',
  wrong: 'Thấy đích chưa phải là xong. Nút g = 8 còn có thể dẫn tới G rẻ hơn 10, nên UCS chỉ dừng khi G được lấy ra khỏi frontier.',
  wrongSure: 'Bạn chọn Rất chắc nhưng chưa đúng. Đây là chỗ hay nhầm nhất, nên nó sẽ quay lại sớm hơn.',
}

export const paperMock: PaperData = {
  title: 'Hệ thống lại trên giấy',
  minutes: 3,
  steps: [
    'Lấy một tờ giấy trắng, chép lại bản đồ thành phố bằng tay.',
    'Chạy UCS: ghi frontier và g(n) sau mỗi lần mở rộng.',
    'Dừng khi G được lấy ra khỏi frontier, rồi nhập chi phí cuối cùng của bạn.',
  ],
  resultLabel: 'Chi phí đường đi cuối cùng',
  unit: 'phút',
}

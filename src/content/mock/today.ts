/**
 * DỮ LIỆU MẪU cho màn Hôm nay (docs/design/screens/01). Chưa có dữ liệu thật cho các khối này;
 * khi có thì thay bằng store rồi xoá file này.
 */
export const todayMock = {
  /** "5 ngày học liền": chưa theo dõi ngày học. */
  streakDays: 5,
  /** "Chắc chắn có đúng không": lịch sử chọn "Rất chắc" trong tuần. */
  calibration: { sure: 10, right: 7, wrong: 3, weakSpot: 'UCS dừng khi nào' },
  /** "Sổ tay": sketch gần nhất và ảnh trang giấy. */
  notebook: { sketchTitle: 'Frontier và explored', photoLabel: 'Ảnh trang giấy của bạn · 10/10' },
  /** "Mục tiêu gợi ý tiếp theo": chưa có đồ thị mục tiêu thứ hai. */
  nextGoal: { title: 'Chọn đúng thuật toán tìm kiếm' },
  /** Hai bước mới của buổi học chưa dựng (đoán trước, làm trên giấy). */
  guessMinutes: 2,
  paperMinutes: 3,
}

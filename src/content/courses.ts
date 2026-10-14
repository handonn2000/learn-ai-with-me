/**
 * Khóa học → mục tiêu → đường mòn. "Mô tả một tác tử thông minh" (`goalId: 'peas'`) và "Hiểu A*" (`goalId: 'astar'`)
 * có dữ liệu học thật: số ga, số sketch lấy từ tuyến (`useCourseProgress`). Các mục tiêu còn lại là dữ liệu mẫu.
 * Toạ độ `layout` lấy từ docs/design/sketch-maps/coursemap.js (khung 780×1000).
 */
export interface CourseGoal {
  id: string
  /** Chữ ngắn trong đĩa ga trên bản đồ. */
  badge: string
  title: string
  /** Tên ngắn hơn cho nhãn trên bản đồ. */
  short?: string
  /** Tên dùng khi nhắc tới mục tiêu này như ga phụ trên bản đồ mục tiêu khác. */
  sideName?: string
  blurb: string
  trail: string
  /** Mục tiêu có dữ liệu thật trong `skills.ts` (`goals`). */
  goalId?: string
  /** Tên mục tiêu mà các ga của mục tiêu này được tính nhờ (hiện ở nhãn lý do). */
  sharedFrom?: string
  /** Mẫu: tổng số ga / sketch và phần đã xong (chỉ dùng khi không có `goalId`). */
  ga: number
  gaDone: number
  sketches: number
  sketchesOpen: number
  layout?: { x: number; y: number; d?: number; fs?: number; label: { x: number; y: number; w: number; align?: 'right' } }
}

export interface Trail {
  id: string
  title: string
  /** Màu chữ tên vùng trên bản đồ. */
  color: string
  at?: { x: number; y: number; rotate: number }
}

export interface Course {
  id: string
  title: string
  code?: string
  /** Dòng phụ ở đầu mục khóa trên màn Khóa học. */
  caption: string
  finalGoal: string
  finalNote: string
  /** Gạch đầu dòng "Lên tới đỉnh nghĩa là". */
  summit: string[]
  /** Tổng sketch của khóa (0 nếu chưa có sketch) và số đã mở (mẫu). */
  totalSketches: number
  openSketches: number
  trails: Trail[]
  goals: CourseGoal[]
  hasMap: boolean
}

const g = (id: string, badge: string, title: string, blurb: string, trail: string, ga: number, sk: number, extra: Partial<CourseGoal> = {}): CourseGoal => ({
  id, badge, title, blurb, trail, ga, gaDone: 0, sketches: sk, sketchesOpen: 0, ...extra,
})

export const courses: Course[] = [
  {
    id: 'csc14003',
    title: 'Cơ sở Trí tuệ Nhân tạo',
    code: 'CSC14003',
    caption: 'CSC14003',
    finalGoal: 'Sẵn sàng thi cuối kỳ',
    finalNote: 'Ba đường mòn đều dẫn lên đỉnh. Đi đường nào trước cũng được.',
    summit: ['Làm đề tổng hợp 90 phút, mỗi phần từ 7 điểm', 'Đã ôn xen kẽ cả 11 mục tiêu'],
    totalSketches: 160,
    openSketches: 19,
    hasMap: true,
    trails: [
      { id: 'search', title: 'Tìm kiếm', color: '#6E8A5E', at: { x: 30, y: 880, rotate: -6 } },
      { id: 'logic', title: 'Suy luận', color: '#8C7448', at: { x: 500, y: 640, rotate: 4 } },
      { id: 'ml', title: 'Học máy', color: '#5E7699', at: { x: 660, y: 276, rotate: -5 } },
    ],
    goals: [
      g('peas', 'PEAS', 'Mô tả một tác tử thông minh', 'Viết PEAS cho một tác tử và xếp loại môi trường của nó.', 'start', 5, 12, { goalId: 'peas', short: 'Mô tả tác tử', layout: { x: 390, y: 905, label: { x: 430, y: 890, w: 170 } } }),
      g('astar', 'A*', 'Hiểu A*', 'Chạy tay A* và giải thích khi nào nó chắc chắn ra đường rẻ nhất.', 'search', 9, 23, { goalId: 'astar', sketchesOpen: 11, layout: { x: 215, y: 790, d: 66, fs: 22, label: { x: 170, y: 762, w: 160, align: 'right' } } }),
      g('algo-choice', 'BFS', 'Chọn đúng thuật toán tìm kiếm', 'So BFS, DFS, IDS và UCS về độ đầy đủ, tính tối ưu, thời gian và bộ nhớ.', 'search', 8, 19, { gaDone: 5, sketchesOpen: 9, sideName: 'Chọn đúng thuật toán', sharedFrom: 'Hiểu A*', layout: { x: 110, y: 660, label: { x: 150, y: 640, w: 150 } } }),
      g('csp', 'CSP', 'Giải bài toán ràng buộc', 'Đưa bài tô màu bản đồ về dạng CSP và giải bằng quay lui có kiểm tra trước.', 'search', 7, 16, { layout: { x: 215, y: 530, label: { x: 170, y: 512, w: 150, align: 'right' } } }),
      g('alphabeta', 'α–β', 'Chọn nước đi trong trò chơi', 'Chạy tay minimax và cắt tỉa α–β trên một cây trò chơi.', 'search', 6, 14, { layout: { x: 110, y: 405, label: { x: 150, y: 385, w: 140 } } }),
      g('local', 'Leo<br>đồi', 'Tối ưu bằng tìm kiếm cục bộ', 'Leo đồi, ủ mô phỏng và giải thuật di truyền cho bài N-hậu.', 'search', 6, 13, { layout: { x: 215, y: 285, fs: 13, label: { x: 170, y: 266, w: 150, align: 'right' } } }),
      g('kb', 'KB', 'Chứng minh từ cơ sở tri thức', 'Bảng chân trị, resolution, suy diễn tiến và lùi.', 'logic', 8, 18, { layout: { x: 420, y: 760, label: { x: 380, y: 742, w: 120, align: 'right' } } }),
      g('fol', 'FOL', 'Dịch sang logic bậc nhất', 'Viết câu tiếng Việt thành công thức có vị từ và lượng từ.', 'logic', 6, 12, { layout: { x: 360, y: 600, label: { x: 400, y: 582, w: 150 } } }),
      g('bayes', 'Bayes', 'Tính xác suất bằng mạng Bayes', 'Đọc một mạng Bayes và tính một xác suất có điều kiện.', 'logic', 7, 15, { layout: { x: 420, y: 440, fs: 14, label: { x: 460, y: 422, w: 160 } } }),
      g('id3', 'ID3', 'Dựng cây quyết định', 'Chọn thuộc tính bằng information gain, dựng cây ID3 bằng tay.', 'ml', 6, 13, { layout: { x: 650, y: 700, label: { x: 610, y: 680, w: 130, align: 'right' } } }),
      g('perceptron', 'Perc', 'Huấn luyện perceptron', 'Chạy tay vài vòng cập nhật trọng số của perceptron.', 'ml', 5, 11, { layout: { x: 660, y: 470, fs: 15, label: { x: 622, y: 476, w: 130, align: 'right' } } }),
    ],
  },
  {
    id: 'de-foundation',
    title: 'Data Engineering Foundation',
    caption: 'Một bộ dữ liệu đơn hàng',
    finalGoal: 'Dự án cuối: pipeline đơn hàng',
    finalNote: 'Ba đường mòn cùng dẫn tới dự án cuối.',
    summit: ['Chạy lại pipeline từ đầu cho ra cùng một kết quả', 'Có kiểm tra chất lượng ở mỗi lớp lưu trữ'],
    totalSketches: 0,
    openSketches: 0,
    hasMap: false,
    trails: [
      { id: 'base', title: 'Nền tảng', color: '#6E8A5E' },
      { id: 'ingest', title: 'Thu nhận', color: '#8C7448' },
      { id: 'store', title: 'Lưu trữ', color: '#5E7699' },
    ],
    goals: [
      g('csv', 'CSV', 'Từ file CSV tới bảng truy vấn được', 'Nạp file vào cơ sở dữ liệu, chạy lại nhiều lần không bị trùng.', 'base', 6, 0),
      g('events', 'Kafka', 'Đưa sự kiện đơn hàng vào hệ thống', 'Dùng Kafka và CDC để đơn hàng không mất, không trùng khi chạy lại.', 'ingest', 7, 0),
      g('layers', 'Lớp', 'Thiết kế các lớp lưu trữ', 'Chia dữ liệu đơn hàng thành bronze, silver, gold với chủ sở hữu và thời hạn lưu.', 'store', 6, 0),
      g('de4', 'DQ', 'Kiểm tra chất lượng dữ liệu', 'Viết các luật kiểm tra và quyết định khi nào dừng pipeline.', 'base', 6, 0),
      g('de5', 'Lịch', 'Lên lịch và chạy lại pipeline', 'Điều phối các bước theo lịch và chạy lại an toàn khi lỗi.', 'ingest', 6, 0),
      g('de6', 'Bảng', 'Mô hình hoá bảng cho phân tích', 'Dựng bảng sự kiện và bảng chiều cho báo cáo đơn hàng.', 'store', 6, 0),
      g('de7', 'Log', 'Theo dõi và cảnh báo', 'Đo độ trễ, số dòng và lỗi để biết pipeline còn khỏe.', 'base', 5, 0),
      g('de8', 'Cuối', 'Dự án cuối: pipeline đơn hàng', 'Ghép các phần trên thành một pipeline chạy từ đầu đến cuối.', 'store', 8, 0),
    ],
  },
]

export const courseIndex = Object.fromEntries(courses.map((c) => [c.id, c]))

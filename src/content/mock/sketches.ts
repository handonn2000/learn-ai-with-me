/** Dữ liệu mẫu: tên sketch của từng ga (mỗi tên là một câu hỏi để vẽ). Mốc 6 thay bằng nội dung thật. */
export const sketchTitles: Record<string, string[]> = {
  formulate: ['Năm thành phần của bài toán', 'Viết lại bài tìm đường'],
  'state-graph': ['Vẽ bản đồ trạng thái', 'Tính chi phí một đường đi'],
  frontier: ['Frontier sau mỗi lần mở rộng', 'Con trỏ cha là gì', 'Đọc đường đi ngược lại'],
  'graph-search': ['Vì sao cần tập explored', 'Khi nào một nút bị bỏ qua'],
  'priority-queue': ['Lấy phần tử rẻ nhất ra', 'Thêm và cập nhật khoá'],
  ucs: ['Mỗi lượt UCS làm gì', 'UCS dừng khi nào', 'UCS khác BFS ở đâu'],
  heuristic: ['h(n) là ước lượng của ai', 'Heuristic tốt và dở'],
  astar: ['f = g + h trên một bản đồ', 'Vì sao A* mở ít nút hơn UCS', 'Hai nút cùng f thì chọn nút nào'],
  admissible: ['Nói quá là gì', 'Tìm một heuristic không admissible'],
  agent: ['Vòng nhìn vào, làm ra', 'Hàm agent là một bảng'],
  rationality: ['Chấm môi trường, không chấm dáng điệu', 'Duy lý khác toàn tri'],
  peas: ['PEAS của taxi tự lái', 'Bốn chỗ hay đặt nhầm ô'],
  'env-dims': ['Bốn chiều, mỗi chiều hai vế', 'Thấy hết chưa chắc đoán được'],
  'env-classify': ['Bảng bảy chiều', 'Đầu dễ và đầu khó'],
}
/** Số sketch của riêng mục tiêu (mở khi tới đích). */
export const GOAL_SKETCHES = 2

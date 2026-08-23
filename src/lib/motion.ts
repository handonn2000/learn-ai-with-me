/** Người dùng có bật "giảm chuyển động" trong hệ điều hành không.
 *  Đọc một lần lúc nạp module: các cảnh trong bài đọc cờ này lúc dựng, không cần theo dõi realtime.
 *  CSS đã tự lo phần `.mn` (xem global.css) — hàm này dành cho chỗ phải quyết định trong JS,
 *  ví dụ tắt transition của robot trong VacuumRoom hay dừng animation của CanvasScene. */
export const prefersReducedMotion =
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

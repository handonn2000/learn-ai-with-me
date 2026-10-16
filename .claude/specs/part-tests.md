# Spec — Kiểm tra tổng hợp (/courses/:slug/tests)

Files: features/tests/PartTestPage.tsx; data: content/courses/csc14003/part-tests.ts (36 câu).

## Goal
Một bài kiểm tra cho mỗi phần của khóa (hiện 4: 8·8·10·10 câu), chấm tại chỗ, báo cáo theo buổi, lưu điểm vào lộ trình.

## Hành vi
- Hash #p1..#pN chọn tab ban đầu theo VỊ TRÍ (clamp về [0, PART_TESTS.length-1]); tab hiện badge điểm đã lưu (từ progress.partTests).
- PART_TESTS[i] phải khớp thứ tự với course.parts[i] — id để lưu điểm lấy từ course.parts[i].id.
- Câu hỏi: chọn 1 lần, khóa lại; đáp án đúng viền green, chọn sai viền đỏ, còn lại mờ; feedback ✓/✗ + giải thích (q.ex). Công thức: field tex render KaTeX (throwOnError: false).
- Nút nộp disabled (xám) tới khi trả lời đủ; status "Đã trả lời x/n" → "Xong n/n — đúng k câu".
- Nộp → ghi partTests[course.parts[part].id] = {score, correct, total, right[topicId], wrong[topicId], at} qua useProgress.update; hiện báo cáo: điểm serif 22px + VỮNG/HỔNG (unique topicId, hiển thị qua `topicLabel()`) + GỢI Ý theo ngưỡng 60/85.
- picks là state cục bộ theo phần (làm lại = reload trang — giữ đúng bản gốc).

## Acceptance
- Điểm sau khi nộp hiện ngay ở tab, ở hàng kiểm tra của lộ trình, và ảnh hưởng gợi ý "Hôm nay".
- KaTeX render đúng 5 công thức (Bayes, entropy, gain, perceptron, backprop).

Chủ đề lưu bằng **ID ổn định** (`topicId`), nhãn sinh lúc render qua `topicLabel()` — nếu không thì bản tiếng Anh sẽ làm tiến độ người học tách đôi theo ngôn ngữ. Xem ADR-0011.

## Phạm vi ngân hàng đề (2026-09-07)

CSC14003 khai `hasPartTests: true`. Route khóa khác (hoặc khóa không bật cờ) hiện
thông báo chưa có đề và link về lộ trình; không được dùng ngân hàng AI cho khóa đó.
Hook nhận `useProgress(slug)` để không ghi nhầm khóa. Muốn mở đề cho khóa mới cần
registry ngân hàng theo slug trước khi bật cờ; DEF hiện chỉ có roadmap.

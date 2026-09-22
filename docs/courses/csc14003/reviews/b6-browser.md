# Browser QA · CSC14003 b6

Ngày 2026-09-22. Bài Tìm kiếm cục bộ, khởi tạo dưới số 4 và đã chuyển thành số 6.
Chrome thực chạy qua Playwright với hồ sơ tạm, dev server local; VI và EN. Không dùng
dữ liệu tiến độ cá nhân. Kết quả máy chi tiết: [b6-browser-checks.json](b6-browser-checks.json).

## Kết quả

- Đúng route, nhãn buổi 6 và 12 anchor; 13 slide gồm bìa, chuyển anchor trong deck hoạt động.
- Đủ 16 tổ hợp preset/thuật toán N-hậu, Lùi khôi phục trạng thái, chỉnh ô tạo trace mới.
  Preset h=1 + restart seed 3 tới h=0 sau 5 lần Tiến.
- SA: ΔC=2, T=1 cho 13,53%; T=0 cho 0 và lời giải dừng lịch. Range phản hồi đúng.
- Fitness mở 2/3/1/0, cả 7 điểm cắt, mutation đúng gene, đổi cut bỏ mutation cũ.
- Ba code block render nguyên vẹn so với source; cả ba Python chạy trong kiểm engine.
- Trả lời 8 câu đúng lưu 100% ở `sessions.b6` và 7 topic `local-*`; không ghi sang b4.
  Điểm và checklist còn sau reload; EN đọc cùng điểm VI.
- Tab nhận arrow key mà không đổi slide. Touch trên bàn cờ, range, GA, bảng so sánh
  và code không chuyển deck; không preventDefault nên giữ hành vi native của phần tử.
- Tất cả 12 mục ở 1440/760/390/320 px, hai theme: không có overflow toàn trang.
  Bàn 8-hậu, bảng so sánh và code dài vẫn có cuộn ngang bên trong khối.
- Mỗi trường hợp của 3 landscape + 2 beam chạy đủ hai lần reset, nhận đủ frame và
  có dwell kết thúc; offscreen không tăng frame. Signal document-hidden được mô phỏng,
  frame dừng rồi khôi phục signal visible. Reduced motion có giải thích HTML tĩnh.

## Lỗi đã sửa và kiểm lại

1. CodeLab grid child có min-content width khoảng 526px, làm trang mobile rộng 550px.
   Đặt `.ls-chapter-body > * { min-width: 0; }` để pre tự cuộn trong khối.
2. Nav ở 320px thiếu chỗ cho nút trình chiếu. Cho hàng nav của b6 wrap dưới 480px,
   giữ nút 44px; title rút gọn theo convention có sẵn.
3. Vuốt trên bàn cờ trong deck chuyển sang ch3. `keepLabTouch` chặn bubbling ở các
   vùng lab/bảng/code; các ca tương ứng đều giữ nguyên mục sau touchend.

Không còn lỗi console/page của bài. Chrome có một yêu cầu tự động tới
`/favicon.ico` trả 404 của dev server; ghi riêng trong JSON, không tính là lỗi bài.

## Quan sát bằng mắt và giới hạn

Đã xem screenshot hero, N-hậu, probability, xưởng di truyền, code, toàn bộ 5 use-case
animation, mobile VI/EN và hai theme. Tên/gene/fitness đọc được; code giữ nền tối,
syntax có màu; gene có nhãn A/B/M ngoài màu; số h và viền ô không lệch engine.
Screenshot mobile 8-hậu cho thấy khung giữ ô 44px, cột ngoài viewport nằm trong vùng
cuộn ngang của bàn, không kéo rộng trang. Ảnh QA là scratch `/tmp/ai-b6-*.png`.

Viewport, touch và reduced motion được giả lập trong Chrome; chưa kiểm thiết bị iOS/
Android vật lý hoặc screen reader thực. Timer cleanup được kiểm bằng code; bài không
có rAF/WebGL. Không dùng build xanh để suy ra nội dung đúng: xem riêng
[quality](b6-quality.md), [coverage](b6-coverage.md) và [fidelity](b6-fidelity.md).

## Các cổng khác

- `node scripts/check-ai-b6.mjs`: 7 nhóm PASS (toàn bộ 256 bàn 4-hậu, invariants,
  số học source/homework, GA/SA, quiz và thực thi ba Python).
- `node scripts/check-course.mjs`: 12 PASS.
- `node scripts/check-session-numbering.mjs`: 8 PASS; sandbox chặn WebSocket HMR
  của Vite ở 24678 nhưng không ngăn các assertion dữ liệu chạy xong.
- `python3 .claude/scripts/i18n_loop.py b6`: deps/build/i18n/lesson/judged đều PASS.
  Fidelity hash `3f6c2869af2e1c7e` còn khớp.
- Build production PASS; cảnh báo chunk Three.js có sẵn thuộc phần khác của app.

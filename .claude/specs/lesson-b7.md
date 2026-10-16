# Buổi 7 · Tìm kiếm đối kháng

Route `/courses/csc14003/lessons/b7`, VI/EN. Nguồn Lecture05-AdversarialSearch.pdf (51 trang), Homework5.pdf (1 trang), giữ file gốc trong public/materials/Lecture/buoi7.

## Thiết kế học

12 slide dùng chung với cuộn: hero, toán nền, model, minimax, lab, pruning, limits, chance, extensions, summary, quiz, practice. 11 anchor có đích thực. Lượt đọc đầu tập trung mục01–06; mở rộng và code đặt sau cơ chế cốt lõi.

Bàn tic-tac-toe trước/sau tạo cầu nối sang cây. Cùng cây A=(3,5), B=(0,7) dùng xuyên suốt minimax, lab và α–β. Ba câu dự đoán có phản hồi ngay, 8 quiz tổng kết, ba bài chuyển giao có gợi ý đóng/mở và PDF gốc.

## Tương tác

- GameLoop dùng trace engine, mỗi pha2,4s, giữ kết quả cuối thêm một nhịp. Pause ngoài viewport/document ẩn; reduced motion hiện kết quả cuối. Lời giải đầy đủ tĩnh luôn nằm dưới hình.
- Lab chỉnh bốn lá [-100,100], rootMAX/MIN, A/B trước; tính lại minimax và α–β thực. Cut subtree hiển thị cận ≤/≥ thay vì giá trị chính xác. Ties giữ nước tối ưu gặp trước.
- Chance bar đổi P(10)1/4 hoặc1/2: kỳ vọng1,75/4,5 và lựa chọn tương ứng. Không dùng MIN cho ngẫu nhiên.
- Tree/table cuộn ngang cục bộ ở mobile, có focus và giữ phím mũi tên/touch khỏi điều hướng deck.

`b7-checks` và `sessions.b7` giữ hợp đồng storage hiện có. Không dependency mới. Python là minh họa recurrence, helper mô hình do ứng dụng cung cấp; không tuyên bố full game engine Python.

## Kiểm tra và provenance

`node scripts/check-ai-b7.mjs`: 800 trường hợp generated, root/order/ties/negative/bound/input. `i18n_loop.py b7` đóng build/i18n/lesson/judged. Các báo cáo b7-quality, coverage, fidelity, browser nằm trong docs/courses/csc14003/reviews. Quality reviewer xác nhận phạm vi content/code; author xác nhận browser riêng. Không tuyên bố chép đủ mọi hình/vector/code lịch sử từ slide.

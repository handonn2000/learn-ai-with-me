# Mục tiêu `peas` — báo cáo chất lượng

**Self-review, không phải review độc lập.** Lượt `lesson-quality-judge` đã khởi chạy nhưng bị dừng trước khi
đọc xong tài liệu; báo cáo này do chính người dựng bài viết. Nên chạy lại `/review-lesson` cho mục tiêu này khi có
thể.

Ảnh chụp: working tree trên f6b1b62 (chưa commit), ngày 2026-10-13. Đã đọc: `content/skillsAgents.ts`,
`content/agents.ts`, `content/lessons/{agent,rationality,peas,env-dims,env-classify}/*`, `content/recall.ts`,
`widgets/{AgentLoop,PeasCards,DataTable}.tsx`; nguồn `Lecture02-IntelligentAgents.pdf` (trang 29, 31, 40 đọc
dạng ảnh) và `buoi1/Homework1.pdf`. Đối chiếu đúng/sai với AIMA 3e chương 2 (trí nhớ của người viết, không mở
sách trong lượt này).

Kết luận: **PASS có điều kiện** cho phạm vi trang 3–42 + Homework1, chờ review độc lập.

## Đã sửa trong lượt này

- Định nghĩa môi trường: "mọi thứ ngoài tác tử" → "phần thế giới bên ngoài tác tử mà bạn quan tâm khi thiết kế
  nó" (AIMA: môi trường là phần vũ trụ có trạng thái ta quan tâm).
- Bài phân loại thước đo (`rationality-e2`): hai nhóm đổi thành đúng hai vế của luật đặt thước đo (thứ muốn có
  trong môi trường / việc nghĩ tác tử nên làm), bớt chỗ cãi được với "lượng rác hút được".
- Ga 4 không có "tôi/bạn": thêm vào câu mở và ghi chú chỗ hay lẫn chiều 1 với chiều 3.
- `wrongSure` của bốn bước đoán lặp lại tiêu đề "Sai lúc đang rất chắc" của màn: bỏ câu lặp.

## Bảng coverage (trang → ga/bước)

| Trang | Nội dung | Ở đâu |
|---|---|---|
| 4 | Vì sao gọi là agent (dữ liệu lớn, nhanh, không sai) | không có — phần dẫn nhập |
| 5–6 | Cảm biến, bộ chấp hành; người / robot / phần mềm | `agent` giải thích 1, `agent-e1`, `agent-e2`, `agent-c1` |
| 7 | Tri giác, chuỗi tri giác, hàm tác tử, chương trình, kiến trúc + chương trình | `agent` giải thích 2 |
| 8–10 | Thế giới hút bụi, bảng hàm, REFLEX-VACUUM-AGENT | `agent` giải thích 2 (bảng 6 dòng, mã giả 3 dòng), `agent-e3` |
| 11 | Vì sao cần khái niệm agent | không có — phần dẫn nhập |
| 13–15 | Duy lý = làm điều đúng; thước đo chấm trạng thái môi trường; luật đặt thước đo | `rationality` đoán trước + giải thích 1, `rationality-e2`, `rationality-c1` |
| 16–17 | Bốn thứ quyết định duy lý; định nghĩa; ví dụ đi thi | `rationality` giải thích 2, `rationality-e1`, recall |
| 18 | Robot hút bụi duy lý trong điều kiện nào | `rationality` giải thích 2 (Đào sâu); số bước 10000/1000 cố ý không nêu |
| 20–23 | Toàn tri, thu thập thông tin, học, tự chủ (đồng hồ) | `rationality` giải thích 3, `rationality-e3` |
| 25–26 | Môi trường tác vụ = đề bài; PEAS là bước đầu | `peas` giải thích 1 |
| 27–29 | Taxi: tiêu chí P, chi tiết E/A/S, bảng PEAS | `peas` giải thích 1 (thẻ taxi), `peas-e2`, recall |
| 30 | Softbot, môi trường nhân tạo | `peas` giải thích 2 |
| 31 | Bảng PEAS 5 tác tử | `peas` giải thích 2 (thẻ), `peas` đoán trước |
| 32 | Quiz 01: PEAS cho tennis | không có — thay bằng Homework1 Q1 |
| 33 | Bảy chiều, quyết định thiết kế | `env-dims` giải thích 1 |
| 34–35 | Quan sát được; một/nhiều tác tử, cạnh tranh/hợp tác | `env-dims` giải thích 1, `env-dims-e1/e2/e4`, `env-dims-c1` |
| 36–37 | Tất định/ngẫu nhiên; từng hồi/tuần tự | `env-dims` đoán trước + giải thích 2, `env-dims-e1/e2/e3` |
| 38 | Tĩnh/động/nửa động | `env-classify` đoán trước + giải thích 1, `env-classify-e1/e2` |
| 39 | Rời rạc/liên tục; biết/chưa biết luật | `env-classify` giải thích 2, `env-classify-e3` |
| 40 | Bảng 10 môi trường × 6 chiều | `env-classify` giải thích 3 (`EnvTable`, đúng từng ô) |
| 41 | Môi trường dễ nhất / đời thực | `env-classify` giải thích 3 |
| 42 | Quiz 02: xếp loại tennis | không có — thay bằng Homework1 Q2, Q4 |
| Homework1 Q1–Q4 | Trốn tìm, bịt mắt bắt dê | bước giấy của `peas`, `env-dims`, `env-classify` (có đáp án gợi ý) |
| 43–64 | Cấu trúc tác tử | **ngoài phạm vi mục tiêu này** — đề xuất ga/mục tiêu riêng |

## Điểm đã kiểm đúng/sai

- Bảng trang 40 trong `content/agents.ts`: soát từng ô cả 10 hàng × 6 cột.
- Tất định bỏ qua bất định chỉ đến từ tác tử khác (AIMA 3e §2.3.2) ⇒ cờ vua tất định; bước đoán của ga 4 dựa trên điểm này.
- Biết luật không cùng trục với quan sát được: ví dụ xì dách và game mới là cách AIMA giải thích (AIMA dùng solitaire).
- Số dòng bảng: 4 tri giác; dài 3 = 64; tổng tới độ dài 10 = 1.398.100.
- Deep Blue thắng Kasparov năm 1997; câu về xe tự lái để định tính, không nêu năm.

## Còn mở / rủi ro

- Phân loại có chỗ tùy cách định nghĩa bài toán (bài nói rõ ở giải thích 3 của ga 5). Bài tập chấm tự động chỉ
  dùng môi trường có đáp án rõ: Sudoku, poker, cờ vua, cờ tướng có bấm giờ, taxi.
- `env-dims-e3`: bộ lọc thư rác xếp từng hồi. Nếu người học nghĩ tới bộ lọc tự học thì có thể cãi là tuần tự;
  lời giải nói rõ lý do theo định nghĩa.
- Chưa kiểm trong trình duyệt từng bài tập của ga 2–4 (chỉ kiểm bằng test chấm đáp án) và chưa chạy hết luồng
  `/session` với các ga này.

## Đề xuất tùy chọn

- Ga hoặc mục tiêu "Cấu trúc tác tử" cho trang 43–64 (bảng tra 10¹⁵⁰ dòng, 5 kiến trúc, 4 thành phần tác tử học).
- Dùng Quiz 01/02 (tennis đấu giải và tập với tường) làm câu ôn tự do trong `recall.ts`.
- Bản đồ mục tiêu cho `peas`, sau khi tổng quát `GoalMap` (bỏ ga phụ GBFS cố định).

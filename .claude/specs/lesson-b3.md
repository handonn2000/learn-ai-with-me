# Spec — Buổi 3 · Phát biểu bài toán tìm kiếm (/courses/csc14003/lessons/b3)

Files: `features/lessons/b3/{Lesson03Problem.tsx, lesson03.text.{vi,en,}.ts}`;
data: `content/courses/csc14003/math-primers.js` (`MATH_PRIMERS.b3`), `session-quizzes.js` (`b3`).

Tách ra từ bài Buổi 3 gộp cũ theo **ADR-0018** — xem thêm `lesson-b4.md`, `lesson-b5.md`.
Nguồn: `Lecture03-P1-ProblemSolvingBySearching.pdf` (43 trang, ở `materials/Lecture/buoi3/`).

## Goal
Buổi mở đầu của Phần II: biến một đề bài lộn xộn thành đồ thị trạng thái. Không có thuật toán
nào chạy ở đây — đây là buổi dạy *viết đề*, thuật toán để dành hai buổi sau.
Giọng tôi/bạn theo skill `lesson-voice`.

## Cấu trúc trang
`toan` (MathPrimer, không đánh số) · `01 ch1` · `02 ch2` · `03 ch3` · `04 quiz` · `05 hw`.
`NAV` gồm sáu mốc; `SLIDES` thêm `hero` ở đầu (chế độ trình chiếu, ADR-0006).

- **hero** — nền radial, tiêu đề ba dòng (`titleA/B/C`, accent cyan), `lead` mở bằng con số
  8 quân hậu 1,8×10¹⁴ → 2.057, hai chip khái niệm + hai chip mono (`chipSections`, `chipHours`).
- **toan** — `MathPrimer` 4 phút × 3 thuật ngữ: Graph · Tree + branching factor b · Big-O.
  (Bộ 5 mục của bài gộp cũ chia đôi: Stack/Queue/PQ và Logarithm chuyển sang Buổi 4.)
- **01 Agent giải quyết vấn đề** — 4 thẻ bốn bước (goal formulation → problem formulation →
  search → execution) + dải chip bốn giả định môi trường.
- **02 Năm thành phần** — 5 thẻ (initial state · actions · transition · goal test · path cost),
  mỗi thẻ có ví dụ Romania dạng mono; dưới là hai thẻ: kích thước không gian trạng thái
  (8-puzzle 9!/2 = 181.440 · 15-puzzle ~10¹³ · 24-puzzle ~10²⁵ · sliding-block NP-complete) và
  trừu tượng hóa.
- **03 Khung tìm kiếm** — hai `canvas-panel` pseudo tree-search / graph-search cạnh nhau, thẻ
  node ≠ state (chip STATE · PARENT · ACTION · PATH-COST g(n)), thẻ "vết dầu loang", và khung
  đánh giá bốn tiêu chí + b, d, m.
- **04 Quiz** — `<SessionQuiz sessionId="b3">`, 5 câu, chủ đề `problem-statement` ×2 ·
  `search-framework` ×3. Điểm ghi vào `sessions.b3.quiz*`.
- **05 Bài tập** — 2 thẻ đề (Q1 hai người bạn trên bản đồ Romania · Q2 incremental vs
  complete-state cho 8 quân hậu) + `CheckList storageKey="b3-problem-checks"` 4 mục + câu kết
  móc sang Buổi 4.

## Anchor
`#ch2`, `#ch3` dùng trong chữ bài tập. Không có `#lab`/`#codelab` — hai thứ đó ở Buổi 4 và 5.

## Acceptance
- Mọi anchor trong `lesson03.text.*` phải phân giải được trên chính trang này.
- `check_i18n.py b3` sạch; unit `b3` trong `acceptance.json` khai 3 cặp (bundle · math-primers
  scope b3 · session-quizzes scope b3).
- Con số bám slide: 1,8×10¹⁴ → 2.057 (P1 tr.24–25), 9!/2 = 181.440, ~10¹³, ~10²⁵ (P1 tr.22).

## Còn thiếu so với slide (chưa làm — xem `docs/courses/csc14003/reviews/b3-coverage-2026.md`)
- Tên và ý của hai kiểu phát biểu **incremental vs complete-state** trong phần giảng (P1 tr.23–25)
  — hiện chỉ có ở đề bài tập Q2.
- Con số **đường đi dư thừa**: d = 20 → 10¹² nút cho ~800 trạng thái (P1 tr.35).
- Vacuum-cleaner world như một phát biểu đầy đủ (P1 tr.19–20); touring problem & TSP (tr.28).

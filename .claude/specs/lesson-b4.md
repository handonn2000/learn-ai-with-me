# Spec — Buổi 4 · Tìm kiếm mù (/courses/csc14003/lessons/b4)

Files: `features/lessons/b4/{Lesson04Uninformed.tsx, lesson04.text.{vi,en,}.ts}`;
dùng chung: `features/search-lab/{SearchLab,CodeLab,AlgoCard,scenes,lab.text.*,search-engine.js}`;
data: `math-primers.js` (`b4`), `session-quizzes.js` (`b4`), `lab-searching.js`.

Tách ra từ bài Buổi 3 gộp cũ theo **ADR-0018**. Nguồn: `Lecture03-P2-UninformedSearch.pdf`
(64 trang, ở `materials/Lecture/buoi4/`).

## Goal
Năm thuật toán mù, và luận điểm xuyên suốt: chúng là **một vòng lặp thay ruột**, khác nhau đúng
ở câu "lấy nút nào ra khỏi frontier trước".

## Cấu trúc trang
`toan` · `01 ch1` (Tìm kiếm mù) · `lab` · `02 codelab` · `03 quiz` · `04 hw`.

- **hero** — accent cyan, `lead` dựng căng thẳng "mò trong bóng tối", hai chip FIFO / LIFO.
- **toan** — `MathPrimer` 5 phút × 3: Stack · Queue · Priority queue / Big-O / Logarithm.
- **01 Tìm kiếm mù** — chuỗi `AlgoCard` (BFS · UCS · DFS · DLS→IDS) + thẻ BONUS bidirectional.
  Màu: BFS cyan · UCS green · DFS red · DLS→IDS purple. Mỗi card có 4 ô đánh giá và hai link
  `#lab` / `#codelab` (nhãn truyền qua prop `labCta`).
  Hai khối con giữ từ bài cũ: **DFS · hai cách chống lặp** (explored set vs path check) và
  **DLS · bốn ô đánh giá riêng** (ĐẦY ĐỦ ✗ khi ℓ < d · TỐI ƯU ✗ khi ℓ > d · O(b^ℓ) · O(bℓ),
  kèm "DFS chính là DLS với ℓ = ∞").
  Cảnh `drawGrow` (cây b = 3 mọc từng tầng, overlay đỏ b = 10, d = 12 → 10¹² nút) nằm trong mục
  này; nhận cờ `rm` (`prefersReducedMotion`) thì đứng ở khung cuối T = 6.5.
- **lab** — `<SearchLab only={['BFS','DFS','UCS','IDS']} />`. Toolbar chỉ hiện bốn nút đó; hai
  preset (Lab 1 · 6 đỉnh, Romania · 10 đỉnh) giữ nguyên. Chữ của lab lấy từ `lab.text` qua `L`.
- **02 Code Lab** — `<CodeLab only={['BFS','DFS','UCS','IDS']} />`, kèm khối ba quy ước bắt buộc,
  hai panel INPUT/OUTPUT mẫu, helper reconstruct, MAIN.PY và card test case (đều ở `L.codelab`).
- **03 Quiz** — `sessionId="b4"`, 6 câu, toàn chủ đề `uninformed`.
- **04 Bài tập** — 2 thẻ (Q1 trace tay BFS/UCS/DFS/IDS · Q2 mê cung phần mù) +
  `CheckList storageKey="b4-uninformed-checks"` 5 mục.

## Anchor
`#ch1`, `#lab`, `#codelab` dùng trong chữ. `id` của mục là `ch1` (không phải `ch4` như bài gộp cũ).

## Acceptance
- Trace khớp bản gốc: BFS đường 0→1→3→5 chi phí 9; UCS 0→2→4→5 chi phí 8.
- Toolbar SearchLab và sidebar CodeLab chỉ hiện đúng bốn thuật toán mù.
- Bảng độ phức tạp b = 10 chép đúng nguyên số slide (P2 tr.20); chi phí lặp IDS ~11%.

## Còn thiếu so với slide (chưa làm)
- **Bidirectional**: điều kiện dừng "hai frontier giao nhau", cảnh báo **không mặc nhiên tối ưu**,
  và chi phí bộ nhớ O(b^(d/2)) (P2 tr.61–62). Thẻ BONUS hiện chỉ có phép tính 2.000 vs 1.000.000.
- **Đường kính không gian trạng thái** làm cận cho ℓ: 20 thành phố → ℓ = 19, nhưng mọi cặp cách
  nhau ≤ 9 bước → ℓ = 9 **chặt hơn** (P2 tr.51). Chữ hiện tại nói "ℓ = 9 là dư", hơi lệch.
- **Chứng minh tối ưu của UCS** (phản chứng, P2 tr.40) — hiện chỉ phát biểu kết luận.
- **Chi phí cấu trúc dữ liệu của frontier** (list linear-scan O(n) vs heap O(log n)) và
  **tie-breaking như quy tắc cài đặt** — hai trục mới của đề Lab 2026, chưa dạy ở đâu.

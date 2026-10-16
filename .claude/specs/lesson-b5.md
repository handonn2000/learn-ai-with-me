# Spec — Buổi 5 · Tìm kiếm có thông tin (/courses/csc14003/lessons/b5)

Files: `features/lessons/b5/{Lesson05Informed.tsx, lesson05.text.{vi,en,}.ts}`;
dùng chung: `features/search-lab/*`; data: `math-primers.js` (`b5`), `session-quizzes.js` (`b5`).

Tách ra từ bài Buổi 3 gộp cũ theo **ADR-0018**. Nguồn: `Lecture03-P3-InformedSearch.pdf`
(73 trang, ở `materials/Lecture/buoi5/`).

## Goal
Đưa cho máy một con số ước lượng và xem nó tiết kiệm bao nhiêu công — rồi chỉ ra con số đó phải
thỏa điều kiện gì mới không nói dối. Kết bằng leo đồi, làm cầu sang Buổi 6.

## Cấu trúc trang
`toan` · `01 ch1` (Heuristic) · `02 ch2` (Leo đồi) · `03 ch3` (Tổng kết) · `lab` ·
`04 codelab` · `05 quiz` · `06 hw`.

- **hero** — accent **yellow**, `lead` mở bằng con số 8-puzzle d = 12: 3.644.035 → 73.
  Hai chip `g — chi phí đã đi` / `h — ước lượng còn lại`.
- **toan** — `MathPrimer` 5 phút × 4 mục **viết mới**: Triangle inequality · Lower bound ·
  Monotone function · Big-O. Ba mục đầu là đúng ba thứ phần chứng minh cần.
- **01 Heuristic** — dải chip SLD (Arad 366 · Sibiu 253 · Făgăraș 176 · Pitești 100 ·
  București 0) rồi hai `AlgoCard`: GBFS (orange) và A\* (yellow, viền vàng 30%).
  Ô ĐẦY ĐỦ của A\* là `T.ch5.s44` = "✓ b hữu hạn, bước ≥ ε" — **không phải `✓` trần**
  (P3 tr.29). Khối con giữ từ bài cũ: **A\* · đường viền f** (SVG tĩnh 700×220 trong
  `.canvas-panel`), **b\* — hệ số phân nhánh hiệu dụng** + bảng dominance 5 cột, và bốn nguồn
  heuristic (nới lỏng · lấy max · pattern database · học từ kinh nghiệm).
- **02 Leo đồi** — cảnh `drawHill` (`CanvasScene` 290px, bóng vàng lăn tới đỉnh cục bộ, vòng đỏ
  "KẸT"; cờ `rm` thì đứng ở T = 8), dải chip ba kiểu chết, và câu móc sang Buổi 6.
- **03 Tổng kết** — bảng 7 thuật toán (`min-width: 820`, cuộn ngang) + footnote ¹²³⁴.
  Chú thích ¹ là "b hữu hạn (UCS **và A\***: thêm chi phí bước ≥ ε > 0)" và ô ĐẦY ĐỦ của A\*
  mang `✓¹` — sửa 2026-09-19 theo P3 tr.29. **Chuỗi này render bằng text JSX thuần, không qua
  `<Html>`** — nên đừng đưa thực thể HTML (`&gt;`) vào, dùng ký tự thật.
- **lab** — `<SearchLab only={['GBFS','ASTAR','HC']} />`.
- **04 Code Lab** — `<CodeLab only={['GBFS','ASTAR','HC']} />`.
- **05 Quiz** — `sessionId="b5"`, 6 câu: `heuristic` ×2 · `admissible-consistent` ×2 · `astar` ×2.
- **06 Bài tập** — 3 thẻ (Q1 trace GBFS/A\* · Q2 đường nào có thể trả về · Q3 mê cung phần có
  thông tin) + `CheckList storageKey="b5-informed-checks"` 5 mục.

## Anchor
`#ch1` (×2), `#lab` (×2), `#hw`. `id` của mục là `ch1`/`ch2`/`ch3` (bài gộp cũ là `ch5`/`ch6`/`ch7`).

## Số liệu bám slide (không được đổi)
Bảng dominance lấy nguyên văn P3 tr.59 (trung bình 100 thể hiện 8-puzzle): d = 12 → IDS 3.644.035
/ A\*(h₁) 227 / A\*(h₂) 73, b\* 2,78 / 1,42 / 1,24; d = 24 → IDS **–** / 39.135 / 1.641,
b\* **–** / 1,48 / 1,26. Ô IDS ở d = 24 trong slide là dấu gạch ngang, không có số.

Bảng SLD (`search-engine.js:21`, `h: [366, 374, 380, 329, 253, 176, 193, 100, 160, 0]`) khớp AIMA
và cho ra f(Făgăraș) = 415 < f(Pitești) = 417, nghiệm 418. Trang 13 của P3 là **ảnh**, không trích
text được — một reviewer từng báo "slide ghi 178 / 98" và phán quyết đó đã bị bác
(xem `docs/courses/csc14003/reviews/b3-coverage-2026.md` § 1.2). **Đừng chạy lại phát hiện đó.**

## Acceptance
- Trace khớp bản gốc: GBFS trên Romania ra 450, A\* ra 418; HC kẹt tại Timișoara (−1).
- Toolbar SearchLab và sidebar CodeLab chỉ hiện GBFS · A\* · HC.

## Còn thiếu so với slide (chưa làm)
- **Memory-bounded search: IDA\* · RBFS · SMA\*** — P3 tr.42–52, **11 trang** có pseudocode RBFS
  và ví dụ Romania chạy tay 4 bước. Bài hiện gói lại bằng một mệnh đề "ngoài phạm vi buổi này,
  để dành" — mà không buổi nào trong 13 buổi quay lại họ này. Đây là khối thiếu lớn nhất.
- **Pattern database cộng tính / rời rạc** + số liệu (15-puzzle nhanh 2000× Manhattan, IDA\* giải
  tối ưu trong 30 ms; 24-puzzle 12 triệu×, 2 ngày thay vì 65.000 năm) — P3 tr.66–71.
- **Chứng minh tối ưu A\*** tree-search và consistent, mỗi cái một dòng biến đổi (P3 tr.34, 36).
- **h chỉ phụ thuộc trạng thái, g phụ thuộc đường đi** (P3 tr.9) — chỗ giải thích decrease-key.
- **Tính h₁/h₂ trên một bàn 8-puzzle cụ thể** (P3 tr.32, 55–56).

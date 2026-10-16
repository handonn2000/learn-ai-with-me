# Buổi 9 · Tác tử logic · Logic mệnh đề

Route `/courses/csc14003/lessons/b9`, VI/EN. Files: `src/features/lessons/b9/` — `Lesson09Logic.tsx` (trang), `LogicVisuals.tsx` (4 minh họa tự lặp), `LogicLab.tsx` (lab), `logic-view.tsx` (bảng, code tô màu, Recall, caption trace), `logic-engine.js` (engine thuần), `lesson09.code.ts` (4 đoạn Python), `lesson09.text.{vi,en,}.ts`, `lesson09.css` (tiền tố `lg-`). Data: `math-primers.js` / `.en.js` khóa `b9`, `session-quizzes.js` / `.en.js` khóa `b9` (11 câu), 7 topic id mới trong `topics.ts` (`kb-agent`, `entailment`, `pl-semantics`, `validity-sat`, `resolution`, `horn-chaining`, `sat-solvers`).

Nguồn: `public/materials/Lecture/buoi9/Lecture07-LogicalAgents.pdf` (97 trang). Bài tập là `buoi8/Homework6.pdf` (logic mệnh đề — thư mục lệch số do ADR-0018; `buoi9/Homework7.pdf` là FOL, thuộc buổi 10). Lab 2 phần 1. Dàn ý: `docs/courses/csc14003/lesson-design/b9-outline.md`.

## Goal

Đi từ “agent biết suy luận” tới năm cách trả lời KB ⊨ α trên cùng một KB hang Wumpus (R1–R5): bảng chân trị, luật suy diễn, hợp giải, forward/backward chaining, DPLL/WalkSAT; kết bằng giới hạn của logic mệnh đề → FOL buổi 10.

## Mục

- Hero + mục tiêu; `#toan` thẻ toán nền 5 thuật ngữ.
- `#kb` 01 KB, tiên đề, suy diễn; ví dụ A ⇒ (B ∨ C); offline/online; KB-AGENT Python; bảng 4 cách nạp tri thức.
- `#wumpus` 02 PEAS, bảng 6 chiều môi trường, `WumpusLoop` 4 khung (trang 14–17) + lời giải tĩnh dạng danh sách.
- `#entail` 03 mô hình, M(α), ⊨, `ModelsLoop` 8 thế giới với tab α₁/α₂, Recall “⊭ không phải ⊨¬”, sound/complete, Socrates, không có lối riêng vào thế giới.
- `#syntax` 04 phép nối, ngữ pháp, ưu tiên, bảng chân trị 5 phép (tính từ engine), ví dụ m₁ (đã sửa thứ tự vế), Recall kéo theo, R1–R5.
- `#modelcheck` 05 ba con đường, 3/128 dòng (tính từ engine, cột theo thứ tự sách), TT-ENTAILS Python, O(2ⁿ)/O(n), thẻ Quiz 01 (32 mô hình, KB đúng ở 1, ⊨ R; đáp án ẩn), bảng 12 tương đương, valid/satisfiable/SAT, sửa lỗi “P ⇒ ¬P hằng đúng”, Quiz 02 có đáp án ẩn.
- `#rules` 06 MP/MT/And-intro/And-elim, hai chứng minh đánh số (S; ¬P₁,₂ R6–R10), chứng minh như tìm kiếm, đơn điệu, bộ luật có thể không đầy đủ.
- `#resolution` 07 unit/full resolution, factoring, R11–R17, CNF 4 bước (demo engine trên R2), Quiz 03, PL-RESOLUTION, bỏ mệnh đề hằng đúng, `ResolutionLoop` Quiz 04 (chứng minh in trong bài, được test kiểm từng bước).
- `#chaining` 08 definite/Horn/goal, ngữ pháp CNF/Horn, FC (count, agenda), `ChainLoop` đồ thị AND-OR với tab FC/BC từ trace engine (hai bố cục SVG: ngang ≥640px, dọc 360×560 cho điện thoại), thứ tự FC tĩnh, BC (tránh lặp; dùng lại thất bại trừ khi do cắt vòng lặp), thứ tự BC tĩnh, `<details>` toàn bộ trace hai tab (`ChainTrace`), FC Python, bảng FC vs BC, ví dụ A∧B⇒C…, Quiz 05 có đáp án ẩn.
- `#dpll` 09 ba cải tiến DPLL (mệnh đề đơn vị: mọi literal khác đã sai), DPLL Python, DP vs DPLL + bảng 13 dòng (cột Tautology giữ tên gốc; nguồn không ghi đơn vị, cột Tautology và `*`, bài chỉ đọc thứ tự), thẻ Quiz 06 ngay sau bảng (CNF, (a) ⊭ C bằng DPLL, (b) ⊨ B ⇒ ¬C bằng DPLL và DP; đáp án ẩn), WalkSAT + Recall “failure ≠ vô nghiệm”, 64 ký hiệu/155 câu (2+16+16+1+120; 120 câu “nhiều nhất một Wumpus”), giới hạn PL (64 luật, chỉ số thời gian), cầu sang FOL.
- `#lab` 10 Logic Lab: 5 ví dụ + tự nhập (ASCII hoặc Unicode), 6 cách: bảng chân trị (≤12 ký hiệu, phân loại α), hợp giải (CNF + chứng minh rút gọn, giới hạn 500 mệnh đề), FC/BC (từ chối KB không xác định trước, rồi mới xét truy vấn), DPLL (trace + phản ví dụ), WalkSAT (seed đổi được, failure = chưa kết luận).
- `#summary` 11 bảng 6 cách; `#quiz` 12 SessionQuiz b9; `#practice` 13 ba bài Homework 6 có lời giải ẩn, PDF, Lab 2, CheckList `csc14003-b9-checks` (7 ô).

## Tương tác

Bốn minh họa dùng `useLessonLoop` (models, resolution, chaining giữ khung kết quả thêm một nhịp; chaining 2,2 s/khung): chỉ chạy khi trong viewport và document hiện; reduced motion hiện khung cuối, lời giải tĩnh luôn có trong HTML quanh hình. Không nút phát; nút đổi use-case dùng `aria-pressed` (không giả role=tab). Thế giới thuộc M(α) có thêm nhãn α, không chỉ dựa vào màu. Hình cuộn ngang cục bộ giữ phím mũi tên/touch khỏi deck. Lab là công cụ có điều khiển chủ đích.

## Acceptance

`node scripts/check-ai-b9.mjs` (ví dụ bài giảng, Quiz 01–06, Homework 6, hai đính chính, 700 ca ngẫu nhiên đối chiếu bảng chân trị), `python3 .claude/skills/new-lesson/scripts/check_lesson.py b9`, `python3 .claude/scripts/i18n_loop.py b9`, `npm run build`. Báo cáo review trong `docs/courses/csc14003/reviews/b9-*.md`.

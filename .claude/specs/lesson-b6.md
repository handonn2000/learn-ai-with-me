# Buổi 6 · Tìm kiếm cục bộ và tối ưu hóa

Course `csc14003`, route `/courses/csc14003/lessons/b6`; bản EN dùng basename hiện có.
Bài khởi tạo dưới số 4, chuyển thành số 6 sau khi tách buổi tìm kiếm thành 3–5.
Nguồn: `public/materials/Lecture/buoi6/Lecture04-LocalSearch.pdf` (42 trang) và
`Homework4.pdf` (2 trang). Giữ tên file gốc để tra provenance.

## File và khung trang

`src/features/lessons/b6/`: `Lesson06LocalSearch.tsx`, `QueensLab.tsx`, `GeneticLab.tsx`,
`LocalSearchVisuals.tsx`, `local-search-engine.ts`, `lesson06.code.ts` và ba file text.
Route lazy, LessonNav riêng, cùng global CSS token dark/light với bài trước.
Bundle VI gốc và EN có 230 khóa / 261 chuỗi; selector gõ kiểu. Prose qua `Html`.
Giọng tôi/bạn, 7 icon mốc, ước lượng 2,5 giờ gồm thực hành.

13 slide (bìa + 12 mục), dùng chung nội dung giữa cuộn và LessonDeck:

| Anchor | Nội dung |
|---|---|
| `#toan` | Primer: cực trị, gradient, xác suất và hoán vị |
| `#ch1` | Tối ưu cấu hình, hàm mục tiêu, bộ nhớ và ứng dụng |
| `#ch2` | Leo đồi, local/global, plateau/shoulder/ridge, đầy đủ và tối ưu |
| `#lab` | Mô hình N-hậu, h đếm cặp, bàn cờ và trace |
| `#ch3` | Sideways, stochastic, first-choice, random restart; kỳ vọng và thực nghiệm |
| `#ch4` | SA, dấu ΔC, xác suất chấp nhận, lịch nguội và giới hạn bảo đảm |
| `#ch5` | Local beam, pool chung, mất đa dạng và stochastic beam |
| `#ch6` | GA: encoding, fitness/roulette, crossover, mutation, giới hạn |
| `#ch7` | Bảng so sánh và nối sang adversarial search/CSP |
| `#codelab` | Ba Python hoàn chỉnh: hill-climbing, SA, GA |
| `#quiz` | SessionQuiz 8 câu, 7 topic `local-*` |
| `#hw` | Ba câu Homework4, graph tô màu, gợi ý đóng/mở và 8 ô checklist |

## Tương tác và các hợp đồng

- **Landscape**: 3 trường hợp tự lặp (kẹt đỉnh, restart, chấp nhận đi xuống). SVG,
  current/best và đường sáng lấy cùng frame; V càng cao càng tốt. Caption HTML luôn có.
- **QueensLab**: bàn `1214`, `1111`, `56745676`, `83742516`; 4 thuật toán
  steepest / first-choice / sideways / random restart. Mỗi cột một hậu, hàng từ trên
  xuống 1-based; ô trống ghi h sau nước đi, viền xanh đánh dấu minimum trong neighbors.
  Chỉnh bàn, chọn thuật toán, Lùi/Tiến, về đầu và đổi seed là điều khiển lab có chủ đích.
  Trace deterministic, seed UI 3; tối đa 30 lượt, 240 nước nhận/restart, 20 bước ngang
  liên tiếp. Hết ngân sách không chứng minh vô nghiệm. Không hứa mọi seed tìm ra nghiệm.
- **AnnealingLab**: T 0…10, ΔC 1…8, u cố định 0,30. Cùng u để cô lập tác dụng của T/ΔC;
  không giả làm tần suất nhiều phép thử. T=0 dừng, không chia cho 0.
- **BeamVisual**: pool chung chọn A:9/A:8; hai lượt độc lập chọn A:9/B:6. Bốn pha
  tự lặp, hai use-case tab. Không biến stochastic beam thành chọn đều.
- **GeneticLab**: tự tính rồi mở fitness 4-hậu (2/3/1/0), roulette theo tỷ lệ.
  Hai parent 8-hậu, 7 điểm cắt trong chuỗi; chọn cột/hàng để mutation. Nhãn A/B/M
  kèm màu, chỉ ghi M nếu gene thật sự đổi. Đổi cut bỏ mutation cũ.
- **CodeLab**: code Python standard library, có helper và lời gọi; syntax màu không
  làm đổi nội dung copy. Mỗi tab độc lập chạy được. GA giữ best-ever riêng, không elitism;
  mutation mỗi gene 0,05 và tối đa 200 thế hệ. SA tối đa 2.000 phép thử.

`useSceneLoop` dùng interval, IntersectionObserver và visibilitychange; dừng ngoài
viewport/document ẩn, cleanup khi unmount. Reduced motion đọc lúc nạp trang, hiện frame
cuối với đầy đủ caption tĩnh. Không live region theo frame, không nút điều khiển animation.
Tab có keyboard arrow/Home/End, focus và ARIA. `keepLabTouch` chặn bubbling để vuốt
bàn cờ, bảng/code hoặc range không đổi slide; vẫn giữ native scroll/input behavior.

Mobile: ô bàn cờ tối thiểu 44px, bảng/cờ/code cuộn trong khối; grid child `min-width:0`
để code dài không làm tràn trang. Thanh nav wrap dưới 480px. Không dependency mới.

## Dữ liệu và các diễn giải cần giữ

Primer/quiz dùng khóa `b6` trong bundle chung VI/EN. Quiz ghi qua SessionQuiz/useProgress
vào `sessions.b6`; checklist dùng `b6-checks` qua CheckList/useLocalList. Không ghi storage
trực tiếp từ lab. Homework URL lấy từ registry session b6; bài trước là b5.

- 1/p đếm tổng lượt, (1−p)/p đếm restart sau lượt đầu. Tỷ lệ 14%/94% có ngữ cảnh thí nghiệm.
- O(1) cấu hình khác O(1) byte. Trace sư phạm có thể giữ lịch sử để Lùi/Tiến.
- SA lịch nguội hữu hạn không có bảo đảm hội tụ tối ưu; phân biệt best và current.
- Homework graph thực có A–H, 11 cạnh: dùng 3⁸ trạng thái, 16 neighbors; ban đầu h=2.
- Đường homework 1214→2214→2414→2413 có h=5→3→1→0 là đường hợp lệ, không gán là steepest.
- Lai không bảo đảm con tốt; không suy ra các phép lai bất kỳ đều giữ tính hợp lệ cho TSP.

## Kiểm và bằng chứng

`node scripts/check-ai-b6.mjs`: 7 nhóm số học, invariants, thuật toán, quiz và chạy Python.
`check_lesson.py b6`, `check_i18n.py b6`, `i18n_loop.py b6`, `npm run build`.
Review, coverage ledger, fidelity và browser QA nằm ở `docs/courses/csc14003/reviews/b6-*`.
Fidelity hash hiện tại `3f6c2869af2e1c7e`; đổi chuỗi phải review và đóng cổng lại.

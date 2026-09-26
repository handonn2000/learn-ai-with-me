# Independent quality review — CSC14003 · b6

Ngày đọc nguồn và kiểm logic: 2026-09-21. Hoàn tất và đối chiếu lại artifact: 2026-09-22.
Reviewer: `b6_quality_review`. Chế độ chỉ đọc; không sửa repo.

## 1. Verdict

**PASS — nội dung, số học, coverage theo cơ chế, code Python, engine và cấu trúc UI tĩnh của bài b6.** Không có lỗi kiến thức hoặc phần thiếu bắt buộc đã xác nhận trong phạm vi này.

**Đây không phải lượt trực tiếp quan sát UI runtime của reviewer.** Caller đã báo PASS browser retest với 22 nhóm kiểm (chi tiết ở mục 7b). Hai sửa UI về overflow và vuốt trong lab đã được reviewer đọc lại ở mức code; kết quả chạy trình duyệt được ghi rõ là bằng chứng do caller thực thi.

Bài được gọi buổi 4 lúc bắt đầu xây dựng; sau khi user tách lộ trình thành 13 buổi, local search hiện là **buổi 6**. Review không mở rộng sang các bài b3–b5 vừa tách. Mốc nguồn `Lecture04`/`Homework4` được giữ đúng provenance. Phạm vi người dùng là tạo bài học tham khảo các bài trước, không phải sao chép nguyên xi mọi chuỗi ngẫu nhiên của mọi hình. Các hình lặp cùng cơ chế đã được gộp vào unit; ledger nói rõ ví dụ nào tái hiện và ví dụ nào chỉ tái hiện cơ chế.

## 2. Review manifest

Đã đọc hướng dẫn `.claude/skills/new-lesson/SKILL.md`, `.claude/agents/lesson-quality-judge.md`, `.claude/commands/review-lesson.md`, `lesson-voice/SKILL.md`, `lesson-voice/references/english.md`, `lesson-interactive/SKILL.md`.

Nguồn đã kiểm:

- `public/materials/Lecture/buoi6/Lecture04-LocalSearch.pdf`: 42 trang. Đọc toàn bộ bản trích xuất có ranh giới trang; xem toàn bộ 42 trang qua bốn contact sheet. Phóng riêng p14 (ma trận h), p16 (bàn cực tiểu), p29 (GA), p31 (mã nhị phân); các hình còn lại đọc được trên contact sheet.
- `public/materials/Lecture/buoi6/Homework4.pdf`: 2 trang, xem đầy đủ ảnh từng trang. Xác nhận hình N-hậu và toàn bộ topology/coloring đồ thị.
- Render đã dùng: `/tmp/ai-b4-source/contact-0.jpg` đến `contact-3.jpg`, `slide-14.png`, `slide-16.png`, `slide-29.png`, `slide-31.png`, `homework-1.png`, `homework-2.png`. Tên thư mục cũ không đổi ý nghĩa buổi hiện tại.

Artifact đã đọc: đủ 9 file trong `src/features/lessons/b6/`; khối b6 VI/EN của quiz và math primer; `.ls-*` cuối global.css. Trace imports qua Html, MathPrimer, SessionQuiz, LessonDeck, locale selectors, motion, tokenizer; kiểm route b6, registry và labels của topic. Chỉ dùng các đoạn liên quan b6 trong file dùng chung, không nhận là đã review cả nội dung các buổi khác.

Locale: đọc toàn bộ VI và EN bundle để theo dòng bài; kiểm đối chiếu kiến thức nhạy tại `ch1.body/memory/scale`, `ch2.body/rule/traps/distinction`, toàn bộ `lab`, `ch3.variants/stats/caveat/restart/probability`, toàn bộ `ch4`, `ch5`, `ch6`, `genetic`, `ch7.rows/cost`, `code.notes`, toàn bộ `hw.cards/graphNote`, primer b6, và cả 8 câu quiz/đáp án/feedback. Đây là quality review, không phát hành fidelity verdict hoặc chỉnh pairs_hash. Đã đọc báo cáo fidelity riêng `docs/courses/csc14003/reviews/b6-fidelity.md` (ĐẠT, pairs_hash `3f6c2869af2e1c7e`); caller cần giữ cổng judged hợp lệ sau lần sửa chữ cuối.

Kiểm đã thực thi độc lập:

1. `check_lesson.py b6` exit 0: route, lessonPath, 12 anchor, checklist, math, quiz, deck wiring, giọng và icon.
2. Chạy **8.512 trace / 44.381 frame** với engine thật: toàn bộ 256 cấu hình 4-hậu × 4 thuật toán × 8 seed; thêm hai preset 8-hậu × 4 thuật toán × 40 seed. Kiểm h độc lập, bảo toàn miền/hình dạng board, đúng một cột mỗi move, chiều cải thiện, chọn best khi cần, giới hạn sideways/runs, mục tiêu/stop/limit, không mutate input và replay theo seed. Kết thúc gồm 5.658 goal, 2.853 stuck, 1 limit; đây là fixture, **không phải benchmark xác suất**.
3. Tính lại toàn bộ 56 h ở bảng p14, h và min-neighbor của p16, fitness quần thể 8-hậu/4-hậu, crossover và phản ví dụ trong homework, đường N-hậu và 11 cạnh đồ thị. Tất cả khớp.
4. Kiểm selection all-zero chọn đều; mọi điểm cắt nội bộ 1…7; mọi cột/hàng mutation hợp lệ; SA tại T=0, ΔC=0 và âm, các số 81,87%/13,53%. Kiểm dữ liệu của cả hai mode beam và cả ba đường landscape.
5. Trích ba khối Python đang hiển thị vào `/tmp/ai-b6-code-0.py`…`2.py` và chạy thật. Hill-climbing trả h=1; SA seed42 trả best/current h=0; GA seed42 kết thúc h=1. Kết quả GA phù hợp ghi chú không hứa giải được. Kiểm thêm zero trials, T=0, anneal empty/singleton, tham số GA sai và mutation 0/1.
6. Tokenize từng khối Python rồi nối nguyên văn: cả ba bằng chuỗi nguồn, không mất whitespace/ký tự. JSX hiển thị token như text, không render code nguồn thành HTML.
7. Ngày 22/09 đọc lại bốn TSX bị sửa touch handler cùng `.ls-*` CSS. `keepLabTouch` chỉ stopPropagation, không preventDefault; dùng ở bảng so sánh, Tabs/code, AnnealingLab, QueensLab, GeneticLab. Luồng dữ liệu/engine/text không đổi. Khối math b6 vẫn nguyên dù hash file dùng chung đổi do bài khác.

Không chạy lại full build trong reviewer để tránh trùng kiểm và ghi artifact build vào repo; caller sở hữu build/browser/i18n cuối. Không cài dependency, không mở service, không sửa nội dung.

Nguồn chính thống bổ sung đã mở: [AIMA, chương Informed Search and Exploration, §4.3, trang in 112–118](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap04.pdf) để kiểm hill-climbing, thống kê, beam và GA; URL có `4th-ed` nhưng trang PDF mang cấu trúc chương cũ nên không suy ra phiên bản từ đường dẫn. [Hajek, Cooling Schedules for Optimal Annealing (1988), pp.311–312](https://web.mit.edu/6.435/www/Hajek88.pdf) hỗ trợ giới hạn không gian/truy cập và hội tụ theo lịch nguội, không phải lời hứa hữu hạn.

Snapshot SHA-256 ở cuối report là artifact hiện tại lúc đóng nội dung ngày 22/09. Snapshot cũ còn tại `/tmp/ai-b6-review-hashes.json`; snapshot mới tại `/tmp/ai-b6-review-hashes-final.json`. Hash file dùng chung nhận diện artifact, không mở rộng phạm vi review sang mọi phần trong file đó.

## 3. Required fixes

**Correctness: None. Coverage/depth trong phạm vi đã định: None.**

**Visual/static accessibility:** không có lỗi mới xác nhận từ code. Không nhận PASS cho contrast, thao tác mobile, nhịp animation hoặc persistence chỉ từ đọc code. Caller đã tìm và sửa vấn đề overflow/touch, rồi báo browser retest PASS ngày 22/09. Hai lỗi này được ghi nhận là **resolved theo code review + retest của caller**; reviewer không nhận là đã tự thao tác browser.

Hai góp ý ở lượt trước được kiểm lại độc lập và đã đúng trong snapshot này:

- SA ghi **“tối đa 2.000 phép thử”**, phù hợp early exit khi đạt h=0 hoặc T≤0.
- GA ghi **fitness của best-ever không giảm, h(best) không tăng**, trong khi population-best có thể giảm. Code lưu bản sao best bên ngoài quần thể và không chèn elite trở lại.

## 4. Coverage ledger

Bản đầy đủ: [b6-coverage.md](b6-coverage.md). **53 unit nội dung: 45 covered, 8 covered-with-correction.** Không có missing/thin/unverifiable trong phạm vi nội dung/cơ chế đã định. Đây là đếm unit, không phải phần trăm phủ slide.

Đã account đủ 42 trang lecture và hai trang homework. Bìa, divider, outline và kết là loại trừ hành chính; outline không có topic bị bỏ. Các ví dụ chính có số liệu và code đều được đối chiếu: h17→best12, strict minimum h1→mọi neighbor≥2, 14%/94%, 4/3/21/64 bước, 1/p, hai dấu xác suất SA, beam pooled selection, 24bit, roulette, crossover, mutation, workflow GA, N-hậu và graph coloring.

Không yêu cầu tái bản nguyên xi lần sinh quần thể thứ hai trong hình p29 hoặc chuỗi binary toy p31 vì chúng lặp cơ chế đã được dạy và tương tác. Không nhận rằng bài đã trình bày một chương tối ưu liên tục; đó là một câu gợi mở trong nguồn, primer hiện chỉ dùng gradient ở mức trực giác.

## 5. Source corrections and uncertainty

- Slide p4 nói “no goal test” theo pure optimization; bài phân biệt N-hậu h=0 có goal test. Đúng.
- Slide p6 nói bộ nhớ thường constant: bài nói O(1) cấu hình nhưng O(N) lưu board, và tách bộ nhớ trace phục vụ lab. Đúng, tránh nhầm số node với số byte.
- Slide p6 cho n200/n1.000.000: bài giữ là ví dụ quy mô, không đóng thành giới hạn thuật toán. Không kiểm đây là benchmark trên cấu hình máy cụ thể vì nguồn không cung cấp thiết lập.
- Slide p19 gọi 1/p là số restart: bài ghi rõ số lượt tính cả lượt đầu; restart sau đó là (1−p)/p. Tái tính p=.14 khớp 7.14/6.14.
- SA: bài không gắn bảo đảm vô hạn của lịch đủ chậm vào code geometric hữu hạn. Cách giới hạn này phù hợp [Hajek, pp.311–312](https://web.mit.edu/6.435/www/Hajek88.pdf).
- Source p36/p38 khác nhau về per-gene và per-individual mutation. Bài chỉ rõ hai phân phối, chọn per-gene cho Python. Source p39 cho phép cut cuối; bài chọn nội bộ và giải thích endpoint chỉ copy. Đây là biến thể có nhãn, không phải lỗi thuật toán.
- Homework p2 mô tả a…g nhưng hình có A–H: bài theo hình 8 đỉnh, có ghi đính chính; 3⁸=6.561 và 16 neighbors đúng.
- Không đem bình luận cũ ở p41 thành khẳng định về trạng thái nghiên cứu hiện nay. Bài yêu cầu so benchmark cùng budget, không có thứ hạng GA vượt restart cho mọi bài.

## 6. Optional enhancements

**O1 — nói thêm một câu về không gian liên tục ở ch1.scale.** Ví dụ: “Không gian liên tục có vô số điểm lân cận, nên cách tạo bước phải thích nghi; bạn có thể dùng nhiễu nhỏ hoặc hướng dốc thay cho liệt kê mọi hàng xóm.” Lợi ích: nối trực tiếp bullet p6 với primer gradient, tránh cảm giác local search chỉ dành cho bàn cờ. Công: khoảng 10–15 phút gồm VI/EN và review lại key. Không cần thêm lab hoặc đạo hàm. Nguồn: [AIMA §4.4, trang in119–120](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap04.pdf).

**O2 — thêm lời mời thử đúng preset của Quiz01 ở cuối lab.experiments.** Chọn “4 hậu · cùng hàng” + First-choice, rồi ghi lại h qua các bước. Lợi ích: người học nối ngay slide p20 với lab; không đổi engine hay độ khó. Công: 5–10 phút + fidelity key. Nguồn: Lecture04 p20 đã đọc.

Các đề xuất này tùy chọn, không là điều kiện cho PASS nội dung.

## 7. Retest checklist

Danh sách dưới là tiêu chí đối chiếu và regression sau thay đổi tiếp theo; các mục caller đã báo thực hiện được ghi ở mục 7b.

- Caller xác nhận build cuối và i18n gate cho b6, với fidelity verdict khớp cặp chữ hiện tại.
- Browser đi hết bài VI và EN, scroll/deck, desktop/mobile, dark/light; xác nhận bảng/board/code cuộn trong container, không kéo ngang toàn trang.
- Retest patch touch: vuốt trong bảng, code, queens, roulette/crossover và range SA không chuyển slide; vuốt vùng không tương tác vẫn điều hướng deck. Bấm/keyboard/select/range vẫn hoạt động.
- Xem hai vòng của Landscape mỗi tab và Beam mỗi tab, nhất là restart/loop boundary; kiểm caption/điểm/đường cùng trạng thái. Hai loop dùng observer, visibility listener và cleanup interval đúng theo static code; vẫn cần chứng cứ browser.
- Reduced motion sau reload: hình tĩnh ở frame giải thích đầy đủ, caption vẫn có; không aria-live theo frame. Ra ngoài viewport hoặc ẩn document thì loop ngừng; quay lại có thể tiếp tục; rời route không còn scheduler.
- Thử quiz đủ tám câu và đọc kết quả từ tiến độ b6; kiểm checklist đúng lesson. Đổi preset/algorithm/seed/mutation/cut/reset không để nhãn và kết quả lệch.
- Sau mọi sửa chữ, fidelity reviewer chấm lại key ảnh hưởng; sau sửa engine, lặp fixture tương ứng. UI-only patch hiện tại không đòi chạy lại toàn bộ 8.512 trace nếu engine vẫn giữ hash.

## 7b. Focused re-review và browser retest nhận từ caller

Ngày 2026-09-22, caller báo đã hoàn thành browser QA **22 nhóm PASS**:

- 16 tổ hợp preset × algorithm và replay; seed3 Random restart đạt h0 sau5 lần bấm Tiến.
- Mọi điểm cắt và mutation của GA; SA tại T0/T1.
- Quiz8 câu đạt100%; checklist/quiz lưu và đọc lại, bao gồm chuyển locale.
- Deck anchors và keyboard.
- Viewport320/390/760/1440 × hai theme: không tràn ngang toàn trang.
- Hai vòng cho từng tab của ba landscape và hai beam; offscreen/hidden pause; reduced motion.
- Build cuối, 7 nhóm engine và 12 nhóm course kiểm qua; engine và bundle không đổi, fidelity hash giữ nguyên.

Reviewer không chạy lại các browser case này. Báo cáo caller là bằng chứng thực thi; static reread của reviewer đã xác nhận các sửa có phạm vi đúng và không đổi phép tính:

1. **Overflow — resolved.** `.ls-chapter-body > * { min-width: 0; }` cho các grid child co nhỏ; nav wrap ở dưới480px. Chỉ tác động bài `.ls-lesson`.
2. **Touch/deck — resolved.** `keepLabTouch(event)` gọi `stopPropagation()` ở touchstart/touchend của Tabs, QueensLab, GeneticLab, AnnealingLab và bảng so sánh. Không `preventDefault()`, vì thế không chủ động hủy thao tác native của slider/scroll. Event không đến listener deck để biến vuốt trong lab thành đổi slide. Các phép tính, trace và nội dung caption không đổi.

Không có finding mới trong phạm vi code/static. Không cần lặp toàn bộ fixture engine do hash engine giữ nguyên. Snapshot hash dưới đây bao gồm patch này. Nếu caller sửa thêm UI sau snapshot, chỉ cần retest vùng ảnh hưởng và cập nhật manifest, không chấm lại coverage không đổi.

## Artifact hashes

| Artifact | SHA-256 |
|---|---|
| `src/features/lessons/b6/lesson06.text.en.ts` | `6b39a3ebe41b8d9dc524a8c906b7e719670676873fd8cb1a82a8716c0471d787` |
| `src/features/lessons/b6/Lesson06LocalSearch.tsx` | `413cf799838d25fed875896b65698e41916e4ca14bce6d491c2990790aa44fdf` |
| `src/features/lessons/b6/lesson06.code.ts` | `ddc0e22c54ce230e685c89eb6b2d1eee830a13e61817dcf0d9c5f8c1afb714e9` |
| `src/features/lessons/b6/local-search-engine.ts` | `d6eb09dac18c3c7c6a57aaebebc83294d84a3af454202ef6f8e2e97ef221d652` |
| `src/features/lessons/b6/lesson06.text.ts` | `6e89586cf5cbaca7b3666644de7af9ea6a8358766d03149f1f0e009790ef4fe4` |
| `src/features/lessons/b6/LocalSearchVisuals.tsx` | `0fa891ac2a19a4a1c937f96be4e258add6b6e40e3cc35ad8382b21e7d0a7e09d` |
| `src/features/lessons/b6/lesson06.text.vi.ts` | `18e3fd57df4bbea94244d012c9f193ec118ecf89480aa29ae7b8357b1a1b2a9d` |
| `src/features/lessons/b6/QueensLab.tsx` | `b2572e74350563064cad084fd00e72837637c8f445d12acdd47829ca32350f47` |
| `src/features/lessons/b6/GeneticLab.tsx` | `e8e4f415d8293f9638adf281ae0233cc62bbb1c0965aaccc088de38fbd1c2350` |
| `public/materials/Lecture/buoi6/Lecture04-LocalSearch.pdf` | `f82f1b43f8b7b741c5560e0b876bf9add34980c5f19d952c87812b4098373146` |
| `public/materials/Lecture/buoi6/Homework4.pdf` | `884a0d7972ac568bb03d320829a28f616859a8b3e40fdeb28af56896c09bac9d` |
| `src/content/courses/csc14003/session-quizzes.js` | `aebf0a893afa9d64428aca0d56a18731fea384e9045908b2d45f825d6a5c0d26` |
| `src/content/courses/csc14003/session-quizzes.en.js` | `a55d934c08afe7824a7f2f6405e0a657a63d1d7b4476a170ea642e5c149681d2` |
| `src/content/courses/csc14003/math-primers.js` | `2dcdd829c04aca07f87d69e278116951c2e6bb1f172fe11d8200b35c8a4b208e` |
| `src/content/courses/csc14003/math-primers.en.js` | `4dcd543589285dc6c548cea641ba6128d6b8ea8b22b252da857efa121530f681` |
| `src/styles/global.css` | `729e510dc9dbf2ee8027958b7b0ea2449f17b1826d2297d204781ff18487e8c3` |
| `src/components/SessionQuiz.tsx` | `b3364b7518c7e2ac2a94c3a578176530fa7ff57fe5b81279f3a5fd4cda2d948f` |
| `src/components/LessonDeck.tsx` | `2db3b2f22f5141a94422d1124c5b3d17f40736fa6d9667e1d19e4ecffcd31dc3` |
| `src/lib/motion.ts` | `a408eed1630f843ea72aae1f5a6a9ed95f8cd17549ba1d2426ad2e1dada4ccfb` |
| `src/features/search-lab/search-engine.js` | `45fb755a6e237951bc397e9e1fe9deb1563fbab111e259c89fe0652326bd7b8e` |
| `src/App.tsx` | `6b5da65c92b76732b05e9bb7792124e3ac8d27958b9b14632f1dee087ab2b1bc` |
| `src/content/courses/csc14003/index.ts` | `894402e8f4ad53c38892b556e3f7d7b19d0e92bf4bd921e6029e12ac1006020a` |
| `src/content/courses/csc14003/topics.ts` | `d87da590362a66ef45b4ecca516e0a1989ff26444000343ec94688f9057b2ffc` |

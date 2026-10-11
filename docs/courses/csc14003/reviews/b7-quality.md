# Review độc lập — CSC14003 buổi 7

Ngày: 2026-10-07. Reviewer áp dụng `.claude/agents/lesson-quality-judge.md`; chỉ viết báo cáo, không sửa lesson.

## 1. Verdict

**PASS trong phạm vi content/code tĩnh và tính toán engine. Browser pending.** Bản đầu NEEDS CHANGES; sau một vòng viết lại và focused re-review, Q01–Q10 đã được giải quyết. Hai phát hiện bổ sung về nhãn A/B và utility primer đã sửa và được đọc lại. Không xác nhận visual contrast, pacing thực tế, mobile, keyboard hoặc hai chu kỳ loop bằng browser trong báo cáo này.

Phạm vi người dùng: review toàn bộ bài B7 để dễ hiểu, dễ hấp thu, có giải thích/ví dụ chi tiết và visual hữu ích. Đây không phải yêu cầu tái hiện mọi numeric diagram và mọi cấu hình lịch sử trong slide. Kiến thức cốt lõi được kiểm tra đầy đủ; lịch sử chỉ là ngữ cảnh và bài tập PDF gốc là bước tự luyện sau scaffold. Không tuyên bố full-detail slide parity.

## 2. Manifest

Nguồn: `public/materials/Lecture/buoi7/Lecture05-AdversarialSearch.pdf` (51 trang, đọc extraction51/51; xem hình6,11,16,18,19,23,24,25,28,29,34,41,42,47,48,49,50), `Homework5.pdf` (1 trang, toàn bộ text và hình). Nguồn đã được đối chiếu với bản đầu, và các unit bị ảnh hưởng được đọc lại trong bản mới.

Đọc đầy đủ VI và component render mới: `Lesson07Adversarial.tsx`, `GameVisuals.tsx`, `game-engine.js`, `lesson07.code.ts`, `lesson07.css`, selector text. EN: đọc toàn bộ bundle mới; kiểm tra các số, công thức, phân biệt bound/exact, utility transformations, ví dụ và feedback. Đây là correctness/content pass; fidelity judge riêng chịu trách nhiệm gate dịch. Đọc lại B7 math primer VI/EN và quiz VI/EN; trace selector imports để xác nhận dữ liệu render. Đọc các shared components LessonDeck/Nav, MathPrimer, SessionQuiz, CheckList, Html và tokenizer. Đọc hook `useLessonLoop` để kiểm tra lifecycle tĩnh.

Kiểm tra thực sự chạy: `node scripts/check-ai-b7.mjs` PASS: defaults, mutations, ties, MIN root, reverse ordering, invalid input và 800 generated cases. Kiểm tra này xác nhận giá trị root, nước được chọn có giá trị tối ưu, read/skipped disjointness và cut bounds. Không suy từ đây ra full chess implementation. Tính độc lập các ví dụ chance1.75/4.5, affine/nonlinear16/18, bounded expectation5, evaluation3 và ba bài tập root MIN 5/cutoff3/threshold3/7.

Các check i18n/check_lesson khác do author báo pass; reviewer không chạy lại và không dùng chúng thay cho đọc content. Browser review chưa thực hiện bởi reviewer này.

Tham khảo bổ sung: [AIMA adversarial search chapter](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf), §6.2 về chiến lược có contingencies và §6.3 về perfect ordering. Manuscript chứa ví dụ lịch sử; chỉ dùng cơ chế thuật toán, không dùng nhận định “current” làm dữ kiện hiện tại.

### Artifact identity — SHA256

| File | Hash |
|---|---|
| GameVisuals.tsx | 7017e3acdef9305ff87b89da11ed296c2f094fcea7b9349e740de9b4484a2b74 |
| Lesson07Adversarial.tsx | 8916a1280bdfdaed5c63dac325f7165f92fc9946aa287b22e3f17d4d11fefec8 |
| game-engine.js | 47dea93ce984e7fdaad10f3cd55bbf26c4c6ff28678b6701ab8c28f9e27d73ac |
| lesson07.code.ts | 98080931c4b0d5377b7b39e152ff4d514c4989fe8080641ee0788653125131f9 |
| lesson07.css | 975540b7a5fe45530105b63118ebc607bdbcf0d21edc8dd01053d3e58095bb43 |
| lesson07.text.vi.ts | a30c2eef436d4a14b284206c4a40b7cdd3c4353db9de56aa68551d4f8c9de372 |
| lesson07.text.en.ts | 82e8253ea833c0179596b7dd60fc3b3093686d0831dbe621266ca36b7e25f4d3 |
| lesson07.text.ts | 251fedbe77054b79656220d861f0b4d8eb1585e58d0e8a506b348095aa486624 |
| useLessonLoop.ts | 3c49a3cf2d8118501cb8bfdfde9065c54c923308d9abd4b44805276c04a723d6 |
| math-primers.js | 7216ab8e958634d3756c99deb03ec86b126c3445f00e0f040c492dde07ec27fe |
| math-primers.en.js | 464e6074234a50a8fbdd7d59b4d7d253c98ee7f2b254a57f250acee68569f34d |

Paths trong bảng relative tới `src/features/lessons/b7`, riêng hook là `src/lib`, primer là `src/content/courses/csc14003`.

## 3. Required fixes và lịch sử resolution

Không còn required fix trong phạm vi tĩnh đã khai báo.

| ID / initial priority | Bản đầu | Resolution verified |
|---|---|---|
| Q01 high correctness | VI trộn cây8 lá, lab4 lá, gốc4/3 khác nhau | minimax.paras/steps và visual dùng3,5,0,7; ví dụ9 lá nguồn được tách thành example riêng3/2/2 |
| Q02 high correctness | αβ nói giảm depth với cùng budget | pruning.cost sửa O(b^(m/2)) và gần gấp đôi depth |
| Q03 medium correctness | Horizon parity/ply/role mơ hồ | limits dùng ply nhất quán, doomed bishop/delaying checks; không hứa quiescence chữa mọi horizon |
| Q04 medium correctness | Ba tầng/four pairs không khớp | hw có ba nhiệm vụ xác định topology, đáp án5/3/3÷7 đúng |
| Q05 medium depth | Thiếu assumptions/recursive base/strategy | model/cards, recurrence và short code; strategy có nhánh, draw/loss có thể xảy ra |
| Q06 medium depth | EVAL/chance/scale thiếu bridge | own-minus-opponent weights, terminal trước cutoff; expectimax/expectiminimax, cardinal utility, chance bounds |
| Q07 high navigation | Phantom lab làm10 descriptor/9 child, lệch deck | 11 NAV + hero và12 direct children; lab thực; mỗi anchor có section tương ứng |
| Q08 medium visual | Frame/caption lệch, α sớm trong minimax | Captions lấy từ cùng generated trace; pure minimax không render bounds; mỗi leaf/back-up/cut event tách riêng |
| Q09 medium access | Motion không offscreen/reduced, live announcements | useLessonLoop lifecycle/hidden/IntersectionObserver/reduced; static prose đủ; no frame live region; không xác nhận browser pacing |
| Q10 medium readability | VI quiz hardcoded EN, hint dùng câu CSP | Dedicated localized quiz/hw.hint |
| Q11 medium node identity | A/B trong prose nhưng không thấy trên visual | GameTree internal label nay A·MIN/B·MIN hoặc A·MAX/B·MAX |
| Q12 medium primer ambiguity | Utility why “dương choMAX/âm choMIN” có thể gợi đổi dấu | Hai primer nêu cùng góc nhìnMAX, positive helps MAX, negative helps MIN, no sign flip |

Pedagogical progression đã được cải thiện: bàn cờ cụ thể → cùng một cây số → predict/reveal recall → editable lab → reuse tree để giải thích pruning → giới hạn ngân sách → chance → extensions → summary → quiz → transfer. Người học có first-pass guide và advanced material được đặt sau core. Lab có computed outputs thực, không phải giá trị mẫu hardcoded. MIN-root/tie/reverse-order giúp phá hiểu lầm root luôn MAX và pruning luôn tiết kiệm cùng số lá.

## 4. Coverage ledger

Xem [b7-coverage.md](b7-coverage.md):35 grouped units, **28 covered,1 covered-with-correction,6 out-of-scope**. Không còn missing/thin trong phạm vi cốt lõi đã khai báo. Sáu exclusions cụ thể: hardware/history details; từng multiplayer vector diagram; toàn bộ alpha-beta code nguyên bản; từng chess-board quiescence piece; toàn bộ expectimax code nguyên bản; từng node của original chance-pruning diagram. Các cơ chế tương ứng vẫn được giảng ở mức phù hợp với người mới.

Homework5 được liên kết từ course registry thực. Không tính link riêng là lời giải: coverage ở đây là staged practice có scaffold trước PDF gốc; bản mới không tuyên bố đã điền mọi node trong assignment. Original exercise values độc lập: HW1 root MIN 6 chọn A; HW2 root MAX 2 chọn left.

## 5. Source corrections và uncertainty

Lecture p18 diễn đạt optimal strategy như path guaranteeing win; lesson sửa thành contingent plan guaranteeing minimax value, có thể draw/loss. Đây là covered-with-correction. p33 previous-iteration ordering không được gán lại nhãn killer heuristic. p42 loss được diễn giải inevitable. Historical architecture/detail không được biến thành current factual claims.

Bounds/exact distinction đúng: mặc dù default B thực sự0, pruning visual giữ ≤0 vì chưa đọcb₂. Mutable MIN-root cutoff trả lower bound ≥score đúng; root vẫn exact. Chance pruning yêu cầu đã biết bounded range, không dùng trực tiếp MIN cutoff cho expectation. Square-example chỉ dùng nonnegative outcomes, nơi bình phương giữ order nhưng đảo expectation; positive affine giữ expectation choices.

Không có unresolved material correctness trong phạm vi core tĩnh. Browser pending là giới hạn xác nhận delivery, không phải pass browser.

## 6. Optional enhancements

- Một ví dụ evaluation/quiescence dạng hai thế cờ nhỏ có thể thêm sau này nếu học viên cần hình chiến thuật; chưa cần dependency3D.
- Một walkthrough sâu hơn cho Homework5 giúp chuyển từ shallow lab sang uneven tree. Nguồn gốc và transfer exercises hiện có đã đủ để giao bài tự luyện; không cần đưa mọi lời giải ngay.
- Move code walkthrough vào core nếu người học muốn implement thuật toán; hiện code nằm phần mở rộng nên first pass có thể bỏ qua.

## 7. Retest checklist / pending browser

Browser reviewer cần xem ít nhất hai cycles minimax/αβ, default/result/replay boundary, mobile tree scroll, readonly labels, theme contrast, focus/keyboard, hidden viewport và reduced motion. Verify deck toàn bộ12 sections, #lab/#quiz/#practice đúng labels, input score/root/order recalculates và reset. Với reduced motion kết quả cuối cộng stable prose phải đủ hiểu. EN fidelity judge riêng vẫn quản lý judged gate/hash; report này không tự stamp gate.

Nếu lesson/visual/hook bị thay đổi sau hashes trên, re-review affected content/trace; không dùng PASS này cho artifact khác.

## Focused follow-up — local scroll accessibility

Đã đọc lại hai wrapper `GameTree`/`Table` sau patch cuối. Cả hai có tabIndex=0, localized aria-label, giữ default scrolling và chặn bubble của ArrowLeft/ArrowRight để deck không đổi slide khi người học cuộn ngang nội dung đang focus. Touch start/end chặn bubble vào deck swipe handler, giữ native local scroll. CSS focus-visible áp dụng cho các wrapper. Đây là kiểm tra code; gesture/keyboard thật cần browser check riêng. Không phát hiện regression content/engine; hashes phía trên đã cập nhật từ byte thực, không biến đổi văn bản hash.

Author báo browser đã kiểm tra lab/default/mutations/reverse/MIN/reset/chance/recall, body375px với local520px tree scroll, deck12sections và #lab mapping. Đây là evidence từ author, không phải browser inspection trực tiếp của reviewer; xem báo cáo browser riêng để biết checks/timing còn pending.

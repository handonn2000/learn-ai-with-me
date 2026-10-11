# Buổi 7 — source coverage ledger

Ngày: 2026-10-07. Review độc lập theo `.claude/agents/lesson-quality-judge.md`.

Phạm vi: kiến thức cốt lõi và trải nghiệm dễ hiểu của bài CSC14003 B7, không phải yêu cầu chép lại mọi chi tiết slide. Đã đọc văn bản 51/51 trang Lecture05-AdversarialSearch.pdf; xem các hình ở trang 6,11,16,18,19,23,24,25,28,29,34,41,42,47,48,49,50. Homework5.pdf: đọc và xem 1/1 trang. VI đọc đầy đủ; EN đọc các key tương ứng và kiểm tra số, công thức, feedback. Chưa kiểm tra browser trong review này.

Các locators dưới đây trỏ tới `src/features/lessons/b7/lesson07.text.vi.ts` và component tương ứng; nội dung trong text được kiểm tra là thực sự render, không tính dữ liệu bỏ quên.

| Source + page | Unit / detail | Lesson anchor/key | Status | Evidence / scope |
|---|---|---|---|---|
| Lecture 4 | Hành động đối thủ và contingencies | model.paras, minimax.strategy | covered | Chiến lược có nhánh theo phản hồi |
| Lecture 5–7 | Phân loại thông tin/ngẫu nhiên, cạnh tranh | model.rows, assumptions | covered | Chess, backgammon, poker và hợp tác được phân biệt |
| Lecture 7,9 | Giả định minimax cơ bản | model.assumptions, extensions.codeLead | covered | Hai người, tổng bằng không, đầy đủ thông tin, luân phiên, không chance; cây hữu hạn |
| Lecture 8,13 | Cây tăng theo hàm mũ, hạn chế thời gian | limits.paras | covered | 30^4, 30^8, tăng 810000 lần; rõ là mô hình mẫu |
| Lecture 10 | Các thành phần mô hình trò chơi | model.cards | covered | S0, player, actions, result, terminal, utility |
| Lecture 11 | Bàn tic-tac-toe, cạnh hành động, điểm kết cục | BoardExample, model.paras | covered | X thắng hàng đầu; utility từ cùng góc nhìn |
| Lecture 12–16 | Vai trò kết hợp search/tri thức/lookup/học | extensions.cards[3] | covered | Cung cấp ngữ cảnh lịch sử, không tuyên bố số liệu hiện tại |
| Lecture 12–16 | Chi tiết lịch sử/phần cứng/dataset/AlphaGo architecture | — | out-of-scope | Chỉ ngữ cảnh được yêu cầu; không giả nhận đầy đủ architecture |
| Lecture 18 | Chiến lược, minimax value, không hứa luôn thắng | minimax.strategy | covered-with-correction | Sửa slide mô tả strategy như một path bảo đảm thắng |
| Lecture 19 | Minimax ví dụ ba nhánh 3/2/2 | minimax.example | covered | Giữ các bộ lá 3,12,8 / 2,4,6 / 14,5,2 |
| Lecture 20–21 | Đệ quy/base case, value vs action | minimax.formula, extensions.code, lesson07.code.ts | covered | Terminal base case và choose_move tách biệt |
| Lecture 22 | Cây hữu hạn, optimal opponent, time/space | model.assumptions, pruning.cost, codeLead | covered | O(b^m), O(bm) và điều kiện sinh các con |
| Lecture 23 | Vận dụng cây nhiều tầng/không đều | hw + Homework5 link | covered | Bài tập gốc là bước chuyển sau các bài tập có lời giải |
| Lecture 24–25 | Utility vector, mục tiêu nhiều người/liên minh | extensions.cards[0] | covered | max-n chọn thành phần của người đang đi; nêu giới hạn hợp tác |
| Lecture 24–25 | Từng vector/nước trong hình gốc | — | out-of-scope | Không yêu cầu sao chép mọi numerical diagram |
| Lecture 27–30 | Safe pruning, inherited α/β | pruning.paras, GameLoop pruning | covered | Cận khác giá trị chính xác; root value giữ nguyên |
| Lecture 28–29 | Bằng chứng unread successors không thay root | pruning.steps, check | covered | B ≤ 0 không vượt A=3; equivalent smaller tree |
| Lecture 31–32 | Cập nhật và cutoff MAX/MIN | pruning.paras, game-engine.js, editable MIN-root lab | covered | MAX cập nhật α, MIN cập nhật β; engine trace hỗ trợ cả hai |
| Lecture 31–32 | Toàn bộ mã alpha-beta nguyên bản | — | out-of-scope | Có mô tả và trace; chỉ mã minimax ngắn được render |
| Lecture 33 | Ordering, worst/ideal complexity | pruning.ordering, cost | covered | O(b^(m/2)), gần gấp đôi độ sâu; tie breaking |
| Lecture 33 | Iterative ordering/transposition | limits.cards[0], extensions.cards[1] | covered | Lưu depth và exact/lower/upper bound |
| Lecture 34 | Bài tập pruning sâu | hw + Homework5 link | covered | Nguồn gốc được liên kết, không giả nhận đã giải mọi node |
| Lecture 36–39 | Cutoff vs terminal, evaluation rules | limits.paras, evaluation, rule | covered | Utility thật trước EVAL; trọng số own-minus-opponent |
| Lecture 38 | Feature interactions | limits.evaluation | covered | Material +3 không đủ khi vua nguy hiểm; interactions |
| Lecture 40–41 | Quiescence, tactical instability | limits.cards[1] | covered | Không dừng giữa capture chain, có safeguard |
| Lecture 41 | Hai thế cờ gốc và từng quân | — | out-of-scope | Không yêu cầu tái hiện bàn cờ nguyên bản |
| Lecture 42 | Horizon delaying loss | limits.cards[2] | covered | Tượng bị mất bị trì hoãn ngoài cutoff; không hứa quiescence chữa mọi lỗi |
| Lecture 43 | Singular, beam/PROBCUT, lookup | extensions.cards[2–3] | covered | Phân biệt heuristic mất nước tốt và safe αβ |
| Lecture 45–47 | Chance rules/expectimax vs expectiminimax | chance.paras, formula, example | covered | Probabilities hợp lệ; giữ MAX/MIN khi phù hợp |
| Lecture 47 | Mã expectimax gốc | — | out-of-scope | Quy tắc được giảng bằng công thức/ví dụ, không hứa runnable code |
| Lecture 46 | Utility scale under expectation | chance.scale | covered | A=4 vs B=3, square đảo16/18; positive affine |
| Lecture 48–49 | Bounded chance pruning | chance.prune | covered | Hai kết quả [0,9], đọc1 ⇒ upper expectation5 < incumbent6 |
| Lecture 49 | Từng node diagram gốc | — | out-of-scope | Mechanism giữ nguyên bằng ví dụ đơn giản tương đương |
| Lecture 50 | Evaluation ở nonterminal frontier | limits.paras, summary.rows | covered | Nguyên tắc chung frontier dùng EVAL; không giả nhận Pac-Man hình gốc |
| Homework 1 | MIN-root, MAX-root uneven trees | practice cards + original PDF link | covered | Scaffold rootMIN5, cutoff3, chance threshold3/7; original homework vẫn là bài tự làm |

35 grouped units: **28 covered, 1 covered-with-correction, 6 out-of-scope**. Denominator là các unit phân biệt trong bảng, không phải số trang hay tỷ lệ keyword. Không có missing/thin còn lại trong phạm vi cốt lõi này; không tuyên bố full-detail slide parity.

Administrative exclusions: cover1, outline2, dividers3/17/26/35/44, end51. Nguồn bị sửa/ghi chú: p18 strategy không bảo đảm thắng; p33 không tái dùng nhãn killer-move cho previous-depth ordering; p42 diễn giải loss là inevitable. Chưa kiểm tra browser; source diagram nguyên bản được xem để kiểm chứng cơ chế dù một số chi tiết thuộc phạm vi bổ sung.

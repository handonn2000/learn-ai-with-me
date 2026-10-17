# Ga admissible: bước đoán quan hệ + hệ thống lại có hiện bản đoán

**Trạng thái: đã dựng (2026-10-17).** User duyệt ba đề xuất: hiện lại bản đoán ở đầu lesson thay vì đoán
lại, bỏ `admissible-e3`, phản hồi ngay. Đây là thử nghiệm đầu tiên của biến thể "đoán quan hệ" (lấy từ "Make it
wrong / Make it again" của Justin Sung); skill `learning-methods` đã ghi nó là biến thể của M1.

## Vì sao chọn ga này

- Kỹ năng loại **K** (giải thích vì sao admissible giữ A* đúng), kèm một phần T (kiểm tra một h).
  Cái khó là **quan hệ** giữa các ý: đoán quá thì sao, đoán hụt thì sao, ví dụ nào thuộc nhóm nào.
- Người học tới đây đã biết g, h, f = g + h, A*, UCS và đường chim bay. Như vậy các thẻ là "chấm đã
  thấy", chỉ chưa biết cách nối. Đó đúng là điều kiện Justin làm trong video: ông nối từ khóa *sau khi*
  đọc, chứ không nối những từ chưa gặp bao giờ (M1: "không dùng khi phải đoán bừa").
- Lesson hiện chưa có bước đoán, chưa có `reorganize`, và `recall.ts` chưa có câu nhớ lại cho
  `admissible` (luật 4). Việc thêm bước này lấp được hai trong ba chỗ thiếu.

## Dàn ý ga (theo khuôn ghi lựa chọn của `learning-methods`)

```
relate    · M1 (biến thể) · đoán 4 quan hệ giữa các ý đã biết; nhắm ngộ nhận "đoán quá chỉ làm chậm"
explain 1 · M2 · giữ nguyên: SearchPlayer trên bản đồ đoán quá tay, A* trả về S → G tốn 3
explain 2 · M4/M12 · giữ nguyên: định nghĩa h ≤ h*, ví dụ, vì sao đủ; Deep: nhất quán
ex 1      · M3 · giữ nguyên: number, h*(C) = 6
ex 2      · M5 · tìm lỗi: xếp 5 lập luận vào Đúng / chỉ thử một nút / hiểu nhầm điều kiện
ex 3      · M4 · MỚI: choice về chứng minh, f(n) ≤ C* < f(G2) (thay e3 cũ đã bỏ: sửa h(A))
recall    · M7 · MỚI: "Admissible nghĩa là gì, và vì sao nó giúp A* ra đường rẻ nhất?"
reorganize· M11 · MỚI: hiện lại bản đoán → sửa trên giấy → so với các ý
```

## Bước 1 · Đoán quan hệ (`kind: 'relate'`)

Màn mở bằng chip **Đoán trước** và dòng "Chưa học phần này. Cứ đoán, sai cũng được." như `GuessStep`.

**Một dòng nhắc chữ** (không dạy gì mới, chỉ dùng chữ của ga A*):
"*Đoán quá* (overestimate): h lớn hơn chi phí thật còn lại tới đích. *Đoán hụt*: nhỏ hơn."

**Câu hỏi:** "Nối thử từng cặp. Bên trái quan hệ thế nào với bên phải?"

**Ba quan hệ, cố định cho mọi cặp** (nút phân đoạn, mỗi nút cao ≥ 44px):
`dẫn tới` · `là một ví dụ của` · `không phải`

| # | Bên trái | Bên phải | Đáp án | Ngộ nhận nhắm vào | Phản hồi một dòng |
|---|---|---|---|---|---|
| 1 | h đoán quá ở một nút | A* có thể trả về đường không rẻ nhất | dẫn tới | "đoán quá chỉ làm A* chậm hơn" | Một nút bị dọa là còn xa thì có thể bị bỏ qua, kể cả khi đường qua nó rẻ hơn. |
| 2 | h đoán hụt nhiều, như h = 0 ở mọi nút | A* mở rộng nhiều nút hơn | dẫn tới | "đoán hụt cũng làm A* sai" | Đoán hụt chỉ làm A* kém định hướng. Với h = 0, A* thành UCS: vẫn đúng, nhưng loang mọi hướng. |
| 3 | Đường chim bay | h không bao giờ đoán quá | là một ví dụ của | "chim bay không chính xác nên không dùng được" | Không đường nào ngắn hơn đường thẳng, nên chim bay không bao giờ đoán quá. |
| 4 | Gấp đôi đường chim bay | h không bao giờ đoán quá | không phải | "nhân lên cho A* nhanh hơn thì vẫn ổn" | Gấp đôi có thể vượt chi phí thật. Chỉ cần một nút vượt là hỏng. |

Thiết kế cố ý: cặp 1 và 2 là **cặp đối lập** (quá → sai, hụt → chậm). Đây là cặp dễ đảo nhất trong ga,
đúng luật 5. Cặp 3–4 mồi cho bài tập 2 (classify), nhưng bài tập dùng bản đồ đi học với con số cụ thể nên
không lặp nguyên câu.

**Độ chắc chắn:** một `ConfidenceControl` cho cả bước, không phải mỗi cặp (giữ dưới 2 phút).

**Phản hồi:** hiện **ngay** sau khi chốt (M1): mỗi cặp tô đúng (xanh dương) / sai (cam) + một dòng ở
cột cuối. Sai mà đã chọn "Rất chắc" thì thêm câu `wrongSure` như `GuessStep`.

**Bản đồ của bạn:** dưới phản hồi, vẽ 4 cặp thành một sơ đồ nhỏ theo đúng lựa chọn của người học
(mũi tên cho "dẫn tới", gạch cho "là ví dụ", gạch chéo cho "không phải"). Đây là "trang giấy" mà bước
hệ thống lại sẽ quay lại. Trên 375px thì xếp dọc 4 dòng, không cần sơ đồ thật.

**Không** tính vào FSRS, **không** chấm điểm (M1).

## Bước cuối · Hệ thống lại (`reorganize`) có hiện bản đoán

Thứ tự trong màn:

1. **"Lúc đầu bạn đã nối thế này"**: 4 cặp với lựa chọn *của người học*. Cặp đã sai được đánh dấu.
   Không hiện đáp án lần nữa.
   Câu hỏi: "Giờ bạn sẽ nối lại cặp nào? Vì sao?" Người học trả lời trên giấy, không nhập.
2. **Khung** (`frame`), vẽ trên giấy 3 phút:
   - Khái niệm chính ở giữa trang
   - Ga trước nó dựa vào
   - Đoán quá và đoán hụt dẫn tới đâu
   - Cách kiểm nhanh một h
3. **Sketch mẫu**, có ô che, chỉ mở *sau* khi đã vẽ. Hỏi "trang của bạn có đủ các ý này chưa", không
   hỏi "có giống sketch không" (M11).

Bản nháp sketch:

| Ô | Chữ |
|---|---|
| top | Dựa trên A*, sub: f = g + h |
| left | h\*(n), sub: chi phí thật rẻ nhất từ n tới đích |
| core | Admissible, sub: h(n) {{≤ h\*(n)}} ở mọi nút |
| next | Đào sâu: nhất quán (consistent), sub: h(n) ≤ c + h(n′) |
| a | Đoán quá → A* có thể {{trả về đường không rẻ nhất}} |
| b | Đoán hụt → vẫn đúng, nhưng {{mở nhiều nút hơn}} (h = 0 là UCS) |
| c | Kiểm nhanh: thử ngay ở {{đích}}, nơi h\* = 0 |

`ideas`:
- h ≤ h* ở mọi nút
- h* là chi phí thật rẻ nhất tới đích
- Đoán quá thì A* có thể sai
- Đoán hụt thì A* đúng nhưng chậm
- Chim bay và h = 0 là admissible
- Kiểm ở đích, nơi h* = 0
- Nhất quán là điều kiện chặt hơn

Nếu người học chưa làm bước đoán (bỏ qua hoặc dữ liệu cũ), mục 1 ẩn đi và màn giống `reorganize` hiện nay.

## Thay đổi kỹ thuật (đã làm)

1. **Kiểu mới** trong `learning/types.ts`:
   ```ts
   type Relation = 'leads' | 'example' | 'not'
   interface RelateData {
     prompt: string
     legend?: string // dòng nhắc chữ
     pairs: { id: string; left: string; right: string; answer: Relation; why: string }[]
     wrongSure: string
   }
   // LessonStep thêm: | { kind: 'relate'; data: RelateData }
   ```
   `ReorganizeData` không đổi. Màn tự tìm bước `relate` của cùng lesson.
2. **Component** `RelateStep.tsx` cạnh `GuessStep.tsx`; `Reorganize.tsx` thêm khối "Lúc đầu bạn đã nối".
3. **Store `learn-ai-v2`**: thêm `guesses: Record<lessonId, { picks: Record<pairId, Relation>; confidence; at }>`.
   `PROGRESS_VERSION` = 2, `migrateProgress`; `sync.ts` gộp (giữ lần đoán sớm hơn) và `parseCloud` đọc cả
   document bản 1. Đề xuất M14 (lưu độ chắc chắn của `GuessStep`) có thể dùng lại `GuessRecord`, không cần
   đổi shape nữa.
4. **Buổi học hôm nay**: `useTodayPlan` nhận cả `relate`; đã đoán thì bỏ bước đoán (không thay bằng dữ liệu mẫu).
   Ga không có bước `paper` mà có `reorganize` thì bước giấy của buổi là hệ thống lại.
5. **Luật lesson** (`npm test`): bước `relate` không tính là bài tập hay trắc nghiệm, giống `guess`.
6. **Tài liệu**: `docs/DESIGN.md` (bước mới, shape store), skill `learning-methods` (thẻ M1/M11 + ma trận
   hàng "Mở đầu" cột K), `.claude/agents/lesson-quality-judge.md` nếu thêm tiêu chí.

## Đã quyết

- **Đoán hai lần.** Bước đoán của ga sau hiện ở cuối buổi trước ("Đoán trước cho ga sau") *và* là bước đầu
  của lesson. Với `ucs` hiện tại người học gặp lại đúng câu đó. Đề xuất: nếu đã có bản đoán trong store thì
  đầu lesson hiện "Bản đoán lần trước của bạn" (đọc, không làm lại). Cách này cũng cần store ở mục 3.
- **Thời lượng.** Lesson đang ghi 12 phút, đúng trần. Thêm khoảng 1,5–2 phút sẽ vượt. Có hai cách:
  - Bỏ `admissible-e3`. Ý sửa h(A) đã có trong giải thích 1 và cặp 1. Vẫn còn 2 bài tập.
  - Rút giải thích 2. Cách này khó hơn vì đoạn chứng minh là phần "vì sao" của kỹ năng.

  Đề xuất bỏ e3.
- **Phản hồi ngay hay để dành.** Justin không có ai báo đúng/sai: phần đọc tiếp tự sửa cho ông. M1 yêu cầu
  phản hồi ngay, và trong app bước đoán có thể cách lesson vài ngày, nên đề xuất phản hồi ngay.
  `reorganize` vẫn có việc thật: nối lại bằng lời của mình và vẽ thêm h*, kiểm ở đích.

## Kiểm khi dựng

- Đáp án 4 cặp đúng với nội dung lesson. Cặp 2 nói "mở nhiều nút hơn" là *xu hướng*, đúng chắc với
  h = 0 (thành UCS). Không viết thành "luôn luôn" cho mọi h hụt.
- Thuật ngữ theo bảng `docs/DESIGN.md`: "đoán quá (overestimate)" ở lần đầu, "nhất quán (consistent)".
- 375px: không cuộn ngang, nút ≥ 44px. Chạy `lesson-quality-judge` sau khi dựng, lưu report ở
  `docs/courses/csc14003/reviews/`.

## Bài tập xử lý sâu (review M1) — đã dựng 2026-10-17, user duyệt cả e2 và e3

Review thấy cả hai bài tập tính điểm đều chỉ áp quy tắc. Phần "giải thích vì sao" của kỹ năng chưa có bài nào
luyện. Đề xuất:

**e2 → tìm lỗi (M5, kiểu `peas-e2`)**, `classify`.

Đề: "Một bạn kiểm heuristic trên bản đồ đi học và ghi kết luận kèm lý do. Xếp từng dòng vào đúng loại."

Ba nhóm: `Đúng` · `Sai: chỉ thử một nút` · `Sai: hiểu nhầm điều kiện`.

| Dòng của bạn ấy | Nhóm | Vì sao |
|---|---|---|
| Một nửa chim bay là admissible, vì ở mọi nút nó ≤ chim bay, mà chim bay ≤ h*. | Đúng | Lập luận bắc cầu hợp lệ |
| Chim bay + 1 là admissible, vì ở S nó bằng 9 ≤ 12. | Chỉ thử một nút | Ở G nó bằng 1 > 0 = h*(G) |
| Nếu h(C) = 7 thì h không admissible, vì h*(C) = 6. | Đúng | Vượt ở một nút là đủ để hỏng (khớp e1) |
| h = h* không admissible, vì h phải nhỏ hơn h* hẳn. | Hiểu nhầm điều kiện | Điều kiện là ≤, không phải < |
| h = 0 không admissible, vì nó chẳng cho A* biết gì về đích. | Hiểu nhầm điều kiện | Kém hữu ích ≠ đoán quá; h = 0 vẫn admissible |

- **Gợi ý:** "Mỗi dòng, hỏi hai câu: lý do có kiểm *mọi* nút không? Điều kiện thật là gì, ≤ hay <?"
- **Không trùng bước đoán:** các cặp `crow`/`double` không lặp lại ở đây. Mục chim bay dùng như một bậc trong
  lập luận, không phải câu hỏi lại.
- Số liệu lấy từ h* đã tính bằng engine (S 12, C 6) và h city (S 8, G 0).

**e3 mới (tùy chọn) → câu chọn về chứng minh (M4, K)**, `choice`. Đây là trắc nghiệm duy nhất của lesson.

Đề: "A* (không bỏ trạng thái đã gặp) với h admissible. Đường rẻ nhất tốn C* = 12. Frontier đang có một đích
tệ G2 với f = 15, và một nút n nằm trên đường rẻ nhất. Điều gì chắc chắn?"

Phương án:
1. **f(n) ≤ 12, nên n được lấy ra trước G2** ✓
2. f(n) = 15, hai nút ngang nhau
3. f(n) có thể > 15, nên G2 có thể ra trước
4. Chưa chạy thì không nói được gì

- **Lời giải:** f(n) = g(n) + h(n) ≤ g(n) + h*(n) = C* = 12 < 15.
- **Gợi ý:** "h(n) ≤ h*(n). Cộng g(n) vào hai vế."

**Thời lượng:** bước đoán khoảng 2 phút, hai bước giải thích khoảng 5, e1 khoảng 1,5, e2 tìm lỗi khoảng 2,5,
e3 khoảng 1. Tổng khoảng 12 phút, sát trần. Nếu chỉ làm e2 thì khoảng 11 phút, nhưng nửa "vì sao" vẫn chưa có
bài tính điểm.

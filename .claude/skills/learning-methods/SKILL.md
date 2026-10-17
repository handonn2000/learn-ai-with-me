---
name: learning-methods
description: >-
  Nguồn quyết định sư phạm của learn-ai-with-me v2: kỹ năng loại nào thì dạy, luyện, ôn bằng
  phương pháp nào, vì sao, và ứng với thành phần nào trong app (GuessStep, bài tập, PaperStep,
  Reorganize, câu nhớ lại, FSRS). Dùng TRƯỚC khi lên dàn ý một ga/lesson mới, khi thêm hoặc đổi
  dạng bài tập, câu ôn, bước của buổi học, lịch ôn, màn Hôm nay; và khi review xem một lesson
  dùng phương pháp có hợp với kỹ năng không. Cũng dùng khi user hỏi "nên dạy phần này thế nào",
  "bài tập kiểu gì cho kỹ năng này", "có nên thêm cơ chế X không".
---

# Phương pháp học — chọn theo loại kỹ năng

Skill này trả lời câu **"dạy cái này bằng cách nào"**. Nó không thay `docs/DESIGN.md` (giới hạn
sản phẩm: 8–12 phút, ≤ 550 từ, 2–4 bài tập, ≤ 1 trắc nghiệm, thang Gợi ý → Lời giải); nó nói
*trong* các giới hạn đó nên chọn gì. Áp cho v2 (`src/learning`, `src/content/lessons`). Skill
`gamification` và `new-lesson` mô tả v1, đừng lấy chúng làm căn cứ cho v2.

Nguyên lý gốc, mọi luật bên dưới suy ra từ đây: **trí nhớ và sự hiểu là sản phẩm phụ của việc
nối thông tin vào mạng kiến thức đã có, rồi lấy nó ra dùng.** Nên mỗi lesson cần cả hai nửa:
*xử lý sâu* (so sánh, xếp, giải thích, tổ chức lại) và *truy xuất* (tự làm ra, không nhìn).
Thiếu nửa đầu thì ôn mãi vẫn quên; thiếu nửa sau thì hiểu xong vẫn không dùng được.

## Bước 1 · Xếp loại kỹ năng

Đọc `Skill.can` (câu "Học xong bạn làm được…"). **Động từ** quyết định loại. Một kỹ năng có thể
mang hai loại (vd. `ucs`: chạy tay + giải thích); khi đó loại *chính* là phần mà câu kiểm tra
chấm, loại phụ lấy thêm một bài tập.

| Loại | Dấu hiệu trong `can` | Ví dụ trong repo |
|---|---|---|
| **T · Thủ tục** | chạy tay, mô phỏng, tính, lần theo | `bfs`, `ucs`, `gbfs`, `astar`, `priority-queue`, `frontier`, `state-graph` |
| **K · Khái niệm/phân biệt** | giải thích vì sao, phân biệt, chỉ ra trường hợp | `heuristic`, `admissible`, `rationality`, `graph-search`, phần "vì sao" của `bfs` |
| **P · Phân loại/áp khuôn** | xếp, gán, viết theo khuôn, chỉ ra thành phần | `peas`, `env-dims`, `env-classify`, `agent` |
| **M · Mô hình hóa** | phát biểu, thiết kế, chọn cho bài toán mới | `formulate`; thiết kế heuristic (chưa có ga) |
| **D · Dữ kiện rời** | kể tên, mốc, ký hiệu không suy ra được | hiếm trong v2; nếu có thì không làm thành ga riêng |

**P hay M?** Hỏi: khuôn đã cho sẵn và chỉ cần đặt từng mảnh vào đúng ô, hay người học phải tự
quyết *cái gì* là mảnh? Đặt vào ô có sẵn → P (`peas`: bốn chữ cố định, việc là không đặt nhầm).
Tự quyết mảnh → M (`formulate`: trạng thái là gì, hành động là gì do người học chọn). Còn phân vân
thì chọn P cho lesson đầu và để phần M vào bước giấy.

## Bước 2 · Ma trận: loại × bước của lesson

Ô ghi **phương pháp → thành phần v2**; *nghiêng* là tùy chọn. Cơ chế, mức bằng chứng, khi nào
không dùng và lỗi hay gặp của từng phương pháp nằm ở `references/methods.md` (M1–M15). Đọc thẻ
của phương pháp trước khi dựng bước dùng nó.

Mã thẻ theo hàng: mở đầu M1 · giải thích M2/M4/M12 · bài tập M3 + M2 (T), M4 (K), M5 (P), M10 ·
giấy M6/M11 · hệ thống lại M11 · nhớ lại M7 · câu ôn M8/M10.

| Bước | T · Thủ tục | K · Khái niệm | P · Phân loại | M · Mô hình hóa |
|---|---|---|---|---|
| **Mở đầu** (`guess`) | Đoán bước kế của thuật toán trên bản đồ nhỏ → `GuessStep` + `figure` | Đoán kết luận/hệ quả, nhắm vào ngộ nhận phổ biến → `GuessStep` + `wrongSure`; *ga có ≥ 4 ý liên quan đã gặp ở ga trước → đoán quan hệ `relate`* | Đoán ca dễ nhầm nhất (cặp hay đảo) → `GuessStep` | Đoán thành phần nào khó phát biểu nhất → `GuessStep` |
| **Giải thích** (`explain`, ≤ 3) | Ví dụ làm mẫu đầy đủ, từng bước có lý do → `SearchPlayer`/`GraphView` | Ý thường → **cặp ví dụ đối lập** → thuật ngữ | Khuôn + 3–5 ví dụ trải rộng, có ít nhất một ca biên | Một bài làm mẫu đi từ mô tả đời thường tới phát biểu |
| **Bài tập 1** | Làm tiếp ví dụ đã chạy sẵn một phần → `trace` với `from` > 0 | Chọn/xếp hệ quả → `choice`/`order` (≤ 1 trắc nghiệm) | Gán ca mới vào khuôn → `classify` | Gán từng mảnh mô tả vào thành phần → `classify` |
| **Bài tập 2** | Tự chạy từ đầu trên bản đồ khác → `trace`/`pick-nodes` | **So sánh/xếp hạng**: hai khái niệm khác nhau ở đâu, khi nào khác biệt đổi kết quả | **Tìm lỗi**: bài làm sai của người khác → `classify` (như `peas-e2`) | Phát biểu trọn một bài toán mới → `paper` |
| **Bài tập 3–4** *(tùy chọn)* | Ca gài bẫy: khóa bằng nhau, đường rẻ hơn đến sau | Ca phản ví dụ: điều kiện vắng thì sao | Ca biên, ca có hai cách xếp hợp lý kèm lý do | Biến thể: đổi một ràng buộc, cái gì đổi theo |
| **Giấy** (`paper`) | Chạy tay trọn trên giấy, nhập kết quả cuối | *Viết lời giải thích một đoạn, đối chiếu `reference`* | Viết khuôn cho tác tử/ca mới, đối chiếu `reference` | Bắt buộc: phát biểu đầy đủ trên giấy |
| **Hệ thống lại** (`reorganize`) | Sơ đồ các bước + chỗ dễ sai | Sơ đồ quan hệ giữa các khái niệm | Bảng/lưới khuôn + ca biên | Sơ đồ từ đời thường → thành phần |
| **Câu nhớ lại** (`recalls`) | "Mỗi lượt X làm gì, theo thứ tự?" | "Vì sao …? Khi nào không đúng?" | "Kể đủ khuôn + một ví dụ của bạn" | "Phát biểu bài toán Y" |
| **Câu ôn** (`checks`) | Bản đồ **khác** bản đồ trong lesson | Ca mới, không lặp ví dụ đã giảng | Tác tử/môi trường **mới** | Bài toán mới |

D · Dữ kiện rời: không làm lesson. Gắn vào ga gần nhất dưới dạng một dòng giải thích + một ý
trong câu nhớ lại. Chỉ khi thật sự không nối được vào đâu mới thành thẻ ôn thuần.

### Luật áp cho mọi loại

1. **Tự làm trước, phản hồi sau.** Không có bước nào cho xem đáp án trước khi người học chốt.
   Gợi ý được phép nhưng hạ điểm FSRS (đã có: `hinted` → Hard).
2. **Ôn bằng bối cảnh mới.** Câu ôn không lặp nguyên ví dụ trong lesson; nếu lặp thì người học
   nhớ đáp án, không nhớ kỹ năng.
3. **Ít nhất một bài xử lý sâu** (so sánh, tìm lỗi, giải thích, phát biểu) mỗi lesson. Lesson toàn
   bài "áp quy tắc" là thiếu nửa đầu của nguyên lý gốc.
4. **Mỗi kỹ năng có một câu nhớ lại tự do** trong `recalls`. Câu kiểm tra có phương án chỉ luyện
   nhận ra.
5. **Đoán trước nhắm vào ngộ nhận thật**, không đoán vu vơ. Nếu không biết ngộ nhận nào phổ biến,
   chọn cặp khái niệm dễ đảo nhất trong ga.

### Ghi lại lựa chọn

Khi lên dàn ý một ga, ghi một dòng cho mỗi bước: `bước · phương pháp (Mx) · vì sao hợp loại kỹ
năng này`. Ví dụ cho `gbfs` (T + K):

```
guess     · M1 · đoán GBFS mở nút nào khi nút có h nhỏ nhất lại ở xa đường rẻ
explain 1 · M2 · chạy mẫu GBFS trên bản đồ có bẫy, mỗi bước nói vì sao chọn h nhỏ nhất
explain 2 · M4 · đặt cạnh UCS: chỉ nhìn h hay chỉ nhìn g, kết quả khác nhau ở đâu
ex 1      · M2/M3 · trace, chạy sẵn 2 bước
ex 2      · M4 · choice: đường GBFS trả về có rẻ nhất không, vì sao
recall    · M7 · "GBFS chọn nút theo gì, và khi nào nó trả về đường không rẻ nhất?"
```

Bỏ một phương pháp mà ma trận yêu cầu thì ghi lý do (vd. "không có cặp đối lập hợp lý"). Dòng
này là thứ reviewer đối chiếu.

## Bước 3 · Quyết định cấp sản phẩm

| Câu hỏi | Quyết định | Lý do ngắn |
|---|---|---|
| Lịch ôn | FSRS theo kỹ năng, giữ mặc định retention | Bằng chứng mạnh nhất trong khoa học học tập; đừng thay bằng mốc cố định |
| Điểm từ lesson | Mức tệ nhất trong các bài: sạch → Good, gợi ý → Hard, xem lời giải → Again | Phản ánh lần truy xuất yếu nhất |
| Thứ tự buổi học | Ôn đến hạn → ga mới → đoán trước ga sau → giấy | Ôn trước khi não bận; đoán cuối buổi là priming cho buổi sau |
| Trộn câu ôn | *Đề xuất*: xen kẽ kỹ năng cùng loại P/K thay vì xếp theo hạn | Xen kẽ giúp phân biệt; chưa làm, cần kiểm |
| Độ chắc chắn | *Đề xuất*: lưu lần đoán + độ chắc để hiện "chắc mà sai" | Siêu nhận thức; đổi store → cần migration |
| Câu hỏi của người học | *Đề xuất*: ô "Tôi đang thắc mắc", hỏi lại ở màn Qua ga | Biến bối rối thành việc cụ thể |
| Cơ chế động lực mới | Chỉ thêm nếu thưởng cho **truy xuất thật**, không thưởng thời gian ngồi | Thời gian ngồi không phải học |

Thêm một quyết định mới vào bảng này thì ghi kèm thẻ phương pháp nó dựa vào. Quyết định không
dựa được vào thẻ nào (vd. huy hiệu, bảng xếp hạng) là quyết định về động lực, không phải về học;
cân nhắc nó riêng và đừng gắn nhãn "giúp học tốt hơn".

## Bước 4 · Khi review

Áp cho cả `lesson-quality-judge` lẫn tự kiểm trước khi bàn giao:

1. Kỹ năng được xếp loại nào? Đồng ý với cách xếp không (động từ của `can`)?
2. Mỗi bước của lesson khớp ô nào trong ma trận? Bước lệch ô có lý do được ghi không?
3. Có ít nhất một bài xử lý sâu (luật 3)? Đoán trước có nhắm vào ngộ nhận thật (luật 5)?
4. Kỹ năng đã có câu nhớ lại trong `recalls` chưa (luật 4)? Câu ôn có dùng bối cảnh khác lesson
   (luật 2)?
5. Có lỗi nào trong mục "làm sai thường gặp" của các thẻ đã dùng không?

Lệch ma trận không tự động là lỗi; thiếu lý do mới là lỗi. Thiếu bài xử lý sâu, thiếu câu nhớ lại
ở lesson mới, hoặc gợi ý đưa luôn đáp án là lỗi cần sửa.

## Không áp dụng (đã cân nhắc)

- **Bỏ hay hạ vai trò ôn ngắt quãng** vì "lợi ích giảm dần": không có nghiên cứu được nêu; chính
  người đề xuất (Justin Sung) sau đó tự nói không bỏ được.
- **Ôn khi đã quên 20–30%** như mốc cứng: kinh nghiệm cá nhân; FSRS đã ước lượng theo dữ liệu.
- **Kéo dài trạng thái bối rối trong phần giải thích**: người tự học bỏ cuộc. Chỗ khó đặt ở bài
  tập xử lý sâu, nơi có gợi ý đỡ.
- **Học theo phong cách (nhìn/nghe/làm)**: không có bằng chứng.
- **Tóm tắt mở sách**: hiệu quả thấp; nếu cần thì tóm tắt gấp sách (đã là `reorganize`).

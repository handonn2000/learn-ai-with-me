---
name: lesson-voice
description: Giọng văn chuẩn của app learn-ai-with-me — kể chuyện làm tone chính, đối thoại dùng dè, xưng tôi/bạn, ví von đời thường, icon làm mốc. Dùng skill này BẤT CỨ KHI NÀO viết hoặc sửa chữ nghĩa hiển thị cho người học: viết đoạn giảng mới, viết giải thích đáp án quiz, sửa lời trên trang Lộ trình / trang chủ, hoặc khi user nói "viết lại cho hợp giọng", "nghe khô quá", "đổi giọng". Cũng dùng khi review một đoạn xem đã đúng giọng chưa. Đây là bước bắt buộc trước khi viết bài học mới (xem thêm skill new-lesson).
---

# Giọng văn learn-ai-with-me

App này là **sổ tay tự học công khai của một người**, không phải giáo trình của một khoa. Người đọc mở nó ra lúc 11 giờ đêm, một mình, đang hơi nản. Nên mọi câu chữ viết như đang ngồi cạnh giải thích cho họ — chứ không phải đọc từ bục giảng xuống.

Đọc `CLAUDE.md § Quy ước code` để biết ràng buộc chung, rồi áp bảy khuôn dưới đây.

> **Viết tiếng Anh?** Bảy khuôn dưới đây vẫn áp nguyên. Nhưng luật nền là một hệ đại từ
> tiếng Việt, sang tiếng Anh thì sụp — đọc `references/english.md` để lấy bản luật nền tương
> ứng, chính sách THAY ví von, và danh sách mở bài bị cấm.

**Tone chính là KỂ CHUYỆN.** Khái niệm nào có người thật việc thật đứng sau thì cho nó bước vào
qua một cảnh cụ thể trước, rút ra nguyên lý sau. Đối thoại (hỏi trước, đáp sau) là gia vị dùng dè
— xem khuôn 7 để biết đúng lúc nào được dùng và liều lượng tối đa.

## Luật nền

**Xưng tôi / bạn.** "Tôi" là người viết bài, có ý kiến riêng, có chỗ từng sai. "Bạn" là người đang đọc. Tránh "ta", "chúng ta", "người học" — trừ khi "ta" mang nghĩa cả loài người ("thứ ta còn chưa mô tả nổi") thì được.

**Đổi giọng thì được, đổi kiến thức thì không.** Mọi con số, định nghĩa, kết luận, tên riêng, năm tháng phải giữ đúng. Giọng vui là để người ta nhớ được kiến thức đúng, không phải để thay thế nó. Nếu bạn thấy mình đang làm mềm một khẳng định để câu văn mượt hơn — dừng lại, giữ khẳng định.

**Đừng tán gẫu ở nhãn chức năng.** Nhãn trạng thái trong lab (`FRONTIER — hàng đợi ưu tiên theo f = g + h`), tooltip, nhãn nút, tiêu đề cột bảng: giữ ngắn và chính xác. Chúng nhấp nháy đổi liên tục khi người dùng bấm Tiến/Lùi — dài dòng ở đó là hại, đọc không kịp.

## Bảy khuôn viết

Đây là thứ làm nên chất của bài 1 và bài 3. Dùng chúng như bộ đồ nghề, không phải checklist — một đoạn hay thường chỉ cần một, hai khuôn.

### 1 · Mở bằng căng thẳng

Đoạn dẫn (`lead` của SectionHead) không tóm tắt mục sắp tới. Nó dựng một chỗ vướng rồi để cả mục đi gỡ. Người đọc phải thấy *vì sao* cần đọc tiếp.

> **Khô:** "Uniform-cost search mở nút có chi phí g(n) nhỏ nhất."
>
> **Đúng giọng:** "BFS tối ưu *số cạnh* — mà ít cạnh đâu có nghĩa là rẻ, đi 2 chặng máy bay vẫn đắt hơn 5 chặng xe buýt. UCS sửa đúng chỗ đó."

Mẹo dựng căng thẳng: nêu cái đã biết → chỉ ra chỗ nó hỏng → giới thiệu cái sắp học như lời chữa.

### 2 · Ví von đời thường

Mỗi khái niệm trừu tượng xứng đáng có một hình ảnh mà người đọc đã biết. Ví von phải **đúng cơ chế**, không chỉ đúng cảm giác — ví von sai làm người ta nhớ sai.

Đã dùng trong repo (đừng lặp lại, hãy tìm cái mới): hàng đợi FIFO = xếp hàng mua trà sữa · graph-search = vết dầu loang · AI ⊃ ML ⊃ DL = búp bê Nga · simulated annealing = lắc hộp có viên bi · admissible = heuristic biết điều, không nói quá · overfitting = thuộc bài chứ không hiểu bài.

### 3 · Con số có cú chốt

Bài này sống bằng những con số làm người ta ngồi thẳng dậy. Đưa số ra, rồi chốt một câu ngắn nói ý nghĩa của nó.

> "8 quân hậu mô hình kiểu ngây thơ ra 1,8×10¹⁴ chuỗi. Mô hình khôn hơn một chút — còn **2.057**. Cùng một bài toán, khác nhau 11 chữ số."

Cú chốt là phần bắt buộc. Số trần trụi không dạy được gì.

### 4 · Ghi chú của người đi trước

Chỗ nào bạn biết người học hay vấp, nói thẳng ra bằng ngôi thứ nhất. Đây là thứ giáo trình không có và là lý do người ta đọc sổ tay của một người cụ thể.

> "Có hai chi tiết mà tôi thấy sinh viên mất điểm nhiều nhất: (1) UCS chỉ dừng khi đích được *lấy ra*… (2) gặp lại một nút bằng đường rẻ hơn thì phải cập nhật cha và khóa."

> "Nhớ giùm tôi chỗ này: duy lý ≠ toàn tri."

### 5 · Móc nối trước – sau

Bài học không đứng một mình. Kết mỗi mục lớn bằng một sợi dây tới buổi khác hoặc mục khác — người đọc thấy được bản đồ, và đó chính là cái làm chuỗi 13 buổi dính vào nhau.

> "Nhớ kỹ hai chỗ vấp này. Buổi 7 và 8 mình sẽ xây đúng loại hệ lập luận đó, và sẽ vấp lại đúng hai chỗ này."

Móc ngược thì dùng anchor: `<a href='#ch5'>Ôn: mục 05 — admissible</a>`.

### 6 · Đẩy người đọc ra khỏi ghế

Có lab hay quiz thì bảo thẳng họ đi thử, và nói rõ **thử cái gì, thấy gì**. Đừng để một cái nút nằm đó chờ.

> "Đừng tin lời tôi, mở Manim Lab chạy UCS trên đồ thị Lab mà xem, cả hai đều xảy ra thật."

> "Ba thí nghiệm tôi muốn bạn tự làm ngay bây giờ: (1) chạy GBFS rồi A* — tham lam ra 450 km, A* ra 418 km, tự hỏi 32 km đó đi đâu mất…"

### 7 · Kể chuyện mở màn, đối thoại gỡ nút

Đây là khuôn định hình cả hai bài đầu, và là chỗ dễ làm hỏng nhất nếu dùng sai liều.

**Kể chuyện — dùng để MỞ MÀN.** Khái niệm nào có người thật việc thật đứng sau thì mở bằng cảnh đó,
đừng mở bằng định nghĩa. Cảnh cụ thể neo khái niệm vào một chỗ có thật, và người ta nhớ cảnh lâu hơn
nhớ định nghĩa.

> **Định nghĩa trước:** "Lịch sử AI phát triển theo chu kỳ hưng phấn rồi đóng băng."
>
> **Cảnh trước:** "Năm 1970, Marvin Minsky nói với tạp chí Life rằng chỉ ba tới tám năm nữa thôi, ta
> sẽ có cỗ máy thông minh ngang một người bình thường. Bốn năm sau, tiền tài trợ bị cắt sạch."

**Đối thoại — CHỈ dùng để gỡ nút.** Đặt câu hỏi rồi để người đọc trả lời trước, và chỉ ở đúng chỗ họ
**đang giữ một niềm tin sai**: vượt Turing Test nghĩa là thông minh · duy lý nghĩa là không bao giờ
sai · ngẫu nhiên nghĩa là có nhiều agent. Ở những chỗ đó, bắt trả lời trước rồi mới sửa thì cái sai
mới chịu rời đi; đọc một câu phủ định suông thì nó ở lại.

> "**Một — vượt được phép thử Turing thì có chắc là thông minh không?** Chưa chắc. Muốn qua bài, máy
> phải bắt chước cả những chỗ rất người mà chẳng thông minh gì.
> **Hai — trượt phép thử thì có nghĩa là không thông minh không?** Cũng không. […]
> Ghép hai câu trả lời lại là ra kết luận."

**Liều lượng — chỗ dễ hỏng nhất.** Cả hai đều là thủ pháp cường độ cao, rải khắp bài thì đọc đuối và
bài phình ra.

| | Dùng ở đâu | Tối đa |
|---|---|---|
| Cảnh mở màn | `lead` của mục, và chỉ khi mục đó có chuyện thật để kể | không giới hạn cứng, nhưng mục thuần kỹ thuật thì vào thẳng |
| Cụm câu hỏi | đúng những ngộ nhận đã biết | **2–3 lần mỗi bài** |

Không mục nào dùng cả hai, trừ khi nó vừa có chuyện thật vừa có ngộ nhận — như mục Turing của bài 1.
Và tuyệt đối đừng dùng câu hỏi để dẫn dắt trang trí ("Vậy tìm kiếm là gì? Là…") — đó là câu hỏi giả,
người đọc nhận ra ngay và mất tin.

## Pha trò

Đùa **đắt chỗ**, không rải đều. Chỗ đùa được: lúc vừa thả một con số sốc, lúc chỉ ra một nghịch lý, lúc tự giễu. Chỗ không đùa: định nghĩa, công thức, phần đạo đức/rủi ro.

> "…chỉ vì cái hàm XOR bé tí này mà cả ngành lạnh đi suốt thập niên 1970."

> "xài ∧ là bạn vừa tuyên bố mọi thứ trên đời đều là sinh viên, kể cả cái ghế."

> "Nhìn cột thời gian còn thấy gắng đợi được; nhìn cột bộ nhớ thì thôi 💀"

Câu đùa tốt luôn *chở theo* kiến thức. Nếu xóa câu đùa đi mà không mất gì thì nó là mỡ thừa — xóa thật.

## Icon

Icon là **mốc**, không phải trang trí. Đặt ở đầu một mục lớn hoặc đầu một thẻ, để mắt bắt được nhịp khi cuộn. Không rải giữa đoạn văn, không đặt cạnh mỗi gạch đầu dòng.

Liều lượng đã hiệu chỉnh: **5–8 icon cho cả một bài học**. Bài 1 và bài 3 mỗi bài 7 cái. Nhiều hơn là ồn — nhớ app này để người ta ôn đi ôn lại, thứ vui lần đầu sẽ chối lần thứ tư.

## Tự kiểm trước khi xong

Đọc lại đoạn vừa viết và hỏi:

- Có "tôi" và "bạn" không, hay đang viết giọng vô danh?
- Người đọc có biết **vì sao** phải đọc mục này không (khuôn 1)?
- Số nào cũng có cú chốt chứ?
- Câu đùa nào xóa đi mà không mất gì không? Xóa.
- Icon còn trong khoảng 5–8 cho cả bài chứ?
- Mục nào mở được bằng một cảnh có thật mà tôi lại mở bằng định nghĩa không?
- Đếm số cụm câu hỏi trong bài: quá 3 chưa? Cụm nào không nhắm vào một ngộ nhận cụ thể thì bỏ.
- Con số / định nghĩa có còn đúng y như bản gốc không? Đây là câu quan trọng nhất.

Mật độ tham chiếu ở hai bài đã có: khoảng 10 lần "tôi" và 24–27 lần "bạn" mỗi bài. Không phải chỉ tiêu phải đạt, chỉ là mốc để biết mình đang ở đâu.

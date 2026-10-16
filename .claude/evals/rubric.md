# Thang chấm phần văn

Dùng bởi `grade.py`, và dùng được cả khi bạn tự đọc tay. Sáu tiêu chí, mỗi tiêu chí
**0 · 1 · 2**. Tổng 12.

Nguyên tắc chấm: **so với bài 1 và bài 3 đang có trong repo**, không so với một lý tưởng
trừu tượng. Nếu đoạn được chấm đặt cạnh hai bài đó mà lạc quẻ, nó không được 2.

---

## 1 · Xưng hô (0–2)

- **2** — có "tôi" và "bạn" tự nhiên, đọc như một người đang nói với một người.
- **1** — có "bạn" nhưng người viết vô hình; hoặc xưng hô đúng mà giọng vẫn cứng.
- **0** — giọng vô danh kiểu giáo trình, hoặc dùng "chúng ta / người học".

## 2 · Mở bằng căng thẳng (0–2)

Khuôn 1 của `lesson-voice`: đoạn dẫn dựng chỗ vướng rồi mới gỡ.

- **2** — đọc xong đoạn mở là biết **vì sao** cần đọc tiếp.
- **1** — có nêu vấn đề nhưng nhạt, hoặc chỉ tóm tắt nội dung sắp tới.
- **0** — vào thẳng định nghĩa.

## 3 · Ví von và con số (0–2)

Khuôn 2 và 3 gộp lại — phần làm người ta *nhớ được*.

- **2** — có ít nhất một ví von **đúng cơ chế** (không chỉ đúng cảm giác), và con số nào
  cũng có cú chốt nói ý nghĩa của nó.
- **1** — có ví von hoặc có số, nhưng ví von hơi khiên cưỡng, hoặc số thả ra trần trụi.
- **0** — không có gì để bám.

Ví von **sai cơ chế** thì trừ về 0 dù nghe hay, vì nó dạy sai.

## 4 · Hài hước đúng liều (0–2)

- **2** — có vài chỗ đùa, mỗi câu đùa *chở theo* kiến thức, và không đùa ở chỗ nghiêm
  (định nghĩa, công thức, phần đạo đức/rủi ro).
- **1** — quá nhạt (không có gì) hoặc quá đà (đùa rải đều, đùa rỗng).
- **0** — đùa làm loãng hoặc làm sai nội dung.

## 5 · Icon (0–2)

- **2** — 5–8 icon cho cả bài, đặt ở đầu mục hoặc đầu thẻ làm mốc.
- **1** — quá ít (< 3) hoặc hơi nhiều (9–12), hoặc rải trong đoạn văn.
- **0** — > 12, hoặc icon cạnh mỗi gạch đầu dòng.

Với đoạn văn ngắn (case rewrite), chấm theo tỉ lệ: một đoạn 5 câu có 0–1 icon là hợp lý,
không phải thiếu.

## 6 · Kiến thức đúng (0–2)

**Tiêu chí quan trọng nhất. Sai ở đây thì mấy điểm kia không cứu được.**

- **2** — mọi số liệu, định nghĩa, kết luận, tên riêng, năm tháng khớp nguyên liệu gốc.
- **1** — có chỗ mơ hồ hoặc làm mềm một khẳng định cho câu văn mượt.
- **0** — có ít nhất một chỗ **sai**, hoặc bịa ra số/sự kiện không có trong nguyên liệu.

---

## Cách đọc điểm

| Tổng | Nghĩa |
|---|---|
| 11–12 | đặt cạnh bài 1 / bài 3 được luôn |
| 8–10 | dùng được, cần sửa vài đoạn |
| 5–7 | đúng hướng nhưng phải viết lại kha khá |
| < 5 | skill chưa truyền được điều cần truyền — sửa skill, đừng sửa output |

**Điểm 6 (kiến thức) mà bằng 0 thì bỏ qua tổng** — ghi thẳng là trượt. Một bài học vui vẻ
và sai còn tệ hơn một bài học khô và đúng.

## Lưu ý về độ nhiễu

Chấm bằng LLM dao động ±1–2 điểm giữa các lần chạy trên cùng một output. Nên:

- Đừng đọc chênh lệch 1 điểm như tín hiệu. Chỉ tin khoảng cách ≥ 3 điểm, hoặc xu hướng
  lặp lại qua nhiều lần chạy.
- Tiêu chí 1, 5 và 6 ổn định hơn hẳn 2, 3, 4 vì chúng gần với thứ đếm được.
- Khi nghi ngờ, mở `artifacts/` ra đọc bằng mắt. Điểm là để **biết chỗ nào đáng đọc**,
  không phải để thay việc đọc.

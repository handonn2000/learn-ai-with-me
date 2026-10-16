# Giọng tiếng Anh của app

Đọc file này TRƯỚC khi viết bất kỳ chữ tiếng Anh nào cho người học. Nó là chương tiếng Anh
của cùng một skill, không phải một giọng khác — `SKILL.md` vẫn là gốc, bảy khuôn viết vẫn
nguyên. Ở đây chỉ nói **chỗ nào tiếng Anh làm khác**, và **cái bẫy mà chỉ tiếng Anh mới có**.

## Vì sao không dịch thẳng SKILL.md

Luật nền của bản tiếng Việt là một hệ đại từ: xưng *tôi / bạn*, cấm *ta / chúng ta / người học*.
Sang tiếng Anh cả trục đó sụp — `tôi`, `ta`, `chúng ta` đều ra "I/we", `bạn` và `người học` đều
ra "you". Thứ luật đó BẢO VỆ thì vẫn còn nguyên giá trị (một người cụ thể đang nói, không phải
giáo trình vô danh), nhưng **phép thử để biết mình có đang giữ nó thì phải viết lại**.

## Luật nền, bản tiếng Anh

**I / you.** "I" là người viết sổ tay này — có ý kiến riêng, có chỗ từng làm sai, có chỗ từng
mất điểm. "You" là người đang đọc lúc 11 giờ đêm. **Cấm "we" theo nghĩa tác giả** ("we now
consider…", "we can see that…") — đó đúng là giọng giáo trình mà cả app này né. "We" chỉ được
dùng khi nghĩa là cả loài người ("things we still can't describe").

**Cấm luôn danh xưng vô nhân xưng**: "the reader", "the student", "one might notice",
"it is important to note", câu bị động khi chủ ngữ là người ("it should be understood that…").

**Rút gọn thoải mái** — *it's, you'll, doesn't, here's*. Bản tiếng Việt thân mật nhờ đại từ;
tiếng Anh thân mật nhờ contraction. Viết đủ "it is / you will" suốt bài là nghe ra ngay giọng
biên bản.

**Đổi giọng thì được, đổi kiến thức thì không** — y hệt bản tiếng Việt, và ở bản dịch thì luật
này còn dễ vi phạm hơn: mọi con số, năm, định nghĩa, kết luận phải sang y nguyên. `check_i18n.py`
so multiset chữ số giữa hai bản nên số sai là FAIL, nhưng **số ĐÚNG mà gắn vào mệnh đề SAI thì
máy không bắt được** — đó là việc của `i18n-fidelity-judge`.

**Nhãn chức năng vẫn ngắn.** Nhãn trạng thái lab, tooltip, nhãn nút, tiêu đề cột: ngắn và chính
xác, không tán gẫu. Giống hệt luật bản tiếng Việt và vì đúng lý do đó — chúng nhấp nháy đổi
liên tục khi người dùng bấm Tiến/Lùi.

## Ví von: THAY, không dịch

Đây là khác biệt lớn nhất, và là chỗ bản dịch máy móc hỏng nặng nhất.

Ví von trong bài neo vào đời sống Việt Nam. Dịch thẳng thì người đọc quốc tế mất luôn cái hình
ảnh — mà hình ảnh chính là thứ làm khái niệm dính lại.

> hàng đợi FIFO = **xếp hàng mua trà sữa** → *queueing at a coffee counter*, không phải
> "a bubble tea queue" (đúng chữ, mất cái quen thuộc).

Luật: giữ **cơ chế**, đổi **đồ vật**. Ví von mới phải đúng cơ chế y như ví von cũ — sai cơ chế
là làm người ta nhớ sai, tệ hơn hẳn việc không có ví von nào.

Ví von KHÔNG được đổi khi nó là thuật ngữ hoặc mốc lịch sử thật: *vết dầu loang* (graph-search),
*búp bê Nga* (AI ⊃ ML ⊃ DL) — cái sau là hình ảnh quốc tế sẵn, giữ nguyên (*Russian dolls*).

Judge sẽ thấy trà sữa thành cà phê và **coi đó là ĐÚNG**, không phải trôi nghĩa.

## Mở bài bị cấm

Đây đúng là những câu mà một model đẻ ra khi được bảo "dịch đoạn này". Thấy câu nào trong danh
sách này ở đầu một mục thì viết lại:

- "Let's dive in" · "Let's take a look at" · "Let's explore"
- "In this section/article/lesson, we will…"
- "It is important to note that…" · "It's worth noting that…"
- "As we can see" · "As mentioned earlier"
- "In conclusion" · "To summarize"
- "Imagine that you are a…" (mở bằng ví von thì vào thẳng cảnh, đừng rào trước)

Khuôn 1 của SKILL.md vẫn áp: đoạn dẫn **dựng một chỗ vướng**, không tóm tắt mục sắp tới.

> **Dịch cứng:** "In this section we will examine uniform-cost search, which expands the node
> with the lowest path cost g(n)."
>
> **Đúng giọng:** "BFS gets you the fewest *edges* — and fewest edges isn't cheapest. Two
> flights still cost more than five bus rides. UCS fixes exactly that."

## Tự kiểm trước khi giao

1. Có "we" nào mang nghĩa tác giả không? Có "the reader / the student" không?
2. Đếm "I" và "you" — `check_lesson.py` cảnh báo dưới 4× "I" hoặc 12× "you". Dưới ngưỡng
   thường không phải vì bài ngắn, mà vì người kể đã bốc hơi trong lúc dịch.
3. Mở bài có nằm trong danh sách cấm không?
4. Ví von đã THAY chưa, hay còn dịch nguyên đồ vật Việt Nam?
5. Icon rơi đúng chỗ như bản Việt chưa (`check_lesson.py` cảnh báo nếu lệch số lượng)?
6. Đọc to một đoạn. Nghe ra người hay nghe ra bản dịch?

Cái máy bắt được thì đã có `check_i18n.py`. Sáu câu trên là phần máy không bắt được.

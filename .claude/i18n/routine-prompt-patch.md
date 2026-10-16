# Vá prompt routine nhắc ôn sau đợt song ngữ

Ngày: 2026-09-07 · Việc **thủ công**, prompt nằm ngoài repo: https://claude.ai/code/routines

Routine hiện hành: **một** cái, `trig_019TD3rVMi6GgrtvFtwvzdCQ` (12:15 T2·T4·T6) — xem ADR-0009.
ADR-0008 nói "hai routine" là bản cũ, hai cái đó đã xóa.

## Vì sao phải vá

Prompt trỏ tay vào đường dẫn file để đọc nội dung khóa mà ra đề. Đợt song ngữ **đã dời phần chữ
ra khỏi `.tsx`**: prose của bài học giờ nằm trong bundle `lesson0N.text.vi.ts`, còn `.tsx` chỉ
còn khung. Không sửa prompt thì routine vẫn chạy, vẫn ra đề — nhưng đề nhạt đi vì nó đọc trúng
phần khung, không trúng phần chữ. **Không có gì tự báo lỗi chuyện này.**

## Thay ba chỗ trong prompt

### 1 · Nguồn đọc nội dung bài học

Chỗ nào đang bảo agent đọc `src/features/lessons/b1/Lesson01Intro.tsx` (hoặc `b2`, `b3`), đổi thành:

> Nội dung chữ của bài học nằm ở bundle tiếng Việt, KHÔNG nằm trong `.tsx` nữa:
> - Buổi 1 — `src/features/lessons/b1/lesson01.text.vi.ts`
> - Buổi 2 — `src/features/lessons/b2/lesson02.text.vi.ts`
> - Buổi 3 — `src/features/lessons/b3/lesson03.text.vi.ts`
>
> File `.tsx` cùng thư mục giờ chỉ còn khung trang — đọc nó không ra chữ.
> **Tuyệt đối không đọc file `*.en.ts` / `*.en.js`**: đó là bản dịch tiếng Anh, ra đề bằng tiếng
> Việt thì bản `.vi` mới là nguồn.

### 2 · Ngân hàng câu hỏi

Chỗ nào đang trỏ `session-quizzes.js` / `part-tests.ts`, thêm hai câu:

> Cả hai file này nay có bản anh em `.en` — bỏ qua chúng.
> Trường phân loại chủ đề đã đổi tên `topic` → **`topicId`**, và giá trị là **slug ổn định**
> (ví dụ `turing-test`, `peas`), không còn là nhãn tiếng Việt. Muốn nhãn để viết vào issue thì
> tra ở `src/content/courses/csc14003/topics.ts` (`TOPIC_LABELS`).

### 3 · Link về bài trong thân issue

Site nay có hai gốc ngôn ngữ. Thêm:

> Link trong issue luôn dùng gốc tiếng Việt (không tiền tố), ví dụ
> `https://handonn2000.github.io/learn-ai-with-me/courses/csc14003/lessons/b1`.
> Gốc tiếng Anh là `.../learn-ai-with-me/en/courses/...` — đừng dùng cho đề tiếng Việt.

## Kiểm sau khi vá

Chạy tay routine một lần, xem issue nó mở ra có trích được chi tiết **chỉ có trong bundle**
(ví dụ Buổi 1: bốn ô think/act × human/rational, mốc 1956 Dartmouth, phép thử Turing) hay không.
Trích được nghĩa là prompt đã đọc đúng chỗ.

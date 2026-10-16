---
name: gamification
description: Cơ chế động lực và tiến độ của learn-ai-with-me — lịch ôn ngắt quãng, chấm quiz theo chủ đề, báo cáo mạnh/yếu, gợi ý "Hôm nay", khối tự kiểm. Dùng skill này khi user muốn thêm/sửa thứ gì đó thúc người học quay lại: "thêm streak", "làm huy hiệu", "thêm điểm", "gamification", "làm sao để tôi học đều", "thêm thống kê", "nhắc ôn", hoặc khi đụng vào ProgressDB / useProgress / spaced-repetition. Đọc trước khi thêm bất kỳ cơ chế điểm số nào — app này có ràng buộc riêng về dữ liệu người học và một quan điểm rõ ràng về loại động lực nào được phép dùng.
---

# Động lực và tiến độ

App này là **sổ tay tự học của một người**, không phải app giữ chân người dùng. Người học ở
đây đã tự nguyện mở nó ra — họ không cần bị dụ, họ cần *biết mình đang ở đâu và tối nay nên
làm gì*. Mọi cơ chế thêm vào phải phục vụ đúng câu đó.

## Vòng lặp đã có — đọc trước khi thêm

Năm mảnh đang chạy, và chúng đã khớp vào nhau khá chặt:

**1 · Trạng thái buổi học** — `todo | doing | done`, đặt tay trên card ở trang Lộ trình.
Đánh dấu `done` sẽ ghi `completedAt`, và đó là mốc để tính lịch ôn.

**2 · Lịch ôn ngắt quãng** (`src/lib/spaced-repetition.ts`) — hai bộ khoảng cách:
`1-3-7-14-30` (mặc định) và `2-5-10-21`, đổi bằng cách bấm vào chính con số trên trang Lộ
trình. Mỗi mốc ôn là một chấm tròn trên card, đến hạn thì vàng lên và bấm tick được.

**3 · Chấm theo chủ đề** — quiz và bài Kiểm tra tổng hợp không chỉ trả về điểm mà trả về
`right[]` / `wrong[]` là **tên buổi**. Nhờ vậy báo cáo nói được "hổng buổi 5, buổi 7" chứ
không phải "bạn được 60%". Đây là mảnh có giá trị sư phạm cao nhất — giữ nó khi mở rộng.

**4 · Quiz cuối mỗi buổi** (`src/components/SessionQuiz.tsx`) — 8 câu trắc nghiệm ở mục `#quiz`,
ngay trước mục bài tập. Câu hỏi ở `content/courses/csc14003/session-quizzes.js` khóa theo id buổi.
Đây là chỗ **DUY NHẤT** ghi `quizScore` / `quizRight` / `quizWrong`; điểm chỉ tính lần trả lời đầu
của mỗi câu, và chỉ ghi khi làm xong cả 8 câu. Buổi nào chưa có khóa trong file đó thì component
render ra `null`, không lỗi.

**5 · Gợi ý "Hôm nay"** — tự sinh từ các nguồn trên, theo thứ tự ưu tiên: mốc ôn đến hạn →
phần đã học xong hết nhưng chưa làm kiểm tra → buổi kế tiếp chưa học. Không có gì thì hiện
lời chúc mừng.

Đọc `src/features/roadmap/RoadmapPage.tsx` (khối `useMemo` đầu file) để thấy vòng lặp này
được ráp lại thế nào trước khi sửa.

## Quan điểm: động lực nào được dùng

Có hai loại động lực và app này chỉ chọn một.

**Dùng — động lực từ thông tin.** Người học tự thấy: mình xong 4/13 buổi, hôm nay có 2 mốc
ôn đến hạn, quiz buổi 5 sai chủ đề minimax. Không cần dỗ, chỉ cần *nhìn thấy rõ*. Mọi thứ
đang có đều thuộc loại này, và đó là lý do trang Lộ trình đọc như bảng điều khiển chứ không
như màn hình game.

**Tránh — động lực từ áp lực.** Streak đếm ngày liên tục rồi reset về 0, thông báo "bạn sắp
mất chuỗi 12 ngày!", điểm số không đổi được ra thứ gì, huy hiệu cho việc mở app. Chúng hiệu
quả trong ngắn hạn và để lại đúng một thứ: cảm giác tội lỗi khi nghỉ một hôm. Người tự học
buổi tối sau giờ làm không cần thêm nguồn tội lỗi nào nữa.

Ranh giới thực dụng để phân biệt: **nếu bỏ cơ chế đó đi mà người học vẫn biết chính xác nên
làm gì tiếp theo, thì cơ chế đó là áp lực chứ không phải thông tin.**

Nếu user yêu cầu thẳng một cơ chế thuộc nhóm tránh — nói ngắn gọn cái giá của nó rồi làm
theo ý họ, đây là app của họ. Nhưng đề xuất trước một biến thể "thông tin": ví dụ thay
streak-đếm-ngày bằng **lịch 30 ngày dạng ô vuông** — vẫn thấy được nhịp học đều hay thưa,
mà nghỉ một hôm không xóa sạch thành quả.

## Ràng buộc dữ liệu — chỗ dễ làm hỏng nhất

Tiến độ người học nằm ở localStorage key `csc14003-progress`, shape trong
`src/lib/storage.ts`:

```ts
interface ProgressDB {
  sessions: Record<string, SessionRecord>;   // 'b1'…'b11'
  partTests?: Record<string, PartTestRecord>; // khóa = Part.id
}
```

Ba luật, vi phạm là mất dữ liệu thật của người dùng:

- **Không đổi tên key.** `csc14003-progress` là hợp đồng có từ bản HTML đầu tiên.
- **Thêm trường thì được, đổi ý nghĩa trường cũ thì phải có migration.** Có tiền lệ trong
  file: `partTests` từng khóa theo chỉ số phần (1|2|3); khi tách Tuần 1–2 thành phần riêng,
  chỉ số đổi nghĩa nên đã chuyển sang `Part.id` kèm hàm `migrate()` một chiều. Đọc đoạn đó
  làm mẫu trước khi đổi shape.
- **Mọi đọc/ghi đi qua `useProgress`**, không gọi `localStorage` thẳng trong component.
  Hook này còn lo đồng bộ khi đổi tab (`focus`, `visibilitychange`, `storage`) — bỏ qua nó
  là hai tab ghi đè nhau.

Dữ liệu phụ không thuộc tiến độ (checklist tick, lựa chọn tạm) đi qua `useLocalList` với key
riêng — đừng nhét vào `ProgressDB` cho tiện.

## Thêm một cơ chế mới — trình tự

1. **Viết ra câu hỏi nó trả lời cho người học.** "Tôi có đang học đều không?" là câu hợp lệ.
   "Tôi được bao nhiêu điểm?" thì chưa — điểm để làm gì?
2. **Kiểm xem năm mảnh sẵn có đã trả lời được chưa.** Phần lớn ý tưởng mới hóa ra là một
   cách hiển thị khác của dữ liệu đang có, không cần thêm trường nào.
3. **Nếu cần trường mới**: thêm optional vào `SessionRecord` / `ProgressDB`, cập nhật
   `.claude/specs/00-architecture.md`, và nghĩ xem dữ liệu cũ (thiếu trường đó) sẽ hiển thị
   thế nào — phải có nghĩa, không được vỡ.
4. **Hiển thị**: dùng `.stat` cho ô số liệu, màu qua `scoreColorVar()` để ngưỡng 60/85 nhất
   quán với phần còn lại của app.
5. **Chữ nghĩa**: theo skill `lesson-voice`. Lời khen phải cụ thể ("Không sai chủ đề nào —
   ngon.") chứ không phải reo hò rỗng.

## Chỗ ngưỡng đang được đặt

Giữ nhất quán nếu thêm chỗ mới chấm điểm:

| Ngưỡng | Ý nghĩa | Màu | Định ở |
|---|---|---|---|
| < 60% | phải học lại rồi làm lại sau 2 ngày | `--red` | `scoreColorVar`, `quizTip` |
| 60–84% | ôn đúng chủ đề sai, làm lại sau 2–3 ngày | `--yellow` | như trên |
| ≥ 85% | vững, đi tiếp, ôn theo lịch | `--green` | như trên |

Lời khuyên kèm theo nằm ở `quizTip()` trong `src/lib/spaced-repetition.ts` — một chỗ duy
nhất, đừng viết lại lời khuyên rải rác trong component.

## Kiểm sau khi sửa

Cơ chế tiến độ khó kiểm bằng build vì lỗi chỉ hiện với **dữ liệu có sẵn**. Làm thế này:

```js
// trong console trình duyệt — nạp dữ liệu giả rồi tải lại trang
localStorage.setItem('csc14003-progress', JSON.stringify({
  sessions: { b1: { status: 'done', completedAt: '2026-08-01T00:00:00.000Z' } },
  partTests: { searching: { score: 75, correct: 9, total: 12, right: ['Buổi 3'], wrong: ['Buổi 5'], at: '2026-08-10T00:00:00.000Z' } }
}));
```

Ba trạng thái phải thử: **trống hoàn toàn** (người mới), **đang giữa chừng**, và **dữ liệu
định dạng cũ** nếu vừa đổi shape. Nhớ `localStorage.removeItem('csc14003-progress')` sau khi
thử xong để không để rác lại.

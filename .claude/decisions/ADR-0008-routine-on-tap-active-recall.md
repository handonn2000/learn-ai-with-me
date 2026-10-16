# ADR-0008 — Nhắc ôn bằng routine cloud + GitHub Issue, không nhét vào app

Ngày: 2026-08-24 · Trạng thái: phần "cách đăng" bị thay bởi ADR-0009 (2026-08-31);
phần lý do chọn routine cloud + GitHub Issue vẫn còn hiệu lực.
Hai routine ID nêu dưới đây ĐÃ XÓA — xem ADR-0009 cho routine hiện hành.

## Bối cảnh
App đã có lịch ôn ngắt quãng (`lib/spaced-repetition.ts`, scheme 1-3-7-14-30) và gợi ý "Hôm nay"
trên trang Lộ trình — nhưng nó **thụ động**: chỉ hiện ra khi người học tự mở app. Mà cái cần nhắc
lại đúng là thứ người ta hay quên mở. User muốn dùng tính năng schedule (routine cloud) của Claude
để bị nhắc chủ động.

## Ràng buộc nặng nhất
Routine chạy trong sandbox cloud, **không đọc được `localStorage`** — nơi duy nhất chứa tiến độ
thật (`csc14003-progress`). Vậy nên routine *không thể* biết người học đã học tới đâu, đã làm quiz
mấy điểm. Mọi thiết kế phải sống chung với điều đó.

## Quyết định
Hai routine cloud, cùng một prompt, khác giờ:

| Routine | Cron (UTC) | Giờ VN | ID |
|---|---|---|---|
| trưa T2-T4-T6 | `15 5 * * 1,3,5` | 12:15 T2·T4·T6 | `trig_017EDymr3JoxPdJSGKg4hTX9` |
| chiều T3-T5 | `30 8 * * 2,4` | 15:30 T3·T5 | `trig_018sGtVRET8PmYjDt779XfZJ` |

Mỗi lần chạy: agent đọc nội dung khóa từ repo, ra 3–5 câu hỏi MỞ, mở một GitHub Issue tiêu đề
`Ôn tập · YYYY-MM-DD · Buổi N`. Đáp án giấu trong khối `<details>` ở cuối.

Sandbox cloud có sẵn **GitHub MCP server** (`mcp__github__*`) — chạy thử thấy agent tự chọn dùng
nó thay vì `gh` CLI, và đọc file qua API luôn chứ không cần bản clone. Prompt viết trung lập để
đường nào cũng chạy được.

**Chỗ khéo: lịch sử issue chính là bộ nhớ tiến độ.** Routine không có state riêng — nó liệt kê
issue của repo kèm comment để biết lần trước hỏi gì, người học trả lời ra sao, đã học thêm buổi
nào. Người học trả lời bằng comment; lần chạy sau agent chấm rồi đóng issue. Mốc khởi động cứng
trong prompt: **Buổi 1 học ngày 2026-08-23**.

**Chống dồn đống.** Nhắc 5 lần/tuần mà không có luật hãm thì chỉ vài hôm là repo đầy đề bỏ ngỏ,
và người học ngại mở luôn. Luật: còn đề đang mở mà chưa trả lời thì **không ra đề mới** — chỉ báo
đề nào còn treo. Đề treo quá 7 ngày thì đóng lại rồi mới ra đề khác. Nghĩa là nhịp thật do người
học quyết, không phải do cron.

## Vì sao GitHub Issue mà không phải thứ khác
- Không có MCP connector nào (Slack/Gmail) được kết nối, nên không có kênh đẩy nào khác.
- Issue tự gửi mail cho chủ repo → thành cái nhắc thật, đọc và trả lời được trên điện thoại.
- Comment là chỗ để trả lời → khép được vòng active recall (hỏi → nhớ → chấm), thứ mà một cái
  nhắc một chiều không làm được.
- **Đánh đổi user đã biết và chấp nhận**: repo public nên câu trả lời sai đúng ai cũng đọc được.
  Phương án repo private riêng đã được chào và bị từ chối cho gọn.

## Vì sao không nhét cơ chế này vào app
Đây là **thông báo đẩy**, không phải tính năng học. App vẫn là chỗ học và chấm quiz; routine chỉ
lôi người học quay lại. Không thêm gì vào `ProgressDB`, không đụng `useProgress`. Nếu sau này muốn
nối hai bên (routine biết điểm quiz thật), phải làm tầng đồng bộ ra ngoài trình duyệt trước —
lúc đó viết ADR mới.

## Rủi ro
- **Prompt là bản sao nội dung, dễ lệch.** Prompt trỏ tới file trong repo (`index.ts`,
  `features/lessons/b1..b3`, `session-quizzes.js`, `part-tests.ts`). Đổi cấu trúc thư mục đó thì
  phải sửa prompt của **cả hai** routine — không có gì tự kiểm chuyện này.
- Buổi 4–11 repo mới chỉ có dòng `topics`, nên câu hỏi cho mấy buổi đó dựa trên AIMA, chưa đối
  chiếu slide. Prompt bắt agent nói rõ điều đó trong issue.
- Sửa routine: https://claude.ai/code/routines (xóa thì phải vào đó, API không xóa được).

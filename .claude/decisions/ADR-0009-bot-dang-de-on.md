# ADR-0009 — Bot đăng đề ôn thay vì routine tự ghi

Ngày: 2026-08-31 · Trạng thái: chấp nhận · Thay phần "cách đăng" của ADR-0008

ADR-0008 vẫn đúng ở phần *vì sao* nhắc ôn bằng routine cloud + GitHub Issue. ADR này chỉ thay
phần *cách đăng*: hai routine trong ADR-0008 đã xóa, giờ còn **một** routine
(`trig_019TD3rVMi6GgrtvFtwvzdCQ`, 12:15 T2·T4·T6) và nó không tự ghi issue nữa.

## Bối cảnh
Routine Claude Code chạy 3 lần/tuần, ra đề active recall cho Buổi 1 bằng GitHub Issue trên chính
repo này. Mục đích duy nhất của nó là **kéo người học quay lại** — nên nếu điện thoại không kêu thì
routine có chạy đúng cũng bằng không.

Routine ghi GitHub qua connector, tức **dưới danh nghĩa `handonn2000`**. Hai vòng thử thất bại mới
tìm ra vì sao im lặng:

| Đã thử | Kết quả |
|---|---|
| Issue do routine tạo (không mention) | không kêu |
| Issue do routine tạo + `@handonn2000` trong thân bài | **không kêu** — own-activity nuốt cả self-mention |
| Issue do `github-actions[bot]` tạo + `@handonn2000` + assignee | **kêu** ✓ |

Đọc ảnh chụp màn hình cài đặt GitHub Mobile mới thấy chỗ mấu chốt: danh sách push chỉ có bảy loại —
Direct Mentions, Assigned, Review Requested, Deployment Review, Pull Request Review, Workflow Runs,
Failed Workflows Only. **Không có loại "issue mới trong repo đang watch".** Watch một repo chỉ đổ vào
Inbox, không bao giờ đẩy push. Push chỉ kêu cho thứ nhắm thẳng vào mình — mà "thẳng vào mình" đòi
tác giả phải là người KHÁC mình.

## Quyết định
Thêm `.github/workflows/on-tap.yml` (`workflow_dispatch`, quyền `issues: write`). Routine **không
bao giờ** tự gọi `gh issue create` / `issue comment` / `mcp__github__issue_write` nữa; nó soạn nội
dung rồi dispatch workflow, để `github-actions[bot]` đứng tên.

Ba giá trị `action`: `create` (mở issue + tự gán assignee `handonn2000`), `comment`, `comment_close`.
Truyền input bằng JSON qua stdin (`jq -n --rawfile … | gh workflow run … --json`) để an toàn với
xuống dòng và ký tự đặc biệt trong markdown.

Bot đánh trúng **hai** kênh push cùng lúc: direct mention (`@handonn2000` trong thân bài) và assignee.

## Sandbox không có `gh`
Chạy thử lộ ra: **`gh` CLI không tồn tại trong sandbox routine** (`gh: command not found`). Dispatch
phải đi qua tool MCP `mcp__github__actions_run_trigger` (owner / repo / workflow `on-tap.yml` /
ref `main` / `inputs`). Mọi giá trị trong `inputs` phải là **chuỗi**, kể cả số issue. Việc đọc issue
cũng vậy — `mcp__github__list_issues`, `issue_read`. Prompt đã ghi rõ để lần chạy sau khỏi dò lại.

## Hệ quả
- Dispatch là **bất đồng bộ**: lệnh trả về thành công không có nghĩa issue đã lên. Routine bắt buộc
  chờ rồi kiểm lại bằng `gh issue list`; workflow lỗi thì không có gì hiện ra mà dispatch vẫn im.
- Nhánh "chấm bài" phải **mở đề mới TRƯỚC** để lấy URL, rồi mới comment chấm kèm link — không đảo
  ngược được.
- Khi đọc lịch sử, comment của `github-actions` là của chính routine, không phải bài làm của người
  học. Chỉ comment của `handonn2000` mới tính.
- File workflow nằm trong repo public. Nó không chứa secret nào (`GITHUB_TOKEN` do Actions tự cấp).

## Đã cân nhắc và bỏ
- **Discord webhook** — độc lập danh tính nên chắc kêu, nhưng người dùng muốn ở lại trong app GitHub,
  không thêm bên thứ ba.
- **Bật `Settings → Notifications → include your own updates`** — theo docs GitHub công tắc này chỉ
  áp cho email, không cho mobile push. Giải quyết được nửa vấn đề, không phải nửa người dùng cần.
- **Tài khoản GitHub thứ hai làm bot** — cũng vượt được own-activity, nhưng nặng hơn hẳn một file
  workflow và phải nuôi thêm một bộ credential.

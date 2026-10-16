# ADR-0018 — Tách Buổi 3 thành ba buổi và đánh số lại cả khóa

Ngày: 2026-09-21 · Trạng thái: chấp nhận · Nới một điều cấm trong `CLAUDE.md § Điều cấm`

## Bối cảnh

Buổi 3 là buổi dài nhất khóa và chính data khai ra điều đó: `hours: '~6h · 3 phần'` — buổi duy
nhất trong 11 buổi mang chú thích "3 phần", trong khi trung vị là ~3h. Slide gốc cũng là ba deck
riêng (43 + 64 + 73 = 180 trang), mọi buổi khác chỉ một deck.

Đợt đối chiếu 2026-09-19 (`docs/courses/csc14003/reviews/b3-coverage-2026.md`) còn cho thấy bài
đang thiếu một khối 11 trang (memory-bounded search: IDA\* · RBFS · SMA\*) và tám mục mỏng, đồng
thời mục Code Lab đã lạc đề vì đề Lab đổi sang bản 2026. Nhồi thêm chừng đó vào một trang thì nó
thành ~9–10h.

Ràng buộc kỹ thuật quyết định hình dạng lời giải: `SessionQuiz` ghi vào
`sessions[sessionId].quizScore / quizRight / quizWrong` — **một bản ghi cho mỗi sessionId**. Ba
quiz trên cùng một id sẽ đè lên nhau, và mất luôn khả năng biết người học yếu ở phần mù hay phần
có thông tin. Muốn ba phần có tiến độ riêng thì buộc phải có ba id.

## Quyết định

Buổi 3 tách thành **Buổi 3 · 4 · 5**, và mọi buổi từ 4 trở đi dời lên hai số:

| Trước | Sau | Nội dung |
|---|---|---|
| b3 (phần 1) | **b3** | Phát biểu bài toán tìm kiếm |
| b3 (phần 2) | **b4** | Tìm kiếm mù |
| b3 (phần 3) | **b5** | Tìm kiếm có thông tin |
| b4 | b6 | Tìm kiếm cục bộ |
| b5 | b7 | Tìm kiếm đối kháng |
| b6 | b8 | CSP |
| b7 | b9 | Logic mệnh đề |
| b8 | b10 | Logic bậc nhất |
| b9 | b11 | Mạng Bayes |
| b10 | b12 | Học máy cơ bản |
| b11 | b13 | Mạng nơ-ron |

`Course.weeks` 11 → 13. Part range: Tuần 1–2 · **3–8** · **9–11** · **12–13**.

Đã cân nhắc phương án nhẹ hơn — giữ số buổi khớp số bài giảng của trường, tách thành
"Buổi 3.1 / 3.2 / 3.3" với id `b3a`/`b3b`/`b3c`, không đụng b4–b11. Người dùng chọn phương án
đánh số lại sau khi đã nghe rủi ro; ghi lại ở đây để phiên sau biết đây là lựa chọn có ý thức,
không phải sơ suất.

## Nới điều cấm: `public/materials/`

`CLAUDE.md` cấm đổi/di chuyển `public/materials/` vì data khóa trỏ vào đó. ADR này nới đúng một
lần cho đợt đánh số lại, và **thư mục Lecture đã đổi tên** cho khớp số buổi mới
(`buoi4` → `buoi6` … `buoi11` → `buoi13`, giảm dần để không đè; buổi 3 cũ tách ba: P1 ở lại
`buoi3/`, P2 → `buoi4/`, P3 → `buoi5/`).

Hai điều ràng buộc lại:

- **Tên FILE giữ nguyên.** `buoi6/Lecture04-LocalSearch.pdf` vẫn mang số 04 của trường. Đổi tên
  file là phá provenance của tài liệu gốc — số trên app là của app, số trên file là của khoa.
- Lo ngại ban đầu về "lệch số" hóa ra nhỏ hơn thực tế: **slide bài giảng không hề được link từ
  app**. Chỉ 9 href tồn tại và toàn là Homework. Việc đổi tên thư mục vì vậy không ảnh hưởng
  runtime, nó chỉ để tra cứu cho khớp.
- `public/materials/` bị gitignore nên **git không revert được**. Trước khi đụng đã sao lưu ra
  `~/Workplace/AI/.materials-backup-20260921-*.tar.gz`; nguồn gốc vẫn còn ở
  `HCMUS/CacThuatToanThongMinhNhanTao/Lecture/` (đã đối chiếu MD5 trùng khớp).

## Migration tiến độ người học

`storage.ts` có thêm `RENUMBER_2026_09` và trường mốc `schema` (SCHEMA = 1). **Đây là migration
đầu tiên trong file KHÔNG chạy-lại-được**: `b4 → b6` áp lần hai sẽ thành `b8`. Mọi migration cũ
(`LEGACY_PART_IDS`, `mapTopics`) idempotent một cách tự nhiên vì không id nào là khóa của bảng
tra; cái này thì không, nên nó bị khóa sau mốc `schema`. **Đừng gỡ mốc đó.**

Thứ tự cũng quan trọng: `renumber` chạy SAU `mapTopics`, để nhãn `'Buổi 7'` kịp thành `b7` rồi
mới dời được thành `b9`. Phép dời đi ngược từ cuối (b11→b13 trước) để không đè lên khóa chưa dời.

Bản ghi `b3` cũ **giữ nguyên chỗ**: nội dung nó chấm (phát biểu bài toán + tìm kiếm) nằm gọn ở
phần mở đầu của Buổi 3 mới.

## Hệ quả

- **Tham chiếu chéo trong bài là thứ dễ quên nhất.** Đổi số buổi làm sai 13 câu ở b1, b2, b5 và
  6 chỗ trong `intro-ai`, `agents-data`, `lab-searching`, `session-quizzes` — kiểu "Buổi 5 mình
  sẽ mở nắp mấy con này ra xem — minimax". Đã sửa hết. Lần sau đụng số buổi thì soát lại bằng
  `grep -rnE "(Buổi|buổi|Session|session)s? *[0-9]"` trên cả `lessons/` lẫn `content/courses/`.
- `SearchLab`, `CodeLab`, `AlgoCard`, `scenes.ts` nâng từ `lessons/b3/` lên
  `features/search-lab/` vì giờ hai buổi cùng dùng (đúng luật "≥2 feature thì nâng lên"). Hai
  component nhận prop `only?: string[]` để mỗi buổi chỉ hiện nhóm thuật toán của mình.
- Chữ dùng chung của hai component tách thành `features/search-lab/lab.text.*` và thành **unit
  i18n riêng** (`search-lab`) — nếu gắn nó vào b4 hoặc b5 thì unit kia không đóng độc lập được.
- Unit `b3` cũ tách thành bốn: `b3`, `b4`, `b5`, `search-lab`. Phán quyết song ngữ cũ của b3 hết
  hiệu lực, đã chuyển thành `judged/b3-superseded-2026-09-21.json`.
- Mốc i18n `baseline/b4.json` (vốn là Tìm kiếm cục bộ) đổi tên thành `b6.json` theo buổi của nó.

## Đã cân nhắc và bỏ

- **Ba tab trong một trang, giữ một sessionId.** Rẻ nhất, nhưng `SessionQuiz` chỉ có một bản ghi
  cho mỗi id nên ba quiz đè lên nhau — mất đúng cái giá trị định tạo ra.
- **Giữ nguyên một trang, thêm mục có thể gập.** Không chữa được gì: tiến độ vẫn một mức, lịch
  ôn vẫn một mức, người bỏ dở giữa chừng vẫn bị coi như chưa làm gì.
- **Đổi luôn tên file PDF cho khớp số buổi.** Phá provenance; người dùng duyệt đổi *thư mục*.

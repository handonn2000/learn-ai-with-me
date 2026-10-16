# ADR-0011 — Chủ đề chấm điểm lưu bằng ID ổn định, không phải nhãn hiển thị

Ngày: 2026-09-05 · Trạng thái: chấp nhận · nối dòng dõi ADR-0004

## Bối cảnh
`SessionQuiz.tsx` ghi `q.topic` — một **chuỗi hiển thị tiếng Việt** như `'Bảy chiều môi trường'` —
thẳng vào `ProgressDB.sessions[id].quizRight` / `quizWrong`. `part-tests.ts` ghi `'Buổi 1'` vào
`partTests[].right/wrong`. Trang Lộ trình join mấy chuỗi đó lại để dựng báo cáo mạnh/yếu.

Chuyện này chạy tốt suốt vì chỉ có một ngôn ngữ. Thêm bản tiếng Anh vào là **tiến độ của người
học tách đôi theo ngôn ngữ**: làm quiz ở bản Việt xong đổi sang bản Anh thì báo cáo hiện hai bộ
từ vựng rời nhau, không cái nào cộng vào cái nào. Không có lỗi, không có cảnh báo — chỉ có một
báo cáo sai âm thầm.

Phát hiện lúc đọc code để lập kế hoạch song ngữ, trước khi viết dòng dịch nào.

## Quyết định

Dữ liệu lưu **ID**, chữ chỉ sinh ra lúc render.

`content/courses/csc14003/topics.ts` mới: `TOPIC_IDS` (`as const` → union đóng, 30 id) +
`TOPIC_LABELS: Record<Locale, Record<TopicId, string>>` + `topicLabel(id)`.

`Record<TopicId, string>` cho **tính đầy đủ miễn phí**: thiếu một nhãn ở locale nào là lỗi
`tsc`. Đây là cổng sạch nhất trong cả đợt việc này.

Chủ đề của kiểm tra tổng hợp dùng luôn `Session.id` (`b1`…`b11`) — để sau này báo cáo link
thẳng về buổi được.

**Đổi TÊN trường, không tái dụng:** `topic` → `topicId` ở cả hai bộ đề.

- `part-tests.ts` (đã gõ kiểu): `topicId: TopicId` — `tsc` soát cả 36 câu theo union đóng và
  chỉ ra mọi consumer. Thắng miễn phí.
- `session-quizzes.js` (chưa gõ kiểu): kiểu là `string` chứ không phải `TopicId`, vì trong
  array literal của file `.js` giá trị nới thành `string` nên union đóng sẽ báo lỗi cả với dữ
  liệu ĐÚNG. Bù lại, chỗ dùng đổi từ **cast sang annotation**
  (`const BANK: Record<string, QuizQ[]> = SESSION_QUIZZES`) — cast thì bịt lỗi, annotation thì
  không. Membership tập đóng do `check_i18n.py` canh.

Giữ tên `topic` mà lặng lẽ đổi giá trị từ chuỗi-hiển-thị sang slug đúng là loại thay đổi hôm
nay đọc thấy ổn, sáu tháng sau cắn người.

## Di trú

`LEGACY_TOPICS` trong `storage.ts` map 30 chuỗi Việt → id, nối vào hàm `migrate()` sẵn có (đã
có tiền lệ `LEGACY_PART_IDS`). Bốn tính chất, mỗi cái đều quan trọng với người đang học dở:

- **Một chiều**, không có bản đảo — cùng tinh thần `LEGACY_PART_IDS`.
- **Idempotent**: không id nào là key của bảng, nên chạy lại là no-op. An toàn để gọi mỗi lần
  `loadProgress()`, đúng như migration cũ đang làm.
- **Không phá dữ liệu**: chuỗi lạ đi qua nguyên vẹn. Người học không mất một điểm dữ liệu nào
  vì ta quên một ánh xạ.
- **An toàn khi render**: `topicLabel()` fallback về chính chuỗi cũ, nên sót lại thì hiện nhãn
  Việt cũ chứ không biến mất khỏi báo cáo.

Không thêm trường `version`: migration hiện tại vốn không có version và idempotent, thêm
versioning lúc này là bộ máy không có khách hàng.

**Một cái bẫy đã sập khi sửa:** `migrate()` cũ mở đầu bằng `if (!db.partTests) return db;`. Nối
thêm vào sau dòng đó thì **bỏ sót toàn bộ người học chưa làm kiểm tra tổng hợp** — tức là phần
lớn người học. Phải tái cấu trúc để nhánh chủ đề nằm ngoài nhánh partTests.

## Kiểm chứng
Repo không có test runner, nhưng `KeyValueStore` của ADR-0004 là injectable nên vẫn kiểm được:
biên dịch riêng `storage.ts` ra JS, bơm một store giả chứa blob tiền-di-trú thật, và khẳng định
từng tính chất — gồm cả ca "chưa làm kiểm tra tổng hợp" mà early-return cũ bỏ sót, ca chuỗi lạ,
ca idempotent, ca DB rỗng/rác. Chín khẳng định, xanh hết.

Đó là mẫu đáng lặp lại cho mọi thay đổi động tới dữ liệu người học: **cổng kiểm không cần test
runner, chỉ cần một ranh giới cho phép bơm phụ thuộc.**

## Hệ quả
- `quizRight` / `quizWrong` / `partTests[].right` / `.wrong` từ nay chứa id, không chứa chữ.
- Mọi chỗ hiển thị phải đi qua `topicLabel()`. Đã sửa 4 chỗ; một chỗ ở `PartTestPage` suýt lọt
  (nó join thẳng `rightT` nên sẽ hiện `b3 · b4` thay vì `Buổi 3 · Buổi 4`).
- `check_i18n.py` canh hai điều `tsc` không thấy: mọi `topicId` nằm trong `TOPIC_IDS`, và mọi
  giá trị trong `LEGACY_TOPICS` trỏ tới một id có thật.
- Bộ đề tiếng Anh chỉ được đổi *chữ*, không được đổi `topicId` — đổi là tiến độ tách đôi trở
  lại. `check_i18n.py` so `topicId` giữa hai bản theo từng câu.

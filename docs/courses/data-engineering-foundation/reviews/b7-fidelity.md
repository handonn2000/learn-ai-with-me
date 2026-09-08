## VERDICT: ĐẠT

## Phạm vi và phương pháp

Unit `def-b7`: đúng cặp VI/EN trong `.claude/i18n/acceptance.json`. Đây là lần chấm tiếp nối có kiểm chứng phần không đổi, bao phủ toàn bộ 469 cặp chuỗi hiện tại: 373 cặp gốc đã đọc đầy đủ ở lần đầu, cộng 96 cặp mới; mọi cặp đã sửa được đọc lại cùng ngữ cảnh nhạy cảm. Mechanical i18n, shape và quiz parity PASS theo người gọi. Không đọc slide, không chấm coverage, không sửa lesson hoặc verdict gate.

Đã áp dụng hợp đồng `i18n-fidelity-judge`, `lesson-voice/SKILL.md` và `lesson-voice/references/english.md` đã đọc ở lần đầu. Yêu cầu giọng người dẫn chuyện phim tài liệu của user được ưu tiên; không ép bài thành đối thoại.

### Căn cứ kế thừa phần không đổi

Hai snapshot JSON `/tmp/def-b7-review/current-vi.json` và `/tmp/def-b7-review/current-en.json` được chuyển lại đúng định dạng TS của bundle (indent, key không quote, export/import/satisfies). SHA256 của nội dung tái tạo khớp hoàn toàn danh tính file trong `/tmp/def-b7-review/fidelity-report.md`:

- VI cũ: `2eec254240ba4e5313af9ed5e5b550b2d520023f8cc35290ef80d4456aec1926`
- EN cũ: `1c95694d6fe0c469c5afdd59b4b4784df0bda24122a74994693b4cc708aeee5d`

So sánh đệ quy từng khóa giữa các snapshot có danh tính này và bundle hiện tại xác nhận:

- Cả hai ngôn ngữ: thêm `chapters[0..9].figures`, thêm `lab.speed`, sửa `chapters[2].body[0]` để bổ sung CDC fan-out.
- Chỉ EN: sửa thêm `chapters[1].body[0]`, `chapters[7].lead`, `chapters[9].body[2]` để giải quyết đúng ba phát hiện cũ.
- Không có thay đổi nào khác. Vì vậy những cặp không đổi được kế thừa từ lần đối chiếu đầy đủ trước, có chứng cứ nội dung chứ không chỉ dựa vào lời mô tả thay đổi.

### Danh tính file hiện tại đã chấm (SHA256)

- `/Users/handonn/Workplace/AI/learn-ai-with-me/src/features/lessons/def/b7/lesson07.text.vi.ts` — 813 dòng — `cab815671cab543815913020f1a77a776c5175b782756c4fc2386945c29dcee7`
- `/Users/handonn/Workplace/AI/learn-ai-with-me/src/features/lessons/def/b7/lesson07.text.en.ts` — 814 dòng — `b68cb07e9622399c3e13c8ffdd3bdd97f5326f55c2bd9bf9e4832863c9e2a9e7`

## SAI NGHĨA — phải sửa

Không còn phát hiện. `chapters[9].body[2]`, EN dòng 564 đã dùng «Data types, keys, transactions, and setup still differ between sources», khôi phục đúng nghĩa `kiểu dữ liệu` và khác biệt giữa nguồn.

## DỊCH CỨNG — nên sửa

Không còn phát hiện cần yêu cầu sửa. Hai chỗ cũ đã được xử lý:

- `chapters[1].body[0]`, EN dòng 70: đã bỏ «wait for a long schedule», diễn đạt về khoảng cách giữa các lần chạy batch.
- `chapters[7].lead`, EN dòng 444: «The producer receives a success acknowledgment. Moments later, the leader’s machine fails.» tự nhiên và thống nhất thì kể.

## MẤT GIỌNG — nên sửa

Không có. Phần bổ sung giải thích trực tiếp nhưng vẫn hợp giọng người dẫn chuyện phim tài liệu; không làm mất cảnh báo hay bẻ mạch lập luận của VI.

## ĐẠT — các vùng mới/sửa đã đối chiếu

Các chỉ số mảng bắt đầu từ 0.

- `chapters[1].figures[0]` (VI dòng 119–142, EN dòng 120–143): title/text/headers/rows giữ đúng cùng ba dòng, chuỗi row/column/row-group, nhóm cuối nhỏ hơn, và giới hạn “không phải byte encoding”. Đọc lại cards của chương để xác nhận chú thích không làm mất việc ORC và Parquet đều columnar.
- `chapters[2].body[0]` (VI 148, EN 149): fan-out nguồn → log → CDC → Elastic / Redis / Snowflake giữ cùng thứ tự, ba nhu cầu search/cache/analytical storage và trách nhiệm áp dụng INSERT/UPDATE/DELETE riêng ở từng đích. Phần CDC gốc vẫn đầy đủ.
- `chapters[2].figures[0]` (VI 180–210, EN 181–211): giữ đúng ID 1122, dữ liệu minh họa trước/sau, timestamp mới hơn và is_deleted=true; EN không biến soft delete thành hard delete hoặc câu chuyện về người thật.
- `chapters[2].figures[1]` (VI 211–244, EN 212–245): phân biệt change-event ID với business RowID, nhu cầu mapping khóa/payload, mất chi tiết sau delete và lỗi nhãn Timestamp trên email được giữ. Đã đọc lại toàn bộ body CDC và bảng ba phương pháp để kiểm ngữ cảnh.
- `chapters[4].figures[0]` (VI 328–354, EN 329–355): giữ đúng Service 1 phát E1, Service 2 đọc E1/phát E2, Service 3 đọc cả hai; producer và consumer có thể cùng nằm trong một service. Từng ô bảng khớp ý.
- `chapters[4].figures[1]` (VI 355–381, EN 356–382): giữ đủ bốn nhánh quyết định cluster, chi phí sở hữu là kỳ vọng, cạnh tranh tài nguyên giữa topic, vai trò ACL/quota, miền lỗi/lịch bảo trì/tuân thủ, data locality/fine-tuning/domain ownership. EN không biến nhiều cluster thành lời hứa an toàn hay giảm chi phí.
- `chapters[7].figures[0]` (VI 480–511, EN 481–512): mỗi partition có 3 replica; broker 1 hỏng khiến P0 chuyển leader sang broker 2, trong khi P1/P2 giữ leader cũ. Các vị trí L/F trước/sau giữ đúng vai trò và giải thích broker có thể lead nhiều partition. Đã đọc lại toàn bộ body và bảng của chương để giữ điều kiện ISR/clean election.
- `lab.speed` (VI 713, EN 714): «Tốc độ» → «Speed», nhãn ngắn và đúng.
- Các mảng `figures` rỗng của chương khác không thêm văn xuôi cần chấm. Thuật ngữ song ngữ, summary/checks/practice, các lab và đủ 8 quiz còn lại không đổi theo phép so sánh có chứng cứ nêu trên.

Verdict này thay thế verdict CẦN SỬA ở báo cáo đầu cho đúng hai SHA256 hiện tại. Không còn yêu cầu chỉnh sửa về trung thành bản dịch hoặc giọng văn.

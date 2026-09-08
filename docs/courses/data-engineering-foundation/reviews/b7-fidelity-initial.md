## VERDICT: CẦN SỬA

## Phạm vi và căn cứ

- Unit `def-b7`, đúng một cặp `ts-bundle` được khai báo trong `.claude/i18n/acceptance.json`.
- Đã đọc và đối chiếu toàn bộ hai bundle: 373 cặp chuỗi, gồm hero/mở bài, thuật ngữ đầu vào, đủ 10 chương (title/lead/body/cards/table/flow), tổng kết, tự kiểm, bài thực hành và hướng dẫn, toàn bộ nhãn/diễn biến của 3 lab, cùng 8 câu quiz và mọi lựa chọn/giải thích. Không lấy mẫu.
- Đã đọc `.claude/agents/i18n-fidelity-judge.md`, `.claude/skills/lesson-voice/references/english.md` và `.claude/skills/lesson-voice/SKILL.md`.
- Chấm theo yêu cầu giọng người dẫn chuyện phim tài liệu của user; không coi ít đối thoại hoặc thiếu đại từ như một lỗi giọng. Các lời nhắc kỹ thuật, cơ chế, điều kiện và mạch kể vẫn cần được giữ.
- Mechanical i18n, shape và quiz parity đã PASS theo người gọi; không chấm lại các cổng đó. Không đọc slide hoặc đánh giá phủ slide. Không sửa bundle hoặc verdict gate.
- Các nhãn cho phép giữ tiếng Việt trong `terms` đã đổi thứ tự đúng: `Record / Bản ghi`, `Key / Khóa`, `Throughput / Thông lượng · latency / Độ trễ`. Không phát hiện lỗi bảng song ngữ lặp hai nhãn tiếng Anh.

### Danh tính file đã chấm (SHA256)

- `/Users/handonn/Workplace/AI/learn-ai-with-me/src/features/lessons/def/b7/lesson07.text.vi.ts` — 629 dòng — `2eec254240ba4e5313af9ed5e5b550b2d520023f8cc35290ef80d4456aec1926`
- `/Users/handonn/Workplace/AI/learn-ai-with-me/src/features/lessons/def/b7/lesson07.text.en.ts` — 630 dòng — `1c95694d6fe0c469c5afdd59b4b4784df0bda24122a74994693b4cc708aeee5d`

Các chỉ số mảng trong khóa dưới đây bắt đầu từ 0.

## SAI NGHĨA — phải sửa

- Khóa `chapters[9].body[2]`; VI dòng 381, EN dòng 382.
  VI: «Nguồn khác nhau vẫn khác kiểu dữ liệu, khóa, transaction và cấu hình; “định dạng chung” không xóa khác biệt ngữ nghĩa.»
  EN: «Database types, keys, transactions, and setup still differ; a common format doesn’t erase semantic differences.»
  → `kiểu dữ liệu` là **data types**, không phải **database types** (loại cơ sở dữ liệu). Bản EN chuyển đối tượng đang khác nhau sang loại DB, làm mất cảnh báo về khác biệt kiểu dữ liệu mà change-event envelope chung không xóa được. Sửa cụ thể: «Data types, keys, transactions, and setup still differ between sources; a common format doesn’t erase semantic differences.»

## DỊCH CỨNG — nên sửa

- Khóa `chapters[1].body[0]`; VI dòng 68, EN dòng 69.
  VI: «Đây là mẫu phổ biến, không phải quy luật rằng mọi tệp đều phải chờ lịch dài.»
  EN: «This is a common pattern, not a rule that every file must wait for a long schedule.»
  → `wait for a long schedule` không diễn đạt tự nhiên khoảng chờ giữa các lần nạp. Sửa câu chốt thành: «This is a common pattern; files don’t inherently require long intervals between ingestion runs.» Ý “mẫu phổ biến không phải hạn chế cố hữu của tệp” vẫn nguyên.

- Khóa `chapters[7].lead`; VI dòng 295, EN dòng 296.
  VI: «Producer đã nhận thành công. Ngay sau đó, máy đang giữ leader ngừng hoạt động.»
  EN: «The producer received success. Moments later, the leader’s machine fails.»
  → `received success` là cách ghép từ dịch cứng. Dùng danh từ chỉ tín hiệu thành công và giữ thì kể thống nhất: «The producer receives a success acknowledgment. Moments later, the leader’s machine fails.» Cảnh producer vừa nhận xác nhận rồi leader chết được giữ rõ.

## MẤT GIỌNG — nên sửa

Không có phát hiện cần sửa theo tone phim tài liệu đã được user yêu cầu. Mạch theo dấu đơn hàng xuyên qua nguồn, partition, failure rồi retention được giữ. Các câu kỹ thuật ngắn hoặc khách quan phù hợp yêu cầu này.

## ĐẠT

Các ranh giới dễ trôi nghĩa được giữ tốt: hard delete so với polling, rollback so với compensating transaction, log end/committed offset/lag, assignment riêng từng group, ISR và min ISR, producer idempotence so với tác động ngoài Kafka, atomic sink deduplication, retention theo segment và compaction không đánh lại offset. Tám kịch bản crash trong phần thực hành giữ đúng vai trò các kết quả 0/10/20; những hạn chế của toy model vẫn hiện đầy đủ. Ngoài các mục trên, không phát hiện đổi nghĩa hoặc giọng dịch cứng đủ rõ để báo.

Verdict CẦN SỬA do có 1 mục SAI NGHĨA; hai mục DỊCH CỨNG là chỉnh sửa cục bộ, không phải yêu cầu viết lại giọng toàn bài.

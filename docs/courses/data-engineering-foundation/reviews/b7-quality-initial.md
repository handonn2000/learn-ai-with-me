# DEF Week 7 / b7 — Independent lesson-quality review

## 1. Verdict

**NEEDS CHANGES — static review của bài hoàn chỉnh, phạm vi “tất cả chi tiết có nội dung học thuật trong 45 trang slide”, gồm ví dụ và cơ chế trong hình.**

Bản VI đã được đọc đầy đủ, đối chiếu mọi trang nguồn. Các sửa kỹ thuật lớn trong bài là đúng: Kafka không bảo đảm tuyệt đối không mất dữ liệu; consumer group không loại replay; producer idempotence không bảo đảm exactly-once cho sink ngoài Kafka; Kafka 4.0 bỏ ZooKeeper; log CDC không miễn phí; Parquet vẫn là columnar.

Còn ba finding bắt buộc: thiếu sơ đồ quyết định một/nhiều cluster (Q1); thiếu một số ví dụ hình gốc với cơ chế riêng (Q2); renderer biến sơ đồ ecosystem phân nhánh thành chuỗi mũi tên (Q3). Không phát hiện lỗi số học hay đáp án quiz trong phạm vi đã kiểm. Không có căn cứ để xác nhận giao diện trình duyệt đã pass: caller đang kiểm browser riêng.

## 2. Review manifest

- Course: `data-engineering-foundation`; lesson `b7`; route `/courses/data-engineering-foundation/lessons/b7`.
- Nguồn duy nhất: `/Users/handonn/Workplace/AIDE-01/slides/Lession_7_Data_Engineering_Ingestion_Layer.pdf`, 45 trang. Đọc toàn bộ extraction `/tmp/def-course-analysis/lesson-07.txt`, xem cả năm contact sheet chứa trang 1–45. Xem ảnh từng trang đầy đủ tại trang 12,13,17,28,34,35,37 để đọc chi tiết bảng/sơ đồ. Các hình còn lại đọc được cơ chế trên contact sheet và đối chiếu extraction.
- Lesson: đọc đầy đủ sáu tệp `src/features/lessons/def/b7/*`: page, VI, EN, selector, IngestionLabs, ingestion-engine. Đọc `SessionQuiz`, `LessonDeck`, `Html`, `CheckList`, `SectionHead`, `LessonNav`, `Reveal`, `locale`, `motion`, `useProgress`, phần storage liên quan, CSS DEF và route App. Tất cả body/cards/table/flow trong bundle được page map ra DOM; các lab mount tại ch07/ch09/ch10. Quiz nhận bank DEF và namespace progress đúng course.
- VI: tất cả narrative, glossary/prerequisites, body/cards/table/flow, summary, self-check, practice/guide, lab labels/narration, tám quiz/đáp án/feedback.
- EN: đọc narrative và các claim nhạy cảm tương ứng trong ch01–ch10, glossary, tất cả con số/cấu hình/code commentary, practice/guide, lab labels/feedback và cả tám quiz. Đây là kiểm correctness-sensitive bilingual; không thay cho chứng nhận fidelity từng string và không cập nhật gate/hash i18n.
- Tự chạy `node scripts/check-def-b7.mjs`: **5 checks pass**; đã đọc nội dung script. Script kiểm 8 tổ hợp crash, routing 1–4 partition/có-không key, group độc lập, CDC/retention, cấu trúc locale/answer parity/wiring. Chỉ các assertion này được xác nhận; không phải kiểm Kafka thật.
- Tự đọc và tính lại fixture: 3 partition keyed có P0=[B20,B25], P1=[C30], P2=[A10,A12,A15]; offsets cục bộ 0-based, nhóm độc lập. Crash trước tác động: commit-trước cho 0, commit-sau cho 10; crash sau: commit-trước cho 10, commit-sau/plain cho 20, commit-sau/dedup cho 10. Retention outputs: all [0,1,2,3], time [1,2,3], size [2,3], compact [1,2,3]. Khớp prose và answer guide.
- Caller báo build 124 modules và i18n checker 373 strings pass; reviewer **không chạy lại** hai check này, không đọc/đạo theo verdict report của tác giả.
- Không cài dependencies, không mở service, không chạy stack Kafka/DB, không sửa project. Chỉ ghi report và ledger dưới `/tmp/def-b7-review`.

### Artifact identity (SHA-256 của snapshot ban đầu)

| Tệp | SHA-256 |
|---|---|
| PDF | 46bdac417ae017ca0bc8e84957f61a9cf309c108018fa88bfdb9d29b785d021a |
| IngestionLabs.tsx | 03b58a021a8870c9156ddb51efa3fda2fb9ef29f0014662c2879cb8f4b62e6ac |
| Lesson07Ingestion.tsx | 9cadce6f6f000f16db18b3cea5564d4d1a3f2be6a30bbc86cca6400ec6a11cea |
| ingestion-engine.ts | 678477c2c5c94822e55ad2b9a16a9cad265c96646b6c4407b2c105290e3e6552 |
| lesson07.text.vi.ts | 2eec254240ba4e5313af9ed5e5b550b2d520023f8cc35290ef80d4456aec1926 |
| lesson07.text.en.ts | 1c95694d6fe0c469c5afdd59b4b4784df0bda24122a74994693b4cc708aeee5d |
| lesson07.text.ts | 251fedbe77054b79656220d861f0b4d8eb1585e58d0e8a506b348095aa486624 |
| src/components/SessionQuiz.tsx | b3364b7518c7e2ac2a94c3a578176530fa7ff57fe5b81279f3a5fd4cda2d948f |
| src/components/LessonDeck.tsx | 2db3b2f22f5141a94422d1124c5b3d17f40736fa6d9667e1d19e4ecffcd31dc3 |
| src/styles/global.css | 0129e492b872d637886b6cf4af124dccc93014687204bf319eee660188597481 |
| src/App.tsx | c6dd5aeef96468130d94f7ace9d1e3d66336630a05ad3052922748d2b89e539f |
| scripts/check-def-b7.mjs | 2a5aa9121c411dcadbb8aeb5075cdbd56f4a299702a2a737369a5717698eec1f |

Tệp lesson không có revision commit riêng; hash là căn cứ để tái dùng kết quả. Report này khóa snapshot trước sửa Q1–Q3, không tự áp dụng verdict cho snapshot sau đó.

## 3. Required fixes

### Correctness

Không có lesson error kỹ thuật/numerical độc lập đã xác nhận trong nội dung hiện có. Q3 là lỗi biểu đạt cơ chế bằng sơ đồ dù prose bên cạnh đúng.

### Coverage / depth

**Q1 — medium — Bỏ mất nội dung thực của hình “Environment separation” trang 28.**

- Vị trí: `lesson07.text.vi.ts`, `chapters[4].body[0]` / `#ch05` (EN tương ứng); ledger 49–52.
- Quan sát: bài chỉ nêu đặt tên topic dev/test/prod và tên prod không tạo security boundary. Hình nguồn bên dưới thực tế hỏi “One or multiple Apache Kafka clusters?”; đây là quyết định kiến trúc khác với tên topic.
- Cần bổ sung bảng/nhánh dễ đọc giữ cả bốn nhóm: một cluster (global event hub, lower cost of ownership, no technical constraints là điều kiện minh họa); nhiều cluster vì operational decoupling (maintainability, workload criticality, regulatory compliance); tenant isolation (resource isolation, security boundary, logical decoupling); use-case optimization (fine-tuning, data locality, domain ownership, purpose-built).
- Giải thích ý nghĩa quyết định ở mức nhập môn, không chỉ thêm danh sách nhãn. Không biến “một cluster có lower cost” thành định luật và không bảo rằng mọi tenant bắt buộc cluster riêng. Topic namespace/ACL/quota có thể cô lập một số mặt trong cluster chung; có nhu cầu cần phân tách mạnh hơn. [Kafka 4.0 Multi-Tenancy, namespaces/security/quotas](https://kafka.apache.org/40/operations/multi-tenancy/).
- Xác nhận sửa: người đọc nêu được vì sao tải thử nghiệm có thể cần tách khỏi thanh toán production, và tại sao đổi prefix topic chưa tự tách CPU/network hay quyền truy cập. Cả VI/EN giữ cùng các nhánh và giới hạn.

**Q2 — medium — Một số ví dụ hình nguồn bị thay bằng ví dụ khác, chưa giữ chi tiết cơ chế riêng.**

Phạm vi “all substantive examples/diagrams” của caller yêu cầu giữ các ví dụ này; không yêu cầu sao chép pixel, tên/email trang trí hoặc văn phong slide. Có thể thêm bảng đọc tĩnh vào chương hiện có, giữ lab bổ sung.

| Nguồn | Vị trí sửa | Chi tiết còn thiếu / tiêu chí |
|---|---|---|
| p8,11 — CDC fan-out (ledger 11) | ch03 hoặc ch10 | Source DB → transaction log → CDC → Elastic/Redis/Snowflake. Giữ minh họa một luồng cấp nhiều loại đích; các thương hiệu chỉ là ví dụ. |
| p12 — timestamp row (ledger 18) | ch03 sau polling | Thể hiện cùng row ID 1122, trạng thái trước/sau và Last Modified tăng; `is_deleted:false→true` nhưng row vẫn tồn tại. Có thể lược tên/email vì không dạy cơ chế riêng. So hard DELETE mà không còn row. Hai timestamp gốc là 2022-10-31T12:11:07 và 2023-10-13T02:17:08. |
| p13 — Shadow/Vendor (ledger 22) | ch03 sau trigger | Cho thấy audit/shadow event có ID, Table Name, RowID, Timestamp, Operation (I/U/D) và được dùng để cập nhật target business table. Lab hiện chỉ hiển thị op/amount cho một đơn hàng, chưa dạy phân biệt audit row và business row. Không nối giả RowID 101/127/142 với target ID 1/2/3 như cùng identity vì nguồn không khớp. Header target “Timestamp” lại chứa email là lỗi nhãn nguồn; có thể chú thích/sửa khi diễn giải. |
| p28 — hai event topic/ba service (ledger 48) | ch05 | Service1 produce E1 → topic1; service2 consume E1 và produce E2 → topic2; service3 consume E1+E2. Giữ điểm một service vừa consumer vừa producer và một topic có nhiều application dùng. |
| p37 — 4 brokers/3 partitions (ledger 66) | ch08 | P0 replicas B1/B2/B3, leader B1; P1 B2/B3/B4, leader B2; P2 B1/B3/B4, leader B3. B1 hỏng → P0 leader B2 (giả định eligible/ISR); P1 vẫn B2, P2 vẫn B3. Broker có thể giữ leader của nhiều partition; mất broker không đồng nghĩa mọi leader đều chuyển. |

Kiểm sửa bằng cách đọc cả VI/EN từng hàng/trạng thái và so ảnh gốc. Các con số source khác đã giữ: p17 ba row và group2/final1; p31 P0–P7 phân bố lại; p33 5–10MB/s và 16 consumers; p40 7 ngày/1GB. Không bắt buộc thêm lab mới hay triển khai công cụ thật.

### Misleading / broken learning interactions

**Q3 — medium — Mũi tên ecosystem biến topology phân nhánh thành một pipeline tuyến tính.**

- Vị trí: `Lesson07Ingestion.tsx` ch04 render `c.flow` qua `ol.def-flow`; `lesson07.text.vi.ts/EN` `chapters[3].flow`; `src/styles/global.css:326`.
- Quan sát từ code/CSS: mọi item trừ cuối có `::after { content: ' →' }`. Chuỗi ch04 hiển thị cluster1 → Streams application → Sink → MirrorMaker. Hình p25 đặt Streams nối với cluster1 và MirrorMaker đi từ cluster1 xuống cluster2, còn sink là nhánh từ cluster1 đến đích. Endpoint trong text đúng nhưng mũi tên giữa các card sai ngụ ý.
- Sửa: renderer riêng có nhánh từ cluster1, hoặc bảng các edge độc lập/nhãn “các kết nối” không tự nối liên tiếp. Giữ source→Connect Source→cluster1 và cluster1→Connect Sink→target; Streams đọc/ghi cluster1; MirrorMaker cluster1→cluster2.
- Kiểm sửa: ở desktop/mobile, scroll/deck, VI/EN không còn edge Sink→MirrorMaker hay implication record bắt buộc qua Streams trước sink. Đây là defect tái lập trực tiếp từ CSS, không phải nhận xét chưa quan sát về kích thước browser.

## 4. Coverage ledger

Companion: `/Users/handonn/Workplace/AI/learn-ai-with-me/docs/courses/data-engineering-foundation/reviews/b7-coverage-ledger-initial.md`.

**75 đơn vị có nội dung:** 42 covered, 23 covered-with-correction, 6 thin, 4 missing. Không quy đổi ra phần trăm trang.

Toàn bộ gap: Q1 = bốn nhánh p28 missing; Q2 = năm ví dụ thin tại p8/11,12,13,28,37; Q3 = topology p25 thin. Các trang hành chính 1/3/20/26/41/44/45 được hạch toán riêng; agenda p2 được kiểm, Kafka’s Challenges là bridge bổ sung có gắn nhãn. Không còn phần nguồn chưa đọc; các nhãn mơ hồ ở p13/p34 được ghi rõ, không dùng để ép lesson tái tạo lỗi.

## 5. Source corrections and uncertainty

Những sửa hiện có cần giữ nguyên khi bù coverage:

- **p14 tải nguồn/rollback:** log CDC vẫn dùng tài nguyên; PostgreSQL replication slots có thể giữ WAL và gây chiếm storage. Với Debezium PostgreSQL, phát change đã commit; rollback transaction chưa commit không đương nhiên đòi target đảo một business event. [PostgreSQL 18 logical decoding, replication slots](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html); [Debezium 3.6 PostgreSQL overview/streaming](https://debezium.io/documentation/reference/3.6/connectors/postgresql.html).
- **p17 file layout:** Parquet và ORC đều columnar, ORC chia stripe. “CSV optimized for WHERE” không đủ điều kiện để thành luật; lesson đúng khi đưa index/workload vào. [Parquet overview](https://parquet.apache.org/docs/overview/); [ORC background](https://orc.apache.org/docs/).
- **p18 bảng:** “Ownership Model” thực tế gắn complex/simple; “Primary Focus” lại gắn latency. Bài đổi sang độ phức tạp truy vấn và thời gian minh họa là diễn giải hợp lý, không phải thiếu hai khái niệm ownership/focus được dạy rõ.
- **p24 version:** Kafka 4.0 chỉ KRaft; KRaft production-ready từ 3.3. Không được khôi phục câu bắt đầu thay ZooKeeper từ 4.0. [Kafka upgrading 4.0](https://kafka.apache.org/40/getting-started/upgrade/).
- **p33 throughput:** 5–10MB/s không có benchmark/điều kiện cụ thể trong nguồn; bài giữ làm estimate, không capacity guarantee. Không xác nhận số này cho deployment nào.
- **p35 producer:** Kafka4 Java default keyed hashing và unkeyed sticky/adaptive không đồng nghĩa round-robin mọi lần. Điều kiện idempotence (acks all, retries>0, in-flight≤5) bài nêu đúng. [Kafka4 producer configs, partitioner.class/enable.idempotence](https://kafka.apache.org/40/configuration/producer-configs/).
- **p23/36/37/39 delivery và durability:** nhiều broker, assignment độc quyền và producer idempotence không thay thế các điều kiện durability/processing. Kafka transaction kết hợp offsets/output; external sink cần hợp tác. [Kafka4 design, Message Delivery Semantics/Replication](https://kafka.apache.org/40/design/design/).
- **p34/40 offset và cleanup:** next committed offset khác offset vừa xử lý; control records và compaction gaps khiến offset-distance khác business-record count. Compaction không đánh lại offset; tombstone có thời hạn quan sát. [Kafka4 design, Log Compaction](https://kafka.apache.org/40/design/design/).
- **p42–43 Debezium:** giữ danh sách 10 nguồn; catalog3.6 thực sự đánh dấu Vitess/Informix incubating. Có các connector khác ngoài danh sách nhưng slide không yêu cầu toàn catalog. Snapshot và database-specific prerequisites được bài giới hạn hợp lý. [Debezium3.6 source connectors](https://debezium.io/documentation/reference/3.6/connectors/index.html).
- **p13/p34 hình nguồn mơ hồ:** không có cách chứng minh từng RowID của Shadow map tới target ID trong ảnh; không suy ra mapping mới. Hình offset có các block/mốc khó thống nhất; lesson hiện đã dùng ví dụ số nhất quán và cần giữ caveat.

Các reference đã mở trực tiếp trong review; một lần mở URL Kafka topic-configs và ORC file-layout lỗi, không dùng trang lỗi làm bằng chứng. Không xác minh compatibility matrix từng source connector hoặc chạy deployment thực tế; bài cũng không cung cấp lab triển khai.

## 6. Optional enhancements

1. **Ch02 — đặt ba layout cạnh nhau thành các ô giá trị tĩnh.** Bộ row a/b/c và group2 đã đủ nội dung bằng prose; visualization giúp nhìn phần cột được đọc. Công sức nhỏ; không cần animation. Giữ ORC/Parquet là columnar và row-group boundary. [Parquet overview](https://parquet.apache.org/docs/overview/).
2. **Ch10 — thêm tombstone vào retention fixture trong lần cải tiến sau.** Hiện prose đã dạy đúng và fixture ghi rõ không có tombstone; không phải gap nguồn. Một event key B/value null giúp so trạng thái đích khi delete marker còn/đã dọn. Công sức vừa; cần ghi điều kiện reader có thể bỏ lỡ marker. [Kafka4 design, Log Compaction guarantees](https://kafka.apache.org/40/design/design/).
3. **Tham khảo ngay cạnh các correction.** Hiện lesson nói catalog “đã đối chiếu” nhưng không cho người học link nguồn. Một khối đọc thêm nhỏ với version4.0/3.6 và các link trên làm rõ vì sao khác slide. Công sức nhỏ, không cần dài thêm narrative.

Giọng kể theo đơn hàng, chuyển cảnh sang mất dòng/crash/replay và câu hỏi về “một lần” hỗ trợ học tốt. Các lab cho khám phá counterfactual thật (key/count/group; 8 crash cases; CDC modes; retention). Các giả định toy model được nhắc rõ và trace đọc tĩnh có ích. Không yêu cầu đổi sang sách giáo khoa.

## 7. Retest checklist

- Sau sửa Q1–Q3, gửi hash/diff snapshot mới; re-review ch03/ch04/ch05/ch08 và EN tương ứng, đối chiếu p8/11/12/13/25/28/37.
- Xác nhận 10 ledger gaps đã đổi trạng thái bằng nội dung learner-visible; không chỉ thêm dữ liệu không render.
- Ch04 xác nhận topology thực tế không phát edge sai, cả mobile và deck; nếu dùng table, có header/edge labels đọc được.
- Source rows mới không biến email thành timestamp, không tạo giả mapping RowID; p37 cả replica placement và leader transition đúng.
- Chạy lại locale structural check và build do bundles/renderer/CSS có thể đổi; deterministic engine check nếu engine/UI phụ thuộc thay đổi. Không cần kiểm lại stack không tồn tại.
- Browser review riêng còn pending: trực tiếp VI/EN route, scroll/deck/hash jumps, navigation cuối bài, quiz submit/restart/persist theo namespace, 1–4 partition/consumer và Back/reset/group switching, 8 crash paths/config-reset/autoplay, CDC modes ở từng step, 4 retention policies, viewport hẹp, focus/keyboard, reduced-motion.
- Static code cho thấy controls có fieldset/legend/aria-pressed, live summaries; play ẩn khi reduced motion và hero animation được CSS tắt. Chưa xác nhận screen-reader experience hay browser focus thực tế. Locale toggle reload cố ý và có thể mất lab/quiz đang làm; saved course progress được thiết kế giữ.
- Không stamp `judged` hoặc sửa `pairs_hash`; separate i18n-fidelity review vẫn là gate khác.


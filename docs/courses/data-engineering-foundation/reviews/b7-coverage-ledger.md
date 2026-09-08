# DEF b7 — coverage ledger (focused final static review)

Đọc theo phạm vi tất cả chi tiết có nội dung học thuật trong PDF, gồm ví dụ và cơ chế trong hình. Nguồn: `/Users/handonn/Workplace/AIDE-01/slides/Lession_7_Data_Engineering_Ingestion_Layer.pdf`, 45 trang. Anchor `chNN` là DOM id; `body[n]`, `cards[n]`, `quiz[n]` dùng index 0-based trong `src/features/lessons/def/b7/lesson07.text.vi.ts`; EN có cấu trúc tương ứng. Tất cả dữ liệu chapter được renderer sử dụng.

Tổng 75 đơn vị: 51 covered, 24 covered-with-correction, 0 thin, 0 missing, 0 unverifiable. Không suy phần trăm từ số trang. Mười gap đã xác minh trực tiếp và resolved. Browser/fidelity review là phạm vi kiểm riêng.

| ID | PDF trang | Đơn vị bắt buộc | Lesson anchor/key | Status | Bằng chứng / khoảng trống |
|---|---|---|---|---|---|
| 01 | 2 | Kafka’s Challenges trong agenda, không có chương triển khai ở nguồn | ch10 body[5] | covered | Phần tổng hợp được ghi rõ bổ sung; hot key, lag, overhead, retention, schema, retry. |
| 02 | 4–6 | Nguồn: vận hành, API, tệp, third party; ingestion thu nhận và chuyển tiếp hiệu quả/tin cậy | ch01 body[0], flow | covered | Định nghĩa và vị trí trước staging. |
| 03 | 4 | Staging: ingestion, validation, biến đổi cơ bản | ch01 body[1] | covered | Trách nhiệm rõ. |
| 04 | 4 | Warehouse: raw, summary, metadata; single source of truth | ch01 body[1], flow | covered | Giữ ba loại và thêm điều kiện chất lượng. |
| 05 | 4 | Marts Purchasing/Sales/Inventory và users analytics/reporting/mining | ch01 body[2], flow | covered | Giữ miền và đối tượng sử dụng. |
| 06 | 4 | Governance: quality, security, lineage, metadata management, role access | ch01 cards[0] | covered | Giữ cả năm trách nhiệm. |
| 07 | 7 | GIGO: inaccurate/incomplete/inconsistent input | ch01 body[3] | covered | Giữ ý nghĩa đầu vào sai. |
| 08 | 7 | Nguồn chậm; CPU/memory/resource constraints | ch01 body[3] | covered | Liên hệ cạnh tranh giao dịch. |
| 09 | 7 | Volume/format quyết định CDC hoặc file integration | ch01 body[3] | covered | Giữ ví dụ CSV/log, DB CDC. |
| 10 | 8 | Phân loại file, CDC, OLTP/OLAP, logs | ch02–03 | covered | Được phát triển đầy đủ sau phần đầu. |
| 11 | 8,11 | Source DB → transaction log → CDC → Elastic/Redis/Snowflake (fan-out) | ch03 body[0] | covered | Source DB → transaction log → CDC → Elastic/Redis/Snowflake fan-out và vai trò đích đã được giải thích. Q2 resolved. |
| 12 | 9 | Định nghĩa tệp; CSV/JSON/XML/Parquet/ảnh/PDF; local/cloud | ch02 body[0] | covered | Các định dạng giữ đủ; icon trang trí không tính riêng. |
| 13 | 9 | Batch mỗi giờ/ngày vào lake/warehouse; micro-batch giảm đợi | ch02 body[0] | covered | Đủ cơ chế và nhịp. |
| 14 | 10 | Structured, semi-structured, unstructured và ví dụ/schema/khả năng phân tích | ch02 body[1] | covered-with-correction | Phân biệt định dạng với cấu trúc, tránh coi mọi file/log là phi cấu trúc. |
| 15 | 10 | Phân biệt file batch và CDC real-time | ch02 body[0], ch03 body[0] | covered-with-correction | Mô tả như mẫu phổ biến, không biến thành giới hạn tuyệt đối. |
| 16 | 11 | CDC INSERT/UPDATE/DELETE; incremental thay full scan; ba cách | ch03 body[0] | covered | Giải thích đầy đủ. |
| 17 | 12 | LAST_MODIFIED/LAST_UPDATED polling sau watermark; đơn giản | ch03 body[1] | covered | Cột đáng tin, index, watermark và giới hạn. |
| 18 | 12 | Soft delete false → true còn nhìn thấy; hard DELETE biến mất | ch03 body[1], lab.cdcHelp/missedDelete | covered | Cơ chế đúng; không yêu cầu chép tên/email trang trí. |
| 19 | 12 | Hình row ID 1122 trước/sau, timestamp thay đổi, dữ liệu còn tồn tại | ch03 figures[0] + body[1] | covered | Giữ ID1122, cả hai timestamp, false→true và row còn tồn tại; so hard delete. Q2 resolved. |
| 20 | 12 | Không có index gây scan/tải nguồn | ch03 body[1] | covered | Không hứa index luôn loại hết tải. |
| 21 | 13 | Trigger theo event/table; nhiều trigger tùy DB | ch03 body[2] | covered-with-correction | Đã giới hạn đây là thiết kế minh họa. |
| 22 | 13 | I/U/D vào bảng riêng; thêm writes, debug/cascade khó | ch03 body[2], table | covered | Cơ chế và chi phí đủ. |
| 23 | 13 | Hình Shadow Table: table name, RowID, Timestamp, Operation → Vendor target | ch03 figures[1] + body[2] | covered-with-correction | Đủ Shadow fields/3 operation rows; event ID khác business RowID; cần mapping/payload; chỉ rõ nhãn Timestamp trên email sai. Q2 resolved. |
| 24 | 14 | Log sẵn có → decoder/CDC engine → downstream; low latency | ch03 body[3], ch10 body[2] | covered | Luồng và lý do giảm tác động. |
| 25 | 14 | “No added load”, không cần schema changes | ch03 body[3–4] | covered-with-correction | Giải mã/snapshot/log retention/quyền/nhận diện dòng còn tốn tài nguyên. |
| 26 | 14 | Vendor-specific binlog/WAL/redo; schema định nghĩa | ch03 body[3] | covered | Đúng mức nguồn. |
| 27 | 14 | Rollback/undo và target reversal | ch03 body[4] | covered-with-correction | Phân biệt uncommitted rollback với compensating transaction. |
| 28 | 15 | OLTP mục đích, banking/e-commerce/ERP và thao tác vận hành | ch02 body[2] | covered | Giữ các nhóm ví dụ. |
| 29 | 15 | User → API → OLTP → Orders/Users/Payment → transaction → CDC → Kafka | ch02 body[2] | covered | Toàn bộ đường đi bằng prose. |
| 30 | 16 | OLAP lịch sử, BI/reporting/ML; nguồn/Kafka → ETL/ELT → warehouse → outputs | ch02 body[2], table | covered | Đủ đường đi, ETL/ELT đúng thứ tự. |
| 31 | 17 | Ba row (a,1,2020-01)/(b,2,2020-02)/(c,3,2020-03), layout hàng/cột | ch02 cards[0], figures[0] | covered | Giữ bộ dữ liệu và trình tự giải thích. |
| 32 | 17 | Row group size 2, final group 1 row; ORC/Parquet | ch02 cards[0], figures[0] | covered-with-correction | Parquet là columnar theo row groups, không loại ngoài columnar. |
| 33 | 17 | WHERE/predicate, SELECT/projection, workload/format | ch02 cards[1] | covered-with-correction | Không lặp khẳng định CSV tự tối ưu lọc. |
| 34 | 18 | OLAP/OLTP purpose, access, query complexity, timing, use case table | ch02 table | covered-with-correction | Đổi nhãn Ownership Model/Primary Focus gây hiểu sai thành trục rõ. |
| 35 | 19 | Logs definition, analysis/ML; system/app/error/debug/audit/security/network | ch02 body[3] | covered | Đủ sáu nhóm. |
| 36 | 19 | Docker containers, servers, IoT log sources | ch02 body[3] | covered | Đủ ví dụ hình. |
| 37 | 21 | Production orders, daily analytics/marketing/fraud exports, DB slowdown/delays/integration complexity | ch04 lead/body[0] | covered | Động cơ truyện giữ nguồn. |
| 38 | 22 | Kafka distributed streaming: publish/store/process real-time | ch04 body[1] | covered | Không nhầm broker tự chạy logic Streams. |
| 39 | 22 | Use cases database/cache/microservices/lake/search/ML/monitoring/analytics/web/IoT | ch04 body[2] | covered | Giữ cả nhóm hình. |
| 40 | 23 | 3 producers push; cluster 3 brokers, topics A/B/C P0/1; 3 consumers pull | ch04 body[1], ch05 | covered | Miêu tả topology đủ, phân biệt vai trò. |
| 41 | 23 | Nhiều brokers “never loses data” | ch04 body[1], ch08 | covered-with-correction | Cần replication và điều kiện độ bền. |
| 42 | 24 | Source/core/target và ZooKeeper coordination cũ | ch04 body[3] | covered | Dữ liệu không đi xuyên ZooKeeper. |
| 43 | 24 | KRaft thay ZooKeeper “since 4.0” | ch04 body[3] | covered-with-correction | 4.0 bỏ ZooKeeper; KRaft có trước. |
| 44 | 25 | Connect Source/cluster1/Sink/target; worker vs broker | ch04 cards[0], flow | covered | Vai trò đúng trong prose. |
| 45 | 25 | Streams thư viện ứng dụng; MirrorMaker cluster1 → cluster2; DR/distribution | ch04 cards[1] | covered | Prose đúng và phân biệt inter-cluster với replica. |
| 46 | 25 | Hình nhánh Streams/MirrorMaker từ cluster1, sink là nhánh riêng | ch04 flow + page ecosystem branch | covered | Main flow[0,1,3]; Streams/MirrorMaker thành edge cards độc lập, không có inter-card arrow. Q3 resolved. |
| 47 | 27 | Sáu core terms topic/partition/offset/producer/consumer/broker | ch05 body/table | covered | Định nghĩa và ví dụ rõ. |
| 48 | 28 | Topic logical category; event user_created/domain orders/environment dev-test-prod | ch05 body[0] | covered | Không coi tên prod là security boundary. |
| 49 | 28 | Service1 produces E1; Service2 consumes E1/produces E2; Service3 consumes E1+E2; hai topic | ch05 figures[0] | covered | Đủ 3 service/2 topic E1,E2 và roles; Q2 resolved. |
| 50 | 28 | Một cluster: global event hub/lower ownership cost/no technical constraints | ch05 figures[1] | covered | Shared cluster/global hub/cost/no technical constraint; có điều kiện. Q1 resolved. |
| 51 | 28 | Multiple clusters: operational decoupling → maintainability/workload criticality/regulatory compliance | ch05 figures[1] | covered | Operational decoupling gồm maintainability/criticality/regulatory compliance, có diễn giải vận hành. Q1 resolved. |
| 52 | 28 | Multiple clusters: tenant isolation → resource isolation/security boundary/logical decoupling | ch05 figures[1] | covered | Tenant resource/security/logical isolation; CPU/network, ACL/quota và cluster riêng. Q1 resolved. |
| 53 | 28 | Multiple clusters: use-case optimization → fine-tuning/data locality/domain ownership/purpose-built | ch05 figures[1] | covered | Use-case fine-tuning/locality/purpose-built/domain ownership có diễn giải. Q1 resolved. |
| 54 | 29 | Partition subdivision, ordered append log, scaling/throughput/parallelism | ch05 body[1] | covered | Có giới hạn thứ tự cục bộ. |
| 55 | 30 | P0/P1/P2 → consumer A/B/C độc lập | ch06 body[0], RoutingLab | covered | Prose và assignment lab tương ứng. |
| 56 | 31 | Máy1 P0–P7 → máy1 P0–P3/máy2 P4–P7 | ch06 body[0], table | covered | Giữ toàn số partition; bổ sung reassignment không tự động. |
| 57 | 32 | Một queue/reader vs nhiều partition/readers throughput | ch06 body[0] | covered | Giữ cơ chế, không hứa tăng vô hạn. |
| 58 | 33 | 5–10 MB/s mỗi partition và điều kiện throughput | ch06 body[1] | covered-with-correction | Giữ con số dưới nhãn estimate chưa benchmark. |
| 59 | 33 | 16 consumers cần ≥16 partitions; broker/controller overhead | ch06 body[1] | covered | Giữ ví dụ số và đánh đổi. |
| 60 | 34 | Offset local, track/resume/replay; position vs log end, lag | ch06 body[3], quiz[3] | covered-with-correction | Mốc next offset rõ, ví dụ 5−2=3; hình nguồn có nhãn/mốc mơ hồ. |
| 61 | 34 | Control records chiếm offset; lag không đồng nghĩa số data messages | ch06 body[3] | covered-with-correction | Giữ ý riêng của hình control record, không chép mốc minh họa lỗi. |
| 62 | 35 | Producer topic/partition/reliability; keyed partition ordering | ch05 body[2], ch06 body[2], RoutingLab | covered-with-correction | Điều kiện serializer/partitioner/count, toy hash rõ. |
| 63 | 35 | No-key distribution; hình A/B/C vào P0/P1/P2 | ch06 body[2], RoutingLab unkeyed | covered-with-correction | Round-robin minh họa, không gán làm mặc định Kafka4 Java. |
| 64 | 36 | Consumer group: mỗi partition tối đa một member; parallel/scale | ch07 body[0–1], RoutingLab | covered | 2 partition/2 consumer từ slide biểu diễn được bằng lựa chọn lab. |
| 65 | 36 | “No duplicate processing inside group” | ch07 body[2], CrashLab | covered-with-correction | Assignment không chặn replay/tác động lặp. |
| 66 | 37 | Replication factor, leader/followers, ISR, failover | ch08 body[0–3], table | covered-with-correction | Giới hạn read leader, ISR và durability đúng. |
| 67 | 37 | 4 brokers/3 partitions: leaders P0@B1,P1@B2,P2@B3; B1 down → P0@B2, các leader khác giữ | ch08 figures[0] + body[1] | covered | Đủ 4 broker/3 partition replica placement; P0 B1→B2, P1/P2 leader giữ. Q2 resolved. |
| 68 | 38 | At-most/at-least/exactly once: mất/lặp/one effect | ch09 body, table, CrashLab | covered-with-correction | Phân biệt tầng và ranh giới. |
| 69 | 39 | At-most: producer no ack; consumer commit-before; telemetry/log use case | ch08 body[2], ch09 body[0] | covered-with-correction | Không coi acks0 một mình là guarantee end-to-end. |
| 70 | 39 | At-least: ack/retry; process-before-commit, crash replay | ch09 body[1], CrashLab | covered-with-correction | Không hứa default mọi client. |
| 71 | 39 | Sai label exactly-once; acks all+idempotence không đủ; acks1/all meaning | ch08 body[2], ch09 body[2–3], quiz | covered-with-correction | Transaction offsets+output, read_committed, external sink boundary. |
| 72 | 40 | Retention time7days/size1GB per partition; độc lập reading | ch10 body[0], CdcLab retention | covered | Giữ cấu hình nguồn; lab 2MB được ghi riêng. |
| 73 | 40 | Compaction latest per key; immutable offsets | ch10 body[1], retainedLog | covered | Cleaner/segment, tombstone và compact+delete được chú thích. |
| 74 | 42 | Debezium open-source row CDC; log/replication, common envelope | ch10 body[2] | covered-with-correction | Snapshot và database-specific semantics tránh universal claim. |
| 75 | 43 | 10 source names; source connector → Kafka → sink connector → target | ch10 body[3–4], flow | covered-with-correction | Giữ danh sách, Debezium3.6 incubating xác minh; không gán mọi sink cho Debezium. |

## Trang hành chính và giới hạn nguồn

- Trang 1,45: bìa/cảm ơn; ngoài mẫu số kiến thức.
- Trang 2: agenda được hạch toán qua các chương; riêng Kafka’s Challenges là đơn vị 01, không có instruction sâu trong PDF.
- Trang 3,20,26,41: agenda/section divider lặp lại chủ đề đã hạch toán; ngoài mẫu số, không thiếu kiến thức.
- Trang 44: hai liên kết tham khảo (Docker Hub; GKE hybrid architecture). Không có yêu cầu triển khai hoặc nội dung tài liệu linked trong slide; không mở rộng phạm vi sang toàn hai tài liệu.
- Hình icon file, thương mại điện tử, logo Kafka/Debezium, tên/email cá nhân minh họa không tạo đơn vị kiến thức mới. Không bắt buộc chép pixel hoặc văn phong slide.
- Trang 13: ảnh gốc có RowID shadow 101/127/142 nhưng ID target 1/2/3; không suy rằng từng hàng mapping chính xác. Khi khôi phục ví dụ cần nói rõ hình chỉ minh họa cơ chế, không phát minh join sai.
- Trang 34: hình control có vùng đỏ/mốc end không hoàn toàn rõ; bản lesson dùng next-position convention có giải thích là sửa đúng.


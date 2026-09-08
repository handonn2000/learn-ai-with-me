# DEF Week 7 / b7 — Focused final lesson-quality review

## 1. Verdict

**PASS — nội dung/coverage và mô hình tĩnh trong phạm vi đã kiểm.** Q1, Q2, Q3 đã resolved. Không còn đơn vị nguồn thin/missing hay lỗi kỹ thuật trọng yếu đã xác nhận. Đây không phải chứng nhận chạy Kafka/DB thật, và không thay cho browser/fidelity gate độc lập.

Nguồn vẫn là toàn bộ 45 trang `Lession_7_Data_Engineering_Ingestion_Layer.pdf`; giữ phạm vi tất cả nội dung học thuật, bao gồm cơ chế/ví dụ trong hình. Full VI review ban đầu cộng focused review revision này bao phủ 75 đơn vị: **51 covered, 24 covered-with-correction, 0 thin, 0 missing, 0 unverifiable**.

## 2. Review manifest

- Course `data-engineering-foundation`, lesson `b7`, route `/courses/data-engineering-foundation/lessons/b7`.
- Nguồn: `/Users/handonn/Workplace/AIDE-01/slides/Lession_7_Data_Engineering_Ingestion_Layer.pdf`, 45 trang; SHA-256 `46bdac417ae017ca0bc8e84957f61a9cf309c108018fa88bfdb9d29b785d021a`.
- Lần đầu: đọc toàn bộ extraction, contact sheets đủ 1–45; ảnh lớn p12/13/17/28/34/35/37; toàn bundle VI, EN correctness-sensitive, renderer/engine và các shared imports liên quan. Chi tiết manifest/citations/history tại `quality-report.md`.
- Lần này: đọc tất cả sáu figure blocks mới VI/EN; đọc lại body/cards/table ch03/ch04/ch05/ch08, CDC fan-out, lời sửa “data types” ch10 EN, toàn page mới, toàn IngestionLabs mới, CSS DEF thay đổi; đối chiếu lại các cơ chế p8/11/12/13/17/25/28/37. Source figure evidence không đổi.
- Renderer `c.figures.map` thực sự đưa title/text/header/rows ra semantic figure/table, không có dữ liệu coverage bị bỏ trong bundle. Ch04 main flow chỉ dùng index0/1/3; Streams/MirrorMaker thành card độc lập.
- Locale scope: full VI coverage từ lần đầu; EN của các claim nhạy cảm/quiz/lab đã kiểm ban đầu, và toàn bộ additions lần này đọc song song VI/EN. Không đóng fidelity gate, không sửa pairs_hash.
- Tự chạy lại `node scripts/check-def-b7.mjs`: **5 checks pass**. Engine hash không đổi; giữ bằng chứng 8 crash cases, routing 1–4 partitions/có-không key/group độc lập, CDC và retention từ review đầu. Thêm speed chỉ đổi timeout 1600/speed (0.5/1/2×), không đổi trace.
- Caller báo build pass; reviewer không chạy lại build. Không sửa project hay khởi chạy service/stack.

### Artifact identity sau sửa

| Tệp | SHA-256 |
|---|---|
| IngestionLabs.tsx | e2917994956d098a853b376c680e97fe80d2d38116ef21b61ef227f50b43cb76 |
| Lesson07Ingestion.tsx | 833f6e04f790be9ff355fd658f1ab1e80001faa07771be8c512370c2efddb112 |
| ingestion-engine.ts | 678477c2c5c94822e55ad2b9a16a9cad265c96646b6c4407b2c105290e3e6552 |
| lesson07.text.vi.ts | cab815671cab543815913020f1a77a776c5175b782756c4fc2386945c29dcee7 |
| lesson07.text.en.ts | b68cb07e9622399c3e13c8ffdd3bdd97f5326f55c2bd9bf9e4832863c9e2a9e7 |
| lesson07.text.ts | 251fedbe77054b79656220d861f0b4d8eb1585e58d0e8a506b348095aa486624 |
| src/styles/global.css | 66f240c942c21028a1896cd0d14b6bb5c5f6537ddafa7705bed965e2de5f8695 |
| src/components/SessionQuiz.tsx (unchanged) | b3364b7518c7e2ac2a94c3a578176530fa7ff57fe5b81279f3a5fd4cda2d948f |
| src/components/LessonDeck.tsx (unchanged) | 2db3b2f22f5141a94422d1124c5b3d17f40736fa6d9667e1d19e4ecffcd31dc3 |
| src/App.tsx (unchanged) | c6dd5aeef96468130d94f7ace9d1e3d66336630a05ad3052922748d2b89e539f |

Tệp lesson ở bảng trên đều nằm dưới `src/features/lessons/def/b7/` nếu không ghi path khác.

### Browser evidence và giới hạn

Đã đọc **caller-produced** `/tmp/def-b7-review/browser-results.json`: report nêu anchors, routing/groups/back/reset, 8 crash cases, CDC/retention, quiz100% lưu DEF và không đổi sentinel AI, reload/locale persistence, VI390px không document overflow, deck và roadmap route; errors=[]; isolated context 1440×1000/390×844. Reviewer **không tự thao tác browser hoặc tự chạy các assertions này**. JSON không ghi hash/build ID, vì vậy evidence là quan sát của caller ở preview trong phiên này, không chứng nhận tự động đúng mọi hash sau sửa.

Reviewer tự xem ba screenshot do caller tạo: `crash-desktop.png`, `mobile-vi.png`, `cdc-mobile-vi.png`. Các phần nhìn thấy bố trí rõ, text/control đọc được, không thấy content chồng nhau hoặc tràn ngang; ảnh mobile bị cắt dọc đúng viewport, không chứng minh phần dưới. Ảnh crash cho thấy reduced-motion vẫn có step controls. Không có screenshot của các figure mới, không suy visual QA toàn trang từ ba ảnh.

Caller còn kiểm console warnings, light theme, normal-motion play/pause. Screen-reader/live-region experience và keyboard full journey không được reviewer này xác nhận. Bộ gate browser/fidelity do caller quản lý cần giữ rõ trạng thái.

## 3. Required fixes và trạng thái findings

**Required fixes còn mở: None.**

| Finding | Status | Bằng chứng đã kiểm |
|---|---|---|
| Q1 — p28 one/multiple clusters | Resolved | ch05 figures[1] giữ đủ shared cluster và ba nhánh operational/tenant/use-case cùng mọi leaf chính; có diễn giải CPU/network cạnh tranh, ACL/quota, maintenance/failure/compliance, locality và ownership; không hứa cluster riêng luôn rẻ/an toàn. |
| Q2 — original examples | Resolved | ch03 body[0] fan-out Elastic/Redis/Snowflake; figures[0] ID1122 với hai timestamp/soft-delete; figures[1] Shadow fields và 3 rows; ch05 figures[0] E1/E2/3 services; ch08 figures[0] 4 brokers/3 partitions/failover. Cả VI/EN đúng. |
| Q3 — wrong ecosystem arrows | Resolved | Page dùng main source→cluster1→sink path; Streams↔cluster1 và MirrorMaker1→2 là card độc lập không bị selector .def-flow li thêm inter-card arrow. |
| Q4 — newly introduced duplicate React row key | Resolved during re-review | Ban đầu mới thêm figure softdelete có hai row ID1122 nhưng key=row[0]. Reviewer báo riêng; current page line37 đổi static figure rows sang key=rowIndex. Không còn duplicate key đó. Đây là lỗi renderer nhỏ mới, không phải lỗi CDC content. |

Sửa Q2 cũng làm rõ lỗi nguồn p13: event ID khác business RowID, pipeline cần mapping/payload; nhãn Timestamp trên email không phải dữ liệu thời gian. Không còn suy diễn mapping 101/127/142 → 1/2/3. Sơ đồ p37 có đúng replica subsets; sau B1 hỏng chỉ P0 leader chuyển B2, P1 vẫn B2/P2 vẫn B3 trong giả định election đã nêu ở prose.

## 4. Coverage ledger

Full final ledger: `/Users/handonn/Workplace/AI/learn-ai-with-me/docs/courses/data-engineering-foundation/reviews/b7-coverage-ledger.md`; 75 đơn vị, 51 covered/24 covered-with-correction. Không thay mẫu số để nâng verdict.

10 đơn vị được đổi trạng thái: **11,19,23,46,49,50,51,52,53,67**. Trong report ban đầu, một số tham chiếu số ledger của Q1/Q2 bị lệch một vị trí; source page và nội dung mô tả đúng. Danh sách ở đây và final ledger là ID chuẩn: Q1=50–53; Q2=11/19/23/49/67; Q3=46. Đây là đính chính clerical của reviewer, không thay đổi nội dung finding.

Ch02 figures[0] thêm biểu diễn vật lý tĩnh cho đơn vị đã covered p17; không tạo yêu cầu mới. Tất cả trang administrative/reference đã hạch toán trong ledger; Kafka’s Challenges agenda vẫn được nối bằng phần bổ sung có nhãn rõ.

## 5. Source corrections and uncertainty

Giữ các sửa quan trọng của lesson; không có yêu cầu trở về phát biểu sai của slide:

- Kafka4.0 bỏ ZooKeeper, KRaft tồn tại trước4.0. [Kafka4 upgrade](https://kafka.apache.org/40/getting-started/upgrade/).
- acks/idempotence/partitioning có điều kiện; Java producer4 dùng sticky/keyed logic theo cấu hình. [Kafka4 producer configs](https://kafka.apache.org/40/configuration/producer-configs/).
- Delivery/external effects cần boundary; group assignment không loại replay. Compaction không đánh lại offset và delete marker có thời hạn. [Kafka4 design](https://kafka.apache.org/40/design/design/).
- Log CDC không miễn phí; committed stream không biến uncommitted rollback thành target event. [PostgreSQL logical decoding](https://www.postgresql.org/docs/current/logicaldecoding-explanation.html); [Debezium3.6 PostgreSQL](https://debezium.io/documentation/reference/3.6/connectors/postgresql.html).
- ORC/Parquet columnar, không coi CSV là tự tối ưu WHERE. [ORC](https://orc.apache.org/docs/); [Parquet](https://parquet.apache.org/docs/overview/).
- Multi-tenancy có namespaces/security/quotas; tách topic và tách cluster khác mức. Phần mới phù hợp với các điều kiện này. [Kafka4 multi-tenancy](https://kafka.apache.org/40/operations/multi-tenancy/).
- Debezium3.6 catalog đánh dấu Vitess/Informix incubating; lesson không nhận tất cả connector cùng deployment/support. [Debezium3.6 catalog](https://debezium.io/documentation/reference/3.6/connectors/index.html).

Uncertainty vẫn như ban đầu: 5–10MB/s không có benchmark, được ghi là estimate; p13 không chứng minh exact target RowID mapping; p34 hình offset mơ hồ được thay bằng next-offset example rõ. Không còn unresolved material claim trong phạm vi lesson lý thuyết/toy models. Không xác nhận compatibility DB connector thật hoặc performance production.

## 6. Optional enhancements

- **Ch10 tombstone fixture** vẫn hữu ích nhưng không bắt buộc: prose đã dạy và lab nói rõ chưa có tombstone. Có thể thêm để nhìn reader chậm bỏ lỡ delete marker; cần giữ điều kiện retention. Công sức vừa. [Kafka log compaction](https://kafka.apache.org/40/design/design/).
- **Link tài liệu cạnh corrections** giúp người học đối chiếu phiên bản/source error. Công sức nhỏ; dùng các primary reference ở trên.
- Đề xuất ban đầu về row-layout visualization đã được thực hiện bằng bảng chuỗi giá trị; không còn phải bổ sung.

Giọng documentary vẫn giữ: theo đơn hàng, đến dòng biến mất, broker lỗi và cửa sổ commit. Các figure mới bổ sung bằng chứng đọc tĩnh, không làm mất vai trò khám phá của ba lab.

## 7. Retest checklist

- Caller hoàn tất browser console warning sau rowIndex fix và ghi snapshot/build identity; kiểm light theme, play/pause/speed0.5/1/2 và reset trong normal motion.
- Xem trực tiếp các figure p12 nhiều cột ở mobile: wrapper cuộn ngang có chủ ý; text caption/schema cần đọc được. Kiểm ch04 main flow và hai nhánh cả scroll/deck.
- Separate fidelity judge kiểm các string/figures additions và “data types” correction theo gate của dự án. Reviewer này không stamp gate.
- Nếu chỉ còn sửa UI không đụng content/engine, không cần lặp full75-unit source audit; kiểm affected rendering và hash. Nếu đổi con số/topology/claim phải recheck source unit tương ứng.


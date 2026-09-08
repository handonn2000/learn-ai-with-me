# Phần III & IV — kịch bản thiết kế bài học

Trạng thái: duyệt dàn ý, trước triển khai · 2026-09-07

Sáu bài, 396 trang nguồn, 60 chương và 18 thiết kế tương tác. Đây là kế hoạch viết/triển khai để duyệt, chưa phải bài học hoàn chỉnh. Yêu cầu mới mở rộng phạm vi foundation ban đầu: mọi chi tiết kiến thức trên slide đều thuộc phạm vi, kể cả mục nâng cao, code trong ảnh và chủ đề mới có tên trên agenda. Bìa/trang phân mục/tài liệu tham khảo/kết thúc được ghi riêng trong bản đồ trang.

Giọng kể: lời dẫn phim tài liệu bằng văn bản, không mặc định tạo audio. Pipeline bán lẻ giả lập nối mạch; ví dụ kỹ thuật gốc được giữ khi có ý riêng cần dạy. Nhịp: cảnh → cơ chế → ví dụ soi kỹ → sự cố/đánh đổi → nối chương sau. Các đoạn mở bên dưới là mẫu giọng, chưa phải toàn bộ bài.

Giao diện: chế độ cuộn/trình chiếu hiện có; navigation/nhãn/lời kể/chú giải code/feedback song ngữ; giải thích HTML tìm được, bảng/code dễ đọc, sơ đồ SVG/HTML, điều khiển bàn phím, responsive và chế độ giảm chuyển động. Animation có trạng thái đầu có nghĩa, hỗ trợ dừng/lùi/tiến/reset. Simulation có nhãn rõ, không giả vờ chạy cluster thật.

Thẻ chuẩn bị dùng `#toan`; chương dùng `#ch01`…`#ch10` ổn định; tiếp theo là tổng kết, tự kiểm, quiz củng cố và thực hành. Bao phủ đủ nguồn có thể làm chương dài: mở rộng mục con/cảnh trình chiếu thay vì xóa nội dung để ép độ dài.

Ước lượng khóa cũ 72–96 giờ là baseline, chưa được kiểm lại cho phạm vi mở rộng này. Ước lượng lại sau triển khai; không ngụ ý có thể làm chủ 396 trang qua sáu lượt đọc ngắn.

## 07 · Ingestion — hành trình bắt đầu

**Nguồn:** `Lession_7_Data_Engineering_Ingestion_Layer.pdf` · 45 trang. **Route:** `/courses/data-engineering-foundation/lessons/b7`.

**Chuẩn bị / #toan:** Đọc INSERT/UPDATE/DELETE và một JSON nhỏ. Ôn dãy có thứ tự (offset), key, throughput so với latency, sự cố/retry: phân biệt vị trí sự kiện với việc tác động đã được commit. Mục source system làm cầu nối khi bài 1–6 chưa được viết.

**Mẫu lời dẫn mở màn**

Ở quầy thanh toán, một đơn hàng trở thành một dòng dữ liệu. Ở nơi khác, analyst chờ doanh thu, dịch vụ kho chờ số lượng, hệ thống chống gian lận chờ một tín hiệu. Ba nơi nhận, một cơ sở dữ liệu đang bận. Tôi sẽ theo đơn hàng ra khỏi cơ sở dữ liệu ấy. Bạn sẽ thấy việc chuyển một bản ghi mới chỉ là khởi đầu; giữ đúng ý nghĩa của nó qua chậm trễ và sự cố mới là phần việc còn lại.

### Dàn chương

**01 · Đơn hàng rời hệ thống nguồn** · Trang PDF 4-7 · `#ch01`

Theo đơn hàng qua nguồn → staging → warehouse → data mart → người dùng. Giải thích dữ liệu thô, tổng hợp, metadata; chất lượng, bảo mật, lineage, quản lý metadata và quyền truy cập xuyên suốt. Nối chất lượng nguồn, CPU/RAM, tốc độ trích xuất, dung lượng và định dạng với thiết kế ingestion.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**02 · Mỗi nguồn chạy theo một nhịp** · Trang PDF 8-10,15-19 · `#ch02`

Tệp CSV, JSON, XML, Parquet, ảnh, PDF; lưu cục bộ/cloud; batch và micro-batch; dữ liệu có cấu trúc, bán cấu trúc, phi cấu trúc. So sánh mục đích, thao tác, cách truy cập, ví dụ độ trễ OLTP/OLAP và ETL/ELT. Vẽ lại lưu theo hàng/cột/hybrid; giải thích log hệ thống, ứng dụng, debug, audit, bảo mật, mạng từ container, server và IoT.

**Dạng trình bày:** Bảng so sánh cùng bản ghi minh họa và lời giải thích.

**03 · Bắt lấy thay đổi, kể cả bản ghi bị xóa** · Trang PDF 11-14 · `#ch03`

So sánh polling theo timestamp, trigger và CDC đọc transaction log với INSERT/UPDATE/DELETE. Đi qua index LAST_MODIFIED, soft delete, ghi audit table, bảo trì trigger dây chuyền, định dạng log và ranh giới transaction. Giữ phân tích tải lên nguồn; sửa khẳng định CDC đọc log không tạo thêm tải.

**Dạng trình bày:** Bảng so sánh cùng bản ghi minh họa và lời giải thích.

**04 · Một sự kiện, nhiều nơi nhận** · Trang PDF 20-25 · `#ch04`

Trở lại cơ sở dữ liệu thương mại điện tử quá tải. Giải thích producer đẩy, consumer kéo, broker/cluster; Kafka core so với Connect source/sink, Streams và MirrorMaker giữa hai cluster. Giữ vai trò lịch sử của ZooKeeper, thêm phân biệt KRaft đã xác minh; diễn giải các nhánh ứng dụng trong hình nguồn.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**05 · Topic tách thành những làn song song** · Trang PDF 26-29 · `#ch05`

Định nghĩa đủ sáu thuật ngữ topic, partition, offset, producer, consumer, broker. So sánh cách đặt topic theo sự kiện, miền nghiệp vụ và môi trường. Minh họa append log có thứ tự trong từng partition; phân biệt với thứ tự toàn cục.

**Dạng trình bày:** Sơ đồ trước/sau cùng thẻ giải thích cơ chế.

**06 · Thêm làn không đồng nghĩa tốc độ miễn phí** · Trang PDF 30-35 · `#ch06`

Giải thích reader độc lập, phân phối partition giữa broker, throughput và chi phí controller. Giữ ví dụ 16 consumer/16 partition; đánh dấu 5–10 MB/s là ước lượng của nguồn cần bối cảnh. Theo offset, vị trí consumer, cuối log, lag, replay/resume và định tuyến có/không key với điều kiện client/phiên bản.

**Dạng trình bày:** Bảng so sánh cùng bản ghi minh họa và lời giải thích.

**07 · Các consumer chia nhau công việc** · Trang PDF 36 · `#ch07`

Minh họa chia partition trong cùng consumer group, tiến độ độc lập giữa các group, tính song song và consumer rảnh khi số reader vượt số partition. Giải thích vì sao một partition chỉ có một consumer phụ trách vẫn không loại bỏ bản ghi trùng do retry.

**Dạng trình bày:** Trình phát từng bước cùng bảng trace HTML luôn đọc được.

**08 · Một broker biến mất** · Trang PDF 37 · `#ch08`

Theo replication leader/follower, replication factor, ISR và bầu leader khi lỗi. Nối độ bền với acknowledgment, tình trạng replica và cấu hình; dựng lại hình sự cố mà không hứa dữ liệu luôn được bảo toàn vô điều kiện.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**09 · Sự cố giữa xử lý và commit** · Trang PDF 38-39 · `#ch09`

So sánh at-most-once, at-least-once và exactly-once bằng timeline sự cố. Giải thích acks=0/1/all, retry, commit trước/sau xử lý, producer idempotence và ranh giới transaction. Sửa tiêu đề bị lặp; phân biệt chống trùng trong log với tác động exactly-once ở hệ thống bên ngoài.

**Dạng trình bày:** Tình huống sự cố, cây quyết định và các lựa chọn có giải thích.

**10 · Log lưu dấu; Debezium chuyển ngữ** · Trang PDF 40-43 · `#ch10`

So sánh retention theo thời gian, dung lượng và compaction; giữ ví dụ 7 ngày/1 GB mỗi partition dưới dạng cấu hình minh họa. Theo database log → Debezium → Kafka → sink. Giải thích chuyển đổi binlog/WAL/redo và giữ danh sách connector nguồn kèm lưu ý phiên bản/hỗ trợ.

**Dạng trình bày:** Trình phát từng bước cùng bảng trace HTML luôn đọc được.

### Kịch bản tương tác

Fixture và kết quả số bên dưới là ví dụ dạy học đề xuất; không khẳng định chúng nằm trong slide nguồn.

**1. Lab định tuyến và consumer group**

Chọn có/không key, số partition và consumer. Cho sáu sự kiện đi từng bước qua log; đổi group và xem offset riêng. Với 3 partition và 4 consumer trong group minh họa, một consumer rảnh. Định tuyến key dùng toy hash được ghi rõ, không giả vờ mô phỏng mọi Kafka client.

**2. Timeline crash và replay**

Chọn commit trước/sau, gây crash trước xử lý hoặc sau tác động, rồi phục hồi. Fixture: số dư 0, event +10. Crash sau tác động trước commit tạo 20 khi replay không bảo vệ; sink idempotent giữ 10. Toàn bộ trace event/commit/tác động hiện bằng bảng.

**3. So CDC và log được giữ lại**

Áp insert/update/hard-delete lên bảng nhỏ, so kết quả timestamp/trigger/log. Đổi retention thời gian/dung lượng/compaction để thấy lịch sử còn lại. Không đồng nhất đọc với xóa bản ghi, không mô phỏng compaction thành xóa đồng bộ tức thì.

**Các con số cần giữ:** 16 consumer cần ít nhất 16 partition để cùng làm việc trong group minh họa; ước lượng 5–10 MB/s của nguồn cần nhãn workload; so sánh ví dụ retention 7 ngày và 1 GB/partition; phân biệt 3 delivery semantics.

**Đích tự kiểm và thực hành:** Giải thích hard delete có thể biến mất khỏi timestamp polling; chia partition cho consumer; tìm thời điểm crash tạo bản ghi trùng; phân biệt Kafka retry với trừ tiền hai lần bên ngoài; thiết kế một CDC event contract.

## 08 · Storage — tạo ký ức cho dữ liệu

**Nguồn:** `Lession_8_Data_Engineering_Storage_Layer.pdf` · 59 trang. **Route:** `/courses/data-engineering-foundation/lessons/b8`.

**Chuẩn bị / #toan:** Ôn path, ID, metadata, hàng/cột và đơn vị độ trễ. Giới thiệu entity/relationship/schema, retention: chúng giải thích vì sao file còn tồn tại nhưng ý nghĩa đã mất. Không cần giải tích.

**Mẫu lời dẫn mở màn**

Đến sáng, các đơn hàng đã tới nơi. Hàng nghìn file nằm an toàn trong kho, nhưng analyst vẫn chưa trả lời được doanh thu hôm qua. Một file không có người phụ trách. Một file mang schema khác. File thứ ba là bản trùng. Tôi sẽ lần theo cách những byte đã lưu trở thành bản ghi đáng tin. Bạn sẽ thấy sự thay đổi ấy đi qua mô hình, metadata và quy tắc chuyển tầng.

### Dàn chương

**01 · Cùng những byte dữ liệu, những nơi lưu khác nhau** · Trang PDF 3-10 · `#ch01`

Giải thích vì sao lưu trữ biến thông tin được ghi lại thành tài sản dùng được. So sánh file hierarchy/path/NAS, block ID/disk/SAN và object ID/metadata/data/bucket. Giữ mọi trục so sánh: metadata, cấu trúc, độ trễ, mở rộng, sửa đổi, chi phí và ứng dụng; nêu điều kiện workload.

**Dạng trình bày:** Bảng so sánh cùng bản ghi minh họa và lời giải thích.

**02 · Bộ nhớ mua tốc độ, không mua sự vĩnh viễn** · Trang PDF 11-13 · `#ch02`

Vẽ lại thang độ trễ, phân biệt bậc độ lớn minh họa với số đo. So sánh Redis, Memcached, Hazelcast theo độ trễ, partitioning, kiểu dữ liệu, bối cảnh hiệu năng, snapshot, replication, pub/sub và ứng dụng. Giải thích đánh đổi dung lượng và độ bền của cache.

**Dạng trình bày:** Bảng so sánh cùng bản ghi minh họa và lời giải thích.

**03 · Tìm các block giữa nhiều máy** · Trang PDF 14-16 · `#ch03`

Theo yêu cầu metadata đến NameNode và đọc dữ liệu tại DataNode; block, quyền, vị trí replica, heartbeat, block report và rack. Phân biệt ví dụ 64 MB của nguồn với mặc định theo phiên bản đã kiểm. Giải thích streaming/tiered storage, tải đọc lịch sử, sink offload; so sánh quyền sở hữu/vòng đời của source system và storage.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**04 · Dữ liệu đã lưu chưa thành sự thật thống nhất** · Trang PDF 17-24 · `#ch04`

Giải thích warehouse/SSOT và luồng data model → dataset có quan hệ → quyền truy cập → báo cáo. So sánh conceptual, logical, physical theo mục đích, trọng tâm, đối tượng và ví dụ customer/order; physical có kiểu dữ liệu, key và constraint theo hệ quản trị.

**Dạng trình bày:** Bảng so sánh cùng bản ghi minh họa và lời giải thích.

**05 · Tạo hình mô hình theo câu hỏi** · Trang PDF 25-26 · `#ch05`

Định nghĩa phép đo ở fact và thuộc tính mô tả ở dimension. Vẽ star và snowflake chuẩn hóa với subdimension. Giải thích join, lặp dữ liệu và khả năng dùng cho phân tích; nối tới phần đào sâu mô hình ở bài 11.

**Dạng trình bày:** Sơ đồ trước/sau cùng thẻ giải thích cơ chế.

**06 · Data lake giữ lại nhiều khả năng** · Trang PDF 27-31 · `#ch06`

Bao quát định dạng gốc, nhiều kiểu dữ liệu, mở rộng ngang, schema-on-read và giữ raw. Theo ETL tới ML/báo cáo; so sánh lake/warehouse về kiểu, định dạng, schema, chi phí, ứng dụng và hiệu năng. Giải thích cầu nối Delta Lake mà không khẳng định warehouse tuyệt đối không xử lý được dữ liệu bán cấu trúc.

**Dạng trình bày:** Sơ đồ trước/sau cùng thẻ giải thích cơ chế.

**07 · Data lake trở thành đầm lầy** · Trang PDF 32-40 · `#ch07`

Giải thích riêng từng nguyên nhân: thiếu metadata, governance, chất lượng, owner/steward, tài liệu schema và công cụ. Nối với khó tìm dữ liệu, trùng lặp, lãng phí lưu trữ, chậm phân tích, quyết định thiếu tin cậy và rủi ro tuân thủ; ví dụ tuân thủ không phải hướng dẫn pháp lý.

**Dạng trình bày:** Tình huống sự cố, cây quyết định và các lựa chọn có giải thích.

**08 · Mỗi dataset có người phụ trách và dấu vết** · Trang PDF 41-48 · `#ch08`

Bao quát catalog tự động (Glue, Atlas, Amundsen), RBAC/lineage, profiling (GX, Monte Carlo), vùng raw/cleansed/curated, schema evolution Avro/Delta, contract, tag tìm kiếm, giám sát Airflow/OpenLineage, cảnh báo độ mới/sự cố, retention và archive/delete.

**Dạng trình bày:** Bảng so sánh cùng bản ghi minh họa và lời giải thích.

**09 · Một nền tảng cho nhiều kiểu phân tích** · Trang PDF 49-51 · `#ch09`

Đi theo hình lakehouse từ nguồn có cấu trúc/phi cấu trúc/streaming qua độ tin cậy của bảng, schema và versioning tới SQL/BI, ML, rồi analyst, nhóm nghiệp vụ và kỹ sư. Tách trách nhiệm của storage, table format và compute.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**10 · Ba tầng, trách nhiệm tăng dần** · Trang PDF 52-57 · `#ch10`

Định nghĩa multi-hop và medallion. Bronze giữ cấu trúc nguồn cùng load time/process ID, hỗ trợ CDC archive, audit và replay. Silver làm sạch/match/merge/chuẩn hóa/tích hợp, có thể theo 3NF. Gold phục vụ từng miền bằng star/OBT tối ưu đọc, quy tắc chất lượng, phân tích và ML. Giữ cả batch lẫn streaming.

**Dạng trình bày:** Trình phát từng bước cùng bảng trace HTML luôn đọc được.

### Kịch bản tương tác

Fixture và kết quả số bên dưới là ví dụ dạy học đề xuất; không khẳng định chúng nằm trong slide nguồn.

**1. Khám phá cách truy cập storage**

Chọn workload, xem từng bước truy cập path/block/object, metadata và đơn vị cập nhật. Chuyển sang hình HDFS để theo lookup NameNode, đọc DataNode, replica fallback. UI giải thích đánh đổi thay vì dựng thứ hạng benchmark tuyệt đối.

**2. Điều tra data lake thành swamp**

Catalog giả lập có dataset thiếu owner, schema cũ, bản trùng và thiếu freshness. Bật catalog/owner/validation/lineage/retention; xem mỗi chính sách sửa gì và không sửa được gì. Không dùng một điểm chất lượng tùy ý để che lỗi còn lại.

**3. Theo dấu bronze–silver–gold**

Cho năm dòng giả lập qua giữ raw, quarantine/dedup và aggregate. Hai order hợp lệ duy nhất, một bản retry trùng, một amount sai, một key thiếu tạo 5 dòng bronze, 2 order silver hợp lệ, 2 dòng quarantine; có log xử lý trùng. Gold chỉ cộng dòng chấp nhận; replay phải giữ kết quả.

**Các con số cần giữ:** 3 mô hình storage phục vụ cách truy cập khác nhau; 3 mức modeling phục vụ đối tượng khác nhau; 3 tầng medallion có trách nhiệm khác nhau; số 64 MB HDFS trong nguồn cần đối chiếu phiên bản; bậc độ lớn latency minh họa quy mô, không phải benchmark.

**Đích tự kiểm và thực hành:** Chọn storage theo cách truy cập và giải thích đánh đổi; theo một lần đọc HDFS; phân biệt conceptual/logical/physical; chẩn đoán từng nguyên nhân data swamp; xác định owner, kiểm tra và replay ở bronze/silver/gold.

## 09 · Batch — chia công việc, giữ nguyên kết quả

**Nguồn:** `Lession_9_Data_Engineering_Transformation_Layer_1_Batch.pdf` · 90 trang. **Route:** `/courses/data-engineering-foundation/lessons/b9`.

**Chuẩn bị / #toan:** Ôn collection/function Python và filter/join/group SQL bằng ví dụ nhỏ có chú giải. Nhắc partition, sum, distinct count, đơn vị bộ nhớ. Tách business key của bản ghi khỏi vị trí vật lý trước khi vào thực thi phân tán.

**Mẫu lời dẫn mở màn**

Báo cáo hằng đêm từng chạy xong trên một máy. Đêm nay, phần lớn worker đã xong, nhưng một partition vẫn xử lý hàng trăm triệu dòng. Cả cluster chờ đợi. Tôi sẽ đưa bạn vào bên trong job ấy, từ transformation còn nằm trên kế hoạch tới những file cuối cùng. Các máy đều đang làm việc; hình dạng công việc quyết định chúng có thể về đích cùng nhau hay không.

### Dàn chương

**01 · Một máy chạm giới hạn** · Trang PDF 3-8 · `#ch01`

Theo ví dụ xử lý log: parse, đếm page view, tạo báo cáo. Giải thích giới hạn storage/compute/độ tin cậy, scheduler/worker phân tán, ngôn ngữ và vai trò batch/streaming/SQL/ML/graph của Spark. Tách compute Spark khỏi HDFS/S3/Delta/Iceberg/database và quản lý tài nguyên.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**02 · Chương trình trở thành các task** · Trang PDF 9-16 · `#ch02`

Driver/SparkContext, cluster manager, worker, executor, task và cache; phân biệt partition dữ liệu với task. Theo filter/select/show, lazy plan, phân cấp application/job/stage/task và đủ tám bước thực thi. Giải thích ranh giới stage thay vì chỉ kể tên.

**Dạng trình bày:** Trình phát từng bước cùng bảng trace HTML luôn đọc được.

**03 · Hai cách mô tả dữ liệu phân tán** · Trang PDF 17-30 · `#ch03`

RDD partition/lineage/tái tính; SparkSession/SparkContext/local[*]/parallelize với hai partition. DataFrame row/column/schema/immutability và nguồn hỗ trợ; so sánh API. Dựng lại code trong ảnh: createDataFrame, toDF, CSV header, JSON, JDBC URL/driver/dbtable/options, kèm bảng kết quả đọc được.

**Dạng trình bày:** Code đọc được, bảng input/output và chú giải từng dòng.

**04 · Object đi qua mạng dưới dạng byte** · Trang PDF 31-41 · `#ch04`

Giải thích serialization/deserialization khi shuffle, cache và truyền dữ liệu; chi phí CPU/RAM/mạng. So sánh Java/Kryo, cấu hình trước khi tạo context, đăng ký class và bộ đệm. Chú giải ví dụ cấu hình gốc với phạm vi JVM so với Python.

**Dạng trình bày:** Code đọc được, bảng input/output và chú giải từng dòng.

**05 · Giữ lại phần đáng dùng lại** · Trang PDF 42-53 · `#ch05`

Disk so với RAM, cache chỉ vật hóa khi thực thi, cache/persist và đủ năm lựa chọn nguồn: MEMORY_ONLY, MEMORY_AND_DISK, MEMORY_ONLY_SER, MEMORY_AND_DISK_SER, DISK_ONLY. Minh họa tái tính so với disk fallback, serialized/deserialized; phân biệt RDD/DataFrame/Python, quyết định tái dùng và unpersist.

**Dạng trình bày:** Điều chỉnh tham số, sơ đồ và kết quả được tính.

**06 · Partition chậm nhất quyết định nhịp** · Trang PDF 54-62 · `#ch06`

Dạy riêng skew (700M/10M/8M/12M dòng), shuffle explosion, high cardinality, wide schema và schema evolution. Giải thích groupBy/join/distinct/repartition, spill và áp lực mạng; giữ ví dụ schema ngày 1/ngày 30, chỉ ra vì sao thêm máy không xóa được hot key.

**Dạng trình bày:** Tình huống sự cố, cây quyết định và các lựa chọn có giải thích.

**07 · Đưa bộ lọc lên trước chỗ tắc** · Trang PDF 63-67 · `#ch07`

Theo logical plan, analysis, optimized logical plan và physical plan. Dựng lại cả hai sơ đồ và SQL nguồn, gồm join t1/t2, ngưỡng t2.id, projection và sum. Minh họa filter pushdown hợp lệ và điều kiện giữ nguyên kết quả truy vấn.

**Dạng trình bày:** Sơ đồ trước/sau cùng thẻ giải thích cơ chế.

**08 · Bộ máy nhanh hơn bên dưới kế hoạch** · Trang PDF 68-74 · `#ch08`

Tungsten binary layout, chi phí Java object/GC, off-heap tùy cấu hình, truy cập phù hợp cache (L1/L2/L3/RAM) và whole-stage code generation. Phân biệt minh họa độ trễ với cam kết tăng tốc. AQE dùng thống kê runtime để đổi join, gộp shuffle partition và chia skewed join.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**09 · Chỉnh công việc trước khi thêm máy** · Trang PDF 75-83 · `#ch09`

Số partition so với spill/chi phí scheduling; lọc sớm, broadcast hash join, pre-aggregation; tìm/tách/salt/gộp heavy key. Đếm distinct xấp xỉ so với chính xác, projection sớm, column pruning Parquet/ORC so với CSV, schema enforcement/evolution bằng Delta/Iceberg.

**Dạng trình bày:** Điều chỉnh tham số, sơ đồ và kết quả được tính.

**10 · Đọc dấu vết của một job** · Trang PDF 84-88 · `#ch10`

Giải thích Spark UI với stage đang chạy/chờ/xong, thời lượng, task và shuffle. Dynamic allocation đổi số executor theo backlog/idle; giữ 1s/60s có điều kiện phiên bản. Compaction bằng coalesce/repartition/Delta OPTIMIZE, chi phí mở file và bảo trì định kỳ; phân biệt giữ nguyên bản ghi logic với thay đổi byte vật lý.

**Dạng trình bày:** Bảng so sánh cùng bản ghi minh họa và lời giải thích.

### Kịch bản tương tác

Fixture và kết quả số bên dưới là ví dụ dạy học đề xuất; không khẳng định chúng nằm trong slide nguồn.

**1. Trình phát lazy plan và shuffle**

Thêm filter/select/groupBy rồi gọi action. Không task nào chạy trước action. Theo DAG qua stage/partition; bật filter pushdown hợp lệ và broadcast bảng nhỏ, xem số dòng di chuyển cùng đầu ra không đổi. Số đếm lấy từ fixture nhỏ, không phải cam kết hiệu năng runtime.

**2. Thí nghiệm cache và bộ nhớ**

Chọn storage strategy, dung lượng, số lần dùng; xem partition được vật hóa, spill hoặc tái tính. Action đầu làm đầy cache, action sau tái dùng, unpersist giải phóng. Tách mặc định JVM RDD/DataFrame; giải thích cache kết quả dùng một lần có thể tăng việc.

**3. Bàn thực nghiệm skew và vận hành**

Đổi fixture cân bằng/skew, xem thanh task, salt key aggregate nặng rồi gộp tổng từng phần. Aggregate cuối giữ nguyên dù phân phối việc đổi. Góc nhìn khác tách tăng executor khỏi file compaction, hiển thị Spark UI mô phỏng có nhãn dùng để học.

**Các con số cần giữ:** 700M so với 10M/8M/12M dòng làm lộ straggler; 2 partition giúp soi RDD đầu tiên; 5 storage choice đánh đổi bộ nhớ/disk/tái tính; ví dụ allocation 1s/60s cần nhãn phiên bản; số ~1ns/~100ns không đồng nghĩa job tự nhanh hơn 100×.

**Đích tự kiểm và thực hành:** Dự đoán lời gọi bắt đầu thực thi; giải thích lineage recovery; chọn cache/persist theo tái dùng; đọc stage bị skew; giữ kết quả khi đẩy filter; phân biệt tuning partition, allocation executor và compaction đầu ra.

## 10 · Streaming — khi nào một thời điểm đã đủ dữ liệu

**Nguồn:** `Lession_10_Data_Engineering_Transformation_Layer_2_Stream.pdf` · 75 trang. **Route:** `/courses/data-engineering-foundation/lessons/b10`.

**Chuẩn bị / #toan:** Ôn timestamp sự kiện, khoảng thời gian, key, counter và offset bài 7. Dùng khoảng nửa mở với quy ước biên rõ ràng. Tách operator state khỏi vị trí input trước khi học checkpoint recovery.

**Mẫu lời dẫn mở màn**

Một giao dịch xảy ra trước khi phút kết thúc. Thông điệp của nó đến sau khi dashboard đã công bố tổng tiền của phút ấy. Đồng hồ đúng, timestamp cũng đúng. Kết quả vẫn chưa đủ. Tôi sẽ cùng bạn theo hai dòng thời gian: lúc sự kiện xảy ra và lúc hệ thống biết về nó. Giữa hai dòng là watermark, window và quyết định có sửa lại quá khứ hay không.

### Dàn chương

**01 · Phép tính không có bản ghi cuối** · Trang PDF 3-12 · `#ch01`

Stream bounded/unbounded; filter, enrich, aggregate và route. JobManager/TaskManager/slot, CPU dùng chung so với managed memory, operator/subtask/parallelism với ví dụ 3 slot và 4 subtask. Execution graph, phân task, giám sát, checkpoint hoàn tất và tua nguồn khi lỗi.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**02 · Sự kiện có nhiều hơn một chiếc đồng hồ** · Trang PDF 13-22 · `#ch02`

Processing, ingestion, event time; lấy timestamp, tạo watermark và tiến độ downstream. Giữ 00:58−5s=00:53, 01:05−5s=01:00; chiến lược monotonous, bounded, custom; 10:01:20−10s=10:01:10. Giải thích out-of-order tolerance, đánh đổi đo lường và watermark là giả định tiến độ, không phải chứng minh đủ sự kiện.

**Dạng trình bày:** Trình phát từng bước cùng bảng trace HTML luôn đọc được.

**03 · Chia dòng đang chảy thành cửa sổ** · Trang PDF 23-32 · `#ch03`

Tumbling, sliding, session, global; size/slide/inactivity gap và sự kiện thuộc cửa sổ nào. Giữ ví dụ doanh thu/giờ, rolling 10 phút/bước 1 phút, clickstream, 100 sự kiện. Tách chia window, trigger, phát kết quả, dọn state; giải thích default theo time domain và trigger global.

**Dạng trình bày:** Điều chỉnh tham số, sơ đồ và kết quả được tính.

**04 · Sự kiện thiếu đến sau kết quả** · Trang PDF 33-40 · `#ch04`

So sánh drop, allowed lateness, side output, gồm kết quả sửa 3→4. Vẽ lại timeline disorder 10s/lateness 15s với watermark rõ ở mỗi lần đến. Giải thích trạng thái collecting/waiting/deleted, phát lại kết quả, audit/reprocessing/alert/DLQ và upsert downstream. Giữ bảng đánh đổi độ trễ/bộ nhớ/độ đúng có điều kiện.

**Dạng trình bày:** Trình phát từng bước cùng bảng trace HTML luôn đọc được.

**05 · Nhiều ngôn ngữ mô tả cùng dòng dữ liệu** · Trang PDF 41-50 · `#ch05`

DataStream, Table API, SQL và ProcessFunction trên agenda. Giải thích map/filter/flatMap/keyBy/window/aggregate/union/connect; dynamic table, parser/optimizer/planner và chuyển đổi API. Dựng lại ví dụ Java/Python/SQL, schema/WATERMARK, TUMBLE/HOP/SESSION; sửa window_start chưa định nghĩa và điều kiện khẳng định kế hoạch tương đương.

**Dạng trình bày:** Code đọc được, bảng input/output và chú giải từng dòng.

**06 · Mỗi key mang một phần ký ức** · Trang PDF 51-57 · `#ch06`

Giải thích running count, login lỗi, doanh thu theo giờ, session và lịch sử gian lận. Đi qua event→đọc state→tính→ghi state→emit. Keyed so với operator state, source offset và các mục window state/scaling mới chỉ được nêu; kiểm hỗ trợ PyFlink trước khi coi hạn chế là hiện hành.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**07 · Khôi phục một quá khứ nhất quán** · Trang PDF 58-61 · `#ch07`

Checkpoint so với sao lưu code; chèn barrier, snapshot, ghi bền bất đồng bộ và acknowledgment của mọi task. Khôi phục vị trí nguồn/state từ checkpoint hoàn tất gần nhất. Bổ sung phối hợp barrier nhiều input và điều kiện source/sink để giải thích cam kết exactly-once trên agenda.

**Dạng trình bày:** Trình phát từng bước cùng bảng trace HTML luôn đọc được.

**08 · Bỏ những lần chuyển giao không tạo giá trị** · Trang PDF 62-67 · `#ch08`

Bao quát nhóm tuning watermark, chaining, memory và backpressure. So sánh bước network/buffer/serialization/thread riêng với operator chain tương thích. Giải thích disableChaining/startNewChain cho debug, profiling, isolation; phân biệt ranh giới chain với slot-sharing/tách tài nguyên.

**Dạng trình bày:** Trình phát từng bước cùng bảng trace HTML luôn đọc được.

**09 · Điểm nghẽn đẩy ngược về nguồn** · Trang PDF 68-71 · `#ch09`

Theo downstream chậm→buffer đầy→upstream giảm tốc; ảnh hưởng queue/latency và giới hạn bảo vệ. Giải thích mức pressure trên UI, kiểm operator bận phía sau thay vì mặc định node HIGH đầu là nguyên nhân. Đánh giá parallelism từng operator, async I/O, RocksDB cache theo đo lường.

**Dạng trình bày:** Điều chỉnh tham số, sơ đồ và kết quả được tính.

**10 · Chọn ranh giới ảnh hưởng của sự cố** · Trang PDF 72-73 · `#ch10`

So sánh session dùng chung với application riêng: isolation, chia sẻ tài nguyên, khởi động/vòng đời, đánh đổi phát triển/vận hành. Giữ khuyến nghị nguồn dưới dạng khuyến nghị, không coi session cluster bị cấm trong production. Kết bằng thiết kế event-time xuyên suốt.

**Dạng trình bày:** Trình phát từng bước cùng bảng trace HTML luôn đọc được.

### Kịch bản tương tác

Fixture và kết quả số bên dưới là ví dụ dạy học đề xuất; không khẳng định chúng nằm trong slide nguồn.

**1. Phòng thực nghiệm event time**

Đổi loại window, size/slide/gap, disorder bound, allowed lateness, late policy. Đi từng bước event/arrival timestamp và watermark rõ; xem đầu ra đầu/sửa/side cùng dọn state. Phát lại phép tính nguồn và timeline đã sửa. Với event-time, chỉ tăng đồng hồ thực không được làm window hết hạn.

**2. Trình phát checkpoint và sự cố**

Theo source, barrier, keyed state và đầu ra sink. Gây lỗi trước/sau checkpoint hoàn tất; chỉ khôi phục checkpoint hoàn tất cùng vị trí nguồn. So sink bên ngoài không bảo vệ với sink minh họa idempotent/transactional; cho thấy chỉ phục hồi state chưa ngăn tác động trùng.

**3. Mô hình chaining và backpressure**

Đặt tốc độ nguồn/đích, bật chaining tương thích và đổi parallelism điểm nghẽn. Nguồn 8 event/nhịp, sink 3 event/nhịp làm backlog tăng 5/nhịp trước khi giới hạn dung lượng hãm upstream. Ghi rõ mô hình queue, không phải benchmark Flink; hiển thị backpressure phía trước operator chậm.

**Các con số cần giữ:** 00:58−5s=00:53 và 01:05−5s=01:00 dẫn cửa sổ đầu; phân biệt disorder tolerance 10s với allowed lateness 15s; count có thể đổi 3→4; 3 slot chia managed memory, không phải CPU core riêng; 4 subtask là các instance song song.

**Đích tự kiểm và thực hành:** Gán sự kiện vào từng loại window; tính watermark hiển thị; dự đoán accept/refire/side output; phục hồi state cùng vị trí nguồn sau crash; phân biệt chaining với scaling và giải thích nghẽn downstream.

## 11 · Consumption — để một con số mang đúng ý nghĩa

**Nguồn:** `Lession_11_Data_Engineering_Consumption_Layer_2.pdf` · 64 trang. **Route:** `/courses/data-engineering-foundation/lessons/b11`.

**Chuẩn bị / #toan:** Ôn primary/foreign/composite key, phụ thuộc, join, sum, average. Định nghĩa grain trước fact, event/effective timestamp trước SCD và feature retrieval. Có cầu nối SQL ngắn vì bài database trước đó chưa được triển khai.

**Mẫu lời dẫn mở màn**

Khách hàng chuyển nơi ở, nhưng giao dịch hôm qua không đổi. Vậy mà báo cáo vừa gán giao dịch cũ sang vùng mới. Ở hệ thống khác, mô hình nhận mức chi tiêu trung bình được tính khác lúc training. Tôi sẽ theo những thay đổi nhỏ về ý nghĩa ấy. Bạn sẽ thấy grain, version lịch sử và timestamp feature có thể quyết định một query hoàn toàn hợp lệ đang kể đúng hay sai câu chuyện.

### Dàn chương

**01 · Warehouse trả lời một câu hỏi khác** · Trang PDF 3-7 · `#ch01`

Warehouse, SSOT, source/staging/raw/summary/metadata/mart/user và ETL. So sánh ER với dimensional theo workload, mục tiêu, ví dụ; làm rõ warehouse vẫn là hệ thống dữ liệu và không thay trách nhiệm giao dịch hằng ngày.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**02 · Tách thực thể mà không làm mất đơn hàng** · Trang PDF 8-15 · `#ch02`

Entity/attribute/relationship; 1NF giá trị nguyên tử và nhóm lặp; 2NF composite/candidate key, phụ thuộc bộ phận; 3NF phụ thuộc bắc cầu. Dựng lại ví dụ danh sách sản phẩm/số điện thoại rồi Order_Detail→Customers/Products/Orders/OrderItems cùng key, dòng, join. Ghi nhận quantity đổi trong nguồn thay vì chép dữ liệu mâu thuẫn.

**Dạng trình bày:** Code đọc được, bảng input/output và chú giải từng dòng.

**03 · Nói rõ một dòng đại diện cho điều gì** · Trang PDF 16-22 · `#ch03`

Mục tiêu dimensional và đầu ra consumption: fact, dimension, aggregate, analytical view. Giải thích grain, foreign key, measure, date dimension, filter/group/hierarchy. Giữ doanh thu 500+700=1.200 và tồn kho 100/80/120: cộng 300 không phù hợp; tồn cuối 120 hoặc trung bình 100 tùy câu hỏi. Dựng lại ví dụ fact/dimension.

**Dạng trình bày:** Bảng so sánh cùng bản ghi minh họa và lời giải thích.

**04 · Hình dạng mô hình thay đổi phép join** · Trang PDF 23-25 · `#ch04`

Luồng query star, ví dụ sensor/machine/location/time và snowflake customer→city→state→country. So sánh join, lưu trữ, khả năng sử dụng, phân cấp và bảo trì; coi hiệu năng là đánh đổi theo workload thay vì thứ hạng tuyệt đối.

**Dạng trình bày:** Sơ đồ trước/sau cùng thẻ giải thích cơ chế.

**05 · Khách hàng thay đổi; lịch sử cần một chính sách** · Trang PDF 26-34 · `#ch05`

Bao quát đủ SCD 0, 1, 2, 3, 4, 6. Giữ Peter Pan GBP→USD, natural/surrogate key, ngày hiệu lực, current/previous, history table và ý nghĩa active/delete flag. Theo join fact lịch sử và Type 6 ghi đè giá trị hiện tại trên các version. Giải thích mâu thuẫn về Type 1 và bối cảnh cách gọi Type 4 trong nguồn.

**Dạng trình bày:** Điều chỉnh tham số, sơ đồ và kết quả được tính.

**06 · Tách business key khỏi lịch sử thuộc tính** · Trang PDF 35-38 · `#ch06`

Giải thích Data Vault khi schema đổi/nhiều nguồn; hub, link, satellite, load date và nguồn gốc. Dựng lại hub customer/order/product, link order-customer/order-product, satellite name/address/price/category/status/amount. Đặt mô hình tích hợp này trong quan hệ với mô hình phục vụ phân tích.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**07 · Hai con đường tới ý nghĩa nghiệp vụ thống nhất** · Trang PDF 39-42 · `#ch07`

Inmon top-down với enterprise warehouse chuẩn hóa và mart dẫn xuất; Kimball triển khai dimensional, conformed dimension và tích hợp. So sánh tốc độ giao, nhất quán, chi phí, phù hợp tổ chức. Nối bronze/silver/gold với raw, cleaned/3NF/Vault, star/snowflake và đủ quy ước đặt tên trong nguồn.

**Dạng trình bày:** Bảng so sánh cùng bản ghi minh họa và lời giải thích.

**08 · Đọc theo cột để trả lời câu hỏi lớn** · Trang PDF 43-45 · `#ch08`

Lưu theo cột, vectorized execution, truy vấn phân tán; dựng lại cộng bốn cặp số với giải thích SIMD có điều kiện. So sánh người dùng, thao tác, số dòng, độ mới, schema, ví dụ thời gian phản hồi và engine OLTP/OLAP, gồm Druid và Doris.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**09 · Hai engine, những ưu tiên phục vụ khác nhau** · Trang PDF 46-54 · `#ch09`

ClickHouse node, vectorized execution/cache, column block, object storage, metadata điều phối; ZooKeeper so với Keeper và khác biệt triển khai. Pinot schema/dimension/metric/time column; real-time, tải offline segment và hybrid query. Giữ mọi trục so sánh, nêu điều kiện cho độ trễ/độ mới/throughput.

**Dạng trình bày:** Code đọc được, bảng input/output và chú giải từng dòng.

**10 · Mô hình cần quá khứ đúng như từng tồn tại** · Trang PDF 55-62 · `#ch10`

Các trường giao dịch gian lận và feature hành vi; lệch training/serving do filter, rounding/null và logic lặp giữa nhóm (45.73/46/47.10). Giải thích ingestion, offline/online store, truy xuất training/serving, độ mới static/contextual/critical và chi phí. Bổ sung Feast có nhãn rõ cho practical mới có tên trên agenda: entity, view, point-in-time retrieval, materialization, online lookup.

**Dạng trình bày:** Điều chỉnh tham số, sơ đồ và kết quả được tính.

### Kịch bản tương tác

Fixture và kết quả số bên dưới là ví dụ dạy học đề xuất; không khẳng định chúng nằm trong slide nguồn.

**1. Khám phá chuẩn hóa và query phân tích**

Đi từ bảng order nguồn sang entity chuẩn hóa rồi star/snowflake. Tô key, grain, join, thuộc tính lặp. Dùng fixture quantity nhất quán; tính aggregate doanh thu/tồn kho, giải thích vì sao cùng SUM có thể đúng hoặc gây hiểu nhầm.

**2. Phòng thực nghiệm lịch sử SCD**

Đổi type 0/1/2/3/4/6; áp GBP→USD và một lần đổi sau. Xem dòng, surrogate key, interval, current/previous rồi truy vấn giao dịch cũ. Type 1 mất giá trị trước; Type 2 giữ version; Type 3 giữ lịch sử hạn chế; Type 6 đổi cột current trên các dòng lịch sử.

**3. Lab feature theo thời điểm**

Sự kiện training 10:00 thấy feature 09:55, không dùng feature 10:05; online lookup có thể trả giá trị mới nhất. Đổi TTL, freshness, logic null/filter không nhất quán, xem dòng/giá trị được chọn. Bổ sung Feast có nhãn nối mô hình với code entity/view/historical retrieval/materialization/online lookup.

**Các con số cần giữ:** Doanh thu 500+700=1.200 so với tồn kho 100+80+120=300 (sai phép tổng hợp); tồn cuối 120 so với trung bình 100; SCD 0/1/2/3/4/6 giữ lịch sử khác nhau; 45.73, 46, 47.10 minh họa feature lệch; refresh 1–5 phút là lựa chọn theo tình huống.

**Đích tự kiểm và thực hành:** Chuẩn hóa ví dụ order không đổi quantity; khai grain và tính cộng được; join fact với SCD version đúng; ánh xạ quan hệ nghiệp vụ vào Vault link; chọn đánh đổi OLAP; loại feature tương lai khỏi dòng training.

## 12 · Orchestration — điều phối công việc đáng tin

**Nguồn:** `Lession_12_Data_Engineering_Orchestration_Layer.pdf` · 63 trang. **Route:** `/courses/data-engineering-foundation/lessons/b12`.

**Chuẩn bị / #toan:** Ôn đồ thị có hướng, dependency, task state, retry, data interval, validation rule. Giải thích tính không chu trình bằng ví dụ nhỏ; phân biệt chạy Python cục bộ với lên lịch task cô lập. Không giả định biết lý thuyết đồ thị nâng cao.

**Mẫu lời dẫn mở màn**

Hai giờ sáng, extraction bắt đầu. Ba giờ, transformation chạy đúng lịch. File nguồn cuối cùng phải ba giờ hai mươi mới tới. Mọi chiếc đồng hồ đều giữ lời; pipeline thì không. Tôi sẽ tua lại lần chạy và để dependency điều phối. Bạn sẽ thấy hoàn thành task chỉ là một điều kiện để công bố kết quả—bản thân dữ liệu cũng phải vượt qua kiểm tra.

### Dàn chương

**01 · Ba chiếc đồng hồ đúng tạo một báo cáo sai** · Trang PDF 3-10 · `#ch01`

Phát lại extract 02:00, transform 03:00, load 04:00 khi extract trễ đến 03:20. Giải thích dependency, chặn an toàn, trích customer/order song song. Định nghĩa orchestration là điều phối; minh họa trách nhiệm state, scheduling, fault tolerance.

**Dạng trình bày:** Trình phát từng bước cùng bảng trace HTML luôn đọc được.

**02 · Mỗi lần chạy cần ký ức và đường phục hồi** · Trang PDF 11-14 · `#ch02`

Trigger theo thời gian/thủ công/dữ liệu sẵn/sự kiện; state queued/running/success/failed/skipped/retrying. Retry, log, alert, chạy lại thủ công, chặn downstream; điều phối khi 100 task cùng truy vấn database. Phân biệt lên lịch một run với điều phối task trong run.

**Dạng trình bày:** Trình phát từng bước cùng bảng trace HTML luôn đọc được.

**03 · Bộ hẹn giờ không biết dữ liệu đã sẵn sàng** · Trang PDF 15-17 · `#ch03`

Mục đích/hạn chế cron: dependency, DAG, metadata tập trung, phục hồi. Bổ sung có nguồn rõ cho idempotency, backfill và dynamic pipeline mới có tên trên agenda; phân biệt retry/rerun/backfill, khoảng dữ liệu logic và ghi không nhân bản kết quả.

**Dạng trình bày:** Tình huống sự cố, cây quyết định và các lựa chọn có giải thích.

**04 · DAG là kế hoạch; run là lần thực hiện** · Trang PDF 18-24 · `#ch04`

Khả năng/giới hạn Airflow; DAG có hướng/không chu trình, task, DAG Run, Task Instance. Theo DAG file, scheduler, executor, worker, metadata và UI; giữ kiến trúc nguồn với giả định phiên bản và phân biệt execution API hiện hành.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

**05 · Task trao địa chỉ, không trao cả dataset** · Trang PDF 25-29 · `#ch05`

Giải thích operator Python/Bash/SQL/S3 sensor/Docker/HTTP/email, TaskFlow decorator, sensor chờ file/table/API/workflow. Dựng lại code ảnh và sửa chú thích FileSensor. Giải thích task isolation, XCom push/pull, path/count/model ID và giới hạn giá trị nhỏ của backend mặc định.

**Dạng trình bày:** Code đọc được, bảng input/output và chú giải từng dòng.

**06 · Bảo vệ hệ thống bên dưới scheduler** · Trang PDF 30-38 · `#ch06`

Variables so với Connections, xử lý credential; phạm vi/phiên bản executor Sequential/Local/Celery/Kubernetes. Ví dụ 200 task, parallelism=64, max_active_runs=1, pool=5; phân biệt giới hạn task/run/tài nguyên. UI/grid/log, alert, xu hướng Grafana/Datadog và queue.

**Dạng trình bày:** Bảng so sánh cùng bản ghi minh họa và lời giải thích.

**07 · Task xanh vẫn có thể mang dữ liệu sai** · Trang PDF 39-43 · `#ch07`

Giữ và kiểm các trường hợp Gartner/PHE/Unity với nguồn/cải chính. Định nghĩa phù hợp mục đích và dạng dữ liệu xấu; accuracy, completeness, consistency, timeliness, validity, uniqueness. Chuyển thành rule null, ID, email, giá dương, timestamp tương lai và row count giảm 30%.

**Dạng trình bày:** Bảng so sánh cùng bản ghi minh họa và lời giải thích.

**08 · Chất lượng tiến bộ qua vòng phản hồi** · Trang PDF 44-48 · `#ch08`

Business case→profile→rule→monitor→correct. Giữ phát hiện CRM (15% thiếu email, 10% sai định dạng), rule email-hoặc-phone, chuẩn hóa phone, heuristic trùng, ngưỡng alert 5% và hướng dẫn nhập liệu upstream. Bao quát table/row/column, bối cảnh cảnh báo, xử lý, mở rộng; phát hiện thủ công/rule/metric/ML.

**Dạng trình bày:** Tình huống sự cố, cây quyết định và các lựa chọn có giải thích.

**09 · Kiểm tra thất bại phải đổi cách thực thi** · Trang PDF 49-52 · `#ch09`

Minh họa luồng không an toàn: validation fail nhưng transform/load tiếp tục. Thiết kế validation gate/circuit breaker bằng fail/branch/alert và dependency downstream an toàn. Giải thích bằng chứng log, phục hồi; phân biệt branch skipped/success với việc công bố dữ liệu sai.

**Dạng trình bày:** Trình phát từng bước cùng bảng trace HTML luôn đọc được.

**10 · Biến thỏa thuận thành thứ kiểm được** · Trang PDF 53-61 · `#ch10`

Schema đổi tên/xóa/type/nullability; contract range/freshness/uniqueness ở ranh giới nhóm. So sánh vai trò GX, Deequ, dbt tests, Soda, DataHub. GX expectation/suite/backend/gate Airflow; Deequ profiling/analyzer/verification, completeness >99%, anomaly detection và incremental metric; DataHub dataset/schema/owner/pipeline/lineage/quality, phân tích ảnh hưởng.

**Dạng trình bày:** Sơ đồ kiến trúc có chú giải và lời dẫn theo luồng.

### Kịch bản tương tác

Fixture và kết quả số bên dưới là ví dụ dạy học đề xuất; không khẳng định chúng nằm trong slide nguồn.

**1. Cron so với scheduler theo dependency**

Chạy tình huống 02:00/03:00/03:20/04:00 theo giờ và theo dependency; tiến bước, dừng, retry, backfill interval chọn. Scheduler an toàn không chạy transform trước extract thành công. Chạy lại interval dùng fixture idempotent, giữ số dòng công bố.

**2. Phòng điều khiển concurrency**

Đặt sức chứa task toàn cục, active DAG run, database pool slot; đưa task độc lập qua queued/running/success/failed. Pool không vượt slot; đổi max_active_runs thay số run chồng nhau, không phải số task trong một run. Hiển thị tham chiếu cấu hình và payload XCom.

**3. Điều tra validation gate và lineage**

Chèn null key, ID trùng, amount sai, dataset cũ hoặc đổi tên schema. Hiện đúng rule lỗi, bằng chứng, quyết định quarantine/stop và consumer bị chặn trên lineage graph. Sửa input, chạy lại rồi mới cho công bố downstream. Ví dụ GX/Deequ tách khỏi simulation trình duyệt.

**Các con số cần giữ:** 02:00/03:00/03:20/04:00 làm lộ race do lịch; so 200 task với pool database 5 slot; phân biệt parallelism=64 và max_active_runs=1; CRM thiếu 15%/sai 10%, ngưỡng cảnh báo 5% biến chất lượng thành quyết định; giữ ví dụ count giảm 30% và completeness >99%.

**Đích tự kiểm và thực hành:** Phân biệt định nghĩa DAG/task với run/instance; thiết kế retry/backfill an toàn theo dependency; chọn payload XCom; dùng pool bảo vệ database; ánh xạ từng chiều chất lượng thành rule; chặn công bố không an toàn và dùng lineage tìm bên bị ảnh hưởng.

## Điều kiện nghiệm thu triển khai

- Mỗi trang kiến thức có anchor bài hoàn tất; reviewer tìm được khái niệm, bảng, hình, ví dụ số và code tương ứng. Trạng thái CSV hiện là **planned**, chưa phải đã đạt coverage.
- Mâu thuẫn nguồn có ghi chú sửa và tài liệu chính thức; không bỏ âm thầm, không lặp khẳng định biết là sai. Mục chỉ có trên agenda được ghi là bổ sung.
- VI/EN khớp phạm vi, ví dụ, số, hành vi code, tương tác, giải thích quiz. VI được đối chiếu slide; reviewer riêng kiểm EN với VI.
- Session ID/tiến độ thuộc namespace Data Engineering Foundation. Không dùng nhầm quiz/checklist AI. Viết bài không tự bật kiểm tra cuối phần.
- Build, route/anchor, locale parity, test simulation có ý nghĩa và kiểm browser đạt, gồm mobile hẹp và reduced motion.
- Chỉ mở bài sau triển khai; buổi chưa xong vẫn có trạng thái kế hoạch.

// Outcomes and practice are proposed targets, not existing lesson material.

export const VI = {
  parts: {
    "engineering-core": {
      no: "PHẦN I",
      title: "Nền tảng kỹ thuật",
      en: "Engineering Core",
      range: "Tuần 1–3",
      testDesc: "Mục tiêu: một tác vụ Python có thể chạy lại, nạp dữ liệu vào bảng và đối chiếu kết quả truy vấn."
    },
    "reliable-services": {
      no: "PHẦN II",
      title: "Dịch vụ đáng tin cậy",
      en: "Reliable Services",
      range: "Tuần 4–6",
      testDesc: "Mục tiêu: hợp đồng API, kế hoạch kiểm thử và một môi trường dịch vụ có thể dựng lại bằng container."
    },
    "data-platform": {
      no: "PHẦN III",
      title: "Nền tảng dữ liệu",
      en: "Data Platform",
      range: "Tuần 7–8",
      testDesc: "Mục tiêu: sơ đồ từ nguồn đến nơi lưu, hợp đồng sự kiện và ranh giới dữ liệu thô / sạch / phục vụ."
    },
    "processing-and-operation": {
      no: "PHẦN IV",
      title: "Xử lý, phục vụ & vận hành",
      en: "Processing, Consumption & Operation",
      range: "Tuần 9–12",
      testDesc: "Mục tiêu: thiết kế pipeline hoàn chỉnh, kiểm tra chất lượng dữ liệu và kế hoạch phục hồi khi một bước thất bại."
    }
  },
  sessions: {
    b1: {
      title: "Buổi 1 · Linux, shell & tự động hóa",
      en: "Linux, Shell & Task Automation",
      hours: "~4–6h",
      topics: "GNU/Linux và hệ thống tệp · công cụ CLI, pipe và xử lý văn bản · Bash · biên dịch và Makefile · cron và giới hạn của lịch chạy theo giờ.",
      math: "Biết dùng thư mục và trình soạn thảo; ôn đường dẫn, biến, điều kiện và thứ tự thực thi.",
      outcome: "Bạn ghép được các lệnh thành một tác vụ có đầu vào, đầu ra và lịch chạy rõ ràng.",
      practice: "Dự kiến: phác thảo tác vụ xử lý tệp có tham số, một Make target và cách nhận biết lần chạy thất bại."
    },
    b2: {
      title: "Buổi 2 · Python cho tác vụ dữ liệu",
      en: "Python for Data Tasks",
      hours: "~5–7h",
      topics: "Môi trường ảo: virtualenv, Poetry, uv · collection và hàm · xử lý lỗi, context manager · đọc/ghi tệp · argparse · thư viện chuẩn · sync/async.",
      math: "Ôn biến, vòng lặp, hàm, tập hợp và cặp khóa–giá trị; nối tiếp thao tác tệp ở buổi 1.",
      outcome: "Bạn tổ chức được một script xử lý dữ liệu với dependency riêng, tham số và hành vi khi gặp lỗi.",
      practice: "Dự kiến: CLI đọc bản ghi mẫu, xuất kết quả và báo dữ liệu không hợp lệ; so sánh một tình huống sync/async."
    },
    b3: {
      title: "Buổi 3 · Database, SQL & truy cập từ Python",
      en: "Databases, SQL & Python Access",
      hours: "~7–9h",
      topics: "Database/DBMS · khóa và quan hệ · SQL/NoSQL, ACID/BASE · PostgreSQL/WAL · nhóm lệnh SQL, JOIN, tổng hợp, transaction · index và query plan · SQLite · SQLAlchemy Core/ORM.",
      math: "Tập hợp, quan hệ, logic Boolean và tổng hợp; cần đọc được hàm Python và xử lý tệp.",
      outcome: "Bạn mô hình hóa bản ghi, truy vấn đúng quan hệ và giải thích được một kế hoạch thực thi đơn giản.",
      practice: "Dự kiến: schema đơn hàng/khách hàng, truy vấn tổng hợp có kết quả đối chiếu và nhận xét về query plan."
    },
    b4: {
      title: "Buổi 4 · Web API & hợp đồng dịch vụ",
      en: "Web APIs & Service Contracts",
      hours: "~5–7h",
      topics: "HTTP request/response, DNS và transport · REST, gRPC, WebSocket, SSE, webhook · AAA, Basic Auth, JWT, OAuth · health check · chỉ số và kiểm thử tải.",
      math: "Python, bản ghi dữ liệu và JSON; ôn tỷ lệ lỗi, độ trễ và số request mỗi giây.",
      outcome: "Bạn đọc được một trao đổi HTTP và chọn kiểu giao tiếp, kiểm soát truy cập, tín hiệu sức khỏe phù hợp.",
      practice: "Dự kiến: hợp đồng API cùng ví dụ request thành công/thất bại. Phần triển khai FastAPI sẽ được bổ sung khi viết bài."
    },
    b5: {
      title: "Buổi 5 · Verification, validation & kiểm thử",
      en: "Verification, Validation & Testing",
      hours: "~5–7h",
      topics: "V-model · cấp độ và phương pháp kiểm thử · pytest: fixture, marker, parametrization, mock · Testcontainers · tox · coverage · TDD.",
      math: "Hàm Python, database và hợp đồng API; phân biệt đầu vào, kết quả mong đợi và lỗi phụ thuộc.",
      outcome: "Bạn chọn được ranh giới kiểm thử và mô tả bằng chứng cho cả luồng đúng lẫn luồng lỗi.",
      practice: "Dự kiến: kế hoạch kiểm thử cho tác vụ dữ liệu. Học khái niệm Testcontainers ở đây, chạy thử sau buổi 6."
    },
    b6: {
      title: "Buổi 6 · Container & dịch vụ có thể tái tạo",
      en: "Containers & Reproducible Services",
      hours: "~5–7h",
      topics: "VM và container · image/runtime, namespace/cgroup · Docker và công cụ thay thế · build/debug · volume, network · registry · Docker Compose · tối ưu image.",
      math: "Shell, tiến trình, cổng mạng và hợp đồng API; quay lại kiểm thử tích hợp của buổi 5.",
      outcome: "Bạn giải thích được cách đóng gói dịch vụ, giữ dữ liệu và kết nối các thành phần trong môi trường cục bộ.",
      practice: "Dự kiến: thiết kế một Compose stack nhỏ, kiểm tra dựng lại từ đầu và chạy kiểm thử dùng container."
    },
    b7: {
      title: "Buổi 7 · Ingestion, Kafka & CDC",
      en: "Ingestion, Kafka & CDC",
      hours: "~6–8h",
      topics: "Nguồn dữ liệu, file/log, OLTP/OLAP · CDC theo timestamp/trigger/log · Kafka ecosystem · topic, partition, offset, producer, consumer group · replication, delivery, retention · Debezium.",
      math: "Transaction, dịch vụ và container; ôn thứ tự sự kiện, khóa phân vùng và tỷ lệ xử lý.",
      outcome: "Bạn lần theo được một thay đổi dữ liệu từ nguồn đến consumer và giải thích rủi ro mất/trùng khi xử lý lại.",
      practice: "Dự kiến: hợp đồng sự kiện, lý do chọn partition key và thí nghiệm replay. Điều kiện delivery guarantee sẽ được kiểm chứng khi viết bài."
    },
    b8: {
      title: "Buổi 8 · Storage, mô hình & lakehouse",
      en: "Storage, Modeling & Lakehouse Layers",
      hours: "~5–7h",
      topics: "File/block/object storage · cache, HDFS · warehouse và mô hình conceptual/logical/physical · star/snowflake · lake, swamp, governance · lakehouse · bronze/silver/gold.",
      math: "Schema, khóa, nguồn sự kiện; ôn dung lượng, thời gian lưu, dữ liệu thô và dữ liệu dẫn xuất.",
      outcome: "Bạn chọn được các lớp lưu trữ và nêu rõ dữ liệu ở đâu, ai sở hữu, khi nào được dùng.",
      practice: "Dự kiến: sơ đồ bronze/silver/gold kèm schema, chủ sở hữu, thời gian lưu và quy tắc chất lượng."
    },
    b9: {
      title: "Buổi 9 · Xử lý batch với Spark",
      en: "Batch Transformation with Spark",
      hours: "~8–10h",
      topics: "Driver/executor, partition, job/stage/task · lazy evaluation · RDD/DataFrame · serialization, cache/persist · shuffle, skew, cardinality, schema evolution · Catalyst/Tungsten/AQE · Spark UI và compaction.",
      math: "Python, SQL và mô hình lưu trữ; ôn phân vùng, tổng hợp và chi phí di chuyển dữ liệu.",
      outcome: "Bạn giải thích được một job batch và nhận ra khi chi phí đến từ shuffle, dữ liệu lệch hoặc đọc thừa.",
      practice: "Dự kiến: phép biến đổi DataFrame nhỏ có đối chiếu kết quả và quan sát execution plan; tuning nâng cao là phần mở rộng."
    },
    b10: {
      title: "Buổi 10 · Xử lý stream với Flink",
      en: "Stream Transformation with Flink",
      hours: "~8–10h",
      topics: "JobManager/TaskManager, slot, parallelism · event time và watermark · window, trigger, late data · DataStream/Table/SQL · state, checkpoint, recovery · chaining, backpressure · deployment modes.",
      math: "Kafka, phân vùng và xử lý phân tán; ôn timestamp, khoảng thời gian và trạng thái theo khóa.",
      outcome: "Bạn dự đoán được kết quả cửa sổ khi sự kiện đến sai thứ tự và giải thích vai trò của state/checkpoint.",
      practice: "Dự kiến: timeline sự kiện, kết quả window mong đợi, chính sách late data và một tình huống phục hồi."
    },
    b11: {
      title: "Buổi 11 · Consumption & mô hình phân tích",
      en: "Consumption & Analytical Models",
      hours: "~6–8h",
      topics: "ER/3NF và dimensional modeling · fact/dimension, star/snowflake · SCD · Data Vault · Inmon/Kimball · ClickHouse/Pinot · feature store, offline/online và training-serving skew.",
      math: "SQL, các lớp lưu trữ và batch/stream; ôn mức chi tiết của bản ghi, tổng hợp và lịch sử thay đổi.",
      outcome: "Bạn thiết kế được mô hình trả lời câu hỏi nghiệp vụ và chọn chính sách lưu lịch sử của dimension.",
      practice: "Dự kiến: fact grain, dimension, chính sách SCD và truy vấn nghiệp vụ. Thiết kế feature store là mở rộng; bài thực hành Feast sẽ viết sau."
    },
    b12: {
      title: "Buổi 12 · Orchestration & chất lượng dữ liệu",
      en: "Orchestration & Data Quality",
      hours: "~8–10h",
      topics: "Cron và điều phối phụ thuộc · Airflow DAG/run/task, operator, sensor, XCom · connection, executor, concurrency, pool · giám sát · quality rule, circuit breaker, data contract · GX/Deequ/DataHub.",
      math: "Các bước pipeline và kiểm thử; ôn đồ thị có hướng không chu trình, trạng thái tác vụ và ngưỡng chất lượng.",
      outcome: "Bạn thiết kế được workflow chặn dữ liệu lỗi và mô tả cách chạy lại, phục hồi khi một bước thất bại.",
      practice: "Dự kiến: thiết kế pipeline hoàn chỉnh và diễn tập lỗi. Idempotency/backfill cần phần giải thích bổ sung khi viết bài."
    }
  }
};

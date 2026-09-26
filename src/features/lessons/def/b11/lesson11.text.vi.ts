export const VI = {
  "badge": "BUỔI 11 · DEF",
  "title": "Consumption — một con số, đúng ý nghĩa",
  "hero": "Query chạy đúng.<br /><em>Câu chuyện có đúng?</em>",
  "intro": "Khách hàng chuyển nơi ở. Giao dịch hôm qua không đổi, nhưng báo cáo vừa gán doanh thu cũ sang vùng mới. Ở hệ thống khác, mô hình nhận feature chưa từng tồn tại lúc dự đoán. Tôi sẽ cùng bạn kiểm grain, lịch sử và thời điểm trước khi tin một con số trên dashboard.",
  "meta": "10 chương · 3 lab · 10 câu quiz · VI / EN",
  "premise": "Các bảng, SCD và feature là fixture dạy học trong trình duyệt. Mẫu SQL/Feast giải thích hợp đồng dữ liệu; trang không triển khai warehouse, OLAP cluster hay feature store.",
  "cover": "Bìa",
  "start": "Kiểm ý nghĩa của dữ liệu",
  "readyTitle": "🧭 Ôn nền: khóa, grain và thời điểm",
  "readyLead": "Bạn có thể viết SQL hợp lệ mà cộng sai thứ cần cộng. Tôi bắt đầu bằng một dòng dữ liệu đại diện cho điều gì.",
  "terms": [
    [
      "Primary · candidate · foreign key",
      "Candidate key là tập thuộc tính tối thiểu nhận diện dòng; primary key là một candidate được chọn. Foreign key biểu đạt liên kết; engine có cưỡng chế hay không phải kiểm riêng."
    ],
    [
      "Functional dependency",
      "X → Y nghĩa là giá trị X xác định Y trong mô hình. Khóa ghép cần phân biệt phụ thuộc vào toàn khóa với chỉ một phần."
    ],
    [
      "Grain · aggregate",
      "Grain là mức chi tiết của một dòng. SUM cộng đại lượng; AVG cần trọng số đúng. Một con số có kiểu numeric chưa chắc cộng được qua mọi chiều."
    ],
    [
      "Effective · event · available time",
      "Effective time là lúc thuộc tính có hiệu lực; event time là lúc sự kiện xảy ra; available time là lúc hệ thống có thể biết giá trị. Ba mốc có thể khác nhau."
    ]
  ],
  "chapters": [
    {
      "title": "Warehouse trả lời câu hỏi khác",
      "lead": "Database bán hàng biết đơn vừa đặt. Dashboard cần cả lịch sử và định nghĩa doanh thu thống nhất.",
      "body": [
        "Data warehouse tích hợp dữ liệu phục vụ phân tích. Source → staging → transformation → warehouse → mart → người dùng là một đường đi phổ biến; ETL extract từ nguồn, transform/validate rồi load dữ liệu đã chuẩn bị. ELT có thể chuyển thứ tự tùy nền tảng. Raw data, summary và metadata có trách nhiệm khác nhau.",
        "<strong class=\"hl-yellow\">Single source of truth là hợp đồng về ý nghĩa</strong>, không chỉ là một địa chỉ database. Tôi cần biết doanh thu tính lúc đặt, lúc thu tiền hay sau hoàn hàng; owner, freshness và quy tắc chất lượng cũng phải rõ. Warehouse vẫn là hệ thống dữ liệu, nhưng không tự thay vai trò giao dịch ngày thường của hệ thống nguồn.",
        "ER modeling nhận diện entity/attribute/relationship, thường kết hợp chuẩn hóa để giảm bất nhất cập nhật. Dimensional modeling tổ chức dữ liệu quanh câu hỏi phân tích để người dùng dễ lọc, nhóm và theo lịch sử. ER không bị “khai tử” trong warehouse; mô hình tích hợp và mô hình consumption có thể cùng tồn tại."
      ],
      "headers": [
        "Thành phần",
        "Vai trò / đánh đổi"
      ],
      "rows": [
        [
          "Source / staging",
          "Trích xuất, kiểm, chuẩn hóa; giữ provenance"
        ],
        [
          "Warehouse / metadata",
          "Dữ liệu tích hợp và định nghĩa, owner, lineage"
        ],
        [
          "Mart / user",
          "Dữ liệu theo miền cho Sales, Purchasing, Inventory; BI, báo cáo, ML"
        ]
      ]
    },
    {
      "title": "Tách thực thể mà không làm mất đơn hàng",
      "lead": "Tên khách lặp trên từng dòng sản phẩm: sửa một nơi rồi quên nơi khác là đủ tạo hai sự thật.",
      "body": [
        "Entity là Customer, Order, Product; attribute là tên, ngày, giá; relationship là khách đặt đơn, đơn có dòng hàng. <strong class=\"hl-yellow\">1NF</strong> yêu cầu giá trị nguyên tử theo domain và không có nhóm lặp. Thay Phone1/Phone2/Phone3 bằng CustomerPhone(customer_id, phone); tách danh sách P01,P02 thành các dòng hàng. Atom phụ thuộc domain, không phải cấm mọi kiểu dữ liệu phức hợp trong mọi hệ thống.",
        "<strong class=\"hl-yellow\">2NF</strong>: đã 1NF và mỗi thuộc tính không thuộc candidate key phụ thuộc đầy đủ vào mọi candidate key, không phụ thuộc một phần. Trong fixture giả định mỗi sản phẩm xuất hiện một lần mỗi đơn, khóa (order_id, product_id) xác định quantity; customer_name chỉ phụ thuộc order_id nên tách. Nếu sản phẩm lặp được, dùng line_id phù hợp thay vì giả định khóa ghép ấy luôn đúng.",
        "<strong class=\"hl-yellow\">3NF</strong> loại phụ thuộc bắc cầu gây bất nhất trong ví dụ: order_id → customer_id → customer_name/phone. Dạng chính xác: với mỗi phụ thuộc không tầm thường X → A, X là superkey hoặc A là thuộc tính prime (thuộc một candidate key). Tôi giữ cách diễn đạt chính xác vì câu “không non-key nào phụ thuộc non-key” chỉ là mẹo nhớ cho mô hình đơn giản.",
        "Ví dụ tách Customers, Products, Orders, OrderItems giữ nguyên quantity 1,2,1. Order 1001 xuất hiện ở hai dòng không tự là duplicate: grain đang là order line. Giá bán tại giao dịch nên giữ ở dòng fact/order item; join giá sản phẩm hiện tại không khôi phục giá bán cũ. Chuẩn hóa thay cấu trúc, không thay dữ kiện."
      ],
      "headers": [
        "Thành phần",
        "Vai trò / đánh đổi"
      ],
      "rows": [
        [
          "Customers",
          "C01 · Anna · 0901; key customer_id"
        ],
        [
          "Products",
          "P01 · Keyboard · 50; P02 · Mouse · 20; key product_id"
        ],
        [
          "Orders",
          "1001 · C01 · 2026-05-01; 1002 · C01 · 2026-05-02"
        ],
        [
          "OrderItems",
          "line 1: 1001/P01/1; line 2: 1001/P02/2; line 3: 1002/P01/1"
        ]
      ]
    },
    {
      "title": "📏 Nói rõ một dòng đại diện điều gì",
      "lead": "SUM chạy trên cả doanh thu và tồn kho; chỉ một phép cộng trả lời đúng câu hỏi đang hỏi.",
      "body": [
        "Fact ghi sự kiện hoặc phép đo theo <strong class=\"hl-yellow\">grain được chốt trước</strong>. Fact sales ở grain order line chứa dimension key, quantity, unit_price tại giao dịch và sales_amount. Customer/Product/Date mô tả ngữ cảnh để filter/group. Factless fact có thể ghi sự kiện không có measure số; không phải mọi fact bắt buộc có doanh thu.",
        "Additive measure như doanh thu 500 + 700 = 1200 có thể cộng qua ngày khi cùng định nghĩa/đơn vị. Semi-additive inventory 100,80,120 không cộng qua thời gian thành “tồn kho 300”: tồn cuối là 120 hoặc trung bình các snapshot cách đều là 100. Nếu khoảng giữa snapshot không đều, average cần trọng số thời gian. Tỷ lệ và đơn giá thường cần quy tắc gộp riêng.",
        "Date dimension lưu ngày/tháng/quý/năm để nhóm nhất quán; OrderDateKey và ShipDateKey có thể cùng tham chiếu dimension ngày theo hai vai trò. Dimension thường ít dòng hơn fact và phi chuẩn hóa để dễ dùng, nhưng đó không phải định nghĩa bắt buộc. Tôi kiểm cardinality của join: một fact ghép hai phiên bản dimension sẽ làm SUM tăng dù không có giao dịch mới."
      ],
      "headers": [
        "Thành phần",
        "Vai trò / đánh đổi"
      ],
      "rows": [
        [
          "Fact sales",
          "Một dòng hàng; order_line_id, customer_sk, product_sk, date_key, quantity, sales_amount"
        ],
        [
          "dimDate",
          "20260501 → 2026-05-01, tháng 5, quý 2, năm 2026"
        ],
        [
          "Dimension",
          "Tên sản phẩm, category, region; dùng lọc và phân cấp"
        ],
        [
          "Consumption output",
          "Fact/dimension, bảng aggregate và analytical view có định nghĩa thống nhất"
        ]
      ]
    },
    {
      "title": "Hình dạng mô hình thay đổi phép join",
      "lead": "Cùng một quốc gia có thể lặp trong dimension hoặc nằm trong bảng riêng.",
      "body": [
        "Star nối fact trực tiếp tới dimension tương đối phẳng. SensorMetrics có thể nối Machine, Sensor, Location và Time; query lọc thuộc tính dimension, ghép qua key rồi aggregate measure. Optimizer có thể đổi thứ tự thực thi, nên sơ đồ mô tả quan hệ logic chứ không buộc engine quét fact trước.",
        "Snowflake tách phân cấp: Customer → City → State → Country. Nó giảm lặp một số thuộc tính và giúp quản lý phân cấp, đổi lại thêm join và phức tạp cho BI. Tôi chọn theo cách cập nhật/khai thác và benchmark workload; không coi star luôn nhanh hay snowflake luôn ít byte trong mọi engine.",
        "Bạn cần key duy nhất ở phía dimension và quan hệ đúng theo grain. Hình đẹp không cứu một join many-to-many vô tình. Với Type 2 ở mục kế, natural key khách hàng sẽ không còn duy nhất theo mọi phiên bản; fact cần surrogate key hoặc điều kiện thời gian."
      ],
      "headers": [
        "Thành phần",
        "Vai trò / đánh đổi"
      ],
      "rows": [
        [
          "Star",
          "Fact → Customer(region, country); ít chặng, dễ dùng"
        ],
        [
          "Snowflake",
          "Fact → Customer → City → State → Country; quản lý phân cấp"
        ],
        [
          "Cả hai",
          "Kiểm key, grain, join cardinality; hiệu năng còn phụ thuộc engine và dữ liệu"
        ]
      ]
    },
    {
      "title": "🕰️ Khách đổi thuộc tính, lịch sử cần chính sách",
      "lead": "Peter Pan đổi đồng tiền ưu tiên từ GBP sang USD; giao dịch cũ có được đổi theo không?",
      "body": [
        "Slowly Changing Dimensions là các chính sách xử lý thuộc tính dimension thay đổi. <strong class=\"hl-yellow\">Natural key</strong> nhận diện khách trong nghiệp vụ; surrogate key nhận diện dòng/phiên bản dimension. Với Type 2, natural key lặp có chủ đích, primary key của bảng phiên bản thường là surrogate key.",
        "Type 0 giữ giá trị ban đầu; Type 1 ghi đè, hợp sửa lỗi hoặc thuộc tính không cần lịch sử. Type 2 thêm dòng với khoảng hiệu lực [from,to), không chồng lấp cho cùng business key. Giao dịch 2025-09-20 dùng GBP; tại 2025-09-26 dùng USD. Current/active flag đánh dấu phiên bản hiện hành, không tự có nghĩa khách bị xóa khỏi nghiệp vụ.",
        "Type 3 giữ current và một previous nên mất lịch sử xa hơn sau nhiều lần đổi. Type 4 trong bài dùng quy ước bảng current riêng và history riêng; tên Type 4 có thể dùng nghĩa khác trong tài liệu khác. Type 6 kết hợp dòng lịch sử Type 2, current ghi đè trên mọi phiên bản kiểu Type 1 và previous kiểu Type 3. Bạn phải nói rõ cột nào là historical và cột nào luôn theo hiện tại.",
        "Tôi cho lab đổi thêm USD → EUR để lộ giới hạn Type 3. Type 2 giữ GBP/USD/EUR theo interval; Type 6 giữ historical_currency từng dòng nhưng current_currency đều là EUR. Đây là <strong class=\"hl-yellow\">đồng tiền ưu tiên của khách</strong>, không đổi currency/amount thật đã ghi trên transaction."
      ],
      "headers": [
        "Thành phần",
        "Vai trò / đánh đổi"
      ],
      "rows": [
        [
          "Type 0 / 1",
          "Giữ ban đầu / ghi đè không giữ lịch sử"
        ],
        [
          "Type 2",
          "Thêm version, surrogate key, interval, cờ current"
        ],
        [
          "Type 3",
          "Current + previous; lịch sử hữu hạn"
        ],
        [
          "Type 4",
          "Current và history tách bảng theo quy ước của bài"
        ],
        [
          "Type 6",
          "History theo version + current ghi đè toàn bộ + previous"
        ]
      ]
    },
    {
      "title": "Tách business key khỏi lịch sử thuộc tính",
      "lead": "CRM và ERP đổi schema vào hai ngày khác nhau; mart phân tích vẫn cần một câu chuyện thống nhất.",
      "body": [
        "Data Vault tách <strong class=\"hl-yellow\">hub</strong> giữ business key, <strong class=\"hl-yellow\">link</strong> giữ quan hệ và <strong class=\"hl-yellow\">satellite</strong> giữ thuộc tính/lịch sử. Load date và record source giúp theo provenance; load time không tự là effective time. Có thể thêm satellite cho nguồn hoặc nhóm thuộc tính mới mà không nhét mọi thay đổi vào một bảng lớn.",
        "Ví dụ hub_customer, hub_order, hub_product; lnk_order_customer nối đơn với khách, lnk_order_product nối đơn với sản phẩm. sat_customer chứa name/address, sat_product chứa price/category, sat_order chứa status/total_amount. Quan hệ có thể lặp theo order line nên link grain phải rõ; ba ID không luôn đủ biểu đạt mọi nghiệp vụ.",
        "Tôi coi Vault là mô hình tích hợp có lịch sử, không phải phép thay thế mọi mart. Bạn vẫn cần quy tắc hợp nhất business key, chất lượng dữ liệu và mô hình dễ dùng cho BI. Đặt Vault ở silver là một lựa chọn; medallion không buộc mọi silver table thành Vault hoặc 3NF."
      ],
      "headers": [
        "Thành phần",
        "Vai trò / đánh đổi"
      ],
      "rows": [
        [
          "Hub",
          "Business key + load metadata; thực thể là gì"
        ],
        [
          "Link",
          "Khóa các hub liên quan + grain/metadata; quan hệ nào"
        ],
        [
          "Satellite",
          "Thuộc tính + lịch sử + provenance; thay đổi ra sao"
        ]
      ]
    },
    {
      "title": "Hai con đường tới định nghĩa thống nhất",
      "lead": "Giao một mart nhanh chưa đủ nếu mỗi đội định nghĩa Customer một kiểu.",
      "body": [
        "Inmon thường bắt đầu từ enterprise warehouse tích hợp, chuẩn hóa, rồi sinh mart theo miền. Kimball triển khai dimensional model theo quy trình nghiệp vụ, tích hợp bằng <strong class=\"hl-yellow\">conformed dimensions</strong> và định nghĩa fact nhất quán. Không thể gọi phép union các mart rời rạc là tích hợp Kimball.",
        "Top-down đầu tư mô hình chung trước nên cần nhiều phối hợp và có thể giao chậm; cách tăng dần giao giá trị sớm nhưng cần kỷ luật conformed dimensions ngay từ đầu. Cả hai có chi phí và có thể kết hợp. Tôi chọn từ tổ chức, lịch sử cần giữ và cách người dùng ra quyết định, không chọn từ nhãn “hiện đại”.",
        "Bronze/silver/gold mô tả trách nhiệm: giữ raw có metadata/contract; làm sạch/tích hợp; phục vụ nghiệp vụ. Chúng không phải mức chuẩn hóa bắt buộc. Tên bảng là quy ước đội thống nhất: <code>bronze_&lt;source&gt;_&lt;entity&gt;</code> hoặc raw_; <code>silver_&lt;entity&gt;</code>/stg_, hub_/lnk_/sat_; fact_/fct_, dim_, mart_ cho đầu ra tương ứng."
      ],
      "headers": [
        "Thành phần",
        "Vai trò / đánh đổi"
      ],
      "rows": [
        [
          "Inmon",
          "Warehouse chuẩn hóa tích hợp → mart; mô hình chung đầu tư sớm"
        ],
        [
          "Kimball",
          "Dimensional theo quy trình + conformed dimensions; tích hợp tăng dần"
        ],
        [
          "Medallion",
          "Trách nhiệm chất lượng/tiêu thụ, không bắt buộc engine hoặc một data model"
        ]
      ]
    },
    {
      "title": "📚 Đọc theo cột để trả lời câu hỏi lớn",
      "lead": "Báo cáo tổng doanh thu chỉ cần vài cột, dù bảng có hàng trăm thuộc tính.",
      "body": [
        "OLAP tối ưu query phân tích: scan, filter, GROUP BY, SUM/AVG/COUNT trên nhiều dòng. Columnar storage giảm đọc cột không dùng và thường hỗ trợ nén tốt. Vectorized execution xử lý theo batch giá trị, giảm overhead mỗi dòng; SIMD là một kỹ thuật có thể dùng, không phải mọi query đều biến thành một CPU instruction.",
        "Ví dụ (1,2,3,4) + (5,6,7,8) = (6,8,10,12) minh họa tính song song theo lane nếu phần cứng/kiểu/phép toán hỗ trợ. Distributed query chia phần việc qua node rồi kết hợp; chi phí network và skew vẫn còn như buổi 9. Tôi không suy tốc độ cả engine từ một phép cộng vector.",
        "OLTP phục vụ giao dịch ngắn, cập nhật một số ít dòng với yêu cầu nhất quán; OLAP phục vụ analyst, BI và ứng dụng phân tích đọc nhiều dòng. Freshness, response time và schema phụ thuộc triển khai: OLAP có thể gần thời gian thực, OLTP replica cũng có thể lag. Các mốc mili giây hay giây/phút chỉ có nghĩa cùng query, concurrency, phần cứng và SLA."
      ],
      "headers": [
        "Thành phần",
        "Vai trò / đánh đổi"
      ],
      "rows": [
        [
          "OLTP",
          "Ứng dụng; INSERT/UPDATE/DELETE và lookup; PostgreSQL/MySQL, các mô hình khác tùy hệ"
        ],
        [
          "OLAP",
          "BI/analytics; scan/aggregate; ClickHouse, Pinot, Druid, Doris, BigQuery"
        ],
        [
          "So sánh đúng",
          "Mục tiêu, thao tác, số dòng/query, freshness, schema, latency, concurrency và chi phí"
        ]
      ]
    },
    {
      "title": "Hai engine, các ưu tiên phục vụ",
      "lead": "Dashboard nội bộ và bảng thống kê cho hàng nghìn khách đồng thời có workload khác nhau.",
      "body": [
        "ClickHouse là database column-oriented cho phân tích. Node dùng execution vectorized/song song, đọc column data parts/blocks và các lớp cache tùy cấu hình. Storage có thể ở disk hoặc object storage theo deployment; sơ đồ có S3 không có nghĩa mọi cài đặt bắt buộc dùng S3.",
        "ClickHouse Keeper hoặc ZooKeeper cung cấp coordination cho replication tương ứng; giữ metadata phối hợp, không giữ toàn bộ dữ liệu bảng. Replicas fetch data parts theo cơ chế engine; coordinator không làm mọi node chứa cùng dữ liệu vì các shard có thể khác nhau. Update/delete có hỗ trợ tùy engine/phiên bản, nhưng phải đánh giá workload thay vì dùng như OLTP cập nhật từng dòng liên tục.",
        "Pinot tổ chức table/segment theo schema: dimension cho lọc/nhóm, metric cho aggregate và timestamp theo cấu hình. Real-time table ingest stream; offline table nhận segment dựng từ batch; hybrid kết hợp hai phía. Broker dùng time boundary để chọn phần offline/real-time tránh đếm chồng theo thiết kế; boundary không tự sửa mọi duplicate bên trong dữ liệu.",
        "Tôi dùng ClickHouse làm ví dụ cho SQL phân tích/log và Pinot cho analytics phục vụ người dùng concurrency cao. Đây là trọng tâm phổ biến, không phải hạn chế tuyệt đối: so latency, throughput, freshness, join/query complexity, update và chi phí trên workload của bạn. Không lấy “giây” và “mili giây” làm bảng xếp hạng sản phẩm."
      ],
      "headers": [
        "Thành phần",
        "Vai trò / đánh đổi"
      ],
      "rows": [
        [
          "ClickHouse",
          "Column parts, vectorized engine; SQL analytics, log; Keeper/ZooKeeper tùy cấu hình"
        ],
        [
          "Pinot REALTIME",
          "Consume stream → segment; đo ingestion lag và query load"
        ],
        [
          "Pinot OFFLINE / hybrid",
          "Upload batch segments; boundary phối hợp lịch sử với luồng mới"
        ]
      ]
    },
    {
      "title": "🧬 Feature cần quá khứ đúng thời điểm",
      "lead": "Mô hình dự đoán lúc 10:00 không được nhìn thấy feature được tạo từ sự kiện 10:05.",
      "body": [
        "Giao dịch gian lận có transaction_id, user_id, timestamp, amount, currency, device/channel và quốc gia. Model còn cần feature hành vi như avg_tx_30d, số lần thất bại giờ qua hoặc thiết bị mới. Cùng tên feature chưa bảo đảm cùng cách tính: SQL lọc SETTLED, xử lý NULL và làm tròn cho 45.73; code serving khác cho 46; đội khác có thể tính ra 47.10. Đó là ví dụ lệch logic, không phải ba kết quả cùng đúng của một hợp đồng.",
        "Feature store quản lý định nghĩa/metadata và truy xuất feature, kết nối pipeline với offline history cho training và online values cho serving. <strong class=\"hl-yellow\">Point-in-time join</strong> chọn giá trị có timestamp phù hợp trước hoặc tại thời điểm dòng training, trong TTL. Cần xét thêm lúc dữ liệu thực sự sẵn có và late backfill để mô phỏng điều model có thể biết; timestamp đúng đơn thuần chưa loại hết leakage.",
        "Lab: dòng training 10:00 chọn feature 09:55 = 45.73 với TTL 10 phút; không chọn 10:05 = 47.10. TTL 2 phút làm giá trị cũ hết hạn, trả thiếu thay vì lén dùng tương lai. Online lookup trong fixture tại lúc sau 10:05 trả latest; đó là nhu cầu serving hiện tại, không phải API tái dựng lịch sử.",
        "Bổ sung Feast: Entity khai user_id, FeatureView khai schema/TTL/source; get_historical_features tạo dữ liệu training theo thời điểm; materialization nạp feature vào online store; get_online_features lookup theo entity. Registry dùng chung giúp khám phá/tái dùng nhưng không tự bảo đảm filter, rounding, NULL và freshness nhất quán. Tôi vẫn kiểm logic offline/online và giám sát độ trễ cập nhật.",
        "Feature static có thể cập nhật ngày/tuần; contextual như avg_tx_30d có thể chọn 1–5 phút; critical như số lần lỗi trong phiên có thể cần mỗi event. Đây là lựa chọn theo tác động và chi phí, không phải SLA mặc định. Lookup dưới 10 ms là mục tiêu tình huống cần đo toàn đường đi, không phải lời hứa của mọi feature store."
      ],
      "headers": [
        "Thành phần",
        "Vai trò / đánh đổi"
      ],
      "rows": [
        [
          "Offline",
          "History + timestamp; point-in-time retrieval cho training"
        ],
        [
          "Online",
          "Latest theo entity; latency và freshness theo backend/pipeline"
        ],
        [
          "Hợp đồng feature",
          "Logic, filter, NULL, rounding, event/available time, TTL, owner"
        ],
        [
          "Kiểm chất lượng",
          "So offline/online, stale/missing, leakage và drift theo mục đích"
        ]
      ]
    }
  ],
  "summaryTitle": "Từ bảng tới câu trả lời đáng tin",
  "summary": [
    "Chốt grain và định nghĩa metric trước khi viết aggregate.",
    "Chuẩn hóa bảo toàn dữ kiện; dimensional model phục vụ câu hỏi.",
    "SCD là chính sách lịch sử: key, interval và cột current phải rõ.",
    "Vault tích hợp/provenance; mart và conformed dimension cung cấp ý nghĩa chung.",
    "Point-in-time và freshness là hai điều kiện khác nhau; feature store không thay kiểm logic."
  ],
  "checkTitle": "✅ Tự kiểm",
  "checks": [
    "Tôi giải thích được 1NF/2NF/3NF trên fixture order mà không đổi quantity.",
    "Tôi biết vì sao cộng doanh thu đúng nhưng cộng inventory qua ngày sai ý nghĩa.",
    "Tôi chọn được SCD và join fact vào đúng version.",
    "Tôi phân biệt hub/link/satellite và conformed dimension.",
    "Tôi loại feature tương lai và xử lý trường hợp TTL không còn giá trị."
  ],
  "quizTitle": "Quiz · kiểm ý nghĩa của kết quả",
  "practiceTitle": "🧪 Bài tập cuối buổi",
  "practice": [
    "Tách fixture order thành bốn bảng, ghi primary/foreign key và join lại. Kiểm quantity 1,2,1 cùng tổng doanh thu 140 khi giá bán là 50/20/50.",
    "Thiết kế fact sales ở grain order line, dimension customer Type 2 và dimDate. Viết query doanh thu theo vùng tại thời điểm bán, không theo vùng hiện tại.",
    "Dùng lab SCD qua GBP → USD → EUR. Ghi rõ câu hỏi nào trả lời được với Type 1, 2, 3 và 6.",
    "Cho training row 10:00, feature 09:55 và 10:05. Chọn giá trị theo TTL 10 rồi 2 phút; bổ sung available_time vào thiết kế để xử lý late backfill."
  ],
  "answerTitle": "Gợi ý đối chiếu",
  "answer": "Order 1001 có 50 × 1 + 20 × 2 = 90; order 1002 có 50, tổng 140. Fact nối customer_sk đã resolve tại lúc bán hoặc business key kèm event_time trong [valid_from, valid_to). Type 1 mất GBP; Type 3 sau EUR chỉ giữ EUR/USD; Type 2 giữ cả ba version; Type 6 có lịch sử và cột current EUR trên mọi version. Training lấy 45.73 với TTL 10; TTL 2 trả thiếu, không lấy 47.10.",
  "next": "Buổi 12 nối các bước thành pipeline có lịch chạy, dependency, retry và cổng chất lượng trước khi công bố.",
  "demo": "MÔ PHỎNG TRONG TRÌNH DUYỆT",
  "loopNote": "Vùng sáng theo một chuỗi giải thích rồi lặp lại; lịch sử và dữ liệu mẫu luôn còn trong bảng.",
  "quiz": [
    {
      "topicId": "b11-1",
      "q": "Warehouse có tự tạo single source of truth không?",
      "opts": [
        "Có, chỉ cần gom file",
        "Có, nếu đủ lớn",
        "Không; cần định nghĩa, owner và quy tắc chung",
        "Chỉ cần dashboard"
      ],
      "a": 2,
      "ex": "Gom dữ liệu không tự giải quyết hai định nghĩa doanh thu khác nhau."
    },
    {
      "topicId": "b11-2",
      "q": "Chuẩn hóa được phép đổi quantity 1 thành 2 không?",
      "opts": [
        "Có khi tách bảng",
        "Có nếu dùng khóa mới",
        "Có khi sang 3NF",
        "Không, phải bảo toàn dữ kiện"
      ],
      "a": 3,
      "ex": "Chuẩn hóa đổi cấu trúc và phụ thuộc, không đổi nghiệp vụ đã ghi."
    },
    {
      "topicId": "b11-3",
      "q": "Inventory 100,80,120 qua ba ngày: tồn cuối là?",
      "opts": [
        "120",
        "300",
        "100",
        "80"
      ],
      "a": 0,
      "ex": "120 là snapshot cuối. 100 là trung bình nếu các snapshot cách đều; 300 không phải tồn cuối."
    },
    {
      "topicId": "b11-4",
      "q": "Điều gì dễ làm SUM nhân đôi sau join?",
      "opts": [
        "Tên bảng dài",
        "Một fact ghép nhiều version dimension ngoài ý định",
        "Dùng dimDate",
        "Có primary key đúng"
      ],
      "a": 1,
      "ex": "Kiểm cardinality và điều kiện thời gian hoặc surrogate key của version."
    },
    {
      "topicId": "b11-5",
      "q": "Type 2 nhận diện một phiên bản bằng gì?",
      "opts": [
        "Chỉ customer natural key",
        "Tên khách",
        "Surrogate key và interval hiệu lực",
        "Cờ xóa của giao dịch"
      ],
      "a": 2,
      "ex": "Natural key lặp giữa version; mỗi version cần định danh riêng và khoảng hiệu lực rõ."
    },
    {
      "topicId": "b11-6",
      "q": "Trong Data Vault, quan hệ đơn–khách thuộc đâu?",
      "opts": [
        "Hub product",
        "Satellite price",
        "Chỉ dimDate",
        "Link order_customer"
      ],
      "a": 3,
      "ex": "Link ghi quan hệ giữa các business entity; satellite ghi thuộc tính/lịch sử."
    },
    {
      "topicId": "b11-7",
      "q": "Kimball tích hợp mart nhờ gì?",
      "opts": [
        "Conformed dimensions và định nghĩa fact chung",
        "Union tùy ý mọi bảng",
        "Một màu dashboard",
        "Bỏ hết key"
      ],
      "a": 0,
      "ex": "Khả năng tích hợp đến từ ý nghĩa và dimension thống nhất."
    },
    {
      "topicId": "b11-8",
      "q": "Vectorized execution có nghĩa mọi query dùng một instruction?",
      "opts": [
        "Đúng",
        "Không; xử lý batch, SIMD tùy operator/phần cứng",
        "Chỉ trên Pinot",
        "Chỉ trên ClickHouse"
      ],
      "a": 1,
      "ex": "Vectorized rộng hơn SIMD; không hứa cả query thành một instruction."
    },
    {
      "topicId": "b11-9",
      "q": "Pinot hybrid time boundary giúp gì?",
      "opts": [
        "Xóa mọi duplicate tự động",
        "Biến OLTP thành OLAP",
        "Phân chia phần thời gian offline/real-time khi query",
        "Bỏ schema"
      ],
      "a": 2,
      "ex": "Boundary tránh chồng phần thời gian giữa hai phía theo thiết kế, không thay dedup mọi record."
    },
    {
      "topicId": "b11-10",
      "q": "Training 10:00, TTL 2 phút; feature 09:55 và 10:05: chọn gì?",
      "opts": [
        "09:55",
        "10:05",
        "Trung bình hai giá trị",
        "Không có giá trị hợp lệ"
      ],
      "a": 3,
      "ex": "09:55 quá TTL, 10:05 ở tương lai. Cần trả missing và có chính sách xử lý rõ."
    }
  ],
  "labs": {
    "aggregateTitle": "Cùng SUM, khác ý nghĩa",
    "aggregateHelp": "Đổi measure và phép gộp. Với doanh thu, mục tiêu là tổng qua các ngày; với inventory, mục tiêu là tồn cuối hoặc tồn trung bình của các snapshot cách đều.",
    "measure": "Đại lượng",
    "measures": [
      "Doanh thu",
      "Tồn kho"
    ],
    "method": "Phép gộp",
    "methods": [
      "SUM",
      "AVG",
      "LAST"
    ],
    "result": "Kết quả",
    "valid": "Phù hợp câu hỏi đã nêu",
    "invalid": "Không trả lời đúng câu hỏi đã nêu",
    "values": "Các giá trị",
    "scdTitle": "Phòng lịch sử SCD",
    "scdHelp": "Khách 123456 · Peter Pan. Chọn policy, rồi xem một hoặc hai lần đổi currency ưu tiên. valid_to là biên loại trừ. Cột current_currency ở Type 6 được cập nhật cả trên dòng lịch sử.",
    "type": "SCD type",
    "changes": "Số lần thay đổi",
    "changeLabels": [
      "GBP → USD",
      "GBP → USD → EUR"
    ],
    "scdHeaders": [
      "Bảng",
      "SK",
      "Currency lịch sử/được giữ",
      "Current",
      "Previous",
      "From",
      "To (loại trừ)"
    ],
    "scdNote": "Type 0/1/3 không giữ interval trong mô hình này. Type 4 chuyển version cũ sang bảng history. Cờ current có thể suy từ To = ∞ ở các type có interval; không suy ra sự kiện xóa khách.",
    "featureTitle": "Feature nào tồn tại ở thời điểm dự đoán?",
    "featureHelp": "Dòng training ở 10:00. Historical lookup áp timestamp và TTL; online latest mô phỏng thời điểm phục vụ sau 10:05. Đổi TTL để thấy missing là một kết quả hợp lệ.",
    "mode": "Cách truy xuất",
    "modes": [
      "Historical tại 10:00",
      "Online latest sau 10:05"
    ],
    "ttl": "TTL lịch sử (phút)",
    "selected": "Giá trị được chọn",
    "missing": "Thiếu",
    "leakage": "Dùng giá trị này cho training 10:00 sẽ nhìn tương lai.",
    "safe": "Không chọn feature tương lai; còn phải kiểm available time khi có backfill.",
    "latestNote": "Online latest không dùng TTL lịch sử trong lab; expiry thật của online backend là một chính sách riêng.",
    "featureHeaders": [
      "Feature time",
      "avg_tx_30d",
      "So với dòng training"
    ],
    "past": "Quá khứ",
    "future": "Tương lai",
    "flowTitle": "Từ dữ liệu tới quyết định",
    "flowSteps": [
      [
        "Raw → tích hợp",
        "Giữ key, timestamp và provenance."
      ],
      [
        "Fact / dimension",
        "Chốt grain, measure, version và quan hệ join."
      ],
      [
        "BI / ML",
        "BI đọc metric; ML lấy feature theo thời điểm và hợp đồng."
      ]
    ],
    "sqlTitle": "SQL kiểm grain và join SCD",
    "sqlNote": "SQL minh họa dùng bảng/CTE fixture khai báo đầy đủ. Khoảng hiệu lực nửa mở giúp giao dịch tại biên chỉ chọn một version; trong hệ thật phải kiểm không có khoảng trống/chồng lấp.",
    "feastTitle": "Bổ sung · vòng đời Feast",
    "feastNote": "Mẫu API theo Feast 0.40, không phải project Feast hoàn chỉnh. Cần pandas, feast, feature_store.yaml cấu hình offline/online backend và file user_features.parquet gồm user_id, event_timestamp, avg_tx_30d. Registry phải apply trước retrieval/materialization. Không chạy Feast trong trình duyệt."
  }
};

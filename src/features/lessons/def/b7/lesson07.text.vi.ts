export const VI = {
  badge: "TUẦN 7 · DEF",
  title: "Ingestion — hành trình bắt đầu",
  cover: "Bìa",
  eyebrow: "PHẦN III / ĐƯỜNG ĐI CỦA DỮ LIỆU",
  hero: "Một đơn hàng.<br /><em>Nhiều nơi đang đợi.</em>",
  intro: "Tại quầy thanh toán, một đơn hàng vừa trở thành một dòng dữ liệu. Ở nơi khác, đội phân tích chờ doanh thu, kho chờ số lượng, còn hệ thống chống gian lận chờ một tín hiệu. Ba đích đến, một cơ sở dữ liệu bận rộn. Tôi sẽ theo dấu đơn hàng ra khỏi đó; bạn sẽ thấy việc chuyển bản ghi chỉ là điểm khởi đầu. Giữ được ý nghĩa của nó qua chậm trễ và sự cố mới là phần khó.",
  premise: "Cửa hàng trong câu chuyện và dữ liệu trong các lab là giả lập. Các mô hình chạy ngay trong trình duyệt; không kết nối Kafka hoặc cơ sở dữ liệu thật.",
  start: "Bắt đầu hành trình",
  jump: "Đến lab crash / replay",
  meta: "10 chương · 3 lab tương tác · VI / EN",
  readyTitle: "Trước khi theo dấu đơn hàng",
  readyLead: "Bạn có thể bắt đầu ở đây trước khi học các tuần 1–6. Không cần giải tích. Tôi chỉ cần bạn phân biệt bản ghi, khóa, thay đổi và tiến độ đã lưu.",
  terms: [
    [
      "Bản ghi / Record",
      "Một đơn vị dữ liệu, chẳng hạn đơn hàng có id và amount. JSON biểu diễn trường–giá trị; null biểu diễn giá trị rỗng."
    ],
    [
      "INSERT · UPDATE · DELETE",
      "Thêm một dòng, sửa dòng đã có, xóa dòng. Xóa thật làm dòng biến mất; xóa mềm giữ dòng và đổi cờ is_deleted."
    ],
    [
      "Khóa / Key",
      "Giá trị dùng để nhận diện hoặc gom các sự kiện liên quan. order_id giữ các thay đổi của cùng đơn hàng trên một đường đi khi quy tắc định tuyến không đổi."
    ],
    [
      "Thông lượng / Throughput · độ trễ / Latency",
      "Thông lượng là lượng xử lý mỗi đơn vị thời gian; độ trễ là thời gian một bản ghi đi từ đầu đến cuối. Nhiều MB/s không đồng nghĩa mỗi bản ghi đến nhanh."
    ],
    [
      "Offset · commit · retry",
      "Offset là vị trí trong một partition. Commit lưu mốc đọc lại; retry thử một thao tác lần nữa. Mốc đã lưu và tác động đã thực hiện có thể lệch nhau."
    ]
  ],
  visuals: {
    "label": "GHI CHÚ BẰNG HÌNH",
    "example": "Kiến trúc minh họa",
    "journeyTitle": "Theo đơn hàng 42 qua nền tảng dữ liệu",
    "journeyHelp": "Theo đơn hàng sáng lên qua nền tảng. Minh họa lặp lại từ nguồn; hình cho thấy trách nhiệm, không đo thời gian xử lý.",
    "journeySteps": [
        "Ứng dụng commit đơn hàng 42 trong PostgreSQL.",
        "Job ingestion đưa bản ghi vào staging để kiểm tra.",
        "Kho dữ liệu giữ đầu vào và tạo các tổng hợp dùng chung.",
        "Data mart Sales tổ chức dữ liệu theo miền nghiệp vụ.",
        "Báo cáo đã có thể dùng đơn hàng. Độ mới phụ thuộc cả hành trình."
    ],
    "stages": [
        "Nguồn",
        "Ingestion / staging",
        "Kho dữ liệu",
        "Data mart Sales",
        "Báo cáo"
    ],
    "details": [
        "order_id = 42",
        "Kiểm tra + nạp",
        "Raw / summary / metadata",
        "Định nghĩa bán hàng",
        "Người dùng nghiệp vụ"
    ],
    "airflowRole": "Lên lịch và giám sát các job",
    "airflowNote": "Airflow là ví dụ công cụ điều phối job theo lịch. Luồng điều khiển nằm trên luồng dữ liệu; nó không đóng vai trò event broker.",
    "storageTitle": "Cùng bản ghi, khác những giá trị nằm cạnh nhau.",
    "storageHelp": "Chọn cách lưu trữ. Các bản ghi tự sắp lại và giá trị amount cùng sáng lên. Ví dụ dùng nhóm 2 dòng; kích thước row group của Parquet và stripe của ORC có thể cấu hình.",
    "layouts": [
        "Theo dòng · minh họa CSV",
        "Theo cột · minh họa ORC",
        "Nhóm dòng · minh họa Parquet"
    ],
    "storageNote": "Tô sáng: amount. Bố trí theo cột đặt các giá trị cùng cột cạnh nhau; hình không khẳng định truy vấn chỉ đọc đúng những byte này.",
    "fields": [
        "Tên",
        "Số tiền",
        "Tháng"
    ],
    "fanTitle": "Một thay đổi đã commit, ba góc nhìn ở đích",
    "fanHelp": "Cùng thay đổi có thể cập nhật tìm kiếm, cache và kho dữ liệu. Mỗi nhánh cần ánh xạ và xử lý INSERT / UPDATE / DELETE riêng.",
    "log": "Transaction log",
    "search": "Chỉ mục tìm kiếm",
    "cache": "Bộ nhớ đệm",
    "warehouse": "Kho phân tích",
    "ecosystemTitle": "Kafka ở giữa, công cụ ở xung quanh",
    "ecosystemHelp": "Chuyển giữa ba trường hợp sử dụng. Theo các tín hiệu chuyển động để thấy hệ thống nào đọc, ghi hoặc sao chép bản ghi.",
    "source": "Cơ sở dữ liệu nguồn",
    "target": "Đích",
    "cluster1": "Kafka · cụm 1",
    "cluster2": "Kafka · cụm 2",
    "streams": "Ứng dụng Kafka Streams",
    "streamsRole": "Đọc → biến đổi → ghi vào cụm 1",
    "mirror": "MirrorMaker",
    "mirrorRole": "Cụm 1 → cụm 2",
    "connectSource": "Kafka Connect · Source",
    "connectSink": "Kafka Connect · Sink",
    "workers": "Connector chạy trong Connect worker, bên ngoài broker.",
    "offsetTitle": "Mốc commit trỏ tới vị trí tiếp theo",
    "offsetHelp": "Xem offset 0 và 1 được xử lý trước khi lưu tiến độ. Mỗi vòng mở lại minh họa; năm bản ghi còn lưu không bị xóa.",
    "offsetSteps": [
        "Có năm bản ghi còn lưu; vị trí đọc tiếp và commit đều là 0.",
        "Xử lý offset 0. Vị trí đọc tiếp là 1; commit vẫn là 0.",
        "Xử lý offset 1. Vị trí đọc tiếp là 2; commit vẫn là 0.",
        "Commit vị trí 2. Khôi phục bắt đầu tại 2; lag theo commit là 5 − 2 = 3."
    ],
    "readPosition": "Vị trí đọc tiếp",
    "committed": "Đã commit",
    "logEnd": "Cuối log",
    "processed": "Đã xử lý",
    "pending": "Chưa xử lý",
    "replicaTitle": "Một leader hỏng. Các partition khác giữ leader của chúng.",
    "replicaHelp": "Xem ví dụ bốn broker mất rồi thay leader P0. Replication factor là 3 mỗi partition; các follower còn lại là replica ISR đủ điều kiện và bầu chọn sạch thành công. Sau đó hình chạy lại ví dụ.",
    "replicaSteps": [
        "Mọi broker đang hoạt động. P0 do broker 1 dẫn dắt, P1 do broker 2, P2 do broker 3.",
        "Broker 1 ngừng hoạt động. P0 tạm thời không có leader khả dụng; P1 và P2 giữ leader cũ.",
        "Broker 2 được bầu làm leader P0. Bản ghi đã có vẫn còn trên replica này; không leader nào khác đổi."
    ],
    "broker": "Broker",
    "leader": "Leader",
    "follower": "Follower",
    "offline": "Ngừng hoạt động",
    "electing": "P0: đang chờ bầu leader",
    "cdcTitle": "Xem cập nhật trong database trở thành sự kiện Kafka",
    "cdcHelp": "Một cập nhật PostgreSQL đã commit đi qua hệ thống theo vòng lặp. Đường rút gọn này bắt đầu sau snapshot ban đầu; database khác có log hoặc change stream khác.",
    "cdcStages": [
        "PostgreSQL",
        "WAL / logical decoding",
        "Debezium",
        "Apache Kafka",
        "Sink → đích"
    ],
    "cdcDetails": [
        "42: amount 10 → 12",
        "Cập nhật đã commit",
        "Source connector",
        "orders · key 42",
        "Áp dụng amount = 12"
    ],
    "cdcSteps": [
        "Đơn hàng 42 đổi amount từ 10 thành 12 trong giao dịch đã commit.",
        "Logical decoding đưa ra thay đổi đã commit từ WAL của PostgreSQL.",
        "Debezium source connector tạo sự kiện thay đổi có khóa dòng.",
        "Kafka giữ sự kiện; các consumer độc lập có thể đọc nó.",
        "Sink đã cấu hình áp dụng thay đổi vào đích bằng khóa và thao tác."
    ],
    "cdcNote": "Định dạng sự kiện đã được rút gọn. Connector thật còn xử lý snapshot, vị trí nguồn, schema và yêu cầu riêng của database.",
    "loopLabel": "Minh họa tự lặp",
    "staticLabel": "Giảm chuyển động · hình đầy đủ",
    "ecosystemCases": [
        "Connect · chuyển dữ liệu",
        "Streams · biến đổi",
        "MirrorMaker · sao chép cụm"
    ],
    "storageReading": "Các giá trị amount được đọc cùng nhau",
    "storageGrouping": "Bản ghi sắp theo bố trí đã chọn",
    "replay": "Chạy lại từ nguồn",
    "partitionOrder": "Thứ tự chỉ trong từng partition",
    "callouts": [
        "Ingestion đưa dữ liệu vào nền tảng; chất lượng và độ tin cậy thuộc trách nhiệm đó.",
        "Chỉ định dạng file chưa đủ để biết dữ liệu có cấu trúc hay không.",
        "Hard DELETE không để lại dòng nào cho timestamp polling tìm thấy.",
        "Kafka tách nhịp tạo dữ liệu khỏi nhịp đọc của từng consumer group.",
        "Kafka giữ thứ tự trong một partition, không bảo đảm thứ tự toàn cục giữa các partition.",
        "Offset đã commit lưu vị trí khôi phục tiếp theo, không phải bản ghi vừa xử lý xong.",
        "Đọc không xóa dữ liệu. Mỗi consumer group giữ tiến độ riêng.",
        "acks=all liên quan ISR của partition, không phải mọi broker trong cụm.",
        "Producer idempotence không ngăn consumer lặp lại tác động ở hệ thống ngoài.",
        "Compaction không đánh lại offset và không xóa tức thì mọi giá trị cũ."
    ],
    "keyIdea": "Giữ rõ ranh giới này"
},
  chapters: [
    {
      title: "Đơn hàng rời hệ thống nguồn",
      lead: "Dòng dữ liệu đã tồn tại, nhưng báo cáo vẫn chưa nhìn thấy nó. Giữa hai nơi là một chuỗi trách nhiệm.",
      body: [
        "Hệ thống nguồn là nơi dữ liệu được sinh ra hoặc lưu giữ trước khi vào nền tảng dữ liệu: ứng dụng vận hành, cơ sở dữ liệu, API, tệp hoặc nhà cung cấp bên thứ ba. Ingestion thu nhận từ những nguồn này rồi chuyển vào nền tảng để xử lý tiếp; hiệu quả và độ tin cậy đều là yêu cầu của tầng này.",
        "Trong kiến trúc minh họa, staging nhận dữ liệu, kiểm tra hợp lệ và biến đổi cơ bản. Warehouse tập trung dữ liệu có cấu trúc: raw giữ chi tiết đầu vào, summary chứa kết quả tổng hợp, metadata mô tả dữ liệu. Kho tập trung hướng tới một nguồn số liệu thống nhất, nhưng chỉ đáng tin nếu định nghĩa và chất lượng được quản lý.",
        "Data mart cắt dữ liệu theo miền nghiệp vụ: Purchasing, Sales, Inventory. Từ đó nhà phân tích, người dùng nghiệp vụ và nhà khoa học dữ liệu làm analytics, reporting hoặc mining. Sơ đồ là một cách tổ chức trách nhiệm; ingestion không bắt buộc mọi nền tảng phải có đúng từng hộp này.",
        "Tôi dừng lại ở nguồn trước khi chọn công cụ. GIGO — đầu vào sai dẫn đến đầu ra sai — xuất hiện dưới dạng dữ liệu không chính xác, thiếu hoặc không nhất quán. Nguồn chậm giới hạn tốc độ lấy dữ liệu; CPU và bộ nhớ dành cho xuất dữ liệu vẫn phải chia sẻ với giao dịch đang chạy. Khối lượng và định dạng quyết định cách tích hợp: tệp CSV/log có thể nhận theo lô, cơ sở dữ liệu có thể dùng CDC."
      ],
      cards: [
        {
          title: "🧭 Governance xuyên suốt",
          text: "Quality kiểm tính chính xác, đầy đủ, nhất quán. Security bảo vệ dữ liệu. Access control giới hạn quyền theo vai trò. Lineage nối nguồn với các phép biến đổi. Metadata management lưu định nghĩa, kiểu và tài liệu. Các trách nhiệm này đi qua mọi tầng, không đợi đến khi có dashboard."
        }
      ],
      table: {
        headers: [],
        rows: []
      },
      flow: [
        "Nguồn: DB / API / tệp",
        "Ingestion → staging",
        "Warehouse: raw / summary / metadata",
        "Marts: Purchasing / Sales / Inventory",
        "Người dùng: analytics / reporting / mining"
      ],
      figures: []
    },
    {
      title: "Những nguồn dữ liệu, những chiếc đồng hồ",
      lead: "Một tệp cuối ngày và một lần thanh toán vừa hoàn tất không mang cùng lời hứa về độ mới.",
      body: [
        "Tệp là một tập dữ liệu được lưu trong hệ thống máy tính. CSV, JSON, XML, Parquet, ảnh và PDF có thể nằm trên máy chủ nội bộ hoặc cloud storage. Một hệ thống xuất tệp mỗi giờ hay mỗi ngày; tác vụ ingestion nạp chúng theo lô vào lake hoặc warehouse. Micro-batch chia lô nhỏ hơn và chạy thường xuyên hơn để giảm thời gian chờ. Đây là mẫu phổ biến, không phải quy luật rằng mọi tệp đều phải chờ lịch dài.",
        "Dữ liệu có cấu trúc dùng schema rõ với hàng và cột, dễ truy vấn nhưng thay schema cần quản lý. Bán cấu trúc như JSON/XML có tên trường, phân cấp và metadata, vẫn linh hoạt về hình dạng. Phi cấu trúc như văn bản tự do, ảnh, video, audio hoặc raw log không có schema phân tích cố định; cần trích xuất thêm trước khi phân tích. Định dạng tệp không đồng nghĩa loại dữ liệu: CSV và Parquet thường chứa dữ liệu có cấu trúc; log cũng có thể là JSON.",
        "OLTP phục vụ hoạt động hàng ngày: ngân hàng, thương mại điện tử, ERP; đặt hàng, cập nhật hồ sơ, thanh toán, quản lý tồn kho. Theo đường đi cụ thể: người dùng → API → DB OLTP → bảng Orders / Users / Payment → transaction → CDC → Kafka. OLAP tập trung dữ liệu lịch sử để phân tích, báo cáo và ML: nguồn / Kafka → ETL hoặc ELT → warehouse → bảng, BI/dashboard và mô hình ML. ETL biến đổi trước khi nạp; ELT nạp trước rồi biến đổi tại đích.",
        "Log ghi lại sự kiện hệ thống để điều tra hoặc dùng cho phân tích và ML. System log ghi hoạt động hệ thống; application log ghi hành vi ứng dụng; error/debug log ghi lỗi và chi tiết gỡ lỗi; audit log ghi thay đổi; security log ghi truy cập hay đe dọa; network log ghi lưu lượng. Container Docker, server và thiết bị IoT đều có thể là nơi phát log. Một dòng log cần timestamp và ngữ cảnh để có nghĩa, không chỉ cần được chuyển đi."
      ],
      cards: [
        {
          title: "🗂 Ba cách đặt cùng dữ liệu lên đĩa",
          text: "Với ba dòng (a, 1, 2020-01), (b, 2, 2020-02), (c, 3, 2020-03), layout theo hàng đặt toàn bộ dòng cạnh nhau. Layout theo cột đặt a/b/c cùng nhau, rồi 1/2/3, rồi các ngày. Mô hình nhóm 2 dòng đặt các cột của a/b trong một nhóm, c trong nhóm cuối chỉ có 1 dòng. CSV là ví dụ tuần tự theo hàng; ORC và Parquet đều là định dạng dạng cột chia thành stripe/row group. Parquet không phải một loại nằm ngoài columnar."
        },
        {
          title: "Chọn dữ liệu cần đọc",
          text: "Đọc đủ một bản ghi thường thuận với bố trí theo hàng; quét ít cột trên nhiều dòng thường thuận với columnar, giảm I/O và hỗ trợ nén. WHERE là lọc hàng, SELECT là chọn cột, nhưng CSV không tự có index để lọc nhanh. Bố trí vật lý, index và workload cùng quyết định hiệu năng; không suy từ tên OLTP/OLAP ra một cam kết tốc độ."
        }
      ],
      table: {
        headers: [
          "Trục so sánh",
          "OLTP",
          "OLAP"
        ],
        rows: [
          [
            "Mục đích",
            "Nhiều giao dịch vận hành",
            "Phân tích khối lượng lớn, thường có lịch sử"
          ],
          [
            "Truy cập",
            "SELECT ngắn cùng INSERT / UPDATE / DELETE",
            "Chủ yếu SELECT, quét và tổng hợp"
          ],
          [
            "Độ phức tạp truy vấn điển hình",
            "Tra cứu / thay đổi hẹp",
            "Join / tổng hợp phức tạp"
          ],
          [
            "Thời gian minh họa",
            "Mili giây",
            "Giây, phút hoặc giờ tùy truy vấn"
          ],
          [
            "Ví dụ",
            "Đặt chỗ trực tuyến, thương mại điện tử",
            "Analytics, BI, ML"
          ]
        ]
      },
      flow: [],
      figures: [
        {
          title: "Cùng ba dòng, khác thứ tự lưu",
          text: "Bố trí minh họa, không phải byte encoding. Nhóm cuối nhỏ hơn vẫn giữ đủ dữ liệu.",
          headers: [
            "Bố trí",
            "Thứ tự minh họa"
          ],
          rows: [
            [
              "Row / CSV",
              "a | 1 | 2020-01 → b | 2 | 2020-02 → c | 3 | 2020-03"
            ],
            [
              "Column / ORC",
              "a | b | c → 1 | 2 | 3 → 2020-01 | 2020-02 | 2020-03"
            ],
            [
              "Row group / Parquet",
              "[a | b ; 1 | 2 ; 2020-01 | 2020-02] → [c ; 3 ; 2020-03]"
            ]
          ]
        }
      ]
    },
    {
      title: "Bắt được thay đổi, kể cả lần xóa",
      lead: "Đơn hàng đã biến mất khỏi bảng nguồn. Một truy vấn chỉ nhìn những dòng còn tồn tại có thể không biết nó từng ở đó.",
      body: [
        "CDC — Change Data Capture — theo dõi INSERT, UPDATE và DELETE, đưa phần thay đổi sang đích thay vì đọc lại toàn bảng ở mỗi lần chạy. Ba cách phổ biến là polling timestamp, trigger và đọc transaction log. Sơ đồ fan-out minh họa: source DB → transaction log → CDC → Elastic / Redis / Snowflake. Một luồng thay đổi có thể phục vụ tìm kiếm, cache và kho phân tích; mỗi đích vẫn cần cách áp dụng INSERT/UPDATE/DELETE phù hợp. Chúng khác nhau ở chỗ quan sát thay đổi và ở chi phí đặt lên nguồn.",
        "Polling cần cột LAST_MODIFIED hoặc LAST_UPDATED được cập nhật đáng tin mỗi lần sửa. Truy vấn các dòng sau mốc đã đọc; index trên cột này có thể tránh quét toàn bảng. Nếu is_deleted đổi false → true và timestamp cũng đổi, dòng xóa mềm vẫn đi qua. Với DELETE thật, không còn dòng để truy vấn. Tôi cũng không coi timestamp là đồng hồ hoàn hảo: giá trị trùng, độ chính xác thấp hoặc giao dịch commit muộn đòi hỏi mốc phụ/đọc chồng và khử trùng để tránh bỏ sót.",
        "Trigger là thủ tục tự chạy khi sự kiện xảy ra. Thiết kế minh họa gắn trigger cho mỗi INSERT / UPDATE / DELETE trên mỗi bảng; nhiều DB cho phép nhiều trigger cho cùng sự kiện, nhưng chi tiết phụ thuộc DB. Trigger ghi thay đổi vào bảng riêng như audit_log, từ đó pipeline đọc ra. Nó bắt được cả xóa thật và được nhiều DB hỗ trợ; đổi lại là thêm lần ghi, tăng công việc trong giao dịch và khó gỡ lỗi khi trigger phức tạp hoặc kích hoạt dây chuyền.",
        "Log-based CDC đọc nhật ký giao dịch đã có để lấy thay đổi, thường giảm tác động so với quét bảng hay thêm audit writes và hỗ trợ độ trễ thấp. MySQL binlog, PostgreSQL WAL và Oracle redo không cùng định dạng; connector phải hiểu từng DB. Schema là bản thiết kế bảng, cột và kiểu dữ liệu. CDC theo log thường không cần thêm cột timestamp vào bảng nghiệp vụ, nhưng vẫn có yêu cầu cấu hình/quyền/logging và có thể cần thông tin nhận diện dòng.",
        "Ít tác động không có nghĩa là không có tải: giải mã, truyền dữ liệu, snapshot đầu kỳ và giữ log đều tốn tài nguyên. Connector phải tôn trọng ranh giới transaction. Với luồng thay đổi đã commit, transaction bị rollback không nên trở thành một thay đổi nghiệp vụ ở đích; nếu nghiệp vụ bù trừ bằng một transaction mới sau commit, đó là sự kiện mới cần áp dụng. Đừng mặc định mọi rollback ở nguồn đều bắt đích “đảo ngược” một sự kiện đã phát."
      ],
      cards: [],
      table: {
        headers: [
          "Cách quan sát",
          "Bắt DELETE thật?",
          "Cái giá / điều kiện"
        ],
        rows: [
          [
            "Timestamp polling",
            "Không, nếu chỉ truy vấn bảng hiện tại",
            "Cột cập nhật tin cậy; index; xử lý mốc trùng"
          ],
          [
            "Trigger + audit table",
            "Có, khi cấu hình đúng",
            "Thêm lần ghi; quản lý trigger, thứ tự và schema"
          ],
          [
            "Transaction log",
            "Có, khi connector/log có đủ thông tin",
            "Quyền và retention log; decoder đặc thù DB; quản lý transaction"
          ]
        ]
      },
      flow: [],
      figures: [
        {
          title: "Dòng 1122 vẫn còn sau xóa mềm",
          text: "Ví dụ đổi cả tên/email và cờ xóa nhưng giữ cùng ID. Dòng thứ hai có Last Modified mới hơn: polling tìm được dòng với is_deleted=true. Các tên/email chỉ là giá trị minh họa; đây không phải lịch sử một người thật.",
          headers: [
            "ID",
            "First Name",
            "Last Name",
            "Email",
            "Last Modified",
            "is_deleted"
          ],
          rows: [
            [
              "1122",
              "Michael",
              "Jackson",
              "Michael1122@gmail.com",
              "2022-10-31T12:11:07",
              "false"
            ],
            [
              "1122",
              "George",
              "Clooney",
              "George.Clooney@gmail.com",
              "2023-10-13T02:17:08",
              "true"
            ]
          ]
        },
        {
          title: "Trigger → Shadow Table → Vendor Table",
          text: "Trong ví dụ, Shadow Table ở nguồn ghi ID thay đổi, Table Name, RowID, Timestamp và Operation. ID của audit event nhận diện một lần thay đổi, còn RowID nhận diện dòng nghiệp vụ; một dòng nghiệp vụ có thể có nhiều audit event. Pipeline cần mapping khóa nhất quán để tìm dòng đích; shadow không tự chứa đủ before/after cho mọi thiết kế. Muốn replay không mất chi tiết, cần lưu payload cần thiết, nhất là khi dòng đã xóa. Hình đích minh họa tên/email; nhãn cột “Timestamp” trên các giá trị email là lỗi nhãn, không phải kiểu thời gian.",
          headers: [
            "ID",
            "Table Name",
            "RowID",
            "Timestamp",
            "Operation"
          ],
          rows: [
            [
              "1",
              "Vendor",
              "101",
              "11/02/21 12:15pm",
              "Insert"
            ],
            [
              "2",
              "Vendor",
              "127",
              "11/02/21 12:16pm",
              "Update"
            ],
            [
              "3",
              "Vendor",
              "142",
              "11/02/21 12:17pm",
              "Delete"
            ]
          ]
        }
      ]
    },
    {
      title: "Một sự kiện, nhiều đích đến",
      lead: "Đội phân tích, marketing và chống gian lận cùng kéo dữ liệu đơn hàng. Cơ sở dữ liệu bán hàng bắt đầu chậm ngay lúc cửa hàng đông nhất.",
      body: [
        "Ban đầu mỗi đội nhận một bản xuất hàng ngày từ production DB. Khi lưu lượng tăng, các truy vấn xuất dữ liệu cạnh tranh với giao dịch trực tiếp; báo cáo đến muộn và các kết nối riêng lẻ khó bảo trì. Kafka cung cấp một nhật ký sự kiện dùng chung, tách nhịp sinh dữ liệu khỏi nhịp đọc của các ứng dụng.",
        "Apache Kafka là nền tảng event streaming phân tán: publish, lưu trữ và làm nền cho xử lý dòng bản ghi khi chúng được tạo. Producer đẩy bản ghi vào broker; consumer chủ động kéo bản ghi khi sẵn sàng. Cluster là nhóm broker lưu và quản lý topic/partition. Có thể hình dung ba producer, ba broker giữ các partition 0/1 của topic A/B/C và ba consumer. Nhiều broker giúp phân bố và dự phòng; muốn dự phòng dữ liệu phải có replica phù hợp, không chỉ thêm một server.",
        "Kafka nối database, cache, microservice, data lake, search system, ML, monitoring, analytics, web và IoT. Đây là các trường hợp kết nối hoặc xử lý sự kiện; Kafka không tự thay thế tất cả những hệ thống đó. Từng nhóm consumer có thể dùng cùng một luồng cho mục đích khác nhau.",
        "Ở kiến trúc cũ, ZooKeeper điều phối broker và metadata; dữ liệu vẫn đi producer → broker → consumer, không đi xuyên ZooKeeper. KRaft đưa việc quản lý metadata vào Kafka bằng controller quorum. Kafka 4.0 đã bỏ chế độ ZooKeeper; KRaft đã tồn tại trước đó. Tôi giữ hai mốc để bạn đọc được sơ đồ cũ mà không dựng nhầm kiến trúc mới."
      ],
      cards: [
        {
          title: "🛰 Kafka core và phần mở rộng",
          text: "Core gồm giao thức producer/consumer, broker, topic và partition. Kafka Connect Source lấy dữ liệu ngoài vào cluster 1; Connect Sink đưa bản ghi từ Kafka sang database, warehouse hoặc storage. Connector chạy trong worker của Connect, không phải tính năng tự chạy trong mọi broker."
        },
        {
          title: "Streams và MirrorMaker",
          text: "Kafka Streams là thư viện nhúng trong ứng dụng để lọc, biến đổi hay tổng hợp dữ liệu đọc từ Kafka và ghi kết quả. MirrorMaker sao chép giữa cluster 1 và cluster 2 cho phân phối nhiều vùng, dự phòng hoặc phục hồi thảm họa. Sao chép liên cluster là việc riêng với replication của partition trong cùng cluster; độ trễ và cấu hình vẫn cần theo dõi."
        }
      ],
      table: {
        headers: [],
        rows: []
      },
      flow: [
        "Nguồn → Connect Source",
        "Kafka cluster 1",
        "Ứng dụng Kafka Streams ↔ cluster 1",
        "Connect Sink → đích",
        "MirrorMaker: cluster 1 → cluster 2"
      ],
      figures: []
    },
    {
      title: "Topic tách thành những làn song song",
      lead: "Dồn mọi sự kiện vào một hàng duy nhất giữ được thứ tự đơn giản, nhưng cũng dồn công việc vào một đường đọc.",
      body: [
        "Topic là tên logic tổ chức dòng bản ghi. Có thể đặt theo loại sự kiện, như user_created; theo thực thể/miền, như orders; hoặc tách môi trường dev / test / prod. Chọn tên cũng là chọn hợp đồng: ai được ghi, schema nào được chấp nhận và ai được đọc. Tên có chữ prod không tự tạo ranh giới bảo mật.",
        "Mỗi topic chia thành partition. Trong mỗi partition, bản ghi được append vào cuối log theo thứ tự offset. Các partition cho phép xử lý song song, phân bố lên nhiều máy và tăng throughput khi còn tài nguyên. Kafka bảo toàn thứ tự log trong từng partition; không tạo thứ tự toàn cục giữa mọi partition.",
        "Producer quyết định topic, partition và cách gửi tin cậy. Consumer đăng ký/đọc dữ liệu và theo dõi vị trí; broker lưu và phục vụ các partition. Offset nhận diện vị trí trong một partition, không phải ID nghiệp vụ toàn hệ thống: P0:0 và P1:0 là hai vị trí khác nhau. Với sáu thuật ngữ này, bạn đã có đủ từ vựng để đọc sơ đồ cluster."
      ],
      cards: [],
      table: {
        headers: [
          "Thuật ngữ",
          "Trách nhiệm",
          "Dấu vết của đơn hàng"
        ],
        rows: [
          [
            "Topic",
            "Nhóm logic",
            "orders"
          ],
          [
            "Partition",
            "Log có thứ tự, đơn vị song song",
            "P0, P1, P2"
          ],
          [
            "Offset",
            "Vị trí cục bộ trong partition",
            "P1:0 → P1:1"
          ],
          [
            "Producer",
            "Ứng dụng gửi",
            "Dịch vụ / connector xuất sự kiện"
          ],
          [
            "Consumer",
            "Ứng dụng đọc",
            "Bộ xử lý chống gian lận"
          ],
          [
            "Broker",
            "Server lưu và phục vụ",
            "Một thành viên của cluster"
          ]
        ]
      },
      flow: [],
      figures: [
        {
          title: "Hai loại sự kiện qua ba service",
          text: "Service 1 phát E1 vào Topic 1. Service 2 đọc E1 rồi phát E2 vào Topic 2. Service 3 đọc cả E1 lẫn E2. Consumer có thể đồng thời là producer cho bước tiếp theo; mỗi loại sự kiện có topic riêng, không có nghĩa toàn hệ thống chỉ có một consumer.",
          headers: [
            "Service",
            "Đọc",
            "Ghi"
          ],
          rows: [
            [
              "1",
              "—",
              "E1 → Topic 1"
            ],
            [
              "2",
              "E1 ← Topic 1",
              "E2 → Topic 2"
            ],
            [
              "3",
              "E1 ← Topic 1; E2 ← Topic 2",
              "—"
            ]
          ]
        },
        {
          title: "Một cluster hay nhiều cluster?",
          text: "Tách tên topic dev/test/prod và tách cluster là hai mức khác nhau. Bản đồ quyết định dưới đây là các lý do cân nhắc, không phải quy tắc rằng cứ nhiều cluster là an toàn hay rẻ hơn. Cần đối chiếu quyền, tài nguyên, vận hành và chi phí thực tế. Ví dụ workload thử nghiệm tải lớn có thể cạnh tranh CPU/network với thanh toán production dù khác topic. ACL và quota giúp kiểm soát trong cluster chung; nhu cầu miền lỗi, lịch bảo trì hoặc ranh giới tuân thủ riêng có thể dẫn tới cluster riêng. Data locality đặt xử lý gần dữ liệu; fine-tuning chọn cấu hình cho workload; domain ownership giao trách nhiệm vận hành rõ.",
          headers: [
            "Lựa chọn / nhánh",
            "Lý do trong bản đồ"
          ],
          rows: [
            [
              "Một cluster chung",
              "Không có ràng buộc kỹ thuật buộc tách; global event hub; kỳ vọng giảm tổng chi phí sở hữu"
            ],
            [
              "Nhiều cluster: tách vận hành",
              "Maintainability; mức trọng yếu workload; tuân thủ quy định"
            ],
            [
              "Nhiều cluster: tách tenant",
              "Cách ly tài nguyên; ranh giới bảo mật; tách logic"
            ],
            [
              "Nhiều cluster: tối ưu use case",
              "Tinh chỉnh; data locality; hệ chuyên dụng; domain ownership"
            ]
          ]
        }
      ]
    },
    {
      title: "Thêm làn không tạo tốc độ miễn phí",
      lead: "Một reader đang bận, các máy còn lại đứng yên. Chia log có thể mở đường song song, nhưng mỗi partition mới cũng có chi phí.",
      body: [
        "Với P0, P1, P2, ba consumer A, B, C có thể xử lý các partition độc lập. Một hàng duy nhất buộc reader đi lần lượt; nhiều partition mở thêm công việc đồng thời. Khi mở rộng cluster, có thể tái phân bố: ban đầu máy 1 giữ P0–P7; sau đó máy 1 giữ P0–P3, máy 2 giữ P4–P7. Việc phân bố lại cần được thực hiện bằng công cụ/chính sách vận hành, không nên giả định thêm máy là mọi partition lập tức tự di chuyển.",
        "Số partition phụ thuộc thông lượng cần đạt, mức song song của consumer và overhead của broker/controller. Ví dụ 5–10 MB/s mỗi partition là một ước lượng minh họa chưa gắn benchmark, không phải định mức Kafka. Disk I/O, mạng, kích thước bản ghi, batching, nén, replication và tốc độ xử lý đều ảnh hưởng. Nếu muốn 16 consumer cùng có việc trong một consumer group đọc một topic, cần ít nhất 16 partition; nhiều hơn vẫn có thể gây áp lực metadata, file và điều phối.",
        "Producer có key thường dùng hash của key để chọn partition. Cùng key đi cùng partition chỉ khi số partition, serializer và partitioner liên quan giữ ổn định; custom partitioner hoặc chỉ định partition trực tiếp có thể đổi hành vi. Tăng số partition có thể đổi ánh xạ key. Không có key, client phân phối tải: Java producer Kafka 4.0 dùng lựa chọn sticky/adaptive tùy cấu hình, không phải lúc nào cũng round-robin. Lab dùng toy hash và vòng tròn rõ ràng để bạn nhìn cơ chế, không giả làm client thật.",
        "Offset cho phép theo dõi tiến độ, tiếp tục sau lỗi và đọc lại dữ liệu còn được giữ. Consumer position là mốc đọc tiếp trong bộ nhớ; committed offset là mốc khôi phục đã lưu. Trong ví dụ log có bản ghi 0–4, log end offset bằng 5; đã xử lý 0 và 1, commit 2, thì độ trễ theo mốc commit là 5 − 2 = 3 vị trí. Consumer có thể đã fetch xa hơn nhưng chưa xử lý xong. Transaction control record cũng chiếm offset; compaction để lại khoảng trống. Vì vậy chênh lệch offset không luôn bằng số bản ghi nghiệp vụ đang đợi."
      ],
      cards: [],
      table: {
        headers: [
          "Trước / sau",
          "Bố trí",
          "Ý nghĩa"
        ],
        rows: [
          [
            "Một máy",
            "Máy 1: P0 P1 P2 P3 P4 P5 P6 P7",
            "Tài nguyên tập trung"
          ],
          [
            "Hai máy sau phân bố lại",
            "Máy 1: P0 P1 P2 P3; máy 2: P4 P5 P6 P7",
            "Thêm tài nguyên, thêm chi phí vận hành"
          ],
          [
            "Mốc đọc ví dụ",
            "Log end 5; commit 2; lag 3",
            "Commit lưu vị trí tiếp theo, không phải vị trí vừa xong"
          ]
        ]
      },
      flow: [],
      figures: []
    },
    {
      title: "Những người đọc chia nhau công việc",
      lead: "Đội phân tích thêm người, nhưng chỉ có ba partition. Người thứ tư đến nơi và không nhận được một làn nào.",
      body: [
        "Consumer group là tập consumer cùng chia việc đọc. Với mô hình consumer group thông thường, tại một thời điểm mỗi partition được gán cho tối đa một consumer trong nhóm; một consumer có thể nhận nhiều partition. Ba partition và bốn consumer cho tối đa ba consumer có partition, một consumer nhàn rỗi. Khi thành viên tham gia/rời nhóm, assignment có thể thay đổi qua rebalance.",
        "Nhóm Analytics và nhóm Fraud có assignment và committed offsets riêng. Analytics đọc xong không làm Fraud mất dữ liệu. Cơ chế đó vừa chia tải bên trong nhóm vừa cho phép nhiều nhóm dùng lại cùng một luồng. Nó không xóa bản ghi khi có người đọc.",
        "Tôi muốn bạn giữ một ranh giới: độc quyền assignment không có nghĩa là mỗi tác động chỉ xảy ra một lần. Consumer cũ có thể đã ghi ra đích rồi chết trước commit; consumer mới đọc lại từ mốc cũ. Lab tiếp theo sẽ làm hiện ra khoảng trống giữa “đã xử lý” và “đã lưu tiến độ”."
      ],
      cards: [
        {
          title: "🎛 Thử ngay trong lab",
          text: "Giữ 3 partition, chọn 4 consumer và gửi đủ 6 sự kiện. Chuyển Analytics sang Fraud để thấy mốc độc lập. Bấm Đọc + commit chỉ tăng tiến độ nhóm đang chọn; Lùi quay lại toàn bộ snapshot. Đổi cấu hình bắt đầu một thí nghiệm mới."
        }
      ],
      table: {
        headers: [],
        rows: []
      },
      flow: [],
      figures: []
    },
    {
      title: "Một broker biến mất",
      lead: "Producer đã nhận thành công. Ngay sau đó, máy đang giữ leader ngừng hoạt động. Lời hứa lúc gửi giờ phụ thuộc vào những bản sao còn lại.",
      body: [
        "Replication factor là số replica của mỗi partition. Ví dụ factor 3 đặt một leader và hai follower trên các broker khác nhau. Trong mô hình đọc thông thường, producer ghi leader và consumer đọc leader; follower đồng bộ log. Một số cấu hình cho phép consumer đọc replica gần hơn, nên không nên biến “mọi read luôn qua leader” thành quy luật tuyệt đối.",
        "ISR — In-Sync Replicas — là tập replica theo kịp leader trong giới hạn đồng bộ cho phép, không nhất thiết giống nhau ở từng nano giây. Khi leader hỏng, một replica đủ điều kiện có thể được bầu lên; cơ chế điều khiển cụ thể tùy phiên bản/cấu hình. Trong mô hình clean election minh họa, chọn follower còn trong ISR. Nếu không có replica phù hợp, dừng phục vụ an toàn tốt hơn là tự hứa dữ liệu không mất.",
        "acks=0 không chờ xác nhận broker. acks=1 chờ leader ghi, nhưng leader có thể chết trước khi follower nhận bản ghi. acks=all đợi các replica trong ISR xác nhận, không phải mọi broker trong cluster. min.insync.replicas đặt mức ISR tối thiểu chấp nhận ghi với acks=all. Ví dụ replication factor 3, min.insync.replicas=2: còn hai ISR có thể ghi; chỉ còn một ISR thì ghi bị từ chối. Đây là đánh đổi khả dụng để giữ điều kiện độ bền.",
        "Giữ replica trên miền lỗi khác nhau, theo dõi ISR và lag, cấu hình election và giữ đủ log giúp giảm rủi ro. Mất tất cả bản sao thích hợp, chấp nhận replica cũ hoặc retention hết hạn vẫn có thể làm mất dữ liệu cần đọc. Nhiều broker không tạo ra lời hứa “không bao giờ mất”."
      ],
      cards: [],
      table: {
        headers: [
          "Trạng thái của P0",
          "Broker 1",
          "Broker 2",
          "Broker 3"
        ],
        rows: [
          [
            "Trước lỗi",
            "Leader: 0, 1, 2",
            "Follower ISR: 0, 1, 2",
            "Follower ISR: 0, 1, 2"
          ],
          [
            "Leader 1 hỏng",
            "Ngừng hoạt động",
            "Leader mới: 0, 1, 2",
            "Follower ISR: 0, 1, 2"
          ],
          [
            "Nếu chỉ còn broker 2",
            "Ngừng hoạt động",
            "ISR còn 1; từ chối ghi khi min ISR = 2",
            "Ngừng hoạt động"
          ]
        ]
      },
      flow: [],
      figures: [
        {
          title: "Ba partition trên bốn broker",
          text: "Mỗi partition có 3 replica trong sơ đồ này. Khi broker 1 hỏng, broker 2 nhận leader P0; leader P1 vẫn ở broker 2 và leader P2 vẫn ở broker 3. Broker giữ được nhiều partition, và một broker có thể là leader của nhiều partition. Failover P0 không đòi bầu lại mọi leader. L = leader, F = follower.",
          headers: [
            "Broker",
            "Trước lỗi",
            "Sau broker 1 hỏng"
          ],
          rows: [
            [
              "1",
              "P0 L; P2 F",
              "Offline"
            ],
            [
              "2",
              "P0 F; P1 L",
              "P0 L; P1 L"
            ],
            [
              "3",
              "P0 F; P1 F; P2 L",
              "P0 F; P1 F; P2 L"
            ],
            [
              "4",
              "P1 F; P2 F",
              "P1 F; P2 F"
            ]
          ]
        }
      ]
    },
    {
      title: "Khoảnh khắc giữa xử lý và commit",
      lead: "Số dư đã tăng 10. Mốc tiến độ vẫn chưa nhúc nhích. Một lần khởi động lại có thể biến đúng một sự kiện thành hai lần cộng.",
      body: [
        "At-most-once chấp nhận có thể không xử lý, nhưng không thử lại theo cơ chế minh họa. Consumer commit trước rồi mới xử lý: chết sau commit và trước tác động thì lần sau bỏ qua bản ghi. Telemetry/log ít quan trọng đôi khi chọn mất một vài điểm thay vì chi phí retry, nhưng quyết định đó phải dựa trên yêu cầu nghiệp vụ.",
        "At-least-once xử lý trước, commit sau và đọc lại khi lỗi. Nếu chết sau tác động nhưng trước commit, tác động có thể lặp. Producer chờ acknowledgment và retry có thể tạo bản ghi trùng nếu không có idempotence; lỗi consumer là một cửa sổ trùng khác. Tôi không suy delivery semantics đầu-cuối chỉ từ acks, cũng không gọi một cấu hình là mặc định cho mọi client, connector và sink.",
        "Producer idempotence loại bỏ bản ghi trùng do retry được nhận diện trong phạm vi giao thức producer; nó không tự nhận biết hai sự kiện nghiệp vụ khác nhau nhưng cùng order_id, cũng không ngăn một consumer gọi dịch vụ thanh toán hai lần. Với Java producer Kafka 4.0, idempotence cần acks=all, retries lớn hơn 0 và max.in.flight.requests.per.connection không quá 5. Một lần gửi timeout vẫn cần được xử lý theo giao thức và kết quả thực tế.",
        "Exactly-once nói về tác động trong một ranh giới xác định. Kafka transaction có thể ghép bản ghi output và committed input offsets trong một đơn vị nguyên tử; consumer downstream dùng read_committed để không nhìn output của transaction bị abort. Kafka Streams có chế độ xử lý dựa trên cơ chế này. Với database hoặc API ngoài Kafka, cần cơ chế tương ứng: transaction ghép dedup marker với tác động, idempotency key được sink thực thi, hoặc phối hợp commit thích hợp. Chỉ bật acks=all và enable.idempotence=true không chứng minh tác động bên ngoài exactly-once.",
        "Trong lab, sự kiện duy nhất e1 cộng 10 vào số dư ban đầu 0. Sink có bảo vệ giả lập lưu event ID và tác động cùng nhau một cách bền vững/nguyên tử; lần lặp bị bỏ qua. Đây là giả định mô hình, không phải một Set trong trình duyệt có thể chống crash cho hệ thống thanh toán thật. So sánh cả lỗi trước xử lý lẫn sau tác động để thấy mất dữ liệu và trùng dữ liệu là hai phía của cùng khoảng trống."
      ],
      cards: [
        {
          title: "⚡ Ba nơi cần hỏi về “một lần”",
          text: "Bản ghi được ghi vào Kafka bao nhiêu lần? Consumer thực thi bao nhiêu lần? Tác động nghiệp vụ được commit bao nhiêu lần? Một câu trả lời cho tầng producer không thay được hai câu còn lại."
        }
      ],
      table: {
        headers: [
          "Chính sách",
          "Thứ tự minh họa",
          "Khi sự cố rơi vào khoảng trống"
        ],
        rows: [
          [
            "At-most-once",
            "Commit → xử lý",
            "Có thể bỏ sót tác động"
          ],
          [
            "At-least-once",
            "Xử lý → commit",
            "Có thể lặp tác động"
          ],
          [
            "Exactly-once effects trong phạm vi",
            "Ghép tác động + tiến độ hoặc sink khử trùng nguyên tử",
            "Thực thi có thể lặp, tác động đã commit chỉ tính một lần"
          ]
        ]
      },
      flow: [],
      figures: []
    },
    {
      title: "Nhật ký giữ lại; Debezium phiên dịch",
      lead: "Người đọc đã đi qua, nhưng bản ghi chưa biến mất. Một nhóm khác ngày mai có thể cần quay lại từ đầu.",
      body: [
        "Retention quyết định log còn giữ gì, độc lập với việc consumer đã đọc. Với delete policy, ví dụ giữ 7 ngày hoặc giới hạn 1 GB mỗi partition là lựa chọn cấu hình, không phải mặc định áp cho mọi hệ thống. Việc dọn diễn ra theo log segment và lịch kiểm; không phải từng bản ghi biến mất ngay tại một mốc tuyệt đối. Consumer chậm hơn thời gian giữ có thể mất khả năng replay từ mốc cũ.",
        "Compaction giữ giá trị mới nhất theo key khi cleaner xử lý phần log đủ điều kiện. Nó không renumber offset và không lập tức xóa mọi bản cũ ngay lúc UPDATE đến. Tombstone — key với value null — đánh dấu xóa; được giữ một thời gian để consumer có thể thấy rồi có thể bị dọn theo cấu hình. Giữ lịch sử theo thời gian và giữ trạng thái cuối theo key trả lời hai nhu cầu khác nhau; có thể cấu hình cả compact và delete với hệ quả cần cân nhắc.",
        "Debezium là nền tảng CDC mã nguồn mở. Connector bắt thay đổi mức dòng, thường đọc log/replication stream như MySQL binlog, PostgreSQL WAL, Oracle redo, rồi tạo change event có cấu trúc tương tự giữa các DB. Đường đi là nguồn → source connector Debezium → Kafka → sink connector → đích. Snapshot đầu kỳ có thể đọc trạng thái hiện có trước khi theo log. Nguồn khác nhau vẫn khác kiểu dữ liệu, khóa, transaction và cấu hình; “định dạng chung” không xóa khác biệt ngữ nghĩa.",
        "Ví dụ hợp đồng sự kiện bổ sung bên dưới dùng key order_id=42, op=u, before.amount=10 và after.amount=12. Đây là hình dạng rút gọn để giải thích update, không phải payload đầy đủ hay cấu hình connector chạy được. Delete phải giữ thông tin khóa để đích biết dòng nào cần bỏ. Downstream sink thường do Kafka Connect sink connector đảm nhiệm; không được mặc định mọi sink đều là Debezium hoặc mọi connector đều chạy cùng một kiểu worker.",
        "Danh sách nguồn cần nhận diện gồm MySQL, MariaDB, MongoDB, PostgreSQL, Oracle, SQL Server, Cassandra, Vitess, Spanner và Informix. Theo catalog Debezium 3.6 đã đối chiếu, Vitess và Informix được đánh dấu incubating; các tên còn lại có trang source connector nhưng yêu cầu, kiểu triển khai và mức hỗ trợ khác nhau. Ví dụ MongoDB dùng change streams và Spanner có change streams riêng; đừng áp mô hình đọc WAL PostgreSQL cho mọi DB. Trước một lab triển khai thật, phải chọn phiên bản DB/connector tương thích và đọc hướng dẫn của connector đó.",
        "Kafka’s Challenges là chủ đề được nêu trong lộ trình nguồn nhưng không có chương riêng; phần tổng hợp bổ sung này nối các vấn đề đã thấy: hot key làm một partition nghẽn, quá nhiều partition tăng overhead, consumer chậm tạo lag, retention hữu hạn chặn replay, schema thay đổi làm consumer lỗi, và retry có thể lặp tác động ngoài transaction. Theo dõi lag/ISR, quản lý schema và quyền truy cập, đo tải thực tế, chọn khóa và chính sách retry theo nghiệp vụ. Kafka giúp tách hệ thống, nhưng không xóa trách nhiệm vận hành."
      ],
      cards: [
        {
          title: "🧩 Theo dấu thay đổi đến tận đích",
          text: "Hãy đi qua INSERT → UPDATE → DELETE trong lab, rồi chọn từng cách CDC. Sau đó so lịch sử được giữ theo thời gian, dung lượng và compaction. Các kết quả là mô hình nhỏ có điều kiện rõ; trạng thái cuối đúng chưa chứng minh mọi sự kiện trung gian đã được giữ."
        }
      ],
      table: {
        headers: [],
        rows: []
      },
      flow: [
        "Database / transaction log",
        "Debezium source connector",
        "Kafka: change events",
        "Kafka Connect sink connector",
        "Đích: database / warehouse / storage"
      ],
      figures: []
    }
  ],
  summaryTitle: "Bản đồ mang theo",
  summary: [
    "Nguồn quyết định giới hạn chất lượng, tốc độ và cách tích hợp. Governance đi xuyên mọi tầng.",
    "File/batch và CDC theo thay đổi phục vụ nhịp dữ liệu khác nhau; timestamp polling có thể không thấy xóa thật.",
    "Topic tổ chức; partition tạo song song và thứ tự cục bộ; offset theo dõi vị trí. Group chia việc, mỗi group giữ tiến độ riêng.",
    "Replication và acks có điều kiện. Commit và tác động là hai việc; retry an toàn cần xử lý đúng ranh giới.",
    "Retention giữ lịch sử có hạn; compaction giữ trạng thái theo key. Debezium chuyển thay đổi nguồn thành sự kiện để downstream sử dụng."
  ],
  checkTitle: "Tự kiểm",
  checks: [
    "Tôi giải thích được staging, warehouse, mart và 5 trách nhiệm governance.",
    "Tôi phân biệt file format, cấu trúc dữ liệu và OLTP/OLAP.",
    "Tôi chỉ ra được vì sao polling timestamp không bắt hard delete.",
    "Tôi gán được 3 partition cho 4 consumer và đọc lag theo mốc tiếp theo.",
    "Tôi phân biệt producer idempotence với sink có tác động idempotent.",
    "Tôi giải thích được điều kiện failover, ISR, acks và min ISR.",
    "Tôi so được retention/compaction và lần theo nguồn → Debezium → sink."
  ],
  quizTitle: "Kiểm tra dấu vết",
  practiceTitle: "Dựng hợp đồng ingestion đầu tiên",
  practice: [
    "Vẽ pipeline cho một cửa hàng có file CSV mỗi ngày, DB Orders và log ứng dụng. Ghi nơi staging, dữ liệu raw, summary, metadata, marts và người dùng xuất hiện; gán kiểm chất lượng/quyền truy cập ở từng chặng.",
    "Thiết kế change event cho order_id=42: INSERT amount=10, UPDATE amount=12, DELETE. Ghi key, op, before/after và quy tắc xóa. Giải thích polling bỏ sót gì, trigger thêm việc gì, log connector cần điều kiện gì.",
    "Chọn 3 partition và 4 consumer. Gửi 6 sự kiện trong lab; ghi assignment, offset cuối và tiến độ của cả hai group. Đổi số partition rồi giải thích vì sao không được hứa key luôn giữ cùng partition.",
    "Chạy đủ 8 tổ hợp commit trước/sau × crash trước/sau tác động × sink thường/khử trùng. Ghi số dư cuối và điều kiện cho kết quả 0, 10, 20. Đề xuất kiểm thử cho sink thật; không dùng kết quả mô hình làm bằng chứng chạy production."
  ],
  practiceAnswer: "Mở tiêu chí đối chiếu",
  practiceGuide: "Bản thiết kế đạt khi không dùng CSV như đồng nghĩa với phi cấu trúc, không coi xóa thật là một dòng polling còn nhìn thấy, không để hai consumer cùng sở hữu một partition trong cùng nhóm của mô hình, và không suy exactly-once từ acks. Với crash trước tác động: commit trước cho 0, commit sau cho 10. Với crash sau tác động: commit trước cho 10, commit sau cho 20 nếu không khử trùng hoặc 10 nếu sink khử trùng nguyên tử.",
  next: "Tuần 8 sẽ tiếp tục ở storage: dữ liệu đã đến nơi, giờ phải quyết định nó sống dưới hình dạng nào.",
  diagramLabel: "Đường đi minh họa",
  codeTitle: "Change event rút gọn · JSON minh họa",
  lab: {
    "model": "MÔ PHỎNG GIẢNG DẠY",
    "back": "Lùi",
    "next": "Tiến",
    "play": "Chạy",
    "pause": "Dừng",
    "reset": "Đặt lại",
    "step": "Bước",
    "of": "/",
    "trace": "Toàn bộ dấu vết",
    "empty": "Chưa có bản ghi",
    "event": "Sự kiện",
    "partition": "Partition",
    "offset": "Offset",
    "consumer": "Consumer",
    "state": "Trạng thái",
    "balance": "Số dư",
    "commit": "Mốc commit tiếp theo",
    "action": "Diễn biến",
    "routingTitle": "Lab 1 · Định tuyến và nhóm đọc",
    "routingHelp": "Phân công minh họa: partition p thuộc consumer p modulo số consumer. Có key thì dùng tổng mã ký tự modulo số partition; không key thì luân phiên theo thứ tự gửi. Đây là thuật toán để học, không phải mặc định Kafka.",
    "keyed": "Có key",
    "unkeyed": "Không key · vòng tròn",
    "partitions": "Số partition",
    "consumers": "Consumer / nhóm",
    "group": "Nhóm đang đọc",
    "send": "Gửi sự kiện tiếp",
    "read": "Đọc + commit mỗi partition",
    "routingSteps": [
        "Log trống, hai nhóm chưa đọc.",
        "Producer append một sự kiện; offset tăng trong partition được chọn.",
        "Nhóm đang chọn đọc tối đa một bản ghi mỗi partition rồi commit mốc tiếp theo.",
        "Đã phát hết dữ liệu fixture; vẫn có thể đọc hoặc quay lại."
    ],
    "idle": "Consumer chưa được gán partition",
    "lag": "Lag theo commit",
    "routingNote": "Mỗi vòng ghi đủ 6 sự kiện, cho Analytics đọc tới cuối, rồi cho Fraud tiến độc lập. Các tab so 3 partition với 3 consumer, hoặc 4 consumer với một người rảnh. Vòng mới mở lại ví dụ; đọc Kafka không xóa bản ghi.",
    "crashTitle": "Lab 2 · Crash giữa tác động và commit",
    "crashHelp": "Một sự kiện e1 tại offset 0 cộng 10; log end = 1. Đổi thứ tự commit, cửa sổ lỗi và bảo vệ ở sink. Mỗi kịch bản lặp lại từ số dư 0. Sink có bảo vệ giả định lưu ID sự kiện cùng tác động một cách nguyên tử, bền vững.",
    "commitBefore": "Commit trước xử lý",
    "commitAfter": "Commit sau xử lý",
    "crashBefore": "Crash trước tác động",
    "crashAfter": "Crash sau tác động",
    "plain": "Sink cộng trực tiếp",
    "dedup": "Sink khử trùng nguyên tử",
    "crashSteps": [
        "Sẵn sàng: e1 chưa được xử lý; commit vẫn ở 0.",
        "Commit mốc 1 trước tác động.",
        "Áp dụng e1: cộng 10 và, nếu bật bảo vệ, lưu ID cùng tác động.",
        "Crash: tiến trình dừng; tác động và commit bền vững giữ nguyên.",
        "Khởi động lại từ mốc commit đã lưu.",
        "Đọc lại e1: cộng thêm 10.",
        "Đọc lại e1: ID đã áp dụng, không cộng thêm.",
        "Commit mốc 1 sau xử lý.",
        "Kết thúc: mốc 1 khiến e1 không còn được đọc lại."
    ],
    "cdcTitle": "Lab 3 · CDC và ký ức của log",
    "cdcHelp": "Một dòng id=42 trải qua ba thao tác đã commit theo vòng lặp. Polling chạy sau mỗi thao tác và updated_at luôn tăng. Mô hình không mô phỏng snapshot, rollback hay timestamp trùng nhau. Tab đổi phương pháp bắt thay đổi.",
    "cdcModes": [
        "Timestamp polling",
        "Trigger → audit log",
        "Transaction log"
    ],
    "cdcSteps": [
        "Nguồn rỗng.",
        "INSERT: id=42, amount=10, updated_at=1.",
        "UPDATE: amount=12, updated_at=2.",
        "DELETE thật: không còn dòng để polling."
    ],
    "sourceRow": "Bảng nguồn hiện tại",
    "captured": "Thay đổi đã bắt",
    "notCaptured": "Không bắt được",
    "missedDelete": "Polling không thấy DELETE: bản sao đích vẫn giữ amount=12 nếu không có cơ chế đối soát/xóa riêng.",
    "retentionTitle": "Thử chính sách giữ dữ liệu",
    "retentionModes": [
        "Giữ tất cả",
        "Theo thời gian",
        "Theo dung lượng",
        "Compaction đã chạy"
    ],
    "retentionHelp": "Fixture riêng: bốn bản ghi ở offset 0–3, mỗi bản 1 MB, tuổi lần lượt 9/6/2/1 ngày; key A/B/A/C. Giới hạn minh họa giữ tuổi ≤ 7 ngày hoặc hai bản mới nhất trong 2 MB. Đây là lọc bản ghi lý tưởng hóa; Kafka xóa theo segment, cleaner không chạy tức thì.",
    "retained": "Offset còn giữ",
    "retentionNote": "Compaction hoàn tất trên fixture này giữ bản mới nhất cho A/B/C: offset 1, 2, 3. Offset không được đánh lại. Fixture không có tombstone; quy tắc tombstone được giải thích trong chương.",
    "days": "Tuổi (ngày)",
    "key": "Key",
    "value": "Giá trị",
    "result": "Kết quả",
    "finished": "Hoàn tất",
    "topicLabels": {
        "def7.sources": "Nguồn dữ liệu",
        "def7.cdc": "CDC",
        "def7.kafka": "Kafka và consumer groups",
        "def7.delivery": "Độ bền và delivery",
        "def7.retention": "Retention và Debezium"
    },
    "speed": "Tốc độ",
    "extraConsumers": "Có key · dư consumer",
    "producer": "Producer",
    "groupProgress": "Mốc đọc độc lập theo nhóm",
    "effect": "Tác động bền vững",
    "durableId": "ID sự kiện bền vững",
    "crashOutcomes": [
        "Mất tác động · số dư 0",
        "Áp dụng một lần · số dư 10",
        "Tác động trùng · số dư 20"
    ],
    "retentionPhases": [
        "Log ban đầu · offset giữ nguyên",
        "Áp dụng chính sách đã chọn",
        "Chính sách hoàn tất · xem offset còn giữ"
    ],
    "pruned": "Đã loại",
    "pending": "Chờ xử lý",
    "applied": "Đã áp dụng"
},
  quiz: [
    {
      topicId: "def7.sources",
      q: "Một file CSV chứa bảng Orders có cột và kiểu rõ ràng. Nó thuộc nhóm nào?",
      opts: [
        "Có cấu trúc",
        "Luôn phi cấu trúc vì là file",
        "Không thể ingestion theo lô",
        "Chỉ dùng trong OLTP"
      ],
      a: 0,
      ex: "Hình thức lưu thành file không xóa cấu trúc hàng/cột. CSV có thể chứa dữ liệu có cấu trúc và được nạp theo lô."
    },
    {
      topicId: "def7.cdc",
      q: "Polling chỉ đọc dòng có LAST_UPDATED mới. Điều gì xảy ra khi một dòng bị DELETE thật?",
      opts: [
        "Luôn có sự kiện delete",
        "Dòng đã biến mất nên có thể không phát hiện xóa",
        "Index tạo lại dòng đã xóa",
        "Commit Kafka tự phát hiện xóa"
      ],
      a: 1,
      ex: "Không còn dòng để truy vấn. Xóa mềm với cờ và timestamp, audit/trigger, log CDC hoặc đối soát riêng mới cung cấp tín hiệu xóa."
    },
    {
      topicId: "def7.kafka",
      q: "Một nhóm có 4 consumer đọc topic 3 partition theo mô hình trong bài. Tối đa bao nhiêu consumer có partition?",
      opts: [
        "1",
        "2",
        "3",
        "4"
      ],
      a: 2,
      ex: "Mỗi partition gán cho tối đa một consumer trong nhóm. Có 3 partition nên tối đa 3 consumer có việc; consumer còn lại nhàn rỗi."
    },
    {
      topicId: "def7.kafka",
      q: "Log chứa offset 0–4; nhóm đã xử lý 0 và 1 rồi commit đúng. Log end, commit và lag theo commit là gì?",
      opts: [
        "4, 1, 3",
        "5, 2, 3",
        "5, 1, 4",
        "4, 2, 2"
      ],
      a: 1,
      ex: "Log end là 5; committed offset là vị trí đọc tiếp 2. Hiệu là 3. Ví dụ không có control record hay khoảng trống do compaction."
    },
    {
      topicId: "def7.delivery",
      q: "acks=all yêu cầu xác nhận từ đâu?",
      opts: [
        "Mọi broker trên toàn thế giới",
        "Chỉ consumer",
        "Các replica trong ISR, với điều kiện min.insync.replicas",
        "Chỉ một sink ngoài Kafka"
      ],
      a: 2,
      ex: "ISR thuộc partition đang ghi. min.insync.replicas đặt số ISR tối thiểu khi dùng acks=all; broker không chứa replica đó không cần xác nhận."
    },
    {
      topicId: "def7.delivery",
      q: "Consumer cộng 10 rồi chết trước commit. Replay ở sink không khử trùng cho số dư cuối nào, bắt đầu từ 0?",
      opts: [
        "0",
        "10",
        "20",
        "Không thể retry"
      ],
      a: 2,
      ex: "Tác động đầu đã tồn tại, offset chưa commit. Replay cộng thêm 10, thành 20. Producer idempotence không sửa tác động lặp này."
    },
    {
      topicId: "def7.delivery",
      q: "Điều nào đủ để kết luận một API thanh toán ngoài Kafka chỉ tạo một tác động?",
      opts: [
        "Chỉ bật producer idempotence",
        "Chỉ thêm consumer group",
        "Chỉ tăng retention",
        "Cần kiểm cơ chế idempotency/transaction của API và toàn đường xử lý"
      ],
      a: 3,
      ex: "Exactly-once cần ranh giới rõ. Kafka transaction không tự bao trùm tác động của một dịch vụ bên ngoài."
    },
    {
      topicId: "def7.retention",
      q: "Consumer đã đọc hết topic. Bản ghi bị xóa ngay không?",
      opts: [
        "Có, đọc là xóa",
        "Không; retention/compaction quản lý việc giữ dữ liệu",
        "Có nếu dùng Debezium",
        "Luôn giữ mãi"
      ],
      a: 1,
      ex: "Tiến độ đọc độc lập với retention. Các nhóm khác có thể đọc lại khi dữ liệu vẫn còn; không có lời hứa giữ mãi."
    }
  ]
};

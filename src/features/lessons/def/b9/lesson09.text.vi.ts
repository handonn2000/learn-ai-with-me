export const VI = {
  "badge": "BUỔI 9 · DEF",
  "title": "Batch — chia việc, giữ kết quả",
  "hero": "Cả cluster đang chờ<br /><em>một partition.</em>",
  "intro": "Báo cáo hằng đêm từng chạy xong trên một máy. Đêm nay, phần lớn worker đã xong nhưng một partition vẫn còn hàng trăm triệu dòng. Tôi sẽ theo job ấy từ kế hoạch chưa chạy tới những file cuối cùng. Bạn sẽ thấy vì sao thêm máy đôi khi chỉ làm hàng chờ đông hơn.",
  "meta": "10 chương · 3 lab · 10 câu quiz · VI / EN",
  "premise": "Các lab dùng dữ liệu giả lập trong trình duyệt, không chạy Spark và không đo hiệu năng cluster. Ví dụ API lấy Spark 3.5.7 làm mốc; cần môi trường và connector phù hợp để chạy bên ngoài.",
  "cover": "Bìa",
  "start": "Bắt đầu bài học",
  "readyTitle": "🧭 Ôn nền trước khi chia việc",
  "readyLead": "Không cần toán cao cấp. Bạn cần đọc được filter, nhóm theo khóa và phân biệt số dòng với số byte. Tôi giữ các ví dụ nhỏ để bạn có thể tự tính lại.",
  "terms": [
    [
      "Collection · function",
      "Python giữ nhiều bản ghi trong collection; một hàm nhận bản ghi rồi trả kết quả. Filter giữ dòng thỏa điều kiện, map biến đổi từng dòng."
    ],
    [
      "SQL · aggregate",
      "WHERE lọc dòng; GROUP BY gom theo khóa; SUM cộng trong mỗi nhóm. Join ghép bản ghi theo điều kiện, có thể nhân dòng khi khóa không duy nhất."
    ],
    [
      "Partition · business key",
      "Partition là phần dữ liệu để xử lý; business key nhận diện nghiệp vụ. Một khách hàng có thể xuất hiện ở nhiều input partition trước shuffle."
    ],
    [
      "Cardinality · memory",
      "Cardinality là số giá trị phân biệt, khác tần suất của một hot key. Giữ 1 triệu nhóm và giữ 1 nhóm rất lớn tạo hai kiểu áp lực khác nhau."
    ]
  ],
  "chapters": [
    {
      "title": "Một máy chạm giới hạn",
      "lead": "Log vẫn đến, nhưng thời gian dành cho báo cáo không dài thêm.",
      "body": [
        "Pipeline log có thể đi qua parse → đếm page view → báo cáo. Khi dữ liệu vượt storage, CPU hoặc RAM của một máy, bạn chia dữ liệu và công việc cho nhiều worker. Scheduler giao task, worker tính phần của mình rồi kết hợp kết quả. Đổi lại, hệ thống phải xử lý mạng chậm, máy hỏng và dữ liệu phân phối không đều.",
        "<strong class=\"hl-cyan\">Spark là engine tính toán phân tán</strong>, hỗ trợ batch, SQL, streaming, ML và graph; có API Python, Scala, Java và R với phạm vi khác nhau. Spark có thể giữ kết quả trong RAM khi có lợi. Không phải mọi dữ liệu đều vừa RAM và không phải mọi phép tính đều nhanh hơn khi phân tán.",
        "Tôi tách ba vai trò: storage giữ dữ liệu; Spark biến đổi; cluster manager cấp tài nguyên. HDFS hoặc S3 cung cấp lưu trữ, còn Delta/Iceberg bổ sung lớp bảng và metadata trên storage. Buổi 8 đã chọn nơi giữ dữ liệu; buổi này chọn cách xử lý mà không đánh mất ý nghĩa."
      ],
      "headers": [
        "Thành phần",
        "Cơ chế / quyết định"
      ],
      "rows": [
        [
          "Storage",
          "HDFS, object storage, database; đọc/ghi theo connector"
        ],
        [
          "Compute",
          "Spark: filter, join, aggregate; kết quả vẫn cần lưu"
        ],
        [
          "Resources",
          "Standalone, YARN hoặc Kubernetes cấp tài nguyên theo triển khai"
        ]
      ]
    },
    {
      "title": "⚙️ Từ chương trình tới task",
      "lead": "Viết ba transformation chưa có nghĩa ba lần quét dữ liệu đã xảy ra.",
      "body": [
        "<strong class=\"hl-cyan\">Driver</strong> chạy chương trình điều phối, giữ SparkContext và lập lịch. Cluster manager cấp tài nguyên; worker node chạy executor; executor thực thi task và có thể giữ cache. Partition là phần dữ liệu, task là công việc xử lý một partition trong một stage. Một executor có thể chạy nhiều task theo tài nguyên được cấp.",
        "<code>filter</code>, <code>select</code> và <code>groupBy</code> xây kế hoạch lười. Action như <code>count</code>, <code>show</code> hoặc ghi dữ liệu mới yêu cầu thực thi chuỗi tính toán. Một action có thể tạo nhiều job; schema inference hoặc lấy metadata cũng có thể đọc nguồn trước đó. Tôi đang nói về thực thi kế hoạch transformation, không hứa mọi lệnh trước action đều không có I/O.",
        "Application bao trùm nhiều job. Job chia thành stage; ranh giới shuffle tách các nhóm task phải trao đổi dữ liệu. Trong một stage, nhiều narrow transformation có thể nối nhau trên cùng partition. Chọn hai cách lọc trong lab: số dòng đi qua bước phân phối thay đổi, còn doanh thu phải giữ nguyên."
      ],
      "headers": [
        "Thành phần",
        "Cơ chế / quyết định"
      ],
      "rows": [
        [
          "1 → 2",
          "Viết code → ghi nhận transformation"
        ],
        [
          "3 → 4",
          "Action → phân tích và tối ưu kế hoạch"
        ],
        [
          "5 → 6",
          "Driver lập job/stage/task → nhận tài nguyên (có thể đã được cấp trước)"
        ],
        [
          "7 → 8",
          "Executor chạy task trên partition → trả hoặc ghi kết quả"
        ]
      ]
    },
    {
      "title": "Hai cách mô tả dữ liệu phân tán",
      "lead": "Một danh sách Python quen thuộc chưa cho optimizer biết cột nào là doanh thu.",
      "body": [
        "<strong class=\"hl-cyan\">RDD</strong> là collection bất biến được chia partition, kèm lineage mô tả cách tính. Mất partition thì Spark có thể tính lại từ lineage nếu nguồn và phép tính còn khả dụng. Lineage không phải bản backup vĩnh viễn của nguồn. SparkSession là cửa vào SQL/DataFrame; <code>spark.sparkContext</code> cho API RDD thấp hơn.",
        "<strong class=\"hl-cyan\">DataFrame</strong> có row, column và schema. Transformation trả DataFrame mới, không sửa đối tượng cũ tại chỗ; điều này không có nghĩa file nguồn bên ngoài bất biến. Các biểu thức có cấu trúc giúp Catalyst hiểu và tối ưu. RDD hợp thao tác thấp tầng tùy biến; tôi thường bắt đầu bằng DataFrame cho dữ liệu bảng.",
        "Ví dụ bên dưới tạo 2 partition, tính tổng 10 rồi tạo DataFrame bằng cả <code>createDataFrame</code> và <code>toDF</code>. <code>local[*]</code> dùng các core khả dụng trên máy local, không biến laptop thành cluster. Khi dữ liệu lớn, tránh collect toàn bộ về driver. CSV cần header/schema, JSON cần quy ước từng dòng hay multiline, JDBC cần driver và cấu hình nguồn."
      ],
      "headers": [
        "Thành phần",
        "Cơ chế / quyết định"
      ],
      "rows": [
        [
          "RDD",
          "Function trên object; kiểm soát thấp tầng; optimizer không hiểu mọi ý nghĩa hàm"
        ],
        [
          "DataFrame",
          "Row/column/schema; biểu thức SQL; hỗ trợ CSV, JSON, Parquet, JDBC"
        ],
        [
          "Fixture trả về",
          "VN = 150; US = 100 sau khi lọc paid; sort khi cần thứ tự ổn định"
        ]
      ]
    },
    {
      "title": "Object phải trở thành byte",
      "lead": "Một object nằm trong RAM của worker A không thể được đưa nguyên địa chỉ sang worker B.",
      "body": [
        "<strong class=\"hl-cyan\">Serialization</strong> mã hóa object thành byte; deserialization dựng lại dữ liệu ở bên nhận. Shuffle, truyền qua mạng và một số chế độ cache cần bước này. Chi phí gồm CPU mã hóa/giải mã, dung lượng RAM và số byte đi qua mạng. Serializer gọn hơn có thể giúp, nhưng phải đo trên kiểu dữ liệu thật.",
        "Với object JVM, Java serialization dễ dùng; Kryo thường gọn và nhanh hơn, đổi lại cần cấu hình và đôi khi đăng ký class. Thiết lập serializer trước khi tạo SparkContext; class đăng ký phải có trên classpath. Bộ đệm Kryo phải chứa được object lớn nhất, trong giới hạn cấu hình.",
        "Tôi không dùng nút Kryo như thuốc chữa mọi job Python: object Python có đường serialization riêng, còn DataFrame sử dụng biểu diễn nội bộ của Spark SQL. Đổi <code>spark.serializer</code> không tự thay mọi Python serialization và không bảo đảm giảm thời gian toàn job."
      ],
      "headers": [
        "Thành phần",
        "Cơ chế / quyết định"
      ],
      "rows": [
        [
          "Object → byte",
          "CPU mã hóa; kích thước byte quyết định một phần chi phí mạng"
        ],
        [
          "Byte → object",
          "CPU giải mã; bộ nhớ cho biểu diễn mới"
        ],
        [
          "Java / Kryo",
          "So sánh trong phạm vi JVM; cấu hình trước context, đo trước/sau"
        ]
      ]
    },
    {
      "title": "🧠 Giữ lại phần đáng dùng lại",
      "lead": "Action đầu tiên không thể đọc một cache chưa từng được tính.",
      "body": [
        "<code>cache()</code> và <code>persist()</code> đánh dấu dữ liệu để lưu khi tính. <strong class=\"hl-yellow\">Action đầu vật hóa các partition được đụng tới</strong>; action sau mới có thể tái dùng chúng. Count thường đụng toàn bộ; show có thể chỉ cần một phần. Unpersist giải phóng dữ liệu khi không còn dùng.",
        "Bảng năm mức dưới đây mô tả JVM RDD. MEMORY_ONLY thiếu chỗ thì partition không giữ được phải tính lại; MEMORY_AND_DISK có chỗ rơi xuống disk. Các mức SER đổi CPU giải mã lấy biểu diễn gọn hơn. Python RDD luôn lưu object Python ở dạng serialized nên không sao chép tên JVM-only vào PySpark một cách máy móc.",
        "Ở Spark 3.5.7, RDD cache mặc định MEMORY_ONLY; DataFrame cache mặc định MEMORY_AND_DISK_DESER. Tôi cache phần tốn công và được dùng nhiều lần, không cache mọi bảng. Lab giả định 4 partition bằng nhau và một capacity riêng, không có eviction hay tranh chấp execution memory: đổi RAM và số lần dùng để thấy tái tính khác đọc disk."
      ],
      "headers": [
        "Thành phần",
        "Cơ chế / quyết định"
      ],
      "rows": [
        [
          "MEMORY_ONLY",
          "JVM object trong RAM; thiếu chỗ thì tái tính"
        ],
        [
          "MEMORY_AND_DISK",
          "JVM object trong RAM; partition còn lại trên disk"
        ],
        [
          "MEMORY_ONLY_SER",
          "Byte trong RAM; gọn hơn tùy serializer, cần giải mã"
        ],
        [
          "MEMORY_AND_DISK_SER",
          "Byte trong RAM rồi disk; vẫn có chi phí I/O"
        ],
        [
          "DISK_ONLY",
          "Giữ trên disk; không chiếm RAM cache lâu dài"
        ]
      ]
    },
    {
      "title": "Partition chậm nhất giữ cả stage",
      "lead": "700 triệu dòng ở một partition; ba partition kia chỉ có 10, 8 và 12 triệu.",
      "body": [
        "<strong class=\"hl-yellow\">Data skew</strong> là tải phân phối lệch. Trong ví dụ, một task xử lý 700M còn các task khác về đích sớm. Thêm executor không tự cắt một hot key thành nhiều phần cho cùng phép tổng hợp. High cardinality là nhiều giá trị phân biệt; skew là chênh tần suất/tải. Chúng có thể cùng xuất hiện nhưng không đồng nghĩa.",
        "GroupBy, join, distinct và repartition thường cần shuffle để đưa dữ liệu liên quan tới nhau; việc có shuffle cụ thể phụ thuộc partitioning và physical plan. Shuffle lớn tăng mạng, bộ nhớ và I/O spill. Wide schema làm mỗi dòng nặng ngay cả khi số dòng không đổi. Bạn cần xem cả số dòng lẫn số byte.",
        "Schema cũng thay đổi: ngày 1 có user_id, event, ts; ngày 30 thêm country và platform. Thêm cột nullable có thể tương thích khi có chính sách rõ; đổi kiểu hoặc bỏ cột dễ phá consumer. Tôi kiểm hợp đồng và version schema, không chờ job lỗi mới biết nguồn đã đổi."
      ],
      "headers": [
        "Thành phần",
        "Cơ chế / quyết định"
      ],
      "rows": [
        [
          "Skew",
          "Task duration/max input lệch mạnh; tìm hot key"
        ],
        [
          "Shuffle explosion",
          "Nhiều byte đổi chỗ; lọc, project, pre-aggregate"
        ],
        [
          "High cardinality",
          "Nhiều nhóm/distinct; kiểm bộ nhớ và yêu cầu chính xác"
        ],
        [
          "Wide schema / evolution",
          "Đọc cột thừa / hợp đồng thay đổi; hai vấn đề khác nhau"
        ]
      ]
    },
    {
      "title": "Đưa bộ lọc lên trước chỗ tắc",
      "lead": "Hai câu SQL cho cùng đáp án vẫn có thể bắt mạng chở lượng dữ liệu rất khác nhau.",
      "body": [
        "Catalyst đi qua logical plan → analysis để phân giải tên/kiểu → optimized logical plan → physical plan. Nó gấp hằng số và chuyển phép lọc khi bảo toàn ngữ nghĩa. Physical plan chọn cách join, trao đổi và aggregate cụ thể. Dùng <code>explain(\"formatted\")</code> để kiểm, đừng suy từ thứ tự viết code.",
        "Ví dụ inner join t1/t2 lọc <code>t2.id &gt; 50 * 1000</code> rồi cộng <code>1 + 2 + t1.value</code>. Lọc t2 trước join loại sớm dòng không thể góp kết quả; 1 + 2 có thể gấp thành 3. Bạn vẫn phải giữ multiplicity của join: t2 có hai dòng cùng id thì mỗi dòng t1 tương ứng đóng góp hai lần.",
        "<strong class=\"hl-yellow\">Chuyển filter phải giữ nguyên kết quả</strong>. Outer join, NULL hoặc hàm không xác định cần phân tích riêng. Tôi không áp mẹo “lọc sớm” bằng cách đẩy bừa điều kiện từ WHERE sang ON của left join; hai câu đó có thể khác nhau."
      ],
      "headers": [
        "Thành phần",
        "Cơ chế / quyết định"
      ],
      "rows": [
        [
          "Kế hoạch ban đầu",
          "Scan t1 + Scan t2 → Join → Filter → Project → SUM"
        ],
        [
          "Kế hoạch tối ưu minh họa",
          "Scan t2 → Filter; ghép với Scan t1 → Join → Project → SUM"
        ],
        [
          "Cách kiểm",
          "Cùng input, so tập kết quả và NULL; đọc physical plan, không hứa đúng một hình plan"
        ]
      ]
    },
    {
      "title": "Bộ máy bên dưới kế hoạch",
      "lead": "Kế hoạch tốt vẫn có thể tốn thời gian tạo object và chạy garbage collector.",
      "body": [
        "Tungsten giảm overhead object JVM bằng biểu diễn binary, truy cập dữ liệu thuận cache và whole-stage code generation cho các operator được hỗ trợ. L1/L2/L3 gần CPU hơn RAM; đọc tuần tự có thể tận dụng cache line. So sánh minh họa khoảng 1 ns với 100 ns không có nghĩa cả job nhanh hơn 100 lần.",
        "<strong class=\"hl-yellow\">Binary layout không đồng nghĩa off-heap luôn bật</strong>. Spark 3.5.7 mặc định tắt spark.memory.offHeap.enabled; muốn dùng vùng off-heap do Spark quản lý phải bật và cấp size dương. Code generation có thể gộp scan/filter/project/aggregate tương thích, không bao phủ mọi operator hoặc Python UDF.",
        "AQE dùng thống kê lúc chạy để điều chỉnh kế hoạch: gộp shuffle partition nhỏ, chuyển chiến lược join khi phù hợp, chia phần skewed join. Spark 3.5.7 bật AQE mặc định nhưng hiệu quả còn phụ thuộc cấu hình và truy vấn. Tôi vẫn đọc Spark UI: tự động tối ưu không thay trách nhiệm chọn grain, khóa và schema."
      ],
      "headers": [
        "Thành phần",
        "Cơ chế / quyết định"
      ],
      "rows": [
        [
          "Catalyst",
          "Tối ưu ý nghĩa và kế hoạch trước thực thi"
        ],
        [
          "Tungsten",
          "Biểu diễn dữ liệu, bộ nhớ và CPU khi thực thi"
        ],
        [
          "AQE",
          "Dùng số liệu runtime để đổi một số quyết định physical plan"
        ]
      ]
    },
    {
      "title": "🔧 Chỉnh công việc trước khi thêm máy",
      "lead": "Bốn máy khỏe vẫn có thể cùng đẩy những cột không ai cần qua mạng.",
      "body": [
        "Ít partition quá tạo task lớn và spill; nhiều quá tạo task nhỏ với chi phí scheduling. Filter và projection sớm giảm dòng/cột; Parquet/ORC hỗ trợ column pruning, trong khi CSV vẫn thường phải đọc byte của dòng để parse. Broadcast bảng nhỏ có thể tránh shuffle bảng lớn nhưng cần đủ RAM phía executor và ngữ nghĩa join phù hợp.",
        "Với hot key, tách phần nóng, thêm salt và aggregate từng phần rồi <strong class=\"hl-cyan\">gộp lại theo khóa gốc</strong>. SUM và COUNT gộp được; AVG phải gộp sum/count, không lấy trung bình không trọng số của các trung bình. Join có salt cần phân phối phía đối diện tương ứng để không mất hoặc nhân sai dòng.",
        "Lab chia 700M thành các bucket lý tưởng rồi gộp lại thành 700M; tổng toàn bộ vẫn 730M. Đây là cân bằng lý tưởng, không cam kết tốc độ và không mô phỏng tranh chấp core. Khi chấp nhận sai số, approx_count_distinct giúp đổi độ chính xác lấy bộ nhớ; tiền đối soát thường cần exact. Schema enforcement/evolution của Delta/Iceberg cũng cần chính sách tương thích và kiểm consumer."
      ],
      "headers": [
        "Thành phần",
        "Cơ chế / quyết định"
      ],
      "rows": [
        [
          "Broadcast",
          "Chỉ khi phía nhỏ đủ nhỏ; đo kích thước và RAM"
        ],
        [
          "Pre-aggregation",
          "Đẩy tổng từng phần trước shuffle nếu phép tính cho phép"
        ],
        [
          "Salting",
          "Chia hot key rồi gộp; kiểm conservation"
        ],
        [
          "Approximate distinct",
          "Ghi rõ sai số và mục đích; không coi là exact"
        ]
      ]
    },
    {
      "title": "📊 Đọc dấu vết một job",
      "lead": "Một thanh tiến độ đứng yên chưa nói được nên thêm RAM, thêm máy hay sửa query.",
      "body": [
        "Spark UI cho bạn job/stage đang chạy, chờ, hoàn tất; task duration, input, shuffle read/write, spill và GC. Nếu một task rất lâu với input lớn, điều tra skew. Nếu mọi task đọc nhiều cột nhưng trả ít, xem scan/filter. Nếu GC hoặc spill cao, kiểm kích thước task và bộ nhớ. Đây là chẩn đoán theo bằng chứng, không phải mỗi triệu chứng có một nút chữa.",
        "Dynamic allocation đổi số executor theo backlog/idle khi đã bật và thiết lập cơ chế bảo toàn shuffle phù hợp, chẳng hạn shuffle tracking hoặc external shuffle service. Ở Spark 3.5.7, ví dụ timeout backlog 1s và executor idle 60s là mặc định cấu hình, không phải deadline luôn cấp hoặc thu máy đúng lúc; executor có cache có chính sách riêng.",
        "Compaction viết lại nhiều file nhỏ thành ít file lớn để giảm overhead mở file/metadata. Coalesce thường giảm partition mà không shuffle đầy đủ; repartition shuffle để phân phối lại. Số partition không luôn bằng số file khi có partitionBy hoặc giới hạn file. Delta OPTIMIZE là thao tác của Delta, không phải lệnh core Spark trên mọi file. Tôi kiểm <strong class=\"hl-cyan\">bản ghi logic không đổi</strong>; số byte vật lý có thể đổi theo nén và bố trí."
      ],
      "headers": [
        "Thành phần",
        "Cơ chế / quyết định"
      ],
      "rows": [
        [
          "Task chậm",
          "So max/median, input, shuffle, spill; xác định điểm nghẽn"
        ],
        [
          "Executor thiếu",
          "Kiểm backlog và giới hạn allocation; không chữa hot key bằng máy dư"
        ],
        [
          "File quá nhỏ",
          "Compaction có kiểm count, tổng và khóa; lập lịch bảo trì"
        ]
      ]
    }
  ],
  "summaryTitle": "Bản đồ một job batch",
  "summary": [
    "Storage giữ dữ liệu; driver điều phối; executor chạy task trên partition.",
    "Transformation lập kế hoạch; action yêu cầu thực thi; shuffle chia stage.",
    "Cache chỉ có thứ để tái dùng sau khi đã vật hóa; luôn cân nhắc unpersist.",
    "Giảm dòng/cột và kiểm skew trước khi tăng tài nguyên.",
    "Mọi tối ưu phải bảo toàn kết quả; đo job thật thay vì suy tốc độ từ mô hình."
  ],
  "checkTitle": "✅ Tự kiểm",
  "checks": [
    "Tôi chỉ ra được action và ranh giới shuffle trong một chuỗi DataFrame.",
    "Tôi phân biệt RDD cache, DataFrame cache và JVM serializer.",
    "Tôi giải thích được high cardinality khác skew ở đâu.",
    "Tôi gộp đúng aggregate sau salting và biết khi nào broadcast không phù hợp.",
    "Tôi phân biệt allocation executor với compaction file."
  ],
  "quizTitle": "Quiz · giải thích trước khi chọn",
  "practiceTitle": "🧪 Bài tập cuối buổi",
  "practice": [
    "Từ fixture 6 đơn, dự đoán tổng paid theo region, chạy ví dụ PySpark rồi so kết quả. Đọc explain trước và sau projection/filter.",
    "Chọn RAM chứa 2 trong 4 partition và dùng 3 lần. So MEMORY_ONLY với MEMORY_AND_DISK: bao nhiêu lần tính partition, bao nhiêu lượt đọc disk?",
    "Chia hot key thành 4 salt, kiểm tổng từng phần và tổng gốc. Viết cách gộp AVG bằng sum/count.",
    "Lập biên bản một job: input, output, max/median task duration, shuffle/spill, số file; chọn đúng một giả thuyết cải thiện và cách kiểm."
  ],
  "answerTitle": "Gợi ý đối chiếu",
  "answer": "VN = 150, US = 100. MEMORY_ONLY tính 8 lượt partition; MEMORY_AND_DISK tính 4 và đọc disk 4 lượt ở các lần tái dùng. 4 salt cho hot key tạo 175M mỗi phần, gộp lại 700M; toàn bộ 730M. Với AVG, cộng các partial sum rồi chia tổng partial count. Giữ fixture và điều kiện đo cố định khi so kế hoạch.",
  "next": "Buổi 10 bỏ giả định “đã có đủ input”: sự kiện vẫn đến sau khi bạn đã công bố kết quả.",
  "demo": "MÔ PHỎNG TRONG TRÌNH DUYỆT",
  "loopNote": "Vùng sáng tự đi qua một lượt minh họa rồi bắt đầu lượt mới; bảng luôn giữ đủ các bước. Đây không phải thao tác chạy lại hay xóa dữ liệu thật.",
  "quiz": [
    {
      "topicId": "b9-1",
      "q": "Lệnh nào yêu cầu thực thi kết quả DataFrame?",
      "opts": [
        "select",
        "filter",
        "count",
        "groupBy"
      ],
      "a": 2,
      "ex": "Count là action. Các lệnh còn lại mô tả transformation; groupBy cần aggregate để thành phép tính hoàn chỉnh."
    },
    {
      "topicId": "b9-2",
      "q": "Partition khác task thế nào?",
      "opts": [
        "Partition là dữ liệu; task là công việc xử lý nó",
        "Hai tên của cùng một executor",
        "Task luôn là một dòng",
        "Partition luôn là một máy"
      ],
      "a": 0,
      "ex": "Một task xử lý một partition trong một stage; máy có thể chạy nhiều task."
    },
    {
      "topicId": "b9-3",
      "q": "Mất partition RDD thì lineage giúp gì?",
      "opts": [
        "Tự sao lưu mọi nguồn",
        "Tính lại từ nguồn và transformation còn khả dụng",
        "Bỏ qua partition",
        "Biến driver thành storage"
      ],
      "a": 1,
      "ex": "Khả năng tái tính phụ thuộc nguồn và phép tính còn khả dụng."
    },
    {
      "topicId": "b9-4",
      "q": "Bật Kryo có tự thay serializer object Python không?",
      "opts": [
        "Có, mọi byte đều dùng Kryo",
        "Chỉ khi có 2 partition",
        "Có, nếu gọi count",
        "Không; cần phân biệt JVM và Python"
      ],
      "a": 3,
      "ex": "Cấu hình serializer JVM không phải lựa chọn thay mọi đường mã hóa Python."
    },
    {
      "topicId": "b9-5",
      "q": "Sau cache(), action đầu tiên làm gì?",
      "opts": [
        "Vật hóa và giữ các partition nó tính",
        "Chỉ đọc cache có sẵn",
        "Không chạy gì",
        "Tự unpersist"
      ],
      "a": 0,
      "ex": "Cache là lazy; phải tính trước mới có dữ liệu tái dùng."
    },
    {
      "topicId": "b9-6",
      "q": "Một key chiếm phần lớn dòng là dấu hiệu nào?",
      "opts": [
        "Column pruning",
        "Skew",
        "Chỉ high cardinality",
        "Schema evolution"
      ],
      "a": 1,
      "ex": "Skew là phân phối tải lệch. Cardinality đếm số giá trị khác nhau."
    },
    {
      "topicId": "b9-7",
      "q": "Filter có thể đẩy sớm khi nào?",
      "opts": [
        "Bất cứ lúc nào",
        "Khi đổi INNER thành LEFT",
        "Khi bảo toàn ngữ nghĩa, NULL và multiplicity",
        "Chỉ khi tăng executor"
      ],
      "a": 2,
      "ex": "Optimizer phải giữ đáp án. Outer join và NULL cần phân tích riêng."
    },
    {
      "topicId": "b9-8",
      "q": "AQE sử dụng loại thông tin nào?",
      "opts": [
        "Chỉ số dòng trong code",
        "Tên file",
        "Chỉ RAM laptop",
        "Thống kê lúc truy vấn đang chạy"
      ],
      "a": 3,
      "ex": "AQE dùng runtime statistics để điều chỉnh một số quyết định thực thi."
    },
    {
      "topicId": "b9-9",
      "q": "Gộp AVG sau salting thế nào?",
      "opts": [
        "Cộng sum, cộng count rồi chia",
        "Cộng các AVG",
        "Chọn AVG lớn nhất",
        "Luôn lấy trung bình các AVG"
      ],
      "a": 0,
      "ex": "Trung bình các trung bình chỉ đúng trong một số điều kiện trọng số; sum/count giữ đúng tổng quát."
    },
    {
      "topicId": "b9-10",
      "q": "Compaction cần bảo toàn gì?",
      "opts": [
        "Từng byte của file cũ",
        "Bản ghi logic và ý nghĩa của dữ liệu",
        "Số executor",
        "Số file"
      ],
      "a": 1,
      "ex": "File count và byte vật lý có thể đổi, nhưng không được làm sai dữ liệu logic."
    }
  ],
  "labs": {
    "planTitle": "Từ lazy plan tới kết quả",
    "planHelp": "Đổi vị trí lọc paid. Mô hình phân phối từng dòng theo region và chưa dùng partial aggregation; xem số dòng đi qua bước này, rồi kiểm tổng không đổi.",
    "planModes": [
      "Lọc trước phân phối",
      "Lọc sau phân phối"
    ],
    "planSteps": [
      [
        "Kế hoạch",
        "filter / select / groupBy: chưa chạy task của kế hoạch."
      ],
      [
        "Action",
        "count / show / write yêu cầu tính kết quả."
      ],
      [
        "Stage trước shuffle",
        "Đọc partition và áp dụng phép biến đổi cục bộ."
      ],
      [
        "Shuffle → stage sau",
        "Đưa cùng region về cùng nhóm; SUM rồi trả kết quả."
      ]
    ],
    "moved": "Dòng được phân phối",
    "output": "Kết quả",
    "headers": [
      "Region",
      "Tổng paid"
    ],
    "cacheTitle": "Dung lượng cache có đủ chỗ?",
    "cacheHelp": "4 partition bằng nhau. Action đầu đọc đủ 4; các action sau đọc lại toàn bộ. Đổi sức chứa và số lần dùng; không coi số lượt này là thời gian chạy.",
    "capacity": "RAM chứa partition",
    "uses": "Số lần dùng",
    "strategy": "Storage strategy",
    "computed": "Lượt tính partition",
    "ram": "Partition trong RAM",
    "disk": "Partition trên disk",
    "diskReads": "Lượt tái đọc disk",
    "skewTitle": "Chia hot key rồi gộp lại",
    "skewHelp": "Thử 1, 2 và 4 salt. Thanh biểu diễn triệu dòng của các task lý tưởng; cùng một scale 700M để bạn thấy phần lớn nhất giảm. Chưa mô phỏng giới hạn core hay chi phí shuffle/gộp.",
    "salts": "Số salt cho hot key",
    "largest": "Task lớn nhất (M)",
    "total": "Tổng dữ liệu (M)",
    "merged": "Hot key gộp lại (M)",
    "codeTitle": "Ví dụ PySpark · fixture tự chứa",
    "codeNote": "Python 3.10/3.11, Java 17, pyspark==3.5.7. Chạy bằng spark-submit; code dưới có input và assert. Các đoạn connector là mẫu cấu hình cần file/JDBC driver và database riêng, không chạy trong trang.",
    "connectorTitle": "Đọc file và JDBC · mẫu cấu hình",
    "serializerTitle": "Kryo · cấu hình JVM trước context",
    "planCodeTitle": "SQL và hai thứ tự thực thi tương đương",
    "planCodeNote": "Tạo t1/t2 từ VALUES, kết quả tổng = 13. Với plan minh họa, đọc mũi tên từ scan tới aggregate; physical plan thực tế có thể thêm exchange hoặc aggregate từng phần."
  }
};

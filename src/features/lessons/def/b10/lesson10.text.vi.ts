export const VI = {
  "badge": "BUỔI 10 · DEF",
  "title": "Stream — khi nào dữ liệu đã đủ?",
  "hero": "Sự kiện đã xảy ra.<br /><em>Nhưng chưa tới.</em>",
  "intro": "Một giao dịch xảy ra trước khi phút kết thúc, nhưng thông điệp đến sau khi dashboard đã công bố tổng tiền. Timestamp đúng, phép cộng đúng, kết quả vẫn thiếu. Tôi sẽ theo hai dòng thời gian ấy để bạn quyết định khi nào phát kết quả và khi nào sửa lại nó.",
  "meta": "10 chương · 3 lab · 10 câu quiz · VI / EN",
  "premise": "Timeline, checkpoint và hàng đợi là mô hình dạy học chạy trong trình duyệt, không kết nối Flink hay Kafka. API minh họa theo Flink 1.20; cấu hình connector và triển khai thật cần môi trường riêng.",
  "cover": "Bìa",
  "start": "Theo dòng sự kiện",
  "readyTitle": "🧭 Ôn nền: thời gian và trạng thái",
  "readyLead": "Buổi 9 có input hữu hạn để tính lại. Ở đây bạn cần giữ rõ sự kiện nào đã tới, đồng hồ nào đang chạy và hệ thống còn nhớ gì.",
  "terms": [
    [
      "Timestamp · offset",
      "Timestamp mô tả thời điểm; offset là vị trí trong partition nguồn. Offset lớn hơn không bảo đảm event time lớn hơn."
    ],
    [
      "Khoảng nửa mở [start, end)",
      "Cửa sổ [00:00, 01:00) nhận sự kiện 00:59 nhưng không nhận 01:00. Quy ước biên ngăn đếm hai lần ở cửa sổ tumbling."
    ],
    [
      "Key · state",
      "Key gom sự kiện cùng đối tượng. State giữ tổng, count hoặc lịch sử cần cho lần tính sau; không phải mọi sự kiện đều phải giữ nguyên vẹn."
    ],
    [
      "Rate · backlog",
      "Nếu nguồn đến 8 và đích xử lý 3 sự kiện mỗi nhịp, tổng phần chờ tăng 5 mỗi nhịp khi không mất dữ liệu. Buffer hữu hạn sẽ buộc upstream chậm lại."
    ]
  ],
  "chapters": [
    {
      "title": "Một phép tính không có bản ghi cuối",
      "lead": "Luồng thanh toán không có nút “gửi xong toàn bộ dữ liệu”.",
      "body": [
        "Flink xử lý stream unbounded và cả dataset bounded. Transformation có thể filter, enrich, aggregate hoặc route. Với unbounded input, engine duy trì công việc qua thời gian, giữ state và phát kết quả theo điều kiện; không chờ toàn bộ input kết thúc.",
        "JobManager điều phối execution graph, scheduling, checkpoint và recovery; TaskManager chạy các subtask. Operator là một phép xử lý; parallelism 4 tạo 4 instance song song của operator. Slot chia tài nguyên TaskManager: với cấu hình chia đều 3 slot, mỗi slot nhận khoảng 1/3 managed memory; CPU vẫn được chia sẻ, không phải 3 core riêng.",
        "Tôi phân biệt operator, subtask, chain và slot. Các subtask tương thích có thể chia sẻ slot qua slot sharing; chain gộp operator vào cùng task/thread. Parallelism phải phù hợp slot khả dụng và phân phối key. Đổi số instance không được làm đổi kết quả nghiệp vụ."
      ],
      "headers": [
        "Khái niệm",
        "Cơ chế / điều kiện"
      ],
      "rows": [
        [
          "Client → JobManager",
          "Nộp job, xây/lập lịch execution graph; tối ưu SQL phụ thuộc API"
        ],
        [
          "TaskManager → slot",
          "Chạy task, quản lý tài nguyên và state cục bộ theo backend"
        ],
        [
          "Checkpoint → recovery",
          "Giám sát, hoàn tất snapshot; phục hồi state cùng vị trí nguồn khi lỗi"
        ]
      ]
    },
    {
      "title": "⏱️ Ba chiếc đồng hồ",
      "lead": "Sự kiện lúc 00:58 có thể chỉ tới máy xử lý lúc 01:10.",
      "body": [
        "<strong class=\"hl-purple\">Event time</strong> lấy từ sự kiện; processing time là đồng hồ máy lúc xử lý; ingestion time ghi lúc vào hệ thống. Event time giúp nhóm theo lúc nghiệp vụ xảy ra, nhưng cần tín hiệu tiến độ vì input có thể đảo thứ tự. Ingestion time là khái niệm thời gian vào nguồn; khả năng API cụ thể cần kiểm theo phiên bản.",
        "Với mô hình giây trong bài, <strong class=\"hl-purple\">W = max event time đã thấy − disorder bound</strong>. 00:58 − 5s = 00:53; thấy 01:05 thì W = 01:00. Với 10s: 10:01:20 − 10s = 10:01:10. Watermark là giả định tiến độ, không phải bằng chứng mọi sự kiện cũ đã đến. Nó không lùi khi sự kiện cũ xuất hiện.",
        "Timestamp extractor đọc thời gian; generator phát watermark; operator downstream dùng nó. Watermark nhiều input thường lấy minimum của các input đang hoạt động, nên partition im lặng có thể giữ tiến độ; idleness xử lý theo cấu hình. Chiến lược monotonous phù hợp timestamp tăng; bounded chấp nhận đảo thứ tự trong độ trễ chọn; custom phục vụ tín hiệu đặc thù. P95 chỉ bao phủ một tỷ lệ quan sát, không phải trần trễ tuyệt đối.",
        "Lab dùng giây và mốc end cho dễ tính. Flink 1.20 dùng timestamp mili giây: bounded generator thường phát max − bound − 1 ms và time window có maxTimestamp = end − 1 ms. Khi triển khai, bạn phải dùng đúng độ chính xác ấy; không lấy hình tròn giây làm kiểm thử biên mili giây."
      ],
      "headers": [
        "Khái niệm",
        "Cơ chế / điều kiện"
      ],
      "rows": [
        [
          "Bound lớn",
          "Chờ lâu hơn, thường nhận được nhiều sự kiện đảo thứ tự hơn"
        ],
        [
          "Bound nhỏ",
          "Kết quả sớm hơn, cần chính sách dữ liệu muộn phù hợp"
        ],
        [
          "Out-of-order ≠ bị bỏ",
          "Sự kiện cũ hơn max vẫn có thể thuộc window còn nhận dữ liệu"
        ]
      ]
    },
    {
      "title": "Cửa sổ gom dữ liệu; trigger phát kết quả",
      "lead": "Một stream vô hạn cần các nhóm hữu hạn để bạn đọc được kết quả.",
      "body": [
        "Tumbling dùng các khoảng cố định không chồng lấp; sliding có size và slide, có thể chồng lấp nếu slide nhỏ hơn size. Một sự kiện có thể thuộc nhiều sliding window. Session gom hoạt động theo inactivity gap và có thể hợp nhất session khi sự kiện nối cầu tới. Global không có kết thúc theo thời gian tự nhiên.",
        "<strong class=\"hl-purple\">Window assigner quyết định nhóm; trigger quyết định lúc tính/phát</strong>. Fire không nhất thiết xóa state. Event-time window mặc định dựa watermark, processing-time window dựa clock; global cần trigger thích hợp vì trigger mặc định không tự phát kết quả hữu ích. Tôi luôn hỏi riêng lúc emit và lúc cleanup.",
        "Ví dụ event tại giây 65 thuộc tumbling [60,120). Với sliding size 60, slide 30, nó thuộc [30,90) và [60,120). Session gap 10 với các event 0, 5, 20 tạo nhóm 0/5 và nhóm 20; event đến muộn có thể nối các nhóm tùy biên và state còn giữ. Không thể suy session chỉ từ thứ tự arrival."
      ],
      "headers": [
        "Khái niệm",
        "Cơ chế / điều kiện"
      ],
      "rows": [
        [
          "Tumbling",
          "Doanh thu mỗi giờ; mỗi event thuộc một window theo key"
        ],
        [
          "Sliding",
          "Trung bình 10 phút, cập nhật mỗi 1 phút; nhiều window"
        ],
        [
          "Session",
          "Clickstream theo khoảng im lặng; độ dài thay đổi"
        ],
        [
          "Global",
          "Ví dụ phát mỗi 100 event; cần trigger và chính sách giữ/dọn state"
        ]
      ]
    },
    {
      "title": "📨 Dữ liệu muộn tới sau kết quả",
      "lead": "Count đã công bố là 3. Bản ghi thứ tư của cùng phút vừa tới.",
      "body": [
        "Allowed lateness là thời gian giữ state sau mốc kết thúc window theo event time; <strong class=\"hl-yellow\">nó khác disorder bound</strong>. Bound làm watermark đi chậm so với max; lateness quyết định còn nhận update sau lần phát đầu hay không. Cả hai không phải thời gian sleep theo arrival clock.",
        "Với window [0,60), W đạt 60 thì phát count = 3. Nếu lateness 15 và event 50 tới khi W vẫn 60, state còn giữ, count thành 4 và default event-time trigger có thể phát lại. Khi W đạt 75, state đã bị dọn trong mô hình giây; event 55 sau đó tới phải đi side output hoặc bị drop. Chỉ chờ đồng hồ máy thêm 15 giây không làm W tăng.",
        "Bản sửa là <strong class=\"hl-purple\">giá trị thay thế cho cùng key/window</strong>, không phải một giao dịch mới để cộng chồng 3 + 4. Sink cần upsert hoặc xử lý changelog phù hợp. Side output giữ sự kiện quá muộn để audit, reprocessing, alert hoặc DLQ; pipeline phụ vẫn tốn storage/compute và cũng có thể lỗi. Allowed lateness không bảo đảm đầy đủ nếu sự kiện đến sau cleanup.",
        "Tôi đã làm rõ mốc trong ví dụ disorder 10s, lateness 15s: window [00:30,01:30) phát khi max tới 01:40 và W=01:30; event 01:15 còn được nhận nếu W chưa tới 01:45. Để bỏ event 01:28, phải có watermark tới 01:45 hoặc hơn, chẳng hạn max=01:55; riêng arrival=02:00 chưa đủ kết luận."
      ],
      "headers": [
        "Khái niệm",
        "Cơ chế / điều kiện"
      ],
      "rows": [
        [
          "Drop",
          "Không giữ thêm state cho late update; có thể thiếu dữ liệu"
        ],
        [
          "Allowed lateness",
          "Giữ state lâu hơn, cho sửa kết quả; sink hiểu update"
        ],
        [
          "Side output",
          "Giữ phần quá muộn qua nhánh riêng; không miễn phí và không tự bảo đảm không mất"
        ]
      ]
    },
    {
      "title": "Một dòng dữ liệu, nhiều API",
      "lead": "Một đoạn SQL gọn chưa chắc diễn tả được timer nghiệp vụ đặc biệt của bạn.",
      "body": [
        "DataStream cung cấp map 1→1, filter giữ/bỏ, flatMap 1→n, keyBy phân phối theo key, window/aggregate gom và tính. Union gộp stream cùng kiểu; connect phối hợp hai stream có thể khác kiểu bằng hàm phù hợp. ProcessFunction bổ sung context để xử lý từng event; muốn dùng keyed state và timer, bạn phải keyBy trước rồi dùng KeyedProcessFunction hoặc ProcessFunction trên keyed stream.",
        "Table API coi stream là dynamic table; cập nhật bảng có thể tạo insert/update/delete trong changelog. SQL parser kiểm cú pháp, optimizer chọn biến đổi, planner tạo kế hoạch thực thi. DataStream và SQL có thể cho cùng kết quả nghiệp vụ nhưng không mặc nhiên cùng execution plan hoặc hiệu năng.",
        "Ví dụ SQL dưới dùng window TVF: <code>TUMBLE</code> tạo window_start/window_end trước GROUP BY. HOP nhận slide và size; SESSION hỗ trợ theo cú pháp/API/phiên bản tương ứng. Đừng groupBy một cột window_start chưa được tạo. Tôi để rõ Kafka connector, schema và watermark; source topic, JAR và quyền kết nối vẫn phải chuẩn bị riêng.",
        "Có thể chuyển DataStream sang Table rồi quay lại, nhưng phải giữ event time, watermark, kiểu và changelog. Một sink append-only không nhận được mọi bảng cập nhật. Đây là cầu nối API, không phải phép đổi tên biến."
      ],
      "headers": [
        "Khái niệm",
        "Cơ chế / điều kiện"
      ],
      "rows": [
        [
          "DataStream / ProcessFunction",
          "State, timer, logic tùy biến chi tiết"
        ],
        [
          "Table API",
          "Biểu thức quan hệ trong Java/Python"
        ],
        [
          "SQL",
          "Khai báo schema, watermark, query và connector; dễ chia sẻ logic"
        ]
      ]
    },
    {
      "title": "Mỗi key mang một phần ký ức",
      "lead": "Đếm tổng đơn theo khách cần nhớ nhiều hơn bản ghi vừa tới.",
      "body": [
        "<strong class=\"hl-purple\">State</strong> là thông tin từ quá khứ cần cho tính toán tiếp theo. Event tới → đọc state của key → tính → ghi state → emit nếu đủ điều kiện. Running count cần một số; phát hiện 3 login lỗi trong 5 phút cần timestamp/cấu trúc đủ để loại sự kiện cũ; session cần mốc hoạt động gần nhất.",
        "Keyed state gắn từng key sau keyBy; operator state gắn instance operator, chẳng hạn trạng thái nguồn theo partition. Window state gắn vòng đời của window/key, thường được thực hiện bằng keyed state; không phải mọi “loại state” trong sơ đồ là backend độc lập. Python API không nhất thiết có mọi khả năng như Java; phần này dùng mô hình khái niệm, không hứa custom operator state PyFlink.",
        "Khi rescale, keyed state được phân phối qua key groups theo cấu hình max parallelism; operator state cần quy tắc phân phối phù hợp. State bền cần checkpoint và storage phục hồi; giữ một dictionary trong process không thay thế managed state. Tôi kiểm cả TTL/cleanup, schema state và dung lượng, vì state vô hạn có thể phá job dù input từng event rất nhỏ."
      ],
      "headers": [
        "Khái niệm",
        "Cơ chế / điều kiện"
      ],
      "rows": [
        [
          "Running count / sum",
          "State gọn theo key; cần cập nhật nhất quán"
        ],
        [
          "Window / session / fraud",
          "Có vòng đời và nhu cầu lịch sử khác nhau"
        ],
        [
          "Source position",
          "Phải phục hồi đồng bộ với processing state; offset không thay state"
        ]
      ]
    },
    {
      "title": "🛟 Khôi phục một quá khứ nhất quán",
      "lead": "State trở về hôm trước nhưng nguồn tiếp tục ở hôm nay sẽ làm dữ liệu biến mất giữa hai mốc.",
      "body": [
        "Checkpoint là snapshot nhất quán của runtime state và vị trí nguồn, không phải backup code. Coordinator khởi tạo checkpoint; source đưa barrier vào dòng. Với nhiều input, aligned checkpoint chờ barrier tương ứng để tách dữ liệu trước/sau nhất quán; unaligned checkpoint có thể lưu cả dữ liệu đang trong buffer theo cấu hình.",
        "Task snapshot, ghi storage bền (có phần bất đồng bộ) rồi acknowledgment. <strong class=\"hl-yellow\">Chỉ checkpoint hoàn tất mới là mốc recovery</strong>. Khi lỗi, khôi phục state cùng source position từ mốc ấy rồi replay. Source phải hỗ trợ replay và còn giữ dữ liệu; checkpoint location phải sống qua sự cố.",
        "Exactly-once state không tự biến email hay khoản ghi ngoài thành exactly-once effect. Sink cần phối hợp transaction/checkpoint hoặc phép ghi idempotent phù hợp. Trong lab, a=10, b=20 được checkpoint; c=30 đã ghi ngoài rồi máy hỏng. Replay c khôi phục state = 60, nhưng sink cộng mù thành 90. Upsert theo event ID giữ 60. Tôi dùng ví dụ đơn giản này để bạn nhìn thấy ranh giới cam kết."
      ],
      "headers": [
        "Khái niệm",
        "Cơ chế / điều kiện"
      ],
      "rows": [
        [
          "Barrier",
          "Marker điều phối; không phải bản ghi doanh thu"
        ],
        [
          "Completed checkpoint",
          "State và vị trí nguồn nhất quán đã được xác nhận"
        ],
        [
          "External effect",
          "Cần cơ chế sink riêng; không suy bảo đảm chỉ từ checkpoint"
        ]
      ]
    },
    {
      "title": "Bỏ những lần bàn giao không cần thiết",
      "lead": "Map rồi filter trên cùng dòng đôi khi đang tốn nhiều công bàn giao hơn công tính.",
      "body": [
        "Operator chaining gộp các operator tương thích vào cùng task/thread, giảm serialization, buffering và chuyển thread giữa chúng. Forward edge và parallelism tương thích thường là điều kiện; keyBy repartition tạo ranh giới trao đổi, không thể coi mọi operator đều chain thành một hàng.",
        "<code>disableChaining()</code> tách operator; <code>startNewChain()</code> mở chain mới trong Java DataStream. Có thể tách để debug, nhìn metric hoặc profile rõ hơn. <strong class=\"hl-yellow\">Tách chain không tự cấp CPU riêng</strong>: slot sharing, resource profile và deployment mới quyết định phần cô lập tài nguyên.",
        "Tuning gồm watermark, chain, memory và backpressure. Bạn có thể giảm overhead mà throughput vẫn bị database sink chậm giới hạn. Tôi chỉ đổi một yếu tố mỗi lần rồi xem throughput/latency/checkpoint duration; cấu hình nhiều hơn không có nghĩa hiểu hệ thống hơn."
      ],
      "headers": [
        "Khái niệm",
        "Cơ chế / điều kiện"
      ],
      "rows": [
        [
          "Không chain",
          "Trao đổi qua buffer/serialization khi cần; dễ quan sát từng operator"
        ],
        [
          "Chain tương thích",
          "Cùng task/thread; giảm overhead chuyển giao"
        ],
        [
          "Cô lập tài nguyên",
          "Thiết kế slot sharing/resource/deployment; không chỉ tách chain"
        ]
      ]
    },
    {
      "title": "Điểm nghẽn đẩy ngược về nguồn",
      "lead": "Nguồn nhận 8 mỗi nhịp, sink chỉ tiêu thụ 3. Buffer không thể dài vô tận.",
      "body": [
        "Khi downstream chậm, buffer đầy và upstream phải chậm lại: đó là <strong class=\"hl-purple\">backpressure</strong>. Trong lab, phần chờ ban đầu tăng 5 mỗi nhịp; đến giới hạn buffer, backlog tiếp tục tích ở nguồn. Backpressure hạn chế phần dữ liệu đang bay, không tự ngăn mọi OOM hoặc giữ Kafka retention đủ lâu.",
        "UI báo pressure phía upstream có thể là triệu chứng của operator phía sau. Tôi lần tới sink/operator bận, xem busy/idle/backpressured time, queue, checkpoint và external service trước khi kết luận. Nhãn OK/LOW/HIGH là cách đọc mức độ; màu đỏ đầu tiên không nhất thiết là nguyên nhân.",
        "Tăng parallelism ở điểm nghẽn nếu công việc chia được; hot key có thể vẫn bị một subtask giữ. Async I/O giúp chờ external lookup nhưng cần giới hạn concurrency và timeout. Tăng RocksDB cache chỉ giúp khi cache/state I/O là nút thắt và còn memory budget. Không dùng cả ba như công thức chung."
      ],
      "headers": [
        "Khái niệm",
        "Cơ chế / điều kiện"
      ],
      "rows": [
        [
          "Nguồn 8, sink 3",
          "Backlog tổng tăng 5 mỗi nhịp nếu không drop"
        ],
        [
          "Buffer hữu hạn",
          "Upstream giảm accepted; phần chờ ở nguồn tăng"
        ],
        [
          "Chẩn đoán",
          "Đi xuôi tới nguyên nhân chậm, thay vì chỉ nhìn chỗ báo pressure"
        ]
      ]
    },
    {
      "title": "🚦 Chọn ranh giới ảnh hưởng sự cố",
      "lead": "Một job thử nghiệm có thể dùng cùng cluster với dashboard đang phục vụ khách hàng.",
      "body": [
        "Session mode chia cluster cho nhiều job: tận dụng tài nguyên và khởi động thuận tiện, đổi lại có tranh chấp và phạm vi ảnh hưởng chung. Application mode gắn vòng đời cluster với application, giúp quản lý dependency và cô lập vận hành rõ hơn; một application có thể chứa nhiều job tùy chương trình.",
        "Tôi không gắn nhãn session “bị cấm production”. Bạn chọn theo yêu cầu cách ly, chi phí, orchestration và cách vận hành. Application riêng thường hợp workload cần ranh giới sự cố rõ; session có thể phù hợp nếu quota, monitoring và cách ly đã được thiết kế.",
        "Bản thiết kế cuối phải ghi event time, watermark, window, late policy, state, checkpoint và sink semantics. Buổi 11 sẽ dùng kết quả này cho báo cáo/ML; gửi một con số nhanh mà không nói nó còn sửa được hay đã final là chuyển sự mơ hồ sang người dùng."
      ],
      "headers": [
        "Khái niệm",
        "Cơ chế / điều kiện"
      ],
      "rows": [
        [
          "Session",
          "Chia sẻ tài nguyên và vòng đời cluster; kiểm noisy neighbor"
        ],
        [
          "Application",
          "Vòng đời theo application; đánh đổi chi phí/khởi động với cô lập"
        ],
        [
          "Hợp đồng đầu ra",
          "Key/window, revision, freshness, late correction và retention"
        ]
      ]
    }
  ],
  "summaryTitle": "Bản đồ một stream có trạng thái",
  "summary": [
    "Watermark mô tả tiến độ event time theo chiến lược, không chứng minh input đã đủ.",
    "Window gom nhóm; trigger phát; cleanup dọn state. Ba việc khác nhau.",
    "Disorder bound và allowed lateness tác động ở hai chỗ khác nhau.",
    "Recovery phục hồi cả state lẫn vị trí nguồn; sink quyết định tác động ngoài có trùng không.",
    "Backpressure cần truy tới downstream chậm; deployment quyết định phạm vi ảnh hưởng."
  ],
  "checkTitle": "✅ Tự kiểm",
  "checks": [
    "Tôi tính được watermark và biết vì sao nó không lùi.",
    "Tôi gán event đúng khoảng [start,end) và phân biệt fire với cleanup.",
    "Tôi dự đoán update/side output sau sự kiện muộn.",
    "Tôi giải thích được state đúng nhưng sink vẫn ghi trùng sau recovery.",
    "Tôi phân biệt chain, slot sharing và resource isolation."
  ],
  "quizTitle": "Quiz · theo dấu thời gian",
  "practiceTitle": "🧪 Bài tập cuối buổi",
  "practice": [
    "Với bound 5 và lateness 15, ghi watermark sau mỗi event của lab. Chỉ ra event làm phát count 3, event sửa thành 4, event đi side output.",
    "Đổi lateness thành 0 rồi bound thành 10. Giải thích vì sao chính sách đầu ra đổi mà timestamp gốc không đổi.",
    "Gây lỗi sau external write nhưng trước checkpoint hoàn tất. Viết hợp đồng sink giúp tránh tác động trùng; nêu điều kiện source replay.",
    "Nguồn 8, sink 3, buffer 12: ghi số chờ trong buffer và ở nguồn sau 6 nhịp; đề xuất một phép đo để tìm bottleneck thật."
  ],
  "answerTitle": "Gợi ý đối chiếu",
  "answer": "Với bound 5: W lần lượt 7, 35, 53, 60, 60, 80, 80. e4 làm phát 3; e5 cập nhật 4; e7 quá muộn. Checkpoint sau b phục hồi state 30 và offset kế tiếp 2; replay c cho state 60. Sink cộng mù ra 90, upsert ID giữ 60. Sau 6 nhịp, buffer 9 và nguồn chờ 21: tổng backlog 30, bằng 6 × (8 − 3).",
  "next": "Buổi 11 đặt câu hỏi tiếp theo: cùng kết quả đúng về xử lý, mô hình phục vụ có đang trả lời đúng câu hỏi nghiệp vụ?",
  "demo": "MÔ PHỎNG TRONG TRÌNH DUYỆT",
  "loopNote": "Vùng sáng lặp lại một kịch bản đã cố định. Tất cả các bước vẫn ở trên trang; lặp hình không phải rollback dữ liệu thật.",
  "quiz": [
    {
      "topicId": "b10-1",
      "q": "Parallelism 4 có nghĩa gì?",
      "opts": [
        "4 bản sao dữ liệu vĩnh viễn",
        "4 instance của operator",
        "4 core CPU riêng bắt buộc",
        "4 JobManager"
      ],
      "a": 1,
      "ex": "Parallelism đếm subtask của operator; tài nguyên thực tế phụ thuộc slot và cấu hình."
    },
    {
      "topicId": "b10-2",
      "q": "max event time = 65s, bound = 5s thì W trong mô hình là?",
      "opts": [
        "70s",
        "5s",
        "60s",
        "65s"
      ],
      "a": 2,
      "ex": "65 − 5 = 60. Đây là mô hình giây đã khai báo."
    },
    {
      "topicId": "b10-3",
      "q": "Event 60s thuộc tumbling window nào?",
      "opts": [
        "[0,60)",
        "Cả hai window",
        "Không window nào",
        "[60,120)"
      ],
      "a": 3,
      "ex": "Khoảng nửa mở không nhận end, vì vậy 60 thuộc window kế."
    },
    {
      "topicId": "b10-4",
      "q": "W=60, window [0,60), lateness=15; event 50 đến thì sao?",
      "opts": [
        "Có thể nhận và phát kết quả sửa",
        "Luôn drop",
        "Tự hạ W xuống 50",
        "Đợi clock đủ 15s"
      ],
      "a": 0,
      "ex": "State còn giữ cho tới cleanup theo watermark; không dùng đồng hồ arrival để kết luận."
    },
    {
      "topicId": "b10-5",
      "q": "SQL groupBy window_start cần gì trước đó?",
      "opts": [
        "Bất kỳ Kafka topic",
        "Một phép window tạo cột đó",
        "Chỉ đổi tên amount",
        "Tắt watermark"
      ],
      "a": 1,
      "ex": "Window TVF tạo window_start và window_end trước phép nhóm."
    },
    {
      "topicId": "b10-6",
      "q": "State theo khách sau keyBy thuộc loại nào?",
      "opts": [
        "Code backup",
        "Chỉ source offset",
        "Keyed state",
        "Không thể checkpoint"
      ],
      "a": 2,
      "ex": "Keyed state giữ dữ liệu riêng cho từng key."
    },
    {
      "topicId": "b10-7",
      "q": "Checkpoint mới đang ghi dở khi crash: dùng mốc nào?",
      "opts": [
        "Mốc mới dù chưa ack",
        "Offset mới nhất cộng state cũ",
        "Xóa hết input",
        "Checkpoint hoàn tất gần nhất"
      ],
      "a": 3,
      "ex": "State và source position phải cùng mốc hoàn tất."
    },
    {
      "topicId": "b10-8",
      "q": "Tách chain có bảo đảm CPU riêng không?",
      "opts": [
        "Không, cần cấu hình tài nguyên riêng",
        "Có, luôn luôn",
        "Có nếu đặt tên operator",
        "Chỉ phụ thuộc watermark"
      ],
      "a": 0,
      "ex": "Chain là ranh giới thực thi, không tự là ranh giới cô lập tài nguyên."
    },
    {
      "topicId": "b10-9",
      "q": "Node upstream báo backpressure cao: làm gì trước?",
      "opts": [
        "Tăng mọi memory limit",
        "Kiểm downstream chậm và metric liên quan",
        "Xóa state",
        "Giảm Kafka retention"
      ],
      "a": 1,
      "ex": "Pressure có thể xuất hiện phía trước nguyên nhân chậm."
    },
    {
      "topicId": "b10-10",
      "q": "Session mode có dùng production được không?",
      "opts": [
        "Không bao giờ",
        "Chỉ khi không có state",
        "Có, nếu đánh đổi chia sẻ/cách ly phù hợp",
        "Luôn tốt hơn application"
      ],
      "a": 2,
      "ex": "Đây là lựa chọn vận hành có điều kiện, không phải quy tắc cấm."
    }
  ],
  "labs": {
    "windowTitle": "Phòng event time · [0,60)",
    "windowHelp": "Các event giữ nguyên thứ tự arrival. Đổi bound và lateness rồi đọc W trước/sau; count chỉ thuộc window [0,60). Vùng sáng dẫn qua toàn bộ trace, bảng không biến mất.",
    "bound": "Disorder bound (s)",
    "lateness": "Allowed lateness (s)",
    "policy": "Sau cleanup",
    "policies": [
      "Side output",
      "Drop"
    ],
    "headers": [
      "ID · event/arrival (s)",
      "W trước → sau",
      "Hành động",
      "Count đã tính",
      "State"
    ],
    "actions": {
      "other": "Window khác",
      "collect": "Nhận event",
      "update": "Phát bản sửa",
      "fire": "Phát lần đầu",
      "side": "Side output",
      "drop": "Bỏ event"
    },
    "states": {
      "collecting": "Đang gom",
      "retained": "Giữ chờ sửa",
      "deleted": "Đã dọn"
    },
    "recoveryTitle": "Checkpoint đúng, tác động ngoài có trùng?",
    "recoveryHelp": "a=10, b=20, c=30 đã ghi ra sink, rồi crash. Chọn checkpoint sau b đã hoàn tất hay còn dở; mô hình còn checkpoint gốc tại offset 0. So cộng mù với upsert event ID.",
    "checkpoint": "Checkpoint sau b",
    "checkpoints": [
      "Đã hoàn tất",
      "Chưa hoàn tất"
    ],
    "sink": "Cách ghi sink",
    "sinks": [
      "Upsert theo event ID",
      "Cộng mù mỗi lần nhận"
    ],
    "savedOffset": "Offset kế tiếp đã lưu",
    "savedState": "State đã lưu",
    "replayed": "Event replay",
    "finalState": "State sau recovery",
    "external": "Tổng ngoài sink",
    "effects": "Số dòng ngoài sink",
    "recoverySteps": [
      [
        "Chụp mốc",
        "Checkpoint giữ state và offset cùng một thời điểm logic."
      ],
      [
        "Ghi rồi crash",
        "Tác động ngoài sau checkpoint có thể đã xảy ra."
      ],
      [
        "Khôi phục + replay",
        "Dùng checkpoint hoàn tất; đọc lại phần sau offset."
      ],
      [
        "Đối chiếu sink",
        "Upsert ID ngăn lặp effect của fixture; cộng mù không ngăn được."
      ]
    ],
    "queueTitle": "Buffer đầy, backlog đi đâu?",
    "queueHelp": "Mỗi nhịp có 8 event mới ở nguồn. Nạp tới buffer tối đa 12 rồi sink xử lý theo rate đã chọn. Tất cả event đều được giữ ở buffer hoặc nguồn; không có drop.",
    "sinkRate": "Sink event / nhịp",
    "queueHeaders": [
      "Nhịp",
      "Nhận vào buffer",
      "Đã xử lý",
      "Còn trong buffer",
      "Chờ ở nguồn"
    ],
    "codeTitle": "SQL Flink 1.20 · window TVF",
    "codeNote": "Mẫu để chạy trong SQL Client với Kafka SQL connector tương thích Flink 1.20 và format JSON. Cần broker localhost:9092, topic sales cùng record có product_id, amount, event_time dạng yyyy-MM-dd HH:mm:ss.SSS. Chưa triển khai connector trong ứng dụng này.",
    "apiTitle": "Java DataStream và PyFlink Table API · trích đoạn",
    "apiNote": "Các trích đoạn dùng stream Sales đã gán timestamp/watermark, SalesAggregate đã định nghĩa, hoặc TableEnvironment đã đăng ký SalesEvents. Chúng giải thích tương ứng API, không phải chương trình độc lập. Table tạo window w trước khi nhóm; event-time và semantics phải tương ứng khi so kết quả."
  }
};

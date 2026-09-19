export const VI = {
  badge: 'TUẦN 8 · DEF',
  title: 'Storage — tạo ký ức cho dữ liệu',
  eyebrow: 'PHẦN III / ĐƯỜNG ĐI CỦA DỮ LIỆU',
  hero: 'Dữ liệu đã đến.<br /><em>Niềm tin chưa tới.</em>',
  intro: 'Đến sáng, các đơn hàng đã tới nơi. Hàng nghìn file nằm an toàn trong kho, nhưng analyst vẫn chưa trả lời được doanh thu hôm qua. Một file không có người phụ trách. Một file mang schema khác. File thứ ba là bản trùng. Tôi sẽ lần theo cách những byte đã lưu trở thành bản ghi đáng tin. Bạn sẽ thấy sự thay đổi ấy đi qua mô hình, metadata và quy tắc chuyển tầng.',
  meta: '10 chương · 3 lab tương tác · VI / EN',
  start: 'Bắt đầu hành trình',
  jump: 'Theo dấu bronze → gold',
  premise: 'Cửa hàng, bản ghi và các lab là ví dụ giả lập chạy trong trình duyệt. Sơ đồ giải thích cơ chế; không kết nối HDFS, cloud storage hoặc cơ sở dữ liệu thật và không đo hiệu năng sản phẩm.',
  cover: 'Bìa',
  readyTitle: 'Trước khi mở cửa kho',
  readyLead: 'Không cần giải tích. Bạn cần biết một bản ghi được nhận diện thế nào, một schema hứa điều gì và một phép cộng có thể bị bản trùng làm sai ra sao. Tôi giữ phần ôn này đủ ngắn để bạn đi tiếp ngay.',
  terms: [
    ['Path · ID · metadata', 'Path là đường dẫn trong cây thư mục; ID hoặc key nhận diện dữ liệu theo giao diện của hệ thống. Metadata mô tả dữ liệu: kiểu, nguồn, chủ sở hữu, thời gian tạo. Buổi này cần cả địa chỉ lẫn lời giải thích về thứ nằm ở địa chỉ đó.'],
    ['Entity · relationship · schema', 'Entity là thực thể như Customer hoặc Order; relationship mô tả quan hệ giữa chúng. Schema quy định cấu trúc, kiểu và ràng buộc. Bạn sẽ dùng ba chữ này để nối một yêu cầu nghiệp vụ với bảng có thể truy vấn.'],
    ['Row · column · key', 'Một hàng là một bản ghi; cột là một thuộc tính; khóa giúp nhận diện hoặc liên kết bản ghi. Cùng order_id xuất hiện hai lần có thể là retry, nhưng cũng có thể là hai phiên bản hợp lệ: phải đọc ngữ nghĩa sự kiện.'],
    ['Latency · throughput', 'Latency là thời gian chờ một thao tác; throughput là lượng công việc mỗi đơn vị thời gian. 1 ms = 1000 μs = 1000000 ns. Biết đơn vị giúp bạn tránh so một lần đọc RAM với cả chuyến đi qua mạng.'],
    ['Capacity · retention · raw / derived', 'Capacity là dung lượng; retention là chính sách giữ bao lâu; raw giữ đầu vào, derived được tính từ đầu vào. Nếu nhận 10 GB/ngày và giữ 30 ngày thì riêng dữ liệu gốc đã là 300 GB, chưa tính replica, phiên bản, nén hoặc kết quả dẫn xuất.']
  ],
  chapters: [
    {
      title: 'Cùng những byte, những nơi lưu khác nhau',
      lead: 'Ảnh sản phẩm, file dùng chung và trang dữ liệu của database đều là byte. Nhưng bắt chúng dùng cùng một cách đọc và sửa sẽ khiến ít nhất một bên khổ sở.',
      body: [
        '<strong class="def-term">Storage</strong> giữ thông tin qua thời gian để hệ thống khác tìm, đọc và sử dụng. Ghi thành công chỉ là lời hứa đầu tiên: còn phải biết dữ liệu ở đâu, ai được đọc, có thể sửa đơn vị nào và chuyện gì xảy ra khi máy hỏng. Tôi chọn giao diện truy cập trước khi chọn tên dịch vụ.',
        '<strong class="def-term">File storage</strong> tổ chức file trong cây thư mục, truy cập bằng path như /sales/2026/orders.csv. Filesystem giữ tên, quyền, thời gian và thông tin phân bổ; NAS cung cấp file dùng chung qua mạng, thường qua NFS hoặc SMB. Hợp khi ứng dụng cần thư mục, thao tác file và cộng tác trên cùng không gian tên.',
        '<strong class="def-term">Block storage</strong> đưa ra một dải block có địa chỉ để hệ điều hành hoặc database đọc và ghi. Filesystem phía trên biến block thành file; block device tự nó không biết block nào là đơn hàng hay ảnh. Disk cục bộ và volume qua SAN là các ví dụ. Database thường cần kiểu cập nhật nhỏ, ngẫu nhiên này, cùng cam kết độ bền và I/O phù hợp.',
        '<strong class="def-term">Object storage</strong> truy cập object bằng key trong bucket; object gồm dữ liệu và metadata. Key như sales/2026/orders.parquet có thể nhìn giống path nhưng dấu / thường chỉ là tiền tố của key, không phải thư mục POSIX. Giao diện object phổ biến đọc hoặc thay object; sửa một trường thường cần ghi phiên bản object mới hoặc có lớp bảng xử lý phía trên. Một số dịch vụ có khả năng chuyên biệt, nên kiểm đúng API đang dùng.',
        'Ba mô hình này mô tả <strong class="def-condition">giao diện và đơn vị truy cập</strong>, không phải ba loại vật liệu khác nhau. File server cũng dùng block phía dưới; lake có thể dùng object phía dưới. Trong lab, đổi workload rồi theo địa chỉ, metadata và đơn vị cập nhật. Bạn đang chọn cách làm việc, không trao huy chương tốc độ cho một cái tên.'
      ],
      cards: [
        { title: '🗂 Chọn theo việc phải làm', text: 'File dùng chung cần ngữ nghĩa thư mục và khóa file phù hợp. Database cần kiểm random I/O, độ trễ và ghi bền. Ảnh, backup và dữ liệu lake thường hợp object storage. Kết luận chỉ có nghĩa khi kèm kích thước object, mẫu đọc/ghi, mạng, độ bền và chi phí vận hành.' }
      ],
      table: {
        headers: ['Trục', 'File', 'Block', 'Object'],
        rows: [
          ['Địa chỉ / cấu trúc', 'Path; cây thư mục', 'Địa chỉ block; volume', 'Bucket + key; không gian tên object'],
          ['Metadata', 'Tên, quyền, thời gian; metadata filesystem', 'Metadata thiết bị; ý nghĩa do lớp trên quản lý', 'Metadata hệ thống và do người dùng khai báo'],
          ['Sửa đổi', 'Đọc/ghi vùng file theo API', 'Đọc/ghi vùng block', 'Thường thay object hoặc tạo phiên bản mới'],
          ['Độ trễ', 'Tùy filesystem, NAS và mạng', 'Có thể phù hợp I/O ngẫu nhiên độ trễ thấp', 'Thường có chi phí request/mạng; hợp truy cập object'],
          ['Mở rộng', 'Tùy namespace, server và thiết kế phân tán', 'Tùy giới hạn volume, IOPS và hệ thống', 'Thường mở rộng nhiều object trên nhiều máy'],
          ['Chi phí', 'Dung lượng, server/dịch vụ, vận hành', 'Dung lượng, IOPS/throughput được cấp', 'Dung lượng, request, truy xuất và truyền dữ liệu'],
          ['Ứng dụng', 'File chia sẻ, thư mục ứng dụng, NAS', 'Disk/volume của database hoặc máy ảo, SAN', 'Media, backup, archive, nền lưu trữ data lake']
        ]
      }
    },
    {
      title: 'Bộ nhớ mua tốc độ, không mua sự vĩnh viễn',
      lead: 'Trang bán hàng đọc cùng giá sản phẩm hàng nghìn lần. Đưa bản sao vào RAM giúp rút ngắn đường đi, nhưng giá vừa đổi thì bản sao ấy có thể kể chuyện cũ.',
      body: [
        '<strong class="def-term">Cache</strong> giữ dữ liệu để lần truy cập sau ít tốn công hơn. Cache hit lấy được bản sao; cache miss phải đọc nguồn hoặc tính lại. RAM nhanh nhưng dung lượng có giới hạn và chi phí mỗi đơn vị dung lượng thường cao hơn đĩa. Eviction giải phóng chỗ, TTL giới hạn tuổi bản sao; cả hai không tự bảo đảm cache luôn đồng bộ với nguồn.',
        'Thang độ trễ chỉ giúp bạn nhìn bậc độ lớn: cache CPU ở vùng ns, RAM thường ở hàng chục đến hàng trăm ns, SSD có thể ở vùng μs, ổ đĩa quay ở vùng ms. Truy cập dịch vụ qua mạng còn thêm truyền tải, hàng đợi và phần mềm. Đây là minh họa, <strong class="def-condition">không phải benchmark hay cam kết cho mọi thiết bị</strong>. Tôi không lấy thời gian đọc một ô RAM để quảng cáo độ trễ của cả một API.',
        'Một thang minh họa cụ thể đặt L1 ở 1 ns, L2 ở 10 ns, RAM ở 100 ns; sau mốc 1 μs là network 10 μs, SSD 100 μs, database insert 1 ms, HDD seek 10 ms và vòng đi–về California–Netherlands–California 100 ms. Mốc 1 s dẫn đến retry/refresh 10 s. Các con số đặt cạnh nhau để cảm nhận quy mô chờ, không để dự đoán thao tác thật; khoảng cách mạng, payload, durability và tải có thể đổi kết quả đáng kể.',
        'Các nhãn Redis/Memcached, mạng 1 Gbps, RocksDB, PostgreSQL, Zoom và Grafana trên cùng thang chỉ gợi các bối cảnh ứng dụng. 1 Gbps là băng thông, không phải độ trễ; một lần database insert phụ thuộc commit và cách lưu bền; retry/refresh còn là quyết định của ứng dụng. Bạn cần đo riêng workload của mình trước khi chọn công cụ.',
        'Redis cung cấp cấu trúc dữ liệu phía server, TTL, replication và các lựa chọn persistence như RDB snapshot hoặc AOF. Redis Cluster phân mảnh theo hash slot; replication thường bất đồng bộ nên vẫn phải đánh giá cửa sổ mất ghi khi failover. Redis Pub/Sub là kênh thông báo, không phải log bền có replay như một stream được giữ lại.',
        'Memcached tập trung vào cache key–value đơn giản; client thường quyết định phân phối key giữa các server. Thiết kế thông thường không có replication, snapshot bền hay Pub/Sub tích hợp. Những khả năng như extstore hoặc warm restart không biến nó thành cơ sở dữ liệu bền tổng quát. Hazelcast là nền tảng phân tán có IMap, partition, backup và các cấu trúc/dịch vụ khác; persistence, consistency và pub/sub phụ thuộc cấu hình, API và phiên bản/edition.',
        'Trong hệ thống thật, tôi ghi rõ nguồn có thẩm quyền và cách sửa cache khi dữ liệu đổi: invalidate, cập nhật bản sao, TTL hoặc phối hợp các cách đó. Nếu dùng Redis hay Hazelcast làm nơi giữ trạng thái quan trọng, bạn cần thiết kế durability và recovery riêng. Có replication không đồng nghĩa mọi ghi đã an toàn trên đĩa.'
      ],
      cards: [
        { title: '⚡ Đọc nhanh vẫn có thể đọc sai', text: 'Đặt TTL không chữa được mọi yêu cầu độ mới: giá đổi ngay sau một lần cache thì bản sao có thể cũ đến khi bị vô hiệu hóa hoặc hết hạn. Chọn giới hạn stale chấp nhận được trước, rồi thiết kế chính sách cache theo giới hạn ấy.' }
      ],
      table: {
        headers: ['Trục', 'Redis', 'Memcached', 'Hazelcast'],
        rows: [
          ['Kiểu dữ liệu', 'String, hash, list, set và các cấu trúc khác', 'Key → giá trị opaque', 'IMap và cấu trúc/dịch vụ phân tán'],
          ['Phân phối dữ liệu', 'Cluster chia hash slot', 'Thường do client phân phối key', 'Partition và backup trong cluster'],
          ['Snapshot / persistence', 'RDB / AOF; cấu hình quyết định bảo đảm', 'Không là cơ chế lưu bền tổng quát', 'Tùy cấu hình, phiên bản và edition'],
          ['Replication', 'Có; thường bất đồng bộ', 'Không tích hợp trong thiết kế thông thường', 'Backup đồng bộ/bất đồng bộ tùy cấu hình'],
          ['Pub/Sub', 'Có; Pub/Sub không giữ lịch sử replay', 'Không tích hợp', 'Topic / Reliable Topic; ngữ nghĩa khác nhau'],
          ['Độ trễ / hiệu năng', 'Phụ thuộc lệnh, payload, mạng và persistence', 'Phụ thuộc hit rate, payload, client và mạng', 'Phụ thuộc partition, backup, API và mạng'],
          ['Ứng dụng điển hình', 'Cache, session, bộ đếm, trạng thái theo cấu hình', 'Cache kết quả hoặc dữ liệu tính lại được', 'Cache và trạng thái phân tán, xử lý dữ liệu']
        ]
      }
    },
    {
      title: 'Tìm các block giữa nhiều máy',
      lead: 'Một file lớn đã được chia ra nhiều máy. Khi bạn mở nó, hệ thống phải tìm đúng mảnh và còn phải đọc tiếp được khi một máy biến mất.',
      body: [
        '<strong class="def-term">HDFS</strong> chia file thành block lớn và phân phối trên DataNode. NameNode quản lý namespace, quyền, ánh xạ file–block và thông tin vị trí replica. Client hỏi NameNode về metadata, rồi <strong class="def-conclusion">đọc dữ liệu trực tiếp từ DataNode</strong>. NameNode không chuyển tiếp toàn bộ byte của mỗi lần đọc.',
        'DataNode gửi heartbeat để báo còn hoạt động và block report để báo các block đang giữ. Khi một replica không đọc được, client có thể thử replica khác. NameNode phát hiện thiếu replica và điều phối sao chép bù theo chính sách. Rack awareness giúp đặt replica qua các miền lỗi; ba bản trên cùng một rack không bảo vệ khỏi sự cố rack như ba vị trí được bố trí có chủ đích.',
        'Ví dụ lịch sử hay dùng block <strong class="def-term">64 MB</strong>. Mặc định dfs.blocksize của <strong class="def-condition">Hadoop 3.4.2 là 128 MiB</strong>, và có thể cấu hình; đây không phải hằng số của mọi HDFS. Block lớn giúp giảm số lần tra cứu và phù hợp đọc file lớn tuần tự. Nhiều file nhỏ lại gây gánh metadata, còn cập nhật ngẫu nhiên từng byte không phải thế mạnh thiết kế của HDFS.',
        'Với hệ thống streaming, dữ liệu gần hiện tại và lịch sử lâu năm có thể nằm ở các tầng lưu trữ khác nhau. <strong class="def-term">Tiered storage</strong> của Kafka đưa log segment đủ điều kiện lên tầng remote theo cấu hình nhưng vẫn thuộc vòng đời log Kafka. Consumer có thể đọc lịch sử qua cơ chế đó. Đọc xa vẫn dùng tài nguyên phục vụ và có độ trễ khác; remote storage không làm mọi chi phí biến mất.',
        'Một sink riêng đưa sự kiện sang lake hoặc warehouse để phục vụ quét lịch sử và phân tích là <strong class="def-term">offload</strong> khác với tiered storage. Nó có schema, độ mới, quyền và retention riêng, cần giám sát độ trễ sao chép. Tuần 7 đã đưa đơn hàng ra khỏi nguồn; ở đây bạn quyết định bản sao ấy được giữ và phục vụ theo hợp đồng nào.',
        'Source system và storage là hai vai trò, không phải hai nhóm sản phẩm loại trừ nhau. Database nguồn cũng lưu trữ dữ liệu. Nhưng đội vận hành có thể sở hữu vòng đời đơn hàng ở nguồn, còn đội dữ liệu chịu trách nhiệm lịch sử phân tích. Tôi luôn ghi ai được sửa, xóa và phục hồi ở từng nơi; bản sao phục vụ phân tích không tự thành nguồn có thẩm quyền cho giao dịch.'
      ],
      cards: [
        { title: '🧭 Theo một lần đọc', text: 'Client xin vị trí block → nhận danh sách replica → đọc DataNode → thử replica khác nếu cần. Heartbeat và block report là luồng quản lý nền. Trong hình, tách chúng khỏi luồng dữ liệu để bạn không nhầm NameNode thành đường ống chở file.' }
      ],
      table: {
        headers: ['Vai trò', 'Giữ hoặc quyết định', 'Không nên suy ra'],
        rows: [
          ['NameNode', 'Namespace, quyền, file–block, vị trí và chính sách replica', 'Mọi byte phải đi qua NameNode'],
          ['DataNode', 'Block và phục vụ đọc/ghi; heartbeat, block report', 'Một máy hỏng nghĩa là toàn bộ file mất'],
          ['Kafka tiered storage', 'Log segment ở local/remote trong vòng đời Kafka', 'Đã có một warehouse để truy vấn SQL'],
          ['Sink lịch sử riêng', 'Bản sao theo mô hình và retention của đích', 'Bản sao luôn mới hoặc có cùng quyền với nguồn']
        ]
      }
    },
    {
      title: 'Dữ liệu đã lưu chưa thành sự thật thống nhất',
      lead: 'Đội bán hàng tính doanh thu lúc đặt đơn. Đội tài chính chỉ tính lúc thu tiền. Đổ cả hai bảng vào một kho chưa làm hai con số trở thành cùng một lời hứa.',
      body: [
        '<strong class="def-term">Data warehouse</strong> tổ chức dữ liệu tích hợp, thường có lịch sử, để phục vụ phân tích và báo cáo. Một single source of truth là mục tiêu về định nghĩa và số liệu đáng tin, không phải phép màu do gom file về một chỗ. Bạn cần chốt doanh thu là gì, dữ liệu đến đâu, được cập nhật lúc nào và ai chịu trách nhiệm.',
        'Đường đi có thể đọc như một chuỗi: yêu cầu nghiệp vụ → data model → dataset có quan hệ → quyền truy cập → báo cáo. Model giúp biểu đạt Customer đặt Order; dataset đưa quan hệ ấy thành dữ liệu; quyền giới hạn ai nhìn được cột nhạy cảm; báo cáo áp dụng định nghĩa đã thống nhất. Tôi giữ từng bước hiện rõ vì sai ở model thường chỉ lộ ra khi dashboard đã đẹp.',
        '<strong class="def-term">Conceptual model</strong> kể về thực thể và quan hệ bằng ngôn ngữ nghiệp vụ, chưa chọn hệ quản trị. Logical model làm rõ thuộc tính, định danh, cardinality và cấu trúc quan hệ, vẫn độc lập với quyết định lưu vật lý cụ thể. Physical model hiện thực chúng trong engine đích bằng bảng, kiểu dữ liệu, key, constraint và cách tổ chức truy cập.',
        'Ví dụ Customer có thể có nhiều Order, mỗi Order của mô hình này thuộc một Customer. Logical model xác định customer_id liên kết hai thực thể. Physical model có thể dùng BIGINT, DECIMAL, NOT NULL và index theo workload. Khả năng thực thi khóa ngoại, unique hay constraint khác nhau giữa các hệ quản trị; khai báo trong tài liệu không có nghĩa engine tự cưỡng chế.'
      ],
      cards: [
        { title: 'Ba bản vẽ, ba người cần đọc', text: 'Conceptual giúp người nghiệp vụ duyệt ý nghĩa; logical giúp kiến trúc sư và kỹ sư duyệt cấu trúc; physical giúp người triển khai quyết định chi tiết trên hệ thống đích. Tôi không bỏ conceptual chỉ vì đã biết viết CREATE TABLE: SQL chạy được vẫn có thể mô tả sai việc kinh doanh.' }
      ],
      table: {
        headers: ['Mức', 'Mục đích / trọng tâm', 'Đối tượng', 'Ví dụ Customer–Order'],
        rows: [
          ['Conceptual', 'Thống nhất thực thể và quan hệ nghiệp vụ', 'Nghiệp vụ, chủ sản phẩm, kiến trúc sư', 'Customer đặt Order'],
          ['Logical', 'Thuộc tính, định danh, cardinality; độc lập engine', 'Data modeler, kiến trúc sư, kỹ sư', 'Customer(customer_id); Order(order_id, customer_id, amount)'],
          ['Physical', 'Bảng, kiểu, key, constraint, index/partition theo engine', 'Kỹ sư dữ liệu, DBA, người vận hành', 'customer_id BIGINT; amount DECIMAL; quy tắc NOT NULL']
        ]
      }
    },
    {
      title: 'Tạo hình mô hình theo câu hỏi',
      lead: 'Bạn muốn xem doanh thu theo sản phẩm, khu vực và tháng. Bảng giao dịch ghi được từng thay đổi, nhưng chưa chắc có hình dạng dễ dùng cho câu hỏi đó.',
      body: [
        '<strong class="def-term">Fact</strong> ghi phép đo hoặc sự kiện theo một grain đã định; <strong class="def-term">dimension</strong> giữ thuộc tính mô tả để lọc, nhóm và giải thích fact. Với fact OrderLine, grain có thể là một dòng sản phẩm trong một đơn; quantity và line_amount là phép đo, còn Product, Customer và Date là dimension. Chốt grain trước khi cộng, nếu không bạn có thể cộng một tổng đơn lặp lại trên mọi dòng hàng.',
        '<strong class="def-term">Star schema</strong> đặt fact ở giữa, nối trực tiếp các dimension. Dimension Product có thể giữ cả tên category trong cùng bảng. Ít bước join và cấu trúc dễ đọc thường thuận cho BI, đổi lại thuộc tính mô tả có thể lặp. Lặp có chủ đích trong dimension là quyết định thiết kế, không tự động là dữ liệu bẩn.',
        '<strong class="def-term">Snowflake schema</strong> chuẩn hóa dimension thành các bảng liên quan, chẳng hạn Product → Category hoặc Store → City → Region. Nó giảm một số lặp và thể hiện phân cấp rõ hơn, nhưng truy vấn có thể cần thêm join và công cụ BI phải hiểu các quan hệ. Tên snowflake ở đây là mô hình dữ liệu, không đồng nghĩa sản phẩm Snowflake.',
        'Tôi không chấm star luôn nhanh hơn snowflake. Optimizer, kích thước bảng, cache, bố trí dữ liệu và mẫu truy vấn cùng tham gia. Bạn chọn hình dạng đủ rõ để người dùng không ghép sai rồi đo workload thật. Tuần 11 sẽ đào sâu grain, mô hình phục vụ và lịch sử; tuần này cần đọc được hai sơ đồ và nói rõ đánh đổi.'
      ],
      cards: [
        { title: '⭐ Đừng để join nhân doanh thu', text: 'Nếu một dòng fact nối với nhiều dòng dimension ngoài ý định, SUM có thể tăng dù không có đơn hàng mới. Khóa dimension và ngữ nghĩa lịch sử phải làm cho join chọn đúng phiên bản; hình ngôi sao đẹp không thay kiểm tra cardinality.' }
      ],
      table: {
        headers: ['Trục', 'Star', 'Snowflake'],
        rows: [
          ['Hình dạng', 'Fact nối trực tiếp dimension', 'Dimension tách thành subdimension'],
          ['Chuẩn hóa dimension', 'Thường phi chuẩn hóa hơn', 'Chuẩn hóa hơn'],
          ['Join điển hình', 'Ít chặng hơn', 'Có thêm chặng theo phân cấp'],
          ['Lặp thuộc tính', 'Có thể lặp category/region', 'Có thể giảm lặp bằng bảng riêng'],
          ['Sử dụng', 'Dễ tiếp cận với phân tích và BI', 'Hữu ích khi cần quản lý phân cấp dùng chung']
        ]
      }
    },
    {
      title: 'Data lake giữ lại nhiều khả năng',
      lead: 'Hôm nay bạn chỉ đếm đơn hàng. Tháng sau đội ML cần ảnh sản phẩm, log và phiên bản dữ liệu trước khi sửa. Nếu chỉ giữ bảng tổng doanh thu, những câu hỏi ấy đã mất đầu vào.',
      body: [
        '<strong class="def-term">Data lake</strong> giữ lượng lớn dữ liệu ở nhiều định dạng và mức độ xử lý: bảng, JSON, log, ảnh, âm thanh hoặc video. Giữ đầu vào gần dạng gốc cho phép xử lý lại khi xuất hiện câu hỏi mới. Lake thường dựa trên object storage hoặc hệ thống phân tán mở rộng ngang, nhưng kiến trúc này còn cần metadata, compute và quản trị.',
        '<strong class="def-term">Schema-on-read</strong> nghĩa là áp dụng cách diễn giải cấu trúc khi đọc cho một tác vụ. Nó không có nghĩa dữ liệu không có schema, không cần tài liệu hay cứ đoán kiểu là an toàn. CSV có cột, JSON có cấu trúc, Parquet mang schema; schema nguồn và schema phân tích vẫn cần được biết và quản lý.',
        'Luồng điển hình giữ raw rồi parse, làm sạch, chuẩn hóa, join và tạo dataset cho ML hoặc báo cáo. ETL biến đổi trước khi nạp đích, ELT nạp trước rồi biến đổi ở nền tảng đích. Bạn có thể giữ raw trong lake và nạp bảng đã chuẩn hóa vào warehouse; lake và warehouse không bắt buộc phải đấu loại nhau.',
        'Một nhánh từ lake đi qua chuẩn bị và validation tới data science rồi ML. Nhánh khác đi qua ETL tới database phục vụ cập nhật nhanh, báo cáo và BI; data mart cung cấp góc nhìn theo miền. Nhịp làm mới phụ thuộc toàn pipeline, nên nhãn real-time database không biến một tác vụ ETL chạy mỗi ngày thành dữ liệu tức thời.',
        'Warehouse thường cung cấp bảng có kiểm soát và trải nghiệm SQL/BI được tối ưu. Lake ưu tiên khả năng giữ nhiều loại dữ liệu và tách các lựa chọn xử lý. Tuy vậy, warehouse hiện đại cũng có thể hỗ trợ dữ liệu bán cấu trúc; lake có bảng tốt cũng có thể phục vụ SQL nhanh. Chi phí lưu thấp không bảo đảm chi phí toàn hệ thống thấp: còn quét dữ liệu, compute, request, truyền tải và công sức vận hành.',
        'Delta Lake là ví dụ lớp bảng bổ sung transaction log và các khả năng như ACID, kiểm schema hoặc versioning lên dữ liệu lưu trong lake. Nó giúp nối raw files với bảng đáng tin, nhưng không tự viết định nghĩa doanh thu hay sửa dữ liệu đầu vào. <a href="#ch09">Mục 09</a> sẽ tách rõ lớp lưu, lớp bảng và lớp tính toán.'
      ],
      cards: [
        { title: 'Giữ raw có lý do và có thời hạn', text: 'Raw hỗ trợ audit và replay, nhưng giữ mọi thứ mãi mãi sẽ tăng chi phí và rủi ro truy cập. Tôi ghi mục đích, chủ sở hữu, retention và cách xử lý dữ liệu nhạy cảm ngay từ vùng đầu vào, trước khi chọn tên bucket.' }
      ],
      table: {
        headers: ['Trục', 'Lake điển hình', 'Warehouse điển hình'],
        rows: [
          ['Loại dữ liệu', 'Có cấu trúc, bán cấu trúc, phi cấu trúc', 'Chủ yếu bảng; có thể hỗ trợ bán cấu trúc'],
          ['Định dạng', 'Nhiều file/object, giữ dạng gốc hoặc chuẩn hóa', 'Bảng do engine quản lý; định dạng tùy hệ thống'],
          ['Schema', 'Diễn giải khi đọc; các bảng vẫn có schema', 'Schema bảng được định nghĩa và quản lý'],
          ['Ứng dụng', 'Khám phá, xử lý raw, ML, phân tích', 'SQL, báo cáo, BI, số liệu dùng chung'],
          ['Chi phí', 'Storage có thể rẻ; compute và vận hành vẫn đáng kể', 'Theo compute/storage và mô hình tính phí'],
          ['Hiệu năng', 'Phụ thuộc định dạng, partition, bảng và compute', 'Phụ thuộc engine, model, workload và tài nguyên']
        ]
      }
    },
    {
      title: 'Data lake trở thành đầm lầy',
      lead: 'Thư mục final_v2_final nằm cạnh final_really_final. File nào cũng mở được; không ai dám dùng. Dữ liệu chưa mất byte nào, nhưng đã mất khả năng trả lời.',
      body: [
        '<strong class="def-term">Data swamp</strong> là tình trạng dữ liệu tích lũy nhưng khó tìm, khó hiểu và khó tin đến mức giá trị sử dụng suy giảm. Thiếu metadata khiến tìm kiếm thất bại; thiếu governance khiến quyền và chính sách không rõ; chất lượng kém làm dữ liệu thiếu, sai, trùng hoặc không nhất quán. Đây là những lỗi khác nhau, không thể sửa bằng một nút làm sạch chung.',
        'Thiếu owner khiến không ai chịu trách nhiệm về quyết định và chất lượng. Thiếu steward khiến định nghĩa, tài liệu và công việc quản lý hằng ngày bị bỏ trống. Thiếu schema hoặc tài liệu schema làm cột amount có thể đổi đơn vị mà người dùng không biết. Thiếu công cụ tìm kiếm, tích hợp và giám sát khiến lỗi khó phát hiện và người dùng tự tạo thêm bản sao.',
        'Các lỗi kéo theo nhau: khó tìm → tải lại một bản mới → trùng lặp và lãng phí lưu trữ → mất công đối soát → phân tích chậm → quyết định dựa trên dữ liệu thiếu tin cậy. Dữ liệu nhạy cảm thiếu phân quyền hoặc giữ quá mục đích còn tạo rủi ro bảo mật và tuân thủ; yêu cầu cụ thể phải theo chính sách áp dụng cho tổ chức.',
        'Trong lab, bạn sẽ bật từng biện pháp và đọc lỗi còn lại. Catalog giúp tìm dataset nhưng không xác nhận mọi giá trị đều đúng. Gán owner tạo đầu mối nhưng không tự sửa schema. Tôi muốn bạn chỉ ra <strong class="def-conclusion">biện pháp sửa nguyên nhân nào và để lại nguyên nhân nào</strong>, thay vì nhìn một điểm chất lượng tổng hợp rồi yên tâm.'
      ],
      cards: [
        { title: '🔎 Có tên chưa chắc có nghĩa', text: 'Dataset orders có thể tìm được nhưng amount đang đổi từ đơn vị đồng sang nghìn đồng. Tag tìm kiếm không phát hiện thay đổi ngữ nghĩa ấy. Contract, owner và kiểm tra có chủ đích phải phối hợp mới ngăn được dashboard cộng sai.' }
      ],
      table: {
        headers: ['Nguyên nhân', 'Dấu hiệu', 'Hậu quả'],
        rows: [
          ['Thiếu metadata', 'Không biết nguồn, nghĩa cột, độ mới', 'Khó tìm, khó hiểu, khó tái sử dụng'],
          ['Thiếu governance', 'Quyền, retention, chính sách không rõ', 'Truy cập sai, giữ quá lâu, rủi ro tuân thủ'],
          ['Chất lượng kém', 'Null, sai kiểu, trùng, số liệu lệch', 'Phân tích và quyết định thiếu tin cậy'],
          ['Thiếu owner / steward', 'Không biết ai giải quyết sự cố', 'Lỗi kéo dài, định nghĩa không được duy trì'],
          ['Thiếu tài liệu schema', 'Tên/kiểu/đơn vị đổi không báo', 'Pipeline hỏng hoặc âm thầm hiểu sai'],
          ['Thiếu công cụ', 'Tìm kiếm, profiling và giám sát thủ công', 'Tạo nhiều bản sao, tốn storage và thời gian']
        ]
      }
    },
    {
      title: 'Mỗi dataset có người phụ trách và dấu vết',
      lead: 'Sau sự cố, đội dữ liệu đã tìm được file sai. Việc khó hơn là biết ai nhận cảnh báo, báo cáo nào bị ảnh hưởng và làm sao không lặp lại chuyện này vào tuần sau.',
      body: [
        '<strong class="def-term">Catalog</strong> lưu metadata để tìm và hiểu dataset. Thu thập tự động có thể khám phá schema, vị trí và nguồn; owner/steward vẫn phải bổ sung nghĩa nghiệp vụ, độ nhạy, cam kết độ mới và quy tắc dùng. AWS Glue Data Catalog, Apache Atlas và Amundsen là những ví dụ với phạm vi tính năng khác nhau, không phải ba công cụ hoán đổi nguyên xi.',
        'Trong một ví dụ AWS, dữ liệu nằm ở S3, IAM quy định quyền; crawler đọc nguồn rồi cập nhật metadata/thống kê được hỗ trợ vào Glue Data Catalog. Athena hoặc Redshift Spectrum dùng catalog để hiểu và truy vấn dữ liệu. EventBridge có thể lên lịch và Lambda có thể khởi động công việc tự động. Catalog giữ mô tả, không phải bản sao tất cả dữ liệu và không tự phát hiện mọi thay đổi ngữ nghĩa.',
        '<strong class="def-term">RBAC</strong> cấp quyền theo vai trò, đi cùng nguyên tắc quyền tối thiểu và cơ chế cưỡng chế ở storage, engine hoặc catalog phù hợp. Lineage ghi dataset nào phụ thuộc nguồn và phép biến đổi nào; khi amount đổi, bạn lần tới bảng tổng hợp và dashboard chịu ảnh hưởng. Lineage giúp điều tra, không tự biến dữ liệu sai thành dữ liệu đúng.',
        '<strong class="def-term">Profiling</strong> khảo sát phân phối, null, giá trị lạ và trùng lặp để hiểu dữ liệu; validation kiểm các kỳ vọng cụ thể. Great Expectations (GX) hỗ trợ kiểm kỳ vọng, còn nền tảng observability như Monte Carlo theo dõi các tín hiệu bất thường tùy tích hợp. Một kiểm tra amount là số không phát hiện mọi đơn hàng nhập sai số tiền: quy tắc phải gắn với nghiệp vụ.',
        'Tách vùng raw, cleansed và curated giúp công bố rõ mức độ sẵn sàng. Một <strong class="def-term">data contract</strong> nên ghi field, kiểu, đơn vị, khóa, độ mới, owner và cách xử lý thay đổi. Schema evolution cho phép thay đổi có kiểm soát: Avro xét tương thích writer/reader schema; Delta có cơ chế enforcement/evolution tùy thao tác. Thêm field không đồng nghĩa mọi consumer cũ đều đọc được, và bật tự động nhận schema không thay kiểm tương thích.',
        'Avro là cơ chế schema/serialization, không tự là schema registry hay hệ governance. Registry có thể giữ các phiên bản schema và kiểm tương thích; producer/consumer hoặc serializer tham khảo registry khi cần. Đừng vẽ registry thành một trạm bắt buộc mọi byte phải đi qua từ Kafka tới consumer: dữ liệu và metadata schema có đường đi khác nhau.',
        'Tag theo miền và mức nhạy cảm giúp tìm kiếm có nghĩa. Airflow có thể điều phối và báo trạng thái job; OpenLineage mô tả sự kiện lineage qua các tích hợp. Job thành công vẫn có thể tạo bảng rỗng hoặc cũ, nên bạn cần kiểm độ mới và khối lượng/kết quả ở dataset. Cảnh báo phải dẫn tới người chịu trách nhiệm và cách xử lý; kết quả profiling/validation cần được ghi log và cập nhật vào tài liệu để lần điều tra sau còn bằng chứng.',
        'Vòng đời đi từ tạo/thu nhận → lưu/tổ chức → dùng/chia sẻ → archive/retain → delete. Retention quy định dữ liệu được giữ bao lâu theo mục đích và chính sách. Archive đổi nơi/cách giữ, delete loại bỏ theo quy trình; cả hai cần xét bản sao, snapshot và khả năng phục hồi. Tôi thử phục hồi và replay trước khi tin vào bản backup, rồi ghi lại giới hạn khôi phục để đội sử dụng không phải đoán.'
      ],
      cards: [
        { title: 'Một hợp đồng đủ để hành động', text: 'Với Orders: order_id không rỗng; amount là số nguyên dương, đơn vị VND; owner là đội Sales Data; độ mới và retention có ngưỡng được thống nhất. Dòng vi phạm đi quarantine kèm lý do, owner nhận cảnh báo, downstream thấy rõ dữ liệu nào chưa được chấp nhận.' }
      ],
      table: {
        headers: ['Biện pháp', 'Làm được', 'Không tự làm được'],
        rows: [
          ['Catalog + tag + tài liệu', 'Tìm kiếm, khám phá schema và nghĩa', 'Bảo đảm giá trị thực tế đều chính xác'],
          ['Owner + steward', 'Giao trách nhiệm và đầu mối vận hành', 'Tự động làm sạch từng dòng'],
          ['RBAC', 'Giới hạn thao tác theo vai trò', 'Xác định ngữ nghĩa doanh thu'],
          ['Profiling + validation', 'Phát hiện bất thường và vi phạm quy tắc', 'Chứng minh mọi sự thật ngoài đời'],
          ['Contract + schema evolution', 'Quản lý thay đổi có điều kiện', 'Bảo đảm tương thích nếu bỏ kiểm consumer'],
          ['Lineage + freshness alert', 'Theo ảnh hưởng và phát hiện chậm dữ liệu', 'Tự sửa upstream hay tính lại mọi bảng'],
          ['Retention + archive / delete', 'Quản lý vòng đời và chi phí', 'Xóa mọi bản sao nếu chưa thiết kế quy trình']
        ]
      }
    },
    {
      title: 'Một nền tảng cho nhiều kiểu phân tích',
      lead: 'Nhà phân tích muốn SQL, đội ML muốn dữ liệu chi tiết, còn nghiệp vụ muốn báo cáo đáng tin. Tạo một bản sao riêng cho mỗi đội khiến chuyện đồng bộ ngày càng khó.',
      body: [
        '<strong class="def-term">Lakehouse</strong> kết hợp cách lưu linh hoạt của lake với các khả năng quản lý bảng và phục vụ phân tích thường gắn với warehouse. Nguồn có cấu trúc, phi cấu trúc và streaming đi vào nền tảng; bảng được quản lý giúp SQL/BI và ML sử dụng dữ liệu với định nghĩa, schema và phiên bản rõ hơn.',
        'Tách ba trách nhiệm: <strong class="def-term">storage</strong> giữ object/file; <strong class="def-term">table format</strong> quản lý metadata và trạng thái bảng; <strong class="def-term">compute</strong> đọc, biến đổi và truy vấn. Ví dụ, object storage giữ file Parquet, Delta Lake hoặc Apache Iceberg cung cấp lớp bảng, Spark hoặc engine tương thích thực hiện tính toán. Parquet là định dạng file, không tự là một hệ transaction đầy đủ.',
        'Các khả năng như ACID, schema enforcement/evolution, snapshot và versioning phải được hiểu theo table format, engine và thao tác hỗ trợ. Time travel còn phụ thuộc lịch sử và file được retention giữ lại; xóa các file cũ có thể làm phiên bản trước không đọc được. Tôi tránh hứa chỉ cần một bucket là lập tức có mọi bảo đảm của database.',
        'Analyst dùng bảng để khám phá, nhóm nghiệp vụ đọc BI, kỹ sư dữ liệu duy trì pipeline, nhà khoa học dữ liệu tạo đặc trưng và mô hình. Cùng nền lưu không bắt mọi đối tượng đọc cùng một bảng raw. Bạn vẫn cần lớp dữ liệu phù hợp mục đích, quyền truy cập, chất lượng và tài nguyên tính toán cho từng workload.',
        'Lakehouse cũng không tự bảo đảm truy vấn nhanh hay vận hành đơn giản. File quá nhỏ, partition lệch, metadata khó quản lý và engine chưa hỗ trợ tính năng vẫn gây vấn đề. Mục tiếp theo tổ chức đường đi thành những tầng có trách nhiệm rõ để lời hứa đáng tin được xây dần.'
      ],
      cards: [
        { title: 'Ba lớp cần trả lời riêng', text: 'Dữ liệu nằm ở đâu? Bảng nào đang có phiên bản hợp lệ? Engine nào đọc và cập nhật được phiên bản ấy? Nếu bạn trả lời cả ba bằng một logo duy nhất, hãy mở lại sơ đồ và tìm các trách nhiệm đang bị giấu.' }
      ],
      table: {
        headers: ['Lớp', 'Trách nhiệm', 'Ví dụ'],
        rows: [
          ['Storage', 'Giữ byte, truy cập file/object, độ bền theo cấu hình', 'Object storage, hệ thống file phân tán'],
          ['File format', 'Mã hóa/bố trí dữ liệu trong file', 'Parquet'],
          ['Table format', 'Trạng thái bảng, metadata, snapshot/transaction theo hỗ trợ', 'Delta Lake, Apache Iceberg'],
          ['Compute', 'Biến đổi, join, tổng hợp và truy vấn', 'Spark, engine SQL tương thích'],
          ['Consumption', 'Dùng dữ liệu theo mục đích và quyền', 'SQL/BI, phân tích, ML']
        ]
      }
    },
    {
      title: 'Ba tầng, trách nhiệm tăng dần',
      lead: 'Năm dòng đi vào không có nghĩa năm đơn hàng được cộng tiền. Một dòng là retry, một dòng sai số tiền, một dòng thiếu khóa. Tên thư mục bronze, silver, gold chưa tự giải quyết dòng nào.',
      body: [
        '<strong class="def-term">Multi-hop</strong> tổ chức dữ liệu qua nhiều bước với trách nhiệm rõ. <strong class="def-term">Medallion</strong> thường đặt tên bronze → silver → gold cho các mức hoàn thiện. Đây là mẫu kiến trúc áp dụng được với batch lẫn streaming, không phải yêu cầu mọi hệ thống phải có đúng ba bucket hoặc ba sản phẩm.',
        '<strong class="def-term">Bronze</strong> giữ dữ liệu đầu vào gần cấu trúc nguồn và metadata nạp như load time, process ID, nguồn hoặc vị trí sự kiện. Nó hỗ trợ CDC archive, audit và replay. Giữ raw không có nghĩa bỏ phân quyền, retention hay kiểm tra việc nhận đủ dữ liệu; dữ liệu chưa được làm sạch cần được đánh dấu rõ.',
        '<strong class="def-term">Silver</strong> parse kiểu, kiểm khóa, làm sạch, khử trùng, match/merge, chuẩn hóa và tích hợp nguồn thành dataset đáng tin hơn. Có thể tổ chức theo 3NF nếu hợp miền; 3NF không phải điều kiện bắt buộc để được gọi là silver. Dòng vi phạm đi quarantine kèm lý do, còn duplicate có dấu vết xử lý để giải thích số đếm.',
        '<strong class="def-term">Gold</strong> công bố dữ liệu cho từng miền và câu hỏi: bảng star, OBT (one big table), tổng hợp, đặc trưng phân tích hoặc ML. Thiết kế ưu tiên mẫu đọc, định nghĩa phép đo và quy tắc chất lượng của người dùng. Gold không nhất thiết chỉ là tổng hợp; gold tốt là dataset thực hiện đúng hợp đồng phục vụ.',
        'Fixture của bài giữ 5 dòng bronze: order_id 101 với amount 120000; một retry giống hệt 101; order_id 102 với 80000; order_id 103 có amount sai kiểu; và một dòng thiếu order_id với 50000. Quy tắc chấp nhận đòi khóa không rỗng và amount nguyên dương tính bằng VND. Kết quả là <strong class="def-conclusion">2 đơn silver, 2 dòng quarantine, 1 duplicate và gold 200000 VND</strong>. Số đếm khớp 5 dòng đầu vào; không dòng lỗi nào âm thầm biến mất.',
        'Mở lab, đổi biện pháp kiểm rồi chạy lại để thấy doanh thu thay đổi vì đâu. Replay ở đây là xử lý lại cùng 5 dòng bronze đã giữ: lab ghi nhớ ID của các dòng raw đã xử lý, bỏ qua chúng khi phát lại và giữ nguyên silver, quarantine cùng duplicate log; gold được tính lại và thay thế từ silver được chấp nhận, nên tổng vẫn 200000. Nếu cứ append kết quả hoặc cộng lại tổng cũ, replay sẽ nhân tiền. Với CDC có nhiều phiên bản thật, bạn còn cần event identity, thứ tự/version và quy tắc cập nhật; không thể bỏ mọi dòng cùng order_id như thể đều là retry.'
      ],
      cards: [
        { title: '🥇 Gold là lời hứa có điều kiện', text: 'Tôi chỉ cộng những đơn được chấp nhận trong fixture, cùng đơn vị VND và không có refund. Muốn gọi đây là doanh thu production, bạn phải định nghĩa thêm trạng thái đơn, hoàn tiền, thuế, thời gian nghiệp vụ và dữ liệu đến muộn. Đúng phép cộng chưa đủ để đúng chỉ số.' }
      ],
      table: {
        headers: ['Tầng', 'Hợp đồng', 'Dấu vết cần giữ'],
        rows: [
          ['Bronze', 'Giữ đầu vào gần dạng nguồn; có chính sách truy cập và retention', 'Nguồn, load time, process ID, vị trí/sự kiện'],
          ['Silver', 'Kiểu/khóa hợp lệ, dedup, match/merge và tích hợp theo quy tắc', 'Dòng chấp nhận, quarantine, lý do và duplicate log'],
          ['Gold', 'Dataset theo miền, phép đo và mẫu đọc rõ', 'Định nghĩa, phiên bản, lineage và kiểm đối soát'],
          ['Replay', 'Xử lý lại đầu vào giữ sẵn mà không nhân tác động', 'Định danh ổn định, ghi idempotent hoặc tính lại an toàn']
        ]
      }
    }
  ],
  summaryTitle: 'Bản đồ mang theo',
  summary: [
    'File, block và object khác giao diện, metadata và đơn vị cập nhật; chọn theo workload và tổng chi phí.',
    'Cache cần chính sách độ mới và phục hồi. HDFS tách metadata ở NameNode khỏi dữ liệu đọc tại DataNode.',
    'Conceptual, logical và physical là ba mức làm rõ cùng một mô hình. Fact có grain; dimension giải thích fact.',
    'Lake giữ nhiều khả năng, nhưng metadata, owner, chất lượng, quyền và retention mới giữ khả năng sử dụng.',
    'Lakehouse phối hợp storage, table format và compute. Không lớp nào tự thay toàn bộ các lớp còn lại.',
    'Bronze giữ đầu vào; silver chấp nhận theo quy tắc; gold phục vụ theo định nghĩa. Replay đúng phải giữ kết quả đúng.'
  ],
  checkTitle: 'Tự kiểm',
  checks: [
    'Tôi chọn được file/block/object theo địa chỉ, đơn vị sửa, độ trễ và chi phí của workload.',
    'Tôi phân biệt được cache hit, stale, eviction, persistence và replication.',
    'Tôi lần theo một lần đọc HDFS và giải thích NameNode, DataNode, replica, heartbeat, block report.',
    'Tôi phân biệt được conceptual/logical/physical và vẽ fact–dimension theo grain đã chốt.',
    'Tôi chỉ ra riêng từng nguyên nhân swamp và biện pháp nào chưa xử lý được nó.',
    'Tôi gán được owner, contract, lineage, cảnh báo độ mới và retention cho một dataset.',
    'Tôi đối soát được 5 dòng bronze thành 2 silver, 2 quarantine, 1 duplicate và tổng 200000.'
  ],
  quizTitle: 'Kiểm tra hợp đồng của kho',
  quiz: [
    { topicId: 'def8.storage', q: 'Ứng dụng cần cập nhật các vùng nhỏ, ngẫu nhiên của volume database. Giao diện nào phù hợp để xem xét trước?', opts: ['Object chỉ thay toàn object', 'Block storage', 'Catalog tìm kiếm', 'Bảng gold'], a: 1, ex: 'Block cho phép đọc/ghi vùng có địa chỉ. Bạn vẫn phải kiểm độ trễ, IOPS, độ bền và yêu cầu database; tên block không tự bảo đảm hiệu năng.' },
    { topicId: 'def8.cache', q: 'Giá sản phẩm đổi ở nguồn, cache còn TTL. Kết luận nào đúng?', opts: ['Cache chắc chắn đã đổi theo', 'Replication tự phát hiện mọi thay đổi nguồn', 'Cache có thể trả giá cũ nếu chưa được cập nhật hoặc invalidate', 'Cache hit chứng minh dữ liệu mới nhất'], a: 2, ex: 'TTL giới hạn tuổi bản sao chứ không tự đồng bộ mọi thay đổi. Bạn cần chính sách cập nhật/invalidation và giới hạn stale được chấp nhận.' },
    { topicId: 'def8.hdfs', q: 'Trong một lần đọc HDFS, client lấy byte của file từ đâu sau khi có vị trí block?', opts: ['DataNode chứa replica', 'Luôn qua NameNode', 'Chỉ từ block report', 'Chỉ từ catalog nghiệp vụ'], a: 0, ex: 'Client hỏi NameNode về metadata rồi đọc DataNode. Heartbeat và block report giúp quản lý cluster, không thay luồng đọc dữ liệu.' },
    { topicId: 'def8.modeling', q: 'Chọn BIGINT, DECIMAL và index cho engine đích thuộc mức model nào?', opts: ['Conceptual', 'Logical độc lập engine', 'Chỉ là mô tả nghiệp vụ', 'Physical'], a: 3, ex: 'Physical hiện thực cấu trúc trên engine đích. Conceptual mô tả thực thể/quan hệ; logical làm rõ thuộc tính và liên kết mà chưa chốt lưu vật lý.' },
    { topicId: 'def8.schemas', q: 'Product tách Category thành bảng riêng, tạo đường Fact → Product → Category. Đây là thay đổi nào?', opts: ['Dimension được chuẩn hóa theo snowflake', 'Mọi fact đã biến thành raw file', 'Star luôn giữ nguyên', 'Không còn join'], a: 0, ex: 'Snowflake tách dimension thành các bảng liên quan. Nó có thể giảm lặp thuộc tính nhưng thêm bước join; hiệu năng vẫn phụ thuộc workload.' },
    { topicId: 'def8.lake', q: 'Schema-on-read trong data lake có nghĩa gì?', opts: ['Không cần tài liệu schema', 'Mọi dữ liệu đều phi cấu trúc', 'Áp dụng cách diễn giải cấu trúc khi đọc cho tác vụ', 'Không được kiểm chất lượng'], a: 2, ex: 'Dữ liệu nguồn và file vẫn có thể mang schema. Schema-on-read không loại nhu cầu về contract, tài liệu và kiểm tương thích.' },
    { topicId: 'def8.governance', q: 'Đã có catalog và owner, nhưng amount còn chứa chuỗi sai kiểu. Biện pháp nào xử lý trực tiếp lỗi này?', opts: ['Thêm tag tìm kiếm', 'Validation kiểu và quarantine có lý do', 'Đổi tên bucket', 'Chỉ tăng retention'], a: 1, ex: 'Catalog giúp tìm; owner nhận trách nhiệm. Kiểm kiểu mới phát hiện vi phạm amount và quarantine giữ dòng lỗi để điều tra, sửa hoặc xử lý lại.' },
    { topicId: 'def8.lakehouse', q: 'Nhận định nào phân biệt đúng các lớp lakehouse?', opts: ['Parquet tự thực thi mọi transaction của bảng', 'Object storage tự định nghĩa doanh thu', 'Compute chỉ giữ byte và không truy vấn', 'Storage giữ byte, table format quản lý bảng, compute xử lý/truy vấn'], a: 3, ex: 'Các trách nhiệm phối hợp nhưng khác nhau. Khả năng transaction, schema và versioning còn phụ thuộc table format, engine và thao tác hỗ trợ.' },
    { topicId: 'def8.medallion', q: 'Theo đúng quy tắc fixture 5 dòng, kết quả nào đúng?', opts: ['5 silver, gold 370000', '2 silver, 2 quarantine, 1 duplicate, gold 200000', '3 silver, gold 250000', '2 silver, không còn dấu vết dòng bị loại'], a: 1, ex: '101 đóng góp 120000 một lần; 102 đóng góp 80000. Retry 101 là duplicate; amount sai và khóa rỗng vào quarantine. Tổng được chấp nhận là 200000.' },
    { topicId: 'def8.medallion', q: 'Xử lý lại cùng bronze đã giữ bằng silver ghi idempotent và gold tính lại từ silver hợp lệ sẽ cho điều gì?', opts: ['Gold vẫn 200000 theo fixture', 'Gold bắt buộc gấp đôi', 'Bronze phải xóa hết', 'Mọi sự kiện trùng order_id ở mọi hệ thống đều được bỏ'], a: 0, ex: 'Replay an toàn không nhân tác động của cùng đầu vào. Fixture chỉ có retry giống hệt; CDC thực tế cần phân biệt các phiên bản thật bằng event identity và thứ tự/version.' }
  ],
  topicLabels: {
    'def8.storage': 'File · block · object',
    'def8.cache': 'Cache và độ mới',
    'def8.hdfs': 'HDFS và lưu lịch sử',
    'def8.modeling': 'Ba mức data model',
    'def8.schemas': 'Star và snowflake',
    'def8.lake': 'Lake và warehouse',
    'def8.governance': 'Swamp và governance',
    'def8.lakehouse': 'Các lớp lakehouse',
    'def8.medallion': 'Bronze · silver · gold'
  },
  practiceTitle: 'Thiết kế một kho có thể giải thích',
  practice: [
    'Vẽ đường đi cho file Orders, ảnh sản phẩm và sự kiện cập nhật. Chọn file/block/object ở từng vai trò và giải thích mẫu đọc/ghi, metadata, chi phí và độ bền cần kiểm.',
    'Vẽ Customer–Order ở ba mức conceptual/logical/physical; chọn grain cho fact phân tích rồi vẽ một star và một snowflake. Ghi rõ phép đo nào được cộng.',
    'Định nghĩa bronze/silver/gold cho 5 dòng fixture. Ở mỗi tầng ghi schema, owner, quyền, retention, lineage và quy tắc chất lượng; giữ lý do quarantine và duplicate log.',
    'Chạy fixture và đối soát số dòng lẫn amount. Xử lý lại cùng bronze để kiểm tổng không đổi; giải thích vì sao việc cộng tiếp vào tổng cũ làm sai kết quả.',
    'Chọn một lỗi swamp trong lab, nêu biện pháp sửa và một giới hạn còn lại. Thiết kế cảnh báo dataset cũ dù job báo thành công, cùng người nhận trách nhiệm.'
  ],
  practiceAnswer: 'Mở tiêu chí đối chiếu',
  practiceGuide: 'Bản thiết kế cần tách địa chỉ truy cập khỏi định dạng dữ liệu, model nghiệp vụ khỏi physical engine, và storage khỏi table format/compute. Fixture đạt khi bronze giữ 5 dòng, silver có đúng 101 và 102, quarantine giữ amount sai của 103 và khóa rỗng, duplicate log có retry 101; gold = 120000 + 80000 = 200000 VND. Replay cùng đầu vào không đổi tổng. Owner, schema, quyền, retention và lineage phải có nơi chịu trách nhiệm cụ thể; thêm catalog mà bỏ kiểm chất lượng chưa chữa hết swamp.',
  codeTitle: 'Đầu vào bronze · 5 dòng JSON giả lập',
  codeLead: 'Giữ nguyên đầu vào để còn điều tra. Dòng retry giống hệt là có chủ đích; amount sai kiểu và order_id rỗng phải được giải thích bằng quy tắc, không được âm thầm ép thành 0.',
  next: 'Tuần 9 đưa các hợp đồng này vào xử lý batch với Spark: parse, join và tổng hợp dữ liệu đã có nơi ở và quy tắc rõ ràng.'
};

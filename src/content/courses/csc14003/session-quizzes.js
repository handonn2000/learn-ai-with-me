// Quiz trắc nghiệm cuối mỗi buổi — kiểm tra trước khi làm bài tập về nhà.
// Giữ dạng JS thuần theo ADR-0005; trang chỉ đọc.
//
// Shape trùng TestQuestion của part-tests.ts: { topic, q, opts, a, ex }. Khác một chỗ quan trọng:
// ở đây `topic` là CHỦ ĐỀ TRONG BUỔI (không phải tên buổi), vì báo cáo trên trang Lộ trình cần nói
// được "hổng chỗ PEAS" chứ không phải "hổng buổi 2" — buổi thì người học biết rồi.
//
// Điểm ghi vào ProgressDB: sessions[<id>].quizScore / quizRight / quizWrong.
// Thêm buổi mới thì thêm một khóa ở đây, component tự nhận.

export const SESSION_QUIZZES = {
  b1: [
    {
      topicId: 'four-approaches',
      q: 'Một chương trình được chấm điểm bằng cách so từng bước suy luận của nó với vết suy nghĩ của người thật ngồi giải cùng bài. Nó nằm ở ô nào?',
      opts: ['Suy nghĩ như người', 'Hành động như người', 'Suy nghĩ duy lý', 'Hành động duy lý'],
      a: 0,
      ex: 'Hai chữ khóa: nó mở nắp máy ra soi <em>quá trình</em> (suy nghĩ), và cầm cây thước là <em>người thật</em>. Đó đúng là cách Newell và Simon chấm GPS năm 1961 — ra đúng đáp án chưa được tính điểm, phải đi đúng cả đường trong đầu nữa.',
    },
    {
      topicId: 'four-approaches',
      q: 'Vì sao khóa này chọn ô “hành động duy lý” làm trục, chứ không phải ba ô kia?',
      opts: [
        'Vì nó là ô dễ lập trình nhất',
        'Vì nó rộng hơn đường logic và lại có tiêu chí rõ ràng để làm khoa học',
        'Vì ba ô kia đã bị chứng minh là sai',
        'Vì nó là ô duy nhất không cần toán',
      ],
      a: 1,
      ex: 'Hai lý do, và cả hai đều thực dụng. <strong class="hl">Rộng hơn</strong>: suy luận đúng luật chỉ là một cách để hành động đúng, còn phản xạ rụt tay khỏi bếp nóng thì chẳng suy luận gì mà vẫn là hành động đúng. <strong class="hl">Dễ làm khoa học hơn</strong>: chuẩn “duy lý” định nghĩa được bằng toán, còn “giống người” thì phải đi hỏi người.',
    },
    {
      topicId: 'turing-test',
      q: 'Phát biểu nào mô tả ĐÚNG giới hạn tự thân của phép thử Turing?',
      opts: [
        'Nó quá khó, chưa máy nào vượt được',
        'Nó đo hành vi người, mà tập đó chỉ giao một phần với tập hành vi thông minh',
        'Nó chỉ đo được phần chữ viết, không đo được thị giác',
        'Nó đòi máy phải giải thích được cách nó nghĩ',
      ],
      a: 1,
      ex: 'Cái thước này vừa quá chặt vừa quá lỏng. Quá lỏng vì có hành vi rất người mà chẳng thông minh gì — máy phải giả vờ gõ sai chính tả mới qua. Quá chặt vì có hành vi thông minh mà người không làm nổi — làm được là lộ ngay, thành ra rớt. Còn chuyện thị giác thì đã có bản Total Turing Test lo rồi, đó là chuyện khác.',
    },
    {
      topicId: 'foundations',
      q: 'AI ⊃ Machine Learning ⊃ Deep Learning. Cách đọc nào đúng?',
      opts: [
        'Ba tên gọi khác nhau của cùng một thứ',
        'Deep learning là một kiểu machine learning, và machine learning là một cách làm AI — nhưng AI còn nhiều nhánh không học gì cả',
        'AI là ứng dụng của deep learning',
        'Machine learning ra đời trước AI',
      ],
      a: 1,
      ex: 'Búp bê Nga: lớp nào cũng nằm gọn trong lớp ngoài. Chỗ hay bị quên là mấy nhánh AI <em>không</em> học gì hết — tìm kiếm, logic, CSP đều nằm ở buổi 3 tới 10, và không cái nào cần một dòng dữ liệu huấn luyện.',
    },
    {
      topicId: 'history',
      q: 'Cơ chế nào tạo ra một “mùa đông AI”?',
      opts: [
        'Máy tính thời đó quá chậm',
        'Ngành hứa quá tay, không giao nổi kết quả, nhà tài trợ rút tiền',
        'Các nhà nghiên cứu bỏ sang ngành khác vì lương thấp',
        'Không có dữ liệu để huấn luyện',
      ],
      a: 1,
      ex: 'Mùa đông nào cũng đúng một công thức, và nó lặp lại hai lần: 1974–80 rồi 1988–93. Phần cứng chậm hay thiếu dữ liệu chỉ là <em>lý do</em> không giao được hàng; thứ giết ngành là khoảng cách giữa lời hứa và kết quả.',
    },
    {
      topicId: 'history',
      q: 'Sắp đúng thứ tự thời gian: (1) Deep Blue thắng Kasparov · (2) Hội nghị Dartmouth · (3) AlphaGo thắng Lee Sedol · (4) Kiến trúc Transformer',
      opts: ['2 → 1 → 3 → 4', '2 → 1 → 4 → 3', '1 → 2 → 3 → 4', '2 → 3 → 1 → 4'],
      a: 0,
      ex: 'Dartmouth 1956 → Deep Blue 1997 → AlphaGo 2016 → Transformer 2017. Cái bẫy nằm ở hai mốc cuối: Transformer ra <em>sau</em> AlphaGo đúng một năm, dù giờ nghe tên nó quen hơn nhiều.',
    },
    {
      topicId: 'rational-agent',
      q: '“Duy lý” trong AI nghĩa là gì?',
      opts: [
        'Không bao giờ ra kết quả sai',
        'Biết trước mọi kết quả của hành động',
        'Chọn hành động được kỳ vọng đưa tới kết quả tốt nhất, với thông tin đang có',
        'Suy luận theo đúng luật logic hình thức',
      ],
      a: 2,
      ex: 'Nhớ giùm tôi: <strong class="hl">duy lý ≠ toàn tri</strong>. Bạn sang đường lúc vắng hoe rồi bị cánh cửa máy bay rơi trúng — quyết định đó vẫn duy lý, chỉ là xui. Duy lý chấm <em>quyết định</em>, không chấm <em>kết quả</em>.',
    },
    {
      topicId: 'applications-limits',
      q: 'Máy đã thắng người ở cờ vua (1997), cờ vây (2016) và cả poker (2017). Kết luận nào rút ra được từ đó?',
      opts: [
        'Máy đã thông minh hơn người ở mọi mặt',
        'Trò chơi có luật rõ và tín hiệu thắng thua rõ là mảnh đất dễ cho AI — không suy ra được gì về những việc không có hai thứ đó',
        'Cờ vây khó hơn nên AlphaGo thông minh hơn Deep Blue',
        'Poker là bài toán quan sát đầy đủ nên máy thắng dễ',
      ],
      a: 1,
      ex: 'Chỗ dễ hớ nhất của cả buổi. Trò chơi cho AI thứ mà đời thật hiếm khi cho: luật đầy đủ, trạng thái rõ ràng, và một tín hiệu nói ngay là thắng hay thua. Rút bớt ba thứ đó đi thì bài toán khó lên rất nhanh — buổi 2 sẽ đo chính xác “khó lên” đó bằng bảy chiều môi trường. Còn poker thì úp bài, tức là quan sát <em>một phần</em>.',
    },
  ],

  b2: [
    {
      topicId: 'agent-function',
      q: 'Hàm agent và chương trình agent khác nhau ở chỗ nào?',
      opts: [
        'Không khác gì, chỉ là hai tên gọi',
        'Hàm agent nhận cả chuỗi tri giác từ đầu tới giờ; chương trình agent mỗi lần chỉ nhận tri giác hiện tại',
        'Hàm agent viết bằng toán, chương trình agent viết bằng Python',
        'Chương trình agent nhận cả chuỗi, hàm agent chỉ nhận một tri giác',
      ],
      a: 1,
      ex: 'Đây là chi tiết nhỏ mà cắn rất đau ở mục 08. Hàm là <em>mô tả toán học</em> của hành vi, nhận trọn lịch sử <span class="code-inline">𝓟*</span>. Chương trình là bản chạy được, và môi trường chỉ đưa cho nó đúng cái vừa nhìn thấy — muốn nhớ quá khứ thì phải tự đẻ ra chỗ mà cất. Chỗ cất đó chính là trạng thái trong.',
    },
    {
      topicId: 'perf-measure',
      q: 'Thước đo hiệu năng chấm cái gì?',
      opts: [
        'Chuỗi trạng thái của môi trường',
        'Trạng thái bên trong của agent',
        'Số hành động agent đã thực hiện',
        'Độ chính xác của mô hình thế giới mà agent giữ',
      ],
      a: 0,
      ex: 'Gạch chân chỗ này: chấm <strong class="hl">sàn nhà</strong>, không chấm con robot. Agent có thể tự thấy mình đang làm rất tốt, tự tin ngời ngời — điểm vẫn là điểm của môi trường. Đó cũng là lý do đặt thước theo <em>thứ bạn muốn có trong môi trường</em>, chứ đừng theo cách bạn nghĩ agent nên cư xử.',
    },
    {
      topicId: 'perf-measure',
      q: 'Trong lab, cùng hai chương trình và cùng sàn đã sạch bong: thước “sàn sạch” chấm hòa 40–40, thước “sàn sạch, đi lại tốn xăng” chấm 20–39. Điều đó cho thấy gì?',
      opts: [
        'Chương trình có trí nhớ luôn duy lý hơn',
        'Câu hỏi “có duy lý không” chỉ trả lời được khi đã chốt thước đo — đổi thước là đổi câu trả lời',
        'Thước đo thứ hai bị đặt sai',
        'Cần chạy nhiều hơn 20 bước mới kết luận được',
      ],
      a: 1,
      ex: 'Không dòng code nào của hai chương trình thay đổi, chỉ cái thước đổi — mà con phản xạ thuần từ chỗ hoàn hảo tụt xuống thảm hại. Duy lý là một quan hệ giữa agent <em>và</em> thước đo, không phải một tính chất nằm sẵn trong agent.',
    },
    {
      topicId: 'rational-not-omniscient',
      q: 'Vì sao “đi thăm dò” lại được tính là một phần của tính duy lý, chứ không phải phí một nước đi?',
      opts: [
        'Vì nó làm agent trông chăm chỉ hơn',
        'Vì hành động sửa được những gì mình sẽ thấy về sau, nên nhắm mắt làm bừa không phải xui mà là ẩu',
        'Vì thước đo luôn thưởng cho việc di chuyển',
        'Vì agent cần dữ liệu để huấn luyện mô hình',
      ],
      a: 1,
      ex: 'Ngó trái ngó phải trước khi sang đường không đưa bạn tới đích nhanh hơn một giây nào. Nhưng bỏ qua nó thì tai nạn không còn là xui nữa. Trong lab bạn đã gặp đúng chuyện này: bản có trí nhớ vẫn phải lết sang ô kia một chuyến, vì <em>chưa nhìn thấy thì chưa có quyền kết luận</em>.',
    },
    {
      topicId: 'peas',
      q: 'Với taxi tự lái, “vô lăng, chân ga, phanh, xi-nhan” thuộc thành phần nào của PEAS?',
      opts: ['Performance measure', 'Environment', 'Actuators', 'Sensors'],
      a: 2,
      ex: 'Cặp A–S là chỗ bị nhầm nhiều nhất. Mẹo: tự hỏi “cái này đưa thông tin <em>vào</em> hay đẩy tác động <em>ra</em>?”. Camera, GPS, đồng hồ tốc độ đưa vào → sensors. Vô lăng, ga, phanh đẩy ra → actuators.',
    },
    {
      topicId: 'env-dimensions',
      q: 'Poker và backgammon khác nhau đúng một chiều. Chiều nào, và vì sao chỗ đó đáng nhớ?',
      opts: [
        'Số agent — poker nhiều người hơn',
        'Rời rạc/liên tục — backgammon có xúc xắc nên liên tục',
        'Quan sát — backgammon nhìn thấy hết bàn cờ, poker thì bài đối thủ úp xuống',
        'Tĩnh/động — poker có đồng hồ',
      ],
      a: 2,
      ex: 'Cả hai đều ngẫu nhiên (chia bài, đổ xúc xắc), nhưng backgammon bày hết ra bàn còn poker thì úp bài. Đó là lý do tôi để backgammon vào bảng: nó chứng minh <strong class="hl">nhìn thấy hết ≠ đoán trước được</strong>. Hai chiều này độc lập, đừng dính chúng vào nhau.',
    },
    {
      topicId: 'lookup-table',
      q: 'Agent tra bảng chạy đúng y những gì ta muốn. Vậy hỏng ở đâu?',
      opts: [
        'Nó tra chậm hơn chạy thuật toán',
        'Nó không xử được môi trường ngẫu nhiên',
        'Kích thước bảng phình theo cấp số nhân — riêng cờ vua đã cần ít nhất 10¹⁵⁰ dòng',
        'Nó không nhớ được chuỗi tri giác',
      ],
      a: 2,
      ex: 'Nó nhớ chuỗi tri giác đàng hoàng và trả lời chuẩn — vấn đề thuần túy là chỗ chứa. 10¹⁵⁰ dòng, trong khi vũ trụ quan sát được có khoảng 10⁸⁰ nguyên tử. Gom hết vật chất trong vũ trụ làm ổ cứng cũng không đủ. Thách thức cốt lõi của AI nằm nguyên ở đây: sinh hành vi duy lý từ <em>ít code</em>, chứ không từ nhiều dòng bảng.',
    },
    {
      topicId: 'five-architectures',
      q: 'Agent phản xạ đơn giản hỏng khi môi trường chỉ quan sát được một phần. Nấc nào sinh ra để chữa đúng bệnh đó, và nó thêm gì?',
      opts: [
        'Hướng mục tiêu — thêm mô tả tình huống muốn tới',
        'Phản xạ có mô hình — thêm trạng thái trong cùng mô hình về cách thế giới vận hành',
        'Hướng thỏa dụng — thêm thang điểm cho từng trạng thái',
        'Biết học — thêm bộ phê bình và bộ học',
      ],
      a: 1,
      ex: 'Không nhìn đủ thì phải <strong class="hl">nhớ</strong>, đơn giản vậy thôi. Và để cập nhật cuốn sổ đó cần đúng hai loại kiến thức: thế giới tự biến đổi ra sao khi mình không làm gì, và hành động của mình đổi thế giới thế nào. Ba nấc còn lại giải ba bài khác hẳn: chọn đích, so sánh các đích, và tự khá lên.',
    },
  ],

  b3: [
    {
        "topicId": "problem-statement",
        "q": "Trên bản đồ hai chiều có các cạnh A–B, A–C, B–C, B–D, C–D, Actions(B) là gì?",
        "opts": [
            "{Đi D}",
            "{Đi A, Đi C, Đi D}",
            "{A, B, C, D}",
            "Result(A, Đi B) = B"
        ],
        "a": 1,
        "ex": "B nối trực tiếp với A, C và D nên cả ba hành động đều hợp lệ. Đích là D không có nghĩa Actions(B) chỉ được chứa Đi D. Result mô tả kết quả của một hành động, không phải danh sách hành động."
    },
    {
        "topicId": "problem-statement",
        "q": "A–B dài 2 km, B–C dài 1 km, C–D dài 2 km. Đường A → B → C → D có chi phí bao nhiêu?",
        "opts": [
            "3 km vì đi 3 bước",
            "2 km vì đó là cạnh cuối",
            "5 km",
            "Không tính được nếu chưa biết thuật toán"
        ],
        "a": 2,
        "ex": "Chi phí đường đi là tổng chi phí bước: 2 + 1 + 2 = 5 km. Ba bước là độ dài tính theo số hành động, không phải số km. Bạn không cần biết thuật toán để tính chi phí một đường đã cho."
    },
    {
        "topicId": "problem-statement",
        "q": "Xe có thể hết xăng và không có trạm tiếp nhiên liệu. Hai xe cùng ở B nhưng còn lượng xăng khác nhau. Vì sao trạng thái chỉ ghi B có thể chưa đủ?",
        "opts": [
            "Vì mọi trạng thái phải có ít nhất hai biến",
            "Vì phải lưu toàn bộ lịch sử chuyến đi",
            "Vì màu xe chưa được ghi lại",
            "Vì lượng xăng quyết định những đường còn đi được"
        ],
        "a": 3,
        "ex": "Cùng vị trí nhưng khác nhiên liệu có thể dẫn tới tập hành động khả dụng khác nhau. Cần giữ ít nhất vị trí và nhiên liệu còn lại theo mô hình tiêu hao đã chọn. Không nhất thiết phải lưu toàn bộ lịch sử."
    },
    {
        "topicId": "search-framework",
        "q": "n2 ghi đường A → C giá 5; n3 ghi A → B → C giá 3. Nhận xét nào đúng?",
        "opts": [
            "Cùng STATE = C, khác PARENT và g",
            "Cùng trạng thái nên là cùng một nút",
            "n3 có g = 2 vì đi hai bước",
            "n2 chưa phải trạng thái vì đắt hơn"
        ],
        "a": 0,
        "ex": "STATE của cả hai là C. n2 có cha là nút ở A và g = 5; n3 có cha là nút ở B và g = 3. Nút lưu thông tin về đường đi ngoài trạng thái cuối."
    },
    {
        "topicId": "search-framework",
        "q": "Đang tìm đường rẻ nhất: frontier đã có C với g = 5. Sau đó tìm được đường tới C với g = 3. Nên làm gì?",
        "opts": [
            "Bỏ đường mới vì đã thấy C",
            "Dừng vì vừa tìm được đường rẻ hơn",
            "Cập nhật đường tới C cùng chi phí và nút cha",
            "Chỉ đổi số 5 thành 3, giữ nguyên nút cha cũ"
        ],
        "a": 2,
        "ex": "Phải giữ đường rẻ hơn và cập nhật thông tin để khôi phục đúng đường ấy. Chỉ đổi g mà không đổi cha sẽ khiến đường được trả về không khớp chi phí. Đây là lý do chống lặp đơn thuần chưa đủ cho tìm kiếm theo chi phí."
    }
],
  b4: [
    {
      topicId: 'uninformed',
      q: 'BFS đảm bảo tìm được đường tối ưu khi nào?',
      opts: [
        'Luôn luôn',
        'Khi mọi cạnh có chi phí bằng nhau',
        'Khi đồ thị không có chu trình',
        'Khi heuristic admissible',
      ],
      a: 1,
      ex: 'BFS tối ưu <em>số cạnh</em>, mà ít cạnh đâu có nghĩa là rẻ — đi 2 chặng máy bay vẫn đắt hơn 5 chặng xe buýt. Chi phí cạnh đồng đều thì hai thứ đó trùng nhau, còn không thì phải gọi UCS. BFS chẳng liên quan gì tới heuristic.',
    },
    {
      topicId: 'uninformed',
      q: 'UCS dừng lại lúc nào?',
      opts: [
        'Ngay khi đích được SINH RA và đưa vào frontier',
        'Khi đích được LẤY RA khỏi frontier',
        'Khi frontier rỗng',
        'Khi tìm thấy đường có chi phí nhỏ hơn ngưỡng',
      ],
      a: 1,
      ex: 'Đây là chỗ tôi thấy mất điểm nhiều nhất. Lúc đích vừa được sinh ra, rất có thể còn một đường rẻ hơn đang nằm chờ trong frontier — dừng lúc đó là mất tối ưu. Phải đợi nó được lấy ra, vì lúc đó không còn gì rẻ hơn nữa. BFS thì ngược lại, dừng ngay khi sinh ra được.',
    },
    {
      topicId: 'uninformed',
      q: 'IDS chạy lại tầng nông nhiều lần. Vì sao vẫn dùng nó?',
      opts: [
        'Vì nó nhanh hơn BFS',
        'Vì phần lặp lại không đáng kể so với tầng sâu nhất, mà bộ nhớ chỉ tốn O(bd) thay vì O(b^d)',
        'Vì nó cho nghiệm tối ưu ngay cả khi chi phí cạnh khác nhau',
        'Vì nó không cần explored set',
      ],
      a: 1,
      ex: 'Cây phân nhánh thì tầng cuối đông hơn tất cả các tầng trên cộng lại — nên chạy lại mấy tầng nông gần như miễn phí. Đổi lại bạn được bộ nhớ của DFS cùng với tính đầy đủ và tối ưu của BFS. Còn chi phí cạnh khác nhau thì IDS chịu, đó là việc của UCS.',
    },
    {
      topicId: 'uninformed',
      q: 'DFS tốn O(bm) bộ nhớ còn BFS tốn O(b^d). Vì sao chênh nhau xa tới vậy?',
      opts: [
        'Vì DFS không lưu tập explored',
        'Vì BFS phải giữ cả một tầng đáy trong frontier, còn DFS chỉ giữ một nhánh đang đi',
        'Vì DFS dùng đệ quy nên bộ nhớ nằm ở stack hệ thống, không tính',
        'Vì BFS nhân đôi mỗi nút để lưu đường đi',
      ],
      a: 1,
      ex: 'Hình dung frontier của BFS: nó phải nhớ TOÀN BỘ tầng cuối cùng cùng lúc, mà tầng cuối chiếm gần hết số nút của cây. DFS thì chỉ cần nhớ một đường từ gốc xuống, cộng các anh em chưa duyệt dọc đường — tuyến tính theo độ sâu. Đây chính là lý do IDS tồn tại: mượn bộ nhớ của DFS mà vẫn giữ tính tối ưu của BFS.',
    },
    {
      topicId: 'uninformed',
      q: 'DLS chạm trần độ sâu ℓ thì trả về <em>cutoff</em>. Vì sao phải phân biệt nó với <em>failure</em>?',
      opts: [
        'Chỉ là quy ước đặt tên, không ảnh hưởng gì',
        'cutoff nghĩa là “có thể còn nghiệm sâu hơn, chưa biết”; failure nghĩa là “hết đường thật” — IDS dựa vào đó để quyết định có tăng ℓ nữa không',
        'cutoff dùng cho đồ thị có hướng, failure cho vô hướng',
        'failure nghĩa là gặp vòng lặp, cutoff nghĩa là hết bộ nhớ',
      ],
      a: 1,
      ex: 'Gộp hai thứ này làm một là bug kinh điển. Nếu DLS trả failure khi thực ra chỉ là chạm trần, IDS sẽ kết luận bài toán vô nghiệm và dừng — trong khi nghiệm đang nằm ngay tầng dưới. Ngược lại, trả cutoff khi thực sự hết đường thì IDS lặp mãi không thôi.',
    },
    {
      topicId: 'uninformed',
      q: 'Khi mọi cạnh có cùng chi phí, UCS hành xử thế nào?',
      opts: [
        'Trùng với DFS',
        'Trùng với BFS',
        'Trùng với IDS',
        'Vẫn khác cả ba, vì UCS luôn dùng hàng đợi ưu tiên',
      ],
      a: 1,
      ex: 'Chi phí bằng nhau thì g(n) chỉ còn là số cạnh nhân hằng số, nên “rẻ nhất” cũng chính là “nông nhất” — đúng thứ tự BFS mở nút. Cấu trúc dữ liệu vẫn là hàng đợi ưu tiên, nhưng <em>thứ tự</em> sinh ra thì trùng BFS. Một chi tiết nhỏ vẫn khác: UCS dừng khi đích được LẤY RA, BFS dừng khi đích được SINH RA.',
    },
  ],
  b5: [
    {
      topicId: 'heuristic',
      q: 'Với h admissible, phát biểu nào SAI?',
      opts: [
        'A* tree-search trả nghiệm tối ưu',
        'h(đích) = 0',
        'h được phép lớn hơn chi phí thật ở vài nút, miễn trung bình vẫn nhỏ hơn',
        'GBFS dùng h vẫn có thể trả nghiệm không tối ưu',
      ],
      a: 2,
      ex: 'Admissible là ràng buộc <strong class="hl">tại mọi nút</strong>: h(n) ≤ h*(n), không có chuyện trung bình cho qua. Chỉ cần một nút nói phóng lên là A* mất sạch bảo đảm tối ưu — một con sâu làm rầu nồi canh.',
    },
    {
      topicId: 'admissible-consistent',
      q: 'Quan hệ giữa admissible và consistent là gì?',
      opts: [
        'Hai tên gọi của cùng một tính chất',
        'Consistent kéo theo admissible, nhưng chiều ngược lại thì không',
        'Admissible kéo theo consistent, nhưng chiều ngược lại thì không',
        'Hai tính chất hoàn toàn độc lập',
      ],
      a: 1,
      ex: 'Consistent là điều kiện chặt hơn: h(n) ≤ c(n, n′) + h(n′) tại mọi cạnh. Chặt hơn nên nó bao luôn admissible, còn ngược lại thì không — có heuristic admissible mà không consistent, và đó chính là lúc A* graph-search cần cẩn thận với nút đã đóng.',
    },
    {
      topicId: 'astar',
      q: 'Vì sao A* mở ít nút hơn UCS khi h tốt?',
      opts: [
        'Vì A* bỏ qua explored set',
        'Vì f = g + h kéo các đường viền chi phí bó về phía đích, thay vì loang tròn đều ra mọi hướng',
        'Vì A* dùng stack thay vì hàng đợi ưu tiên',
        'Vì A* dừng ngay khi đích được sinh ra',
      ],
      a: 1,
      ex: 'h = 0 thì f = g, viền là những vòng tròn đồng tâm quanh điểm xuất phát — A* thoái hóa đúng thành UCS, loang cả về hướng ngược với đích. h càng sát chi phí thật, viền càng bị kéo dài về phía đích và bó sát đường tối ưu. Mở Lab chạy hai bên trên preset Romania rồi đếm số nút xám là thấy ngay.',
    },
    {
      topicId: 'heuristic',
      q: 'Trên bản đồ Romania, GBFS trả về đường dài 450 km còn A* trả về 418 km. 32 km đó đi đâu mất?',
      opts: [
        'GBFS dùng heuristic không admissible',
        'GBFS chỉ nhìn h(n) — phần đường còn lại — nên bỏ qua chi phí đã đi và chọn nhầm nhánh trông gần đích',
        'GBFS dừng quá sớm, chưa mở hết frontier',
        'Hai thuật toán dùng hai bảng heuristic khác nhau',
      ],
      a: 1,
      ex: 'Cùng một h, cùng một bản đồ. Khác biệt duy nhất là GBFS bỏ mất vế g(n): nó lao về phía trông gần đích nhất mà không hỏi “tới được đây tôi đã tốn bao nhiêu rồi?”. Tham lam theo nghĩa đen — chọn tốt trước mắt, trả giá ở cuối đường. A* cộng lại cả hai vế nên không bị lừa.',
    },
    {
      topicId: 'admissible-consistent',
      q: 'Điều kiện consistent viết là h(n) ≤ c(n, a, n′) + h(n′). Nó chính là bất đẳng thức gì, và nói lên điều gì?',
      opts: [
        'Bất đẳng thức Cauchy — h bị chặn bởi trung bình cộng',
        'Bất đẳng thức tam giác — đi thẳng tới đích không thể đắt hơn vòng qua một nút trung gian',
        'Bất đẳng thức Markov — xác suất sai của h giảm dần',
        'Không phải bất đẳng thức nào cả, chỉ là định nghĩa thuần quy ước',
      ],
      a: 1,
      ex: 'Đúng hình tam giác: ước lượng từ n thẳng tới đích không được vượt quá (chi phí n → n′) cộng (ước lượng từ n′ tới đích). Hệ quả là f không bao giờ giảm dọc một đường đi, nên nút vừa được lấy ra khỏi frontier lần đầu là đã tối ưu — đó mới là thứ cho phép A* dùng graph-search mà vẫn tối ưu.',
    },
    {
      topicId: 'astar',
      q: 'A* có đầy đủ (complete) vô điều kiện không?',
      opts: [
        'Có, miễn heuristic admissible',
        'Không — còn cần b hữu hạn và mọi chi phí bước ≥ một ε > 0, y hệt điều kiện của UCS',
        'Có, vì f = g + h luôn tăng nên chắc chắn chạm đích',
        'Không — A* chỉ đầy đủ trên đồ thị vô hướng',
      ],
      a: 1,
      ex: 'Chỗ này dễ gật đầu cho qua. Admissible lo phần <em>tối ưu</em>, không lo phần <em>đầy đủ</em>. Nếu chi phí bước tiến dần về 0, A* có thể đi mãi trên một đường vô hạn mà tổng chi phí vẫn hữu hạn, không bao giờ chạm tới đích. Đúng bẫy đã gặp ở UCS — slide còn ghi thẳng “xem lại điều kiện đầy đủ của UCS”.',
    },
  ],
  b6: [
  {
    topicId: "local-model",
    q: "Với mô hình 8-hậu, mỗi cột có đúng một hậu và một nước chỉ đổi hàng của một hậu. Có bao nhiêu trạng thái và hàng xóm của mỗi trạng thái?",
    opts: [
      "8! trạng thái, 28 hàng xóm",
      "8⁸ trạng thái, 56 hàng xóm",
      "64 trạng thái, 8 hàng xóm",
      "2⁸ trạng thái, 64 hàng xóm"
    ],
    a: 1,
    ex: "Mỗi cột chọn độc lập 1 trong 8 hàng nên có 8⁸ trạng thái. Chọn 1 trong 8 hậu rồi 1 trong 7 hàng khác tạo 8 × 7 = 56 hàng xóm. Chuỗi hàng cho phép lặp, không phải hoán vị."
  },
  {
    topicId: "local-landscape",
    q: "Ở bài giảm chi phí, một trạng thái h = 1 có mọi hàng xóm h ≥ 2. Cho phép đi ngang có cứu được ngay không?",
    opts: [
      "Có, vì đi ngang luôn tìm được đích",
      "Không, vì không có hàng xóm bằng điểm để đi ngang",
      "Có, vì h = 1 đã là nghiệm",
      "Không, vì cần tăng số quân hậu"
    ],
    a: 1,
    ex: "Đây là cực tiểu cục bộ nghiêm ngặt: đi ngang không có đất dùng. Bạn cần cơ chế khác như khởi động lại hoặc nhận một bước xấu. h = 1 vẫn còn một cặp xung đột."
  },
  {
    topicId: "local-variants",
    q: "First-choice khác steepest-ascent ở đâu?",
    opts: [
      "Nhận ngay hàng xóm đầu tiên dù xấu hơn",
      "Giữ toàn bộ frontier",
      "Thử theo thứ tự ngẫu nhiên và nhận nước tốt đầu tiên, không cần chấm hết",
      "Luôn chọn nước có mức cải thiện lớn nhất"
    ],
    a: 2,
    ex: "Tôi chỉ cần một nước cải thiện để tiến lên, không nhất thiết nước tốt nhất. Stochastic hill-climbing chọn trong nhóm nước tốt; first-choice có thể ngừng việc tìm hàng xóm sớm."
  },
  {
    topicId: "local-restart",
    q: "Mỗi lượt độc lập có p = 0,25 thành công. Kỳ vọng số lượt chạy tính cả lượt đầu là bao nhiêu?",
    opts: [
      "3",
      "4",
      "0,25",
      "25"
    ],
    a: 1,
    ex: "1/p = 4 lượt tính cả lượt đầu; số lần khởi động lại sau lần đầu có kỳ vọng 3. Đổi cách gọi mà quên đổi cách đếm là lệch một lượt ngay."
  },
  {
    topicId: "local-annealing",
    q: "SA đang giảm chi phí: C(current) = 5, C(next) = 7, T = 2. Xác suất nhận nước này là gì?",
    opts: [
      "1, vì 7 lớn hơn 5",
      "e¹ > 1",
      "e⁻¹ ≈ 0,368",
      "0, mọi bước xấu đều bị loại"
    ],
    a: 2,
    ex: "ΔC = 7 − 5 = 2 > 0, nên P = exp(−2/2) = e⁻¹. Phải là dấu âm cho phần tăng chi phí; xác suất không được vượt 1."
  },
  {
    topicId: "local-beam",
    q: "Beam k = 2 cực đại hóa điểm. Con của A có điểm 9, 8; con của B có 6, 5. Giữ những con nào?",
    opts: [
      "A:9 và B:6",
      "A:8 và B:5",
      "A:9 và A:8",
      "Giữ cả bốn"
    ],
    a: 2,
    ex: "Beam tuyển từ danh sách chung nên cả hai suất có thể về cùng một cha. A:9 và B:6 là cách giữ nhánh độc lập; chính khác biệt này cũng tạo nguy cơ mất đa dạng."
  },
  {
    topicId: "local-genetic",
    q: "Quần thể 4-hậu có fitness 2, 3, 1, 0. P chọn cá thể fitness = 3 theo roulette là bao nhiêu?",
    opts: [
      "3/4",
      "1/3",
      "1/2",
      "1"
    ],
    a: 2,
    ex: "Tổng fitness là 6 nên 3/6 = 1/2. Đây là xác suất của mỗi lượt chọn, không phải lời hứa đúng nửa số cha mẹ trong một thế hệ nhỏ sẽ là cá thể đó."
  },
  {
    topicId: "local-genetic",
    q: "Sau crossover của hai cá thể hợp lệ, khẳng định nào đúng?",
    opts: [
      "Con chắc chắn có fitness cao hơn cả hai cha mẹ",
      "Mọi biểu diễn đều bảo đảm con hợp lệ",
      "Không cần đột biến nữa",
      "Phải chấm lại fitness và kiểm tra các ràng buộc của biểu diễn"
    ],
    a: 3,
    ex: "Chuỗi hàng N-hậu vẫn giữ một hậu mỗi cột nhưng có thể tăng xung đột. Chuỗi hoán vị TSP còn có thể lặp hoặc mất thành phố. Tên “lai ghép” không thay thế được phép kiểm tra."
  }
],
  b7: [
    { topicId: 'game-model', q: 'Trong mô hình minimax tổng bằng không, utility dương thường biểu diễn điều gì?', opts: ['Kết cục tốt cho MAX', 'Kết cục tốt cho MIN', 'Một xác suất', 'Một nước đi hợp lệ'], a: 0, ex: 'Bạn giữ góc nhìn của MAX: điểm cao tốt cho MAX và xấu cho MIN.' },
    { topicId: 'minimax', q: 'Một nút MIN có các giá trị con 4, −1 và 2. Nó truyền giá trị nào lên?', opts: ['4', '2', '−1', '5'], a: 2, ex: 'MIN chọn nhánh có giá trị nhỏ nhất đối với MAX.' },
    { topicId: 'minimax', q: 'Gốc MAX có hai con MIN lần lượt mang giá trị 3 và 0. MAX chọn nhánh nào?', opts: ['Nhánh 0', 'Nhánh 3', 'Ngẫu nhiên', 'Không thể xác định'], a: 1, ex: 'MAX tối đa hóa điểm bảo đảm, nên chọn 3.' },
    { topicId: 'minimax', q: 'Minimax chọn nước đi dựa trên giả định nào?', opts: ['Đối thủ chơi tối ưu', 'Đối thủ luôn mắc lỗi', 'Mọi nước có xác suất bằng nhau', 'Trò chơi không có trạng thái kết thúc'], a: 0, ex: 'Minimax chống lại phản hồi tốt nhất của đối thủ.' },
    { topicId: 'alpha-beta', q: 'α biểu diễn điều gì trong alpha-beta pruning?', opts: ['Giá trị tốt nhất MIN đã thấy', 'Cận dưới: lựa chọn tốt nhất MAX đã biết', 'Độ sâu hiện tại', 'Xác suất thắng'], a: 1, ex: 'α là cận dưới cho kết quả MAX có thể bảo đảm được.' },
    { topicId: 'alpha-beta', q: 'Khi nào có thể cắt tỉa phần cây còn lại?', opts: ['α ≥ β', 'α = 0', 'β = 0', 'Khi gặp lá đầu tiên'], a: 0, ex: 'Nếu α ≥ β, nhánh này không thể thay đổi quyết định của tổ tiên.' },
    { topicId: 'depth-limited-games', q: 'Tìm kiếm trò chơi dừng ở giới hạn độ sâu cần gì để đánh giá trạng thái chưa kết thúc?', opts: ['Hàm đánh giá tĩnh', 'Bảng chân trị', 'Hàm băm duy nhất', 'Hàng đợi FIFO'], a: 0, ex: 'Hàm đánh giá ước lượng utility của trạng thái chưa kết thúc; đó chỉ là xấp xỉ.' },
    { topicId: 'chance-nodes', q: 'Nút CHANCE có kết quả 8 (xác suất 1/4) và 0 (xác suất 3/4). Giá trị kỳ vọng là?', opts: ['8', '4', '2', '6'], a: 2, ex: 'Kỳ vọng = 1/4 × 8 + 3/4 × 0 = 2.' },
  ],
  b9: [
    { topicId: 'kb-agent', q: 'Trong hàm KB-AGENT, phần suy diễn nằm ở đâu?', opts: ['Ẩn bên trong TELL và ASK', 'Trong bộ đếm thời gian t', 'Trong MAKE-PERCEPT-SENTENCE', 'Agent dựa trên tri thức không cần suy diễn'], a: 0, ex: 'Vòng lặp của agent chỉ có ba việc: TELL điều vừa thấy, ASK nên làm gì, TELL việc đã làm. Toàn bộ chuyện “từ câu cũ ra câu mới” được giấu trong <strong class="hl">TELL và ASK</strong> — nên thay bộ suy diễn mà không phải viết lại agent.' },
    { topicId: 'entailment', q: 'KB ⊨ α nghĩa là gì?', opts: ['α đúng trong ít nhất một mô hình của KB', 'α đúng trong mọi mô hình mà KB đúng, tức M(KB) ⊆ M(α)', 'KB đúng trong mọi mô hình của α', 'α được viết nguyên văn trong KB'], a: 1, ex: 'Hệ quả logic là quan hệ tập con: <strong class="hl">mọi</strong> thế giới còn sống sót sau khi lọc bằng KB đều làm α đúng. Một mô hình là chưa đủ, và α cũng không cần nằm sẵn trong KB.' },
    { topicId: 'entailment', q: 'Agent đã đi [1,1] → [2,1] và cảm thấy gió ở [2,1]. KB của nó không suy ra được ¬P₂,₂. Kết luận nào đúng?', opts: ['Chắc chắn có hố ở [2,2]', 'Chắc chắn không có hố ở [2,2]', 'Chưa biết: KB có mô hình có hố ở [2,2] và cũng có mô hình không có', 'KB đang mâu thuẫn'], a: 2, ex: 'KB ⊭ ¬P₂,₂ <strong>không</strong> có nghĩa là KB ⊨ P₂,₂. Trong ba mô hình của KB, hai mô hình có hố ở [2,2], một mô hình thì không. Agent cẩn thận sẽ tránh ô đó cho tới khi có thêm cảm nhận.' },
    { topicId: 'pl-semantics', q: 'Câu P ⇒ Q sai trong trường hợp nào?', opts: ['P sai, Q đúng', 'P sai, Q sai', 'P đúng, Q sai', 'P đúng, Q đúng'], a: 2, ex: 'Kéo theo là một lời hứa: nó chỉ bị phá khi điều kiện xảy ra mà kết quả không tới. P sai thì lời hứa chưa bị thử thách, nên câu vẫn <strong class="hl">đúng</strong>.' },
    { topicId: 'validity-sat', q: 'Câu (A ∧ B) ⇒ (A ∨ C) thuộc loại nào?', opts: ['Hằng đúng (valid)', 'Thỏa được nhưng không hằng đúng', 'Không thỏa được', 'Chưa xác định được vì không biết C'], a: 0, ex: 'Muốn câu sai thì A ∧ B phải đúng — mà khi đó A đúng nên A ∨ C cũng đúng. Không dòng nào làm câu sai, nên nó <strong class="hl">hằng đúng</strong>, bất kể C.' },
    { topicId: 'validity-sat', q: 'Muốn chứng minh α ⊨ β bằng phản chứng, bạn kiểm điều gì?', opts: ['α ∨ β thỏa được', 'α ∧ ¬β không thỏa được', '¬α ∧ β là hằng đúng', 'β ⇒ α là hằng đúng'], a: 1, ex: 'α ⊨ β khi và chỉ khi không có thế giới nào vừa làm α đúng vừa làm β sai, tức <strong class="hl">α ∧ ¬β không thỏa được</strong>. Resolution và DPLL đều chạy trên đúng câu này.' },
    { topicId: 'resolution', q: 'Hợp giải (A ∨ B) với (¬B ∨ C) cho ra mệnh đề nào?', opts: ['A ∨ C', 'A ∧ C', 'B ∨ ¬B', '□ (mệnh đề rỗng)'], a: 0, ex: 'B và ¬B là cặp bù nhau, bỏ đi và gộp phần còn lại: <strong class="hl">A ∨ C</strong>. Lý do: nếu B sai thì vế đầu buộc A; nếu B đúng thì vế sau buộc C — kiểu gì cũng A hoặc C.' },
    { topicId: 'horn-chaining', q: 'Câu nào là mệnh đề xác định (definite clause)?', opts: ['¬P ∨ Q ∨ R', '¬P ∨ ¬Q ∨ R', '¬P ∨ ¬Q', 'P ∨ Q'], a: 1, ex: 'Mệnh đề xác định có <strong class="hl">đúng một</strong> literal dương: ¬P ∨ ¬Q ∨ R ≡ P ∧ Q ⇒ R. Câu ¬P ∨ ¬Q không có literal dương nào — nó là goal clause, vẫn là Horn nhưng không xác định.' },
    { topicId: 'horn-chaining', q: 'KB có hàng nghìn luật xác định, bạn chỉ cần biết một câu hỏi cụ thể. Cách nào thường làm ít việc thừa hơn?', opts: ['Forward chaining, vì nó tự động', 'Backward chaining, vì nó chỉ lần những luật có liên quan tới câu hỏi', 'Bảng chân trị, vì nó đầy đủ', 'Cả hai chaining luôn tốn như nhau'], a: 1, ex: 'Forward chaining là hướng dữ liệu: bắn mọi luật đủ điều kiện, kể cả những luật chẳng dính gì tới câu hỏi. Backward chaining là <strong class="hl">hướng mục tiêu</strong>, nên chi phí thường nhỏ hơn hẳn kích thước KB.' },
    { topicId: 'sat-solvers', q: 'Với (A ∨ ¬B), (¬B ∨ ¬C), (A ∨ C), ký hiệu nào thuần (pure)?', opts: ['Chỉ A', 'A và B', 'B và C', 'Cả A, B và C'], a: 1, ex: 'A chỉ xuất hiện dạng dương, B chỉ xuất hiện dạng ¬B — hai ký hiệu thuần. C có cả ¬C lẫn C nên không thuần. DPLL gán A = đúng, B = sai mà không sợ làm sai mệnh đề nào.' },
    { topicId: 'sat-solvers', q: 'WalkSAT chạy hết max_flips trên KB ∧ ¬α và trả failure. Bạn kết luận được gì?', opts: ['KB ⊨ α', 'KB ⊭ α', 'Chưa kết luận được: có thể vô nghiệm, cũng có thể cần thêm thời gian', 'KB mâu thuẫn'], a: 2, ex: 'WalkSAT <strong class="hl">không đầy đủ</strong>: tìm ra mô hình thì chắc chắn thỏa được, nhưng không tìm ra thì chưa chứng minh được gì. Nó chỉ nói được “tôi nghĩ cả giờ mà không thấy thế giới nào như vậy”.' },
  ],
};

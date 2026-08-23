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
      topic: 'Bốn hướng tiếp cận',
      q: 'Một chương trình được chấm điểm bằng cách so từng bước suy luận của nó với vết suy nghĩ của người thật ngồi giải cùng bài. Nó nằm ở ô nào?',
      opts: ['Suy nghĩ như người', 'Hành động như người', 'Suy nghĩ duy lý', 'Hành động duy lý'],
      a: 0,
      ex: 'Hai chữ khóa: nó mở nắp máy ra soi <em>quá trình</em> (suy nghĩ), và cầm cây thước là <em>người thật</em>. Đó đúng là cách Newell và Simon chấm GPS năm 1961 — ra đúng đáp án chưa được tính điểm, phải đi đúng cả đường trong đầu nữa.',
    },
    {
      topic: 'Bốn hướng tiếp cận',
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
      topic: 'Phép thử Turing',
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
      topic: 'Nền tảng',
      q: 'AI ⊃ Machine Learning ⊃ Deep Learning. Cách đọc nào đúng?',
      opts: [
        'Ba tên gọi khác nhau của cùng một thứ',
        'Deep learning là một kiểu machine learning, và machine learning là một cách làm AI — nhưng AI còn nhiều nhánh không học gì cả',
        'AI là ứng dụng của deep learning',
        'Machine learning ra đời trước AI',
      ],
      a: 1,
      ex: 'Búp bê Nga: lớp nào cũng nằm gọn trong lớp ngoài. Chỗ hay bị quên là mấy nhánh AI <em>không</em> học gì hết — tìm kiếm, logic, CSP đều nằm ở buổi 3 tới 8, và không cái nào cần một dòng dữ liệu huấn luyện.',
    },
    {
      topic: 'Lịch sử',
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
      topic: 'Lịch sử',
      q: 'Sắp đúng thứ tự thời gian: (1) Deep Blue thắng Kasparov · (2) Hội nghị Dartmouth · (3) AlphaGo thắng Lee Sedol · (4) Kiến trúc Transformer',
      opts: ['2 → 1 → 3 → 4', '2 → 1 → 4 → 3', '1 → 2 → 3 → 4', '2 → 3 → 1 → 4'],
      a: 0,
      ex: 'Dartmouth 1956 → Deep Blue 1997 → AlphaGo 2016 → Transformer 2017. Cái bẫy nằm ở hai mốc cuối: Transformer ra <em>sau</em> AlphaGo đúng một năm, dù giờ nghe tên nó quen hơn nhiều.',
    },
    {
      topic: 'Agent duy lý',
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
      topic: 'Ứng dụng & giới hạn',
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
      topic: 'Hàm agent',
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
      topic: 'Thước đo hiệu năng',
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
      topic: 'Thước đo hiệu năng',
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
      topic: 'Duy lý ≠ toàn tri',
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
      topic: 'PEAS',
      q: 'Với taxi tự lái, “vô lăng, chân ga, phanh, xi-nhan” thuộc thành phần nào của PEAS?',
      opts: ['Performance measure', 'Environment', 'Actuators', 'Sensors'],
      a: 2,
      ex: 'Cặp A–S là chỗ bị nhầm nhiều nhất. Mẹo: tự hỏi “cái này đưa thông tin <em>vào</em> hay đẩy tác động <em>ra</em>?”. Camera, GPS, đồng hồ tốc độ đưa vào → sensors. Vô lăng, ga, phanh đẩy ra → actuators.',
    },
    {
      topic: 'Bảy chiều môi trường',
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
      topic: 'Bảng tra',
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
      topic: 'Năm kiến trúc',
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
      topic: 'Phát biểu bài toán',
      q: 'Năm thành phần của một bài toán tìm kiếm là gì?',
      opts: [
        'Trạng thái đầu · hành động · mô hình chuyển · phép thử đích · chi phí đường đi',
        'Trạng thái đầu · đích · heuristic · frontier · explored set',
        'Đỉnh · cạnh · trọng số · đường đi · chu trình',
        'Trạng thái đầu · hành động · heuristic · phép thử đích · chi phí',
      ],
      a: 0,
      ex: 'Heuristic <em>không</em> nằm trong phát biểu bài toán — nó là thứ bạn thêm vào để giải nhanh hơn, và cùng một bài toán gắn heuristic khác nhau vẫn là một bài toán. Frontier với explored set thì càng không: chúng là đồ nghề của thuật toán, không phải mô tả đề bài.',
    },
    {
      topic: 'Khung tìm kiếm',
      q: 'BFS, DFS và UCS dùng chung một vòng lặp graph-search. Khác biệt DUY NHẤT nằm ở đâu?',
      opts: ['Cách kiểm tra đích', 'Cấu trúc dữ liệu của frontier', 'Cách sinh trạng thái kế tiếp', 'Cách lưu explored set'],
      a: 1,
      ex: 'FIFO queue → BFS · LIFO stack → DFS · hàng đợi ưu tiên theo g → UCS. Một vòng lặp, ba tính cách. Nhớ được chỗ này là nhớ được cả nửa buổi — và cũng là lý do Lab chỉ cần đổi một dòng để chuyển thuật toán.',
    },
    {
      topic: 'Tìm kiếm mù',
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
      topic: 'Tìm kiếm mù',
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
      topic: 'Tìm kiếm mù',
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
      topic: 'Heuristic',
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
      topic: 'Admissible & consistent',
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
      topic: 'A*',
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
  ],
};

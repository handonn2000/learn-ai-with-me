export const VI = {
  nav: {
    math: "TOÁN NỀN",
    model: "01 Trò chơi",
    minimax: "02 Minimax",
    lab: "03 Tự thử",
    pruning: "04 α–β",
    limits: "05 Hết giờ",
    chance: "06 Ngẫu nhiên",
    extensions: "07 Mở rộng",
    summary: "08 Ghi nhớ",
    quiz: "09 Quiz",
    practice: "10 Bài tập"
  },
  hero: {
    badge: "BUỔI 7",
    eyebrow: "CSC14003 · PHẦN II — TÌM KIẾM",
    title: "Tìm kiếm đối kháng",
    accent: "Bạn đi một nước. Đối thủ cũng vậy.",
    lead: "Bạn thấy một nước có thể kiếm 7 điểm. Nhưng đối thủ có quyền chọn nhánh khiến bạn chỉ còn 0. Tôi muốn bạn nhìn được cả lượt đáp trả ấy: đó là bước chuyển từ tìm đường sang chơi một trò chơi.",
    time: "~3 giờ · có thực hành",
    families: "Minimax · α–β · kỳ vọng",
    quiz: "8 câu tự kiểm",
    cta: "Bắt đầu với cây trò chơi →",
    back: "← Buổi 6"
  },
  goals: {
    title: "Sau buổi này, bạn làm được gì?",
    items: [
      "Mô tả trò chơi bằng trạng thái, lượt đi, nước hợp lệ và điểm kết cục.",
      "Tính minimax từ lá lên gốc và giải thích nước được chọn.",
      "Chỉ ra nhánh α–β bỏ qua và lý do bỏ qua an toàn.",
      "Phân biệt utility, điểm ước lượng và utility kỳ vọng."
    ],
    path: "Lượt đọc đầu: mục 01–06. Sau đó thử đổi điểm ở lab, làm quiz rồi quay lại mục 07 nếu bạn muốn mở rộng."
  },
  model: {
    headers: ["Trò chơi", "Thông tin / ngẫu nhiên", "Mô hình"],
    boardBefore: "Trước: X đang đi",
    boardAfter: "Sau: X thắng, U=+1",
    boardCaption: "X chọn ô trống cuối hàng đầu. Cạnh trong cây là nước đặt X ấy; trạng thái sau nước đi là một lá kết thúc.",
    title: "🎲 Đến lượt đối thủ, bạn mất quyền chọn",
    en: "Games as search problems",
    lead: "Ở buổi 3, bạn chọn các bước trên một con đường. Trên bàn cờ, đối thủ chọn một nửa số bước.",
    paras: [
      "Một trạng thái trò chơi phải ghi <strong class=\"hl\">cả vị trí và người đang đi</strong>. Cùng một bàn cờ nhưng đổi lượt có thể đổi hoàn toàn kết quả. Mỗi cạnh của cây là một nước hợp lệ; mỗi tầng là một lượt của một người chơi, gọi là <em>ply</em>. Hai ply thường tương ứng một lượt của mỗi bên.",
      "Tôi dùng tic-tac-toe 3×3 để bắt đầu. X là MAX, O là MIN. Cả hai nhìn thấy bàn cờ, đi luân phiên và không gieo xúc xắc. Điểm luôn ghi từ góc nhìn X: thắng +1, hòa 0, thua −1. Khi O thắng, điểm của X giảm: vì thế O tìm giá trị nhỏ nhất."
    ],
    cards: [
      {
        title: "S₀ · Trạng thái đầu",
        body: "Bàn 3×3 trống, X đi trước."
      },
      {
        title: "PLAYER(s) · Ai đi?",
        body: "X hay O đang được chọn ô tiếp theo."
      },
      {
        title: "ACTIONS(s) · Nước hợp lệ",
        body: "Các ô trống trên bàn chưa kết thúc."
      },
      {
        title: "RESULT(s,a) · Sau nước đi",
        body: "Đánh dấu ô đã chọn rồi chuyển lượt."
      },
      {
        title: "TERMINAL(s) · Đã kết thúc?",
        body: "Một bên có 3 dấu trên một hàng, cột, đường chéo; hoặc bàn đầy."
      },
      {
        title: "UTILITY(s) · Điểm kết cục",
        body: "+1 nếu X thắng, 0 nếu hòa, −1 nếu O thắng."
      }
    ],
    assumptions: "Mô hình minimax cơ bản: <strong>hai người · đối nghịch/tổng bằng không · biết toàn bộ trạng thái · không ngẫu nhiên · luân phiên</strong>. MIN cũng tối ưu mục tiêu của mình. Minimax không hứa bạn luôn thắng; nó hứa chọn phương án tốt nhất trước phản hồi tối ưu, trong mô hình đang dùng.",
    classifyTitle: "Có đối thủ chưa chắc dùng cùng một mô hình",
    rows: [
      [
        "Cờ vua / tic-tac-toe",
        "Biết đầy đủ, không ngẫu nhiên",
        "MAX và MIN"
      ],
      [
        "Backgammon",
        "Biết trạng thái, có xúc xắc",
        "Thêm CHANCE"
      ],
      [
        "Poker",
        "Có bài ẩn và ngẫu nhiên",
        "Cần mô hình thông tin/niềm tin"
      ],
      [
        "Hợp tác / nhiều người",
        "Mục tiêu có thể cùng có lợi",
        "Một điểm MAX/MIN có thể không đủ"
      ]
    ]
  },
  minimax: {
    title: "🌳 Minimax: đọc cây từ lá lên",
    en: "Back up values, then choose a move",
    lead: "Lá lớn nhất là 7. Nhưng để tới lá đó, bạn phải nhờ đối thủ chọn đúng nhánh bạn mong muốn.",
    paras: [
      "Cây dưới đây có hai nước của MAX: A và B. Sau A, MIN chọn giữa 3 và 5. Sau B, MIN chọn giữa 0 và 7. Các số là điểm kết cục mẫu, không phải điểm thắng/thua của tic-tac-toe. Tôi giữ đúng cây này xuyên suốt phần minimax và α–β.",
      "<strong class=\"hl\">MIN lấy nhỏ nhất; MAX lấy lớn nhất.</strong> Bắt đầu từ nơi biết chắc điểm — các lá — rồi truyền giá trị lên cha. Đừng đổi dấu ở mỗi tầng: mọi con số vẫn từ góc nhìn MAX."
    ],
    formula: "Lá: V(s)=U(s)  ·  MAX: V(s)=max V(con)  ·  MIN: V(s)=min V(con)",
    steps: [
      "A = min(3,5) = 3. Nếu MAX chọn A, MIN có thể buộc kết quả là 3.",
      "B = min(0,7) = 0. Nếu MAX chọn B, MIN sẽ chọn 0 thay vì tặng MAX 7.",
      "Gốc = max(3,0) = 3. MAX chọn A; kết quả bảo đảm là 3."
    ],
    takeaway: "Nước được chọn là A; giá trị của nước đó là 3. Bạn cần giữ cả hai: thuật toán tính điểm để so sánh, rồi trả nước đi để agent hành động.",
    strategy: "Một chiến lược là kế hoạch có nhánh: <em>nếu đối thủ đáp thế này, bạn đi thế kia</em>. Nó không phải một đường cố định tới chiến thắng. Nếu trò chơi chỉ có thể hòa trước đối thủ tối ưu, minimax bảo đảm hòa; nếu mọi nước đều thua, nó vẫn chọn giá trị tốt nhất hiện có.",
    exampleTitle: "Thêm một nhánh · thử tính trước",
    example: "Trong một cây lớn hơn, ba nút MIN có các lá (3,12,8), (2,4,6), (14,5,2). Chúng trả lần lượt 3, 2, 2; MAX chọn nhánh đầu với 3. Lá 14 hấp dẫn nhất nhưng MIN không có lý do chọn nó.",
    check: {
      q: "Với cây A=(3,5), B=(0,7), MAX nên chọn gì?",
      opts: [
        "B vì có lá 7",
        "A vì bảo đảm 3",
        "A vì bảo đảm 5"
      ],
      a: 1,
      ex: "MIN điều khiển nước sau bạn: A bị hạ xuống 3, B bị hạ xuống 0. MAX so 3 với 0, không so 5 với 7."
    }
  },
  lab: {
    title: "🧪 Đổi điểm, rồi tự bảo vệ quyết định",
    en: "An experiment, not another diagram",
    lead: "Nếu lá 7 đổi thành 100, bạn có muốn chuyển sang B? Hãy dự đoán trước khi xem kết quả.",
    intro: "Tôi muốn bạn thử ba thay đổi: (1) tăng lá cuối từ 7 lên 100; (2) tăng lá 0 lên 4; (3) giữ điểm nhưng xét B trước A. Hai thử nghiệm đầu phân biệt điểm tốt nhất với điểm bảo đảm; thử nghiệm cuối chuẩn bị cho cắt tỉa.",
    score: "Điểm lá",
    root: "Người đi ở gốc",
    order: "Thứ tự duyệt",
    orders: [
      "A trước B",
      "B trước A"
    ],
    result: "Nước được chọn",
    value: "Giá trị minimax",
    leaves: "Số lá được tính",
    pruned: "Lá bỏ qua",
    full: "Minimax đầy đủ",
    alpha: "Có α–β",
    reset: "Khôi phục ví dụ",
    labels: [
      "a₁",
      "a₂",
      "b₁",
      "b₂"
    ],
    note: "Ở gốc MIN, các con là MAX: đổi người đi là đổi quy tắc trên từng tầng. Các kết quả dưới đây được tính từ dữ liệu bạn nhập.",
    answer: "Ví dụ gốc: tăng 7 lên 100 vẫn chọn A=3; tăng 0 lên 4 khiến B=min(4,7)=4, nên MAX chọn B. Đổi thứ tự duyệt giữ nguyên giá trị minimax, nhưng có thể đổi số lá được tính."
  },
  visual: {
    title: "Cây trò chơi",
    minimax: "Minimax · tính đủ",
    alpha: "α–β · cùng quyết định",
    legend: "Viền chấm: chưa tính · viền liền: đã tính · vòng vàng: đang xét · ×: bỏ qua. Điểm lá luôn hiện để bạn tự tính.",
    cycle: "Minh họa tự lặp. Lời giải đầy đủ nằm ngay dưới hình.",
    leaf: "Đọc lá",
    backup: "Trả về",
    cut: "Cắt nhánh",
    start: "Điểm lá đã biết; bắt đầu duyệt A trước B.",
    done: "Gốc chọn",
    bound: "Cận trả về",
    left: "A",
    right: "B"
  },
  pruning: {
    title: "✂️ α–β: đủ lý do thì dừng",
    en: "Prune without changing the decision",
    lead: "MAX đã có A=3. Ở B, MIN vừa thấy 0. Đọc thêm lá còn lại có giúp B vượt 3 không?",
    paras: [
      "Không. Dù lá còn lại lớn đến đâu, MIN vẫn có quyền chọn 0. Giá trị B <strong>không lớn hơn 0</strong>, nên B không thể thay thế A=3. Tôi không cần biết giá trị chính xác của B để loại nó khỏi lựa chọn của gốc.",
      "<strong class=\"hl\">α</strong> là cận dưới từ phương án MAX đã có trên đường hiện tại; <strong class=\"hl\">β</strong> là cận trên từ phương án MIN đã có. Hai cận được truyền xuống cây. MAX cập nhật α; MIN cập nhật β. Khi <strong class=\"hl\">α ≥ β</strong>, phần còn lại của nút hiện tại không thể cải thiện quyết định của tổ tiên."
    ],
    steps: [
      "Ban đầu α=−∞, β=+∞. Chưa biết phương án nào.",
      "Tính A: đọc 3, 5 → MIN trả 3 → gốc MAX đặt α=3.",
      "Sang B: đọc 0 → MIN đặt β=0. Vì β≤α, bỏ qua lá b₂.",
      "Gốc trả A=3 như minimax. Chỉ tính 3 trong 4 lá. Giá trị B chỉ biết ≤0, không cần khẳng định bằng 0."
    ],
    ordering: "Thứ tự duyệt quyết định tiết kiệm được bao nhiêu. Nếu xét B trước A ở ví dụ này, bạn phải đọc đủ 4 lá. Nếu nhiều nước có cùng giá trị tối ưu, thứ tự cũng có thể đổi nước được chọn để phá hòa; giá trị tối ưu vẫn giữ nguyên.",
    cost: "Minimax tốn O(bᵐ) thời gian với b là số nước trung bình và m là độ sâu tối đa. Khi sinh các con một lần, duyệt sâu dùng O(bm) bộ nhớ; nếu sinh từng con có thể giảm bộ nhớ phụ. α–β xấu nhất vẫn O(bᵐ), thứ tự lý tưởng khoảng O(bᵐ⁄²): với cùng ngân sách, có thể tìm sâu gần gấp đôi.",
    check: {
      q: "Sau khi cắt B vì đã thấy lá 0, bạn biết chắc điều gì?",
      opts: [
        "B bằng 0",
        "B không lớn hơn 0; gốc vẫn chọn A=3",
        "Mọi lá trong B bằng 0"
      ],
      a: 1,
      ex: "Lá chưa đọc có thể âm, khiến B nhỏ hơn 0. Cận ≤0 đã đủ để chứng minh B không vượt 3. Cắt tỉa giữ quyết định của gốc, không tính chính xác mọi cây con."
    }
  },
  limits: {
    title: "⏱️ Hết giờ, bạn vẫn phải đi",
    en: "Terminal utility versus a depth cutoff",
    lead: "Cây nhỏ có thể tính tới cuối. Cờ vua thì đồng hồ hết giờ rất lâu trước khi bạn nhìn thấy hết mọi ván.",
    paras: [
      "Với b=30, sâu 4 ply có cỡ 30⁴=810.000 lá; sâu 8 ply có cỡ 30⁸=656.100.000.000 lá trong cây đều. Thêm 4 ply làm số lá tăng 810.000 lần. Đây là phép tính mẫu để thấy độ tăng, không phải kích thước cố định của cờ vua.",
      "Có hai lý do dừng khác nhau. <strong>Trò chơi đã kết thúc:</strong> trả utility thật. <strong>Đạt giới hạn độ sâu/thời gian:</strong> trả EVAL(s), một ước lượng. Tôi luôn kiểm kết thúc trước; nếu đã thắng thì không để điểm quân số đánh giá đó thành thua."
    ],
    evaluation: "Ví dụ đánh giá quân số: EVAL = 9q + 5r + 3b + 3n + p. Mỗi biến là số quân MAX trừ số quân MIN: hậu, xe, tượng, ngựa, tốt. Nếu MAX hơn 1 xe nhưng kém 2 tốt, phần quân số là 5−2=3. Một vua sắp bị chiếu hết có thể làm điểm +3 ấy vô nghĩa; vị trí và tương tác giữa quân cũng quan trọng.",
    cards: [
      {
        title: "Iterative deepening",
        body: "Tìm sâu 1, 2, 3…; giữ kết quả của độ sâu đã hoàn tất. Nếu hết giờ giữa độ sâu mới, trả nước của lần hoàn tất trước. Dữ liệu lần trước cũng giúp xếp nước tốt lên đầu."
      },
      {
        title: "Quiescence search",
        body: "Đừng dừng giữa một chuỗi bắt quân đang làm điểm nhảy mạnh. Tìm tiếp các diễn biến chiến thuật tới thế ổn định hơn, với giới hạn để tránh mở rộng vô tận."
      },
      {
        title: "Hiệu ứng chân trời",
        body: "Một quân tượng chắc chắn sắp bị mất. Các nước chiếu trì hoãn việc mất tượng tới ngoài độ sâu đang nhìn; hàm đánh giá tưởng tượng còn sống là còn an toàn. Quiescence giảm một số lỗi đánh giá chiến thuật, nhưng không chữa mọi lỗi chân trời."
      }
    ],
    rule: "Hàm đánh giá cần nhanh, hữu ích cho thứ tự thế cờ, và phải tôn trọng thắng > hòa > thua. Minimax giới hạn độ sâu chỉ tối ưu trên cây đã cắt và điểm ước lượng; nó không còn bảo đảm tối ưu cho toàn ván."
  },
  chance: {
    safe: "An toàn",
    gamble: "Cược",
    title: "🎯 Xúc xắc không cố đánh bại bạn",
    en: "Expectimax and expectiminimax",
    lead: "MIN có ý định. Xúc xắc không có. Dùng cùng quy tắc cho hai thứ này sẽ chọn sai nước.",
    paras: [
      "Nếu một kết quả do ngẫu nhiên chọn, thêm nút <strong class=\"hl\">CHANCE</strong>. Nó không chọn lá tốt nhất hay xấu nhất: nó lấy trung bình theo xác suất. Các xác suất không âm và phải tổng bằng 1.",
      "<strong>Expectimax</strong> có MAX và CHANCE, ví dụ một đối thủ được mô hình như hành vi ngẫu nhiên. <strong>Expectiminimax</strong> giữ cả MAX, MIN và CHANCE, ví dụ hai người chơi đối kháng nhưng nước đi còn chịu ảnh hưởng của xúc xắc. Nút MAX/MIN vẫn dùng quy tắc cũ."
    ],
    formula: "V(CHANCE) = Σ pᵢV(conᵢ)",
    example: "Lựa chọn an toàn luôn được 2 điểm. Cược được 10 với xác suất 1/4 và −1 với xác suất 3/4: kỳ vọng = 1/4×10 + 3/4×(−1) = 1,75. MAX chọn an toàn 2. Nếu xác suất được 10 tăng lên 1/2, kỳ vọng là 4,5: lúc này MAX chọn cược.",
    scaleTitle: "Thang điểm có thể đổi quyết định",
    scale: "Với minimax, biến đổi tăng nghiêm ngặt giữ thứ tự min/max. Với kỳ vọng, độ lớn phải có nghĩa. Ví dụ A chắc chắn được 4, B được 0 hoặc 6 với xác suất 1/2 mỗi kết quả: A=4 > E[B]=3. Bình phương điểm: A=16, E[B]=18 — thứ tự đảo. Vì vậy không tùy ý biến đổi phi tuyến utility; biến đổi tuyến tính dương ax+b (a>0) giữ lựa chọn theo kỳ vọng.",
    prune: "Nút CHANCE không được cắt chỉ vì một lá xấu. Nếu biết mọi điểm trong [L,H], có thể chặn phần chưa đọc. Ví dụ cược có hai kết quả đồng xác suất trong [0,9]; đã đọc lá 1 thì kỳ vọng tối đa = (1+9)/2=5. Nếu MAX có phương án 6, bạn có thể bỏ phần còn lại.",
    check: {
      q: "Một nút CHANCE có hai lá 0 và 8, mỗi lá xác suất 1/2. Nó trả gì?",
      opts: [
        "0, vì phải phòng trường hợp xấu nhất",
        "8, vì chọn tốt nhất",
        "4, là kỳ vọng"
      ],
      a: 2,
      ex: "CHANCE không điều khiển kết quả. 1/2×0 + 1/2×8 = 4. Nếu hai xác suất thay đổi, điểm kỳ vọng cũng thay đổi."
    }
  },
  extensions: {
    title: "Mở rộng · khi giả định không còn đúng",
    en: "Keep the core rules, know their limits",
    lead: "Bạn đã biết cây hai người. Một trò chơi có thêm người, bài ẩn hay quá nhiều nước cần cách mô hình khác.",
    cards: [
      {
        title: "Nhiều người · vector utility",
        body: "Trong max-n, mỗi lá có vector như (3,1,2); tới lượt người thứ i, họ chọn con có thành phần i cao nhất. Liên minh và lợi ích cùng chiều làm phép MAX/MIN một chiều không đủ; max-n cũng không giải quyết tự động mọi hành vi hợp tác."
      },
      {
        title: "Thứ tự nước và transposition",
        body: "Có thể ưu tiên nước tốt từ vòng iterative deepening trước; bảng transposition nhận ra cùng trạng thái tới qua các đường khác nhau. Phải lưu độ sâu và loại điểm (chính xác/cận dưới/cận trên), không dùng mọi giá trị cắt tỉa như điểm chính xác."
      },
      {
        title: "Mở rộng chọn lọc và forward pruning",
        body: "Singular extension tìm sâu hơn ở nước nổi bật. Beam chỉ giữ vài nước; PROBCUT dùng bằng chứng xác suất để bỏ nhánh. Các cách bỏ nước này có thể mất nước tốt; chúng không có cùng bảo đảm giữ minimax như α–β."
      },
      {
        title: "Search và lookup",
        body: "Opening book gợi ý nước mở đầu; endgame tablebase lưu kết quả cho các thế cuối được bao phủ. Checkers/Chinook, Deep Blue và AlphaGo cho thấy sức mạnh của tìm kiếm kết hợp tri thức, bảng tra hoặc đánh giá học được — không phải chỉ một cây minh họa lớn hơn."
      },
      {
        title: "Thông tin ẩn",
        body: "Poker cần phân biệt trạng thái thật với điều agent biết: các lá có thể biểu diễn thế bài khác nhau với xác suất/niềm tin. Đừng cho thuật toán xem lá bài đối thủ rồi nhận đó là chiến lược hợp lệ."
      }
    ],
    codeTitle: "Đọc đệ quy như một lời giải",
    codeLead: "Tôi giữ mã ngắn để bạn thấy ba chỗ quyết định: trạng thái kết thúc, người đi và truyền điểm lên. Cây phải hữu hạn; cần thêm cutoff/EVAL nếu trò chơi lớn hoặc có chu trình."
  },
  summary: {
    title: "Ghi nhớ trên một màn hình",
    en: "Three node types, three rules",
    lead: "Khi quên tên thuật toán, hãy nhìn người đang chọn ở nút đó.",
    headers: [
      "Nút / tình huống",
      "Quy tắc",
      "Điều cần giữ"
    ],
    rows: [
      [
        "Lá kết thúc",
        "UTILITY thật",
        "Cùng góc nhìn MAX"
      ],
      [
        "MAX",
        "max các con",
        "Nước tốt nhất trước phản hồi của đối thủ"
      ],
      [
        "MIN",
        "min các con",
        "Đối thủ tối ưu mục tiêu đối nghịch"
      ],
      [
        "CHANCE",
        "Σ pᵢVᵢ",
        "Xác suất và thang utility có nghĩa"
      ],
      [
        "α–β",
        "Dừng khi α≥β",
        "Giữ giá trị minimax ở gốc"
      ],
      [
        "Giới hạn độ sâu",
        "EVAL ở lá chưa kết thúc",
        "Ước lượng có thể sai"
      ]
    ],
    recall: "Tự kể lại bằng một câu: MAX chọn nước có kết quả bảo đảm cao nhất, MIN tìm phản hồi thấp nhất, CHANCE lấy kỳ vọng."
  },
  quiz: {
    title: "Tự kiểm · rồi quay lại chỗ vướng",
    en: "Check your understanding",
    lead: "Tôi muốn bạn giải thích được lý do của mỗi đáp án. Nếu sai, xem phản hồi trước khi làm câu tiếp theo."
  },
  hw: {
    title: "Bài tập · từ cây mẫu tới cây mới",
    en: "Practice and transfer",
    lead: "Thử giải bằng giấy trước. Cây khác hình nhưng quy tắc không đổi.",
    hint: "Xem gợi ý và lời giải",
    file: "Mở bài tập gốc (PDF)",
    cards: [
      {
        title: "1 · Đổi gốc thành MIN",
        body: "Gốc MIN có hai con MAX. Các lá của A là (3,5), của B là (0,7). Tính giá trị và chọn nước ở gốc.",
        hint: "A=max(3,5)=5; B=max(0,7)=7. Gốc MIN chọn A với min(5,7)=5. Đổi người đi phải đổi toàn bộ các tầng."
      },
      {
        title: "2 · Chứng minh một nhánh bị cắt",
        body: "Trở lại gốc MAX. Giữ A=(3,5), đổi B=(2,100). Duyệt A trước B. Đánh dấu lá cần tính và lá có thể bỏ.",
        hint: "A=3 nên α=3. B đọc 2 nên β=2≤3; bỏ lá 100. Gốc vẫn A=3, chỉ tính 3 lá. Bạn chỉ biết B≤2 trước khi đọc toàn bộ."
      },
      {
        title: "3 · Thay MIN bằng CHANCE",
        body: "A chắc chắn được 3. B có hai kết quả 0 và 7. Xác suất nhận 7 phải lớn hơn bao nhiêu để MAX thích B?",
        hint: "Nếu P(7)=p thì E[B]=7p. Muốn B tốt hơn A: 7p>3 → p>3/7. Tại p=3/7, hai nước ngang nhau."
      }
    ],
    checks: [
      "Tôi biết lượt của mỗi nút và giữ một góc nhìn utility.",
      "Tôi tính min/max từ lá lên và giữ nước được chọn.",
      "Tôi phân biệt cận α–β với giá trị cây con chính xác.",
      "Tôi phân biệt lá kết thúc với lá bị cắt theo độ sâu.",
      "Tôi tính kỳ vọng và giải thích được utility cần có độ lớn có nghĩa."
    ],
    next: "Buổi 8 chuyển sang CSP: bạn tìm gán biến thỏa ràng buộc, thay vì phản ứng với một đối thủ.",
    roadmap: "← Trở về lộ trình"
  }
};

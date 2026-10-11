// Thẻ toán nền mở đầu mỗi bài học, khóa theo id buổi.
// Session.math trong index.ts là bản MỘT DÒNG hiện trên card lộ trình; file này là bản ôn đầy đủ
// hiện trong bài. Thêm buổi mới thì thêm một khóa ở đây.
//
// Mỗi mục: { en, vn, what (một câu định nghĩa), why (vì sao ĐÚNG buổi này cần), note? (mono ngắn) }

export const MATH_PRIMERS = {
  b1: {
    minutes: 2,
    lead: 'Buổi này <strong class="hl-green">không cần toán</strong> — thật đấy, không có công thức nào. Chỉ có hai chữ mà cả khóa sẽ dùng đi dùng lại, nên biết trước cho đỡ vấp.',
    terms: [
      {
        en: 'Rational', vn: 'duy lý',
        what: 'Làm <strong class="hl">điều đúng</strong>: điều mà kỳ vọng đưa bạn tới gần mục tiêu nhất, với đúng thông tin đang có trong tay.',
        why: 'Cả khóa xoay quanh chữ này. Nhớ giùm: duy lý <em>không</em> có nghĩa là luôn thắng, cũng không có nghĩa là biết hết.',
      },
      {
        en: 'Agent', vn: 'tác tử',
        what: 'Bất cứ thứ gì tri giác được môi trường rồi hành động lên nó.',
        why: 'Nghe rộng đến mức gần như vô nghĩa — nhưng chính vì rộng nên nó dùng được cho cả robot, cả chương trình cờ vua, lẫn cái bộ điều nhiệt trong nhà bạn.',
        note: 'f : 𝓟 → 𝓐',
      },
    ],
  },

  b2: {
    minutes: 4,
    lead: 'Buổi này toán vẫn nhẹ, nhưng lần đầu có ký hiệu thật: <span class="code-inline">f : 𝓟* → 𝓐</span>. Ba mục dưới đây là toàn bộ thứ cần để đọc dòng đó mà không khựng — và mục thứ ba còn giải thích luôn vì sao <strong class="hl">không ai nhét sẵn đáp án vào một cái bảng cho xong</strong>.',
    terms: [
      {
        en: 'Set', vn: 'tập hợp',
        what: 'Một rổ đựng các phần tử phân biệt, không quan tâm thứ tự. Viết <span class="code-inline">𝓟</span> cho rổ mọi tri giác agent có thể nhận, <span class="code-inline">𝓐</span> cho rổ mọi hành động nó làm được.',
        why: 'Cả buổi bạn sẽ liệt kê hai cái rổ này cho từng bài toán. Nghe tầm thường, nhưng liệt kê thiếu một hành động là agent của bạn mất hẳn một nước đi mà không ai báo lỗi.',
        note: '𝓐 = {Left, Right, Suck, NoOp}',
      },
      {
        en: 'Function · mapping', vn: 'hàm · ánh xạ',
        what: 'Một luật gán: mỗi đầu vào ứng với <strong class="hl">đúng một</strong> đầu ra. Không được bỏ trống, cũng không được trả hai kết quả cho cùng một đầu vào.',
        why: 'Hành vi của agent chính là một ánh xạ như vậy — nhận vào cả chuỗi tri giác từ đầu tới giờ, trả ra một hành động. Chỗ “đúng một” mới là điều kiện thật: agent không có quyền lưỡng lự. Buổi 1 tôi viết gọn là <span class="code-inline">𝓟 → 𝓐</span>; dấu sao trong <span class="code-inline">𝓟*</span> chỉ để nói rõ đầu vào là cả <em>chuỗi</em>, không phải một tri giác lẻ — và khác biệt nhỏ đó là trục chính của mục 02.',
        note: 'f : 𝓟* → 𝓐',
      },
      {
        en: 'Cartesian product', vn: 'tích Descartes',
        what: 'Ghép hai rổ thành rổ các <em>cặp</em>: <span class="code-inline">A × B</span> gồm mọi cặp lấy một phần tử bên A, một bên B. Số cặp là tích hai số lượng.',
        why: 'Tri giác của con robot hút bụi là cặp <span class="code-inline">[vị trí, tình trạng]</span> — 2 ô × 2 tình trạng = 4 tri giác. Bốn thôi. Nhưng lấy 4 mũ số bước rồi cộng lại là ra kích thước bảng tra, và bạn sẽ thấy ở mục <a href="#ch7">07</a> con số đó xấu tới mức nào.',
        note: '|A × B| = |A| · |B|',
      },
    ],
  },

  b3: {
    "minutes": 4,
    "lead": "Buổi 3 dùng trực giác về đồ thị và cây. Big-O là phần chuẩn bị tùy chọn cho buổi 4.",
    "terms": [
        {
            "en": "Graph",
            "vn": "đồ thị",
            "what": "Tập đỉnh và các cạnh nối chúng. Trên bản đồ A–B–C–D, địa điểm là đỉnh, đường là cạnh, số km là trọng số.",
            "why": "Dùng để mô tả các trạng thái và những bước chuyển hợp lệ."
        },
        {
            "en": "Tree · branching factor b",
            "vn": "cây · hệ số phân nhánh",
            "what": "Cây là đồ thị liên thông không có chu trình. Trong phân tích cận trên, b là số nút con tối đa của một nút.",
            "why": "Cây tìm kiếm ghi những đường đang thử. Nhiều nút có thể chứa cùng trạng thái.",
            "note": "Tầng d có tối đa b^d nút; bằng nhau khi phân nhánh đều."
        },
        {
            "en": "Big-O",
            "vn": "ký hiệu O lớn · đọc thêm",
            "what": "Mô tả cận trên cho mức tăng chi phí khi kích thước bài toán tăng, bỏ qua hằng số.",
            "why": "Sẽ dùng ở buổi 4 để so sánh thời gian và bộ nhớ của thuật toán; chưa cần để viết năm thành phần."
        }
    ]
},
  b4: {
    minutes: 5,
    lead: 'Ba cấu trúc dữ liệu và hai công cụ đếm. Nghe khô, nhưng <strong class="hl">khác biệt duy nhất giữa năm thuật toán hôm nay nằm ở cái đầu tiên</strong> — lấy nút nào ra trước là do cấu trúc quyết.',
    terms: [
        {
        en: 'Stack · Queue · Priority queue', vn: 'ngăn xếp · hàng đợi · hàng đợi ưu tiên',
        what: 'Ba kiểu xếp hàng: <strong class="hl">LIFO</strong> vào sau ra trước · <strong class="hl">FIFO</strong> vào trước ra trước · hàng ưu tiên thì ra theo một <em>khóa</em> bạn chọn.',
        why: 'Đây là TOÀN BỘ khác biệt giữa DFS, BFS và UCS/A*. Đổi cấu trúc xếp hàng là đổi luôn thuật toán — nhớ được chỗ này là nhớ cả buổi.',
        note: 'PQ lấy ra: O(log n)',
      },
        {
        en: 'Big-O', vn: 'ký hiệu O lớn',
        what: 'Cách nói gọn “khi dữ liệu lớn dần thì chi phí phình theo kiểu gì”, bỏ qua hằng số và các số hạng nhỏ.',
        why: 'Cả buổi bạn sẽ so O(b^d) với O(bm). Khác nhau ở chỗ đó quyết định thuật toán nào chạy nổi trên máy thật.',
      },
        {
        en: 'Logarithm', vn: 'logarit',
        what: '<span class="code-inline">log₂n</span> trả lời đúng một câu: phải chia đôi n bao nhiêu lần thì về được 1.',
        why: 'Nó hiện ra ở chi phí thao tác hàng đợi ưu tiên, và ở độ sâu của một cây cân bằng.',
        note: 'log₂ 1024 = 10',
      },
      ],
  },
  b5: {
    minutes: 5,
    lead: 'Bốn thứ để đọc trôi phần chứng minh. Đừng bỏ qua cái đầu tiên: <strong class="hl">toàn bộ tính tối ưu của A* dựng trên đúng một bất đẳng thức</strong>.',
    terms: [
      {
        en: 'Triangle inequality', vn: 'bất đẳng thức tam giác',
        what: 'Đi thẳng từ A tới C không bao giờ xa hơn vòng qua B: <span class="code-inline">d(A,C) ≤ d(A,B) + d(B,C)</span>. Đúng với mọi khoảng cách hình học.',
        why: 'Điều kiện <em>consistent</em> của heuristic chính là bất đẳng thức này viết lại: h(n) ≤ c(n, a, n′) + h(n′). Nhận ra nó là hình tam giác thì khỏi phải học thuộc.',
        note: 'd(A,C) ≤ d(A,B) + d(B,C)',
      },
      {
        en: 'Lower bound', vn: 'cận dưới',
        what: 'Một con số chắc chắn <strong class="hl">không lớn hơn</strong> giá trị thật, dù giá trị thật là bao nhiêu. Cận dưới càng sát giá trị thật thì càng có ích.',
        why: 'Heuristic <em>admissible</em> đúng là một cận dưới của chi phí còn lại: h(n) ≤ h*(n). Nó được phép đoán thiếu, tuyệt đối không được đoán thừa — đoán thừa một lần là A* có thể bỏ qua nghiệm tối ưu.',
        note: 'h(n) ≤ h*(n)',
      },
      {
        en: 'Monotone function', vn: 'hàm đơn điệu',
        what: 'Hàm chỉ đi một chiều: đã tăng thì không giảm nữa (hoặc ngược lại). Không nhấp nhô.',
        why: 'Với h consistent thì f = g + h <strong class="hl">không bao giờ giảm</strong> dọc một đường đi. Nhờ đúng tính chất đó, nút vừa được lấy ra khỏi frontier lần đầu là đã tối ưu — và A* mới dùng graph-search được.',
        note: 'f(n′) ≥ f(n)',
      },
      {
        en: 'Big-O', vn: 'ký hiệu O lớn',
        what: 'Cách nói “lớn cỡ nào khi đầu vào phình ra”, bỏ hết hằng số. O(b<sup>d</sup>) là hàm mũ, O(bd) là tuyến tính theo độ sâu.',
        why: 'Bốn ô đánh giá của mỗi thuật toán đều viết bằng Big-O. Chỗ đáng nhớ: nhìn cột thời gian còn thấy gắng đợi được, nhìn cột bộ nhớ thì thôi.',
        note: 'O(b<sup>d</sup>) ≫ O(bd)',
      },
    ],
  },
  b6: {
  minutes: 5,
  lead: "Bốn ý toán này đủ để bạn đọc địa hình, hiểu một bước ngẫu nhiên và tránh mã hóa nhầm lời giải. Tôi chỉ cần trực giác về gradient; buổi này chưa lấy đạo hàm.",
  terms: [
    {
      en: "Local / global extremum",
      vn: "cực trị địa phương / toàn cục",
      what: "Cực trị địa phương tốt nhất trong một vùng lân cận; cực trị toàn cục tốt nhất trên cả miền đang xét.",
      why: "Leo đồi chỉ so hàng xóm nên có thể dừng ở cực trị địa phương."
    },
    {
      en: "Gradient",
      vn: "hướng dốc",
      what: "Với hàm khả vi, vector gradient chỉ hướng tăng nhanh nhất tại một điểm.",
      why: "Nó giúp bạn đọc hình địa hình; với bàn cờ rời rạc, thuật toán so láng giềng chứ không tính gradient."
    },
    {
      en: "Probability",
      vn: "xác suất",
      what: "Một số từ 0 đến 1 đo khả năng xảy ra sự kiện trong mô hình.",
      why: "SA dùng xác suất nhận bước xấu, GA dùng xác suất chọn cha mẹ. Xác suất lớn không đồng nghĩa chắc chắn."
    },
    {
      en: "Permutation",
      vn: "hoán vị",
      what: "Một cách sắp thứ tự toàn bộ phần tử, mỗi phần tử xuất hiện đúng một lần.",
      why: "TSP thường mã hóa thành hoán vị; chuỗi hàng của N-hậu có thể lặp nên không phải hoán vị. Lai sai biểu diễn có thể sinh con không hợp lệ."
    }
  ]
},
  b7: {
    minutes: 4,
    lead: 'Bốn ý đủ để theo dõi trò chơi: ai chọn nước, ai được lợi, cách so kết quả và cách xử lý bất định.',
    terms: [
      { en: 'Zero-sum game', vn: 'trò chơi tổng bằng không', what: 'Phần lợi của một bên là phần thiệt của bên kia; một utility duy nhất có thể biểu diễn cả hai phía bằng hai dấu đối nhau.', why: 'Minimax dựa trên giả định hai bên có mục tiêu đối nghịch.' },
      { en: 'Utility', vn: 'độ hữu dụng', what: 'Một con số biểu diễn mức độ mong muốn của kết cục cho người chơi đang xét.', why: 'Trong cây minimax này, mọi điểm giữ góc nhìn MAX: dương tốt cho MAX, âm tốt cho MIN. Không đổi dấu theo lượt.', note: 'win = +1 · draw = 0 · loss = −1' },
      { en: 'Recursion', vn: 'đệ quy', what: 'Giải một bài toán bằng cách gọi cùng quy tắc trên các bài toán con nhỏ hơn.', why: 'Minimax truyền giá trị từ các trạng thái con lên cha; trò chơi hữu hạn kết thúc ở trạng thái lá.' },
      { en: 'Expected value', vn: 'giá trị kỳ vọng', what: 'Trung bình có trọng số theo xác suất: Σ pᵢvᵢ, với Σpᵢ = 1.', why: 'Ở trò chơi có xúc xắc, MAX/MIN không điều khiển được kết quả gieo; bạn tính kỳ vọng tại nút ngẫu nhiên.' }
    ]
  },
  b9: {
    minutes: 6,
    lead: 'Buổi này là toán rời rạc thuần chất, nhưng đúng năm món. Món nào cũng sẽ được dùng thật trong bài — đặc biệt là món thứ ba, chỗ <strong class="hl">phép kéo theo ⇒ hay lừa người mới</strong>.',
    terms: [
      { en: 'Proposition', vn: 'mệnh đề', what: 'Một câu khẳng định chỉ có thể <strong class="hl">đúng hoặc sai</strong>, không có nửa vời: “ô [1,2] có hố” là mệnh đề, “ô nào có hố?” thì không.', why: 'Cả thế giới Wumpus sẽ được viết bằng các ký hiệu như P₁,₂ — mỗi ký hiệu là một mệnh đề agent chưa biết đúng hay sai.', note: 'P₁,₂ : “có hố ở [1,2]”' },
      { en: 'Truth table', vn: 'bảng chân trị', what: 'Bảng liệt kê mọi cách gán đúng/sai cho các ký hiệu, rồi tính giá trị của câu ở từng dòng. n ký hiệu cho 2ⁿ dòng.', why: 'Kiểm mô hình (model checking) chính là lật hết bảng này. 7 ký hiệu là 128 dòng — vẫn lật tay được; 64 ký hiệu thì không.', note: '2⁷ = 128' },
      { en: 'Connectives ¬ ∧ ∨ ⇒ ⇔', vn: 'phép nối', what: 'Năm cách ghép câu: phủ định, và, hoặc, kéo theo, tương đương. P ⇒ Q <strong class="hl">chỉ sai khi P đúng mà Q sai</strong>; P sai thì cả câu tự động đúng.', why: 'Mọi luật trong KB đều viết bằng năm phép này. Hợp giải, DPLL và WalkSAT còn bắt đầu bằng việc đổi câu về CNF — chỉ còn ¬ ∧ ∨ — nên phải thuộc P ⇒ Q ≡ ¬P ∨ Q.', note: 'P ⇒ Q ≡ ¬P ∨ Q' },
      { en: 'Tautology', vn: 'hằng đúng', what: 'Câu đúng trong <strong>mọi</strong> dòng của bảng chân trị, bất kể các ký hiệu mang giá trị gì. Ví dụ P ∨ ¬P.', why: 'Định lý suy diễn nói α ⊨ β đúng khi và chỉ khi α ⇒ β là hằng đúng — biến câu hỏi “suy ra được không” thành câu hỏi “có đúng mọi nơi không”.' },
      { en: 'Proof by contradiction', vn: 'chứng minh phản chứng', what: 'Muốn chứng minh α, giả sử ¬α rồi chỉ ra giả sử đó dẫn tới mâu thuẫn.', why: 'Resolution, DPLL đều chứng minh KB ⊨ α theo đúng kiểu này: thêm ¬α vào KB, rồi đi tìm mâu thuẫn (mệnh đề rỗng □ hoặc “không có mô hình nào”).', note: 'KB ⊨ α  khi và chỉ khi  KB ∧ ¬α không thỏa được' },
    ],
  },
};

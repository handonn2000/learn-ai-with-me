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
    minutes: 5,
    lead: 'Buổi này có toán thật, nhưng toàn thứ bạn gặp rồi. Năm mục dưới đây đủ để đọc trôi cả bài — <strong class="hl">chưa vững chỗ nào thì đọc kỹ chỗ đó</strong>, lát gặp công thức khỏi phải khựng lại.',
    terms: [
      {
        en: 'Graph', vn: 'đồ thị',
        what: 'Một tập đỉnh nối với nhau bằng cạnh. Cạnh có thể mang <strong class="hl">trọng số</strong> (chi phí đi qua) và có thể chỉ đi được một chiều.',
        why: 'Ở mục 02 bạn sẽ nén mọi đề bài — bản đồ, xếp hình, hút bụi — về đúng cái dạng này.',
        note: 'V đỉnh · E cạnh',
      },
      {
        en: 'Tree · branching factor b', vn: 'cây · hệ số phân nhánh',
        what: 'Cây là đồ thị không có chu trình. <strong class="hl">b</strong> là trung bình mỗi nút đẻ ra bao nhiêu nút con.',
        why: 'b = 10 mà sâu 6 tầng là 10⁶ nút. Con số đó chính là lý do cả buổi phải lo chuyện bộ nhớ.',
        note: 'tầng d có b^d nút',
      },
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
};

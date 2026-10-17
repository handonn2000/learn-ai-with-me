/**
 * Câu "nhớ lại, không nhìn" cho ôn tập (docs/design/screens/20): người học viết ra, rồi tự đối chiếu với các ý đáp án.
 * Mỗi kỹ năng nên có một câu (skill learning-methods, luật 4); kỹ năng chưa có thì ôn bằng câu kiểm tra.
 */
export interface Recall {
  prompt: string
  /** Mỗi ý đáp án; `<b>`/`<i>` được hiển thị. */
  points: string[]
}

export const recalls: Record<string, Recall> = {
  agent: {
    prompt: 'Chọn một agent bạn hay gặp. Chỉ ra cảm biến, một percept, bộ chấp hành và một hành động của nó. Hàm agent khác chương trình agent ở đâu?',
    points: [
      '<b>Cảm biến</b> và <b>bộ chấp hành</b> là bộ phận: cảm biến đưa thông tin vào, bộ chấp hành tác động ra môi trường.',
      '<b>Percept</b> là thứ cảm biến đưa vào ở một lúc; <b>hành động</b> là thứ agent làm ra ở một lúc.',
      '<b>Hàm agent</b> là ánh xạ từ chuỗi percept ra hành động, viết được thành một bảng.',
      '<b>Chương trình agent</b> là thứ thật sự chạy trên máy và cho ra cùng hành động đó, thường ngắn hơn bảng rất nhiều.',
    ],
  },
  rationality: {
    prompt: 'Một hành động có duy lý hay không tùy vào bốn thứ nào? Vì sao một agent duy lý vẫn có thể ra kết quả xấu?',
    points: [
      '<b>Thước đo hiệu năng</b>: tiêu chí thành công, chấm chuỗi trạng thái của môi trường.',
      '<b>Tri thức có sẵn</b> của agent về môi trường.',
      '<b>Các hành động</b> agent làm được.',
      '<b>Chuỗi percept</b> tới thời điểm đó.',
      'Duy lý là cao nhất <b>theo kỳ vọng</b>, với những gì đã thấy. Agent không <b>toàn tri</b>, nên vẫn có lúc gặp điều nó không thể biết trước.',
    ],
  },
  peas: {
    prompt: 'PEAS là bốn chữ nào? Viết PEAS cho một agent bạn tự chọn, mỗi chữ ít nhất hai mục, rồi soát bốn chỗ hay nhầm.',
    points: [
      '<b>P</b>, thước đo hiệu năng: kết quả trong môi trường, không phải hành động.',
      '<b>E</b>, môi trường: thứ ở ngoài agent, không chứa bộ phận của agent.',
      '<b>A</b>, bộ chấp hành: thứ agent dùng để tác động ra ngoài. Màn hình là A.',
      '<b>S</b>, cảm biến: thứ agent dùng để nhận biết. Bàn phím của agent phần mềm là S.',
    ],
  },
  'env-dims': {
    prompt: 'Kể bốn chiều đầu của môi trường, mỗi chiều kèm câu hỏi để chọn vế. Vì sao cờ vua vẫn tất định dù không đoán được đối thủ? Rồi xếp bốn chiều cho một môi trường bạn tự chọn.',
    points: [
      '<b>Quan sát được đầy đủ hay một phần</b>: cảm biến có cho thấy toàn bộ trạng thái liên quan không?',
      '<b>Một hay nhiều agent</b>: có ai khác đang tối đa một thước đo phụ thuộc vào hành vi của agent không? Nhiều agent thì cạnh tranh hoặc hợp tác.',
      '<b>Tất định hay ngẫu nhiên</b>: biết trạng thái hiện tại và hành động thì trạng thái kế tiếp có xác định hoàn toàn không?',
      '<b>Từng hồi hay tuần tự</b>: quyết định bây giờ có ảnh hưởng tới các quyết định sau không?',
      'Phần khó đoán đến từ nước đi của agent khác đã tính ở chiều <b>nhiều agent</b>, nên không làm cờ vua thành ngẫu nhiên.',
    ],
  },
  'env-classify': {
    prompt: 'Kể đủ bảy chiều xếp loại môi trường, mỗi chiều với các vế của nó. Rồi tự nghĩ một môi trường và xếp nó đủ bảy chiều.',
    points: [
      'Quan sát được <b>đầy đủ</b> hay <b>một phần</b>.',
      '<b>Một</b> hay <b>nhiều</b> agent (cạnh tranh hoặc hợp tác).',
      '<b>Tất định</b> hay <b>ngẫu nhiên</b>.',
      '<b>Từng hồi</b> hay <b>tuần tự</b>.',
      '<b>Tĩnh</b>, <b>nửa động</b> hay <b>động</b>.',
      '<b>Rời rạc</b> hay <b>liên tục</b>.',
      '<b>Biết luật</b> hay <b>chưa biết luật</b>.',
      'Môi trường của bạn: mỗi chiều có một câu lý do. Ví dụ tennis đấu giải: có đối thủ nên nhiều agent, bóng bay nên động và liên tục.',
    ],
  },
  ucs: {
    prompt: 'Mỗi lượt, UCS làm những gì? Viết ra theo thứ tự.',
    points: [
      'Lấy ra nút có <b>g</b> nhỏ nhất trong frontier.',
      'Nếu nút vừa lấy là đích thì dừng. Chỉ kiểm tra lúc lấy ra, không phải lúc thấy.',
      'Mở nút: tính <b>g</b> cho từng hàng xóm, thêm vào frontier hoặc ghi đè nếu rẻ hơn.',
    ],
  },
  admissible: {
    prompt: 'Admissible nghĩa là gì? Vì sao nó giúp A* ra đường rẻ nhất, và khi nào chưa đủ?',
    points: [
      'h <b>không bao giờ đoán quá</b>: h(n) ≤ h*(n) ở mọi nút, với h*(n) là chi phí thật rẻ nhất từ n tới đích.',
      'Trên đường rẻ nhất luôn có một nút n trong frontier với f(n) ≤ <b>C*</b>, chi phí của đường rẻ nhất. Nên n được lấy ra trước mọi đích đắt hơn C*.',
      'Lập luận này đúng khi A* không bỏ trạng thái đã gặp (tree search).',
      'A* có explored (graph search) thì cần thêm <b>nhất quán</b>: h(n) ≤ c + h(n′) với mọi cạnh, nếu không đường đắt tới một trạng thái có thể bị khóa trong explored.',
    ],
  },
}

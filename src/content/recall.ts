/**
 * Câu "nhớ lại, không nhìn" cho ôn tập (docs/design/screens/20): người học viết ra, rồi tự đối chiếu với các ý đáp án.
 * Chỉ vài kỹ năng có; kỹ năng khác ôn bằng câu kiểm tra như cũ.
 */
export interface Recall {
  prompt: string
  /** Mỗi ý đáp án; `<b>`/`<i>` được hiển thị. */
  points: string[]
}

export const recalls: Record<string, Recall> = {
  rationality: {
    prompt: 'Một hành động có duy lý hay không tùy vào bốn thứ nào?',
    points: [
      '<b>Thước đo hiệu năng</b>: tiêu chí thành công, chấm chuỗi trạng thái của môi trường.',
      '<b>Tri thức có sẵn</b> của agent về môi trường.',
      '<b>Các hành động</b> agent làm được.',
      '<b>Chuỗi percept</b> tới thời điểm đó.',
    ],
  },
  peas: {
    prompt: 'PEAS là bốn chữ nào? Viết PEAS cho taxi tự lái, mỗi chữ ít nhất hai mục.',
    points: [
      '<b>P</b>, thước đo: an toàn, nhanh, đúng luật, đi êm, tối đa lợi nhuận.',
      '<b>E</b>, môi trường: đường sá, xe khác, người đi bộ, khách.',
      '<b>A</b>, bộ chấp hành: vô lăng, chân ga, phanh, xi-nhan, còi, màn hình.',
      '<b>S</b>, cảm biến: camera, sonar, đồng hồ tốc độ, GPS, cảm biến động cơ, bàn phím.',
    ],
  },
  'env-classify': {
    prompt: 'Kể đủ bảy chiều xếp loại môi trường, mỗi chiều với các vế của nó.',
    points: [
      'Quan sát được <b>đầy đủ</b> hay <b>một phần</b>.',
      '<b>Một</b> hay <b>nhiều</b> agent (cạnh tranh hoặc hợp tác).',
      '<b>Tất định</b> hay <b>ngẫu nhiên</b>.',
      '<b>Từng hồi</b> hay <b>tuần tự</b>.',
      '<b>Tĩnh</b>, <b>nửa động</b> hay <b>động</b>.',
      '<b>Rời rạc</b> hay <b>liên tục</b>.',
      '<b>Biết luật</b> hay <b>chưa biết luật</b>.',
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

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
  ucs: {
    prompt: 'Mỗi lượt, UCS làm những gì? Viết ra theo thứ tự.',
    points: [
      'Lấy ra nút có <b>g</b> nhỏ nhất trong frontier.',
      'Nếu nút vừa lấy là đích thì dừng. Chỉ kiểm tra lúc lấy ra, không phải lúc thấy.',
      'Mở nút: tính <b>g</b> cho từng hàng xóm, thêm vào frontier hoặc ghi đè nếu rẻ hơn.',
    ],
  },
}

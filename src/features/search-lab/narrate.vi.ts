/* Lời kể của lab tìm kiếm — bản tiếng Việt.
 *
 * Engine (`search-engine.js`) KHÔNG còn chứa chữ hiển thị nào: nó chỉ gọi MSG.nX(...) — bí danh của `N` trong narrate.ts, xem chú thích ở đầu engine.
 * Nhờ vậy hai ngôn ngữ dùng CHUNG một bản engine — nhân đôi logic chỉ để dịch là cách
 * chắc chắn nhất để hai bản trôi khỏi nhau. Xem ADR-0012.
 *
 * Tham số đặt tên a0, a1… theo đúng thứ tự ${…} trong câu gốc, nên bản EN được phép
 * đảo trật tự vế mà vẫn gắn đúng giá trị.
 */
export const VI = {
  n1: `Đồ thị Lab 1 (6 đỉnh)`,
  n2: `leo đồi`,
  n3: (a0: string | number) => `Khởi tạo: đưa ${a0} vào HÀNG ĐỢI (FIFO). BFS kiểm tra đích ngay khi một nút được SINH RA.`,
  n4: (a0: string | number) => `Lấy ${a0} ra khỏi ĐẦU hàng đợi — nút NÔNG nhất — và mở rộng.`,
  n5: (a0: string | number) => `Sinh ${a0} (chưa gặp) → nối vào CUỐI hàng đợi.`,
  n6: `Hàng đợi rỗng — đã duyệt hết mọi nút chạm tới được → VÔ NGHIỆM.`,
  n7: (a0: string | number) => `Khởi tạo: đặt ${a0} vào NGĂN XẾP (LIFO). DFS lao xuống sâu nhất có thể rồi mới quay lui.`,
  n8: (a0: string | number) => `Lấy ${a0} từ ĐỈNH ngăn xếp — nút SÂU nhất — và mở rộng.`,
  n9: (a0: string | number) => `Sinh ${a0} → đẩy lên ĐỈNH ngăn xếp (sẽ được mở TRƯỚC các nút chờ sẵn).`,
  n10: `Ngăn xếp rỗng → VÔ NGHIỆM.`,
  n11: (a0: string | number, a1: string | number, a2: string | number) => `Đường RẺ HƠN tới ${a0}: g = ${a1} qua ${a2} — cập nhật cha và khóa.`,
  n12: `Hàng đợi rỗng → VÔ NGHIỆM.`,
  n13: (a0: string | number, a1: string | number) => `VÒNG ${a0} — chạy DLS với giới hạn độ sâu ℓ = ${a1}. Mọi thứ làm lại TỪ ĐẦU (đổi thời gian lấy bộ nhớ).`,
  n14: (a0: string | number, a1: string | number) => `${a0} chạm giới hạn ℓ = ${a1} → CẮT (cutoff), quay lui.`,
  n15: `Đã tăng ℓ tới kích thước đồ thị mà không thấy đích → VÔ NGHIỆM.`,
  n16: `Hàng đợi ưu tiên theo h(n) — nút TRÔNG gần đích nhất được mở trước. Quá khứ (g) bị bỏ qua hoàn toàn.`,
  n17: (a0: string | number, a1: string | number) => `Lấy ${a0} — h nhỏ nhất (= ${a1}): TRÔNG gần đích nhất.`,
  n18: `Hàng đợi rỗng → VÔ NGHIỆM.`,
  n19: (a0: string | number, a1: string | number) => `Bắt đầu tại ${a0} (h = ${a1}). KHÔNG có frontier — chỉ nhớ đúng MỘT nút hiện tại.`,
  n20: (a0: string | number, a1: string | number) => `Không láng giềng nào có h nhỏ hơn ${a0} → KẸT tại ${a1} (cực trị địa phương). Quy ước Lab: coi như không có đường → in -1.`,
  n21: (a0: string | number, a1: string | number, a2: string | number) => `First-choice: gặp ${a0} có h = ${a1} nhỏ hơn ${a2} → leo NGAY, không xét thêm, không ngoái lại.`,
  n22: (a0: string | number, a1: string | number, a2: string | number) => `h giảm ${a0} → ${a1}: leo sang ${a2} — ĐÍCH! (May mắn thôi: leo đồi không hề đảm bảo điều này.) `,
  n23: `Xuất phát đã ở đích. `,
  n24: (a0: string | number) => `Sinh ra ${a0} — ĐÍCH! Dừng khi sinh ra (quy ước Lab). Nhanh — nhưng có tối ưu không? `,
  n25: `Nút xuất phát chính là đích. `,
  n26: (a0: string | number, a1: string | number, a2: string | number) => `Đi sâu tới ${a0} (độ sâu ${a1}/${a2}).`,
  n27: (a0: string | number, a1: string | number) => `Bắt đầu lại từ ${a0} với ℓ = ${a1}.`,
  n28: (a0: string | number, a1: string | number, a2: string | number) => `${a0} là ĐÍCH ở độ sâu ${a1} — vòng ℓ=${a2} thành công, và đây là nghiệm NÔNG nhất. `,
  n29: (a0: string | number, a1: string | number) => `Sinh ${a0} với g = ${a1}.`,
  n30: (a0: string | number, a1: string | number) => `Lấy ${a0} — g nhỏ nhất (= ${a1}).`,
  n31: (a0: string | number, a1: string | number, a2: string | number, a3: string | number) => `Lấy ${a0} — f nhỏ nhất: f = ${a1} + ${a2} = ${a3}.`,
  n32: (a0: string | number, a1: string | number, a2: string | number) => `Lấy ${a0} ra với g = ${a1} — ĐÍCH, và chắc chắn tối ưu: mọi nút còn chờ đều có g ≥ ${a2}. `,
  n33: (a0: string | number, a1: string | number) => `Lấy ${a0} ra với f = g = ${a1} — ĐÍCH. Với h consistent, lần lấy ra đầu tiên luôn theo đường tối ưu. `,
  n34: `Hàng đợi ưu tiên theo g(n) — chi phí THẬT tính từ gốc. Chỉ dừng khi đích được LẤY RA.`,
  n35: `Hàng đợi ưu tiên theo f(n) = g(n) + h(n): chi phí ĐÃ ĐI cộng ước lượng CÒN LẠI. Chỉ dừng khi đích được LẤY RA.`,
  n36: (a0: string | number) => `Sinh ra ${a0} — ĐÍCH! `,
  n37: `Nút xuất phát chính là đích. `,
  n38: (a0: string | number) => `Sinh ra ${a0} — ĐÍCH! Dừng ngay, không cần đợi lấy ra. `,
  n39: `Nút xuất phát chính là đích. `,
  n40: (a0: string | number, a1: string | number) => `Lần ngược con trỏ cha: ${a0} — chi phí ${a1}.`,
  n41: (a0: string | number, a1: string | number) => `Sinh ${a0} (h = ${a1}).`,
  n42: (a0: string | number, a1: string | number, a2: string | number, a3: string | number) => `Sinh ${a0}: f = ${a1} + ${a2} = ${a3}.`,
};

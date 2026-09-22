/*
 * Chữ tiếng Việt DÙNG CHUNG cho Manim Lab và Code Lab — hai khối này xuất hiện ở cả Buổi 4 lẫn
 * Buổi 5, nên chữ của chúng không thuộc bundle của buổi nào. Tiêu đề mục thì vẫn nằm ở từng buổi.
 *
 * Bản EN (`lab.text.en.ts`) khai `satisfies typeof VI` nên thiếu hay thừa một khóa là lỗi tsc.
 */
export const VI = {
  fn: {
    stepOf: (t: number, n: number) => `BƯỚC ${t} / ${n}`,
    explored: (n: number) => `EXPLORED — ĐÃ MỞ (${n})`,
    // Chuỗi có chèn giá trị -> HÀM.
    goalPath: (path: string, cost: number | null, opened: number) =>
      `Đường đi: ${path} · chi phí ${cost} · đã mở ${opened} nút`,
  },
  lab: {
    s1: "Manim Lab — xem 7 thuật toán chạy từng bước",
    s2: "Đọc mười lần không bằng xem chạy một lần. Chọn thuật toán, bấm <strong class='hl'>Chạy</strong>, hoặc bước từng nhịp bằng <strong class='hl'>Tiến / Lùi</strong> để soi cho kỹ. Màu vẫn theo quy ước dùng chung cả trang: <span class='hl-cyan'>xanh dương — frontier</span> · <span class='hl-yellow'>vàng — đang mở</span> · <span style='color:var(--muted-2)'>xám — explored</span> · <span class='hl-green'>xanh lá — đường đi</span> · <span class='hl-purple'>tím — vừa tìm ra đường rẻ hơn</span>.",
    s3: "Ba thí nghiệm tôi muốn bạn tự làm ngay bây giờ: (1) preset Romania, chạy GBFS rồi A* — tham lam ra 450 km, A* ra 418 km, tự hỏi 32 km đó đi đâu mất; (2) chạy HC trên cùng preset và xem nó kẹt cứng ở Timișoara; (3) đổi sang đồ thị Lab, so BFS (chi phí 9) với UCS (chi phí 8) để tận mắt thấy “nông nhất ≠ rẻ nhất”.",
  },
  codelab: {
    s1: "Code Lab — cài cả 7 thuật toán",
    s2: "⌨️ Tới phần vui nhất: gõ code. Đề bài yêu cầu viết Python và <em>tự cài phần lõi tìm kiếm</em> — thư viện phụ trợ thì thoải mái, nhưng đừng gọi thư viện giải hộ. Đọc <span class='code-inline'>input.txt</span>, ghi <span class='code-inline'>output.txt</span>, đo runtime và peak memory cho từng thuật toán. Bài <strong class='hl'>cá nhân</strong>, khoảng 3 tuần. Thang điểm: 7 thuật toán × 10% · ≥ 5 test case 10% · báo cáo 20%. Dưới đây tôi để sẵn khung code, bạn điền phần lõi.",
    s3: "BA QUY ƯỚC MÀ SAI LÀ LỆCH OUTPUT — ĐỌC KỸ GIÙM TÔI",
    s4: "BFS · DFS · GBFS dừng khi đích được <strong class='hl-cyan'>SINH RA</strong>",
    s5: "UCS · A* dừng khi đích được <strong class='hl-yellow'>LẤY RA</strong>",
    s6: "HC kẹt → không có đường → in <strong class='hl-red'>-1</strong>",
    s7: "INPUT.TXT — đồ thị có thể CÓ HƯỚNG hoặc vô hướng",
    s8: "dòng 1: số nút · dòng 2: start goal · tiếp theo: ma trận kề (trọng số, 0 = không có cạnh) · dòng cuối: heuristic từng nút",
    s9: "OUTPUT.TXT — path hoặc -1, kèm time và memory",
    s10: "đồ thị này chính là preset “Lab 1 · 6 đỉnh” trong Manim Lab ở trên — code bạn chạy ra gì, đối chiếu từng bước được luôn",
    s11: "DÙNG CHUNG CHO CẢ 7 — LẦN NGƯỢC CON TRỎ CHA",
    s12: "MAIN.PY — ĐỌC INPUT, CHẠY 7 THUẬT TOÁN, ĐO TIME + MEMORY",
    s13: "time.perf_counter() + tracemalloc — đúng hai thứ đề đòi: “high-resolution timer” và “peak memory”",
    s14: "GỢI Ý 5 TEST CASE “KHÁC TÍNH CHẤT” — CHỖ NÀY DỄ ĂN ĐIỂM",
    s15: "<strong class='hl-mid'>1 ·</strong> Đồ thị mẫu 6 đỉnh ở trên — có đáp án đối chiếu sẵn trong Manim Lab, dùng để bắt bug đầu tiên.",
    s16: "<strong class='hl-mid'>2 ·</strong> Vô nghiệm: cô lập cái đích ra. Cả 7 phải in -1 và thoát êm, đứa nào treo là đứa đó có bug vòng lặp.",
    s17: "<strong class='hl-mid'>3 ·</strong> Đồ thị CÓ HƯỚNG (ma trận bất đối xứng) — test này lộ ngay bug duyệt kề, kinh điển nhất là quét nhầm cột thành hàng.",
    s18: "<strong class='hl-mid'>4 ·</strong> Cố tình cho một heuristic KHÔNG admissible → A* sẽ trả đường lệch tối ưu. Không phải bug đâu, đúng lý thuyết đấy — và giải thích được chuyện này trong báo cáo thì rất ăn điểm.",
    s19: "<strong class='hl-mid'>5 ·</strong> Đồ thị lớn sinh ngẫu nhiên (n ≥ 500). Đồ thị 6 đỉnh thì thuật toán nào cũng xong trong 0,0001 giây; phải to lên thì khác biệt time/memory mới chịu hiện ra.",
  },
  searchlab: {
    s1: "leo đồi",
    s2: "FRONTIER — hàng đợi FIFO (trái = ra trước)",
    s3: "FRONTIER — ngăn xếp (phải = đỉnh, ra trước)",
    s4: "FRONTIER — hàng đợi ưu tiên theo g (đã sắp xếp)",
    s5: "NHÁNH ĐANG ĐI (DLS quay lui)",
    s6: "FRONTIER — hàng đợi ưu tiên theo h",
    s7: "FRONTIER — hàng đợi ưu tiên theo f = g + h",
    s8: "FRONTIER — không có (chỉ một nút hiện tại)",
    s9: "Lab 1 · 6 đỉnh",
    s10: "Romania · 10 đỉnh",
    s11: "Kẹt cực trị địa phương → output: -1",
    s12: "Vô nghiệm → output: -1",
    s13: "⟲ Về đầu",
    s14: "◀ Lùi",
    s15: "❚❚ Dừng",
    s16: "▶ Chạy",
    s17: "Tiến ▶",
    s18: "KẸT",
  },
  f_codelab: {
    s1: "BÀN LÀM VIỆC — CHỌN THUẬT TOÁN, ĐỌC PSEUDO RỒI SOI PYTHON",
    pythonHeading: "PYTHON — KHUNG LAB 1",
  },
  scenes: {
    s1: " nút",
    s2: "b = 10, d = 12 → 10¹² nút",
    s3: "≈ 13 ngày ở tốc độ 1 triệu nút/giây · ≈ 1 petabyte bộ nhớ",
    s4: "không gian trạng thái →",
    s5: "↑ giá trị mục tiêu (−h)",
    s6: "cực trị toàn cục",
    s7: "KẸT — cực trị địa phương",
    s8: "muốn sang đỉnh cao hơn phải chấp nhận ĐI XUỐNG",
  },
};

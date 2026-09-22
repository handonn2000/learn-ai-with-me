# Buổi 6 — Tìm kiếm cục bộ và tối ưu hóa

Bài này được khởi tạo dưới số buổi 4; nay là buổi 6 theo lộ trình 13 buổi.

Nguồn (nay nằm ở public/materials/Lecture/buoi6/): Lecture04-LocalSearch.pdf (42 trang), Homework4.pdf (2 trang), bài 1–3 hiện có.
Đối tượng: người tự học đã biết state, successor và heuristic ở các buổi 3–5.
Thời lượng gợi ý: khoảng 2,5 giờ, gồm thực hành. VI là bản gốc; EN theo sau.

| Mục | Chỗ vướng cần gỡ | Hình thức |
|---|---|---|
| Toán nền | Cực trị, gradient, xác suất, hoán vị dùng ở đâu? | Primer 5 phút |
| 01 · Đích là cấu hình | Không phải bài toán nào cũng cần giữ đường đi | Ví dụ lịch, TSP, N-hậu; bảng mô hình |
| 02 · Leo đồi và địa hình | Tốt nhất quanh đây chưa phải tốt nhất toàn cục | Landscape tự lặp; cực trị, plateau, shoulder, ridge |
| Lab · N-hậu | Hàm h đếm cặp, không đếm quân | Bàn cờ chỉnh được; heatmap h; trace tiến/lùi |
| 03 · Các cách thoát kẹt | Đổi điểm bắt đầu khác đổi cách chọn hàng xóm | Biến thể; sideways có giới hạn; kỳ vọng restart |
| 04 · Simulated annealing | Một bước xấu đôi khi mở đường cho bước tốt | Công thức min/max, nhiệt độ tương tác, lịch nguội |
| 05 · Local beam | k nghiệm chia sẻ thông tin khác k lần chạy độc lập | Vòng gộp hàng xóm/chọn chung; mất đa dạng |
| 06 · Genetic algorithm | Lai hai nghiệm không bảo đảm sinh nghiệm tốt | Fitness/roulette, crossover và mutation tương tác |
| 07 · Chọn thuật toán | Ngẫu nhiên không có nghĩa bảo đảm tối ưu | Bảng cơ chế, bộ nhớ, giới hạn; điều kiện xác suất |
| 08 · Code | Dấu của delta và điều kiện dừng dễ viết ngược | Python chạy được, tô syntax, ví dụ cố định seed |
| 09 · Quiz | Nhận diện ngộ nhận trước khi làm bài tập | 8 câu, ID chủ đề ổn định, SessionQuiz hiện có |
| 10 · Bài tập và tự kiểm | Chuyển từ đọc hiểu sang tự lập mô hình | Cả 3 câu homework, gợi ý có thể mở, checklist |

Các số cần tái tính: 8^8 = 16.777.216; 56 láng giềng; h(56745676)=17,
best h=12; h(83742516)=1, best neighbor h=2; 4^4=256; fitness 2341/2132/1232/4321
lần lượt 2/3/1/0; 8 hậu có tối đa 28 cặp không xung đột.

Điểm cần diễn giải chính xác:
- 14%/94%, 4/3 và 21/64 bước là số liệu minh họa của thí nghiệm trong tài liệu,
  không phải lời hứa của lab; 200 so với 1.000.000 không phải giới hạn tổng quát.
- 1/p tính cả lần chạy đầu; số lần khởi động lại sau lần đầu là (1-p)/p.
- SA với lịch nguội hữu hạn không có bảo đảm tìm tối ưu. Phân biệt current và best.
- O(1) nghĩa số cấu hình giữ, không phải số byte; một cấu hình N-hậu cần O(N).
- Homework Q2 ghi a…g nhưng hình có A…H: dùng 8 đỉnh và 3^8 trạng thái.
- Mutation theo từng gene và mutation một gene theo xác suất trên cá thể là hai
  biến thể; ghi rõ lựa chọn. Lai chuỗi hàng cho N-hậu hợp lệ, lai hoán vị TSP cần sửa.

Kiểm: engine và code số học; build; route/anchor/deck; VI/EN; trình duyệt desktop/mobile,
hai theme, reduced motion, vòng lặp; review chất lượng và fidelity độc lập theo skill.

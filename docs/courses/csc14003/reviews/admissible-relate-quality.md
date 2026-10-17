# Review: ga `admissible` (bản thêm bước đoán quan hệ) — 2026-10-17

Agent `lesson-quality-judge`, review tĩnh, không mở trình duyệt. Nguồn: Buổi 5, `Lecture03-P3-InformedSearch.pdf`,
slide 29–36. Bản review là của cây làm việc chưa commit, trên commit e1f0ee2.

## Kết luận: NEEDS CHANGES

| Mã | Mức | Vấn đề | Đã xử lý |
|---|---|---|---|
| C1 | HIGH | Bài nói admissible là đủ để A* ra đường rẻ nhất. Slide 34 chỉ khẳng định với TREE-SEARCH; slide 35 nói admissible không đủ cho graph search. A* của khóa có explored. Phản ví dụ chạy trên engine: S–A 1, A–B 1, S–B 3, B–G 3; h(A) = 3, các nút khác 0 → trả về S→B→G tốn 6, trong khi S→A→B→G tốn 5. Recall và sketch mới lặp lại lỗi này. | Sửa `2.mdx` (câu sau chứng minh + Deep), recall, sketch, ideas |
| C2 | LOW–MED | "Đoán hụt → A* mở nhiều nút hơn" nói như hệ quả chắc chắn. Chỉ đúng như xu hướng; với city: h = 0 mở 9 nút, h chim bay mở 7. | Đổi thành "thường", lý do nêu 9 so với 7 |
| C3 | LOW | "Không đường nào ngắn hơn đường thẳng" ngầm cho chi phí là quãng đường; bản đồ tính bằng phút. | Thêm điều kiện "khi chi phí là quãng đường" ở cặp chim bay |
| V1 | MED | Thiếu chữ "TREE-SEARCH" của slide 34; slide 35 bị nói nhẹ. | Đóng cùng C1 |
| M1 | MED | Không bài tập tính điểm nào xử lý sâu. e1 là tính toán, e2 là xếp theo quy tắc, gán nhãn M5 là sai. Phần "giải thích vì sao" chỉ có ở reorganize. | e2 thành bài tìm lỗi, thêm e3 là câu chọn về chứng minh |
| O1 | MED | Cặp `double` và `crow` trùng mục của e2, và lý do của cặp `under` lộ mục h = 0. Kết quả là 3/5 mục e2 thành nhận ra. | Đổi mục 1 và 5 của e2 thành chim bay ÷ 2 và chim bay + 1; bỏ "vẫn ra đường rẻ nhất" khỏi lý do |
| T1 | LOW | Lần đầu "đích" thiếu "(goal)". Nhiều cách gọi cho overestimate (đoán quá tay, nói quá, đoán lố, ước lượng quá). "Đoán hụt" chưa có trong bảng thuật ngữ. | Thêm "(goal)"; thống nhất "đoán quá"; thêm "đoán hụt (underestimate)" vào bảng thuật ngữ |
| T2 | LOW | "Kiểm nhanh ở đích" nghe như đủ để kết luận. Thực ra kiểm ở đích chỉ loại được. | Đổi thành "Loại nhanh: ở đích h phải bằng 0" |

## Đã xác minh đúng

- h*(C) = 6.
- Đáp án e2 (bản cũ).
- Câu c1: max/min(2, h*).
- Vết chạy (trace) trong `1.mdx`.
- h của bản đồ city nhất quán.
- Gấp đôi chim bay đoán quá ở S (16 > 12).
- Bước relate không lộ kiến thức mới: mọi ý đều đã có ở ga `heuristic`, `astar`, `ucs`.

## Bảng phủ slide 29–36

12 đơn vị:
- 10 đủ.
- 1 mỏng: slide 35, admissible không đủ cho graph search.
- 1 thiếu: slide 34, giới hạn tree search.

Cả hai đóng cùng C1.

## Gợi ý thêm

- Đưa phản ví dụ của C1 vào khối Deep thành một `SearchPlayer`. Cần thêm test trong `search.test.ts`.
- Câu nhớ lại hỏi thêm "Khi nào chưa đủ?". **Đã làm.**

## Chưa kiểm

- Bàn phím và focus trong radiogroup.
- Thời gian làm thật so với 12 phút.
- Bước đoán cho ga sau trong buổi học.

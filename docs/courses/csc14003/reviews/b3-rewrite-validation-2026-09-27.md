# Buổi 3 — triển khai và kiểm tra bản viết lại

Ngày: 2026-09-27. Triển khai theo `b3-learning-experience-2026-09-27.md` sau khi người dùng đồng ý.

## Đã thay đổi

- Thay mở bài quân hậu/số liệu lớn bằng bản đồ giả lập A–B–C–D. Dùng cùng bản đồ cho mục tiêu, năm thành phần, node/state/parent/g và ví dụ tìm đường từng bước.
- Tách trừu tượng hóa thành phần riêng: màu xe, nhiên liệu, vị trí người thứ hai; nêu điều kiện của giả định thay vì nói mọi chi tiết đều có thể bỏ.
- Năm thành phần trình bày theo hàng: câu hỏi → thuật ngữ → ví dụ → giải thích.
- Mô phỏng có bước tiếp, quay lại, đặt lại. Chọn g nhỏ nhất và thể hiện cập nhật C: 5→3, D: 8→5; không quảng bá khung chống trùng đơn giản như cài đặt đầy đủ của UCS.
- Thêm sơ đồ cây có nhãn trạng thái lặp, mã giả khái niệm và bốn tiêu chí đánh giá. b/d/m là phần đọc thêm, thống nhất b là số con tối đa trong phân tích cận trên.
- Bàn 4 quân hậu thêm từng quân với giải thích hàng/chéo; minh họa complete-state trước/sau và bảng năm thành phần. Tách hai cách thành hai slide.
- Mỗi phần có câu tự kiểm tra với lời giải mở theo yêu cầu. Viết lại năm câu quiz thành tình huống ứng dụng; bài tập lưới, hai người gặp nhau và 8 quân hậu có gợi ý/lời giải.
- Đồng bộ VI/EN, metadata lộ trình và toán nền. CSS giới hạn trong `.b3-lesson`.
- Giữ ch1/ch2/ch3/quiz/hw; ch3 là ví dụ frontier. Tiến độ hai mô phỏng giữ khi đổi chế độ đọc/trình chiếu. Checklist mới dùng khóa v2 để không gán các lựa chọn cũ cho mục tiêu học mới.

## Kiểm tra đã chạy

- `npm run build`: TypeScript và Vite thành công. Có cảnh báo chunk lớn của `data-world.scene`, ngoài buổi 3.
- `node scripts/check-session-numbering.mjs`: 8/8 assertions qua. Vite middleware có cảnh báo socket HMR do sandbox; các kiểm tra dữ liệu vẫn chạy xong với exit 0.
- `git diff --check`: không có lỗi khoảng trắng.
- Trình duyệt desktop 1280×720: xem bố cục, bản đồ, mô phỏng đường và bàn hậu.
- Mô phỏng tìm đường: chạy đủ 4 bước, thấy frontier C·3/D·8 rồi D·5 và nghiệm A→B→C→D; nút tiếp bị vô hiệu ở cuối. Kiểm tra quay lại và đặt lại.
- Mô phỏng hậu: số quân lần lượt 1,2,3,4; trạng thái cuối [2,4,1,3] cùng giải thích đúng; giữ đủ 4 quân sau đổi sang trình chiếu.
- Trình chiếu: liên kết tới phần complete-state mở slide 9/11; liên kết bài tập tiếng Anh mở slide 11/11.
- Mobile VI 390×844 và EN 320×740: không tràn ngang toàn trang sau sửa. Hai bảng cuộn ngang trong vùng riêng. Đã sửa phần điều hướng tràn ở 320px và khoảng cuộn khiến tiêu đề bị thanh điều hướng che ở mobile.
- Bàn phím: Enter kích hoạt bước tiếp và mở gợi ý bài tập.
- Quiz VI: chọn đúng đủ 5 câu → 100%, 5/5; làm lại và chọn sai câu 1 → có giải thích vì sao B đi được A/C/D. Lượt thử dùng localhost cổng 5174.
- EN: nội dung, các tiêu đề, controls và bước mô phỏng hiển thị tiếng Anh; đã thử đổi ngôn ngữ bằng nút trên trang.
- Console trình duyệt không có lỗi runtime; có cảnh báo future flags của React Router.

## Giới hạn

Đây là kiểm tra nội dung và giao diện, chưa phải thử nghiệm với người học thật. Thời lượng khoảng 2 giờ là ước lượng gồm thực hành. Không xuất bản hay triển khai lên website công khai.

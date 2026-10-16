# Kể cơ chế bằng hình, code và điểm nhấn

Đọc khi chọn hình thức minh họa, dựng animation giải thích, thêm logo framework hoặc tô màu nội dung kỹ thuật. Đây là tiêu chí đầu ra, không phải danh sách thư viện bắt buộc.

## Chọn hình thức theo quan hệ cần thấy

- **HTML/CSS hoặc SVG**: so sánh, timeline, packet, topology có nhãn cần đọc; thường nhẹ và responsive.
- **Canvas 2D**: nhiều đối tượng chuyển động hoặc phép vẽ liên tục; cung cấp cùng kiến thức bằng HTML quanh hình.
- **Isometric/CSS 3D hoặc WebGL**: phân lớp, không gian, vị trí vật lý giúp hiểu cơ chế. Nhãn vẫn phải đọc được trên điện thoại; giữ fallback tĩnh cho thiết bị không hỗ trợ.
- **Video/GIF**: một quá trình ghi sẵn phù hợp hơn mô phỏng. Ưu tiên định dạng video nén tốt, không âm thanh khi tự phát. GIF khó dừng nên chỉ tải/hiện bản động khi viewport, document và reduced motion cho phép; chuẩn bị poster/bản tĩnh đủ nghĩa. Không chỉ che media bằng CSS rồi để nó chạy nền.
- **Bảng hoặc sơ đồ tĩnh**: phù hợp khi chuyển động không thêm thông tin. Dùng nó cùng animation để giữ điều kiện và kết quả quan trọng luôn đọc được.

Thay đổi bố cục, góc nhìn hoặc cách biểu diễn khi khái niệm cần; tránh chỉ đổi màu cho cùng một mẫu. Không chọn công cụ chỉ vì repo đã có, hoặc thêm thư viện chỉ để một hiệu ứng đẹp hơn. Dependency hữu ích có thể được dùng sau khi ghi quyết định và tradeoff trong ADR mới, không cần thêm vòng xin phép cho phạm vi đã được user giao.

## Một vòng có mở đầu, cơ chế và kết quả

Viết trước câu hỏi hình sẽ trả lời và các trạng thái đúng về kiến thức. Cho trạng thái đầu có nhãn và dữ liệu mẫu rõ, cho cơ chế xảy ra, giữ kết quả đủ đọc, rồi mở lượt minh họa mới. Nhãn "lượt minh họa mới" hoặc pha ngắt giúp phân biệt reset màn hình với hành vi hệ thống thật.

Kiểm các invariant ở cả frame giữa: bản sao chưa nhận dữ liệu không được báo đã đồng bộ; consumer chưa xử lý xong không được hiện commit thành công; offset tăng không được chạy ngược như dữ liệu thật. Khi đổi use-case, reset cục bộ đúng dữ liệu của tab đó, không để caption của case A trên frame của case B. Tốc độ phải cho phép đọc một lượt mà không cần nút phát; caption/callout cốt lõi không biến mất trước khi đọc xong.

Animation giải thích tự phát lặp, không có Play/Pause/Reset/Tiến/Lùi/tốc độ. Có thể đổi use-case bằng tab có `tablist`, `tab`, `tabpanel`, `aria-selected`, quan hệ nhãn–panel, focus nhìn thấy và điều hướng bàn phím đúng. Tab thay đổi tình huống học, không giả làm điều khiển từng frame. Quiz/điều hướng/checklist vẫn giữ chức năng.

Dừng cập nhật khi ngoài viewport hoặc document ẩn, reset mốc thời gian khi tiếp tục, dọn scheduler khi unmount. Reduced motion dùng storyboard, bảng before/after hoặc hình tĩnh đủ các pha; đừng đóng băng ở một trạng thái không giải thích được quá trình. Trạng thái tự động không phải live region: lời giải HTML ổn định cho screen reader, không thông báo theo frame.

## Logo framework

Dùng asset thật từ website/brand kit chính thức hoặc bộ icon thương hiệu được duy trì như Devicon/Simple Icons, có nguồn truy xuất rõ. Ưu tiên asset local đã có; kiểm đúng dự án và biến thể, lưu nguồn/license theo quy ước asset của repo. Không vẽ lại logo bằng hình học, dùng emoji, tên viết tắt hay biểu tượng generic để thay logo Kafka, Airflow, Debezium… Giữ tỷ lệ và nhận diện gốc; nền đỡ có thể đổi để đủ tương phản ở cả hai theme. Tên framework vẫn ở văn bản HTML để nhận biết và tìm kiếm; logo chỉ mang nghĩa có `alt`, logo lặp cạnh tên dùng `alt=""` để tránh đọc hai lần. Nguồn asset trong metadata/tài liệu kỹ thuật không cần biến thành chữ thừa trong bài.

## JSON/code có màu, ý quan trọng có cấp độ

Dùng `<pre><code>` và một bảng màu cú pháp có tên vai trò: key/property, string, number/boolean/null, keyword, comment, punctuation. Nhãn ngôn ngữ và cuộn ngang cục bộ giúp đọc đoạn dài; giữ nguyên whitespace, dấu câu và nội dung khi copy. Tokenize/escape an toàn rồi render span; không dùng regex rộng thay thế vào markup đã tô màu hoặc chèn code nguồn qua HTML chưa escape. Chọn tokenizer/highlighter phù hợp ngôn ngữ; thư viện mới vẫn theo đánh giá và ADR ở trên.

**Màu cú pháp** giúp phân biệt loại token. **Callout sư phạm** giúp thấy dòng, field hoặc điều kiện đang giải thích: nền, viền, chú giải hoặc trọng lượng chữ riêng. Đừng dùng cùng một màu nổi cho mọi token và mọi ý quan trọng. Giữ text thường và token đủ tương phản với nền trong light/dark; sự khác biệt không chỉ phụ thuộc đỏ/xanh.

Trong văn xuôi, dùng `<strong>` cho kết luận hoặc điều kiện then chốt, `<code>` cho identifier, các class `.hl-*` cho thuật ngữ cần mắt dừng lại. Một đoạn thường chỉ cần một điểm nhấn chính; tránh tô cả đoạn, tô mọi lần lặp của một từ hoặc làm code giả trong văn bản. Điểm nhấn VI/EN phải cùng nghĩa. Giữ chữ nguồn của code/JSON nguyên vẹn; mọi thay đổi ví dụ vẫn cần kiểm đúng/sai và nội dung tương ứng ở hai locale.

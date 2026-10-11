# Buổi 3 — Phân tích trải nghiệm học và đề xuất cải thiện

Ngày: 2026-09-27. Phạm vi: buổi 3 “Phát biểu bài toán tìm kiếm”, khóa CSC14003 (Cơ sở Trí tuệ Nhân tạo). Đây là bản phân tích và thiết kế đề xuất; chưa sửa nội dung hay giao diện bài học.

## Căn cứ

- Đọc `src/features/lessons/b3/Lesson03Problem.tsx` và `lesson03.text.vi.ts`.
- Đối chiếu phần b3 trong `math-primers.js`, `session-quizzes.js`, lộ trình `index.ts`, cùng `MathPrimer.tsx` và `LessonDeck.tsx`.
- Mở bài học trên trình duyệt cục bộ; kiểm tra nội dung hiển thị và bố cục mục 02 ở viewport desktop 1280 × 720. Chưa kiểm tra trực quan mobile và chế độ trình chiếu.
- Báo cáo `b3-coverage-2026.md` là tài liệu lịch sử trước khi tách buổi học; không dùng các kết luận về bài cũ như bằng chứng cho phiên bản hiện tại.

## 1. Chẩn đoán

Bài có khung kiến thức hữu ích nhưng đang giống bản tóm tắt để ôn hơn là bài giảng cho lần học đầu. Người học gặp định nghĩa, ký hiệu và kết luận trước khi có đủ ví dụ để tự suy ra chúng. Bố cục nhiều thẻ đặt cạnh nhau làm các ý phụ trông quan trọng ngang ý chính.

| Điểm hiện tại | Vì sao khó theo dõi | Cách sửa cụ thể |
|---|---|---|
| Mở bài bằng 8 quân hậu và 1,8×10¹⁴ → 2.057 | Chưa giới thiệu luật chơi, cách biểu diễn hay thứ đang được đếm | Mở bằng bài tìm đường trên bản đồ nhỏ. Đưa quân hậu xuống sau khi đã hiểu mô hình hóa |
| Toán nền mở đầu bằng đồ thị, cây, Big-O | Người học chưa có tình huống để gắn thuật ngữ; câu “cả buổi so O(b^d) với O(bm)” lệch với nội dung buổi 3 hiện tại | Giới thiệu đồ thị ngay cạnh bản đồ; cây ngay cạnh ví dụ lặp; Big-O ở buổi 4 hoặc phần đọc thêm |
| Mục 02 có năm thẻ ngang, ký hiệu mẫu nhỏ và xuống dòng | Mắt phải quét qua năm cột; không thấy quan hệ giữa trạng thái, hành động và kết quả | Dùng năm hàng “câu hỏi đời thường → tên → câu trả lời trong cùng ví dụ”, đi kèm một sơ đồ |
| Cùng mục 02 chuyển sang puzzle, NP-complete, quân hậu, rồi cây tìm kiếm | Nhiều miền ví dụ mới nhưng chưa miền nào được giải trọn | Giữ bản đồ làm ví dụ chính; chọn quân hậu làm ví dụ chuyển giao; số liệu lớn để đọc thêm |
| Mục 03 mở bằng BFS/DFS/UCS/GBFS/A*, FIFO/LIFO và g/h/f | Đòi kiến thức buổi sau để hiểu buổi này | Chỉ nêu câu hỏi “chọn nút nào xét tiếp?”; tên thuật toán đặt ở đoạn nối cuối bài |
| Hai mã giả xuất hiện trước giải thích node và frontier | Phải đọc mã bằng những khái niệm chưa hiểu | Định nghĩa qua một lần chạy tay, sau đó mới hiện mã giả tương ứng |
| Node ≠ state, frontier, cây khác đồ thị chủ yếu được nói bằng chữ | Đây là các quan hệ cần nhìn thấy trên ví dụ | Hiện bản đồ cạnh cây, đánh dấu cùng một trạng thái xuất hiện ở hai nút |
| Quiz Q1 nhận diện danh sách năm thành phần | Chưa kiểm tra được lời hứa “viết ra được formulation” | Thêm câu tự điền mô hình hoặc phát hiện mô hình thiếu thông tin |
| Bài tập hỏi incremental/complete-state nhưng phần giảng chưa hướng dẫn hai cách | Khoảng cách lớn từ đọc hiểu sang tự làm | Dạy bằng 4 quân hậu trước, rồi giao 8 quân hậu |
| Bài hai người gặp nhau có nhiều điều kiện ngầm | Người học có thể mắc ở cách hiểu đề thay vì mô hình hóa | Nêu vị trí đầu, quy tắc chờ, ý nghĩa thời gian cạnh và điều kiện gặp nhau |

## 2. Các điểm chính xác cần sửa trước

1. **Không nói các thuật toán chỉ khác duy nhất cách lấy phần tử khỏi frontier.** Mã giả hiện tại loại mọi trạng thái đã ở frontier; nếu dùng nguyên xi cho UCS sẽ bỏ mất đường rẻ hơn. Phản ví dụ có hướng: S→A giá 10, S→B giá 1, B→A giá 1; khi mở B, phải cập nhật đường tới A từ 10 xuống 2. Sửa cả lời giảng mục 03 lẫn Quiz Q2. Có thể giữ khung đơn giản để minh họa chống lặp, nhưng ghi rõ nó chưa phải cài đặt tổng quát cho tìm kiếm tối ưu theo chi phí. Tham khảo [mã giả UCS của AIMA](https://github.com/aimacode/aima-pseudocode/blob/master/md/Uniform-Cost-Search.md).
2. **Thống nhất b.** Toán nền gọi b là trung bình, cuối bài gọi b là tối đa. Với phân tích cận trên trong bài, dùng “số nút con tối đa”; cây đều b nhánh có b^d nút ở tầng d, cây không đều chỉ có cận tương ứng. Định nghĩa cây cũng cần điều kiện liên thông, không chỉ “không có chu trình”.
3. **Trừu tượng hóa có điều kiện.** “Bỏ thời tiết, không liên quan” chỉ hợp lý khi mô hình giả định thời tiết không ảnh hưởng đường đi/chi phí. Đổi thành ví dụ đối chiếu: màu xe thường bỏ được; nhiên liệu phải giữ nếu quyết định khả năng đi tiếp.
4. **Vòng hở không có nghĩa cứ tính trước là chắc chắn tới.** Giải thích rằng chuỗi hành động cố định dựa trên các giả định của mô hình; nếu điều kiện thực tế thay đổi, có thể cần quan sát và lập kế hoạch lại.
5. **Không dùng số quân hậu như phép so sánh tự hiển nhiên.** Bài đang gọi một vế là “chuỗi” và đưa 2.057 mà không giải thích cách đếm. Trước khi giữ số liệu, phải xác định rõ đang đếm cấu hình, chuỗi đặt hay nút trong cây, có tính trạng thái trung gian/gốc không. Mục tiêu chính là hiểu vì sao hạn chế hành động hợp lệ làm giảm nhánh.
6. **Sửa các lời hứa lệch giao diện.** Đoạn giới thiệu nói quiz “không chấm bạn” nhưng thành phần quiz ghi chấm và lưu điểm vào lộ trình. Nên viết “dùng điểm để tự kiểm tra; kết quả được lưu vào lộ trình”. “Một khung, bảy thuật toán”, “sắp viết reconstruct trong Lab” cũng cần định vị lại sau khi bài cũ đã tách thành nhiều buổi.

## 3. Mạch bài đề xuất — 120 phút, gồm thực hành

| Phần | Thời lượng | Người học làm được gì |
|---|---:|---|
| 1. Từ yêu cầu đời thường tới mục tiêu rõ ràng | 10 phút | Phân biệt “đến đích” với “đến đích rẻ nhất” |
| 2. Viết năm thành phần trên một bản đồ nhỏ | 25 phút | Tự điền trạng thái đầu, hành động, chuyển trạng thái, kiểm tra đích, chi phí |
| 3. Trạng thái cần giữ thông tin gì? | 15 phút | Giải thích khi nào cần thêm nhiên liệu hoặc vị trí người thứ hai |
| 4. Máy lưu một đường đi ra sao? | 20 phút | Phân biệt node/state, tính g, lần theo parent |
| 5. Từ bản đồ tới cây và danh sách chờ xét | 20 phút | Chạy tay vài bước, chỉ ra vòng lặp, phân biệt frontier/explored |
| 6. Đổi mô hình với 4 quân hậu | 15 phút | So sánh thêm quân dần và di chuyển quân có sẵn |
| 7. Tự làm và giải thích đáp án | 15 phút | Hoàn thành một mô hình mới, phát hiện lỗi mô hình |

Giữ bốn bước của agent như sơ đồ mở đầu ngắn. Giữ bốn tiêu chí đánh giá ở đoạn tổng kết nối sang buổi 4. Không cần dạy chi tiết BFS/DFS/UCS/A* trong buổi này. Bài tập về nhà tính ngoài 120 phút.

## 4. Mẫu giải thích thay cho năm thẻ định nghĩa

Đây là bản đồ giả lập dùng để dạy, không phải khoảng cách Romania. Đường hai chiều: A—B dài 2 km, A—C dài 5 km, B—C dài 1 km, B—D dài 6 km, C—D dài 2 km. Bắt đầu tại A, cần tới D, muốn tổng quãng đường nhỏ nhất.

| Câu hỏi | Thành phần | Trả lời |
|---|---|---|
| Ban đầu đang ở đâu? | Initial state | A |
| Từ đây được làm gì? | Actions(s) | Tại A: đi B hoặc C; tại B: đi A, C hoặc D |
| Làm xong thì ở đâu? | Result(s,a) | Result(A, Đi B) = B |
| Khi nào hoàn thành? | Goal test | Vị trí hiện tại bằng D |
| Một phương án tốn bao nhiêu? | Path cost | Cộng độ dài từng cạnh đã đi |

Giải thích một lượt: đang ở A, chọn Đi B, trạng thái mới là B, đã đi 2 km. B chưa phải D nên chưa hoàn thành. Nếu tiếp tục B→C→D, tổng chi phí là 2+1+2=5 km. Đường A→B→D cũng đến đích nhưng tốn 2+6=8 km. Cả hai đều là nghiệm; nghiệm ít bước hơn chưa chắc rẻ hơn. Việc chứng minh đường rẻ nhất sẽ học bằng thuật toán ở buổi sau.

**Dừng để tự làm:** A→C→D tốn bao nhiêu? Đáp án: 5+2=7 km. Không lấy khoảng cách thẳng A–D và không dùng số bước thay cho km.

Sau đó dùng chính bản đồ này để dạy node/state:

| Nút tìm kiếm | STATE | PARENT | ACTION | g |
|---|---|---|---|---:|
| n0 | A | không có | không có | 0 |
| n1 | B | n0 | Đi B | 2 |
| n2 | C | n0 | Đi C | 5 |
| n3 | C | n1 | Đi C | 3 |

n2 và n3 cùng trạng thái C nhưng là hai nút khác nhau: đường tới C khác nhau nên parent và g khác nhau. Nếu tới D từ n3, lần theo parent sẽ có D←C←B←A; đảo thứ tự để lấy đường A→B→C→D.

Trước mã giả, trình bày một lần chạy tay: ban đầu frontier chứa nút A, explored rỗng. Lấy A ra, kiểm tra chưa tới D, đánh dấu A đã mở, sinh các nút B và C. Frontier là các nút đã phát hiện và đang chờ xét; explored ghi các trạng thái đã mở. Minh họa này chưa chọn chính sách tìm kiếm và chưa khẳng định tối ưu.

## 5. Ví dụ thứ hai: 4 quân hậu

Giới thiệu luật: đặt bốn hậu trên bàn 4×4 sao cho không trùng hàng, cột, đường chéo. Dùng bàn nhỏ để người học nhìn được từng bước.

- **Thêm dần:** biểu diễn danh sách hàng theo thứ tự cột. `[] → [2] → [2,4] → [2,4,1] → [2,4,1,3]`. Mỗi bước đặt một hậu ở cột kế tiếp, chỉ chọn hàng không bị các hậu trước chiếu. Nêu rõ vì sao mỗi bước hợp lệ.
- **Trạng thái đầy đủ:** bắt đầu với đủ bốn hậu, một hậu mỗi cột; một hành động đổi hàng của một hậu. Cho xem một bàn có xung đột rồi khoanh cặp hậu đang chiếu nhau. Chưa cần dạy thuật toán chọn nước đi.
- **Câu hỏi chuyển giao:** cách nào có số hậu thay đổi theo bước? Đích của hai cách có giống nhau không? Nếu chỉ quan tâm bàn cuối, vì sao độ dài đường đi không phải mục tiêu chính?

Sau ví dụ đã giải mới giao bài 8 quân hậu. Nếu giữ các số liệu lớn, đưa vào ô đọc thêm và giải thích cách đếm.

## 6. Bố cục đề xuất

- Mỗi phần bắt đầu bằng một câu hỏi và một đầu ra cụ thể: “Học xong, bạn tự viết được…”.
- Nội dung đọc chính một cột khoảng 680–760 px; dùng toàn chiều rộng cho sơ đồ và bảng so sánh thực sự cần thiết. Đây là thông số đề xuất, cần kiểm tra khi triển khai.
- Mỗi cụm có nhịp cố định: tình huống → hình/ví dụ → giải thích → ký hiệu → câu tự kiểm tra.
- Hai cột chỉ dùng khi cần nhìn quan hệ đồng thời: bản đồ/cây, hai nút cùng trạng thái, hai cách đặt hậu. Mobile xếp dọc theo thứ tự giải thích.
- Nội dung chính dùng chữ khoảng 16–18 px; ví dụ giải thích dùng cùng độ rõ với phần lý thuyết, không đẩy thành chú thích nhỏ và mờ.
- Giảm thẻ đóng khung. Chỉ dùng khung cho ví dụ, câu hỏi hoặc lưu ý; tránh mọi đoạn đều có viền và nhiều màu nhấn.
- Thuật ngữ tiếng Anh xuất hiện cạnh tiếng Việt lần đầu, không làm nhãn chính cho toàn bài.
- Với mô phỏng: có Bước tiếp, Quay lại, Đặt lại; mỗi bước ghi hành động và lý do. Tránh tự chạy trước khi người học kịp đọc.
- Chế độ trình chiếu cần tách theo đơn vị giải thích nhỏ; một mục lớn hiện tại chứa cả mã giả, node/state, frontier và đánh giá nên chưa tương đương một slide tập trung.

## 7. Quiz và bài tập

Thay các câu nhớ thuật ngữ bằng các nhiệm vụ: điền Actions(B); tính chi phí một đường; so sánh n2/n3; chọn biến phải thêm khi xe có nhiên liệu hữu hạn; xác định trạng thái của hai người là một cặp vị trí.

Bài gặp nhau cần nêu rõ: hai người bắt đầu ở thành phố nào; có được đứng yên cả lượt hay không; chỉ gặp ở thành phố cuối lượt hay cả trên đường; d là thời gian hay khoảng cách (nếu là khoảng cách phải có giả định tốc độ); “liên thông” khác “đồ thị đầy đủ”. Với thời gian cạnh đã cho, chi phí lượt là max(t₁,t₂). Câu chứng minh vô nghiệm và buộc thăm lại thành phố nên là phần nâng cao sau bài lập mô hình cơ bản.

Mỗi câu có gợi ý và giải thích đáp án: chỉ ra bước suy luận, không chỉ nêu lựa chọn đúng. Giữ tự kiểm tra nhưng thay lời hứa “đưa đề nào cũng viết được” bằng mục tiêu vừa sức và có thể quan sát.

## 8. Thứ tự triển khai và tiêu chí nghiệm thu

1. Sửa điểm dễ dạy sai, các lời hứa cũ và sự lệch giữa quiz với mục tiêu.
2. Viết lại mạch bài với bản đồ xuyên suốt và ví dụ 4 quân hậu; đặt câu tự làm ngay sau mỗi ví dụ.
3. Chỉnh bố cục một cột, minh họa bản đồ/cây, bảng chạy tay; sau đó mới thêm tương tác cần thiết.
4. Đồng bộ bản tiếng Anh và lộ trình; giữ các liên kết tới nội dung buổi 4–5 rõ ràng.

Nghiệm thu bằng khả năng làm bài: người mới tự viết năm thành phần cho ví dụ tương tự, tính g đúng, giải thích hai nút cùng trạng thái, và chạy tay vài bước mà không cần đoán nghĩa của ký hiệu. Kiểm tra desktop/mobile, cuộn/trình chiếu, khả năng dùng bàn phím và trạng thái bài tập khi chuyển mục. Các tiêu chí này là mục tiêu kiểm thử thiết kế, chưa phải kết quả đo với người học thật.

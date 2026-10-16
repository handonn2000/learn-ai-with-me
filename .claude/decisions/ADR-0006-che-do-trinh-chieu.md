# ADR-0006 — Trang bài học có hai chế độ xem: cuộn và trình chiếu

Ngày: 2026-08-22 · Trạng thái: chấp nhận

## Bối cảnh

Bài học hiện là một trang dài, đọc bằng cách cuộn từ trên xuống. User phản hồi rằng đọc kiểu đó
"khá khó chịu" và muốn thử bố cục trượt trái phải như slide.

Đây không phải chuyện thẩm mỹ thuần túy — hai cách xem phục vụ hai kiểu người đọc khác nhau. Cuộn
cho phép lướt nhanh, Ctrl+F cả bài, và thấy được độ dài còn lại. Trình chiếu bắt người đọc đi đúng
một mục một lúc, khó lạc, và hợp lúc học thật sự chứ không phải lúc tra cứu.

## Quyết định

Thêm **chế độ trình chiếu bật/tắt**, không thay thế chế độ cuộn.

- `src/components/LessonDeck.tsx` — `<LessonDeck>` bọc các mục của bài, `<DeckToggle>` là nút bật
  tắt đặt trong `LessonNav`, `useDeckMode()` nhớ lựa chọn ở localStorage key `lam-lesson-view`.
- Mỗi bài khai báo một hằng `NAV` duy nhất, dùng chung cho cả thanh điều hướng lẫn danh sách slide
  (`SLIDES = NAV.map(...)`). Nhờ vậy hai thứ không thể lệch nhau.
- Điều khiển: nút ← →, phím ←/→/PageUp/PageDown/Home/End, vuốt ngang trên cảm ứng, và dải chấm bấm
  được ở thanh dưới đáy.
- Link `href="#id"` trên thanh điều hướng vẫn hoạt động: ở chế độ trình chiếu, deck bắt sự kiện
  `hashchange` rồi nhảy slide, vì phần tử đích đang `display:none` nên trình duyệt không cuộn tới
  được.

## Hai ràng buộc định hình toàn bộ cách cài

**1 · Không unmount slide đang ẩn.** Lab hút bụi có thể đang ở bước 12, quiz đang làm dở câu 5.
Trượt qua mục khác rồi quay lại mà mất sạch trạng thái thì tệ hơn là không có chế độ này. Nên mọi
slide vẫn mount, chỉ `display: none`. Cái giá: bài nào cũng dựng toàn bộ DOM ngay từ đầu — chấp
nhận được vì trang bài học vốn đã render hết mọi mục ở chế độ cuộn.

**2 · Không sửa DOM do React quản.** Deck bọc mỗi mục trong một div của riêng nó rồi bật tắt
`display` trên div đó, thay vì sửa `style`/`className` của chính thẻ section. Sửa thẳng thì sớm
muộn cũng bị React ghi đè lúc một panel bên trong re-render, và lỗi kiểu đó rất khó lần ra.

## Hệ quả đã biết

- **Canvas phải tự đo lại bề rộng.** Slide ẩn có `clientWidth = 0`, nên mọi thứ đo bề rộng một
  lần lúc mount đều hỏng: `CanvasScene` và `SearchLab` từng rơi vào giá trị dự phòng 640 rồi
  không bao giờ đo lại — ở màn 1440px, canvas rộng 1070 mà bitmap chỉ 1280 thay vì 2140, tức là
  kéo giãn 1,67 lần *và* vẽ theo hệ tọa độ 640. Đã sửa bằng `ResizeObserver` (nó cũng thay luôn
  listener `window.resize` cũ). **Component nào đo kích thước phần tử cũng phải dùng
  `ResizeObserver`, đừng đo một lần rồi thôi.**

- **Mục cao hơn màn hình vẫn phải cuộn dọc trong lòng slide** — lab hút bụi, sơ đồ 5 nấc, bảng PEAS.
  Đây là giới hạn thật của việc trình chiếu một bài học dài, không phải bug. Muốn hết hẳn thì phải
  cắt nhỏ nội dung, và đó là một quyết định khác.
- **Mất Ctrl+F toàn bài** khi đang ở chế độ trình chiếu, vì mục khác đang `display:none`. Đổi về
  cuộn là tìm được lại — đây chính là lý do giữ cả hai chế độ.
- **Hero là slide bìa (slide 01).** Bản đầu ẩn hero đi vì nó chiếm trọn màn hình và đẩy slide 01
  xuống khuất — đó là né vấn đề. Cách đúng: đưa hero vào trong `LessonDeck` làm con đầu tiên, và
  `SLIDES` thêm một mục dẫn đầu `{ id: 'hero', label: 'Bìa' }`. Mục này **không** có trong `NAV`,
  vì thanh điều hướng không cần một link “bìa”; nhờ `slides.findIndex` mà mọi link `#id` vẫn nhảy
  đúng dù chỉ số đã lệch một. Hero cũng không mang `id` trong DOM, để `check_lesson.py` khỏi báo
  thừa một anchor không có trong nav.
- `body` được `padding-bottom: 92px` khi có thanh lái, kẻo nút đè lên nội dung cuối slide.
- Lựa chọn chế độ lưu ở key riêng `lam-lesson-view`, **không** nhét vào `ProgressDB` — nó là tùy
  chọn hiển thị, không phải tiến độ học (xem ADR-0004 và skill `gamification`).

## Phương án đã cân nhắc rồi bỏ

- **Thay hẳn bằng trình chiếu.** Bỏ vì mất Ctrl+F, mất khả năng đọc lướt, và vì chưa ai kiểm chứng
  rằng trình chiếu thực sự dễ đọc hơn trên chính nội dung này. Giữ cả hai thì so được.
- **Chỉ cắt mục dài cho đỡ mỏi khi cuộn.** Vẫn là một hướng đáng làm và không mâu thuẫn với ADR này,
  nhưng nó không trả lời được đúng thứ user hỏi.
- **Dùng thư viện carousel.** Vi phạm ADR-0001 (giữ Vite trần, không thêm dependency khi chưa có lý
  do đủ mạnh); phần cần viết chỉ khoảng 120 dòng.

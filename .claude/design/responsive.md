# Responsive

Mục tiêu: desktop + iPhone (≈390–430px, có notch → viewport-fit=cover đã set).

## Nguyên tắc
- Layout chính bằng flex-wrap + grid `repeat(auto-fit, minmax(min(Npx,100%),1fr))` — tự xuống dòng, không cần media query cho phần lớn khối.
- Breakpoint chính 640px trong global.css:
  - container padding 24→16px; h1 hero 52→36px (class .hero-title); sec-head__title 31→24px
  - .lesson-nav__title ẩn (badge đã đủ, nhường chỗ cho nút đổi chế độ xem)
  - .btn/.check-item min-height 44px; .deck-slide bỏ căn giữa
- Breakpoint phụ `max-height: 700px`: `.deck-slide` bỏ căn giữa dọc — màn thấp mà căn giữa thì
  nội dung bị đẩy khuất dưới thanh lái.
- Bảng rộng (.dtable trong card): bọc bằng `overflow-x: auto` + min-width — không bóp cột.
- Canvas: width 100% theo container, height cố định từng cảnh (380/300/340/470/250/290), tự scale
  theo devicePixelRatio ≤2. Bề rộng đo bằng **`ResizeObserver`**, không phải một lần lúc mount —
  ở chế độ trình chiếu canvas mount khi mục còn `display:none` (`clientWidth = 0`). Xem ADR-0006.
- Manim Lab: canvas `flex: 1 1 560px; min-width: min(440px,100%)`, sidebar `flex: 1 1 300px` — mobile xếp dọc.
- Không dùng vw/vh cho chữ; không fixed width ngoài min-width có min().

## Chưa làm / cân nhắc sau
- Bảng 7 thuật toán trên mobile vẫn phải cuộn ngang (chấp nhận được, dữ liệu dạng bảng thật).
- `LessonNav` cố ý **hai hàng ở mọi bề rộng**: hàng 1 danh tính bài + nút đổi chế độ, hàng 2 mục lục
  cuộn ngang (ẩn scrollbar, hit target 44px ở mobile). Trước đây để wrap thì chiều cao thanh bar
  nhảy theo số mục, và nút bị đẩy xuống dòng riêng — đừng gộp lại một hàng.

### DEF b7 visual figures
At 760px, diagram paths become vertical, ecosystem branches stack, and the broker
grid becomes two columns. At 400px, figure padding and storage-cell typography
compact while retaining at least 11px labels. At 480px, this lesson's toolbar wraps
and its language/deck buttons retain 44px targets. Verified at 375px and 320px.

### DEF b7 repeating scenes — 2026-09-09
Scenario tabs wrap, fan-out branches stack, and 3D transforms flatten on small screens.
Storage tiles retain stable identity across layouts. JSON is selectable and wraps within
its panel. Lab labels are at least 11px; verified VI at 375px and 320px without page,
figure, lab or JSON overflow. Offscreen deck slides suspend their animation clocks.
Reduced motion supplies complete static explanations and outcomes.

### DEF b7 Data Island
The 3D stage is 650px tall on wide desktop, 590px normally, 530px below 760px and
460px below 440px. The inspector stacks below 760px; six station buttons become two
columns. Below 440px, projected labels become 44px authentic-logo markers and names
remain in the station list. Camera controls are 44px on mobile. Renderer dimensions
follow ResizeObserver, including deck mode; device pixel ratio is capped at 1.5.

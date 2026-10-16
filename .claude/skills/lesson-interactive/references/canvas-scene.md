# Viết một cảnh canvas

Đọc file này khi đã chọn Canvas 2D cho hình động; không phải mọi animation đều cần canvas. Tham chiếu:
`src/features/lessons/b1/lesson01.scenes.ts` (bảng 2×2, sơ đồ Turing, dòng thời gian) và
`src/features/lessons/b3/lesson03.scenes.ts` (cây nổ hàm mũ, phong cảnh leo đồi).

## Khi nào đáng vẽ canvas

Chỉ vẽ khi hình **động** dạy được thứ mà chữ và ảnh tĩnh không dạy nổi: một quá trình diễn
ra theo thời gian, một thứ lớn lên, một thứ kẹt lại. Bảng so sánh, sơ đồ tĩnh, cây phân
loại thì dùng HTML/SVG cho nhẹ và đọc được bằng trình đọc màn hình.

Số cảnh theo nội dung và yêu cầu user; xem `visual-storytelling.md` để chọn hình thức đa dạng, logo thật và nhịp kể.

## Bộ khung

```ts
// Hai cảnh phụ của Buổi 4: … — mô tả ngắn ở đây.
import { MONO, type SceneApi } from '@/components/CanvasScene';

type Ctx = CanvasRenderingContext2D;

export function drawAnneal(x: Ctx, { clock, w, h }: SceneApi) {
  x.clearRect(0, 0, w, h);
  const T = clock % 8;          // chu kỳ lặp, giây
  …
}
```

Gọi trong trang:

```tsx
<Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 22 }}>
  <div className="canvas-panel__head">
    <span className="canvas-panel__title">Tiêu đề cảnh</span>
    <span className="canvas-panel__sub">một dòng nói cảnh này đang cho xem cái gì</span>
  </div>
  <CanvasScene height={290} draw={drawAnneal} />
</Reveal>
```

`canvas-panel` giữ nền tối ở cả theme sáng lẫn tối — nên trong hàm vẽ **dùng hex cứng**,
đừng đọc CSS variable. Đây là ngoại lệ duy nhất của luật "màu luôn qua token".

## Bảng màu dùng trong canvas

Khớp với token để hình và chữ quanh nó cùng một hệ:

| Vai trò | Hex | Token tương ứng |
|---|---|---|
| chính / frontier | `#58C4DD` | `--cyan` |
| nhấn / đang xử lý | `#F4D345` | `--yellow` |
| tốt / đường đi | `#83C167` | `--green` |
| xấu / kẹt | `#FC6255` | `--red` |
| phụ | `#C792EA` | `--purple` |
| chữ mờ | `#97A0B5` / `#5C6579` | `--muted` / `--faint` |
| nền panel | `#0B0D18` | — |

Alpha thì dùng `rgba(88,196,221,.3)` chứ đừng đổi hex.

## Nhịp thời gian

`clock` là giây cộng dồn (đã nhân `getSpeed()` nếu có). Nhịp chuẩn: lấy `clock % chuKy` rồi
chia pha.

```ts
const T = clock % 7.6;                    // một vòng 7,6 giây
const ph = Math.min(1, T / 3.4);          // pha 0→1 trong 3,4 giây đầu
const ee = ph < 0.5 ? 2*ph*ph : 1 - Math.pow(-2*ph+2, 2)/2;   // easeInOut
```

`easeInOut` có sẵn trong `@/components/CanvasScene` — import thay vì chép lại. Cùng chỗ đó
có `rr()` (rounded rect, có fallback cho trình duyệt cũ) và `wrapText()`.

Cảnh nên **tự lặp** và đọc được ở bất kỳ thời điểm nào người dùng cuộn tới. Đừng làm cảnh
chỉ có nghĩa nếu xem từ giây 0.

Minh họa giải thích không có hàng nút phát/tiến/lùi/reset/tốc độ; tab có thể đổi use-case.
Giữ khung kết quả đủ đọc và phân biệt rõ vòng minh họa mới với hành vi thật của hệ thống.
Kiểm cả frame chuyển tiếp và ranh giới vòng, không để dữ liệu/offset chạy ngược gây hiểu sai.

Chỉ chạy rAF khi cảnh trong viewport và document không ẩn; hủy scheduler/listener/observer
khi unmount. Khi tiếp tục, đặt lại mốc timestamp để không nhảy qua nhiều pha. Đừng mặc định
wrapper đã xử lý các điều kiện này: đọc implementation hiện tại và kiểm hành vi thực tế.

## prefers-reduced-motion

Khi reduced motion bật, nhận cờ `rm` và vẽ **bản tĩnh đủ lời giải**. Dùng trạng thái cuối
nếu nó giải thích được cơ chế; nếu cần thấy trước/sau hoặc nhiều pha, cho storyboard hoặc
bảng HTML ổn định đi kèm:

```ts
export function drawTimeline(x: Ctx, { clock, w, h }: SceneApi, rm: boolean) { … }
```

```tsx
<CanvasScene height={340} draw={(x, api) => drawTimeline(x, api, rm)} />
```

Trong hàm: `rm` bật thì bỏ qua chuyển động, vẫn vẽ đủ nội dung cần hiểu. Ngừng timer/rAF
không cần thiết thay vì tiếp tục vẽ cùng một frame. Người tắt hiệu ứng vẫn phải học được bài.

## Chữ trong canvas

```ts
x.font = '700 12.5px ' + MONO;
x.fillStyle = '#F4D345';
x.textAlign = 'left';
x.textBaseline = 'alphabetic';
x.fillText('b = 3 · d = 2 → 13 nút', 14, 20);
```

Luôn set lại `textAlign`/`textBaseline` trước mỗi cụm chữ — canvas giữ state, quên set là
chữ nhảy chỗ theo cụm vẽ trước đó. Cỡ chữ nhỏ nhất đọc được: 9,5px mono.

Chữ trong canvas **không** được là nội dung duy nhất mang một ý — nó không copy được,
không đọc được bằng trình đọc màn hình, không tìm kiếm được. Ý chính luôn phải có trong
đoạn văn HTML quanh cảnh; canvas là minh họa.
Không đặt caption/trạng thái thay đổi theo frame trong `aria-live` hoặc `role=status`;
dùng mô tả HTML ổn định để screen reader đọc toàn bộ cơ chế theo nhịp của người học.

## State giữa các frame

Cần nhớ gì đó qua nhiều frame (ví dụ vị trí kẹt tính một lần) thì để biến module ngoài hàm:

```ts
let stuckX: number | null = null;
export function drawHill(x: Ctx, { clock, w, h }: SceneApi) {
  if (stuckX == null) { let s = 0.06; while (f(s + 0.003) > f(s)) s += 0.003; stuckX = s; }
  …
}
```

Hàm vẽ chạy 60 lần/giây — mọi thứ tính được một lần thì đừng tính lại trong đó.

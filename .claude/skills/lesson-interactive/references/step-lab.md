# Step lab — trình chạy từng bước

Đây là hình thức tương tác mạnh nhất của app và cũng tốn công nhất. Tham chiếu đầy đủ:
`src/features/search-lab/search-engine.js` (203 dòng, engine) +
`src/features/lessons/b3/SearchLab.tsx` (250 dòng, UI).

Reference này dành cho lab mà user cần chủ động khảo sát bước/thuật toán hoặc làm bài tập.
Không áp bộ nút của nó cho animation giải thích: loại đó tự phát và tự lặp, tab đổi use-case,
theo `visual-storytelling.md`. Giữ chức năng của lab có mục đích; không biến quiz thành phim.

## Ý tưởng cốt lõi: engine sinh trace, UI chỉ là trình phát

Cám dỗ đầu tiên khi làm loại này là viết thuật toán *bên trong* component và vẽ dần theo
mỗi vòng lặp. Đừng. Thay vào đó:

```
runTrace(algo, preset)  →  Step[]        // chạy hết một lần, trả về TOÀN BỘ các bước
UI                      →  steps[i]      // chỉ đọc và vẽ, không tính gì
```

Tách như vậy đổi lại được ba thứ, và cả ba đều đáng:

- **Lùi lại thành chuyện vặt.** `setStep(s => s - 1)` là xong. Nếu thuật toán chạy trong
  component thì lùi lại là bài toán khó (phải undo state). Với lab khảo sát, khả năng
  quay lại bước cụ thể là một phần giá trị học.
- **Engine kiểm được riêng.** Nó là hàm thuần: vào preset, ra mảng. Không cần render để thử.
- **Thay được ruột.** `search-engine.js` là JS thuần, không import React — đây chính là ranh
  giới mà ADR-0005 giữ để sau này thay bằng Rust/WASM cho bài toán n lớn.

## Hình dạng một Step

Mỗi phần tử là **ảnh chụp đủ để vẽ lại toàn bộ khung hình đó**, không phải một delta. Tốn
bộ nhớ hơn, nhưng vẽ frame nào cũng chỉ cần đúng một phần tử — không phải replay từ đầu.

```ts
interface Step {
  a: string;                          // mã hành động: 'expand' | 'push' | 'deepen' | 'goal' | 'stuck' | 'fail'…
  cur: number | null;                 // nút đang xử lý
  edge: [number, number] | null;      // cạnh đang đi qua (để vẽ highlight)
  txt: string;                        // LỜI KỂ cho bước này — hiện ở panel bên phải
  limit: number | null;               // dữ liệu riêng của thuật toán (ở đây: ngưỡng ℓ của IDS)
  path: number[] | null;              // đường đi khi đã xong
  cost: number | null;
  fr: { n: number; k: string }[];     // frontier: nút + khóa hiển thị (g / h / f)
  ex: number[];                       // explored
  lit: string[];                      // dòng pseudo-code đang sáng
}
```

Hai trường làm nên chất lượng sư phạm, đừng bỏ:

- **`txt`** — câu kể *bước này đang làm gì và vì sao*. Đây là chỗ dạy bài, viết theo
  `lesson-voice`. Nhưng giữ ngắn: nó đổi liên tục khi chạy, dài là đọc không kịp
  (xem ngoại lệ "nhãn UI chức năng" trong `lesson-voice`).
- **`a`** — mã hành động, để UI đổi cách vẽ theo loại bước (`goal` thì vẽ đường xanh,
  `stuck` thì vẽ dấu đỏ, `deepen` thì hiện ngưỡng mới). Dùng mã chứ đừng đoán từ `txt`.

## Builder gom việc lặp

Engine hiện có một helper nhỏ để khỏi lặp việc chuẩn hóa từng bước:

```js
function T(P) {
  const steps = []; const L = i => P.labels[i];
  return {
    steps, L,
    push(o) {
      steps.push({
        a: o.a, cur: o.cur ?? null, edge: o.edge || null, txt: o.txt || '',
        limit: o.limit ?? null, path: o.path || null, cost: o.cost ?? null,
        fr: (o.fr || []).map(x => ({ n: x.n, k: x.k == null ? '' : '' + x.k })),
        …
      });
    }
  };
}
```

Nhờ nó mà thân thuật toán đọc gần như pseudo-code, chỉ chèn thêm `t.push({...})` ở đúng
những chỗ đáng cho người học nhìn. Viết engine mới thì copy pattern này.

**Chọn chỗ đặt `push` cẩn thận** — đó chính là chọn nhịp dạy. Push mỗi phép gán thì trace
dài lê thê và nhàm; push mỗi vòng lặp lớn thì người học mất đúng cái bước then chốt. Quy tắc
dùng được: push ở mỗi thời điểm mà **một câu trong bài giảng nói tới**.

## Nội suy giữa hai bước

Nhảy phắt từ bước n sang n+1 làm mắt mất dấu. `SearchLab` chèn một pha 0 → 1 giữa hai bước
rồi mới sang bước kế:

```ts
const tRef = useRef(0);   // pha trong bước hiện tại, 0 → 1

const tick = (ts: number) => {
  const dt = Math.min(0.05, (ts - (pts ?? ts)) / 1000);
  pts = ts;
  const S = stateRef.current;
  if (tRef.current < 1) tRef.current = Math.min(1, tRef.current + dt * 1.7 * S.speed);
  else if (S.playing) {
    if (S.step < S.steps.length - 1) { tRef.current = 0; setStep(s => s + 1); }
    else setPlaying(false);
  }
  drawViz(ctx, w, H, S.P, S.steps, S.step, tRef.current, S.algo, S.limitAt);
  raf = requestAnimationFrame(tick);
};
```

`drawViz` nhận `tRef.current` làm tham số pha để vẽ cạnh đang lan dần, nút đang phình lên.
Tự dừng khi hết trace (`setPlaying(false)`) — đừng để nó lặp vô hạn, người học cần biết là xong.
Đây là quy tắc của **step lab**. Trace dùng trong animation giải thích có thể tự lặp sau
khi giữ kết quả và báo mở lượt minh họa mới; không kéo bộ điều khiển lab vào chỉ để replay.

## stateRef — cái bẫy của rAF + React

Vòng `requestAnimationFrame` được tạo **một lần** trong `useEffect(…, [])`. Closure của nó
sẽ giữ mãi giá trị state của lần render đầu. Cách repo này xử lý:

```ts
const stateRef = useRef({ step, playing, speed, steps, P, algo, limitAt });
stateRef.current = { step, playing, speed, steps, P, algo, limitAt };   // ghi mỗi lần render
```

Rồi trong `tick` đọc `stateRef.current`, không đọc biến state trực tiếp. Bỏ qua chi tiết này
thì lab trông vẫn chạy nhưng bấm nút không ăn — bug rất khó lần.

Đừng "sửa" bằng cách cho state vào mảng phụ thuộc của `useEffect`: làm vậy là hủy và tạo lại
vòng rAF mỗi lần render, hình sẽ giật.

## Khung UI

Bố cục hai cột, xuống dòng được trên mobile:

```tsx
<div className="canvas-panel" style={{ borderRadius: 16 }}>
  {/* hàng chọn: thuật toán + preset */}
  <div style={{ padding: '13px 16px', borderBottom: '1px solid #1E2430', display: 'flex', gap: 8, flexWrap: 'wrap' }}>…</div>

  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    <canvas ref={canvasRef} style={{ flex: '1 1 560px', minWidth: 'min(440px, 100%)', height: 470 }} />
    <div style={{ flex: '1 1 300px', maxWidth: 400, borderLeft: '1px solid #1E2430', padding: 18 }}>
      {/* BƯỚC n / N · txt · frontier chips · kết quả */}
    </div>
  </div>

  {/* hàng điều khiển: ◀ Lùi · Chạy/Dừng · Tiến ▶ · tốc độ · ↺ */}
</div>
```

Panel phải cho `minHeight` ở ô `txt` (hiện đang 86px) — không thì cả khung nhảy lên xuống
mỗi bước, rất khó chịu khi đang theo dõi.

## Trước khi coi là xong

- Bấm Lùi về tận bước 0 rồi Tiến tới cuối — không vỡ, không lệch.
- Đổi thuật toán / preset giữa chừng → reset về bước 0 và tự chạy lại
  (`useEffect(() => { tRef.current = 0; setStep(0); setPlaying(true); }, [algo, preset])`).
- Rời trang khi đang chạy → `cancelAnimationFrame` trong hàm dọn dẹp, không rò.
- Ngoài viewport/document ẩn → dừng cập nhật; reduced motion → bản giải thích tĩnh đủ nghĩa.
- Caption tự đổi theo bước không tạo live-region announcements liên tục.
- Thu xuống 375px → hàng nút xuống dòng, canvas không tràn.
- Trace của mọi lựa chọn đều có bước kết thúc rõ ràng (`goal` / `stuck` / `fail`), không có
  cái nào chạy hết mảng mà người học không biết chuyện gì vừa xảy ra.

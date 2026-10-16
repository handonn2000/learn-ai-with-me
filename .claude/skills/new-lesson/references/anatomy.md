# Khung một trang bài học

Tham chiếu gốc: `src/features/lessons/b1/Lesson01Intro.tsx` (565 dòng, 10 mục, 3 canvas, 1 quiz)
và `src/features/lessons/b3/Lesson03Search.tsx` (553 dòng, 10 mục, 2 canvas, 2 lab tương tác).
Khi phân vân, mở hai file đó ra xem — chúng minh họa khung trang; chọn visual theo khái niệm và yêu cầu user, không bắt mọi bài tái dùng cùng phong cách/component.

## Mục lục

- [Bộ khung file](#bộ-khung-file)
- [Component dùng chung](#component-dùng-chung)
- [Class có sẵn trong global.css](#class-có-sẵn-trong-globalcss)
- [Mẫu một mục](#mẫu-một-mục)
- [Khi mục quá lớn: tách sub-component](#khi-mục-quá-lớn-tách-sub-component)
- [Mẫu thẻ so sánh nhiều thuật toán](#mẫu-thẻ-so-sánh-nhiều-thuật-toán)

## Bộ khung file

```
src/features/lessons/<id>/
├── Lesson<NN><Ten>.tsx      # trang chính, export default
├── lesson<NN>.scenes.ts     # hàm vẽ canvas (nếu có) — xem skill lesson-interactive
└── <TenPanel>.tsx           # tách riêng nếu một panel tương tác > ~120 dòng
```

Data nặng (mảng câu hỏi, bảng thuật toán, code mẫu) không để trong file trang — đưa sang
`src/content/courses/csc14003/<ten>.js` như `intro-ai.js` và `lab-searching.js`. Giữ dạng `.js`
thuần theo ADR-0005, đừng convert sang TS.

Đầu file trang — **một hằng `NAV` duy nhất**, dùng chung cho cả thanh điều hướng lẫn danh sách
slide, nên hai thứ không lệch nhau được:

```tsx
const NAV = [
  { href: '#toan', label: 'TOÁN NỀN' },
  { href: '#ch1', label: '01 Tối ưu' },
  { href: '#quiz', label: '09 Quiz', hot: true },
  { href: '#hw', label: '10 Bài tập' },
];
// Hero là slide bìa, KHÔNG nằm trong NAV (thanh điều hướng không cần link "bìa").
const SLIDES = [{ id: 'hero', label: 'Bìa' }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];
```

Cần cờ giảm chuyển động thì `import { prefersReducedMotion as rm } from '@/lib/motion'` — đừng
khai lại `matchMedia` trong file bài học.

Thứ tự trong `return`:

```tsx
export default function Lesson04LocalSearch() {
  const [deck, setDeck] = useDeckMode();
  return (
    <>
      <LessonNav badge="BUỔI 4" title="Tìm kiếm cục bộ" backTo="/courses/csc14003"
        items={NAV}
        right={<DeckToggle on={deck} onChange={setDeck} />} />

      <LessonDeck on={deck} slides={SLIDES}>
        {/* Hero — slide bìa; div bọc gradient, class lesson-hero, KHÔNG dùng lesson-section */}
        <div className="lesson-hero" style={{ background: 'radial-gradient(…)' }}> … </div>

        {/* Toán nền — mở màn, không đánh số */}
        <div id="toan" className="lesson-section lesson-section--first">
          <MathPrimer {...(MATH_PRIMERS.b4 as { minutes: number; lead: string; terms: MathTerm[] })} />
        </div>

        <div id="ch1" className="lesson-section"> … </div>
        …
        <div id="quiz" className="lesson-section"><SessionQuiz sessionId="b4" /></div>
        <div id="hw" className="lesson-section lesson-section--last"> … </div>
      </LessonDeck>
    </>
  );
}
```

**Mỗi con trực tiếp của `LessonDeck` là một slide**, và thứ tự phải khớp `SLIDES` từng vị trí.
`.lesson-section` thay cho hằng `wrap` cũ (xem `specs/00-architecture.md § Quy ước layout`); biến thể
`--first` cho mục ngay sau hero, `--last` cho mục cuối — thiếu `--last` thì nội dung dính đáy màn hình.

## Component dùng chung

| Component | Dùng để | Props đáng nhớ |
|---|---|---|
| `LessonNav` | thanh dính đầu trang + vạch tiến độ cuộn | `badge`, `title`, `backTo`, `items: {href,label,hot?}[]` — `hot` tô vàng mục tương tác chính |
| `SectionHead` | đầu mỗi mục | `no` `title` `en?` `color?` `lead?` — `title` và `lead` chạy qua Html nên nhúng được `<em>`, `<strong class='hl'>` |
| `Reveal` | hiện dần khi cuộn | `delay` (giây, 0.1 / 0.15 / 0.2 cho các khối kế tiếp), `as`, `className`, `style` |
| `CanvasScene` | cảnh rAF | `height`, `draw`, `getSpeed?`, `paused?` |
| `CheckList` | khối tự kiểm cuối bài | `storageKey='<id>-checks'`, `items: string[]` |
| `MathPrimer` | thẻ toán nền mở màn | `minutes`, `lead`, `terms: MathTerm[]` — dữ liệu ở `content/courses/csc14003/math-primers.js` khóa theo id buổi |
| `Html` | đoạn văn có định dạng inline | `t` (chuỗi HTML), `as` (thẻ), style/className truyền thẳng |
| `Kicker` | nhãn mono nhỏ in hoa trong thẻ | `color?` — mặc định `var(--faint)` |
| `SessionQuiz` | quiz trắc nghiệm cuối buổi | `sessionId` (`'b4'`), `color?` — câu hỏi lấy từ `session-quizzes.js`; đây là chỗ DUY NHẤT ghi `quizScore` |
| `LessonDeck` · `DeckToggle` · `useDeckMode` | hai chế độ xem cuộn / trình chiếu (ADR-0006) | `on`, `slides` — bọc toàn bộ các mục, hero là con đầu tiên |

Component chỉ dùng trong một bài thì để trong folder bài đó. Chỉ nâng lên `src/components/`
khi có từ hai bài trở lên dùng chung.

## Class có sẵn trong global.css

Đừng phát minh lại — kiểm ở đây trước khi viết inline style.

**Bố cục**: `.container` `.container--mid` `.container--narrow`
**Khối**: `.card` `.card--flat` `.panel-inner` `.canvas-panel` (+ `__head` `__title` `__sub`)
**Nhãn**: `.chip` `.chip--mono` `.kicker` `.mono` `.code-inline`
**Đầu mục**: `.sec-head` (+ `__no` `__title` `__en`) `.sec-rule` `.sec-lead`
**Số liệu**: `.stat` (+ `__k` `__v`) với biến thể `.stat--good` `.stat--bad` `.stat--warn` `.stat--good-b` `.stat--bad-b`
**Bảng**: `.dtable` (+ `.dtable__head`)
**Code**: `.codeblock`
**Nút**: `.btn` `.btn--primary` `.btn--toggle-on`
**Tự kiểm**: `.check-item` (+ `__mark`)
**Tô chữ trong Html**: `.hl` `.hl-cyan` `.hl-yellow` `.hl-green` `.hl-purple` `.hl-red` `.hl-red-soft` `.hl-mid` `.hl-text`

Bảng rộng phải bọc `overflowX: 'auto'` và đặt `minWidth` cho `<table>` — mobile mới cuộn được.

Code/JSON cần `<pre><code>` với màu theo token cú pháp và nguyên văn copy được; `.codeblock` chỉ là nền/khung, không tự chứng minh đã tô cú pháp. Callout cho dòng/field quan trọng khác với màu syntax. Dùng `<strong>` và `.hl-*` chọn lọc cho thuật ngữ/kết luận, giữ tương đương ở VI/EN. Xem `lesson-interactive/references/visual-storytelling.md` để chọn bảng màu, logo thật, media và nhịp animation tự lặp.

## Mẫu một mục

```tsx
<div id="ch4" className="lesson-section">
  <SectionHead no="04" title="Tiêu đề có <em class='hl-cyan'>nhấn</em>" en="English name"
    color="var(--yellow)"
    lead="Dựng chỗ vướng ở đây — xem khuôn 1 của lesson-voice." />
  <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
    <div className="card">
      <Kicker color="var(--cyan)">NHÃN NGẮN</Kicker>
      <Html as="p" t="Nội dung có <strong class='hl'>nhấn</strong>."
        style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
    </div>
  </Reveal>
</div>
```

Màu mục: mỗi mục lớn chọn một token (`--cyan` `--yellow` `--purple` `--green` `--red`) và
dùng nhất quán cho `SectionHead color`, Kicker, viền thẻ trong mục đó.

Grid dùng khắp nơi: `repeat(auto-fit,minmax(300px,1fr))`. Với thẻ có nội dung dài dùng
`minmax(min(400px,100%),1fr)` để mobile không tràn.

## Khi mục quá lớn: tách sub-component

Mục có state (quiz, chip bấm được, panel điều khiển) thì tách thành function riêng **trong
cùng file**, đặt sau component chính:

```tsx
/* ===== 05 · Hành động duy lý + quiz tương tác ===== */
function Ch5() {
  const [qi, setQi] = useState(0);
  …
  return <div id="ch5" className="lesson-section"> … </div>;
}
```

Rồi gọi `<Ch5 />` đúng vị trí trong trang. Bài 1 làm vậy với Ch5/Ch8/Ch9/Ch10.
Panel lớn hơn nữa (như `SearchLab`, `CodeLab` của bài 3) thì tách hẳn ra file riêng.

## Mẫu thẻ so sánh nhiều thuật toán

Bài 3 có helper `AlgoCard` — copy pattern này khi buổi nào cũng phải trình bày N biến thể
của cùng một thứ (buổi 4 local search, buổi 5 minimax/α-β, buổi 10 các mô hình ML):

```tsx
<AlgoCard color="var(--cyan)" abbr="BFS" name="Tìm theo chiều rộng" en="Breadth-first search"
  chips={[['frontier: FIFO queue', 'cyan'], ['dừng khi đích SINH RA', 'plain']]}
  body="Đoạn giảng có <strong class='hl'>nhấn</strong>…"
  stats={[
    { k: 'ĐẦY ĐỦ', v: '✓ khi b hữu hạn', cls: 'stat--good' },
    { k: 'BỘ NHỚ', v: 'O(b<sup>d</sup>) — RAM chết trước', cls: 'stat--bad stat--bad-b' },
  ]}>
  {/* con: bảng / ghi chú thêm */}
</AlgoCard>
```

Bốn ô `stats` cố định một trật tự trong cả bài (ĐẦY ĐỦ · TỐI ƯU · THỜI GIAN · BỘ NHỚ) để
người đọc so ngang được giữa các thẻ. Giữ nguyên trật tự đó nếu bạn tái dùng pattern.

Cuối mỗi `AlgoCard` có hai link `▶ Chạy từng bước trong Lab` / `⌨ Pseudo-code + Python` trỏ
tới phần tương tác — đó là khuôn 6 (đẩy người đọc ra khỏi ghế) được cài sẵn vào layout.

# Nối bài học vào app

Sáu chỗ. Thiếu chỗ 1 hoặc 2 thì bài học tồn tại nhưng không ai tới được.
Script `scripts/check_lesson.py <id>` kiểm phần lớn — chạy nó thay vì tự soát bằng mắt.

## 1 · Route trong `src/App.tsx`

Bài học là **full-bleed**: nó tự có `LessonNav` riêng nên phải nằm NGOÀI nhánh dùng
`AppHeader`, tức là đặt cùng chỗ với hai route bài học đang có, trước route `"*"`.

```tsx
const Lesson04 = lazy(() => import('./features/lessons/b4/Lesson04LocalSearch'));
```

```tsx
{/* Bài học full-bleed: tự có thanh điều hướng riêng */}
<Route path="/courses/csc14003/lessons/b1" element={<Lesson01 />} />
<Route path="/courses/csc14003/lessons/b3" element={<Lesson03 />} />
<Route path="/courses/csc14003/lessons/b4" element={<Lesson04 />} />   {/* ← thêm */}
```

Đặt nhầm vào nhánh `AppHeader` thì trang sẽ có hai thanh nav chồng nhau — dấu hiệu dễ nhận.

## 2 · `lessonPath` trong data khóa

`src/content/courses/csc14003/index.ts`, đúng session của buổi đó:

```ts
{ id: 'b4', week: 4, part: 1, title: 'Buổi 4 · Tìm kiếm cục bộ', en: 'Local Search & Optimization',
  hours: '~2.5h',
  lessonPath: '/courses/csc14003/lessons/b4',        // ← thêm dòng này
  topics: '…', math: '…',
  links: [{ label: 'Bài tập', href: U + 'buoi4/Homework4.pdf' }] },
```

Đây là thứ biến nhãn xám *"Bài học tương tác đang dựng"* trên trang Lộ trình thành nút
xanh *"Mở bài học tương tác →"*, và là thứ gợi ý "HỌC TIẾP" ở khối Hôm nay trỏ vào.

Đường dẫn trong `lessonPath` phải khớp từng ký tự với `path` của route ở bước 1.

## 3 · Anchor của `LessonNav`

Mỗi `items[].href` phải khớp một `id` có thật trong trang. Lệch một chữ là bấm không nhảy,
và không có lỗi nào báo cho bạn biết.

Khai một hằng `NAV` ở đầu file rồi truyền `items={NAV}` — **đừng viết mảng inline**, vì
`SLIDES` của chế độ trình chiếu phải dựng từ chính nó (xem chỗ 5).

```tsx
const NAV = [
  { href: '#ch1', label: '01 Tối ưu' },
  { href: '#lab', label: 'LAB', hot: true },      // hot = tô vàng, dành cho mục tương tác chính
  { href: '#quiz', label: '09 Quiz', hot: true },
  { href: '#hw',  label: '10 Bài tập' },
];
```

Quy ước id đang dùng: `ch1`…`ch9` cho các mục lý thuyết, `lab` / `codelab` cho panel tương
tác lớn, `quiz` cho quiz trắc nghiệm cuối buổi, `hw` cho mục bài tập.
**`quiz` là quiz, `hw` là bài tập — đừng đặt `quiz` cho mục bài tập** (bài 3 từng mắc lỗi này
và phải đổi lại sau khi có quiz thật).

Cuộn mượt do CSS `scroll-behavior: smooth` lo. **Không** gọi `scrollIntoView` — repo cấm
(xem `CLAUDE.md § Điều cấm`), và `ScrollToTop` trong `App.tsx` chỉ nhảy khi đổi `pathname`
nên anchor trong cùng trang không bị nó phá.

## 4 · `storageKey` của CheckList

```tsx
<CheckList storageKey="b4-checks" items={[…]} />
```

Quy ước `'<id>-checks'`. Key đang dùng: `b1-checks`, `b2-checks`, `b3-problem-checks`,
`b4-uninformed-checks`, `b5-informed-checks`. Trùng key giữa hai bài
thì người học tick bài này lại thấy bài kia đã tick — bug khó lần ra.

Key này đi qua `useLocalList` chứ không gọi `localStorage` thẳng. Đừng đụng vào key
`csc14003-progress` — đó là hợp đồng với dữ liệu tiến độ của người học.

## 4b · Chữ nghĩa: một bài, hai bundle

Không hardcode chữ trong `.tsx` nữa. Mỗi bài có ba file phẳng cạnh trang:

| File | Vai trò |
|---|---|
| `lessonNN.text.vi.ts` | `export const VI = {...}` — nguồn sự thật |
| `lessonNN.text.en.ts` | `export const EN = {...} satisfies typeof VI` |
| `lessonNN.text.ts` | `export const T: typeof VI = LOCALE === 'en' ? EN : VI` |

`const NAV` giữ nguyên `href` và `hot` trong `.tsx`, chỉ `label` lấy từ `T.nav.*` — nhờ vậy kiểm
anchor↔id của `check_lesson.py` không đổi. Scenes chỉ cần `import { T }`, **không đổi chữ ký**
hàm vẽ: `LOCALE` là hằng số module nên vòng rAF không phải phản ứng gì (ADR-0010).

`LangToggle` đã nằm sẵn trong `LessonNav` — **không** truyền từ trang bài học vào.

Trong file `*.scenes.ts` và mọi file `.js` thì import dưới **bí danh**: `import { T as TXT }`,
`import { N as MSG }`. File `.js` không được tsc kiểm nên trùng tên biến chỉ nổ lúc CHẠY. Hàm vẽ đã có biến cục
bộ `T` là thời gian của vòng rAF, trùng tên là `tsc` báo một lỗi rất khó đọc.

Dữ liệu `.js` của bài thì thêm `<tên>.en.js` + một selector `<tên>.locale.ts` đã gõ kiểu
(`const M: typeof VI = …` — **annotation, không phải `as`**). Đó là thứ khiến `tsc` bắt được
khóa thiếu ngay cả trong file `.js` không được typecheck.

## Sau khi nối

```bash
python3 .claude/skills/new-lesson/scripts/check_lesson.py b4
npm run build
```

Rồi mở `/courses/csc14003` xem card buổi đó đã có nút xanh chưa, bấm vào, cuộn hết bài,
thử phần tương tác, xem console.

## Ghi lại

`.claude/specs/lesson-<id>.md` — theo mẫu `lesson-b1.md`: dòng đầu ghi Files + data phụ
thuộc, rồi Goal, rồi liệt kê từng mục một dòng, rồi Acceptance.

`.claude/progress.md` — thêm mục ngày tháng ở cuối: làm được gì, còn dở gì. File này là
thứ phiên làm việc sau đọc để biết đang ở đâu, nên viết cho người đọc chứ không phải cho máy.


## 5 · Chế độ trình chiếu (ADR-0006)

Hai dòng trong file trang, và bọc toàn bộ các mục:

```tsx
const SLIDES = [{ id: 'hero', label: 'Bìa' }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];
…
const [deck, setDeck] = useDeckMode();
<LessonNav … items={NAV} right={<DeckToggle on={deck} onChange={setDeck} />} />
<LessonDeck on={deck} slides={SLIDES}>{/* hero + mọi mục */}</LessonDeck>
```

Thứ tự con của `LessonDeck` phải khớp `SLIDES` từng vị trí — hero là con đầu tiên. Quên bọc thì
nút đổi chế độ vẫn hiện mà bấm không có gì xảy ra.

## 6 · Quiz cuối buổi

Thêm một khóa vào `src/content/courses/csc14003/session-quizzes.js` (8 câu, `topic` là **chủ đề
trong buổi** chứ không phải tên buổi), rồi đặt `<SessionQuiz sessionId="b4" />` trong mục `#quiz`
ngay TRƯỚC mục bài tập. Component tự lo phần ghi điểm vào tiến độ; không phải viết gì thêm.

Không thêm khóa thì `SessionQuiz` render ra `null` — im lặng, không lỗi. Nhớ kiểm bằng mắt.
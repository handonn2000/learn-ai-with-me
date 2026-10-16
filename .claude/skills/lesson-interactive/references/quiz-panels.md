# Quiz, chip và các panel nhẹ

Bốn hình thức tương tác không cần canvas. Rẻ để dựng, và thường đủ — cân nhắc chúng trước
khi quyết định vẽ.

## 1 · Quiz phân loại

Dùng khi có **N ô cố định** và người học phải đặt vật vào đúng ô. Mạnh hơn trắc nghiệm
thường vì cùng một bộ ô lặp lại suốt N câu → người học học được *chính hệ phân loại đó*.

Tham chiếu: `Lesson01Intro.tsx` hàm `Ch5` — 4 ô (bốn hướng tiếp cận AI) × 8 câu.

Bộ state tối thiểu:

```tsx
const [qi, setQi] = useState(0);              // câu hiện tại
const [picked, setPicked] = useState<string | null>(null);   // đáp án vừa chọn, null = chưa chọn
const [score, setScore] = useState(0);
const [answered, setAnswered] = useState<number[]>([]);      // các câu đã tính điểm

const pick = (id: string) => {
  if (picked) return;                          // chọn một lần rồi khóa
  const ok = q.a === id;
  const first = !answered.includes(qi);        // chỉ cộng điểm lần đầu
  setPicked(id);
  if (ok && first) setScore(s => s + 1);
  if (first) setAnswered(a => [...a, qi]);
};
```

Hai chi tiết đáng giữ:

- **Khóa sau khi chọn.** Không cho đổi đáp án — người học phải cam kết trước khi thấy lời
  giải, đó là toàn bộ giá trị của active recall.
- **`answered` tách khỏi `score`.** Quay lại câu cũ vẫn xem được lời giải nhưng không cộng
  điểm lần hai. Thiếu chỗ này thì người ta bấm vòng vòng cho đủ 8/8.

Sau khi chọn, hiện ngay lời giải — xanh nếu đúng, đỏ nếu sai, kèm **đáp án đúng là gì**:

```tsx
{(picked === q.a ? '✓ Đúng. ' : '✗ Chưa đúng — đáp án: ' + quad.find(v => v.id === q.a)?.vn + '. ') + q.why}
```

`q.why` là chỗ dạy bài, không phải chỗ chấm điểm. Viết theo `lesson-voice` — giải thích *vì
sao*, và nếu sai thì nói rõ cái bẫy nằm ở đâu.

Dữ liệu quiz để trong `src/content/courses/<slug>/*.js`, không nhúng vào component.

## 2 · Chip bấm được — khi KHÔNG có đáp án đúng

Dùng cho câu hỏi mở, để người học tự bộc lộ giả định của mình rồi đối chiếu. Tham chiếu:
`Ch8` của bài 1 — "hiện nay máy làm được việc nào?".

```tsx
const [on, setOn] = useState<number[]>([]);

<button onClick={() => setOn(s => s.includes(i) ? s.filter(v => v !== i) : [...s, i])}
  style={{
    border: `1px solid ${active ? 'color-mix(in srgb, var(--green) 50%, transparent)' : 'var(--border)'}`,
    background: active ? 'color-mix(in srgb, var(--green) 9%, transparent)' : 'var(--panel-2)',
    color: active ? 'var(--green-soft)' : 'var(--muted)',
  }}>{t}</button>
```

Bắt buộc phải nói rõ là **không có đáp án**, không thì người học ngồi chờ chấm điểm:

> "bấm chọn việc bạn nghĩ máy làm được — không có đáp án, đây là chỗ để tự cãi với chính mình"

Rồi cho họ một mốc để đối chiếu — đó mới là phần dạy:

> "Trò vui: thử đoán hồi 2015 người ta trả lời thế nào, rồi so với câu trả lời của bạn hôm
> nay. Chỗ nào lệch, chỗ đó là ngành vừa tiến được một bước thật."

Loại này **không lưu** localStorage — nó là suy nghĩ nhất thời, lưu lại chẳng để làm gì.

## 3 · Panel đôi — đối chiếu hai cách viết

`CodeLab` của bài 3: pseudo-code bên trái, Python bên phải, cùng một thuật toán. Dùng khi
người học phải bắc cầu giữa hai biểu diễn (ký hiệu ↔ code, công thức ↔ số, lý thuyết ↔ cài đặt).

```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 14 }}>
  <div>
    <div style={{ fontFamily: MONO, fontSize: 10, color: '#5C6579', marginBottom: 8 }}>PSEUDO-CODE</div>
    <Code src={cur.pseudo} />
  </div>
  <div>
    <div style={{ fontFamily: MONO, fontSize: 10, color: '#5C6579', marginBottom: 8 }}>PYTHON — KHUNG LAB 1</div>
    <Code src={cur.py} />
  </div>
</div>
```

`minmax(min(340px,100%),1fr)` để trên mobile hai cột tự xếp chồng thay vì bóp lại còn 150px.

Code giữ dưới dạng nguồn nguyên văn trong data file. Render bằng `<pre><code>` với token
màu phân biệt keyword, string, number, key và comment; JSON cũng phải có màu cú pháp.
Tokenize/escape an toàn trước khi tạo span, giữ nội dung copy được. Không nhúng HTML chưa
escape hoặc thay regex vào markup đã highlight. Chọn highlighter phù hợp; dependency mới
được đánh giá và ghi ADR theo `CLAUDE.md`, không bị cấm chỉ vì repo chưa dùng.

Nhấn dòng/field quan trọng bằng nền/viền hoặc caption riêng để không lẫn với syntax;
kiểm tương phản hai theme và overflow cục bộ trên mobile. Tab phù hợp để đổi ngôn ngữ hoặc
use-case; quiz/chip/checklist vẫn cần nút trả lời hoặc thao tác đúng chức năng. Xem
`visual-storytelling.md` cho chi tiết màu và điểm nhấn.

## 4 · CheckList — tự kiểm cuối bài

Bài học nào cũng kết bằng khối này. Component đã có sẵn, chỉ cần truyền items:

```tsx
<CheckList storageKey="b4-checks" items={[
  'Đưa đề nào cũng viết được 5 thành phần của nó — thử ngay với Q1.',
  …
]} />
```

Viết item theo dạng **"làm được gì"**, không phải "biết gì". So sánh:

> ✗ "Hiểu về simulated annealing."
> ✓ "Giải thích cho người khác nghe được vì sao simulated annealing chấp nhận bước đi xuống."

7–8 item là vừa. Chúng nên phủ đúng những mục lớn của bài, theo thứ tự bài — người học tick
từ trên xuống là đi lại đúng đường vừa học.

`storageKey` theo quy ước `'<id>-checks'`, đi qua `useLocalList` chứ không gọi `localStorage`
thẳng. Xem `new-lesson/references/wiring.md`.

## Ghi điểm vào lộ trình

Quiz trong bài học có thể ghi điểm vào tiến độ để trang Lộ trình sinh báo cáo mạnh/yếu:

```ts
update((d) => {
  const r = d.sessions[sessionId] || (d.sessions[sessionId] = {});
  r.quizScore = score;                 // %
  r.quizRight = [...];                 // tên chủ đề đúng
  r.quizWrong = [...];                 // tên chủ đề sai
});
```

Đi qua `useProgress`, không chạm `localStorage`. Key `csc14003-progress` là hợp đồng với dữ
liệu người học — không đổi shape mà thiếu migration (`CLAUDE.md § Kiến trúc`).

Chi tiết cách điểm số nuôi lịch ôn và báo cáo: xem skill `gamification`.

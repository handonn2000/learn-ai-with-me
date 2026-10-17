# learn-ai-with-me v2 — Thiết kế

Bản viết lại từ đầu. Bản cũ (nhánh `main`) dạy bằng những trang dài 2–3 giờ, không nói rõ mục tiêu,
giả định người học đã biết trước và nhồi quá nhiều thứ lên một màn hình. Bản này đổi cả cách học lẫn giao diện.

## 1. Cách học

Mục này giữ **khung và giới hạn** (đồ thị kỹ năng, độ dài lesson, thang trợ giúp, điểm FSRS). Còn
**chọn phương pháp nào cho kỹ năng nào và vì sao** (đoán trước, ví dụ mẫu, cặp đối lập, tìm lỗi,
nhớ lại tự do, xen kẽ…) nằm ở skill `.claude/skills/learning-methods/`. Lên dàn ý một ga mới
hoặc thêm cơ chế học/ôn thì đọc skill đó trước.

### Đồ thị kỹ năng (backward chaining)

- **Nút = một kỹ năng làm được**, viết bằng động từ: "Chạy tay UCS và chỉ ra nút được lấy ra tiếp theo",
  không phải "UCS". Mỗi nút có 1–3 câu kiểm tra.
- **Cạnh = tiên quyết thật**: B cần A khi không hiểu A thì *không thể* làm B. Không nối vì "cùng chương".
- **Mục tiêu** là một nút đích. App lần ngược từ đích qua các cạnh tiên quyết, dừng ở những nút bạn đã nắm,
  rồi sắp xếp topo để ra lộ trình. Lộ trình là **gợi ý, không khóa**: người học mở được bất kỳ ga nào; ga thiếu
  tiên quyết chỉ hiện "nên qua ga … trước", và mở đầu lesson nhắc "Cần biết trước".
- **Kiểm tra xếp lớp** cũng chạy ngược: hỏi câu kiểm tra của đích; trả lời đúng thì coi như nắm cả nhánh
  dưới; sai thì hỏi tiếp các nút tiên quyết của nó.

### Lesson (học theo nhịp DataCamp)

Mỗi lesson dạy đúng **một nút**:

| Quy tắc | Giới hạn |
|---|---|
| Thời lượng | 8–12 phút |
| Phần giải thích | tối đa 3 bước, tổng ≤ 550 từ |
| Bài tập | 2–4, ngay sau phần giải thích |
| Kiến thức mới trong bài tập | **không có** — bài tập chỉ áp dụng điều vừa dạy hoặc nút tiên quyết |
| Câu trắc nghiệm | tối đa 1 mỗi lesson; ưu tiên bài "làm thật" (chạy tay thuật toán, điền số) |

Mở đầu lesson: **"Học xong bạn làm được"** (một câu, chính là kỹ năng của nút) và **"Cần biết trước"**
(các nút tiên quyết, mỗi nút một dòng, có trạng thái).
Kết thúc: đối chiếu lại mục tiêu và cho biết kết quả vào lịch ôn.

### Cách viết

1. Ý chính bằng lời thường → ví dụ cụ thể → rồi mới thuật ngữ và ký hiệu.
2. Thuật ngữ được định nghĩa ngay lần đầu xuất hiện. Một đoạn chỉ đưa thêm tối đa một khái niệm mới.
3. Câu ngắn. Không rào đón; chi tiết nâng cao để trong khối "Đào sâu" (thu gọn sẵn).
4. Xưng tôi/bạn, ví von khi nó giúp hiểu cơ chế — gia vị, không phải món chính.
5. Không giả định đã học buổi trước: cần gì thì nút tiên quyết lo, lesson chỉ nhắc một dòng.
6. Thuật ngữ AI: từ phổ biến giữ nguyên tiếng Anh ("agent", không "tác tử"); từ đã dịch thì kèm tiếng Anh
   trong ngoặc, `trạng thái (state)`, ít nhất ở lần đầu xuất hiện trong mỗi lesson. Bảng dưới đây là nguồn
   duy nhất; skill `lesson-voice` trỏ về đây.

### Thuật ngữ

"Lần đầu" tính trong chữ đoán trước, giải thích, đề và lời giải bài tập của lesson đó, theo thứ tự hiện ra.
Nhãn ngắn (tiêu đề kỹ năng/bước, tên nhóm và cột, "Học xong bạn làm được", câu ôn) dùng đúng chữ trong bảng
nhưng không bắt kèm ngoặc. Thuật ngữ mới chưa có ở đây thì thêm vào bảng trước, rồi mới dùng.

| Cách dùng | Thuật ngữ |
|---|---|
| **Giữ tiếng Anh**, không dịch | agent (chữ "agent" giữ nguyên cả trong cụm: agent khác, nhiều agent; cụm có chữ dịch như agent duy lý thì theo dòng dưới), percept, chuỗi percept (percept sequence), PEAS, softbot, frontier, explored, graph search / tree search, heuristic, admissible, tên thuật toán (BFS, UCS, GBFS, A\*, Dijkstra) |
| **Dịch + kèm tiếng Anh** lần đầu mỗi lesson | môi trường (environment), cảm biến (sensor), bộ chấp hành (actuator), hàm agent (agent function), chương trình agent (agent program), kiến trúc (architecture), thước đo hiệu năng (performance measure), agent duy lý (rational agent), toàn tri (omniscient), thu thập thông tin (information gathering), tự chủ (autonomy), môi trường tác vụ (task environment); bảy chiều môi trường: quan sát được đầy đủ / một phần (fully / partially observable), không quan sát được (unobservable), một / nhiều agent (single-agent / multi-agent), cạnh tranh / hợp tác (competitive / cooperative), tất định / ngẫu nhiên (deterministic / stochastic), từng hồi / tuần tự (episodic / sequential), tĩnh / nửa động / động (static / semidynamic / dynamic), rời rạc / liên tục (discrete / continuous), biết luật / chưa biết luật (known / unknown) |
| | trạng thái (state), trạng thái đầu (initial state), hành động (action), kết quả của hành động (transition model), kiểm tra đích (goal test), đích (goal), chi phí đường đi (path cost), không gian trạng thái (state space), trạng thái kế tiếp (successor), lời giải tối ưu (optimal solution), mở rộng (expand), nút cha (parent), cây tìm kiếm (search tree), chiến lược tìm kiếm (search strategy), hàng đợi (queue), hàng đợi ưu tiên (priority queue), khóa (key), tìm kiếm chi phí đều (uniform-cost search), tìm kiếm tham lam (greedy best-first search), đoán quá (overestimate), đoán hụt (underestimate), nhất quán (consistent) |
| **Từ thường**: kèm tiếng Anh ở lesson định nghĩa nó, sau đó thôi | học (learning; định nghĩa ở `rationality`), nút (node), cạnh (edge), đường đi (path), trừu tượng hóa (abstraction) |

### Thang trợ giúp và mức thành thạo

- Mỗi bài tập: **Gợi ý** (đi được nửa đường) → **Xem lời giải**.
- Kết quả lesson quy ra điểm FSRS cho nút, lấy mức tệ nhất trong các bài tập: tự làm đúng hết → *Good*;
  có dùng gợi ý hoặc sai từ 2 lần → *Hard*; xem lời giải → *Again*. Lịch ôn (ts-fsrs) tính **theo từng nút**.
- Xếp lớp: vượt câu kiểm tra → *Easy* (đánh dấu "Đã biết", vẫn vào lịch ôn).
- **Ôn hôm nay**: tối đa 5 câu, rút từ các nút đến hạn.

## 2. Giao diện

**Ý tưởng chủ đạo: tuyến đường.** Khóa học dạy tìm đường đi; người học cũng đang đi một con đường từ thứ
mình đã biết tới mục tiêu. Mọi thứ về tiến độ được vẽ bằng một ngôn ngữ duy nhất: **đường tuyến + các ga**.

- Trang mục tiêu = bản đồ ga vẽ tay hoặc danh sách ga (`ViewToggle` **Bản đồ | Danh sách**); khóa học cũng có
  hai cách xem như vậy.
- Màn học và kiểm tra không có thanh điều hướng; đầu màn là `SessionHeader` (nút đóng + thanh tiến độ + "n / N").
- Mỗi màn hình **một tiêu điểm**: một bước giải thích hoặc một bài tập. Nút chính luôn ở cùng một chỗ.

### Token và chữ

Giao diện theo **mẫu B** (`docs/design/HANDOFF.md`, màn tĩnh trong `docs/design/screens/` là spec chính xác).
Token khai trong `@theme` của `src/styles.css`; bảng giá trị và vai trò ở HANDOFF §1. Tóm tắt:

- Chỉ có **nền sáng**: `bg` nền trang, `surface` thẻ, `ink` chữ và viền 2px, `muted` chữ phụ, `paper` nền bản đồ
  và sổ tay.
- `violet` hành động chính, tiến độ, ga đã qua, frontier; `sun` hôm nay, đoán trước, ý chính.
- **Đúng = `correct` (xanh dương), sai = `wrong` (cam)** — an toàn cho mù màu; không dùng đỏ/xanh lá.
- `g` và `h` có màu riêng cho g(n), h(n) trong minh họa thuật toán.
- Chữ: **Bricolage Grotesque** cho tiêu đề, **Onest** cho thân bài, **JetBrains Mono** cho số và cấu trúc dữ liệu
  thật (hàng đợi, frontier, g/h/f), **Playpen Sans** cho chữ viết tay trên sketch và bản đồ. Thân bài 17px.
- Chuyển động: chỉ khi trả lời hành động của người học (chuyển bước, mở rộng nút, đúng/sai) và trong minh họa
  thuật toán; opacity và dịch chuyển ngắn ≤ 200ms. Tôn trọng `prefers-reduced-motion`
  (`MotionConfig reducedMotion="user"`).

## 3. Kỹ thuật

| Việc | Chọn |
|---|---|
| Nền | Vite + React 19 + TypeScript |
| Deploy | Firebase Hosting (`learn-ai-with-me.web.app`, chạy tay `npm run deploy:firebase`, build với `--base=/`, `firebase.json` bỏ `materials/**`); GitHub Pages khi push `main` (base `/learn-ai-with-me/`). Xem ADR-0019 |
| Giao diện | Tailwind CSS v4, icon lucide-react |
| Animation | Motion |
| Bản đồ mục tiêu, bản đồ khóa | SVG tự vẽ + rough.js cho nét vẽ tay (`ui/SketchMap`, `ui/roughArt`); toạ độ đặt tay trong `content/goalMaps.ts` và `content/courses.ts`. |
| Đồ thị bài toán | SVG tự vẽ + Motion (`widgets/GraphView`): cần điều khiển từng nút, màu trạng thái và cỡ chữ trên mobile |
| Công thức | KaTeX |
| Nội dung | MDX cho phần giải thích, TypeScript cho bài tập và đồ thị kỹ năng |
| Tiến độ | Zustand (persist localStorage, key `learn-ai-v2` version 2: `skills`, `lessonStep`, `follow`, `guesses`; `migrateProgress` nâng từ bản 1) + ts-fsrs, tắt bước học ngắn hạn: thẻ mới Again → 1 ngày, Hard → 2, Good → 3, Easy → 8 |
| Tài khoản, đồng bộ | Firebase Auth (GitHub) + Firestore, document `users/{uid}` = `{ version, progress, updatedAt }` (`version` = version của persist; `parseCloud` đọc được cả bản 1, chưa có `guesses`), luật `firestore.rules`. Không bắt buộc đăng nhập: localStorage vẫn là nơi lưu chính; đăng nhập thì gộp máy ↔ mây (`learning/sync.ts`, theo `last_review` từng thẻ) rồi ghi sau 2 giây yên. Đăng xuất xóa tiến độ trong máy. Firebase tải lười (`learning/cloud.ts`). Xem ADR-0020 |
| Định tuyến | React Router, hash router — host tĩnh không cần trang 404 giả hay rewrite |
| Kiểm thử | Vitest — engine thuật toán, đồ thị kỹ năng, chấm bài |

Thêm khi có bài cần: D3 (biểu đồ), React Three Fiber (3D), Shiki (code).

### Cấu trúc

```
src/
  app/            router (main.tsx), các trang (Home + CourseSection, Course, Goal, Lesson, Session, Review,
                  Placement, Notebook); app/lesson/ các bước buổi học; app/goal/ bản đồ + danh sách ga
  ui/             component dùng chung theo mẫu B (Button, SessionHeader, AnswerTile, FeedbackBar,
                  HintLadder, SketchMap…), xem /#/dev/ui
  learning/       đồ thị kỹ năng, backward chaining, mục tiêu, tuyến, store tiến độ + FSRS, kế hoạch buổi học,
                  tài khoản + đồng bộ Firestore (account.ts, cloud.ts, sync.ts)
  exercises/      các dạng bài tập + bộ chấm
  algorithms/     engine tìm kiếm sinh trace (BFS, UCS, GBFS, A*)
  widgets/        minh họa nhúng được vào MDX (GraphView, SearchPlayer, DataTable, PeasCards, AgentLoop…)
  content/
    graphs.ts     bài toán mẫu (đồ thị, chi phí, heuristic)
    skills.ts     các nút kỹ năng + cạnh tiên quyết + câu kiểm tra, và `goals`; skillsAgents.ts cho tuyến PEAS
    courses.ts    khóa học, mục tiêu trong khóa, toạ độ bản đồ khóa
    goalMaps.ts   toạ độ bản đồ mục tiêu
    recall.ts     câu nhớ lại cho ôn tập
    lessons/<id>/ index.ts (meta + bài tập) và các bước giải thích *.mdx (tải lười)
    mock/         dữ liệu mẫu cho phần chưa có nội dung thật
```

## 4. Thêm một kỹ năng / lesson

1. Thêm nút vào `content/skills.ts`: `can` bắt đầu bằng động từ, `prereqs` là tiên quyết thật, 1–3 `checks`.
2. Tạo `content/lessons/<id>/`: `1.mdx`… cho phần giải thích, `index.ts` khai báo các bước và bài tập.
   Trong MDX, dấu `{ }` trong văn bản phải viết `\{ \}`.
3. Đăng ký trong `content/lessons/index.ts`, trỏ `lesson` của kỹ năng về id đó.
4. `npm test` kiểm: đồ thị không chu trình, lesson trên tuyến đủ bài, ≤ 550 từ, 2–4 bài tập,
   ≤ 1 trắc nghiệm, đáp án hợp lệ, không có `{ }` trần trong MDX, bước đoán quan hệ (nếu có) hợp lệ.
5. Bài tập dùng bản đồ: đáp án trace được engine tính, không gõ tay. Ví dụ mới thì viết test cho kết quả
   mong đợi trong `algorithms/search.test.ts`.
6. MDX không bật GFM: bảng markdown không hiện. Bảng dùng `widgets/DataTable`. Khối mã giả (```) đã có style.

`content/` không import UI ngoài các widget được nhúng vào MDX. Engine thuật toán thuần, có test.

### Thêm một mục tiêu

Hiện có hai mục tiêu thật: `peas` (Mô tả một agent thông minh, buổi 2, kỹ năng ở `content/skillsAgents.ts`)
và `astar` (Hiểu A*, buổi 3–5).

1. Thêm `Goal` vào `goals` trong `content/skills.ts`. Thứ tự trong mảng là thứ tự gợi ý cho người chưa học gì.
2. Đặt `goalId` cho mục tiêu tương ứng trong `content/courses.ts`: số ga và số sketch khi đó lấy từ tuyến thật.
3. Mỗi ga nên có `short` (nhãn ô "Sketch cả tuyến") và tên sketch trong `content/mock/sketches.ts`.
4. Bản đồ mục tiêu (`content/goalMaps.ts`) là tùy chọn; thiếu thì trang mục tiêu chỉ có Danh sách.
   `GoalMap` hiện còn gắn với A* (ga phụ GBFS), muốn vẽ bản đồ cho mục tiêu khác phải tổng quát nó trước.

Mục tiêu đang theo (`pickFollowed` trong `learning/goals.ts`): mục tiêu của ga người học vào gần nhất
(`follow` trong store, ghi khi mở một lesson) nếu chưa xong; không có thì mục tiêu chưa xong đầu tiên đã có
tiến độ, rồi mục tiêu chưa xong đầu tiên. Ôn tập không đổi mục tiêu đang theo. Màn Hôm nay (gồm cả phần khóa học), Sổ tay
và buổi học đều dùng mục tiêu này; màn của một lesson dùng mục tiêu chứa ga đó (`goalOf`).

Buổi học hôm nay lấy bước đoán trước từ lesson của ga sau và bước giấy từ lesson của ga hôm nay; ga hôm nay
không có bước `paper` mà có `reorganize` thì bước giấy là hệ thống lại. Ga thiếu thì bỏ bước đó; riêng tuyến A*
còn dùng dữ liệu mẫu ga UCS (`content/mock/session.ts`).

**Đoán quan hệ** (`kind: 'relate'`, `RelateStep`): biến thể của đoán trước cho ga loại khái niệm. Người học nối
3–5 cặp ý đã gặp bằng ba quan hệ cố định (dẫn tới · là ví dụ của · không phải), chọn độ chắc chắn, thấy phản hồi
ngay. Lần chốt đầu tiên được lưu vào `guesses[lessonId]` và không bị ghi đè. Đã có bản đoán thì: đầu lesson hiện
lại bản đó thay vì hỏi lại, buổi học bỏ bước "đoán trước cho ga sau", và bước hệ thống lại hiện các cặp (chỉ đánh
dấu cặp cần sửa, không hiện đáp án) để người học nối lại trên giấy. Không tính vào FSRS. Mỗi lesson tối đa một bước
`relate`; `npm test` kiểm số cặp, id, và đáp án không cùng một quan hệ.

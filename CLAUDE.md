# CLAUDE.md — learn-ai-with-me (v2)

App tự học AI, tổ chức kiến thức thành **đồ thị kỹ năng**: chọn một mục tiêu, app lần ngược qua các kỹ năng
tiên quyết để ra tuyến học; mỗi ga là một lesson ~10 phút (giải thích ngắn + 2–4 bài tập), ôn bằng FSRS theo
từng kỹ năng. Nhánh `v2` viết lại từ đầu và sẽ thay hẳn v1 (nhánh `main`).

Đọc trước khi sửa:

- `docs/DESIGN.md` — cách học, giới hạn lesson, kỹ thuật, cách thêm kỹ năng/lesson/mục tiêu.
- `docs/design/HANDOFF.md` + `docs/design/screens/` — giao diện mẫu B; màn HTML là spec chính xác, token ở §1.
- `docs/courses/<khóa>/` — bản đồ bài giảng gốc, dàn ý lesson (`lesson-design/`), review (`reviews/`).
- `.claude/progress.md` — làm được gì, còn dở gì. **Cập nhật sau mỗi phiên.**

## Lệnh

- `npm ci` — lần đầu trên máy, hoặc sau khi `package-lock.json` đổi
- `npm run dev` — dev server (`http://localhost:5173/learn-ai-with-me/`; preview pane gán cổng qua `PORT`)
- `npm test` — Vitest: engine thuật toán, đồ thị kỹ năng, luật nội dung lesson
- `npm run build` — `tsc -b` + vite build (base `/learn-ai-with-me/` cho GitHub Pages)
- `npm run emulators` + `npm run dev:cloud` — thử đăng nhập/đồng bộ với emulator Auth + Firestore (cần Java)
- `npm run deploy:firebase` — test + build `--base=/` + `firebase deploy --only hosting,firestore:rules` lên
  `https://learn-ai-with-me.web.app` (project `learn-ai-with-me` trong `.firebaserc`). Chỉ chạy khi user bảo deploy.
- **`npm test` và `npm run build` phải qua trước khi kết thúc phiên.**

## Skill và agent cho v2

- **`learning-methods`** — kỹ năng loại nào thì dạy/luyện/ôn bằng phương pháp nào, vì sao, ứng với thành phần
  nào (`GuessStep`, bài tập, giấy, nhớ lại, FSRS). Đọc **trước** khi lên dàn ý ga mới, thêm dạng bài tập/câu ôn,
  hoặc thêm cơ chế học/ôn/động lực.
- **`lesson-voice`** — giọng tôi/bạn. Dùng cho chữ hiển thị cho người học; khi mâu thuẫn thì `docs/DESIGN.md`
  §1 "Cách viết" thắng (câu ngắn, ví von là gia vị, một đoạn tối đa một khái niệm mới).
- **`lesson-quality-judge`** (agent) — review độc lập sau khi dựng/sửa lớn một lesson: đúng/sai, coverage so
  với slide, và mục "Learning-method fit" cho lesson v2. Chỉ đọc, báo cáo.
- **`lesson-coverage-judge`** (agent) — chỉ kiểm coverage so với slide gốc.

Sửa skill/agent xong thì đọc `.claude/evals/README.md` và kiểm đúng phạm vi thay đổi. Ưu tiên ca hành vi nhỏ
(vd. `methods-admissible-outline` trong `cases.json`); `run.py` gọi CLI agent có chi phí thật, đừng chạy ca
dựng bài nặng chỉ để kiểm một sửa đổi hướng dẫn hẹp. Báo rõ kiểm nào đã chạy và giới hạn của nó.

### Di sản v1 trong `.claude/` — đừng lấy làm căn cứ cho v2

Các phần sau mô tả v1 (React 18, CSS token không Tailwind, `src/features/lessons`, `ProgressDB`, song ngữ).
Giữ để tham khảo cho tới khi v2 thay `main`; không sửa, không làm theo khi làm v2:

- skill `new-lesson`, `gamification`, phần ràng buộc kỹ thuật của `lesson-interactive` (nguyên tắc chọn hình
  thức minh họa vẫn dùng được); agent `i18n-fidelity-judge`
- `.claude/specs/`, `.claude/design/`, `.claude/commands/`, `.claude/scripts/` (`check_i18n.py`, `i18n_loop.py`),
  `.claude/i18n/`
- `.claude/decisions/ADR-0001…0018` — bản ghi lịch sử của v1 (ADR-0002 "không Tailwind" không áp cho v2)
- routine nhắc ôn `trig_019TD3rVMi6GgrtvFtwvzdCQ` (ADR-0009) đọc đường dẫn nội dung v1; khi v2 thay `main` thì
  phải vá prompt của nó

## Kiến trúc

```
src/
  app/         trang + router (hash router, main.tsx); app/lesson/ các bước của buổi học
  ui/          component dùng chung (Button, StepFrame, FeedbackBar, HintLadder…), xem /dev/ui
  widgets/     minh họa nhúng được vào MDX (GraphView, SearchPlayer, DataTable, PeasCards…)
  learning/    đồ thị kỹ năng, backward chaining, mục tiêu, tuyến, store tiến độ + FSRS, kế hoạch buổi học
  exercises/   các dạng bài tập + bộ chấm
  algorithms/  engine tìm kiếm thuần (BFS, UCS, GBFS, A*) sinh trace, có test
  content/     skills*.ts (nút + tiên quyết + checks), courses.ts, goalMaps.ts, graphs.ts, recall.ts,
               lessons/<id>/ (index.ts + *.mdx tải lười), mock/ (dữ liệu mẫu, ghi rõ là mẫu)
```

- **Nội dung là data.** Kỹ năng, lesson, bài tập, câu ôn nằm trong `src/content/`; UI đọc từ đó. Không hardcode
  nội dung khóa trong component. `content/` không import UI ngoài widget nhúng trong MDX.
- **Tiến độ**: Zustand `persist`, key **`learn-ai-v2`** (`skills`, `lessonStep`, `follow`), `version` trong
  `learning/progress.ts`. Key và shape là hợp đồng với dữ liệu người học: đổi shape thì tăng `version` + viết
  `migrate`. Đọc/ghi qua `useProgress`, không gọi `localStorage` trực tiếp. v1 dùng key khác
  (`csc14003-progress`), hai bản không đụng nhau.
- **Đồng bộ mây** (không bắt buộc): đăng nhập GitHub qua Firebase Auth; `learning/sync.ts` (thuần, có test) gộp
  máy ↔ mây, `learning/cloud.ts` (tải lười, chỉ `account.ts` import động) ghi `users/{uid}` trên Firestore.
  Document mang `version` = version của persist: đổi shape store thì sửa cả `parseCloud`. Luật ở `firestore.rules`.
- **Lịch ôn**: ts-fsrs một thẻ cho mỗi kỹ năng, tắt bước ngắn hạn, không fuzz. Quy kết quả lesson ra điểm theo
  `outcomeToRating`/`worstOutcome`. Lý do sư phạm: skill `learning-methods`.
- **Đáp án bài tập trên bản đồ do engine tính**, không gõ tay; ví dụ mới thì thêm test vào
  `algorithms/search.test.ts`.
- **Định tuyến**: `createHashRouter`, `base: '/learn-ai-with-me/'`, deploy GitHub Pages (`.github/workflows/deploy.yml`).
  Firebase Hosting build với `--base=/`; `firebase.json` bỏ `materials/**` vì `vite build` chép cả
  `public/materials/` (gitignore) vào `dist/` — đừng gỡ dòng ignore đó (ADR-0019).

## Quy ước

- TypeScript strict; alias `@/` → `src/`. Test cạnh file (`*.test.ts`).
- **Giao diện theo màn thiết kế**: đọc `docs/design/HANDOFF.md` trước khi sửa UI. Màn trong `docs/design/screens/`
  và code lệch nhau thì theo màn; màn thiết kế và quy tắc học trong `docs/DESIGN.md` §1 lệch nhau thì hỏi user.
- **Logic học** (`src/learning`, `src/exercises/grade.ts`, `src/algorithms`): không đổi nếu không cần; thêm
  hoặc đổi thì kèm test.
- **Style**: Tailwind CSS v4. Token mẫu B khai trong `@theme` của `src/styles.css` (nguồn: HANDOFF §1); màu luôn
  qua token (`bg-surface`, `text-muted`, `text-correct-ink`…), không hex rời trong component. Chỉ có nền sáng
  (variant `dark` giữ để code cũ biên dịch, không có gì bật nó). Đúng = xanh dương, sai = cam; không dùng đỏ/xanh
  lá cho đúng/sai.
- **Lesson** (chi tiết `docs/DESIGN.md` §1, §4): 8–12 phút, ≤ 3 bước giải thích ≤ 550 từ, 2–4 bài tập, ≤ 1 trắc
  nghiệm, bài tập không dạy kiến thức mới; mở đầu "Học xong bạn làm được" + "Cần biết trước". `npm test` kiểm các
  giới hạn này.
- **MDX**: không bật GFM (bảng markdown không hiện → dùng `widgets/DataTable`); `{ }` trong văn bản viết `\{ \}`.
- **Giọng**: xưng tôi/bạn; ý chính bằng lời thường → ví dụ cụ thể → thuật ngữ; định nghĩa thuật ngữ ngay lần đầu.
  Nhãn UI chức năng (nút, tooltip, tiêu đề cột) giữ ngắn, không tán gẫu. Không trích nguồn trong nội dung bài.
- **Chính xác kiến thức**: đổi giọng được, đổi số liệu/định nghĩa/kết luận thì không. Mỗi lesson mới hoặc sửa lớn
  chạy `lesson-quality-judge` trước khi bàn giao; lưu report ở `docs/courses/<khóa>/reviews/`.
- **Chuyển động**: Motion, chỉ khi trả lời hành động người học hoặc trong minh họa thuật toán; `MotionConfig
  reducedMotion="user"` đã bật ở gốc.
- Mobile-first: hit target ≥ 44px, không cuộn ngang ở 375px.
- Component dùng ≥ 2 nơi thì vào `ui/` (hoặc `widgets/` nếu là minh họa); còn lại để cạnh trang dùng nó.

## Giữ tài liệu khớp code

Tài liệu lệch code còn tệ hơn không có: phiên sau tin vào nó rồi làm sai. Sửa code xong, soát bảng này ngay
trong phiên:

| Vừa đụng vào | Cập nhật |
|---|---|
| bất kỳ phiên nào | `.claude/progress.md` |
| luật lesson, cấu trúc thư mục, cách thêm kỹ năng/lesson/mục tiêu, lựa chọn kỹ thuật | `docs/DESIGN.md` |
| token, màn giao diện | `src/styles.css` `@theme` + `docs/design/HANDOFF.md` |
| shape store `learn-ai-v2` | `version` + `migrate` trong `learning/progress.ts`, mục Kiến trúc ở trên, `docs/DESIGN.md` §3 |
| dàn ý / nội dung một ga | `docs/courses/<khóa>/lesson-design/` |
| phương pháp dạy, dạng bài tập, cơ chế ôn | skill `learning-methods` |
| tiêu chí review lesson | `.claude/agents/lesson-quality-judge.md` |
| thêm dependency hoặc đổi quyết định kỹ thuật | `docs/DESIGN.md` §3 + ADR **mới** trong `.claude/decisions/` (tiếp số từ ADR-0019) |

ADR là bản ghi lịch sử: đổi ý thì viết ADR mới thay thế, đừng sửa ADR cũ. Spec/DESIGN mô tả **hiện trạng**,
không phải nhật ký.

## Điều cấm

- Làm trên nhánh `v2` ở checkout chính (không dùng worktree), đẩy lên `origin/v2`. Không đụng nhánh `main`:
  push lên `main` chạy deploy GitHub Pages.
- Không đổi/di chuyển `public/materials/` (bị gitignore: slide/bài tập gốc của trường, không đẩy lên repo
  public; link trong nội dung trỏ vào đó). Không chép nguyên văn slide vào repo.
- Không đổi key `learn-ai-v2` hay shape store mà thiếu migration.
- Không dùng `as` để ép kiểu dữ liệu nội dung — dùng annotation để `tsc` bắt lỗi thật.
- Dependency mới: chỉ khi lợi ích xứng với bundle, mobile, bảo trì, license; ghi ADR. v2 chưa song ngữ; thêm
  i18n là một quyết định mới cần ADR, không kế thừa ADR-0010 của v1.

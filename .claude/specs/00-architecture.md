# Spec — Kiến trúc tổng

## Goal
App học tập data-driven, mở rộng được thành blog/portfolio nhiều khóa mà không sửa UI core.

## User story
Là người tự học, tôi mở app, thấy hôm nay cần làm gì, học bài tương tác, làm quiz, và tiến độ/lịch ôn tự cập nhật — dữ liệu nằm ở máy tôi.

## Cấu trúc tầng
1. **content/** — dữ liệu thuần (types + courses[] + `ui/` là chữ của KHUNG app). Không import React.
   Mỗi thứ có chữ đều tồn tại theo cặp `*.vi` / `*.en` + một selector đã gõ kiểu — xem mục **Locale**.
2. **lib/** — logic thuần + hooks nhỏ (storage, spaced-repetition, theme, locale, i18n). Không import component.
   **Và không chứa chữ hiển thị**: `quizTip()` trả về MỨC (`'low' | 'mid' | …`), chữ nằm ở `content/ui/*`.
   Nguyên tắc chung: *lib và engine trả về KHÓA, tầng UI sở hữu CHỮ* — xem ADR-0012.
   Áp cho `quizTip()`, cho `search-engine.js` (`N.nX(...)` từ `narrate.*`) và cho
   `vacuum-world.js` (`noteKey` thay câu). Nhờ vậy hai ngôn ngữ dùng CHUNG một engine.
3. **components/** — UI dùng chung không gắn nghiệp vụ (Reveal, CanvasScene, Html, SectionHead, LessonNav, CheckList, MathPrimer, AppHeader, SessionQuiz, LessonDeck, Kicker).
   `LessonDeck` cho trang bài học hai chế độ xem — cuộn (mặc định) và trình chiếu trượt trái phải
   (hero là slide bìa, `SLIDES` = 1 mục bìa + `NAV`);
   xem ADR-0006. Mỗi bài khai báo một hằng `NAV` duy nhất, dùng chung cho thanh điều hướng lẫn danh
   sách slide, nên hai thứ không lệch nhau được.
4. **features/** — mỗi màn hình một folder: roadmap, tests, lessons/b1…b6, search-lab.
   `search-lab/` giữ thứ DÙNG CHUNG giữa Buổi 4 và Buổi 5: `search-engine.js`, `SearchLab`,
   `CodeLab`, `AlgoCard`, `scenes.ts` và bundle chữ `lab.text.*` (ADR-0018). Hai component lab
   nhận prop `only?: string[]` để mỗi buổi chỉ hiện nhóm thuật toán của mình.
5. **pages/** — trang mỏng (landing, courses, blog, 404).

## Type nội dung (content/types.ts)
`Course` bắt buộc có `description` — giới thiệu khóa, và là nơi DUY NHẤT được ghi nguồn tham khảo.
`Part` bắt buộc có `id` — khóa ổn định để lưu điểm; không dùng chỉ số vì chỉ số đổi nghĩa khi sắp xếp lại phần.

## Tài liệu & công cụ trong .claude/
- `skills/` — `new-lesson`, `lesson-voice`, `lesson-interactive`, `gamification`. Gọi skill trước khi làm tay.
- `agents/` — `lesson-quality-judge` (review mặc định sau dựng bài: correctness độc lập,
  coverage đầy đủ theo phạm vi user, code/visual, cải thiện có nguồn; chỉ đọc và báo cáo).
  · `lesson-coverage-judge` (review coverage-only; chỉ đọc VI, không đọc `*.en.*`).
  · `i18n-fidelity-judge` (đối chiếu toàn bộ EN với VI; quản lý verdict cho cổng judged).
  Quality judge không tự ghi/đóng i18n verdict và không thay fidelity judge.
  `commands/review-lesson.md` mô tả invocation; report do caller lưu dưới
  `docs/courses/<slug>/reviews/`. `evals/lesson-quality-judge/` có ba behavioral fixtures.
- `scripts/` — `check_i18n.py` (kiểm giá trị song ngữ + `--snapshot` / `--extraction-audit`)
  · `i18n_loop.py` (bảng trạng thái các cổng, exit 0 khi unit đóng được). `check_lesson.py` vẫn
  nằm trong `skills/new-lesson/scripts/` vì `evals/run.py` hardcode đường dẫn đó.
- `i18n/` — `acceptance.json` (hợp đồng từng unit), `baseline/` (mốc chuỗi trước khi tách),
  `judged/` (phán quyết + `pairs_hash`), `status.json`.
- `evals/` — chấm chất lượng skill: `run.py` chạy case qua `claude -p` trong bản sao repo, `grade.py` chấm + `--compare` hai lần chạy.
- `specs/`, `decisions/` (ADR), `design/`, `commands/`, `progress.md`.
- **Thư mục này bị gitignore** — repo public không chứa `.claude/`. Nó chỉ sống ở máy, nên đừng trỏ link từ README hay từ nội dung app vào đây.

## Base path (app sống ở subpath)
Bản deploy nằm ở `https://handonn2000.github.io/learn-ai-with-me/`, không phải gốc domain. Vì vậy
`vite.config.ts` khai `base: '/learn-ai-with-me/'`, `main.tsx` truyền
`basename={import.meta.env.BASE_URL}` cho `BrowserRouter`.

**Không viết đường dẫn tuyệt đối bắt đầu bằng `/`.** Route nội bộ dùng `<Link to="/...">` —
Router tự cộng basename. Asset tĩnh và thẻ `<a>` thô (kể cả thẻ nằm trong chuỗi HTML truyền cho
`<Html>` / prop `lead`) phải tự cộng `import.meta.env.BASE_URL`. Xem ADR-0007.

## Locale (song ngữ VI/EN)
Ngôn ngữ nằm trong **basename** của Router, không nằm trong bảng route. VI ở gốc trần, EN ở
gốc + `en`. Xem ADR-0010.

`src/lib/locale.ts` chốt `LOCALE` **ở module scope, trước khi React mount** — không context,
không hook, không state. Đó là điểm mấu chốt: nhờ nó `const NAV` / `SLIDES` ở đầu file bài học,
`ctx.fillText` trong scenes, và `search-engine.js` đọc đúng chữ ngay lúc import.

Hệ quả phải nhớ:
- **KHÔNG có route `/en/*`.** Thấy `<Route path="/en…">` là sai — `check_i18n.py` chặn.
- **Không sửa `<Link to>`** — Router tự cộng tiền tố. `lessonPath`, `backTo` giữ chuỗi trần.
- Thẻ `<a>` thô và link nội bộ trong chuỗi HTML dùng `localeBase`, **không** dùng `BASE_URL`.
  Riêng link `/materials/` vẫn dùng `BASE_URL`: PDF là asset chung, không theo ngôn ngữ.
- Đổi ngôn ngữ là **tải lại trang**, giữ pathname + query + hash.
- `LangToggle` nằm sẵn trong `LessonNav` và `AppHeader` — trang bài học không phải truyền vào.

Quy ước file: `<tên>.text.vi.ts` (nguồn sự thật) · `<tên>.text.en.ts` (`satisfies typeof VI`) ·
`<tên>.text.ts` (selector `const T: typeof VI = …`). Đặt **phẳng cùng cấp**, không cho vào thư
mục con — `check_lesson.py` duyệt folder không đệ quy. Data `.js` thì có `<tên>.en.js` + một
selector `.locale.ts` đã gõ kiểu.

**Hai cái bẫy của mẫu selector — đọc trước khi viết cái mới:**

1. `const M: typeof VI` chỉ an toàn khi export là **mảng / object** (trường bên trong tự nới
   thành `string`). Export là **chuỗi ở cấp cao nhất** (`export const HELPER_PY = \`…\``) thì TS
   giữ kiểu NGUYÊN VĂN, và bản EN không đời nào gán được. Dùng `Widen<typeof VI>` từ
   `lib/i18n.ts`. `Parity` cũng phải so KHÓA (`[keyof A] extends [keyof B]`), không so cả kiểu.
2. File `.js` **không được `tsc` kiểm** (`checkJs: false`). Nên một biến cục bộ trùng tên với
   biến import — `search-engine.js` có `const N = m.length` trùng đúng tên import lời kể — sẽ
   qua được `npm run build` và chỉ nổ lúc chạy. Import vào file `.js`/`.scenes.ts` thì **đặt bí
   danh** (`import { T as TXT }`, `import { N as MSG }`), và `check_i18n.py` có kiểm che tên.

**Cách kiểm bản dịch thiếu:** `tsc` sở hữu CẤU TRÚC (thiếu/thừa khóa, arity, chữ ký hàm — kể cả
với file `.js` chưa gõ kiểu, qua module selector có annotation). `check_i18n.py` sở hữu GIÁ TRỊ
(dịch chưa, thẻ HTML, số liệu, anchor, code mẫu). Đừng chép việc của bên này sang bên kia.
Dùng **annotation, không dùng `as`** — cast thì bịt lỗi.

## Routing (App.tsx)
- Lazy-load mọi page (React.lazy + Suspense) → bundle đầu nhỏ, canvas/KaTeX chỉ tải khi vào trang cần.
- Bài học CSC14003 (b1–b6) là route full-bleed KHÔNG có AppHeader (có LessonNav riêng); các trang còn lại bọc AppHeader.
- ScrollToTop khi đổi pathname.

## Dòng dữ liệu tiến độ
useProgress() → loadProgress() đọc localStorage → component render từ db → mọi thay đổi qua update(mutate) (đọc bản mới nhất → sửa → save → setState). Đồng bộ đa tab/trang qua focus + visibilitychange + storage event.

## Shape localStorage `csc14003-progress`
```ts
{ schema?: number,                   // mốc lược đồ; vắng mặt = trước đợt đánh số lại (ADR-0018)
  sessions: { [id: 'b1'..'b13']: {
    status?: 'todo'|'doing'|'done', completedAt?: ISO,
    reviewsDone?: number[],            // index mốc ôn đã tick
    quizScore?: number, quizRight?: TopicId[], quizWrong?: TopicId[] } },  // ghi bởi <SessionQuiz>
  partTests?: { [Part.id]: { score, correct, total, right[], wrong[], at } } }
```
Key phụ: `b1-checks`, `b2-checks`, `b3-problem-checks`, `b4-uninformed-checks`,
`b5-informed-checks`, `b6-checks` (number[] index ô tự kiểm), `lam-theme` ('dark'|'light'),
`lam-locale` ('vi'|'en' — CHỈ `switchTo()` và `?lang=` ghi khóa này, dò tìm không bao giờ ghi),
`lam-lesson-view` ('scroll'|'deck' — chế độ xem bài học, KHÔNG phải tiến độ nên không nằm trong ProgressDB).

Ba trường `quiz*` do **`src/components/SessionQuiz.tsx`** ghi — đó là chỗ DUY NHẤT ghi chúng, câu hỏi lấy từ
`content/courses/csc14003/session-quizzes.js` (khóa theo id buổi). `quizRight`/`quizWrong` chứa **chủ đề trong
buổi** ("PEAS", "Bảy chiều môi trường"), khác `partTests` vốn chứa **tên buổi** vì nó trải nhiều buổi.
`RoadmapPage` đọc lại ba trường này để dựng báo cáo mạnh/yếu và ô thống kê QUIZ TB.

partTests từng dùng chỉ số phần (1|2|3). Chỉ số không ổn định khi sắp xếp lại phần → nay khóa bằng `Part.id`;
`storage.ts` có migration một chiều 1→searching, 2→knowledge, 3→ml cho dữ liệu cũ.

Migration thứ hai, `RENUMBER_2026_09` (ADR-0018): Buổi 3 tách ba nên mọi buổi từ 4 trở đi dời lên hai
(`b4`→`b6` … `b11`→`b13`), áp cho cả khóa `sessions` lẫn topic trong `partTests`. **Khác mọi migration
khác trong file: nó KHÔNG chạy-lại-được** — `b4→b6` lần hai thành `b8` — nên bị khóa sau trường mốc
`schema` (SCHEMA = 1). Chạy SAU `mapTopics` để nhãn `'Buổi 7'` kịp thành `b7` rồi mới dời thành `b9`,
và dời ngược từ cuối để không đè lên khóa chưa dời. Đừng gỡ mốc `schema`.

## Acceptance criteria
- `npm run build` sạch (tsc strict + vite).
- Người dùng từng dùng bản HTML cũ mở app: tiến độ/điểm quiz cũ hiện đúng.
- Mọi trang hoạt động khi offline sau lần tải đầu (không fetch runtime ngoài fonts/KaTeX css đã bundle).

## Quy ước layout trang bài học

Một mục = `<div className="lesson-section">`, biến thể `--first` (ngay sau hero, padding-top 30) và
`--last` (padding-bottom 90). Trước đây mỗi file bài học tự khai một hằng `wrap` giống hệt nhau; giờ
là class trong `global.css`, nhờ vậy chế độ trình chiếu chỉnh lại được bằng CSS (`.deck-slide >
.lesson-section`) mà không phải truyền prop xuống từng mục.

`padding-top: 78px` là để thanh `LessonNav` dính không che tiêu đề khi nhảy anchor — đừng giảm ở chế
độ cuộn.

`LessonNav` có **hai hàng cố định**: hàng 1 là danh tính bài (back · badge · tên · chỗ cắm
`right`, hiện là `DeckToggle`), hàng 2 là mục lục cuộn ngang ở mọi bề rộng. Nhét chung một
`flex-wrap` thì mục lục chiếm trọn dòng rồi đẩy nút xuống dòng dưới — đó là lỗi đã sửa, đừng gộp lại.

## Course baseline và tiến độ nhiều khóa (2026-09-07)

`Course` có các trường tùy chọn `roadmapOnly`, `hasPartTests`, `baseline` (audience,
prerequisites, outcomes, pace, scope, tools, completion). `Session` thêm `outcome`,
`practice`, `prerequisiteIds`. Khóa DEF dùng `structure.ts` chứa ID/thứ tự/phụ thuộc,
`curriculum.vi.ts` + `curriculum.en.ts` chứa chữ, `curriculum.ts` ghép thành Course.
Baseline là kế hoạch; không tạo lessonPath hay link giả cho nội dung chưa có.

`useProgress(slug)` → `loadProgress(store, slug)` / `saveProgress(db, store, slug)`.
Mặc định slug vẫn là `csc14003` để các bài học AI hiện có hoạt động nguyên trạng.
Key của khóa mới là `<slug>-progress`; migration phần và topic cũ chỉ chạy cho CSC14003.
Mỗi lần đọc dữ liệu trống trả object mới. State hook gắn với slug để đổi route không
hiện tạm tiến độ của khóa trước. VI/EN dùng chung slug và tiến độ.

`PartTestPage` hiện chỉ có ngân hàng CSC14003; vừa kiểm `hasPartTests`, vừa kiểm slug.
Một cờ true không đủ để mở đề cho khóa khác. SessionQuiz nhận tùy chọn `courseSlug`, `questions`, `labelTopic`; mặc định vẫn dùng ngân hàng
CSC14003. Khóa khác không truyền questions thì không mượn nhầm câu hỏi AI. Điểm đi qua
`useProgress(courseSlug)`. `Course.topicLabels` cung cấp nhãn topic của khóa cho báo cáo roadmap;
DEF b7 dùng key checklist `data-engineering-foundation-b7-checks`.
`SeoLinks` đặt document.title theo course hiện tại. Xem ADR-0013 và
`docs/courses/data-engineering-foundation/` cho kế hoạch nội dung và phân tích nguồn.


## DEF Week 7 lesson (2026-09-08)

Route lazy `/courses/data-engineering-foundation/lessons/b7` trỏ tới
`features/lessons/def/b7/Lesson07Ingestion.tsx`, full-bleed, 16 presentation slides
(cover + readiness + 10 chapters + summary/checks/quiz/practice). VI/EN bundles phẳng,
selector dùng LOCALE; engine TypeScript thuần không import React, không gọi stack ngoài.
`IngestionLabs` là UI playback, routing history và retention view. Không thêm dependency.

DEF không còn `roadmapOnly`: tuần 7–8 có lessonPath, các tuần chưa viết giữ trạng thái
planned trên từng card. hasPartTests vẫn false. Topic labels và quiz persistence theo
course slug. Chi tiết: `specs/lesson-def-b7.md`; kiểm: `scripts/check-def-b7.mjs` và
`scripts/check-course.mjs`. Không dùng checker b7 của CSC14003 cho DEF b7.

## DEF Week 8 lesson (2026-09-15)

Lazy full-bleed route `/courses/data-engineering-foundation/lessons/b8` uses
`features/lessons/def/b8/Lesson08Storage.tsx`. Sixteen slides cover the hero, readiness,
ten chapters, summary, checklist, quiz and practice. Flat bilingual bundles separate
lesson prose from lab labels. The pure storage engine supports explicit governance
findings and deterministic medallion replay. Quiz topics use `def8.*`; checklist uses
`data-engineering-foundation-b8-checks`; quiz saving stays in `SessionQuiz` with DEF slug.
Checks: `scripts/check-def-b8.mjs`, `scripts/check-def-b8-engine.mjs`, `check-course.mjs`,
and i18n unit `def-b8`. See `lesson-def-b8.md`.

## DEF Week 12 implementation · 2026-09-16

Lazy full-bleed route `/courses/data-engineering-foundation/lessons/b12` uses
`features/lessons/def/b12/Lesson12Orchestration.tsx` with 16 deck slides. Typed VI/EN
bundles own all prose; deterministic JS engine owns interval replacement, pool admission
and snapshot-bound quality validation. Uses existing LessonAnimation hook/tabs, local
framework assets and existing scoped SessionQuiz/CheckList persistence. No new dependencies
or storage shape changes. Checklist: `data-engineering-foundation-b12-checks`.
Quiz topics: `def12.*`. Checks: `scripts/check-def-b12.mjs`, `check-course.mjs`, i18n unit `def-b12`.
See `lesson-def-b12.md`; full app build has separately recorded existing b7/b8 blockers.

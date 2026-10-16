# Tiến độ dự án

## 2026-10-14 — Skill `learning-methods`

- Phân tích phương pháp học của Justin Sung (8 video) và đối chiếu với v2; kết luận v2 đã có phần lớn
  (đoán trước + độ chắc, nhớ lại tự do, FSRS, thang gợi ý, giấy/sketch).
- Tạo `.claude/skills/learning-methods/`: `SKILL.md` (xếp loại T/K/P/M/D theo động từ của `Skill.can`,
  luật tách P/M, ma trận loại × bước lesson → thành phần v2, 5 luật chung, cách ghi lựa chọn, quyết định cấp
  sản phẩm, checklist review, danh sách không áp dụng) và `references/methods.md` (thẻ M1–M15).
- Nối vào: `docs/DESIGN.md` §1 (trỏ tới skill), mục Skill của `CLAUDE.md`, mục "Learning-method fit" trong
  `.claude/agents/lesson-quality-judge.md`, case `methods-admissible-outline` trong `.claude/evals/cases.json`.
- Kiểm: một subagent nhận câu lệnh thật (không nhắc tên skill) → tự đọc skill, xếp `admissible` = K + T,
  dàn ý ghi mã phương pháp từng bước, có bài xử lý sâu, câu nhớ lại, câu ôn bối cảnh mới. Giới hạn: bảng
  ví dụ trong SKILL.md đã ghi `admissible` là K nên phần xếp loại không được kiểm độc lập; chưa chạy `run.py`.
- Phát hiện lỗi nội dung (chưa sửa): `admissible-e3` nói chỉ sửa h(A) = 1 là heuristic admissible, nhưng
  `overestimate` có h(S) = 7 > h*(S) = 2 (`overestimateFixed` sửa cả S: 2).
- 2026-10-16: theo yêu cầu user, bỏ `.claude/` khỏi `.gitignore` (repo public; đã rà: không có secret, chỉ lộ ID
  routine `trig_…` và vài đường dẫn máy). Vẫn ignore `.claude/settings.local.json` và `CLAUDE.md`. Chưa commit.
- Quyết định của user: skill phủ cả dựng bài lẫn quyết định sản phẩm; KHÔNG sửa skill v1 (`gamification`,
  `new-lesson`) vì v2 sẽ thay hẳn.
- Còn dở: câu nhớ lại cho ~12 kỹ năng (luật 4); đề xuất M9 xen kẽ, M13 câu hỏi người học, M14 độ chắc chắn.

## 2026-10-13 — v2: mục tiêu "Mô tả một tác tử thông minh" (PEAS, buổi 2) thành mục tiêu thật

Làm trên checkout chính (HEAD tách ở `origin/v2`, f6b1b62), chưa commit. Worktree `.worktrees/v2` có dev server
riêng đang chạy — chưa đụng tới.

- Phân tích 11 thư mục `Lecture/` gốc → `docs/courses/csc14003/lecture-map.md` (buổi gốc ↔ buổi repo ↔ mục tiêu v2).
- Dàn ý: `docs/courses/csc14003/lesson-design/peas-outline.md`. Tuyến 5 ga: `agent` → `rationality` → `peas` →
  `env-dims` → `env-classify` (`content/skillsAgents.ts`), lesson ở `content/lessons/<id>/`, dữ liệu bảng ở
  `content/agents.ts`, widget `AgentLoop`, `PeasCards`, `DataTable`/`EnvTable`. Bài tập giấy dùng `Homework1`.
- App từ một mục tiêu thành nhiều mục tiêu: `goalOf` (mục tiêu của ga) cho các màn lesson; `pickFollowed` +
  `useFollowedGoalId` (field mới `follow` trong store `learn-ai-v2`) cho Hôm nay, Khóa học, Sổ tay, buổi học;
  `routeOf`/`realProgress` cho số ga, số sketch thật. Buổi học lấy đoán trước/giấy từ lesson thật (A* còn mẫu).
- Mở rộng kiểu: `Skill.short`, `PaperData.reference` (đáp án gợi ý), `resultLabel` tùy chọn, classify có
  `groups` riêng từng mục. Style `.prose-lesson pre`. Sổ tay chọn được mọi mục tiêu thật.
- Kiểm: `npm test` 46/46, `npm run build` qua; trình duyệt: đi hết ga 1, guess/bảng/classify ga 5, thẻ PEAS ga 3,
  Khóa học, bản đồ khóa, Sổ tay, xếp lớp `/check/peas`; 375px không cuộn ngang; người học chỉ có tiến độ A* vẫn theo A*.
- Review: lượt `lesson-quality-judge` bị dừng giữa chừng; đã tự review (ghi rõ là self-review) ở
  `docs/courses/csc14003/reviews/peas-quality.md` kèm bảng coverage trang 3–42 + Homework1, sửa 4 điểm. Nên chạy
  lại `/review-lesson` độc lập.
- Còn dở: phần cấu trúc tác tử (trang 43–64) chưa có ga; mục tiêu `peas` chưa có bản đồ (chỉ Danh sách — `GoalMap`
  còn gắn A*); chưa có bản EN (v2 chưa có i18n).

## 2026-10-12 — Sửa dev server không khởi động

- `node_modules` còn từ trước v2, thiếu `@tailwindcss/vite` → `npm install` theo lockfile.
- `vite.config.ts`: đọc `PORT` (preview pane gán cổng khi 5173 bận — đang bị dev server của `.worktrees/v2` giữ), `strictPort`; không có `PORT` thì vẫn 5173.
- Còn dở: `CLAUDE.md` vẫn mô tả stack v1 (React 18, “KHÔNG Tailwind”, không test runner) trong khi v2 dùng React 19 + Tailwind 4 + Vitest — chưa có ADR thay ADR-0002. Node v22.21.1 thấp hơn yêu cầu `>=22.22.0` của react-router 8.4 (mới cảnh báo, chưa lỗi).

## 2026-10-03 — Makefile start + deploy Pages

- Thêm `Makefile` ở gốc repo: `make start` cài `npm ci` khi lockfile đổi rồi chạy Vite; `make deploy` build (kèm copy `404.html` như CI), chỉ push khi đang ở `main` và working tree sạch, dispatch workflow nếu origin đã up to date.
- README mục Chạy / Deploy trỏ `make start` / `make deploy`; npm và push `main` vẫn ghi là tương đương.
- Không đổi workflow GitHub Pages hiện có. Chưa commit.

## 2026-08-21 — Khởi tạo: port từ bộ thiết kế HTML sang React
Đã làm:
- [x] Scaffold Vite + React 18 + TS strict, alias @/, lazy routes
- [x] Design tokens dark/light + toggle theme (lưu localStorage `lam-theme`)
- [x] Tầng data: Course/Session/Part types, courses[] (CSC14003, 11 buổi, 3 phần)
- [x] Tầng storage: KeyValueStore interface + localStorage adapter + useProgress (đồng bộ khi focus/visibility/storage event); giữ key `csc14003-progress`
- [x] Trang Lộ trình: tiến độ, quiz TB, lịch ôn ngắt quãng (1-3-7-14-30 / 2-5-10-21), gợi ý "Hôm nay", báo cáo theo buổi
- [x] Buổi 1 — Nhập môn AI: 10 mục, 3 cảnh canvas (4 ô, Turing test, timeline 1940–2022), quiz phân loại 8 câu, chips "máy làm được?", tự kiểm 8 ô
- [x] Buổi 3 — Tìm kiếm: 9 mục, Manim Lab (7 thuật toán × 2 preset, chạy/bước/tốc độ), Code Lab (pseudo + Python tô màu), 2 cảnh canvas, bảng tổng kết, tự kiểm 7 ô
- [x] Kiểm tra tổng hợp: 3 phần × 10–12 câu, KaTeX, chấm theo buổi, lưu vào lộ trình
- [x] Landing + Courses + Blog placeholder + 404
- [x] Copy tài liệu gốc (42 file PDF/ipynb/py) vào public/materials
- [x] Docs: CLAUDE.md, specs, design, ADR 1–5, commands

Còn lại (backlog):
- [ ] Buổi 2, 4–11: bài học tương tác (hiện link slide PDF gốc)
- [ ] Blog: chọn nguồn nội dung (xem specs/blog.md) và render bài đầu tiên
- [ ] Trang portfolio/giới thiệu bản thân trên landing
- [ ] Cân nhắc solver Rust/WASM khi có bài toán n lớn (ADR-0005)
- [ ] Deploy (chưa quyết nền tảng — router đang dùng BrowserRouter, cần rewrite rule SPA)
- [x] `npm install && npm run build` lần đầu — ĐÃ XONG (xem phiên 2 bên dưới)

## 2026-08-21 — Phiên 2: cài đặt & chạy lần đầu
Đã làm:
- [x] `npm install` (76 gói, Node v22.21.1) — lần đầu kéo dependency về máy
- [x] `npm run build` PASS sạch: tsc -b không lỗi, vite build 689ms → dist/ (bundle lớn nhất PartTestPage 283kB do KaTeX)
- [x] Chạy `npm run dev` trên :5173 — kiểm mắt Trang chủ + Buổi 3 (canvas đồ thị vẽ đúng), console không lỗi
- [x] Thêm `.claude/launch.json` (config dev server cho preview tool)

Ghi chú: gạch mục backlog "npm install && npm run build lần đầu" — build đã xác nhận sạch.

## 2026-08-21 — Phiên 3: tách phần I, bỏ trích nguồn
Đã làm:
- [x] Tách Tuần 1–2 khỏi phần Tìm kiếm → khóa nay có 4 phần: I Nhập môn & Tác tử (green, tuần 1–2) · II Tìm kiếm (cyan, 3–6) · III Tri thức & suy luận (purple, 7–9) · IV Học máy (yellow, 10–11)
- [x] `Part.id` (foundations/searching/knowledge/ml) — khóa ổn định thay cho chỉ số phần; `partTests` nay lưu theo id, `storage.ts` migrate dữ liệu cũ 1→searching, 2→knowledge, 3→ml (đã test trên localStorage thật)
- [x] PartTestPage bỏ hardcode 3 phần: hash #p1..#pN parse theo regex + clamp, `picks` khởi tạo theo PART_TESTS.length
- [x] Bộ đề tách thành 4 bài (8·8·10·10); viết thêm 4 câu cho phần I (Buổi 1 ×3: 4 hướng tiếp cận, Dartmouth 1956, AI Winter; Buổi 2 ×1: model-based reflex agent)
- [x] Bỏ toàn bộ trích nguồn khỏi bài học & lộ trình: link "Slide gốc", footer AIMA/HCMUS, chip "Lecture 01 · 54 slide", khối "TÀI LIỆU HỌC" (aima.cs.berkeley.edu + CS188), các câu "theo slide"/"slide không cho đáp án"; link bài tập & lab giữ lại dưới tên trung tính ("Bài tập", "Lab N")
- [x] Thêm `Course.description` — hiện ở trang Khóa học + đầu lộ trình; khóa CSC14003 ghi rõ tham khảo từ "Các thuật toán thông minh nhân tạo" (Đại học Khoa học Tự nhiên – TP.HCM) và CS188 (UC Berkeley)
- [x] Cập nhật specs (part-tests, roadmap, 00-architecture), design/tokens, README

Còn để lại (cố ý): hai câu FOL Buổi 8 vẫn dùng ví dụ "Mọi sinh viên đều học ở HCMUS" — đó là câu ví dụ logic, không phải trích nguồn. Đổi nếu muốn trung tính hoàn toàn.

## 2026-08-21 — Phiên 4: đổi giọng văn bài học sang tôi/bạn
Đã làm:
- [x] Chốt mức giọng với user (3 mẫu preview): **vui vừa, icon làm mốc** — xưng tôi/bạn, ví von đời thường, pha trò đắt chỗ, icon ở đầu mục/thẻ chứ không rải trong đoạn
- [x] Viết lại toàn bộ phần chữ Buổi 1 (36 đoạn: hero, 10 SectionHead lead, các card, ghi chú italic) + intro-ai.js (8 giải thích quiz, 4 mô tả nhánh, CHECKS)
- [x] Viết lại toàn bộ phần chữ Buổi 3 (53 đoạn: hero, 9 lead, 7 AlgoCard body, admissible/consistent, 4 nguồn heuristic, Lab, Code Lab, 5 test case) + 7 note trong lab-searching.js
- [x] Mật độ sau khi đổi: Buổi 1 — 10 “tôi” / 27 “bạn” / 7 icon · Buổi 3 — 10 “tôi” / 24 “bạn” / 7 icon
- [x] Cập nhật CLAUDE.md: bỏ luật “nội dung NGUYÊN VĂN từ slide”, thay bằng quy ước giọng + luật “đổi giọng được, đổi số liệu/định nghĩa thì không”; sửa theo specs/lesson-b1, lesson-b3, commands/add-lesson

Ban đầu chỉ làm 2 bài học; phần còn lại làm nốt ở phiên 5.

## 2026-08-21 — Phiên 5: đổi giọng nốt phần còn lại của app
Đã làm:
- [x] 36 câu giải thích đáp án trong Kiểm tra tổng hợp + 4 mô tả phần (part-tests.ts)
- [x] Trang Kiểm tra: lời mở, nhãn “ĐÓNG SÁCH LẠI”, 3 mức gợi ý sau khi nộp (<60 / <85 / ≥85)
- [x] Trang Lộ trình: 4 thẻ phương pháp, 4 loại gợi ý “Hôm nay” (ÔN LẠI / KIỂM TRA / HỌC TIẾP / HOÀN TẤT), dòng báo cáo sau buổi, footer
- [x] quizTip() trong spaced-repetition.ts (4 mức), trang chủ, trang Khóa học, Blog placeholder
- [x] CLAUDE.md: quy ước giọng nay áp cho TOÀN APP, kèm ngoại lệ “nhãn UI chức năng giữ ngắn gọn”

Cố ý giữ terse (nhãn chức năng, cập nhật liên tục khi chạy lab): nhãn trạng thái frontier trong SearchLab,
tooltip đổi theme, tiêu đề CheckList, các dòng “Vô nghiệm → output: -1”.

## 2026-08-21 — Phiên 6: bộ skill dựng bài học
Đã làm:
- [x] `.claude/skills/lesson-voice/SKILL.md` — sáu khuôn viết (mở bằng căng thẳng · ví von đời thường · con số có cú chốt · ghi chú người đi trước · móc nối trước–sau · đẩy người đọc ra khỏi ghế), luật icon 5–8/bài, ngoại lệ nhãn UI, checklist tự kiểm
- [x] `.claude/skills/new-lesson/SKILL.md` — quy trình 6 bước, bắt buộc nạp lesson-voice ở bước 0 và duyệt dàn ý với user trước khi viết code
- [x] 3 reference: `anatomy.md` (khung file, component, class global.css, mẫu mục, pattern AlgoCard) · `wiring.md` (4 chỗ phải nối) · `canvas.md` (bảng màu hex, nhịp thời gian, reduced-motion, state giữa frame)
- [x] `scripts/check_lesson.py` — kiểm route / lessonPath / anchor↔id / storageKey trùng / scrollIntoView / dấu vết trích nguồn / mật độ tôi-bạn / số icon. Chạy sạch trên b1 và b3
- [x] `/add-lesson` command rút gọn thành con trỏ tới skill (một nguồn sự thật); CLAUDE.md thêm mục Skill

Script phát hiện: b3 có canvas nhưng `drawGrow`/`drawHill` không nhận cờ `rm` như b1 —
prefers-reduced-motion chưa được tôn trọng ở hai cảnh đó. Chưa sửa, chờ quyết định.

## 2026-08-21 — Phiên 7: skill tương tác + gamification + hệ evals
Đã làm:
- [x] `lesson-interactive` — bảng CHỌN hình thức cho từng dạng khái niệm (step lab / canvas scene / quiz phân loại / chip / bảng tĩnh / panel đôi) + 5 luật chung. Reference: `step-lab.md` (pattern trace player: engine sinh sẵn Step[], UI chỉ là trình phát — lý do lùi-lại thành chuyện vặt và engine thay được bằng WASM), `quiz-panels.md`, `canvas-scene.md` (chuyển từ new-lesson sang)
- [x] `gamification` — vòng lặp 4 mảnh đang có, quan điểm "động lực từ thông tin, không phải từ áp lực", ràng buộc ProgressDB + migration, ngưỡng 60/85, cách test bằng dữ liệu giả
- [x] `.claude/evals/` — hệ eval hai lớp: máy chấm (build + check_lesson --json) là xương sống bắt hồi quy, giám khảo LLM chấm văn theo rubric 6×2 điểm
  - `run.py` chạy case qua `claude -p` trong bản sao repo ở /tmp; biến thể `without` xóa `.claude/skills` + cắt mục Skill khỏi CLAUDE.md để có baseline lương thiện
  - `grade.py` chấm + sinh report.md, có `--compare` để so hai lần chạy
  - 3 case phủ ba thứ khác nhau: làm được không (`b4-full`) · nghĩ trước khi làm không (`b2-outline`) · viết có hay không (`voice-rewrite`)
- [x] `check_lesson.py` thêm `--json` để hệ eval dùng lại
- [x] Tự kiểm logic sandbox: rsync + symlink node_modules + cắt CLAUDE.md + diff. Sửa 2 lỗi thật lộ ra khi test (thư mục mới chỉ trả tên thư mục → artifacts hụt; `without` tự sửa CLAUDE.md bị tính nhầm là agent làm)

CHƯA chạy eval thật lần nào — tốn tiền, chờ user quyết. Chạy `--case voice-rewrite` trước cho rẻ.

## 2026-08-21 — Phiên 8: soát và đồng bộ lại .claude/
User nhắc: luôn cập nhật tài liệu trong .claude/ để không bị lỗi thời và agent khác hiểu nhầm.
Đã thêm mục "Giữ .claude/ khớp với code" vào CLAUDE.md (bảng tra: đụng gì thì sửa file nào)
rồi soát lại toàn bộ, sửa 8 chỗ đã lệch sau các phiên 3–7:
- specs/lesson-b1.md: bỏ mô tả “đoạn nghiêng ngoài slide”, “4 ô AIMA”, “card tài liệu” (khối TÀI LIỆU HỌC đã gỡ ở phiên 3); thêm ghi chú giọng văn
- specs/lesson-b3.md: “bảng AIMA của BFS” → “bảng độ sâu/thời gian/bộ nhớ”; thêm trỏ tới skill lesson-interactive
- specs/roadmap.md: nhãn “sắp có” → “Bài học tương tác đang dựng”; “link slide/HW” → chỉ còn Bài tập + Lab; thêm mục Header có course.description
- specs/00-architecture.md: thêm mục Type nội dung (Course.description, Part.id bắt buộc) + mục .claude/skills và .claude/evals
- commands/add-course.md: bổ sung 2 trường bắt buộc — thiếu là lỗi tsc, agent làm theo bản cũ sẽ hỏng

Đã soát và KHÔNG cần sửa: design/responsive.md, design/tokens.md, specs/blog.md, specs/part-tests.md, ADR-0001..0005.

## 2026-08-21 — Phiên 9: thêm thẻ toán nền vào bài học
User hỏi sao không thấy phần toán nền trong bài giảng. Kiểm ra: `Session.math` có đủ cho 11 buổi
nhưng chỉ render ở MỘT chỗ — dòng "TOÁN NỀN ·" trên card lộ trình. Trong hai bài học thì không có
block nào, dù trang Lộ trình hứa hai lần (thẻ phương pháp 03 + gợi ý HỌC TIẾP).

Đã sửa cả ba tầng:
- [x] `src/components/MathPrimer.tsx` — thẻ mở màn: kicker tím + lead + grid thuật ngữ (en/vn, định nghĩa một câu, "→ vì sao buổi này cần", note mono tùy chọn)
- [x] `src/content/courses/csc14003/math-primers.js` — dữ liệu khóa theo id buổi. b1: 2 phút × 2 chữ (buổi không cần toán, nói thẳng). b3: 5 phút × 5 thuật ngữ
- [x] Nối vào b1 + b3: section `#toan` ngay sau hero (không đánh số), thêm mục TOÁN NỀN đầu LessonNav
- [x] Skill `new-lesson`: bước 2 bắt buộc dựng thẻ này; bước 4 thêm chỗ nối thứ 5; anatomy.md thêm MathPrimer vào bảng component và khung trang
- [x] `check_lesson.py` kiểm mục 7: có `#toan` + `<MathPrimer>` + khóa trong math-primers.js. b1/b3 qua sạch

Ghi chú: `Session.math` giữ nguyên vai trò bản MỘT DÒNG cho card lộ trình; math-primers.js là bản
ôn đầy đủ trong bài. Hai thứ khác mục đích nên cố ý không gộp.

Gặp khi kiểm: tab preview cũ kẹt compositor (ảnh chụp trắng trơn dù DOM đúng, opacity 1) — mở tab
mới là hết. Không phải lỗi code.

## 2026-08-21 — Phiên 10: agent chấm phủ nội dung
- [x] `.claude/agents/lesson-coverage-judge.md` — subagent đối chiếu bài học với slide gốc trong
  public/materials/Lecture/buoi<N>/. Tools: Read/Grep/Glob/Bash, KHÔNG Edit/Write (giữ ranh giới
  giám khảo–thợ sửa để báo cáo còn đáng tin)
- [x] Thiết kế chống dương tính giả — rủi ro lớn nhất là judge liệt kê mọi khác biệt câu chữ thành
  "thiếu", sửa theo là bài học trượt về dạng slide gõ lại, phá đúng công viết giọng. Cách chặn:
  · phạm vi lấy từ `Session.topics`/`math` (hợp đồng) chứ không phải từ slide (nguyên liệu)
  · ba nhóm THIẾU / MỎNG / CÂN NHẮC, chỉ nhóm đầu là lỗi thật
  · danh sách tường minh những thứ CẤM báo: khác diễn đạt, khác ví dụ, khác thứ tự, giọng văn,
    nội dung cố ý hoãn sang buổi khác, nội dung slide ghi ngoài phạm vi
  · phép thử khi phân vân: "người học có mất năng lực gì không?"
  · bắt buộc mọi mục THIẾU/MỎNG phải chỉ được số trang slide — không chỉ được là suy diễn
- [x] Hướng dẫn đọc PDF theo lô 20 trang (giới hạn của Read); ghi rõ buổi 3 có 3 file P1/P2/P3 =
  180 trang, và nhắc đọc HẾT vì chỗ sót thường ở cuối
- [x] `new-lesson` thêm Bước 6 bắt buộc: spawn judge → sửa THIẾU + MỎNG (viết theo lesson-voice,
  KHÔNG dán chữ slide) → chạy lại judge 1 lần → tối đa 2 vòng. CÂN NHẮC chuyển nguyên cho user
- [x] CLAUDE.md thêm mục Agent + dòng trong bảng giữ tài liệu khớp code; 00-architecture ghi .claude/agents/

CHƯA chạy thử judge lần nào. Ứng viên tốt nhất để thử: b3 (180 trang slide, bài đã hoàn chỉnh) —
nếu nó báo một đống dương tính giả thì phần "KHÔNG được báo" cần siết thêm.

## 2026-08-21 — Phiên 11: chạy judge lần đầu trên b3 + vá 4 chỗ hụt

Judge đọc trọn 180 trang slide buổi 3 + Homework3, trả VERDICT "CẦN SỬA": 1 mục THIẾU, 3 mục MỎNG,
8 mục CÂN NHẮC. **Không có dương tính giả nào** — phần "KHÔNG được báo" của agent chưa cần siết.
Mọi mục đều chỉ được số trang slide đúng như thiết kế bắt buộc.

Đã vá 4 chỗ trong `features/lessons/b3/Lesson03Search.tsx` (chi tiết trong `specs/lesson-b3.md`):

- [x] **b\*** (P3 tr.58–59) — thiếu hẳn dù bài đã bê bảng tr.59 vào. Thêm công thức, ví dụ
  depth 5 / 52 nút → 1,92, và 2 cột b* vào bảng dominance
- [x] **Đánh giá riêng DLS** (P2 tr.53) — 4 stat của card là của IDS; thêm khối riêng cho DLS
- [x] **DFS: path check ≠ explored set** (P2 tr.47–48, HW Q2c) — bản path check ĐÃ tồn tại trong
  code DLS (`del visited[child]`) mà không chỗ nào gọi tên; Quiz 03 câu 2 lại hỏi trúng nó, nên
  người học trace ra sai đáp án mà không hiểu vì sao. Thêm khối 2 cột so hai bản
- [x] **f-contour + ngưỡng C\*** (P3 tr.37–40) — bài chỉ nêu kết luận "optimally efficient" mà bỏ
  cơ chế. Thêm SVG tĩnh so vùng loang UCS (viền tròn) vs A* (ellipse kéo về đích) + đoạn văn

**Sửa số liệu sai:** ô IDS ở d = 24 trong bảng dominance ghi "≈ 54 tỷ" — không có trong slide, bảng
gốc để dấu `–`. Đã trả về `–` kèm dòng chú thích. Phát hiện được là nhờ hỏi lại judge số nguyên văn
từng ô thay vì tin trí nhớ; **bài học: judge còn sống sau khi báo cáo, hỏi lại nó rẻ hơn tự đoán.**

Judge chỉ đọc được bảng/hình sau khi tự render trang PDF ra PNG — hai bảng quan trọng nhất (P3 tr.59,
P2 tr.53) không có text layer. Máy này KHÔNG có poppler/pdftotext, `Read` trên PDF cũng chết vì thiếu
`pdftoppm`. Nếu agent sau vấp chỗ này thì đó là lý do.

Còn để ngỏ (nhóm CÂN NHẮC, chờ user quyết): IDA*/RBFS/SMA* — bài ghi "để dành" mà không buổi nào
sau đó nhận; TSP phải chứa tập thành phố đã thăm trong state (HW Q1d hỏi trúng); chứng minh tối ưu
UCS và A*; con số 4^d lá vs ~2d² trạng thái (P1 tr.35); bidirectional chưa chắc tối ưu; Knuth's 4;
h phụ thuộc trạng thái vs g phụ thuộc đường đi; 8-queens bản complete-state (hợp để dành buổi 4).

Lại gặp đúng lỗi tab preview kẹt compositor đã ghi ở phiên trước — lần này mở tab mới cũng không
khỏi, phải kiểm bằng DOM (`javascript_tool`) thay cho ảnh chụp. DOM báo: sup của O(b^ℓ) đúng, bảng
5 cột cuộn ngang trong bọc `overflowX:auto` mà body không tràn, lưới DFS xếp 1 cột ở 375px,
`.panel-inner` đổi theo light theme còn `.canvas-panel` giữ nền tối — đúng quy ước.

---

## Phiên 2026-08-21 — chấm phủ nội dung bài 1

Chạy `lesson-coverage-judge` đối chiếu bài 1 với `Lecture01-IntroductionToAI.pdf`. **Verdict ĐẠT** —
không mục nào THIẾU; phủ trọn 5 chủ đề trong `topics` và cả 2 thuật ngữ `math`.

- [x] **Giới hạn tự thân của phép thử Turing** (P1 tr.17, hai vòng tròn "human behavior" vs
  "intelligent behavior") — thẻ "VÌ SAO ÍT AI THEO ĐUỔI PHÉP THỬ NÀY" trước đây chỉ có lập luận
  thực dụng của tr.18 (máy bay/chim), nên người học biết *ngành không thích* phép thử mà không nói
  được *thước đo sai ở đâu*. Thêm 1 đoạn: thước đo hành vi NGƯỜI chứ không đo hành vi THÔNG MINH,
  hai tập chỉ giao nhau một phần → vừa quá chặt vừa quá lỏng. Không vẽ Venn, chỉ thêm chữ.

**Aristotle 384–322 TCN: bài đúng, slide sai** (slide tr.20 ghi "381BC"). Đừng "sửa theo slide" ở
phiên sau.

Còn để ngỏ (nhóm CÂN NHẮC, chờ user quyết): Venn AI/ML/Data Science/Statistics (tr.29) — bài mới
chỉ có búp bê Nga AI⊃ML⊃DL; sách AIMA chưa được nhắc trong `Course.description` (`index.ts:13`);
sắc thái "câu trả lời đầu tiên" vs "tốt nhất" (tr.45) và tên ID3/Naïve Bayes/ANN (tr.51) — judge
khuyên để dành cho Buổi 3 và 10–11.

Máy vẫn không có `pdftotext`/`pdftoppm` (đã ghi ở phiên trước). Judge lần này đọc slide bằng PDFKit
qua `osascript -l JavaScript` — trích đủ text 54/54 trang và render PNG được trang chỉ có hình. Cách
này rẻ hơn, ghi lại cho phiên sau.

---

## Phiên 2026-08-21 (tiếp) — dựng bài 2 + remap bài tập cả khóa

### Bộ homework lệch số so với lecture — đã remap

Đọc nội dung thật của cả 9 file `HomeworkN.pdf` thì thấy chúng KHÔNG khớp thư mục đang chứa chúng.
`links` trong `index.ts` đã được sửa theo nội dung; **file PDF giữ nguyên chỗ cũ** (CLAUDE.md cấm
di chuyển `public/materials/`), chỉ đổi buổi nào trỏ tới file nào:

| File | Nội dung thật | Trước | Sau |
|---|---|---|---|
| Homework1 | PEAS + 4 chiều môi trường | b1 | **b2** |
| Homework2 | UCS, BFS/DFS mê cung | b2 | **b3** (Bài tập 1) |
| Homework3 | Romania, admissible, frontier | b3 | **b3** (Bài tập 2) |
| Homework4 | N-queens hill-climbing + tô màu | b4 | b4 ✓ |
| Homework5 | minimax + α-β | b5 | b5 ✓ |
| Homework6 | logic mệnh đề, resolution | b6 | **b7** |
| Homework7 | FOL, unification | b7 | **b8** |
| Homework8 | ID3 | b8 | **b10** |
| Homework9 | backprop | b9 | **b11** |

**b1, b6, b9 giờ không có bài tập** — bộ đề không hề có đề CSP và đề Bayes, không phải tôi làm mất.
Đừng "sửa lại cho đều" ở phiên sau.

Kéo theo: §10 của bài 1 không còn là bài tập (4 câu PEAS đã về b2 — đúng chỗ, vì b1 tự nói người học
chưa có đồ nghề để làm). Đổi thành cầu nối: 3 câu tự vấn rút từ chính nội dung buổi 1, nhãn nav
`10 Bài tập` → `10 Qua buổi 2`.

### Bài 2 — Tác tử thông minh (`/courses/csc14003/lessons/b2`)

10 mục, 3 phần tương tác, spec đầy đủ ở `.claude/specs/lesson-b2.md`. Không có canvas rAF: cả ba
phần đều là trạng thái rời rạc do người học điều khiển nên HTML/SVG hợp hơn.

- **VacuumLab** — 2 chương trình × 3 preset × 20 bước, chấm 3 thước đo song song. Cú chốt của cả
  bài: sàn đã sạch bong, thước A hòa 40–40, thêm dòng "đi lại tốn xăng" thành 20–39. Đã verify số
  bằng cách chạy engine qua node **và** đọc lại từ DOM trong trình duyệt.
- **EnvExplorer** — 8 môi trường × 6 chiều, khớp đúng bảng tổng hợp gốc (verify bằng DOM).
- **AgentArchDiagram** — nấc 1–4 là MỘT sơ đồ lớn dần, nấc 5 đổi hẳn sơ đồ (agent 4 nấc co thành
  một hộp). Chủ ý, không phải hai sơ đồ rời.

Theo slide: dạy đủ **7 cặp chiều** (bảng tương tác 6 chiều như bảng gốc, known/unknown thẻ riêng);
`topics` của b2 sửa "6 chiều" → "7 chiều".

### Judge vòng 1 → đã sửa 5 chỗ

1 THIẾU + 4 MỎNG, sửa hết bằng giọng của bài chứ không dán chữ từ slide: cạnh tranh vs hợp tác
(tr.35) · thêm Backgammon làm mẫu "quan sát đầy đủ mà vẫn ngẫu nhiên" (tr.40) · chiều quan sát nói
kỹ: hai nguyên nhân + mức unobservable (tr.34) · thỏa dụng **kỳ vọng** (tr.59) · giới hạn thứ nhất
của agent phản xạ — có thứ không phát biểu thành luật được (tr.50).

Judge vòng 2: **ĐẠT** — cả 5 mục đã đóng, không chỗ sửa nào làm sai kiến thức. Vá thêm 2 nit nó
chỉ ra: kicker thẻ "hai chỗ hay bị lẫn" giờ có 3 đoạn nên đổi nhãn; note poker được thêm vế "và
ngẫu nhiên, vì còn chuyện chia bài" để người chỉ bấm poker vẫn hiểu vì sao ô đó sáng.

Còn để ngỏ (nhóm CÂN NHẮC, chờ user quyết): Quiz 03 của slide (dựng ví dụ learning agent theo 4
thành phần) — rẻ nhất là thêm một dòng vào CheckList mục 09; sắc thái "động = liên tục bị hỏi muốn
làm gì" (tr.38); rời rạc/liên tục áp cho cả *thời gian* chứ không chỉ giá trị (tr.39); hai hàng
Image analysis / Refinery controller của bảng tr.40 không đưa vào EnvExplorer (cố ý — hai agent này
vẫn có trong bảng PEAS mục 05).

### Ghi chú kỹ thuật

- `check_lesson.py b2` báo `warn` "mục có id nhưng không có trong nav: #hero-ah, #hero-ah2" — đó là
  `id` của hai `<marker>` SVG trong hero, không phải mục. False positive, bỏ qua.
- `.claude/launch.json` thêm `"autoPort": true` — phiên khác đang giữ 5173. Lưu ý: Vite không đọc
  biến `PORT`, nó tự nhảy sang 5174, nên **cổng harness báo không phải cổng thật** — đọc
  `preview_logs` lấy cổng Vite in ra rồi mới navigate.
- Đọc PDF vẫn bằng PDFKit qua `osascript -l JavaScript` (máy không có poppler). Script dùng lại
  được: `pdftext.js <pdf>` và `pdfpng.js <pdf> <outdir> <trang...>` trong scratchpad của phiên.

### Nâng cấp phần nhìn của lab hút bụi (cùng phiên, sau feedback "khó hình dung")

Bản đầu chỉ có hai ô chữ nhật, mấy chấm đỏ và dòng chữ "AGENT Ở ĐÂY" — đọc được nhưng không hình
dung được, vì con robot không phải một *vật* và người học không bao giờ thấy nó **làm** gì, chỉ thấy
trạng thái sau khi làm. Tách phần nhìn ra `VacuumRoom.tsx` và dựng lại:

- Robot SVG có mắt, trượt giữa hai ô bằng CSS transform (tắt khi `prefers-reduced-motion`), thân đổi
  màu theo tri giác. Hiệu ứng riêng cho từng hành động: vòng cung hút · mũi tên đứt nét khi đi · hai
  vạch nghỉ khi NoOp. Bụi vẽ thành hạt rải rác thay vì 4 chấm xếp hàng.
- **Bong bóng tri giác neo vào ô ĐÃ NHÌN, không bám robot.** Đây là chỗ bản đầu kể sai: robot đi
  sang B mà bong bóng `[A, Clean]` trượt theo nó, thành ra như robot đứng ở B mà nhìn thấy A. Giờ
  bong bóng ở lại ô A với viền đứt + nhãn "ĐÃ THẤY Ở ĐÂY", cộng mũi tên A→B — đọc ra đúng thứ tự
  perceive → decide → act. **Đừng "dọn" cho nó bám robot lại.**
- Thêm **băng tri giác** (8 pill gần nhất) — 𝓟* của mục 02 vẽ ra cho thấy được.
- Thêm **băng hành động** 21 ô bấm được để nhảy bước, tô màu theo loại hành động. Đây là phần lời
  nhất: `reflex` trên sàn sạch ra một dải cyan liên tục, `memo` ra đúng một ô cyan rồi xám hết —
  chênh lệch 20 vs 39 nhìn phát thấy, không cần đọc số.
- Cỡ chữ trong SVG nâng lên 13–17 đơn vị viewBox. Lý do: viewBox cố định 400 nên ở 375px cảnh co
  còn ~263px, chữ 9.5 tụt xuống ~6px không đọc nổi. **Đừng hạ lại cho "cân" với desktop.**

Đã kiểm trên trình duyệt: dark + light, 375px không tràn ngang, nút điều khiển ≥44px, console sạch,
và băng hành động khớp đúng trace của engine (reflex: Right|Left|Right… · memo sàn sạch: Right rồi
NoOp hết · memo sàn bẩn: Suck|Right|Suck|NoOp…).

### Thêm tuỳ chọn thế giới 4 ô cho lab hút bụi

`vacuum-world.js` giờ có `WORLDS` (`w2` = A·B bản gốc · `w4` = hành lang A·B·C·D) và `PRESETS` dùng
chung ba id cho mọi thế giới (`dirty-all` · `dirty-half` · `clean`). Chữ ký đổi thành
`runVacuum(programId, worldId, presetId)` và `compareFinal(worldId, presetId)`.

**Chọn hành lang chứ không phải lưới 2×2** để giữ nguyên bộ hành động {Left, Right, Suck, NoOp} của
tài liệu gốc — lưới sẽ phải đẻ thêm Up/Down, tức là đổi đề bài. Luật phản xạ mở rộng thành "ở ô
cuối thì Left, còn lại Right", trùng khít hàm bốn dòng gốc khi n = 2. **Đã verify điểm của thế giới
2 ô không đổi một chữ số nào** (40–40 / 20–39 vẫn đúng — hai con số này được trích thẳng vào bài).

Bốn ô làm lộ hai thứ mà hai ô giấu mất, và đó là lý do đáng thêm chứ không chỉ cho vui:

1. Luật "ở ô cuối thì lùi" thành cái bẫy — phản xạ thuần lết tới D rồi **ping-pong C↔D tới hết 20
   bước**, A và B không bao giờ được thăm lại. Băng hành động cho thấy ngay: `Right|Right|Right|
   Left|Right|Left|…`
2. Bản có trí nhớ phải đi thăm dò đủ 3 bước rồi mới dám nghỉ → thu thập thông tin (mục 04) trả giá
   bằng xăng nhưng vẫn rẻ hơn đi mù. Điểm: **80–80 hòa ở thước A, 60–77 ở thước B**.

Kéo theo trong bài: mục 02 nối con số bảng tra sang tuỳ chọn 4 ô (8 loại tri giác → Σ8^t cho 10
bước = **1.227.133.512** dòng, gấp gần 900 lần con số 1.398.100 của hai ô); mục 03 thêm thí nghiệm
thứ ba (kicker đổi "HAI" → "BA"); tiêu đề lab thành động theo `cells.length`.

`VacuumRoom` vẽ được n ô: bề rộng ô tự chia, `SPECKS` đổi sang hệ số tỉ lệ, và từ 3 ô trở lên bật
chế độ `tight` (bỏ chữ DIRTY/CLEAN thay bằng chấm màu, robot thu 0.82, rút gọn dòng sổ tay). Bong
bóng tri giác rộng hơn một ô khi n = 4 nên tâm bị kẹp vào [64, 336] còn đuôi vẫn trỏ đúng ô đã nhìn.

Đã kiểm trình duyệt: cả 2 thế giới × 3 preset × 2 chương trình, dark + light, 375px không tràn ngang,
nút ≥44px, console sạch.

### Quiz trắc nghiệm cuối mỗi buổi

App vốn đã **hứa** thứ này mà chưa có ai giao: `SessionRecord` có sẵn `quizScore/quizRight/quizWrong`,
`RoadmapPage` đã render báo cáo mạnh/yếu từ ba trường đó, ô thống kê "QUIZ TB" đã có chỗ, và
`quizTip()` còn nói thẳng *"Làm quiz trong bài học đi, rồi tôi báo cáo cho."* Nhưng không chỗ nào ghi.
Giờ đã nối xong. **Không đổi shape ProgressDB, không cần migration.**

- `src/components/SessionQuiz.tsx` — component dùng chung (≥2 bài dùng nên nâng lên `components/`).
  Đây là chỗ **DUY NHẤT** ghi ba trường `quiz*`. Một câu một màn, chọn xong khóa luôn (điểm là lần
  trả lời đầu), hiện ngay ✓/✗ + giải thích. Xong 8 câu mới ghi vào ProgressDB qua `useProgress`.
  Ngưỡng màu và lời khuyên lấy từ `scoreColorVar` / `quizTip` để nhất quán với Kiểm tra tổng hợp.
- `src/content/courses/csc14003/session-quizzes.js` — `SESSION_QUIZZES` khóa theo id buổi, shape
  trùng `TestQuestion`. **Khác một chỗ quan trọng: `topic` ở đây là CHỦ ĐỀ TRONG BUỔI** ("PEAS",
  "Bảy chiều môi trường"), không phải tên buổi — báo cáo cần nói "hổng chỗ nào", còn buổi thì người
  học biết rồi. Thêm buổi mới chỉ cần thêm một khóa, component tự nhận.
- Nối vào b1 (mục 10), b2 (mục 10), b3 (mục 09); bài tập của cả ba lùi xuống một số. Nav thêm mục
  Quiz tô vàng (`hot`).
- **b3 đổi anchor**: mục bài tập trước đây mang id `#quiz` (dễ nhầm chết người khi có quiz thật) →
  đổi thành `#hw` cho khớp b1/b2. Tiêu đề cũng bỏ "Quiz 03" vì từ lần remap homework, b3 nhận cả
  Homework2 lẫn Homework3 chứ không riêng file nào.
- `RoadmapPage`: link nhắc ôn giờ trỏ thẳng `lessonPath + '#quiz'` (chữ vốn đã bảo "làm lại quiz").

Giữ nguyên quiz 4 ô ở **mục 05 của b1** — nó là bài tập phân loại nằm giữa lúc giảng, không ghi
điểm, khác việc với quiz cuối buổi. Đừng gộp hai cái.

Đã kiểm bằng trình duyệt với dữ liệu thật: làm 8 câu (cố ý sai 2) → 75%, `sessions.b2` ghi đúng
`quizScore/quizRight/quizWrong`, trang Lộ trình hiện đủ ƯU ĐIỂM / CẦN CẢI THIỆN / GỢI Ý và ô QUIZ TB.
Quay lại bài thấy banner "LẦN TRƯỚC 75%", bấm câu đầu thì banner ẩn còn điểm cũ vẫn giữ tới khi lượt
mới hoàn tất. Dark + light, 375px không tràn ngang, nút ≥44px, console sạch. Đã xóa dữ liệu thử.

Còn để ngỏ: b4–b11 chưa có câu hỏi (chưa có bài học). Thêm khóa vào `session-quizzes.js` là xong,
không phải sửa component.

---

## Phiên 2026-08-22 — phản hồi sau khi user đọc thử buổi 1

Ba góp ý: (1) giọng văn chưa ưng, (2) cuộn dọc khó chịu, muốn thử trượt trái phải, (3) thêm ví dụ
xu hướng gần đây. Đã hỏi lại và user chốt: xem thử 3 giọng rồi mới quyết · làm chế độ trình chiếu
bật/tắt · **chèn xu hướng mới vào nội dung sẵn có ở cả b1 và b2, không tạo mục mới**.

### Giọng văn — ĐANG CHỜ USER CHỌN

Đã dựng một Artifact so sánh 4 giọng (hiện tại · trung tính · kể chuyện · đối thoại) trên **hai
đoạn thật của bài 1**: lead mục 07 (nội dung kể) và thẻ đỏ mục 03 (nội dung lập luận) — cố ý lấy hai
kiểu nội dung khác nhau vì một giọng phải kể được cả hai. Trang dùng đúng token màu và bộ chữ của
app để đọc thử trong typography thật.

**Chưa viết lại chữ nào trong app.** Việc (3) — chèn ví dụ LLM / generative AI / AI agent — cũng
đang chờ, vì nó là chữ mới và phải viết theo giọng đã chọn.

### Chế độ trình chiếu — xong (ADR-0006)

`src/components/LessonDeck.tsx` + `DeckToggle` trong `LessonNav` + `useDeckMode()` nhớ lựa chọn ở
key `lam-lesson-view`. Nối vào cả b1, b2, b3.

Hai ràng buộc quyết định cách cài, **đừng "tối ưu" đi**:

1. **Không unmount slide ẩn** — lab đang ở bước 12, quiz làm dở câu 5, trượt qua rồi quay lại mà mất
   sạch thì tệ hơn không có tính năng. Mọi slide vẫn mount, chỉ `display:none`. Đã verify: đặt lab ở
   bước 7 / thế giới 4 ô, nhảy sang 2 mục khác rồi quay lại — vẫn nguyên bước 7.
2. **Không sửa DOM do React quản** — bọc mỗi mục trong div riêng của deck rồi bật tắt `display` trên
   div đó. Sửa thẳng `style`/`className` của section thì sớm muộn bị React ghi đè lúc panel bên
   trong re-render.

Mỗi bài giờ có hằng `NAV` duy nhất, `SLIDES = NAV.map(...)` — thanh điều hướng và danh sách slide
không lệch nhau được. Link `#id` vẫn chạy ở chế độ trình chiếu nhờ bắt `hashchange`.

Hero bị ẩn khi trình chiếu (`body:has(.deck-bar) .lesson-hero`) — không ẩn thì nó chiếm trọn màn
hình đầu và đẩy slide 01 xuống khuất. Đây là lỗi tôi gặp thật lúc kiểm, không phải suy đoán.

Đã kiểm: b1/b2/b3 đều 12 slide · nút, phím ←/→, dải chấm, link nav đều nhảy đúng · tắt đi thì trở
lại đúng 12/12 mục và hero về chỗ cũ · mobile 375px nút ≥44px không tràn ngang · dark + light.
Lưu ý khi kiểm: `<Reveal>` mất 0.7s fade nên ảnh chụp ngay sau khi đổi slide sẽ thấy chữ mờ —
**đó là transition, không phải bug**, tôi đã tưởng nhầm một lần.

### Chốt giọng "Kết hợp" và viết lại b1 + b2

User chọn giọng **kết hợp, kể chuyện làm tone chính, đối thoại dùng dè**. Đã ghi thành **khuôn 7**
trong skill `lesson-voice` (kèm bảng liều lượng và hai câu tự kiểm mới) — đó là hợp đồng, phiên sau
viết gì cũng phải theo.

Luật phân vai: **kể chuyện mở màn** (khái niệm nào có người thật việc thật đứng sau thì mở bằng cảnh
đó, đừng mở bằng định nghĩa) · **đối thoại chỉ để gỡ nút** (đúng chỗ người đọc đang giữ một niềm tin
sai). Trần: **2–3 cụm câu hỏi mỗi bài**. Hiện b1 có 2, b2 có 2 — đã đếm lại sau khi viết xong.

**Cảnh mở màn đã dùng** (đừng đổi sang cảnh khác mà không có lý do, mỗi cảnh chọn vì nó *đúng cơ chế*
của mục đó):

| Mục | Cảnh |
|---|---|
| b1 · 01 | Tấm bảng của Feynman năm 1988: *cái gì tôi không tạo ra được thì tôi chưa hiểu nó* |
| b1 · 03 | Turing mở bài trên *Mind* 10/1950 rồi tự gạt câu hỏi của chính mình |
| b1 · 04 | Newell & Simon 1961 bắt người thật nghĩ thành tiếng rồi chép lại |
| b1 · 07 | Minsky hứa với Life 1970, bốn năm sau tiền bị cắt |
| b1 · 08 | Nobel Vật lý 8/10/2024 (Hopfield, Hinton) và Hóa học ngày hôm sau (AlphaFold) |
| b2 · 01 | Trợ lý lập trình đọc file / chạy lệnh = cảm biến / bộ chấp hành |
| b2 · 03 | Thuê người dọn nhà, trả công theo ký rác — tuần thứ ba rác mọc thêm |
| b2 · 08 | Con ếch sống bằng đúng ba luật |

**Cụm đối thoại**: b1 mục 03 (vượt Turing có chắc thông minh / trượt có nghĩa là không) và mục 05
(sang đường bị cửa máy bay rơi trúng — duy lý chấm quyết định, không chấm kết quả). b2 mục 06 (poker
vs backgammon khác mấy chiều) và mục 07 (agent tra bảng sai ở đâu — loại trừ từng khả năng).

### Xu hướng gần đây — chèn vào nội dung sẵn có, không tạo mục mới

- `intro-ai.js` · TIMELINE nối tới 2025: GPT-4 (2023) · Nobel Vật lý + Hóa học 2024 · AI agent thành
  dòng chính (2025). CANDO thêm 4 chip: viết code từ mô tả · dựng video từ một câu · tóm tắt trung
  thực tài liệu chưa từng thấy · tự chia việc nhiều bước rồi gọi công cụ.
- b1 mục 06: búp bê Nga nối thêm một câu — LLM nằm ở lớp trong cùng, và tám buổi giữa của khóa không
  đụng tới lớp đó lấy một lần.
- b1 mục 08: thẻ đạo đức — thêm deepfake vào ô "theo dõi và thuyết phục", dữ liệu vơ từ Internet vào
  ô "thiên lệch", và **ảo giác** (nói sai bằng giọng chắc nịch) vào ô "an toàn".
- b2: `PEAS_ROWS` và `ENVIRONMENTS` thêm hàng **Trợ lý lập trình**; mục 08 thêm thẻ **"AI agent nằm ở
  nấc mấy"** — phần lớn dừng ở nấc 3, nấc 4 lỏng lẻo, nấc 5 để trống vì mô hình không tự sửa mình sau
  mỗi lần bị chê. Đây là chỗ dạy được nhiều nhất trong cả phần chèn thêm.

**Chưa đụng b3** — buổi Tìm kiếm ít chỗ có chuyện thật để kể và không có ngộ nhận kiểu Turing; để
sau, và chỉ sửa nếu user thấy nó lệch giọng so với hai bài đầu.

Lưu ý môi trường: ảnh chụp màn hình lại ra đen dù DOM báo `opacity: 1` — đúng lỗi compositor đã ghi ở
phiên trước. Kiểm bằng `javascript_tool` đọc DOM, đừng tin ảnh trắng/đen.

### Sửa lỗi canvas bị kéo giãn (do chế độ trình chiếu làm lộ ra)

User báo layout phần visualization trông lỗi. Đo ra được con số: ở màn **1440px**, canvas mục 02 của
bài 1 rộng 1070px nhưng bitmap chỉ **1280** (= 640×2) thay vì 2140 — **kéo giãn 1,67 lần**, và tệ hơn
là hàm vẽ chạy với `w = 640` trong khi hiển thị ở 1070 nên bố cục bên trong cũng sai luôn.

Nguyên nhân: `CanvasScene` (và `SearchLab`) đo `c.clientWidth || 640` **một lần lúc mount** rồi chỉ
nghe `window.resize`. Ở chế độ trình chiếu, canvas mount lúc slide còn `display:none` → `clientWidth`
bằng 0 → rơi vào giá trị dự phòng 640 → slide hiện ra cũng không có gì đo lại.

**Vì sao tôi không bắt được lúc dựng deck:** cửa sổ test lúc đó rộng ~700px, wrap ra đúng 641px — gần
như trùng khít với fallback 640 nên sai số bị che hoàn toàn. Bài học: **test canvas ở ít nhất hai bề
rộng cửa sổ khác nhau**, một cái phải xa 640.

Sửa ở cả hai file bằng `ResizeObserver` trên chính thẻ canvas — nó bắt luôn cả 0 → N lúc slide hiện
ra lẫn thay đổi kích thước cửa sổ, nên bỏ được cả `setTimeout(size, 350)` lẫn listener `window.resize`.
**Bỏ hẳn giá trị dự phòng 640**: chưa có bề rộng thật thì đừng vẽ (guard `if (ctx && w)` lo việc đó),
thà trống một hai frame còn hơn vẽ sai. Thêm điều kiện `next === w` thì bỏ qua, kẻo gán lại
`c.width` mỗi lần RO kêu là xóa sạch canvas.

Đã verify ở 1440px: cả 3 canvas của b1 và lab của b3 đều đúng `cssW × dpr` — trong trình chiếu, sau
khi nhảy sang slide đang ẩn, và sau khi tắt trình chiếu về cuộn. Thu cửa sổ 1440 → 900 cũng đo lại
đúng (RO thay được listener cũ). Cả ba bài: không tràn ngang, không phần tử nào lòi ra ngoài,
`body` padding về 0, console sạch.

Ghi thêm vào ADR-0006: component nào đo kích thước phần tử cũng phải dùng `ResizeObserver`.

### Hero thành slide bìa (thay vì bị ẩn)

Bản đầu của chế độ trình chiếu **ẩn hero** đi vì nó chiếm trọn màn hình và đẩy slide 01 xuống khuất.
User chỉ ra cách đúng: biến chính nó thành **slide 01**. Đã sửa ở cả b1, b2, b3:

- Hero chuyển vào trong `<LessonDeck>` làm con đầu tiên (bản cuộn không đổi gì — `LessonDeck` khi tắt
  chỉ trả `<>{children}</>`).
- `SLIDES = [{ id: 'hero', label: 'Bìa' }, ...NAV.map(...)]`. Mục bìa **cố ý không có trong `NAV`** —
  thanh điều hướng không cần link "bìa". Nhờ `slides.findIndex` mà mọi link `#id` vẫn nhảy đúng dù
  chỉ số đã lệch một (đã verify: `#ch1`→03/13, `#ch7`→09/13, `#hw`→13/13).
- Hero **không** mang `id` trong DOM, để `check_lesson.py` khỏi báo thừa anchor không có trong nav.
- Gỡ luật CSS `body:has(.deck-bar) .lesson-hero { display: none }`.

Đã kiểm cả ba bài: slide 01 là "Bìa", 13 chấm, phím Home về bìa, tắt trình chiếu thì hero về đầu
trang và đủ 12/12 mục; canvas vẫn đúng kích thước ở cả hai chế độ (kể cả SearchLab của b3); 375px
không tràn ngang; console sạch.

### Chỉnh thanh nav, bố cục slide, và dọn trùng lặp

**Thanh nav.** `.lesson-nav__links` và `.deck-toggle` cùng có `margin-left: auto` trong một flex row
có `flex-wrap: wrap` → mục lục chiếm trọn dòng, đẩy nút xuống dòng hai dính lề phải, trông như lỗi.
Tách thành **hai hàng có chủ đích**: hàng 1 danh tính bài + nút đổi chế độ (đẩy bằng
`.lesson-nav__grow` thay vì tranh nhau `margin-left:auto`), hàng 2 mục lục **cuộn ngang ở mọi bề
rộng** (trước chỉ cuộn ở mobile, còn desktop thì wrap nhiều dòng làm chiều cao thanh bar nhảy loạn).
Mobile ẩn `.lesson-nav__title` — badge đã đủ, nhường chỗ cho nút.

**Bố cục slide.** Thêm class `.deck-slide`: `min-height: calc(100vh - 190px)` + flex column căn giữa,
padding trên của mục giảm từ 78px xuống 26px (78px là để chừa thanh nav dính khi cuộn, trong slide
thì thừa). Mục cao hơn màn hình, hoặc màn thấp (`max-height: 700px`), hoặc mobile thì bỏ căn giữa cho
nội dung chạy từ trên xuống.

**Một bug đáng nhớ trong lúc làm:** `.deck-slide` có `display: flex` trong CSS nhưng React đặt inline
`style={{ display: 'block' }}` cho slide đang hiện → **inline đè class**, căn giữa không bao giờ chạy
mà nhìn qua không thấy sai. Sửa: slide đang hiện KHÔNG đặt display inline, chỉ slide ẩn mới đặt
`display: none`. Đã ghi comment tại chỗ.

**Dọn trùng lặp** (đúng quy ước "≥2 feature dùng thì nâng lên `components/`"):

| Thứ bị lặp | Trước | Sau |
|---|---|---|
| `wrap` (hằng layout mục) | 3 bản giống hệt, mỗi bài một | class `.lesson-section` trong `global.css` |
| `function Kicker` | 2 bản (b1, b2) | `src/components/Kicker.tsx`, dùng class `.kicker` sẵn có |
| cờ `prefers-reduced-motion` | 2 bản (b1, VacuumLab) | `src/lib/motion.ts` |

Ba trang bài học giảm còn 574 / 481 / 637 dòng. Đã verify: cả ba bài 12/12 mục hiện ở chế độ cuộn,
nav đúng hai hàng, không tràn ngang ở 375px lẫn 1440px, slide ngắn căn giữa đúng (bìa: trên 225 /
dưới 250), slide dài chạy từ trên xuống, console sạch, `check_lesson.py` không lỗi bài nào.

### Soát lại toàn bộ `.claude/` (2026-08-23)

Phiên này đụng vào nhiều thứ nền (bỏ hằng `wrap`, thêm `LessonDeck`, thêm `SessionQuiz`, đổi
`LessonNav`, đổi giọng văn), nên tài liệu lệch khá nhiều. Đã soát cả 34 file và sửa 12:

| File | Lệch ở đâu |
|---|---|
| `skills/new-lesson/references/anatomy.md` | **nguy hiểm nhất** — vẫn dạy khai `const wrap` và `function Kicker` cục bộ, khung `return` chưa có `NAV`/`SLIDES`/`LessonDeck` |
| `skills/new-lesson/references/wiring.md` | nói "bốn chỗ", thiếu hẳn chỗ nối deck và quiz; ví dụ nav còn `09 Bài tập` |
| `skills/new-lesson/SKILL.md` | "sáu khuôn" → bảy; bước 4 liệt kê 5 chỗ → 7; mô tả script kiểm đã cũ |
| `skills/new-lesson/scripts/check_lesson.py` | **thêm 2 phép kiểm mới**: deck đã bọc + `SLIDES` có slide bìa · quiz có khóa trong `session-quizzes.js`. Đổi kiểm `paddingBottom: 90` → class `lesson-section--last` |
| `skills/gamification/SKILL.md` | "bốn mảnh" → năm; quiz cuối buổi giờ là mảnh thật, ghi rõ nó là chỗ DUY NHẤT ghi `quizScore` |
| `design/responsive.md` | nav giờ hai hàng ở mọi bề rộng; thêm breakpoint `max-height: 700px`; canvas đo bằng `ResizeObserver` |
| `design/tokens.md` | bổ sung `.lesson-section*`, `.lesson-hero`, `.deck-*`, `.btn--toggle-on` |
| `specs/00-architecture.md` | thêm mục "Quy ước layout trang bài học"; `Kicker` vào danh sách components |
| `specs/lesson-b1.md` | CANDO 12 → 16 chip; TIMELINE tới 2025; ghi cảnh mở màn và 2 cụm đối thoại |
| `specs/lesson-b2.md` | ghi cảnh mở màn và 2 cụm đối thoại |
| `specs/roadmap.md` | nguồn của `quizScore`; link nhắc ôn trỏ `#quiz`; nhãn "Bài tập 1/2" của b3 |
| `commands/review-build.md` | thêm bước kiểm cả hai chế độ xem, và **kiểm canvas ở ít nhất hai bề rộng cửa sổ** |
| `commands/add-lesson.md` | "6 bước" → 8 bước (0–7) |

Không đụng: 5 ADR đầu (bản ghi lịch sử), `agents/lesson-coverage-judge.md`, `specs/part-tests.md`,
`specs/blog.md`, `commands/add-course.md`, `evals/*` — soát rồi, còn đúng.

**Một khoảng trống thật (code, không phải tài liệu):** `check_lesson.py b3` báo *"có canvas nhưng
không thấy cờ prefers-reduced-motion"* — kiểm lại thì đúng là b3 chưa xử lý giảm chuyển động trong
`lesson03.scenes.ts`, khác b1 vốn truyền cờ `rm` vào hàm vẽ. Đây là lỗi có sẵn từ trước phiên này,
chưa sửa, để lại đây cho phiên sau.

### Đưa lên GitHub (2026-08-23)

Repo public: https://github.com/handonn2000/learn-ai-with-me (`main`, 93 file, commit đầu `afdc5c1`).

Hai thứ **cố ý không đẩy lên** — đã thêm vào `.gitignore`:

| Bị loại | Vì sao |
|---|---|
| `public/materials/` (40MB) | slide bài giảng, homework và code lab gốc của CSC14003 là tài liệu của trường; repo public nên không tái phát tán |
| `tsconfig.tsbuildinfo` | build artifact, `tsc -b` tự sinh lại |

Hệ quả cần nhớ: **bản clone sạch chạy được app nhưng mọi link PDF trên trang Lộ trình sẽ 404** cho
tới khi tự thả file vào `public/materials/`. Đã ghi cảnh báo này ở đầu `README.md` (ngay dưới mục
"Chạy") và đánh dấu trong sơ đồ cấu trúc. Đường dẫn trong data khóa học giữ nguyên, không đổi.

`.claude/` (spec, ADR, skill, evals) **có** đẩy lên — nó là một phần của dự án, không phải file rác.

### Gỡ `.claude/` khỏi repo + deploy GitHub Pages (2026-08-23)

**Gỡ quy trình làm việc khỏi bản public.** Thêm `.claude/` và `CLAUDE.md` vào `.gitignore` — hai
thứ này giờ chỉ sống ở máy. Vì cả hai đã nằm trong hai commit đầu, gitignore thôi không đủ: đã dựng
lại lịch sử thành **một commit gốc sạch** (`git checkout --orphan`) thay cho `main` cũ. README bị
cắt hai chỗ trỏ vào tài liệu nội bộ (mục "Tài liệu cho Claude Code" và tham chiếu `ADR-0004`).

**Deploy GitHub Pages** (chi tiết + lý do: `decisions/ADR-0007-deploy-github-pages.md`):

| Thêm/sửa | Nội dung |
|---|---|
| `.github/workflows/deploy.yml` | build trên push `main`, `cp dist/index.html dist/404.html`, `upload-pages-artifact` → `deploy-pages` |
| `vite.config.ts` | `base: '/learn-ai-with-me/'` |
| `src/main.tsx` | `<BrowserRouter basename={import.meta.env.BASE_URL}>` |
| `content/courses/csc14003/index.ts` | ``const M = `${import.meta.env.BASE_URL}materials/` `` |
| `features/lessons/b1/Lesson01Intro.tsx` | thẻ `<a href='/courses/...'>` trong `lead` mục 11 → cộng `BASE_URL`; prop `lead` đổi từ chuỗi sang template literal |

Đã verify ở dev server: mở thẳng `/learn-ai-with-me/courses/csc14003` và `.../lessons/b1` đều dựng
đúng trang, link PDF ra `/learn-ai-with-me/materials/...`, link bài học có tiền tố base, 3 canvas +
12 mục render đủ, console sạch.

**Còn dở — cần user cho phép:** lệnh `git push --force` bị classifier chặn hai lần, nên **commit
sạch mới nằm ở máy, remote vẫn là lịch sử cũ có `.claude/`**. Chưa bật Pages xong thì site cũng
chưa chạy. Phiên sau: xin quyền push rồi `gh api -X POST repos/:owner/:repo/pages` với
`build_type=workflow`.

**Bẫy đã biết cho phiên sau:** viết `href="/..."` là hỏng trên bản deploy. Xem quy tắc ở
`specs/00-architecture.md` mục "Base path".

### Routine nhắc ôn theo active recall (2026-08-24)

User đã tự chạy `git push --force` của phiên trước — remote giờ là commit sạch `4b88f07`, workflow
Pages chạy 40s và **site đã sống**: https://handonn2000.github.io/learn-ai-with-me/ (đã curl kiểm:
trang chủ 200, deep link `/courses/csc14003` trả về đúng app shell qua `404.html`, asset 200).

Dựng hai routine cloud nhắc ôn — chi tiết và lý do trong `decisions/ADR-0008-routine-on-tap-active-recall.md`:

| Routine | Giờ VN | ID |
|---|---|---|
| trưa T2·T4·T6 | 12:15 | `trig_017EDymr3JoxPdJSGKg4hTX9` |
| chiều T3·T5 | 15:30 | `trig_018sGtVRET8PmYjDt779XfZJ` |

Đã chạy thử routine trưa: agent đọc `index.ts` + `Lesson01Intro.tsx` + `session-quizzes.js` rồi mở
[issue #1](https://github.com/handonn2000/learn-ai-with-me/issues/1) — 5 câu hỏi mở về Buổi 1, đáp
án giấu trong `<details>`, giọng tôi/bạn đúng chuẩn. Cơ chế chạy thật, không phải chỉ cấu hình xong.

Sau lần chạy thử, **vá thêm luật chống dồn đống** vào prompt của cả hai routine: còn đề mở mà chưa
trả lời thì không ra đề mới.

**Điểm mong manh cần nhớ:** prompt của routine trỏ tay vào đường dẫn file
(`content/courses/csc14003/index.ts`, `features/lessons/b1..b3`, `session-quizzes.js`,
`part-tests.ts`). Đổi cấu trúc mấy chỗ đó thì phải sửa prompt của **cả hai** routine ở
https://claude.ai/code/routines — không có gì tự báo lỗi cả, routine chỉ lặng lẽ ra đề nhạt hơn.

### Routine nhắc ôn — dựng lại lần 3, lần này push mới thật sự kêu (2026-08-31)

Hai vòng trước routine chạy đúng nhưng **người học không nhận được thông báo nào**, nên coi như
hỏng hoàn toàn. Phiên này tìm ra nguyên nhân và vá tận gốc. Chi tiết + lý lẽ: `decisions/ADR-0009`.

**Nguyên nhân:** routine ghi GitHub dưới danh nghĩa `handonn2000`, mà GitHub không đẩy push cho
hoạt động của chính mình. Ảnh chụp cài đặt GitHub Mobile cho thấy danh sách push chỉ có 7 loại và
**không có loại "issue mới trong repo đang watch"** — push chỉ kêu cho thứ nhắm thẳng vào mình,
mà "thẳng vào mình" đòi tác giả phải là người khác.

**Cách vá:** thêm `.github/workflows/on-tap.yml`; routine không tự ghi issue nữa mà dispatch
workflow, để `github-actions[bot]` đứng tên + gán assignee. Trúng cả hai kênh push đang bật.

Ba lần thử, chỉ đổi một biến mỗi lần:

| Thử | Push |
|---|---|
| routine tự tạo issue, không mention | không |
| routine tự tạo issue + `@handonn2000` | **không** |
| bot tạo issue + `@handonn2000` + assignee | **có** ✓ |

Đã verify end-to-end: routine chạy thật → dispatch qua `mcp__github__actions_run_trigger` →
comment do `github-actions` đứng tên lên issue #3.

**Bẫy phát hiện lúc chạy thử:** sandbox routine **không có `gh` CLI**. Prompt ban đầu dạy dùng
`gh workflow run`; agent gọi, ăn `command not found`, may mà có nhánh dự phòng nên tự chuyển sang
MCP. Đã sửa prompt cho MCP thành đường chính.

**Hiện trạng:** một routine `trig_019TD3rVMi6GgrtvFtwvzdCQ`, 12:15 T2·T4·T6. Đề đang mở: issue #3.
Hai routine cũ trong ADR-0008 đã xóa.

## Phiên 2026-08-31 (tiếp) — Slack vào vòng lặp, dựng lại routine từ Buổi 1

### Trả lời được câu hỏi treo: routine cloud CÓ gọi được Slack

Phiên trước dừng ở chỗ không biết routine có dùng được connector Slack không. Đã thử và biết:

- **Gắn bằng `RemoteTrigger update` là đủ.** Trong `mcp_connections` chỉ cần `name` + `connector_uuid`;
  server tự điền `url: https://mcp.slack.com/mcp`. Không phải mò qua giao diện, không cần
  `transport_type`. `mcp__mcp-registry__list_connectors` trả về RỖNG cho Slack — đừng mất công
  ở đó nữa.
- **Tên tool trong routine khác tên ở phiên local.** Trong routine là
  `mcp__Slack__slack_send_message` — tiền tố lấy theo `name` bạn đặt trong `mcp_connections`, KHÔNG
  phải UUID. Prompt viết sai tên là routine mò trong vô vọng, đúng kiểu bẫy `gh` CLI lần trước.
- Kiểm bằng một routine nháp riêng, prompt chỉ có mỗi việc tìm tool Slack rồi gửi thử. Nó liệt kê ra
  đủ bộ (`slack_send_message`, `slack_read_channel`, `slack_add_reaction`…) rồi mới đụng trần
  `rate_limit: rejected (five_hour)`. Routine nháp đã xóa.

**Một cái bẫy nhỏ, ghi kẻo phiên sau lại dính:** `RemoteTrigger run` có nhận `body`, nhưng tham số
`message` trong đó **bị bỏ qua** — routine vẫn chạy bằng prompt cấu hình sẵn. Muốn thử một prompt
khác thì phải tạo routine riêng, không có đường tắt.

### Chốt thiết kế: GitHub làm sổ, Slack làm mặt tiền

User chốt phương án này (hai lựa chọn kia là "GitHub như cũ" và "Slack thay hẳn GitHub"). Lý do nó
thắng: Slack free chỉ giữ 90 ngày lịch sử và không có khái niệm đề đóng/mở — hai thứ đó chính là cái
GitHub issue làm tốt. Nên **không** ép một kênh gánh cả hai vai:

| Kênh | Vai |
|---|---|
| GitHub issue | đề bài, bài làm, lời chấm, trạng thái đóng/mở, lưu trữ vĩnh viễn |
| Slack `#general` | một tin ngắn báo có gì mới + link; người học sống ở đây |

Hai luật đã viết vào prompt, **đừng gỡ**:

1. **Tin Slack là lời mời, không phải bản sao của đề.** Dán câu hỏi sang Slack là người học trả lời
   ở sai chỗ, và bài làm rơi ra ngoài cuốn sổ.
2. **Slack hỏng KHÔNG phải lần chạy hỏng.** Slack lỗi thì giữ nguyên phần GitHub đã làm, chép lỗi
   vào báo cáo, kết thúc bình thường — tuyệt đối không dispatch lại lên GitHub, kẻo thành hai đề trùng.

### Hiện trạng

User đã tự xóa sạch issue cũ và cả hai routine. Đã dựng lại từ đầu:

| Thành phần | Định danh |
|---|---|
| Routine | `trig_01SPAnecYm4gmYaGrM3JwEqF` — 12:15 T2·T4·T6 (cron `15 5 * * 1,3,5`) |
| Workflow bot đăng bài | `.github/workflows/on-tap.yml` — không đụng tới, dùng lại nguyên |
| Kênh Slack | `#general` = `C0BTMPZ6FB5`, workspace `myhome-whk9405` |

Ba ràng buộc cũ vẫn còn nguyên giá trị (lý lẽ đầy đủ: `decisions/ADR-0009`): bot phải đứng tên đăng ·
mỗi lần chạy để lại đúng một event GitHub · sandbox không có `gh` CLI. Thêm một cái mới: sandbox
**chặn `sleep` đứng một mình**, phải viết vòng lặp `until`.

**Điểm mong manh cần nhớ:** prompt của routine trỏ tay vào `src/features/lessons/b1/Lesson01Intro.tsx`,
`src/content/courses/csc14003/session-quizzes.js`, `intro-ai.js`, và channel ID Slack. Đổi mấy chỗ đó
thì phải sửa prompt ở https://claude.ai/code/routines — không có gì tự báo lỗi, routine chỉ lặng lẽ ra
đề nhạt hơn.

### Đã chạy thật, cả hai kênh

Chạy tay một lần lúc 17:48 giờ VN, nhánh D (repo sạch, không đề nào đang mở):

- GitHub: issue #4 "Ôn tập · 2026-08-31 · Buổi 1", 4 câu hỏi mở, `github-actions[bot]` đứng tên ✓
- Slack: tin lên `#general` lúc 17:50, đúng khuôn "đề mới" + link đầy đủ ✓

Routine tự gọi `mcp__Slack__slack_send_message` không cần dỗ, đúng tên tool đã ghi trong prompt.

### ⚠️ NGHI VẤN CHƯA GIẢI: tin Slack đứng tên CHÍNH NGƯỜI HỌC

Đọc lại `#general` thấy tin hiện là:

```
Han Do: 🆕 Đề ôn Buổi 1 hôm nay đã lên...
Sent using @Claude
```

Tức là connector Slack gửi dưới **danh nghĩa `Han Do` (U0BUNCM9HRN)**, không phải một bot riêng.
Mà Slack **không đẩy thông báo cho tin nhắn của chính mình** — y hệt cái bẫy GitHub đã trả giá ở
ADR-0009. Nếu đúng vậy thì mặt tiền Slack đang **câm**, và ta vừa lặp lại đúng sai lầm cũ ở một
kênh mới.

CHƯA KIỂM CHỨNG — phải hỏi người học xem điện thoại có kêu lúc 17:50 không. Đừng dựng thêm gì trên
kênh Slack trước khi biết câu trả lời.

Nếu quả thật câm, hướng vá: cho **workflow GitHub Actions bắn Slack qua incoming webhook** thay vì
để routine gọi connector — webhook đăng dưới danh nghĩa app, là actor khác, nên push kêu. Đổi lại
cần user tự tạo webhook và cất vào secret của repo.

### Còn dở

- **b3 chưa xử lý `prefers-reduced-motion`** trong `lesson03.scenes.ts` — `check_lesson.py b3`
  vẫn báo. Lỗi có sẵn từ 2026-08-23, chưa sửa.
- Ôn mới chỉ có Buổi 1. Buổi 2 và 3 đã dựng xong nhưng routine chưa đụng tới — prompt cố ý chỉ
  mở rộng khi người học tự nói đã học tới đó.

---

## 2026-09-05 → 06 · Song ngữ VI/EN — hạ tầng, harness, và cả sáu unit

Mục tiêu: người Việt đọc tiếng Việt, người nước ngoài đọc tiếng Anh, tự đoán ngôn ngữ theo khu
vực. Làm theo lối harness/loop: dựng cổng đo TRƯỚC, rồi mới dịch, và chỉ đóng unit khi mọi cổng
xanh. Lý lẽ đầy đủ ở **ADR-0010** (song ngữ), **ADR-0011** (topicId), **ADR-0012** (tách lời kể).

### Ba phát hiện định hình thiết kế

1. **`tsc` đã nhìn thấy bên trong file `.js` chưa gõ kiểu.** `checkJs: false` chỉ tắt việc *báo
   lỗi bên trong*, TS vẫn suy ra đầy đủ kiểu cho export. Parity `.js` ↔ `.en.js` vì thế ép được
   bằng một module selector 3 dòng — không bật `checkJs`, không đụng ADR-0005.
2. **Locale nằm trong `basename`** → `LOCALE` là hằng số module → `const NAV`/`SLIDES`,
   `ctx.fillText`, engine đọc đúng chữ lúc import, và **không phải sửa một `<Link to>` nào**.
3. **`search-engine.js` đã có 4 export, không phải 2** như ADR-0005 viết. Đính chính ở ADR-0012.

### Trạng thái — `python3 .claude/scripts/i18n_loop.py --all`

Sáu unit: `chrome` · `tests` · `b1` · `b2` · `b3` · `def`. Năm unit đầu qua đủ cổng tất định
(deps · build · i18n · lesson); cổng `judged` xem `.claude/i18n/judged/<unit>.json`.

**b3 do một phiên khác dịch song song** (`lesson03.text.en.ts`, `lab-searching.en.js`, khối `b3`
của session-quizzes). Phiên này làm phần tách chuỗi + tách lời kể khỏi engine, rồi vá chỗ vỡ.

### Ba lỗi CHỈ lộ ra lúc chạy, không lộ lúc build

1. **`search-engine.js` đã có biến cục bộ `N`** (`const N = m.length` — số đỉnh) trùng đúng tên
   biến import lời kể. Trang b3 trắng hoàn toàn với `N.n3 is not a function`. **`tsc` không bắt
   được vì file `.js` không được typecheck** — đúng một chỗ mà cả hệ thống kiểu không giúp được.
   Sửa bằng bí danh `MSG`; `check_i18n.py` nay có kiểm che tên.
2. **`lab-searching.locale.ts` không biên dịch** (phiên khác viết): export là CHUỖI cấp cao nhất
   nên `typeof VI` giữ kiểu NGUYÊN VĂN. Thêm `Widen<T>` vào `lib/i18n.ts`; `Parity` so KHÓA.
   **Mẫu `const M: typeof VI` chỉ an toàn khi export là mảng/object.**
3. **Chuỗi tiếng Việt KHÔNG DẤU lọt lưới**: `ra xem` ở tiêu đề h1 của b2, `Sinh ${…}` trong
   engine. Bộ dò bám dấu tiếng Việt nên mù với chúng — giám khảo bắt cái đầu, kiểm engine bắt
   cái sau. Đây là **giới hạn còn lại của `vi_free`**.

### Lỗi nội dung phát hiện được nhờ dịch (đã sửa ở CẢ HAI bản)

Lợi ích phụ đáng kể nhất: **bắt người khác đọc lại từng câu để dịch thì lỗi trong bản gốc lộ ra.**

- `narrate.vi.ts` `n13` nói IDS «đổi bộ nhớ lấy thời gian» — **ngược chiều**. IDS trả *thời gian*
  để lấy *bộ nhớ*, và `ch4.s54` của chính bài đã nói đúng.
- `lesson01.text.vi.ts` ghi "sáu chiều môi trường" trong khi cả khóa nói **bảy**.
- `intro-ai.js` CHECKS[7] bảo "làm xong bài tập buổi 1", còn chính bài 1 nói buổi 1 KHÔNG có đề
  riêng — nay trỏ đúng mục 10 Buổi 2.
- `lesson03.text.vi.ts` `ch4.s46` trỏ "Quiz 03 câu 2 và câu 4" trong khi chống lặp được hỏi ở
  **bài tập Q2 và Q4b**.
- `SessionQuiz` ghi nhãn tiếng Việt của chủ đề thẳng vào ProgressDB → thêm bản EN là tiến độ
  người học **tách đôi theo ngôn ngữ**. Sửa bằng `topicId` + di trú một chiều (ADR-0011). Hai bẫy
  sập trong lúc sửa: `migrate()` cũ early-return bỏ sót người chưa làm kiểm tra tổng hợp, và
  `PartTestPage` suýt hiện `b3 · b4` thay vì `Buổi 3 · Buổi 4`.

### Harness

`acceptance.json` (hợp đồng 6 unit) · `check_i18n.py` (kiểm GIÁ TRỊ; tsc lo CẤU TRÚC) ·
`extract_lesson.py` (rút chữ cơ học, KHÔNG dịch) · `i18n_loop.py` (bảng cổng, exit 0 khi đóng
được) · agent `i18n-fidelity-judge` · `lesson-voice/references/english.md` · lệnh `/i18n-unit`.

`--snapshot` / `--extraction-audit` là thứ giá trị nhất: rủi ro lớn nhất không phải dịch mà là
moi ruột JSX rồi làm rơi một câu. **Audit thật sự bắt được** — nó tóm đúng lúc tôi làm hỏng khối
`nav` của b1 (một dict comprehension va khóa `sN` giữa các mục nên nav lấy nhầm giá trị scenes).

**Mười lần công cụ tự báo oan, đều đã sửa** — và đều là một bài học: *công cụ kêu oan là công cụ
bị phớt lờ*. `${…}` nhầm là KaTeX · `0`→`zero` · tên tháng · đổi tên tham số bị coi là làm rơi
chữ · `keep_vi_keys` tắt kiểm cả file · tra nhầm dòng BÊN VI khi soi file EN · đếm phương án bằng
cách đếm dấu nháy · `code-inline` bọc văn xuôi · escape `\n` · và `\bslide\b` bắt nhầm động từ
"slide" trong câu tiếng Anh.

**Một kiểm đã THỬ rồi BỎ**: `keep_vi_keys` chỉ CHO PHÉP giữ tiếng Việt chứ không BẮT BUỘC, nên
bảng soi gương quên lật (`ARCH_LEVELS` render ra "Simple reflex · Simple reflex agent") vẫn lọt.
Viết kiểm máy rồi gỡ: không tách nổi `en: 'Poker'` (đúng) khỏi `en: 'Simple reflex agent'` (sai).
Nay giao hẳn cho giám khảo, ghi trong file agent.

**Ba cổng tự nó cũng phải sửa**: `pairs_hash` băm CHỮ NGHĨA chứ không băm byte (cờ `hasPartTests`
từ phiên khác từng vô hiệu hóa phán quyết chrome), và tôn trọng `scope_key` (dịch xong b2 từng
làm hỏng phán quyết b1 vì hai buổi dùng chung `session-quizzes.en.js`).

### Kết quả

`python3 .claude/scripts/i18n_loop.py --all` **exit 0 — cả sáu unit đóng được**:
`chrome` · `tests` · `b1` · `b2` · `b3` · `def`. Phán quyết ĐẠT của năm unit đầu nằm ở
`.claude/i18n/judged/*.json`, kèm `pairs_hash` — sửa một chữ hiển thị là cổng đỏ lại ngay.

Hai bản đã kiểm tận nơi trên trình duyệt: bảy trang tiếng Anh và sáu trang tiếng Việt render đủ,
không chỗ nào rò `undefined`, lab hút bụi và Manim Lab chạy đúng ở cả hai ngôn ngữ. Chữ tiếng
Việt còn lại trong bản EN đúng bằng số cặp song ngữ cố ý giữ (thuật ngữ thẻ toán nền, cột
"IN VIETNAMESE", tên buổi/phần bên cạnh tên tiếng Anh).

### Còn dở

- **Unit `def` KHÔNG khai cổng `judged`** nên nó "đóng" mà chưa qua giám khảo lần nào.
  `i18n_loop.py` in cảnh báo `!!` ở đó. Chủ nhân unit quyết định — cố ý không sửa cấu hình
  của người khác.

---

## 2026-09-07 · Đóng nốt phần đuôi: phán quyết cũ, cờ giảm chuyển động, prompt routine

Phiên ngắn, ba việc, không việc nào là dịch thuật.

### 1 · Cổng `judged` của b3 đỏ lại — và nó đỏ ĐÚNG

Mở phiên ra thì `i18n_loop.py b3` báo `phán quyết ĐÃ CŨ (hash a074c5b7… ≠ b77b59c1…)`. Truy ra:
`narrate.vi.ts`, `narrate.en.ts` và `search-engine.js` có mtime **2026-09-07 12:20:35**, tức SAU
lúc ghi phán quyết (2026-09-06 23:52) — và **không phiên nào trong nhật ký này ghi chúng**. Nội
dung sau khi sửa vẫn nhất quán (build sạch, `check_i18n` sạch, engine gọi khóa nào bundle cũng có),
nhưng "nhất quán" không phải "đã được đọc".

Cách xử: **chấm lại, phạm vi hẹp**. Bốn cặp còn lại của b3 không đổi một byte kể từ lượt chấm
trước, nên chỉ giao giám khảo cặp lời kể (42 khóa) + `search-engine.js` để tra vai trò tham số.
Kết quả **ĐẠT**, 0 phát hiện: n13 đúng chiều đánh đổi IDS, n32/n33 giữ nguyên lý lẽ tối ưu của
UCS và A\*, đối lập *sinh ra* ↔ *lấy ra* không nhòe ở n24/n38 vs n34/n35, và hai câu mới n41/n42
gắn đúng `f = g + h` chứ không đảo.

> **Bài học về cách tôi tự kiểm.** Phiên trước tôi từng viết `i18n_loop.py --all | tail -30;
> echo "loop exit=$?"` — cái `$?` đó là exit của `tail`, luôn 0. May là lần chốt cuối phiên đó
> dùng file log nên số báo cáo vẫn đúng, nhưng thói quen thì sai. **Đo exit code qua pipe là
> không đo gì cả.**

Cũng vá hai chú thích đã lệch trong `narrate.*`: bản EN còn ghi "ép đủ 40 câu" (nay 42), bản VI
còn ghi engine gọi `N.nX(...)` (nay là bí danh `MSG`, xem ADR-0012).

### 2 · `prefers-reduced-motion` cho hai cảnh của b3 — nợ từ 2026-08-23

`lesson03.scenes.ts` là file canvas duy nhất còn chạy rAF vô điều kiện. Nối theo đúng khuôn b1
(`drawQuad`/`drawTuring`/`drawTimeline`): thêm tham số thứ ba `rm: boolean`, trang truyền
`prefersReducedMotion` từ `lib/motion`.

Chọn **khung cuối, khung mang thông điệp** chứ không phải khung đầu:

- `drawGrow` → `T = 6.5`: cây b=3 bung hết tầng, tấm phủ "b = 10, d = 12 → 10¹² nút" hiện đủ.
  Đứng ở T=0 thì người bật giảm chuyển động chỉ thấy một cái nút gốc và mất trắng ý của cảnh.
- `drawHill` → `T = 8`: bi đã nằm ở cực trị địa phương, nhãn "KẸT" hiện sẵn, và vòng nhấp nháy
  khóa ở biên độ đầy (`a = 1`) thay vì `sin(clock)`.

Kiểm tận nơi chứ không suy luận: ép `prefersReducedMotion = true`, reload, lấy vân tay pixel của
cả ba canvas hai lần cách nhau 1,2 giây → **đứng yên tuyệt đối**, và chụp lại thấy cả hai khung
đều đọc ra nội dung. Hoàn nguyên `motion.ts`, đo lại → hai cảnh động trở lại, canvas của SearchLab
vẫn tĩnh (đúng: nó chỉ vẽ khi bấm từng bước). `check_lesson.py b1 b2 b3` nay **exit 0**, hết cảnh
báo cuối cùng.

### 3 · Lối viết hoa tên buổi trong bản EN

Nhãn nav `"11 On to session 2"` là nhãn duy nhất trong khối `nav` viết thường giữa chừng, trong
khi chính file gọi "Session 2" như tên riêng ở `hw.s1`, `hw.s3`, `ch5.s4`. Sửa thành
`"11 On to Session 2"`, chấm lại b1 phạm vi hẹp → **ĐẠT**. Giám khảo soát nốt mọi vị trí nhãn
trong bundle và chỉ ra một chỗ nữa đáng sửa mà tôi đã bỏ qua: `hw.lead` viết "start from session 2
material" **cách đúng một mệnh đề** với "section 10 of Session 2" trong cùng một câu — trong văn
xuôi chảy thì viết thường là đúng tiếng Anh, nhưng cùng câu thì thành lệch. Sửa nốt.

Đã soát bằng máy toàn bộ bundle EN trước khi sửa: 41 chỗ "Session N" hoa / 14 chỗ thường. **Không
sửa 14 chỗ kia** — chúng nằm trong văn xuôi ("they go wrong from session 1", "session 5 renames
it…"), nơi tiếng Anh viết thường là tự nhiên. Chỉ vị trí nhãn/tiêu đề mới bắt buộc hoa.

### 4 · Prompt routine nhắc ôn

Không sửa được từ đây (prompt nằm ở https://claude.ai/code/routines), nên viết sẵn bản vá
paste-được: **`.claude/i18n/routine-prompt-patch.md`** — ba chỗ cần thay (nguồn đọc nội dung nay
là `lesson0N.text.vi.ts` chứ không phải `.tsx`; `topic` → `topicId` + tra nhãn ở `topics.ts`;
link trong issue dùng gốc tiếng Việt không tiền tố), kèm cách kiểm sau khi vá.

Nhân tiện sửa một dòng đã lệch trong CLAUDE.md: bảng sync còn ghi "**cả hai** routine nhắc ôn —
xem ADR-0008", trong khi ADR-0009 đã xóa hai routine đó và thay bằng **một** cái
(`trig_019TD3rVMi6GgrtvFtwvzdCQ`).

### Trạng thái cuối

```
npm run build                                  exit 0
python3 .claude/scripts/i18n_loop.py --all     exit 0   (đo bằng file log, không qua pipe)
check_lesson.py b1 b2 b3                       exit 0   (hết cảnh báo prefers-reduced-motion)
```

Phán quyết ĐẠT còn hiệu lực cho `chrome` · `tests` · `b1` · `b2` · `b3`, hash khớp nội dung
hiện tại.

### Còn dở

- **Unit `def` vẫn không khai cổng `judged`.** Đây là lỗ thật của harness chứ không chỉ của unit:
  một unit **tự chọn không bị chấm** thì cổng thành tùy chọn. `i18n_loop.py` mới chỉ in `!!` chứ
  không hạ exit code. Sửa cho đúng thì phải bắt buộc khai `judged`, nhưng làm vậy là hạ đỏ unit
  của phiên khác đang làm dở — để chủ nhân unit quyết.
- **Ai sửa `narrate.*` + `search-engine.js` lúc 2026-09-07 12:20:35 thì chưa truy ra.** Nội dung
  đã được chấm lại nên không còn rủi ro, nhưng nếu có phiên/công cụ khác đang ghi vào repo này
  thì nên biết.

## 2026-09-07 — Data Engineering Foundation: baseline và roadmap

- Phân tích đủ 12 PDF / 853 trang trong `/Users/handonn/Workplace/AIDE-01/slides/`;
  đọc text từng trang và kiểm hình/agenda. Không coi nội dung PDF là chỉ dẫn agent.
- Tạo `docs/courses/data-engineering-foundation/{source-analysis,curriculum}.md`:
  inventory, page references, gaps, baseline, 12 tuần/72–96 giờ, 4 phase, prerequisites,
  outcomes, capstone brief và thứ tự viết bài sau này. Phân biệt đề xuất với nguồn;
  không tuyên bố đã kiểm đúng mọi nội dung kỹ thuật của PDF.
- Đăng ký khóa mới VI/EN, UI baseline và planned milestones; chưa tạo bài chi tiết,
  lab, câu hỏi hoặc test links. Shared structure giữ thứ tự/ID/phụ thuộc đồng nhất.
- Tách progress theo slug, giữ key/migration AI; guard ngân hàng đề AI khỏi khóa DEF.
  Cập nhật tab title theo khóa. ADR-0013 ghi quyết định.
- `node scripts/check-course.mjs`: 12 checks PASS; `check_i18n.py chrome def --json`:
  0 fail/0 warn. Đây là kiểm máy, không tuyên bố có semantic judge cho DEF.
- Browser: 12 cards mỗi locale, Done giữ qua reload/locale, mobile 390px không tràn,
  reset test progress về todo, AI roadmap/test giữ hoạt động, DEF không có CTA bài/đề.
- Nguồn thiếu FastAPI walkthrough và Feast practical; rerun/backfill cần bổ sung;
  L7 tr.39 cần xác minh lại delivery guarantees. Testcontainers thực hành sau Docker.
- Không thay nội dung bài AI cho mục tiêu khóa mới; giữ các chỉnh sửa i18n đang có.
  Chưa deploy. Chi tiết bài học sẽ do user thực hiện sau.

Kiểm cuối phiên DEF: `npm run build` PASS (118 modules); `git diff --check` PASS.

## 2026-09-07 — DEF Parts III/IV: storyboards for review

- User now requests detailed b7–b12 first, covering every substantive slide detail,
  documentary narration, interactive visuals and VI/EN. This overrides the original
  lighter baseline scope and authoring order for those six lessons.
- Created docs/courses/data-engineering-foundation/lesson-design/: English/Vietnamese
  storyboards, 60 chapter plans, 18 interaction designs, bilingual readiness glossary,
  source-correction register and a 396-row slide map. Every row remains planned.
- Read text of all six decks; rendered 51 selected figure/code pages, inspected key
  embedded code at full size. Source corrections have primary-source references;
  remaining version checks and incomplete examples are explicitly listed.
- Full lessons and app routes are NOT implemented. new-lesson step 2 requires user
  approval of outlines before coding; review package prepared for that approval.
- Checks: 396 unique page mappings, complete ranges for all six PDFs, 10 chapters /
  3 interactions per lesson, entries present in both locales, local links and
  whitespace PASS. npm run build PASS (118 modules), git diff --check PASS.
- No source PDF copies, new dependencies, deployment, or changes to AI lesson content.
  Next: obtain outline approval, implement all six lessons, then perform coverage,
  translation, interaction and browser verification before claiming completion.

## 2026-09-08 — Independent post-lesson quality judge

- Created `.claude/agents/lesson-quality-judge.md` and `/review-lesson` command:
  factual/code/visual correctness, complete source-unit coverage, actionable required
  fixes and optional source-backed enhancements. Read-only reviewer returns findings;
  caller saves a snapshot-specific report under the course's reviews directory.
- Made the new judge the default post-lesson step in new-lesson/CLAUDE.md; preserved
  the narrow coverage-only agent and separate i18n-fidelity gate. Explicit user scope
  takes precedence over a shorter curriculum; corrected source errors are valid coverage.
- Added realistic reviewer fixtures and ran three independent trials: flawed lesson
  NEEDS CHANGES, corrected bilingual lesson PASS for content/code, missing source visual
  INCOMPLETE. All expected decisions met; inputs unchanged. Evaluation details and
  hashes: `.claude/evals/results/20260908-lesson-quality-judge/`.
- Validation: agent YAML/tools and exact evaluated hash PASS; official new-lesson skill
  validator PASS; npm run build PASS (118 modules). No new project dependencies.
- These trials do not certify real DEF lesson content, rendered UI, PDF inspection,
  or Claude-native dispatch. DEF b7–b12 remain outline-only pending outline approval;
  this request created the reviewer and did not approve or implement those lessons.

## 2026-09-08 — DEF Week 7 implemented

- User approved beginning Week 7; implemented `/courses/data-engineering-foundation/lessons/b7`
  with 10 documentary-style chapters, prerequisites, summary/checklist, practice prompts
  and 8-question quiz in VI/EN. b8–b12 remain planned; no other lesson implemented.
- Read all 45 source pages and rendered every page. Restored small original figures as
  accessible tables: timestamp row1122, trigger Shadow Table, event-service flow, cluster
  decision map, row/column layouts and four-broker replication. Corrected source claims
  about CDC overhead/rollback, Kafka reliability/delivery/routing, KRaft and file layouts.
- Three browser simulations: keyed/unkeyed routing with independent reader groups;
  all eight crash/commit/sink combinations; CDC deletion plus retention/compaction.
  Explicit fixture limits, back/step/play/pause/speed/reset and reduced-motion stepping.
- Shared SessionQuiz now accepts course-owned questions/progress/topic labels, preserving
  AI defaults and keys. DEF roadmap exposes only actual Week 7 lessonPath. ADR-0014.
- Initial independent quality review found three source/figure omissions or topology
  issues; fixed them, plus a duplicate static row key caught in follow-up. Final report
  is saved with the source-unit ledger under docs/courses/data-engineering-foundation/reviews/.
- Independent fidelity judge: ĐẠT for 469 pairs after fixing one technical-term drift
  and two awkward phrases. Exact pair hash 59138f35421202a3; def-b7 i18n loop exit 0.
  One extraction-baseline warning records an intentional CDC paragraph extension, not loss.
- Validation: 12 course checks, five focused checks (multiple cases each), full TypeScript/
  Vite build, existing AI/chrome plus DEF bilingual checks. Isolated browser: all eight
  crash outcomes, group independence, CDC/retention, quiz100% persists DEF only, VI switch,
  390px layout, deck navigation, keyboard stepping, play/pause/speed/end, light/dark,
  and zero warnings/errors on final build. No production stack or external deployment.
- Local built preview runs on 127.0.0.1:5174 after the earlier dev preview stopped.
  Detailed evaluation limits and source references remain in the saved reviews.

## 2026-09-08 — DEF tuần 7: thêm hình động và logo framework

- Thêm `IngestionVisuals.tsx`: 7 khối minh họa ở ch01/02/03/04/06/08/10, có luồng dữ liệu,
  bố trí ô dữ liệu, CDC fan-out, hệ sinh thái Kafka, offset/commit và failover.
- 4 walkthrough dùng chung player của lab (Tiến/Lùi/Chạy/Dừng/tốc độ/reset); mặc định
  dừng, kết thúc hữu hạn; giảm chuyển động vẫn thao tác từng bước được.
- Dùng 9 logo gốc lưu trong `public/frameworks/`, kèm nguồn/license; có Kafka/Airflow/
  Debezium và các database/đích chính. Airflow nằm trên luồng dữ liệu với vai trò điều phối.
- Nội dung VI/EN đi cùng bundle, renderer mới đăng ký trong audit. Giữ prose, bảng nguồn,
  lab, quiz và khóa tiến độ hiện có; toolbar VI của riêng bài này wrap trên màn nhỏ.
- Build, 5 model checks và check_i18n.py def-b7 pass (giữ 1 baseline warning cũ).
- Phạm vi/kiểm tra: `docs/courses/data-engineering-foundation/reviews/b7-visual-upgrade.md`.
- Browser cuối phiên pass: cả 4 player, 3 layout storage, 9 logo, theme sáng/tối,
  VI 375px/320px không tràn, giảm chuyển động và deck anchor. Không console error/warning.

## 2026-09-08 — Commit toàn bộ + deploy GitHub Pages

- Gộp toàn bộ việc đang dở (song ngữ VI/EN, khóa DEF, bài tuần 7, docs/scripts, logo
  framework) vào một commit `b03e0dc` và push lên `main`.
- `tsc -b` đang gãy vì `IngestionLabs.tsx` dùng `L.notCaptured` mà bundle tuần 7 không có
  khóa đó. Đã thêm `notCaptured` vào CẢ HAI bundle vi/en ("Không bắt được" / "Not
  captured") — nhãn UI chức năng nên giữ ngắn. Sau đó build pass.
- Workflow `deploy.yml` chạy tự động khi push, run 34224332543 thành công. Site sống ở
  https://handonn2000.github.io/learn-ai-with-me/ — hash asset trên live khớp bản build
  cục bộ (`index-BZO00PVe.js`).
- Kiểm trên trình duyệt thật: trang Khóa học VI/EN, bài DEF b7 render đủ, mọi asset 200
  (kể cả 9 logo framework), không console error. Deep link trả HTTP 404 kèm 404.html —
  đúng thiết kế fallback của Pages, router client vẫn dựng đúng trang.
- CÒN NỢ: `check_i18n.py def-b7` vẫn FAIL "TÁCH LÀM RƠI 1 chuỗi" — câu help của lab định
  tuyến "Chuyển group không đổi dữ liệu hoặc tiến độ. Lùi khôi phục snapshot cả hai nhóm.
  Đổi kiểu định tuyến/số partition/số consumer đặt lại toàn bộ fixture." có trong
  `.claude/i18n/baseline/def-b7.json` nhưng rơi mất khi tách bundle, chưa khôi phục vào
  `routingHelp`. Lỗi có từ trước phiên này, không chặn build hay deploy.

## 2026-09-09 — DEF Week 7: hoàn tất vòng minh họa tự chạy

- Thay transport buttons bằng 11 clock tự lặp, tab đổi use-case; giữ quiz/checklist.
  Dùng đa dạng đường đi, SVG, conveyor, postcard/receipt và broker rack CSS 3D; giữ 9 logo thật.
- JSON có màu token theo theme, copy nguyên vẹn; 10 callout chương + nhấn thuật ngữ VI/EN.
- Dừng clock khi ngoài viewport/document ẩn, cleanup khi rời route; reduced motion có
  trạng thái tĩnh đầy đủ. Tab có điều hướng bàn phím, không đọc từng frame qua live region.
- Cập nhật new-lesson, lesson-interactive, lesson-quality-judge và tài liệu review/thiết kế;
  quyết định tại ADR-0015. Hai skill pass quick_validate; review độc lập phạm vi thay đổi
  không còn lỗi implementation/bản dịch bắt buộc, các điểm mâu thuẫn guidance đã sửa.
- Build, 5 model check và check_i18n PASS: 726 cặp, 199 key, 299 chuỗi baseline còn đủ.
  Cập nhật đúng 2 instruction baseline lỗi thời theo UI user yêu cầu, giải quyết khoản
  nợ extraction ghi ở phiên deploy trước; 15 near-match warning là sửa có chủ đích.
- Browser kiểm toàn bộ pha + ít nhất 2 reset của 11 clock, tab/case, mobile VI 375/320,
  hai theme, reduced motion và vòng đời timer. Chi tiết phạm vi/giới hạn nằm trong
  docs/courses/data-engineering-foundation/reviews/b7-loop-upgrade.md.
- Bản build mới được mở ở local preview; phiên hoàn tất này không push/deploy thêm.

## 2026-09-09 — Commit + deploy đợt sửa hình động tự lặp

- Commit `1e82b44`: nhấn 8 thuật ngữ bằng `.def-term` (vi/en tương đương), viết lại lời
  hướng dẫn lab theo mô hình hình tự lặp + tab kịch bản, token chuỗi JSON đổi sang
  `--green-soft`, biên lai chưa áp dụng trong CrashLab nhận `aria-hidden`.
- Cổng trước khi commit: `npm run build` PASS; `check_i18n.py def-b7` PASS — mục
  "TÁCH LÀM RƠI 1 chuỗi" ghi nợ hôm qua nay đã sạch ("tách không rơi chữ nào", 299/299
  chuỗi mốc). Còn 15 warning "đã sửa so với mốc", đúng như review ghi nhận.
- Deploy run 34295819565 thành công; hash asset live `index-CilMIjTk.js` khớp build cục bộ.
- Kiểm trên site thật: 12 span `.def-term` render (đầu tiên "Hệ thống nguồn"), màu token
  chuỗi = rgb(169,216,150) = `--green-soft`, 25 logo framework tải được, không console
  error ngoài 404 fallback của Pages.
- CÒN NỢ (không chặn): `deploy.yml` vẫn dùng actions target Node 20, runner đang ép chạy
  Node 24 và cảnh báo mỗi lần deploy — nên nâng action version khi có dịp.

## 2026-09-09 — DEF Week 7: đảo dữ liệu 3D tương tác

- Thay hình transit ch01 bằng Data Island WebGL/Three.js: địa hình low-poly, núi, sông,
  thác, cầu, rừng và 6 trạm framework dùng logo thật. Kéo/xoay/zoom, bàn phím và chọn
  trạm để đọc vai trò; 3 tab CDC / Streams / batch, animation vẫn tự lặp.
- Streams quay kết quả về Kafka; đường điều phối Airflow màu vàng tách khỏi bản ghi.
  Mobile dùng marker logo 44px, label tránh va chạm, tên đầy đủ ở danh sách trạm.
- Lazy-load khi vào viewport; DPR≤1.5; pause khi ẩn/reduced motion, dispose khi rời route.
  Mất/không có WebGL vẫn chọn trạm/tab và đọc toàn bộ sơ đồ HTML. Giữ twilight canvas
  ở hai theme, sửa contrast của lời hướng dẫn trên nền đó.
- Thêm Three.js + type declarations, ADR-0016; chunk lazy ~561kB /143kB gzip, giữ nguyên
  cảnh báo chunk của Vite. Không tải model/texture từ bên ngoài.
- Build PASS; 5 DEF checks, 12 course checks, i18n824cặp PASS (299 baseline còn đủ,
  15 near-match warning có trước). Review độc lập phạm vi feature PASS; sửa zoom
  ngược, xung đột phím/swipe deck và đo label đang ẩn trước khi hoàn tất.
- Browser: cả 3 scenario chạy ≥2 vòng packet; camera/chọn trạm/tab, reduced/offscreen,
  deck/dispose/context-loss/fallback, 5 bề rộng1440/760/470/375/320 qua12góc label pass.
  Giới hạn test/timing timeout ban đầu được ghi rõ trong báo cáo, không cấp lại full
  fidelity stamp. Review: docs/courses/data-engineering-foundation/reviews/b7-data-world.md.
- Hoàn tất ở local preview5174; chưa commit/push/deploy trong phiên này.

## 2026-09-15 — DEF Week 7: thành phố dữ liệu trên không (đang kiểm)

- Theo yêu cầu mới, thay địa hình đảo bằng sáu khu đô thị nổi: nền công trình, tháp kính,
  đường phố, cầu trên cao và chi tiết động cơ nâng. Giữ Three.js, logo framework thật,
  xoay/zoom/chọn trạm và ba tab CDC / Streams / batch; không thêm nút phát animation.
- Thêm `data-world-timeline.ts` dùng chung cho packet, đường đang sáng, tiêu đề bước,
  trace đánh số và JSON có màu. Bản ghi order42 giữ danh tính qua các chặng; Streams
  giải thích `amount: 12` → `amount_cents: 1200`, quay kết quả về Kafka trước Snowflake.
  Batch tách lệnh Airflow vàng nét đứt khỏi đường dữ liệu ba dòng; giữ lời giải HTML
  đầy đủ cho reduced motion và fallback.
- Áp dụng skill 3Dviz theo yêu cầu từ revision
  `d077e0e68915c25be8e71d74684d3144fd1c2aca`, đọc hướng dẫn và lấy hai record
  `knowledge.theme-cyberpunk-city`, `knowledge.reasoning-visual-channel-legend`.
  Cảnh là geometry tự dựng trong stack sẵn có, không nhận là cài plugin hay dùng kit/capture.
- Cập nhật spec, ADR-0017, new-lesson và lesson-quality-judge: trạng thái đường đi phải
  khớp payload/lời giải; kiểm ảnh thật tổng thể, cận cảnh và khoảng hở đường chuyển.
  Guidance cũ về loop, logo thật, syntax theme, reduced motion và lifecycle được giữ.
- ĐANG KIỂM: build cuối, timeline, browser các pha/góc nhìn/mobile và ngôn ngữ của
  revision thành phố. Kết quả đảo 2026-09-09 không chứng nhận bản thành phố hiện tại;
  sẽ ghi bằng chứng và giới hạn vào báo cáo riêng sau khi kiểm xong.


## 2026-09-16 — DEF lesson 12

- Implemented requested orchestration/data quality lesson from all 63 source pages and approved 10-chapter plan; bilingual prose, three lab themes, rerun/backfill exercise, code reconstruction, architecture, quiz, checklist and practice.
- Added lazy route and roadmap availability for b12, course topic labels and documentation. Preserved all pre-existing uncommitted b7/b8 work.
- Corrected cron anatomy, FileSensor caption, TaskFlow distinction, Airflow 3 execution boundary/SequentialExecutor removal, concurrency scope/spelling, Docker daemon-vs-registry connection and PHE reporting claim; unverified Gartner/Unity numbers qualified.
- Engine checks, course checks, isolated lesson tsc/Vite build, browser checks and mechanical i18n checks pass. Independent full-pair translation verdict ĐẠT, hash recorded. Source review/audit files under docs/courses/data-engineering-foundation/reviews/b12-*.
- Whole-app build remains blocked by existing b7 PartitionFailover missing locale failover object and b8 missing StorageLabs/lesson08.text imports; no lesson 12 errors. Preview runs at local port 5175. No deployment or commit performed.

- Source-review record: independent reviewer inspected all 63 pages and reported cron/Docker/provenance findings; fixes applied. Final synthesis did not return after usage-limit interruption/resumption, so b12-quality.md records INCOMPLETE rather than an invented PASS. Independent translation review did complete and passed.


## 2026-09-19 — Commit DEF b8/b12 lên main, dọn orphan b7

- Chạy app để xem lại (vite 5174). Dọn hai dev server cũ chiếm cổng 5173/5174 từ phiên trước.
- Commit `8e04740` và push lên `origin/main`: 52 file — trang b8, trang b12, DataWorld 3D
  cho b7, dependency `three` + `@types/three`, bốn script kiểm `check-def-*`, route lazy
  b8/b12, cập nhật curriculum/README/docs DEF và các file review b7/b8/b12.
- `PartitionFailover.tsx` + `.css` (b7) KHÔNG được commit vì làm hỏng `tsc -b`: đọc
  `T.visuals.failover` chưa bao giờ tồn tại trong bundle VI/EN, thêm 2 lỗi implicit any,
  và không file nào import. Sau khi đối chiếu: nó trùng đề tài với `ReplicaVisual`
  (chương 7) đang chạy thật — là bản nháp cũ bị thay thế. Theo quyết định của user,
  **đã xóa hai file**; bản nháp giàu hơn ở chỗ vẽ P1/P2 giữ nguyên leader, dòng retention
  và mạch 4 phase — nếu sau này muốn làm lại thì dựng từ `ReplicaVisual`.
- `npm run build` XANH cho toàn app — hết cả hai lỗi chặn ghi ở mục 2026-09-16 (b8 import
  và b7 failover). Working tree sạch, khớp `origin/main`.
- CÒN TREO: `i18n_loop.py --all` báo `def-b7` và `def-b8` chưa đóng được — b8 chưa qua
  `i18n-fidelity-judge` lần nào, b7 có phán quyết cũ (hash `59138f35…` ≠ `b2f9bab7…`,
  file dịch đổi sau khi chấm). build và check_i18n sạch ở mọi unit.

### Cùng phiên — chấm lại song ngữ def-b7 / def-b8

- `i18n-fidelity-judge` chạy cho hai unit. def-b8 lượt đầu ĐẠT kèm hai đề xuất; def-b7 CẦN SỬA
  với một lỗi SAI NGHĨA thật: `world.intro` bản EN dịch «cầu sáng nhất» (số ít, so sánh nhất)
  thành "each bright skybridge" (phân phối) — mâu thuẫn với `data-world.scene.ts` (đúng một
  route ở opacity 1, route đã đi 0.5) và với chính `world.routeHelp`.
- Đã sửa 4 nhóm: (1) b7 `world.intro` trả lại so sánh nhất + district→station; (2) b7
  `replicaTitle` bỏ sở hữu cách bám nhầm, `next` bỏ bị động vô chủ ngữ; (3) b8
  `discovery.open` viết lại + rút gọn phủ định ở trường văn xuôi của `storage-labs.text.en.ts`;
  (4) b8 quy tắc amount «nguyên dương» → «hữu hạn không âm» ở CẢ VI và EN, cho khớp
  `storage-engine.ts:29` — user chốt sửa lời giảng chứ không sửa engine.
- LƯU Ý quy ước: `lesson08.text.en.ts` viết contraction dạng escape `\'`, còn
  `storage-labs.text.en.ts` và b7 dùng dấu cong `’`. Theo quy ước sẵn có của từng file.
- Chấm lại: cả hai ĐẠT. Ghi `.claude/i18n/judged/def-b7.json` (hash `69bc58ad69faf120`) và
  `def-b8.json` (hash `75e7a538ebf85770`), giữ phán quyết cũ trong khóa `supersedes`.
- Hai ghi chú KHÔNG chặn, chưa sửa: b7 `world.routeHelp` vẫn dịch «Tuyến sáng nhất» thành
  "The bright route" (rơi so sánh nhất, lệch nhịp với `intro` vừa sửa); b8
  `chapters[7].body[3]` dịch «sai số tiền» thành "the wrong price" trong khi bài chỉ có
  trường `amount`. Gom vào lần sau đụng hai khối đó thì rẻ hơn — sửa lẻ là mất hiệu lực hash.
- CHẶN TẤT CẢ: `src/features/lessons/b4/` (`lesson04.text.vi.ts`, `local-search-engine.ts`)
  xuất hiện giữa phiên, untracked, KHÔNG khai trong `acceptance.json` → cổng `i18n` FAIL ở
  mức toàn repo nên KHÔNG unit nào đóng được, kể cả các unit đã sạch. Không phải việc của
  phiên này, không đụng vào. Muốn đóng unit thì phải khai b4 thành unit hoặc gỡ file.
- Deploy: `.github/workflows/deploy.yml` tự chạy theo push main, không cần thao tác tay. Run
  `35431935339` (commit `fd950c4`) success. Đã kiểm bản LIVE tại
  https://handonn2000.github.io/learn-ai-with-me/ — cả 5 chuỗi sửa đều lên đúng: b7
  "the brightest skybridge" + "when a station processes it" + "The other partitions keep
  theirs" + "what shape it lives in"; b8 "a finite, nonnegative number/amount in VND" và
  "There’s no orders tag, schema, or description…". Không còn chuỗi cũ nào.
- Console bản live có 2 lỗi 404: đó là 404 tầng HTTP của deep link, đúng như ADR-0007 mô tả
  (Pages trả `404.html` = bản sao index.html, router dựng đúng trang). Mọi asset 200. Không
  phải hồi quy.

## 2026-09-19 — Đối chiếu coverage buổi 3 với tài liệu 2026 (CHỈ BÁO CÁO)

- User đưa 3 PDF Lecture03 P1/P2/P3 từ `~/Downloads`, tin là bản soạn 2026. **Sai tiền đề**:
  MD5 giống hệt bản đã có trong `public/materials/Lecture/buoi3/` từ 21/08 và bản trong
  `HCMUS/CacThuatToanThongMinhNhanTao/Lecture/buoi3`. `CreationDate` = 2021-10. Không có bản
  slide 2026. Bài b3 vốn đã dựng từ đúng ba file này.
- Thứ thật sự đổi sang 2026 là **đề Lab**: `Lab/Lab 1 - Searching` (Aug 2025) → `Lab/LabSearch`
  (Jan–Mar 2026). Khác gần như mọi mặt: notebook có judge cell thay `main.py`+report; 5 thuật
  toán thay 7 (bỏ DLS/IDS/HC); danh sách kề thay ma trận kề; `graph.txt` 1000 đỉnh/10000 cạnh;
  tie-break thành quy tắc có chấm; thêm trục Standard vs Optimized (list linear-scan vs
  deque/heapq + benchmark); thêm hai miền mới là mê cung 2D 51×51 và N-Queens.
  → **mục 08 Code Lab đã lạc đề hoàn toàn**; mục 01–07 vẫn khớp vì slide không đổi.
- Báo cáo đầy đủ: `docs/courses/csc14003/reviews/b3-coverage-2026.md`.
- Lỗi thật tìm được (CHƯA SỬA): A\* thiếu điều kiện đầy đủ — `Lesson03Search.tsx:507` để
  `['✓','g']` không có chú thích ¹ trong khi BFS/UCS/IDS đều có `✓¹`, và stat card `:389` ghi
  trần `✓`. Slide P3 tr.29 ghi rõ "YES if all step costs exceed some finite ε and if b is finite".
- Khối mỏng lớn nhất: memory-bounded search (IDA\*/RBFS/SMA\*) — P3 tr.42–52, **11 trang** có
  pseudocode RBFS và ví dụ Romania chạy tay, bài gói lại bằng một mệnh đề "ngoài phạm vi buổi này".
- **BÁC một phát hiện của `lesson-coverage-judge`**: nó báo slide ghi h_SLD(Făgăraș)=178,
  h(Pitești)=98 vs bài ghi 176/100. P3 tr.13 chỉ có đúng dòng tiêu đề — bảng SLD là ẢNH; toàn bộ
  text trích của P3 không chứa `178`/`176`/`98`/`366`/`253`/`329` lần nào. Bài học đúng (khớp AIMA,
  cho ra f(Făgăraș)=415 < f(Pitești)=417, nghiệm 418). Không sửa.
- LƯU Ý MÔI TRƯỜNG: máy không có poppler nên `Read` trên PDF lỗi `pdftoppm is not installed`.
  Đã đi vòng bằng venv + `pypdf` trong scratchpad. Text trích **mất hết bảng/hình** — đó chính là
  nguồn của phát hiện sai ở trên. Lần sau giao slide cho agent phải nói rõ giới hạn này.
- Không sửa file nào của bài học theo yêu cầu user. Working tree ngoài báo cáo mới: y như đầu phiên.

### Cùng phiên — sửa lỗi A* (bước 1/3 theo thứ tự user chốt)

- User chốt thứ tự: **sửa A\* → tách 3 part → bổ sung nội dung**, và cover CẢ hai đề lab 2025+2026.
- Đã sửa, cả VI lẫn EN:
  - `Lesson03Search.tsx:507` bảng mục 07: A\* `['✓','g']` → `['✓¹','g']` (BFS/UCS/IDS vốn đã có ¹).
  - `Lesson03Search.tsx:389` stat card A\*: `v: '✓'` → `v: T.ch5.s44`.
  - Khóa MỚI `ch5.s44` = "✓ b hữu hạn, bước ≥ ε" / "✓ finite b, steps ≥ ε".
  - Chú thích ¹ (`ch7.s20`): "(UCS: thêm…)" → "(UCS và A\*: thêm…)" / "(UCS and A\* also need…)".
    Căn cứ: slide P3 tr.29 "YES if all step costs exceed some finite ε and if b is finite
    (review the condition for completeness of UCS)" — điều kiện của A\* y hệt UCS.
- TIỆN TAY sửa một lỗi hiển thị CÓ SẴN ở đúng dòng đó: `ch7.s20` chứa thực thể `&gt;` nhưng
  `Lesson03Search.tsx:526` render `{T.ch7.s20}` dưới dạng text JSX thuần (KHÔNG qua `<Html>`),
  nên trang hiện nguyên chữ "&gt;". Đã đổi sang ký tự `>` thật ở cả hai bundle.
  → Nếu sau này thêm thẻ vào chuỗi này thì phải bọc `<Html>`, đừng thêm entity.
- Kiểm: `npm run build` xanh · `check_i18n.py b3` sạch · xác minh LIVE trên dev server cả hai
  locale (VI `?lang=vi`, EN mặc định vì `navigator.language` của browser trong app là en-US):
  footnote, ô ĐẦY ĐỦ của A\* và hàng A\* trong bảng đều đúng, không còn `&gt;` trên trang.

### Cùng phiên — routine nhắc ôn

- User: "tạm thời xóa routine nhắc ôn bài đi (tôi không cần nữa)".
- **KHÔNG tắt được từ đây.** `trig_019TD3rVMi6GgrtvFtwvzdCQ` là routine cloud của claude.ai;
  `mcp__scheduled-tasks__list_scheduled_tasks` và `CronList` đều trống — chúng quản lý scheduler
  khác. Phải tắt/xóa trong UI routine của claude.ai. Đã báo user.
- `.github/workflows/on-tap.yml` GIỮ NGUYÊN: nó chỉ chạy bằng `workflow_dispatch`, không có
  routine dispatch thì bất hoạt. Vì user nói "tạm thời" nên không xóa để bật lại cho rẻ.
- Đã đánh dấu memory `routine-on-tap-github-issue.md` là ĐÃ NGHỈ, giữ lại ba ràng buộc kỹ thuật.
- Hệ quả cho việc tách b3: dòng "đường dẫn file nội dung khóa → cập nhật prompt routine" trong
  bảng của CLAUDE.md tạm thời KHÔNG phải làm. Chưa sửa CLAUDE.md vì routine chỉ nghỉ tạm.

### Cùng phiên — ĐÁNH SỐ LẠI TOÀN KHÓA (bước 2a: hạ tầng)

User chốt phương án nặng nhất sau khi đã nghe rủi ro: chèn Buổi 3 thành **3 buổi (3·4·5)**,
nâng các buổi sau lên 2, **và đổi luôn tên thư mục materials** cho khớp. Route cũ: redirect
sang part 1 (user "no preference", tôi chọn).

**Phát hiện làm nhẹ bớt lo ngại ban đầu:** slide bài giảng KHÔNG hề được link từ app — chỉ
Homework có href (`grep -rno "buoi[0-9]*/"` chỉ ra 9 href, toàn Homework). Nên đổi tên thư mục
Lecture không ảnh hưởng runtime; nó chỉ để số thư mục khớp số buổi khi tra cứu.

- **Sao lưu trước** (materials bị gitignore → git KHÔNG revert được):
  `~/Workplace/AI/.materials-backup-20260919-161038.tar.gz`, 37M, 62 mục.
- **Thư mục materials** đổi GIẢM DẦN (11→13, 10→12, … 4→6) rồi tách buổi 3 cũ:
  P1 ở lại `buoi3/`, P2 → `buoi4/`, P3 → `buoi5/`. **Tên FILE giữ nguyên** (`Lecture04-LocalSearch.pdf`
  vẫn nằm trong `buoi6/`) — user duyệt đổi *thư mục*, và đổi tên file sẽ phá provenance của slide gốc.
- `index.ts` + `index.en.ts`: viết lại khối `parts` và `sessions`. 13 buổi, `weeks: 13`,
  subtitle "13 tuần" / "A 13-week", part ranges Tuần 1–2 · 3–8 · 9–11 · 12–13. Mọi href Homework
  đã ánh xạ sang thư mục mới. Ba buổi tìm kiếm mới có `topics`/`math` riêng.
- `topics.ts`: `TOPIC_IDS` thêm `b12`, `b13`; nhãn buổi VI/EN thêm hai dòng; sửa comment nhóm
  topic (Buổi 3 cũ giờ trải ba buổi; `local-*` giờ là Buổi 6).
- `part-tests.ts` + `.en.ts`: retag 36 câu × 2 bundle, dời giảm dần b11→b13 … b4→b6.
  Đếm trước/sau khớp từng buổi.
- `storage.ts`: **migration MỘT LẦN** `RENUMBER_2026_09` + trường mốc `schema` (SCHEMA = 1).
  Khác mọi migration cũ vốn tự nhiên chạy-lại-được — `b4→b6` chạy lần hai sẽ thành `b8`, nên
  phải khóa sau mốc. Chạy SAU `mapTopics` để nhãn 'Buổi 7' kịp thành `b7` rồi mới dời thành `b9`.
  Đã kiểm bằng script tạm: dời đúng `b4→b6`, `b11→b13`, giữ `b3`, dời cả topic trong partTests,
  và nạp lần hai KHÔNG dời thêm.
- `src/features/lessons/b4/` → `b6/`; `Lesson04LocalSearch.tsx` → `Lesson06LocalSearch.tsx`,
  `lesson04.*` → `lesson06.*`, import nội bộ sửa theo; `App.tsx` lazy + route `lessons/b6`.
- Quiz và toán nền của Tìm kiếm cục bộ rekey `b4` → `b6` trong `session-quizzes{,.en}.js` và
  `math-primers{,.en}.js`; `Lesson06LocalSearch.tsx` sửa `MATH_PRIMERS.b6` + `sessionId="b6"`.
- `scripts/check-ai-b4.mjs` → `check-ai-b6.mjs`, repoint; chạy lại **7/7 PASS**.
- Kiểm: `npm run build` xanh · `check-course.mjs` 12/12 · Lộ trình render đủ **13 badge tuần**
  và 4 part range mới.
- **TẠM GỠ** `lessonPath` của `b4`/`b5` vì hai trang chưa dựng — để nguyên thì Lộ trình hiện
  link 404. Gắn lại ngay khi dựng xong.
- `check_i18n.py` vẫn FAIL ở mức TOÀN REPO vì `lesson06.text.vi.ts` (chính là b4 WIP cũ) chưa khai
  trong `acceptance.json` — **lỗi có từ trước**, chỉ đổi tên file. Unit `b3` tự nó sạch.

CÒN LẠI của bước 2: tách trang `Lesson03Search.tsx` (627 dòng) + bundle chữ (VI 39k / EN 33k)
thành ba trang b3/b4/b5, chia `SearchLab`/`CodeLab`/scenes/quiz/toán nền theo phạm vi, thêm route
+ redirect `/lessons/b3` cũ, khai 3 unit i18n, viết ADR đánh số lại + sửa CLAUDE.md (lệnh cấm
materials) + specs.

## 2026-09-21 — Tách Buổi 3 thành ba buổi (bước 2b: trang, chữ, quiz, i18n)

Tiếp nối phiên 19/09. Build lúc mở phiên đang ĐỎ đúng như để lại giữa chừng (trang gộp cũ còn
đọc `T.hero`/`T.ch4` trong khi bundle đã bị cắt còn ch1–ch3). Không mất gì trong hai ngày.

### Nâng lên dùng chung
- `SearchLab.tsx`, `CodeLab.tsx`, `lesson03.scenes.ts` chuyển từ `lessons/b3/` sang
  `features/search-lab/` (đổi tên `scenes.ts`); `AlgoCard` tách khỏi trang gộp thành
  `search-lab/AlgoCard.tsx` với prop `labCta` (mỗi buổi giữ bản dịch nhãn riêng).
- Hai component lab nhận `only?: string[]`. b4 truyền `['BFS','DFS','UCS','IDS']`,
  b5 truyền `['GBFS','ASTAR','HC']`. Mặc định (bỏ trống) vẫn hiện đủ bảy.
- Chữ dùng chung (`fn`, `lab`, `codelab`, `searchlab`, `f_codelab`, `scenes`) tách ra
  `search-lab/lab.text.{vi,en,}.ts`. Trong trang b4/b5 truy cập qua `T as L`.

### Ba trang
- `b3/Lesson03Problem.tsx` · `b4/Lesson04Uninformed.tsx` · `b5/Lesson05Informed.tsx`.
  JSX cắt nguyên văn từ trang gộp bằng script (không chép tay), rồi đánh số lại `no=` và
  **đổi `id` của mục** — b4: `ch4`→`ch1`; b5: `ch5/ch6/ch7`→`ch1/ch2/ch3`. Lỗi này suýt lọt:
  nav trỏ `#ch1` trong khi div còn `id="ch4"`.
- Hero / dẫn quiz / khối bài tập **viết mới** cho từng buổi, cả VI lẫn EN (gọi skill
  `lesson-voice` + `references/english.md` trước khi viết).
- Bài tập của bài gộp cũ chia lại theo chủ đề: Q1 formulation → b3; Q2 trace tách đôi
  (mù → b4, có thông tin → b5); Q3 admissible → b5; Q4 mê cung tách đôi (a,b → b4; c,d → b5).
- `Lesson03Search.tsx` đã XÓA. Route `/lessons/b3` giữ nguyên đường dẫn nhưng giờ trỏ trang
  Phát biểu bài toán — link cũ, bookmark, bản deploy đang chạy đều vẫn mở được.

### Quiz và toán nền
- 8 câu của b3 cũ chia lại theo topicId: b3 lấy `problem-statement`+`search-framework`,
  b4 lấy 3 câu `uninformed`, b5 lấy `heuristic`/`admissible-consistent`/`astar`.
  **Viết thêm 9 câu** (3 mỗi buổi) × 2 bundle = 18 object. b3=5, b4=6, b5=6 câu.
- `MATH_PRIMERS`: bộ 5 mục của b3 cũ chia đôi (b3 giữ Graph/Tree+b/Big-O; b4 lấy
  Stack·Queue·PQ/Big-O/Logarithm), và **viết mới hoàn toàn bộ b5** 4 mục
  (Triangle inequality · Lower bound · Monotone function · Big-O) — cổng `lesson` bắt buộc
  mỗi buổi mở bằng thẻ toán nền.

### Tham chiếu chéo — chỗ dễ quên nhất khi đổi số buổi
Đổi số làm sai 13 câu trong b1/b2/b5 và 7 chỗ trong `intro-ai`, `agents-data`, `lab-searching`,
`session-quizzes`, `ui/{vi,en}.ts` — kiểu «Buổi 5 mình sẽ mở nắp minimax», «Lộ trình 11 tuần»,
«bám theo suốt 11 buổi», «nấc 3 đẻ ra buổi 3–6». Đã sửa hết cả hai bản.
`check_i18n` bắt giúp một chỗ tôi sót: VI đã đổi «Buổi 9 và 10» mà EN còn «Sessions 7 and 8».
→ Đã thêm dòng vào bảng của `CLAUDE.md`: đụng số buổi thì soát bằng `grep -rnE`.

### i18n
- Unit `b3` cũ tách thành bốn: `b3`, `b4`, `b5`, `search-lab`. Đặt `search-lab` riêng vì nếu
  gắn vào b4 hay b5 thì unit kia không đóng độc lập được. Cổng `engine` theo về `search-lab`.
- `baseline/b4.json` (vốn là Tìm kiếm cục bộ) đổi tên thành `b6.json` theo buổi của nó.
- `judged/b3.json` chấm bài GỘP nên hết hiệu lực → `judged/b3-superseded-2026-09-21.json`,
  giữ nguyên phán quyết cũ trong khóa `superseded_verdict`.
- Trước khi chụp mốc mới đã **chứng minh không mất chữ**: 259 chuỗi VI trong mốc b3 cũ, 224
  khớp nguyên văn ở bốn bundle mới; 35 chuỗi còn lại soát tay từng cái — toàn nav label / hero
  / quiz lead / hw của bài gộp bị thay có chủ đích, cộng vài chuỗi template `${…}` không khớp
  literal được. Không cái nào là mất.
- **13/13 unit qua `check_i18n`.** Điều này cũng gỡ luôn lỗi toàn repo tồn từ phiên trước
  (`lesson06.text.vi.ts` chưa thuộc unit nào).

### Giám khảo song ngữ
Hai `i18n-fidelity-judge` chạy song song. Lượt đầu: **b3 ĐẠT · search-lab ĐẠT · b4 CẦN SỬA ·
b5 CẦN SỬA**. Đã sửa 10 chỗ:
- b4: «how “determined” DFS really is» → `deterministic` (SAI NGHĨA — determined đọc ra
  "quyết tâm"); bỏ «we'll see» (we nghĩa tác giả); `Practise`→`Practice`; thống nhất
  POPPED→REMOVED cho khớp chữ cũ.
- b5: câu hỏi (c) của Q3 bị biến thành khẳng định, đã trả lại hai vế; bỏ «we cure»;
  trả lại «entirely» + «You just swap… That's it»; trả người đọc về ghế suy luận ở `ch5.s31`.
- b3: hai khối viết mới là hai khối DUY NHẤT không dùng contraction lần nào — đã rút gọn.
- search-lab: nhãn `vn` của IDS lặp lại chính tên nó; `codelab.s3` mất răng cảnh báo.
- **Giám khảo còn bắt một lỗi tôi gây ra mà không biết**: `ch5.s31` trỏ «câu 3 của bài tập»
  trong khi sau khi tách, «đường nào có thể được trả về» đã thành QUESTION 2. Sai ở cả hai bản.
- KHÔNG sửa 3 mục giám khảo xếp ngoài phán quyết (`ch1.s14` mất ví von «nhắm mắt đi cũng tới»,
  `ch2.s14` mất lời cảnh báo, `ch4.s68` danh-từ-hóa vô chủ ngữ) — chữ cũ đã qua giám khảo lần
  trước; theo lệ repo thì gom vào lần sau đụng đúng khối đó, sửa lẻ là mất hiệu lực hash.
- Đã gửi lại cả hai agent chấm lần hai; **chưa có phán quyết mới lúc ghi dòng này**.

### Tài liệu
`ADR-0018` (tách + đánh số lại + nới điều cấm materials) · `specs/lesson-b3.md` viết lại ·
`specs/lesson-b4.md`, `lesson-b5.md` mới · `specs/00-architecture.md` (schema, search-lab,
key checklist, migration) · `CLAUDE.md` (điều cấm materials, dòng soát tham chiếu chéo) ·
`skills/new-lesson/references/wiring.md` (key checklist).
Mỗi spec có mục **"Còn thiếu so với slide"** chép từ báo cáo coverage — đó là đầu vào của bước 3.

### Kiểm đã chạy
`npm run build` xanh · `check-course.mjs` 12/12 · `check-ai-b6.mjs` 7/7 ·
`check-def-b8/b12/city` xanh · `check_i18n` 13/13 unit · trình duyệt: ba trang × hai locale đều
200, mọi anchor phân giải được, không lỗi console, toolbar lab đúng phạm vi từng buổi.

### Phán quyết song ngữ — ĐÃ XONG
Lượt 2: **cả bốn unit ĐẠT**. Đã ghi `.claude/i18n/judged/{b3,b4,b5,search-lab}.json`
(hash `e869b6d1…`, `dee34374…`, `65366d3d…`, `b2ae62a9…`). Bốn unit **đóng được**.
Áp thêm một gợi ý cuối của giám khảo: `ch5.s14` bỏ số đếm «one condition» cho khớp bản VI.
Giám khảo ghi nhận một tiền lệ đáng nhớ: khi chữ MỚI lệch thuật ngữ với chữ CŨ (POPPED vs
REMOVED), sửa chữ MỚI cho khớp thì phán quyết cũ không bị lật.

### Chấm lại chrome / tests / b1 / b2 — giám khảo bắt thêm 5 chỗ tôi SÓT
`chrome` ĐẠT · `b1` ĐẠT · `tests` và `b2` CẦN SỬA. Cả 5 lỗi cùng một loại và đều là loại
`check_i18n` KHÔNG thể thấy: **số buổi cũ còn sót ở bản VI, bản EN dịch trung thành theo** —
hai bản cùng sai nên multiset chữ số vẫn bằng nhau.

- `part-tests{,.en}.ts`: tiêu đề Phần II «(Buổi 3–6)» → 3–8; Phần III «(Buổi 7–9)» → 9–11;
  Phần IV «(Buổi 10–11)» → 12–13. Người học làm sai rồi mở «Buổi 7» ra ôn thì gặp minimax
  chứ không gặp FOL.
- `part-tests` câu định lý Bayes: «Naïve Bayes ở Buổi 10» → Buổi 12.
- `lesson02.text{.vi,.en}.ts` `ch6.s17`: «buổi 5 gọi tên nó thành “tìm kiếm đối kháng”» → buổi 7.
  Nặng ở chỗ tít của chính khối đó (`ch6.s14`) tôi ĐÃ sửa thành «CHO BUỔI 7», nên đoạn văn
  đang tự mâu thuẫn với cái tít ngay trên nó trong cùng một màn hình.

**Vì sao tôi sót:** lượt soát đầu tôi lọc output bằng `grep` rồi `cut -c1-230`. Dòng
`ch6.s17` CÓ trong kết quả nhưng phần «session 5» nằm quá cột 230 nên bị cắt mất; còn
`part-tests` thì bị chính bộ lọc của tôi loại ra. Lần soát lại đã in đủ dòng, không cắt.

Áp thêm 3 mục tùy chọn giám khảo nêu: `desc` Phần II thêm «phát biểu bài toán»; `b2` `hw.s6`
đổi tên buổi 3 cho khớp `index.ts`; và tự tìm thêm được `intro-ai{,.en}.js` hứa «Buổi 3 bạn sẽ
tự tay cài cả bảy cách» — sai sau khi tách, bảy thuật toán nay ở Buổi 4 và 5.

CHƯA đụng: tên tiếng Anh của b6/b7/b12/b13 lệch giữa `VI.en` và `EN.title` — có từ trước đợt
tách, để lần sau đụng đúng khối đó.

### `scripts/check-session-numbering.mjs` — MỚI
Viết để máy bắt giúp phần cơ học của loại lỗi trên. Nó suy khoảng tuần của mỗi phần từ
`Session.part`/`Session.week` rồi đối chiếu với tiêu đề part-tests, `Part.range`, `testDesc`,
số câu mỗi phần, tiêu đề từng buổi (cả hai bản) và `lessonPath`. **Đã thử đặt lại lỗi cũ
«(Buổi 3–6)» và nó fail đúng chỗ** — check không bắt được lỗi thì là check vô dụng. 8/8 xanh.
Cần stub `location`/`localStorage`/`navigator`/`history`/`document` vì `topics.ts` kéo theo
`lib/locale.ts` vốn quyết `LOCALE` ngay ở module scope (ADR-0010).

### Phán quyết cuối — MỌI UNIT ĐÃ ĐÓNG
`tests` và `b2` lượt 2 **ĐẠT**. `chrome` ĐẠT ngay lượt đầu dù là unit đổi nhiều nhất.
`b1` phải chấm **hai vòng**: vòng hai vì `intro-ai{,.en}.js` là `pairs[1]` của chính unit đó,
nên chỗ tôi tự tìm ra ở cuối phiên làm hash của b1 đổi theo — giám khảo chấm lại, ĐẠT.

Đã ghi `judged/{chrome,tests,b1,b2}.json`, giữ phán quyết cũ trong khóa `supersedes`.

```
✓ mọi unit đã đóng: chrome, tests, b1, b2, b3, b4, b5, search-lab, b6, def, def-b7, def-b8, def-b12
```

Giám khảo khen một chỗ đáng ghi: `b1` `ch4.s6` «tám buổi giữa của khóa, từ tìm kiếm tới logic»
vẫn ĐÚNG sau khi tách (b3–b8 tìm kiếm + b9–b10 logic = đúng 8) — loại con số dễ thành sai âm
thầm mà không cổng nào kiểm được.

### CÒN TREO
- `scripts/check-def-b7.mjs` FAIL: `curriculum.ts` không chứa chuỗi
  `/courses/data-engineering-foundation/lessons/b7`. **Lỗi CÓ TỪ TRƯỚC** — đã kiểm bằng cách
  stash `App.tsx` rồi chạy lại, vẫn fail; `curriculum.ts` tôi không đụng. Không phải hồi quy.
- `scripts/check-session-numbering.mjs` đã ghi rõ GIỚI HẠN của chính nó vào đầu file theo góp ý
  của giám khảo: bốn chỗ khó nhất đợt này đều là VĂN XUÔI (`ch6.s17`, `TOPICS[0].d`, `ex` của
  một câu kiểm tra, tên buổi trong `hw.s6`) — không trường dữ liệu nào lộ ra chúng, nên máy
  không bắt được và `check_i18n` càng không. Đánh số buổi dịch chỗ thì vẫn phải soi bằng mắt.
- **BƯỚC 3 chưa bắt đầu**: bổ sung nội dung (memory-bounded IDA*/RBFS/SMA*, bidirectional đầy
  đủ, PDB cộng tính, chứng minh tối ưu, đường dư thừa 10¹² vs 800) và phủ cả hai đề lab
  2025 + 2026 (mục 08 hiện vẫn bám đề 2025: ma trận kề, dls/ids/hc, input.txt/output.txt).


## 2026-09-22 · Hoàn tất bài Tìm kiếm cục bộ (buổi 4 cũ → buổi 6)

User yêu cầu tiếp tục và hoàn thành phần còn sót của bài Local Search. Giữ nguyên
đợt tách b3 thành b3–b5 / đánh số 13 buổi do task khác thực hiện.

- Hoàn tất `src/features/lessons/b6/`: 13 slide gồm bìa, primer, 10 mục đánh số và
  N-hậu lab riêng; VI/EN cùng cấu trúc. Có hill-climbing/biến thể/restart, SA, beam,
  GA, 3 Python hoàn chỉnh, 8 quiz, 3 câu Homework4 và checklist.
- Route/label/primer/quiz/homework đều b6; back link b5, cầu nối b7/b8; checklist
  `b6-checks`, điểm `sessions.b6`, giữ 7 topic `local-*`. Không thay schema storage.
- Bàn cờ: 4 preset × 4 thuật toán, seed UI 3, heatmap và chỉnh hậu; Landscape 3
  use-case, Beam 2 use-case tự lặp; SA sliders; roulette/crossover/mutation có thao tác.
- Sửa browser QA: code grid min-width gây tràn 550px; nav wrap ở màn nhỏ;
  keepLabTouch để vuốt lab/bảng/code và kéo range không nhảy deck. Không đổi
  LessonDeck dùng chung, không dependency mới.
- Đính chính nguồn có bằng chứng: 1/p là tổng lượt, graph Homework có A–H (8 đỉnh),
  SA hữu hạn không bảo đảm tối ưu, O(1) cấu hình khác số byte; budget/seed/GA mutation
  là lựa chọn sư phạm có ghi rõ. Không thêm kiến thức suy đoán vào kết luận.
- Kiểm cuối: build PASS; local-search 7/7 (cả 3 Python thực thi); course 12/12;
  numbering 8/8 (có cảnh báo sandbox WebSocket HMR, assertions vẫn hoàn tất);
  `i18n_loop.py b6` đóng đủ deps/build/i18n/lesson/judged. Fidelity ĐẠT, hash
  `3f6c2869af2e1c7e`, đủ prose/primer/quiz hai locale.
- Chrome hồ sơ tạm: 22 nhóm PASS, 320–1440px × sáng/tối, đầy đủ lab/quiz/persistence,
  deck/keyboard/touch, hai vòng từng animation, pause ngoài viewport/document ẩn
  (signal mô phỏng), reduced motion. Kiểm bổ sung reduced motion khi cảnh thực sự
  hiện và ảnh cuối cả 5 use-case. Không lỗi JS của bài; favicon gốc dev server 404
  được tách riêng. Chưa kiểm điện thoại vật lý/screen reader thực.
- Reviewer độc lập b6_quality_review PASS: 53 unit (45 covered + 8 correction),
  8.512 trace / 44.381 frame; không required findings. Focused retest patch UI đạt.
  Báo cáo `docs/courses/csc14003/reviews/b6-{quality,coverage,fidelity,browser}.md`
  và `b6-browser-checks.json`. Hai đề xuất chỉ tùy chọn (continuous-space bridge;
  thêm lời mời First-choice exercise), không phải việc chưa hoàn thành.
- Cập nhật `.claude/specs/lesson-b6.md`, architecture route/storage keys, README,
  outline và tài liệu review. Không commit/push/deploy; bản local sẵn để xem.

Không còn việc bắt buộc của bài Local Search. Các TODO mở rộng b3–b5 và lỗi check-def-b7
được ghi bởi task khác ở trên vẫn ngoài phạm vi phiên này.


## 2026-09-22 — Commit CSC14003 b4–b6 + tách search-lab, deploy

- Commit `7218e60` và push main: 61 file, +4157/−1315. Buổi 4, 5, 6 của CSC14003 (trang bài,
  QueensLab, GeneticLab, LocalSearchVisuals, local-search-engine, bộ chữ VI/EN); tách
  SearchLab/CodeLab/scenes khỏi `features/lessons/b3` sang `features/search-lab` dùng chung
  (git nhận là rename R092–R098), b3 còn `Lesson03Problem`; script `check-ai-b6`,
  `check-session-numbering`; cập nhật data CSC14003, bundle UI vi/en, storage.ts, global.css,
  App.tsx, README; tài liệu outline b6 và các review b3/b6.
- Cổng kiểm trước khi commit: `npm run build` xanh; `i18n_loop.py --all` báo **MỌI unit đóng
  được** — chặn `b4` chưa khai unit ghi ở mục 2026-09-19 nay đã hết, `b4`/`b5`/`b6`/`search-lab`
  đều có unit. Phán quyết `def-b7` (`69bc58ad69faf120`) và `def-b8` (`75e7a538ebf85770`) vẫn
  còn khớp hash, tức phần sửa dịch không bị đụng.
- Deploy run `35735322963` success. Kiểm bản live: ba route b4/b5/b6 đều dựng đúng
  ("Searching with no clues", "Searching once you have a clue", "Sometimes, you go down to
  climb higher."), chunk `Lesson04Uninformed` / `Lesson05Informed` / `Lesson06LocalSearch`
  đều 200. Trang khóa nay ghi 13 tuần.
- 404 trong console vẫn chỉ là 404 tầng HTTP của deep link (ADR-0007) — đã đối chiếu network:
  mọi request asset đều 200, chỉ request document là 404 rồi Pages trả `404.html`.
- Cảnh báo CI không chặn: GitHub Actions báo Node.js 20 đã deprecated (checkout@v4,
  setup-node@v4, configure-pages@v5, upload-artifact@v4 bị ép chạy Node 24), và
  `ubuntu-latest` sẽ chuyển sang Ubuntu 26 từ 2026-10-19. Nên nâng action trước mốc đó.

## 2026-09-26 — DEF buổi 9, 10, 11

- Hoàn thành ba bài VI/EN: Spark/batch, Flink/stream và Consumption/modeling. Mỗi bài 10 chương, 3 lab, 10 câu quiz, primer/checklist/homework, 16 slide trình chiếu. Route và lộ trình nối đủ buổi 7–12.
- Đọc ba PDF nguồn (90/75/64 trang), đối chiếu primary docs Spark 3.5.7, Flink 1.20, Feast 0.40, ClickHouse, Pinot, Kimball; ghi sửa nội dung và coverage vào docs/courses/data-engineering-foundation/reviews/b9-quality.md, b10-quality.md, b11-quality.md.
- Ba reviewer độc lập kết luận chất lượng PASS, fidelity ĐẠT. Hash text: b9 e4404623c1aff2e8; b10 13cd5d514fd9681e; b11 b2a63016edad6f77. Timer trên keyed stream và placeholder bronze/silver đã sửa và chấm lại.
- i18n_loop def/def-b9/def-b10/def-b11 exit 0 (bao gồm production build); check-def-b9-b11 và 12 check-course PASS. Browser 32 checks PASS, 0 console/page errors: hai ngôn ngữ, hai theme, mobile/desktop, labs/quiz/storage/deck, hai chu kỳ animation và offscreen pause. Đã xem ảnh desktop/mobile. Không chạy cluster thật.
- Tách useLessonLoop dùng chung với b7 qua re-export; không thêm dependency. Sửa mobile nav scoped cho bài mới. README, curriculum, slide coverage và specs cập nhật. Báo cáo tổng hợp b9-b11-validation.md. Không commit/push/deploy; giữ nguyên thay đổi ngoài phạm vi ở CSC14003 b6.


## 2026-10-07 — CSC14003 buổi 7: review và viết lại trải nghiệm học

- Viết lại VI/EN theo model → minimax → lab → α–β → cutoff/EVAL → chance → extensions → summary → quiz → transfer. Một cây 4 lá nhất quán; sửa cận/exact, strategy, depth cost, horizon và góc nhìn utility.
- Thêm pure engine, hai SVG loop 2D, lab score/root/order thực, probability bar, 3 recall, 3 practice có lời giải. Sửa phantom anchor và 12 slide mapping; focus và touch shield cho cây/bảng.
- Quality reviewer độc lập PASS content/code, fidelity ĐẠT hash `6c3c7cc6536d07c5`; coverage 35 units: 28 covered + 1 correction + 6 detail out-of-scope. Báo cáo trong docs/courses/csc14003/reviews/b7-*.md.
- Engine 800 cases PASS; i18n_loop b7 PASS (deps/build/i18n/lesson/judged). Browser thực: lab mutations/MIN/order/reset/chance/recall/quiz, 12 deck sections, 375px, EN, two cycles và offscreen suspension; captured console không error. Reduced motion/document hidden chỉ đọc code, không giả nhận browser PASS.
- README/spec/outline cập nhật. Không commit/push/deploy. Giữ thay đổi ngoài phạm vi đang có.

## 2026-10-10 — CSC14003 buổi 9: Tác tử logic · Logic mệnh đề (bài mới, VI/EN)

- Dựng bài mới `/courses/csc14003/lessons/b9` từ Lecture07-LogicalAgents.pdf (97 trang), bài tập `buoi8/Homework6.pdf` (logic mệnh đề — lệch thư mục do ADR-0018) và Lab 2 phần 1. 13 mục + thẻ toán nền: KB agent → Wumpus → mô hình & ⊨ → cú pháp/ngữ nghĩa → kiểm mô hình, hằng đúng, thỏa được → luật suy diễn → CNF & hợp giải → Horn, FC/BC → DPLL, DP, WalkSAT, giới hạn PL → Logic Lab → ghi nhớ → quiz 11 câu → bài tập. Một KB hang Wumpus (R1–R5) xuyên suốt.
- Engine thuần `src/features/lessons/b9/logic-engine.js` (parser, CNF, TT-ENTAILS, PL-RESOLUTION, FC, BC có chống lặp, DPLL, WalkSAT). `scripts/check-ai-b9.mjs`: ví dụ bài giảng, Quiz 01–06, Homework 6 (thủ phạm Brown), đường DP của Quiz 06, phản ví dụ cache thất bại trong BC, 700 ca ngẫu nhiên đối chiếu bảng chân trị — PASS.
- Bốn minh họa tự lặp (Wumpus, 8 mô hình với nút α₁/α₂, hợp giải Joe, đồ thị AND-OR với nút FC/BC + bố cục dọc cho điện thoại) dùng `useLessonLoop`; lời giải tĩnh (danh sách bước Wumpus, thứ tự FC/BC, trace đầy đủ trong `<details>`). Lab: 5 ví dụ + KB tự nhập, 6 cách suy luận. Data: primer + quiz b9 cả hai locale, 7 topic id mới (`kb-agent`, `entailment`, `pl-semantics`, `validity-sat`, `resolution`, `horn-chaining`, `sat-solvers`). CheckList `csc14003-b9-checks`.
- Đính chính nguồn trong bài: trang 36 (`P ⇒ ¬P` không hằng đúng), trang 27 (thứ tự vế), trang 45 (R7 in sai; dùng R7 của trang 41), trang 95 (thêm chỉ số thời gian cho L); bảng DP/DPLL giữ cột “Tautology” và nói rõ nguồn không ghi đơn vị/`*`.
- Quality judge độc lập: vòng 1 NEEDS CHANGES (7 lỗi diễn đạt mức trung bình, thiếu Quiz 01/06, reduced motion của chaining, tràn 375px) → sửa hết → vòng 2 PASS. Fidelity judge ĐẠT, kiểm hẹp lại sau sửa ĐẠT; `judged/b9.json` hash `44055001c0ac6095`; `i18n_loop.py b9` exit 0. Báo cáo: `docs/courses/csc14003/reviews/b9-quality.md`, `b9-fidelity.md`; dàn ý `lesson-design/b9-outline.md`; spec `.claude/specs/lesson-b9.md`; README cập nhật.
- Browser thật: desktop/612/375px, VI/EN, sáng/tối, cả bốn loop + hai trạng thái nút, lab (mọi cách, input ASCII, lỗi cú pháp), trình chiếu 15 slide, quiz, checklist; chỉ loop đang hiện mới chạy; pane ẩn (`document.hidden`) thì loop trong viewport báo `suspended`. Reduced motion chỉ kiểm bằng code.
- Còn lại / ghi chú: buổi 8 (CSP) chưa có bài nên hero b9 lùi về lộ trình; `lesson07.css` dùng token không tồn tại `--panel-inner` (đã đề xuất task riêng); tokenizer Python dùng chung (`KWS`) thiếu `global`, `is`. Ba sửa chữ sau vòng quality 2 (`chaining.fc` thẻ tem, `wumpus.after`, gợi ý bài 1) chỉ được fidelity judge đọc lại. Chưa đề xuất câu nào cho bộ Kiểm tra tổng hợp phần III. Không commit/push/deploy.

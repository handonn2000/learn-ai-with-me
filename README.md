# learn-ai-with-me

Sổ tay tự học AI (CSC14003 · HCMUS) dạng web app — port từ bộ thiết kế HTML sang React.
Lộ trình 13 tuần với lịch ôn ngắt quãng, bài học tương tác (canvas lab chạy từng bước 7 thuật toán tìm kiếm), quiz chấm theo chủ đề. Kiến trúc data-driven, sẵn đường mở rộng thành blog/portfolio nhiều khóa học.

Khóa **Data Engineering Foundation** có baseline và lộ trình song ngữ: 12 buổi, 4 phần,
12 tuần đề xuất, khoảng 72–96 giờ theo baseline. Các tuần 7–12 đã có bài học VI/EN, lab mô phỏng và quiz.
Tuần 8 gồm 10 chương, storage/HDFS/schema explorer, lab governance và medallion, cùng quiz 10 câu;
Tuần 12 gồm 10 chương về Airflow và chất lượng dữ liệu, lab dependency/rerun, concurrency và validation gate, cùng quiz 10 câu.
Tuần 9 — Spark/batch, Tuần 10 — Flink/stream và Tuần 11 — Consumption đều có 10 chương, 3 lab tương tác, quiz 10 câu và chế độ trình chiếu. Tuần 1–6 vẫn là khung học, chưa có bộ đề tổng hợp.
Xem [curriculum và roadmap](docs/courses/data-engineering-foundation/curriculum.md) cùng
[phân tích 12 bộ slide nguồn](docs/courses/data-engineering-foundation/source-analysis.md).

## Chạy

```bash
make start       # npm ci nếu lockfile đổi, rồi Vite — http://localhost:5173/learn-ai-with-me/
make build       # tsc -b && vite build → dist/ (+ 404.html cho SPA)
make preview     # xem thử bản build
```

Cùng việc đó bằng npm: `npm ci` / `npm run dev` / `npm run build` / `npm run preview`.

Yêu cầu Node 18+. `make` in danh sách lệnh khi không truyền target.

## Ngôn ngữ

App có hai bản: **tiếng Việt** ở gốc và **tiếng Anh** ở `/en/`.

| | |
|---|---|
| Tiếng Việt | https://handonn2000.github.io/learn-ai-with-me/ |
| English | https://handonn2000.github.io/learn-ai-with-me/en/ |

Lần đầu mở, app tự chọn theo ngôn ngữ trình duyệt và múi giờ của bạn (không gọi API nào, không
gửi dữ liệu đi đâu). Nút `EN` / `VI` ở góc phải đổi bất cứ lúc nào và nhớ lựa chọn đó.

Muốn gửi một link **ghim sẵn ngôn ngữ** thì thêm `?lang=vi` hoặc `?lang=en` — hữu ích khi người
nhận dùng máy cài ngôn ngữ khác.

> Slide bài giảng, homework và code lab gốc của CSC14003 không được đẩy lên repo này (bản quyền của trường). Sau khi clone, các link tới `public/materials/` trên trang Lộ trình sẽ 404 cho tới khi bạn tự thả file của mình vào đúng đường dẫn đó.

## Cấu trúc

```
public/materials/        PDF slide + homework + lab gốc (được link từ lộ trình — KHÔNG có trong repo)
src/
  main.tsx, App.tsx      entry + router (lazy-load từng trang)
  styles/global.css      design tokens (dark/light) + component class dùng chung
  components/            Html, Reveal, CanvasScene, SectionHead, LessonNav, CheckList, AppHeader
  lib/                   storage (interface + localStorage adapter), useProgress,
                         spaced-repetition, theme, useLocalList
  content/
    types.ts             Course / Session / Part
    courses/index.ts     courses[] — thêm khóa mới ở đây
    courses/csc14003/    data khóa: sessions, part-tests, intro-ai.js, lab-searching.js
    courses/data-engineering-foundation/  baseline + curriculum VI/EN, cấu trúc dùng chung
  features/
    roadmap/             trang lộ trình (tiến độ + lịch ôn + gợi ý hôm nay)
    tests/               kiểm tra tổng hợp từng phần (KaTeX cho công thức)
    lessons/b1/          Buổi 1 — Nhập môn AI (3 cảnh canvas + quiz 4 ô)
    lessons/b2/          Buổi 2 — Tác tử thông minh (Vacuum Lab + môi trường + kiến trúc agent)
    lessons/b3/          Buổi 3 — Mô hình hóa bài toán tìm kiếm
    lessons/b4/          Buổi 4 — Tìm kiếm không có thông tin
    lessons/b5/          Buổi 5 — Tìm kiếm có thông tin
    lessons/b6/          Buổi 6 — Tìm kiếm cục bộ (N-hậu, annealing, beam, di truyền)
    search-lab/          search-engine.js — engine sinh trace 7 thuật toán
```

## Routes

Các đường dẫn dưới đây tính từ gốc ứng dụng `/learn-ai-with-me/`. Bản tiếng Anh thêm
`en/` sau gốc này, ví dụ `/learn-ai-with-me/en/courses/csc14003/lessons/b2`.

| Route | Nội dung |
|---|---|
| `/` | Trang chủ |
| `/courses` | Danh sách khóa học |
| `/courses/csc14003` | Lộ trình AI — 13 tuần |
| `/courses/data-engineering-foundation/lessons/b7` | Tuần 7 — Ingestion, Kafka và CDC (VI/EN) |
| `/courses/data-engineering-foundation/lessons/b8` | Tuần 8 — Storage, modeling và lakehouse (VI/EN) |
| `/courses/data-engineering-foundation/lessons/b12` | Tuần 12 — Orchestration, Airflow và chất lượng dữ liệu (VI/EN) |
| `/courses/data-engineering-foundation` | Lộ trình Data Engineering Foundation và kiến thức đầu vào |
| `/courses/csc14003/tests` | Kiểm tra tổng hợp; `#p1`, `#p2`, `#p3`, `#p4` chọn phần |
| `/courses/csc14003/lessons/b1` | Buổi 1 — Nhập môn AI |
| `/courses/csc14003/lessons/b2` | Buổi 2 — Tác tử thông minh |
| `/courses/csc14003/lessons/b3` | Buổi 3 — Mô hình hóa bài toán tìm kiếm |
| `/courses/csc14003/lessons/b4` | Buổi 4 — Tìm kiếm không có thông tin |
| `/courses/csc14003/lessons/b5` | Buổi 5 — Tìm kiếm có thông tin |
| `/courses/csc14003/lessons/b6` | Buổi 6 — Tìm kiếm cục bộ và tối ưu hóa (VI/EN) |
| `/courses/csc14003/lessons/b7` | Buổi 7 — Tìm kiếm đối kháng, minimax và α–β (VI/EN) |
| `/courses/csc14003/lessons/b9` | Buổi 9 — Tác tử logic, logic mệnh đề (VI/EN) |
| `/blog` | Trang giữ chỗ cho blog |
| Đường dẫn không khớp | Trang không tìm thấy |

Router dùng `/courses/:slug` và `/courses/:slug/tests`; khóa chưa có bộ đề, như
Data Engineering Foundation, hiển thị thông báo chưa có kiểm tra. Slug không tồn tại
hiển thị trang không tìm thấy. CSC14003 hiện có bài học tương tác cho buổi 1–7 và 9 (buổi 8 CSP chưa dựng). Buổi 9 có hang Wumpus, tám mô hình và chaining trên đồ thị AND-OR tự lặp, Logic Lab chạy sáu cách suy luận trên ví dụ hoặc KB tự nhập; kiểm engine bằng `node scripts/check-ai-b9.mjs`. Buổi 7 có cây minimax/α–β tự lặp, lab chỉnh điểm và thứ tự duyệt, minh họa kỳ vọng, quiz và bài tập có gợi ý.
Buổi 6 có lab N-hậu với 4 thuật toán, mô phỏng địa hình và local beam tự lặp,
thí nghiệm xác suất simulated annealing, xưởng lai/đột biến, 3 ví dụ Python chạy được
và quiz 8 câu. Kiểm thuật toán và ví dụ bằng `node scripts/check-ai-b6.mjs`;
xem [review nội dung và coverage](docs/courses/csc14003/reviews/b6-quality.md).

## Dữ liệu người học

Lưu localStorage, key `csc14003-progress` (giữ nguyên key của bản thiết kế HTML nên tiến độ cũ trên cùng trình duyệt không mất). Tầng lưu trữ đi qua interface `KeyValueStore` trong `src/lib/storage.ts` — đổi backend chỉ cần viết adapter mới.

Mỗi khóa mới dùng key `<slug>-progress`; Data Engineering Foundation dùng
`data-engineering-foundation-progress`. Tiến độ dùng chung giữa VI/EN, tách biệt giữa các khóa,
kể cả khi trùng ID buổi như `b1`. Kiểm hợp đồng khóa học và lưu trữ bằng
`node scripts/check-course.mjs`.

Điểm kiểm tra cuối phần khóa theo `Part.id` (`foundations`/`searching`/`knowledge`/`ml`); dữ liệu cũ khóa theo chỉ số 1|2|3 được `storage.ts` tự chuyển khi đọc.

## Deploy

Site: **https://handonn2000.github.io/learn-ai-with-me/**

```bash
make deploy      # build local, rồi push main (hoặc dispatch workflow nếu origin đã up to date)
```

Chỉ chạy được trên `main` với working tree sạch. GitHub Actions (`.github/workflows/deploy.yml`) nhận push hoặc `workflow_dispatch` rồi publish Pages. Push `main` trực tiếp cũng deploy như trước. `gh` chỉ cần khi muốn rebuild mà không có commit mới.

App chạy ở subpath `/learn-ai-with-me/` nên `vite.config.ts` khai `base` tương ứng và `BrowserRouter` nhận `basename={LOCALE_BASENAME}` (gốc ứng dụng, thêm `/en` khi đọc tiếng Anh). Nếu đổi tên repo hoặc gắn domain riêng thì phải sửa `base` (domain riêng → để `'/'`).

Route nội bộ đi qua `<Link to>` (Router tự cộng basename). Thẻ `<a>` thô dẫn tới trang nội bộ dùng `localeBase`; asset và tài liệu dùng `import.meta.env.BASE_URL` vì được chia sẻ giữa hai ngôn ngữ.

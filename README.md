# learn-ai-with-me

Sổ tay tự học AI (CSC14003 · HCMUS) dạng web app — port từ bộ thiết kế HTML sang React.
Lộ trình 11 tuần với lịch ôn ngắt quãng, bài học tương tác (canvas lab chạy từng bước 7 thuật toán tìm kiếm), quiz chấm theo chủ đề. Kiến trúc data-driven, sẵn đường mở rộng thành blog/portfolio nhiều khóa học.

Khóa **Data Engineering Foundation** có baseline và lộ trình song ngữ: 12 buổi, 4 phần,
12 tuần đề xuất, khoảng 72–96 giờ theo baseline. Tuần 7 — Ingestion đã có bài học VI/EN,
3 lab mô phỏng và quiz 8 câu; các tuần khác vẫn là khung học, chưa có bộ đề tổng hợp.
Xem [curriculum và roadmap](docs/courses/data-engineering-foundation/curriculum.md) cùng
[phân tích 12 bộ slide nguồn](docs/courses/data-engineering-foundation/source-analysis.md).

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173/learn-ai-with-me/
npm run build    # tsc -b && vite build → dist/
npm run preview  # xem thử bản build
```

Yêu cầu Node 18+.

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
    lessons/b3/          Buổi 3 — Tìm kiếm (Manim Lab + Code Lab)
    search-lab/          search-engine.js — engine sinh trace 7 thuật toán
```

## Routes

Các đường dẫn dưới đây tính từ gốc ứng dụng `/learn-ai-with-me/`. Bản tiếng Anh thêm
`en/` sau gốc này, ví dụ `/learn-ai-with-me/en/courses/csc14003/lessons/b2`.

| Route | Nội dung |
|---|---|
| `/` | Trang chủ |
| `/courses` | Danh sách khóa học |
| `/courses/csc14003` | Lộ trình AI — 11 tuần |
| `/courses/data-engineering-foundation/lessons/b7` | Tuần 7 — Ingestion, Kafka và CDC (VI/EN) |
| `/courses/data-engineering-foundation` | Lộ trình Data Engineering Foundation và kiến thức đầu vào |
| `/courses/csc14003/tests` | Kiểm tra tổng hợp; `#p1`, `#p2`, `#p3`, `#p4` chọn phần |
| `/courses/csc14003/lessons/b1` | Buổi 1 — Nhập môn AI |
| `/courses/csc14003/lessons/b2` | Buổi 2 — Tác tử thông minh |
| `/courses/csc14003/lessons/b3` | Buổi 3 — Giải bài toán bằng tìm kiếm |
| `/blog` | Trang giữ chỗ cho blog |
| Đường dẫn không khớp | Trang không tìm thấy |

Router dùng `/courses/:slug` và `/courses/:slug/tests`; khóa chưa có bộ đề, như
Data Engineering Foundation, hiển thị thông báo chưa có kiểm tra. Slug không tồn tại
hiển thị trang không tìm thấy. CSC14003 hiện có bài học tương tác cho buổi 1–3.

## Dữ liệu người học

Lưu localStorage, key `csc14003-progress` (giữ nguyên key của bản thiết kế HTML nên tiến độ cũ trên cùng trình duyệt không mất). Tầng lưu trữ đi qua interface `KeyValueStore` trong `src/lib/storage.ts` — đổi backend chỉ cần viết adapter mới.

Mỗi khóa mới dùng key `<slug>-progress`; Data Engineering Foundation dùng
`data-engineering-foundation-progress`. Tiến độ dùng chung giữa VI/EN, tách biệt giữa các khóa,
kể cả khi trùng ID buổi như `b1`. Kiểm hợp đồng khóa học và lưu trữ bằng
`node scripts/check-course.mjs`.

Điểm kiểm tra cuối phần khóa theo `Part.id` (`foundations`/`searching`/`knowledge`/`ml`); dữ liệu cũ khóa theo chỉ số 1|2|3 được `storage.ts` tự chuyển khi đọc.

## Deploy

Site: **https://handonn2000.github.io/learn-ai-with-me/**

Push lên `main` là GitHub Actions tự build và deploy (`.github/workflows/deploy.yml`).
App chạy ở subpath `/learn-ai-with-me/` nên `vite.config.ts` khai `base` tương ứng và `BrowserRouter` nhận `basename={LOCALE_BASENAME}` (gốc ứng dụng, thêm `/en` khi đọc tiếng Anh). Nếu đổi tên repo hoặc gắn domain riêng thì phải sửa `base` (domain riêng → để `'/'`).

Route nội bộ đi qua `<Link to>` (Router tự cộng basename). Thẻ `<a>` thô dẫn tới trang nội bộ dùng `localeBase`; asset và tài liệu dùng `import.meta.env.BASE_URL` vì được chia sẻ giữa hai ngôn ngữ.

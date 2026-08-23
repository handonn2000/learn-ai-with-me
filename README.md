# learn-ai-with-me

Sổ tay tự học AI (CSC14003 · HCMUS) dạng web app — port từ bộ thiết kế HTML sang React.
Lộ trình 11 tuần với lịch ôn ngắt quãng, bài học tương tác (canvas lab chạy từng bước 7 thuật toán tìm kiếm), quiz chấm theo chủ đề. Kiến trúc data-driven, sẵn đường mở rộng thành blog/portfolio nhiều khóa học.

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build → dist/
npm run preview  # xem thử bản build
```

Yêu cầu Node 18+.

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
  features/
    roadmap/             trang lộ trình (tiến độ + lịch ôn + gợi ý hôm nay)
    tests/               kiểm tra tổng hợp từng phần (KaTeX cho công thức)
    lessons/b1/          Buổi 1 — Nhập môn AI (3 cảnh canvas + quiz 4 ô)
    lessons/b3/          Buổi 3 — Tìm kiếm (Manim Lab + Code Lab)
    search-lab/          search-engine.js — engine sinh trace 7 thuật toán
```

## Routes

- `/` — landing · `/courses` — danh sách khóa · `/blog` — placeholder
- `/courses/csc14003` — lộ trình · `/courses/csc14003/tests#p1..p4` — kiểm tra
- `/courses/csc14003/lessons/b1` · `/courses/csc14003/lessons/b3` — bài học tương tác

## Dữ liệu người học

Lưu localStorage, key `csc14003-progress` (giữ nguyên key của bản thiết kế HTML nên tiến độ cũ trên cùng trình duyệt không mất). Tầng lưu trữ đi qua interface `KeyValueStore` trong `src/lib/storage.ts` — đổi backend chỉ cần viết adapter mới.

Điểm kiểm tra cuối phần khóa theo `Part.id` (`foundations`/`searching`/`knowledge`/`ml`); dữ liệu cũ khóa theo chỉ số 1|2|3 được `storage.ts` tự chuyển khi đọc.

## Deploy

Site: **https://handonn2000.github.io/learn-ai-with-me/**

Push lên `main` là GitHub Actions tự build và deploy (`.github/workflows/deploy.yml`).
App chạy ở subpath `/learn-ai-with-me/` nên `vite.config.ts` khai `base` tương ứng và `BrowserRouter` nhận `basename={import.meta.env.BASE_URL}`. Nếu đổi tên repo hoặc gắn domain riêng thì phải sửa `base` (domain riêng → để `'/'`).

Hệ quả: **đừng viết đường dẫn tuyệt đối bắt đầu bằng `/`.** Route nội bộ đi qua `<Link to>` (Router tự cộng basename); asset và thẻ `<a>` thô phải tự cộng `import.meta.env.BASE_URL`.

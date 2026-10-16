# ADR-0019 — Deploy v2 lên Firebase Hosting

Ngày: 2026-10-16 · Trạng thái: chấp nhận

## Bối cảnh

v2 chưa thay `main`, nên chưa lên GitHub Pages (push `main` mới deploy). User muốn có bản v2 chạy thật để
dùng ngay. Firebase CLI đã cài sẵn trên máy (global, không vào `package.json`), tài khoản đã có project
`learn-ai-with-me` với site mặc định `learn-ai-with-me.web.app`.

## Quyết định

- Firebase Hosting, deploy tay bằng `npm run deploy:firebase` (test → `tsc -b && vite build --base=/` →
  `firebase deploy --only hosting`). Không thêm CI cho Firebase.
- Firebase phục vụ ở gốc tên miền nên build với `--base=/` qua cờ CLI; `vite.config.ts` giữ
  `/learn-ai-with-me/` cho GitHub Pages. App dùng hash router và không đọc `BASE_URL`, nên không cần rewrite.
- `firebase.json` bỏ `materials/**`: `vite build` chép `public/materials/` (slide của trường, gitignore,
  ~41MB) vào `dist/` khi build trên máy. Deploy từ máy mà không có dòng này là công khai tài liệu đó.
- Cache: `/assets/**` immutable 1 năm (tên file có hash), `index.html` no-cache.
- Không thêm dependency npm.

## Hệ quả

- Hai nơi deploy: Firebase (v2, tay) và GitHub Pages (`main`, CI). Khi v2 thay `main` thì quyết định có giữ
  cả hai không.
- Tiến độ người học theo origin: dữ liệu ở `localhost` hay GitHub Pages không sang `web.app`.
- Sau `deploy:firebase`, `dist/` là bản base `/`; `npm run build` dựng lại bản GitHub Pages.

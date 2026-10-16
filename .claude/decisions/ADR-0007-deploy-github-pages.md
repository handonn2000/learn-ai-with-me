# ADR-0007 — Deploy lên GitHub Pages, app sống ở subpath

Ngày: 2026-08-23 · Trạng thái: chấp nhận

## Bối cảnh
Repo đã public tại `handonn2000/learn-ai-with-me`. Cần một chỗ để người khác mở app bằng link,
không phải clone về chạy `npm run dev`. App là SPA tĩnh, không có backend, không có biến môi
trường bí mật — nghĩa là host tĩnh nào cũng đủ.

## Quyết định
GitHub Pages, build bằng GitHub Actions (`.github/workflows/deploy.yml`), nguồn Pages đặt là
`workflow` chứ không phải branch `gh-pages`. Site: https://handonn2000.github.io/learn-ai-with-me/

Vì là *project page*, app không nằm ở gốc domain mà ở `/learn-ai-with-me/`. Ba chỗ trong code
phải biết điều đó:

| Chỗ | Sửa thành |
|---|---|
| `vite.config.ts` | `base: '/learn-ai-with-me/'` — tiền tố cho mọi asset |
| `src/main.tsx` | `<BrowserRouter basename={import.meta.env.BASE_URL}>` |
| `content/courses/csc14003/index.ts` | ``const M = `${import.meta.env.BASE_URL}materials/` `` |

**Quy tắc rút ra: đừng viết đường dẫn tuyệt đối bắt đầu bằng `/` nữa.** Route nội bộ đi qua
`<Link to>` (React Router tự cộng basename). Asset và thẻ `<a>` thô phải cộng
`import.meta.env.BASE_URL`. Phiên này đã dính đúng một chỗ: thẻ `<a href='/courses/...'>` nằm
trong chuỗi `lead` của mục 11 bài 1 — nó không đi qua Router nên không ai cộng basename hộ.

## Deep link và 404
`BrowserRouter` + host tĩnh: gõ thẳng `/learn-ai-with-me/courses/csc14003` thì Pages đi tìm một
file không tồn tại. Workflow copy `dist/index.html` thành `dist/404.html` — Pages trả file đó,
React Router đọc `location.pathname` rồi dựng đúng trang. Trang vẫn về mã 404 ở tầng HTTP nhưng
người dùng thấy đúng nội dung. Không dùng `HashRouter` vì URL `#/` xấu và đụng anchor `#id` —
app này điều hướng trong bài bằng anchor.

## Hệ quả đã biết
- `public/materials/` bị gitignore (xem README), nên **bản deploy không có PDF nào** — mọi link
  tài liệu trên trang Lộ trình sẽ 404. Chấp nhận: phần giá trị của app là bài học tương tác.
- Đổi tên repo hoặc gắn custom domain thì phải sửa `base` trong `vite.config.ts` (domain riêng →
  để `'/'`). Quên bước này thì trang trắng và console báo không nạp được asset.

## Đã cân nhắc và bỏ
- **Vercel / Netlify** — deploy mượt hơn (app ở gốc domain, có SPA rewrite sẵn, không cần `base`),
  nhưng thêm một tài khoản dịch vụ ngoài. Repo đã ở GitHub, Pages là chỗ ít ma sát nhất.
- **Branch `gh-pages` + `gh-pages` npm package** — thêm dependency (ADR-0001 giữ Vite trần) và
  đẩy thư mục build vào lịch sử git. Actions sạch hơn.

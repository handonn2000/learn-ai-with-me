# ADR-0001 — Vite + React 18 + TypeScript strict, không thêm tooling

Ngày: 2026-08-21 · Trạng thái: chấp nhận

## Bối cảnh
Port 4 màn hình thiết kế HTML sang React project chạy được ngay; người dùng chọn TypeScript, bỏ qua toàn bộ tooling phụ (ESLint/Prettier/Vitest/CI đều không chọn trong form), deploy chưa quyết.

## Quyết định
- Vite 6 + @vitejs/plugin-react + React 18 + react-router-dom 6 (BrowserRouter).
- TS strict, alias @/ → src (điểm cộng đọc code, 0 dependency).
- Không ESLint/Prettier/test runner — `tsc -b` trong `npm run build` là cổng chất lượng duy nhất. Thêm sau bằng ADR mới nếu cần.
- Dependency runtime ngoài React: react-router-dom, katex. Hết.

## Hệ quả
- Cài đặt nhanh, không khớp nối CI. Đổi lại không có format tự động — giữ style thủ công theo CLAUDE.md.
- React 18 (không 19) để ổn định typings; nâng cấp là việc riêng có kiểm chứng.
- Deploy SPA cần rewrite về index.html (Vercel/Netlify mặc định có; GitHub Pages cần base + 404 trick — khi chọn nơi deploy thì ghi ADR bổ sung).

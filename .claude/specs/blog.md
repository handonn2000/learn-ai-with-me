# Spec — Blog (placeholder, chưa xây)

## Goal tương lai
Ghi chú học tập + portfolio. Route /blog đã có, đang là trang trống có chủ đích.

## Định hướng đã bàn (chưa chốt nguồn nội dung)
Ba lựa chọn khi xây thật — cần 1 ADR khi chọn:
1. Data .ts như courses (nhanh, type-safe, đồng bộ kiến trúc hiện tại) — khuyến nghị mặc định.
2. Markdown/MDX + vite plugin (viết dễ, thêm build step).
3. Lớp fetch để nối CMS/Supabase (khi cần viết từ điện thoại).

## Khung spec khi xây
- /blog: danh sách bài (title, date, tags, mô tả 1 câu) — card giống CoursesPage.
- /blog/:slug: bài viết, typography theo tokens (max-width 720px, 15.5px/1.75).
- Nội dung là một loại "content" mới: src/content/posts/ + types Post — KHÔNG trộn vào courses.

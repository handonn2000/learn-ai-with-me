# ADR-0002 — Style bằng CSS custom properties, không dùng Tailwind

Ngày: 2026-08-21 · Trạng thái: chấp nhận

## Bối cảnh
Bản thiết kế gốc là inline style dày đặc với bảng màu cố định; yêu cầu: port giống 1:1, dark+light theme, dễ maintain. Câu hỏi styling người dùng bỏ trống (decide-for-me).

## Quyết định
Design tokens = CSS custom properties trong global.css, 2 theme qua [data-theme]. Component class dùng chung cho pattern lặp (.card, .chip, .stat…), inline style (object) cho phần đặc thù từng chỗ — giữ cấu trúc gần bản gốc để đối chiếu.

## Lý do
- Đổi theme = đổi giá trị token, không đụng component (Tailwind cần dark: prefix rải khắp nơi).
- Port 1:1 từ inline style sang inline style là phép biến đổi an toàn nhất, diff được với bản gốc.
- 0 build step, 0 dependency.

## Hệ quả
- Không có purge/scan class; kỷ luật nằm ở quy ước "màu luôn qua var(--*)".
- Nếu sau này team quen Tailwind: tokens đã tập trung một chỗ, migrate từng phần được.

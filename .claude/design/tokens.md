# Design tokens

Nguồn chân lý: `src/styles/global.css`. Hai theme qua `[data-theme]` trên `<html>`.

## Font
- --font-sans: 'Be Vietnam Pro' — nội dung
- --font-serif: 'Spectral' — display/heading (h1 bài học 52px, mục 31px, lộ trình 38px)
- --font-mono: 'JetBrains Mono' — kicker/label/code/số liệu

## Màu (dark → light)
| Token | Dark | Light | Dùng cho |
|---|---|---|---|
| --bg | #0B0D12 | #F4F5F8 | nền trang (+ radial glow --bg-glow) |
| --panel | #12151A | #FFFFFF | card |
| --panel-2 | #0E1117 | #EEF1F5 | panel lồng trong card |
| --border / --border-2 / --border-3 | #232836 / #1E2430 / #2A3242 | xám nhạt tương ứng | viền 3 cấp |
| --text / --text-hi | #E8ECF4 / #ECEFF4 | #1A2029 / #10151D | chữ chính / nhấn mạnh |
| --text-2, --muted, --muted-2, --faint, --faint-2 | giảm dần độ nổi | tương ứng | body → chú thích |
| --cyan #58C4DD | #147F9C | accent chính, link, frontier |
| --yellow #F4D345 | #9C7A06 | nhấn, "đang mở", badge buổi |
| --green #83C167 | #3E7D2C | đúng/hoàn thành/đường đi, phần I |
| --red #FC6255 | #C43D32 | sai/cảnh báo/kẹt |
| --purple #C792EA | #7D43B3 | phần III, cập nhật decrease-key |
| --orange/--pink | GBFS / HC trong bảng |
| --on-accent | #0B0D12 | #FFFFFF | chữ trên nền accent |

Màu mềm (nền 8–14%): dùng `color-mix(in srgb, var(--x) N%, transparent)` — không hardcode rgba.

## Ngoại lệ giữ nền tối ở cả 2 theme
`.canvas-panel` (canvas vẽ hex cứng #12151A/#58C4DD/…) và `.codeblock` (#0B0E14) — như code editor. Đây là chủ đích, đừng "sửa".

## Class dùng chung
.card, .panel-inner, .chip (+--mono), .kicker, .mono, .btn (+--primary/--toggle-on), .stat (+--good/--warn/--bad),
.dtable, .check-item, .sec-head/.sec-rule/.sec-lead, .mn (reveal), .lesson-nav* (hai hàng: __row + __links),
.lesson-section (+--first/--last — khối một mục, thay hằng `wrap` cũ), .lesson-hero,
.deck-toggle/.deck-bar/.deck-tick/.deck-slide (chế độ trình chiếu, ADR-0006), .hl-* (màu chữ trong Html strings).

### DEF b7 framework artwork
`.def-lesson` defines `--def-logo-paper: #fff` solely as the backing for unmodified
brand images, keeping black/colored marks legible in both themes. All surrounding
visual surfaces and text use existing semantic theme tokens. New figures use
`.def-visual`; they do not change shared card or canvas tokens.

### DEF b7 syntax and emphasis — 2026-09-09
Scoped `.def-syntax` uses semantic theme tokens for keys, strings, numbers, literals and
punctuation. Use `--cyan-hi` for keys and `--green-soft` for strings; lab numeric/code
labels use readable variants in light mode. `.def-term` emphasizes selected terms, and
`.def-key-idea` separates a chapter's teaching point from syntax coloration. No shared
token values or framework artwork colors were changed.

### DEF b7 Data Island
The actual WebGL scene intentionally stays twilight in both page themes, with matching
scoped `--world-*` tokens for cream projected labels, teal record signals and gold
orchestration signals. Surrounding tabs, station details and route text follow the page
theme. The island renderer uses its own fixed palette, as other canvas scenes do.

# Học AI cùng tôi — v2

Sổ tay tự học AI dạng web app, viết lại từ đầu. Thay vì những trang bài dài, v2 tổ chức kiến thức thành
**đồ thị kỹ năng**: chọn một mục tiêu, app lần ngược qua các kỹ năng tiên quyết để vẽ ra tuyến học, mỗi ga
là một lesson ~10 phút gồm phần giải thích ngắn và 2–4 bài tập làm ngay.

Bản đầu có tuyến **Hiểu A\*** (CSC14003, buổi 3–5): 9 lesson, kiểm tra xếp lớp để bỏ qua phần đã biết,
lịch ôn FSRS theo từng kỹ năng, và bản đồ kỹ năng.

Thiết kế, quy tắc viết bài và lý do chọn công nghệ: [docs/DESIGN.md](docs/DESIGN.md).

## Chạy

```bash
npm ci
npm run dev       # http://localhost:5173/learn-ai-with-me/
npm test          # engine thuật toán, đồ thị kỹ năng, luật nội dung
npm run build     # tsc + vite build → dist/
```

Node 20+.

## Dữ liệu người học

Lưu trong trình duyệt (localStorage, key `learn-ai-v2`). Không gửi đi đâu.
Bản v1 dùng key khác (`csc14003-progress`) nên hai bản không đụng nhau.

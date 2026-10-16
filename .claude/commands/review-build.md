Kiểm tra sức khỏe repo trước khi kết thúc phiên.

1. npm run build — phải sạch lỗi TS + vite.
2. Grep các vi phạm quy ước: "localStorage." ngoài src/lib/ (trừ theme.tsx, index.html); mã màu hex mới trong src/ ngoài global.css và các file scenes/*.ts + SearchLab/CodeLab (canvas được phép hex).
3. Mở /: đổi theme, vào lộ trình, tick một buổi Xong, mở b3 chạy BFS, làm 1 câu test — không lỗi console.
4. Mở một bài học và **bấm nút đổi chế độ xem cả hai chiều**: cuộn phải hiện đủ mọi mục, trình chiếu
   phải bắt đầu ở slide bìa. Kiểm canvas ở ÍT NHẤT HAI bề rộng cửa sổ, một cái xa 640px — lỗi canvas
   bị kéo giãn từng bị che vì cửa sổ test tình cờ rộng ~640 (ADR-0006).
5. Ghi kết quả + việc dở dang vào .claude/progress.md.

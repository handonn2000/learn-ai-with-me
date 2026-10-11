# Buổi 7 — browser review của author

Ngày 2026-10-07. Codex in-app browser, Vite local, route `/learn-ai-with-me/courses/csc14003/lessons/b7`. Kiểm tra UI qua CUA; không suy browser PASS từ build. Báo cáo độc lập quality chỉ xác nhận content/code.

## Kết quả đã quan sát

| Kiểm tra | Kết quả |
|---|---|
| Mặc định lab | A=3, full4/4 lá, α–β3/4, b₂ bỏ qua; B≤0 |
| Đổi b₂ từ 7 lên 100 | Vẫn A=3, không nhầm lá lớn nhất với điểm bảo đảm |
| Đổi b₁ lên 4 | B=4, full/α–β cùng lựa chọn; phải tính4 lá |
| Khôi phục | Trả3, 5, 0, 7, MAX, A trước B |
| B trước A | Giá trị3, chọn A; α–β đọc4 lá |
| Gốc MIN | Các con MAX, giá trị5, chọn A |
| Xác suất 1/2 | Bar đổi tỷ lệ; kỳ vọng4,5, chọn cược |
| Recall | Có thể sửa đáp án sai; dấu✓ và giải thích hiện khi chọn đúng |
| Quiz | Trả lời câu 1: 1/8, ✓ ĐÚNG và giải thích cùng góc nhìn MAX |
| Trình chiếu | Nhấn đủ 12 ticks:hero/toan/model/minimax/lab/pruning/limits/chance/extensions/summary/quiz/practice khớp nhãn và số slide |
| Bàn phím trong hình | ArrowRight trên tree focus giữ cùng slide minimax |
| Mobile 375×812 | Body/document width 375, không tràn ngang toàn trang; tree cuộn cục bộ 520 trong vùng 297; input/select đọc được |
| Minimax loop | Quan sát hai đoạn lấy mẫu10×2,4s, thấy tất cả pha1–8, giữ kết quả thêm nhịp và reset; caption khớp lá/backup/root |
| α–β loop | Hai đoạn lấy mẫu10/9×2,4s, thấy tất cả pha1–7, cut≤0 và root A=3, giữ/replay đúng |
| Offscreen/slide ẩn | Minimax suspended trong slide α–β và ngược lại; không cả hai cùng chạy sau update observer |
| VI/EN | EN heading/nav/lab/results chuyển đúng, engine giữ 3 và3/4; sau kiểm tra trả VI |
| Console | Không error do bài trong captured logs |

Đã xem ảnh thực tế desktop dark α–β và mobile375 dark lab/prose. Viewport override được reset. Không thử điện thoại vật lý, screenreader, theme sáng, document-hidden/reduced-motion signal thực: hai nhánh lifecycle này được đọc code có visibilitychange/matchMedia/cleanup và static finalfallback, không gọi là browserverified. Touchshield đã được reviewer độc lập đọc lại, chưa mô phỏng touch device. Giới hạn này không thay đổi các kết quả đã trực tiếp quan sát ở trên.

## Quyết định trải nghiệm

Giữ 2D cho cây: vị trí cha/con, lần đọc và nhánh cắt có ý nghĩa học rõ. Mỗi animation có lời giải tĩnh và một cây nhất quán. Chỉ lab/chance/recall yêu cầu thao tác, tránh bắt người mới điều khiển playback trước khi hiểu cơ chế. Không dependency 3D được thêm.

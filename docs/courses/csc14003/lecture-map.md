# CSC14003 — tài liệu gốc ↔ mục tiêu v2

Nguồn: `HCMUS/CacThuatToanThongMinhNhanTao/Lecture/` (11 thư mục `buoi1`–`buoi11`, 23 PDF). Bản trong repo
ở `public/materials/Lecture/` cùng nội dung nhưng đánh số 13 buổi (ADR-0018 tách Lecture03 thành buổi 3, 4, 5).
Phân tích ngày 2026-10-13.

| Thư mục gốc | Repo | Tài liệu | Nội dung chính | Mục tiêu v2 | Trạng thái |
|---|---|---|---|---|---|
| buoi1 | buổi 1 | Lecture01 (54 tr.), Homework1 | AI là gì (4 hướng), nền tảng, lịch sử, ứng dụng | — | không có mục tiêu riêng |
| buoi2 | buổi 2 | Lecture02 (65 tr.) | Tác tử, duy lý, PEAS, 7 chiều môi trường; cấu trúc tác tử (bảng tra, 5 kiến trúc, tác tử học) | `peas` | **có**, trang 3–42; trang 43–64 chưa có |
| buoi3 | buổi 3 | Lecture03-P1 (43 tr.), Homework3 | Tác tử giải bài toán, mô hình hóa, ví dụ, cây/đồ thị tìm kiếm | `astar` (4 ga đầu) | có |
| buoi3 | buổi 4 | Lecture03-P2 (64 tr.) | BFS, UCS, DFS, DLS, IDS, hai chiều | `astar` (UCS), `algo-choice` | một phần; `algo-choice` còn mẫu |
| buoi3 | buổi 5 | Lecture03-P3 (73 tr.) | GBFS, A*, IDA*/RBFS/SMA*, thiết kế heuristic | `astar` | một phần (chưa có tìm kiếm giới hạn bộ nhớ, thiết kế heuristic) |
| buoi4 | buổi 6 | Lecture04 (42 tr.), Homework4 | Leo đồi, ủ mô phỏng, local beam, giải thuật di truyền | `local` | mẫu |
| buoi5 | buổi 7 | Lecture05 (51 tr.), Homework5 | Minimax, α–β, quyết định thời gian thực, trò chơi ngẫu nhiên | `alphabeta` | mẫu |
| buoi6 | buổi 8 | Lecture06 (62 tr.), Homework6 | CSP, lan truyền ràng buộc, quay lui, tìm kiếm cục bộ, cấu trúc bài toán | `csp` | mẫu |
| buoi7 | buổi 9 | Lecture07 (97 tr.), Homework7 | Tác tử dựa tri thức, Wumpus, logic mệnh đề, chứng minh, kiểm mô hình | `kb` | mẫu |
| buoi8 | buổi 10 | Lecture08 (97 tr.), Homework8 | FOL, hợp nhất, suy diễn tiến/lùi, resolution | `fol` (+ `kb`) | mẫu |
| buoi9 | buổi 11 | Lecture09 (60 tr.), Homework9 | Phân phối đồng thời, suy diễn chính xác, dựng mạng Bayes | `bayes` | mẫu |
| buoi10 | buổi 12 | Lecture10 (134 tr.) | Nhập môn học máy, cây ID3, Naive Bayes | `id3` | mẫu; Naive Bayes chưa có mục tiêu |
| buoi11 | buổi 13 | Lecture11 (88 tr.) | Perceptron, mạng nhiều lớp, lan truyền ngược | `perceptron` | mẫu; mạng nhiều lớp chưa có mục tiêu |

Lưu ý về đề bài tập: số thứ tự Homework lệch với nội dung. `Homework1` là đề PEAS + 4 chiều môi trường
(trốn tìm, bịt mắt bắt dê), dùng cho mục tiêu `peas`. `Homework2` là đề tìm kiếm (UCS, BFS, DFS trên mê cung).

# Mục tiêu "Mô tả một agent thông minh" (PEAS) — dàn ý v2

Nguồn: `public/materials/Lecture/buoi2/Lecture02-IntelligentAgents.pdf` (65 trang, trùng byte với bản trong
`HCMUS/CacThuatToanThongMinhNhanTao/Lecture/buoi2`) và đề PEAS nằm ở `buoi1/Homework1.pdf` (trốn tìm, bịt mắt
bắt dê). `buoi2/Homework2.pdf` là đề tìm kiếm (UCS/BFS/DFS), không thuộc mục tiêu này.

Phạm vi: phần "Agents and environments", "Rationality" và "Nature of environments" (trang 3–42). Phần
"Structure of agents" (trang 43–64: bảng tra, năm kiến trúc, agent học) **không** thuộc mục tiêu này — đề xuất
làm mục tiêu hoặc ga riêng sau.

Thuật ngữ theo `docs/DESIGN.md` § Thuật ngữ: "agent", "percept" giữ tiếng Anh; cảm biến (sensor), bộ chấp hành
(actuator), thước đo hiệu năng (performance measure), bảy chiều môi trường… dịch và kèm tiếng Anh ở lần đầu mỗi lesson.

Mục tiêu: `goals.peas`, đích `env-classify`. Tuyến 5 ga, mỗi ga một lesson (≤ 3 bước giải thích, ≤ 550 từ,
2–4 bài tập, ≤ 1 trắc nghiệm), nhịp như các ga của "Hiểu A*".

| Ga | Kỹ năng (id) | Chỗ vướng cần gỡ | Bước |
|---|---|---|---|
| 1 | Agent, cảm biến, bộ chấp hành (`agent`) | Agent không chỉ là robot; hàm agent nhận cả *chuỗi* percept | 2 giải thích (vòng nhìn–làm; bảng hàm agent thế giới hút bụi) · phân loại S/A · phân loại cảm biến/percept/bộ chấp hành/hành động (chatbot) · tính số dòng bảng · trắc nghiệm tra hàm agent qua chương trình · giấy |
| 2 | Agent duy lý (`rationality`) | Thước đo chấm *môi trường*, không chấm cách làm; duy lý ≠ toàn tri | đoán trước (rác hút được hay sàn sạch) · 3 giải thích (thước đo; bốn thứ quyết định duy lý; toàn tri, thu thập thông tin, học, tự chủ) · 2 phân loại (bốn thứ, mỗi nhóm hai mục; thước đo chấm gì) · 1 trắc nghiệm (duy lý vs toàn tri) · giấy |
| 3 | Viết PEAS (`peas`) | P là kết quả không phải hành động; màn hình là A, bàn phím là S; E không chứa bộ phận của agent | 2 giải thích (taxi; năm agent trong bảng + softbot + bốn chỗ hay nhầm) · phân loại PEAS drone (mỗi chữ hai mục, có mục bẫy) · sửa ô sai · trắc nghiệm · giấy: Homework1 Q1 |
| 4 | Bốn chiều đầu (`env-dims`) | Thấy hết chưa chắc đoán được; đối thủ khó đoán không làm game thành ngẫu nhiên | đoán trước (cờ vua tất định?) · 2 giải thích · phân loại theo từng chiều (Sudoku, poker) · từng hồi/tuần tự · trắc nghiệm xe máy bên cạnh · giấy: Homework1 Q2 |
| 5 | Đủ bảy chiều (`env-classify`) | Nửa động; biết luật ≠ quan sát được | 3 giải thích (tĩnh/động/nửa động; rời rạc/liên tục, biết/chưa biết luật; bảng 10 môi trường, đầu dễ – đầu khó) · phân loại cờ tướng có đồng hồ · tĩnh/động/nửa động · trắc nghiệm game mới · giấy: Homework1 Q3–Q4 |

Hình: `AgentLoop` (HTML tĩnh, vòng agent ↔ môi trường), `PeasCards` (thẻ PEAS, xếp chồng trên điện thoại),
`DataTable` (bảng thế giới hút bụi, bảng bảy chiều; cuộn ngang trong khung, cột đầu dính; vế khó nền violet nhạt, nửa động viền đứt). Không animation:
v2 chỉ dùng chuyển động khi trả lời thao tác của người học (docs/DESIGN.md §2).

Dữ liệu dùng chung: `src/content/agents.ts` (bảng PEAS trang 29, 31; bảng môi trường trang 40). Giữ đúng ô của
tài liệu gốc; dịch nghĩa, không đổi phân loại.

Điểm cần diễn giải chính xác:
- Thước đo hiệu năng chấm **chuỗi trạng thái của môi trường**, không phải trạng thái của agent (trang 14).
- Ví dụ thước đo hút bụi: trang 18 ghi "10000 timesteps", sách AIMA ghi 1000 — bài không nêu số bước.
- Tất định: bỏ qua bất định chỉ đến từ hành động của agent khác (AIMA 3e §2.3.2) — vì vậy cờ vua có đồng hồ
  là tất định trong bảng trang 40.
- Một/nhiều agent: B là agent khi hành vi của B được mô tả đúng nhất là tối đa một thước đo phụ thuộc hành vi
  của A (trang 35). Chẩn đoán y khoa là một agent trong bảng.
- Biết/chưa biết luật không cùng trục với quan sát được: bài bài úp (biết luật, quan sát một phần) và game mới
  (thấy hết màn hình, chưa biết luật) — ví dụ của AIMA, slide chỉ nêu định nghĩa.
- Bảng trang 40 không có cột biết/chưa biết luật; bài không tự điền cột này cho mười môi trường.
- Số dòng bảng hàm agent: 4 percept ⇒ chuỗi dài 2 có 16 dòng, dài 3 có 64; đủ mọi độ dài tới 10 là
  4 + 4² + … + 4¹⁰ = 1.398.100.

Bài tập giấy dùng đề Homework1 (đề không có đáp án). Đáp án gợi ý do bài tự soạn, ghi rõ là một cách viết,
không phải cách duy nhất.

Kiểm: `npm test` (đồ thị, chấm bài, ≤ 550 từ, MDX), `npm run build`, mở cả 5 ga ở 1280px và 390px, đi hết một
lượt từ bản đồ khóa → mục tiêu → ga → qua ga; review chất lượng độc lập (`lesson-quality-judge`).

## Phương pháp từng bước (skill `learning-methods`)

Cả năm ga là loại **P** (phân loại/áp khuôn), riêng `rationality` là **K** (xét có duy lý không). Một dòng mỗi bước:
`bước · phương pháp · vì sao`.

**`agent`** (P)
```
guess      · bỏ · ga đầu của mục tiêu: buổi học chỉ đoán trước cho ga sau, nên không ai gặp bước đoán của ga này
explain 1  · M2/M12 · khuôn cảm biến/bộ chấp hành + 3 ví dụ trải rộng (người, robot, phần mềm)
explain 2  · M2/M12 · bảng hàm agent hai ô làm mẫu, rồi chương trình ba dòng
ex 1       · M3 · classify cảm biến / bộ chấp hành (robot hút bụi đời mới, có mục bẫy "loa")
ex 2       · M4 · classify bốn nhóm: tách percept khỏi cảm biến, hành động khỏi bộ chấp hành (chatbot) — bài xử lý sâu
ex 3       · M3 · tính số dòng bảng dài 3
ex 4       · M2/M3 · làm tiếp ví dụ mẫu: tra một dòng nằm trong "…" bằng chương trình ba dòng (đọc hàm agent)
paper      · M6/M11 · vẽ vòng agent – môi trường cho ứng dụng chỉ đường
recall     · M7 · bốn khái niệm cho agent tự chọn + hàm khác chương trình ở đâu
check      · M8/M10 · robot gắp linh kiện (không có trong lesson này)
reorganize · bỏ · khuôn chỉ hai ô, chưa đủ ý để tổ chức lại
```

**`rationality`** (K)
```
guess      · M1 · lượng rác hay số ô sạch — ngộ nhận thật: chấm cách làm
explain 1  · M4 · cặp đối lập rác / sàn sạch → luật đặt thước đo
explain 2  · M2/M12 · bốn thứ + định nghĩa + ví dụ đi thi; robot hai ô duy lý khi nào (ngoài Đào sâu)
explain 3  · M4 · toàn tri vs duy lý; thu thập thông tin, học, tự chủ (đồng hồ)
ex 1       · M3/M10 · classify bốn thứ, mỗi nhóm hai mục, cặp bẫy "ít vi phạm luật" / "luật đã nạp"
ex 2       · M4 · so sánh: thước đo chấm môi trường hay chấm cách làm
ex 3       · M4 · choice: kết quả xấu mà vẫn duy lý (phản ví dụ của "duy lý = kết quả tốt")
paper      · M6/M11 · đặt và sửa thước đo cho ứng dụng gợi ý video
recall     · M7 · bốn thứ + vì sao agent duy lý vẫn có thể ra kết quả xấu
check      · M8/M10 · thước đo cho máy lọc không khí (ca mới)
relate     · chưa làm · có ≥ 4 ý liên quan (thước đo, duy lý, toàn tri, thu thập thông tin, tự chủ); đề xuất ở review độc lập
```

**`peas`** (P)
```
guess      · M1 · màn hình là S hay A — cặp hay đảo nhất
explain 1  · M2/M12 · khuôn PEAS + taxi, P giằng co
explain 2  · M2/M12 · 5 agent trang 31 + softbot (ca biên) + bốn chỗ hay nhầm
ex 1       · M3/M10 · classify PEAS drone, mỗi chữ hai mục, mục bẫy người nông dân → E
ex 2       · M5 · tìm lỗi: PEAS taxi đặt nhầm ô
ex 3       · M5 · ca biên / tìm lỗi: P viết bằng cách làm
paper      · M6/M11 · Homework1 Q1 (trốn tìm)
recall     · M7 · khuôn + PEAS cho agent tự chọn + bốn chỗ hay nhầm
check      · M8/M10 · robot cắt cỏ, cặp bẫy "cơn mưa" / "cảm biến mưa"
reorganize · bỏ · khuôn bốn chữ đã là một bảng; bốn chỗ hay nhầm nằm sẵn ở giải thích 2
```

**`env-dims`** (P)
```
guess      · M1 · cờ vua tất định? — ngộ nhận thật: đối thủ khó đoán = ngẫu nhiên
explain 1  · M2/M12 · chiều 1–2 + câu hỏi agent
explain 2  · M4 · chiều 3–4; cặp đối lập cờ cá ngựa (thấy hết mà vẫn ngẫu nhiên)
ex 1–2     · M3/M10 · Sudoku, poker theo bốn chiều
ex 3       · M3/M10 · từng hồi / tuần tự, có ca biên (bộ lọc thư rác)
ex 4       · M4 · choice: xe máy bên cạnh là agent? (phương án ngắn, lý do ở lời giải)
paper      · M6/M11 · Homework1 Q2, mỗi chiều một câu lý do (xử lý sâu)
recall     · M7 · bốn chiều + câu hỏi + vì sao cờ vua tất định
check      · M8/M10 · Tetris (đầy đủ nhưng ngẫu nhiên — khác mọi ví dụ trong lesson)
reorganize · bỏ · ga chỉ có bốn chiều; lưới đủ bảy chiều để ở env-classify (đề xuất)
```

**`env-classify`** (P)
```
guess      · M1 · cờ vua có đồng hồ: vế nửa động hay bị quên
explain 1  · M2/M12 · tĩnh / nửa động / động
explain 2  · M4 · rời rạc; cặp đối lập biết luật vs quan sát được (xì dách, game mới)
explain 3  · M2/M12 · bảng 10 môi trường, đầu dễ / đầu khó, phân loại tùy cách định nghĩa
ex 1       · M3/M10 · cờ tướng có đồng hồ theo sáu chiều (gợi ý chỉ đưa câu hỏi, không trỏ vào hàng bảng)
ex 2       · M3/M10 · tĩnh / nửa động / động, có ca bài thi có giờ
ex 3       · M4 · choice: tách biết luật khỏi quan sát được
paper      · M6/M11 · Homework1 Q3–Q4 + ba chiều sau
recall     · M7 · bảy chiều + ví dụ tự nghĩ cho vế khó
check      · M8/M10 · trò trượt 8 số có điểm theo thời gian (hồ sơ trộn: dễ ở năm chiều, nửa động). Cũng là câu xếp lớp của mục tiêu
reorganize · chưa làm · lưới bảy chiều + câu hỏi + ca biên; đề xuất ở review độc lập
```

Câu kiểm tra (`checks`) dùng agent/môi trường **không có** trong lesson của ga đó (luật 2). Gợi ý chỉ đưa câu hỏi
phải tự hỏi, không đưa đáp án hay trỏ vào một hàng bảng đã thấy.


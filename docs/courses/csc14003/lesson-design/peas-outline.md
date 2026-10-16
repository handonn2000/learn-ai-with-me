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
| 1 | Agent, cảm biến, bộ chấp hành (`agent`) | Agent không chỉ là robot; hàm agent nhận cả *chuỗi* percept | 2 giải thích (vòng nhìn–làm; bảng hàm agent thế giới hút bụi) · phân loại S/A · trắc nghiệm chatbot · tính số dòng bảng |
| 2 | Agent duy lý (`rationality`) | Thước đo chấm *môi trường*, không chấm cách làm; duy lý ≠ toàn tri | đoán trước (rác hút được hay sàn sạch) · 3 giải thích (thước đo; bốn thứ quyết định duy lý; toàn tri, thu thập thông tin, học, tự chủ) · 2 phân loại · 1 trắc nghiệm |
| 3 | Viết PEAS (`peas`) | P là kết quả không phải hành động; màn hình là A, bàn phím là S; E không chứa bộ phận của agent | 2 giải thích (taxi; năm agent trong bảng + softbot + bốn chỗ hay nhầm) · phân loại PEAS drone · sửa ô sai · trắc nghiệm · giấy: Homework1 Q1 |
| 4 | Bốn chiều đầu (`env-dims`) | Thấy hết chưa chắc đoán được; đối thủ khó đoán không làm game thành ngẫu nhiên | đoán trước (cờ vua tất định?) · 2 giải thích · phân loại theo từng chiều (cờ cá ngựa) · từng hồi/tuần tự · trắc nghiệm xe máy bên cạnh · giấy: Homework1 Q2 |
| 5 | Đủ bảy chiều (`env-classify`) | Nửa động; biết luật ≠ quan sát được | 3 giải thích (tĩnh/động/nửa động; rời rạc/liên tục, biết/chưa biết luật; bảng 10 môi trường, đầu dễ – đầu khó) · phân loại cờ tướng có đồng hồ · tĩnh/động/nửa động · trắc nghiệm game mới · giấy: Homework1 Q3–Q4 |

Hình: `AgentLoop` (SVG tĩnh, vòng agent ↔ môi trường), `PeasCards` (thẻ PEAS, xếp chồng trên điện thoại),
`DataTable` (bảng thế giới hút bụi, bảng bảy chiều; cuộn ngang trong khung, cột đầu dính). Không animation:
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

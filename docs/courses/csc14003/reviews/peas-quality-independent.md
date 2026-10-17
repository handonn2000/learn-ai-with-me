# Mục tiêu `peas` (5 ga): review chất lượng độc lập

**Người review:** agent `lesson-quality-judge`, chỉ đọc, không sửa file nào. Phiên điều phối lưu report này và soát
lại một số điểm (xem §0). **Ngày:** 2026-10-17. **Ảnh chụp:** nhánh `v2`, HEAD `13d8e71`, working tree sạch.
Report này thay kết luận của self-review [`peas-quality.md`](peas-quality.md) (2026-10-13); self-review cũ được giữ
nguyên làm bản ghi.

## 0. Phiên điều phối đã soát lại

Trước khi lưu, tôi đối chiếu các điểm sau với code và slide ở HEAD 13d8e71. Tất cả đều đúng như judge báo:

- M1: `recall.ts` chỉ có `rationality`, `peas`, `env-classify`, `ucs`, `admissible`.
- M2: gợi ý `env-classify-c1` ("ví dụ kinh điển của tình huống ngoài đời thật") và `rationality-c1` ("…trong môi
  trường").
- M3: `env-dims-c1` dùng cờ vua, `env-classify-c1` dùng taxi, `peas-c1` dùng robot hút bụi.
- M4: nút classify trong `inputs.tsx` là `px-3 py-1 text-[14px]`, không có chiều cao tối thiểu.
- m1: `env-dims/1.mdx` viết "mỗi chiều có hai vế".
- m2: đáp án giấy trốn tìm có lý do "bị che khuất".
- m9: `DataTable.tsx` tô mọi vế `i > 0` cùng một màu.
- m10: `Deep.tsx`, summary không có chiều cao tối thiểu.
- m3 (một phần): bảng thuật ngữ ở DESIGN.md có "agent duy lý" ở cả dòng giữ tiếng Anh lẫn dòng dịch + kèm.
- Homework1 Q1–Q4 khớp các bước giấy, theo `pdftotext`.

Tôi chưa soát lại từng ô bảng trang 40 và chưa kiểm số từ. Hai phần này lấy theo judge.

## 1. Kết luận

**PASS có điều kiện**, tức là **cần sửa** trước khi coi là xong. Không có lỗi chặn (blocker). Có 5 lỗi major, không
lỗi nào là sai kiến thức.

Phạm vi là 5 ga `agent`, `rationality`, `peas`, `env-dims`, `env-classify`, đối chiếu với Lecture02 trang 3–42 và
Homework1 Q1–Q4. Trang 43–65 (cấu trúc agent) nằm ngoài mục tiêu, nên không trừ điểm. Review ở mức tĩnh: judge
không mở trình duyệt.

Phần kiến thức rất chắc:

- Bảng trang 40 trong `agents.ts` đúng 60/60 ô.
- Bảng PEAS trang 29 và 31 đúng từng ô.
- Định nghĩa duy lý khớp trang 17.
- Bảy chiều, vế nửa động, chiều biết/chưa biết luật đều đúng.
- Số liệu đúng: 4 percept, 64 dòng, 1.398.100 dòng.
- Không đáp án chấm tự động nào sai (16 bài tập + 5 câu kiểm tra).

Các lỗi nằm ở bốn chỗ:

- phương pháp học: thiếu câu nhớ lại, câu kiểm tra lặp ví dụ trong bài, gợi ý lộ đáp án;
- hit target trên điện thoại;
- vài câu sai nhỏ;
- quy ước thuật ngữ.

## 2. Lỗi xếp theo mức độ

### Blocker

Không có.

### Major

**M1. Thiếu câu nhớ lại cho `agent` và `env-dims`.**

- **Chỗ:** `src/content/recall.ts`.
- **Căn cứ:** learning-methods luật 4 và Bước 4. Thiếu câu nhớ lại thì hai kỹ năng này chỉ được ôn bằng câu có
  phương án sẵn, tức là chỉ luyện nhận ra.
- **Sửa:**
  - `agent`: "Phân biệt cảm biến, percept, bộ chấp hành, hành động bằng một agent bạn tự chọn. Hàm agent khác
    chương trình agent ở đâu?"
  - `env-dims`: "Kể bốn chiều đầu, mỗi chiều kèm phép thử để chọn vế. Vì sao cờ vua vẫn tất định?"

**M2. Gợi ý hoặc phương án lộ đáp án.**

- **Căn cứ:** Bước 4, "gợi ý đưa luôn đáp án là lỗi cần sửa".
- `skillsAgents.ts:114`, `env-classify-c1`: gợi ý "ví dụ kinh điển của 'tình huống ngoài đời thật'". Bài
  `env-classify/3.mdx` đã liệt kê đủ sáu vế của tình huống thật, nên gợi ý cho luôn cả sáu ô. Câu này còn là câu xếp
  lớp của đích (`checks[0]`). Người chưa học chỉ cần chọn "vế khó" cho mọi chiều là qua.
- `skillsAgents.ts:49`, `rationality-c1`: chỉ phương án đúng chứa chữ "môi trường", mà gợi ý lại nhắc đúng chữ đó.
- `env-dims/index.ts:80, 85`, `env-dims-e4`: phương án đúng chép nguyên phép thử ở trang 35, và gợi ý lặp lại đúng
  các chữ đó.
- Ca ranh giới, `env-classify/index.ts:39`, `env-classify-e1`: gợi ý "Cờ tướng giống cờ vua ở mọi chiều", trong
  khi hàng cờ vua có đồng hồ vừa hiện ở bước 3. Gợi ý cho luôn 5/6 ô.
- **Sửa:**
  - Gợi ý chỉ đi nửa đường, ví dụ "Xét từng chiều: trong lúc taxi 'nghĩ', đường có đứng chờ không?"
  - Ở e4, viết lại phương án cho ngắn, để phần lý do sang lời giải.
  - Ở `rationality-c1`, cho chữ "môi trường" xuất hiện trong ít nhất một phương án sai.

**M3. Câu kiểm tra lặp nguyên ví dụ trong bài.**

- **Căn cứ:** luật 2 "ôn bằng bối cảnh mới".
- **Chỗ:**
  - `env-dims-c1` (`skillsAgents.ts:89–95`) dùng cờ vua. Đây là ví dụ của bước đoán và của cả ba đoạn giải thích.
  - `env-classify-c1` (`:109–115`) dùng taxi. Đây là một hàng trong bảng, và bài viết rõ "Lái taxi nằm ở vế khó
    trên cả sáu".
  - `peas-c1` (`:64–76`) dùng robot hút bụi, với đúng các mục `AgentLoop` ở `agent/1.mdx`.
- **Hệ quả:** kiểu ôn rút từ `checks` cộng bài tập của lesson. Với ba ga này, kho câu ôn không còn bối cảnh nào mới.
- **Sửa:** dùng agent hoặc môi trường mới, có đáp án rõ:
  - `env-dims`: cờ caro, hoặc robot phân loại thư;
  - `env-classify`: drone giao hàng, hoặc Tetris. Tránh tennis cho câu chấm tự động vì có ô cãi được;
  - `peas`: máy pha cà phê, hoặc robot cắt cỏ, có mục bẫy.

**M4. Nút phân loại thấp hơn 44px.**

- **Chỗ:** `src/exercises/inputs.tsx:215`, nút `rounded-full border px-3 py-1 text-[14px]`, cao khoảng 30px.
- **Phạm vi:** 10/16 bài tập và 3/5 câu kiểm tra của mục tiêu là dạng classify. Bài xếp theo chiều đặt 2–3 nút sát
  nhau (`gap-1.5`).
- **Sửa:** thêm `min-h-11 px-4`, đổi sang `gap-2`, rồi kiểm ở 375px.
- Suy từ class, chưa đo trong trình duyệt. Lỗi nằm ở component chung, nên ảnh hưởng mọi mục tiêu chứ không riêng
  `peas`.

**M5. Ga `agent` không luyện hai vế trong "Học xong bạn làm được", và thiếu bài xử lý sâu.**

- **Chỗ:** `skillsAgents.ts:13` hứa người học "chỉ ra … percept" và "đọc hàm agent như một bảng". Ba bài tập lại chỉ
  luyện cảm biến/bộ chấp hành (e1, e2) và đếm số dòng (e3).
- **Thiếu:**
  - không bài nào bắt tách percept khỏi cảm biến;
  - không bài nào bắt tra bảng hay lần theo chương trình để ra hành động;
  - không có bài so sánh hay tìm lỗi.
- **Sửa:**
  - Một bài classify bốn nhóm "Cảm biến / Percept / Bộ chấp hành / Hành động", có mục bẫy "ảnh camera vừa chụp"
    → Percept.
  - Một câu tra bảng: "`[A, Sạch], [A, Bẩn]` → ?" Đáp án: Hút.

### Minor

- **m1.** `env-dims/1.mdx:1` viết "Có bảy chiều, mỗi chiều có hai vế". Sai với chiều tĩnh/động, vốn có vế nửa động
  (trang 38, `agents.ts:62`). **Sửa:** "Phần lớn chiều có hai vế (chiều tĩnh/động có thêm vế giữa, gặp ở ga sau)."
- **m2.** `env-dims/index.ts:103`, đáp án gợi ý bước giấy trốn tìm, lấy "bị che khuất" làm lý do cho *ngẫu nhiên*.
  Che khuất thuộc chiều 1 (quan sát được), mà chính `env-dims/2.mdx` cảnh báo đừng lẫn chiều 1 với chiều 3. **Sửa:**
  chỉ giữ lý do thuộc kết quả hành động, như trượt chân hay vấp.
- **m3. Quy ước thuật ngữ** (DESIGN §Thuật ngữ, commit 2e24646):
  - `env-classify` lệch nhiều nhất. Các chiều 1–4, "cạnh tranh" và "trạng thái" xuất hiện lần đầu trong lesson mà
    không kèm tiếng Anh, ở `2.mdx:1, 3, 5`, `3.mdx:7` và bước giấy.
  - `env-dims/index.ts:21`: bước đoán dùng "trạng thái" và "hành động" trước khi `1.mdx` kèm tiếng Anh.
    `env-dims/1.mdx:5` dùng "thước đo" mà không có "hiệu năng (performance measure)".
  - `agent/1.mdx:15`: "hành động" chưa kèm "(action)".
  - `rationality/index.ts:76`: "cảm biến" chưa kèm "(sensor)".
  - Thuật ngữ chưa có trong bảng: thu thập thông tin (information gathering), học (learning), không quan sát được
    (unobservable).
  - Bảng tự mâu thuẫn: "agent duy lý" nằm ở cả dòng giữ tiếng Anh lẫn dòng dịch + kèm (`docs/DESIGN.md:59–60`).
- **m4.** Câu nhớ lại `peas` (`recall.ts:21–28`) bắt viết lại đúng PEAS taxi trong bài, mà ý S còn thiếu so với
  `peasTaxi`. Câu nhớ lại `env-classify` thiếu phần "ví dụ của bạn". **Sửa:** "Viết PEAS cho một agent bạn tự chọn,
  rồi soát bốn chỗ hay nhầm."
- **m5.** `docs/courses/csc14003/lesson-design/peas-outline.md` thiếu dòng "bước · phương pháp · vì sao", nên mọi chỗ
  lệch ma trận không có lý do được ghi. Dàn ý còn lệch code ở hai chỗ:
  - `:22` ghi bài cờ cá ngựa, thực tế là Sudoku và poker;
  - `:25` ghi `AgentLoop` là SVG tĩnh, thực tế là HTML.
- **m6.** Ví dụ trang 18 (robot hai ô duy lý trong điều kiện nào) chỉ nằm trong khối Đào sâu, mà khối này đóng sẵn.
  Câu "Đổi một trong bốn thứ … thì … hết duy lý" khái quát quá. **Sửa:** đưa câu cốt lõi ra ngoài Đào sâu, và viết
  "có thể hết duy lý".
- **m7.** `rationality/1.mdx:5` mở bằng "Quay lại câu hỏi…", nên treo khi người học vào ga mà không qua bước đoán.
  Trong buổi học, bước đoán bị bỏ qua. **Sửa:** viết câu tự đứng được.
- **m8.** `peas-e1`, `peas-c1`, `rationality-e1` có mỗi nhóm đúng một mục, nên mục cuối bị ép. **Sửa:** mỗi nhóm hai
  mục, thêm một mục bẫy.
- **m9.** `env-classify/3.mdx:3`: "Ô tô nền" dễ đọc thành "ô tô" (xe). **Sửa:** "Ô có nền màu".
  `DataTable.tsx:44` tô "Nửa động" cùng màu với "Động".
- **m10.** `src/ui/Deep.tsx:8`: `<summary>` không có `min-h-11`, vùng bấm khoảng 22px.
- **m11.** `env-classify/index.ts:83`: câu "Đề gốc chỉ hỏi bốn chiều đầu" là trích nguồn trong bài. **Sửa:** "Ba
  chiều sau là phần luyện thêm."

### Nit

- `env-classify/2.mdx:1`: "Cờ vua rời rạc" nên thêm "(không tính đồng hồ)".
- `env-classify/3.mdx:3`: lý do bảng không có cột biết luật nên viết là nhận xét, không viết như một lý do.
- `PeasCards.tsx:22` dùng `text-white`, không phải token; nên dùng `text-surface`. `AgentLoop.tsx:23–25` dùng token
  `g` (màu g(n)) cho "hành động", sai vai trò.
- `agents.ts:72`: tên chiều rời rạc/liên tục thiếu "percept" so với trang 39.
- `skillsAgents.ts:103`: câu `can` của `env-classify` viết "tĩnh hay động", bỏ mất nửa động. Câu kiểm tra chấm
  sáu chiều, trong khi tiêu đề ghi bảy.

## 3. Kiểm đúng/sai

| Mục | Kết quả |
|---|---|
| Bảng trang 40, `agents.ts:80–91` | Đúng 60/60 ô (judge đọc dạng ảnh 130 dpi) |
| PEAS trang 29, `agents.ts:16–22` | Đúng 5 P, 4 E, 6 A, 8 S |
| PEAS trang 31, `agents.ts:25–61` | Đúng 5 hàng × 4 cột |
| Bảng hút bụi | Trang 9 có 6 dòng đầu và "…". Bài ghi rõ "Một phần". Đúng |
| Số dòng | 4, 16, 64, (4¹¹−4)/3 = 1.398.100. Đúng |
| Định nghĩa duy lý, bốn thứ, thước đo chấm môi trường | Khớp trang 14, 16, 17 |
| Tất định, có lưu ý về nhiều agent | Khớp bảng trang 40 (cờ vua tất định). Slide không nói lưu ý thành lời; câu AIMA §2.3.2 chưa đối chiếu được với sách |
| Từng hồi / tuần tự, nửa động, biết / chưa biết luật | Khớp trang 37–39 |
| Đáp án chấm tự động | Không sai. `env-dims-e3` (bộ lọc thư rác từng hồi) có thể cãi, nhưng lời giải nêu lý do theo định nghĩa |
| Deep Blue 1997 | Đúng |

## 4. Bảng coverage

| Trang | Đơn vị kiến thức | Ở đâu | Trạng thái |
|---|---|---|---|
| 1–3, 12, 19, 24 | bìa, mục lục, trang chia phần | – | hành chính |
| 4 | Vì sao gọi là agent | – | thiếu (dẫn nhập, ưu tiên thấp) |
| 5 | Agent, cảm biến, bộ chấp hành; ô "?" trong hình | `agent/1.mdx:5`, AgentLoop | có |
| 6 | Agent người / robot / phần mềm | `agent/1.mdx:11–13`, e1, e2 | có |
| 7 | Percept, chuỗi percept, hàm agent, chương trình, kiến trúc + chương trình | `agent/2.mdx` | có |
| 8–10 | Thế giới hai ô, bảng hàm, REFLEX-VACUUM-AGENT | `agent/2.mdx`, `agents.ts:46–54` | có |
| 11 | Vì sao cần khái niệm agent | – | thiếu (dẫn nhập, ưu tiên thấp) |
| 13 | Duy lý = làm điều đúng, cần thước đo | `rationality/2.mdx:3` | có |
| 13 | "Mọi ô trong bảng hàm điền đúng" | – | mỏng |
| 14 | Chấm trạng thái môi trường | `rationality/1.mdx`, c1 | có |
| 15 | Luật đặt thước đo, ví dụ rác / sàn sạch | bước đoán, `1.mdx`, e2 | có |
| 16–17 | Bốn thứ quyết định duy lý; định nghĩa; ví dụ đi thi | `2.mdx`, e1, câu nhớ lại | có |
| 18 | Robot hút bụi duy lý trong điều kiện nào | chỉ trong Đào sâu | mỏng (m6) |
| 20 | Toàn tri vs duy lý | `3.mdx:1`, e3 | có |
| 21, 23 | Thu thập thông tin; tự chủ (ví dụ đồng hồ) | `3.mdx` | có |
| 22 | Học, kèm ca biên khi môi trường đã biết trước hoàn toàn | `3.mdx:6` | mỏng (thiếu ca biên) |
| 25–26 | Đề bài / lời giải; PEAS là bước đầu | `peas/1.mdx` | có |
| 27 | Tiêu chí P của taxi và chỗ giằng co | `peas/1.mdx:15` | có |
| 28 | Chi tiết E/A/S của taxi | qua thẻ trang 29 | mỏng (chấp nhận được) |
| 29, 31 | Bảng PEAS taxi; bảng 5 agent | `agents.ts` | có (khớp ô) |
| 30 | Softbot | `peas/2.mdx:8` | có |
| 32, 42 | Quiz tennis | – | tùy chọn, chưa dùng |
| 33 | Bảy chiều quyết định thiết kế | `env-dims/1.mdx:1` | có (lỗi m1) |
| 34–37 | Quan sát được; một / nhiều agent; tất định; từng hồi | `env-dims` | có |
| 38–39 | Tĩnh / động / nửa động; rời rạc; biết luật | `env-classify/1–2.mdx` | có |
| 40–41 | Bảng 10 môi trường; dễ nhất / đời thật | EnvTable, `3.mdx` | có |
| HW1 Q1–Q4 | Trốn tìm, bịt mắt bắt dê | bước giấy của `peas`, `env-dims`, `env-classify` | có (lỗi lý do m2) |
| 43–65 | Cấu trúc agent | – | ngoài phạm vi |

Có 49 đơn vị trong phạm vi:

- 41 đơn vị có;
- 4 đơn vị mỏng (trang 13, 18, 22, 28);
- 2 đơn vị thiếu, chỉ là dẫn nhập (trang 4, 11);
- 2 quiz tùy chọn chưa dùng.

Không có lỗ hổng bắt buộc phải lấp. Nên lấp trang 18.

## 5. Learning-method fit

| Ga | Loại kỹ năng | Khớp ma trận | Lệch / thiếu |
|---|---|---|---|
| `agent` | P | Khuôn + 3 ví dụ trải rộng; classify; bước giấy | Không có bước đoán (ga đầu, không ghi lý do); thiếu bài tìm lỗi / xử lý sâu (M5); thiếu câu nhớ lại (M1) |
| `rationality` | K | Bước đoán nhắm ngộ nhận thật, có `wrongSure`; cặp đối lập rác / sàn sạch; e2 so sánh; e3 duy lý vs toàn tri; câu nhớ lại | Câu nhớ lại chỉ là kể danh sách (K cần "vì sao / khi nào không đúng"); c1 lộ đáp án (M2); có thể thêm `relate` |
| `peas` | P | Gần như mẫu mực: bước đoán màn hình / bàn phím, 6 ví dụ có ca biên, tìm lỗi (e2), ca biên (e3), giấy theo HW Q1 | c1 lặp ví dụ hút bụi (M3); câu nhớ lại lặp taxi (m4); mỗi nhóm một mục (m8) |
| `env-dims` | P | Bước đoán cờ vua tất định; cặp đối lập cờ cá ngựa; e1, e2 ca mới; e3 ca biên; giấy viết lý do | Thiếu câu nhớ lại (M1); c1 lặp cờ vua (M3); e4 lộ đáp án (M2) |
| `env-classify` | P | Bước đoán nửa động; bảng 10 ví dụ; cặp biết luật vs quan sát được; e2 ba vế; e3 tách chiều | c1 lặp taxi và lộ đáp án (M2, M3); e1 gần như chép một hàng bảng; câu nhớ lại thiếu "ví dụ của bạn" (m4) |

Hai điểm chung cho cả 5 ga:

- Không ga nào có `reorganize`, và không ghi lý do (m5).
- Kiểu ôn của app (câu kiểm tra + bài tập của lesson) vốn đã lặp bối cảnh. Đây là chuyện cấp app, vượt khỏi phạm vi
  review này.

Giới hạn DESIGN §1 và §4. Số từ đếm như `content.test.ts`:

| Ga | Từ giải thích | Bước giải thích | Bài tập | Trắc nghiệm | Phút |
|---|---|---|---|---|---|
| agent | 434 | 2 | 3 | 1 | 8 |
| rationality | 534 | 3 | 3 | 1 | 10 |
| peas | 339 | 2 | 3 | 1 | 12 |
| env-dims | 531 | 2 | 4 | 1 | 12 |
| env-classify | 532 | 3 | 3 | 1 | 12 |

- Tất cả trong giới hạn. `env-dims` sát 12 phút.
- Chữ trong PeasCards và EnvTable không được đếm, nên lượng đọc thật nhiều hơn số trên.
- Mở đầu sinh từ dữ liệu kỹ năng.
- Giọng tôi/bạn đúng. Không trích nguồn, trừ m11.
- Bài tập không dạy kiến thức mới. Riêng poker và cờ tướng giả định người học đã biết luật chơi.

## 6. Widget

| Widget | Nội dung | Mobile 375px | Màu |
|---|---|---|---|
| AgentLoop | Đúng chiều mũi tên và nhãn | Không cuộn ngang, không có phần tử bấm | Token; `text-g` dùng sai vai trò (nit) |
| PeasCards | Khớp trang 29 và 31 | Xếp chồng khi màn hẹp | `text-white` không phải token (nit) |
| DataTable / EnvTable | 60/60 ô đúng; có chữ trong ô nên màu không phải tín hiệu duy nhất | Cuộn trong khung, cột đầu dính, cuộn được bằng phím | Nửa động cùng màu với động (m9) |
| Nút classify | Chấm đúng | **khoảng 30px, dưới 44px (M4)** | Đúng xanh dương / sai cam |
| Deep | – | summary dưới 44px (m10) | Token |

## 7. So với self-review cũ (`peas-quality.md`, 2026-10-13)

**Self-review bỏ sót:**

- Toàn bộ M1–M5.
- m1, m2, m4, m5, m7, m8, m9, m10, m11.
- Toàn bộ mục Learning-method fit.

**Đã cũ hoặc sai:**

- Bảng coverage và phần kiểm đúng/sai của self-review còn dùng "tác tử" và "tri giác". Commit 2e24646 đã đổi sang
  "agent" và "percept".
- "Ảnh chụp f6b1b62 (chưa commit)" không còn đúng. Nội dung đã vào e0717ac, rồi được sửa ở 2e24646.
- Kết luận "chờ review độc lập" nay được thay bằng report này.
- Trang 18 được ghi là đã có, nhưng không nói nó chỉ nằm trong khối Đào sâu đóng sẵn. Report này xếp là mỏng.
- Câu "chấm tự động chỉ dùng môi trường có đáp án rõ" vẫn đúng. Nhưng chính các môi trường đó (cờ vua, taxi) là ví
  dụ của bài, tức là phạm M3.
- Self-review đối chiếu AIMA theo trí nhớ. Report này cũng chưa mở được sách, nên lưu ý về nhiều agent chỉ dựa vào
  bảng trang 40.

**Vẫn đúng:**

- Bảng trang 40.
- Các con số.
- Deep Blue 1997.
- Rủi ro của `env-dims-e3`.
- Đề xuất làm mục tiêu riêng cho trang 43–64.
- Đề xuất dùng tennis làm câu nhớ lại.

## 8. Đề xuất tùy chọn

1. Dùng quiz tennis (trang 32, 42) làm câu nhớ lại tự do cho `peas` / `env-classify`. Không dùng làm câu chấm tự
   động.
2. Thêm bước `relate` cho `rationality` (thước đo · duy lý · toàn tri · thu thập thông tin · tự chủ).
3. Thêm `reorganize` cho `env-classify`: lưới bảy chiều, mỗi chiều kèm phép thử và một ca biên.
4. Thêm một câu nói lái xe chỉ hợp tác *một phần*. Ý này theo trí nhớ về AIMA, slide chỉ ghi "cooperative".

## 9. Sau khi sửa, cần kiểm lại

- `npm test` và `npm run build`.
- Mở 5 ga ở 375px, đo nút classify và summary Đào sâu (≥ 44px).
- Làm lại các câu kiểm tra mới và câu xếp lớp, kiểm gợi ý không còn lộ đáp án.
- Kiểm câu nhớ lại của `agent` và `env-dims` có xen vào lượt ôn.
- Quét lại thuật ngữ `env-classify`, rồi sửa bảng thuật ngữ ở DESIGN.
- Cập nhật `peas-outline.md`.
- Mục tiêu này chưa được kiểm trong trình duyệt lần nào.

## 10. Đã đọc gì, và giới hạn của review

**Nguồn:**

- Lecture02 (65 trang):
  - đọc chữ trang 1–65;
  - đọc ảnh trang 29, 31, 40 ở 110–130 dpi;
  - lướt dạng ảnh ở 60 dpi các trang 5, 6, 8–10, 13, 14, 16, 18, 25, 26, 30, 32, 33, 41, 42.
- Homework1: cả 2 trang, đọc chữ và đọc ảnh.

**Code và tài liệu:**

- `skillsAgents.ts`, `agents.ts`, `recall.ts`;
- toàn bộ `index.ts` và `*.mdx` của 5 ga;
- `AgentLoop`, `PeasCards`, `DataTable`, `Deep`, `inputs.tsx`, `grade.ts`;
- `LessonPage`, `PaperStep`, `ReviewPage`, `useTodayPlan`, `content.test.ts`, `styles.css`;
- `docs/DESIGN.md` §1–4, skill `learning-methods`, `peas-outline.md`, `peas-quality.md`;
- `git show 2e24646`.

**Giới hạn:**

- Không mở trình duyệt, nên các nhận định về hit target suy từ class.
- Không mở `references/methods.md` của skill.
- Các câu về AIMA (lưu ý nhiều agent, solitaire, lái xe hợp tác một phần) là trí nhớ. Chúng không quyết định kết
  luận nào, vì bài khớp slide.
- Judge không chạy `npm test`. Phiên điều phối đã chạy sau khi lưu report (xem `.claude/progress.md`).

## 11. Vòng 2: sau khi sửa (2026-10-17)

Đã sửa M1–M5, m1–m11 và các nit (chưa commit). Judge re-review có trọng tâm trên `git diff` và kết luận:
**NEEDS CHANGES (mức nhẹ)**. Cả 5 lỗi major đã sửa; mọi đáp án mới hoặc đã đổi đều đúng theo slide.

Các đáp án mới được judge kiểm:

- Tetris: đầy đủ / một agent / ngẫu nhiên / tuần tự.
- Trò trượt 8 số có điểm theo thời gian: đầy đủ / một / tất định / tuần tự / nửa động / rời rạc.
- Máy lọc không khí: bụi mịn trong phòng.
- Robot cắt cỏ: cặp bẫy "cơn mưa" (E) và "cảm biến mưa" (S).
- Chatbot: tách cảm biến / percept / bộ chấp hành / hành động.
- Tra hàm agent: `[A, Sạch], [B, Bẩn]` → Hút.

Re-review tìm thêm 6 lỗi mới. Tất cả đã sửa ngay trong phiên này:

- **N1** (medium). `agent/1.mdx` gọi "phím người dùng gõ, gói tin" là cảm biến, mâu thuẫn với `agent-e2` (câu khách
  gõ là percept). Slide trang 6 cũng viết lỏng như vậy. Bài đã sửa lại cho chặt: cảm biến là bàn phím, chỗ đọc
  file, cổng mạng nhận gói tin.
- **N2** (medium). Gợi ý của `peas-c1` chỉ thẳng vào cặp bẫy. Đã đổi thành câu hỏi chung. Thêm một mục P và một mục
  A cho đủ m8.
- **N3**. Bỏ "mỗi lần nhìn" khỏi lý do *ngẫu nhiên* của bước giấy trốn tìm, vì đó là chuyện quan sát được.
- **N4**. Chuyển "học (learning)" sang dòng **Từ thường** trong bảng thuật ngữ.
- **N5**. Câu nhớ lại của `env-dims` và `env-classify` có thêm "một môi trường bạn tự chọn".
- **N6**. Sửa mã M trong `peas-outline.md`: bỏ M10 ở bài dùng lại bối cảnh của lesson; ca biên của `peas` ghi M5.
  Thêm dòng `reorganize · bỏ` cho `peas` và `env-dims`.
- Nit đã sửa: bỏ chữ "phép thử" khỏi gợi ý; "camera thấy xe phía trước phanh gấp"; nói rõ bảng ở `agent-e4` là
  bảng ứng với chương trình ba dòng; `references/methods.md` đổi số kỹ năng có câu nhớ lại thành 7.

**Đã kiểm:**

- `npm test` (59) và `npm run build` sau vòng sửa cuối.
- Trên preview ở 375px, trước khi sửa N1–N6:
  - chip classify cao 46,75px, chấm `agent-e2` đúng;
  - `agent-e4` hiển thị đúng;
  - EnvTable: nửa động viền đứt, động nền violet nhạt;
  - summary Đào sâu cao 46,75px;
  - không cuộn ngang, không lỗi console.

**Chưa làm:**

- Chưa chạy judge vòng 3 sau khi sửa N1–N6.
- Chưa đi trọn luồng `/session` và màn Ôn tập với các câu nhớ lại mới.
- Đề xuất tùy chọn chưa làm: `relate` cho `rationality`, `reorganize` cho `env-classify`.

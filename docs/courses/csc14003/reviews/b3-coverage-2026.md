# Buổi 3 — đối chiếu coverage với tài liệu 2026

Ngày: 2026-09-19 · Trạng thái: **BÁO CÁO, CHƯA SỬA FILE NÀO** (theo yêu cầu).

Đối tượng đối chiếu: `src/features/lessons/b3/*`, `src/features/search-lab/search-engine.js`,
`src/content/courses/csc14003/{lab-searching.js, math-primers.js, session-quizzes.js}`.

---

## 0. Kết luận đầu tiên: slide KHÔNG đổi, LAB thì đổi hết

Ba file PDF được đưa vào phiên này (từ `~/Downloads`) **giống hệt từng byte** với bản đã nằm
trong repo từ 21/08 — và cũng giống hệt bản trong thư mục khóa học.

| File | MD5 | Có ở |
|---|---|---|
| `Lecture03-P1-ProblemSolvingBySearching.pdf` | `578c06fb94cb1937961b93ca52eba384` | Downloads · repo · `HCMUS/.../Lecture/buoi3` |
| `Lecture03-P2-UninformedSearch.pdf` | `3813abe662796d83a7265e14bb2bcb45` | cả ba nơi |
| `Lecture03-P3-InformedSearch.pdf` | `dc82eff8746861c350b507cae6fed152` | cả ba nơi |

`CreationDate` trong metadata của cả ba: **2021-10** (14/10, 17/10, 20/10). Không tồn tại bản
soạn 2026 của slide bài giảng. Bài học hiện tại vốn đã được dựng từ chính ba file này.

Thứ **thật sự** đổi sang 2026 là **đề Lab**:

```
HCMUS/CacThuatToanThongMinhNhanTao/Lab/
  Lab 1 - Searching/     Aug 2025   ← mục 08 Code Lab đang dạy bản này
  LabSearch/             Jan–Mar 2026   ← bản mới, thay thế
```

### Delta hai đề lab

| | Lab 1 (2025) | LabSearch (2026) |
|---|---|---|
| Dạng nộp | `main.py` + report PDF + zip `MSSV.zip` | 3 Jupyter notebook có **judge cell** chấm tự động |
| Thuật toán | 7 — BFS DFS UCS **DLS IDS** GBFS A\* **HC** | 5 — BFS DFS UCS GBFS A\*; **bỏ DLS/IDS và Hill-climbing** |
| Cấu trúc đồ thị | ma trận kề `arr[u][v]` | **danh sách kề** `{u: [(v,w), …]}` |
| File input | `input.txt`: n / start goal / ma trận / heuristic | `graph.txt`: `n m` / heuristics / m dòng `u v w` — **1000 đỉnh, 10000 cạnh** |
| Tie-break | không quy định | **quy định cứng, có chấm**: index nhỏ hơn; mê cung dùng `(r, c)` thứ tự từ điển |
| Trục bài mới | — | **Standard vs Optimized**: cài lại bằng `list` + linear scan, so với `deque`/`heapq`, benchmark + biểu đồ cột matplotlib |
| Miền bài toán | 1 — đồ thị | 3 — đồ thị · **mê cung 2D 51×51** (`maze.txt`, S/E/#, Manhattan, `get_neighbors` phải sắp xếp) · **N-Queens** (`count_conflicts`, `is_safe`) |
| Điểm | 7×10% + ≥5 test case + report | lab1 50đ (5×5 std + 5×5 opt) · lab2 100đ (5×20) · lab3 50đ (5×10) + 3 câu tự luận |
| Đo đạc | `time.perf_counter()` + `tracemalloc` peak KB | `time.time()` + biểu đồ so sánh, **không đo memory** |

Một chi tiết thiết kế đáng chú ý của lab3 2026: Greedy và A\* bị **cấm** dùng `is_safe` khi
thêm quân ("để heuristic phát huy tác dụng"), còn BFS/DFS/UCS thì bắt buộc dùng. Đây là một
điểm dạy có chủ đích về vai trò của pruning vs heuristic — bài học hiện tại không có chỗ nào
chạm tới.

### Hệ quả

**Mục 08 Code Lab đã lạc đề.** Toàn bộ khối này bám đề 2025: `HELPER_PY` với `arr[node][child]`,
`MAIN_PY` đọc `input.txt` ghi `output.txt` + `tracemalloc`, 7 `ALGOS` (gồm `dls`/`ids`/`hc`),
khối "3 quy ước bắt buộc", 2 panel INPUT/OUTPUT mẫu, và card 5 test case gợi ý — không cái nào
còn khớp đề 2026.

Phần lý thuyết mục 01–07 vẫn khớp, vì slide không đổi.

### Ba mảng 2026 yêu cầu mà bài chưa dạy ở đâu

1. **Chi phí cấu trúc dữ liệu của frontier** — linear scan O(n) vs binary heap O(log n). Đây là
   nửa số điểm của lab1 2026 và là bài học "vì sao `heapq` tồn tại". Bài hiện tại dùng sẵn
   `heapq`/`deque` trong Python mà chưa lần nào giải thích cái giá của lựa chọn đó.
2. **Tie-breaking như một quy tắc cài đặt** — bài có nhắc "đồng hạng → mở theo alphabet" nhưng
   chỉ trong đề bài tập mục 10, không phải như một điều kiện cần để output khớp judge.
3. **Mô hình hóa mê cung và N-Queens thành bài toán tìm kiếm** — mê cung + Manhattan hiện chỉ
   xuất hiện ở đề bài tập Q4; N-Queens chỉ xuất hiện như con số 1,8×10¹⁴ → 2.057 ở mục 02.
   Không có phần giảng nào cho cả hai.

---

## 1. Đối chiếu lý thuyết với slide (180 trang: 43 + 64 + 73)

Do `lesson-coverage-judge` chạy độc lập; mọi mục dưới đây **đã được xác minh lại** trên text
trích từ PDF trước khi ghi vào đây.

### 1.1 Lỗi cần sửa — ĐÃ XÁC MINH

**A\* thiếu điều kiện đầy đủ** · `Lecture03-P3` tr.29

Slide ghi nguyên văn: *"Completeness — YES if all step costs exceed some finite ε and if b is
finite (review the condition for completeness of UCS)"*.

Bài học:
- `Lesson03Search.tsx:389` — stat card A\*: `{ k: T.ch5.s15, v: '✓', cls: 'stat--good' }`
- `Lesson03Search.tsx:507` — bảng mục 07: `['✓', 'g']` cho ô ĐẦY ĐỦ, **không có chú thích ¹**

Trong khi cùng bảng đó BFS (`:502`), UCS (`:504`), IDS (`:505`) đều mang `✓¹`, và footnote ¹ đã
có sẵn: *"b hữu hạn (UCS: thêm chi phí bước ≥ ε > 0)"*. Người học đọc bảng sẽ hiểu A\* đầy đủ
vô điều kiện, ngay sau khi vừa được dạy đúng điều kiện đó cho UCS.

Sửa: thêm `¹` vào ô ĐẦY ĐỦ của A\* ở `:507`, và sửa stat card `:389`.

### 1.2 Phát hiện của reviewer BỊ BÁC — không dùng

Reviewer báo một lỗi số liệu: *"slide P3 tr.13 ghi h_SLD(Făgăraș) = 178 và h_SLD(Pitești) = 98,
bài học ghi 176 / 100"*, kèm suy luận f(Făgăraș) = 417 vs f(Pitești) = 415 nên thứ tự expand đảo.

**Phát hiện này không đứng vững.** Trang 13 của P3 chỉ chứa đúng một dòng text — tiêu đề
*"Straight-line distance heuristic h_SLD"*. Bảng SLD là **ảnh**. Kiểm tra toàn bộ text trích của
P3: chuỗi `178`, `176`, `98`, `366`, `253`, `329` **không xuất hiện lần nào**. Reviewer không có
nguồn nào để đọc ra "178 / 98", kể cả các giá trị nó khẳng định là "khớp".

Đối chiếu ngược: `search-engine.js:21` dùng `h: [366, 374, 380, 329, 253, 176, 193, 100, 160, 0]`
— khớp bảng SLD chuẩn của AIMA (Arad 366, Zerind 374, Oradea 380, Timisoara 329, Sibiu 253,
Fagaras 176, Rimnicu Vilcea 193, Pitesti 100, Craiova 160, Bucharest 0), và cho ra đúng ví dụ
kinh điển f(Făgăraș) = 415 < f(Pitești) = 417 với nghiệm 418.

Kết luận: **bài học đúng, không sửa gì**. Ghi lại ở đây để phiên sau không chạy lại phát hiện này.

Bài học rút ra cho quy trình: trích text từ slide bị mất toàn bộ bảng/hình. Chỗ nào text mỏng
bất thường thì phải đánh dấu "không xác minh được", không được điền bằng trí nhớ.

### 1.3 Mỏng — nên bổ sung, xếp theo giá trị

**a) Họ tìm kiếm có giới hạn bộ nhớ: IDA\* · RBFS · SMA\*** · P3 tr.42–52 (**11 trang**)

Slide có: IDA\* cắt theo f = g + h thay vì theo độ sâu, ngưỡng vòng sau = f nhỏ nhất vượt ngưỡng
vòng trước; RBFS giữ f của nhánh thay thế tốt nhất của tổ tiên, quay lui khi vượt `f_limit`, và
khi quay lui thì **thay f của nút bằng f tốt nhất của con** — có pseudocode đầy đủ (tr.49) và ví
dụ Romania chạy tay 4 bước (tr.46–48: Rimnicu 417 → Fagaras 450 → quay lại Rimnicu → 447 > 418
nên dừng); đánh giá RBFS (tr.50): tối ưu nếu h admissible, bộ nhớ O(bd), thời gian khó đoán vì
"switching back and forth"; SMA\* (tr.51): xóa nút f lớn nhất khi hết bộ nhớ, đẩy giá trị nút bị
quên lên cha, đồng hạng thì xóa nút cũ nhất; metalevel state space (tr.52).

Bài học có: đúng một mệnh đề ở `lesson03.text.vi.ts:207` — *"gót chân Achilles vẫn là RAM. Khi
máy không chứa nổi thì tìm tới IDA\*, RBFS, SMA\* — ngoài phạm vi buổi này, để dành."*

Đây là khối lớn nhất bị bỏ. Đáng chú ý: bài **tự dựng sẵn vấn đề** (A\* chết vì RAM, stat card
ghi "O(b^d) — lý do tồn tại") rồi bỏ lửng. Và "để dành" không dẫn tới đâu — chuỗi 11 buổi không
có buổi nào quay lại họ thuật toán này.

**b) Đường đi dư thừa — con số** · P1 tr.35

Slide: lưới 4 kế tiếp mỗi trạng thái, cây sâu d có 4^d lá nhưng chỉ ~2d² trạng thái phân biệt;
**d = 20 → một nghìn tỷ nút cho khoảng 800 trạng thái**. Và: đường dư thừa có thể biến bài giải
được thành bài không giải nổi, *kể cả với thuật toán đã biết tránh vòng lặp vô hạn*.

Bài có: mục 03 nói cây tìm kiếm Romania "có thể vô hạn"; mục 04 nói bản path check "vẫn sinh
đường dư thừa". Thiếu con số — mà 10¹² vs 800 chính là lập luận mạnh nhất cho sự tồn tại của
explored set.

**c) Bidirectional: điều kiện dừng, tính tối ưu, cái giá bộ nhớ** · P2 tr.61–62

Slide: goal test là **hai frontier giao nhau**; **Optimality: maybe NO**; O(b^(d/2)) cả thời gian
lẫn bộ nhớ; phải giữ frontier của ít nhất một chiều; khó đi lùi (cần predecessor); rắc rối khi
nhiều đích hoặc đích là mô tả trừu tượng ("không quân hậu nào ăn nhau").

Bài có: thẻ BONUS mục 04 (`Lesson03Search.tsx:345`) với phép tính 2.000 vs 1.000.000 và hai cái
giá (phải biết đi lùi, đích phải tường minh). Thiếu cách phát hiện "đã gặp nhau" và cảnh báo
**không mặc nhiên tối ưu** — thiếu ý sau thì người học dễ tưởng đây là BFS rẻ tiền mà vẫn tối ưu.

**d) Hai kiểu phát biểu: incremental vs complete-state** · P1 tr.23–25

Slide: 8-queens phát biểu incremental (thêm dần hậu vào bàn trống) hoặc complete-state (đặt sẵn
8 hậu rồi dịch chuyển), "path cost tầm thường vì chỉ trạng thái cuối mới tính"; kèm 100-queens
10⁴⁰⁰ → 10⁵².

Bài có: đúng con số 1,8×10¹⁴ → 2.057 và kết luận về sức nặng của mô hình hóa. Thiếu **tên và ý**
của hai kiểu. Đây cũng là cầu nối tự nhiên sang Buổi 4 — local search chạy trên complete-state
formulation — và trùng luôn với lab3 2026 (N-Queens).

**e) Chứng minh tối ưu, mỗi cái một dòng** · P2 tr.40 · P3 tr.34, 36

Slide có ba biến đổi: UCS phản chứng; A\* tree-search với đích dở G₂ (f(G₂) = g(G₂) > g(G) =
f(G) ≥ f(n)); A\* consistent (f(n′) = g(n) + c(n,a,n′) + h(n′) ≥ g(n) + h(n) = f(n)).

Bài phát biểu đúng cả ba kết luận nhưng không có dòng biến đổi nào. Riêng dòng f(n′) ≥ f(n) tốn
đúng một dòng và biến "tin tôi đi" thành "tự kiểm được" — đúng kỹ năng câu 3 bài tập đang đòi.

**f) g phụ thuộc đường đi, h chỉ phụ thuộc trạng thái** · P3 tr.8–9

Slide nói rõ best-first search là một khung, chọn f nào ra chiến lược nấy; và *"khác g(n), h(n)
chỉ phụ thuộc trạng thái tại nút đó"*. Bài đúng tinh thần khung chung nhưng thiếu ý thứ hai —
đây chính là chỗ giải thích vì sao hai nút cùng trạng thái có g khác nhau mà h bằng nhau, và vì
sao decrease-key chỉ đụng tới g.

**g) Đường kính không gian trạng thái làm cận cho ℓ** · P2 tr.51

Slide: chọn ℓ theo **diameter**; 20 thành phố → ℓ = 19, nhưng mọi cặp cách nhau ≤ 9 bước → *"ℓ = 9
is better"*; đường kính thường không biết trước.

Bài (`lesson03.text.vi.ts:153`): *"Romania có 20 thành phố, hai thành phố bất kỳ cách nhau ≤ 9
bước, vậy ℓ = 9 là dư."* Thiếu khái niệm đường kính và cận thô ℓ = 19. Chữ "dư" cũng hơi lệch:
slide coi 9 là cận **chặt hơn**, tức vừa đủ, không phải thừa.

**h) 8-puzzle: tính h₁/h₂ trên một bàn cụ thể** · P3 tr.32, 55–56

Slide có một thế cờ với h₁ (số ô sai chỗ) và h₂ = 0+2+1+2+2+1+0+1 tính từng ô; kèm 8-puzzle
nghiệm trung bình ~22 bước, b ≈ 3. Bài nêu tên hai heuristic và có bảng b\* nhưng chưa lần nào
tính h trên một trạng thái thật — trong khi bài tập Q4c/d bắt chạy GBFS và A\* với Manhattan.

### 1.4 Cân nhắc — ngoài `topics`, người quyết

| Nội dung | Slide | Ghi chú |
|---|---|---|
| Vacuum-cleaner world, 5 thành phần đầy đủ, 2·2² = 8 trạng thái, tổng quát n·2ⁿ | P1 tr.19–20 | Bài chỉ nhắc "robot hút bụi" trong một danh sách. Thêm nếu muốn cho thấy "trạng thái" không phải lúc nào cũng là địa điểm |
| Touring problem & TSP — trạng thái mang theo tập đã thăm, NP-hard | P1 tr.28 | Liên quan thẳng tới Q1 bài tập (trạng thái mang vị trí của *cả hai* người). Một câu là đủ |
| Knuth's 4 / không gian vô hạn | P1 tr.26, P2 tr.47 | Ví dụ cụ thể cho câu "không gian vô hạn thì cả hai bản chống lặp cùng chết" đang nói suông |
| Toy vs real-world problems (VLSI layout, robot navigation, assembly sequencing) | P1 tr.18, 27, 29 | Tạo động lực, bỏ không mất năng lực nào |
| **Pattern database cộng tính / rời rạc + số liệu** | P3 tr.66–71 | 15-puzzle nhanh gấp 2000× Manhattan (IDA\* giải tối ưu trong 30 ms); 24-puzzle 12 triệu× (2 ngày thay vì 65.000 năm); DB 7 ô 58 triệu mục, 8 ô 519 triệu mục; Korf–Felner. Bài có một dòng về PDB. Loại số liệu làm người ta nhớ mãi |
| Learning to search better / metalevel state space | P3 tr.52–53 | Nối được với Buổi 10–11 |
| Heuristic nghĩa nhận thức (availability, representativeness) | P3 tr.4–6 | Khung mở bài của slide; bài vào thẳng h(n), không mất gì |
| **Quiz 03 của slide về admissible**: h₃ = 0, h₄ = 1, h₅ = h\*, h₆ = min(2,h\*), h₇ = max(2,h\*) | P3 tr.57 | Bộ câu bẫy rất tốt cho mục 09; 8 câu hiện có chưa có câu nào kiểu này |
| Hanoi — phát biểu bài toán + vẽ hai tầng đầu của cây | P1 tr.30, 42 | Có thể thành một câu ở mục 10 |
| UCS ≡ BFS khi chi phí bước bằng nhau | P2 tr.24 | Bài đã có "= Dijkstra", thiếu nửa còn lại. Một mệnh đề |
| Canonical form cho explored set | P1 tr.39 | Chi tiết cài đặt, hữu ích cho mục 08 |
| Iterative lengthening search, branch and bound | P2 tr.4 | Slide chỉ liệt kê, không dạy. Bỏ qua an toàn |

### 1.5 Đã phủ đủ

Bốn bước problem-solving agent + bốn giả định môi trường (P1 tr.5–11) · 5 thành phần với ví dụ
Romania (tr.12–14) · trừu tượng hóa (tr.15–16) · kích thước không gian 8-puzzle 9!/2 = 181.440,
24-puzzle ~10²⁵, NP-complete, 8-queens 1,8×10¹⁴ → 2.057 (tr.22–25) · state space ≠ search tree +
frontier · pseudo tree-search/graph-search hai panel (tr.34, 36) · separation property (tr.38) ·
node ≠ state với STATE/PARENT/ACTION/PATH-COST (tr.39–40) · bốn tiêu chí + b, d, m (tr.41) · BFS
FIFO, goal test lúc sinh, bảng độ phức tạp b = 10 đúng nguyên số slide (P2 tr.8–20) · UCS PQ theo
g, dừng khi pop, decrease-key, O(b^(1+⌊C\*/ε⌋)) (tr.24–41) · DFS LIFO, O(b^m)/O(bm), hai cách
chống lặp (tr.44–48) · DLS cutoff ≠ failure, bốn ô đánh giá riêng, DFS = DLS với ℓ = ∞ (tr.51–53)
· IDS, chi phí lặp ~11%, O(b^d)/O(bd) (tr.55–59) · bảng tổng hợp uninformed (tr.63) · h(n),
h(đích) = 0, SLD (P3 tr.9–13) · GBFS 450 vs 418, lắc Iași ↔ Neamț (tr.14–18) · A\* f = g + h
(tr.21–29, 40) · admissible h ≤ h\* + tree-search tối ưu (tr.31–34) · consistent bất đẳng thức
tam giác ⇒ graph-search tối ưu, consistent ⇒ admissible (tr.35–36) · f-contours, viền 380/400/420,
optimally efficient (tr.37–39) · b\* với ví dụ d = 5 / 52 nút / 1,92 và bảng tr.59 chép đúng từng
ô · dominance h₂ ≥ h₁ (tr.60) · relaxed problem sinh h₁/h₂ và tự động admissible (tr.61–62) ·
max các heuristic (tr.63) · pattern database (tr.65) · học heuristic từ kinh nghiệm (tr.72).

---

## 2. Xếp ưu tiên nếu làm tiếp

1. **Sửa ô ĐẦY ĐỦ của A\*** (mục 1.1) — lỗi thật, sửa 2 chỗ, rẻ nhất.
2. **Quyết số phận mục 08 Code Lab** — đây là quyết định lớn nhất và cần người chọn:
   giữ bản 2025, thay bằng 2026, hay giữ cả hai. Ảnh hưởng `lab-searching.js`, `CodeLab.tsx`,
   và cả `SearchLab` (preset "Lab 1 · 6 đỉnh" lấy từ `input.txt` bản 2025).
3. **Thêm mục memory-bounded search** (1.3a) — 11 trang slide, và bài đã dựng sẵn vấn đề.
4. Các mục 1.3b–h — đều nhỏ, có thể gộp vào một đợt.
5. Mục 1.4 — tùy khẩu vị.

## 3. Ghi chú quy trình

- Máy này **không có** `pdftoppm`/poppler nên `Read` trên PDF báo lỗi. Đường vòng đã dùng:
  venv trong scratchpad + `pypdf`, xuất text theo trang. Text trích **mất toàn bộ bảng và hình**
  — xem mục 1.2 để thấy hậu quả khi reviewer không biết điều đó.
- Số trang thật: P1 = 43, P2 = 64, P3 = 73, Homework3 = 5, Lab 1 = 5.

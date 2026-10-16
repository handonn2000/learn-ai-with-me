# Spec — Buổi 2 · Tác tử thông minh (/courses/csc14003/lessons/b2)

Files: features/lessons/b2/Lesson02Agents.tsx, VacuumLab.tsx, VacuumRoom.tsx, EnvExplorer.tsx,
AgentArchDiagram.tsx;
data: content/courses/csc14003/agents-data.js (PEAS_ROWS, DIMS, ENVIRONMENTS, ARCH_LEVELS,
LEARNING_PARTS, HW) + vacuum-world.js (engine lab) + math-primers.js (MATH_PRIMERS.b2).

## Goal
Giọng theo `lesson-voice` **khuôn 7**: cảnh mở màn ở 01 (trợ lý lập trình đọc file/chạy lệnh), 03 (thuê
người dọn nhà trả công theo ký rác), 08 (con ếch ba luật); hai cụm đối thoại ở 06 (poker vs backgammon)
và 07 (agent tra bảng sai ở đâu).

10 mục, 3 phần tương tác, không có canvas rAF (mọi hình đều là SVG/HTML tĩnh hoặc đổi theo state —
xem lý do ở phần Tương tác). Giọng tôi/bạn theo skill `lesson-voice` (7 icon làm mốc). Không trích
nguồn trong bài.

## Khung trang
Giống b1/b3: LessonNav sticky (badge BUỔI 2, 11 anchor gồm TOÁN NỀN; ba mục tô vàng `hot`: 03, 06,
08), container 1120px, padding-top 78px, SectionHead + sec-lead, mọi khối bọc `<Reveal>`.
Hero: h1 "Mổ con *tác tử* ra xem" + SVG tĩnh vòng lặp Agent ↔ Môi trường (mũi tên cyan `tri giác`
đi vào, vàng `hành động` đi ra, nhãn cảm biến / bộ chấp hành).

## Nội dung từng mục
- Toán nền (#toan): `<MathPrimer>` 4 phút — Set · Function/mapping · Cartesian product. Mục
  Function nói rõ `𝓟*` (chuỗi) khác cách viết gọn `𝓟 → 𝓐` của buổi 1 ở chỗ nào.
- 01: 3 card agent người / robot / phần mềm (sensors + actuators) + card "vì sao định nghĩa rộng".
- 02: card 3 thuật ngữ (percept · percept sequence · agent function) + panel-inner phân biệt agent
  function vs agent program; card thế giới hút bụi 2 ô + bảng tabulation 6 hàng + con số
  4+4²+…+4¹⁰ = **1.398.100** dòng; codeblock REFLEX-VACUUM-AGENT 4 dòng.
- 03: card thước đo hiệu năng (chấm chuỗi trạng thái MÔI TRƯỜNG) + luật đặt thước (bẫy "hốt rác");
  card định nghĩa duy lý đầy đủ + 4 `.stat` (thước đo / tri thức có sẵn / chuỗi tri giác / hành
  động). → **VacuumLab**. Sau lab: card vàng "hai thí nghiệm tôi muốn bạn tự làm".
- 04: 4 card — toàn tri · thu thập thông tin · học · tự chủ (đồng hồ treo tường).
- 05: 4 card P/E/A/S + bảng PEAS_ROWS 7 hàng (có **Trợ lý lập trình** — hàng hiện đại, không có trong tài liệu gốc) (taxi tô cyan, `minWidth: 900`, bọc overflowX) + card
  softbot + card vàng "thử ngay" (PEAS cho 2 việc tennis).
- 06: → **EnvExplorer**. Dưới đó: cột trái 2 card (chiều quan sát nói kỹ: đầy đủ ⇒ khỏi cần trạng
  thái trong, hai nguyên nhân của "một phần", mức unobservable · chiều thứ bảy known/unknown và vì
  sao nó không nằm trong bảng); cột phải 3 card (môi trường dễ nhất / đời thực / hai chỗ hay lẫn —
  "từng hồi ≠ tĩnh", "ngẫu nhiên ≠ nhiều agent" + cạnh tranh vs hợp tác, móc sang buổi 5).
- 07: card codeblock TABLE-DRIVEN-AGENT + card con số **10¹⁵⁰** dòng vs ≈10⁸⁰ nguyên tử (2 `.stat`);
  card xanh "thách thức cốt lõi của AI" + Newton 5 dòng + panel agent = kiến trúc + chương trình.
- 08: → **AgentArchDiagram**. Dưới đó: card con ếch 3 luật (luật (3) cần cho tính đầy đủ) + card
  bảng luật có trạng thái trong 4 hàng; **card cyan “AI agent nằm ở nấc mấy”** — soi trợ lý lập
  trình qua đúng 5 nấc, kết luận phần lớn dừng ở nấc 3, nấc 5 để trống; card tím móc nối → buổi 3–11.
- 09: 4 card tổng kết (AGENT / DUY LÝ / PEAS / NĂM KIẾN TRÚC) + CheckList key `b2-checks` (8 ô).
- 10: **Quiz 8 câu** — `<SessionQuiz sessionId="b2">`, id `#quiz`, nav tô vàng. Chủ đề: Hàm agent · Thước đo hiệu năng ×2 · Duy lý ≠ toàn tri · PEAS · Bảy chiều môi trường · Bảng tra · Năm kiến trúc. Điểm ghi vào `sessions.b2.quiz*`.
- 11: 4 card bài tập từ `HW` (đề của `buoi1/Homework1.pdf` — PEAS + 4 chiều cho trốn tìm và bịt mắt
  bắt dê) + card vàng "câu thứ năm" (xếp 2 việc tennis vào bảy chiều) + link về lộ trình.

## Tương tác
Không dùng canvas rAF ở bài này — cả ba phần đều là trạng thái rời rạc do người học điều khiển, nên
HTML/SVG đọc được bằng trình đọc màn hình và tự responsive, rẻ hơn canvas.

- **VacuumLab** (mục 03) + **VacuumRoom.tsx** (phần nhìn) — engine `vacuum-world.js`: 2 chương
  trình × **2 thế giới** × 3 preset sàn × 20 bước, chấm **ba thước đo song song** trên cùng một
  trace (A sàn sạch · B sàn sạch trừ điểm di chuyển · C lượng rác hốt được). Câu hỏi nó trả lời:
  *đổi thước đo thì cùng một chương trình còn duy lý nữa không?*

  **Thế giới** (`WORLDS`): `w2` = A·B, bản gốc của tài liệu; `w4` = hành lang A·B·C·D. Cả hai giữ
  nguyên bộ hành động {Left, Right, Suck, NoOp} nên vẫn đúng bài — 4 ô là hành lang chứ không phải
  lưới 2×2 chính vì lý do đó. **Điểm của `w2` được trích thẳng vào nội dung bài (40–40 và 20–39),
  đừng đụng vào luật của nó**; luật đã mở rộng ("ở ô cuối thì Left, còn lại Right") trùng khít hàm
  bốn dòng gốc khi n = 2.

  **Chương trình**: `reflex` chỉ nhìn tri giác hiện tại · `memo` thêm sổ tay niềm tin, tin cả sàn
  sạch thì NoOp. `PRESETS` dùng chung ba id cho mọi thế giới (`dirty-all` · `dirty-half` xen kẽ ·
  `clean`) nên bộ nút không đổi khi người học đổi số ô.

  Kết quả chốt bài, preset "sàn đã sạch bong":

  | | thước A | thước B |
  |---|---|---|
  | 2 ô | hòa **40–40** | **20 – 39** |
  | 4 ô | hòa **80–80** | **60 – 77** |

  Bốn ô làm lộ thêm hai thứ mà hai ô giấu mất: (1) luật phản xạ "ở ô cuối thì lùi" biến thành cái
  bẫy — agent lết tới D rồi ping-pong C↔D tới hết 20 bước, A và B không bao giờ được thăm lại;
  (2) bản có trí nhớ phải đi thăm dò đủ ba bước rồi mới dám nghỉ, tức là *thu thập thông tin* (mục
  04) trả giá bằng xăng nhưng vẫn rẻ hơn đi mù.

  UI gồm bốn khối, theo thứ tự từ trên xuống:
  1. **Căn phòng** (`VacuumRoom`, SVG viewBox 400×214) — vẽ được hành lang **n ô**, bề rộng ô tự
     chia theo `n`; bụi vẽ thành hạt rải rác đặt theo TỈ LỆ ô (`SPECKS` là hệ số, không phải px) nên
     đổi số ô là tự co. Từ 3 ô trở lên bật chế độ `tight`: bỏ chữ DIRTY/CLEAN (hạt bụi đã nói rồi)
     thay bằng chấm màu, thu robot còn 0.82, rút gọn dòng sổ tay. Robot có mắt trượt giữa các ô
     bằng CSS `transform` + `transition` (tắt khi `prefers-reduced-motion`), thân đổi màu theo tri
     giác (vàng = đang thấy bẩn). Hiệu ứng theo hành động: vòng cung xanh khi Suck · mũi tên đứt nét
     dọc sàn khi di chuyển · hai vạch "tạm nghỉ" khi NoOp. Bong bóng tri giác **neo vào ô đã nhìn,
     không trượt theo robot** — bước có di chuyển thì tri giác xảy ra ở ô cũ, để bong bóng bám robot
     là kể sai thứ tự perceive → decide → act; lúc đó nó chuyển sang viền đứt + nhãn "ĐÃ THẤY Ở ĐÂY".
     Bản `memo` hiện thêm dòng sổ tay dưới mỗi ô. Cỡ chữ trong SVG cố ý to (13–17 đơn vị) vì viewBox
     cố định làm chữ co lại còn ~6px ở 375px — đừng hạ xuống. Bong bóng rộng 124 đơn vị, rộng hơn
     một ô khi n = 4, nên tâm của nó bị kẹp vào [64, 336] còn cái đuôi thì trỏ riêng về đúng ô đã
     nhìn.
  2. **Băng tri giác** — 8 tri giác gần nhất dạng pill `[A,D]`, cái hiện tại tô sáng. Đây là 𝓟* của
     mục 02 vẽ ra cho thấy được.
  3. **Điều khiển** ↺ ← → ⇥ + BƯỚC t/20, rồi **băng hành động**: 21 ô vuông bấm được để nhảy tới
     bước bất kỳ, tô màu theo loại hành động (green hút · cyan di chuyển · faint đứng yên) kèm chú
     giải. Băng này là chỗ nhìn phát ra ngay cả bài của chương trình: `reflex` trên sàn sạch cho một
     dải cyan liên tục, `memo` cho đúng một ô cyan rồi xám hết — chính là 20 vs 39 nhìn thấy được.
  4. **Bảng điểm cuối** của cả hai chương trình (xanh = thắng, đỏ = thua ở thước đó).

  Đổi chương trình hoặc preset đều reset `t = 0`. Ba ô điểm có delta bước hiện tại, delta ẩn khi = 0.
- **EnvExplorer** (mục 06) — 9 môi trường × 6 chiều (thêm **Trợ lý lập trình**, hàng tự suy ra chứ không lấy từ tài liệu gốc — `note` của nó nói rõ điều đó) của bảng tổng hợp (`DIMS`, `ENVIRONMENTS`); mỗi
  chiều là công tắc 2 (hoặc 3, với tĩnh/nửa động/động) vế, vế đúng sáng theo màu green/yellow/cyan,
  kèm một đoạn `note` chỉ ra ô đáng chú ý của môi trường đó. Backgammon có mặt để làm mẫu "quan sát
  đầy đủ mà vẫn ngẫu nhiên" — đừng gỡ, nó là chỗ chống lẫn hai chiều.
- **AgentArchDiagram** (mục 08) — 5 nút nấc. Nấc 1–4 dùng **một** SVG lớn dần (`Diagram14`): hộp cột
  giữa hiện theo `from`, spine tự nối các hộp đang hiện, pill cột trái có `from`/`to`; hộp mới của
  nấc hiện tại tô vàng, hộp chưa tới opacity 0.25. Nấc 5 đổi hẳn sang `Diagram5` — cả agent 4 nấc co
  lại thành hộp "Bộ thi hành", quanh nó là Critic / Learning element / Problem generator; đó là chủ
  ý, không phải hai sơ đồ rời. Dưới sơ đồ: thẻ mô tả nấc + card đỏ "chỗ nó chịu thua" (nấc 1–4) hoặc
  4 card LEARNING_PARTS (nấc 5).

## Ràng buộc đã quyết
- Dạy đủ **7 cặp chiều**; bảng tương tác chỉ có 6 chiều đúng như bảng tổng hợp của tài liệu gốc,
  known/unknown giảng riêng bằng thẻ chữ. `Session.topics` của b2 ghi "7 chiều môi trường".
- Bài tập của buổi này là `buoi1/Homework1.pdf` (xem `.claude/progress.md` — cả bộ homework lệch số
  so với lecture, đã remap trong `index.ts`). KHÔNG dùng `buoi2/Homework2.pdf`, đó là đề Tìm kiếm.

## Acceptance
- Lab: đổi chương trình hoặc preset thì t về 0; Lùi tới bước 0 và Tiến tới 20 không vỡ; bảng điểm
  cuối luôn chấm cả hai chương trình trên preset đang chọn; băng hành động nhảy đúng bước.
- Căn phòng: robot đứng đúng ô, bong bóng tri giác đứng ở ô ĐÃ NHÌN (không phải ô robot đang đứng
  sau khi di chuyển), chữ trong SVG còn đọc được ở 375px với cả 2 ô lẫn 4 ô.
- Đổi thế giới 2 ô ↔ 4 ô: điểm của thế giới 2 ô phải giữ nguyên 40–40 / 20–39 (preset sạch bong).
- EnvExplorer: 6 chiều của mỗi môi trường khớp đúng bảng tổng hợp gốc.
- AgentArchDiagram: nấc 1–4 chỉ khác nhau ở hộp được thêm; nấc 5 đổi sơ đồ.
- 4 bảng đều bọc `overflowX: auto` + `minWidth`; ở 375px không tràn ngang, nút ≥ 44px.
- Checklist giữ trạng thái sau reload.

---
name: lesson-interactive
description: >-
  Thiết kế, dựng hoặc sửa trực quan và tương tác cho bài học learn-ai-with-me:
  animation tự lặp, hình 2D/3D, sơ đồ, code/JSON tô màu, tab so sánh và quiz/lab
  có mục đích học. Dùng khi thêm animation, visualization, minh họa, lab, quiz,
  hoặc chọn hình thức để giải thích một khái niệm trong bài học.
---

# Phần tương tác của bài học

Trực quan giúp người học thấy một cơ chế; quiz và lab giúp họ thử một quyết định rồi hiểu kết quả. Chọn theo việc cần dạy, không theo số nút bấm hoặc component đang có.

**Mặc định cho minh họa giải thích: tự chạy và tự lặp như GIF, không có hàng Play/Pause, Tiến/Lùi, Reset hay chỉnh tốc độ.** Có thể dùng tab để đổi use-case, cấu hình hoặc góc nhìn có ý nghĩa. Giữ điều khiển cho quiz, bài tập, điều hướng và lab mà user muốn chủ động khảo sát từng bước; yêu cầu bỏ nút phát minh họa không đồng nghĩa bỏ các chức năng đó.

Đọc skill `lesson-voice` để biết cách viết chữ quanh phần tương tác (đặc biệt **khuôn 6 — đẩy người đọc ra khỏi ghế**). Đọc `new-lesson/references/anatomy.md` để biết khung trang.

## Chọn hình thức trước khi dựng

Đừng mặc định vẽ canvas. Soi xem khái niệm có **hình dạng** gì rồi chọn:

| Khái niệm có dạng… | Hình thức | Đã có trong repo | Reference |
|---|---|---|---|
| Quá trình thay đổi theo thời gian, cần thấy quan hệ nguyên nhân → kết quả | **Animation tự lặp** bằng HTML/CSS, SVG, Canvas 2D, 3D/WebGL hoặc video phù hợp | component hiện có là ví dụ, không phải giới hạn | `references/visual-storytelling.md`; nếu chọn canvas: `references/canvas-scene.md` |
| Cùng một cơ chế dưới vài use-case hoặc cấu hình | **Tab + animation tự lặp**, giữ kết quả/chú giải đọc được | chọn tab đổi nghĩa, không đổi frame | `references/visual-storytelling.md` |
| User cần tự kiểm tra một bước, chỉnh tham số hay giải bài toán | **Step lab có điều khiển** — engine sinh trace, UI là trình phát | `SearchLab` (7 thuật toán) | `references/step-lab.md` |
| Phân loại: có N ô cố định, người học đặt vật vào đúng ô | **Quiz phân loại** | b1 mục 05 — 4 ô × 8 câu | `references/quiz-panels.md` |
| Danh sách ý kiến, **không có** đáp án đúng | **Chip bấm được** | b1 mục 08 — "máy làm được?" | `references/quiz-panels.md` |
| So sánh N biến thể theo vài trục cố định | **Bảng + AlgoCard** — không cần JS | b3 mục 07 | `new-lesson/references/anatomy.md` |
| Đối chiếu hai cách viết cùng một thứ | **Panel đôi** | `CodeLab` — pseudo ↔ Python | `references/quiz-panels.md` |
| Tự đánh giá cuối bài | **CheckList** | mọi bài | `references/quiz-panels.md` |

Hai lựa chọn hay bị nhầm nhau:

- **Animation giải thích vs step lab.** Một chuỗi trạng thái không tự động cần nút điều khiển. Dùng nhịp giữ khung, caption và bảng tĩnh để đọc từng pha trong animation lặp; chọn step lab khi chủ động thao tác là mục tiêu học hoặc user yêu cầu.
- **Canvas vs HTML/SVG tĩnh.** Hình không đổi theo thời gian thì đừng dùng canvas — HTML nhẹ hơn, đọc được bằng trình đọc màn hình, copy được chữ, tự responsive. Hero của bài 3 là SVG tĩnh, đúng lựa chọn.

Số visual theo mật độ kiến thức và yêu cầu user, không có quota 2–3. Một bài dài có thể cần nhiều hình; mỗi hình phải có lý do riêng. Đa dạng cách kể khi hữu ích: mặt cắt/isometric cho lưu trữ, timeline cho thứ tự, dòng packet cho truyền dữ liệu, before/after cho biến đổi. Không ép mọi khái niệm vào cùng một sơ đồ hộp và mũi tên, cũng không dùng 3D chỉ để trang trí.

## Năm luật chung

Áp cho mọi hình thức. Đây là chỗ phần tương tác thường hỏng, chứ không phải ở code.

**1 · Mỗi tương tác trả lời đúng một câu hỏi.** Trước khi dựng, viết ra câu hỏi đó thành một dòng. `SearchLab` trả lời *"thứ tự lấy nút ra khỏi frontier đổi thì chuyện gì xảy ra?"*. Không viết ra được câu hỏi thì đừng dựng — nó sẽ thành đồ trang trí.

**2 · Trạng thái đầu phải đã có nghĩa.** Người học cuộn tới, chưa bấm gì, vẫn phải hiểu mình đang nhìn cái gì. Đừng để màn hình trống chờ bấm Play.

**3 · Vòng lặp phải kể đúng cơ chế.** Chia pha rõ, giữ kết quả đủ lâu để đọc, rồi bắt đầu lại với dấu hiệu đây là lượt minh họa mới. Không làm loop reset trông như xóa dữ liệu thật, đảo thời gian, rollback transaction hay đổi offset trái với điều vừa dạy. Cả trạng thái lẫn các frame chuyển tiếp phải đúng. Chỉ step lab có chủ đích mới cần bộ điều khiển tiến/lùi.

**4 · Đừng khóa kiến thức bên trong tương tác.** Chữ trong canvas không copy được, không đọc được bằng trình đọc màn hình, không tìm được bằng Ctrl+F, và biến mất với người tắt hiệu ứng. Mọi ý chính phải có mặt trong đoạn văn HTML quanh nó. Tương tác là để *thấy*, chữ là để *biết*.

**5 · Dẫn mắt đến điều cần thấy.** Caption nói người học nên theo dõi đại lượng, quan hệ hoặc thay đổi nào. Chỉ dẫn bấm dành cho tab/quiz/lab có chức năng; animation tự chạy không cần lời nhắc "nhấn Play". Với bài tập chủ động, xem khuôn 6 của `lesson-voice`:

> "Ba thí nghiệm tôi muốn bạn tự làm ngay bây giờ: (1) chạy GBFS rồi A* — tham lam ra 450 km, A* ra 418 km, tự hỏi 32 km đó đi đâu mất…"

## Ràng buộc kỹ thuật của repo

- **Tự chọn công cụ hợp cơ chế.** CSS/SVG/Canvas, 2D/3D, media hoặc thư viện mới đều được cân nhắc; tái dùng component khi nó phù hợp. Với dependency mới, đánh giá lợi ích học tập, bundle, mobile, bảo trì, license và fallback; ghi ADR mới giải thích lựa chọn theo `CLAUDE.md`. ADR là tài liệu quyết định, không phải cổng xin phép cho thay đổi user đã ủy quyền.
- **Tách engine khỏi UI.** Logic sinh dữ liệu (thuật toán, trace, chấm điểm) để trong `src/content/courses/<slug>/*.js` hoặc `src/features/<ten>/*.js`, giữ dạng JS thuần theo ADR-0005. UI chỉ đọc và vẽ. Nhờ tách vậy mà `search-engine.js` sau này thay bằng Rust/WASM được mà không đụng React.
- **Màu**: trong canvas dùng hex cứng (panel giữ nền tối ở cả hai theme); ngoài canvas luôn dùng token `var(--*)`. Bảng màu hex ↔ token nằm trong `references/canvas-scene.md`.
- **Motion và vòng đời**: dừng timer/rAF/CSS animation/media khi visual ngoài viewport hoặc `document.hidden`; chỉ chạy lại khi cả hai đều cho phép, tránh nhảy thời gian tích lũy. Dọn observer/listener/timer khi unmount. `prefers-reduced-motion` phải cho bản tĩnh giải thích trọn cơ chế (nhiều pha tĩnh nếu một frame cuối không đủ), không phải canvas trống hoặc chỉ logo. Không bọc nội dung đổi từng frame bằng `aria-live`/`role=status`; dùng mô tả HTML ổn định.
- **Logo, code và nhấn ý**: dùng logo thật của framework từ nguồn chính thức hoặc registry được duy trì (Devicon/Simple Icons) có nguồn gốc rõ ràng, với tên đọc được, không thay Kafka/Airflow bằng emoji hay icon chung. JSON/code có màu cú pháp nhất quán, giữ nguyên nội dung copy được; tách màu cú pháp khỏi callout ý quan trọng. Nhấn có chọn lọc thuật ngữ lần đầu, điều kiện quyết định và câu kết luận bằng semantic HTML. Chi tiết chọn media, tab, tài sản và màu ở `references/visual-storytelling.md`.
- **Mobile**: hit target ≥ 44px, breakpoint 640px. Panel điều khiển của step lab phải xuống dòng được (`flexWrap`), canvas phải `flex: '1 1 560px'` chứ đừng cố định chiều ngang.

## Dựng xong thì kiểm

```bash
npm run build
python3 .claude/skills/new-lesson/scripts/check_lesson.py <id>
```

Lệnh `check_lesson.py` chỉ hỗ trợ layout phẳng của CSC14003 hiện tại. Với lesson
khóa khác, dùng checker theo khóa (DEF b7: `node scripts/check-def-b7.mjs` và
`python3 .claude/scripts/check_i18n.py def-b7`), hoặc kiểm wiring thực tế thủ công.
Không nhận lỗi "không thấy b7" từ checker sai khóa là lỗi nội dung và không nhận
check chưa hỗ trợ là đã pass.


Rồi mở trình duyệt (dùng preview tools, đừng chạy dev server qua Bash) và tự tay làm những việc này — script không kiểm được:

- Xem ít nhất hai vòng của mỗi kiểu animation và mọi use-case tab; kiểm cả chuyển tiếp, kết quả và reset. Không có hàng nút phát thừa cho minh họa.
- Dùng bàn phím đổi tab; label, focus và nội dung có khớp không? Nếu là step lab thực sự, mới kiểm Lùi về 0 / Tiến tới cuối / đổi preset giữa chừng.
- Thu xuống 375px; thử hai theme, code dài và nhãn logo. Không có chữ bị cắt, tab không bấm được hay tràn ngang cả trang.
- Bật reduced motion: còn toàn bộ lời giải tĩnh không? Cuộn visual ra ngoài viewport rồi ẩn tab trình duyệt: animation có ngừng và tiếp tục đúng không?
- Console có lỗi không; listener/timer/rAF được dọn khi rời trang không? Mô tả cho screen reader có ổn định thay vì phát liên tục từng frame không?

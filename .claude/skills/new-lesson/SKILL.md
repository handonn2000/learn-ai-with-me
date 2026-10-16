---
name: new-lesson
description: >-
  Dựng hoặc sửa bài học learn-ai-with-me (React + TS + Vite) từ slide/notes tới
  trang đã nối route, đúng giọng và có visual phù hợp. Dùng khi thêm bài học,
  đưa slide/PDF lên app, bổ sung mục/animation/quiz hoặc kiểm chất lượng một bài
  đã dựng. Bao gồm code/JSON có màu, logo thật, điểm nhấn và review độc lập.
---

# Dựng bài học mới

Các bài **Buổi 1 — Nhập môn AI** và **Buổi 3 — Tìm kiếm** là ví dụ về khung trang, không phải giới hạn nội dung hoặc phong cách visual. Áp skill cho cả bài mới và sửa bài ở mọi khóa; resolve course slug, lesson ID và đường dẫn thật từ registry trước vì `b7` không duy nhất giữa các khóa.

Thứ khó nhất không phải nối route — mà là **viết**. Nên đừng vội mở editor.

## Bước 0 · Nạp giọng văn

Gọi skill **`lesson-voice`** trước tiên và đọc hết. Toàn bộ chữ nghĩa trong bài phải theo bảy khuôn ở đó — đặc biệt **khuôn 7**: kể chuyện làm tone chính, đối thoại chỉ dùng để gỡ ngộ nhận, tối đa 2–3 cụm mỗi bài. Quay lại đây khi đã nạp xong.

Hai skill anh em, gọi khi tới lúc cần: **`lesson-interactive`** (bước 3, phần tương tác) và **`gamification`** (chỉ khi bài học ghi điểm vào tiến độ).

## Bước 1 · Nhận và đọc nguyên liệu

Cần biết trước khi viết:

- **Buổi nào** — course slug + id (`b2`, `b4`, …), khớp với `src/content/courses/<slug>/index.ts`. Đọc entry của buổi đó: `topics` và `math` là điểm xuất phát; phạm vi user yêu cầu được ưu tiên hơn bản curriculum rút gọn.
- **Nguyên liệu thô** — slide, notes, PDF trong `public/materials/`, hoặc user dán vào. Nếu user không đưa gì: `public/materials/Lecture/buoi<N>/` thường đã có sẵn PDF. Đọc nó.
- **Có lab không** — buổi có `labChip` thì bài học nên có phần tương tác nặng hơn (xem bài 3).

Nếu nguyên liệu mỏng hoặc mâu thuẫn với `topics` trong data, hỏi user trước khi bịa. Sai kiến thức là lỗi nặng nhất mà bài học này có thể mắc.

## Bước 2 · Dựng dàn ý trước khi viết một chữ nào

Viết dàn ý trước khi dựng bài mới hoặc thay cấu trúc lớn. Nếu user yêu cầu duyệt dàn ý thì chờ duyệt; nếu đã giao triển khai hoặc sửa một phần rõ ràng thì tự quyết trong phạm vi đó, không thêm cổng xin phép. Chỉ hỏi khi thiếu thông tin làm thay đổi đáng kể phạm vi hoặc kiến thức; sửa visual đã được giao không phải lý do dừng để duyệt lại toàn bài.

- **Thẻ toán nền mở màn** (không đánh số, id `#toan`) — trang Lộ trình hứa với người học rằng mỗi buổi mở đầu bằng thẻ ôn toán 5–10 phút kèm thuật ngữ Anh–Việt. Bỏ thẻ này là thất hứa. Rút thuật ngữ từ `Session.math` của buổi đó, mỗi thuật ngữ viết: định nghĩa một câu + **vì sao ĐÚNG buổi này cần nó**. Buổi không cần toán thì nói thẳng ra và chỉ liệt kê vài chữ nên biết trước (xem `b1` làm mẫu).
- 8–10 mục, đánh số `01`…`09` + một mục bài tập cuối.
- Mỗi mục ghi: tiêu đề tiếng Việt · tên tiếng Anh · **chỗ vướng mà mục này gỡ** (khuôn 1 của lesson-voice) · dạng trình bày (thẻ / bảng / canvas / quiz).
- Đánh dấu nơi **hình giúp hiểu cơ chế** và nơi **thao tác giúp kiểm tra hiểu biết**, theo bảng trong `lesson-interactive`. Animation giải thích mặc định tự chạy lặp như GIF, không có nút phát/tiến/lùi/reset/tốc độ; tab có thể đổi use-case. Quiz, bài tập và lab khảo sát có mục đích vẫn giữ điều khiển. Số visual theo nội dung/user, không giới hạn 2–3.
- Chọn cách thể hiện đa dạng khi hợp nội dung: timeline, mặt cắt/isometric, dòng packet, before/after, đồ thị, 2D/3D hoặc media. Component/thư viện hiện tại là lựa chọn, không phải khung bắt buộc. Với dependency mới, cân nhắc lợi ích, chi phí tải/mobile/bảo trì và ghi ADR; không đặt thêm bước xin phép cho phạm vi đã được ủy quyền.
- Chọn sẵn 3–5 **con số có cú chốt** rút từ nguyên liệu. Nếu buổi đó không có số nào đáng nhớ, tìm cách so sánh để tạo ra (ví dụ: mô hình ngây thơ vs mô hình khôn).

Nhịp đã dùng ở hai bài mẫu, bám theo được thì bám: khái niệm nền → chia loại / khung chung → đi từng loại một → tương tác lớn ở giữa bài → tổng kết một trang → tự kiểm → bài tập.

## Bước 3 · Viết bài

Đọc `references/anatomy.md` để lấy khung file, danh sách component và class dùng chung. Phần trực quan/tương tác thì gọi **`lesson-interactive`**; đọc `lesson-interactive/references/visual-storytelling.md` khi dựng animation, logo, code/JSON hoặc điểm nhấn.

Viết theo thứ tự: hero → từng mục → tổng kết → CheckList → bài tập. Viết xong mục nào thì đọc lại mục đó bằng mắt người học, không phải mắt người viết.

Vài điều dễ sai:

- Đoạn văn có định dạng inline (`<strong>`, `<em>`, `<a>`) phải đi qua `<Html t="…" />`, không viết JSX thẳng.
- Nhấn chọn lọc thuật ngữ quan trọng, điều kiện quyết định và câu kết luận bằng semantic HTML + `.hl-*`; không tô toàn đoạn. JSON/code có màu cú pháp theo token, vẫn copy nguyên vẹn; callout dòng/field quan trọng phải phân biệt với màu cú pháp. Giữ ý nhấn tương đương VI/EN.
- Framework được minh họa bằng logo thật (Kafka, Airflow…) từ nguồn chính thức hoặc registry được duy trì (Devicon/Simple Icons) có nguồn gốc rõ ràng, giữ nhận diện/tỷ lệ, tên HTML và alt phù hợp. Không thay bằng emoji hoặc icon generic. Ghi nguồn/license ở metadata hoặc tài liệu asset.
- Animation lặp phải đúng cả frame chuyển tiếp và reset, có lời giải HTML ổn định. Dừng khi ngoài viewport hoặc document ẩn, dọn scheduler khi rời trang; reduced motion cho bản tĩnh giải thích đầy đủ. Không thông báo từng frame qua live region.
- Với visual theo đường đi, dùng cùng một trạng thái cho vật đang chuyển, đoạn đường sáng, nhãn bước và payload/code. Giữ ID bản ghi qua các chặng; chỉ đổi hình/màu/giá trị ở bước xử lý có giải thích. Chú giải phải nêu hướng đi và phân biệt dữ liệu với lệnh điều phối bằng cả hình dạng/nhãn, không chỉ màu. Kiến trúc trang trí không được ngụ ý dung lượng hay topology triển khai thật.
- Màu luôn qua token `var(--*)`. Ngoại lệ duy nhất: bên trong file `*.scenes.ts` và các panel canvas — chỗ đó hex cứng là cố ý, giữ nền tối ở cả hai theme.
- Lặp inline style từ 3 lần trở lên thì thêm class vào `global.css` thay vì copy.
- Điều hướng trong trang bằng `href="#id"`, tuyệt đối không `scrollIntoView`.

## Bước 4 · Nối vào app

Bảy chỗ cần kiểm khi thêm bài; sửa bài có sẵn chỉ cập nhật phần bị ảnh hưởng. Các đường
dẫn `csc14003` trong `references/wiring.md` là ví dụ của khóa AI, cần đối chiếu registry
và conventions của khóa thực tế trước khi áp:

1. Route lazy full-bleed trong `src/App.tsx`
2. `lessonPath` cho session trong `src/content/courses/<slug>/index.ts`
3. Hằng `NAV` — mỗi href phải khớp một `id` có thật trong trang
4. `storageKey` của `CheckList` — giữ nguyên key khi sửa bài; khóa mới dùng `'<slug>-<id>-checks'` để không trùng ID giữa các khóa
5. Chế độ trình chiếu — `SLIDES` + `useDeckMode` + bọc `<LessonDeck>` (ADR-0006)
6. Quiz cuối buổi — thêm khóa `<id>` vào `session-quizzes.js`, đặt `<SessionQuiz>` ở mục `#quiz`
7. Thẻ toán nền — thêm khóa `<id>` vào dữ liệu primer của khóa tương ứng

## Bước 4b · Song ngữ (nếu bài sẽ có bản tiếng Anh)

Bài mới **viết tiếng Việt trước, dịch sau** — đừng viết song song. Ba pha, không trộn:

1. **Chụp mốc** trước khi tách chữ:
   `python3 .claude/scripts/check_i18n.py <id> --snapshot` (khai unit trong `.claude/i18n/acceptance.json`).
2. **Tách chữ, KHÔNG dịch.** Chữ ra `lessonNN.text.vi.ts`, trang đọc qua `T.*`. Tiêu chí thành
   công duy nhất: **trang tiếng Việt render y hệt như trước.**
   `check_i18n.py <id> --extraction-audit` sau mỗi mục.
3. **Viết bản EN** `lessonNN.text.en.ts` (`satisfies typeof VI`) — đọc
   `lesson-voice/references/english.md` trước.

Ba file đặt **phẳng cùng cấp** trong folder bài, không cho vào thư mục con: `check_lesson.py`
duyệt folder không đệ quy nên bundle nằm trong `text/` sẽ bị bỏ qua âm thầm.

Khai unit trong `acceptance.json` thì **`gates` phải có đủ `judged` và `extraction`**:

```json
"gates": ["deps", "build", "i18n", "lesson", "extraction", "judged"]
```

Bỏ `judged` ra thì unit vẫn "đóng được" mà chưa ai đọc bản dịch lần nào — `i18n_loop.py` chỉ in
cảnh báo `!!` chứ **không** hạ exit code, nên cái xanh đó là xanh rỗng. Bỏ `extraction` thì mất
luôn cái kiểm đáng giá nhất của cả quy trình: câu tiếng Việt bị rơi trong lúc moi chữ khỏi `.tsx`.

Cổng `judged` đòi `.claude/i18n/judged/<id>.json` có `verdict: "ĐẠT"` **và** `pairs_hash` khớp nội
dung hiện tại — tức phán quyết tự hết hiệu lực khi có ai sửa một chữ hiển thị. Phán quyết do
subagent **`i18n-fidelity-judge`** cấp, chạy SAU khi `check_i18n.py` đã sạch (khác
`lesson-quality-judge` ở bước 6: judge kia kiểm đúng/sai và coverage, judge này đọc
hai locale hỏi "nghĩa có trôi không, tiếng Anh có ra tiếng người không"). Sửa vài chữ sau khi đã
chấm thì **chấm lại phạm vi hẹp** — nêu rõ cặp nào đổi và cặp nào không — chứ đừng sửa tay
`pairs_hash`.

Đóng bài bằng `python3 .claude/scripts/i18n_loop.py <id>` (exit 0) — chi tiết ở
`.claude/commands/i18n-unit.md`.

## Bước 5 · Kiểm tra

Chạy script kiểm tra cơ học trước, nó bắt hết mấy lỗi nối dây và lệch giọng dễ thấy:

```bash
python3 .claude/skills/new-lesson/scripts/check_lesson.py b4
```

`check_lesson.py` hiện chỉ hiểu bài CSC14003 ở `src/features/lessons/<id>/` và
registry của khóa đó; không dùng nó làm cổng cho khóa khác hoặc folder lồng nhau.
Với DEF b7 dùng `node scripts/check-def-b7.mjs` và
`python3 .claude/scripts/check_i18n.py def-b7`. Khóa khác dùng checker tương ứng nếu
có, hoặc kiểm route/anchor/storage/quiz theo registry thật và ghi phạm vi đã kiểm.


Script kiểm: route đã nối chưa · `lessonPath` đã set chưa · anchor nav có khớp id không · `storageKey` có trùng không · **chế độ trình chiếu đã bọc `<LessonDeck>` và `SLIDES` có slide bìa chưa** · **quiz cuối buổi đã có khóa trong `session-quizzes.js` chưa** · thẻ toán nền · mật độ tôi/bạn · số icon · dấu vết trích nguồn còn sót · `scrollIntoView` · hex cứng ngoài vùng cho phép. Nó cũng chạy được trên `b1`/`b2`/`b3` để bạn thấy mốc của bài đạt chuẩn.

Hai chỗ script KHÔNG bắt được, nhớ tự kiểm: `<LessonDeck>` bọc thiếu một mục thì slide lệch với `SLIDES` mà không ai báo; và `<SessionQuiz>` thiếu dữ liệu thì render ra `null` — im lặng, không lỗi.

Rồi:

```bash
npm run build
```

Phải sạch — `tsc -b` không lỗi thì mới tính xong.

Rồi mở thật trong trình duyệt bằng công cụ preview có sẵn: vào route đúng của khóa/bài, cuộn hết trang, xem ít nhất hai vòng của mỗi kiểu animation và mọi use-case tab, bấm quiz/lab còn chức năng, kiểm console và **đọc bằng mắt người học**. Kiểm mobile, hai theme, reduced motion, viewport/document visibility, logo và code/JSON dài. Màu token phải đọc được, điểm nhấn phải dẫn mắt đến kiến thức quan trọng; không chỉ xác nhận rằng build chạy. Nếu thiếu công cụ browser, ghi giới hạn thay vì nhận là đã kiểm.

Với cảnh 3D, xem ảnh tổng thể và cận cảnh có ý nghĩa, xoay qua các góc người học được phép xem. Kiểm đường đi/vật chuyển không xuyên công trình, nhãn không che quan hệ chính, và trạng thái nhìn thấy khớp lời giải ở cả bước chuyển tiếp. Ghi riêng điều đã quan sát, điều chỉ kiểm bằng code và phần chưa kiểm. Nếu dùng skill/catalog bên ngoài, ghi đúng hướng dẫn đã đọc, record thực sự lấy và phần tự dựng; dẫn link skill không đồng nghĩa đã dùng dataset hay công cụ capture của nó.

## Bước 6 · Kiểm chất lượng độc lập sau khi dựng bài (bắt buộc)

Gọi subagent **`lesson-quality-judge`**, định nghĩa ở
`.claude/agents/lesson-quality-judge.md`; cách truyền đầu vào ở
`.claude/commands/review-lesson.md`. Đây là reviewer mặc định, thay cho việc chỉ
so khớp bài với slide. Nó kiểm ba việc riêng: đúng/sai; coverage/độ sâu; cải thiện cách dạy.

Truyền course slug, lesson ID, các file bài và imports, toàn bộ slide nguồn, phạm vi
user yêu cầu, giọng/đối tượng, yêu cầu visual mới nhất (loop tự chạy, tab use-case, phong cách đa dạng, logo thật, code có màu và nhấn ý) và báo cáo build/browser/i18n đang có. Ví dụ:

> Review bài b7 của Data Engineering Foundation sau triển khai; nguồn là
> /Users/handonn/Workplace/AIDE-01/slides/Lession_7_Data_Engineering_Ingestion_Layer.pdf.
> User yêu cầu mọi chi tiết kiến thức trong slide, giọng phim tài liệu, VI/EN và tương
> tác có ý nghĩa; minh họa giải thích tự lặp, tab đổi use-case, logo framework thật,
> code/JSON có màu và nhấn ý chọn lọc. Đọc các file bài b7 thực tế cùng imports, kiểm đúng/sai bằng nguồn
> chính thống khi cần, lập coverage ledger đầy đủ và trả phản hồi. Không sửa bài.

**Phạm vi user là hợp đồng cao nhất:** khi user yêu cầu toàn bộ chi tiết slide, không
được viện `topics` ngắn trong curriculum để bỏ qua ví dụ, code ảnh, bảng, điều kiện
hoặc chủ đề chỉ nêu ở agenda. Slide có thể sai; sửa có bằng chứng là covered-with-correction,
không phải thiếu. Với yêu cầu phạm vi hẹp hơn thì ghi rõ phần ngoài phạm vi.

Reviewer trả `PASS`, `NEEDS CHANGES` hoặc `INCOMPLETE`, manifest của artifact đã đọc,
ledger nguồn → anchor/key, lỗi ưu tiên, đính chính nguồn, bổ sung tùy chọn và retest.
Không lấy tỷ lệ khớp từ khóa hoặc số trang đã gán làm bằng chứng bài đã phủ đủ.

- Sửa mọi lỗi kiến thức/hành vi đã xác nhận và phần thiếu/mỏng trong phạm vi user đã
  giao. Đây là phần công việc đã được ủy quyền, không tạo thêm cổng xin phép.
- `INCOMPLETE` nghĩa là còn nguồn/hình/code/hành vi chưa kiểm được; nêu chính xác giới
  hạn và tiếp tục phần kiểm có thể làm, không đổi thành PASS để đóng bài.
- Bổ sung ngoài phạm vi vẫn là đề xuất có lý do, vị trí, công sức và nguồn; không tự
  mở rộng thành một chương nâng cao. Dependency phù hợp để hoàn thành visual đã được giao
  là quyết định triển khai cần giải thích/ADR, không tự động là mở rộng phạm vi.
- Giữ giọng đã chốt khi sửa; đừng chép nguyên văn slide để chữa coverage.

Sau sửa, gọi một lượt review tập trung vào thay đổi và các ví dụ/locale/visual bị ảnh
hưởng. Thông thường một lượt đầu + một lượt kiểm lại; nếu còn bất đồng, báo trung thực
để user quyết, không chấm đậu giả hoặc lặp vô hạn. Lưu report ở
`docs/courses/<slug>/reviews/<lesson-id>-quality.md` (caller ghi, reviewer chỉ đọc).

VI được đối chiếu nguồn đầy đủ; EN được kiểm các khẳng định nhạy về nghĩa ở key tương
ứng. **Quality judge không thay `i18n-fidelity-judge`**: chạy fidelity judge với toàn bộ
cặp VI/EN sau khi sửa nội dung và kiểm máy đã sạch; chỉ fidelity verdict hợp lệ mới
được dùng cho cổng `judged`. Không bắt chạy thêm `lesson-coverage-judge` trên cùng
artifact nếu quality judge đã hoàn tất ledger; agent cũ dành cho yêu cầu coverage-only.

## Bước 7 · Ghi lại

- Thêm `.claude/specs/lesson-<id>.md` tóm tắt layout — theo mẫu `lesson-b1.md` / `lesson-b3.md`.
- Cập nhật `.claude/progress.md`: làm được gì, còn dở gì.
- Nếu buổi đó có ý đáng đưa vào bộ đề Kiểm tra tổng hợp, nói với user — đừng tự thêm câu hỏi vào `part-tests.ts` mà không hỏi.

## Bàn giao

Báo cho user: đường dẫn bài học, các mục đã dựng, phần tương tác nào có, và **chỗ nào bạn đã phải tự suy ra vì nguyên liệu không nói rõ** — để họ kiểm lại phần kiến thức đó.

Kèm quality verdict và phạm vi đã kiểm, lỗi đã sửa/còn mở, giới hạn xác minh, cùng
**các đề xuất cải thiện tùy chọn** có nguồn để user cân nhắc. Không coi build xanh là
bằng chứng nội dung đúng hoặc phủ đủ; không tuyên bố đầy đủ VI/EN nếu fidelity còn dở.

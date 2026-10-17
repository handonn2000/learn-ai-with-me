# Bàn giao giao diện mẫu B → code (nhánh `v2`)

Tài liệu này là đầu vào để dựng **WebUI mẫu B** ("Thẻ một chạm", học từ Brilliant, Duolingo, Anki) cho app v2.
Thiết kế gốc nằm trên canvas claude.ai, trang "Mẫu B toàn diện". Mọi màn đã được xuất ra `screens/`.

- `screens/*.html`: mỗi màn là một trang HTML tĩnh, style viết inline. Đây là **spec chính xác**: màu, cỡ chữ,
  khoảng cách, bo góc, đổ bóng đều đọc thẳng từ đây. Mở bằng trình duyệt là xem được (cần mạng để tải Google Fonts).
- `screens/*.png`: ảnh chụp cùng màn, đúng font, để nhìn nhanh.
- `sketch-maps/`: script rough.js đã dùng để vẽ bản đồ nét vẽ tay. Dùng làm tham chiếu toạ độ và cách vẽ.

**Chữ và số trong các màn là dữ liệu mẫu** (ngày, % nhớ, số sketch, lịch ôn…). Khi dựng thật, lấy từ store và
nội dung có sẵn. Chỗ nào chưa có dữ liệu thì để trong `src/content/mock/`, ghi rõ là dữ liệu mẫu.

## 0. Phạm vi đợt này

Làm: giao diện và điều hướng theo mẫu B, nối vào dữ liệu và logic đang có của v2.

Không làm:

- Không đổi logic học: `src/learning/*` (đồ thị, FSRS, tiến độ), `src/exercises/grade.ts`, `src/algorithms/*`.
  Chỉ được thêm field/hàm mới khi màn cần (ví dụ trạng thái ga), kèm test.
- Không viết lại nội dung bài học MDX. Bước mới (đoán trước, làm trên giấy, sketch) chỉ dựng UI và kiểu dữ liệu;
  nội dung thật để sau, tạm thời dùng dữ liệu mẫu của ga 6 (UCS) như trong màn.
- Không dùng đỏ/xanh lá cho sai/đúng. Đúng = xanh dương `#1D63D6`, sai = cam `#C2560A` (an toàn cho mù màu).
- Không làm dark mode cho đợt này. Mẫu B chỉ thiết kế nền sáng. Bỏ nút đổi theme trong `Layout.tsx`;
  có thể giữ code theme để dùng lại sau.
- Chỉ làm trên nhánh `v2`. Không đụng `main` và nhánh khác. Không push nếu chưa được hỏi.

## 1. Token

Thay token cũ trong `src/styles.css` (route/signal/stop) bằng bộ dưới đây, khai báo qua `@theme` của Tailwind v4.

| Token | Giá trị | Dùng cho |
|---|---|---|
| `ink` | `#14162B` | chữ chính, viền 2px, bóng khối của nút |
| `bg` | `#EEF0F7` | nền trang |
| `surface` | `#FFFFFF` | thẻ |
| `muted` | `#3F4560` | chữ phụ |
| `line` | `#CDD2DE` | đường kẻ, cạnh bản đồ |
| `fill` | `#E3E6EE` | đã mở/khoá, chưa bắt đầu |
| `track` | `#DADDEA` | nền thanh tiến độ |
| `violet` | `#4A33C9`, soft `#ECE8FF` | hành động chính, tiến độ, ga đã qua, frontier |
| `sun` | `#FFC94A`, soft `#FFF4D6`, marker `#FFE58A` | hôm nay, đoán trước, ý chính |
| `correct` | `#1D63D6`, soft `#E3EDFF`, chữ đậm `#123F8C` | đúng |
| `wrong` | `#C2560A`, soft `#FFE9DA`, chữ đậm `#8A3A00` | sai, sức nhớ dưới 90% |
| `g` | `#0E7C7B` | g(n), quãng đã đi |
| `h` | `#B0306F` | h(n), ước lượng còn lại |
| `paper` | `#FBF7EC`, chấm `#E6DDC8` | nền bản đồ và sổ tay (lưới chấm 22px) |
| `lined` | `#FCFCFE` + kẻ `#E9ECF4` | giấy kẻ dòng của sketch |

Hình khối:

- Thẻ chính: viền `2px ink`, bo `20–24px`, bóng khối `0 5px 0 #14162B` (nút) hoặc `0 6px 0` (thẻ lớn).
- Thẻ phụ: nền trắng, không viền, bo `18–20px`.
- Bo kiểu vẽ tay (cartouche, sketch): `255px 15px 225px 15px / 15px 225px 15px 255px`.
- Nút chính: cao 56px, bo 16px, nền violet, chữ trắng 700 18px. Khi nhấn: `translateY(5px)` và bỏ bóng.
- Vùng chạm tối thiểu 44×44px. Focus: viền ngoài 3px violet, offset 2px.

Font (đều có trên npm, có bộ chữ tiếng Việt):

| Vai trò | Gói | Weight |
|---|---|---|
| Tiêu đề | `@fontsource/bricolage-grotesque` | 700, 800 |
| Thân | `@fontsource/onest` | 400, 500, 600, 700 |
| Số, mã | `@fontsource/jetbrains-mono` | 500, 700 |
| Chữ viết tay (sketch, bản đồ) | `@fontsource/playpen-sans` | 400, 600 |

Bỏ `be-vietnam-pro` và `ibm-plex-mono` sau khi thay xong.

Chuyển động: chỉ dùng opacity và dịch chuyển ngắn (≤ 200ms). Tôn trọng `prefers-reduced-motion`
(đã có `MotionConfig reducedMotion="user"`). Lưu ý cũ: đừng đặt `transform` lên cha của phần tử `position: fixed`.

## 2. Thành phần dùng chung (`src/ui/`)

Xem `screens/00-he-thong-thiet-ke.html` cho từng trạng thái.

| Thành phần | Ghi chú |
|---|---|
| `AppShell` | Máy tính: thanh trên với 3 mục **Hôm nay · Ôn tập · Sổ tay** (Ôn tập có badge số thẻ đến hạn). Dưới ~720px: thanh tab đáy 3 mục (bố cục như `01b`, bỏ ô Khóa học). Trang khóa (`/courses/:id`) và mục tiêu (`/goal/:id`) là trang con của Hôm nay: mục Hôm nay sáng khi đang ở đó. Có `ScrollRestoration` (mở trang con thì lên đầu, quay lại thì về chỗ cũ). Màn học và kiểm tra không có thanh điều hướng. |
| `AccountButton` | Không có trong màn mẫu B; dựng theo token. Góc phải thanh trên (cả máy tính lẫn điện thoại). Chưa đăng nhập: nút viền ink, logo GitHub + "Đăng nhập" (dưới 720px chỉ còn logo, ô 44px). Đã đăng nhập: avatar tròn 40px viền ink, chấm cam khi lưu lỗi; bấm mở hộp: tên, trạng thái lưu, nút Đăng xuất. |
| `Button` | primary, secondary (nền trắng, viền ink), link, disabled, trạng thái nhấn. |
| `Chip` | nhãn tròn; biến thể sun (đoán trước, đang theo), violet soft, xám. |
| `SessionHeader` | nút đóng + thanh tiến độ dày 14–16px + "n / N". Buổi học hôm nay dùng biến thể chia đoạn (mỗi phần ôn / ga / đoán / giấy một đoạn, đoạn đang chạy lấp dần); lesson và phần ôn nhúng trong buổi không vẽ thanh riêng. |
| `StationStrip` | dải 9 ô: đã qua (violet), hôm nay (sun + viền), chưa (fill). |
| `MemoryBar` | thanh sức nhớ; dưới 90% chuyển cam, kèm chữ %. |
| `AnswerTile` | ô đáp án: thường, đang chọn, đúng, sai, bị khoá. |
| `ConfidenceControl` | 3 mức: Đoán thôi · Khá chắc · Rất chắc. |
| `NumberInput` | ô số kiểu mono, viền violet khi focus. Có biến thể chip "g=" gắn cạnh nút bản đồ (`13`). |
| `FeedbackBar` | dải đáy sau khi chấm: đúng (xanh dương), sai (cam), gợi ý (sun), lời giải (xám). Trên điện thoại là bottom sheet. |
| `HintLadder` | Gợi ý → Lời giải; hiển thị dòng "không mở gợi ý thì bài này tính là nhớ tốt". |
| `StepDots` | chấm tiến độ trong một bước (ý 1/3, sketch 1/3). |
| `ViewToggle` | **Bản đồ \| Danh sách** có icon. Nhớ lựa chọn trong `localStorage` (bọc try/catch). |
| `SketchMap` | bản đồ nét vẽ tay, xem §4. |
| `SketchCard` | thẻ sketch: đã lật, còn úp (nền sọc violet + nút Lật), đang khoá (sọc xám + ổ khoá + điều kiện mở). |
| `PagesRow` | hàng biểu tượng trang sketch dưới mỗi ga: đã mở (đặc) / chưa mở (nét đứt). Thay cho "3 ngôi sao". |
| `Cartouche` | khung "ĐÍCH" bo kiểu vẽ tay. |

Nên có một trang `/#/dev/ui` dựng lại `00-he-thong-thiet-ke` từ các thành phần thật để soi.

## 3. Màn hình và route

Router giữ `createHashRouter`.

| Màn | File thiết kế | Route | Hiện có trong v2 |
|---|---|---|---|
| Hôm nay, gồm cả phần khóa học | `01`, `01b` + `02` | `/` | `HomePage.tsx` + `CourseSection.tsx` |
| Khóa học: bản đồ / danh sách | `03`, `03b` | `/courses/:courseId?view=map\|list` | mới |
| Mục tiêu: bản đồ ga / danh sách | `04`, `04b`, `04c` | `/goal/:goalId?view=map\|list` | `GoalPage.tsx` + `MapPage.tsx` (gộp) |
| Kiểm tra xếp lớp | `05` | `/check/:goalId` | `PlacementPage.tsx` (đổi giao diện) |
| Buổi học (các bước) | `10`–`17c` | `/learn/:lessonId` | `LessonPage.tsx` (đổi giao diện, thêm bước) |
| Ôn tập | `20` | `/review` | `ReviewPage.tsx` (đổi giao diện) |
| Sổ tay | `21` | `/notebook` | mới |

`/map` cũ: chuyển hướng sang `/goal/astar`. `/courses` cũ: chuyển về `/` kèm state `section: 'courses'` và cuộn tới
phần khóa học (`coursesLink` trong `app/CourseSection.tsx`; link "← Hôm nay" ở trang khóa và mục tiêu dùng nó). Có thể bỏ React Flow + dagre nếu không còn dùng.

Ghi chú từng màn:

- **Hôm nay (01):** thẻ "Buổi học hôm nay" gồm 4 bước (ôn kỹ năng đến hạn → ga mới → đoán trước cho ga sau →
  hệ thống lại trên giấy), lấy từ `useDue` và lộ trình. Cột phải: Sức nhớ, "Chắc chắn có đúng không"
  (số lần chọn Rất chắc và đúng/sai), Sổ tay. Hai khối cuối chưa có dữ liệu thì dùng mock.
- **Khóa học (02) — đã gộp vào Hôm nay** (user thấy hai tab thừa, 2026-10-17): màn `02` không còn là trang
  riêng. Dưới thẻ "Đang theo" của Hôm nay (khối này thay cho "Đang theo" của `02`), phần "Bạn muốn làm được
  gì?" trải hết bề ngang (dưới cả cột phải trên máy tính): mỗi khóa **3 mục tiêu** có nhãn lý do (đã có x/y ga
  nhờ…, kế tiếp trên đường mòn, mở đầu đường mòn khác) và dải **Xem thêm** dẫn tới `03`. Ảnh `02` vẫn là spec
  cho thẻ mục tiêu và dải Xem thêm; ô Khóa học trên thanh điều hướng trong ảnh `01`–`03` đã bỏ.
- **Khóa học bản đồ (03):** đỉnh núi = đích của khóa, ba đường mòn hội tụ lên đỉnh. Khối "Vì sao hôm nay học UCS?"
  ở cột phải: Đích ← Mục tiêu ← Ga hôm nay. Chế độ **Danh sách (03b)** dùng chung cột phải.
  Hiện chỉ có dữ liệu thật cho "Hiểu A*"; các mục tiêu khác của Cơ sở AI và Data Engineering để mock.
- **Mục tiêu bản đồ (04):** ga vẽ đúng đồ thị tiên quyết trong `skills.ts` (ga 5 không cần ga trước, ga 7 chỉ cần
  ga 2, ga 8 cần 6 và 7). Trạng thái ga: đã qua / hôm nay / học được ngay (đủ tiên quyết) / cần ga trước.
  BFS, GBFS là "ga phụ" (nét đứt, thuộc mục tiêu khác). Bấm ga mở panel bên phải (máy tính) hoặc bottom sheet
  (điện thoại, `04b`): mục tiêu ga, chuỗi "lần ngược từ đích", tên các sketch sẽ mở, nút Vào ga.
  Danh sách (`04c`) là tuyến 9 ga dạng hàng; mỗi hàng có bài là một link phủ cả hàng.
  **Ga "cần ga trước" vẫn mở được**: trạng thái chỉ là gợi ý. Panel ghi "Nên qua ga … trước" kèm nút phụ
  "Vẫn vào ga N"; màn mở đầu lesson (`10`) nhắc "Cần biết trước" với link "Học ga này trước".
- **Buổi học:** thứ tự bước là mở đầu (`10`: "Học xong bạn làm được", cần biết trước kèm % nhớ) → giải thích
  (`11`: tối đa 3 ý, từ chuyên môn có popover giải nghĩa + link xem lại ga cũ, bản đồ có nút đi từng bước) →
  đoán trước (`12`, có ConfidenceControl; sai lúc "Rất chắc" thì hiện `12b`) → bài tập (`13`: điền ngay trên bản đồ,
  FeedbackBar đáy) → làm trên giấy (`14`: in phiếu hoặc chép tay, chỉ nhập kết quả cuối, chụp ảnh lưu sổ tay) →
  qua ga (`15`: đối chiếu mục tiêu đầu ga với bằng chứng từng bài, lịch ôn, ga vừa mở) → mở khóa sketch (`16`) →
  hệ thống lại (`17`, `17b`, `17c`). Bước đoán trước và giấy là kiểu bước mới trong lesson (tuỳ chọn);
  lesson nào chưa có thì bỏ qua bước đó.
- **Đoán quan hệ (chưa có màn thiết kế, dựng theo `12`):** cùng chip `sun` "Đoán trước" và ConfidenceControl như `12`.
  Mỗi cặp là một thẻ: ý trên, ba nút phân đoạn (dẫn tới · là ví dụ của · không phải, viền `ink`, chọn thì nền
  `ink`), ý dưới. Sau khi chốt thì thẻ tô `correct`/`wrong`, nút đáp án nền `correct`, kèm một dòng lý do. Đã đoán
  rồi thì màn đổi chip thành "Bản đoán lần trước". Trong hệ thống lại (`17`), khối nền `sun-soft` "Lúc đầu bạn đã
  nối thế này" nằm trên phần chọn cách, mỗi cặp một dòng có nhãn "đúng"/"cần sửa".
- **Mở khóa sketch (16):** mỗi ga có nhiều sketch, mở hết khi qua ga. Thẻ úp là câu hỏi: khuyến khích vẽ ra giấy
  trước rồi mới lật để so.
- **Ôn tập (20):** trộn kỹ năng; câu nhớ lại tự do có danh sách ý đáp án để tự đánh dấu, app gợi ý mức chấm
  (Quên/Khó/Được/Dễ, kèm số ngày), người học quyết định. Câu trắc nghiệm vẫn chấm tự động như hiện nay.
- **Sổ tay (21):** mỗi ga là một chồng sketch (1/3…), ảnh trang giấy nằm cạnh; ga chưa qua và "Cả mục tiêu"
  là ô khoá ghi điều kiện mở; thẻ "Hôm nay nên vẽ lại" chọn kỹ năng nhớ thấp nhất.

Dữ liệu mới cần thêm (kiểu + mock): `courses` (khóa → mục tiêu → đường mòn), `sketches` (theo skill và theo mục tiêu:
id, tiêu đề-câu hỏi, nội dung SVG/MDX), `paperPhotos` (chỉ lưu cục bộ), lịch sử độ chắc chắn. Lưu tiến độ mở/lật
sketch trong store `learn-ai-v2` (thêm field, có migrate).

## 4. Bản đồ nét vẽ tay

- Dùng `roughjs` (đã dùng 4.6.6 để vẽ thiết kế) với **seed cố định**, để bản đồ không "rung" mỗi lần render.
- Đường mòn, cây, núi, hồ là SVG trang trí `aria-hidden`. **Ga là phần tử HTML thật** (`<a>`/`<button>`) đặt tuyệt đối
  trên SVG, có `aria-label` đầy đủ (tên ga, trạng thái, số sketch). Nhãn ga cũng là HTML.
- Toạ độ ga đặt trong dữ liệu (`layout.desktop`, `layout.phone` cho từng ga). Lấy toạ độ ban đầu từ
  `sketch-maps/goalmap.js` (máy tính 780×980), `goalphone.js` (điện thoại 390 rộng), `coursemap.js` (khóa 780×1000).
- Trang trí giữ nhạt (xanh lá nhạt, cát, xanh dương nhạt): chỉ để tạo cảm giác bản đồ, không tranh chú ý với ga.
- Luôn có chế độ Danh sách tương đương cho người không đọc bản đồ được.
- Trạng thái ga tính từ store và `skills.ts`; không hard-code.

## 5. Thứ tự làm

Mỗi mốc là một commit trên `v2`. Sau mỗi mốc: `npm test` xanh, `npm run build` qua, mở màn ở 1280px và 390px
so với ảnh trong `screens/`.

1. Token, font, các thành phần ở §2 + trang `/dev/ui`.
2. `AppShell` + Hôm nay.
3. Khóa học (3 mục tiêu + Xem thêm, nay nằm trong Hôm nay) + bản đồ/danh sách khóa.
4. Bản đồ/danh sách mục tiêu + panel ga + kiểm tra xếp lớp đổi giao diện.
5. Các bước buổi học (10–17).
6. Ôn tập + Sổ tay.

## 6. Kiểm tra cuối mỗi mốc

- Không có thanh cuộn ngang ở 390px; chữ không tràn khỏi thẻ (font Playpen Sans rộng hơn font dự phòng).
- Mọi thao tác dùng được bằng bàn phím; focus nhìn thấy được.
- Màu không phải tín hiệu duy nhất: đúng/sai luôn kèm icon ✓ / !, ga khoá kèm chữ "cần ga …".
- Bài test hiện có vẫn xanh (27 test lúc bàn giao) và thêm test cho logic mới (trạng thái ga, mở khóa sketch).

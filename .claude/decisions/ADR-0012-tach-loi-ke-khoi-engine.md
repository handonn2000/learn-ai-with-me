# ADR-0012 — Engine trả khóa, tầng UI sở hữu chữ

Ngày: 2026-09-06 · Trạng thái: chấp nhận · đính chính một phần ADR-0005

## Bối cảnh
Hai "engine" của app tự ráp câu tiếng Việt rồi trả ra cho UI vẽ:

- `features/search-lab/search-engine.js` — `runTrace` nhét vào mỗi `Step` một trường `txt` là
  câu hoàn chỉnh: `` `First-choice: gặp ${t.L(b)} có h = ${h[b]} nhỏ hơn ${h[u]} → leo NGAY…` ``.
  40 câu như vậy.
- `content/courses/csc14003/vacuum-world.js` — `runVacuum` gắn `note` cho từng bước, và
  `compareFinal` trả kèm `name` là tên chương trình bằng tiếng Việt.

Thêm bản tiếng Anh vào thì chỉ có hai đường: nhân đôi cả engine, hoặc moi chữ ra khỏi engine.

## Quyết định

**Engine trả KHÓA, tầng UI sở hữu CHỮ.** Cụ thể:

- 40 câu của lab tìm kiếm chuyển sang `features/search-lab/narrate.{vi,en}.ts` + selector
  `narrate.ts`. Engine `import { N }` rồi gọi `N.n17(t.L(u), h[u])`. Tham số đặt tên `a0, a1…`
  theo đúng thứ tự `${…}` của câu gốc, nên bản EN **đảo được trật tự vế** mà vẫn gắn đúng giá trị.
- `vacuum-world.js`: `note` → `noteKey` (`'suckDirty' | 'moved' | 'wall' | …`), chữ nằm ở
  `T.note` trong bundle của bài 2. `compareFinal` bỏ trường `name`; UI tra từ `PROGRAMS`.
- Nhãn đỉnh đồ thị (`'Arad'`, `'Făgăraș'`) **ở lại engine**: đó là danh tính đồ thị, không phải
  chữ hiển thị. (Dấu tiếng Romania trùng bảng chữ tiếng Việt nên bộ kiểm phải loại trừ theo
  vùng `labels: [...]`, không loại theo tên.)

Kết quả: **hai ngôn ngữ dùng chung MỘT bản engine.** Không có `search-engine.en.js`, không có
`vacuum-world.en.js` chứa logic — file EN của vacuum chỉ có 5 export data, phần engine
`export … from` bản gốc.

## Vì sao không nhân đôi engine
Hai bản logic là hai bản để trôi khỏi nhau. Sửa một cái bug thuật toán ở bản này mà quên bản kia
thì lab tiếng Anh dạy sai một chuyện mà lab tiếng Việt dạy đúng — và không cổng kiểm nào của repo
bắt được, vì cả hai đều "chạy được".

## Đính chính ADR-0005
ADR-0005 viết rằng mọi UI gọi solver qua **"đúng 2 export"** của `search-engine.js`. Không đúng
từ trước đợt này: file đã có **4 export** (`PRESETS`, `ALGO_META`, `runTrace`, `tokenize`). Ghi
lại ở đây thay vì sửa ADR cũ — ADR là bản ghi lịch sử.

Ranh giới thật bây giờ: 4 export như trên, **cộng** một `import { N } from './narrate'`.

## Việc này làm cú swap Rust/WASM RẺ HƠN, không đắt hơn
Một crate Rust mà phải tái tạo byte-for-byte văn phong tiếng Việt là chuyện vô lý — cả lý do tồn
tại của nó là số học. Sau đợt này `runTrace` gần như đã trả về dữ liệu thuần; bước còn lại cho
bản Rust là trả thẳng `{k, v}` thay vì gọi `N` (tức để UI ráp câu), và bước đó nhỏ hơn hẳn so với
lúc câu chữ còn nằm rải trong engine.

## Hệ quả
- `check_i18n.py` kiểm `engine`: file engine không được còn `txt:` là chuỗi literal.
- Thêm khóa `nX` mới thì phải thêm ở **cả hai** `narrate.{vi,en}.ts` — `satisfies typeof VI` bắt.
- `Step.txt` vẫn là chuỗi đã ráp (UI không phải đổi), chỉ khác là engine lấy chữ từ `N`.
- Cùng nguyên tắc đã áp cho `lib/spaced-repetition.ts`: `quizTip()` trả mức
  (`'low' | 'mid' | …`), chữ nằm ở `content/ui/*`.

Đóng một unit song ngữ VI/EN (`chrome`, `b1`, `b2`, `b3`). Tham số: tên unit.

Nửa "làm" của vòng lặp song ngữ. Nửa "đo" là `.claude/scripts/i18n_loop.py` — nó tất định,
miễn phí, chạy bao nhiêu lần cũng được. Lệnh này cố ý do NGƯỜI gọi, mỗi lần một unit: xem
ADR-0010 để biết vì sao không có orchestrator tự chạy.

## Trước khi bắt đầu

1. Đọc `.claude/i18n/acceptance.json`, lấy `pairs` / `vi_free` / `gates` của unit.
2. Đọc `.claude/skills/lesson-voice/references/english.md` — **bắt buộc** trước khi viết chữ
   tiếng Anh nào. Bảy khuôn viết trong `SKILL.md` áp cho cả hai thứ tiếng.
3. `python3 .claude/scripts/i18n_loop.py <unit>` để thấy đang đỏ ở đâu.

## Ba pha, KHÔNG được trộn vào nhau

**Pha 1 — chụp mốc.** `check_i18n.py <unit> --snapshot`. Bỏ qua nếu
`.claude/i18n/baseline/<unit>.json` đã có. Chụp SAU khi đã tách là mốc vô nghĩa.

**Pha 2 — tách chuỗi, KHÔNG dịch gì.** Rút chữ từ `.tsx` ra bundle `*.text.vi.ts`. Tiêu chí
thành công duy nhất: **trang tiếng Việt render y hệt như trước**. Làm từng mục một
(hero → từng mục đánh số → scenes), sau mỗi mục chạy:

    python3 .claude/scripts/check_i18n.py <unit> --extraction-audit

Đây là bước rủi ro nhất của cả dự án — không phải việc dịch, mà là moi ruột JSX rồi làm rơi
mất một câu tiếng Việt mà nhiều tháng sau mới lộ. Audit biến chuyện đó thành exit code.

**Pha 3 — viết bản tiếng Anh.** `*.text.en.ts` khai `satisfies typeof VI`; file `.en.js` giữ
đúng thứ tự khóa của bản VI. Cũng chia theo mục, sau mỗi mục chạy `i18n_loop.py <unit>`.

## Chốt kiểu chữ TRƯỚC khi gọi giám khảo

Dấu lược, ngoặc kép, chính tả Anh–Mỹ/Anh–Anh — quyết hết trước khi chấm. Sửa mấy thứ đó SAU khi
chấm là `pairs_hash` đổi và phán quyết hết hiệu lực, phải chấm lại cho một thay đổi thuần hình
thức. Quy ước hiện tại:

- **Dấu lược dùng `’` (typographic)** cho mọi rút gọn: `it’s`, `you’ve`, `didn’t`. Không bao giờ
  đụng dấu nháy đơn của JS, nên không phải đổi chuỗi sang nháy kép. Luật máy dò được: một dấu
  lược ASCII **nằm giữa hai chữ cái** luôn là rút gọn, không bao giờ là dấu đóng chuỗi.
- **Ngoặc kép trong câu tiếng Anh dùng `“ ”`**, không dùng `« »` kiểu Việt/Pháp.
- **Chính tả hệ Anh–Mỹ** (`math`, `optimization`, `coloring`) — xem ADR-0010 để biết vì sao nó
  đi cùng `LOCALE_TAG = 'en-GB'` mà không mâu thuẫn.

## Đóng unit

Khi chỉ còn cổng `judged` đỏ:

1. Gọi agent `i18n-fidelity-judge` với tên unit.
2. Sửa hết mục **SAI NGHĨA**. Mục DỊCH CỨNG / MẤT GIỌNG thì cân nhắc.
3. Lấy `pairs_hash` bằng cách chạy `i18n_loop.py <unit>` (nó in ra ở dòng judged), ghi
   `.claude/i18n/judged/<unit>.json`:

   ```json
   { "unit": "<id>", "verdict": "ĐẠT", "summary": "…", "pairs_hash": "<16 hex>", "at": "YYYY-MM-DD" }
   ```

   Sửa file dịch sau khi chấm là hash đổi và cổng đỏ lại — cố ý như vậy, đừng chữa bằng tay.
4. `python3 .claude/scripts/i18n_loop.py <unit>` → exit 0 là **unit đóng**.

## Xong rồi thì đồng bộ tài liệu

Bảng sync trong `CLAUDE.md` bắt buộc: `.claude/progress.md` mỗi phiên, `specs/lesson-<id>.md`
khi đổi layout/nội dung bài, `specs/00-architecture.md` khi đổi tầng/route/shape.

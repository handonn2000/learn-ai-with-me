# ADR-0010 — Song ngữ VI/EN: locale nằm trong basename, một ngôn ngữ một lúc

Ngày: 2026-09-05 · Trạng thái: chấp nhận

## Bối cảnh
App là tiếng Việt thuần: ~165.000 ký tự, 56% hardcode trong ba file `.tsx` bài học. ADR-0003
ghi "chưa i18n" là chủ đích hoãn, không phải bác bỏ. Mục tiêu bây giờ: người Việt đọc tiếng
Việt, người nước ngoài đọc tiếng Anh, và người Việt học thuật ngữ tiếng Anh vẫn thấy cặp
Anh–Việt như app đang làm.

Ràng buộc định hình mọi thứ: **repo không có test runner, không có linter** (ADR-0001) —
`tsc -b` là cổng chất lượng duy nhất. Nên thiết kế phải làm cho chính TypeScript bắt được bản
dịch thiếu, chứ không dựa vào đọc lại bằng mắt.

## Quyết định

**Không thêm thư viện i18n.** Không i18next, không lingui, không formatjs. Toàn bộ "thư viện"
là `src/lib/i18n.ts` (một hàm `tup`) + `src/lib/locale.ts` (~75 dòng). Dependency runtime giữ
nguyên bốn cái: react, react-dom, react-router-dom, katex.

**Locale nằm trong `basename` của Router.** VI ở gốc trần, EN ở gốc + `en`:

```tsx
<BrowserRouter basename={LOCALE_BASENAME}>   // '/learn-ai-with-me/'  hoặc  '/learn-ai-with-me/en'
```

Đây là chỗ mua được nhiều nhất. Vì locale quyết từ URL **trước khi React mount** và không đổi
nếu không reload, `LOCALE` là **hằng số ở module scope**. Nhờ đó:

- `const NAV` / `const SLIDES` ở đầu file bài học, `ctx.fillText` trong scenes, và
  `search-engine.js` đọc đúng chữ **đồng bộ lúc import**. Hook không làm được việc đó.
- **Không một `<Link to>` nào phải sửa** (14 chỗ) — Router tự cộng tiền tố.
- Bảng route trong `App.tsx` không đổi một dòng. **Không có route `/en/*` nào tồn tại.**
- `Session.lessonPath` và `backTo` giữ nguyên chuỗi trần.

Chỗ duy nhất vỡ: thẻ `<a>` thô nằm trong chuỗi `lead` (đúng cái bẫy ADR-0007 đã ghi) — dùng
`localeBase` thay `import.meta.env.BASE_URL`. Link tới `/materials/` thì **vẫn** dùng
`BASE_URL`: PDF là asset chung, không theo ngôn ngữ.

**Không có React context.** Theme cần context vì nó đổi lúc chạy mà không reload; locale theo
thiết kế thì không thể. Provider cho một giá trị không bao giờ đổi chỉ tốn file, wrapper và
hook mà không mua gì. `main.tsx` giữ đúng một provider.

**Đổi ngôn ngữ = tải lại trang** (`switchTo` gọi `location.assign`), giữ nguyên pathname +
query + **hash**. Chấp nhận có chủ đích: nó re-evaluate các hằng số module. Phương án khác đòi
remount cả Router (mất state y hệt) hoặc biến mọi hằng số module thành giá trị chạy qua hook —
tức phá bỏ chính thứ vừa mua được ở trên. Cái mất là câu quiz đang làm dở trên trang hiện tại;
theme, chế độ xem và toàn bộ tiến độ nằm ở localStorage nên sống sót.

## Chuỗi ưu tiên

```
1. ?lang=vi|en   — chốt cứng + GHI vào lam-locale (gõ ra là hành động cố ý, như bấm nút)
2. prefix /en/   — chỉ cho lần xem này, KHÔNG ghi nhớ
3. lam-locale    — chỉ switchTo() và ?lang= ghi khóa này
4. navigator.languages: có 'vi*' → vi | else có 'en*' → en
5. Intl timeZone: Asia/Ho_Chi_Minh | Asia/Saigon → vi | timezone khác → en
6. vi
```

**Vì sao có `?lang=`.** Bản tiếng Việt nằm ở gốc TRẦN, mà gốc trần cũng là chỗ chạy dò tìm.
Không có tham số này thì bản tiếng Việt **không có link chia sẻ được** — gửi cho người dùng máy
tiếng Anh là họ bị đẩy sang bản Anh, không cách nào ghim. Phát hiện ra lỗ này khi thử trên
trình duyệt thật, không phải lúc thiết kế.

**URL thắng lựa chọn đã lưu, nhưng không ghi đè nó.** Người Việt mở link `/en/` được chia sẻ
thì đọc tiếng Anh lần đó; lần sau mở gốc trần vẫn về tiếng Việt. Hệ quả: `lam-locale` **chỉ**
được ghi bởi `switchTo()` và `?lang=`. Dò tìm không bao giờ ghi. Đúng một luật đó xóa sạch cả
lớp bug "sao tự nhiên tôi ở tiếng Anh".

**Không gọi API tra IP.** App là trang tĩnh trên GitHub Pages, không có server đọc header. API
bên thứ ba thì: thêm phụ thuộc dịch vụ ngoài, gửi IP người học đi, thêm độ trễ khi mở trang,
hỏng khi rate-limit hoặc adblock chặn — và VPN vẫn đoán sai. `navigator.languages` thật ra còn
ĐÚNG HƠN cho câu hỏi "người này đọc ngôn ngữ nào": Việt kiều dùng máy tiếng Anh nhận đúng bản EN.

**Điểm phán đoán duy nhất:** `vi` xuất hiện ở BẤT KỲ đâu trong `navigator.languages` thì thắng,
không phải "khớp đầu tiên" — nhiều máy bán ở VN cài sẵn `en-US` đứng đầu mà người dùng không hề
chọn, và bản tiếng Việt là bản gốc, giàu hơn. Đây là dòng đầu tiên cần xem lại nếu có phản hồi
ngược. Mọi bước còn lại là sự thật, không phải phán đoán.

## Cách chia chữ, và vì sao `tsc` là bộ kiểm

Mỗi đơn vị có ba file phẳng cùng cấp: `*.vi.ts` (nguồn sự thật), `*.en.ts`
(`satisfies typeof VI`), và một selector `const T: typeof VI = LOCALE === 'en' ? EN : VI`.

**Không có hàm `t()` nào.** Tra cứu là truy cập thuộc tính trên object đã gõ kiểu
(`<Html t={T.ch1.lead} />` — prop `t` của `Html` là chuỗi HTML thô, giữ nguyên, không đụng).
Chính điều đó làm `tsc` thành bộ kiểm: một lời gọi `t('key')` sẽ xóa mất kiểu. Thiếu khóa,
thừa khóa, sai arity `tup()`, sai chữ ký hàm — tất cả là lỗi build.

**File `.js` chưa gõ kiểu vẫn ép được parity.** `allowJs: true` + `checkJs: false` nghĩa là TS
không báo lỗi *bên trong* `intro-ai.js`, nhưng vẫn **suy ra đầy đủ kiểu cấu trúc cho export**
của nó. Nên một module selector đã gõ kiểu (`const M: typeof VI = …`) là đủ — không cần bật
`checkJs`, không cần convert sang TS, không đụng ADR-0005. Đã thử thật: đổi một trường trong
`session-quizzes.js` thì `tsc` báo `Property 'topicId' is missing`.

**Annotation chứ không phải `as`.** Cast thì bịt lỗi, annotation thì không. Đây là ranh giới
giữa "có kiểm" và "tưởng là có kiểm".

Dữ liệu nhiều cấu trúc ít chữ thì viết bản EN theo lối **dẫn xuất** (`{...VI, ...OVERRIDE[id]}`)
— lệch cấu trúc thành bất khả thi. Đổi lại, `Record<string, …>` là kiểu mở nên quên một id sẽ
trải ra rỗng mà không lỗi; `check_i18n.py` canh độ phủ đó.

## Một chỗ trông như mâu thuẫn, thật ra là cố ý

`LOCALE_TAG = 'en-GB'` nhưng **chính tả theo hệ Anh–Mỹ** (`math`, `optimization`, `coloring`).
Hai lựa chọn độc lập nhau, mỗi cái có lý do riêng:

- `en-GB` chỉ dùng cho **định dạng ngày**: nó cho thứ tự ngày-trước (`05/09`), khớp bản tiếng
  Việt và khớp phần lớn thế giới. Chọn `en-US` thì `09/05` đọc ngược cho hầu hết người đọc.
- **Chính tả Anh–Mỹ** vì thuật ngữ của khóa neo vào AIMA và CS188, và bản thân app đã dùng
  `MATH PRIMER`. Trộn `maths` với `Marginalization` trong cùng một trang là vết của bản dịch
  chưa qua biên tập.

Ghi ra đây vì nó **trông như** một chỗ thiếu nhất quán — đừng "sửa" một trong hai cho khớp cái
kia mà không đọc đoạn này.

## Cổng kiểm hai lớp

`tsc` sở hữu **cấu trúc**. `.claude/scripts/check_i18n.py` sở hữu **giá trị**: dịch chưa, thẻ
HTML còn không, số liệu có lệch không, anchor có trỏ cùng chỗ không, code mẫu có trôi không.
Chép lại thứ `tsc` đã bắt là tạo nguồn sự thật thứ hai rồi để nó lệch.

`.claude/scripts/i18n_loop.py <unit>` chạy các cổng và exit 0 khi unit đóng được. Cổng cuối là
`judged`: phán quyết của `i18n-fidelity-judge` **kèm `pairs_hash`** — sửa một ký tự trong file
dịch là phán quyết hết hiệu lực. Không sổ sách bằng tay, không xanh cũ.

**Không dựng orchestrator tự gọi `claude -p` trong vòng lặp.** Đó là vòng lặp có tính phí,
không có người trong vòng, trên repo chưa từng chạy eval trả tiền; `evals/run.py` đã sở hữu
hình dạng đó; và chất lượng bản dịch là thứ duy nhất vòng lặp tất định không kết thúc dựa vào
được. Nửa "làm" là slash command người gọi: `.claude/commands/i18n-unit.md`.

## Hệ quả

- **Bundle: cả hai locale ship trong mọi chunk.** Rollup không tree-shake được
  `LOCALE === 'en' ? EN : VI`. Số ĐO THẬT sau khi xong cả ba bài (gzip):

  | chunk | trước | sau | tăng |
  |---|---|---|---|
  | `index` (khung + content/ui + data khóa) | 56,63 kB | 75,56 kB | +18,9 |
  | `Lesson01Intro` | 20,10 kB | 31,10 kB | +11,0 |
  | `Lesson02Agents` | 28,09 kB | 46,28 kB | +18,2 |
  | `Lesson03Search` | 32,27 kB | 48,26 kB | +16,0 |

  Tổng **≈ +64 kB gzip**, tức **gần gấp đôi con số ước lượng +35 kB** lúc lập kế hoạch. Ghi ra
  đây vì đó là cái giá thật của quyết định "một bản build, chọn lúc chạy". Người học chỉ tải
  chunk của trang đang mở, nên chi phí mỗi lần vào một bài là +11…+18 kB — vẫn nhỏ so với
  KaTeX, nhưng đừng nói với nhau là "không đáng kể".

- Phương án tránh được chuyện đó — build hai lần với `define` để `LOCALE` thành hằng
  compile-time — cho tree-shaking hoàn hảo, nhưng dev server chỉ chạy được một locale mỗi lần
  và workflow deploy phải đổi. **Không đáng đánh đổi lấy 35 kB.**
- `<html lang>` do `locale.ts` đặt đồng bộ trước `createRoot`. **Không thêm script inline vào
  `index.html`**: script hiện có tồn tại để chống *nháy màu*, locale không gây nháy, và nhân đôi
  chuỗi dò tìm vào HTML không gõ kiểu đúng là kiểu lệch tài liệu/code mà CLAUDE.md cảnh báo.
- SEO: `canonical` + `hreflang` duy trì bằng `useEffect` trong `App.tsx`, ghi đè chính ba thẻ
  tĩnh trong `index.html` thay vì thêm thẻ mới (hai thẻ `hreflang="vi"` khác href trên cùng một
  trang là tín hiệu mâu thuẫn). **Không prerender** — cần dependency mới. Deep link trên Pages
  vốn trả 404 kèm `index.html` (ADR-0007) nên SEO từng trang có trần thấp sẵn; `404.html` không
  cần đổi vì nó đã phủ `/en/...`.
- Giọng văn: `lesson-voice/SKILL.md` là hệ đại từ tiếng Việt, sang tiếng Anh thì sụp. Bản luật
  nền tương ứng nằm ở `references/english.md` — **chương mới của cùng skill**, không tách skill
  riêng (skill riêng cần trigger riêng rồi hai bên trôi khỏi nhau). `check_lesson.py` tự nhận
  biết nửa EN theo hậu tố `.en.` và đo giọng/icon từng nửa.
- `src/content/ui/*` là **chữ của khung app**, không phải dữ liệu khóa — nội dung bài học nằm ở
  bundle riêng cạnh trang của nó.
- `LangToggle` gắn **bên trong `LessonNav`**, không truyền từ trang bài học vào: bài mới không
  thể quên, và `new-lesson/wiring.md` không mọc thêm bước.

## Đã cân nhắc rồi bỏ

- **Thư viện i18n** — vi phạm ADR-0001, và phần cần viết chỉ khoảng 90 dòng.
- **Tái cấu trúc route thành `/:lang?/...`** — nhân đôi bảng route hoặc thêm param mà mọi
  `<Link>` phải luồn, cần `useLocalePath()` ở 14 chỗ, và **để hằng số module ngoài tầm với**,
  tức mất 3 trong 8 nhóm chỗ giấu tiếng Việt. Đổi lấy một cú chuyển mượt trên một click hiếm.
- **Chỉ lưu localStorage, URL không đổi** — link chia sẻ không mang ngôn ngữ, Google không bao
  giờ thấy bản tiếng Anh. Mục tiêu "tiếp cận người nước ngoài" coi như hỏng.
- **`?lang=en` thay cho prefix** — SEO yếu hơn hẳn, công cụ tìm kiếm coi là cùng một trang.
  (`?lang=` vẫn giữ, nhưng làm *chốt cứng* chứ không làm nơi chứa locale.)

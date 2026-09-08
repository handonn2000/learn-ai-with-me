// Ngôn ngữ hiển thị. Module thuần, KHÔNG phải React context — xem ADR-0010.
//
// Vì sao không context: theme cần context vì nó đổi lúc chạy mà không reload. Locale thì
// KHÔNG THỂ đổi mà không reload (xem `switchTo`), nên nó là một HẰNG SỐ Ở MODULE SCOPE.
// Chính điều đó cho phép `const NAV` / `SLIDES` ở đầu file bài học, `ctx.fillText` trong
// scenes, và `search-engine.js` đọc đúng chữ ngay lúc import — thứ mà hook không làm được.
//
// Locale nằm trong `basename` của Router, nên KHÔNG có route `/en/*` nào và không một
// `<Link to>` nào phải sửa. VI ở gốc trần, EN ở gốc + 'en'.
//
// Thứ tự ưu tiên:
//   1. ?lang=vi|en   — chốt cứng + ghi nhớ (link chia sẻ ghim được ngôn ngữ)
//   2. prefix /en/   — chỉ cho lần xem này, không ghi nhớ
//   3. lựa chọn đã lưu (lam-locale — CHỈ switchTo() và ?lang= ghi khóa này)
//   4. navigator.languages
//   5. múi giờ
//   6. vi

export type Locale = 'vi' | 'en';

const BASE = import.meta.env.BASE_URL; // '/learn-ai-with-me/' — luôn kết thúc bằng '/'
const EN_ROOT = BASE + 'en'; // '/learn-ai-with-me/en'
const KEY = 'lam-locale'; // cùng tiền tố 'lam-' với 'lam-theme', 'lam-lesson-view'

/** Phần đường dẫn sau gốc site, luôn bắt đầu bằng '/'. */
function restOf(pathname: string, root: string): string {
  const cut = root === BASE ? BASE.length - 1 : root.length; // giữ lại dấu '/' đứng trước
  return (pathname.startsWith(root) ? pathname.slice(cut) : '') || '/';
}

/** Lựa chọn người học tự bấm. CHỈ `switchTo()` ghi khóa này — xem ghi chú ở `resolve()`. */
function stored(): Locale | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'vi' || v === 'en' ? v : null;
  } catch {
    return null;
  }
}

/** Đoán ngôn ngữ từ máy người dùng. Không gọi mạng, không đụng IP — xem ADR-0010. */
function detect(): Locale {
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    const tags = langs.filter(Boolean).map((l) => l.toLowerCase());
    // 'vi' ở BẤT KỲ đâu trong danh sách là thắng, không phải "khớp đầu tiên": nhiều máy bán
    // ở VN cài sẵn en-US đứng đầu mà người dùng không hề chọn. Đây là chỗ phán đoán duy nhất
    // trong cả chuỗi — nếu sai thì sửa đúng một dòng này (ADR-0010).
    if (tags.some((l) => l === 'vi' || l.startsWith('vi-'))) return 'vi';
    if (tags.some((l) => l === 'en' || l.startsWith('en-'))) return 'en';
  } catch {
    /* trình duyệt cổ — rơi xuống timezone */
  }
  try {
    // Ngôn ngữ là thứ người ta KHAI, múi giờ là hoàn cảnh. Nên timezone chỉ phá thế hòa khi
    // danh sách ngôn ngữ không có cả vi lẫn en (ví dụ khách Nhật).
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === 'Asia/Ho_Chi_Minh' || tz === 'Asia/Saigon') return 'vi';
    if (tz) return 'en';
  } catch {
    /* bỏ qua */
  }
  return 'vi';
}

function resolve(): Locale {
  const p = location.pathname;

  // 1 · ?lang=vi|en — chốt cứng, thắng tất cả, và GHI vào lựa chọn đã lưu vì gõ nó ra là một
  //     hành động cố ý y như bấm nút.
  //
  //     Vì sao cần: bản tiếng Việt nằm ở gốc TRẦN, mà gốc trần cũng chính là chỗ chạy dò tìm.
  //     Nên nếu không có tham số này thì bản tiếng Việt KHÔNG CÓ ĐƯỜNG LINK CHIA SẺ ĐƯỢC —
  //     gửi link cho người dùng máy tiếng Anh là họ bị đẩy sang bản Anh, không cách nào ghim.
  //     Có nó rồi thì luật "URL luôn thắng" mới đúng cho cả hai phía.
  const forced = new URLSearchParams(location.search).get('lang');
  if (forced === 'vi' || forced === 'en') {
    try {
      localStorage.setItem(KEY, forced);
    } catch {
      /* bỏ qua */
    }
    const q = new URLSearchParams(location.search);
    q.delete('lang'); // dùng xong thì dọn, đừng để dính vào mọi link chia sẻ về sau
    const rest = restOf(p, p === EN_ROOT || p.startsWith(EN_ROOT + '/') ? EN_ROOT : BASE);
    const qs = q.toString();
    const root = forced === 'en' ? EN_ROOT : BASE.slice(0, -1);
    history.replaceState(null, '', root + rest + (qs ? '?' + qs : '') + location.hash);
    return forced;
  }

  // 2 · prefix /en/ trong đường dẫn. Lựa chọn đã lưu KHÔNG bị ghi đè — người Việt mở link /en/
  //     được chia sẻ thì đọc tiếng Anh lần đó, lần sau mở gốc trần vẫn về tiếng Việt.
  if (p === EN_ROOT || p.startsWith(EN_ROOT + '/')) return 'en';

  // 3 · lựa chọn đã lưu → 4 · ngôn ngữ trình duyệt → 5 · múi giờ → 6 · vi
  if ((stored() ?? detect()) === 'en') {
    // replaceState chứ không phải location.assign: không tốn thêm một vòng tải, và không tạo
    // bẫy nút Back. Phải chạy TRƯỚC createRoot để basename và URL không lệch nhau.
    history.replaceState(null, '', EN_ROOT + restOf(p, BASE) + location.search + location.hash);
    return 'en';
  }
  return 'vi';
}

export const LOCALE: Locale = resolve();

/** Thẻ ngôn ngữ cho Intl. en-GB chứ không en-US: giữ thứ tự ngày-trước như bản Việt. */
export const LOCALE_TAG = LOCALE === 'en' ? 'en-GB' : 'vi-VN';

/** Tiền tố cho thẻ <a> thô và asset tĩnh (ADR-0007) — dùng thay `import.meta.env.BASE_URL`. */
export const localeBase = LOCALE === 'en' ? EN_ROOT + '/' : BASE;

/** basename của BrowserRouter. Nhờ nó mà route table và mọi `<Link to>` không phải đổi. */
export const LOCALE_BASENAME = LOCALE === 'en' ? EN_ROOT : BASE;

document.documentElement.lang = LOCALE;

/**
 * Cặp URL tuyệt đối của CÙNG một trang ở hai ngôn ngữ — cho canonical + hreflang.
 * Đặt ở đây chứ không ở App.tsx để phép cắt đường dẫn chỉ tồn tại đúng một chỗ.
 */
export function altUrls(): { vi: string; en: string } {
  const rest = restOf(location.pathname, LOCALE === 'en' ? EN_ROOT : BASE);
  const origin = location.origin;
  return { vi: origin + BASE.slice(0, -1) + rest, en: origin + EN_ROOT + rest };
}

/**
 * Đổi ngôn ngữ: cùng trang, ngôn ngữ kia. Giữ nguyên pathname + query + HASH, nên đang đứng
 * ở `#ch5` đổi ngữ vẫn rơi vào `#ch5` (anchor id bất biến theo locale — check_i18n.py ép).
 *
 * Tải lại cả trang là CÓ CHỦ ĐÍCH: nó re-evaluate các hằng số ở module scope. Cái mất là câu
 * quiz đang làm dở trên trang hiện tại; theme, chế độ xem và toàn bộ tiến độ nằm ở
 * localStorage nên sống sót.
 */
export function switchTo(next: Locale): void {
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* localStorage bị chặn — vẫn đổi được, chỉ là lần sau không nhớ */
  }
  const rest = restOf(location.pathname, LOCALE === 'en' ? EN_ROOT : BASE);
  const root = next === 'en' ? EN_ROOT : BASE.slice(0, -1);
  location.assign(root + rest + location.search + location.hash);
}

import { LOCALE, switchTo } from '@/lib/locale';

// Nút đổi ngôn ngữ. Gắn ở AppHeader (trang thường) và bên trong LessonNav (trang bài học).
//
// Chữ trên nút và tooltip CỐ Ý viết bằng ngôn ngữ ĐÍCH, không phải ngôn ngữ đang xem: người
// đang ở bản tiếng Anh mà không đọc được tiếng Việt vẫn phải nhận ra đây là lối về. Vì vậy
// file này là chỗ duy nhất trong app hợp lệ khi chứa cả hai thứ tiếng — check_i18n.py miễn
// trừ nó khỏi kiểm `vi_free`.
export function LangToggle() {
  const toEn = LOCALE !== 'en';
  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={() => switchTo(toEn ? 'en' : 'vi')}
      title={toEn ? 'Read this page in English' : 'Xem trang này bằng tiếng Việt'}
      aria-label={toEn ? 'Read this page in English' : 'Xem trang này bằng tiếng Việt'}
    >
      {toEn ? 'EN' : 'VI'}
    </button>
  );
}

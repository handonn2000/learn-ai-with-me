// Chọn bundle chữ của bài 1 theo ngôn ngữ. LOCALE là hằng số module (ADR-0010) nên phép chọn
// này xảy ra lúc import — nhờ vậy `const NAV`/`SLIDES` ở đầu trang và `ctx.fillText` trong
// scenes đọc được đúng chữ mà không cần hook.
import { LOCALE } from '@/lib/locale';
import { VI } from './lesson01.text.vi';
import { EN } from './lesson01.text.en';

export const T: typeof VI = LOCALE === 'en' ? EN : VI;

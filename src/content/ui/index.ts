// Chọn bundle chữ theo ngôn ngữ đang xem. LOCALE là hằng số ở module scope (ADR-0010) nên
// phép chọn này xảy ra đúng một lần lúc import — không hook, không context, không re-render.
//
// Chú kiểu `: typeof VI` chứ không phải `as`: cast thì bịt lỗi, annotation thì không.
import { LOCALE } from '@/lib/locale';
import { VI } from './vi';
import { EN } from './en';

export const UI: typeof VI = LOCALE === 'en' ? EN : VI;

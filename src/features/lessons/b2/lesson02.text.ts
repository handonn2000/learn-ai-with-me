// Chọn bundle chữ của bài 2 theo ngôn ngữ. Xem ADR-0010.
import { LOCALE } from '@/lib/locale';
import { VI } from './lesson02.text.vi';
import { EN } from './lesson02.text.en';

export const T: typeof VI = LOCALE === 'en' ? EN : VI;

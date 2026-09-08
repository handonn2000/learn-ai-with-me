// Chọn lời kể của lab tìm kiếm theo ngôn ngữ. Engine import đúng module này.
import { LOCALE } from '@/lib/locale';
import { VI } from './narrate.vi';
import { EN } from './narrate.en';

export const N: typeof VI = LOCALE === 'en' ? EN : VI;

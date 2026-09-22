import { LOCALE } from '@/lib/locale';
import { VI } from './lesson06.text.vi';
import { EN } from './lesson06.text.en';
export const T: typeof VI = LOCALE === 'en' ? EN : VI;

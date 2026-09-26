import { LOCALE } from '@/lib/locale';
import { VI } from './lesson10.text.vi';
import { EN } from './lesson10.text.en';
export const T: typeof VI = LOCALE === 'en' ? EN : VI;

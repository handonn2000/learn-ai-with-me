import { LOCALE } from '@/lib/locale';
import { VI } from './lesson11.text.vi';
import { EN } from './lesson11.text.en';
export const T: typeof VI = LOCALE === 'en' ? EN : VI;

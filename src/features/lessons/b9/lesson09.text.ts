import { LOCALE } from '@/lib/locale';
import { VI } from './lesson09.text.vi';
import { EN } from './lesson09.text.en';
export const T: typeof VI = LOCALE === 'en' ? EN : VI;

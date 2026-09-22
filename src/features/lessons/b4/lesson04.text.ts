import { LOCALE } from '@/lib/locale';
import { VI } from './lesson04.text.vi';
import { EN } from './lesson04.text.en';

export const T: typeof VI = LOCALE === 'en' ? EN : VI;

import { LOCALE } from '@/lib/locale';
import { VI } from './lesson03.text.vi';
import { EN } from './lesson03.text.en';

export const T: typeof VI = LOCALE === 'en' ? EN : VI;

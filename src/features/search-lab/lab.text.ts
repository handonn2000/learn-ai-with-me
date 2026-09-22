import { LOCALE } from '@/lib/locale';
import { VI } from './lab.text.vi';
import { EN } from './lab.text.en';

export const T: typeof VI = LOCALE === 'en' ? EN : VI;

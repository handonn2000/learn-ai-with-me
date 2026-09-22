import { LOCALE } from '@/lib/locale';
import { VI } from './lesson05.text.vi';
import { EN } from './lesson05.text.en';

export const T: typeof VI = LOCALE === 'en' ? EN : VI;

import { LOCALE } from '@/lib/locale';
import { VI } from './lesson08.text.vi';
import { EN } from './lesson08.text.en';

export const T: typeof VI = LOCALE === 'en' ? EN : VI;

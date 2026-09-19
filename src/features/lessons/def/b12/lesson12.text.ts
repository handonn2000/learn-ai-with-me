import { LOCALE } from '@/lib/locale';
import { VI } from './lesson12.text.vi';
import { EN } from './lesson12.text.en';
export const T: typeof VI = LOCALE === 'en' ? EN : VI;

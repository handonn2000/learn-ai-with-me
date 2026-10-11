import { LOCALE } from '@/lib/locale';
import { VI } from './lesson07.text.vi';
import { EN } from './lesson07.text.en';
export const T: typeof VI = LOCALE === 'en' ? EN : VI;

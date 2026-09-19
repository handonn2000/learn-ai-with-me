import { LOCALE } from '@/lib/locale';
import { VI } from './storage-labs.text.vi';
import { EN } from './storage-labs.text.en';
export const L: typeof VI = LOCALE === 'en' ? EN : VI;

// Chọn dữ liệu bài 2 theo ngôn ngữ. Annotation ép parity cho hai file .js chưa gõ kiểu.
import { LOCALE } from '@/lib/locale';
import * as VI from './agents-data.js';
import * as EN from './agents-data.en.js';

const M: typeof VI = LOCALE === 'en' ? EN : VI;
type Parity<A, B> = [A] extends [B] ? true : { enThua: Exclude<keyof A, keyof B> };
const _p: Parity<typeof EN, typeof VI> = true; void _p;

export const { PEAS_ROWS, DIMS, ENVIRONMENTS, ARCH_LEVELS, LEARNING_PARTS, HW } = M;

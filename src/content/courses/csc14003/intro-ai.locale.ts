// Chọn dữ liệu Buổi 1 theo ngôn ngữ. Đây là chỗ `tsc` ép parity cho hai file .js KHÔNG được
// typecheck: annotation `: typeof VI` bắt bản EN thiếu export hoặc thiếu field; `Parity` bắt
// bản EN thừa export. Không cần bật checkJs, không đụng ADR-0005. Xem ADR-0010.
import { LOCALE } from '@/lib/locale';
import * as VI from './intro-ai.js';
import * as EN from './intro-ai.en.js';

const M: typeof VI = LOCALE === 'en' ? EN : VI;
type Parity<A, B> = [A] extends [B] ? true : { enThua: Exclude<keyof A, keyof B> };
const _p: Parity<typeof EN, typeof VI> = true; void _p;

export const { QUAD, QUIZ, ERAS, WINTERS, TIMELINE, FIELDS, CANDO, TOPICS, CHECKS } = M;

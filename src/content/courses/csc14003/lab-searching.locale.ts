import { LOCALE } from '@/lib/locale';
import type { Widen } from '@/lib/i18n';
import * as VI from './lab-searching.js';
import * as EN from './lab-searching.en.js';

// Widen<> vì file này có export là CHUỖI cấp cao nhất (HELPER_PY, MAIN_PY, INPUT_EX,
// OUTPUT_EX): `typeof VI` giữ kiểu nguyên văn nên bản EN sẽ không bao giờ gán được.
const content: Widen<typeof VI> = LOCALE === 'en' ? EN : VI;
// So KHÓA chứ không so cả kiểu: mục đích của nó là bắt export THỪA ở bản EN, mà so cả
// kiểu thì lại dính đúng cái bẫy chuỗi-nguyên-văn mà Widen<> vừa gỡ.
type Parity<A, B> = [keyof A] extends [keyof B] ? true : { enThua: Exclude<keyof A, keyof B> };
const _p: Parity<typeof EN, typeof VI> = true; void _p;

export const { ALGOS, HELPER_PY, MAIN_PY, INPUT_EX, OUTPUT_EX } = content;

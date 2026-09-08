// Chọn thẻ toán nền theo ngôn ngữ.
//
// Trải `{...VI, ...EN}` chứ không thay hẳn: buổi nào CHƯA có bản tiếng Anh thì rơi về bản Việt,
// còn hơn là biến mất khỏi trang. Dịch xong buổi nào thì bản EN tự đè lên buổi đó.
import { LOCALE } from '@/lib/locale';
import { MATH_PRIMERS as VI } from './math-primers.js';
import { MATH_PRIMERS as EN } from './math-primers.en.js';

export const MATH_PRIMERS: typeof VI = LOCALE === 'en' ? { ...VI, ...EN } : VI;

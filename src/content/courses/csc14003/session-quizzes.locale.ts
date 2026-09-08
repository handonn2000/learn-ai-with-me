// Chọn bộ quiz cuối buổi theo ngôn ngữ. Trải {...VI, ...EN}: buổi chưa dịch rơi về bản Việt
// thay vì mất quiz. Xem ghi chú trong session-quizzes.en.js.
import { LOCALE } from '@/lib/locale';
import { SESSION_QUIZZES as VI } from './session-quizzes.js';
import { SESSION_QUIZZES as EN } from './session-quizzes.en.js';

export const SESSION_QUIZZES: typeof VI = LOCALE === 'en' ? { ...VI, ...EN } : VI;

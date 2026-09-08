// Chọn bộ đề kiểm tra tổng hợp theo ngôn ngữ. Annotation `: TestPart[]` chứ không phải `as`.
import { LOCALE } from '@/lib/locale';
import { PART_TESTS as VI, type TestPart } from './part-tests';
import { PART_TESTS_EN as EN } from './part-tests.en';

export const PART_TESTS: TestPart[] = LOCALE === 'en' ? EN : VI;

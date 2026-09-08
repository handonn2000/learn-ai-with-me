import type { Course } from '../types';
import { LOCALE } from '@/lib/locale';
import { csc14003 } from './csc14003';
import { csc14003en } from './csc14003/index.en';
import { dataEngineeringFoundation } from './data-engineering-foundation';
import { dataEngineeringFoundationEn } from './data-engineering-foundation/index.en';

// Thêm khóa mới: tạo folder src/content/courses/<slug>/ export một Course, rồi thêm vào đây.
// Có bản tiếng Anh thì thêm cả vào nhánh 'en' — hai mảng phải cùng độ dài và cùng thứ tự slug.
export const courses: Course[] = LOCALE === 'en'
  ? [csc14003en, dataEngineeringFoundationEn]
  : [csc14003, dataEngineeringFoundation];

export function getCourse(slug: string | undefined): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

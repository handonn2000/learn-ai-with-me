import type { Course } from '../types';
import { csc14003 } from './csc14003';

// Thêm khóa mới: tạo folder src/content/courses/<slug>/ export một Course, rồi thêm vào đây.
export const courses: Course[] = [csc14003];

export function getCourse(slug: string | undefined): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

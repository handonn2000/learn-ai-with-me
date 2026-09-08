import type { ComponentType, LazyExoticComponent } from 'react';

export interface MaterialLink {
  label: string;
  href: string; // đường dẫn dưới /materials hoặc URL ngoài
}
export interface Session {
  id: string;
  week: number;
  part: number; // index vào Course.parts
  title: string; // "Buổi N · Tên"
  en: string;
  hours: string;
  topics: string;
  math: string;
  labChip?: string;
  links: MaterialLink[];
  lessonPath?: string; // route bài học tương tác nếu đã dựng
  outcome?: string;
  practice?: string; // proposed evidence, not an implemented lab
  prerequisiteIds?: string[];
}
export interface Part {
  id: string; // khóa ổn định để lưu tiến độ & không đổi khi sắp xếp lại phần
  no: string;
  title: string;
  en: string;
  range: string;
  color: string; // CSS color token
  testDesc: string;
}
export interface Course {
  topicLabels?: Record<string, string>;
  slug: string;
  code: string;
  title: string;
  titleAccent: string; // phần tô màu trong tiêu đề
  subtitle: string;
  description: string; // giới thiệu ngắn về khóa, hiện ở trang Khóa học + đầu lộ trình
  org: string;
  weeks: number;
  roadmapOnly?: boolean;
  hasPartTests?: boolean;
  baseline?: {
    audience: string;
    prerequisites: string[];
    outcomes: string[];
    pace: string;
    scope: string;
    tools: string;
    completion: string;
  };
  parts: Part[];
  sessions: Session[];
  Component?: LazyExoticComponent<ComponentType>;
}

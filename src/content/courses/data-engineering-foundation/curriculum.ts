import type { Course } from '../../types';
import { STRUCTURE } from './structure';
import { VI } from './curriculum.vi';
import { EN } from './curriculum.en';

// Source evidence: docs/courses/data-engineering-foundation/source-analysis.md.
export function curriculum(locale: 'vi' | 'en'): Pick<Course, 'parts' | 'sessions'> {
  const text: typeof VI = locale === 'en' ? EN : VI;
  return {
    parts: STRUCTURE.parts.map((p) => ({ ...p, ...text.parts[p.id] })),
    sessions: STRUCTURE.sessions.map((s) => ({ ...s, prerequisiteIds: [...s.prerequisiteIds], links: [], ...(s.id === 'b7' ? { lessonPath: '/courses/data-engineering-foundation/lessons/b7' } : {}), ...text.sessions[s.id] })),
  };
}

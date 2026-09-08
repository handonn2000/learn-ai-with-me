import { useCallback, useEffect, useState } from 'react';
import { loadProgress, saveProgress, type ProgressDB } from './storage';

// Hook đọc/ghi tiến độ học; tự nạp lại khi quay lại tab (đồng bộ giữa các trang).
export function useProgress(courseSlug = 'csc14003') {
  const [state, setState] = useState<{ courseSlug: string; db: ProgressDB }>(() => ({ courseSlug, db: loadProgress(undefined, courseSlug) }));
  // Never display the previous course's progress during a route change.
  const db = state.courseSlug === courseSlug ? state.db : loadProgress(undefined, courseSlug);
  useEffect(() => {
    const refresh = () => setState({ courseSlug, db: loadProgress(undefined, courseSlug) });
    refresh();
    const onVis = () => { if (!document.hidden) refresh(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [courseSlug]);
  const update = useCallback((mutate: (db: ProgressDB) => void) => {
    const next = loadProgress(undefined, courseSlug); // đọc bản mới nhất rồi mới sửa
    mutate(next);
    saveProgress(next, undefined, courseSlug);
    setState({ courseSlug, db: next });
  }, [courseSlug]);
  return { db, update };
}

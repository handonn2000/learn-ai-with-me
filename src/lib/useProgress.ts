import { useCallback, useEffect, useState } from 'react';
import { loadProgress, saveProgress, type ProgressDB } from './storage';

// Hook đọc/ghi tiến độ học; tự nạp lại khi quay lại tab (đồng bộ giữa các trang).
export function useProgress() {
  const [db, setDb] = useState<ProgressDB>(() => loadProgress());
  useEffect(() => {
    const refresh = () => setDb(loadProgress());
    const onVis = () => { if (!document.hidden) refresh(); };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  const update = useCallback((mutate: (db: ProgressDB) => void) => {
    const next = loadProgress(); // đọc bản mới nhất rồi mới sửa (tránh ghi đè tab khác)
    mutate(next);
    saveProgress(next);
    setDb(next);
  }, []);
  return { db, update };
}

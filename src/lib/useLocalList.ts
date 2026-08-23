import { useCallback, useState } from 'react';
import { localStorageStore } from './storage';

// Danh sách số (index đã tick) lưu localStorage — dùng cho các ô tự kiểm cuối bài.
export function useLocalList(key: string): [number[], (i: number) => void] {
  const [list, setList] = useState<number[]>(() => localStorageStore.get<number[]>(key, []));
  const toggle = useCallback(
    (i: number) => {
      setList((prev) => {
        const next = prev.includes(i) ? prev.filter((v) => v !== i) : [...prev, i];
        localStorageStore.set(key, next);
        return next;
      });
    },
    [key],
  );
  return [list, toggle];
}

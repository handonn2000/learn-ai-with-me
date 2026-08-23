// Tầng lưu trữ: interface + adapter localStorage.
// Đổi backend (IndexedDB, SQLite WASM, API…) chỉ cần viết adapter mới — xem ADR-0004.

export interface ProgressDB {
  sessions: Record<string, SessionRecord>;
  partTests?: Record<string, PartTestRecord>; // khóa = Part.id
}
export interface SessionRecord {
  status?: 'todo' | 'doing' | 'done';
  completedAt?: string;
  reviewsDone?: number[];
  quizScore?: number;
  quizRight?: string[];
  quizWrong?: string[];
}
export interface PartTestRecord {
  score: number;
  correct: number;
  total: number;
  right: string[];
  wrong: string[];
  at: string;
}

export interface KeyValueStore {
  get<T>(key: string, fallback: T): T;
  set<T>(key: string, value: T): void;
}

export const localStorageStore: KeyValueStore = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage đầy hoặc bị chặn — bỏ qua */
    }
  },
};

// Key giữ nguyên như bản thiết kế HTML để không mất tiến độ cũ của người học.
export const PROGRESS_KEY = 'csc14003-progress';
export const EMPTY_DB: ProgressDB = { sessions: {} };

// Bản cũ lưu partTests theo CHỈ SỐ phần (1,2,3) khi khóa còn 3 phần. Từ khi tách Tuần 1–2
// thành phần riêng, chỉ số không còn ổn định → chuyển sang Part.id. Phần I mới bắt đầu trống.
const LEGACY_PART_IDS: Record<string, string> = { '1': 'searching', '2': 'knowledge', '3': 'ml' };

function migrate(db: ProgressDB): ProgressDB {
  if (!db.partTests) return db;
  const next: Record<string, PartTestRecord> = {};
  for (const [key, rec] of Object.entries(db.partTests)) next[LEGACY_PART_IDS[key] || key] = rec;
  db.partTests = next;
  return db;
}

export function loadProgress(store: KeyValueStore = localStorageStore): ProgressDB {
  const db = store.get<ProgressDB>(PROGRESS_KEY, EMPTY_DB);
  return db && typeof db === 'object' && db.sessions ? migrate(db) : { sessions: {} };
}
export function saveProgress(db: ProgressDB, store: KeyValueStore = localStorageStore): void {
  store.set(PROGRESS_KEY, db);
}

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

// Bản cũ ghi thẳng NHÃN TIẾNG VIỆT của chủ đề vào tiến độ. Từ khi có bản tiếng Anh, nhãn không
// còn ổn định nên dữ liệu chuyển sang ID (ADR-0011) — nhãn chỉ sinh lúc render.
//
// Bảng này phải khớp TOPIC_IDS trong content/courses/csc14003/topics.ts; lib/ không import
// content/ (đảo tầng), nên `check_i18n.py` canh giúp mọi giá trị ở đây trỏ tới một id có thật.
const LEGACY_TOPICS: Record<string, string> = {
  'Bốn hướng tiếp cận': 'four-approaches',
  'Phép thử Turing': 'turing-test',
  'Nền tảng': 'foundations',
  'Lịch sử': 'history',
  'Agent duy lý': 'rational-agent',
  'Ứng dụng & giới hạn': 'applications-limits',
  'Hàm agent': 'agent-function',
  'Thước đo hiệu năng': 'perf-measure',
  'Duy lý ≠ toàn tri': 'rational-not-omniscient',
  PEAS: 'peas',
  'Bảy chiều môi trường': 'env-dimensions',
  'Bảng tra': 'lookup-table',
  'Năm kiến trúc': 'five-architectures',
  'Phát biểu bài toán': 'problem-statement',
  'Khung tìm kiếm': 'search-framework',
  'Tìm kiếm mù': 'uninformed',
  Heuristic: 'heuristic',
  'Admissible & consistent': 'admissible-consistent',
  'A*': 'astar',
  'Buổi 1': 'b1', 'Buổi 2': 'b2', 'Buổi 3': 'b3', 'Buổi 4': 'b4', 'Buổi 5': 'b5', 'Buổi 6': 'b6',
  'Buổi 7': 'b7', 'Buổi 8': 'b8', 'Buổi 9': 'b9', 'Buổi 10': 'b10', 'Buổi 11': 'b11',
};

// Chuỗi lạ ĐI QUA NGUYÊN VẸN, không bị bỏ: người học không mất một điểm dữ liệu nào vì ta quên
// một ánh xạ. Không id nào là key của bảng nên chạy lại là no-op — an toàn để gọi mỗi lần nạp.
const mapTopics = (a?: string[]): string[] | undefined => a?.map((t) => LEGACY_TOPICS[t] ?? t);

function migrate(db: ProgressDB): ProgressDB {
  // Một chiều, không có bản đảo — cùng tinh thần với LEGACY_PART_IDS.
  if (db.partTests) {
    const next: Record<string, PartTestRecord> = {};
    for (const [key, rec] of Object.entries(db.partTests)) next[LEGACY_PART_IDS[key] || key] = rec;
    db.partTests = next;
  }
  // Nhánh này phải nằm NGOÀI nhánh partTests: người học chỉ mới làm quiz cuối buổi, chưa làm
  // kiểm tra tổng hợp, thì vẫn cần đổi chủ đề sang id.
  for (const rec of Object.values(db.sessions)) {
    rec.quizRight = mapTopics(rec.quizRight);
    rec.quizWrong = mapTopics(rec.quizWrong);
  }
  for (const rec of Object.values(db.partTests ?? {})) {
    rec.right = mapTopics(rec.right) ?? rec.right;
    rec.wrong = mapTopics(rec.wrong) ?? rec.wrong;
  }
  return db;
}

export function progressKey(courseSlug = 'csc14003'): string {
  return courseSlug === 'csc14003' ? PROGRESS_KEY : `${courseSlug}-progress`;
}
export function loadProgress(store: KeyValueStore = localStorageStore, courseSlug = 'csc14003'): ProgressDB {
  // A fresh fallback prevents two empty courses from sharing a mutable sessions object.
  const db = store.get<ProgressDB>(progressKey(courseSlug), { sessions: {} });
  if (!db || typeof db !== 'object' || !db.sessions) return { sessions: {} };
  return courseSlug === 'csc14003' ? migrate(db) : db;
}
export function saveProgress(db: ProgressDB, store: KeyValueStore = localStorageStore, courseSlug = 'csc14003'): void {
  store.set(progressKey(courseSlug), db);
}

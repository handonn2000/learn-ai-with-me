import { LOCALE, type Locale } from '@/lib/locale';

/*
 * Chủ đề chấm điểm — ID ỔN ĐỊNH, không phải chuỗi hiển thị. Xem ADR-0011.
 *
 * Trước đây quiz ghi thẳng NHÃN TIẾNG VIỆT vào ProgressDB (`quizRight` / `quizWrong` và
 * `partTests[].right/wrong`), rồi trang Lộ trình join lại để dựng báo cáo mạnh/yếu. Thêm bản
 * tiếng Anh vào là tiến độ của người học TÁCH ĐÔI theo ngôn ngữ: làm quiz bản Việt xong đổi
 * sang bản Anh thì báo cáo hiện hai bộ từ vựng rời nhau, không cái nào cộng vào cái nào.
 *
 * Nên dữ liệu lưu ID, còn chữ chỉ sinh ra lúc render. `Record<TopicId, string>` cho tính đầy
 * đủ MIỄN PHÍ: thiếu một nhãn ở locale nào là lỗi `tsc`, không phải lỗi phát hiện bằng mắt.
 */

export const TOPIC_IDS = [
  // Buổi 1
  'four-approaches', 'turing-test', 'foundations', 'history', 'rational-agent', 'applications-limits',
  // Buổi 2
  'agent-function', 'perf-measure', 'rational-not-omniscient', 'peas', 'env-dimensions',
  'lookup-table', 'five-architectures',
  // Buổi 3
  'problem-statement', 'search-framework', 'uninformed', 'heuristic', 'admissible-consistent', 'astar',
  // Kiểm tra tổng hợp chấm theo BUỔI — dùng luôn Session.id để báo cáo link thẳng về buổi được.
  'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11',
] as const;

export type TopicId = (typeof TOPIC_IDS)[number];

export const TOPIC_LABELS: Record<Locale, Record<TopicId, string>> = {
  vi: {
    'four-approaches': 'Bốn hướng tiếp cận',
    'turing-test': 'Phép thử Turing',
    foundations: 'Nền tảng',
    history: 'Lịch sử',
    'rational-agent': 'Agent duy lý',
    'applications-limits': 'Ứng dụng & giới hạn',
    'agent-function': 'Hàm agent',
    'perf-measure': 'Thước đo hiệu năng',
    'rational-not-omniscient': 'Duy lý ≠ toàn tri',
    peas: 'PEAS',
    'env-dimensions': 'Bảy chiều môi trường',
    'lookup-table': 'Bảng tra',
    'five-architectures': 'Năm kiến trúc',
    'problem-statement': 'Phát biểu bài toán',
    'search-framework': 'Khung tìm kiếm',
    uninformed: 'Tìm kiếm mù',
    heuristic: 'Heuristic',
    'admissible-consistent': 'Admissible & consistent',
    astar: 'A*',
    b1: 'Buổi 1', b2: 'Buổi 2', b3: 'Buổi 3', b4: 'Buổi 4', b5: 'Buổi 5', b6: 'Buổi 6',
    b7: 'Buổi 7', b8: 'Buổi 8', b9: 'Buổi 9', b10: 'Buổi 10', b11: 'Buổi 11',
  },
  en: {
    'four-approaches': 'Four approaches',
    'turing-test': 'The Turing test',
    foundations: 'Foundations',
    history: 'History',
    'rational-agent': 'Rational agent',
    'applications-limits': 'Applications & limits',
    'agent-function': 'Agent function',
    'perf-measure': 'Performance measure',
    'rational-not-omniscient': 'Rational ≠ omniscient',
    peas: 'PEAS',
    'env-dimensions': 'Seven environment dimensions',
    'lookup-table': 'Lookup table',
    'five-architectures': 'Five architectures',
    'problem-statement': 'Problem formulation',
    'search-framework': 'Search framework',
    uninformed: 'Uninformed search',
    heuristic: 'Heuristic',
    'admissible-consistent': 'Admissible & consistent',
    astar: 'A*',
    b1: 'Session 1', b2: 'Session 2', b3: 'Session 3', b4: 'Session 4', b5: 'Session 5',
    b6: 'Session 6', b7: 'Session 7', b8: 'Session 8', b9: 'Session 9', b10: 'Session 10',
    b11: 'Session 11',
  },
};

/**
 * Nhãn hiển thị của một chủ đề. Nhận `string` chứ không phải `TopicId` vì dữ liệu đọc lên từ
 * localStorage của người học có thể chứa chuỗi cũ chưa kịp di trú — lúc đó trả lại chính nó,
 * tức là hiện nhãn tiếng Việt cũ, chứ KHÔNG để chủ đề biến mất khỏi báo cáo.
 */
export function topicLabel(id: string): string {
  return TOPIC_LABELS[LOCALE][id as TopicId] ?? id;
}

import type { Algo, GraphProblem } from '@/algorithms/search'

/** Phần chung của mọi bài tập / câu kiểm tra. Chuỗi có thể chứa HTML inline (<b>, <i>, <code>). */
interface Base {
  id: string
  /** Câu hỏi / yêu cầu — 1–2 câu. */
  prompt: string
  /** Gợi ý: đưa người học đi được khoảng nửa đường. */
  hint: string
  /** Giải thích lời giải, hiện khi xem đáp án hoặc sau khi trả lời. */
  explain: string
}

export interface ChoiceEx extends Base {
  kind: 'choice'
  options: string[]
  /** Chỉ số đáp án đúng; nhiều phần tử = chọn nhiều. */
  answer: number[]
}

export interface NumberEx extends Base {
  kind: 'number'
  answer: number
  unit?: string
  /** Hiện kèm bản đồ để tính. */
  problem?: GraphProblem
  showCosts?: boolean
  showH?: boolean
}

/** Chọn một tập nút trên bản đồ. */
export interface PickNodesEx extends Base {
  kind: 'pick-nodes'
  problem: GraphProblem
  answer: string[]
  showCosts?: boolean
  showH?: boolean
  /** Tô sẵn để làm bối cảnh. */
  highlight?: { explored?: string[]; frontier?: string[]; current?: string }
}

/** Xếp thứ tự: bấm lần lượt các mục. */
export interface OrderEx extends Base {
  kind: 'order'
  items: string[]
  answer: string[]
  problem?: GraphProblem
  showCosts?: boolean
}

/** Gán mỗi mục vào một nhóm. Mục có `groups` riêng thì chọn trong đó (vd. mỗi chiều môi trường có hai vế riêng). */
export interface ClassifyEx extends Base {
  kind: 'classify'
  groups: string[]
  items: { text: string; group: number; groups?: string[] }[]
}

/** Đóng vai thuật toán: bấm nút sẽ được mở rộng tiếp theo, `steps` lần. */
export interface TraceEx extends Base {
  kind: 'trace'
  problem: GraphProblem
  algo: Algo
  /** Số lần mở rộng người học phải đoán (tính từ bước bắt đầu). */
  steps: number
  /** Bắt đầu đoán từ lần mở rộng thứ mấy (0 = nút gốc). Các bước trước được chạy sẵn. */
  from?: number
  showCosts?: boolean
  showH?: boolean
  /** Frontier hiển thị gì: khóa đã tính sẵn, các thành phần (g và h) để tự cộng, hay chỉ tên nút. */
  values?: 'key' | 'parts' | 'none'
}

export type Exercise = ChoiceEx | NumberEx | PickNodesEx | OrderEx | ClassifyEx | TraceEx

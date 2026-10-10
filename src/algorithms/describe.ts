import type { Algo, FrontierItem, Generated, TraceStep } from './search'

/** Tên khóa sắp xếp, theo thuật toán. */
export function keyName(algo: Algo): string {
  return algo === 'ucs' ? 'g' : algo === 'gbfs' ? 'h' : algo === 'astar' ? 'f' : ''
}

/** Mô tả giá trị của một nút trong frontier, ví dụ "f = 6 + 4 = 10". */
export function itemValue(algo: Algo, it: { g: number; h: number; key: number }): string {
  switch (algo) {
    case 'bfs':
      return ''
    case 'ucs':
      return `g = ${it.g}`
    case 'gbfs':
      return `h = ${it.h}`
    case 'astar':
      return `f = ${it.g} + ${it.h} = ${it.key}`
  }
}

export function shortValue(algo: Algo, it: { g: number; h: number; key: number }): string {
  return algo === 'bfs' ? '' : String(algo === 'ucs' ? it.g : algo === 'gbfs' ? it.h : it.key)
}

function genText(algo: Algo, g: Generated): string {
  const v = itemValue(algo, g)
  const val = v ? ` (${v})` : ''
  switch (g.outcome) {
    case 'added':
      return `${g.state}${val} vào frontier`
    case 'replaced':
      return `${g.state}${val}: đường mới rẻ hơn, thay đường cũ`
    case 'in-explored':
      return `${g.state} đã mở rộng rồi, bỏ qua`
    case 'in-frontier':
      return algo === 'bfs' ? `${g.state} đã có trong frontier, bỏ qua` : `${g.state}${val}: không rẻ hơn đường đang có, bỏ qua`
    case 'goal':
      return `${g.state} là đích — BFS dừng ngay khi sinh ra đích`
  }
}

/** Câu thuật lại một bước của trace — tiếng Việt thường, không thuật ngữ thừa. */
export function describeStep(algo: Algo, step: TraceStep, prevFrontier: FrontierItem[] | null): string {
  if (step.expanded === null && !step.done) return `Bắt đầu: frontier chỉ có ${step.frontier[0]?.state}.`
  if (step.done && !step.done.found) return 'Frontier rỗng: không có đường tới đích.'
  const picked = prevFrontier?.find((x) => x.state === step.expanded)
  let why = ''
  if (algo === 'bfs') why = 'vào frontier sớm nhất'
  else if (picked) {
    const k = keyName(algo)
    why = `${k} = ${shortValue(algo, picked)} nhỏ nhất`
    const ties = prevFrontier!.filter((x) => x.key === picked.key && x.state !== picked.state).map((x) => x.state)
    if (ties.length) why += `, hòa với ${ties.join(', ')} nhưng đứng trước theo bảng chữ cái`
  }
  const head = why ? `Lấy ${step.expanded} ra vì ${why}.` : `Lấy ${step.expanded} ra.`
  if (step.done?.found && step.generated.length === 0) {
    return `${head} ${step.expanded} là đích nên dừng. Đường đi: ${step.done.path.join(' → ')}, chi phí ${step.done.cost}.`
  }
  const parts = step.generated.map((g) => genText(algo, g))
  let s = `${head} Mở rộng: ${parts.join('; ')}.`
  if (step.done?.found) s += ` Đường đi: ${step.done.path.join(' → ')}, chi phí ${step.done.cost}.`
  return s
}

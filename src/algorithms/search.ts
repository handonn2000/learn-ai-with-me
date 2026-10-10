/**
 * Engine tìm kiếm thuần: nhận một bài toán đồ thị, trả về TRACE từng bước.
 * Theo đúng phiên bản graph-search trong slide CSC14003 (AIMA):
 *  - BFS: frontier FIFO, kiểm tra đích khi SINH nút.
 *  - UCS / GBFS / A*: frontier là hàng đợi ưu tiên, kiểm tra đích khi LẤY RA;
 *    gặp lại một trạng thái đang ở frontier với khóa tốt hơn thì thay thế.
 * Hòa khóa → tên trạng thái theo thứ tự chữ cái đứng trước được lấy ra trước.
 */

export type Algo = 'bfs' | 'ucs' | 'gbfs' | 'astar'

export interface GraphProblem {
  id: string
  nodes: { id: string; x: number; y: number; label?: string }[]
  /** Cạnh vô hướng; cost ≥ 0. */
  edges: { a: string; b: string; cost: number }[]
  start: string
  goal: string
  /** Heuristic h(n) — ước lượng chi phí còn lại tới đích. */
  h?: Record<string, number>
}

export interface FrontierItem {
  state: string
  g: number
  h: number
  /** Khóa sắp xếp của thuật toán: BFS = thứ tự vào, UCS = g, GBFS = h, A* = g + h. */
  key: number
  parent: string | null
}

export type GenOutcome =
  | 'added' // vào frontier
  | 'replaced' // thay nút cùng trạng thái đang ở frontier vì rẻ hơn
  | 'in-explored' // bỏ: đã mở rộng rồi
  | 'in-frontier' // bỏ: đã có trong frontier, không tốt hơn
  | 'goal' // BFS: gặp đích lúc sinh

export interface Generated {
  state: string
  g: number
  h: number
  key: number
  outcome: GenOutcome
}

export interface TraceStep {
  /** Nút vừa được lấy ra khỏi frontier và mở rộng (null ở bước khởi tạo). */
  expanded: string | null
  generated: Generated[]
  /** Frontier SAU bước này, xếp theo thứ tự sẽ được lấy ra. */
  frontier: FrontierItem[]
  explored: string[]
  done: null | { found: true; path: string[]; cost: number } | { found: false }
}

export function neighbors(p: GraphProblem, s: string): { state: string; cost: number }[] {
  const out: { state: string; cost: number }[] = []
  for (const e of p.edges) {
    if (e.a === s) out.push({ state: e.b, cost: e.cost })
    else if (e.b === s) out.push({ state: e.a, cost: e.cost })
  }
  return out.sort((x, y) => x.state.localeCompare(y.state))
}

export function edgeCost(p: GraphProblem, a: string, b: string): number | undefined {
  return p.edges.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))?.cost
}

export function pathCost(p: GraphProblem, path: string[]): number {
  let c = 0
  for (let i = 1; i < path.length; i++) {
    const w = edgeCost(p, path[i - 1], path[i])
    if (w === undefined) throw new Error(`Không có cạnh ${path[i - 1]}–${path[i]}`)
    c += w
  }
  return c
}

function keyOf(algo: Algo, g: number, h: number, order: number): number {
  switch (algo) {
    case 'bfs':
      return order
    case 'ucs':
      return g
    case 'gbfs':
      return h
    case 'astar':
      return g + h
  }
}

function sortFrontier(algo: Algo, f: FrontierItem[]): FrontierItem[] {
  if (algo === 'bfs') return f // FIFO: giữ nguyên thứ tự vào
  return [...f].sort((x, y) => x.key - y.key || x.state.localeCompare(y.state))
}

function buildPath(parents: Map<string, string | null>, end: string): string[] {
  const path = [end]
  let cur = parents.get(end) ?? null
  while (cur !== null) {
    path.unshift(cur)
    cur = parents.get(cur) ?? null
  }
  return path
}

export function runSearch(p: GraphProblem, algo: Algo, maxSteps = 200): TraceStep[] {
  const H = (s: string) => p.h?.[s] ?? 0
  const parents = new Map<string, string | null>([[p.start, null]])
  const gOf = new Map<string, number>([[p.start, 0]])
  let order = 0
  let frontier: FrontierItem[] = [
    { state: p.start, g: 0, h: H(p.start), key: keyOf(algo, 0, H(p.start), order++), parent: null },
  ]
  const explored: string[] = []
  const steps: TraceStep[] = []

  const snapshot = (expanded: string | null, generated: Generated[], done: TraceStep['done']) =>
    steps.push({
      expanded,
      generated,
      frontier: sortFrontier(algo, frontier).map((x) => ({ ...x })),
      explored: [...explored],
      done,
    })

  // BFS kiểm tra đích ngay cả với nút gốc
  if (algo === 'bfs' && p.start === p.goal) {
    snapshot(null, [], { found: true, path: [p.start], cost: 0 })
    return steps
  }
  snapshot(null, [], null)

  for (let i = 0; i < maxSteps; i++) {
    if (frontier.length === 0) {
      snapshot(null, [], { found: false })
      return steps
    }
    const [node] = sortFrontier(algo, frontier)
    frontier = frontier.filter((x) => x !== node)

    if (algo !== 'bfs' && node.state === p.goal) {
      snapshot(node.state, [], { found: true, path: buildPath(parents, node.state), cost: node.g })
      return steps
    }

    explored.push(node.state)
    const generated: Generated[] = []
    let goalHit: Generated | null = null

    for (const nb of neighbors(p, node.state)) {
      const g = node.g + nb.cost
      const h = H(nb.state)
      const inFrontier = frontier.find((x) => x.state === nb.state)
      const key = keyOf(algo, g, h, order)
      if (explored.includes(nb.state)) {
        generated.push({ state: nb.state, g, h, key, outcome: 'in-explored' })
      } else if (inFrontier) {
        if (algo !== 'bfs' && key < inFrontier.key) {
          inFrontier.g = g
          inFrontier.key = key
          inFrontier.parent = node.state
          parents.set(nb.state, node.state)
          gOf.set(nb.state, g)
          generated.push({ state: nb.state, g, h, key, outcome: 'replaced' })
        } else {
          generated.push({ state: nb.state, g, h, key, outcome: 'in-frontier' })
        }
      } else {
        parents.set(nb.state, node.state)
        gOf.set(nb.state, g)
        if (algo === 'bfs' && nb.state === p.goal) {
          goalHit = { state: nb.state, g, h, key, outcome: 'goal' }
          generated.push(goalHit)
          break
        }
        frontier.push({ state: nb.state, g, h, key, parent: node.state })
        order++
        generated.push({ state: nb.state, g, h, key, outcome: 'added' })
      }
    }

    if (goalHit) {
      snapshot(node.state, generated, {
        found: true,
        path: buildPath(parents, goalHit.state),
        cost: goalHit.g,
      })
      return steps
    }
    snapshot(node.state, generated, null)
  }
  throw new Error('Quá số bước cho phép')
}

/** Thứ tự các trạng thái được mở rộng (kể cả đích được lấy ra ở UCS/GBFS/A*). */
export function expansionOrder(steps: TraceStep[]): string[] {
  return steps.map((s) => s.expanded).filter((x): x is string => x !== null)
}

export function result(steps: TraceStep[]) {
  const last = steps[steps.length - 1]
  if (!last.done) throw new Error('Trace chưa kết thúc')
  return last.done
}

/** Chi phí thật rẻ nhất h*(n) từ mỗi đỉnh tới đích (Dijkstra ngược). */
export function trueCostToGoal(p: GraphProblem): Record<string, number> {
  const dist: Record<string, number> = Object.fromEntries(p.nodes.map((n) => [n.id, Infinity]))
  dist[p.goal] = 0
  const todo = new Set(p.nodes.map((n) => n.id))
  while (todo.size) {
    let u = ''
    let best = Infinity
    for (const s of todo) if (dist[s] < best) ((best = dist[s]), (u = s))
    if (!u) break
    todo.delete(u)
    for (const nb of neighbors(p, u)) dist[nb.state] = Math.min(dist[nb.state], dist[u] + nb.cost)
  }
  return dist
}

export function isAdmissible(p: GraphProblem): boolean {
  const hs = trueCostToGoal(p)
  return p.nodes.every((n) => (p.h?.[n.id] ?? 0) <= hs[n.id])
}

export function isConsistent(p: GraphProblem): boolean {
  const H = (s: string) => p.h?.[s] ?? 0
  return p.edges.every((e) => H(e.a) <= e.cost + H(e.b) && H(e.b) <= e.cost + H(e.a))
}

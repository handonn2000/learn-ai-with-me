/**
 * Toạ độ bản đồ mục tiêu (lấy từ docs/design/sketch-maps/goalmap.js và goalphone.js).
 * Ga lấy từ `skills.ts`; ở đây chỉ có vị trí, nhãn và đường mòn. Cạnh nên khớp `prereqs`.
 */
export type Pt = [number, number]
export interface LabelAt {
  x: number
  y: number
  w: number
  align?: 'right' | 'center'
}
export interface MapNode {
  p: Pt
  d?: number
  label?: LabelAt
}
export interface MapEdge {
  from: string
  to: string
  via: Pt[]
}
export interface GoalMapLayout {
  width: number
  height: number
  d: number
  nodes: Record<string, MapNode>
  /** Ga ở đích: lá cờ. */
  flag: Pt
  /** Ga phụ thuộc mục tiêu khác (nét đứt). */
  side: { id: string; p: Pt; d: number; from: string; via: Pt[] }
  edges: MapEdge[]
}

const desktop: GoalMapLayout = {
  width: 780,
  height: 980,
  d: 58,
  flag: [390, 96],
  side: { id: 'gbfs', p: [690, 335], d: 46, from: 'heuristic', via: [[668, 412]] },
  nodes: {
    formulate: { p: [390, 915], label: { x: 430, y: 898, w: 200 } },
    'state-graph': { p: [390, 815], label: { x: 430, y: 818, w: 200 } },
    frontier: { p: [185, 745], label: { x: 150, y: 722, w: 130, align: 'right' } },
    'graph-search': { p: [135, 605], label: { x: 176, y: 580, w: 140 } },
    'priority-queue': { p: [390, 605], label: { x: 430, y: 582, w: 160 } },
    ucs: { p: [235, 445], d: 62, label: { x: 196, y: 400, w: 130, align: 'right' } },
    heuristic: { p: [615, 470], label: { x: 576, y: 450, w: 150, align: 'right' } },
    astar: { p: [390, 305], label: { x: 430, y: 266, w: 180 } },
    admissible: { p: [390, 175], label: { x: 430, y: 156, w: 220 } },
  },
  edges: [
    { from: 'formulate', to: 'state-graph', via: [[394, 866]] },
    { from: 'state-graph', to: 'frontier', via: [[300, 806], [228, 782]] },
    { from: 'frontier', to: 'graph-search', via: [[150, 686]] },
    { from: 'graph-search', to: 'ucs', via: [[158, 522]] },
    { from: 'priority-queue', to: 'ucs', via: [[328, 522]] },
    { from: 'state-graph', to: 'heuristic', via: [[470, 756], [592, 646]] },
    { from: 'ucs', to: 'astar', via: [[246, 372], [318, 318]] },
    { from: 'heuristic', to: 'astar', via: [[592, 390], [482, 336]] },
    { from: 'astar', to: 'admissible', via: [[394, 240]] },
  ],
}

const phone: GoalMapLayout = {
  width: 390,
  height: 800,
  d: 50,
  flag: [195, 70],
  side: { id: 'gbfs', p: [356, 262], d: 36, from: 'heuristic', via: [[338, 300]] },
  nodes: {
    formulate: { p: [195, 740], label: { x: 232, y: 722, w: 140 } },
    'state-graph': { p: [195, 640], label: { x: 232, y: 622, w: 140 } },
    frontier: { p: [110, 570], label: { x: 146, y: 552, w: 140 } },
    'graph-search': { p: [62, 452], label: { x: 96, y: 440, w: 100 } },
    'priority-queue': { p: [228, 462], label: { x: 262, y: 446, w: 86 } },
    ucs: { p: [100, 330], d: 54 },
    heuristic: { p: [300, 350], label: { x: 268, y: 330, w: 110, align: 'right' } },
    astar: { p: [195, 222], label: { x: 232, y: 206, w: 110 } },
    admissible: { p: [195, 122], label: { x: 232, y: 106, w: 140 } },
  },
  edges: [
    { from: 'formulate', to: 'state-graph', via: [[196, 690]] },
    { from: 'state-graph', to: 'frontier', via: [[150, 610]] },
    { from: 'frontier', to: 'graph-search', via: [[72, 520]] },
    { from: 'graph-search', to: 'ucs', via: [[70, 390]] },
    { from: 'priority-queue', to: 'ucs', via: [[178, 392]] },
    { from: 'state-graph', to: 'heuristic', via: [[320, 600], [362, 470], [340, 400]] },
    { from: 'ucs', to: 'astar', via: [[112, 268], [160, 230]] },
    { from: 'heuristic', to: 'astar', via: [[282, 280], [232, 236]] },
    { from: 'astar', to: 'admissible', via: [] },
  ],
}

/** Bản đồ theo mã mục tiêu. Mục tiêu chưa có toạ độ thì chỉ có Danh sách. */
export const goalMaps: Record<string, { desktop: GoalMapLayout; phone: GoalMapLayout }> = {
  astar: { desktop, phone },
}

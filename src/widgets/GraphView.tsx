import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { GraphProblem } from '@/algorithms/search'

export type NodeState = 'idle' | 'frontier' | 'current' | 'explored' | 'path' | 'selected' | 'wrong'

const UNIT = 66
const PAD = 46

interface Props {
  problem: GraphProblem
  showCosts?: boolean
  showH?: boolean
  states?: Record<string, NodeState>
  /** Cạnh được tô như một tuyến (đường đi đang xét). */
  path?: string[]
  /** Chú thích nhỏ dưới mỗi nút, ví dụ "g = 6". */
  notes?: Record<string, string>
  onNodeClick?: (id: string) => void
  /** Chỉ cho bấm các nút này (mặc định: tất cả nếu có onNodeClick). */
  clickable?: string[]
  label?: string
}

const fill: Record<NodeState, string> = {
  idle: 'var(--surface)',
  frontier: 'var(--signal-soft)',
  current: 'var(--signal)',
  explored: 'var(--route-soft)',
  path: 'var(--route)',
  selected: 'var(--ink)',
  wrong: 'var(--stop-soft)',
}
const stroke: Record<NodeState, string> = {
  idle: 'var(--ink)',
  frontier: 'var(--signal)',
  current: 'var(--signal)',
  explored: 'var(--route)',
  path: 'var(--route)',
  selected: 'var(--ink)',
  wrong: 'var(--stop)',
}
const text: Record<NodeState, string> = {
  idle: 'var(--ink)',
  frontier: 'var(--ink)',
  current: '#1b1500',
  explored: 'var(--ink)',
  path: 'var(--surface)',
  selected: 'var(--surface)',
  wrong: 'var(--stop)',
}

/**
 * Trên màn hẹp, SVG bị thu nhỏ theo bề rộng nên nút và chữ thành li ti.
 * k phóng to nút/chữ (trong hệ tọa độ SVG) sao cho trên màn hình bán kính nút ≥ ~14px.
 */
function useScale(baseWidth: number) {
  const ref = useRef<SVGSVGElement>(null)
  const [k, setK] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const shown = e.contentRect.width
      if (shown > 0) setK(Math.min(2.4, Math.max(1, (14 * baseWidth) / (19 * shown))))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [baseWidth])
  return { ref, k }
}

export function GraphView({ problem, showCosts, showH, states = {}, path = [], notes = {}, onNodeClick, clickable, label }: Props) {
  const xs = problem.nodes.map((n) => n.x)
  const ys = problem.nodes.map((n) => n.y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const baseW = (Math.max(...xs) - minX) * UNIT + PAD * 2
  const { ref, k } = useScale(baseW)
  const pad = PAD * k
  const w = (Math.max(...xs) - minX) * UNIT + pad * 2
  const h = (Math.max(...ys) - minY) * UNIT + pad * 2 + 12 * k
  const pos = (id: string) => {
    const n = problem.nodes.find((x) => x.id === id)!
    return { x: (n.x - minX) * UNIT + pad, y: (n.y - minY) * UNIT + pad }
  }
  const onPath = (a: string, b: string) =>
    path.some((p, i) => i > 0 && ((path[i - 1] === a && p === b) || (path[i - 1] === b && p === a)))
  const canClick = (id: string) => !!onNodeClick && (!clickable || clickable.includes(id))

  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full max-h-[340px]" role="group" aria-label={label ?? 'Bản đồ'}>
      {problem.edges.map((e) => {
        const a = pos(e.a)
        const b = pos(e.b)
        const lit = onPath(e.a, e.b)
        return (
          <motion.line
            key={`${e.a}-${e.b}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            initial={false}
            animate={{ stroke: lit ? 'var(--route)' : 'var(--line)', strokeWidth: (lit ? 7 : 3) * k }}
            strokeLinecap="round"
          />
        )
      })}
      {showCosts &&
        problem.edges.map((e) => {
          const a = pos(e.a)
          const b = pos(e.b)
          const mx = (a.x + b.x) / 2
          const my = (a.y + b.y) / 2
          return (
            <g key={`c-${e.a}-${e.b}`} aria-hidden>
              <rect x={mx - 12 * k} y={my - 11 * k} width={24 * k} height={22 * k} rx={6 * k} fill="var(--surface)" stroke="var(--line)" />
              <text x={mx} y={my + 5 * k} textAnchor="middle" className="font-mono" fontSize={13 * k} fill="var(--muted)">
                {e.cost}
              </text>
            </g>
          )
        })}
      {problem.nodes.map((n) => {
        const p = pos(n.id)
        const st = states[n.id] ?? 'idle'
        const click = canClick(n.id)
        const hv = problem.h?.[n.id]
        const sub = [n.label, notes[n.id]].filter(Boolean)
        return (
          <g
            key={n.id}
            role={click ? 'button' : undefined}
            tabIndex={click ? 0 : undefined}
            aria-label={click ? `Nút ${n.id}${n.label ? ` (${n.label})` : ''}` : undefined}
            aria-pressed={click && st === 'selected' ? true : undefined}
            className={click ? 'cursor-pointer focus:outline-none [&:focus-visible>circle:first-of-type]:stroke-[var(--signal)]' : undefined}
            onClick={click ? () => onNodeClick!(n.id) : undefined}
            onKeyDown={
              click
                ? (ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault()
                      onNodeClick!(n.id)
                    }
                  }
                : undefined
            }
          >
            {click && <circle cx={p.x} cy={p.y} r={26 * k} fill="transparent" />}
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={19 * k}
              initial={false}
              animate={{ fill: fill[st], stroke: stroke[st], scale: st === 'current' ? 1.12 : 1 }}
              transition={{ duration: 0.25 }}
              strokeWidth={3 * k}
              style={{ transformOrigin: `${p.x}px ${p.y}px` }}
            />
            <text x={p.x} y={p.y + 6 * k} textAnchor="middle" fontWeight={700} fontSize={17 * k} fill={text[st]} pointerEvents="none">
              {n.id}
            </text>
            {showH && hv !== undefined && (
              <text x={p.x + 22 * k} y={p.y - 16 * k} className="font-mono" fontSize={12.5 * k} fill="var(--muted)" pointerEvents="none">
                h={hv}
              </text>
            )}
            {sub.length > 0 && (
              <text x={p.x} y={p.y + 36 * k} textAnchor="middle" fontSize={12.5 * k} fill="var(--muted)" pointerEvents="none">
                {sub.join(' · ')}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

const legendItems: { st: NodeState; text: string }[] = [
  { st: 'current', text: 'đang mở rộng' },
  { st: 'frontier', text: 'frontier (chờ mở rộng)' },
  { st: 'explored', text: 'đã mở rộng' },
]

export function Legend({ only }: { only?: NodeState[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
      {legendItems
        .filter((x) => !only || only.includes(x.st))
        .map((x) => (
          <li key={x.st} className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-full border-2" style={{ background: fill[x.st], borderColor: stroke[x.st] }} />
            {x.text}
          </li>
        ))}
    </ul>
  )
}

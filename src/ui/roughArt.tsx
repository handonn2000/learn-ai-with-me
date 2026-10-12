import rough from 'roughjs'
import type { Options } from 'roughjs/bin/core'
import type { ReactNode } from 'react'

/**
 * Nét vẽ tay cho bản đồ (cổng từ docs/design/sketch-maps/lib.js). Seed tăng dần từ một giá trị cố định
 * trong mỗi lần `createArt()`, nên cùng thứ tự gọi thì cùng hình: bản đồ không "rung" khi render lại.
 * Mọi thứ ở đây chỉ để trang trí (`aria-hidden`); ga và nhãn là HTML thật.
 */
const INK = '#14162b'
const VIOLET = '#4a33c9'
const SUN = '#ffc94a'
const GRAY = '#9aa1b5'
const GRAY_FILL = '#e3e6ee'

export type DiscState = 'done' | 'current' | 'open' | 'locked' | 'side'
export type TrailKind = 'done' | 'open' | 'locked' | 'side'
type Pt = [number, number]

export function createArt() {
  const gen = rough.generator()
  let seedN = 7
  const seed = () => (seedN = (seedN * 48271) % 2147483647)
  let key = 0
  const paths = (d: ReturnType<typeof gen.line>, dash?: string): ReactNode =>
    gen.toPaths(d).map((p) => (
      <path key={key++} d={p.d} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill || 'none'} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
    ))
  const o = (x: Options): Options => ({ seed: seed(), ...x })

  const trail = (pts: Pt[], kind: TrailKind): ReactNode => {
    const band = paths(gen.curve(pts, o({ stroke: '#eadfc4', strokeWidth: 15, roughness: 0.6, bowing: 0.6, disableMultiStroke: true })))
    const st = {
      done: { stroke: VIOLET, strokeWidth: 3.6, dash: undefined },
      open: { stroke: INK, strokeWidth: 2.4, dash: '9 8' },
      locked: { stroke: GRAY, strokeWidth: 2.4, dash: '3 8' },
      side: { stroke: GRAY, strokeWidth: 2, dash: '3 7' },
    }[kind]
    const line = paths(gen.curve(pts, o({ stroke: st.stroke, strokeWidth: st.strokeWidth, roughness: 1, disableMultiStroke: kind !== 'done' })), st.dash)
    return (
      <g key={key++}>
        {kind !== 'side' && band}
        {line}
      </g>
    )
  }

  const disc = (x: number, y: number, d: number, state: DiscState): ReactNode => {
    const fill = { done: VIOLET, current: SUN, open: '#ffffff', locked: GRAY_FILL, side: '#ffffff' }[state]
    const stroke = state === 'locked' || state === 'side' ? GRAY : INK
    const shadow = state === 'locked' ? '#c9cedc' : state === 'side' ? null : INK
    return (
      <g key={key++}>
        {state === 'current' && paths(gen.circle(x, y, d + 26, o({ fill: '#ffe58a', fillStyle: 'hachure', hachureGap: 4, fillWeight: 1.6, stroke: 'none', roughness: 1.2 })))}
        {shadow && paths(gen.ellipse(x, y + 6, d + 2, d - 2, o({ fill: shadow, fillStyle: 'solid', stroke: shadow, strokeWidth: 2, roughness: 0.7 })))}
        {paths(gen.circle(x, y, d, o({ fill, fillStyle: 'solid', stroke, strokeWidth: state === 'side' ? 1.8 : 2.2, roughness: 0.9 })), state === 'side' ? '4 5' : undefined)}
      </g>
    )
  }

  const tree = (x: number, y: number, d = 34): ReactNode => (
    <g key={key++}>
      {paths(gen.line(x, y + d * 0.35, x + 1, y + d * 0.35 + 12, o({ stroke: INK, strokeWidth: 1.6, roughness: 0.8 })))}
      {paths(gen.circle(x, y, d, o({ fill: '#a9cb96', fillStyle: 'hachure', hachureGap: 4, hachureAngle: -41, fillWeight: 1.3, stroke: INK, strokeWidth: 1.3, roughness: 1.5 })))}
    </g>
  )
  const grove = (list: [number, number, number][]) => list.map(([x, y, d]) => tree(x, y, d))

  const bush = (x: number, y: number, w = 34, h = 20): ReactNode =>
    paths(gen.ellipse(x, y, w, h, o({ fill: '#bcd7ac', fillStyle: 'hachure', hachureGap: 4.5, hachureAngle: 30, stroke: INK, strokeWidth: 1.2, roughness: 1.5 })))

  const hill = (x: number, y: number, w: number, h: number): ReactNode => (
    <g key={key++}>{paths(gen.polygon([[x - w / 2, y], [x, y - h], [x + w / 2, y]], o({ fill: '#efe4cb', fillStyle: 'hachure', hachureGap: 6, hachureAngle: 60, fillWeight: 1, stroke: INK, strokeWidth: 1.4, roughness: 1.2 })))}</g>
  )

  const lake = (x: number, y: number, w: number, h: number): ReactNode =>
    paths(gen.ellipse(x, y, w, h, o({ fill: '#d7e4f2', fillStyle: 'hachure', hachureGap: 5, hachureAngle: 0, fillWeight: 1.2, stroke: '#5e7699', strokeWidth: 1.5, roughness: 1.6 })))

  const flag = (x: number, y: number, h = 46): ReactNode => (
    <g key={key++}>
      {paths(gen.line(x, y, x, y - h, o({ stroke: INK, strokeWidth: 2.4, roughness: 0.6 })))}
      {paths(gen.polygon([[x, y - h], [x + 30, y - h + 9], [x, y - h + 19]], o({ fill: SUN, fillStyle: 'solid', stroke: INK, strokeWidth: 1.8, roughness: 0.8 })))}
    </g>
  )

  const sign = (x: number, y: number): ReactNode => paths(gen.line(x, y, x, y + 26, o({ stroke: INK, strokeWidth: 2, roughness: 0.6 })))

  /** Núi: đỉnh có tuyết, nét tô gạch chéo. `s` phóng to theo `(cx, base)` để dùng cho cả hình nhỏ. */
  const mountain = (): ReactNode => (
    <g key={key++}>
      {paths(gen.polygon([[236, 212], [318, 120], [352, 138], [390, 66], [436, 128], [462, 116], [548, 212]], o({ fill: '#ede2c8', fillStyle: 'hachure', hachureGap: 6, hachureAngle: 60, fillWeight: 1.1, stroke: INK, strokeWidth: 2, roughness: 1.1 })))}
      {paths(gen.polygon([[390, 66], [366, 112], [380, 104], [392, 116], [404, 102], [418, 112]], o({ fill: '#ffffff', fillStyle: 'solid', stroke: INK, strokeWidth: 1.6, roughness: 0.9 })))}
      {flag(390, 68, 40)}
    </g>
  )

  return { trail, disc, tree, grove, bush, hill, lake, flag, sign, mountain }
}

/** Hình núi nhỏ có ba đường mòn, cho dải "Xem thêm". */
export function MiniMountain({ shift = 0 }: { shift?: number }) {
  const g = rough.generator()
  const draw = (d: ReturnType<typeof g.line>, dash?: string) =>
    g.toPaths(d).map((p, i) => <path key={i} d={p.d} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill || 'none'} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />)
  const art = createArt()
  return (
    <svg aria-hidden viewBox="0 -10 150 90" width={150} height={90} className="block flex-none overflow-visible max-[560px]:hidden">
      {draw(g.polygon([[38, 46], [75, 10], [112, 46]], { fill: '#ede2c8', fillStyle: 'hachure', hachureGap: 4, hachureAngle: 60, stroke: INK, strokeWidth: 1.5, roughness: 1, seed: 21 + shift }))}
      {draw(g.polygon([[75, 10], [66, 24], [75, 20], [84, 24]], { fill: '#ffffff', fillStyle: 'solid', stroke: INK, strokeWidth: 1.2, roughness: 0.8, seed: 22 + shift }))}
      {draw(g.line(75, 12, 75, -6, { stroke: INK, strokeWidth: 1.6, roughness: 0.5, seed: 23 }))}
      {draw(g.polygon([[75, -6], [91, -1], [75, 4]], { fill: SUN, fillStyle: 'solid', stroke: INK, strokeWidth: 1.2, roughness: 0.6, seed: 24 }))}
      {([[[[50, 46], [30, 62], [44, 80]], 1], [[[75, 46], [78, 64], [70, 80]], 2], [[[100, 46], [124, 62], [110, 80]], 3]] as [Pt[], number][]).map(([pts, s]) =>
        draw(g.curve(pts, { stroke: INK, strokeWidth: 1.5, roughness: 0.8, seed: 30 + s + shift, disableMultiStroke: true }), '4 4'),
      )}
      {[[22, 34, 14], [130, 30, 12], [134, 70, 10]].map(([x, y, d]) => art.tree(x, y, d))}
    </svg>
  )
}

import { useMemo } from 'react'
import { courses } from '@/content/courses'
import type { GoalMapLayout } from '@/content/goalMaps'
import { Chip } from '@/ui/Chip'
import { PagesRow } from '@/ui/PagesRow'
import { createArt, type DiscState, type TrailKind } from '@/ui/roughArt'
import { MapAt, SketchMap } from '@/ui/SketchMap'
import type { GoalModel, StationVM } from './useGoalModel'

const discOf: Record<StationVM['state'], DiscState> = { done: 'done', today: 'current', ready: 'open', locked: 'locked' }

function edgeKind(from: StationVM, to: StationVM): TrailKind {
  if (from.state !== 'done') return 'locked'
  return to.state === 'ready' ? 'open' : 'done'
}

const ariaOf = (s: StationVM) => {
  const word = s.state === 'done' ? 'đã qua' : s.state === 'today' ? 'hôm nay' : s.state === 'ready' ? 'học được ngay' : `cần qua ga ${s.needs.join(' và ')}`
  return `Ga ${s.no}, ${s.skill.title}, ${word}, ${s.sketches.length} sketch${s.state === 'done' ? ' đã mở' : ' sẽ mở'}`
}

/** Bản đồ ga của một mục tiêu. Ga là `<button>` HTML thật chọn để xem panel; nét vẽ chỉ để trang trí. */
export function GoalMap({ model, layout, phone, selected, onSelect }: { model: GoalModel; layout: GoalMapLayout; phone: boolean; selected: string; onSelect: (id: string) => void }) {
  const by = useMemo(() => Object.fromEntries(model.stations.map((s) => [s.id, s])), [model.stations])
  const { width: W, height: H } = layout
  const sideGoal = courses.flatMap((c) => c.goals).find((g) => g.sharedFrom === model.goal.title)

  const decor = useMemo(() => {
    const a = createArt()
    const pt = (id: string) => layout.nodes[id].p
    const flagDone = model.stations[model.stations.length - 1].state === 'done'
    return (
      <>
        {phone
          ? a.grove([[40, 120, 28], [72, 96, 22], [330, 130, 26], [356, 160, 20], [40, 230, 24], [22, 330, 18]])
          : a.grove([[70, 250, 36], [112, 214, 30], [96, 300, 26], [560, 196, 34], [600, 226, 28], [705, 590, 34], [740, 625, 26], [690, 720, 30], [700, 925, 30], [742, 900, 24], [110, 880, 34], [70, 905, 26], [300, 215, 26]])}
        {phone ? a.bush(150, 520, 30, 16) : [a.bush(330, 690, 40, 22), a.bush(700, 860, 44, 24), a.bush(260, 905, 36, 20)]}
        {a.flag(layout.flag[0], layout.flag[1], phone ? 44 : 52)}
        {!phone && a.sign(318, 900)}
        {!phone && a.sign(470, 648)}
        {layout.edges.map((e) => a.trail([pt(e.from), ...e.via, pt(e.to)], edgeKind(by[e.from], by[e.to])))}
        {a.trail([pt(model.goal.target), layout.flag], flagDone ? 'done' : 'locked')}
        {a.trail([pt(layout.side.from), ...layout.side.via, layout.side.p], 'side')}
        {model.stations.map((s) => a.disc(layout.nodes[s.id].p[0], layout.nodes[s.id].p[1], layout.nodes[s.id].d ?? layout.d, discOf[s.state]))}
        {a.disc(layout.side.p[0], layout.side.p[1], layout.side.d, 'side')}
      </>
    )
  }, [layout, model.stations, model.goal, by, phone])

  return (
    <SketchMap width={W} height={H} decor={decor} fit={phone} label={`Bản đồ ${model.goal.title}: ${model.done} trên ${model.total} ga đã qua`} className={phone ? 'max-[719px]:rounded-none max-[719px]:border-x-0' : ''}>
      {!phone && (
        <>
          <MapAt x={24} y={24} w={300}>
            <div className="border-2 border-ink bg-surface px-4 py-3 shadow-[0_4px_0_var(--color-ink)] rounded-[var(--radius-sketch)]">
              <div className="text-xs font-bold tracking-[0.06em] text-violet">ĐÍCH</div>
              <div className="text-2xl leading-[1.05] font-extrabold tracking-[-0.02em]">{model.goal.title}</div>
              <div className="mt-1 text-[13px] leading-[1.35] text-muted">{model.goal.outcome}</div>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted">
                <PagesRow open={0} total={2} /> 2 sketch của mục tiêu, mở khi tới đích
              </div>
            </div>
          </MapAt>
          <MapAt x={430} y={66} w={140} className="font-hand text-[13px] font-semibold">tới đây là xong!</MapAt>
        </>
      )}
      {phone && (
        <MapAt x={232} y={44} w={140} className="font-hand text-xs font-semibold">đích: {model.goal.title}</MapAt>
      )}

      {model.stations.map((s, i) => {
        const n = layout.nodes[s.id]
        const d = n.d ?? layout.d
        const sel = selected === s.id
        const meta = s.state === 'done' ? `${s.sketchesOpen}/${s.sketches.length}` : s.state === 'today' ? 'mở khi qua ga' : s.state === 'ready' ? `0/${s.sketches.length}` : `cần ga ${s.needs.join(' và ')}`
        return (
          <div key={s.id}>
            <MapAt x={n.p[0]} y={n.p[1]} center>
              <button
                type="button"
                aria-label={ariaOf(s)}
                aria-pressed={sel}
                onClick={() => onSelect(s.id)}
                className={`grid place-items-center rounded-full font-extrabold tracking-[-0.02em] ${sel ? 'outline-[3px] outline-offset-2 outline-violet' : ''} ${s.state === 'done' ? 'text-white' : s.state === 'locked' ? 'text-disabled-ink' : 'text-ink'}`}
                style={{ width: d, height: d, fontSize: d >= 56 ? 24 : phone ? 20 : 15 }}
              >
                {s.no}
              </button>
            </MapAt>
            {n.label && (
              <MapAt x={n.label.x} y={n.label.y} w={n.label.w} align={n.label.align} canvasWidth={W}>
                <div className={`leading-tight ${phone ? 'text-[12.5px]' : 'text-sm'} ${s.state === 'today' ? 'font-bold' : 'font-semibold'} ${s.state === 'locked' ? 'text-muted' : ''}`}>{s.skill.title}</div>
                <div className="mt-[3px] inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
                  <PagesRow open={s.sketchesOpen} total={s.sketches.length} className="scale-90" />
                  {!phone && meta}
                </div>
              </MapAt>
            )}
            {s.state === 'today' && (
              <MapAt x={n.p[0]} y={n.p[1] - d / 2 - 26} w={90} align="center">
                <Chip tone="ink" className="text-xs">Hôm nay</Chip>
              </MapAt>
            )}
            {!phone && s.skill.prereqs.length === 0 && (
              <MapAt x={i === 0 ? n.p[0] - 72 : n.p[0] + 80} y={i === 0 ? n.p[1] - 37 : n.p[1] + 23} w={i === 0 ? 90 : 150} align="center">
                <span className={`inline-block rounded border-[1.6px] border-ink bg-paper px-2 py-0.5 font-hand text-xs leading-tight font-semibold ${i === 0 ? '-rotate-[4deg]' : 'rotate-3'}`}>{i === 0 ? 'xuất phát' : 'không cần ga nào trước'}</span>
              </MapAt>
            )}
          </div>
        )
      })}

      <MapAt x={layout.side.p[0]} y={layout.side.p[1]} center>
        <span className="grid place-items-center text-center text-[12px] font-extrabold text-muted" style={{ width: layout.side.d, height: layout.side.d, fontSize: phone ? 10 : 12 }}>GBFS</span>
      </MapAt>
      <MapAt x={layout.side.p[0]} y={layout.side.p[1] + (phone ? 22 : -73)} w={phone ? 60 : 170} align="center" className="font-hand text-xs leading-tight font-semibold text-muted">
        {phone ? 'ga phụ' : sideGoal ? <>ga phụ của mục tiêu<br />“{sideGoal.sideName ?? sideGoal.title}”</> : 'ga phụ'}
      </MapAt>
    </SketchMap>
  )
}

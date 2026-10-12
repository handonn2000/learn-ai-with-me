import { skillIndex } from '@/content/skills'
import { backChain } from '@/learning/stations'
import { Button, ButtonLink } from '@/ui/Button'
import { DocIcon, LockIcon } from '@/ui/icons'
import type { GoalModel, StationVM } from './useGoalModel'

const stateWord = (s: StationVM) =>
  s.state === 'done' ? 'đã qua' : s.state === 'today' ? 'hôm nay' : s.state === 'ready' ? 'học được ngay' : `cần ga ${s.needs.join(' và ')}`

const lower = (t: string) => t.charAt(0).toLowerCase() + t.slice(1)

/** Chuỗi "lần ngược từ đích": Đích ← 9 ← 8 ← 6 ← (tiên quyết của ga). */
function Chain({ model, st }: { model: GoalModel; st: StationVM }) {
  const chain = backChain(skillIndex, model.goal.target, st.id)
  const prereqs = st.skill.prereqs.map((p) => model.noOf[p]).sort((a, b) => a - b)
  const chip = 'rounded-md px-2 py-0.5 text-[13px] font-bold'
  return (
    <ol aria-label="Lần ngược từ đích" className="m-0 mt-1.5 flex list-none flex-wrap items-center gap-1.5 p-0">
      <li className={`${chip} border-2 border-ink bg-sun-soft`}>Đích</li>
      {chain.map((id) => (
        <li key={id} className="flex items-center gap-1.5">
          <span aria-hidden className="text-muted">←</span>
          <span className={`${chip} ${id === st.id ? 'bg-sun' : 'bg-track'}`}>{model.noOf[id]}</span>
        </li>
      ))}
      {prereqs.length > 0 && (
        <li className="flex items-center gap-1.5">
          <span aria-hidden className="text-muted">←</span>
          <span className={`${chip} bg-violet text-white`}>{prereqs.join(', ')}</span>
        </li>
      )}
    </ol>
  )
}

/** Panel ga: cột phải trên máy tính, bottom sheet (`compact`) trên điện thoại. */
export function StationPanel({ model, st, compact = false }: { model: GoalModel; st: StationVM; compact?: boolean }) {
  const lesson = st.skill.lesson
  const open = st.state === 'done'
  return (
    <div>
      <p className="m-0 text-[13px] font-semibold text-muted">
        Ga {st.no} · {stateWord(st)}
        {st.minutes != null && ` · ${st.minutes}′`}
        {st.exercises > 0 && !compact && ` · ${st.exercises} bài tập`}
      </p>
      <h2 className={`m-0 mt-1 leading-[1.1] font-extrabold tracking-[-0.02em] ${compact ? 'text-[22px]' : 'text-2xl'}`}>{st.skill.title}</h2>
      {!compact && <p className="mt-2 mb-0 text-[15px] text-ink">Học xong: {lower(st.skill.can)}</p>}
      {!compact && (
        <div className="mt-3.5">
          <b className="text-[13px] text-muted">Lần ngược từ đích</b>
          <Chain model={model} st={st} />
        </div>
      )}
      {st.sketches.length > 0 && (
        <div className="mt-3.5">
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <b>{open ? `${st.sketches.length} sketch đã mở` : `${st.sketches.length} sketch mở khi qua ga`}</b>
            {!compact && !open && <span className="text-xs text-muted">xem trước tên</span>}
          </div>
          <ul className={`m-0 mt-2 list-none p-0 ${compact ? 'grid grid-cols-3 gap-2' : 'flex flex-col gap-2'}`}>
            {st.sketches.map((t) => (
              <li
                key={t}
                className={`flex items-center gap-2.5 rounded-xl ${compact ? 'min-h-[52px] border-2 border-dashed border-disabled-line p-2 text-[13px] leading-tight' : 'bg-subtle px-3 py-2.5 text-[15px]'}`}
              >
                {!compact && (open ? <DocIcon width={18} height={18} aria-hidden className="flex-none text-violet" /> : <LockIcon width={16} height={16} aria-hidden className="flex-none text-disabled-ink" />)}
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4">
        {st.state === 'locked' ? (
          <Button disabled className="w-full">Cần qua ga {st.needs.join(' và ')} trước</Button>
        ) : !lesson ? (
          <Button disabled className="w-full">Ga này chưa có bài</Button>
        ) : open ? (
          <ButtonLink to={`/learn/${lesson}`} variant="secondary" className="w-full">Mở lại bài học</ButtonLink>
        ) : (
          <ButtonLink to={`/learn/${lesson}`} className="w-full">Vào ga {st.no}</ButtonLink>
        )}
      </div>
    </div>
  )
}

/** Ghi chú dưới panel: vì sao ga "học được ngay" không cần chờ ga hôm nay. */
export function ParallelNote({ model }: { model: GoalModel }) {
  const today = model.today
  const ready = model.stations.find((s) => s.state === 'ready')
  if (!today || !ready) return null
  const joint = model.stations.find((s) => s.state === 'locked' && s.needs.includes(today.no) && s.needs.includes(ready.no))
  const needs = ready.skill.prereqs.map((p) => model.noOf[p]).join(', ')
  return (
    <p className="m-0 rounded-[18px] bg-surface px-4 py-3.5 text-sm">
      <b>Ga {ready.no} không cần chờ ga {today.no}.</b>{' '}
      {needs ? `Nó chỉ cần ga ${needs}, nên bạn học trước cũng được.` : 'Nó không cần ga nào trước, nên bạn học trước cũng được.'}
      {joint && ` Ga ${joint.no} cần cả ${today.no} và ${ready.no}.`}
    </p>
  )
}

export function Legend() {
  const dot = 'inline-block size-4 flex-none rounded-full border-2 border-ink'
  return (
    <section aria-labelledby="legend" className="rounded-[18px] bg-surface p-4">
      <h2 id="legend" className="m-0 text-[15px] font-bold">Cách đọc bản đồ</h2>
      <ul className="m-0 mt-2.5 grid list-none grid-cols-2 gap-x-3 gap-y-2.5 p-0 text-sm">
        <li className="flex items-center gap-2"><span aria-hidden className={`${dot} bg-violet`} />Đã qua</li>
        <li className="flex items-center gap-2"><span aria-hidden className={`${dot} bg-sun`} />Hôm nay</li>
        <li className="flex items-center gap-2"><span aria-hidden className={`${dot} bg-surface`} />Học được ngay</li>
        <li className="flex items-center gap-2"><span aria-hidden className={`${dot} border-disabled-line bg-track`} />Cần ga trước</li>
        <li className="flex items-center gap-2"><DocIcon width={14} height={14} aria-hidden />Sketch đã mở</li>
        <li className="flex items-center gap-2"><span aria-hidden className="inline-block h-4 w-3 flex-none rounded-[3px] border-2 border-dashed border-disabled-line" />Sketch chưa mở</li>
      </ul>
    </section>
  )
}

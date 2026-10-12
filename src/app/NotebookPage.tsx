import { useState } from 'react'
import { lessons } from '@/content/lessons'
import { skillIndex } from '@/content/skills'
import { useProgress } from '@/learning/progress'
import { Button } from '@/ui/Button'
import { Chip } from '@/ui/Chip'
import { LockIcon } from '@/ui/icons'
import { StepDots } from '@/ui/StepDots'
import { useGoalModel, type StationVM } from './goal/useGoalModel'
import { SketchPage, useCountdown } from './lesson/Reorganize'

const lined = { backgroundImage: 'linear-gradient(var(--color-lined-rule) 1px, transparent 1px)', backgroundSize: '100% 14px' }
const stripes = { backgroundImage: 'repeating-linear-gradient(45deg, rgba(154,161,181,0.12) 0 8px, transparent 8px 16px)' }

const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

/**
 * Sổ tay (docs/design/screens/21): mỗi ga đã qua là một chồng sketch; ga chưa qua là ô khoá ghi điều kiện mở.
 * Nội dung sketch từng ga chưa có (mới có tên, là dữ liệu mẫu) và ảnh trang giấy chưa chụp được: hai phần này còn thiếu.
 */
export function NotebookPage() {
  const model = useGoalModel('astar')
  const records = useProgress((s) => s.skills)
  const [course, setCourse] = useState<'astar' | 'de'>('astar')
  const [redraw, setRedraw] = useState<StationVM | null>(null)
  const done = model.stations.filter((s) => s.state === 'done')
  const locked = model.stations.filter((s) => s.state !== 'done')
  const weakest = [...done].filter((s) => s.memory != null).sort((a, b) => a.memory! - b.memory!)[0] ?? null
  const now = new Date()

  return (
    <div className="pt-3 min-[720px]:pt-5">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="min-w-0 max-w-[40em]">
          <h1 className="m-0 text-[40px] leading-none font-extrabold tracking-[-0.035em] min-[720px]:text-[52px]">Sổ tay</h1>
          <p className="mt-3 mb-0 text-base text-muted">
            Mỗi ga có vài sketch, mở khi bạn qua ga. Cả mục tiêu cũng có sketch riêng, mở khi tới đích. <b className="text-ink">Hiểu A*: {model.sketchOpen}/{model.sketchTotal} sketch.</b>
          </p>
        </div>
        <div role="group" aria-label="Chọn mục tiêu" className="inline-flex overflow-hidden rounded-[14px] border-2 border-ink bg-surface text-[15px]">
          {([['astar', 'Hiểu A*'], ['de', 'Data Engineering']] as const).map(([id, t], i) => (
            <button key={id} type="button" aria-pressed={course === id} onClick={() => setCourse(id)} className={`min-h-11 px-4 font-semibold ${i > 0 ? 'border-l-2 border-ink' : ''} ${course === id ? 'bg-ink text-white' : ''}`}>{t}</button>
          ))}
        </div>
      </div>

      {course === 'de' ? (
        <p className="mt-8 rounded-[20px] bg-surface p-6 text-lg text-muted">Data Engineering chưa có ga nào để vẽ. Sketch sẽ xuất hiện ở đây khi bạn qua ga đầu tiên.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-6 min-[1100px]:flex-row min-[1100px]:items-start">
          <div className="min-w-0 flex-1">
            <ul className="m-0 grid list-none gap-4 p-0 min-[620px]:grid-cols-2 min-[900px]:grid-cols-3">
              {done.map((s) => {
                const rec = records[s.id]
                const fresh = rec?.card.last_review && sameDay(new Date(rec.card.last_review), now)
                const low = s.memory != null && s.memory < 0.9
                return (
                  <li key={s.id} className={`flex flex-col gap-2 rounded-[20px] bg-surface p-3.5 ${fresh ? 'border-2 border-ink shadow-block' : ''}`}>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <b className="font-mono text-[13px]">Ga {s.no}</b>
                      {fresh ? <Chip tone="sun" className="border-2 border-ink px-2.5 py-0 text-xs">mới hôm nay</Chip> : s.memory != null && <span className={low ? 'font-bold text-wrong-ink' : 'text-muted'}>nhớ {Math.round(s.memory * 100)}%</span>}
                    </div>
                    <div aria-hidden className="grid aspect-[16/10] place-items-center rounded-xl border-2 border-ink bg-paper p-3 text-center font-hand text-[15px] font-semibold" style={lined}>{s.sketches[0]}</div>
                    <div className="flex items-center justify-between gap-2 font-hand text-sm text-muted">
                      <span className="truncate">{s.sketches[0]}</span>
                      <span className="flex items-center gap-1.5"><StepDots total={s.sketches.length} current={s.sketches.length} /> {s.sketches.length}/{s.sketches.length}</span>
                    </div>
                    <b className="leading-tight">{s.skill.title}</b>
                    <div className="mt-auto flex items-center justify-between gap-2 text-[13px] text-muted">
                      <span>Chưa có ảnh</span>
                      <button type="button" onClick={() => setRedraw(s)} className="font-bold text-violet underline">Vẽ lại</button>
                    </div>
                  </li>
                )
              })}
            </ul>
            <ul className="m-0 mt-4 grid list-none gap-3 p-0 min-[620px]:grid-cols-2 min-[900px]:grid-cols-4">
              {locked.map((s) => (
                <li key={s.id} className="rounded-2xl border-2 border-dashed border-disabled-line p-3.5 text-muted" style={stripes}>
                  <span className="flex items-center justify-between gap-2"><b className="text-ink">Ga {s.no}</b><LockIcon width={14} height={14} aria-hidden /></span>
                  <span className="mt-1.5 block text-[13px]">{s.sketches.length} sketch · mở khi qua ga</span>
                </li>
              ))}
              <li className="rounded-2xl border-2 border-dashed border-ink bg-sun-soft p-3.5">
                <span className="flex items-center justify-between gap-2"><b>Cả mục tiêu</b><LockIcon width={14} height={14} aria-hidden /></span>
                <span className="mt-1.5 block text-[13px] text-muted">2 sketch · mở khi tới đích</span>
              </li>
            </ul>
          </div>

          <aside className="flex flex-col gap-4 min-[1100px]:w-[320px] min-[1100px]:flex-none">
            <section aria-labelledby="redraw" className="rounded-3xl border-2 border-ink bg-sun-soft p-5 shadow-block-lg">
              <h2 id="redraw" className="m-0 text-2xl font-extrabold tracking-[-0.02em]">Hôm nay nên vẽ lại</h2>
              {weakest ? (
                <>
                  <p className="mt-2 mb-3 text-[15px]">
                    <b>Ga {weakest.no} · {weakest.skill.title}</b>, nhớ {Math.round(weakest.memory! * 100)}%. Úp sổ tay xuống, vẽ lại trên giấy trong 3 phút, rồi so với sketch.
                  </p>
                  <Button className="w-full" onClick={() => setRedraw(weakest)}>Bắt đầu vẽ lại</Button>
                  <p className="mt-3 mb-0 text-[13px] text-muted">Tự vẽ lại giúp nhớ lâu hơn là nhìn sketch đọc lại.</p>
                </>
              ) : (
                <p className="mt-2 mb-0 text-[15px]">Chưa có ga nào để vẽ lại. Qua ga đầu tiên rồi quay lại đây.</p>
              )}
            </section>
            <section aria-labelledby="photos" className="rounded-[20px] bg-surface p-5">
              <h2 id="photos" className="m-0 text-lg font-bold">Ảnh trang giấy gần đây</h2>
              <p className="mt-2 mb-0 text-sm text-muted">Chưa có ảnh. Chụp trang giấy của bạn ở bước làm trên giấy sẽ lưu ở đây (tính năng này chưa có).</p>
            </section>
          </aside>
        </div>
      )}

      {redraw && <Redraw key={redraw.id} st={redraw} onClose={() => setRedraw(null)} />}
    </div>
  )
}

/** Vẽ lại từ trí nhớ: đồng hồ 3 phút, rồi mở sketch của ga (nếu đã có nội dung) để so. */
function Redraw({ st, onClose }: { st: StationVM; onClose: () => void }) {
  const timer = useCountdown(180)
  const [compare, setCompare] = useState(false)
  const data = st.skill.lesson ? lessons[st.skill.lesson]?.reorganize : undefined
  return (
    <section aria-label={`Vẽ lại ga ${st.no}`} className="mt-6 rounded-3xl border-2 border-ink bg-surface p-5 shadow-block-lg">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 text-2xl font-extrabold tracking-[-0.02em]">Vẽ lại ga {st.no}: {skillIndex[st.id].title}</h2>
        <div className="flex items-center gap-3">
          <span role="timer" aria-live="off" className="font-mono text-3xl font-bold">{timer.text}</span>
          <Button variant="secondary" className="h-11" onClick={timer.toggle}>{timer.on ? 'Tạm dừng' : 'Bắt đầu đếm'}</Button>
          <Button variant="link" onClick={onClose}>Đóng</Button>
        </div>
      </div>
      <p className="mt-2 mb-4 text-muted">Úp sổ tay xuống và vẽ trên giấy những gì bạn nhớ. Xong thì bấm “So với sketch”.</p>
      {compare ? (
        data ? <SketchPage data={data} mask={false} shown={new Set()} onShow={() => {}} /> : <p className="m-0 rounded-xl bg-subtle p-4 text-muted">Sketch của ga này chưa có nội dung. Tạm thời hãy tự đối chiếu với bài học của ga.</p>
      ) : (
        <Button onClick={() => setCompare(true)}>So với sketch</Button>
      )}
    </section>
  )
}

import { Fragment, useEffect, useState, type ReactNode } from 'react'
import type { ReactElement } from 'react'
import { skillIndex } from '@/content/skills'
import type { Lesson, ReorganizeData } from '@/learning/types'
import { Button, Chip } from '@/ui'
import { DocIcon, PenIcon } from '@/ui/icons'
import { StepFrame } from '@/ui/StepFrame'

type Mode = 'draw' | 'sketch'
type Box = ReorganizeData['sketch']['boxes'][keyof ReorganizeData['sketch']['boxes']]

const BLANK = /\{\{(.+?)\}\}/g
const blanksOf = (d: ReorganizeData) => Object.values(d.sketch.boxes).reduce((n, b) => n + ((b.text + (b.sub ?? '')).match(BLANK)?.length ?? 0), 0)

/** Dựng chữ có ô trống: `{{x}}` là chỗ che. Ô che bấm được để mở; đã mở hoặc không che thì tô vàng. */
function Text({ text, boxKey, mask, shown, onShow }: { text: string; boxKey: string; mask: boolean; shown: Set<string>; onShow: (k: string) => void }): ReactElement {
  const parts = text.split(/(\{\{.+?\}\})/g)
  return (
    <>
      {parts.map((p, i) => {
        const m = /^\{\{(.+)\}\}$/.exec(p)
        if (!m) return <Fragment key={i}>{p}</Fragment>
        const k = `${boxKey}:${i}`
        if (mask && !shown.has(k))
          return (
            <button key={i} type="button" aria-label="Ô trống, bấm để mở" onClick={() => onShow(k)} className="mx-0.5 inline-block min-w-14 rounded-lg border-2 border-dashed border-violet bg-violet-soft px-3 py-0.5 font-bold text-violet">
              ?
            </button>
          )
        return <mark key={i} className="rounded-sm bg-sun/70 px-1 text-ink">{m[1]}</mark>
      })}
    </>
  )
}

/** Sketch một trang. `mask` che các ô trống để tự kiểm tra. */
function SketchPage({ data, mask, shown, onShow }: { data: ReorganizeData; mask: boolean; shown: Set<string>; onShow: (k: string) => void }) {
  const b = data.sketch.boxes
  const box = (k: keyof typeof b, extra = '') => {
    const x: Box = b[k]
    return (
      <div className={`rounded-md border-2 border-ink bg-surface px-3 py-2.5 text-center font-hand text-[15px] leading-snug ${extra}`}>
        {k === 'core' ? <span className="block text-[28px] leading-none font-bold">{x.text}</span> : <span><Text text={x.text} boxKey={k} mask={mask} shown={shown} onShow={onShow} /></span>}
        {x.sub && <span className={`block ${k === 'core' ? 'mt-1' : 'text-xs text-muted'}`}><Text text={x.sub} boxKey={`${k}s`} mask={mask} shown={shown} onShow={onShow} /></span>}
      </div>
    )
  }
  const arrow = <span aria-hidden className="text-center text-xl leading-none">↓</span>
  return (
    <div className="rounded-2xl border-2 border-ink bg-lined p-4 min-[720px]:p-6" style={{ backgroundImage: 'linear-gradient(var(--color-lined-rule) 1px, transparent 1px)', backgroundSize: '100% 28px' }}>
      <h3 className="m-0 font-hand text-2xl font-bold">{data.sketch.title}</h3>
      <p className="m-0 mb-3 font-hand text-sm text-muted">{data.sketch.sub}</p>
      <div className="mx-auto flex max-w-[640px] flex-col gap-2">
        <div className="min-[720px]:mx-auto min-[720px]:w-1/2">{box('top')}</div>
        {arrow}
        <div className="grid items-center gap-2 min-[720px]:grid-cols-[1fr_1.2fr_1fr]">
          {box('left')}
          {box('core', 'border-[3px] bg-violet-soft')}
          {box('next', 'border-dashed border-violet bg-surface text-violet')}
        </div>
        {arrow}
        <div className="grid gap-2 min-[720px]:grid-cols-3">
          {box('a')}
          {box('b')}
          {box('c')}
        </div>
      </div>
    </div>
  )
}

function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!on) return
    const t = setInterval(() => setLeft((s) => (s <= 1 ? (setOn(false), 0) : s - 1)), 1000)
    return () => clearInterval(t)
  }, [on])
  const text = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`
  return { text, on, left, toggle: () => setOn((x) => !x) }
}

type Stage = 'choose' | 'compare' | 'masked'

/**
 * Hệ thống lại cuối buổi (docs/design/screens/17, 17b, 17c): tự vẽ trên giấy rồi so với sketch, hoặc dùng sketch che chữ.
 * Chưa ghi gì vào tiến độ; ý còn thiếu chỉ được báo lại cho người học.
 */
export function Reorganize({ lesson, data, onDone, onLater, onStage }: { lesson: Lesson; data: ReorganizeData; onDone: () => void; onLater: () => void; onStage?: (wide: boolean) => void }) {
  const [stage, setStage] = useState<Stage>('choose')
  const [mode, setMode] = useState<Mode>('draw')
  const [shown, setShown] = useState<Set<string>>(new Set())
  const [mask, setMask] = useState(false)
  const [have, setHave] = useState<Set<number>>(new Set())
  const timer = useCountdown(data.minutes * 60)
  const skill = skillIndex[lesson.skill]
  const total = blanksOf(data)
  const show = (k: string) => setShown((s) => new Set(s).add(k))
  useEffect(() => onStage?.(stage === 'compare'), [stage, onStage])

  if (stage === 'compare') {
    const missing = data.ideas.length - have.size
    return (
      <div className="mx-auto grid max-w-[1184px] gap-5 px-4 pt-4 pb-10 min-[1000px]:grid-cols-[1fr_320px] min-[1000px]:items-start">
        <section className="rounded-3xl border-2 border-ink bg-surface p-5 shadow-block-lg min-[720px]:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="m-0 text-[26px] font-extrabold tracking-[-0.02em]">So với sketch của buổi</h1>
            <label className="flex min-h-11 cursor-pointer items-center gap-2 font-bold">
              <input type="checkbox" checked={mask} onChange={(e) => setMask(e.target.checked)} className="size-5 accent-violet" />
              Che chữ để tự kiểm tra
            </label>
          </div>
          <SketchPage data={data} mask={mask} shown={shown} onShow={show} />
        </section>
        <aside className="flex flex-col gap-4">
          <section aria-labelledby="have" className="rounded-3xl bg-surface p-5">
            <h2 id="have" className="m-0 text-[22px] leading-tight font-extrabold tracking-[-0.01em]">Trang giấy của bạn có những ý này chưa?</h2>
            <ul className="m-0 mt-4 flex list-none flex-col gap-2 p-0">
              {data.ideas.map((t, i) => {
                const on = have.has(i)
                return (
                  <li key={t}>
                    <label className={`flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-[15px] leading-snug ${on ? '' : 'bg-wrong-soft'}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => setHave((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n })}
                        className="mt-0.5 size-5 shrink-0 accent-violet"
                      />
                      {t}
                    </label>
                  </li>
                )
              })}
            </ul>
            <p role="status" className={`m-0 mt-4 rounded-xl px-4 py-3 text-[15px] ${missing === 0 ? 'bg-correct-soft' : 'bg-wrong-soft'}`}>
              {missing === 0 ? <b>Đủ cả {data.ideas.length} ý.</b> : <><b>Thiếu {missing} trên {data.ideas.length} ý.</b> {missing === data.ideas.length ? 'Tick những ý bạn đã viết ra.' : 'Những ý này sẽ quay lại trong buổi ôn ngày mai.'}</>}
            </p>
          </section>
          <Button onClick={onDone} className="w-full">Xong buổi học</Button>
        </aside>
      </div>
    )
  }

  if (stage === 'masked')
    return (
      <StepFrame
        card={false}
        footer={
          <>
            <span className="font-bold text-muted">Đã mở {shown.size} trên {total} ô</span>
            <Button onClick={onDone}>Xong</Button>
          </>
        }
      >
        <h1 className="m-0 mb-4 text-[26px] leading-tight font-extrabold tracking-[-0.02em]">Nhớ ra trước, rồi mới chạm để mở ô trống</h1>
        <SketchPage data={data} mask shown={shown} onShow={show} />
      </StepFrame>
    )

  const modes: { id: Mode; title: string; note: string; icon: ReactNode; badge?: string }[] = [
    { id: 'draw', title: 'Tự vẽ trên giấy trước', note: 'Vẽ lại từ trí nhớ, rồi mở sketch có sẵn để so và đánh dấu chỗ còn thiếu.', icon: <PenIcon width={20} height={20} />, badge: 'Nhớ lâu hơn' },
    { id: 'sketch', title: 'Dùng sketch có sẵn', note: 'Sketch được che bớt chữ. Bạn chạm vào từng ô trống sau khi đã tự nhớ ra.', icon: <DocIcon width={20} height={20} /> },
  ]
  return (
    <StepFrame
      footer={
        <>
          <button type="button" onClick={onLater} className="font-bold text-muted underline underline-offset-4">Để sau, kết thúc buổi</button>
          <Button onClick={() => setStage(mode === 'draw' ? 'compare' : 'masked')}>{mode === 'draw' ? 'Vẽ xong, cho tôi so' : 'Bắt đầu'}</Button>
        </>
      }
    >
      <Chip tone="sun" className="border-2 border-ink">Bước cuối của buổi</Chip>
      <h1 className="mt-3 mb-2 text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em] min-[720px]:text-[38px]">Hệ thống lại trong {data.minutes} phút</h1>
      <p className="mt-0 mb-5 max-w-[56ch] text-muted">
        Hôm nay bạn đi qua ga <b className="text-ink">{skill.title}</b>. Chọn cách bạn muốn gom lại những gì vừa học.
      </p>
      <div role="radiogroup" aria-label="Cách hệ thống lại" className="grid gap-3.5 min-[720px]:grid-cols-2">
        {modes.map((m) => (
          <label key={m.id} className={`relative cursor-pointer rounded-2xl border-2 p-4 ${mode === m.id ? 'border-violet bg-violet-soft shadow-[0_4px_0_var(--color-violet)]' : 'border-line bg-surface shadow-[0_4px_0_var(--color-line)]'} has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet`}>
            <input type="radio" name="how" checked={mode === m.id} onChange={() => setMode(m.id)} className="sr-only" />
            <span className="flex flex-wrap items-center gap-2 text-lg font-extrabold">
              {m.icon}
              {m.title}
              {m.badge && <span className="rounded-full bg-violet px-2.5 py-0.5 text-xs font-bold text-white">{m.badge}</span>}
            </span>
            <span className="mt-1.5 block text-[15px] text-muted">{m.note}</span>
          </label>
        ))}
      </div>
      <div className="mt-5 grid gap-4 min-[720px]:grid-cols-[1fr_260px]">
        <section aria-labelledby="frame" className="rounded-2xl bg-subtle p-5">
          <h2 id="frame" className="m-0 text-[17px] font-bold">Trang giấy của bạn nên có</h2>
          <ol className="m-0 mt-3 flex list-none flex-col gap-2.5 p-0">
            {data.frame.map((f, i) => (
              <li key={f} className="flex items-center gap-3">
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-lg border-2 border-ink bg-surface text-sm font-bold">{i + 1}</span>
                {f}
              </li>
            ))}
          </ol>
          <p className="mt-3 mb-0 text-sm text-muted">Chỉ là khung. Nội dung bạn tự nhớ ra, vẽ xấu cũng được.</p>
        </section>
        <section aria-labelledby="clock" className="rounded-2xl border-2 border-ink bg-surface p-5">
          <h2 id="clock" className="m-0 text-[17px] font-bold">Đồng hồ</h2>
          <p role="timer" aria-live="off" className="m-0 mt-1 font-mono text-[52px] leading-none font-bold">{timer.text}</p>
          <Button variant="secondary" className="mt-3 h-11 text-[15px]" onClick={timer.toggle}>{timer.on ? 'Tạm dừng' : timer.left === 0 ? 'Hết giờ' : 'Bắt đầu đếm'}</Button>
        </section>
      </div>
    </StepFrame>
  )
}

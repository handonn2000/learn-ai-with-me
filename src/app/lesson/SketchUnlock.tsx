import { useState } from 'react'
import { Link } from 'react-router'
import { sketchTitles } from '@/content/mock/sketches'
import { skillIndex } from '@/content/skills'
import type { Lesson } from '@/learning/types'
import { Button, ButtonLink } from '@/ui/Button'
import { StepFrame } from '@/ui/StepFrame'

/**
 * Mở khóa sketch (docs/design/screens/16): mỗi thẻ úp là một câu hỏi, vẽ ra giấy trước rồi mới lật để so.
 * Tên sketch là dữ liệu mẫu và việc lật chưa được lưu: nội dung sketch và sổ tay thuộc mốc 6.
 */
export function SketchUnlock({ lesson, no, opened, total }: { lesson: Lesson; no: number; opened: number; total: number }) {
  const titles = sketchTitles[lesson.skill] ?? []
  const [flipped, setFlipped] = useState<Set<number>>(() => new Set([0]))
  const flip = (i: number) => setFlipped((s) => new Set(s).add(i))
  const skill = skillIndex[lesson.skill]
  return (
    <StepFrame
      card={false}
      footer={
        <>
          <Link to="/" className="font-bold text-violet underline underline-offset-4">Để sau, lật trong sổ tay</Link>
          <ButtonLink to="/goal/astar">Xem ga {no} trên bản đồ</ButtonLink>
        </>
      }
    >
      <div className="flex items-center gap-4">
        <span aria-hidden className="relative grid size-[72px] shrink-0 place-items-center">
          <span className="absolute inset-0 -rotate-12 rounded-xl border-2 border-ink bg-violet-soft" />
          <span className="absolute inset-0 rotate-6 rounded-xl border-2 border-ink bg-violet-soft" />
          <span className="relative grid h-14 w-11 place-items-center rounded-lg border-2 border-ink bg-surface text-lg font-extrabold">+{titles.length}</span>
        </span>
        <div>
          <p className="m-0 text-sm font-semibold text-muted">Qua ga {no} · {skill.title}</p>
          <h1 className="m-0 text-[30px] leading-[1.05] font-extrabold tracking-[-0.03em]">Mở khóa {titles.length} sketch</h1>
        </div>
      </div>
      <p className="mt-4 mb-4 text-lg">
        Mỗi thẻ úp là một câu hỏi. <b>Vẽ câu trả lời ra giấy trước</b>, rồi lật thẻ để so.
      </p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {titles.map((t, i) =>
          flipped.has(i) ? (
            <li key={t} className="rounded-3xl border-2 border-ink bg-lined p-4 shadow-block" style={{ backgroundImage: 'linear-gradient(var(--color-lined-rule) 1px, transparent 1px)', backgroundSize: '100% 24px' }}>
              <p className="m-0 text-xs font-bold text-violet">Sketch {i + 1} · đã lật</p>
              <h2 className="m-0 mt-0.5 text-[22px] leading-tight font-extrabold">{t}</h2>
              <p className="mt-3 mb-0 font-hand text-[15px] text-muted">So bản vẽ của bạn với sketch này trong Sổ tay. Nội dung sketch sẽ có ở mốc Sổ tay.</p>
            </li>
          ) : (
            <li key={t} className="flex items-center gap-3 rounded-3xl border-2 border-ink bg-violet-soft p-3 shadow-block" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(74,51,201,0.1) 0 8px, transparent 8px 16px)' }}>
              <span className="min-w-0 flex-1 rounded-2xl border-2 border-ink bg-surface px-4 py-2.5">
                <span className="block text-xs font-semibold text-muted">Sketch {i + 1} · còn úp</span>
                <b className="text-[17px] leading-tight">{t}</b>
              </span>
              <Button variant="secondary" className="h-14 bg-sun!" onClick={() => flip(i)}>
                Lật
              </Button>
            </li>
          ),
        )}
      </ul>
      <p className="mt-4 mb-0 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-sm">
        <b className="font-mono text-base">{opened}/{total}</b>
        <span aria-hidden className="h-2.5 flex-1 overflow-hidden rounded-md bg-track"><span className="block h-full bg-violet" style={{ width: `${(opened / total) * 100}%` }} /></span>
        <span className="text-muted">sketch Hiểu A*</span>
      </p>
    </StepFrame>
  )
}

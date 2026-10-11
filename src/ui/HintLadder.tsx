import { Button } from './Button'

export type HintLevel = 0 | 1 | 2

/** Gợi ý → Lời giải. Mở càng nhiều thì kỹ năng quay lại càng sớm. */
export function HintLadder({ level, onHint, onSolution, hint, solution }: { level: HintLevel; onHint: () => void; onSolution: () => void; hint?: string; solution?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-x-4">
        {level < 1 && <Button variant="link" onClick={onHint}>Gợi ý</Button>}
        {level < 2 && <Button variant="link" onClick={onSolution}>Xem lời giải</Button>}
      </div>
      {level >= 1 && hint && <p className="m-0 rounded-[14px] border-t-2 border-ink bg-sun-soft px-3.5 py-3 text-[15px]"><b>Gợi ý.</b> {hint}</p>}
      {level >= 2 && solution && <p className="m-0 rounded-[14px] border-t-2 border-disabled-line bg-bg px-3.5 py-3 text-[15px]"><b>Lời giải.</b> {solution}</p>}
      {level === 0 && <p className="m-0 text-sm text-muted">Không mở gợi ý thì bài này tính là nhớ tốt.</p>}
    </div>
  )
}

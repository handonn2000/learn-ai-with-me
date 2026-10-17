import { useState } from 'react'
import { Button, Chip, ConfidenceControl, FeedbackBar, type Confidence } from '@/ui'
import { StepFrame } from '@/ui/StepFrame'
import { useProgress, type GuessRecord } from '@/learning/progress'
import type { RelateData, Relation } from '@/learning/types'

export const relationLabel: Record<Relation, string> = { leads: 'dẫn tới', example: 'là ví dụ của', not: 'không phải' }
const relations: Relation[] = ['leads', 'example', 'not']

type Pair = RelateData['pairs'][number]

/** Lựa chọn đã lưu thành Relation; giá trị lạ (dữ liệu cũ, đổi nội dung) coi như chưa chọn. */
export const pickOf = (g: GuessRecord | undefined, id: string): Relation | undefined => relations.find((r) => r === g?.picks[id])

/**
 * Một cặp: trái · ba quan hệ · phải. `checked` thì khóa và tô đúng/sai;
 * `reveal` thì hiện thêm đáp án và lý do.
 */
function PairRow({ pair, pick, onPick, checked, reveal }: { pair: Pair; pick?: Relation; onPick?: (r: Relation) => void; checked: boolean; reveal: boolean }) {
  const right = pick === pair.answer
  return (
    <li className={`rounded-2xl border-2 p-4 ${!checked ? 'border-line bg-surface' : right ? 'border-correct bg-correct-soft' : 'border-wrong bg-wrong-soft'}`}>
      <p className="m-0 text-[17px] font-bold leading-snug">{pair.left}</p>
      <div role="radiogroup" aria-label={`Quan hệ: ${pair.left} … ${pair.right}`} className="my-2.5 grid grid-cols-3 overflow-hidden rounded-[14px] border-2 border-ink text-[15px]">
        {relations.map((r, i) => {
          const on = pick === r
          const answer = checked && reveal && r === pair.answer
          return (
            <label
              key={r}
              className={`relative grid min-h-11 place-items-center px-1.5 py-2 text-center leading-tight has-[:focus-visible]:outline-3 has-[:focus-visible]:-outline-offset-3 has-[:focus-visible]:outline-violet ${i > 0 ? 'border-l-2 border-ink' : ''} ${checked ? '' : 'cursor-pointer'} ${on ? 'bg-ink font-bold text-white' : answer ? 'bg-correct font-bold text-white' : 'bg-surface font-semibold'}`}
            >
              <input type="radio" name={`relate-${pair.id}`} value={r} checked={on} disabled={checked} onChange={() => onPick?.(r)} className="sr-only" />
              {relationLabel[r]}
            </label>
          )
        })}
      </div>
      <p className="m-0 text-[17px] font-bold leading-snug">{pair.right}</p>
      {checked && reveal && (
        <p className="m-0 mt-3 text-[15px] leading-snug">
          <b className={right ? 'text-correct-ink' : 'text-wrong-ink'}>{right ? 'Đúng.' : pick ? `Chưa đúng: là “${relationLabel[pair.answer]}”.` : `Đáp án: “${relationLabel[pair.answer]}”.`}</b> {pair.why}
        </p>
      )}
    </li>
  )
}

/**
 * Bước "đoán quan hệ" (biến thể của đoán trước, M1): nối thử từng cặp, chọn độ chắc chắn, phản hồi ngay.
 * Lần đầu chốt thì lưu vào `guesses`; đã có bản đoán thì chỉ hiện lại bản đó, không bắt đoán lần nữa.
 * `lesson` = trong bài học; mặc định là bước "đoán trước cho ga sau" của buổi học.
 */
export function RelateStep({ lessonId, data, onDone, lesson = false }: { lessonId: string; data: RelateData; onDone: () => void; lesson?: boolean }) {
  const saved = useProgress((s) => s.guesses[lessonId])
  const saveGuess = useProgress((s) => s.saveGuess)
  // Bản đoán có sẵn lúc mở bước này thì là "xem lại"; vừa chốt xong thì vẫn là màn đoán
  const [recap] = useState(() => !!saved)
  const [picks, setPicks] = useState<Record<string, Relation>>({})
  const [conf, setConf] = useState<Confidence>()
  const [checked, setChecked] = useState(recap)
  const pickAt = (id: string) => (recap ? pickOf(saved, id) : picks[id])
  const score = data.pairs.filter((p) => pickAt(p.id) === p.answer).length
  const all = data.pairs.length
  const ready = data.pairs.every((p) => picks[p.id]) && !!conf
  const confidence = recap ? saved?.confidence : conf

  const check = () => {
    if (!conf) return
    saveGuess(lessonId, { picks, confidence: conf, at: new Date().toISOString() })
    setChecked(true)
  }

  return (
    <StepFrame
      feedback={
        checked && !recap ? (
          <div className="mx-auto max-w-[864px] px-4 pt-3">
            {score === all ? (
              <FeedbackBar kind="correct" title={`Đúng cả ${all} cặp.`}>Bản đoán đã được lưu. Cuối ga, bạn sẽ vẽ lại nó trên giấy.</FeedbackBar>
            ) : (
              <FeedbackBar kind="wrong" title={confidence === 'sure' ? 'Sai lúc đang rất chắc.' : `Đúng ${score} trên ${all} cặp.`}>
                {confidence === 'sure' && `${data.wrongSure} `}Bản đoán đã được lưu. Cuối ga, bạn sẽ sửa lại nó trên giấy.
              </FeedbackBar>
            )}
          </div>
        ) : null
      }
      footer={
        checked ? (
          <>
            <span />
            <Button onClick={onDone}>{lesson ? 'Xem bài giải thích' : 'Tiếp tục'}</Button>
          </>
        ) : (
          <>
            <Button variant="link" onClick={onDone}>
              Bỏ qua
            </Button>
            <Button disabled={!ready} onClick={check}>
              Chốt bản đoán
            </Button>
          </>
        )
      }
    >
      <p className="m-0 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <Chip tone="sun">{recap ? 'Bản đoán lần trước' : 'Đoán trước'}</Chip>
        <span className="text-sm text-muted">{recap ? `Đúng ${score} trên ${all} cặp lúc đoán.` : 'Chưa học phần này. Cứ đoán, sai cũng được.'}</span>
      </p>
      {recap ? (
        <>
          <h1 className="mt-4 mb-2 text-[28px] leading-[1.15] font-extrabold tracking-[-0.02em]">Lần trước bạn đã nối thế này</h1>
          <p className="mt-0 mb-5 max-w-[60ch] text-muted">Giữ nó trong đầu khi đọc. Cuối ga, bạn sẽ vẽ lại và sửa những cặp chưa đúng.</p>
        </>
      ) : lesson ? (
        <h1 className="mt-4 mb-3 max-w-[34ch] text-[28px] leading-[1.15] font-extrabold tracking-[-0.02em]">{data.prompt}</h1>
      ) : (
        <>
          <h1 className="mt-3 mb-2 text-[28px] leading-tight font-extrabold tracking-[-0.02em]">Đoán thử trước khi học ga sau</h1>
          <p className="mt-0 mb-3 max-w-[60ch] text-lg leading-snug font-semibold">{data.prompt}</p>
        </>
      )}
      {data.legend && !recap && <p className="mt-0 mb-5 max-w-[60ch] rounded-xl bg-subtle px-4 py-3 text-[15px] leading-snug">{data.legend}</p>}
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {data.pairs.map((p) => (
          <PairRow key={p.id} pair={p} pick={pickAt(p.id)} onPick={(r) => setPicks((s) => ({ ...s, [p.id]: r }))} checked={checked} reveal />
        ))}
      </ol>
      {!recap && (
        <div className="mt-6 flex flex-col items-start gap-2">
          <span className="font-bold">Bạn chắc tới đâu?</span>
          <ConfidenceControl value={conf} onChange={(v) => !checked && setConf(v)} />
        </div>
      )}
    </StepFrame>
  )
}

/** Bản đoán đã lưu, chỉ đánh dấu cặp chưa đúng mà không hiện đáp án: dùng ở bước hệ thống lại. */
export function GuessedPairs({ data, guess }: { data: RelateData; guess: GuessRecord }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-2 p-0">
      {data.pairs.map((p) => {
        const pick = pickOf(guess, p.id)
        const right = pick === p.answer
        return (
          <li key={p.id} className={`rounded-xl px-3 py-2.5 text-[15px] leading-snug ${right ? 'bg-correct-soft' : 'bg-wrong-soft'}`}>
            <span className="font-semibold">{p.left}</span> <b className="whitespace-nowrap">→ {pick ? relationLabel[pick] : 'chưa chọn'} →</b> <span className="font-semibold">{p.right}</span>
            <span className={`ml-2 text-sm font-bold whitespace-nowrap ${right ? 'text-correct-ink' : 'text-wrong-ink'}`}>{right ? 'đúng' : 'cần sửa'}</span>
          </li>
        )
      })}
    </ol>
  )
}

import { Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { lessons } from '@/content/lessons'
import { sketchTitles } from '@/content/mock/sketches'
import { goalOf } from '@/content/skills'
import { useProgress, worstOutcome, type Outcome } from '@/learning/progress'
import type { Lesson } from '@/learning/types'
import { ExerciseView } from '@/exercises/ExerciseView'
import { Button } from '@/ui/Button'
import { Chip } from '@/ui/Chip'
import { SessionHeader } from '@/ui/SessionHeader'
import { StepDots } from '@/ui/StepDots'
import { StepFrame } from '@/ui/StepFrame'
import { NotFound } from './NotFound'
import { useGoalModel } from './goal/useGoalModel'
import { GuessStep } from './lesson/GuessStep'
import { LessonIntro } from './lesson/LessonIntro'
import { PaperStep } from './lesson/PaperStep'
import { Reorganize } from './lesson/Reorganize'
import { SketchUnlock } from './lesson/SketchUnlock'
import { StationPass } from './lesson/StationPass'

export function LessonPage() {
  const { lessonId = '' } = useParams()
  const lesson = lessons[lessonId]
  if (!lesson)
    return (
      <div className="mx-auto max-w-5xl px-4">
        <NotFound />
      </div>
    )
  return <LessonPlayer key={lesson.id} lesson={lesson} />
}

type Screen = { at: 'intro' } | { at: 'step'; i: number } | { at: 'pass' } | { at: 'reorganize' } | { at: 'sketch' }

/**
 * Có `embedded` thì đang nằm trong buổi học: nút đóng gọi `embedded.onExit`, thanh trên dính dưới
 * thanh buổi học (`stickyTop`), các bước đoán trước / giấy / hệ thống lại do buổi học đảm nhiệm nên bị bỏ qua,
 * và màn "Qua ga" kết thúc bằng nút "Tiếp tục" gọi `embedded.onComplete`.
 */
export interface LessonEmbed {
  onExit: () => void
  onComplete: () => void
  stickyTop: number
}

export function LessonPlayer({ lesson, embedded }: { lesson: Lesson; embedded?: LessonEmbed }) {
  const saved = useProgress((s) => s.lessonStep[lesson.id] ?? 0)
  const setLessonStep = useProgress((s) => s.setLessonStep)
  const record = useProgress((s) => s.record)
  const outcomes = useRef<Outcome[]>([])
  const setFollow = useProgress((s) => s.setFollow)
  const navigate = useNavigate()
  const goal = goalOf(lesson.skill)
  const model = useGoalModel(goal.id)
  const [wide, setWide] = useState(false)

  const steps = lesson.steps
  const allowed = (i: number) => !embedded || steps[i].kind === 'explain' || steps[i].kind === 'exercise'
  const firstAllowed = (from: number) => {
    let i = from
    while (i < steps.length && !allowed(i)) i++
    return i
  }
  const [screen, setScreen] = useState<Screen>(() => (saved > 0 && saved < steps.length ? { at: 'step', i: firstAllowed(saved) } : { at: 'intro' }))

  // Vào ga nào thì theo mục tiêu của ga đó
  useEffect(() => setFollow(goal.id), [goal.id, setFollow])

  // Lưu vị trí để quay lại học tiếp
  useEffect(() => {
    if (screen.at === 'step') setLessonStep(lesson.id, screen.i)
  }, [screen, lesson.id, setLessonStep])

  // Đầu mỗi màn, cuộn lên đầu trang
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [screen])

  const exit = () => (embedded ? embedded.onExit() : navigate('/'))
  const go = (from: number) => {
    const i = firstAllowed(from)
    if (i >= steps.length) {
      record(lesson.skill, worstOutcome(outcomes.current), 'lesson')
      setLessonStep(lesson.id, 0)
      setScreen({ at: 'pass' })
    } else setScreen({ at: 'step', i })
  }

  const countable = steps.map((_, i) => i).filter(allowed)
  const total = countable.length + (!embedded && lesson.reorganize ? 1 : 0)
  const pos = screen.at === 'step' ? countable.indexOf(screen.i) + 1 : screen.at === 'reorganize' ? total : 0
  const done = screen.at === 'intro' ? 0 : screen.at === 'step' ? pos : screen.at === 'pass' ? countable.length : total
  const exerciseNo = (i: number) => steps.slice(0, i + 1).filter((s) => s.kind === 'exercise').length
  const exerciseTotal = steps.filter((s) => s.kind === 'exercise').length

  const nextStation = () => {
    if (!embedded && lesson.reorganize) setScreen({ at: 'reorganize' })
    else if (!embedded && sketchTitles[lesson.skill]) setScreen({ at: 'sketch' })
    else if (embedded) embedded.onComplete()
    else navigate(`/goal/${goal.id}`)
  }
  const afterReorganize = () => (sketchTitles[lesson.skill] ? setScreen({ at: 'sketch' }) : navigate(`/goal/${goal.id}`))

  const key = screen.at === 'step' ? screen.i : screen.at
  const passPrimary = embedded ? 'Tiếp tục' : lesson.reorganize ? `Hệ thống lại · ${lesson.reorganize.minutes} phút` : sketchTitles[lesson.skill] ? `Mở khóa ${sketchTitles[lesson.skill].length} sketch` : 'Xem bản đồ'

  return (
    <div className="min-h-dvh">
      <header className="sticky z-30 bg-bg/95 backdrop-blur" style={{ top: embedded?.stickyTop ?? 0 }}>
        <div className={`mx-auto px-4 py-2.5 ${wide ? 'max-w-[1184px]' : 'max-w-[864px]'}`}>
          <SessionHeader current={pos} total={total} done={done} onClose={exit} showCount={!embedded && screen.at !== 'intro' && screen.at !== 'pass' && screen.at !== 'sketch'} />
        </div>
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          // chỉ đổi độ mờ: transform trên phần tử cha làm thanh `fixed` ở đáy bị neo sai chỗ
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {screen.at === 'intro' && <LessonIntro lesson={lesson} onStart={() => go(firstAllowed(0))} />}
          {screen.at === 'step' && <StepScreen lesson={lesson} i={screen.i} go={go} exerciseNo={exerciseNo(screen.i)} exerciseTotal={exerciseTotal} outcomes={outcomes.current} />}
          {screen.at === 'pass' && <StationPass lesson={lesson} outcomes={outcomes.current} primary={passPrimary} onPrimary={nextStation} onLater={exit} />}
          {screen.at === 'reorganize' && lesson.reorganize && <Reorganize lesson={lesson} data={lesson.reorganize} onDone={afterReorganize} onLater={() => navigate('/')} onStage={setWide} />}
          {screen.at === 'sketch' && <SketchUnlock lesson={lesson} goal={goal} no={model.noOf[lesson.skill] ?? 0} opened={model.sketchOpen} total={model.sketchTotal} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function StepScreen({ lesson, i, go, exerciseNo, exerciseTotal, outcomes }: { lesson: Lesson; i: number; go: (i: number) => void; exerciseNo: number; exerciseTotal: number; outcomes: Outcome[] }) {
  const step = lesson.steps[i]
  const explains = lesson.steps.flatMap((s, k) => (s.kind === 'explain' ? [k] : []))
  if (step.kind === 'guess') return <GuessStep data={step.data} lesson onDone={() => go(i + 1)} />
  if (step.kind === 'paper') return <PaperStep data={step.data} onDone={() => go(i + 1)} />
  if (step.kind === 'exercise') {
    const isLast = lesson.steps.slice(i + 1).every((s) => s.kind !== 'exercise' && s.kind !== 'explain')
    return (
      <ExerciseView
        exercise={step.exercise}
        eyebrow={`Bài tập ${exerciseNo} / ${exerciseTotal}`}
        caption={step.label}
        doneLabel={isLast ? 'Xong bài' : 'Tiếp'}
        onDone={(o) => {
          outcomes.push(o)
          go(i + 1)
        }}
      />
    )
  }
  const Body = step.Body
  const prevExplain = i > 0 && lesson.steps[i - 1].kind === 'explain'
  return (
    <StepFrame
      footer={
        <>
          {prevExplain ? <Button variant="link" onClick={() => go(i - 1)}>Quay lại</Button> : <span />}
          <Button onClick={() => go(i + 1)} className="min-w-40">Tiếp</Button>
        </>
      }
    >
      <p className="m-0 flex items-center justify-between gap-3">
        <Chip tone="violet">Giải thích</Chip>
        {explains.length > 1 && <StepDots total={explains.length} current={explains.indexOf(i) + 1} />}
      </p>
      <h1 className="mt-3 mb-4 text-[28px] leading-[1.1] font-extrabold tracking-[-0.02em] min-[720px]:text-[34px]">{step.title}</h1>
      <div className="prose-lesson text-lg">
        <Suspense fallback={<p className="text-muted">Đang tải…</p>}>
          <Body />
        </Suspense>
      </div>
    </StepFrame>
  )
}

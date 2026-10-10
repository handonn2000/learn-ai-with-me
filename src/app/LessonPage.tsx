import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { X, Check, AlertCircle } from 'lucide-react'
import { lessons } from '@/content/lessons'
import { goals, skillIndex } from '@/content/skills'
import { useGoalRoute } from '@/learning/hooks'
import { dueLabel, statusOf, useProgress, worstOutcome, type Outcome } from '@/learning/progress'
import type { Lesson } from '@/learning/types'
import { ExerciseView } from '@/exercises/ExerciseView'
import { Button, ButtonLink } from '@/ui/Button'
import { RouteBar } from '@/ui/RouteBar'
import { StepFrame } from '@/ui/StepFrame'
import { NotFound } from './NotFound'

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

type Screen = { at: 'intro' } | { at: 'step'; i: number } | { at: 'finish' }

function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const saved = useProgress((s) => s.lessonStep[lesson.id] ?? 0)
  const setLessonStep = useProgress((s) => s.setLessonStep)
  const record = useProgress((s) => s.record)
  const [screen, setScreen] = useState<Screen>(() => (saved > 0 && saved < lesson.steps.length ? { at: 'step', i: saved } : { at: 'intro' }))
  const outcomes = useRef<Outcome[]>([])
  const navigate = useNavigate()
  const goalId = goals[0].id

  // Lưu vị trí để quay lại học tiếp
  useEffect(() => {
    if (screen.at === 'step') setLessonStep(lesson.id, screen.i)
  }, [screen, lesson.id, setLessonStep])

  // Đầu mỗi bước, cuộn lên đầu trang
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [screen])

  const go = (i: number) => {
    if (i >= lesson.steps.length) {
      const o = worstOutcome(outcomes.current)
      record(lesson.skill, o, 'lesson')
      setLessonStep(lesson.id, 0)
      setScreen({ at: 'finish' })
    } else setScreen({ at: 'step', i })
  }

  const current = screen.at === 'step' ? screen.i : screen.at === 'finish' ? lesson.steps.length : -1
  const stations = lesson.steps.map((s, i) => ({
    kind: s.kind,
    state: (i < current ? 'done' : i === current ? 'current' : 'todo') as 'done' | 'current' | 'todo',
    label: s.kind === 'explain' ? s.title : `Bài tập ${i + 1}`,
  }))

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 sm:px-6">
          <button
            onClick={() => navigate(`/goal/${goalId}`)}
            className="grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-surface hover:text-ink"
            aria-label="Thoát bài học"
          >
            <X size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <RouteBar stations={stations} />
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={screen.at === 'step' ? screen.i : screen.at}
          // chỉ đổi độ mờ: transform trên phần tử cha làm thanh `fixed` ở đáy bị neo sai chỗ
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {screen.at === 'intro' && <Intro lesson={lesson} onStart={() => go(0)} />}
          {screen.at === 'step' &&
            (() => {
              const step = lesson.steps[screen.i]
              if (step.kind === 'explain') {
                const Body = step.Body
                return (
                  <StepFrame
                    footer={
                      <>
                        {screen.i > 0 && lesson.steps[screen.i - 1].kind === 'explain' ? (
                          <Button variant="ghost" onClick={() => go(screen.i - 1)}>
                            Quay lại
                          </Button>
                        ) : (
                          <span />
                        )}
                        <Button onClick={() => go(screen.i + 1)}>
                          Tiếp tục
                        </Button>
                      </>
                    }
                  >
                    <h1 className="mb-5 text-[28px] leading-tight font-bold tracking-tight">{step.title}</h1>
                    <div className="prose-lesson">
                      <Suspense fallback={<p className="text-muted">Đang tải…</p>}>
                        <Body />
                      </Suspense>
                    </div>
                  </StepFrame>
                )
              }
              const isLast = screen.i === lesson.steps.length - 1
              return (
                <ExerciseView
                  exercise={step.exercise}
                  doneLabel={isLast ? 'Hoàn thành' : 'Tiếp tục'}
                  onDone={(o) => {
                    outcomes.current.push(o)
                    go(screen.i + 1)
                  }}
                />
              )
            })()}
          {screen.at === 'finish' && <Finish lesson={lesson} outcomes={outcomes.current} goalId={goalId} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Intro({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
  const skill = skillIndex[lesson.skill]
  const records = useProgress((s) => s.skills)
  const exercises = lesson.steps.filter((s) => s.kind === 'exercise').length
  return (
    <StepFrame
      footer={
        <>
          <span className="text-[14px] text-muted">
            khoảng {lesson.minutes} phút · {exercises} bài tập
          </span>
          <Button onClick={onStart}>
            Bắt đầu
          </Button>
        </>
      }
    >
      <h1 className="text-[34px] leading-tight font-bold tracking-tight sm:text-[40px]">{skill.title}</h1>
      <div className="mt-8 rounded-2xl border-2 border-route bg-surface p-5">
        <p className="text-[14px] font-semibold text-route">Học xong bạn làm được</p>
        <p className="mt-1 text-lg leading-snug">{skill.can}</p>
      </div>
      {skill.prereqs.length > 0 && (
        <div className="mt-8">
          <p className="text-[15px] font-semibold">Cần biết trước</p>
          <ul className="mt-3 space-y-2">
            {skill.prereqs.map((p) => {
              const ps = skillIndex[p]
              const ok = statusOf(records[p]) !== 'new'
              return (
                <li key={p} className="flex items-start gap-3">
                  {ok ? <Check size={18} className="mt-1 shrink-0 text-route" /> : <AlertCircle size={18} className="mt-1 shrink-0 text-signal" />}
                  <span className="text-[15px] leading-snug">
                    <span className="font-medium">{ps.title}</span>
                    <span className="text-muted"> — {ps.can}</span>
                    {!ok && ps.lesson && (
                      <>
                        {' '}
                        <Link to={`/learn/${ps.lesson}`} className="font-medium whitespace-nowrap text-route underline-offset-4 hover:underline">
                          Học ga này trước
                        </Link>
                      </>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      {skill.prereqs.length === 0 && <p className="mt-8 text-[15px] text-muted">Không cần biết gì trước. Bắt đầu từ đây được.</p>}
    </StepFrame>
  )
}

const resultText: Record<Outcome, string> = {
  clean: 'Bạn tự làm đúng hết.',
  hinted: 'Có lúc bạn cần gợi ý, nên kỹ năng này sẽ quay lại sớm hơn để củng cố.',
  revealed: 'Có bài bạn phải xem lời giải, nên kỹ năng này sẽ quay lại sớm để bạn làm lại.',
}

function Finish({ lesson, outcomes, goalId }: { lesson: Lesson; outcomes: Outcome[]; goalId: string }) {
  const skill = skillIndex[lesson.skill]
  const rec = useProgress((s) => s.skills[lesson.skill])
  const { nextId } = useGoalRoute(goalId)
  const next = nextId ? skillIndex[nextId] : null
  const o = worstOutcome(outcomes)
  const clean = outcomes.filter((x) => x === 'clean').length
  return (
    <StepFrame
      footer={
        <>
          <ButtonLink to={`/goal/${goalId}`} variant="ghost">
            Về tuyến
          </ButtonLink>
          {next?.lesson ? (
            <ButtonLink to={`/learn/${next.lesson}`}>Ga tiếp: {next.title}</ButtonLink>
          ) : (
            <ButtonLink to="/">Xong</ButtonLink>
          )}
        </>
      }
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="grid size-14 place-items-center rounded-full bg-route text-surface"
      >
        <Check size={28} strokeWidth={3} />
      </motion.div>
      <h1 className="mt-6 text-[34px] leading-tight font-bold tracking-tight">Qua ga {skill.title}</h1>
      <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
        <p className="text-[14px] font-semibold text-route">Giờ bạn làm được</p>
        <p className="mt-1 text-lg leading-snug">{skill.can}</p>
      </div>
      <p className="mt-6 max-w-[60ch] text-[15px] leading-relaxed text-muted">
        {clean}/{outcomes.length} bài tập tự làm đúng không cần trợ giúp. {resultText[o]}
        {rec && ` Lần ôn tiếp theo: ${dueLabel(rec)}.`}
      </p>
    </StepFrame>
  )
}

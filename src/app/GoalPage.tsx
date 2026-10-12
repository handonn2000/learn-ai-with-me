import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { courses } from '@/content/courses'
import { goalIndex } from '@/content/skills'
import { goalMaps } from '@/content/goalMaps'
import { ChevronRightIcon, ListIcon, MapIcon } from '@/ui/icons'
import { useMedia } from '@/ui/useMedia'
import { ViewToggle, useView, type View } from '@/ui/ViewToggle'
import { ComingSoon } from './ComingSoon'
import { NotFound } from './NotFound'
import { GoalList } from './goal/GoalList'
import { GoalMap } from './goal/GoalMap'
import { Legend, ParallelNote, StationPanel } from './goal/StationPanel'
import { useGoalModel } from './goal/useGoalModel'

export function GoalPage() {
  const { goalId = '' } = useParams()
  if (!goalIndex[goalId]) {
    const mock = courses.flatMap((c) => c.goals).find((g) => g.id === goalId)
    return mock ? <ComingSoon title={mock.title} /> : <NotFound />
  }
  return <Goal goalId={goalId} />
}

/** Mục tiêu: bản đồ ga (kèm panel/bottom sheet) hoặc danh sách. `?view=map|list`, nhớ lựa chọn gần nhất. */
function Goal({ goalId }: { goalId: string }) {
  const model = useGoalModel(goalId)
  const phone = useMedia('(max-width: 719px)')
  const [params, setParams] = useSearchParams()
  const [stored, setStored] = useView()
  const layouts = goalMaps[goalId]
  const asked = params.get('view')
  const view: View = !layouts ? 'list' : asked === 'list' || asked === 'map' ? asked : stored
  const setView = (v: View) => {
    setStored(v)
    setParams({ view: v }, { replace: true })
  }
  const [picked, setPicked] = useState<string | null>(null)
  const selectedId = picked ?? model.today?.id ?? model.stations[model.stations.length - 1].id
  const st = model.stations.find((s) => s.id === selectedId)!
  const course = courses.find((c) => c.goals.some((g) => g.goalId === goalId))
  const summary = `${model.done}/${model.total} ga · ${model.sketchOpen}/${model.sketchTotal} sketch`

  return (
    <div className={phone && view === 'map' ? 'pb-[280px]' : ''}>
      {/* Điện thoại: thanh riêng thay cho thanh trên của khung chung */}
      <div className="sticky top-0 z-10 -mx-4 flex items-center gap-2 bg-bg px-3 py-2.5 min-[720px]:hidden">
        <Link to={course ? `/courses/${course.id}` : '/courses'} aria-label="Quay lại khóa học" className="grid size-11 place-items-center text-ink">
          <ChevronRightIcon width={22} height={22} className="rotate-180" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="truncate text-lg leading-tight font-extrabold">{model.goal.title}</div>
          <div className="text-[13px] font-semibold text-muted">{summary}</div>
        </div>
        {layouts && (
          <button type="button" aria-label={view === 'map' ? 'Xem dạng danh sách' : 'Xem dạng bản đồ'} onClick={() => setView(view === 'map' ? 'list' : 'map')} className="grid size-11 place-items-center text-ink">
            {view === 'map' ? <ListIcon width={22} height={22} /> : <MapIcon width={22} height={22} />}
          </button>
        )}
      </div>

      <div className="pt-1 max-[719px]:hidden min-[720px]:pt-3">
        <nav aria-label="Vị trí" className="text-sm text-muted">
          <Link to="/courses" className="text-muted underline">Khóa học</Link>
          {course && (
            <>
              <span aria-hidden className="mx-2">/</span>
              <Link to={`/courses/${course.id}`} className="text-muted underline">{course.title}</Link>
            </>
          )}
        </nav>
        {view === 'map' && (
          <div className="mt-1.5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <h1 className="m-0 text-[44px] leading-none font-extrabold tracking-[-0.03em]">
              {model.goal.title} <span className="text-lg font-bold tracking-normal text-muted">· {summary}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-5">
              {layouts && <ViewToggle value={view} onChange={setView} />}
              <Link to={`/check/${goalId}`} className="font-bold text-violet">Kiểm tra nhanh để bỏ qua ga</Link>
            </div>
          </div>
        )}
        {view === 'list' && layouts && (
          <div className="mt-3 flex justify-end">
            <ViewToggle value={view} onChange={setView} />
          </div>
        )}
      </div>

      <div className="mt-3 min-[720px]:mt-5">
        {view === 'list' || !layouts ? (
          <GoalList model={model} />
        ) : phone ? (
          <>
            <div className="-mx-4">
              <GoalMap model={model} layout={layouts.phone} phone selected={selectedId} onSelect={setPicked} />
            </div>
            <section aria-label={`Ga ${st.no}: ${st.skill.title}`} className="fixed inset-x-0 bottom-[calc(max(18px,env(safe-area-inset-bottom))+62px)] z-20 rounded-t-3xl border-2 border-b-0 border-ink bg-surface px-4 pt-2.5 pb-3.5">
              <span aria-hidden className="mx-auto mb-2 block h-1 w-10 rounded-full bg-disabled-line" />
              <StationPanel model={model} st={st} compact />
            </section>
          </>
        ) : (
          <div className="flex flex-col gap-6 min-[1180px]:flex-row min-[1180px]:items-start">
            <div className="min-w-0 min-[1180px]:w-[780px] min-[1180px]:flex-none">
              <GoalMap model={model} layout={layouts.desktop} phone={false} selected={selectedId} onSelect={setPicked} />
            </div>
            <aside className="flex min-w-0 flex-1 flex-col gap-4">
              <section aria-label={`Ga ${st.no}: ${st.skill.title}`} className="rounded-3xl border-2 border-ink bg-surface p-5 shadow-block-lg" aria-live="polite">
                <StationPanel model={model} st={st} />
              </section>
              <ParallelNote model={model} />
              <Legend />
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}

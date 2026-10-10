import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ReactFlow, Background, Controls, Handle, Position, MarkerType, type Edge, type Node, type NodeProps } from '@xyflow/react'
import '@xyflow/react/dist/base.css'
import dagre from '@dagrejs/dagre'
import { goals, skills } from '@/content/skills'
import { useGoalRoute } from '@/learning/hooks'
import { statusOf, useProgress, type SkillStatus } from '@/learning/progress'

const W = 230
const H = 70

type SkillNodeData = { title: string; status: SkillStatus; hasLesson: boolean; onPath: boolean; next: boolean; source?: string }

function SkillNode({ data }: NodeProps<Node<SkillNodeData>>) {
  const border = data.next
    ? 'border-signal border-[3px]'
    : data.status === 'learned'
      ? 'border-route border-2'
      : data.status === 'due'
        ? 'border-signal border-2'
        : data.hasLesson
          ? 'border-line border-2'
          : 'border-line border-2 border-dashed'
  return (
    <div
      className={`flex h-[70px] w-[230px] flex-col justify-center rounded-xl bg-surface px-3 ${border}  ${data.hasLesson ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <Handle type="target" position={Position.Top} className="!size-1 !min-h-0 !min-w-0 !border-0 !bg-transparent" />
      <span className={`text-[14px] leading-tight font-semibold ${data.onPath ? 'text-ink' : 'text-muted'}`}>{data.title}</span>
      <span className="mt-1 text-[12px] text-muted">
        {!data.hasLesson
          ? 'Chưa có bài'
          : data.next
            ? 'Ga tiếp theo'
            : data.status === 'learned'
              ? 'Đã nắm'
              : data.status === 'due'
                ? 'Đến hạn ôn'
                : 'Chưa học'}
        {data.source && ` · ${data.source}`}
      </span>
      <Handle type="source" position={Position.Bottom} className="!size-1 !min-h-0 !min-w-0 !border-0 !bg-transparent" />
    </div>
  )
}

const nodeTypes = { skill: SkillNode }

/** Xếp tầng từ trên xuống: tiên quyết ở trên, kỹ năng cần nó ở dưới. */
function layout(): Record<string, { x: number; y: number }> {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'TB', ranksep: 56, nodesep: 28 })
  g.setDefaultEdgeLabel(() => ({}))
  for (const s of skills) g.setNode(s.id, { width: W, height: H })
  for (const s of skills) for (const p of s.prereqs) g.setEdge(p, s.id)
  dagre.layout(g)
  // dagre trả tâm nút; React Flow cần góc trên trái
  return Object.fromEntries(skills.map((s) => {
    const n = g.node(s.id)
    return [s.id, { x: n.x - W / 2, y: n.y - H / 2 }]
  }))
}

/** Bản đồ đầy đủ: mọi kỹ năng và cạnh tiên quyết. Tuyến của mục tiêu được tô đậm. */
export default function MapPage() {
  const records = useProgress((s) => s.skills)
  const { stations } = useGoalRoute(goals[0].id)
  const navigate = useNavigate()
  const onPath = useMemo(() => new Set(stations.map((s) => s.id)), [stations])
  const nextId = stations.find((s) => s.next)?.id
  const pos = useMemo(layout, [])

  const nodes: Node<SkillNodeData>[] = useMemo(
    () =>
      pos
        ? skills.map((s) => ({
            id: s.id,
            type: 'skill',
            position: pos[s.id],
            draggable: false,
            data: {
              title: s.title,
              status: statusOf(records[s.id]),
              hasLesson: !!s.lesson,
              onPath: onPath.has(s.id),
              next: s.id === nextId,
              source: s.source,
            },
          }))
        : [],
    [pos, records, onPath, nextId],
  )
  const edges: Edge[] = useMemo(
    () =>
      skills.flatMap((s) =>
        s.prereqs.map((p) => {
          const lit = onPath.has(s.id) && onPath.has(p)
          return {
            id: `${p}-${s.id}`,
            source: p,
            target: s.id,
            type: 'default',
            style: { stroke: lit ? 'var(--route)' : 'var(--line)', strokeWidth: lit ? 3 : 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: lit ? 'var(--route)' : 'var(--line)' },
          }
        }),
      ),
    [onPath],
  )

  return (
    <div className="pt-6">
      <h1 className="text-[28px] font-bold tracking-tight">Bản đồ kỹ năng</h1>
      <p className="mt-2 max-w-[62ch] text-[15px] leading-snug text-muted">
        Mũi tên đi từ kỹ năng cần trước tới kỹ năng cần nó. Đường tô màu là tuyến tới mục tiêu {goals[0].title}. Ô viền đứt là kỹ năng đã có trên bản đồ nhưng chưa có bài.
      </p>
      <div className="mt-6 h-[70vh] min-h-[520px] overflow-hidden rounded-2xl border border-line bg-paper">
        {pos && (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.12 }}
            minZoom={0.3}
            nodesConnectable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
            onNodeClick={(_, n) => {
              const s = skills.find((x) => x.id === n.id)
              if (s?.lesson) navigate(`/learn/${s.lesson}`)
            }}
          >
            <Background color="var(--line)" gap={22} />
            <Controls showInteractive={false} className="!shadow-none [&_button]:!border-line [&_button]:!bg-surface [&_svg]:!fill-[var(--ink)]" />
          </ReactFlow>
        )}
      </div>
    </div>
  )
}

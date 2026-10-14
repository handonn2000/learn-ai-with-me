import { describe, expect, it } from 'vitest'
import { skills } from '@/content/skills'
import { lessons } from '@/content/lessons'
import { grade, traceAnswer } from './grade'
import type { Exercise } from './types'

const allExercises: Exercise[] = [
  ...skills.flatMap((s) => s.checks),
  ...Object.values(lessons).flatMap((l) => l.steps.flatMap((st) => (st.kind === 'exercise' ? [st.exercise] : []))),
]

describe('bài tập', () => {
  it('id không trùng', () => {
    const ids = allExercises.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('đáp án hợp lệ với chính bài', () => {
    for (const ex of allExercises) {
      if (ex.kind === 'choice') ex.answer.forEach((i) => expect(ex.options[i], ex.id).toBeDefined())
      if (ex.kind === 'order') expect([...ex.answer].sort(), ex.id).toEqual([...ex.items].sort())
      if (ex.kind === 'pick-nodes')
        ex.answer.forEach((n) => expect(ex.problem.nodes.some((x) => x.id === n), ex.id).toBe(true))
      if (ex.kind === 'classify') ex.items.forEach((it) => expect((it.groups ?? ex.groups)[it.group], ex.id).toBeDefined())
      if (ex.kind === 'trace') expect(traceAnswer(ex).length, ex.id).toBe(ex.steps)
    }
  })

  it('chấm đúng/sai', () => {
    const ucs = skills.find((s) => s.id === 'ucs')!.checks[0]
    expect(grade(ucs, { kind: 'choice', picked: [1] })).toBe(true)
    expect(grade(ucs, { kind: 'choice', picked: [0] })).toBe(false)
  })

  it('mỗi lesson: 2–4 bài tập, ≤ 3 bước giải thích, ≤ 1 câu trắc nghiệm', () => {
    for (const l of Object.values(lessons)) {
      const ex = l.steps.filter((s) => s.kind === 'exercise')
      const explain = l.steps.filter((s) => s.kind === 'explain')
      expect(ex.length, l.id).toBeGreaterThanOrEqual(2)
      expect(ex.length, l.id).toBeLessThanOrEqual(4)
      expect(explain.length, l.id).toBeLessThanOrEqual(3)
      expect(ex.filter((s) => s.kind === 'exercise' && s.exercise.kind === 'choice').length, l.id).toBeLessThanOrEqual(1)
    }
  })
})

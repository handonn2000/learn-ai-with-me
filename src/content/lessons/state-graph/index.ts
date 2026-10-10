import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
import { city } from '@/content/graphs'
const S1 = lazy(() => import('./1.mdx'))

export const lesson: Lesson = {
  id: 'state-graph',
  skill: 'state-graph',
  minutes: 7,
  steps: [
    { kind: 'explain', title: 'Bản đồ trạng thái', Body: S1 },
    {
      kind: 'exercise',
      exercise: {
        id: 'state-graph-e1',
        kind: 'pick-nodes',
        prompt: 'Chọn mọi trạng thái kế tiếp của C.',
        problem: city,
        highlight: { current: 'C' },
        answer: ['A', 'B', 'E', 'G'],
        hint: 'Đếm mọi cạnh chạm vào C. Mỗi cạnh dẫn tới một trạng thái kế tiếp.',
        explain: 'C có bốn cạnh, tới <b>A, B, E và G</b>.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'state-graph-e2',
        kind: 'number',
        prompt: 'Đường S → A → E → G tốn bao nhiêu phút?',
        problem: city,
        showCosts: true,
        answer: 13,
        unit: 'phút',
        hint: 'Có ba cạnh: S–A, A–E và E–G.',
        explain: '3 + 7 + 3 = <b>13</b> phút.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'state-graph-e3',
        kind: 'choice',
        prompt: 'Đường nào rẻ hơn?',
        options: ['S → A → C → G', 'S → A → C → E → G', 'Hai đường bằng nhau'],
        answer: [1],
        hint: 'Tính riêng từng đường. Đường nhiều cạnh hơn chưa chắc đắt hơn.',
        explain: 'S → A → C → G tốn 3 + 3 + 7 = 13 phút. S → A → C → E → G tốn 3 + 3 + 3 + 3 = <b>12</b> phút. Đi thêm một chặng mà lại rẻ hơn — nhớ điều này, nó quay lại ở bài UCS.',
      },
    },
  ],
}

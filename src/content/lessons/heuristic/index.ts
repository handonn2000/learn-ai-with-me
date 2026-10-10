import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
import { city } from '@/content/graphs'
const S1 = lazy(() => import('./1.mdx'))

export const lesson: Lesson = {
  id: 'heuristic',
  skill: 'heuristic',
  minutes: 8,
  steps: [
    { kind: 'explain', title: 'Đoán phần đường còn lại', Body: S1 },
    {
      kind: 'exercise',
      exercise: {
        id: 'heuristic-e1',
        kind: 'pick-nodes',
        prompt: 'Theo h, những nút nào trông gần trường hơn C?',
        problem: city,
        showH: true,
        highlight: { current: 'C' },
        answer: ['D', 'E', 'G'],
        hint: 'h(C) = 4. Tìm các nút có h nhỏ hơn 4.',
        explain: 'D (3), E (2) và G (0). G là đích nên h(G) = 0.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'heuristic-e2',
        kind: 'classify',
        prompt: 'Mỗi con số dưới đây là g(C), h(C) hay h*(C)?',
        groups: ['g(C)', 'h(C)', 'h*(C)'],
        items: [
          { text: 'Số phút bạn đã đi từ nhà tới C theo đường đang xét', group: 0 },
          { text: 'Khoảng cách đường chim bay từ C tới trường, đổi ra phút', group: 1 },
          { text: 'Số phút thật của đường rẻ nhất từ C tới trường', group: 2 },
        ],
        hint: 'Một số nhìn về phía sau, một số là phỏng đoán phía trước, một số là sự thật phía trước.',
        explain: 'g nhìn lại quãng đã đi. h là phỏng đoán quãng còn lại. h* là đáp án thật của quãng còn lại.',
      },
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'heuristic-e3',
        kind: 'choice',
        prompt: 'Bạn tới C bằng hai đường: S → A → C và S → B → C. Giữa hai lần, cái gì thay đổi?',
        options: ['Cả g(C) và h(C)', 'Chỉ g(C)', 'Chỉ h(C)', 'Không cái nào'],
        answer: [1],
        hint: 'h phụ thuộc vào cái gì? g phụ thuộc vào cái gì?',
        explain: 'g(C) là 6 qua A và 7 qua B. h(C) vẫn là 4 vì nó chỉ phụ thuộc vào việc bạn đang ở C.',
      },
    },
  ],
}

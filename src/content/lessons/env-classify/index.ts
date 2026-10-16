import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
import { dimItems } from '@/content/agents'
const S1 = lazy(() => import('./1.mdx'))
const S2 = lazy(() => import('./2.mdx'))
const S3 = lazy(() => import('./3.mdx'))

export const lesson: Lesson = {
  id: 'env-classify',
  skill: 'env-classify',
  minutes: 12,
  steps: [
    {
      kind: 'guess',
      data: {
        prompt: 'Cờ vua có bấm giờ: bàn cờ không tự đổi trong lúc bạn nghĩ, nhưng đồng hồ vẫn chạy. Môi trường (environment) này tĩnh (static), động (dynamic), hay ở giữa?',
        options: [
          { title: 'Tĩnh', note: 'bàn cờ đứng yên' },
          { title: 'Nửa động', note: 'bàn cờ đứng yên, điểm thì không' },
          { title: 'Động', note: 'đồng hồ đang chạy' },
        ],
        answer: 1,
        right: 'Bàn cờ đứng yên chờ bạn, nhưng thời gian bị trừ thì làm điểm của bạn đổi theo. Môi trường không đổi mà điểm thì đổi: đó là nửa động (semidynamic).',
        wrong: 'Bàn cờ không tự đổi khi bạn nghĩ, nên chưa phải động. Nhưng đồng hồ trừ thời gian làm điểm của bạn đổi theo, nên cũng không hoàn toàn tĩnh. Vế ở giữa đó là nửa động.',
        wrongSure: 'Vế "nửa động" là vế hay bị quên nhất, nên ý này sẽ quay lại sớm hơn.',
      },
    },
    { kind: 'explain', title: 'Thế giới có chờ bạn nghĩ không', Body: S1 },
    { kind: 'explain', title: 'Đếm được không, biết luật chưa', Body: S2 },
    { kind: 'explain', title: 'Bảng bảy chiều', Body: S3 },
    {
      kind: 'exercise',
      exercise: {
        id: 'env-classify-e1',
        kind: 'classify',
        prompt: 'Xếp loại môi trường của một agent chơi cờ tướng có bấm giờ theo sáu chiều.',
        groups: [],
        items: dimItems({ obs: 0, agents: 1, det: 0, ep: 1, static: 1, disc: 0 }),
        hint: 'Cờ tướng giống cờ vua ở mọi chiều. Chiều thời gian: bàn cờ có tự đổi không, điểm thì sao?',
        explain: 'Giống hệt hàng cờ vua có đồng hồ: <b>đầy đủ, nhiều, tất định, tuần tự, nửa động, rời rạc</b>.',
      },
      label: 'Xếp đủ sáu chiều',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'env-classify-e2',
        kind: 'classify',
        prompt: 'Môi trường của mỗi agent dưới đây là tĩnh, nửa động hay động?',
        groups: ['Tĩnh', 'Nửa động', 'Động'],
        items: [
          { text: 'Giải Sudoku in trên báo', group: 0 },
          { text: 'Làm bài thi trắc nghiệm có giờ: đề không đổi, nhưng hết giờ thì mất điểm câu chưa làm', group: 1 },
          { text: 'Robot hút bụi trong nhà có con mèo chạy lung tung', group: 2 },
          { text: 'Agent chơi game đua xe', group: 2 },
        ],
        hint: 'Hai câu hỏi: trong lúc agent nghĩ, môi trường có tự đổi không? Nếu không, điểm có bị trừ theo thời gian không?',
        explain: 'Sudoku đứng yên chờ bạn: <b>tĩnh</b>. Đề thi đứng yên nhưng thời gian trừ vào điểm: <b>nửa động</b>. Con mèo và xe đối thủ không chờ ai: <b>động</b>.',
      },
      label: 'Phân biệt tĩnh, nửa động, động',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'env-classify-e3',
        kind: 'choice',
        prompt: 'Bạn ngồi trước bàn cờ tướng lần đầu tiên, chưa ai chỉ luật, nhưng thấy rõ mọi quân trên bàn. Với bạn lúc này, môi trường là gì?',
        options: ['Quan sát đầy đủ, biết luật', 'Quan sát đầy đủ, chưa biết luật', 'Quan sát một phần, biết luật', 'Quan sát một phần, chưa biết luật'],
        answer: [1],
        hint: 'Hai chiều này hỏi hai chuyện khác nhau: thấy được bao nhiêu, và biết hành động sẽ dẫn tới đâu.',
        explain: 'Thấy hết bàn cờ là <b>quan sát đầy đủ</b>. Chưa biết quân nào đi thế nào là <b>chưa biết luật</b>. Hai chiều này độc lập với nhau.',
      },
      label: 'Tách biết luật khỏi quan sát được',
    },
    {
      kind: 'paper',
      data: {
        title: 'Bịt mắt bắt dê: viết PEAS rồi xếp loại môi trường.',
        minutes: 5,
        steps: [
          'Đề: Một cậu bé chơi bịt mắt bắt dê với bạn trên sân. Cậu bị bịt mắt, phải chạm được vào một bạn để đổi vai, trong khi các bạn la hét, cười đùa để đánh lạc hướng.',
          'Viết PEAS cho người bị bịt mắt, mỗi chữ ít nhất hai mục.',
          'Xếp loại môi trường theo bảy chiều, mỗi chiều một câu lý do. Đề gốc chỉ hỏi bốn chiều đầu; ba chiều sau là phần luyện thêm.',
        ],
        reference: [
          '<b>P</b>: chạm được vào một bạn, càng nhanh càng tốt; không va vào vật cản, không ngã.',
          '<b>E</b>: sân chơi, vật cản, các bạn đang né và la hét. <b>A</b>: chân để đi, tay để quờ và chạm. <b>S</b>: tai, và xúc giác ở tay. Không có mắt: đó là chỗ khác trò trốn tìm.',
          '<b>Quan sát một phần</b>: mắt bị bịt, tiếng la hét còn cố tình làm "cảm biến" tai bị nhiễu. <b>Nhiều agent</b> cạnh tranh: các bạn muốn không bị chạm.',
          '<b>Ngẫu nhiên</b>: tình huống thật, bước đi trên sân không chắc chắn. <b>Tuần tự</b>: đi về hướng nào bây giờ quyết định chỗ sẽ quờ tiếp.',
          '<b>Động</b>: các bạn vẫn chạy trong lúc cậu bé đứng nghĩ. <b>Liên tục</b>: vị trí và bước chân thay đổi liên tục. <b>Biết luật</b>: cậu bé biết luật chơi và biết đi, chạm sẽ ra sao.',
        ],
      },
    },
  ],
}

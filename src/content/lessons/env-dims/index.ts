import { lazy } from 'react'
import type { Lesson } from '@/learning/types'
import { dimItems } from '@/content/agents'
const S1 = lazy(() => import('./1.mdx'))
const S2 = lazy(() => import('./2.mdx'))

export const lesson: Lesson = {
  id: 'env-dims',
  skill: 'env-dims',
  minutes: 12,
  steps: [
    {
      kind: 'guess',
      data: {
        prompt: 'Cờ vua có hai người chơi, và bạn không biết đối thủ sẽ đi nước nào. Theo cách môn này phân loại, môi trường cờ vua tất định hay ngẫu nhiên?',
        options: [
          { title: 'Tất định', note: 'biết thế cờ và nước đi thì biết thế cờ kế tiếp' },
          { title: 'Ngẫu nhiên', note: 'vì không đoán được đối thủ' },
        ],
        answer: 0,
        right: 'Tất định chỉ hỏi: biết trạng thái hiện tại và hành động thì trạng thái kế tiếp có xác định hoàn toàn không. Với cờ vua là có. Cái khó đoán của đối thủ được tính ở chiều "nhiều tác tử".',
        wrong: 'Môn này không tính phần bất định chỉ đến từ nước đi của tác tử khác; phần đó thuộc chiều "nhiều tác tử". Biết thế cờ và nước đi thì thế cờ kế tiếp xác định hoàn toàn, nên cờ vua là tất định.',
        wrongSure: 'Lẫn "đối thủ khó đoán" với "ngẫu nhiên" là lỗi rất hay gặp, nên ý này sẽ quay lại sớm hơn.',
      },
    },
    { kind: 'explain', title: 'Thấy được bao nhiêu, chơi với ai', Body: S1 },
    { kind: 'explain', title: 'Đoán trước được không, có dắt dây không', Body: S2 },
    {
      kind: 'exercise',
      exercise: {
        id: 'env-dims-e1',
        kind: 'classify',
        prompt: 'Xếp loại môi trường của một tác tử giải Sudoku.',
        groups: [],
        items: dimItems({ obs: 0, agents: 0, det: 0, ep: 1 }),
        hint: 'Bảng Sudoku có giấu ô nào không? Có ai khác điền vào không? Điền một ô có làm đổi các lựa chọn về sau không?',
        explain: 'Thấy hết bảng: <b>đầy đủ</b>. Chỉ mình bạn điền: <b>một</b> tác tử. Điền số nào thì bảng thành đúng như thế: <b>tất định</b>. Số điền bây giờ chặn lựa chọn ở các ô sau: <b>tuần tự</b>.',
      },
      label: 'Xếp bốn chiều cho Sudoku',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'env-dims-e2',
        kind: 'classify',
        prompt: 'Xếp loại môi trường của một tác tử chơi poker.',
        groups: [],
        items: dimItems({ obs: 1, agents: 1, det: 1, ep: 1 }),
        hint: 'Bài trên tay đối thủ có lật ra không? Lá bài chia ra tiếp theo có đoán trước được không?',
        explain: 'Bài của đối thủ úp: <b>một phần</b>. Có đối thủ: <b>nhiều</b> tác tử. Lá bài chia ra còn tùy may rủi: <b>ngẫu nhiên</b>. Ván bài kéo qua nhiều vòng cược: <b>tuần tự</b>.',
      },
      label: 'Xếp bốn chiều cho poker',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'env-dims-e3',
        kind: 'classify',
        prompt: 'Môi trường của mỗi tác tử dưới đây là từng hồi hay tuần tự?',
        groups: ['Từng hồi', 'Tuần tự'],
        items: [
          { text: 'Bộ lọc thư rác: mỗi email tới thì xếp vào Spam hoặc Hộp thư', group: 0 },
          { text: 'Tác tử chơi cờ tướng', group: 1 },
          { text: 'Máy chấm bài trắc nghiệm, chấm từng tờ', group: 0 },
          { text: 'Taxi tự lái chở khách qua thành phố', group: 1 },
        ],
        hint: 'Hỏi: quyết định với mục này có làm đổi tình huống ở mục sau không?',
        explain: 'Xếp email này, chấm tờ này không làm đổi email hay tờ bài kế tiếp: <b>từng hồi</b>. Một nước cờ, một lần chuyển làn đều kéo theo các quyết định sau: <b>tuần tự</b>.',
      },
      label: 'Phân biệt từng hồi và tuần tự',
    },
    {
      kind: 'exercise',
      exercise: {
        id: 'env-dims-e4',
        kind: 'choice',
        prompt: 'Taxi tự lái đang chạy. Chiếc xe máy chạy bên cạnh nên được coi là gì?',
        options: [
          'Một vật trong môi trường, giống cái ổ gà',
          'Một tác tử khác: người lái xe máy đang tối đa một thước đo phụ thuộc vào cách taxi chạy',
          'Một cảm biến của taxi',
          'Không cần tính tới, vì xe máy không chở khách',
        ],
        answer: [1],
        hint: 'Áp phép thử ở chiều 2: hành vi của người lái xe máy có nhắm tới một thước đo phụ thuộc vào taxi không?',
        explain: 'Người lái xe máy cũng muốn tới nơi an toàn, và điều đó phụ thuộc vào cách taxi chạy. Vậy đây là môi trường <b>nhiều tác tử</b>, kiểu hợp tác: ai cũng muốn tránh va chạm.',
      },
      label: 'Nhận ra tác tử khác',
    },
    {
      kind: 'paper',
      data: {
        title: 'Xếp bốn chiều cho trò trốn tìm.',
        minutes: 4,
        steps: [
          'Dùng lại PEAS của người đi tìm trong trò trốn tìm ở ga trước.',
          'Với mỗi chiều, chọn một vế và viết một câu giải thích vì sao.',
          'Chỗ nào lưỡng lự, ghi cả hai cách nhìn rồi chọn một.',
        ],
        reference: [
          '<b>Quan sát một phần</b>: người đi tìm không thấy các bạn đang nấp. Đó chính là cái khó của trò chơi.',
          '<b>Nhiều tác tử</b>, kiểu cạnh tranh: các bạn đi trốn muốn không bị tìm thấy, ngược với thước đo của người đi tìm.',
          '<b>Ngẫu nhiên</b>: đây là tình huống ngoài đời thật, mỗi bước chạy, mỗi lần nhìn đều có thể không như ý (bị che khuất, trượt chân). Lưu ý: "các bạn trốn khó đoán" không phải lý do, phần đó đã tính ở chiều tác tử.',
          '<b>Tuần tự</b>: đã tìm chỗ nào, theo hướng nào quyết định chỗ nên tìm tiếp.',
        ],
      },
    },
  ],
}

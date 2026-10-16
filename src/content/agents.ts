/**
 * Dữ liệu cho tuyến "Mô tả một agent thông minh" (Buổi 2, Lecture02-IntelligentAgents.pdf).
 * Bảng PEAS lấy từ trang 29 và 31, bảng môi trường từ trang 40. Chỉ dịch nghĩa, không đổi phân loại.
 */

export interface PeasRow {
  agent: string
  p: string
  e: string
  a: string
  s: string
}

/** Trang 29. */
export const peasTaxi: PeasRow = {
  agent: 'Taxi tự lái',
  p: 'An toàn, nhanh, đúng luật, đi êm, tối đa lợi nhuận',
  e: 'Đường sá, xe khác, người đi bộ, khách',
  a: 'Vô lăng, chân ga, phanh, xi-nhan, còi, màn hình',
  s: 'Camera, sonar, đồng hồ tốc độ, GPS, đồng hồ quãng đường, cảm biến gia tốc, cảm biến động cơ, bàn phím',
}

/** Trang 31. */
export const peasExamples: PeasRow[] = [
  {
    agent: 'Hệ chẩn đoán y khoa',
    p: 'Bệnh nhân khỏe, giảm chi phí',
    e: 'Bệnh nhân, bệnh viện, nhân viên y tế',
    a: 'Màn hình hiện câu hỏi, xét nghiệm, chẩn đoán, cách điều trị, giấy chuyển viện',
    s: 'Bàn phím nhập triệu chứng, kết quả khám, câu trả lời của bệnh nhân',
  },
  {
    agent: 'Hệ phân tích ảnh vệ tinh',
    p: 'Phân loại ảnh đúng',
    e: 'Đường truyền xuống từ vệ tinh đang bay',
    a: 'Màn hình hiện kết quả phân loại cảnh',
    s: 'Mảng điểm ảnh màu',
  },
  {
    agent: 'Robot gắp linh kiện',
    p: 'Tỉ lệ linh kiện vào đúng thùng',
    e: 'Băng chuyền chở linh kiện, các thùng',
    a: 'Cánh tay có khớp và bàn tay',
    s: 'Camera, cảm biến góc khớp',
  },
  {
    agent: 'Bộ điều khiển nhà máy lọc dầu',
    p: 'Độ tinh khiết, sản lượng, an toàn',
    e: 'Nhà máy lọc dầu, người vận hành',
    a: 'Van, bơm, bộ gia nhiệt, màn hình',
    s: 'Cảm biến nhiệt độ, áp suất, hóa chất',
  },
  {
    agent: 'Gia sư tiếng Anh',
    p: 'Điểm thi của học viên',
    e: 'Các học viên, đơn vị tổ chức thi',
    a: 'Màn hình hiện bài tập, gợi ý, chỗ sửa',
    s: 'Bàn phím',
  },
]

/** Bảng hàm agent của thế giới hút bụi hai ô (trang 9). */
export const vacuumRows: string[][] = [
  ['[A, Sạch]', 'Sang phải'],
  ['[A, Bẩn]', 'Hút'],
  ['[B, Sạch]', 'Sang trái'],
  ['[B, Bẩn]', 'Hút'],
  ['[A, Sạch], [A, Sạch]', 'Sang phải'],
  ['[A, Sạch], [A, Bẩn]', 'Hút'],
  ['…', '…'],
]

export type DimId = 'obs' | 'agents' | 'det' | 'ep' | 'static' | 'disc' | 'known'

/**
 * Bảy chiều của môi trường. `name` là câu hỏi đầy đủ (dùng trong bài tập), `head` là tiêu đề cột bảng.
 * Vế đầu là vế "dễ". Chiều tĩnh/động có thêm vế giữa: nửa động.
 */
export const dims: Record<DimId, { name: string; head: string; values: string[] }> = {
  obs: { name: 'Quan sát được', head: 'Quan sát', values: ['Đầy đủ', 'Một phần'] },
  agents: { name: 'Số agent', head: 'Agent', values: ['Một', 'Nhiều'] },
  det: { name: 'Kết quả hành động', head: 'Kết quả', values: ['Tất định', 'Ngẫu nhiên'] },
  ep: { name: 'Các quyết định', head: 'Quyết định', values: ['Từng hồi', 'Tuần tự'] },
  static: { name: 'Trong lúc agent nghĩ', head: 'Thời gian', values: ['Tĩnh', 'Nửa động', 'Động'] },
  disc: { name: 'Trạng thái, thời gian, hành động', head: 'Giá trị', values: ['Rời rạc', 'Liên tục'] },
  known: { name: 'Luật của môi trường', head: 'Luật', values: ['Biết luật', 'Chưa biết luật'] },
}

export const tableDims: Exclude<DimId, 'known'>[] = ['obs', 'agents', 'det', 'ep', 'static', 'disc']

/** Trang 40. Số là chỉ số vế trong `dims[...].values`. */
export const envRows: { name: string; v: Record<Exclude<DimId, 'known'>, number> }[] = [
  { name: 'Giải ô chữ', v: { obs: 0, agents: 0, det: 0, ep: 1, static: 0, disc: 0 } },
  { name: 'Cờ vua có đồng hồ', v: { obs: 0, agents: 1, det: 0, ep: 1, static: 1, disc: 0 } },
  { name: 'Poker', v: { obs: 1, agents: 1, det: 1, ep: 1, static: 0, disc: 0 } },
  { name: 'Backgammon', v: { obs: 0, agents: 1, det: 1, ep: 1, static: 0, disc: 0 } },
  { name: 'Lái taxi', v: { obs: 1, agents: 1, det: 1, ep: 1, static: 2, disc: 1 } },
  { name: 'Chẩn đoán y khoa', v: { obs: 1, agents: 0, det: 1, ep: 1, static: 2, disc: 1 } },
  { name: 'Phân tích ảnh', v: { obs: 0, agents: 0, det: 0, ep: 0, static: 1, disc: 1 } },
  { name: 'Robot gắp linh kiện', v: { obs: 1, agents: 0, det: 1, ep: 0, static: 2, disc: 1 } },
  { name: 'Điều khiển lọc dầu', v: { obs: 1, agents: 0, det: 1, ep: 1, static: 2, disc: 1 } },
  { name: 'Gia sư tiếng Anh', v: { obs: 1, agents: 1, det: 1, ep: 1, static: 2, disc: 0 } },
]

/** Câu hỏi xếp loại một môi trường theo các chiều: mỗi chiều là một mục có hai (hoặc ba) vế riêng. */
export function dimItems(answer: Partial<Record<DimId, number>>) {
  return (Object.keys(answer) as DimId[]).map((id) => ({ text: dims[id].name, groups: dims[id].values, group: answer[id]! }))
}

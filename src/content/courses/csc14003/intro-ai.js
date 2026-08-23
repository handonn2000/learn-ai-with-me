// Dữ liệu Buổi 1 — Nhập môn AI (CSC14003).

export const QUAD = [
  { id: 'th', col: 0, row: 0, en: 'Systems that think like humans',
    vn: 'Suy nghĩ như người', tag: 'THINKING HUMANLY', color: '#58C4DD',
    caption: 'GPS (Newell & Simon, 1961) · khoa học tri nhận' },
  { id: 'tr', col: 1, row: 0, en: 'Systems that think rationally',
    vn: 'Suy nghĩ duy lý', tag: 'THINKING RATIONALLY', color: '#C792EA',
    caption: 'Luật của tư duy · tam đoạn luận Aristotle' },
  { id: 'ah', col: 0, row: 1, en: 'Systems that act like humans',
    vn: 'Hành động như người', tag: 'ACTING HUMANLY', color: '#F4D345',
    caption: 'Phép thử Turing (1950) · CAPTCHA' },
  { id: 'ar', col: 1, row: 1, en: 'Systems that act rationally',
    vn: 'Hành động duy lý', tag: 'ACTING RATIONALLY', color: '#83C167',
    caption: 'Agent duy lý · f: 𝓟 → 𝓐' }
];

export const QUIZ = [
  { q: 'Phép thử Turing: người hỏi gõ câu hỏi, không phân biệt được câu trả lời viết là của người hay của máy.',
    a: 'ah', why: 'Turing không thèm quan tâm bên trong máy nghĩ gì. Ông chỉ hỏi: bạn có phân biệt nổi không? Máy chỉ cần HÀNH ĐỘNG giống người tới mức bạn không phát hiện ra — thế là đủ.' },
  { q: 'General Problem Solver — không chỉ giải đúng, mà còn so vết các bước suy luận của nó với vết suy luận của người khi giải cùng bài.',
    a: 'th', why: 'Ra đúng đáp án thôi thì Newell & Simon chưa chịu. Họ so cả đường đi trong đầu: chương trình phải NGHĨ giống người, không chỉ trả lời giống người.' },
  { q: 'Hệ suy diễn: “Mọi người đều phải chết. Socrates là người. Vậy Socrates phải chết.”',
    a: 'tr', why: 'Tam đoạn luận của Aristotle: nhét tiền đề đúng vào là kết luận không cãi vào đâu được. Đây là ô “luật của tư duy” — vẫn mở nắp máy ra xem nó nghĩ, nhưng lấy logic làm thước chứ không lấy người làm thước.' },
  { q: 'Agent chọn hành động để đạt kết quả tốt nhất, và khi có bất định thì tốt nhất theo kỳ vọng.',
    a: 'ar', why: 'Đúng y định nghĩa agent duy lý. Để ý hai chữ “kỳ vọng”: duy lý không có nghĩa là luôn thắng, chỉ có nghĩa là chọn nước đi tốt nhất với thông tin đang có trong tay.' },
  { q: 'CAPTCHA: bắt người dùng chứng minh mình là người trước khi cho vào website.',
    a: 'ah', why: 'Reverse Turing Test — vẫn là phép thử đó, chỉ đảo vai: máy ra đề, bạn phải chứng minh mình là người. Mỗi lần bạn bấm “tôi không phải robot” là đang thi đấy 🤖' },
  { q: 'Khoa học tri nhận: ghép mô hình máy tính của AI với kỹ thuật thực nghiệm của tâm lý học để dựng lý thuyết chính xác và kiểm chứng được về trí óc người.',
    a: 'th', why: 'Đích của nó là mô tả cho được trí óc NGƯỜI, nên nằm gọn ở ô “suy nghĩ như người”. Ngành này giờ đã ra ở riêng, không còn chung nhà với AI nữa.' },
  { q: 'Rút tay khỏi bếp nóng — phản xạ, không kịp suy nghĩ.',
    a: 'ar', why: 'Đây là chỗ ô “duy lý” rộng hơn bạn tưởng: nó ôm cả những hành động không kịp nghĩ. Rút tay khỏi bếp nóng là việc đúng phải làm — không suy luận câu nào mà vẫn duy lý.' },
  { q: 'Thuật toán đầy đủ cho lập luận logic của Robinson (1965): từ tiền đề dạng ký hiệu, suy ra mọi kết luận hệ quả.',
    a: 'tr', why: 'Đường logicist: mô tả cả thế giới bằng ký hiệu rồi thả cho máy suy diễn hình thức. Đo quá trình nghĩ, lấy logic làm chuẩn → ô suy nghĩ duy lý.' }
];

export const ERAS = [
  { from: 1940, to: 1950, label: '1940–50 · Khoa học thần kinh gặp máy tính' },
  { from: 1950, to: 1970, label: '1950–70 · Hưng phấn, dẫn dắt bởi logic' },
  { from: 1970, to: 1990, label: '1970–90 · Hướng tri thức' },
  { from: 1990, to: 2010, label: '1990–2010 · Hướng thống kê' },
  { from: 2010, to: 2017, label: '2010–17 · Big Data · GPU · Học sâu' },
  { from: 2017, to: 2026, label: '2017– · Mở rộng quy mô, LLM' }
];

export const WINTERS = [
  { from: 1974, to: 1980, label: 'Mùa đông AI thứ nhất', note: 'ít được nhắc' },
  { from: 1988, to: 1993, label: 'AI Winter — ngành hệ chuyên gia sụp', note: 'mùa đông chính' }
];

export const TIMELINE = [
  { y: 1943, t: 'McCulloch & Pitts: mô hình mạch Boole của não' },
  { y: 1950, t: 'Turing: “Computing Machinery and Intelligence”' },
  { y: 1952, t: 'Chương trình AI đầu tiên: cờ đam của Samuel, Logic Theorist (Newell & Simon), Geometry Engine (Gelernter)' },
  { y: 1956, t: 'Hội nghị Dartmouth: chốt tên “Artificial Intelligence”' },
  { y: 1961, t: 'General Problem Solver (Newell & Simon)' },
  { y: 1965, t: 'Robinson: thuật toán đầy đủ cho lập luận logic' },
  { y: 1972, t: 'Bắt đầu giai đoạn hệ dựa trên tri thức (1969–79)' },
  { y: 1984, t: 'Ngành hệ chuyên gia bùng nổ (1980–88)' },
  { y: 1990, t: 'Xác suất trở lại, tập trung vào bất định' },
  { y: 1992, t: 'TD-Gammon đạt trình độ người' },
  { y: 1996, t: 'Kasparov thắng Deep Blue' },
  { y: 1997, t: 'Deep Blue thắng Kasparov' },
  { y: 2002, t: 'AI hiện thân: máy hút bụi Roomba' },
  { y: 2011, t: 'Apple ra mắt SIRI' },
  { y: 2012, t: 'AlexNet thắng cuộc thi ImageNet' },
  { y: 2015, t: 'DeepMind đạt mức điều khiển ngang người trong game Atari' },
  { y: 2016, t: 'AlphaGo thắng Lee Sedol · Google Translate chuyển sang mạng nơ-ron' },
  { y: 2017, t: 'Google phát minh kiến trúc Transformer · DeepStack và Libratus thắng người ở poker' },
  { y: 2019, t: 'AlphaFold dự đoán cấu trúc protein từ chuỗi amino acid (2018–2020)' },
  { y: 2022, t: 'Sinh ảnh từ văn bản (2021–22) · OpenAI ra ChatGPT' },
  { y: 2023, t: 'GPT-4 · mô hình ngôn ngữ lớn đi thẳng vào công cụ hằng ngày' },
  { y: 2024, t: 'Nobel Vật lý cho Hopfield và Hinton · Nobel Hóa học cho AlphaFold' },
  { y: 2025, t: 'AI agent thành dòng chính: mô hình tự gọi công cụ, chạy nhiều bước cho xong một việc' }
];

export const FIELDS = [
  ['Philosophy', 'Triết học', 'Logic, phương pháp lập luận, trí óc như hệ vật lý, nền tảng của học, ngôn ngữ, tính duy lý.'],
  ['Mathematics', 'Toán học', 'Biểu diễn và chứng minh hình thức, thuật toán, tính toán, (bất) khả định, (bất) khả trị, xác suất.'],
  ['Economics', 'Kinh tế học', 'Độ thỏa dụng, lý thuyết quyết định, agent kinh tế duy lý.'],
  ['Neuroscience', 'Thần kinh học', 'Nơ-ron như đơn vị xử lý thông tin.'],
  ['Psychology / Cognitive Science', 'Tâm lý · Khoa học tri nhận', 'Con người hành xử, tri giác, xử lý thông tin, biểu diễn tri thức thế nào.'],
  ['Computer Engineering', 'Kỹ thuật máy tính', 'Chế tạo máy tính nhanh.'],
  ['Control Theory', 'Lý thuyết điều khiển', 'Thiết kế hệ tối đa hóa một hàm mục tiêu theo thời gian.'],
  ['Linguistics', 'Ngôn ngữ học', 'Biểu diễn tri thức, ngữ pháp.']
];

export const CANDO = [
  'Chơi bóng bàn ở mức tạm được?',
  'Chơi tạm được trò đố Jeopardy?',
  'Lái an toàn trên đường núi nhiều khúc quanh?',
  'Lái an toàn trên một đại lộ đông đúc giữa trung tâm?',
  'Mua thực phẩm cho cả tuần trên web?',
  'Mua thực phẩm cho cả tuần ở siêu thị thật?',
  'Phát hiện và chứng minh một định lý toán mới?',
  'Trò chuyện thành công với một người suốt một giờ?',
  'Thực hiện một cuộc mổ?',
  'Dịch tiếng Trung nói sang tiếng Anh nói theo thời gian thực?',
  'Gấp quần áo và dọn bát đĩa?',
  'Viết một truyện cố tình gây cười?',
  'Viết một đoạn code chạy được, từ mô tả bằng lời?',
  'Dựng một đoạn video ngắn từ đúng một câu mô tả?',
  'Tóm tắt trung thực một tài liệu 300 trang nó chưa từng thấy?',
  'Tự chia một việc nhiều bước rồi gọi công cụ làm từng bước, không cần ai nhắc?'
];

export const TOPICS = [
  { t: 'Tìm kiếm (kể cả chơi game)', n: 'Buổi 3–6', c: '#58C4DD', d: 'Món nền nhất trong các món. Mọi câu trả lời, mọi quyết định, mọi chuỗi hành động khả dĩ — nhét hết vào một không gian trừu tượng rồi đi tìm trong đó. Tìm mò (uninformed) hay tìm có la bàn (informed): Buổi 3 bạn sẽ tự tay cài cả bảy cách.' },
  { t: 'Biểu diễn tri thức và lập luận', n: 'Buổi 7–9', c: '#C792EA', d: 'Muốn hành động cho đúng thì trước hết phải mô tả được thế giới đang thế nào, rồi suy ra những thứ mình chưa nhìn thấy. Mô tả bằng gì, mô tả sao cho gọn, moi đúng mảnh tri thức cần dùng ra sao — và làm gì khi chính tri thức đó cũng không chắc chắn.' },
  { t: 'Học máy', n: 'Buổi 10–11', c: '#83C167', d: 'Tới đây agent thôi ăn sẵn code bạn viết: nó tự đổi hành vi theo kinh nghiệm. Suy ra sự kiện mới từ cái cũ, tự đẻ ra khái niệm, tự học cách phân biệt những tình huống chưa từng gặp.' },
  { t: 'Lập kế hoạch · Xử lý ngôn ngữ tự nhiên · Hệ chuyên gia · Tương tác với môi trường (thị giác, nhận dạng tiếng nói, robot)…', n: 'ngoài phạm vi môn', c: '#7A8399', d: 'Một học kỳ không đủ cho tất cả. Tin vui: xong bốn phần trên rồi thì mấy nhánh này bạn đọc là hiểu, không cần ai dắt nữa.' }
];

export const CHECKS = [
  'Nói được khác biệt giữa “hiểu trí thông minh” và “xây thực thể thông minh” — và vì sao AI ôm cả hai.',
  'Vẽ lại từ đầu bảng 2×2 bốn hướng tiếp cận, đặt đúng hai trục: người/duy lý và suy nghĩ/hành động.',
  'Mô tả được phép thử Turing, hai biến thể (reverse, total) và một lý do các nhà nghiên cứu ít theo đuổi nó.',
  'Phân biệt được “luật của tư duy” với “agent duy lý”, và nêu được hai lý do agent duy lý tổng quát hơn.',
  'Ai đó kể cho bạn một hệ thống lạ, bạn xếp được nó vào đúng 1 trong 4 ô — đúng ≥ 6/8 câu ở ô tương tác mục 05.',
  'Kể được các mốc: 1943, 1950, 1956, 1997, 2012, 2016, 2017, 2022 và giai đoạn AI Winter 1988–93.',
  'Nêu được 4 lĩnh vực nền và đóng góp của mỗi lĩnh vực cho AI.',
  'Làm xong bài tập buổi 1: hai bản PEAS và hai lần phân tích tính chất môi trường, có giải thích cho từng chiều.'
];

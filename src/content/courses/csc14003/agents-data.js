// Data nội dung cho bài 2 — Tác tử thông minh.
// Giữ dạng JS thuần theo ADR-0005; trang chỉ đọc, không sửa.

/* ===== Mục 05 · PEAS ===== */

export const PEAS_ROWS = [
  {
    agent: 'Tài xế taxi', en: 'Taxi driver', hero: true,
    p: 'An toàn, nhanh, đúng luật, đi êm, tối đa lợi nhuận',
    e: 'Đường sá, xe khác, người đi bộ, khách',
    a: 'Vô lăng, ga, phanh, xi-nhan, còi, màn hình',
    s: 'Camera, sonar, đồng hồ tốc độ, GPS, odometer, cảm biến gia tốc, cảm biến động cơ, bàn phím',
  },
  {
    agent: 'Hệ chẩn đoán y khoa', en: 'Medical diagnosis system',
    p: 'Bệnh nhân khỏe, chi phí giảm',
    e: 'Bệnh nhân, bệnh viện, nhân viên y tế',
    a: 'Màn hình hiện câu hỏi, xét nghiệm, chẩn đoán, phác đồ, giấy chuyển viện',
    s: 'Bàn phím nhập triệu chứng, kết quả khám, câu trả lời của bệnh nhân',
  },
  {
    agent: 'Hệ phân tích ảnh vệ tinh', en: 'Satellite image analysis system',
    p: 'Phân loại ảnh đúng',
    e: 'Đường truyền xuống từ vệ tinh đang bay',
    a: 'Màn hình hiện kết quả phân loại cảnh',
    s: 'Mảng điểm ảnh màu',
  },
  {
    agent: 'Robot gắp linh kiện', en: 'Part-picking robot',
    p: 'Tỉ lệ linh kiện vào đúng thùng',
    e: 'Băng chuyền có linh kiện, các thùng đựng',
    a: 'Cánh tay có khớp và bàn tay',
    s: 'Camera, cảm biến góc khớp',
  },
  {
    agent: 'Bộ điều khiển nhà máy lọc dầu', en: 'Refinery controller',
    p: 'Độ tinh khiết, sản lượng, an toàn',
    e: 'Nhà máy lọc dầu, người vận hành',
    a: 'Van, bơm, bộ gia nhiệt, màn hình',
    s: 'Cảm biến nhiệt độ, áp suất, hóa chất',
  },
  {
    agent: 'Trợ lý lập trình', en: 'Coding assistant',
    p: 'Code chạy đúng, hợp ý người dùng, ít phải sửa lại',
    e: 'Mã nguồn dự án, trình biên dịch, terminal, người dùng',
    a: 'Sửa file, chạy lệnh, gọi công cụ, trả lời bằng chữ',
    s: 'Nội dung file, thông báo lỗi, kết quả lệnh, câu người dùng gõ',
  },
  {
    agent: 'Gia sư tiếng Anh', en: 'Interactive English tutor',
    p: 'Điểm bài kiểm tra của học viên',
    e: 'Tập học viên, đơn vị tổ chức thi',
    a: 'Màn hình hiện bài tập, gợi ý, chỗ sửa lỗi',
    s: 'Bàn phím',
  },
];

/* ===== Mục 06 · Các chiều của môi trường ===== */

// Sáu chiều có mặt trong bảng tổng hợp của tài liệu gốc. Chiều thứ bảy (biết / không biết)
// không nằm trong bảng đó — nó được giảng riêng trong một thẻ ở mục 06.
export const DIMS = [
  { id: 'obs', vn: 'Quan sát', en: 'Observable', left: 'Đầy đủ', right: 'Một phần', leftEn: 'Fully', rightEn: 'Partially' },
  { id: 'ag', vn: 'Số agent', en: 'Agents', left: 'Một', right: 'Nhiều', leftEn: 'Single', rightEn: 'Multi' },
  { id: 'det', vn: 'Kết quả hành động', en: 'Deterministic', left: 'Tất định', right: 'Ngẫu nhiên', leftEn: 'Deterministic', rightEn: 'Stochastic' },
  { id: 'ep', vn: 'Các quyết định', en: 'Episodic', left: 'Từng hồi', right: 'Tuần tự', leftEn: 'Episodic', rightEn: 'Sequential' },
  { id: 'st', vn: 'Thời gian', en: 'Static', left: 'Tĩnh', right: 'Động', leftEn: 'Static', rightEn: 'Dynamic', mid: 'Nửa động', midEn: 'Semi' },
  { id: 'dis', vn: 'Giá trị', en: 'Discrete', left: 'Rời rạc', right: 'Liên tục', leftEn: 'Discrete', rightEn: 'Continuous' },
];

// v: 'l' = vế trái, 'r' = vế phải, 'm' = ở giữa (chỉ chiều tĩnh/động có vế giữa).
export const ENVIRONMENTS = [
  {
    id: 'crossword', label: 'Ô chữ', en: 'Crossword puzzle',
    v: { obs: 'l', ag: 'l', det: 'l', ep: 'r', st: 'l', dis: 'l' },
    note: 'Đây là môi trường <strong class="hl-green">dễ nhất đời</strong>: sáu chiều đều rơi vào vế trái, trừ chuyện các ô chữ ràng buộc nhau nên phải nghĩ đường dài. Ô chữ không tự điền thêm chữ trong lúc bạn đi pha trà — bạn có bao nhiêu thời gian suy nghĩ cũng được.',
  },
  {
    id: 'chess', label: 'Cờ vua có đồng hồ', en: 'Chess with a clock',
    v: { obs: 'l', ag: 'r', det: 'l', ep: 'r', st: 'm', dis: 'l' },
    note: 'Chú ý ô <strong class="hl-yellow">nửa động</strong> — chỗ này tinh tế và hay bị bỏ qua. Bàn cờ không tự đi nước nào khi bạn ngồi nghĩ, nhưng cái đồng hồ vẫn chạy: môi trường đứng yên, còn <em>điểm</em> của bạn thì không.',
  },
  {
    id: 'poker', label: 'Poker', en: 'Poker',
    v: { obs: 'r', ag: 'r', det: 'r', ep: 'r', st: 'l', dis: 'l' },
    note: 'Cùng là trò chơi trên bàn, cùng rời rạc, nhưng poker nhảy sang <strong class="hl">quan sát một phần</strong> — bài trên tay đối thủ úp xuống — <em>và</em> ngẫu nhiên, vì còn chuyện chia bài. Bấm tiếp sang backgammon ngay bên cạnh trước khi đọc gì thêm: hai ván này khác nhau đúng một ô, và đó là ô đáng học nhất trong cả bảng.',
  },
  {
    id: 'backgammon', label: 'Backgammon', en: 'Backgammon',
    v: { obs: 'l', ag: 'r', det: 'r', ep: 'r', st: 'l', dis: 'l' },
    note: 'Đây là mẫu vật tôi để dành: <strong class="hl-green">quan sát đầy đủ</strong> mà vẫn <strong class="hl">ngẫu nhiên</strong>. Bàn cờ bày hết ra đó, không ai giấu gì của ai — nhưng bạn còn phải đổ xúc xắc, nên không đoán trước được nước đi sẽ dẫn tới đâu. Nhìn thấy hết ≠ đoán trước được; poker dính cả hai, backgammon chỉ dính một.',
  },
  {
    id: 'taxi', label: 'Lái taxi', en: 'Taxi driving',
    v: { obs: 'r', ag: 'r', det: 'r', ep: 'r', st: 'r', dis: 'r' },
    note: 'Đủ bộ vế phải, không sót chiều nào — đây chính là cái mệnh đề “hầu hết tình huống đời thực đều như vậy”. Nếu bạn đang tự hỏi vì sao xe tự lái khó tới vậy trong khi máy đánh cờ đã thắng người từ 1997, câu trả lời nằm nguyên trong hàng này.',
  },
  {
    id: 'medical', label: 'Chẩn đoán y khoa', en: 'Medical diagnosis',
    v: { obs: 'r', ag: 'l', det: 'r', ep: 'r', st: 'r', dis: 'r' },
    note: 'Giống hệt lái taxi, chỉ khác đúng một ô: <strong class="hl">một agent</strong>. Con vi khuẩn không ngồi tính xem phải làm gì để qua mặt bác sĩ — nó khó lường, nhưng nó không phải đối thủ.',
  },
  {
    id: 'partpick', label: 'Robot gắp linh kiện', en: 'Part-picking robot',
    v: { obs: 'r', ag: 'l', det: 'r', ep: 'l', st: 'r', dis: 'r' },
    note: 'Ô duy nhất tô sáng vế trái ở chiều thứ tư: <strong class="hl-green">từng hồi</strong>. Gắp trượt linh kiện này thì linh kiện sau vẫn tới trên băng chuyền y như cũ — không có hậu quả nào dắt dây sang sau, nên robot khỏi cần nghĩ xa.',
  },
  {
    id: 'coding', label: 'Trợ lý lập trình', en: 'Coding assistant',
    v: { obs: 'r', ag: 'r', det: 'r', ep: 'r', st: 'r', dis: 'l' },
    note: 'Hàng này không có trong tài liệu gốc — tôi thêm vào vì nó là thứ bạn dùng hằng ngày. Đáng chú ý nhất là ô <strong class="hl">quan sát một phần</strong>: nó không thấy hết mã nguồn, và càng không thấy được thứ bạn thật sự muốn mà quên nói ra. Còn <strong class="hl">nhiều agent</strong> ở đây là kiểu hợp tác — bạn và nó cùng muốn code chạy được, nên thước đo của hai bên phần lớn cùng chiều.',
  },
  {
    id: 'tutor', label: 'Gia sư tiếng Anh', en: 'Interactive English tutor',
    v: { obs: 'r', ag: 'r', det: 'r', ep: 'r', st: 'r', dis: 'l' },
    note: 'Bảy chiều gần như trùng lái taxi, nhưng <strong class="hl">rời rạc</strong> — gia sư gõ chữ chứ không bẻ vô lăng 0,3 độ. Và nó là nhiều agent thật đấy: học viên có mục tiêu riêng, đôi khi là “qua môn với công sức tối thiểu”.',
  },
];

/* ===== Mục 08 · Năm kiến trúc agent ===== */

export const ARCH_LEVELS = [
  {
    n: 1, id: 'reflex', name: 'Phản xạ đơn giản', en: 'Simple reflex agent', color: 'var(--cyan)',
    adds: 'Luật điều kiện–hành động',
    body: 'Nhìn tri giác <em>hiện tại</em>, dò trong một mớ luật <span class="code-inline">NẾU… THÌ…</span>, thấy luật nào khớp thì làm theo. Cả quá khứ vứt đi hết. <strong class="hl">NẾU xe trước phanh THÌ đạp phanh</strong> — thế thôi, không cần biết mình đang ở đâu, đi đâu.',
    limit: 'Hai chỗ, không phải một. <strong class="hl">Một:</strong> nó chỉ chạy được khi môi trường quan sát đầy đủ — thiếu một mẩu thông tin là nó mù, mà lại không có chỗ nào để cất mẩu thông tin đó. <strong class="hl">Hai:</strong> có những thứ bạn biết mà không viết ra thành luật <span class="code-inline">NẾU… THÌ…</span> được — thử viết luật cho “nhận ra khuôn mặt bạn mình” xem. Không phát biểu được thì không nhét vào kiến trúc này được, và đó là lý do buổi 10–11 phải để máy tự rút luật từ dữ liệu.',
  },
  {
    n: 2, id: 'model', name: 'Phản xạ có mô hình', en: 'Model-based reflex agent', color: 'var(--green)',
    adds: 'Trạng thái trong + mô hình thế giới',
    body: 'Thêm một cuốn sổ tay: <strong class="hl">trạng thái trong</strong>, ghi những gì cảm biến không còn thấy nữa. Để cập nhật cuốn sổ đó cần đúng hai loại kiến thức — thế giới tự biến đổi ra sao khi mình không làm gì, và hành động của mình làm thế giới đổi thế nào. Hai thứ đó gộp lại gọi là <em>mô hình thế giới</em>.',
    limit: 'Biết thế giới đang thế nào, nhưng vẫn chưa biết mình muốn nó thành thế nào. Tới ngã ba vẫn đứng đực ra.',
  },
  {
    n: 3, id: 'goal', name: 'Hướng mục tiêu', en: 'Goal-based agent', color: 'var(--yellow)',
    adds: 'Mục tiêu + phép thử “nếu tôi làm A thì sao”',
    body: 'Thêm mô tả về <strong class="hl">tình huống mình muốn tới</strong>. Giờ agent thử tưởng tượng: làm hành động A thì thế giới thành ra sao, cái đó có gần mục tiêu hơn không. Chậm hơn phản xạ thật, nhưng đổi lại tri thức nằm tường minh — muốn xe đi chỗ khác thì sửa mục tiêu, không phải viết lại mớ luật.',
    limit: 'Mục tiêu chỉ trả lời đạt hay không đạt. Mà mười đường cùng tới nhà thì có đường ngon đường dở, nhị phân không phân biệt nổi.',
  },
  {
    n: 4, id: 'utility', name: 'Hướng thỏa dụng', en: 'Utility-based agent', color: 'var(--purple)',
    adds: 'Hàm thỏa dụng',
    body: 'Thay câu hỏi “tới được không” bằng “tới thì <strong class="hl">sướng cỡ nào</strong>”. Hàm thỏa dụng chính là thước đo hiệu năng được nội hóa vào trong đầu agent. Nhờ có thang điểm chứ không phải cái công tắc, nó xử được hai chuyện mà mục tiêu chịu chết: cân giữa các mục tiêu đá nhau (nhanh vs an toàn), và cân giữa cái chắc ăn với cái đáng giá nhưng hên xui. Viết cho gọn thì agent duy lý ở nấc này chọn hành động <strong class="hl">tối đa thỏa dụng KỲ VỌNG</strong> của các kết cục — nhớ chữ “kỳ vọng” đó, buổi 5 và buổi 9 sẽ tính nó ra số thật.',
    limit: 'Vẫn phải có người ngồi viết sẵn cho nó mọi luật, mọi mô hình, mọi thang điểm. Lập trình xong là đứng yên đó mãi.',
  },
  {
    n: 5, id: 'learning', name: 'Biết học', en: 'Learning agent', color: 'var(--red)',
    adds: 'Bộ phê bình · bộ học · bộ sinh vấn đề',
    body: 'Đây là chỗ sơ đồ lật ngược: <strong class="hl">toàn bộ con agent bạn vừa xây suốt bốn nấc bị co lại thành đúng một hộp</strong> — bộ thi hành. Quanh nó mọc thêm ba hộp mới, và cái vòng đó mới là thứ khiến agent tự khá lên được.',
    limit: null,
  },
];

export const LEARNING_PARTS = [
  {
    k: 'BỘ THI HÀNH', en: 'Performance element', color: 'var(--cyan)',
    what: 'Chính là con agent của bốn nấc trước: nhận tri giác, chọn hành động.',
    taxi: 'Toàn bộ tri thức và thủ tục mà chiếc taxi dùng để quyết định bẻ lái.',
  },
  {
    k: 'BỘ PHÊ BÌNH', en: 'Critic', color: 'var(--red)',
    what: 'Nhìn tri giác rồi chấm: vừa rồi làm thế là tốt hay tệ. Nó chấm theo một <strong class="hl">chuẩn hiệu năng cố định đặt từ bên ngoài</strong> — phải cố định, vì nếu agent tự sửa được thước đo thì nó sẽ sửa cho dễ đạt điểm.',
    taxi: 'Thấy tài xế cắt ba làn để rẽ trái, nghe tiếng chửi của mấy xe xung quanh → kết luận: nước đó tệ.',
  },
  {
    k: 'BỘ HỌC', en: 'Learning element', color: 'var(--green)',
    what: 'Nhận lời phê bình rồi sửa bộ thi hành cho lần sau khá hơn.',
    taxi: 'Viết ra một luật mới cho đúng cái pha cắt ba làn vừa rồi.',
  },
  {
    k: 'BỘ SINH VẤN ĐỀ', en: 'Problem generator', color: 'var(--yellow)',
    what: 'Đề xuất những hành động <em>chưa chắc tối ưu</em> nhưng đem lại trải nghiệm mới. Không có nó thì agent cứ lặp lại mãi cái nó đã biết là ổn — và không bao giờ biết có cái ổn hơn.',
    taxi: 'Rủ đi thử phanh trên mấy loại mặt đường khác nhau, trong các điều kiện khác nhau.',
  },
];

/* ===== Mục 10 · Bài tập ===== */

export const HW = [
  ['QUESTION 1 — TRÒ TRỐN TÌM', 'Một cậu bé chơi trốn tìm với các bạn trong sân. Cậu là <em>người đi tìm</em>, phải tìm ra tất cả người trốn và hô “Thấy rồi” mỗi lần bắt được một người. Viết mô tả <strong class="hl">PEAS</strong> cho môi trường tác vụ này: Performance measure · Environment · Actuators · Sensors.', '<a href="#ch5">Ôn: mục 05 — PEAS, và mẹo viết thước đo</a>'],
  ['QUESTION 2 — TÍNH CHẤT MÔI TRƯỜNG CỦA CÂU 1', 'Xác định bốn chiều cho cùng tác vụ trên, <strong class="hl">kèm giải thích cho từng chiều</strong>: quan sát đầy đủ hay một phần · một agent hay nhiều agent · tất định hay ngẫu nhiên · từng hồi hay tuần tự.', '<a href="#ch6">Ôn: mục 06 — bảy chiều, bấm thử bảng khám phá</a>'],
  ['QUESTION 3 — TRÒ BỊT MẮT BẮT DÊ', 'Cùng sân chơi, nhưng cậu bé bị bịt mắt và là <em>người bắt</em>: chạm được vào ai thì đổi vai với người đó, trong khi những người trốn vừa hô vừa cười để làm cậu mất phương hướng. Viết mô tả <strong class="hl">PEAS</strong> cho tác vụ này.', '<a href="#ch5">Ôn: mục 05 — PEAS</a> · <a href="#ch1">mục 01 — cảm biến và bộ chấp hành</a>'],
  ['QUESTION 4 — TÍNH CHẤT MÔI TRƯỜNG CỦA CÂU 3', 'Lại bốn chiều đó, có giải thích. Rồi so đáp án câu 2 với câu 4: cùng một sân chơi, chỉ bịt mắt và thêm tiếng ồn, <strong class="hl">chiều nào đổi giá trị?</strong> Đổi chiều đó thì kiến trúc agent tối thiểu phải leo lên nấc mấy ở mục <a href="#ch8">08</a>?', '<a href="#ch8">Ôn: mục 08 — vì sao mất quan sát đầy đủ là phải có trí nhớ</a>'],
];

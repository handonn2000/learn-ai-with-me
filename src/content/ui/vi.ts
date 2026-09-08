/*
 * Chữ nghĩa của KHUNG app — header, lộ trình, kiểm tra, quiz, các trang mỏng.
 * Nội dung bài học KHÔNG nằm ở đây; mỗi bài có bundle riêng cạnh trang của nó.
 *
 * Đây là NGUỒN SỰ THẬT. `en.ts` khai `satisfies typeof VI` nên thiếu hay thừa một khóa là lỗi
 * `tsc`, không phải lỗi phải soi bằng mắt. Thêm khóa ở đây thì build sẽ đỏ cho tới khi `en.ts`
 * có khóa tương ứng — đúng như mong muốn.
 *
 * Chuỗi có chèn giá trị thì viết thành HÀM, đừng ghép chuỗi ở chỗ dùng: trật tự vế trong câu
 * mỗi thứ tiếng một khác, mà hàm thì `tsc` vẫn soát được chữ ký.
 */
export const VI = {
  app: {
    loading: 'đang nạp…',
  },

  header: {
    home: 'Trang chủ',
    courses: 'Khóa học',
    blog: 'Blog',
    themeAria: 'Đổi giao diện sáng/tối',
    dark: '☾ tối',
    light: '☀ sáng',
  },

  lessonNav: {
    toc: 'Mục lục bài học',
    back: '← Lộ trình',
  },

  deck: {
    prev: 'Mục trước',
    next: 'Mục sau',
    toScroll: 'Chuyển về đọc cuộn',
    toDeck: 'Chuyển sang trình chiếu từng mục',
    scroll: '☰ Cuộn',
    present: '⛶ Trình chiếu',
  },

  mathPrimer: {
    header: (minutes: number) => `🧮 TOÁN NỀN — ${minutes} PHÚT, ĐỌC TRƯỚC KHI VÀO BÀI`,
    terms: (n: number) => `${n} thuật ngữ`,
  },
  checklist: {
    title: 'ZERO → HERO — TỰ KIỂM',
  },

  quiz: {
    heading: (n: number) => `Quiz ${n} câu`,
    scoredByTopic: 'chấm theo chủ đề — điểm ghi vào trang Lộ trình',
    answered: (a: number, n: number) => `ĐÃ TRẢ LỜI ${a}/${n}`,
    lastTime: 'LẦN TRƯỚC',
    gaps: 'hổng:',
    noGaps: 'không sai chủ đề nào',
    qTitle: (i: number, topic: string) => `Câu ${i} · ${topic}`,
    qNo: (i: number) => `CÂU ${i}`,
    right: '✓ ĐÚNG',
    wrong: '✗ CHƯA ĐÚNG',
    prev: '← Câu trước',
    next: 'Câu tiếp →',
    restart: '↺ Làm lại từ đầu',
    correctOf: (c: number, n: number) => `đúng ${c}/${n} câu`,
    solid: 'VỮNG · ',
    weak: 'HỔNG · ',
    none: '—',
    noWrongTopic: 'Không sai chủ đề nào — ngon.',
    saved: 'Điểm này đã ghi vào trang Lộ trình — mở card của buổi ra là thấy báo cáo mạnh/yếu.',
  },

  // Lời khuyên sau quiz. spaced-repetition.ts trả về MỨC ('none' | 'low' | …), chữ nằm ở đây —
  // tầng lib không chứa chữ hiển thị (xem specs/00-architecture.md).
  tip: {
    none: 'Làm quiz trong bài học đi, rồi tôi báo cáo cho.',
    low: 'Học lại phần lý thuyết rồi mai làm lại quiz. Đừng làm lại ngay — phải để não kịp quên thì nhớ mới bền.',
    mid: 'Xem lại đúng mấy chủ đề sai ở trên thôi, rồi 2 ngày nữa làm lại quiz.',
    high: 'Nắm chắc rồi, sang buổi kế tiếp được. Chỉ cần ôn theo lịch nhắc là đủ.',
  },

  home: {
    kicker: 'LEARN AI WITH ME',
    titleA: 'Học AI từ số 0,',
    titleB: 'bằng ',
    titleAccent: 'active recall',
    titleC: ' và bài học tương tác',
    lead: 'Đây là sổ tay tự học của tôi, để công khai luôn. Mỗi khóa là một lộ trình có lịch ôn ngắt quãng, quiz chấm theo chủ đề, và phòng lab cho bạn xem thuật toán chạy từng bước ngay trong trình duyệt.',
    enterCourse: (code: string) => `Vào khóa ${code} →`,
    allCourses: 'Tất cả khóa học',
    coursesKicker: 'KHÓA HỌC',
    weeksUpper: 'TUẦN',
    nextCourseA: 'Khóa tiếp theo — thêm một file data trong ',
  },

  coursesPage: {
    title: 'Khóa học',
    lead: 'Mỗi khóa là một lộ trình đầy đủ: buổi học, lab, kiểm tra và lịch ôn ngắt quãng.',
    meta: (weeks: number, sessions: number, parts: number) =>
      `${weeks} tuần · ${sessions} buổi · ${parts} phần`,
  },

  blog: {
    title: 'Blog',
    emptyA: 'Chưa có bài nào. Chỗ này tôi để dành cho ghi chú học tập và portfolio — route đã sẵn, chỉ còn thiếu chữ; thêm nội dung tại ',
    emptyB: '.',
  },

  notFound: {
    title: 'Không tìm thấy trang',
    back: '← Về trang chủ',
  },

  plan: {
    badge: 'KHUNG KHÓA HỌC · BÀI CHI TIẾT SẼ VIẾT SAU',
    baseline: 'Nền tảng của khóa học',
    audience: 'Dành cho bạn',
    prerequisites: 'Chuẩn bị đầu vào',
    outcomes: 'Mục tiêu cuối khóa',
    pace: 'Nhịp học đề xuất',
    scope: 'Phạm vi hiện tại',
    tools: 'Lộ trình công cụ',
    completion: 'Đích đến dự kiến',
    milestone: 'MỐC DỰ KIẾN',
    lesson: 'Bài chi tiết sẽ được viết sau',
    readiness: 'CHUẨN BỊ · ',
    outcome: 'MỤC TIÊU · ',
    practice: 'THỰC HÀNH SAU NÀY · ',
    depends: 'HỌC SAU · ',
    session: (week: number) => `Buổi ${week}`,
    next: (title: string, week: number) => `${title} (tuần ${week}) — xem mục tiêu và phần chuẩn bị bên dưới. Bài chi tiết sẽ được viết sau.`,
    review: (title: string, nth: number, days: number, due: string) => `${title} — lần ôn thứ ${nth} (+${days} ngày, hạn ${due}). Tự giải thích lại mục tiêu và xem bằng chứng thực hành của bạn.`,
    testsUnavailable: 'Khóa này hiện có lộ trình và các mốc dự kiến. Bài kiểm tra sẽ được bổ sung sau khi bài học được viết.',
    back: '← Về lộ trình',
  },

  roadmap: {
    tagReview: 'ÔN LẠI',
    tagTest: 'KIỂM TRA',
    tagNext: 'HỌC TIẾP',
    tagDone: 'HOÀN TẤT',
    itemReview: (title: string, nth: number, days: number, due: string) =>
      `${title} — lần ôn thứ ${nth} (+${days} ngày, hạn ${due}). Làm lại quiz, hoặc tự giải thích to các ý chính cho chính mình nghe.`,
    itemTest: (partNo: string) =>
      `Bạn xong ${partNo} rồi — làm Kiểm tra tổng hợp để chốt lại trước khi sang phần mới.`,
    itemNext: (title: string, week: number) =>
      `${title} (tuần ${week}) — mở đầu bằng thẻ toán nền, kết lại bằng quiz.`,
    itemAllDone: 'Bạn học hết cả khóa rồi và không còn lịch ôn nào đến hạn. Nghỉ đi, xứng đáng mà 🎉',

    statProgress: 'Tiến độ',
    ofSessions: (n: number) => ` / ${n} buổi`,
    statAvg: 'Quiz TB',
    avgSub: 'trên các buổi đã làm',
    statDue: 'Cần ôn hôm nay',
    dueScheduleA: 'theo lịch ',
    dueScheduleB: ' ngày',
    schemeTitle: 'Bấm để đổi lịch ôn',

    todayA: 'Hôm nay · ',
    todaySub: 'tôi tự sinh từ tiến độ & lịch ôn của bạn',
    open: 'Mở →',
    markReviewed: 'Đã ôn ✓',

    p1Title: '01 · ACTIVE RECALL',
    p1Body: 'Bắt bạn tự nhớ trước khi cho xem đáp án. Quiz và chế độ «đoán bước tiếp theo» trong mỗi bài đều làm đúng một việc: không cho bạn đọc lướt.',
    p2Title: '02 · SPACED REPETITION',
    p2Body: (ivs: string) =>
      `Xong một buổi là lịch ôn tự đặt sau ${ivs} ngày. Ôn đúng lúc sắp quên mới nhớ bền — ôn sớm quá thì phí công.`,
    p3Title: '03 · TOÁN NỀN TRƯỚC',
    p3Body: 'Mỗi buổi mở màn bằng thẻ ôn toán 5–10 phút kèm thuật ngữ Anh–Việt, để lát nữa gặp công thức bạn không phải khựng lại.',
    p4Title: '04 · BÁO CÁO SAU BUỔI',
    p4Body: 'Quiz chấm theo chủ đề rồi tự sinh báo cáo mạnh/yếu ngay dưới mỗi buổi. Bạn khỏi phải đoán mình đang hổng chỗ nào.',

    partTestChip: 'KIỂM TRA TỔNG HỢP',
    partTestSuffix: ' — làm khi bạn đã xong hết các buổi của phần.',
    score: (n: number) => `ĐIỂM ${n}%`,
    retake: 'Làm lại',
    take: 'Làm bài',

    week: 'TUẦN',
    // Bóc tiền tố "Buổi N · " khỏi tiêu đề card (số tuần đã hiện riêng bên trái).
    titlePrefix: '^Buổi \\d+ · ',
    mathChip: 'TOÁN NỀN · ',
    openLesson: 'Mở bài học tương tác →',
    lessonBuilding: 'Bài học tương tác đang dựng',
    strong: 'ƯU ĐIỂM · ',
    weak: 'CẦN CẢI THIỆN · ',
    hint: 'GỢI Ý · ',
    answeredRight: (list: string) => `Trả lời đúng: ${list}.`,
    answeredWrong: (list: string) => `Trả lời sai: ${list}.`,
    quizDone: 'Đã hoàn thành quiz.',
    markedDone: 'Đã đánh dấu hoàn thành.',
    noWrongTopic: 'Không sai chủ đề nào — ngon.',
    noQuizData: 'Chưa có dữ liệu quiz.',
    quizBadge: (n: number) => `QUIZ ${n}%`,
    stTodo: 'Chưa',
    stDoing: 'Đang',
    stDone: 'Xong ✓',
    reviewDots: 'ÔN',
    reviewDotTitle: (nth: number, date: string) => `Ôn lần ${nth} · ${date}`,
    reviewDone: ' · đã ôn',
    reviewDue: ' · ĐẾN HẠN',
    privacyNote: 'Tiến độ lưu ngay trên trình duyệt này (localStorage) — không gửi đi đâu cả.',
  },

  test: {
    back: '← Lộ trình 11 tuần',
    closedBook: 'ĐÓNG SÁCH LẠI · ĐỪNG XEM LẠI BÀI TRƯỚC KHI LÀM',
    titleA: 'Kiểm tra ',
    titleAccent: 'tổng hợp',
    titleB: ' cuối phần',
    lead: 'Mỗi phần một bài, làm sau khi bạn học xong các buổi trong phần đó. Tôi chấm theo từng buổi, nên bạn biết chính xác phải quay lại chỗ nào chứ không phải mò. Kết quả tự lưu vào lộ trình.',
    correct: '✓ Đúng. ',
    incorrect: (letter: string) => `✗ Sai — đáp án là ${letter}. `,
    savedBtn: 'Đã lưu vào lộ trình ✓',
    saveBtn: 'Nộp & lưu vào lộ trình',
    answered: (a: number, n: number) => `Đã trả lời ${a}/${n}`,
    finished: (n: number, c: number) => `Xong ${n}/${n} — đúng ${c} câu`,
    result: (score: number, c: number, n: number) => `Kết quả: ${score}% (${c}/${n})`,
    solid: 'VỮNG · ',
    weak: 'HỔNG · ',
    hint: 'GỢI Ý · ',
    none: '—',
    gapsSuffix: ' — mở lại mấy buổi này trong lộ trình nhé.',
    noGaps: 'Không hổng buổi nào!',
    tipLow: 'Quay lại học mấy buổi bị hổng đã, rồi làm lại bài này sau 2 ngày. Đừng làm lại ngay — lúc còn nhớ đáp án thì chỉ là tự lừa mình.',
    tipMid: 'Ôn đúng mấy buổi sai ở trên thôi, đừng ôn lại hết. Làm lại sau 2–3 ngày để chốt.',
    tipHigh: 'Phần này bạn vững rồi 🎉 Sang phần kế tiếp theo lộ trình thôi.',
  },
};

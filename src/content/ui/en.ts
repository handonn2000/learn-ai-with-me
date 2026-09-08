import type { VI } from './vi';

/*
 * Bản tiếng Anh của chữ nghĩa khung app. `satisfies typeof VI` là cổng kiểm: thiếu khóa,
 * thừa khóa, hay sai chữ ký hàm đều là lỗi `tsc`, không phải lỗi phải soi bằng mắt.
 *
 * THỨ TỰ KHÓA phải khớp vi.ts từng dòng — check_i18n.py dựa vào đó để ghép theo vị trí khi
 * so thẻ HTML, số liệu và anchor. Giữ hai file đọc được cạnh nhau.
 *
 * Giọng: xem .claude/skills/lesson-voice/references/english.md. I/you, rút gọn thoải mái,
 * cấm "we" nghĩa tác giả, ví von thì THAY chứ không dịch.
 */
export const EN = {
  app: {
    loading: 'loading…',
  },

  header: {
    home: 'Home',
    courses: 'Courses',
    blog: 'Blog',
    themeAria: 'Switch between light and dark',
    dark: '☾ dark',
    light: '☀ light',
  },

  lessonNav: {
    toc: 'Lesson contents',
    back: '← Roadmap',
  },

  deck: {
    prev: 'Previous section',
    next: 'Next section',
    toScroll: 'Switch back to scrolling',
    toDeck: 'Switch to one section at a time',
    scroll: '☰ Scroll',
    present: '⛶ Present',
  },

  mathPrimer: {
    header: (minutes: number) => `🧮 MATH PRIMER — ${minutes} MIN, READ BEFORE YOU START`,
    terms: (n: number) => `${n} terms`,
  },
  checklist: {
    title: 'ZERO → HERO — SELF-CHECK',
  },

  quiz: {
    heading: (n: number) => `${n}-question quiz`,
    scoredByTopic: 'scored by topic — the result goes to your roadmap',
    answered: (a: number, n: number) => `ANSWERED ${a}/${n}`,
    lastTime: 'LAST TIME',
    gaps: 'gaps:',
    noGaps: 'no topic missed',
    qTitle: (i: number, topic: string) => `Question ${i} · ${topic}`,
    qNo: (i: number) => `QUESTION ${i}`,
    right: '✓ RIGHT',
    wrong: '✗ NOT QUITE',
    prev: '← Previous',
    next: 'Next →',
    restart: '↺ Start over',
    correctOf: (c: number, n: number) => `${c}/${n} correct`,
    solid: 'SOLID · ',
    weak: 'GAPS · ',
    none: '—',
    noWrongTopic: "Didn’t miss a single topic — nice.",
    saved: "This score is on your roadmap now — open the session’s card to see the strengths and gaps report.",
  },

  tip: {
    none: "Go take the quiz inside the lesson, then I’ll report back.",
    low: "Re-read the theory and retake the quiz tomorrow. Not right now — your brain has to half-forget it first for the memory to hold.",
    mid: 'Just revisit the topics you missed above, then retake the quiz in 2 days.',
    high: "You’ve got this. Move on to the next session — the review reminders are enough from here.",
  },

  home: {
    kicker: 'LEARN AI WITH ME',
    titleA: 'Learn AI from zero,',
    titleB: 'with ',
    titleAccent: 'active recall',
    titleC: ' and interactive lessons',
    lead: 'This is my own study notebook, published in the open. Every course is a roadmap with a spaced-repetition schedule, quizzes scored by topic, and a lab where you watch the algorithms run step by step, right in your browser.',
    enterCourse: (code: string) => `Open ${code} →`,
    allCourses: 'All courses',
    coursesKicker: 'COURSES',
    weeksUpper: 'WEEKS',
    nextCourseA: 'Next course — drop another data file into ',
  },

  coursesPage: {
    title: 'Courses',
    lead: 'Each course is a complete roadmap: sessions, labs, tests and a spaced-repetition schedule.',
    meta: (weeks: number, sessions: number, parts: number) =>
      `${weeks} weeks · ${sessions} sessions · ${parts} parts`,
  },

  blog: {
    title: 'Blog',
    emptyA: "Nothing here yet. I’m saving this space for study notes and a portfolio — the route is wired, it’s just missing the words; add content in ",
    emptyB: '.',
  },

  notFound: {
    title: 'Page not found',
    back: '← Back home',
  },

  plan: {
    badge: 'COURSE OUTLINE · DETAILED LESSONS TO FOLLOW',
    baseline: 'Course baseline',
    audience: 'Who this is for',
    prerequisites: 'Entry readiness',
    outcomes: 'Target outcomes',
    pace: 'Proposed study pace',
    scope: 'Current scope',
    tools: 'Tool progression',
    completion: 'Proposed finish line',
    milestone: 'PLANNED MILESTONE',
    lesson: 'Detailed lesson planned',
    readiness: 'PREPARE · ',
    outcome: 'TARGET · ',
    practice: 'FUTURE PRACTICE · ',
    depends: 'BUILD ON · ',
    session: (week: number) => `Session ${week}`,
    next: (title: string, week: number) => `${title} (week ${week}) — review the target and prerequisites below. Detailed material will follow.`,
    review: (title: string, nth: number, days: number, due: string) => `${title} — review ${nth} (+${days} days, due ${due}). Explain the target from memory and revisit your practice evidence.`,
    testsUnavailable: 'This course currently has a roadmap and proposed milestones. Tests will be added after the lessons are written.',
    back: '← Back to roadmap',
  },

  roadmap: {
    tagReview: 'REVIEW',
    tagTest: 'TEST',
    tagNext: 'UP NEXT',
    tagDone: 'ALL DONE',
    itemReview: (title: string, nth: number, days: number, due: string) =>
      `${title} — review #${nth} (+${days} days, due ${due}). Retake the quiz, or just explain the main ideas out loud to yourself.`,
    itemTest: (partNo: string) =>
      `You’ve finished ${partNo} — take the part test to lock it in before moving on.`,
    itemNext: (title: string, week: number) =>
      `${title} (week ${week}) — opens with the math primer, closes with a quiz.`,
    itemAllDone: "You’ve finished the whole course and nothing is due for review. Go take a break, you’ve earned it 🎉",

    statProgress: 'Progress',
    ofSessions: (n: number) => ` / ${n} sessions`,
    statAvg: 'Quiz avg',
    avgSub: "across the sessions you’ve done",
    statDue: 'Due for review today',
    dueScheduleA: 'on the ',
    dueScheduleB: ' day schedule',
    schemeTitle: 'Click to change the review schedule',

    todayA: 'Today · ',
    todaySub: 'I build this from your progress and review schedule',
    open: 'Open →',
    markReviewed: 'Reviewed ✓',

    p1Title: '01 · ACTIVE RECALL',
    p1Body: 'You have to remember it before you get to see the answer. The quizzes and the “guess the next step” mode do exactly one job: they stop you from skim-reading.',
    p2Title: '02 · SPACED REPETITION',
    p2Body: (ivs: string) =>
      `Finish a session and the reviews schedule themselves ${ivs} days out. Reviewing right as you’re about to forget is what makes it stick — review too early and you’ve wasted the trip.`,
    p3Title: '03 · MATH PRIMER FIRST',
    p3Body: 'Every session opens with a 5–10 minute math card and its English–Vietnamese terms, so the formulas later never make you stall.',
    p4Title: '04 · REPORT AFTER EACH SESSION',
    p4Body: "Quizzes are scored by topic and turn into a strengths-and-gaps report right under each session. No guessing about where you’re thin.",

    partTestChip: 'PART TEST',
    partTestSuffix: " — take it once you’ve finished every session in the part.",
    score: (n: number) => `SCORE ${n}%`,
    retake: 'Retake',
    take: 'Start',

    week: 'WEEK',
    titlePrefix: '^Session \\d+ · ',
    mathChip: 'MATH PRIMER · ',
    openLesson: 'Open the interactive lesson →',
    lessonBuilding: 'Interactive lesson coming soon',
    strong: 'STRENGTHS · ',
    weak: 'TO IMPROVE · ',
    hint: 'NEXT · ',
    answeredRight: (list: string) => `Answered correctly: ${list}.`,
    answeredWrong: (list: string) => `Answered wrong: ${list}.`,
    quizDone: 'Quiz completed.',
    markedDone: 'Marked as done.',
    noWrongTopic: "Didn’t miss a single topic — nice.",
    noQuizData: 'No quiz data yet.',
    quizBadge: (n: number) => `QUIZ ${n}%`,
    stTodo: 'To do',
    stDoing: 'Doing',
    stDone: 'Done ✓',
    reviewDots: 'REV',
    reviewDotTitle: (nth: number, date: string) => `Review #${nth} · ${date}`,
    reviewDone: ' · reviewed',
    reviewDue: ' · DUE',
    privacyNote: 'Your progress is stored in this browser (localStorage) — it never goes anywhere.',
  },

  test: {
    back: '← 11-week roadmap',
    closedBook: 'CLOSE THE BOOK · NO PEEKING AT THE LESSONS FIRST',
    titleA: 'The ',
    titleAccent: 'cumulative',
    titleB: ' test at the end of each part',
    lead: "One per part, taken once you’ve finished the sessions in it. I score it session by session, so you know exactly where to go back to instead of guessing. The result saves itself to your roadmap.",
    correct: '✓ Right. ',
    incorrect: (letter: string) => `✗ Wrong — the answer is ${letter}. `,
    savedBtn: 'Saved to your roadmap ✓',
    saveBtn: 'Submit & save to roadmap',
    answered: (a: number, n: number) => `Answered ${a}/${n}`,
    finished: (n: number, c: number) => `Done ${n}/${n} — ${c} correct`,
    result: (score: number, c: number, n: number) => `Result: ${score}% (${c}/${n})`,
    solid: 'SOLID · ',
    weak: 'GAPS · ',
    hint: 'NEXT · ',
    none: '—',
    gapsSuffix: ' — go reopen those sessions in the roadmap.',
    noGaps: 'No gaps at all!',
    tipLow: "Go relearn the sessions you’re thin on, then retake this in 2 days. Not right now — while you still remember the answers you’re only fooling yourself.",
    tipMid: 'Review only the sessions you missed above, not all of them. Retake in 2–3 days to lock it in.',
    tipHigh: "You’re solid on this part 🎉 On to the next one.",
  },
} satisfies typeof VI;

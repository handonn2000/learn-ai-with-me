// Data nội dung bài 2 — bản tiếng Anh. Giữ ĐÚNG thứ tự khóa của agents-data.js.
//
// LƯU Ý VỀ CẶP `vn` / `en` (và `left`/`leftEn`, `agent`/`en`, `label`/`en`):
// Ở bản Việt, trường đầu là nhãn tiếng Việt còn trường `*En` là thuật ngữ tiếng Anh đi kèm.
// Ở bản này chúng SOI GƯƠNG: trường đầu là tiếng Anh, trường `*En` mang thuật ngữ tiếng Việt.
// Nhờ vậy người học hướng nào cũng thấy cặp Anh–Việt, và giao diện không hiện hai lần cùng
// một chữ. Tên khóa vì thế đọc theo VỊ TRÍ chứ không theo nghĩa đen — y như `Session.en`.

/* ===== Mục 05 · PEAS ===== */

export const PEAS_ROWS = [
  {
    agent: 'Taxi driver', en: 'Tài xế taxi', hero: true,
    p: 'Safe, fast, legal, comfortable ride, maximum profit',
    e: 'Roads, other traffic, pedestrians, passengers',
    a: 'Steering, accelerator, brake, indicators, horn, display',
    s: 'Cameras, sonar, speedometer, GPS, odometer, accelerometer, engine sensors, keyboard',
  },
  {
    agent: 'Medical diagnosis system', en: 'Hệ chẩn đoán y khoa',
    p: 'Healthy patient, reduced cost',
    e: 'Patient, hospital, medical staff',
    a: 'Display of questions, tests, diagnoses, treatment plans, referrals',
    s: 'Keyboard entry of symptoms, findings, patient’s answers',
  },
  {
    agent: 'Satellite image analysis system', en: 'Hệ phân tích ảnh vệ tinh',
    p: 'Correct image categorization',
    e: 'Downlink from an orbiting satellite',
    a: 'Display of the scene categorization',
    s: 'Color pixel arrays',
  },
  {
    agent: 'Part-picking robot', en: 'Robot gắp linh kiện',
    p: 'Percentage of parts in the correct bins',
    e: 'Conveyor belt with parts, the bins',
    a: 'Jointed arm and hand',
    s: 'Camera, joint angle sensors',
  },
  {
    agent: 'Refinery controller', en: 'Bộ điều khiển nhà máy lọc dầu',
    p: 'Purity, yield, safety',
    e: 'Refinery, operators',
    a: 'Valves, pumps, heaters, displays',
    s: 'Temperature, pressure and chemical sensors',
  },
  {
    agent: 'Coding assistant', en: 'Trợ lý lập trình',
    p: 'Code that runs, matches what the user meant, needs little rework',
    e: 'Project source, compiler, terminal, the user',
    a: 'Edit files, run commands, call tools, answer in text',
    s: 'File contents, error messages, command output, what the user types',
  },
  {
    agent: 'Interactive English tutor', en: 'Gia sư tiếng Anh',
    p: 'Students’ test scores',
    e: 'A set of students, the examining body',
    a: 'Display of exercises, hints, corrections',
    s: 'Keyboard',
  },
];

/* ===== Mục 06 · Các chiều của môi trường ===== */

export const DIMS = [
  { id: 'obs', vn: 'Observability', en: 'Quan sát', left: 'Fully', right: 'Partially', leftEn: 'Đầy đủ', rightEn: 'Một phần' },
  { id: 'ag', vn: 'Number of agents', en: 'Số agent', left: 'Single', right: 'Multi', leftEn: 'Một', rightEn: 'Nhiều' },
  { id: 'det', vn: 'Action outcomes', en: 'Kết quả hành động', left: 'Deterministic', right: 'Stochastic', leftEn: 'Tất định', rightEn: 'Ngẫu nhiên' },
  { id: 'ep', vn: 'Decisions', en: 'Các quyết định', left: 'Episodic', right: 'Sequential', leftEn: 'Từng hồi', rightEn: 'Tuần tự' },
  { id: 'st', vn: 'Time', en: 'Thời gian', left: 'Static', right: 'Dynamic', leftEn: 'Tĩnh', rightEn: 'Động', mid: 'Semi', midEn: 'Nửa động' },
  { id: 'dis', vn: 'Values', en: 'Giá trị', left: 'Discrete', right: 'Continuous', leftEn: 'Rời rạc', rightEn: 'Liên tục' },
];

export const ENVIRONMENTS = [
  {
    id: 'crossword', label: 'Crossword puzzle', en: 'Ô chữ',
    v: { obs: 'l', ag: 'l', det: 'l', ep: 'r', st: 'l', dis: 'l' },
    note: 'This is the <strong class="hl-green">easiest environment there is</strong>: all six dimensions land on the left, except that the entries constrain each other so you have to think ahead. A crossword doesn’t fill in extra letters while you go and make tea — take as long as you like.',
  },
  {
    id: 'chess', label: 'Chess with a clock', en: 'Cờ vua có đồng hồ',
    v: { obs: 'l', ag: 'r', det: 'l', ep: 'r', st: 'm', dis: 'l' },
    note: 'Notice the <strong class="hl-yellow">semi-dynamic</strong> cell — a subtle one that often gets skipped. The board makes no move while you sit thinking, but the clock keeps running: the environment stands still and your <em>score</em> does not.',
  },
  {
    id: 'poker', label: 'Poker', en: 'Poker',
    v: { obs: 'r', ag: 'r', det: 'r', ep: 'r', st: 'l', dis: 'l' },
    note: 'Also a table game, also discrete, but poker jumps to <strong class="hl">partially observable</strong> — your opponent’s cards are face down — <em>and</em> stochastic, because of the deal. Click across to backgammon next door before reading anything else: these two differ by exactly one cell, and it is the most instructive cell in the table.',
  },
  {
    id: 'backgammon', label: 'Backgammon', en: 'Backgammon',
    v: { obs: 'l', ag: 'r', det: 'r', ep: 'r', st: 'l', dis: 'l' },
    note: 'This is the specimen I was saving: <strong class="hl-green">fully observable</strong> and still <strong class="hl">stochastic</strong>. Every piece is out on the board, nobody hides anything — but you still have to roll the dice, so you can’t predict where a move leads. Seeing everything ≠ predicting everything; poker has both problems, backgammon only one.',
  },
  {
    id: 'taxi', label: 'Taxi driving', en: 'Lái taxi',
    v: { obs: 'r', ag: 'r', det: 'r', ep: 'r', st: 'r', dis: 'r' },
    note: 'The full right-hand set, not one dimension missing — this is the claim that “most real-world situations look like this”. If you have been wondering why self-driving cars are so hard when a machine beat humans at chess back in 1997, the answer is all in this row.',
  },
  {
    id: 'medical', label: 'Medical diagnosis', en: 'Chẩn đoán y khoa',
    v: { obs: 'r', ag: 'l', det: 'r', ep: 'r', st: 'r', dis: 'r' },
    note: 'Identical to taxi driving except for one cell: <strong class="hl">single agent</strong>. The bacterium isn’t working out how to outwit the doctor — it is unpredictable, but it is not an opponent.',
  },
  {
    id: 'partpick', label: 'Part-picking robot', en: 'Robot gắp linh kiện',
    v: { obs: 'r', ag: 'l', det: 'r', ep: 'l', st: 'r', dis: 'r' },
    note: 'The only row lit on the left of the fourth dimension: <strong class="hl-green">episodic</strong>. Fumble this part and the next one still arrives on the belt exactly as before — no consequence carries forward, so the robot never has to think ahead.',
  },
  {
    id: 'coding', label: 'Coding assistant', en: 'Trợ lý lập trình',
    v: { obs: 'r', ag: 'r', det: 'r', ep: 'r', st: 'r', dis: 'l' },
    note: 'This row isn’t in the original material — I added it because it is the one you use daily. The most telling cell is <strong class="hl">partially observable</strong>: it can’t see all of your source, and it certainly can’t see the thing you actually wanted but forgot to say. And <strong class="hl">multi-agent</strong> here is the cooperative kind — you and it both want working code, so your measures mostly point the same way.',
  },
  {
    id: 'tutor', label: 'Interactive English tutor', en: 'Gia sư tiếng Anh',
    v: { obs: 'r', ag: 'r', det: 'r', ep: 'r', st: 'r', dis: 'l' },
    note: 'Nearly the same seven dimensions as taxi driving, but <strong class="hl">discrete</strong> — a tutor types words rather than turning a wheel by 0.3 degrees. And it is genuinely multi-agent: students have goals of their own, sometimes “pass with minimum effort”.',
  },
];

/* ===== Mục 08 · Năm kiến trúc agent ===== */

export const ARCH_LEVELS = [
  {
    n: 1, id: 'reflex', name: 'Simple reflex', en: 'Phản xạ đơn giản', color: 'var(--cyan)',
    adds: 'Condition–action rules',
    body: 'Look at the <em>current</em> percept, scan a pile of <span class="code-inline">IF… THEN…</span> rules, and do whatever matches. The past is thrown away entirely. <strong class="hl">IF the car in front brakes THEN brake</strong> — that’s it, no need to know where you are or where you’re going.',
    limit: 'Two problems, not one. <strong class="hl">One:</strong> it only works when the environment is fully observable — one missing piece of information and it is blind, with nowhere to store that piece anyway. <strong class="hl">Two:</strong> some things you know cannot be written as <span class="code-inline">IF… THEN…</span> rules at all — try writing the rule for “recognize a friend’s face”. If you can’t state it, you can’t fit it into this architecture, and that is why sessions 10–11 have to let the machine extract rules from data itself.',
  },
  {
    n: 2, id: 'model', name: 'Model-based reflex', en: 'Phản xạ có mô hình', color: 'var(--green)',
    adds: 'Internal state + world model',
    body: 'Add a notebook: <strong class="hl">internal state</strong>, recording what the sensors can no longer see. Keeping that notebook current takes exactly two kinds of knowledge — how the world changes on its own when you do nothing, and how your own actions change it. Together those are the <em>world model</em>.',
    limit: 'It knows how the world is, and still doesn’t know how it wants the world to be. At a fork in the road it just stands there.',
  },
  {
    n: 3, id: 'goal', name: 'Goal-based', en: 'Hướng mục tiêu', color: 'var(--yellow)',
    adds: 'Goals + a “what if I do A” test',
    body: 'Add a description of <strong class="hl">the situation it wants to reach</strong>. Now the agent can imagine: if I take action A, what does the world become, and is that closer to the goal? Genuinely slower than a reflex, and in exchange the knowledge is explicit — want the car to go somewhere else, change the goal rather than rewriting the pile of rules.',
    limit: 'A goal only answers reached or not reached. But of ten routes home some are good and some are awful, and a binary can’t tell them apart.',
  },
  {
    n: 4, id: 'utility', name: 'Utility-based', en: 'Hướng thỏa dụng', color: 'var(--purple)',
    adds: 'A utility function',
    body: 'Replace “can I get there” with “<strong class="hl">how happy will I be</strong> when I do”. The utility function is the performance measure internalized inside the agent’s head. Having a scale rather than a switch lets it handle two things a goal cannot: weighing conflicting goals against each other (fast vs safe), and weighing the sure thing against the valuable gamble. Put compactly, a rational agent at this level picks the action that <strong class="hl">maximizes the EXPECTED utility</strong> of the outcomes — hold on to that word “expected”, sessions 5 and 9 turn it into actual numbers.',
    limit: 'Somebody still has to sit down and write out every rule, every model, every scale for it. Once programmed, it stays exactly where it was.',
  },
  {
    n: 5, id: 'learning', name: 'Learning', en: 'Biết học', color: 'var(--red)',
    adds: 'Critic · learner · problem generator',
    body: 'This is where the diagram turns inside out: <strong class="hl">the entire agent you built across four levels shrinks into a single box</strong> — the performance element. Three new boxes grow around it, and that loop is what lets an agent improve itself.',
    limit: null,
  },
];

export const LEARNING_PARTS = [
  {
    k: 'PERFORMANCE ELEMENT', en: 'Bộ thi hành', color: 'var(--cyan)',
    what: 'The agent from the previous four levels: take percepts, choose actions.',
    taxi: 'All the knowledge and procedure the taxi uses to decide how to steer.',
  },
  {
    k: 'CRITIC', en: 'Bộ phê bình', color: 'var(--red)',
    what: 'Watches the percepts and grades: was that good or bad? It grades against a <strong class="hl">fixed performance standard set from outside</strong> — fixed by necessity, because an agent able to edit its own ruler will edit it to score easily.',
    taxi: 'Sees the driver cut across three lanes to turn left, hears the shouting from the cars around → concludes: that was a bad move.',
  },
  {
    k: 'LEARNING ELEMENT', en: 'Bộ học', color: 'var(--green)',
    what: 'Takes the criticism and improves the performance element for next time.',
    taxi: 'Writes a new rule for exactly that three-lane maneuver.',
  },
  {
    k: 'PROBLEM GENERATOR', en: 'Bộ sinh vấn đề', color: 'var(--yellow)',
    what: 'Proposes actions that are <em>not necessarily optimal</em> but bring new experience. Without it the agent keeps repeating what it already knows works — and never finds out whether something better exists.',
    taxi: 'Suggests trying the brakes on different road surfaces, under different conditions.',
  },
];

/* ===== Mục 10 · Bài tập ===== */

export const HW = [
  ['QUESTION 1 — HIDE AND SEEK', 'A boy is playing hide and seek with his friends in a yard. He is <em>the seeker</em>: he has to find everyone hiding and call out “Found you” each time he catches someone. Write the <strong class="hl">PEAS</strong> description for this task environment: Performance measure · Environment · Actuators · Sensors.', '<a href="#ch5">Review: section 05 — PEAS, and how to write the measure</a>'],
  ['QUESTION 2 — ENVIRONMENT PROPERTIES FOR QUESTION 1', 'Determine four dimensions for that same task, <strong class="hl">with a justification for each</strong>: fully or partially observable · single or multi-agent · deterministic or stochastic · episodic or sequential.', '<a href="#ch6">Review: section 06 — the seven dimensions, try the explorer table</a>'],
  ['QUESTION 3 — BLIND MAN’S BUFF', 'Same yard, but the boy is blindfolded and is <em>the catcher</em>: touch someone and you swap roles with them, while the others shout and laugh to throw off his sense of direction. Write the <strong class="hl">PEAS</strong> description for this task.', '<a href="#ch5">Review: section 05 — PEAS</a> · <a href="#ch1">section 01 — sensors and actuators</a>'],
  ['QUESTION 4 — ENVIRONMENT PROPERTIES FOR QUESTION 3', 'The same four dimensions again, with justifications. Then compare your answers for question 2 and question 4: same yard, only a blindfold and some noise added — <strong class="hl">which dimension changed value?</strong> With that dimension changed, how far up the levels in section <a href="#ch8">08</a> must the minimum agent architecture climb?', '<a href="#ch8">Review: section 08 — why losing full observability means needing memory</a>'],
];

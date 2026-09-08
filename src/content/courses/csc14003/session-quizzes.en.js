// Quiz cuối buổi — bản tiếng Anh. Giữ ĐÚNG thứ tự khóa của session-quizzes.js.
//
// BẤT BIẾN: `topicId` và `a` phải y hệt bản VI. Đổi là bản EN chấm khác bản VI và tiến độ
// người học tách đôi theo ngôn ngữ (ADR-0011) — check_i18n.py so từng câu.
//
// Buổi nào chưa dịch thì KHÔNG có khóa ở đây; selector trải {...VI, ...EN} nên buổi đó rơi về
// bản tiếng Việt thay vì biến mất.

export const SESSION_QUIZZES = {
  b1: [
    {
      topicId: 'four-approaches',
      q: 'A program is graded by comparing each of its reasoning steps against the thinking trace of a real person solving the same puzzle. Which box is it in?',
      opts: ['Think like humans', 'Act like humans', 'Think rationally', 'Act rationally'],
      a: 0,
      ex: 'Two giveaways: it opens the lid to inspect the <em>process</em> (thinking), and the ruler it holds up is <em>a real person</em>. That is exactly how Newell and Simon graded GPS in 1961 — the right answer earned no marks, the route through the head had to match too.',
    },
    {
      topicId: 'four-approaches',
      q: 'Why does this course take the “acting rationally” box as its spine rather than the other three?',
      opts: [
        'Because it is the easiest one to program',
        'Because it is broader than the logicist road and still has a clear standard you can do science on',
        'Because the other three have been proven wrong',
        'Because it is the only box that needs no math',
      ],
      a: 1,
      ex: 'Two reasons, both practical. <strong class="hl">Broader</strong>: reasoning by the rules is only one way to act correctly, while yanking your hand off a hot stove involves no reasoning at all and is still the right action. <strong class="hl">Easier to do science on</strong>: “rational” can be defined mathematically, whereas “human-like” means going and asking humans.',
    },
    {
      topicId: 'turing-test',
      q: 'Which statement correctly describes the Turing test’s intrinsic limitation?',
      opts: [
        'It is too hard — no machine has passed it yet',
        'It measures human behavior, and that set only partly overlaps with the set of intelligent behavior',
        'It can only measure written text, not vision',
        'It requires the machine to explain how it thinks',
      ],
      a: 1,
      ex: 'This ruler is both too strict and too loose. Too loose, because plenty of very human behavior isn’t intelligent at all — a machine has to fake typos to get through. Too strict, because plenty of intelligent behavior is beyond people — do it and you give yourself away, so you fail. Vision is handled by the Total Turing Test, which is a separate matter.',
    },
    {
      topicId: 'foundations',
      q: 'AI ⊃ Machine Learning ⊃ Deep Learning. Which reading is right?',
      opts: [
        'Three different names for the same thing',
        'Deep learning is a kind of machine learning, and machine learning is one way of doing AI — but AI has plenty of branches that learn nothing at all',
        'AI is an application of deep learning',
        'Machine learning came before AI',
      ],
      a: 1,
      ex: 'Russian dolls: each layer sits inside the next. The bit people forget is the AI branches that <em>don’t</em> learn anything — search, logic and CSPs fill sessions 3 through 8, and not one of them needs a single row of training data.',
    },
    {
      topicId: 'history',
      q: 'What mechanism produces an “AI winter”?',
      opts: [
        'Computers of the day were too slow',
        'The field over-promised, failed to deliver, and funders pulled their money',
        'Researchers left for other fields because of low pay',
        'There was no data to train on',
      ],
      a: 1,
      ex: 'Every winter follows the same recipe, and it has run twice: 1974–80 and then 1988–93. Slow hardware or missing data were only the <em>reason</em> nothing shipped; what killed the field was the gap between the promise and the result.',
    },
    {
      topicId: 'history',
      q: 'Put these in chronological order: (1) Deep Blue beats Kasparov · (2) the Dartmouth conference · (3) AlphaGo beats Lee Sedol · (4) the Transformer architecture',
      opts: ['2 → 1 → 3 → 4', '2 → 1 → 4 → 3', '1 → 2 → 3 → 4', '2 → 3 → 1 → 4'],
      a: 0,
      ex: 'Dartmouth 1956 → Deep Blue 1997 → AlphaGo 2016 → Transformer 2017. The trap is the last two: the Transformer landed exactly one year <em>after</em> AlphaGo, even though its name sounds far more current now.',
    },
    {
      topicId: 'rational-agent',
      q: 'What does “rational” mean in AI?',
      opts: [
        'Never producing a wrong result',
        'Knowing every outcome of an action in advance',
        'Choosing the action expected to lead to the best outcome, given the information at hand',
        'Reasoning strictly by the rules of formal logic',
      ],
      a: 2,
      ex: 'Remember this one for me: <strong class="hl">rational ≠ omniscient</strong>. You cross an empty street and an aircraft door lands on you — that decision was still rational, you were just unlucky. Rationality grades the <em>decision</em>, not the <em>outcome</em>.',
    },
    {
      topicId: 'applications-limits',
      q: 'Machines have beaten people at chess (1997), Go (2016) and poker (2017). What follows from that?',
      opts: [
        'Machines are now more intelligent than people at everything',
        'Games with explicit rules and a clear win signal are easy ground for AI — nothing follows about tasks that have neither',
        'Go is harder, so AlphaGo is more intelligent than Deep Blue',
        'Poker is fully observable, which is why the machine wins easily',
      ],
      a: 1,
      ex: 'The easiest trap in the session. Games hand AI what real life rarely does: complete rules, a clear state, and an immediate signal saying whether you won. Take those three away and the problem gets hard fast — session 2 measures exactly how much harder, using the seven environment dimensions. And poker hides cards, which makes it <em>partially</em> observable.',
    },
  ],
  b2: [
    {
      topicId: 'agent-function',
      q: 'Where does the agent function differ from the agent program?',
      opts: [
        'They don’t differ, they’re two names for one thing',
        'The agent function takes the whole percept sequence so far; the agent program is only handed the current percept',
        'The agent function is written in math, the agent program in Python',
        'The agent program takes the whole sequence, the agent function only one percept',
      ],
      a: 1,
      ex: 'This is the small detail that bites hard in section 08. The function is the <em>mathematical description</em> of the behavior and takes the entire history <span class="code-inline">𝓟*</span>. The program is the runnable version, and the environment only hands it what it just saw — to remember the past it has to invent its own storage. That storage is internal state.',
    },
    {
      topicId: 'perf-measure',
      q: 'What does the performance measure grade?',
      opts: [
        'The sequence of environment states',
        'The agent’s internal state',
        'How many actions the agent has taken',
        'How accurate the world model the agent keeps is',
      ],
      a: 0,
      ex: 'Underline this: it grades <strong class="hl">the floor</strong>, not the robot. An agent can feel it is doing wonderfully, brimming with confidence — the score still belongs to the environment. That is also why you set the ruler by <em>what you want to be true of the environment</em>, not by how you think the agent ought to behave.',
    },
    {
      topicId: 'perf-measure',
      q: 'In the lab, same two programs and the same already-spotless floor: the “clean floor” measure scores a 40–40 tie, while “clean floor, moving costs fuel” scores 20–39. What does that show?',
      opts: [
        'The program with memory is always more rational',
        'The question “is this rational” can only be answered once the measure is fixed — change the measure and you change the answer',
        'The second measure is set wrongly',
        'You need more than 20 steps before concluding anything',
      ],
      a: 1,
      ex: 'Not a line of either program changed, only the ruler did — and the pure reflex agent fell from perfect to dismal. Rationality is a relation between an agent <em>and</em> a measure, not a property sitting inside the agent.',
    },
    {
      topicId: 'rational-not-omniscient',
      q: 'Why does “going out to scout” count as part of being rational rather than a wasted move?',
      opts: [
        'Because it makes the agent look busier',
        'Because the action improves what you will see later, so acting blind isn’t bad luck, it’s recklessness',
        'Because the measure always rewards movement',
        'Because the agent needs data to train a model',
      ],
      a: 1,
      ex: 'Looking both ways before crossing gets you to your destination not one second sooner. But skip it and an accident stops being bad luck. You met exactly this in the lab: the version with memory still has to trudge over to the other square, because <em>until it has seen it, it has no right to conclude anything</em>.',
    },
    {
      topicId: 'peas',
      q: 'For a self-driving taxi, which PEAS component do “steering, accelerator, brake, indicators” belong to?',
      opts: ['Performance measure', 'Environment', 'Actuators', 'Sensors'],
      a: 2,
      ex: 'The A–S pair is the one most often confused. The trick: ask yourself “does this bring information <em>in</em> or push an effect <em>out</em>?”. Cameras, GPS and the speedometer bring information in → sensors. Steering, accelerator and brake push effects out → actuators.',
    },
    {
      topicId: 'env-dimensions',
      q: 'Poker and backgammon differ on exactly one dimension. Which one, and why is that spot worth remembering?',
      opts: [
        'Number of agents — poker has more players',
        'Discrete/continuous — backgammon has dice, so it is continuous',
        'Observability — backgammon shows the whole board, poker keeps opponents’ cards face down',
        'Static/dynamic — poker has a clock',
      ],
      a: 2,
      ex: 'Both are stochastic (the deal, the dice), but backgammon lays everything out on the board while poker keeps cards hidden. That is why I put backgammon in the table: it proves <strong class="hl">seeing everything ≠ predicting everything</strong>. Those two dimensions are independent — don’t glue them together.',
    },
    {
      topicId: 'lookup-table',
      q: 'A table-driven agent does exactly what you asked for. So where does it fail?',
      opts: [
        'Looking up is slower than running an algorithm',
        'It can’t handle a stochastic environment',
        'The table grows exponentially — chess alone needs at least 10¹⁵⁰ rows',
        'It can’t remember the percept sequence',
      ],
      a: 2,
      ex: 'It remembers the percept sequence perfectly well and answers correctly — the problem is purely storage. 10¹⁵⁰ rows, while the observable universe holds around 10⁸⁰ atoms. Gather every particle of matter into one drive and it still isn’t enough. The core challenge of AI sits right here: producing rational behavior from <em>a little code</em> rather than from many table rows.',
    },
    {
      topicId: 'five-architectures',
      q: 'A simple reflex agent breaks when the environment is only partially observable. Which level exists to cure that, and what does it add?',
      opts: [
        'Goal-based — adds a description of the situation it wants to reach',
        'Model-based reflex — adds internal state plus a model of how the world works',
        'Utility-based — adds a scale of scores for each state',
        'Learning — adds a critic and a learner',
      ],
      a: 1,
      ex: 'If you can’t see enough, you have to <strong class="hl">remember</strong> — that simple. And keeping that notebook current takes exactly two kinds of knowledge: how the world changes on its own when you do nothing, and how your own actions change it. The other three levels solve quite different problems: picking a goal, comparing goals, and getting better.',
    },
  ],
  b3: [
    {
      topicId: 'problem-statement',
      q: 'What are the five components of a search problem?',
      opts: [
        'Initial state · actions · transition model · goal test · path cost',
        'Initial state · goal · heuristic · frontier · explored set',
        'Vertices · edges · weights · path · cycle',
        'Initial state · actions · heuristic · goal test · cost',
      ],
      a: 0,
      ex: 'A heuristic is <em>not</em> part of the problem formulation. You add it to solve the problem faster; changing the heuristic doesn’t change the problem. Frontier and explored set don’t belong either: they’re the algorithm’s tools, not the problem description.',
    },
    {
      topicId: 'search-framework',
      q: 'BFS, DFS, and UCS share a graph-search loop. Where is the ONLY difference?',
      opts: ['The goal test', 'The frontier data structure', 'How successor states are generated', 'How the explored set is stored'],
      a: 1,
      ex: 'FIFO queue → BFS · LIFO stack → DFS · priority queue by g → UCS. One loop, three personalities. Remember this and you’ve got half the session — and the reason the Lab can switch algorithms by changing a line.',
    },
    {
      topicId: 'uninformed',
      q: 'When is BFS guaranteed to find an optimal path?',
      opts: [
        'Always',
        'When all edges have the same cost',
        'When the graph has no cycles',
        'When the heuristic is admissible',
      ],
      a: 1,
      ex: 'BFS optimizes the <em>number of edges</em>, but fewer edges isn’t cheaper: 2 flights can still cost more than 5 bus rides. Equal edge costs make the two coincide; otherwise you need UCS. BFS has nothing to do with heuristics.',
    },
    {
      topicId: 'uninformed',
      q: 'When does UCS stop?',
      opts: [
        'As soon as the goal is GENERATED and added to the frontier',
        'When the goal is REMOVED from the frontier',
        'When the frontier is empty',
        'When it finds a path cheaper than a threshold',
      ],
      a: 1,
      ex: 'This is where I see the most lost marks. When the goal is first generated, a cheaper route may still be waiting in the frontier. Stop then and you lose optimality. Wait until removal: nothing cheaper remains. BFS does the opposite; it can stop on generation.',
    },
    {
      topicId: 'uninformed',
      q: 'IDS revisits shallow levels repeatedly. Why use it?',
      opts: [
        'Because it’s faster than BFS',
        'Because the repeated work is small compared with the deepest level, while memory is O(bd) instead of O(b^d)',
        'Because it returns an optimal solution even with unequal edge costs',
        'Because it doesn’t need an explored set',
      ],
      a: 1,
      ex: 'In a branching tree, the last level holds more nodes than all the earlier levels combined, so repeating those shallow levels is nearly free. In return you get DFS’s memory use with BFS’s completeness and optimality. Unequal edge costs are still beyond IDS; that’s UCS’s job.',
    },
    {
      topicId: 'heuristic',
      q: 'With an admissible h, which statement is FALSE?',
      opts: [
        'A* tree-search returns an optimal solution',
        'h(goal) = 0',
        'h may exceed the true cost at some nodes as long as its average is lower',
        'GBFS using h may still return a suboptimal solution',
      ],
      a: 2,
      ex: 'Admissibility is a condition <strong class="hl">at every node</strong>: h(n) ≤ h*(n). You can’t average away a violation. Just one overestimating node removes A*’s optimality guarantee — one weak link breaks the chain.',
    },
    {
      topicId: 'admissible-consistent',
      q: 'How are admissibility and consistency related?',
      opts: [
        'Two names for the same property',
        'Consistency implies admissibility, but not the reverse',
        'Admissibility implies consistency, but not the reverse',
        'The two properties are completely independent',
      ],
      a: 1,
      ex: 'Consistency is stronger: h(n) ≤ c(n, n′) + h(n′) at every edge. It includes admissibility, but not the other way around. An admissible heuristic can be inconsistent, and that’s when A* graph-search needs care with closed nodes.',
    },
    {
      topicId: 'astar',
      q: 'Why does A* expand fewer nodes than UCS with a good h?',
      opts: [
        'Because A* ignores the explored set',
        'Because f = g + h focuses cost contours toward the goal instead of spreading evenly in every direction',
        'Because A* uses a stack instead of a priority queue',
        'Because A* stops as soon as the goal is generated',
      ],
      a: 1,
      ex: 'With h = 0, f = g: the contours are concentric circles around the start. A* becomes UCS, even spreading away from the goal. The closer h is to the true cost, the more the contours stretch toward the goal and hug the optimal path. Run both on Romania in the Lab and count the gray nodes to see it.',
    },
  ],
};

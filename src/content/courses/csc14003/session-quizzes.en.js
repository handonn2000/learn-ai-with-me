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
      ex: 'Russian dolls: each layer sits inside the next. The bit people forget is the AI branches that <em>don’t</em> learn anything — search, logic and CSPs fill sessions 3 through 10, and not one of them needs a single row of training data.',
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
        "topicId": "problem-statement",
        "q": "A two-way map has edges A–B, A–C, B–C, B–D and C–D. What is Actions(B)?",
        "opts": [
            "{Go D}",
            "{Go A, Go C, Go D}",
            "{A, B, C, D}",
            "Result(A, Go B) = B"
        ],
        "a": 1,
        "ex": "B directly connects to A, C and D, so all three actions are legal. Having D as the goal does not restrict Actions(B) to Go D. Result describes an action’s outcome, not the set of available actions."
    },
    {
        "topicId": "problem-statement",
        "q": "A–B is 2 km, B–C is 1 km, C–D is 2 km. What does A → B → C → D cost?",
        "opts": [
            "3 km because there are 3 steps",
            "2 km because that is the last edge",
            "5 km",
            "You need to know the search algorithm first"
        ],
        "a": 2,
        "ex": "Path cost adds step costs: 2 + 1 + 2 = 5 km. Three steps count actions, not kilometres. You do not need an algorithm to cost a given path."
    },
    {
        "topicId": "problem-statement",
        "q": "Cars can run out of fuel and there are no refuelling stations. Two cars at B have different fuel levels. Why might state B alone be insufficient?",
        "opts": [
            "Every state must have at least two variables",
            "The entire trip history must be stored",
            "The car colour has not been recorded",
            "Remaining fuel determines which roads are still feasible"
        ],
        "a": 3,
        "ex": "The same location with different remaining fuel can give different available actions. Keep at least location and remaining fuel under your consumption model. The entire history is not necessarily needed."
    },
    {
        "topicId": "search-framework",
        "q": "n2 records A → C at cost 5; n3 records A → B → C at cost 3. Which statement is correct?",
        "opts": [
            "Same STATE = C, different PARENT and g",
            "Same state means the same node",
            "n3 has g = 2 because it takes two steps",
            "n2 is not a state because it is more expensive"
        ],
        "a": 0,
        "ex": "Both contain state C. n2 has the A node as parent and g = 5; n3 has the B node as parent and g = 3. Nodes retain path information in addition to the final state."
    },
    {
        "topicId": "search-framework",
        "q": "In least-cost search, C is already in the frontier with g = 5. A new path reaches C with g = 3. What should happen?",
        "opts": [
            "Discard the new path because C was already seen",
            "Stop because a cheaper path was found",
            "Update the path to C, including its cost and parent",
            "Change 5 to 3 but retain the old parent"
        ],
        "a": 2,
        "ex": "Keep the cheaper path and update the information needed to reconstruct it. Changing g without the parent can return a path that does not match its stated cost. Repeated-state blocking alone is insufficient for cost-based search."
    }
],
  b4: [
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
      topicId: 'uninformed',
      q: 'DFS costs O(bm) memory while BFS costs O(b^d). Why the huge gap?',
      opts: [
        'DFS keeps no explored set',
        'BFS has to hold an entire bottom layer in the frontier, while DFS holds only the branch it is currently on',
        'DFS recurses, so its memory sits on the system stack and does not count',
        'BFS duplicates every node to store the path',
      ],
      a: 1,
      ex: 'Picture the BFS frontier: it must remember the WHOLE last layer at once, and that last layer is very nearly the entire tree. DFS only needs one root-to-leaf path plus the unvisited siblings along it — linear in depth. This gap is the whole reason IDS exists: borrow the memory profile of DFS, keep the optimality of BFS.',
    },
    {
      topicId: 'uninformed',
      q: 'When DLS hits the depth limit ℓ it returns <em>cutoff</em>. Why must that differ from <em>failure</em>?',
      opts: [
        'It is a naming convention and changes nothing',
        'cutoff means “there might be a solution deeper, unknown”; failure means “genuinely out of road” — IDS uses that to decide whether to raise ℓ',
        'cutoff is for directed graphs, failure for undirected',
        'failure means a cycle was found, cutoff means memory ran out',
      ],
      a: 1,
      ex: 'Collapsing the two is a classic bug. If DLS returns failure when it merely hit the ceiling, IDS concludes the problem has no solution and stops — while the solution sits one level down. The other way round, returning cutoff when the road really has ended leaves IDS looping forever.',
    },
    {
      topicId: 'uninformed',
      q: 'When every edge costs the same, how does UCS behave?',
      opts: [
        'It coincides with DFS',
        'It coincides with BFS',
        'It coincides with IDS',
        'Still different from all three, because UCS always uses a priority queue',
      ],
      a: 1,
      ex: 'With equal costs, g(n) is just the edge count times a constant, so “cheapest” and “shallowest” are the same ordering — exactly the order BFS expands in. The data structure stays a priority queue, but the <em>sequence</em> it produces matches BFS. One detail still differs: UCS stops when the goal is POPPED, BFS when the goal is GENERATED.',
    },
  ],
  b5: [
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
    {
      topicId: 'heuristic',
      q: 'On the Romania map GBFS returns a 450 km route and A* returns 418 km. Where did those 32 km go?',
      opts: [
        'GBFS uses a heuristic that is not admissible',
        'GBFS looks only at h(n) — the road ahead — so it ignores the cost already paid and picks a branch that merely looks close to the goal',
        'GBFS stops too early, before the frontier is exhausted',
        'The two algorithms use different heuristic tables',
      ],
      a: 1,
      ex: 'Same h, same map. The only difference is that GBFS drops the g(n) term: it lunges at whatever looks nearest the goal without asking “how much have I already spent getting here?”. Greedy in the literal sense — take the good-looking step now, pay for it at the end. A* adds both terms and does not fall for it.',
    },
    {
      topicId: 'admissible-consistent',
      q: 'Consistency is written h(n) ≤ c(n, a, n′) + h(n′). Which inequality is that, and what does it say?',
      opts: [
        'Cauchy — h is bounded by an arithmetic mean',
        'The triangle inequality — going straight to the goal cannot cost more than detouring through an intermediate node',
        'Markov — the error in h shrinks over time',
        'No inequality at all, purely a naming convention',
      ],
      a: 1,
      ex: 'A literal triangle: the estimate from n straight to the goal may not exceed (cost n → n′) plus (estimate from n′ to the goal). The consequence is that f never decreases along a path, so the first time a node is popped off the frontier it is already optimal — and that is what lets A* use graph-search and stay optimal.',
    },
    {
      topicId: 'astar',
      q: 'Is A* complete unconditionally?',
      opts: [
        'Yes, as long as the heuristic is admissible',
        'No — it also needs finite b and every step cost ≥ some ε > 0, exactly the condition UCS has',
        'Yes, because f = g + h always grows, so it must reach the goal',
        'No — A* is complete only on undirected graphs',
      ],
      a: 1,
      ex: 'Easy to nod past. Admissibility buys you <em>optimality</em>, not <em>completeness</em>. If step costs shrink toward 0, A* can walk an infinite path whose total cost stays finite and never reach the goal at all. Same trap you already met with UCS — the slide even says “review the condition for completeness of UCS”.',
    },
  ],
  b6: [
  {
    topicId: "local-model",
    q: "In the 8-queens model, each column has one queen and a move changes one queen’s row. How many states and neighbors per state are there?",
    opts: [
      "8! states, 28 neighbors",
      "8⁸ states, 56 neighbors",
      "64 states, 8 neighbors",
      "2⁸ states, 64 neighbors"
    ],
    a: 1,
    ex: "Each column independently chooses 1 of 8 rows, giving 8⁸ states. Choose 1 of 8 queens and 1 of 7 other rows: 8 × 7 = 56 neighbors. The row string permits repeats; it is not a permutation."
  },
  {
    topicId: "local-landscape",
    q: "When minimizing cost, a state with h = 1 has only neighbors with h ≥ 2. Can sideways moves immediately rescue it?",
    opts: [
      "Yes: sideways moves always find a goal",
      "No: there is no equal-valued neighbor to move to",
      "Yes: h = 1 is already solved",
      "No: you must add more queens"
    ],
    a: 1,
    ex: "This is a strict local minimum: there is no sideways move to use. You need something else, such as a restart or accepting a worsening move. h = 1 still means one attacking pair."
  },
  {
    topicId: "local-variants",
    q: "How does first-choice differ from steepest ascent?",
    opts: [
      "It accepts the first neighbor even if worse",
      "It keeps the whole frontier",
      "It tries random ordering and accepts the first improvement without scoring every neighbor",
      "It always chooses the greatest improvement"
    ],
    a: 2,
    ex: "I only need an improving move to proceed, not necessarily the best one. Stochastic hill-climbing selects among improving moves; first-choice can stop looking for neighbors early."
  },
  {
    topicId: "local-restart",
    q: "Independent runs each succeed with p = 0.25. What is the expected number of runs, including the first?",
    opts: [
      "3",
      "4",
      "0.25",
      "25"
    ],
    a: 1,
    ex: "1/p = 4 runs including the first; expected restarts after that first run are 3. Changing the label without changing what you count introduces an off-by-one error."
  },
  {
    topicId: "local-annealing",
    q: "SA minimizes cost: C(current) = 5, C(next) = 7, T = 2. What is this move’s acceptance probability?",
    opts: [
      "1, because 7 is greater than 5",
      "e¹ > 1",
      "e⁻¹ ≈ 0.368",
      "0: all worsening moves are rejected"
    ],
    a: 2,
    ex: "ΔC = 7 − 5 = 2 > 0, so P = exp(−2/2) = e⁻¹. Increasing cost needs the negative sign; a probability cannot exceed 1."
  },
  {
    topicId: "local-beam",
    q: "A maximizing beam with k = 2 sees A’s children scored 9, 8 and B’s children scored 6, 5. Which survive?",
    opts: [
      "A:9 and B:6",
      "A:8 and B:5",
      "A:9 and A:8",
      "All four"
    ],
    a: 2,
    ex: "Beam selection uses a shared list, so both slots can go to the same parent. A:9 and B:6 would preserve independent branches; this distinction also explains the diversity risk."
  },
  {
    topicId: "local-genetic",
    q: "A 4-queens population has fitness values 2, 3, 1, 0. What is the roulette probability of selecting the individual with fitness = 3?",
    opts: [
      "3/4",
      "1/3",
      "1/2",
      "1"
    ],
    a: 2,
    ex: "Total fitness is 6, so 3/6 = 1/2. This is a probability on each draw, not a promise that exactly half the selected parents in a small generation will be this individual."
  },
  {
    topicId: "local-genetic",
    q: "After crossing two valid individuals, which statement is correct?",
    opts: [
      "The child must be fitter than both parents",
      "Every representation guarantees a valid child",
      "Mutation is no longer needed",
      "Re-evaluate fitness and check the representation’s constraints"
    ],
    a: 3,
    ex: "An N-queens row string still has one queen per column, but conflicts can increase. A TSP permutation can even repeat or omit cities. Calling it “crossover” is not a substitute for checking."
  }
],
  b7: [
    { topicId: 'game-model', q: 'In a zero-sum minimax model, what does positive utility usually represent?', opts: ['An outcome good for MAX', 'An outcome good for MIN', 'A probability', 'A legal move'], a: 0, ex: 'Keep MAX’s perspective: a high score is good for MAX and bad for MIN.' },
    { topicId: 'minimax', q: 'A MIN node has child values 4, −1 and 2. Which value does it return?', opts: ['4', '2', '−1', '5'], a: 2, ex: 'MIN selects the smallest value for MAX.' },
    { topicId: 'minimax', q: 'A MAX root has two MIN children valued 3 and 0. Which branch does MAX choose?', opts: ['The 0 branch', 'The 3 branch', 'Randomly', 'Cannot determine'], a: 1, ex: 'MAX maximizes the guaranteed value, so it chooses 3.' },
    { topicId: 'minimax', q: 'What assumption does minimax make about the opponent?', opts: ['They play optimally', 'They always blunder', 'All moves are equally likely', 'The game has no terminal states'], a: 0, ex: 'Minimax protects against the opponent’s strongest response.' },
    { topicId: 'alpha-beta', q: 'What does α represent in alpha-beta pruning?', opts: ['The best value MIN has seen', 'A lower bound: MAX’s best option so far', 'Current depth', 'Win probability'], a: 1, ex: 'α is a lower bound on what MAX can guarantee.' },
    { topicId: 'alpha-beta', q: 'When can the rest of a branch be pruned?', opts: ['α ≥ β', 'α = 0', 'β = 0', 'At the first leaf'], a: 0, ex: 'When α ≥ β, this branch cannot change an ancestor’s decision.' },
    { topicId: 'depth-limited-games', q: 'What is needed to evaluate a nonterminal state when game search reaches its depth limit?', opts: ['A static evaluation function', 'A truth table', 'A unique hash', 'A FIFO queue'], a: 0, ex: 'An evaluation function estimates utility for a nonterminal state; it is only an approximation.' },
    { topicId: 'chance-nodes', q: 'A CHANCE node yields 8 (probability 1/4) or 0 (probability 3/4). What is its expected value?', opts: ['8', '4', '2', '6'], a: 2, ex: 'Expected value = 1/4 × 8 + 3/4 × 0 = 2.' },
  ],
  b9: [
    { topicId: 'kb-agent', q: 'In the KB-AGENT function, where does the inference happen?', opts: ['Hidden inside TELL and ASK', 'In the time counter t', 'In MAKE-PERCEPT-SENTENCE', 'A knowledge-based agent doesn’t need inference'], a: 0, ex: 'The agent’s loop does only three things: TELL what it just perceived, ASK what to do, TELL what it did. All the “new sentences from old ones” work is tucked inside <strong class="hl">TELL and ASK</strong> — so you can swap the inference engine without rewriting the agent.' },
    { topicId: 'entailment', q: 'What does KB ⊨ α mean?', opts: ['α is true in at least one model of the KB', 'α is true in every model where the KB is true, i.e. M(KB) ⊆ M(α)', 'The KB is true in every model of α', 'α appears word for word in the KB'], a: 1, ex: 'Entailment is a subset relationship: <strong class="hl">every</strong> world that survives the KB’s filter makes α true. One model isn’t enough, and α doesn’t have to be sitting in the KB already.' },
    { topicId: 'entailment', q: 'The agent has gone [1,1] → [2,1] and felt a breeze in [2,1]. Its KB doesn’t entail ¬P₂,₂. Which conclusion is right?', opts: ['[2,2] definitely has a pit', '[2,2] definitely has no pit', 'Unknown: the KB has models with a pit in [2,2] and models without one', 'The KB is contradictory'], a: 2, ex: 'KB ⊭ ¬P₂,₂ does <strong>not</strong> mean KB ⊨ P₂,₂. Of the KB’s three models, two have a pit in [2,2] and one doesn’t. A careful agent avoids that room until it gets more percepts.' },
    { topicId: 'pl-semantics', q: 'When is P ⇒ Q false?', opts: ['P false, Q true', 'P false, Q false', 'P true, Q false', 'P true, Q true'], a: 2, ex: 'Implication is a promise: it’s only broken when the condition happens and the result doesn’t. If P is false, the promise hasn’t been tested, so the sentence is still <strong class="hl">true</strong>.' },
    { topicId: 'validity-sat', q: 'What kind of sentence is (A ∧ B) ⇒ (A ∨ C)?', opts: ['Valid', 'Satisfiable but not valid', 'Unsatisfiable', 'Can’t tell without knowing C'], a: 0, ex: 'For the sentence to be false, A ∧ B has to be true — but then A is true, so A ∨ C is true too. No row makes it false, so it’s <strong class="hl">valid</strong>, whatever C is.' },
    { topicId: 'validity-sat', q: 'To prove α ⊨ β by contradiction, what do you check?', opts: ['α ∨ β is satisfiable', 'α ∧ ¬β is unsatisfiable', '¬α ∧ β is valid', 'β ⇒ α is valid'], a: 1, ex: 'α ⊨ β exactly when no world makes α true and β false, i.e. <strong class="hl">α ∧ ¬β is unsatisfiable</strong>. Resolution and DPLL both run on exactly that sentence.' },
    { topicId: 'resolution', q: 'What does resolving (A ∨ B) with (¬B ∨ C) give?', opts: ['A ∨ C', 'A ∧ C', 'B ∨ ¬B', '□ (the empty clause)'], a: 0, ex: 'B and ¬B are a complementary pair; drop them and merge the rest: <strong class="hl">A ∨ C</strong>. Why: if B is false the first clause forces A; if B is true the second forces C — either way, A or C.' },
    { topicId: 'horn-chaining', q: 'Which of these is a definite clause?', opts: ['¬P ∨ Q ∨ R', '¬P ∨ ¬Q ∨ R', '¬P ∨ ¬Q', 'P ∨ Q'], a: 1, ex: 'A definite clause has <strong class="hl">exactly one</strong> positive literal: ¬P ∨ ¬Q ∨ R ≡ P ∧ Q ⇒ R. ¬P ∨ ¬Q has no positive literal at all — it’s a goal clause, Horn but not definite.' },
    { topicId: 'horn-chaining', q: 'Your KB has thousands of definite clauses and you only need one specific query answered. Which approach usually does less wasted work?', opts: ['Forward chaining, because it’s automatic', 'Backward chaining, because it only follows rules relevant to the query', 'A truth table, because it’s complete', 'Both kinds of chaining always cost the same'], a: 1, ex: 'Forward chaining is data-driven: it fires every rule whose premises hold, including ones that have nothing to do with the query. Backward chaining is <strong class="hl">goal-driven</strong>, so its cost is often far below the size of the KB.' },
    { topicId: 'sat-solvers', q: 'In (A ∨ ¬B), (¬B ∨ ¬C), (A ∨ C), which symbols are pure?', opts: ['Only A', 'A and B', 'B and C', 'A, B and C'], a: 1, ex: 'A only appears positive, B only appears as ¬B — two pure symbols. C shows up as both ¬C and C, so it isn’t pure. DPLL can set A = true and B = false without any risk of falsifying a clause.' },
    { topicId: 'sat-solvers', q: 'WalkSAT uses up max_flips on KB ∧ ¬α and returns failure. What can you conclude?', opts: ['KB ⊨ α', 'KB ⊭ α', 'Nothing yet: it may be unsatisfiable, or it may just need more time', 'The KB is contradictory'], a: 2, ex: 'WalkSAT is <strong class="hl">incomplete</strong>: finding a model proves satisfiability, but not finding one proves nothing. The most it can say is “I thought about it for an hour and found no such world.”' },
  ],
};

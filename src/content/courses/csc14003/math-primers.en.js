// Thẻ toán nền — bản tiếng Anh. Giữ ĐÚNG thứ tự khóa của math-primers.js.
// Trường `vn` cố ý giữ thuật ngữ TIẾNG VIỆT: đó là cặp Anh–Việt soi gương mà quyết định thiết
// kế yêu cầu giữ ở cả hai ngôn ngữ (ADR-0010).

export const MATH_PRIMERS = {
  b1: {
    minutes: 2,
    lead: 'This session needs <strong class="hl-green">no math at all</strong> — really, not one formula. Just two words the whole course leans on, so it’s worth knowing them before you trip over them.',
    terms: [
      {
        en: 'Rational', vn: 'duy lý',
        what: 'Doing <strong class="hl">the right thing</strong>: the thing expected to bring you closest to your goal, given exactly the information in your hands.',
        why: 'The whole course turns on this word. Remember for me: rational does <em>not</em> mean always winning, and it does not mean knowing everything.',
      },
      {
        en: 'Agent', vn: 'tác tử',
        what: 'Anything that perceives its environment and then acts on it.',
        why: 'It sounds broad to the point of meaning nothing — but being that broad is exactly why it covers a robot, a chess program and the thermostat in your house alike.',
        note: 'f : 𝓟 → 𝓐',
      },
    ],
  },
  b2: {
    minutes: 4,
    lead: 'The math stays light this session, but for the first time there’s real notation: <span class="code-inline">f : 𝓟* → 𝓐</span>. The three entries below are everything you need to read that line without stalling — and the third one also explains why <strong class="hl">nobody just precomputes every answer into a table</strong>.',
    terms: [
      {
        en: 'Set', vn: 'tập hợp',
        what: 'A basket of distinct elements, order irrelevant. Write <span class="code-inline">𝓟</span> for the basket of every percept the agent can receive, <span class="code-inline">𝓐</span> for the basket of every action it can take.',
        why: 'You’ll spend the whole session listing these two baskets for each problem. It sounds trivial, but leave one action off the list and your agent silently loses a move — nothing will ever flag it.',
        note: '𝓐 = {Left, Right, Suck, NoOp}',
      },
      {
        en: 'Function · mapping', vn: 'hàm · ánh xạ',
        what: 'A rule of assignment: each input corresponds to <strong class="hl">exactly one</strong> output. No gaps allowed, and no two results for the same input.',
        why: 'An agent’s behavior is exactly such a mapping — the whole percept sequence so far in, one action out. The “exactly one” is the real condition: the agent isn’t allowed to dither. In session 1 I wrote it compactly as <span class="code-inline">𝓟 → 𝓐</span>; the star in <span class="code-inline">𝓟*</span> only makes explicit that the input is a whole <em>sequence</em>, not a single percept — and that small difference is the spine of section 02.',
        note: 'f : 𝓟* → 𝓐',
      },
      {
        en: 'Cartesian product', vn: 'tích Descartes',
        what: 'Combine two baskets into a basket of <em>pairs</em>: <span class="code-inline">A × B</span> holds every pair taking one element from A and one from B. The number of pairs is the product of the two sizes.',
        why: 'A vacuum robot’s percept is the pair <span class="code-inline">[location, status]</span> — 2 squares × 2 statuses = 4 percepts. Just four. But raise 4 to the number of steps and sum, and you have the size of the lookup table — you’ll see in section <a href="#ch7">07</a> just how ugly that number gets.',
        note: '|A × B| = |A| · |B|',
      },
    ],
  },
  b3: {
    "minutes": 4,
    "lead": "Session 3 needs intuition about graphs and trees. Big-O is optional preparation for session 4.",
    "terms": [
        {
            "en": "Graph",
            "vn": "graph",
            "what": "Vertices together with edges connecting them. On the A–B–C–D map, locations are vertices, roads are edges, and distances are weights.",
            "why": "Describes states and legal transitions."
        },
        {
            "en": "Tree · branching factor b",
            "vn": "tree · branching factor",
            "what": "A tree is a connected graph without cycles. For upper-bound analysis, b is the maximum number of children of a node.",
            "why": "A search tree records paths being tried. Several nodes can contain the same state.",
            "note": "At most b^d nodes at depth d; equality for uniform branching."
        },
        {
            "en": "Big-O",
            "vn": "optional reading",
            "what": "An upper bound on how costs grow with problem size, ignoring constant factors.",
            "why": "Session 4 uses it to compare time and memory. It is not needed to write the five components."
  },
    ]
},
  b4: {
    minutes: 5,
    lead: 'Three data structures and two counting tools. Sounds dry, except <strong class="hl">the only difference between today’s five algorithms is the first one</strong> — which node comes out first is the structure’s call.',
    terms: [
        {
        en: 'Stack · Queue · Priority queue', vn: 'ngăn xếp · hàng đợi · hàng đợi ưu tiên',
        what: 'Three ways to line up: <strong class="hl">LIFO</strong> means last in, first out · <strong class="hl">FIFO</strong> means first in, first out · a priority queue removes items by a <em>key</em> you choose.',
        why: 'This is the ENTIRE difference between DFS, BFS, and UCS/A*. Change the queue structure and you change the algorithm. Remember that and you’ve got the session’s backbone.',
        note: 'PQ removal: O(log n)',
      },
        {
        en: 'Big-O', vn: 'ký hiệu O lớn',
        what: 'A compact way to describe how cost grows with input size, ignoring constants and smaller terms.',
        why: 'You’ll compare O(b^d) with O(bm) all session. That difference decides which algorithm can run on an actual machine.',
      },
        {
        en: 'Logarithm', vn: 'logarit',
        what: '<span class="code-inline">log₂n</span> answers one question: how many times must you halve n to reach 1?',
        why: 'It appears in priority-queue operation costs and the depth of a balanced tree.',
        note: 'log₂ 1024 = 10',
      },
      ],
  },
  b5: {
    minutes: 5,
    lead: 'Four things that make the proofs readable. Don’t skip the first: <strong class="hl">all of A*’s optimality rests on exactly one inequality</strong>.',
    terms: [
      {
        en: 'Triangle inequality', vn: 'bất đẳng thức tam giác',
        what: 'Going straight from A to C is never farther than detouring through B: <span class="code-inline">d(A,C) ≤ d(A,B) + d(B,C)</span>. True of any geometric distance.',
        why: 'The <em>consistency</em> condition on a heuristic is this same inequality rewritten: h(n) ≤ c(n, a, n′) + h(n′). Recognize the triangle and you never have to memorize it.',
        note: 'd(A,C) ≤ d(A,B) + d(B,C)',
      },
      {
        en: 'Lower bound', vn: 'cận dưới',
        what: 'A number guaranteed <strong class="hl">not to exceed</strong> the true value, whatever that turns out to be. The closer it sits to the truth, the more useful it is.',
        why: 'An <em>admissible</em> heuristic is exactly a lower bound on the remaining cost: h(n) ≤ h*(n). It may underestimate; it may never overestimate — overestimate once and A* can walk past the optimal solution.',
        note: 'h(n) ≤ h*(n)',
      },
      {
        en: 'Monotone function', vn: 'hàm đơn điệu',
        what: 'A function that only moves one way: once it rises it never falls (or the reverse). No bumps.',
        why: 'With a consistent h, f = g + h <strong class="hl">never decreases</strong> along a path. That property alone is why the first time a node is popped off the frontier it is already optimal — and why A* can use graph-search at all.',
        note: 'f(n′) ≥ f(n)',
      },
      {
        en: 'Big-O', vn: 'ký hiệu O lớn',
        what: 'Shorthand for “how fast does this grow as the input grows”, with the constants thrown away. O(b<sup>d</sup>) is exponential, O(bd) is linear in depth.',
        why: 'All four evaluation boxes on every algorithm are written in Big-O. The part worth remembering: the time column looks survivable, the memory column does not.',
        note: 'O(b<sup>d</sup>) ≫ O(bd)',
      },
    ],
  },
  b6: {
  minutes: 5,
  lead: "These four ideas let you read landscapes, understand a random move and avoid a representation mistake. I only need your intuition for gradients; there are no derivatives to calculate today.",
  terms: [
    {
      en: "Local / global extremum",
      vn: "cực trị địa phương / toàn cục",
      what: "A local extremum is best within a neighborhood; a global extremum is best across the entire domain under consideration.",
      why: "Hill-climbing compares only neighbors, so it may stop at a local extremum."
    },
    {
      en: "Gradient",
      vn: "hướng dốc",
      what: "For a differentiable function, the gradient vector points in the direction of steepest increase at a point.",
      why: "It helps you interpret landscapes; on a discrete chessboard, the algorithm compares neighbors rather than computing a gradient."
    },
    {
      en: "Probability",
      vn: "xác suất",
      what: "A number from 0 to 1 describing the chance of an event in a model.",
      why: "SA uses a probability to accept setbacks; GA uses one to select parents. High probability does not mean certainty."
    },
    {
      en: "Permutation",
      vn: "hoán vị",
      what: "An ordering of all elements, with each element appearing exactly once.",
      why: "TSP often uses a permutation; N-queens row strings allow repeats, so they are not permutations. Crossover that ignores representation can produce invalid children."
    }
  ],
  },
  b7: {
    minutes: 4,
    lead: 'Four ideas are enough to follow a game tree: who chooses, who benefits, how outcomes are compared, and how uncertainty is handled.',
    terms: [
      { en: 'Zero-sum game', vn: 'trò chơi tổng bằng không', what: 'One player’s gain is the other’s loss; one utility can represent both sides with opposite signs.', why: 'Minimax assumes two opposing objectives.' },
      { en: 'Utility', vn: 'độ hữu dụng', what: 'A number representing how desirable an outcome is for the player being evaluated.', why: 'All scores in this minimax tree keep MAX’s perspective: positive helps MAX, negative helps MIN. Do not flip signs with turns.', note: 'win = +1 · draw = 0 · loss = −1' },
      { en: 'Recursion', vn: 'đệ quy', what: 'Solving a problem by applying the same rule to smaller subproblems.', why: 'Minimax passes values from child states to parents; finite games end at terminal leaves.' },
      { en: 'Expected value', vn: 'giá trị kỳ vọng', what: 'A probability-weighted average: Σ pᵢvᵢ, where Σpᵢ = 1.', why: 'In dice games, MAX/MIN cannot choose the roll; you calculate expectation at a chance node.' }
    ]
  },
  b9: {
    minutes: 6,
    lead: 'This session is pure discrete math, but just five pieces of it. Every one gets used for real in the lesson — especially the third, where <strong class="hl">implication ⇒ trips up beginners</strong>.',
    terms: [
      { en: 'Proposition', vn: 'mệnh đề', what: 'A statement that can only be <strong class="hl">true or false</strong>, nothing in between: “there’s a pit in [1,2]” is a proposition, “which room has a pit?” isn’t.', why: 'The whole Wumpus world gets written with symbols like P₁,₂ — each one a proposition the agent doesn’t yet know to be true or false.', note: 'P₁,₂ : “pit in [1,2]”' },
      { en: 'Truth table', vn: 'bảng chân trị', what: 'A table listing every true/false assignment to the symbols, then the sentence’s value in each row. n symbols give 2ⁿ rows.', why: 'Model checking is exactly flipping through this table. 7 symbols is 128 rows — still doable by hand; 64 symbols isn’t.', note: '2⁷ = 128' },
      { en: 'Connectives ¬ ∧ ∨ ⇒ ⇔', vn: 'phép nối', what: 'Five ways to combine sentences: not, and, or, implies, if and only if. P ⇒ Q <strong class="hl">is false only when P is true and Q is false</strong>; if P is false, the whole sentence is automatically true.', why: 'Every rule in the KB is written with these five. Resolution, DPLL and WalkSAT also start by rewriting sentences into CNF — only ¬ ∧ ∨ left — so P ⇒ Q ≡ ¬P ∨ Q has to be second nature.', note: 'P ⇒ Q ≡ ¬P ∨ Q' },
      { en: 'Tautology', vn: 'hằng đúng', what: 'A sentence that’s true in <strong>every</strong> row of the truth table, whatever values the symbols take. For example P ∨ ¬P.', why: 'The deduction theorem says α ⊨ β exactly when α ⇒ β is a tautology — turning “can I derive it?” into “is it true everywhere?”.' },
      { en: 'Proof by contradiction', vn: 'chứng minh phản chứng', what: 'To prove α, assume ¬α and show that the assumption leads to a contradiction.', why: 'Resolution and DPLL both prove KB ⊨ α this way: add ¬α to the KB, then look for a contradiction (the empty clause □, or “no model at all”).', note: 'KB ⊨ α  if and only if  KB ∧ ¬α is unsatisfiable' },
    ],
  },
};

import type { VI } from './lesson07.text.vi';
export const EN = {
  nav: {
    math: "MATH PRIMER",
    model: "01 Games",
    minimax: "02 Minimax",
    lab: "03 Experiment",
    pruning: "04 α–β",
    limits: "05 Time limits",
    chance: "06 Chance",
    extensions: "07 Extensions",
    summary: "08 Remember",
    quiz: "09 Quiz",
    practice: "10 Practice"
  },
  hero: {
    badge: "SESSION 7",
    eyebrow: "CSC14003 · PART II — SEARCHING",
    title: "Adversarial search",
    accent: "You move. So does your opponent.",
    lead: "You see a move that could earn 7 points. But your opponent can choose a branch that leaves you with 0. I want you to see that reply too: that's the shift from finding a path to playing a game.",
    time: "~3 hours · with practice",
    families: "Minimax · α–β · expectation",
    quiz: "8 self-check questions",
    cta: "Start with a game tree →",
    back: "← Session 6"
  },
  goals: {
    title: "What can you do after this session?",
    items: [
      "Describe a game using states, turns, legal moves and outcome scores.",
      "Calculate minimax from leaves to root and explain the chosen move.",
      "Identify the branch α–β skips and explain why that is safe.",
      "Distinguish utility, an evaluation estimate and expected utility."
    ],
    path: "First pass: sections 01–06. Then change the lab scores, take the quiz, and return to section 07 if you want the extensions."
  },
  model: {
    headers: ["Game", "Information / randomness", "Model"],
    boardBefore: "Before: X to move",
    boardAfter: "After: X wins, U=+1",
    boardCaption: "X chooses the last empty square in the top row. That action is a tree edge; the resulting state is a terminal leaf.",
    title: "🎲 On their turn, you lose control",
    en: "Games as search problems",
    lead: "In session 3, you chose the steps along a path. On a game board, your opponent chooses half the steps.",
    paras: [
      "A game state must record <strong class=\"hl\">both the position and whose turn it is</strong>. The same board with a different player to move can have a completely different outcome. Each tree edge is a legal move; each level is one player's turn, called a <em>ply</em>. Two plies usually cover one turn for each player.",
      "I start with 3×3 tic-tac-toe. X is MAX, O is MIN. Both see the board, alternate turns, and roll no dice. Scores always use X's perspective: win +1, draw 0, loss −1. When O wins, X's score falls, so O seeks the smallest value."
    ],
    cards: [
      {
        title: "S₀ · Initial state",
        body: "An empty 3×3 board; X moves first."
      },
      {
        title: "PLAYER(s) · Whose turn?",
        body: "X or O chooses the next square."
      },
      {
        title: "ACTIONS(s) · Legal moves",
        body: "The empty squares on a nonterminal board."
      },
      {
        title: "RESULT(s,a) · Next state",
        body: "Mark the chosen square, then change turns."
      },
      {
        title: "TERMINAL(s) · Finished?",
        body: "One side has 3 marks in a row, column or diagonal; or the board is full."
      },
      {
        title: "UTILITY(s) · Outcome score",
        body: "+1 if X wins, 0 for a draw, −1 if O wins."
      }
    ],
    assumptions: "Basic minimax assumes <strong>two players · opposing/zero-sum objectives · full information · no randomness · alternating turns</strong>. MIN also optimizes its own objective. Minimax doesn't promise you a win; it chooses the best option against an optimal reply within your model.",
    classifyTitle: "Having an opponent doesn't fix the model",
    rows: [
      [
        "Chess / tic-tac-toe",
        "Full information, no randomness",
        "MAX and MIN"
      ],
      [
        "Backgammon",
        "Known state, dice",
        "Add CHANCE"
      ],
      [
        "Poker",
        "Hidden cards and randomness",
        "Model information/beliefs"
      ],
      [
        "Cooperative / multiplayer",
        "Objectives may benefit several players",
        "One MAX/MIN score may be insufficient"
      ]
    ]
  },
  minimax: {
    title: "🌳 Minimax: read from the leaves up",
    en: "Back up values, then choose a move",
    lead: "The highest leaf is 7. Reaching it requires your opponent to choose the branch you want.",
    paras: [
      "MAX has two moves: A and B. After A, MIN chooses between 3 and 5. After B, MIN chooses between 0 and 7. These are sample outcome scores, not tic-tac-toe win/loss scores. I use this same tree throughout minimax and α–β.",
      "<strong class=\"hl\">MIN takes the smallest value; MAX takes the largest.</strong> Start where the score is known—the leaves—and pass values to parents. Don't flip the sign at each level: every number still uses MAX's perspective."
    ],
    formula: "Leaf: V(s)=U(s)  ·  MAX: V(s)=max V(child)  ·  MIN: V(s)=min V(child)",
    steps: [
      "A = min(3,5) = 3. If MAX chooses A, MIN can force a result of 3.",
      "B = min(0,7) = 0. If MAX chooses B, MIN selects 0 rather than handing MAX 7.",
      "Root = max(3,0) = 3. MAX chooses A; the guaranteed result is 3."
    ],
    takeaway: "The chosen move is A; its value is 3. You need both: the algorithm calculates values to compare moves, then returns a move for the agent to take.",
    strategy: "A strategy is a branching plan: <em>if the opponent replies this way, you respond that way</em>. It isn't a fixed path to victory. If optimal play permits only a draw, minimax guarantees a draw. If every move loses, it still chooses the best available value.",
    exampleTitle: "Add a branch · calculate before reading on",
    example: "In a larger tree, three MIN nodes have leaves (3,12,8), (2,4,6), (14,5,2). They return 3, 2, 2; MAX chooses the first branch with 3. Leaf 14 looks most appealing, but MIN has no reason to choose it.",
    check: {
      q: "For A=(3,5), B=(0,7), what should MAX choose?",
      opts: [
        "B because it contains 7",
        "A because it guarantees 3",
        "A because it guarantees 5"
      ],
      a: 1,
      ex: "MIN controls the reply: A drops to 3, B to 0. MAX compares 3 with 0, not 5 with 7."
    }
  },
  lab: {
    title: "🧪 Change the scores, then defend your choice",
    en: "An experiment, not another diagram",
    lead: "If leaf 7 becomes 100, would you switch to B? Predict before checking the result.",
    intro: "I want you to try three changes: (1) raise the last leaf from 7 to 100; (2) raise leaf 0 to 4; (3) keep the scores but search B before A. The first two separate the best score from the guaranteed score; the last prepares you for pruning.",
    score: "Leaf score",
    root: "Player at root",
    order: "Search order",
    orders: [
      "A before B",
      "B before A"
    ],
    result: "Chosen move",
    value: "Minimax value",
    leaves: "Leaves evaluated",
    pruned: "Leaves skipped",
    full: "Full minimax",
    alpha: "With α–β",
    reset: "Restore example",
    labels: [
      "a₁",
      "a₂",
      "b₁",
      "b₂"
    ],
    note: "At a MIN root, its children are MAX: changing the player changes every level's rule. The results below are calculated from your inputs.",
    answer: "Default example: raising 7 to 100 still selects A=3; raising 0 to 4 gives B=min(4,7)=4, so MAX selects B. Changing order preserves minimax value but can change how many leaves are evaluated."
  },
  visual: {
    title: "Game tree",
    minimax: "Minimax · evaluate all",
    alpha: "α–β · same decision",
    legend: "Dotted outline: not evaluated · solid outline: evaluated · yellow ring: active · ×: skipped. Leaf scores stay visible so you can calculate.",
    cycle: "This illustration repeats automatically. The complete solution is written just below.",
    leaf: "Read leaf",
    backup: "Return",
    cut: "Prune branch",
    start: "Leaf scores are known; search A before B.",
    done: "Root chooses",
    bound: "Returned bound",
    left: "A",
    right: "B"
  },
  pruning: {
    title: "✂️ α–β: stop when you have enough evidence",
    en: "Prune without changing the decision",
    lead: "MAX already has A=3. In B, MIN just found 0. Could reading the remaining leaf help B beat 3?",
    paras: [
      "No. However large the remaining leaf is, MIN can still choose 0. B's value is <strong>at most 0</strong>, so B cannot replace A=3. I don't need B's exact value to rule it out at the root.",
      "<strong class=\"hl\">α</strong> is a lower bound from an option MAX already has along the current path; <strong class=\"hl\">β</strong> is an upper bound from an option MIN already has. These bounds pass down the tree. MAX updates α; MIN updates β. When <strong class=\"hl\">α ≥ β</strong>, the rest of the current node cannot improve an ancestor's decision."
    ],
    steps: [
      "Initially α=−∞, β=+∞. No option is known.",
      "Evaluate A: read 3, 5 → MIN returns 3 → MAX root sets α=3.",
      "At B: read 0 → MIN sets β=0. Since β≤α, skip leaf b₂.",
      "The root returns A=3, just like minimax. Only 3 of 4 leaves are evaluated. B is known only to be ≤0, not necessarily equal to 0."
    ],
    ordering: "Search order determines the savings. Searching B before A here requires all 4 leaves. When optimal moves tie, ordering can also change which move breaks the tie; the optimal value is unchanged.",
    cost: "Minimax takes O(bᵐ) time, where b is the average branching factor and m the maximum depth. Depth-first search uses O(bm) space when it generates all children at once; generating them individually can reduce auxiliary space. α–β is still O(bᵐ) in the worst case, about O(bᵐ⁄²) with ideal ordering: the same budget can reach roughly twice the depth.",
    check: {
      q: "After pruning B because its first leaf is 0, what do you know?",
      opts: [
        "B equals 0",
        "B is at most 0; the root still chooses A=3",
        "Every leaf in B is 0"
      ],
      a: 1,
      ex: "The unread leaf might be negative, making B smaller than 0. The bound ≤0 already proves B cannot beat 3. Pruning preserves the root's decision without calculating every subtree exactly."
    }
  },
  limits: {
    title: "⏱️ Time's up. You still need a move.",
    en: "Terminal utility versus a depth cutoff",
    lead: "You can solve a small tree to the end. In chess, the clock expires long before you've seen every game.",
    paras: [
      "With b=30, depth 4 has about 30⁴=810,000 leaves; depth 8 has about 30⁸=656,100,000,000 in a uniform tree. Adding 4 plies multiplies the leaf count by 810,000. This calculation illustrates growth, not a fixed chess tree size.",
      "Two stopping reasons are different. <strong>The game has ended:</strong> return true utility. <strong>The depth/time limit is reached:</strong> return EVAL(s), an estimate. I always check the terminal condition first; a material score must not turn an actual win into an apparent loss."
    ],
    evaluation: "A material evaluation: EVAL = 9q + 5r + 3b + 3n + p. Each variable counts MAX's pieces minus MIN's: queens, rooks, bishops, knights, pawns. If MAX has 1 extra rook but 2 fewer pawns, material contributes 5−2=3. A king about to be checkmated can make that +3 meaningless; position and interactions between pieces matter too.",
    cards: [
      {
        title: "Iterative deepening",
        body: "Search depths 1, 2, 3…; keep the result of the last completed depth. If time runs out during a new depth, return the last completed move. Earlier results also help put good moves first."
      },
      {
        title: "Quiescence search",
        body: "Avoid stopping midway through captures that cause sharp score swings. Extend tactical continuations to a quieter position, with safeguards against unbounded extension."
      },
      {
        title: "Horizon effect",
        body: "A bishop is doomed. Checking moves delay its loss beyond the visible depth; an evaluation mistakes the still-present bishop for safety. Quiescence reduces some tactical evaluation errors, but doesn't eliminate every horizon problem."
      }
    ],
    rule: "Evaluation should be fast, rank positions usefully, and respect win > draw > loss. Depth-limited minimax is optimal only for the truncated tree and its estimates; it no longer guarantees optimal play over the whole game."
  },
  chance: {
    safe: "Safe",
    gamble: "Gamble",
    title: "🎯 Dice aren't trying to beat you",
    en: "Expectimax and expectiminimax",
    lead: "MIN has an objective. A die doesn't. Applying the same rule to both can select the wrong move.",
    paras: [
      "When chance selects an outcome, add a <strong class=\"hl\">CHANCE</strong> node. It picks neither the best nor worst leaf: it takes a probability-weighted average. Probabilities must be nonnegative and sum to 1.",
      "<strong>Expectimax</strong> has MAX and CHANCE, such as an opponent modeled as random behavior. <strong>Expectiminimax</strong> has MAX, MIN and CHANCE, such as adversarial players whose moves also depend on dice. MAX/MIN still use their original rules."
    ],
    formula: "V(CHANCE) = Σ pᵢV(childᵢ)",
    example: "A safe move always earns 2. A gamble earns 10 with probability 1/4 and −1 with probability 3/4: expectation = 1/4×10 + 3/4×(−1) = 1.75. MAX chooses the safe 2. Raise the probability of 10 to 1/2 and expectation becomes 4.5: now MAX chooses the gamble.",
    scaleTitle: "Your score scale can change the decision",
    scale: "For minimax, strictly increasing transformations preserve min/max ordering. For expectation, magnitudes must be meaningful. A earns a certain 4; B earns 0 or 6 with probability 1/2 each: A=4 > E[B]=3. Square the scores: A=16, E[B]=18—the ranking reverses. Don't arbitrarily apply nonlinear transformations to utility; a positive affine transformation ax+b (a>0) preserves expected-utility choices.",
    prune: "A CHANCE node cannot be cut just because one leaf is bad. If all values lie in [L,H], you can bound unread outcomes. A gamble has two equally likely results in [0,9]; after reading 1, its maximum expectation is (1+9)/2=5. If MAX already has 6, skip the remainder.",
    check: {
      q: "CHANCE has leaves 0 and 8, each with probability 1/2. What does it return?",
      opts: [
        "0 to protect against the worst case",
        "8 to select the best outcome",
        "4, the expectation"
      ],
      a: 2,
      ex: "CHANCE doesn't control the outcome. 1/2×0 + 1/2×8 = 4. Change the probabilities and the expectation changes too."
    }
  },
  extensions: {
    title: "Extensions · when assumptions no longer hold",
    en: "Keep the core rules, know their limits",
    lead: "You understand the two-player tree. More players, hidden cards or too many moves require different models.",
    cards: [
      {
        title: "Multiplayer · utility vectors",
        body: "In max-n, each leaf has a vector such as (3,1,2); on player i's turn, they choose the child with the highest component i. Alliances and shared interests make one MAX/MIN score insufficient; max-n doesn't automatically solve all cooperation."
      },
      {
        title: "Move ordering and transpositions",
        body: "Prioritize good moves from the previous iterative-deepening pass; a transposition table recognizes the same state reached by different paths. Store depth and score type (exact/lower bound/upper bound), rather than treating every pruned result as exact."
      },
      {
        title: "Selective extensions and forward pruning",
        body: "Singular extensions search deeper around an outstanding move. Beam search keeps only a few moves; PROBCUT uses probabilistic evidence to skip branches. These methods can lose the best move; they don't share α–β's guarantee of preserving minimax."
      },
      {
        title: "Search and lookup",
        body: "An opening book suggests opening moves; an endgame tablebase stores outcomes for the positions it covers. Checkers/Chinook, Deep Blue and AlphaGo show the power of combining search with knowledge, lookup or learned evaluation—not merely scaling up one illustrative tree."
      },
      {
        title: "Hidden information",
        body: "Poker separates the true state from what an agent knows: possible card configurations may be represented with probabilities/beliefs. Don't let an algorithm see an opponent's hidden cards and call the result a legal strategy."
      }
    ],
    codeTitle: "Read recursion as a solution",
    codeLead: "I keep the code short so you can see three decisions: terminal state, player to move and backing up values. The tree must be finite; add cutoff/EVAL for large games or cycles."
  },
  summary: {
    title: "Remember it on one screen",
    en: "Three node types, three rules",
    lead: "When the algorithm name slips your mind, look at who chooses at that node.",
    headers: [
      "Node / situation",
      "Rule",
      "Remember"
    ],
    rows: [
      [
        "Terminal leaf",
        "True UTILITY",
        "One fixed MAX perspective"
      ],
      [
        "MAX",
        "max of children",
        "Best move against the opponent's reply"
      ],
      [
        "MIN",
        "min of children",
        "Opponent optimizes the opposing objective"
      ],
      [
        "CHANCE",
        "Σ pᵢVᵢ",
        "Probabilities and meaningful utility scale"
      ],
      [
        "α–β",
        "Stop when α≥β",
        "Preserve the root's minimax value"
      ],
      [
        "Depth limit",
        "EVAL at nonterminal leaves",
        "Estimates can be wrong"
      ]
    ],
    recall: "Say it in one sentence: MAX chooses the best guaranteed result, MIN finds the lowest reply, and CHANCE takes expectation."
  },
  quiz: {
    title: "Self-check · return to what confused you",
    en: "Check your understanding",
    lead: "I want you to explain why each answer is correct. If you miss one, read the feedback before moving on."
  },
  hw: {
    title: "Practice · transfer to a new tree",
    en: "Practice and transfer",
    lead: "Try paper first. The tree changes shape; the rules stay the same.",
    hint: "Show hint and solution",
    file: "Open the original exercises (PDF)",
    cards: [
      {
        title: "1 · Change the root to MIN",
        body: "A MIN root has two MAX children. A's leaves are (3,5), B's are (0,7). Calculate the value and chosen root move.",
        hint: "A=max(3,5)=5; B=max(0,7)=7. MIN chooses A with min(5,7)=5. Changing the root player changes every level."
      },
      {
        title: "2 · Prove a cutoff",
        body: "Return to a MAX root. Keep A=(3,5), change B=(2,100). Search A before B. Mark the evaluated and skipped leaves.",
        hint: "A=3 gives α=3. B reads 2, giving β=2≤3; skip 100. The root still chooses A=3, evaluating only 3 leaves. B is known only to be ≤2 before complete evaluation."
      },
      {
        title: "3 · Replace MIN with CHANCE",
        body: "A earns a certain 3. B has results 0 and 7. Above what probability of 7 would MAX prefer B?",
        hint: "If P(7)=p, then E[B]=7p. To beat A: 7p>3 → p>3/7. At p=3/7, the moves tie."
      }
    ],
    checks: [
      "I can identify each node's player and keep one utility perspective.",
      "I can back up min/max values and retain the chosen move.",
      "I can distinguish an α–β bound from an exact subtree value.",
      "I can distinguish a terminal leaf from a depth cutoff.",
      "I can calculate expectation and explain why utility magnitudes matter."
    ],
    next: "Session 8 moves to CSPs: you assign variables to satisfy constraints rather than respond to an opponent.",
    roadmap: "← Back to roadmap"
  }
} satisfies typeof VI;

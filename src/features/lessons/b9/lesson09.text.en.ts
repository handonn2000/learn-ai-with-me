import type { VI } from './lesson09.text.vi';

export const EN = {
  nav: {
    math: "MATH PRIMER",
    kb: "01 Knowledge agent",
    wumpus: "02 Wumpus cave",
    entail: "03 Entailment",
    syntax: "04 Syntax",
    modelcheck: "05 Model checking",
    rules: "06 Inference rules",
    resolution: "07 Resolution",
    chaining: "08 Chaining",
    dpll: "09 DPLL",
    lab: "10 Lab",
    summary: "11 Recap",
    quiz: "12 Quiz",
    practice: "13 Practice"
  },
  hero: {
    badge: "SESSION 9",
    eyebrow: "CSC14003 · PART III — KNOWLEDGE & REASONING",
    title: "Logical agents",
    accent: "You can’t see the pits. You still know which rooms are safe.",
    lead: "You’re standing in a dark 4×4 cave. You can’t see a thing — all you get is a draft and a foul smell. Yet three steps in, you can point at the room with the pit and the room with the monster, without ever setting foot in either. In this session I want you to teach a machine to do that: write down what you know as sentences, then let an algorithm work out the rest.",
    time: "~4 hours · with a lab",
    families: "Model checking · Resolution · Chaining · DPLL",
    quiz: "11 self-check questions",
    cta: "Start with an agent that reasons →",
    back: "← Course roadmap"
  },
  goals: {
    title: "What you’ll be able to do",
    items: [
      "Write a situation as a propositional KB, and tell the sentences you were given from the ones you derived.",
      "Check KB ⊨ α with a truth table, and explain why ⊭ α doesn’t mean ⊨ ¬α.",
      "Convert any sentence to CNF and prove things by resolution refutation.",
      "Run forward and backward chaining on a Horn KB, and know when DPLL is the tool and when WalkSAT isn’t enough."
    ],
    path: "First pass: sections 01–05 are the semantics — get ⊨ solid before anything else. Sections 06–09 are four ways to prove things. Then open the Lab in section 10 and push one KB through all five."
  },
  common: {
    t: "true",
    f: "false",
    tf: "T = true · F = false",
    hint: "Show hint and solution",
    answer: "Show answer"
  },
  kb: {
    title: "🧠 An agent that knows things nobody told it",
    en: "Knowledge-based agents",
    lead: "The 8-puzzle agent from session 5 finds paths beautifully. Ask it whether two states can even reach each other, though, and it’s stuck — even though the answer sits right there in the parity of the permutation. It knows things, but only in one rigid way.",
    paras: [
      "The problem-solving agents from earlier sessions keep what they know as <strong>hard-wired code</strong>: a successor function, a heuristic. CSPs in session 8 took one step up — a state becomes an assignment of values to variables, so part of the algorithm works for any domain, and faster. A knowledge-based agent goes further: it keeps what it knows as <strong class='hl'>sentences in a formal language</strong> — logic — and combines and recombines them to suit whatever it’s asked to do.",
      "That buys it three things a search agent can only get by rewriting code: it <strong>accepts new tasks</strong> stated as explicit goals, it <strong>gets better</strong> by learning new knowledge about the environment, and it <strong>adapts</strong> when the world changes — just by updating the sentences that matter."
    ],
    cards: [
      {
        title: "KB · Knowledge base",
        body: "A set of <strong>sentences</strong>, each asserting something about the world. Think of it as the agent’s notebook."
      },
      {
        title: "Axiom",
        body: "A sentence you’re simply given, not derived from any other — like the “laws of physics” of the Wumpus cave in section 02."
      },
      {
        title: "Inference",
        body: "Deriving new sentences from old ones. New sentences go back into the KB, and the agent queries the KB for what it now knows."
      }
    ],
    exampleTitle: "One small round of reasoning",
    example: "The KB already holds the rule <span class='code-inline'>A ⇒ (B ∨ C)</span>. The agent perceives <span class='code-inline'>A</span> and <span class='code-inline'>¬C</span>. The inference engine puts it together: A is true, so B ∨ C is true; C is false, so only <strong class='hl'>B</strong> is left. B goes into the KB — something no sensor could read directly.",
    decomp: "Split the agent in two. <strong>Offline</strong>: prior knowledge, past experience and data get loaded into the KB. <strong>Online</strong>: the inference engine reads observations, goals and abilities, and uses the KB to choose actions. In a real system the KB is also surrounded by knowledge engineers, domain experts, ontologies, data, sensors, users and external knowledge sources.",
    codeTitle: "The KB-AGENT loop",
    codeLead: "The Python below keeps the three calls of the pseudocode: TELL what you just perceived, ASK what to do, TELL what you did, then bump the time counter t. Notice that no line actually “reasons” — the whole inference mechanism hides inside <span class='code-inline'>tell</span> and <span class='code-inline'>ask</span>.",
    approachesTitle: "Four ways to get knowledge into an agent",
    headers: [
      "Approach",
      "How",
      "Autonomy"
    ],
    rows: [
      [
        "Declarative",
        "Start with an empty KB and TELL it sentences one by one until the agent knows how to operate in its environment",
        "Depends on whoever TELLs"
      ],
      [
        "Procedural",
        "Encode the desired behavior directly as program code",
        "Depends on the programmer"
      ],
      [
        "Combined",
        "Mostly declarative, with the frequently used parts written as code for speed",
        "Partly autonomous"
      ],
      [
        "Learning (sessions 12–13)",
        "Give the agent mechanisms to learn new knowledge for itself",
        "Fully autonomous"
      ]
    ],
    bridge: "Two questions remain: what language do you write the KB in, and what exactly does “derive” mean? To answer them properly I need a world small enough to enumerate every possibility. Come down into the cave."
  },
  wumpus: {
    title: "🕳️ The Wumpus cave: walking in the dark",
    en: "The Wumpus world",
    lead: "In the early 1970s, Hunt the Wumpus was a text game on computers: you felt your way through a cave, told only “I feel a draft” or “I smell a Wumpus”, and had to work out where the pits and the monster were. AI borrowed the game as a lab, because the only way to survive is to reason — guessing gets you killed.",
    paras: [
      "The version used in AI is a <strong>4×4</strong> grid. The agent starts in room [1,1], facing right. The gold and the Wumpus sit in random rooms; any room may also be a pit, with probability <strong>0.2</strong>. Rooms directly next to a pit (not diagonally) are breezy, rooms next to the Wumpus smell, and the room with the gold glitters."
    ],
    peas: [
      {
        title: "P · Performance measure",
        body: "<strong>+1000</strong> for climbing out of the cave with the gold, <strong>−1000</strong> for dying; −1 per step, −10 for using the arrow. The game ends when the agent dies or climbs out."
      },
      {
        title: "E · Environment",
        body: "A 4×4 grid of rooms, start at [1,1] facing right; gold and Wumpus in random rooms; each room is a pit with probability 0.2."
      },
      {
        title: "A · Actuators",
        body: "Forward, TurnLeft / TurnRight by 90°, Grab, Shoot, Climb."
      },
      {
        title: "S · Sensors",
        body: "Stench, Breeze, Glitter, Bump (walked into a wall), Scream (the Wumpus died). A percept is a five-element vector, for example [Stench, Breeze, None, None, None]."
      }
    ],
    envTitle: "Placing the cave on session 2’s environment dimensions",
    headers: [
      "Dimension",
      "Wumpus cave",
      "Why"
    ],
    rows: [
      [
        "Fully observable?",
        "No",
        "Only local perception"
      ],
      [
        "Deterministic?",
        "Yes",
        "Outcomes are exactly specified"
      ],
      [
        "Episodic?",
        "No",
        "Sequential at the level of actions"
      ],
      [
        "Static?",
        "Yes",
        "The Wumpus and the pits don’t move"
      ],
      [
        "Discrete?",
        "Yes",
        "Rooms, actions and percepts are all countable"
      ],
      [
        "Single-agent?",
        "Yes",
        "The Wumpus is essentially a natural feature of the cave"
      ]
    ],
    exploreTitle: "Three steps, two certain conclusions",
    steps: [
      "<strong>[1,1]</strong> · percept [None, None, None, None, None]. No breeze, no stench → both neighbors [1,2] and [2,1] are safe (OK).",
      "<strong>[2,1]</strong> · Breeze. A neighbor has a pit: [2,2] or [3,1] (P?) — [1,1] is already safe, so it’s ruled out. Not enough to go on, so the agent heads back to [1,1] and over to [1,2].",
      "<strong>[1,2]</strong> · Stench, no Breeze. The Wumpus isn’t in [1,1], and not in [2,2] either, because [2,1] didn’t smell → <strong class='hl'>W! in [1,3]</strong>. No breeze, so [2,2] has no pit → <strong class='hl'>P! in [3,1]</strong>, and [2,2] is safe.",
      "<strong>[2,2]</strong> is safe; on to <strong>[2,3]</strong> · Glitter, Stench, Breeze. Grab the gold. The new breeze means [2,4] or [3,3] might hold a pit."
    ],
    after: "Look at step three: concluding W! in [1,3] takes <strong>both</strong> percepts — a stench in [1,2] and <em>no</em> stench in [2,1]. “Feeling nothing” is information too. Section 03 turns that kind of argument into a precise definition. One thing up front: there isn’t always a provably safe room to move to — then the agent has to gamble, and the probability tools of session 11 are how you measure which gamble is less risky.",
    visualTitle: "Exploring the Wumpus cave",
    legend: "A: agent · B: breeze · S: stench · G: gold · OK: safe · V: visited · P? / W?: possible · P! / W!: certain",
    cycle: "Looping illustration. The full step-by-step explanation is right below it.",
    grid: "4×4 cave grid"
  },
  entail: {
    title: "What “certain” means: models",
    en: "Models and entailment",
    lead: "What does “certain” even mean in the cave? Not “I can see it” — the agent can’t see anything. It means: across every possible world, any world that fits what you know also fits the conclusion.",
    paras: [
      "A <strong class='hl'>model</strong> (or possible world) is a mathematical abstraction that fixes the truth or falsehood of every relevant sentence. For sentences about numbers, the models might be every assignment of real numbers to x and y. A model m <strong>satisfies</strong> α (m is a model of α) if α is true in m; <span class='code-inline'>M(α)</span> is the set of all models of α.",
      "<strong class='hl'>α ⊨ β</strong> — α entails β — if and only if β is true in <em>every</em> model in which α is true, that is <span class='code-inline'>M(α) ⊆ M(β)</span>. For example x = 0 ⊨ xy = 0. Or a KB containing “the apple is red” and “the tomato is red” ⊨ “either the apple or the tomato is red”. Entailment is a relationship between sentences (syntax), but it’s defined through semantics.",
      "I like to picture it as <strong>narrowing down a list of suspects</strong>. Each clue crosses a few names off. A conclusion counts as certain when it holds for <em>everyone</em> still on the list — the people already crossed off don’t get a say."
    ],
    modelsTitle: "Eight worlds after two steps",
    modelsIntro: "The agent has been to [1,1] (no breeze) and [2,1] (breeze). Only three relevant rooms are still unknown: [1,2], [2,2], [3,1] → 2³ = 8 models. The figure filters those eight worlds through the KB, then asks two different questions.",
    modelsResult: "The KB keeps just <strong>3</strong> worlds. α₁ = “no pit in [1,2]” holds in all 3 → <strong class='hl-green'>KB ⊨ α₁</strong>. α₂ = “no pit in [2,2]” fails in 2 of the 3 → <strong class='hl-red'>KB ⊭ α₂</strong>.",
    check: {
      q: "KB ⊭ α₂. So the agent can conclude that [2,2] definitely has a pit, right?",
      opts: [
        "Right — if you can’t derive “no pit”, there’s a pit",
        "No — the KB has worlds with a pit in [2,2] and worlds without one",
        "Right — 2 of the 3 worlds have a pit"
      ],
      a: 1,
      ex: "Of the three remaining worlds, two have a pit in [2,2] and one doesn’t. KB ⊭ ¬P₂,₂ and KB ⊭ P₂,₂ as well: it’s simply <strong>unknown</strong>. A 2/3 majority isn’t a proof — logic doesn’t take a vote. A careful agent steers clear of that room until it gets more percepts."
    },
    soundTitle: "Inference: sound and complete",
    sound: "Checking every world is a definition, not yet an algorithm. An inference procedure i derives new sentences; write <span class='code-inline'>KB ⊢ᵢ α</span> when α can be derived from the KB by procedure i (some texts write ⊨ᵢ).",
    cards: [
      {
        title: "Sound",
        body: "Everything i derives really is entailed: if KB ⊢ᵢ α then KB ⊨ α. The procedure doesn’t make things up."
      },
      {
        title: "Complete",
        body: "Everything that’s entailed, i can derive: if KB ⊨ α then KB ⊢ᵢ α. Any question whose answer follows from the KB, the procedure can answer."
      }
    ],
    socrates: "The classic picture: “Socrates is a man” and “all men are mortal” <strong>entail</strong> “Socrates is mortal” — a relationship between sentences, at the level of representation. In the real world, the corresponding fact <strong>follows</strong>. Semantics is the thread tying each sentence to an aspect of the world.",
    noAccess: "That’s why I keep stressing <em>sound</em>: the agent has <strong>no independent access</strong> to the world. It gets its knowledge as a sequence of logical sentences, and every conclusion has to come from those sentences alone. One unsound inference step and the agent walks into a pit brimming with confidence."
  },
  syntax: {
    title: "Propositional logic: writing sentences and working out truth",
    en: "Propositional logic: syntax and semantics",
    lead: "For a machine to sort through those eight worlds, sentences have to follow rules strict enough for a machine to read — and every sentence needs exactly one way of computing true or false. Propositional logic is the simplest language that does both.",
    paras: [
      "The syntax has two constants, <strong>True</strong> and <strong>False</strong>; <strong>proposition symbols</strong> such as P, Q, P₁, W₁,₃ — each standing for a sentence that’s either true or false; and five connectives. A <strong class='hl'>literal</strong> is an atomic sentence (P) or the negation of one (¬P)."
    ],
    headers: [
      "Connective",
      "Name",
      "Read as"
    ],
    rows: [
      [
        "¬",
        "Negation",
        "not"
      ],
      [
        "∧",
        "Conjunction",
        "and"
      ],
      [
        "∨",
        "Disjunction",
        "or"
      ],
      [
        "⇒",
        "Implication",
        "if … then"
      ],
      [
        "⇔",
        "Biconditional",
        "if and only if"
      ]
    ],
    grammarTitle: "Grammar and operator precedence",
    precedence: "Precedence, from highest to lowest: <strong>¬, ∧, ∨, ⇒, ⇔</strong>. So <span class='code-inline'>¬A ∧ B ∨ C ⇒ D</span> reads as <span class='code-inline'>((¬A ∧ B) ∨ C) ⇒ D</span>. When in doubt, add parentheses — extra ones never make a sentence wrong.",
    semantics: "Semantics: each model assigns true or false to every symbol. Three symbols P₁,₂, P₂,₂, P₃,₁ give 2³ = <strong>8</strong> models, for example m₁ = {P₁,₂ = false, P₂,₂ = false, P₃,₁ = true}. A complex sentence is evaluated recursively, inside out, using the table below.",
    evalExample: "Evaluate ¬P₁,₂ ∧ (P₂,₂ ∨ P₃,₁) in m₁: ¬false = <strong>true</strong>; false ∨ true = <strong>true</strong>; true ∧ true = <strong class='hl'>true</strong>.",
    check: {
      q: "“If it rains, the road gets wet.” Today it’s sunny and the road is dry. Is the sentence true or false?",
      opts: [
        "False — it didn’t rain",
        "True — the condition didn’t happen, so the implication isn’t broken",
        "Undefined — logic doesn’t cover this case"
      ],
      a: 1,
      ex: "P ⇒ Q is false in exactly one row: P true and Q false. Think of it as a promise — “if you score 9 on the test, I’ll buy you dinner”: you score 7, I don’t buy dinner, and nobody calls me a liar. Propositional logic doesn’t require P and Q to be causally related — it only looks at truth values."
    },
    kbTitle: "Writing the Wumpus cave as sentences",
    kbIntro: "Each room [i,j] gets four symbols: <span class='code-inline'>Pᵢ,ⱼ</span> pit, <span class='code-inline'>Wᵢ,ⱼ</span> Wumpus, <span class='code-inline'>Bᵢ,ⱼ</span> breeze, <span class='code-inline'>Sᵢ,ⱼ</span> stench. After the first two steps the KB has five sentences:",
    kbNotes: [
      "no pit in the start room",
      "[1,1] is breezy if and only if a neighbor has a pit",
      "the same for [2,1]",
      "percept in [1,1]: no breeze",
      "percept in [2,1]: breeze"
    ],
    kbNote: "R2 and R3 are the cave’s “physics” — true in every game. R4 and R5 are what the agent just perceived. Note that R2 uses ⇔, not ⇒: the direction (P₁,₂ ∨ P₂,₁) ⇒ B₁,₁ is the one that lets the agent infer “no pit” from “no breeze”."
  },
  modelcheck: {
    title: "🔍 Model checking: enumerate every world",
    en: "Model checking, validity and satisfiability",
    lead: "The definition of ⊨ already hands you an algorithm: list every model, keep the ones where the KB is true, check whether α holds in all of them. Slow, but honest — and it’s the yardstick for every cleverer algorithm that follows.",
    approaches: [
      {
        title: "Model checking",
        body: "Enumerate models (inference by enumeration). That’s this section."
      },
      {
        title: "Inference rules",
        body: "Apply rules to sentences to build a proof, without looking at models. Sections 06 and 08."
      },
      {
        title: "Refutation · SAT",
        body: "Turn it into “is KB ∧ ¬α satisfiable?”: resolution, DPLL, WalkSAT. Sections 07 and 09."
      }
    ],
    approachesTitle: "Three ways to answer KB ⊨ α?",
    paras: [
      "For the Wumpus KB from section 04: 7 symbols → 2⁷ = <strong>128</strong> models. The KB is true in only <strong>3</strong> rows, and all 3 have P₁,₂ = false. So KB ⊨ ¬P₁,₂: no pit in [1,2]. Five sentences just crossed out <strong>125</strong> worlds."
    ],
    ttTitle: "Three rows that survive out of 128",
    ttNote: "The table is recomputed from R1–R5 right in your browser. Every other row of the table makes at least one of R1–R5 false.",
    codeTitle: "TT-ENTAILS in Python",
    codeLead: "The algorithm enumerates models depth-first: each level assigns one symbol true, then false. At a leaf, if the KB is true it returns the value of α; if the KB is false it returns true — that world can’t refute anything. Helpers such as <span class='code-inline'>pl_true</span> are assumed to exist.",
    complexity: "The algorithm is <strong class='hl'>sound and complete</strong>, with <strong>O(2ⁿ)</strong> time and <strong>O(n)</strong> space, since it only holds one branch at a time. Sounds fine — until you learn that a real Wumpus agent needs 64 symbols: 2⁶⁴ ≈ 1.8 × 10¹⁹ rows. Section 09 comes back to that number.",
    quiz01Title: "Quiz 01 · are the sprinklers on?",
    quiz01: "The KB has three rules and two facts. R1: if it’s hot and smoky, there’s a fire. R2: if the alarm beeps, it’s smoky. R3: if there’s a fire, the sprinklers come on. F1: the alarm beeps. F2: it’s hot. Write the KB in propositional logic with H = hot, S = smoky, F = fire, A = alarm beeps, R = sprinklers on, then answer “are the sprinklers on?” by model checking.",
    quiz01Answer: "KB: H ∧ S ⇒ F, A ⇒ S, F ⇒ R, A, H. 5 symbols → 2⁵ = 32 models. A and H must be true; A ⇒ S forces S true; H ∧ S ⇒ F forces F true; F ⇒ R forces R true. So the KB is true in just <strong>1</strong> model — all five symbols true — and R is true there: <strong class='hl'>KB ⊨ R</strong>, the sprinklers are on. In the Lab in section 10, the “Fire alarm” example in Truth table mode gives exactly 32 and 1.",
    equivTitle: "Logical equivalence",
    equiv: "<strong class='hl'>α ≡ β</strong> when the two sentences are true in the same set of models, that is α ⊨ β and β ⊨ α. This is the toolkit of rewrites you’ll lean on for the rest of the session:",
    equivNames: [
      "commutativity of ∧",
      "commutativity of ∨",
      "associativity of ∧",
      "associativity of ∨",
      "double-negation elimination",
      "contraposition",
      "implication elimination",
      "biconditional elimination",
      "De Morgan",
      "De Morgan",
      "distributivity of ∧ over ∨",
      "distributivity of ∨ over ∧"
    ],
    cards: [
      {
        title: "Valid",
        body: "True in every model: P ∨ ¬P, P ⇒ P, (P ∧ (P ⇒ Q)) ⇒ Q. Also called tautologies. The <strong>deduction theorem</strong>: α ⊨ β if and only if α ⇒ β is valid."
      },
      {
        title: "Satisfiable",
        body: "True in at least one model: P ∨ Q, P. <strong>Unsatisfiable</strong> if it’s true in no model: P ∧ ¬P. α ⊨ β if and only if α ∧ ¬β is unsatisfiable — that’s proof by contradiction."
      },
      {
        title: "SAT",
        body: "The problem of deciding whether a propositional sentence is satisfiable — the first problem ever proven <strong>NP-complete</strong>. CSPs in session 8 ask exactly this kind of question: can some assignment satisfy all the constraints?"
      }
    ],
    trap: "A common slip: P ⇒ ¬P is <strong>not</strong> valid — when P is true the sentence is false. It’s only satisfiable (true when P is false). The standard valid example is P ⇒ P.",
    quizTitle: "Quiz 02 · classify four sentences yourself",
    quizIntro: "Cover the answer column, build the truth table for all four, then compare. Tip: to tell whether an implication is valid, hunt for a row that makes the left side true and the right side false — if you can’t find one, it’s valid.",
    quizHeaders: [
      "Sentence",
      "Verdict",
      "Why"
    ],
    quizRows: [
      [
        "satisfiable, not valid",
        "A true, C false makes it false; A and C both true make it true"
      ],
      [
        "valid",
        "a true left side forces A true, so the right side is true"
      ],
      [
        "valid",
        "this is exactly one resolution step on B — section 07"
      ],
      [
        "satisfiable, not valid",
        "A true, B false makes it false; A and B both true make it true"
      ]
    ],
    labHint: "Check yourself with the Lab in section 10: leave the KB box empty, type the sentence as the query, pick Truth table — the Lab tells you whether it’s valid, satisfiable or unsatisfiable."
  },
  rules: {
    title: "Inference rules: proving without the table",
    en: "Inference rules and proofs",
    lead: "A truth table looks at everything, including all the things that don’t matter. A proof only walks through the sentences it needs — so when there are astronomically many models but the proof is short, the proof wins by a mile.",
    paras: [
      "<strong class='hl'>Theorem proving</strong> applies inference rules directly to the sentences in the KB to build the sentence you want, without consulting models at all. A <strong>proof</strong> is a chain of conclusions leading to the goal. Four sound rules you’ll use constantly:"
    ],
    ruleNames: [
      "Modus Ponens",
      "Modus Tollens",
      "And-Introduction",
      "And-Elimination"
    ],
    proof1Title: "Proving S from three sentences",
    headers: [
      "#",
      "Sentence",
      "Justification"
    ],
    proof1: [
      "From KB",
      "From KB",
      "From KB",
      "1, And-Elim",
      "4, 2 Modus Ponens",
      "1, And-Elim",
      "5, 6 And-Intro",
      "3, 7 Modus Ponens"
    ],
    proof2Title: "Proving ¬P₁,₂ in the cave",
    proof2: [
      "biconditional elimination on R2",
      "And-Elimination on R6",
      "contraposition of R7",
      "Modus Ponens with R8 and the percept R4",
      "De Morgan on R9"
    ],
    proof2Note: "Five steps, and the proof never mentions B₂,₁, P₁,₁, P₂,₂ or P₃,₁. A truth table has to enumerate those four spare symbols anyway — 2⁴ = <strong>16</strong> times more rows than it actually needs.",
    searchTitle: "Proof is a search problem too",
    search: [
      {
        title: "Initial state",
        body: "The initial knowledge base."
      },
      {
        title: "Actions",
        body: "Apply every inference rule to every sentence that matches the top half of the rule."
      },
      {
        title: "Result",
        body: "Add the sentence in the bottom half of the rule to the KB."
      },
      {
        title: "Goal",
        body: "A state that contains the sentence to be proved."
      }
    ],
    searchNote: "Unlike a truth table, a proof search can ignore every irrelevant proposition, however many there are — which makes it far more efficient.",
    monotonic: "<strong class='hl'>Monotonicity</strong>: adding information only grows the set of entailed sentences — if KB ⊨ α then KB ∧ β ⊨ α. That’s why a rule can fire whenever its premises match: a conclusion you’ve drawn is never invalidated by a new sentence.",
    incomplete: "There’s a catch, though: the rules you have in hand might <strong>not be enough</strong>. Missing a rule means some entailed sentences are never reachable — sound but not complete. The next section fixes exactly that, with a single rule."
  },
  resolution: {
    title: "✂️ Resolution: one rule is enough",
    en: "CNF and resolution",
    lead: "Modus Ponens, And-Elimination, De Morgan… the longer the rule list, the easier it is to be missing one. Resolution pulls off something unusual: a single rule, paired with any complete search algorithm, gives you a complete inference procedure.",
    paras: [
      "The <strong class='hl'>unit resolution</strong> rule: from a clause <span class='code-inline'>l₁ ∨ … ∨ lₖ</span> and a literal <span class='code-inline'>m</span> complementary to lᵢ, infer the clause with lᵢ removed. The <strong>full</strong> version: from <span class='code-inline'>l₁ ∨ … ∨ lₖ</span> and <span class='code-inline'>m₁ ∨ … ∨ mₙ</span> where lᵢ and mⱼ are complementary, infer the clause made of every remaining literal from both.",
      "Why is it sound? It’s what you do when you say “if it rains tomorrow I’ll stay home, and if it doesn’t I’ll go to the beach”: you don’t know about tomorrow, but you’ll definitely be home <em>or</em> at the beach. The clauses (¬Rain ∨ Home) and (Rain ∨ Beach) resolve on Rain to give (Home ∨ Beach).",
      "<strong>Factoring</strong>: the resulting clause keeps only one copy of each literal. Resolving (A ∨ B) with (A ∨ ¬B) gives A ∨ A, which reduces to <strong>A</strong>."
    ],
    wumpus: "In the cave: the agent reaches [1,2] and feels no breeze (R11: ¬B₁,₂; R12: B₁,₂ ⇔ (P₁,₁ ∨ P₂,₂ ∨ P₁,₃)), which yields R13: ¬P₂,₂ and R14: ¬P₁,₃. From R3 and R5 comes R15: P₁,₁ ∨ P₂,₂ ∨ P₃,₁. Resolve ¬P₂,₂ against P₂,₂ → R16: P₁,₁ ∨ P₃,₁. Resolve ¬P₁,₁ (R1) against P₁,₁ → <strong class='hl'>R17: P₃,₁</strong>. The pit is in [3,1] — the same conclusion the agent reached while feeling its way through the cave in section 02.",
    cnfTitle: "First, every sentence has to be a clause",
    cnf: "Resolution only applies to <strong>clauses</strong> — disjunctions of literals. So every sentence in the KB has to be converted to <strong class='hl'>conjunctive normal form (CNF)</strong>: a conjunction of clauses. For example B₁,₁ ⇔ (P₁,₂ ∨ P₂,₁) becomes a conjunction of 3 clauses: (¬B₁,₁ ∨ P₁,₂ ∨ P₂,₁) ∧ (¬P₁,₂ ∨ B₁,₁) ∧ (¬P₂,₁ ∨ B₁,₁). From here on, <em>clause</em> always means a disjunction of literals — a narrower thing than the general “proposition” from the math primer.",
    cnfSteps: [
      "Eliminate ⇔: α ⇔ β ≡ (α ⇒ β) ∧ (β ⇒ α)",
      "Eliminate ⇒: α ⇒ β ≡ ¬α ∨ β",
      "Move ¬ inwards until it only sits in front of symbols: ¬¬α ≡ α · ¬(α ∧ β) ≡ ¬α ∨ ¬β · ¬(α ∨ β) ≡ ¬α ∧ ¬β",
      "Distribute ∨ over ∧: (α ∧ β) ∨ γ ≡ (α ∨ γ) ∧ (β ∨ γ)"
    ],
    cnfDemo: "The four steps on R2, run by this lesson’s engine:",
    unchanged: "unchanged",
    quizTitle: "Quiz 03 · convert two sentences to CNF",
    quiz: [
      {
        hint: "Eliminate ⇒ twice: ¬(A ∧ B) ∨ (¬C ∨ D). De Morgan: <strong>¬A ∨ ¬B ∨ ¬C ∨ D</strong> — a single clause."
      },
      {
        hint: "By precedence the sentence is (P ∨ Q) ⇔ ((R ∧ ¬Q) ⇒ P), and the right side ≡ ¬R ∨ Q ∨ P. The direction (P ∨ Q) ⇒ (¬R ∨ Q ∨ P) produces two clauses that contain a complementary pair (P with ¬P, Q with ¬Q) — always true, so drop them. The other direction gives R ∨ P ∨ Q plus two always-true clauses. Result: <strong>P ∨ Q ∨ R</strong>. Sanity check: the original is false only when P, Q and R are all false."
      }
    ],
    algoTitle: "The resolution refutation algorithm",
    algo: "To prove KB ⊨ α, prove that <strong class='hl'>KB ∧ ¬α is unsatisfiable</strong>. PL-RESOLUTION converts KB ∧ ¬α to CNF, resolves pairs of clauses and adds the new clauses to the set. It stops in one of two ways: it produces the <strong>empty clause □</strong> → contradiction → KB ⊨ α; or no new clauses appear → KB ⊭ α. With n symbols there are only finitely many distinct clauses, so the loop always terminates.",
    algoNote: "Many resolution steps are pointless. A clause containing two complementary literals can be thrown away immediately: B₁,₁ ∨ ¬B₁,₁ ∨ P₂,₁ ≡ True ∨ P₂,₁ ≡ True — always true, and no help at all in finding a contradiction. For any pair of sentences α, β in propositional logic, a resolution-based theorem prover can always <strong>decide</strong> whether α ⊨ β. “Complete” here means <em>refutation-complete</em>: resolution doesn’t list every consequence of the KB, but whenever KB ∧ ¬α is unsatisfiable, it always reaches □.",
    umbrellaTitle: "Quiz 04 · does Joe get wet?",
    umbrella: "Hypotheses: if it rains, Joe brings his umbrella (R ⇒ U); if Joe brings his umbrella, he doesn’t get wet (U ⇒ ¬W); if it doesn’t rain, he doesn’t get wet (¬R ⇒ ¬W). Prove that Joe doesn’t get wet. The figure runs the refutation: add W — the negated conclusion — and resolve all the way down to □.",
    umbrellaAfter: "Don’t take my word for it: open the Lab in section 10, pick the “Joe and the umbrella” example, Resolution mode. The Lab may find the proof in a different order, but it also ends in □."
  },
  chaining: {
    title: "⛓️ Horn clauses: reasoning in a chain",
    en: "Horn clauses, forward and backward chaining",
    lead: "Resolution is complete, but it can churn out a huge number of clauses. If the KB agrees to a narrower shape — at most one positive literal per clause — then deciding entailment takes only linear time.",
    cards: [
      {
        title: "Definite clause",
        body: "Exactly <strong>one</strong> positive literal. ¬P ∨ ¬Q ∨ R is a definite clause; ¬P ∨ Q ∨ R is not."
      },
      {
        title: "Horn clause",
        body: "<strong>At most one</strong> positive literal. Every definite clause is a Horn clause. Horn clauses are closed under resolution: resolve two Horn clauses and you get a Horn clause back."
      },
      {
        title: "Goal clause",
        body: "No positive literal at all, for example ¬P ∨ ¬Q, i.e. (P ∧ Q) ⇒ False."
      }
    ],
    rule: "A definite clause reads like a rule: <span class='code-inline'>¬P ∨ ¬Q ∨ R ≡ P ∧ Q ⇒ R</span>. The <strong>body</strong> (premise) is a conjunction of positive literals, the <strong>head</strong> (conclusion) a single positive symbol; a clause made of a single positive literal and no negative ones (an empty body) — like A — is a <strong>fact</strong>. Much easier to read than raw CNF, the basis of logic programming, and for a KB of definite clauses, deciding entailment takes <strong class='hl'>linear time</strong> in the size of the KB.",
    grammarTitle: "CNF and Horn as a grammar",
    hornVsCnf: "CNF: each clause is any disjunction of literals, joined with ∧. Horn is a restricted form: each clause has at most one positive literal. Accept that restriction and you can trade resolution for forward and backward chaining.",
    fcTitle: "Forward chaining: open the fridge, see what you can cook",
    fc: "The idea: fire every rule whose premises are all satisfied in the KB, add its conclusion to the KB, and repeat until the query shows up. PL-FC-ENTAILS? keeps a <span class='code-inline'>count</span> per rule = the number of premises still missing, like a coffee loyalty card that tells you how many stamps are still missing before the free drink. Every time a symbol is confirmed true, each rule with that symbol in its body gets another stamp — one fewer missing; any rule with 0 missing (a full card) pushes its conclusion onto the <span class='code-inline'>agenda</span>. The algorithm is sound and complete for KBs of definite clauses.",
    graph: "The graph below is the KB P ⇒ Q, L ∧ M ⇒ P, B ∧ L ⇒ M, A ∧ P ⇒ L, A ∧ B ⇒ L, plus the two facts A and B. Each rectangle is a rule — <strong>AND</strong>: it needs every incoming arrow. Two rules pointing at L form an <strong>OR</strong>: either one is enough.",
    bcTitle: "Backward chaining: work back from the dish you want",
    bc: "Work backwards from the query q: if q is already known, you’re done; otherwise find a rule that concludes q and recursively prove every one of its premises. Two brakes: <strong>avoid loops</strong> — if a new subgoal is already on the goal stack, drop it; <strong>avoid repeated work</strong> — if a subgoal has already been proved, reuse that result; a subgoal that already failed can be reused too, <em>unless</em> it failed only because a loop was cut — called from somewhere else, with no loop in the way, it might succeed.",
    bcNote: "In the figure, when L is needed, the first rule is A ∧ P ⇒ L — but P is waiting on the stack (P needs L). That’s a loop, so backward chaining drops that rule and tries A ∧ B ⇒ L. Later, when M needs L, it reuses the earlier result instead of proving it again.",
    fcOrder: "The order on this graph: pop A (A ∧ P ⇒ L and A ∧ B ⇒ L drop to 1) → pop B (B ∧ L ⇒ M drops to 1; A ∧ B ⇒ L hits 0 → add L) → pop L (L ∧ M ⇒ P drops to 1; B ∧ L ⇒ M hits 0 → add M) → pop M (L ∧ M ⇒ P hits 0 → add P) → pop P (P ⇒ Q hits 0 → add Q; A ∧ P ⇒ L hits 0 → add L again) → pop Q: query reached.",
    bcOrder: "The goal order: Q? needs P (via P ⇒ Q); P? needs L and M (via L ∧ M ⇒ P). For L: try A ∧ P ⇒ L — A ✓ but P is on the stack → drop it; try A ∧ B ⇒ L — A ✓, B ✓ → L ✓. For M: B ∧ L ⇒ M — B ✓ (already proved), L ✓ (reused) → M ✓ → P ✓ → Q ✓.",
    traceTitle: "Show the full trace of both figures (static)",
    codeTitle: "PL-FC-ENTAILS? in Python",
    codeLead: "Each clause <span class='code-inline'>c</span> is an object with a <span class='code-inline'>premise</span> (the set of body symbols) and a <span class='code-inline'>conclusion</span>; <span class='code-inline'>count</span> uses c itself as a key, so c has to be hashable.",
    compareTitle: "Forward or backward?",
    compareHeaders: [
      "",
      "Forward chaining",
      "Backward chaining"
    ],
    compareRows: [
      [
        "Direction",
        "Data-driven; automatic, like unconscious processing",
        "Goal-driven; suited to problem-solving"
      ],
      [
        "Examples",
        "Object recognition, routine decisions",
        "Where are my keys? How do I get into a PhD program?"
      ],
      [
        "Cost",
        "May do lots of work that’s irrelevant to the goal",
        "Often much less than linear in the size of the KB"
      ]
    ],
    anotherTitle: "One more, by hand",
    another: "KB: A ∧ B ⇒ C, C ∧ D ⇒ E, C ∧ F ⇒ G, A, B, D. Query: E?",
    anotherAnswer: "<strong>Forward</strong>: A, B ⇒ C (rule 1); C, D ⇒ E (rule 2) — done. <strong>Backward</strong>: E? needs C and D; C? needs A, B — both given; D is given → every rule needed is satisfied, E is proved. The rule C ∧ F ⇒ G never has to be touched.",
    quizTitle: "Quiz 05 · the fire alarm, both directions",
    quiz: "Reuse the KB from Quiz 01 in section 05 — H ∧ S ⇒ F, A ⇒ S, F ⇒ R, A, H — and answer “are the sprinklers on?” with forward and then backward chaining.",
    quizAnswer: "KB: H ∧ S ⇒ F, A ⇒ S, F ⇒ R, A, H. <strong>Forward</strong>: pop A → A ⇒ S hits 0, add S; pop H → H ∧ S ⇒ F drops to 1; pop S → hits 0, add F; pop F → add R; R found. <strong>Backward</strong>: R? ← F? ← H ✓ and S? ← A ✓. Same answer as model checking in Quiz 01, without building a single truth table."
  },
  dpll: {
    title: "DPLL and WalkSAT: when the world is too big to enumerate",
    en: "Efficient model checking: DPLL, DP and WalkSAT",
    lead: "In 1960, Martin Davis and Hilary Putnam published a satisfiability procedure built on resolution. It was correct, but it devoured memory. Two years later, Davis, George Logemann and Donald Loveland swapped the variable elimination for backtracking search — and the four letters DPLL have followed that idea all the way into today’s SAT solvers.",
    paras: [
      "Checking KB ⊨ α is checking that KB ∧ ¬α is unsatisfiable — a SAT problem. There are two families of efficient algorithms based on model checking: <strong>complete backtracking</strong> (DPLL) and <strong>incomplete local search</strong> (WalkSAT, a relative of session 6’s hill climbing).",
      "DPLL takes a sentence in CNF and enumerates models recursively, depth-first — just like TT-ENTAILS — but with three improvements:"
    ],
    cards: [
      {
        title: "1 · Early termination",
        body: "A clause is true if <strong>any</strong> literal is true; a sentence is false if <strong>any</strong> clause is false. For example (A ∨ B) ∧ (A ∨ C) is true as soon as A is, whatever B and C are — a whole subtree skipped."
      },
      {
        title: "2 · Pure symbol",
        body: "A symbol that always appears with the same sign in every clause. In (A ∨ ¬B), (¬B ∨ ¬C), (A ∨ C): A and B are pure, C isn’t. Making the pure literal true (A = true, B = false) can never make a clause false. When checking purity, ignore clauses that are already true."
      },
      {
        title: "3 · Unit clause",
        body: "A clause whose other literals are all already false, leaving exactly one unassigned literal: that literal is forced to be true. With A = true, (¬A ∨ ¬B) becomes a unit clause → B is false; but (A ∨ B) is already satisfied by A, so it forces nothing. Unit propagation: if B = true, (¬B ∨ ¬C) becomes ¬C → C is false → (A ∨ C) forces A true. Like the last empty seat on a bus — the last passenger doesn’t get to choose."
      }
    ],
    codeTitle: "DPLL in Python",
    codeLead: "DPLL’s order: early termination → pure symbol → unit clause → only then split. The Python keeps exactly that order; the helpers that find pure symbols and unit clauses are assumed to exist.",
    dpTitle: "DP versus DPLL",
    dp: "The original DP procedure eliminates one symbol φ at a time: resolve <em>every</em> pair of clauses containing φ and ¬φ, keep the results that aren’t tautologies, then delete every clause containing φ or ¬φ. If the empty clause is left at the end, the input is unsatisfiable. Each elimination can blow the clause set up <strong>quadratically</strong> — on large problems, memory runs out. DPLL instead solves a sequence of smaller problems: pick a literal, assume it’s true, simplify the clause set, try to show it’s satisfiable; if that fails, do the same with its negation. It never cross-multiplies the clause set.",
    dpHeaders: [
      "Problem",
      "Tautology",
      "DP",
      "DPLL"
    ],
    dpNote: "Read this table with a skeptical eye: the original gives no units and doesn’t explain the Tautology column (most likely an enumeration-style tautology check) or the * marks, so I only read the ordering. DP doesn’t lose on every row — from Mkadder32 to Mkadder53 it’s actually faster. But in the <strong>*</strong> cells DP has no result, while DPLL still answered. The Tautology column was already past an hour from Prime16 on.",
    quiz06Title: "Quiz 06 · DPLL or DP",
    quiz06: "KB: A ⇒ B ∨ C, A ⇒ D, C ∧ D ⇒ ¬F, B ⇒ F, A. Use DPLL or DP to check whether the KB entails (a) C and (b) B ⇒ ¬C.",
    quiz06Answer: "CNF of the KB: ¬A ∨ B ∨ C · ¬A ∨ D · ¬C ∨ ¬D ∨ ¬F · ¬B ∨ F · A. <strong>(a)</strong> Add ¬C. Unit A → A true; ¬A ∨ D becomes a unit → D true; ¬C → C false. Now ¬C ∨ ¬D ∨ ¬F is satisfied; among the remaining clauses F only appears positive → pure, F true; B also only appears positive → B true. Every clause is true: the model {A, B, D, F true; C false} satisfies KB ∧ ¬C → <strong class='hl'>KB ⊭ C</strong>. <strong>(b)</strong> ¬(B ⇒ ¬C) ≡ B ∧ C, so add the two unit clauses B and C. Unit A → D true; B → (¬B ∨ F) gives F true; that leaves ¬C ∨ ¬D ∨ ¬F with C, D, F all true → false. A contradiction without a single split → <strong class='hl'>KB ⊨ B ⇒ ¬C</strong>. The DP route for (b): eliminate C → add ¬A ∨ B ∨ ¬D ∨ ¬F and ¬D ∨ ¬F; eliminate F → ¬B ∨ ¬D (dropping the tautology); eliminate D → ¬A ∨ ¬B; eliminate A → ¬B; eliminate B: B with ¬B gives □ → unsatisfiable.",
    walkTitle: "WalkSAT: hill climbing with a reckless streak",
    walk: "WalkSAT starts from a random assignment. Each round: pick a random clause that’s currently false; with probability <strong>p</strong> (typically around 0.5) flip a random symbol in that clause, otherwise flip whichever symbol makes the <strong>most clauses true</strong> — the min-conflicts heuristic from session 8, minimizing unsatisfied clauses. It balances greed and randomness; after max_flips it returns failure.",
    check: {
      q: "WalkSAT runs on KB ∧ ¬α, uses up all its flips and finds no model. So KB ⊨ α?",
      opts: [
        "Yes — no model means unsatisfiable",
        "Not necessarily — it may just not have searched long enough",
        "No — KB ⊭ α for sure"
      ],
      a: 1,
      ex: "If WalkSAT finds a model, the sentence is definitely satisfiable. If it returns failure, there are two possibilities: it really is unsatisfiable, or it needs more time. It <strong>can’t detect</strong> unsatisfiability, so a Wumpus agent can’t use WalkSAT to prove a room is safe — the most it can say is “I thought about it for an hour and couldn’t come up with a world where that room isn’t safe.” WalkSAT is most useful when you expect a solution to exist."
    },
    scaleTitle: "How many sentences does a real Wumpus agent need?",
    scale: "A Wumpus agent using propositional logic for a 4×4 cave needs a KB with <strong>64</strong> distinct symbols — 16 rooms × 4 kinds P, W, B, S — and <strong>155</strong> sentences: ¬P₁,₁ and ¬W₁,₁; one Bₓ,ᵧ ⇔ (Pₓ,ᵧ₊₁ ∨ Pₓ,ᵧ₋₁ ∨ Pₓ₊₁,ᵧ ∨ Pₓ₋₁,ᵧ) per room and one matching Sₓ,ᵧ sentence over W; the “at least one Wumpus” sentence W₁,₁ ∨ W₁,₂ ∨ … ∨ W₄,₄; and every pair ¬W₁,₁ ∨ ¬W₁,₂, ¬W₁,₁ ∨ ¬W₁,₃, … saying “at most one Wumpus”.",
    scalePunch: "Count them: 2 + 16 + 16 + 1 + 120 pairs = 155. The idea “at most one Wumpus” alone takes <strong>120</strong> sentences.",
    limitsTitle: "The limits of propositional logic",
    limits: "Propositional logic hits a ceiling on expressiveness. The KB has to restate the “physics” for <strong>every single room</strong>: “don’t go forward if the Wumpus is in front of you” takes <strong>16 rooms × 4 orientations = 64</strong> propositional rules. Time is worse: for every time t and location [x,y] you need a separate sentence like the one below — as if there were a separate KB for every time step. Building a real agent would take thousands of rules.",
    limitsFormula: "Lᵗₓ,ᵧ ∧ FacingRightᵗ ∧ Forwardᵗ ⇒ Lᵗ⁺¹ₓ₊₁,ᵧ",
    bridge: "Session 10 fixes exactly this pain with <strong>first-order logic</strong>: objects, relations, variables and the quantifiers ∀ ∃, so one sentence can stand in for a whole family of room-by-room sentences."
  },
  lab: {
    title: "🧪 One KB, five reasoning engines",
    en: "Logic Lab",
    lead: "Same question, KB ⊨ α? The truth table enumerates every world, resolution hunts for □, chaining fires rules, DPLL backtracks with shortcuts, WalkSAT flips at random — with a plan. Reading about five methods is one thing; watching them run on the same KB is how you see what each one costs you.",
    intro: "Three experiments I want you to run: (1) pick <strong>Wumpus cave</strong>, run Truth table then Resolution — 3/128 rows and a □ proof say the same thing; (2) same KB, pick Forward chaining — the Lab refuses, and the reason it refuses is the lesson; (3) pick <strong>Quiz 06</strong> and change the query to <span class='code-inline'>C</span>: DPLL returns a counterexample model, while WalkSAT may find it or give up without concluding anything.",
    answer: "(1) Both say KB ⊨ ¬P₁,₂. (2) R1 = ¬P₁,₁ is a goal clause with no positive literal; R2 in CNF includes ¬B₁,₁ ∨ P₁,₂ ∨ P₂,₁, which has two positive literals. Chaining only runs on definite clauses. (3) KB ⊭ C: the model with A, B, D, F true and C false makes every sentence of the KB true. With the default query B ⇒ ¬C, DPLL hits a contradiction without splitting: KB ⊨ B ⇒ ¬C.",
    preset: "Example",
    presets: {
      wumpus: "Wumpus cave (R1–R5)",
      fire: "Fire alarm (Quiz 01/05)",
      umbrella: "Joe and the umbrella (Quiz 04)",
      chain: "AND-OR graph",
      dpll: "Quiz 06",
      custom: "Custom"
    },
    kb: "KB — one sentence per line",
    query: "Query α",
    syntax: "Syntax: ¬ or ~ · ∧ or & · ∨ or | · ⇒ or => · ⇔ or <=> · parentheses ( ). Symbols are letters plus digits, such as P1,2 or alarm_beeps. Lines starting with # are comments.",
    method: "Inference method",
    methods: {
      tt: "Truth table",
      resolution: "Resolution",
      fc: "Forward chaining",
      bc: "Backward chaining",
      dpll: "DPLL",
      walksat: "WalkSAT"
    },
    verdict: {
      yes: "KB ⊨ α",
      no: "KB ⊭ α",
      unknown: "No verdict"
    },
    errors: {
      empty: "empty sentence",
      char: "unknown character",
      unexpected: "unexpected token",
      end: "sentence ends too early",
      unclosed: "missing closing parenthesis",
      line: "Line",
      query: "Query",
      at: "at position"
    },
    tt: {
      tooMany: "symbols — too many to enumerate in the Lab (limit 12).",
      models: "Models",
      kbModels: "KB true",
      counter: "Counterexamples",
      alpha: "α on its own is",
      classes: {
        valid: "valid",
        satisfiable: "satisfiable, not valid",
        unsatisfiable: "unsatisfiable"
      },
      rows: "Models where the KB is true",
      more: "more rows not shown"
    },
    res: {
      clauses: "Clauses of KB ∧ ¬α (CNF)",
      kb: "KB sentence",
      query: "¬α",
      proof: "Proof",
      on: "resolved on",
      generated: "Clauses generated",
      saturated: "No new clauses can be generated → KB ⊭ α",
      limit: "Stopped at the 500-clause limit — no verdict",
      empty: "KB ∧ ¬α has no clauses (every sentence is a tautology)"
    },
    fc: {
      notDefinite: "Forward / backward chaining only runs on a KB made entirely of definite clauses. This one breaks the rule:",
      goal: "goal clause (no positive literal)",
      nonHorn: "more than one positive literal",
      badQuery: "The query must be a single positive symbol — no ¬, no connectives.",
      rules: "Rules (initial count)",
      agenda: "agenda",
      events: {
        init: "Start the agenda with the facts",
        pop: "Pop",
        skip: "already inferred, skipped",
        decrement: "decrement count of",
        fire: "count = 0, fire",
        found: "Query reached",
        exhausted: "agenda empty, query never reached"
      }
    },
    bc: {
      events: {
        goal: "Goal",
        fact: "is a fact ✓",
        "memo-true": "already proved ✓",
        "memo-fail": "already failed",
        loop: "is already on the goal stack → dropped (loop)",
        try: "try rule",
        proved: "proved ✓",
        "rule-fail": "this rule doesn’t work",
        fail: "cannot be proved"
      }
    },
    dp: {
      events: {
        sat: "Every clause true → satisfiable",
        conflict: "A clause is false → this branch fails",
        pure: "Pure symbol",
        unit: "Unit clause",
        split: "Split"
      },
      unsat: "KB ∧ ¬α is unsatisfiable → KB ⊨ α",
      sat: "Found a model of KB ∧ ¬α — a counterexample:",
      truncated: "Trace cut off at 400 events."
    },
    ws: {
      start: "Initial random assignment",
      flip: "Flip",
      random: "random",
      greedy: "greedy",
      unsat: "false clauses",
      model: "Found a model of KB ∧ ¬α → KB ⊭ α",
      failure: "Used all 100 flips, no model found → no verdict",
      reseed: "Run again with another seed"
    },
    trace: "Trace",
    more: "more steps",
    reset: "Restore the example"
  },
  visual: {
    models: {
      title: "Filtering eight worlds",
      tabs: [
        "α₁: no pit in [1,2]",
        "α₂: no pit in [2,2]"
      ],
      phases: [
        "The eight models of the three rooms [1,2], [2,2], [3,1].",
        "Red outline: M(KB) — the KB keeps 3 models.",
        "Yellow fill: M(α) — the models where α is true.",
        "Compare the two sets."
      ],
      verdicts: [
        "M(KB) ⊆ M(α₁) → KB ⊨ α₁",
        "2 models of the KB fall outside M(α₂) → KB ⊭ α₂"
      ],
      pit: "pit",
      legend: "Each small board is one world: bottom row [1,1] [2,1] [3,1], top row [1,2] [2,2] [3,2]; a solid dot = a pit."
    },
    res: {
      title: "Resolution refutation: Joe stays dry",
      headers: [
        "#",
        "Clause",
        "Source"
      ],
      kb: "From KB",
      query: "Negated conclusion",
      pair: "Resolve",
      captions: [
        "Four starting clauses: the three KB sentences in CNF, plus W — the negation of ¬W.",
        "Resolve 1 and 2 on U: ¬R ∨ ¬W.",
        "Resolve 3 and 5 on R: ¬W ∨ ¬W, which factors to ¬W.",
        "Resolve 4 and 6 on W: □. KB ∧ W is contradictory → KB ⊨ ¬W."
      ]
    },
    chain: {
      title: "Chaining on an AND-OR graph",
      tabs: [
        "Forward chaining",
        "Backward chaining"
      ],
      legend: "Rectangle: rule, number = count · filled circle: inferred / proved · yellow outline: current · dashed outline: waiting on the goal stack",
      stack: "Goal stack"
    },
    cycle: "Looping illustration; the static explanation sits right around it."
  },
  summary: {
    title: "Everything on one screen",
    en: "Five ways to answer KB ⊨ α",
    lead: "When an algorithm’s name slips your mind, ask: does it enumerate worlds, or does it write a proof?",
    headers: [
      "Method",
      "Core idea",
      "Sound / complete",
      "Cost"
    ],
    rows: [
      [
        "Truth table",
        "Enumerate every model; α true in every row where the KB is true",
        "✓ / ✓",
        "O(2ⁿ) time, O(n) space"
      ],
      [
        "Inference rules",
        "Modus Ponens, And-Elimination, De Morgan… to build a proof",
        "✓ / depends on the rule set",
        "Only touches relevant sentences"
      ],
      [
        "Resolution",
        "CNF of KB ∧ ¬α, resolve down to □",
        "✓ / ✓ (by refutation)",
        "Can generate a great many clauses"
      ],
      [
        "Forward / backward chaining",
        "Only for KBs of definite clauses",
        "✓ / ✓ on definite KBs",
        "Linear; backward is often less"
      ],
      [
        "DPLL",
        "Backtracking + early termination, pure symbols, unit clauses",
        "✓ / ✓",
        "Still exponential in the worst case, far faster in practice"
      ],
      [
        "WalkSAT",
        "Min-conflicts hill climbing + random steps",
        "✓ when it finds a model / ✗",
        "Fast when a solution exists; can’t prove unsatisfiability"
      ]
    ],
    recall: "Say it back in one sentence: KB ⊨ α means M(KB) ⊆ M(α), and every algorithm in this session either checks that directly or proves that KB ∧ ¬α has no model."
  },
  quiz: {
    title: "Check yourself · then go back to where you got stuck",
    en: "Check your understanding",
    lead: "Eleven questions, each aimed at a common mix-up. Miss one, read the feedback, then go back to that section before the practice problems."
  },
  hw: {
    title: "Practice · from the Wumpus cave to a murder case",
    en: "Practice and transfer",
    lead: "The three problems below are this session’s original homework. Solve them on paper first, then paste your KB into the Lab to check yourself.",
    file: "Open the original homework (PDF)",
    lab2: "Open Lab 2 (notebook)",
    lab2Note: "Part 1 of Lab 2 asks you to write three English sentences in propositional logic, checked by model checking — exactly what you just learned. The later parts use session 10’s first-order logic. A tip for 1c, “Day or night”: the grader only accepts the two models {Day} and {Night} — the everyday “or” here is exclusive, so Day ∨ Night will fail.",
    cards: [
      {
        title: "1 · Who did it?",
        body: "Three suspects: Adams, Brown, Clark. Adams: “I didn’t do it. The victim was an old acquaintance of Brown’s. But Clark hated him.” Brown: “I didn’t do it. I didn’t even know the guy. Besides, I was out of town all week.” Clark: “I didn’t do it. I saw both Adams and Brown downtown with the victim that day; one of them must have done it.” The two innocent men tell the truth; the guilty one may lie. Write it in propositional logic and use resolution to find the culprit.",
        hint: "Let A, B, C = Adams / Brown / Clark is guilty; K = Brown knew the victim; H = Clark hated the victim; T = Brown was out of town all week; D = Adams and Brown were downtown with the victim. Exactly one is guilty: A ∨ B ∨ C, ¬(A ∧ B), ¬(A ∧ C), ¬(B ∧ C). The innocent tell the truth: ¬A ⇒ K ∧ H, ¬B ⇒ ¬K ∧ T, ¬C ⇒ D ∧ (A ∨ B). Plus background knowledge: you can’t be downtown and out of town, D ⇒ ¬T. Assume Brown is innocent (¬B, the negated conclusion): then ¬K and T. If Adams is guilty, Clark is innocent → D → ¬T, contradicting T. If Clark is guilty, Adams is innocent → K, contradicting ¬K. Every branch reaches □ → <strong>Brown did it</strong>. Paste the eight sentences into the Lab with query B to watch resolution do it for you. To <em>find</em> the culprit instead of guessing and checking: run resolution with queries A, B and C in turn — only query B reaches □. For A and C the Lab may stop at its 500-clause limit without a verdict; switch to Truth table or DPLL there to see KB ⊭ A and KB ⊭ C."
      },
      {
        title: "2 · Entailment in a KB with ⇔",
        body: "KB = {A, B, A ∨ C, K ∧ E ⇔ A ∧ B, ¬C ⇒ D, E ∨ F ⇒ ¬D}. Check whether the KB entails: (a) B ∧ C? (b) C ∨ E ⇒ F ∧ B?",
        hint: "A, B true → K ∧ E true → E true → E ∨ F true → ¬D. The sentence ¬C ⇒ D with D false forces C true. (a) B ∧ C: <strong>entailed</strong>. (b) C ∨ E is true, so you’d need F ∧ B; B is true, but nothing constrains F — a model with F false keeps the KB true and makes (b) false. <strong>Not</strong> entailed."
      },
      {
        title: "3 · Chaining over definite clauses",
        body: "KB: 1. C ∧ D ⇒ Y · 2. R ∧ Z ⇒ C · 3. ¬B ∨ D · 4. ¬D ∨ ¬R ∨ Z · 5. B · 6. R ⇒ D · 7. D ⇒ R. Prove Y with backward chaining and with forward chaining; in forward chaining, each rule fires only once.",
        hint: "Rewrite 3 and 4 as rules: B ⇒ D and D ∧ R ⇒ Z. <strong>Forward</strong>: B (5) → D (3) → R (7) → Z (4, needs D and R) → C (2, needs R and Z) → Y (1, needs C and D). <strong>Backward</strong>: Y? needs C, D. C? needs R, Z. R? via D ⇒ R needs D; D? via B ⇒ D, B is a fact ✓ → D ✓ → R ✓. Z? needs D ✓, R ✓ → Z ✓ → C ✓. D is already known → Y ✓. If, while proving D, you try R ⇒ D first, R is already on the goal stack — a loop, so drop that branch."
      }
    ],
    checks: [
      "I can tell given sentences (axioms, percepts) apart from derived ones.",
      "I can explain KB ⊨ α in terms of model sets, and I know ⊭ α doesn’t mean ⊨ ¬α.",
      "I can build a truth table and spot valid, satisfiable and unsatisfiable sentences.",
      "I can convert any sentence to CNF in four steps.",
      "I can prove something by resolution refutation down to the empty clause.",
      "I can run forward and backward chaining by hand on a Horn KB.",
      "I know DPLL is complete and WalkSAT isn’t, and I can explain why."
    ],
    next: "Session 10 opens up first-order logic: objects, relations, the quantifiers ∀ ∃ — and that session’s homework about hounds, cats and Santa will need all of it.",
    roadmap: "← Back to the roadmap"
  }
} satisfies typeof VI;

import type { Course } from '../../types';
import { csc14003 as VI } from './index';

/*
 * Bản tiếng Anh của dữ liệu khóa — viết theo lối DẪN XUẤT, không chép lại.
 *
 * Trải `...VI` rồi chỉ đè những trường có chữ. Nhờ vậy `slug`, `code`, `weeks`, `color`,
 * `id`, `part`, `week`, `lessonPath`, `href` và thứ tự phần/buổi KHÔNG THỂ lệch giữa hai bản —
 * lệch cấu trúc trở thành chuyện bất khả thi chứ không phải chuyện phải nhớ mà kiểm.
 *
 * Trường `en` ở bản VI mang tên tiếng Anh của buổi. Ở bản EN nó mang tên TIẾNG VIỆT — cặp
 * song ngữ soi gương, để người học hướng nào cũng thấy thuật ngữ bên kia. `check_i18n.py`
 * miễn trừ đúng khóa đó (`keep_vi_keys`).
 */

const PARTS: Record<string, { no: string; title: string; en: string; range: string; testDesc: string }> = {
  foundations: { no: 'PART I', title: 'Foundations & Agents', en: 'Nhập môn & Tác tử', range: 'Weeks 1–2',
    testDesc: '8 questions · Sessions 1–2 · the four approaches to AI, the Turing test, PEAS, agent architectures' },
  searching: { no: 'PART II', title: 'Searching', en: 'Tìm kiếm', range: 'Weeks 3–6',
    testDesc: '8 questions · Sessions 3–6 · uninformed, heuristic, local and adversarial search, plus CSPs' },
  knowledge: { no: 'PART III', title: 'Knowledge & Reasoning', en: 'Biểu diễn tri thức & suy luận', range: 'Weeks 7–9',
    testDesc: '10 questions · Sessions 7–9 · propositional logic, FOL, Bayesian networks' },
  ml: { no: 'PART IV', title: 'Machine Learning', en: 'Học máy', range: 'Weeks 10–11',
    testDesc: '10 questions · Sessions 10–11 · ID3, Naïve Bayes, neural networks' },
};

const SESSIONS: Record<string, { title: string; en: string; hours: string; topics: string; math: string }> = {
  b1: { title: 'Session 1 · Introduction to AI', en: 'Nhập môn AI', hours: '~2h theory',
    topics: 'What AI is (4 approaches: think/act × human/rational) · the Turing test · the history of AI · applications · why the agent view is the one worth learning.',
    math: 'No math needed — just critical thinking. Read up first on: Rational, Agent.' },
  b2: { title: 'Session 2 · Intelligent Agents', en: 'Tác tử thông minh', hours: '~2.5h',
    topics: 'Agent & environment · percept sequence · rationality · the PEAS description · 7 environment dimensions · 5 agent architectures (reflex → learning).',
    math: 'Set · Function / mapping · Cartesian product.' },
  b3: { title: 'Session 3 · Solving Problems by Searching', en: 'Giải bài toán bằng Tìm kiếm', hours: '~6h · 3 parts',
    topics: 'Problem formulation (5 components) · state space · BFS, UCS, DFS, DLS, IDS · heuristics · GBFS, A* · admissible & consistent.',
    math: 'Graph · Tree, branching factor b · Stack / Queue / Priority queue · Big-O · Logarithm.' },
  b4: { title: 'Session 4 · Local Search', en: 'Tìm kiếm cục bộ', hours: '~2.5h',
    topics: 'Optimization problems · the state-space landscape · hill-climbing and its variants · simulated annealing · local beam · genetic algorithms.',
    math: 'Local / global extremum · Gradient — at the intuition level · Probability (basics) · Permutation.' },
  b5: { title: 'Session 5 · Adversarial Search', en: 'Tìm kiếm đối kháng', hours: '~3h',
    topics: 'Game theory · game trees · minimax · α-β pruning · real-time decisions · games of chance (expectiminimax).',
    math: 'Game tree · Expected value · Recursion · min / max reasoning.' },
  b6: { title: 'Session 6 · Constraint Satisfaction Problems', en: 'Bài toán thỏa mãn ràng buộc', hours: '~3h + mid-course self-check',
    topics: 'X / D / C · constraint graph · node & arc consistency (AC-3) · backtracking with MRV, LCV, forward checking · min-conflicts.',
    math: 'Relation · Graph coloring · Backtracking recursion · Domain.' },
  b7: { title: 'Session 7 · Logical Agents · Propositional Logic', en: 'Tác tử logic · Logic mệnh đề', hours: '~4h',
    topics: 'KB agents · the Wumpus world · PL syntax & semantics · entailment · model checking · resolution · forward / backward chaining · DPLL.',
    math: 'Proposition · Truth table · Connectives ∧ ∨ ¬ ⇒ ⇔ · Tautology · Proof by contradiction.' },
  b8: { title: 'Session 8 · First-Order Logic', en: 'Logic bậc nhất', hours: '~4.5h',
    topics: 'Objects / relations / functions · quantifiers ∀ ∃ · writing FOL sentences · unification · forward / backward chaining · resolution.',
    math: 'Predicate · Quantifier ∀ ∃ · Substitution · Set-builder notation.' },
  b9: { title: 'Session 9 · Bayesian Networks', en: 'Mạng Bayes', hours: '~3h',
    topics: 'The full joint distribution · conditional independence · BN structure + CPTs · exact inference by enumeration · building a BN.',
    math: 'Conditional probability · Bayes’ rule · Independence · Marginalization · DAG.' },
  b10: { title: 'Session 10 · Basic Machine Learning · ID3 Decision Trees', en: 'Học máy cơ bản · Cây quyết định ID3', hours: '~4h',
    topics: 'What ML is · kinds of learning · supervised learning · ID3: entropy & information gain · Naïve Bayes · train/test, accuracy.',
    math: 'Entropy · log₂ · Expected value · Conditional probability · Weighted average.' },
  b11: { title: 'Session 11 · Neural Networks', en: 'Mạng nơ-ron', hours: '~3.5h + full review',
    topics: 'Biological → artificial neurons · the perceptron and its learning rule · linear separability · MLPs · backpropagation · activation functions.',
    math: 'Vector & dot product · Matrix multiplication · Derivative & chain rule · Sigmoid · Gradient descent.' },
};

const LABELS: Record<string, string> = {
  'Bài tập': 'Homework', 'Bài tập 1': 'Homework 1', 'Bài tập 2': 'Homework 2',
  'Lab 1': 'Lab 1', 'Lab 2': 'Lab 2', 'Lab 3': 'Lab 3',
};

const CHIPS: Record<string, string> = {
  'LAB 1 · SEARCH': 'LAB 1 · SEARCH',
  'LAB 2 · LOGIC': 'LAB 2 · LOGIC',
  'LAB 3 · DECISION TREE': 'LAB 3 · DECISION TREE',
};

export const csc14003en: Course = {
  ...VI,
  title: 'Foundations of',
  titleAccent: 'Artificial Intelligence',
  subtitle: 'An 11-week self-study roadmap · 4 parts · built on active recall & spaced repetition',
  description:
    'Start from “what even is artificial intelligence” and end up able to implement the search algorithms yourself, write logical inference, and train your first machine-learning model. I wrote these lessons the way I understand them, drawing on the course “Artificial Intelligence Algorithms” (University of Science — Ho Chi Minh City) and CS188 — Introduction to Artificial Intelligence (UC Berkeley).',
  org: 'Self-study notebook · CSC14003',
  parts: VI.parts.map((p) => ({ ...p, ...PARTS[p.id] })),
  sessions: VI.sessions.map((s) => ({
    ...s,
    ...SESSIONS[s.id],
    labChip: s.labChip ? CHIPS[s.labChip] : undefined,
    links: s.links.map((l) => ({ ...l, label: LABELS[l.label] ?? l.label })),
  })),
};

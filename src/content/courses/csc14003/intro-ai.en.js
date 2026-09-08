// Dữ liệu Buổi 1 — bản tiếng Anh. Giữ ĐÚNG thứ tự khóa của intro-ai.js để hai file diff được
// cạnh nhau và check_i18n.py ghép theo vị trí. Mọi id/color/năm là bất biến, không được đổi.

export const QUAD = [
  { id: 'th', col: 0, row: 0, en: 'Systems that think like humans',
    vn: 'Think like humans', tag: 'THINKING HUMANLY', color: '#58C4DD',
    caption: 'GPS (Newell & Simon, 1961) · cognitive science' },
  { id: 'tr', col: 1, row: 0, en: 'Systems that think rationally',
    vn: 'Think rationally', tag: 'THINKING RATIONALLY', color: '#C792EA',
    caption: 'The laws of thought · Aristotle’s syllogisms' },
  { id: 'ah', col: 0, row: 1, en: 'Systems that act like humans',
    vn: 'Act like humans', tag: 'ACTING HUMANLY', color: '#F4D345',
    caption: 'The Turing test (1950) · CAPTCHA' },
  { id: 'ar', col: 1, row: 1, en: 'Systems that act rationally',
    vn: 'Act rationally', tag: 'ACTING RATIONALLY', color: '#83C167',
    caption: 'Rational agents · f: 𝓟 → 𝓐' }
];

export const QUIZ = [
  { q: 'The Turing test: an interrogator types questions and cannot tell whether the written answers come from a person or a machine.',
    a: 'ah', why: 'Turing had no interest in what goes on inside the machine. He asked one thing: can you tell the difference? The machine only has to ACT human enough that you don’t catch it — that’s the whole bar.' },
  { q: 'General Problem Solver — not just solving correctly, but matching its trace of reasoning steps against a person’s trace on the same puzzle.',
    a: 'th', why: 'Getting the right answer wasn’t good enough for Newell & Simon. They compared the route through the head too: the program had to THINK like a person, not just answer like one.' },
  { q: 'An inference system: “All men are mortal. Socrates is a man. Therefore Socrates is mortal.”',
    a: 'tr', why: 'Aristotle’s syllogism: feed in true premises and the conclusion is beyond argument. This is the “laws of thought” box — still opening the lid to watch it think, but measuring against logic rather than against people.' },
  { q: 'An agent picks the action that leads to the best outcome, and under uncertainty, the best expected outcome.',
    a: 'ar', why: 'That is the definition of a rational agent, word for word. Note “expected”: rational doesn’t mean always winning, it means picking the best move given the information in hand.' },
  { q: 'CAPTCHA: making a user prove they’re human before letting them into a website.',
    a: 'ah', why: 'Reverse Turing Test — same test, roles swapped: the machine sets the questions and you have to prove you’re human. Every time you tick “I’m not a robot” you’re sitting it 🤖' },
  { q: 'Cognitive science: pairing AI’s computational models with psychology’s experimental methods to build a precise, testable theory of the human mind.',
    a: 'th', why: 'Its target is describing the HUMAN mind, so it sits squarely in the “think like humans” box. The field has since moved out on its own and no longer shares a house with AI.' },
  { q: 'Pulling your hand off a hot stove — a reflex, with no time to think.',
    a: 'ar', why: 'Here’s where the “rational” box is wider than you’d expect: it takes in actions with no time to think. Pulling your hand off a hot stove is the right thing to do — not one line of reasoning, and still rational.' },
  { q: 'Robinson’s complete algorithm for logical reasoning (1965): from premises in symbolic form, derive every consequence.',
    a: 'tr', why: 'The logicist road: describe the whole world in symbols and let the machine infer formally. Measuring the thinking process, against logic → the think rationally box.' }
];

export const ERAS = [
  { from: 1940, to: 1950, label: '1940–50 · Neuroscience meets computing' },
  { from: 1950, to: 1970, label: '1950–70 · Excitement, led by logic' },
  { from: 1970, to: 1990, label: '1970–90 · The knowledge era' },
  { from: 1990, to: 2010, label: '1990–2010 · The statistical era' },
  { from: 2010, to: 2017, label: '2010–17 · Big Data · GPUs · Deep learning' },
  { from: 2017, to: 2026, label: '2017– · Scaling up, LLMs' }
];

export const WINTERS = [
  { from: 1974, to: 1980, label: 'The first AI winter', note: 'rarely mentioned' },
  { from: 1988, to: 1993, label: 'AI Winter — the expert-systems industry collapses', note: 'the main winter' }
];

export const TIMELINE = [
  { y: 1943, t: 'McCulloch & Pitts: a Boolean-circuit model of the brain' },
  { y: 1950, t: 'Turing: “Computing Machinery and Intelligence”' },
  { y: 1952, t: 'The first AI programs: Samuel’s checkers, Logic Theorist (Newell & Simon), Geometry Engine (Gelernter)' },
  { y: 1956, t: 'The Dartmouth conference settles on the name “Artificial Intelligence”' },
  { y: 1961, t: 'General Problem Solver (Newell & Simon)' },
  { y: 1965, t: 'Robinson: a complete algorithm for logical reasoning' },
  { y: 1972, t: 'The knowledge-based systems era begins (1969–79)' },
  { y: 1984, t: 'The expert-systems industry booms (1980–88)' },
  { y: 1990, t: 'Probability returns, with a focus on uncertainty' },
  { y: 1992, t: 'TD-Gammon reaches human level' },
  { y: 1996, t: 'Kasparov beats Deep Blue' },
  { y: 1997, t: 'Deep Blue beats Kasparov' },
  { y: 2002, t: 'Embodied AI: the Roomba vacuum cleaner' },
  { y: 2011, t: 'Apple launches SIRI' },
  { y: 2012, t: 'AlexNet wins the ImageNet competition' },
  { y: 2015, t: 'DeepMind reaches human-level control on Atari games' },
  { y: 2016, t: 'AlphaGo beats Lee Sedol · Google Translate moves to neural networks' },
  { y: 2017, t: 'Google invents the Transformer architecture · DeepStack and Libratus beat humans at poker' },
  { y: 2019, t: 'AlphaFold predicts protein structure from amino acid sequence (2018–2020)' },
  { y: 2022, t: 'Text-to-image generation (2021–22) · OpenAI releases ChatGPT' },
  { y: 2023, t: 'GPT-4 · large language models arrive in everyday tools' },
  { y: 2024, t: 'Nobel Prize in Physics to Hopfield and Hinton · Nobel Prize in Chemistry to AlphaFold' },
  { y: 2025, t: 'AI agents go mainstream: models call tools themselves, running many steps to finish one job' }
];

export const FIELDS = [
  ['Philosophy', 'Triết học', 'Logic, methods of reasoning, mind as a physical system, the foundations of learning, language and rationality.'],
  ['Mathematics', 'Toán học', 'Formal representation and proof, algorithms, computation, (un)decidability, (in)tractability, probability.'],
  ['Economics', 'Kinh tế học', 'Utility, decision theory, the rational economic agent.'],
  ['Neuroscience', 'Thần kinh học', 'The neuron as a unit of information processing.'],
  ['Psychology / Cognitive Science', 'Tâm lý · Khoa học tri nhận', 'How people act, perceive, process information and represent knowledge.'],
  ['Computer Engineering', 'Kỹ thuật máy tính', 'Building fast computers.'],
  ['Control Theory', 'Lý thuyết điều khiển', 'Designing systems that maximize an objective function over time.'],
  ['Linguistics', 'Ngôn ngữ học', 'Knowledge representation, grammar.']
];

export const CANDO = [
  'Play a decent game of table tennis?',
  'Play a decent game of Jeopardy?',
  'Drive safely along a winding mountain road?',
  'Drive safely down a busy street in the city center?',
  'Buy a week of groceries on the web?',
  'Buy a week of groceries in a real supermarket?',
  'Discover and prove a new mathematical theorem?',
  'Hold a successful conversation with a person for an hour?',
  'Perform a surgical operation?',
  'Translate spoken Chinese into spoken English in real time?',
  'Fold the laundry and clear the dishes?',
  'Write a story that is deliberately funny?',
  'Write working code from a description in plain words?',
  'Make a short video from a single sentence of description?',
  'Faithfully summarize a 300-page document it has never seen?',
  'Break a multi-step job into pieces and call tools for each one, unprompted?'
];

export const TOPICS = [
  { t: 'Search (games included)', n: 'Sessions 3–6', c: '#58C4DD', d: 'The most foundational of the lot. Every possible answer, every decision, every sequence of actions — pack them all into one abstract space and go looking inside it. Searching blind (uninformed) or searching with a compass (informed): in Session 3 you implement all seven yourself.' },
  { t: 'Knowledge representation and reasoning', n: 'Sessions 7–9', c: '#C792EA', d: 'To act correctly you first have to describe the state of the world, then infer the parts you cannot see. What to describe it with, how to keep the description compact, how to pull out the exact piece of knowledge you need — and what to do when that knowledge is itself uncertain.' },
  { t: 'Machine learning', n: 'Sessions 10–11', c: '#83C167', d: 'Here the agent stops living off the code you wrote: it changes its own behavior from experience. Deriving new facts from old, forming its own concepts, learning to tell apart situations it has never met.' },
  { t: 'Planning · Natural language processing · Expert systems · Interacting with the environment (vision, speech recognition, robotics)…', n: 'outside this course', c: '#7A8399', d: 'One semester cannot hold all of it. The good news: once the four parts above are done, you can read these branches on your own, no guide needed.' }
];

export const CHECKS = [
  'State the difference between “understanding intelligence” and “building intelligent entities” — and why AI takes on both.',
  'Redraw the 2×2 table of the four approaches from memory, with both axes right: human/rational and thinking/acting.',
  'Describe the Turing test, its two variants (reverse, total), and one reason researchers rarely pursue it.',
  'Tell “the laws of thought” apart from “rational agents”, and give two reasons the rational agent view is more general.',
  'Someone describes an unfamiliar system and you place it in the right one of the 4 boxes — score ≥ 6/8 in the interactive box in section 05.',
  'Recite the milestones: 1943, 1950, 1956, 1997, 2012, 2016, 2017, 2022 and the AI Winter of 1988–93.',
  'Name 4 foundational fields and what each contributed to AI.',
  'Finish the four PEAS questions in section 10 of Session 2: two PEAS descriptions and two environment analyses, with a justification for every dimension.'
];

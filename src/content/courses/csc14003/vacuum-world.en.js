// Thế giới hút bụi — bản tiếng Anh. CHỈ phần DATA; engine (runVacuum, compareFinal) dùng
// chung một bản duy nhất vì nó không còn chứa chữ hiển thị nào: lời kể đã ra bundle của bài
// (`T.note`), tên chương trình do UI tra từ PROGRAMS. Hai bản logic là hai bản để trôi khỏi nhau.
export { runVacuum, compareFinal } from './vacuum-world.js';

export const STEPS = 20;

export const WORLDS = [
  { id: 'w2', label: '2 squares', cells: ['A', 'B'] },
  { id: 'w4', label: '4 squares', cells: ['A', 'B', 'C', 'D'] },
];

export const PRESETS = [
  { id: 'dirty-all', label: 'All dirty' },
  { id: 'dirty-half', label: 'Half dirty' },
  { id: 'clean', label: 'Already spotless' },
];

export const PROGRAMS = [
  {
    id: 'reflex',
    name: 'Pure reflex',
    en: 'REFLEX-VACUUM-AGENT',
    blurb: 'Four lines, no more. Remembers nothing: it does whatever it sees.',
  },
  {
    id: 'memo',
    name: 'Reflex + memory',
    en: 'có internal state',
    blurb: 'Identical to the one above, plus a notebook recording which squares it has seen clean. Once it knows the whole floor is clean, it rests.',
  },
];

export const MEASURES = [
  { id: 'clean', label: 'A · Clean floor', note: 'each step, each clean square scores 1 point' },
  { id: 'clean_move', label: 'B · Clean floor, moving costs fuel', note: 'like A, but each move costs 1 point' },
  { id: 'dirt', label: 'C · Dirt collected', note: 'each suck on a dirty square scores 1 point' },
];

export type Board = number[];
export type Algorithm = 'steepest' | 'first' | 'sideways' | 'restart';
export type Action = 'start' | 'improve' | 'sideways' | 'restart' | 'stuck' | 'goal' | 'limit';
export interface QueenStep { board: Board; h: number; action: Action; run: number; evaluated: number }

// Rows are 1-based, columns are array positions. Every unordered pair counts once,
// including attacks through another queen (the optimization objective, not legal play).
export function attackingPairs(board: Board): [number, number][] {
  const pairs: [number, number][] = [];
  for (let a = 0; a < board.length; a++) for (let b = a + 1; b < board.length; b++) {
    if (board[a] === board[b] || Math.abs(board[a] - board[b]) === b - a) pairs.push([a, b]);
  }
  return pairs;
}
export const conflicts = (board: Board) => attackingPairs(board).length;
export const fitness = (board: Board) => board.length * (board.length - 1) / 2 - conflicts(board);
export function neighbors(board: Board): Board[] {
  return board.flatMap((row, col) => Array.from({ length: board.length }, (_, i) => i + 1)
    .filter(r => r !== row).map(r => board.map((v, c) => c === col ? r : v)));
}
export function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296; };
}
export function queenTrace(initial: Board, algorithm: Algorithm, seed = 42): QueenStep[] {
  const rng = seededRandom(seed);
  let board = [...initial], run = 1, sideways = 0, evaluated = 0;
  const trace: QueenStep[] = [];
  const save = (action: Action) => trace.push({ board: [...board], h: conflicts(board), action, run, evaluated });
  save('start');
  // Bounded educational run: 30 starts, 240 accepted moves/restarts, 20 sideways
  // moves per plateau. Termination is reported, never mislabeled as a proof of failure.
  for (let step = 0; step < 240; step++) {
    const current = conflicts(board);
    if (current === 0) { save('goal'); return trace; }
    const candidates = neighbors(board);
    let next: Board | undefined;
    if (algorithm === 'first') {
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      for (const candidate of candidates) {
        evaluated++;
        if (conflicts(candidate) < current) { next = candidate; break; }
      }
    } else {
      const scored = candidates.map(b => ({ board: b, h: conflicts(b) }));
      evaluated += scored.length;
      const best = Math.min(...scored.map(b => b.h));
      if (best < current || (algorithm === 'sideways' && best === current && sideways < 20)) {
        const tied = scored.filter(b => b.h === best);
        next = tied[Math.floor(rng() * tied.length)].board;
      }
    }
    if (next) {
      const equal = conflicts(next) === current;
      sideways = equal ? sideways + 1 : 0;
      board = next; save(equal ? 'sideways' : 'improve');
    } else if (algorithm === 'restart' && run < 30) {
      board = board.map(() => 1 + Math.floor(rng() * board.length));
      run++; sideways = 0; save('restart');
    } else { save(algorithm === 'restart' ? 'limit' : 'stuck'); return trace; }
  }
  save(conflicts(board) === 0 ? 'goal' : 'limit');
  return trace;
}
export function acceptance(deltaCost: number, temperature: number) {
  if (deltaCost <= 0) return 1;
  return temperature > 0 ? Math.exp(-deltaCost / temperature) : 0;
}
export function selectionProbabilities(population: Board[]) {
  const scores = population.map(fitness), sum = scores.reduce((a, b) => a + b, 0);
  return scores.map(score => sum ? score / sum : 1 / scores.length);
}
export function crossover(a: Board, b: Board, cut: number): Board {
  return [...a.slice(0, cut), ...b.slice(cut)];
}
export function mutate(board: Board, column: number, row: number): Board {
  return board.map((r, c) => c === column ? row : r);
}
export const LANDSCAPE = [1, 3, 6, 8, 7, 5, 4, 6, 9, 12, 11, 8];
// Explicit illustrative paths, not sampled performance of an optimizer.
export const LANDSCAPE_PATHS = [[0, 1, 2, 3, 3, 3], [0, 1, 2, 3, 7, 8, 9, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9]];
export const BEAM_POOL = [{ parent: 'A', value: 9 }, { parent: 'A', value: 8 }, { parent: 'A', value: 7 }, { parent: 'B', value: 6 }, { parent: 'B', value: 5 }, { parent: 'B', value: 4 }];
export const GA_POPULATION = ['2341', '2132', '1232', '4321'].map(s => [...s].map(Number));
export const GA_PARENTS = ['32752411', '24748552'].map(s => [...s].map(Number));

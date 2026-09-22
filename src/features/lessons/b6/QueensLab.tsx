import { useMemo, useState, type CSSProperties } from 'react';
import { attackingPairs, conflicts, neighbors, queenTrace, type Algorithm, type Board } from './local-search-engine';
import { Choices, keepLabTouch } from './LocalSearchVisuals';
import { T } from './lesson06.text';

const PRESETS = ['1214', '1111', '56745676', '83742516'].map(s => [...s].map(Number));
const ALGORITHMS: Algorithm[] = ['steepest', 'first', 'sideways', 'restart'];
export function QueensLab() {
  const [preset, setPreset] = useState(0), [algorithm, setAlgorithm] = useState(0);
  const [initial, setInitial] = useState<Board>(PRESETS[0]), [seed, setSeed] = useState(3), [step, setStep] = useState(0);
  const trace = useMemo(() => queenTrace(initial, ALGORITHMS[algorithm], seed), [initial, algorithm, seed]);
  const frame = trace[Math.min(step, trace.length - 1)], board = frame.board, n = board.length;
  const pairs = attackingPairs(board), best = Math.min(...neighbors(board).map(conflicts));
  function changeBoard(next: Board) { setInitial(next); setStep(0); }
  return <div className="card ls-queens" data-testid="queens-lab" onTouchStart={keepLabTouch} onTouchEnd={keepLabTouch}>
    <Choices label={T.lab.presetLabel} options={T.lab.presets} value={preset} onChange={i => { setPreset(i); changeBoard(PRESETS[i]); }} />
    <Choices label={T.lab.algorithmLabel} options={T.lab.algorithms} value={algorithm} onChange={i => { setAlgorithm(i); setStep(0); }} />
    <p className="ls-note">{T.lab.help}</p>
    <div className="ls-lab-grid">
      <div className="ls-board-scroll">
        <div className="ls-board" role="group" aria-label={T.lab.board} style={{ '--queen-count': n } as CSSProperties}>
          {Array.from({ length: n * n }, (_, index) => {
            const row = Math.floor(index / n) + 1, col = index % n;
            const queen = board[col] === row;
            const next = board.map((v, i) => i === col ? row : v), h = conflicts(next);
            const attacking = queen && pairs.some(p => p.includes(col));
            return <button type="button" key={index} className={`ls-square ${(row + col) % 2 ? 'ls-square-alt' : ''} ${!queen && h === best ? 'ls-best-move' : ''} ${attacking ? 'ls-attacking' : ''}`}
              aria-label={`${T.lab.column} ${col + 1}, ${T.lab.row} ${row}, ${T.lab.costAfter} ${h}`}
              aria-pressed={queen} onClick={() => changeBoard(next)}>
              {queen ? <span className="ls-queen" aria-hidden="true">♛</span> : <span>{h}</span>}
            </button>;
          })}
        </div>
      </div>
      <div className="ls-lab-readout">
        <div className="kicker">{T.lab.state}</div><div className="ls-board-string mono">{board.join(' ')}</div>
        <div className={`ls-h ${frame.h === 0 ? 'ls-solved' : ''}`}>h = {frame.h}</div>
        <p className="ls-status" role="status">{T.lab.status[frame.action]}</p>
        <dl className="ls-facts"><div><dt>{T.lab.step}</dt><dd>{step} / {trace.length - 1}</dd></div><div><dt>{T.lab.run}</dt><dd>{frame.run}</dd></div><div><dt>{T.lab.evaluated}</dt><dd>{frame.evaluated}</dd></div><div><dt>{T.lab.seed}</dt><dd>{seed}</dd></div></dl>
        <div className="ls-choices">
          <button className="btn" type="button" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>{T.lab.previous}</button>
          <button className="btn btn--primary" type="button" disabled={step === trace.length - 1} onClick={() => setStep(s => Math.min(trace.length - 1, s + 1))}>{T.lab.next}</button>
          <button className="btn" type="button" onClick={() => setStep(0)}>{T.lab.reset}</button>
          <button className="btn" type="button" onClick={() => { setSeed(s => s + 1); setStep(0); }}>{T.lab.reseed}</button>
        </div>
      </div>
    </div>
    <p className="ls-note"><strong>{T.lab.attacks}: </strong>{pairs.length ? pairs.map(([a, b]) => `(${a + 1}, ${b + 1})`).join(' · ') : T.lab.noAttacks}</p>
    <p className="ls-note">{T.lab.budget}</p>
  </div>;
}

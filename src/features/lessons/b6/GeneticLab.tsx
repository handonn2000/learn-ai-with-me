import { useMemo, useState } from 'react';
import { Html } from '@/components/Html';
import { conflicts, crossover, fitness, GA_PARENTS, GA_POPULATION, mutate, selectionProbabilities, type Board } from './local-search-engine';
import { T } from './lesson06.text';
import { keepLabTouch } from './LocalSearchVisuals';

export function GeneticLab() {
  const [reveal, setReveal] = useState(false), [cut, setCut] = useState(3);
  const [column, setColumn] = useState(6), [row, setRow] = useState(1), [mutation, setMutation] = useState<{ col: number; row: number } | null>(null);
  const child = useMemo(() => crossover(GA_PARENTS[0], GA_PARENTS[1], cut), [cut]);
  const result = mutation ? mutate(child, mutation.col, mutation.row) : child;
  const probabilities = selectionProbabilities(GA_POPULATION);
  function genes(board: Board, kind: 'A' | 'B' | 'child' | 'mutated') {
    return <div className="ls-chromosome">{board.map((gene, i) => {
      const origin = kind === 'A' || kind === 'B' ? kind : kind === 'mutated' && child[i] !== result[i] ? 'M' : i < cut ? 'A' : 'B';
      return <div key={i} className={`ls-gene ls-gene-${origin} ${i === cut - 1 ? 'ls-cut' : ''}`}><small>{origin}</small><strong>{gene}</strong></div>;
    })}</div>;
  }
  return <div className="card ls-genetic" data-testid="genetic-lab" onTouchStart={keepLabTouch} onTouchEnd={keepLabTouch}>
    <div className="kicker">{T.genetic.title}</div>
    <h3>{T.genetic.population}</h3>
    <button className="btn" type="button" aria-expanded={reveal} onClick={() => setReveal(v => !v)}>{reveal ? T.genetic.hide : T.genetic.reveal}</button>
    <div className="ls-table-scroll"><table className="dtable"><thead><tr><th>{T.genetic.individual}</th><th>h</th><th>{T.genetic.score}</th><th>{T.genetic.chance}</th></tr></thead><tbody>
      {GA_POPULATION.map((b, i) => <tr key={i}><td className="mono">{b.join('')}</td><td>{reveal ? conflicts(b) : '—'}</td><td>{reveal ? fitness(b) : '—'}</td><td>{reveal ? `${(probabilities[i] * 100).toFixed(2)}%` : '—'}</td></tr>)}
    </tbody></table></div>
    {reveal && <><div className="ls-roulette" aria-label={T.genetic.chance}>{probabilities.map((p, i) => p > 0 ? <div key={i} style={{ flex: p }} className={`ls-roulette-${i}`}>{GA_POPULATION[i].join('')}</div> : null)}</div><p className="ls-prose">{T.genetic.answer}</p></>}
    <div className="ls-cross-workshop">
      <label className="ls-slider">{T.genetic.cut}: <strong>{cut}</strong><input type="range" min="1" max="7" value={cut} onChange={e => { setCut(Number(e.target.value)); setMutation(null); }} /></label>
      {GA_PARENTS.map((b, i) => <div className="ls-gene-row" key={i}><span>{i === 0 ? T.genetic.parentA : T.genetic.parentB}</span>{genes(b, i === 0 ? 'A' : 'B')}<span className="mono">h={conflicts(b)} · fit={fitness(b)}</span></div>)}
      <div className="ls-gene-row"><span>{T.genetic.child}</span>{genes(child, 'child')}<span className="mono">h={conflicts(child)} · fit={fitness(child)}</span></div>
      <div className="ls-controls ls-controls-row">
        <label>{T.genetic.column}<select value={column} onChange={e => setColumn(Number(e.target.value))}>{Array.from({ length: 8 }, (_, i) => <option value={i} key={i}>{i + 1}</option>)}</select></label>
        <label>{T.genetic.row}<select value={row} onChange={e => setRow(Number(e.target.value))}>{Array.from({ length: 8 }, (_, i) => <option value={i + 1} key={i}>{i + 1}</option>)}</select></label>
        <button className="btn btn--primary" type="button" onClick={() => setMutation({ col: column, row })}>{T.genetic.apply}</button>
        <button className="btn" type="button" disabled={!mutation} onClick={() => setMutation(null)}>{T.genetic.reset}</button>
      </div>
      {mutation && <div className="ls-gene-row"><span>{T.genetic.mutated}</span>{genes(result, 'mutated')}<span className="mono">h={conflicts(result)} · fit={fitness(result)}</span></div>}
    </div><Html as="p" className="ls-note" t={T.genetic.note} />
  </div>;
}

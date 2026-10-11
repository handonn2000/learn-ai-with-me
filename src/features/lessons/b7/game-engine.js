/** A tiny finite game model, shared by the explanatory loop and active experiment. */
export function analyzeGame(scores = [3, 5, 0, 7], rootMax = true, reverse = false, pruning = false) {
  if (scores.length !== 4 || !scores.every(Number.isFinite)) throw new Error('Four finite leaf scores required');
  const children = { r: reverse ? ['B', 'A'] : ['A', 'B'], A: ['a1', 'a2'], B: ['b1', 'b2'] };
  const leaves = Object.fromEntries(['a1', 'a2', 'b1', 'b2'].map((id, i) => [id, scores[i]]));
  /** @type {Record<string, number>} */ const values = {};
  /** @type {Record<string, boolean>} */ const exact = {};
  /** @type {Record<string, {alpha:number,beta:number}>} */ const bounds = {};
  /** @type {string[]} */ const read = [], skipped = [];
  /** @type {{kind:string,id:string,score:number|null,values:Record<string,number>,exact:Record<string,boolean>,bounds:Record<string,{alpha:number,beta:number}>,read:string[],skipped:string[],chosen:string}[]} */ const trace = [];
  let chosen = '';
  const record = (kind, id, score = null) => trace.push({ kind, id, score, values: { ...values }, exact: { ...exact }, bounds: { ...bounds }, read: [...read], skipped: [...skipped], chosen });
  record('start', 'r');
  function descend(id, maximizing, alpha, beta) {
    bounds[id] = { alpha, beta };
    if (id in leaves) {
      read.push(id); values[id] = leaves[id]; exact[id] = true;
      record('leaf', id, leaves[id]);
      return leaves[id];
    }
    let value = maximizing ? -Infinity : Infinity;
    exact[id] = true;
    const successors = children[id];
    for (let i = 0; i < successors.length; i++) {
      const child = successors[i];
      const score = descend(child, !maximizing, alpha, beta);
      const improves = maximizing ? score > value : score < value;
      if (improves && id === 'r') chosen = child;
      value = maximizing ? Math.max(value, score) : Math.min(value, score);
      if (maximizing) alpha = Math.max(alpha, value); else beta = Math.min(beta, value);
      bounds[id] = { alpha, beta };
      const remaining = successors.slice(i + 1);
      if (pruning && alpha >= beta && remaining.length) {
        skipped.push(...remaining); values[id] = value; exact[id] = false;
        record('cut', id, value);
        return value;
      }
    }
    values[id] = value;
    record(id === 'r' ? 'done' : 'backup', id, value);
    return value;
  }
  const value = descend('r', rootMax, -Infinity, Infinity);
  return { value, chosen, read, skipped, trace };
}

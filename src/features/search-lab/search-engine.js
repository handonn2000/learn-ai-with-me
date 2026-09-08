// Bí danh MSG: các hàm thuật toán trong file này đã dùng `N` làm SỐ ĐỈNH
// (`const N = m.length`). Trùng tên là N thành một con số, và `MSG.n3(...)` nổ lúc
// CHẠY chứ không lúc build — file .js này không được tsc kiểm (checkJs: false).
import { N as MSG } from './narrate';
// search-engine.js — trace engine cho Manim Lab (Buổi 3, CSC14003)
function mat(n, edges) { const m = Array.from({ length: n }, () => Array(n).fill(0)); for (const [a, b, w] of edges) { m[a][b] = w; m[b][a] = w; } return m; }

export const PRESETS = {
  lab: {
    key: 'lab', name: MSG.n1, src: 0, dst: 5, labelIn: true,
    labels: ['0', '1', '2', '3', '4', '5'],
    pos: [[.06, .5], [.31, .14], [.31, .86], [.67, .14], [.67, .86], [.94, .5]],
    m: mat(6, [[0, 1, 2], [0, 2, 3], [1, 3, 3], [1, 4, 4], [2, 4, 2], [3, 5, 4], [4, 5, 3]]),
    h: [6, 4, 4, 3, 2, 0]
  },
  romania: {
    key: 'romania', name: 'Romania — Arad → București', src: 0, dst: 9, labelIn: false,
    labels: ['Arad', 'Zerind', 'Oradea', 'Timișoara', 'Sibiu', 'Făgăraș', 'Râmnicu V.', 'Pitești', 'Craiova', 'București'],
    pos: [[.08, .30], [.14, .09], [.33, .04], [.06, .64], [.40, .37], [.64, .24], [.50, .57], [.70, .68], [.48, .92], [.91, .76]],
    m: mat(10, [[0, 1, 75], [0, 4, 140], [0, 3, 118], [1, 2, 71], [2, 4, 151], [4, 5, 99], [4, 6, 80], [5, 9, 211], [6, 7, 97], [6, 8, 146], [7, 9, 101], [7, 8, 138]]),
    h: [366, 374, 380, 329, 253, 176, 193, 100, 160, 0]
  }
};

export const ALGO_META = [
  { id: 'BFS', tag: 'FIFO', informed: false },
  { id: 'DFS', tag: 'LIFO', informed: false },
  { id: 'UCS', tag: 'g(n)', informed: false },
  { id: 'IDS', tag: 'ℓ=0,1,2…', informed: false },
  { id: 'GBFS', tag: 'h(n)', informed: true },
  { id: 'ASTAR', tag: 'f=g+h', informed: true },
  { id: 'HC', tag: MSG.n2, informed: true }
];

const ek = (a, b) => a < b ? a + '-' + b : b + '-' + a;
function T(P) {
  const steps = []; const L = i => P.labels[i];
  return {
    steps, L,
    push(o) {
      steps.push({
        a: o.a, cur: o.cur ?? null, edge: o.edge || null, txt: o.txt || '', limit: o.limit ?? null,
        path: o.path || null, cost: o.cost ?? null,
        fr: (o.fr || []).map(x => ({ n: x.n, k: x.k == null ? '' : '' + x.k })),
        ex: [...(o.ex || [])], lit: [...(o.lit || [])]
      });
    }
  };
}
function build(par, dst) { const p = [dst]; while (par[p[p.length - 1]] != null) p.push(par[p[p.length - 1]]); return p.reverse(); }
function pcost(m, path) { let c = 0; for (let i = 1; i < path.length; i++) c += m[path[i - 1]][path[i]]; return c; }
function goalStep(t, P, par, via, fr, ex, lit, pre) {
  const path = build(par, P.dst), c = pcost(P.m, path);
  t.push({ a: 'goal', cur: P.dst, edge: via, fr, ex, lit, path, cost: c, txt: (pre || '') + MSG.n40(path.map(t.L).join(' → '), c) });
}

function bfs(P) {
  const t = T(P), { m, src, dst } = P, N = m.length;
  const par = { [src]: null }, dep = { [src]: 0 }, Q = [src], fr = [{ n: src, k: 'd=0' }], ex = [], lit = [];
  t.push({ a: 'start', cur: src, fr, ex, lit, txt: MSG.n3(t.L(src)) });
  if (src === dst) { goalStep(t, P, par, null, fr, ex, lit, MSG.n39); return t.steps; }
  while (Q.length) {
    const u = Q.shift(); fr.splice(fr.findIndex(x => x.n === u), 1); ex.push(u);
    t.push({ a: 'expand', cur: u, fr, ex, lit, txt: MSG.n4(t.L(u)) });
    for (let v = 0; v < N; v++) if (m[u][v] > 0 && !(v in par)) {
      par[v] = u; dep[v] = dep[u] + 1; lit.push(ek(u, v));
      if (v === dst) { goalStep(t, P, par, [u, v], fr, ex, lit, MSG.n38(t.L(v))); return t.steps; }
      Q.push(v); fr.push({ n: v, k: 'd=' + dep[v] });
      t.push({ a: 'gen', cur: u, edge: [u, v], fr, ex, lit, txt: MSG.n5(t.L(v)) });
    }
  }
  t.push({ a: 'fail', fr, ex, lit, txt: MSG.n6 });
  return t.steps;
}

function dfs(P) {
  const t = T(P), { m, src, dst } = P, N = m.length;
  const par = { [src]: null }, S = [src], fr = [{ n: src, k: '' }], ex = [], lit = [];
  t.push({ a: 'start', cur: src, fr, ex, lit, txt: MSG.n7(t.L(src)) });
  if (src === dst) { goalStep(t, P, par, null, fr, ex, lit, MSG.n37); return t.steps; }
  while (S.length) {
    const u = S.pop(); fr.splice(fr.findIndex(x => x.n === u), 1); ex.push(u);
    t.push({ a: 'expand', cur: u, fr, ex, lit, txt: MSG.n8(t.L(u)) });
    for (let v = N - 1; v >= 0; v--) if (m[u][v] > 0 && !(v in par)) {
      par[v] = u; lit.push(ek(u, v));
      if (v === dst) { goalStep(t, P, par, [u, v], fr, ex, lit, MSG.n36(t.L(v))); return t.steps; }
      S.push(v); fr.push({ n: v, k: '' });
      t.push({ a: 'gen', cur: u, edge: [u, v], fr, ex, lit, txt: MSG.n9(t.L(v)) });
    }
  }
  t.push({ a: 'fail', fr, ex, lit, txt: MSG.n10 });
  return t.steps;
}

function best(P, mode) {
  const t = T(P), { m, src, dst, h } = P, N = m.length, A = mode === 'astar';
  const par = { [src]: null }, g = { [src]: 0 }, fr = [{ n: src }], ex = [], lit = [];
  const key = n => A ? g[n] + h[n] : g[n];
  const snap = () => fr.slice().sort((a, b) => key(a.n) - key(b.n) || a.n - b.n).map(x => ({ n: x.n, k: (A ? 'f=' : 'g=') + key(x.n) }));
  t.push({ a: 'start', cur: src, fr: snap(), ex, lit, txt: A ? MSG.n35 : MSG.n34 });
  while (fr.length) {
    fr.sort((a, b) => key(a.n) - key(b.n) || a.n - b.n); const u = fr.shift().n;
    if (u === dst) { goalStep(t, P, par, null, snap(), ex, lit, A ? MSG.n33(t.L(u), g[u]) : MSG.n32(t.L(u), g[u], g[u])); return t.steps; }
    ex.push(u);
    t.push({ a: 'expand', cur: u, fr: snap(), ex, lit, txt: A ? MSG.n31(t.L(u), g[u], h[u], g[u] + h[u]) : MSG.n30(t.L(u), g[u]) });
    for (let v = 0; v < N; v++) {
      const w = m[u][v];
      if (w > 0 && !ex.includes(v)) {
        const ng = g[u] + w;
        if (ng < (v in g ? g[v] : Infinity)) {
          const had = v in g;
          if (had) { const i = lit.indexOf(ek(par[v], v)); if (i >= 0) lit.splice(i, 1); }
          g[v] = ng; par[v] = u; lit.push(ek(u, v));
          if (had) t.push({ a: 'update', cur: u, edge: [u, v], fr: snap(), ex, lit, txt: MSG.n11(t.L(v), ng, t.L(u)) });
          else { fr.push({ n: v }); t.push({ a: 'gen', cur: u, edge: [u, v], fr: snap(), ex, lit, txt: A ? MSG.n42(t.L(v), ng, h[v], ng + h[v]) : MSG.n29(t.L(v), ng) }); }
        }
      }
    }
  }
  t.push({ a: 'fail', fr: [], ex, lit, txt: MSG.n12 });
  return t.steps;
}

function ids(P) {
  const t = T(P), { m, src, dst } = P, N = m.length;
  for (let lim = 0; lim < N; lim++) {
    t.push({ a: 'deepen', limit: lim, fr: [], ex: [], lit: [], txt: MSG.n13(lim + 1, lim) });
    const par = { [src]: null }, branch = [src], ex = [], lit = [];
    const frS = () => branch.map((b, i) => ({ n: b, k: 'd=' + i }));
    let found = false;
    const rec = (u, d) => {
      if (u === dst) { goalStep(t, P, par, null, frS(), ex, lit, MSG.n28(t.L(u), d, lim)); found = true; return; }
      t.push({ a: 'expand', cur: u, limit: lim, fr: frS(), ex, lit, txt: d === 0 ? MSG.n27(t.L(u), lim) : MSG.n26(t.L(u), d, lim) });
      if (d === lim) { t.push({ a: 'cutoff', cur: u, limit: lim, fr: frS(), ex, lit, txt: MSG.n14(t.L(u), lim) }); return; }
      for (let v = 0; v < N && !found; v++) if (m[u][v] > 0 && !(v in par)) {
        par[v] = u; branch.push(v); lit.push(ek(u, v));
        rec(v, d + 1);
        if (found) return;
        branch.pop(); delete par[v]; ex.push(v); const i = lit.indexOf(ek(u, v)); if (i >= 0) lit.splice(i, 1);
      }
    };
    rec(src, 0);
    if (found) return t.steps;
  }
  t.push({ a: 'fail', fr: [], ex: [], lit: [], txt: MSG.n15 });
  return t.steps;
}

function gbfs(P) {
  const t = T(P), { m, src, dst, h } = P, N = m.length;
  const par = { [src]: null }, fr = [{ n: src, key: h[src] }], ex = [], lit = [];
  const snap = () => fr.slice().sort((a, b) => a.key - b.key || a.n - b.n).map(x => ({ n: x.n, k: 'h=' + x.key }));
  t.push({ a: 'start', cur: src, fr: snap(), ex, lit, txt: MSG.n16 });
  if (src === dst) { goalStep(t, P, par, null, snap(), ex, lit, MSG.n25); return t.steps; }
  while (fr.length) {
    fr.sort((a, b) => a.key - b.key || a.n - b.n); const { n: u, key: hu } = fr.shift(); ex.push(u);
    t.push({ a: 'expand', cur: u, fr: snap(), ex, lit, txt: MSG.n17(t.L(u), hu) });
    for (let v = 0; v < N; v++) if (m[u][v] > 0 && !(v in par)) {
      par[v] = u; lit.push(ek(u, v));
      if (v === dst) { goalStep(t, P, par, [u, v], fr, ex, lit, MSG.n24(t.L(v))); return t.steps; }
      fr.push({ n: v, key: h[v] });
      t.push({ a: 'gen', cur: u, edge: [u, v], fr: snap(), ex, lit, txt: MSG.n41(t.L(v), h[v]) });
    }
  }
  t.push({ a: 'fail', fr: [], ex, lit, txt: MSG.n18 });
  return t.steps;
}

function hc(P) {
  const t = T(P), { m, src, dst, h } = P, N = m.length;
  const par = { [src]: null }, lit = [], trail = []; let u = src;
  t.push({ a: 'start', cur: src, fr: [], ex: trail, lit, txt: MSG.n19(t.L(src), h[src]) });
  if (u === dst) { goalStep(t, P, par, null, [], trail, lit, MSG.n23); return t.steps; }
  for (let guard = 0; guard < N + 2; guard++) {
    let b = -1;
    for (let v = 0; v < N; v++) if (m[u][v] > 0 && h[v] < h[u]) { b = v; break; }
    if (b < 0) { t.push({ a: 'stuck', cur: u, fr: [], ex: trail, lit, txt: MSG.n20(h[u], t.L(u)) }); return t.steps; }
    par[b] = u; lit.push(ek(u, b)); trail.push(u);
    if (b === dst) { goalStep(t, P, par, [u, b], [], trail, lit, MSG.n22(h[u], h[b], t.L(b))); return t.steps; }
    t.push({ a: 'move', cur: b, edge: [u, b], fr: [], ex: trail, lit, txt: MSG.n21(t.L(b), h[b], h[u]) });
    u = b;
  }
  return t.steps;
}

export function runTrace(id, P) {
  return { BFS: bfs, DFS: dfs, UCS: p => best(p, 'ucs'), ASTAR: p => best(p, 'astar'), IDS: ids, GBFS: gbfs, HC: hc }[id](P);
}

const KWS = new Set(['def', 'return', 'while', 'for', 'if', 'elif', 'else', 'in', 'not', 'and', 'or', 'del', 'import', 'from', 'None', 'True', 'False', 'function', 'returns', 'loop', 'then', 'each', 'to', 'do', 'break', 'continue', 'with', 'as', 'lambda']);
export function tokenize(src) {
  const out = []; const re = /(#[^\n]*|▷[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b|←|∅|∉|∈|≠|≥|≤|∪|∞|→)/g;
  let last = 0, mm;
  while ((mm = re.exec(src))) {
    if (mm.index > last) out.push({ c: 'pl', s: src.slice(last, mm.index) });
    const s = mm[0]; let c = 'pl';
    if (s[0] === '#' || s[0] === '▷') c = 'cm';
    else if (s[0] === '"' || s[0] === "'") c = 'st';
    else if (/^\d/.test(s)) c = 'nu';
    else if (/^[←∅∉∈≠≥≤∪∞→]$/.test(s)) c = 'sy';
    else if (KWS.has(s)) c = 'kw';
    else { let j = mm.index + s.length; while (src[j] === ' ') j++; if (src[j] === '(') c = 'fn'; }
    out.push({ c, s }); last = mm.index + s.length;
  }
  if (last < src.length) out.push({ c: 'pl', s: src.slice(last) });
  return out;
}

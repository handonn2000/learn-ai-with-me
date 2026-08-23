// search-engine.js — trace engine cho Manim Lab (Buổi 3, CSC14003)
function mat(n, edges) { const m = Array.from({ length: n }, () => Array(n).fill(0)); for (const [a, b, w] of edges) { m[a][b] = w; m[b][a] = w; } return m; }

export const PRESETS = {
  lab: {
    key: 'lab', name: 'Đồ thị Lab 1 (6 đỉnh)', src: 0, dst: 5, labelIn: true,
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
  { id: 'HC', tag: 'leo đồi', informed: true }
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
  t.push({ a: 'goal', cur: P.dst, edge: via, fr, ex, lit, path, cost: c, txt: (pre || '') + `Lần ngược con trỏ cha: ${path.map(t.L).join(' → ')} — chi phí ${c}.` });
}

function bfs(P) {
  const t = T(P), { m, src, dst } = P, N = m.length;
  const par = { [src]: null }, dep = { [src]: 0 }, Q = [src], fr = [{ n: src, k: 'd=0' }], ex = [], lit = [];
  t.push({ a: 'start', cur: src, fr, ex, lit, txt: `Khởi tạo: đưa ${t.L(src)} vào HÀNG ĐỢI (FIFO). BFS kiểm tra đích ngay khi một nút được SINH RA.` });
  if (src === dst) { goalStep(t, P, par, null, fr, ex, lit, 'Nút xuất phát chính là đích. '); return t.steps; }
  while (Q.length) {
    const u = Q.shift(); fr.splice(fr.findIndex(x => x.n === u), 1); ex.push(u);
    t.push({ a: 'expand', cur: u, fr, ex, lit, txt: `Lấy ${t.L(u)} ra khỏi ĐẦU hàng đợi — nút NÔNG nhất — và mở rộng.` });
    for (let v = 0; v < N; v++) if (m[u][v] > 0 && !(v in par)) {
      par[v] = u; dep[v] = dep[u] + 1; lit.push(ek(u, v));
      if (v === dst) { goalStep(t, P, par, [u, v], fr, ex, lit, `Sinh ra ${t.L(v)} — ĐÍCH! Dừng ngay, không cần đợi lấy ra. `); return t.steps; }
      Q.push(v); fr.push({ n: v, k: 'd=' + dep[v] });
      t.push({ a: 'gen', cur: u, edge: [u, v], fr, ex, lit, txt: `Sinh ${t.L(v)} (chưa gặp) → nối vào CUỐI hàng đợi.` });
    }
  }
  t.push({ a: 'fail', fr, ex, lit, txt: 'Hàng đợi rỗng — đã duyệt hết mọi nút chạm tới được → VÔ NGHIỆM.' });
  return t.steps;
}

function dfs(P) {
  const t = T(P), { m, src, dst } = P, N = m.length;
  const par = { [src]: null }, S = [src], fr = [{ n: src, k: '' }], ex = [], lit = [];
  t.push({ a: 'start', cur: src, fr, ex, lit, txt: `Khởi tạo: đặt ${t.L(src)} vào NGĂN XẾP (LIFO). DFS lao xuống sâu nhất có thể rồi mới quay lui.` });
  if (src === dst) { goalStep(t, P, par, null, fr, ex, lit, 'Nút xuất phát chính là đích. '); return t.steps; }
  while (S.length) {
    const u = S.pop(); fr.splice(fr.findIndex(x => x.n === u), 1); ex.push(u);
    t.push({ a: 'expand', cur: u, fr, ex, lit, txt: `Lấy ${t.L(u)} từ ĐỈNH ngăn xếp — nút SÂU nhất — và mở rộng.` });
    for (let v = N - 1; v >= 0; v--) if (m[u][v] > 0 && !(v in par)) {
      par[v] = u; lit.push(ek(u, v));
      if (v === dst) { goalStep(t, P, par, [u, v], fr, ex, lit, `Sinh ra ${t.L(v)} — ĐÍCH! `); return t.steps; }
      S.push(v); fr.push({ n: v, k: '' });
      t.push({ a: 'gen', cur: u, edge: [u, v], fr, ex, lit, txt: `Sinh ${t.L(v)} → đẩy lên ĐỈNH ngăn xếp (sẽ được mở TRƯỚC các nút chờ sẵn).` });
    }
  }
  t.push({ a: 'fail', fr, ex, lit, txt: 'Ngăn xếp rỗng → VÔ NGHIỆM.' });
  return t.steps;
}

function best(P, mode) {
  const t = T(P), { m, src, dst, h } = P, N = m.length, A = mode === 'astar';
  const par = { [src]: null }, g = { [src]: 0 }, fr = [{ n: src }], ex = [], lit = [];
  const key = n => A ? g[n] + h[n] : g[n];
  const snap = () => fr.slice().sort((a, b) => key(a.n) - key(b.n) || a.n - b.n).map(x => ({ n: x.n, k: (A ? 'f=' : 'g=') + key(x.n) }));
  t.push({ a: 'start', cur: src, fr: snap(), ex, lit, txt: A ? 'Hàng đợi ưu tiên theo f(n) = g(n) + h(n): chi phí ĐÃ ĐI cộng ước lượng CÒN LẠI. Chỉ dừng khi đích được LẤY RA.' : 'Hàng đợi ưu tiên theo g(n) — chi phí THẬT tính từ gốc. Chỉ dừng khi đích được LẤY RA.' });
  while (fr.length) {
    fr.sort((a, b) => key(a.n) - key(b.n) || a.n - b.n); const u = fr.shift().n;
    if (u === dst) { goalStep(t, P, par, null, snap(), ex, lit, A ? `Lấy ${t.L(u)} ra với f = g = ${g[u]} — ĐÍCH. Với h consistent, lần lấy ra đầu tiên luôn theo đường tối ưu. ` : `Lấy ${t.L(u)} ra với g = ${g[u]} — ĐÍCH, và chắc chắn tối ưu: mọi nút còn chờ đều có g ≥ ${g[u]}. `); return t.steps; }
    ex.push(u);
    t.push({ a: 'expand', cur: u, fr: snap(), ex, lit, txt: A ? `Lấy ${t.L(u)} — f nhỏ nhất: f = ${g[u]} + ${h[u]} = ${g[u] + h[u]}.` : `Lấy ${t.L(u)} — g nhỏ nhất (= ${g[u]}).` });
    for (let v = 0; v < N; v++) {
      const w = m[u][v];
      if (w > 0 && !ex.includes(v)) {
        const ng = g[u] + w;
        if (ng < (v in g ? g[v] : Infinity)) {
          const had = v in g;
          if (had) { const i = lit.indexOf(ek(par[v], v)); if (i >= 0) lit.splice(i, 1); }
          g[v] = ng; par[v] = u; lit.push(ek(u, v));
          if (had) t.push({ a: 'update', cur: u, edge: [u, v], fr: snap(), ex, lit, txt: `Đường RẺ HƠN tới ${t.L(v)}: g = ${ng} qua ${t.L(u)} — cập nhật cha và khóa.` });
          else { fr.push({ n: v }); t.push({ a: 'gen', cur: u, edge: [u, v], fr: snap(), ex, lit, txt: A ? `Sinh ${t.L(v)}: f = ${ng} + ${h[v]} = ${ng + h[v]}.` : `Sinh ${t.L(v)} với g = ${ng}.` }); }
        }
      }
    }
  }
  t.push({ a: 'fail', fr: [], ex, lit, txt: 'Hàng đợi rỗng → VÔ NGHIỆM.' });
  return t.steps;
}

function ids(P) {
  const t = T(P), { m, src, dst } = P, N = m.length;
  for (let lim = 0; lim < N; lim++) {
    t.push({ a: 'deepen', limit: lim, fr: [], ex: [], lit: [], txt: `VÒNG ${lim + 1} — chạy DLS với giới hạn độ sâu ℓ = ${lim}. Mọi thứ làm lại TỪ ĐẦU (đổi bộ nhớ lấy thời gian).` });
    const par = { [src]: null }, branch = [src], ex = [], lit = [];
    const frS = () => branch.map((b, i) => ({ n: b, k: 'd=' + i }));
    let found = false;
    const rec = (u, d) => {
      if (u === dst) { goalStep(t, P, par, null, frS(), ex, lit, `${t.L(u)} là ĐÍCH ở độ sâu ${d} — vòng ℓ=${lim} thành công, và đây là nghiệm NÔNG nhất. `); found = true; return; }
      t.push({ a: 'expand', cur: u, limit: lim, fr: frS(), ex, lit, txt: d === 0 ? `Bắt đầu lại từ ${t.L(u)} với ℓ = ${lim}.` : `Đi sâu tới ${t.L(u)} (độ sâu ${d}/${lim}).` });
      if (d === lim) { t.push({ a: 'cutoff', cur: u, limit: lim, fr: frS(), ex, lit, txt: `${t.L(u)} chạm giới hạn ℓ = ${lim} → CẮT (cutoff), quay lui.` }); return; }
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
  t.push({ a: 'fail', fr: [], ex: [], lit: [], txt: 'Đã tăng ℓ tới kích thước đồ thị mà không thấy đích → VÔ NGHIỆM.' });
  return t.steps;
}

function gbfs(P) {
  const t = T(P), { m, src, dst, h } = P, N = m.length;
  const par = { [src]: null }, fr = [{ n: src, key: h[src] }], ex = [], lit = [];
  const snap = () => fr.slice().sort((a, b) => a.key - b.key || a.n - b.n).map(x => ({ n: x.n, k: 'h=' + x.key }));
  t.push({ a: 'start', cur: src, fr: snap(), ex, lit, txt: 'Hàng đợi ưu tiên theo h(n) — nút TRÔNG gần đích nhất được mở trước. Quá khứ (g) bị bỏ qua hoàn toàn.' });
  if (src === dst) { goalStep(t, P, par, null, snap(), ex, lit, 'Nút xuất phát chính là đích. '); return t.steps; }
  while (fr.length) {
    fr.sort((a, b) => a.key - b.key || a.n - b.n); const { n: u, key: hu } = fr.shift(); ex.push(u);
    t.push({ a: 'expand', cur: u, fr: snap(), ex, lit, txt: `Lấy ${t.L(u)} — h nhỏ nhất (= ${hu}): TRÔNG gần đích nhất.` });
    for (let v = 0; v < N; v++) if (m[u][v] > 0 && !(v in par)) {
      par[v] = u; lit.push(ek(u, v));
      if (v === dst) { goalStep(t, P, par, [u, v], fr, ex, lit, `Sinh ra ${t.L(v)} — ĐÍCH! Dừng khi sinh ra (quy ước Lab). Nhanh — nhưng có tối ưu không? `); return t.steps; }
      fr.push({ n: v, key: h[v] });
      t.push({ a: 'gen', cur: u, edge: [u, v], fr: snap(), ex, lit, txt: `Sinh ${t.L(v)} (h = ${h[v]}).` });
    }
  }
  t.push({ a: 'fail', fr: [], ex, lit, txt: 'Hàng đợi rỗng → VÔ NGHIỆM.' });
  return t.steps;
}

function hc(P) {
  const t = T(P), { m, src, dst, h } = P, N = m.length;
  const par = { [src]: null }, lit = [], trail = []; let u = src;
  t.push({ a: 'start', cur: src, fr: [], ex: trail, lit, txt: `Bắt đầu tại ${t.L(src)} (h = ${h[src]}). KHÔNG có frontier — chỉ nhớ đúng MỘT nút hiện tại.` });
  if (u === dst) { goalStep(t, P, par, null, [], trail, lit, 'Xuất phát đã ở đích. '); return t.steps; }
  for (let guard = 0; guard < N + 2; guard++) {
    let b = -1;
    for (let v = 0; v < N; v++) if (m[u][v] > 0 && h[v] < h[u]) { b = v; break; }
    if (b < 0) { t.push({ a: 'stuck', cur: u, fr: [], ex: trail, lit, txt: `Không láng giềng nào có h nhỏ hơn ${h[u]} → KẸT tại ${t.L(u)} (cực trị địa phương). Quy ước Lab: coi như không có đường → in -1.` }); return t.steps; }
    par[b] = u; lit.push(ek(u, b)); trail.push(u);
    if (b === dst) { goalStep(t, P, par, [u, b], [], trail, lit, `h giảm ${h[u]} → ${h[b]}: leo sang ${t.L(b)} — ĐÍCH! (May mắn thôi: leo đồi không hề đảm bảo điều này.) `); return t.steps; }
    t.push({ a: 'move', cur: b, edge: [u, b], fr: [], ex: trail, lit, txt: `First-choice: gặp ${t.L(b)} có h = ${h[b]} nhỏ hơn ${h[u]} → leo NGAY, không xét thêm, không ngoái lại.` });
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

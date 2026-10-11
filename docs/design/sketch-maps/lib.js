// Sketch-style map pieces built with rough.js. Each helper returns SVG markup strings.
const rough = require('roughjs/bundled/rough.cjs.js');
const gen = rough.generator();

const INK = '#14162B', VIOLET = '#4A33C9', SUN = '#FFC94A', GRAY = '#9AA1B5', GRAYFILL = '#E3E6EE';
let seedN = 7;
const seed = () => (seedN = (seedN * 48271) % 2147483647);
const rd = (s) => s.replace(/-?\d+\.\d+/g, (m) => String(Math.round(+m * 10) / 10));

function paths(drawable, extra = '') {
  return gen.toPaths(drawable).map((p) =>
    `<path d="${rd(p.d)}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="${p.fill || 'none'}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`
  ).join('');
}

// trail: band underneath + line on top. kind: done | open | locked | side
function trail(pts, kind) {
  const band = paths(gen.curve(pts, { stroke: '#EADFC4', strokeWidth: 15, roughness: 0.6, bowing: 0.6, seed: seed(), disableMultiStroke: true }));
  const st = {
    done: { stroke: VIOLET, strokeWidth: 3.6, dash: '' },
    open: { stroke: INK, strokeWidth: 2.4, dash: ' stroke-dasharray="9 8"' },
    locked: { stroke: GRAY, strokeWidth: 2.4, dash: ' stroke-dasharray="3 8"' },
    side: { stroke: GRAY, strokeWidth: 2, dash: ' stroke-dasharray="3 7"' },
  }[kind];
  const line = paths(gen.curve(pts, { stroke: st.stroke, strokeWidth: st.strokeWidth, roughness: 1, seed: seed(), disableMultiStroke: kind !== 'done' }), st.dash);
  return (kind === 'side' ? '' : band) + line;
}

// station / goal node disc with chunky shadow. state: done | current | open | locked | side
function disc(x, y, d, state) {
  const fill = { done: VIOLET, current: SUN, open: '#FFFFFF', locked: GRAYFILL, side: '#FFFFFF' }[state];
  const stroke = state === 'locked' || state === 'side' ? GRAY : INK;
  const shadow = state === 'locked' ? '#C9CEDC' : state === 'side' ? null : INK;
  let s = '';
  if (state === 'current') s += paths(gen.circle(x, y, d + 26, { fill: '#FFE58A', fillStyle: 'hachure', hachureGap: 4, fillWeight: 1.6, stroke: 'none', roughness: 1.2, seed: seed() }));
  if (shadow) s += paths(gen.ellipse(x, y + 6, d + 2, d - 2, { fill: shadow, fillStyle: 'solid', stroke: shadow, strokeWidth: 2, roughness: 0.7, seed: seed() }));
  s += paths(gen.circle(x, y, d, { fill, fillStyle: 'solid', stroke, strokeWidth: state === 'side' ? 1.8 : 2.2, roughness: 0.9, seed: seed() }), state === 'side' ? ' stroke-dasharray="4 5"' : '');
  return s;
}

function tree(x, y, d = 34) {
  let s = paths(gen.line(x, y + d * 0.35, x + 1, y + d * 0.35 + 12, { stroke: INK, strokeWidth: 1.6, roughness: 0.8, seed: seed() }));
  s += paths(gen.circle(x, y, d, { fill: '#A9CB96', fillStyle: 'hachure', hachureGap: 4, hachureAngle: -41, fillWeight: 1.3, stroke: INK, strokeWidth: 1.3, roughness: 1.5, seed: seed() }));
  return s;
}
function grove(list) { return list.map(([x, y, d]) => tree(x, y, d)).join(''); }

function bush(x, y, w = 34, h = 20) {
  return paths(gen.ellipse(x, y, w, h, { fill: '#BCD7AC', fillStyle: 'hachure', hachureGap: 4.5, hachureAngle: 30, stroke: INK, strokeWidth: 1.2, roughness: 1.5, seed: seed() }));
}

function hill(x, y, w, h, fill = '#EFE4CB') {
  return paths(gen.polygon([[x - w / 2, y], [x, y - h], [x + w / 2, y]], { fill, fillStyle: 'hachure', hachureGap: 6, hachureAngle: 60, fillWeight: 1, stroke: INK, strokeWidth: 1.4, roughness: 1.2, seed: seed() }));
}

function lake(x, y, w, h) {
  return paths(gen.ellipse(x, y, w, h, { fill: '#D7E4F2', fillStyle: 'hachure', hachureGap: 5, hachureAngle: 0, fillWeight: 1.2, stroke: '#5E7699', strokeWidth: 1.5, roughness: 1.6, seed: seed() }));
}

function flag(x, y, h = 46) {
  let s = paths(gen.line(x, y, x, y - h, { stroke: INK, strokeWidth: 2.4, roughness: 0.6, seed: seed() }));
  s += paths(gen.polygon([[x, y - h], [x + 30, y - h + 9], [x, y - h + 19]], { fill: SUN, fillStyle: 'solid', stroke: INK, strokeWidth: 1.8, roughness: 0.8, seed: seed() }));
  return s;
}

function sign(x, y) { // little signpost stick; board text is HTML on top
  return paths(gen.line(x, y, x, y + 26, { stroke: INK, strokeWidth: 2, roughness: 0.6, seed: seed() }));
}

function svg(w, h, body) {
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true" style="position: absolute; left: 0; top: 0; overflow: visible">${body}</svg>`;
}

// ---------- HTML overlay helpers ----------
const page = (on, rot) => on
  ? `<svg width="12" height="15" viewBox="0 0 12 15" aria-hidden="true" style="transform: rotate(${rot}deg)"><path d="M1 1h7l3 3v10H1z" fill="#FFFFFF" stroke="#14162B" stroke-width="1.4" stroke-linejoin="round"/><path d="M3 7h5M3 10h4" stroke="#4A33C9" stroke-width="1.3" stroke-linecap="round"/></svg>`
  : `<svg width="12" height="15" viewBox="0 0 12 15" aria-hidden="true" style="transform: rotate(${rot}deg)"><path d="M1 1h7l3 3v10H1z" fill="none" stroke="#9AA1B5" stroke-width="1.3" stroke-dasharray="2.5 2" stroke-linejoin="round"/></svg>`;
function pages(on, total) {
  let s = '';
  for (let i = 0; i < total; i++) s += page(i < on, [-6, 4, -3, 6][i % 4]);
  return `<span style="display: inline-flex; gap: 3px; align-items: center">${s}</span>`;
}

module.exports = { gen, paths, trail, disc, tree, grove, bush, hill, lake, flag, sign, svg, pages, INK, VIOLET, SUN, GRAY };

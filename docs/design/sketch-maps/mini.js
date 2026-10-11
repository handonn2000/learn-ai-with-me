// Small sketch doodles: mountain with three converging trails (course teaser).
const L = require('./lib.js');
const fs = require('fs');
function doodle(seedShift, w = 150, h = 84) {
  let b = '';
  b += L.paths(L.gen.polygon([[38, 46], [75, 10], [112, 46]], { fill: '#EDE2C8', fillStyle: 'hachure', hachureGap: 4, hachureAngle: 60, stroke: '#14162B', strokeWidth: 1.5, roughness: 1, seed: 21 + seedShift }));
  b += L.paths(L.gen.polygon([[75, 10], [66, 24], [75, 20], [84, 24]], { fill: '#FFFFFF', fillStyle: 'solid', stroke: '#14162B', strokeWidth: 1.2, roughness: 0.8, seed: 22 + seedShift }));
  b += L.paths(L.gen.line(75, 12, 75, -6, { stroke: '#14162B', strokeWidth: 1.6, roughness: 0.5, seed: 23 }));
  b += L.paths(L.gen.polygon([[75, -6], [91, -1], [75, 4]], { fill: '#FFC94A', fillStyle: 'solid', stroke: '#14162B', strokeWidth: 1.2, roughness: 0.6, seed: 24 }));
  for (const [pts, s] of [[[[50, 46], [30, 62], [44, 80]], 1], [[[75, 46], [78, 64], [70, 80]], 2], [[[100, 46], [124, 62], [110, 80]], 3]]) {
    b += L.paths(L.gen.curve(pts, { stroke: '#14162B', strokeWidth: 1.5, roughness: 0.8, seed: 30 + s + seedShift, disableMultiStroke: true }), ' stroke-dasharray="4 4"');
  }
  for (const [x, y, d] of [[22, 34, 14], [130, 30, 12], [134, 70, 10]]) b += L.tree(x, y, d);
  return `<svg viewBox="0 -10 ${w} ${h + 6}" width="${w}" height="${h + 6}" aria-hidden="true" style="flex: none; display: block; overflow: visible">${b}</svg>`
    .replace(/<(path|line|circle|rect|ellipse|polygon)(\s[^<>]*?)\s*\/>/g, '<$1$2></$1>');
}
fs.writeFileSync('out/mini1.svg', doodle(0));
fs.writeFileSync('out/mini2.svg', doodle(40));

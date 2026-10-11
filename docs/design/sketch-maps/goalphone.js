// Phone goal map "Hiểu A*" (390 wide). Bottom part sits under the station sheet.
const L = require('./lib.js');
const fs = require('fs');
const { build } = require('./goalmap.js');

const T = (title, meta, color = '#14162B') => `<div style="font: 600 12.5px/1.25 'Onest', system-ui, sans-serif; color: ${color}">${title}</div>` +
  (meta ? `<div style="margin-top: 3px; display: inline-flex; align-items: center; gap: 5px; font: 600 11px 'Onest', sans-serif; color: #3F4560">${meta}</div>` : '');

const W = 390, H = 640;
const P = { flag: [195, 70], 9: [195, 122], 8: [195, 222], 6: [100, 330], 7: [300, 350], 4: [62, 452], 5: [228, 462], 3: [110, 570], 2: [195, 640], g: [356, 262] };
const nodes = [
  { x: P[3][0], y: P[3][1], d: 50, state: 'done', num: '3', aria: 'Ga 3, đã qua' },
  { x: P[4][0], y: P[4][1], d: 50, state: 'done', num: '4', aria: 'Ga 4, Tránh lặp với tập explored, đã qua' },
  { x: P[5][0], y: P[5][1], d: 50, state: 'done', num: '5', aria: 'Ga 5, Hàng đợi ưu tiên, đã qua' },
  { x: P[6][0], y: P[6][1], d: 54, state: 'current', num: '6', aria: 'Ga 6, Tìm kiếm chi phí đều, hôm nay' },
  { x: P[7][0], y: P[7][1], d: 50, state: 'open', num: '7', aria: 'Ga 7, Hàm heuristic, học được ngay' },
  { x: P[8][0], y: P[8][1], d: 50, state: 'locked', num: '8', aria: 'Ga 8, Chạy tay A*, cần ga 6 và 7' },
  { x: P[9][0], y: P[9][1], d: 50, state: 'locked', num: '9', aria: 'Ga 9, Khi nào A* chắc chắn đúng, cần ga 8' },
  { x: P.g[0], y: P.g[1], d: 36, state: 'side', num: 'GBFS', fs: 10, aria: 'Ga phụ GBFS, thuộc mục tiêu khác' },
];
const edges = [
  [[P[2], [150, 610], P[3]], 'done'],
  [[P[3], [72, 520], P[4]], 'done'],
  [[P[4], [70, 390], P[6]], 'done'],
  [[P[5], [178, 392], P[6]], 'done'],
  [[P[2], [320, 600], [362, 470], [340, 400], P[7]], 'open'],
  [[P[6], [112, 268], [160, 230], P[8]], 'locked'],
  [[P[7], [282, 280], [232, 236], P[8]], 'locked'],
  [[P[8], P[9]], 'locked'],
  [[P[9], P.flag], 'locked'],
  [[P[7], [338, 300], P.g], 'side'],
];
const deco = L.grove([[40, 120, 28], [72, 96, 22], [330, 130, 26], [356, 160, 20], [40, 230, 24], [22, 330, 18]]) +
  L.bush(150, 520, 30, 16) + L.flag(195, 70, 44);
const labels = [
  { x: 232, y: 106, w: 140, html: T('Khi nào A* chắc chắn đúng', L.pages(0, 2), '#555B72') },
  { x: 232, y: 206, w: 110, html: T('Chạy tay A*', L.pages(0, 3), '#555B72') },
  { x: 268, y: 330, w: 110, align: 'right', html: T('Hàm heuristic', L.pages(0, 2)) },
  { x: 96, y: 440, w: 100, html: T('Tránh lặp', L.pages(2, 2)) },
  { x: 262, y: 446, w: 86, html: T('Hàng đợi<br>ưu tiên', L.pages(2, 2)) },
  { x: 100, y: 282, w: 80, align: 'center', html: `<span style="display: inline-block; padding: 2px 9px; border-radius: 999px; background: #14162B; color: #FFFFFF; font: 700 11px 'Onest', sans-serif">Hôm nay</span>` },
  { x: 232, y: 44, w: 130, html: `<div style="font: 600 12px 'Playpen Sans', cursive">đích: Hiểu A*</div>` },
  { x: 356, y: 284, w: 60, align: 'center', html: `<div style="font: 600 10.5px 'Playpen Sans', cursive; color: #555B72">ga phụ</div>` },
];
fs.writeFileSync(process.argv[2], build({ W, H, nodes, edges, labels, deco }));

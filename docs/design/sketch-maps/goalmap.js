// Goal map "Hiểu A*": 9 stations as a sketch level map. Prints an HTML fragment (W x H box).
const L = require('./lib.js');
const fs = require('fs');

function build(cfg) {
  const { W, H, nodes, edges, labels, deco, extra = '' } = cfg;
  let body = deco;
  for (const [pts, kind] of edges) body += L.trail(pts, kind);
  body += extra;
  for (const n of nodes) body += L.disc(n.x, n.y, n.d, n.state);
  let html = `<div style="position: relative; width: ${W}px; height: ${H}px; margin: 0 auto">` + L.svg(W, H, body);
  const numColor = { done: '#FFFFFF', current: '#14162B', open: '#14162B', locked: '#7A8095', side: '#555B72' };
  for (const n of nodes) {
    const fs_ = n.fs || (n.d >= 56 ? 24 : 15);
    html += `<a href="#" aria-label="${n.aria}"${n.state === 'current' ? ' aria-current="step"' : ''} style="position: absolute; left: ${n.x}px; top: ${n.y}px; width: ${n.d}px; height: ${n.d}px; transform: translate(-50%, -50%); display: grid; place-items: center; border-radius: 50%; text-decoration: none; font: 800 ${fs_}px 'Bricolage Grotesque', system-ui, sans-serif; letter-spacing: -0.02em; color: ${numColor[n.state]}">${n.num}</a>`;
  }
  for (const l of labels) {
    const pos = l.align === 'right' ? `right: ${W - l.x}px` : l.align === 'center' ? `left: ${l.x - l.w / 2}px` : `left: ${l.x}px`;
    html += `<div style="position: absolute; ${pos}; top: ${l.y}px; width: ${l.w}px; text-align: ${l.align || 'left'}; ${l.style || ''}">${l.html}</div>`;
  }
  return html + '</div>';
}

const T = (title, meta, opts = {}) => `<div style="font: ${opts.weight || 600} ${opts.size || 14}px/1.25 'Onest', system-ui, sans-serif; color: ${opts.color || '#14162B'}">${title}</div>` +
  (meta ? `<div style="margin-top: 4px; display: inline-flex; align-items: center; gap: 6px; font: 600 12px 'Onest', sans-serif; color: ${opts.metaColor || '#3F4560'}">${meta}</div>` : '');

// ---------------- Desktop goal map ----------------
const W = 780, H = 980;
const P = {
  flag: [390, 96], 9: [390, 175], 8: [390, 305], 6: [235, 445], 7: [615, 470],
  4: [135, 605], 5: [390, 605], 3: [185, 745], 2: [390, 815], 1: [390, 915], g: [690, 335],
};
const nodes = [
  { x: P[1][0], y: P[1][1], d: 58, state: 'done', num: '1', aria: 'Ga 1, Mô hình hóa bài toán, đã qua, 2 trên 2 sketch' },
  { x: P[2][0], y: P[2][1], d: 58, state: 'done', num: '2', aria: 'Ga 2, Đọc bản đồ trạng thái, đã qua, 2 trên 2 sketch' },
  { x: P[3][0], y: P[3][1], d: 58, state: 'done', num: '3', aria: 'Ga 3, Mở rộng nút và frontier, đã qua, 3 trên 3 sketch' },
  { x: P[4][0], y: P[4][1], d: 58, state: 'done', num: '4', aria: 'Ga 4, Tránh lặp với tập explored, đã qua, 2 trên 2 sketch' },
  { x: P[5][0], y: P[5][1], d: 58, state: 'done', num: '5', aria: 'Ga 5, Hàng đợi ưu tiên, đã qua, 2 trên 2 sketch' },
  { x: P[6][0], y: P[6][1], d: 62, state: 'current', num: '6', aria: 'Ga 6, Tìm kiếm chi phí đều, hôm nay, 3 sketch sẽ mở' },
  { x: P[7][0], y: P[7][1], d: 58, state: 'open', num: '7', aria: 'Ga 7, Hàm heuristic, học được ngay, 2 sketch sẽ mở' },
  { x: P[8][0], y: P[8][1], d: 58, state: 'locked', num: '8', aria: 'Ga 8, Chạy tay A*, cần qua ga 6 và 7' },
  { x: P[9][0], y: P[9][1], d: 58, state: 'locked', num: '9', aria: 'Ga 9, Khi nào A* chắc chắn đúng, cần qua ga 8' },
  { x: P.g[0], y: P.g[1], d: 46, state: 'side', num: 'GBFS', fs: 12, aria: 'Ga phụ GBFS, thuộc mục tiêu Chọn đúng thuật toán' },
];
const edges = [
  [[P[1], [394, 866], P[2]], 'done'],
  [[P[2], [300, 806], [228, 782], P[3]], 'done'],
  [[P[3], [150, 686], P[4]], 'done'],
  [[P[4], [158, 522], P[6]], 'done'],
  [[P[5], [328, 522], P[6]], 'done'],
  [[P[2], [470, 756], [592, 646], P[7]], 'open'],
  [[P[6], [246, 372], [318, 318], P[8]], 'locked'],
  [[P[7], [592, 390], [482, 336], P[8]], 'locked'],
  [[P[8], [394, 240], P[9]], 'locked'],
  [[P[9], P.flag], 'locked'],
  [[P[7], [668, 412], P.g], 'side'],
];
const deco =
  L.grove([[70, 250, 36], [112, 214, 30], [96, 300, 26], [560, 196, 34], [600, 226, 28], [705, 590, 34], [740, 625, 26], [690, 720, 30], [700, 925, 30], [742, 900, 24], [110, 880, 34], [70, 905, 26], [300, 215, 26]]) +
  L.bush(330, 690, 40, 22) + L.bush(700, 860, 44, 24) + L.bush(260, 905, 36, 20) + 
  L.flag(390, 96, 52) + L.sign(318, 900) + L.sign(470, 648);
const labels = [
  { x: 430, y: 898, w: 200, html: T('Mô hình hóa bài toán', L.pages(2, 2) + '2/2') },
  { x: 430, y: 818, w: 200, html: T('Đọc bản đồ trạng thái', L.pages(2, 2) + '2/2') },
  { x: 150, y: 722, w: 130, align: 'right', html: T('Mở rộng nút<br>và frontier', L.pages(3, 3) + '3/3') },
  { x: 176, y: 580, w: 140, html: T('Tránh lặp với<br>tập explored', L.pages(2, 2) + '2/2') },
  { x: 430, y: 582, w: 160, html: T('Hàng đợi ưu tiên', L.pages(2, 2) + '2/2') },
  { x: 196, y: 400, w: 170, align: 'right', html: T('Tìm kiếm chi phí<br>đều (UCS)', L.pages(0, 3) + 'mở khi qua ga', { weight: 700 }) },
  { x: 576, y: 450, w: 150, align: 'right', html: T('Hàm heuristic<br>h(n)', L.pages(0, 2) + '0/2') },
  { x: 430, y: 266, w: 180, html: T('Chạy tay A*', L.pages(0, 3) + 'cần ga 6 và 7', { color: '#555B72' }) },
  { x: 430, y: 156, w: 220, html: T('Khi nào A* chắc chắn đúng', L.pages(0, 2) + 'cần ga 8', { color: '#555B72' }) },
  { x: 690, y: 262, w: 170, align: 'center', html: `<div style="font: 600 12px/1.3 'Playpen Sans', cursive; color: #555B72">ga phụ của mục tiêu<br>“Chọn đúng thuật toán”</div>` },
  // goal cartouche
  { x: 24, y: 24, w: 300, html:
    `<div style="padding: 12px 16px; background: #FFFFFF; border: 2px solid #14162B; border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px; box-shadow: 0 4px 0 #14162B">
       <div style="font: 700 12px 'Onest', sans-serif; letter-spacing: 0.06em; color: #4A33C9">ĐÍCH</div>
       <div style="font: 800 24px/1.05 'Bricolage Grotesque', sans-serif; letter-spacing: -0.02em">Hiểu A*</div>
       <div style="margin-top: 4px; font: 500 13px/1.35 'Onest', sans-serif; color: #3F4560">Chạy tay A* và giải thích khi nào nó chắc chắn ra đường rẻ nhất.</div>
       <div style="margin-top: 6px; display: flex; align-items: center; gap: 6px; font: 600 12px 'Onest', sans-serif; color: #3F4560">${L.pages(0, 2)} 2 sketch của mục tiêu, mở khi tới đích</div>
     </div>` },
  { x: 430, y: 66, w: 120, html: `<div style="font: 600 13px 'Playpen Sans', cursive; color: #14162B">tới đây là xong!</div>` },
  // signs
  { x: 318, y: 878, w: 90, align: 'center', html: `<div style="display: inline-block; padding: 2px 8px; background: #FFFDF6; border: 1.6px solid #14162B; border-radius: 4px; font: 600 12px 'Playpen Sans', cursive; transform: rotate(-4deg)">xuất phát</div>` },
  { x: 470, y: 628, w: 150, align: 'center', html: `<div style="display: inline-block; padding: 2px 8px; background: #FFFDF6; border: 1.6px solid #14162B; border-radius: 4px; font: 600 11.5px/1.25 'Playpen Sans', cursive; transform: rotate(3deg)">không cần ga nào trước</div>` },
  // today tag
  { x: 235, y: 392, w: 80, align: 'center', html: `<span style="display: inline-block; padding: 2px 10px; border-radius: 999px; background: #14162B; color: #FFFFFF; font: 700 12px 'Onest', sans-serif">Hôm nay</span>` },
];
// move today tag above the node a bit more
labels[labels.length - 1].y = 386;

if (require.main === module) fs.writeFileSync(process.argv[2], build({ W, H, nodes, edges, labels, deco }));
module.exports = { build, T };

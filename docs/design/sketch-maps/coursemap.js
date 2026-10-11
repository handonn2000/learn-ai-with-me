// Course map "Cơ sở AI": summit = final goal, three trails of goals converge on it.
const L = require('./lib.js');
const fs = require('fs');
const { build } = require('./goalmap.js');

const page1 = `<svg width="12" height="15" viewBox="0 0 12 15" aria-hidden="true"><path d="M1 1h7l3 3v10H1z" fill="#FFFFFF" stroke="#14162B" stroke-width="1.4" stroke-linejoin="round"/><path d="M3 7h5M3 10h4" stroke="#4A33C9" stroke-width="1.3" stroke-linecap="round"/></svg>`;
const T = (title, meta, opts = {}) => `<div style="font: ${opts.weight || 700} 14px/1.25 'Onest', system-ui, sans-serif">${title}</div>` +
  `<div style="margin-top: 3px; display: inline-flex; align-items: center; gap: 5px; font: 600 12px 'Onest', sans-serif; color: #3F4560">${meta}</div>`;
const meta = (ga, sk) => `${ga} · ${page1} ${sk}`;

const W = 780, H = 1000;
const P = {
  T: [390, 905], A: [215, 790], C: [110, 660], Pz: [215, 530], G: [110, 405], Lc: [215, 285],
  K: [420, 760], F: [360, 600], B: [420, 440], D: [650, 700], Pc: [660, 470],
};
const n = (k, state, num, aria, d = 62, fs_ = 17) => ({ x: P[k][0], y: P[k][1], d, state, num, aria, fs: fs_ });
const nodes = [
  n('T', 'done', 'PEAS', 'Mô tả tác tử, đã xong'),
  n('A', 'current', 'A*', 'Hiểu A*, đang học, 5 trên 9 ga', 66, 22),
  n('C', 'open', 'BFS', 'Chọn đúng thuật toán tìm kiếm, 5 trên 8 ga'),
  n('Pz', 'open', 'CSP', 'Giải bài toán ràng buộc'),
  n('G', 'open', 'α–β', 'Chọn nước đi trong trò chơi'),
  n('Lc', 'open', 'Leo<br>đồi', 'Tối ưu bằng tìm kiếm cục bộ', 62, 13),
  n('K', 'open', 'KB', 'Chứng minh từ cơ sở tri thức'),
  n('F', 'open', 'FOL', 'Dịch sang logic bậc nhất'),
  n('B', 'open', 'Bayes', 'Tính xác suất bằng mạng Bayes', 62, 14),
  n('D', 'open', 'ID3', 'Dựng cây quyết định'),
  n('Pc', 'open', 'Perc', 'Huấn luyện perceptron', 62, 15),
];
const edges = [
  [[P.T, [300, 872], P.A], 'done'],
  [[P.A, [150, 744], P.C], 'open'],
  [[P.C, [150, 590], P.Pz], 'open'],
  [[P.Pz, [150, 470], P.G], 'open'],
  [[P.G, [150, 336], P.Lc], 'open'],
  [[P.Lc, [262, 232], [305, 206]], 'open'],
  [[P.T, [402, 830], P.K], 'open'],
  [[P.K, [372, 690], P.F], 'open'],
  [[P.F, [400, 520], P.B], 'open'],
  [[P.B, [396, 330], [392, 214]], 'open'],
  [[P.T, [560, 860], P.D], 'open'],
  [[P.D, [676, 590], P.Pc], 'open'],
  [[P.Pc, [714, 396], [690, 286], [500, 208]], 'open'],
];
const mountain =
  L.paths(L.gen.polygon([[236, 212], [318, 120], [352, 138], [390, 66], [436, 128], [462, 116], [548, 212]], { fill: '#EDE2C8', fillStyle: 'hachure', hachureGap: 6, hachureAngle: 60, fillWeight: 1.1, stroke: '#14162B', strokeWidth: 2, roughness: 1.1, seed: 11 })) +
  L.paths(L.gen.polygon([[390, 66], [366, 112], [380, 104], [392, 116], [404, 102], [418, 112]], { fill: '#FFFFFF', fillStyle: 'solid', stroke: '#14162B', strokeWidth: 1.6, roughness: 0.9, seed: 12 })) +
  L.flag(390, 68, 40);
const deco = mountain +
  L.grove([[52, 205, 30], [86, 232, 24], [290, 575, 28], [312, 330, 26], [40, 520 + 60, 0], [52, 960, 30], [92, 975, 22], [720, 820, 30], [748, 850, 22], [740, 945, 28]].filter(t => t[2] > 0)) +
  L.hill(300, 978, 56, 34) + L.hill(342, 986, 40, 24) + L.hill(500, 560, 54, 34) + L.hill(548, 566, 36, 22) +
  L.lake(560, 330, 110, 58) + L.bush(616, 366, 30, 16) + L.bush(506, 368, 26, 14) +
  L.sign(470, 950);
const labels = [
  { x: 430, y: 890, w: 170, html: T('Mô tả tác tử', meta('4/4 ga', '8/8')) },
  { x: 170, y: 762, w: 160, align: 'right', html: T('Hiểu A*', meta('5/9 ga', '11/23'), { weight: 800 }) },
  { x: 150, y: 640, w: 150, html: T('Chọn đúng thuật toán tìm kiếm', meta('5/8 ga', '9/19')) },
  { x: 170, y: 512, w: 150, align: 'right', html: T('Giải bài toán ràng buộc', meta('0/7 ga', '0/16')) },
  { x: 150, y: 385, w: 140, html: T('Chọn nước đi trong trò chơi', meta('0/6 ga', '0/14')) },
  { x: 170, y: 266, w: 150, align: 'right', html: T('Tối ưu bằng tìm kiếm cục bộ', meta('0/6 ga', '0/13')) },
  { x: 380, y: 742, w: 120, align: 'right', html: T('Chứng minh từ cơ sở tri thức', meta('0/8 ga', '0/18')) },
  { x: 400, y: 582, w: 150, html: T('Dịch sang logic bậc nhất', meta('0/6 ga', '0/12')) },
  { x: 460, y: 422, w: 160, html: T('Tính xác suất bằng mạng Bayes', meta('0/7 ga', '0/15')) },
  { x: 610, y: 680, w: 130, align: 'right', html: T('Dựng cây quyết định', meta('0/6 ga', '0/13')) },
  { x: 622, y: 476, w: 130, align: 'right', html: T('Huấn luyện perceptron', meta('0/5 ga', '0/11')) },
  // region names
  { x: 30, y: 880, w: 160, html: `<div style="font: 600 22px 'Playpen Sans', cursive; color: #6E8A5E; transform: rotate(-6deg)">Tìm kiếm</div>` },
  { x: 500, y: 640, w: 160, html: `<div style="font: 600 22px 'Playpen Sans', cursive; color: #8C7448; transform: rotate(4deg)">Suy luận</div>` },
  { x: 660, y: 276, w: 120, html: `<div style="font: 600 22px 'Playpen Sans', cursive; color: #5E7699; transform: rotate(-5deg)">Học máy</div>` },
  // start sign + you-are-here
  { x: 470, y: 930, w: 90, align: 'center', html: `<div style="display: inline-block; padding: 2px 8px; background: #FFFDF6; border: 1.6px solid #14162B; border-radius: 4px; font: 600 12px 'Playpen Sans', cursive; transform: rotate(-3deg)">xuất phát</div>` },
  { x: 215, y: 732, w: 100, align: 'center', html: `<span style="display: inline-block; padding: 2px 10px; border-radius: 999px; background: #14162B; color: #FFFFFF; font: 700 12px 'Onest', sans-serif">Bạn ở đây</span>` },
  // summit cartouche
  { x: 24, y: 24, w: 250, html:
    `<div style="padding: 12px 16px; background: #FFFFFF; border: 2px solid #14162B; border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px; box-shadow: 0 4px 0 #14162B">
       <div style="font: 700 12px 'Onest', sans-serif; letter-spacing: 0.06em; color: #4A33C9">ĐÍCH CỦA KHÓA</div>
       <div style="font: 800 22px/1.05 'Bricolage Grotesque', sans-serif; letter-spacing: -0.02em">Sẵn sàng thi cuối kỳ</div>
       <div style="margin-top: 4px; font: 500 13px/1.35 'Onest', sans-serif; color: #3F4560">Ba đường mòn đều dẫn lên đỉnh. Đi đường nào trước cũng được.</div>
     </div>` },
  { x: 560, y: 60, w: 200, html: `<div style="font: 600 13px/1.3 'Playpen Sans', cursive">cần qua cả 11 mục tiêu<br>để lên tới đỉnh</div>` },
];
fs.writeFileSync(process.argv[2], build({ W, H, nodes, edges, labels, deco }));

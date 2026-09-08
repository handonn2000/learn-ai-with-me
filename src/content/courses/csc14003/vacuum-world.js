// Thế giới hút bụi của AIMA — engine sinh trace cho VacuumLab (bài 2, mục 03).
// Tách khỏi UI theo ADR-0005: chỗ này chỉ tính, React chỉ đọc và vẽ.
//
// Hai chương trình agent chạy trên CÙNG một thế giới, và mỗi bước được chấm bằng BA thước đo
// khác nhau cùng lúc. Đó là toàn bộ ý của lab: chương trình không đổi, thước đổi thì kết luận
// "có duy lý không" đổi theo.
//
// Thế giới 2 ô là bản gốc của tài liệu; bản 4 ô là hành lang A-B-C-D, giữ nguyên bộ hành động
// {Left, Right, Suck, NoOp} nên vẫn đúng bài. LƯU Ý: điểm của thế giới 2 ô được trích thẳng vào
// nội dung bài (40–40 và 20–39), đừng đụng vào luật của nó.

export const STEPS = 20;

export const WORLDS = [
  { id: 'w2', label: '2 ô', cells: ['A', 'B'] },
  { id: 'w4', label: '4 ô', cells: ['A', 'B', 'C', 'D'] },
];

/** Sàn lúc đầu. Cùng ba id cho mọi thế giới để bộ nút không đổi khi người học đổi số ô. */
export const PRESETS = [
  { id: 'dirty-all', label: 'Bẩn hết' },
  { id: 'dirty-half', label: 'Bẩn một nửa' },
  { id: 'clean', label: 'Sàn đã sạch bong' },
];

function makeWorld(cells, presetId) {
  const w = {};
  cells.forEach((c, i) => {
    w[c] = presetId === 'dirty-all' ? 'dirty'
      : presetId === 'clean' ? 'clean'
        : i % 2 === 0 ? 'dirty' : 'clean';
  });
  return w;
}

export const PROGRAMS = [
  {
    id: 'reflex',
    name: 'Phản xạ thuần',
    en: 'REFLEX-VACUUM-AGENT',
    blurb: 'Đúng bốn dòng, không hơn. Không nhớ gì hết: nhìn thấy gì thì làm nấy.',
  },
  {
    id: 'memo',
    name: 'Phản xạ + trí nhớ',
    en: 'có internal state',
    blurb: 'Y hệt bản trên, chỉ thêm một cuốn sổ ghi ô nào đã thấy sạch. Biết cả sàn sạch thì nghỉ.',
  },
];

/** Ba thước đo hiệu năng, chấm trên CÙNG một chuỗi trạng thái môi trường. */
export const MEASURES = [
  { id: 'clean', label: 'A · Sàn sạch', note: 'mỗi bước, mỗi ô sạch được 1 điểm' },
  { id: 'clean_move', label: 'B · Sàn sạch, đi lại tốn xăng', note: 'như A, nhưng mỗi lần di chuyển trừ 1 điểm' },
  { id: 'dirt', label: 'C · Hốt được bao nhiêu rác', note: 'mỗi lần hút trúng ô bẩn được 1 điểm' },
];

/**
 * Chương trình phản xạ thuần — bản gốc của tài liệu, mở rộng cho hành lang dài hơn hai ô.
 * Luật vẫn chỉ nhìn tri giác HIỆN TẠI: bẩn thì hút, đứng ở ô cuối thì lùi trái, còn lại tiến phải.
 * Với hai ô nó trùng khít hàm REFLEX-VACUUM-AGENT bốn dòng.
 */
function reflexProgram(percept, cells) {
  const [loc, status] = percept;
  if (status === 'dirty') return 'Suck';
  return loc === cells[cells.length - 1] ? 'Left' : 'Right';
}

/** Bản có trí nhớ: giữ niềm tin về từng ô, tin cả sàn đã sạch thì đứng yên. */
function memoProgram(percept, belief, cells) {
  const [loc, status] = percept;
  if (status === 'dirty') return 'Suck';
  if (cells.every((c) => belief[c] === 'clean')) return 'NoOp';
  return loc === cells[cells.length - 1] ? 'Left' : 'Right';
}

/**
 * Chạy một chương trình trên một thế giới + preset, trả về trace đầy đủ.
 * Bước 0 là trạng thái ban đầu (chưa hành động) — người học cuộn tới đã thấy có nghĩa.
 */
export function runVacuum(programId, worldId, presetId, steps = STEPS) {
  const { cells } = WORLDS.find((w) => w.id === worldId) || WORLDS[0];
  const world = makeWorld(cells, presetId);
  let idx = 0;
  const belief = {};
  cells.forEach((c) => { belief[c] = null; });

  const score = { clean: 0, clean_move: 0, dirt: 0 };
  const snap = () => ({ world: { ...world }, belief: { ...belief }, score: { ...score } });
  const trace = [{
    t: 0, loc: cells[0], percept: null, action: null, gained: null, ...snap(),
    noteKey: 'start',
  }];

  for (let t = 1; t <= steps; t++) {
    const loc = cells[idx];
    const status = world[loc];
    const percept = [loc, status];
    belief[loc] = status;

    const action = programId === 'memo'
      ? memoProgram(percept, belief, cells)
      : reflexProgram(percept, cells);

    let sucked = false;
    let moved = false;
    if (action === 'Suck') {
      if (world[loc] === 'dirty') sucked = true;
      world[loc] = 'clean';
    } else if (action === 'Right') {
      idx = Math.min(idx + 1, cells.length - 1); moved = true;
    } else if (action === 'Left') {
      idx = Math.max(idx - 1, 0); moved = true;
    }

    const cleanNow = cells.reduce((n, c) => n + (world[c] === 'clean' ? 1 : 0), 0);
    const gained = {
      clean: cleanNow,
      clean_move: cleanNow - (moved ? 1 : 0),
      dirt: sucked ? 1 : 0,
    };
    score.clean += gained.clean;
    score.clean_move += gained.clean_move;
    score.dirt += gained.dirt;

    trace.push({
      t, loc: cells[idx], percept, action, gained, ...snap(),
      noteKey: noteFor(action, sucked, moved, cells.length),
    });
  }

  return { trace, cells, programId };
}

/**
 * Trả KHÓA lời kể, không trả câu. Chữ nằm ở bundle của bài (`T.note`), vì engine mà ôm chữ
 * thì mỗi ngôn ngữ mới lại phải nhân bản cả engine — xem ADR-0010.
 */
function noteFor(action, sucked, moved, n) {
  if (action === 'Suck') return sucked ? 'suckDirty' : 'suckClean';
  if (moved) return 'moved';
  if (action === 'Left' || action === 'Right') return 'wall';
  return n > 2 ? 'restAll4' : 'restAll2';
}

/** Điểm cuối của cả hai chương trình trên cùng thế giới + preset — cho bảng so sánh dưới lab. */
export function compareFinal(worldId, presetId, steps = STEPS) {
  return PROGRAMS.map((p) => {
    const { trace } = runVacuum(p.id, worldId, presetId, steps);
    // Không trả `name`: đó là chữ hiển thị, UI tự tra từ PROGRAMS theo ngôn ngữ.
    return { programId: p.id, score: trace[trace.length - 1].score };
  });
}

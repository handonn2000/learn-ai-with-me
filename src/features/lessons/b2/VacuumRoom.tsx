/* Căn phòng của lab hút bụi — phần NHÌN của VacuumLab, vẽ được hành lang n ô.
   Cố ý dùng SVG chứ không canvas: cảnh chỉ đổi khi người học bấm, nên HTML/SVG đọc được bằng
   trình đọc màn hình, chọn được chữ, và không cần vòng lặp rAF nào. */

export interface RoomStep {
  t: number; loc: string; world: Record<string, string>;
  percept: [string, string] | null; action: string | null;
  belief: Record<string, string | null>;
}

const W = 400, PAD = 16, GAP = 10;
const TY = 96, TH = 78, FLOOR = 152;

/** Hạt bụi đặt theo TỈ LỆ ô nên đổi số ô là tự co lại; cố định để cảnh không nhảy giữa các bước. */
const SPECKS: [number, number, number][] = [
  [-0.33, 18, 4.5], [-0.17, 34, 3], [-0.02, 12, 5], [0.12, 30, 3.5],
  [0.29, 20, 4], [0.21, 6, 2.5], [-0.25, 40, 2.5],
];

function Robot({ dirty }: { dirty: boolean }) {
  const body = dirty ? 'var(--yellow)' : 'var(--cyan)';
  return (
    <g>
      <ellipse cx={0} cy={2} rx={26} ry={4.5} fill="var(--border-2)" opacity={0.9} />
      <path d="M-13,-8 L13,-8 L9,0 L-9,0 z" fill="var(--border-3)" />
      <rect x={-24} y={-40} width={48} height={33} rx={11} fill="var(--panel)" stroke={body} strokeWidth={1.8} />
      <circle cx={-7} cy={-25} r={4.6} fill={body} />
      <circle cx={9} cy={-25} r={4.6} fill={body} />
      <circle cx={-5.6} cy={-26.4} r={1.6} fill="var(--panel)" />
      <circle cx={10.4} cy={-26.4} r={1.6} fill="var(--panel)" />
      <rect x={-9} y={-15} width={18} height={3.4} rx={1.7} fill={body} opacity={0.55} />
    </g>
  );
}

function SuckFx() {
  return (
    <g opacity={0.95}>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${-11 - i * 7},${8 + i * 7} Q0,${1 + i * 5} ${11 + i * 7},${8 + i * 7}`}
          fill="none" stroke="var(--green)" strokeWidth={1.6} opacity={0.85 - i * 0.24} strokeLinecap="round" />
      ))}
      {[[-16, 20], [0, 26], [15, 19]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} fill="var(--green)" opacity={0.55} />
      ))}
    </g>
  );
}

export function VacuumRoom({ s, prev, rm, memo, cells }: {
  s: RoomStep; prev: RoomStep | null; rm: boolean; memo: boolean; cells: string[];
}) {
  const n = cells.length;
  const tw = (W - PAD * 2 - GAP * (n - 1)) / n;
  const cx = (i: number) => PAD + i * (tw + GAP) + tw / 2;
  const at = (id: string) => cx(cells.indexOf(id));

  // Ô hẹp thì bỏ chữ DIRTY/CLEAN (hạt bụi đã nói rồi) và thu robot lại cho vừa.
  const tight = n > 2;
  const rScale = tight ? 0.82 : 1;
  const specks = tight ? SPECKS.slice(0, 5) : SPECKS;

  const moved = !!prev && prev.loc !== s.loc;
  const sucking = s.action === 'Suck';
  const resting = s.action === 'NoOp';
  const here = at(s.loc);

  // Bong bóng rộng hơn ô hẹp, nên kẹp vào trong khung cho khỏi tràn mép.
  const bubbleX = s.percept ? Math.min(W - 64, Math.max(64, at(s.percept[0]))) : here;

  return (
    <svg viewBox="0 0 400 214" style={{ width: '100%', display: 'block' }} role="img"
      aria-label={`Bước ${s.t}: robot đang ở ô ${s.loc}. ` + cells.map((c) => `ô ${c} ${s.world[c] === 'dirty' ? 'bẩn' : 'sạch'}`).join(', ')}>
      <rect x={10} y={20} width={380} height={76} rx={10} fill="var(--panel-2)" opacity={0.5} />
      <line x1={10} y1={96} x2={390} y2={96} stroke="var(--border-2)" strokeWidth={1.5} />

      {cells.map((id, i) => {
        const dirty = s.world[id] === 'dirty';
        const isHere = s.loc === id;
        const c = cx(i);
        return (
          <g key={id}>
            <rect x={c - tw / 2} y={TY} width={tw} height={TH} rx={8}
              fill={isHere ? 'color-mix(in srgb, var(--cyan) 8%, var(--panel-2))' : 'var(--panel-2)'}
              stroke={isHere ? 'color-mix(in srgb, var(--cyan) 45%, transparent)' : 'var(--border-2)'} strokeWidth={isHere ? 1.6 : 1} />
            {dirty ? specks.map(([fx, dy, r], k) => {
              const px = c + fx * tw, py = TY + dy + 8;
              return <ellipse key={k} cx={px} cy={py} rx={r * (tight ? 0.85 : 1)} ry={r * 0.72 * (tight ? 0.85 : 1)}
                fill="var(--red)" opacity={0.72} transform={`rotate(${k * 37} ${px} ${py})`} />;
            }) : null}
            <text x={c - tw / 2 + (tight ? 9 : 12)} y={TY + 22} fontFamily="var(--font-mono)" fontSize={17} fontWeight={700}
              fill={isHere ? 'var(--cyan)' : 'var(--faint)'}>{id}</text>
            {tight ? (
              <circle cx={c + tw / 2 - 11} cy={TY + 16} r={4.5} fill={dirty ? 'var(--red)' : 'var(--green)'} opacity={0.9} />
            ) : (
              <text x={c + tw / 2 - 12} y={TY + 22} textAnchor="end" fontFamily="var(--font-mono)" fontSize={13}
                fill={dirty ? 'var(--red)' : 'var(--green)'}>{dirty ? 'DIRTY' : 'CLEAN'}</text>
            )}
            {memo ? (
              <text x={c} y={TY + TH + 19} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={tight ? 10.5 : 12.5}
                fill={s.belief[id] ? 'var(--green)' : 'var(--faint-2)'}>
                {s.belief[id] ? (tight ? 'đã thấy sạch' : 'sổ tay: đã thấy sạch') : (tight ? 'chưa biết' : 'sổ tay: chưa biết')}
              </text>
            ) : null}
          </g>
        );
      })}

      {moved ? (
        <g opacity={0.85}>
          <defs>
            <marker id="vac-ah" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill="var(--cyan)" />
            </marker>
          </defs>
          {(() => {
            const from = at(prev!.loc), sign = here > from ? 1 : -1, inset = tw * 0.22;
            return <path d={`M${from + sign * inset},${FLOOR + 14} L${here - sign * inset},${FLOOR + 14}`}
              stroke="var(--cyan)" strokeWidth={1.5} strokeDasharray="5 4" markerEnd="url(#vac-ah)" fill="none" />;
          })()}
        </g>
      ) : null}

      {/* robot — trượt sang ô mới, tắt khi người dùng giảm chuyển động */}
      <g style={{ transform: `translate(${here}px, ${FLOOR}px) scale(${rScale})`, transition: rm ? 'none' : 'transform .42s cubic-bezier(.4,0,.2,1)' }}>
        <Robot dirty={s.percept?.[1] === 'dirty'} />
        {sucking ? <SuckFx /> : null}
        {resting ? (
          <g opacity={0.6}>
            <rect x={-7} y={12} width={4.5} height={13} rx={2} fill="var(--faint)" />
            <rect x={2.5} y={12} width={4.5} height={13} rx={2} fill="var(--faint)" />
          </g>
        ) : null}
      </g>

      {/* Bong bóng tri giác neo vào ô ĐÃ NHÌN, không trượt theo robot: bước có di chuyển thì tri
          giác xảy ra ở ô cũ, để nó bám robot sang ô mới là kể sai thứ tự perceive → decide → act. */}
      {s.percept ? (
        <g transform={`translate(${bubbleX}, ${FLOOR - 52})`} opacity={moved ? 0.72 : 1}>
          <rect x={-62} y={-18} width={124} height={27} rx={13} fill="var(--panel)"
            stroke="var(--border-3)" strokeDasharray={moved ? '3 3' : undefined} />
          {(() => {
            const tx = Math.max(-56, Math.min(56, at(s.percept![0]) - bubbleX));
            return (
              <>
                <path d={`M${tx - 6},9 L${tx},17 L${tx + 6},9 z`} fill="var(--panel)" stroke="var(--border-3)" strokeDasharray={moved ? '3 3' : undefined} />
                <line x1={tx - 6} y1={9.5} x2={tx + 6} y2={9.5} stroke="var(--panel)" strokeWidth={2.5} />
              </>
            );
          })()}
          <text x={0} y={1} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={14}
            fill={s.percept[1] === 'dirty' ? 'var(--red)' : 'var(--green)'}>
            [{s.percept[0]}, {s.percept[1] === 'dirty' ? 'Dirty' : 'Clean'}]
          </text>
          <text x={0} y={-25} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11}
            fill="var(--faint-2)" letterSpacing="0.6">{moved ? 'ĐÃ THẤY Ở ĐÂY' : 'TRI GIÁC'}</text>
        </g>
      ) : (
        <text x={here} y={FLOOR - 52} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={13} fill="var(--faint-2)">
          chưa nhìn gì
        </text>
      )}
    </svg>
  );
}

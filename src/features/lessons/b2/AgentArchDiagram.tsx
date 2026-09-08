import { useState } from 'react';
import { Html } from '@/components/Html';
import { ARCH_LEVELS, LEARNING_PARTS } from '@/content/courses/csc14003/agents-data.locale';
import { T } from './lesson02.text';

/* Sơ đồ leo nấc: nấc 1–4 dùng chung MỘT khung lớn dần; nấc 5 đổi hẳn sang khung khác, vì đó
   đúng là điều xảy ra trong sơ đồ gốc — cả con agent bốn nấc bị co lại thành một hộp. */

interface Level { n: number; id: string; name: string; en: string; color: string; adds: string; body: string; limit: string | null }

const FONT = 'var(--font-mono)';

function Box({ x, y, w, h, label, on, fresh, rx = 4 }: {
  x: number; y: number; w: number; h: number; label: string[]; on: boolean; fresh: boolean; rx?: number;
}) {
  const stroke = fresh ? 'var(--yellow)' : on ? 'var(--faint)' : 'var(--border-2)';
  const fill = fresh ? 'color-mix(in srgb, var(--yellow) 14%, var(--panel-2))' : 'var(--panel-2)';
  const color = fresh ? 'var(--yellow)' : on ? 'var(--text-2)' : 'var(--border-3)';
  return (
    <g opacity={on ? 1 : 0.25}>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={fresh ? 1.6 : 1} />
      {label.map((line, i) => (
        <text key={line} x={x + w / 2} y={y + h / 2 - (label.length - 1) * 7 + i * 14 + 4}
          textAnchor="middle" fontFamily={FONT} fontSize={10.5} fill={color}>{line}</text>
      ))}
    </g>
  );
}

function Arrow({ d, on, fresh, label, lx, ly }: { d: string; on: boolean; fresh?: boolean; label?: string; lx?: number; ly?: number }) {
  const c = fresh ? 'var(--yellow)' : on ? 'var(--faint)' : 'var(--border-2)';
  return (
    <g opacity={on ? 1 : 0.25}>
      <path d={d} fill="none" stroke={c} strokeWidth={1.3} markerEnd={fresh ? 'url(#ah-hot)' : 'url(#ah)'} />
      {label ? <text x={lx} y={ly} fontFamily={FONT} fontSize={9.5} fill={c} textAnchor="middle">{label}</text> : null}
    </g>
  );
}

function Defs() {
  return (
    <defs>
      <marker id="ah" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 z" fill="var(--faint)" />
      </marker>
      <marker id="ah-hot" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 z" fill="var(--yellow)" />
      </marker>
    </defs>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Defs />
      <rect x={8} y={8} width={676} height={384} rx={16} fill="var(--panel)" stroke="var(--border-2)" />
      <text x={26} y={382} fontFamily="var(--font-serif)" fontSize={15} fill="var(--faint-2)" fontStyle="italic">Agent</text>
      <rect x={700} y={8} width={52} height={384} rx={16} fill="var(--panel-2)" stroke="var(--border-2)" />
      <text x={726} y={200} fontFamily="var(--font-serif)" fontSize={12} fill="var(--muted)" textAnchor="middle"
        transform="rotate(90 726 200)">{T.agentarchdiagram.s1}</text>
      {children}
    </>
  );
}

/* ---- Nấc 1–4 ---- */
function Diagram14({ n }: { n: number }) {
  // Hộp cột giữa: chỉ hộp nào tới nấc mới hiện, spine tự nối các hộp đang hiện.
  const centers = [
    { id: 'now', y: 70, from: 1, label: [T.agentarchdiagram.s2, T.agentarchdiagram.s3] },
    { id: 'next', y: 145, from: 3, label: [T.agentarchdiagram.s4, T.agentarchdiagram.s5] },
    { id: 'happy', y: 220, from: 4, label: [T.agentarchdiagram.s6, T.agentarchdiagram.s7] },
    { id: 'act', y: 300, from: 1, label: [T.agentarchdiagram.s8, T.agentarchdiagram.s9] },
  ];
  const CX = 600, CW = 170, CH = 42, CL = CX - CW / 2;
  const visible = centers.filter((c) => n >= c.from);

  const pills = [
    { id: 'state', y: 70, from: 2, to: 9, label: [T.agentarchdiagram.s10] },
    { id: 'evolve', y: 112, from: 2, to: 9, label: [T.agentarchdiagram.s11] },
    { id: 'myact', y: 154, from: 2, to: 9, label: [T.agentarchdiagram.s12] },
    { id: 'goals', y: 210, from: 3, to: 9, label: [T.agentarchdiagram.s13] },
    { id: 'util', y: 252, from: 4, to: 9, label: [T.agentarchdiagram.s14] },
    { id: 'rules', y: 300, from: 1, to: 2, label: [T.agentarchdiagram.s15] },
  ];
  const PX = 40, PW = 215, PH = 32;

  return (
    <Shell>
      {/* cảm biến / bộ chấp hành */}
      <text x={600} y={44} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={13} fill="var(--muted)">{T.agentarchdiagram.s16}</text>
      <text x={600} y={366} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={13} fill="var(--muted)">{T.agentarchdiagram.s17}</text>
      <Arrow d="M700,40 L634,40" on />
      <Arrow d="M632,362 L700,362" on />
      <Arrow d={`M600,50 L600,${70 - 4}`} on />
      <Arrow d={`M600,342 L600,${356}`} on />

      {/* spine */}
      {visible.map((c, i) => {
        const nx = visible[i + 1];
        if (!nx) return null;
        return <Arrow key={c.id} d={`M${CX},${c.y + CH} L${CX},${nx.y - 4}`} on fresh={nx.from === n} />;
      })}

      {centers.map((c) => (
        <Box key={c.id} x={CL} y={c.y} w={CW} h={CH} label={c.label} on={n >= c.from} fresh={c.from === n} />
      ))}

      {pills.map((p) => {
        const on = n >= p.from && n < p.to;
        return <Box key={p.id} x={PX} y={p.y} w={PW} h={PH} label={p.label} on={on} fresh={on && p.from === n} rx={16} />;
      })}

      {/* nhánh phụ */}
      <Arrow d={`M${PX + PW},86 L${CL - 4},86`} on={n >= 2} fresh={n === 2} />
      <Arrow d={`M${PX + PW},128 L${CL - 4},96`} on={n >= 2} fresh={n === 2} />
      <Arrow d={`M${PX + PW},170 L${CL - 4},${n >= 3 ? 160 : 100}`} on={n >= 2} fresh={n === 2} />
      <Arrow d={`M${PX + PW},226 L${CL - 4},166`} on={n >= 3} fresh={n === 3} />
      <Arrow d={`M${PX + PW},268 L${CL - 4},241`} on={n >= 4} fresh={n === 4} />
      <Arrow d={`M${PX + PW},316 L${CL - 4},316`} on={n <= 2} />
      {/* vòng hồi tiếp về trạng thái */}
      <Arrow d={`M${CL + 20},70 C${CL - 60},30 ${PX + 120},20 ${PX + 107},${70 - 4}`} on={n >= 2} fresh={n === 2} />
    </Shell>
  );
}

/* ---- Nấc 5 ---- */
function Diagram5() {
  return (
    <Shell>
      <text x={600} y={62} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={13} fill="var(--muted)">{T.agentarchdiagram.s18}</text>
      <text x={600} y={360} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={13} fill="var(--muted)">{T.agentarchdiagram.s19}</text>
      <Arrow d="M700,58 L634,58" on />
      <Arrow d="M632,356 L700,356" on />

      <text x={170} y={26} textAnchor="middle" fontFamily={FONT} fontSize={10} fill="var(--muted)">{T.agentarchdiagram.s20}</text>
      <Arrow d="M170,32 L170,44" on />

      <Box x={90} y={48} w={160} h={44} label={[T.agentarchdiagram.s21, 'Critic']} on fresh />
      <Box x={90} y={175} w={160} h={50} label={[T.agentarchdiagram.s22, 'Learning element']} on fresh />
      <Box x={440} y={175} w={200} h={50} label={[T.agentarchdiagram.s23, 'Performance element']} on fresh={false} />
      <Box x={90} y={300} w={160} h={50} label={[T.agentarchdiagram.s24, 'Problem generator']} on fresh />

      <Arrow d="M575,58 L254,66" on label={T.agentarchdiagram.s25} lx={410} ly={54} />
      <Arrow d="M170,92 L170,171" on label={T.agentarchdiagram.s26} lx={210} ly={136} />
      <Arrow d="M254,188 L436,188" on label={T.agentarchdiagram.s27} lx={345} ly={180} />
      <Arrow d="M436,214 L254,214" on label={T.agentarchdiagram.s28} lx={345} ly={230} />
      <Arrow d="M170,225 L170,296" on label={T.agentarchdiagram.s29} lx={222} ly={266} />
      <Arrow d="M254,318 L436,228" on />
      <Arrow d="M600,70 L560,171" on />
      <Arrow d="M560,225 L598,348" on />
    </Shell>
  );
}

export function AgentArchDiagram() {
  const [n, setN] = useState(1);
  const lv = (ARCH_LEVELS as Level[]).find((l) => l.n === n)!;

  return (
    <div className="card" style={{ padding: '20px 22px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{T.agentarchdiagram.s30}</span>
        <span style={{ color: 'var(--faint)', fontSize: 12.5, fontStyle: 'italic' }}>
          {T.agentarchdiagram.s31}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
        {(ARCH_LEVELS as Level[]).map((l) => (
          <button key={l.n} type="button" onClick={() => setN(l.n)}
            className={'btn' + (n === l.n ? ' btn--toggle-on' : '')}>
            {l.n} · {l.name}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 14, borderRadius: 12, border: '1px solid var(--border-2)', overflow: 'hidden' }}>
        <svg viewBox="0 0 760 400" style={{ width: '100%', display: 'block' }} role="img"
          aria-label={T.fn.archAria(n, lv.name)}>
          {n === 5 ? <Diagram5 /> : <Diagram14 n={n} />}
        </svg>
      </div>

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontSize: 11, color: lv.color, fontWeight: 700 }}>{T.fn.level(lv.n)}</span>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{lv.name}</span>
        <span style={{ color: 'var(--faint)', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontSize: 13.5 }}>{lv.en}</span>
        <span className="chip chip--mono" style={{ fontSize: 11, color: 'var(--yellow)', borderColor: 'color-mix(in srgb, var(--yellow) 40%, transparent)' }}>
          + {lv.adds}
        </span>
      </div>
      <Html as="p" t={lv.body} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.72, margin: '10px 0 0', maxWidth: 820 }} />
      {lv.limit ? (
        <div className="panel-inner" style={{ marginTop: 12, borderColor: 'color-mix(in srgb, var(--red) 28%, transparent)' }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--red)', letterSpacing: '0.7px' }}>{T.agentarchdiagram.s32}</span>
          <Html as="p" t={lv.limit} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '7px 0 0' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', gap: 12, marginTop: 14 }}>
          {(LEARNING_PARTS as { k: string; en: string; color: string; what: string; taxi: string }[]).map((p) => (
            <div key={p.k} className="panel-inner">
              <div className="mono" style={{ fontSize: 10.5, color: p.color, letterSpacing: '0.7px' }}>{p.k}</div>
              <div style={{ fontSize: 11.5, color: 'var(--faint)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>{p.en}</div>
              <Html as="p" t={p.what} style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.65, margin: '8px 0 0' }} />
              <Html as="p" t={T.agentarchdiagram.s33 + p.taxi} style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.6, margin: '7px 0 0' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

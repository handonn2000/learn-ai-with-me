import { useMemo, useState } from 'react';
import { Html } from '@/components/Html';
import { prefersReducedMotion as rm } from '@/lib/motion';
import { compareFinal, MEASURES, PRESETS, PROGRAMS, runVacuum, STEPS, WORLDS } from '@/content/courses/csc14003/vacuum-world.js';
import { VacuumRoom } from './VacuumRoom';

interface Step {
  t: number; loc: string; world: Record<string, string>;
  percept: [string, string] | null; action: string | null;
  belief: Record<string, string | null>;
  score: { clean: number; clean_move: number; dirt: number };
  gained: { clean: number; clean_move: number; dirt: number } | null;
  note: string;
}


const ACTION_VN: Record<string, string> = {
  Suck: 'Suck · hút',
  Left: 'Left · sang trái',
  Right: 'Right · sang phải',
  NoOp: 'NoOp · đứng yên',
};

/** Màu băng hành động — cũng là bảng chú giải, nên giữ một chỗ duy nhất. */
const ACTION_TONE: Record<string, { c: string; vn: string }> = {
  Suck: { c: 'var(--green)', vn: 'hút' },
  Left: { c: 'var(--cyan)', vn: 'di chuyển' },
  Right: { c: 'var(--cyan)', vn: 'di chuyển' },
  NoOp: { c: 'var(--faint-2)', vn: 'đứng yên' },
};

/** Băng hành động: 20 bước nằm cạnh nhau, nhìn phát ra ngay cả bài của chương trình. */
function ActionTape({ trace, t, onPick }: { trace: Step[]; t: number; onPick: (i: number) => void }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: '0.7px' }}>BĂNG HÀNH ĐỘNG · BẤM ĐỂ NHẢY TỚI BƯỚC BẤT KỲ</span>
        <span style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[['var(--green)', 'hút'], ['var(--cyan)', 'di chuyển'], ['var(--faint-2)', 'đứng yên']].map(([c, l]) => (
            <span key={l} className="mono" style={{ fontSize: 10, color: 'var(--faint)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: c }} />{l}
            </span>
          ))}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 3, marginTop: 7, overflowX: 'auto', paddingBottom: 4 }}>
        {trace.map((st) => {
          const tone = st.action ? ACTION_TONE[st.action].c : 'var(--border-2)';
          const on = st.t === t;
          return (
            <button key={st.t} type="button" onClick={() => onPick(st.t)}
              title={`Bước ${st.t}${st.action ? ' · ' + ACTION_VN[st.action] : ''}`}
              style={{
                flex: '0 0 auto', width: 17, height: 34, padding: 0, cursor: 'pointer',
                borderRadius: 4, background: on ? tone : `color-mix(in srgb, ${tone} 30%, transparent)`,
                border: on ? '1.5px solid var(--text-hi)' : '1px solid transparent',
              }} />
          );
        })}
      </div>
    </div>
  );
}

/** Chuỗi tri giác — chính là 𝓟* của mục 02, vẽ ra cho thấy được. */
function PerceptTape({ trace, t }: { trace: Step[]; t: number }) {
  const seen = trace.slice(1, t + 1);
  const shown = seen.slice(-8);
  return (
    <div className="panel-inner" style={{ marginTop: 12 }}>
      <div className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: '0.7px' }}>
        CHUỖI TRI GIÁC ĐÃ NHẬN · {seen.length} tri giác
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', alignItems: 'center', minHeight: 26 }}>
        {seen.length === 0 ? (
          <span style={{ fontSize: 12.5, color: 'var(--faint-2)', fontStyle: 'italic' }}>chưa có gì — máy vừa bật</span>
        ) : (
          <>
            {seen.length > shown.length ? <span className="mono" style={{ fontSize: 11, color: 'var(--faint-2)' }}>…</span> : null}
            {shown.map((st) => {
              const dirty = st.percept![1] === 'dirty';
              const on = st.t === t;
              return (
                <span key={st.t} className="mono" style={{
                  fontSize: 11, padding: '3px 7px', borderRadius: 6,
                  color: on ? 'var(--text-hi)' : dirty ? 'var(--red)' : 'var(--green)',
                  border: `1px solid ${on ? 'var(--text-hi)' : 'var(--border-2)'}`,
                  background: on ? 'color-mix(in srgb, var(--cyan) 12%, transparent)' : 'transparent',
                }}>[{st.percept![0]},{dirty ? 'D' : 'C'}]</span>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export function VacuumLab() {
  const [programId, setProgramId] = useState('reflex');
  const [worldId, setWorldId] = useState('w2');
  const [presetId, setPresetId] = useState('dirty-all');
  const [t, setT] = useState(0);

  const run = useMemo(() => runVacuum(programId, worldId, presetId), [programId, worldId, presetId]);
  const trace = run.trace as Step[];
  const cells = run.cells as string[];
  const finals = useMemo(() => compareFinal(worldId, presetId), [worldId, presetId]);
  const s = trace[Math.min(t, trace.length - 1)];
  const prev = t > 0 ? trace[t - 1] : null;
  const program = PROGRAMS.find((p) => p.id === programId)!;

  const pick = (setter: (v: string) => void) => (v: string) => { setter(v); setT(0); };

  return (
    <div className="card" style={{ padding: '20px 22px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Lab · thế giới hút bụi {cells.length} ô</span>
        <span style={{ color: 'var(--faint)', fontSize: 12.5, fontStyle: 'italic' }}>
          cùng một chuỗi hành động, ba thước đo chấm song song
        </span>
      </div>

      {/* Bộ chọn */}
      <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: '0.7px', minWidth: 92 }}>CHƯƠNG TRÌNH</span>
          {PROGRAMS.map((p: { id: string; name: string }) => (
            <button key={p.id} type="button" onClick={() => pick(setProgramId)(p.id)}
              className={'btn' + (programId === p.id ? ' btn--toggle-on' : '')}>{p.name}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: '0.7px', minWidth: 92 }}>THẾ GIỚI</span>
          {WORLDS.map((w: { id: string; label: string }) => (
            <button key={w.id} type="button" onClick={() => pick(setWorldId)(w.id)}
              className={'btn' + (worldId === w.id ? ' btn--toggle-on' : '')}>{w.label}</button>
          ))}
          <span style={{ fontSize: 12, color: 'var(--faint)' }}>
            {worldId === 'w2' ? 'bản gốc — A và B' : 'hành lang A · B · C · D, vẫn đúng bốn hành động cũ'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: '0.7px', minWidth: 92 }}>SÀN LÚC ĐẦU</span>
          {PRESETS.map((p: { id: string; label: string }) => (
            <button key={p.id} type="button" onClick={() => pick(setPresetId)(p.id)}
              className={'btn' + (presetId === p.id ? ' btn--toggle-on' : '')}>{p.label}</button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 12, lineHeight: 1.6 }}>{program.blurb}</div>

      {/* Căn phòng + thước đo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 16, marginTop: 14 }}>
        <div>
          <div style={{ borderRadius: 12, border: '1px solid var(--border-2)', background: 'var(--panel)', padding: '6px 8px 2px' }}>
            <VacuumRoom s={s} prev={prev} rm={rm} memo={programId === 'memo'} cells={cells} />
          </div>
          <div className="panel-inner" style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <span className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: '0.7px' }}>HÀNH ĐỘNG BƯỚC NÀY</span>
            <span className="mono" style={{ fontSize: 12, color: s.action ? ACTION_TONE[s.action].c : 'var(--faint-2)' }}>
              {s.action ? ACTION_VN[s.action] : '— chưa chạy'}
            </span>
          </div>
          <PerceptTape trace={trace} t={t} />
        </div>

        {/* Ba thước đo */}
        <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
          {MEASURES.map((m: { id: string; label: string; note: string }) => {
            const v = s.score[m.id as keyof Step['score']];
            const g = s.gained ? s.gained[m.id as keyof Step['score']] : null;
            return (
              <div key={m.id} className="panel-inner" style={{ padding: '10px 13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--text-2)' }}>{m.label}</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-hi)' }}>
                    {v}
                    {g ? (
                      <span className="mono" style={{ fontSize: 11, fontWeight: 400, marginLeft: 6, color: g > 0 ? 'var(--green)' : 'var(--red)' }}>
                        {g > 0 ? `+${g}` : g}
                      </span>
                    ) : null}
                  </span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 2 }}>{m.note}</div>
              </div>
            );
          })}
          <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6, minHeight: 40, marginTop: 2 }}>{s.note}</div>
        </div>
      </div>

      {/* Điều khiển */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 14 }}>
        <button type="button" className="btn" onClick={() => setT(0)} disabled={t === 0}>↺ Về đầu</button>
        <button type="button" className="btn" onClick={() => setT((x) => Math.max(0, x - 1))} disabled={t === 0}>← Lùi</button>
        <button type="button" className="btn btn--primary" onClick={() => setT((x) => Math.min(STEPS, x + 1))} disabled={t >= STEPS}>Tiến →</button>
        <button type="button" className="btn" onClick={() => setT(STEPS)} disabled={t >= STEPS}>Tới cuối ⇥</button>
        <span className="mono" style={{ fontSize: 11.5, color: 'var(--faint)' }}>BƯỚC {s.t} / {STEPS}</span>
      </div>

      <ActionTape trace={trace} t={t} onPick={setT} />

      {/* Điểm cuối của cả hai chương trình */}
      <div style={{ marginTop: 16, overflowX: 'auto' }}>
        <table className="dtable" style={{ minWidth: 460 }}>
          <tbody>
            <tr className="dtable__head">
              <td>ĐIỂM SAU {STEPS} BƯỚC</td>
              {MEASURES.map((m: { id: string; label: string }) => <td key={m.id}>{m.label}</td>)}
            </tr>
            {finals.map((f: { programId: string; name: string; score: Step['score'] }) => (
              <tr key={f.programId}>
                <td style={{ color: f.programId === programId ? 'var(--cyan)' : 'var(--muted)', fontWeight: f.programId === programId ? 600 : 400 }}>
                  {f.name}
                </td>
                {MEASURES.map((m: { id: string }) => {
                  const mine = f.score[m.id as keyof Step['score']];
                  const other = finals.find((o: { programId: string }) => o.programId !== f.programId)!.score[m.id as keyof Step['score']];
                  return (
                    <td key={m.id} className="mono" style={{ color: mine > other ? 'var(--green)' : mine < other ? 'var(--red)' : 'var(--text-2)', fontWeight: mine === other ? 400 : 700 }}>
                      {mine}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Html as="p" t="Bảng này chấm cả hai chương trình trên đúng sàn nhà bạn đang chọn, nên bạn không cần bấm đi bấm lại mới so được. Ô xanh là đứa thắng ở thước đó, ô đỏ là đứa thua — và <strong class='hl'>chú ý cột nào hòa, cột nào không</strong>."
        style={{ fontSize: 12.5, color: 'var(--muted)', margin: '10px 0 0', lineHeight: 1.6 }} />
    </div>
  );
}

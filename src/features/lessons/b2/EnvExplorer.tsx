import { useState } from 'react';
import { Html } from '@/components/Html';
import { DIMS, ENVIRONMENTS } from '@/content/courses/csc14003/agents-data.locale';
import { T } from './lesson02.text';

interface Dim { id: string; vn: string; en: string; left: string; right: string; leftEn: string; rightEn: string; mid?: string; midEn?: string }
interface Env { id: string; label: string; en: string; v: Record<string, 'l' | 'm' | 'r'>; note: string }

function Side({ vn, en, active, tone }: { vn: string; en: string; active: boolean; tone: string }) {
  return (
    <div style={{
      flex: 1, minWidth: 92, borderRadius: 9, padding: '7px 10px', textAlign: 'center',
      border: active ? `1.5px solid ${tone}` : '1px solid var(--border-2)',
      background: active ? `color-mix(in srgb, ${tone} 13%, transparent)` : 'transparent',
    }}>
      <div style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? tone : 'var(--faint-2)' }}>{vn}</div>
      <div className="mono" style={{ fontSize: 9.5, color: active ? 'var(--muted)' : 'var(--border-3)', marginTop: 1 }}>{en}</div>
    </div>
  );
}

export function EnvExplorer() {
  const [id, setId] = useState('crossword');
  const env = (ENVIRONMENTS as Env[]).find((e) => e.id === id)!;

  return (
    <div className="card" style={{ padding: '20px 22px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>{T.envexplorer.s1}</span>
        <span style={{ color: 'var(--faint)', fontSize: 12.5, fontStyle: 'italic' }}>{T.envexplorer.s2}</span>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
        {(ENVIRONMENTS as Env[]).map((e) => (
          <button key={e.id} type="button" onClick={() => setId(e.id)}
            className={'btn' + (id === e.id ? ' btn--toggle-on' : '')}>{e.label}</button>
        ))}
      </div>

      <div className="mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 14, letterSpacing: '0.5px' }}>
        {env.label.toUpperCase()} · {env.en}
      </div>

      <div style={{ display: 'grid', gap: 8, marginTop: 10 }}>
        {(DIMS as Dim[]).map((d) => {
          const v = env.v[d.id];
          const tone = v === 'l' ? 'var(--green)' : v === 'm' ? 'var(--yellow)' : 'var(--cyan)';
          return (
            <div key={d.id} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 140px', minWidth: 120 }}>
                <div style={{ fontSize: 12.5, color: 'var(--text-2)' }}>{d.vn}</div>
                <div className="mono" style={{ fontSize: 9.5, color: 'var(--faint-2)' }}>{d.en}</div>
              </div>
              <div style={{ flex: '1 1 260px', display: 'flex', gap: 8 }}>
                <Side vn={d.left} en={d.leftEn} active={v === 'l'} tone={tone} />
                {d.mid ? <Side vn={d.mid} en={d.midEn!} active={v === 'm'} tone={tone} /> : null}
                <Side vn={d.right} en={d.rightEn} active={v === 'r'} tone={tone} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel-inner" style={{ marginTop: 14 }}>
        <Html as="p" t={env.note} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.72, margin: 0 }} />
      </div>
    </div>
  );
}

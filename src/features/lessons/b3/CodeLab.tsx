// Code Lab — pseudo-code + Python của 7 thuật toán Lab 1, tô màu bằng tokenizer của engine.
import { useMemo, useState } from 'react';
import { tokenize } from '@/features/search-lab/search-engine.js';
import { ALGOS, HELPER_PY, MAIN_PY } from '@/content/courses/csc14003/lab-searching.js';

const MONO = "'JetBrains Mono',monospace";
const TOKEN_COLORS: Record<string, string> = { kw: '#58C4DD', fn: '#F4D345', st: '#83C167', nu: '#FF9580', cm: '#7A8399', sy: '#58C4DD' };

interface Algo { id: string; name: string; vn: string; frontier: string; stop: string; pseudo: string; py: string; note: string }

export function Code({ src, style }: { src: string; style?: React.CSSProperties }) {
  const tokens = useMemo(() => tokenize(src) as { c: string; s: string }[], [src]);
  return (
    <pre className="codeblock" style={style}>
      <code>
        {tokens.map((t, i) => (
          <span key={i} style={{ color: TOKEN_COLORS[t.c] || '#E6EAF2', fontStyle: t.c === 'cm' ? 'italic' : 'normal' }}>{t.s}</span>
        ))}
      </code>
    </pre>
  );
}

export function CodeLab() {
  const algos = ALGOS as Algo[];
  const [id, setId] = useState('BFS');
  const cur = algos.find((a) => a.id === id) ?? algos[0];
  return (
    <div className="canvas-panel" style={{ borderRadius: 16 }}>
      <div style={{ padding: '13px 18px', borderBottom: '1px solid #1E2430', fontFamily: MONO, fontSize: 11, color: '#F4D345', letterSpacing: '.8px' }}>
        BÀN LÀM VIỆC — CHỌN THUẬT TOÁN, ĐỌC PSEUDO RỒI SOI PYTHON
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 172px', padding: 14, display: 'flex', flexDirection: 'column', gap: 8, borderRight: '1px solid #1E2430' }}>
          {algos.map((a) => {
            const on = id === a.id;
            return (
              <button key={a.id} onClick={() => setId(a.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, padding: '9px 12px', borderRadius: 10, width: '100%',
                border: `1px solid ${on ? '#F4D345' : '#232836'}`, background: on ? 'rgba(244,211,69,.08)' : '#12151A',
                color: on ? '#F4D345' : '#97A0B5', cursor: 'pointer', textAlign: 'left', fontFamily: MONO, fontSize: 12.5, fontWeight: 700,
              }}>
                <span>{a.id === 'ASTAR' ? 'A*' : a.id}</span>
                <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.75, fontFamily: "'Be Vietnam Pro',sans-serif" }}>{a.vn}</span>
              </button>
            );
          })}
        </div>
        <div style={{ flex: '1 1 560px', minWidth: 0, padding: '18px 20px' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#ECEFF4' }}>{cur.name} — {cur.vn}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
            <span style={{ fontFamily: MONO, fontSize: 11, color: '#9FDDEE', border: '1px solid rgba(88,196,221,.4)', borderRadius: 7, padding: '3px 8px' }}>{cur.frontier}</span>
            <span style={{ fontFamily: MONO, fontSize: 11, color: '#F4D345', border: '1px solid rgba(244,211,69,.4)', borderRadius: 7, padding: '3px 8px' }}>{cur.stop}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 14, marginTop: 16 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.6px', color: '#5C6579', marginBottom: 8 }}>PSEUDO-CODE</div>
              <Code src={cur.pseudo} style={{ fontSize: 12, padding: '14px 16px', border: '1px solid #1E2430', borderRadius: 10 }} />
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.6px', color: '#5C6579', marginBottom: 8 }}>PYTHON — KHUNG LAB 1</div>
              <Code src={cur.py} style={{ fontSize: 12, padding: '14px 16px', border: '1px solid #1E2430', borderRadius: 10 }} />
            </div>
          </div>
          <p style={{ color: '#7A8399', fontSize: 13, fontStyle: 'italic', lineHeight: 1.65, margin: '14px 0 4px' }}>{cur.note}</p>
        </div>
      </div>
    </div>
  );
}

export { HELPER_PY, MAIN_PY };

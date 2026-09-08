import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { PART_TESTS } from '@/content/courses/csc14003/part-tests.locale';
import { getCourse } from '@/content/courses';
import { useProgress } from '@/lib/useProgress';
import NotFoundPage from '@/pages/NotFoundPage';
import { topicLabel } from '@/content/courses/csc14003/topics';
import { UI } from '@/content/ui';

const mono = 'var(--font-mono)';
void mono;

function Tex({ tex }: { tex: string }) {
  const html = useMemo(() => katex.renderToString(tex, { throwOnError: false }), [tex]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function PartTestPage() {
  const { slug } = useParams();
  const course = getCourse(slug);
  const { hash } = useLocation();
  // #p1..#pN chọn tab ban đầu (vị trí — không phải khóa lưu trữ)
  const m = /p(\d+)/.exec(hash);
  const initialPart = m ? Math.min(PART_TESTS.length - 1, Math.max(0, Number(m[1]) - 1)) : 0;
  const [part, setPart] = useState(initialPart);
  // picks[part][questionIndex] = optionIndex
  const [picks, setPicks] = useState<Record<number, Record<number, number>>>(() =>
    Object.fromEntries(PART_TESTS.map((_, i) => [i, {}])));
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const { db, update } = useProgress(slug);

  if (!course) return <NotFoundPage />;
  // The existing question bank belongs to CSC14003. Never expose it under another course.
  if (!course.hasPartTests || course.slug !== 'csc14003') return (
    <div className="container container--narrow" style={{ padding: '36px 24px 100px' }}>
      <Link to={`/courses/${course.slug}`}>{UI.plan.back}</Link>
      <h1>{course.title} {course.titleAccent}</h1>
      <p>{UI.plan.testsUnavailable}</p>
    </div>
  );
  const P = PART_TESTS[part];
  const partId = course.parts[part]?.id;
  const pk = picks[part];
  const answered = Object.keys(pk).length;
  const total = P.qs.length;
  const correct = P.qs.filter((q, i) => pk[i] === q.a).length;
  const score = Math.round((correct / total) * 100);
  const rightT = [...new Set(P.qs.filter((q, i) => pk[i] === q.a).map((q) => q.topicId))];
  const wrongT = [...new Set(P.qs.filter((q, i) => pk[i] != null && pk[i] !== q.a).map((q) => q.topicId))];

  const save = () => {
    if (answered < total || !partId) return;
    update((d) => {
      if (!d.partTests) d.partTests = {};
      d.partTests[partId] = { score, correct, total, right: rightT, wrong: wrongT, at: new Date().toISOString() };
    });
    setSaved((s) => ({ ...s, [part]: true }));
  };

  return (
    <div className="container container--narrow" style={{ padding: '36px 24px 100px' }}>
      <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
          <Link to={`/courses/${course.slug}`} className="mono" style={{ fontSize: 12 }}>{UI.test.back}</Link>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.1em' }}>{UI.test.closedBook}</div>
        </div>
        <h1 style={{ margin: '14px 0 4px', fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 700 }}>
          {UI.test.titleA}<em style={{ color: 'var(--cyan)' }}>{UI.test.titleAccent}</em>{UI.test.titleB}
        </h1>
        <div style={{ fontSize: 14.5, color: 'var(--muted-2)', lineHeight: 1.6 }}>
          {UI.test.lead}
        </div>
      </header>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20 }}>
        {PART_TESTS.map((p, i) => {
          const sv = (db.partTests || {})[course.parts[i]?.id ?? ''];
          const active = part === i;
          return (
            <button key={i} onClick={() => setPart(i)} style={{
              border: `1.5px solid ${active ? p.colorVar : 'var(--border)'}`,
              background: active ? p.colorVar : 'var(--panel)',
              color: active ? 'var(--on-accent)' : 'var(--text-2)',
              borderRadius: 9, padding: '10px 16px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
              display: 'flex', gap: 8, alignItems: 'center', fontFamily: 'inherit',
            }}>
              <span className="mono" style={{ fontSize: 10.5, opacity: 0.8 }}>P{i + 1}</span>{p.tabLabel}
              {sv ? (
                <span className="mono" style={{
                  fontSize: 11, borderRadius: 4, padding: '2px 7px',
                  background: active ? 'rgba(0,0,0,.15)' : `color-mix(in srgb, ${sv.score >= 85 ? 'var(--green)' : 'var(--yellow)'} 14%, transparent)`,
                  color: active ? 'var(--on-accent)' : sv.score >= 85 ? 'var(--green)' : 'var(--yellow)',
                }}>{sv.score}%</span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderLeft: `4px solid ${P.colorVar}`, borderRadius: 12, padding: '16px 20px', marginTop: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{P.title}</div>
        <div style={{ fontSize: 13, color: 'var(--muted-2)', marginTop: 4, lineHeight: 1.6 }}>{P.desc}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 18 }}>
        {P.qs.map((q, i) => {
          const picked = pk[i];
          const done = picked != null;
          return (
            <div key={i} style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)' }}>{i + 1}/{total}</span>
                <span className="mono" style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', color: P.colorVar, background: `color-mix(in srgb, ${P.colorVar} 12%, transparent)`, borderRadius: 4, padding: '2px 8px' }}>{topicLabel(q.topicId)}</span>
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.55, marginTop: 8 }}>{q.q}</div>
              {q.tex ? <div style={{ marginTop: 8, fontSize: 16 }}><Tex tex={q.tex} /></div> : null}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                {q.opts.map((label, j) => {
                  const isAns = done && j === q.a;
                  const isPick = done && picked === j && j !== q.a;
                  return (
                    <button key={j}
                      onClick={() => { if (pk[i] == null) setPicks((s) => ({ ...s, [part]: { ...s[part], [i]: j } })); }}
                      style={{
                        textAlign: 'left', borderRadius: 8, padding: '10px 14px', fontSize: 13.5, lineHeight: 1.5, cursor: done ? 'default' : 'pointer', fontFamily: 'inherit',
                        border: `1.5px solid ${isAns ? 'var(--green)' : isPick ? 'var(--red)' : 'var(--border)'}`,
                        background: isAns ? 'color-mix(in srgb, var(--green) 10%, transparent)' : isPick ? 'color-mix(in srgb, var(--red) 10%, transparent)' : 'var(--panel)',
                        color: done && !isAns && !isPick ? 'var(--faint)' : 'var(--text)',
                      }}>
                      {String.fromCharCode(65 + j)}. {label}
                    </button>
                  );
                })}
              </div>
              {done ? (
                <div style={{
                  marginTop: 10, borderRadius: 8, padding: '11px 14px', fontSize: 13, lineHeight: 1.6,
                  background: picked === q.a ? 'color-mix(in srgb, var(--green) 10%, transparent)' : 'color-mix(in srgb, var(--red) 10%, transparent)',
                  border: `1px solid ${picked === q.a ? 'color-mix(in srgb, var(--green) 40%, transparent)' : 'color-mix(in srgb, var(--red) 40%, transparent)'}`,
                }}>
                  {(picked === q.a ? UI.test.correct : UI.test.incorrect(String.fromCharCode(65 + q.a))) + q.ex}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={save} style={{
          border: 'none', background: answered < total ? 'var(--border-3)' : P.colorVar,
          color: answered < total ? 'var(--muted-2)' : 'var(--on-accent)',
          borderRadius: 9, padding: '12px 22px', fontSize: 14.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          {saved[part] ? UI.test.savedBtn : UI.test.saveBtn}
        </button>
        <span style={{ fontSize: 13, color: 'var(--muted-2)' }}>
          {answered < total ? UI.test.answered(answered, total) : UI.test.finished(total, correct)}
        </span>
      </div>

      {saved[part] ? (
        <div style={{ marginTop: 16, background: 'var(--panel)', border: '1px solid var(--border)', borderLeft: '4px solid var(--green)', borderRadius: 12, padding: '18px 20px', fontSize: 13.5, lineHeight: 1.7 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700 }}>{UI.test.result(score, correct, total)}</div>
          <div style={{ marginTop: 6 }}><span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.08em', color: 'var(--green)', fontWeight: 600 }}>{UI.test.solid}</span>{rightT.length ? rightT.map(topicLabel).join(' · ') : UI.test.none}</div>
          <div><span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.08em', color: 'var(--red)', fontWeight: 600 }}>{UI.test.weak}</span>{wrongT.length ? wrongT.map(topicLabel).join(' · ') + UI.test.gapsSuffix : UI.test.noGaps}</div>
          <div><span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.08em', color: 'var(--cyan)', fontWeight: 600 }}>{UI.test.hint}</span>
            {score < 60 ? UI.test.tipLow : score < 85 ? UI.test.tipMid : UI.test.tipHigh}
          </div>
        </div>
      ) : null}
    </div>
  );
}

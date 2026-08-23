import { useMemo, useState } from 'react';
import { Html } from '@/components/Html';
import { SESSION_QUIZZES } from '@/content/courses/csc14003/session-quizzes.js';
import { quizTip, scoreColorVar } from '@/lib/spaced-repetition';
import { useProgress } from '@/lib/useProgress';

/* Quiz cuối buổi — dùng chung cho mọi trang bài học, nên nằm ở components/ chứ không trong
   feature nào. Đây là chỗ DUY NHẤT ghi sessions[<id>].quizScore / quizRight / quizWrong;
   trang Lộ trình đọc lại ba trường đó để dựng báo cáo mạnh/yếu. Ngưỡng màu và lời khuyên lấy
   từ spaced-repetition.ts để nhất quán với bài Kiểm tra tổng hợp. */

interface QuizQ { topic: string; q: string; opts: string[]; a: number; ex: string }

export function SessionQuiz({ sessionId, color = 'var(--cyan)' }: { sessionId: string; color?: string }) {
  const qs = (SESSION_QUIZZES as Record<string, QuizQ[]>)[sessionId] || [];
  const { db, update } = useProgress();
  const saved = db.sessions[sessionId] || {};

  const [picked, setPicked] = useState<(number | null)[]>(() => qs.map(() => null));
  const [qi, setQi] = useState(0);
  const [started, setStarted] = useState(false);

  const answered = picked.filter((p) => p != null).length;
  const done = qs.length > 0 && answered === qs.length;

  const result = useMemo(() => {
    const correct = qs.filter((q, i) => picked[i] === q.a).length;
    return {
      correct,
      score: qs.length ? Math.round((correct / qs.length) * 100) : 0,
      right: [...new Set(qs.filter((q, i) => picked[i] === q.a).map((q) => q.topic))],
      wrong: [...new Set(qs.filter((q, i) => picked[i] != null && picked[i] !== q.a).map((q) => q.topic))],
    };
  }, [qs, picked]);

  if (!qs.length) return null;

  function choose(k: number) {
    if (picked[qi] != null) return; // đã chọn thì khóa — không cho đổi để điểm là lần trả lời đầu
    const next = [...picked];
    next[qi] = k;
    setPicked(next);
    setStarted(true);

    if (next.filter((p) => p != null).length === qs.length) {
      const correct = qs.filter((q, i) => next[i] === q.a).length;
      const score = Math.round((correct / qs.length) * 100);
      const right = [...new Set(qs.filter((q, i) => next[i] === q.a).map((q) => q.topic))];
      const wrong = [...new Set(qs.filter((q, i) => next[i] != null && next[i] !== q.a).map((q) => q.topic))];
      update((d) => {
        const r = d.sessions[sessionId] || (d.sessions[sessionId] = {});
        r.quizScore = score;
        r.quizRight = right;
        r.quizWrong = wrong;
      });
    }
  }

  function restart() {
    setPicked(qs.map(() => null));
    setQi(0);
    setStarted(true);
  }

  const q = qs[qi];
  const pick = picked[qi];

  return (
    <div className="card" style={{ padding: '20px 22px 22px', borderColor: `color-mix(in srgb, ${color} 30%, transparent)` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Quiz {qs.length} câu</span>
        <span style={{ color: 'var(--faint)', fontSize: 12.5, fontStyle: 'italic' }}>
          chấm theo chủ đề — điểm ghi vào trang Lộ trình
        </span>
        <div style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 11.5, color: 'var(--faint)' }}>ĐÃ TRẢ LỜI {answered}/{qs.length}</span>
      </div>

      {/* Kết quả lần trước — chỉ hiện khi chưa động vào lượt mới */}
      {!started && typeof saved.quizScore === 'number' ? (
        <div className="panel-inner" style={{ marginTop: 14, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--faint)', letterSpacing: '0.7px' }}>LẦN TRƯỚC</span>
          <span style={{ fontSize: 20, fontWeight: 700, color: scoreColorVar(saved.quizScore) }}>{saved.quizScore}%</span>
          {saved.quizWrong?.length ? (
            <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>hổng: {saved.quizWrong.join(' · ')}</span>
          ) : (
            <span style={{ fontSize: 12.5, color: 'var(--green)' }}>không sai chủ đề nào</span>
          )}
        </div>
      ) : null}

      {/* Vạch tiến độ từng câu */}
      <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
        {qs.map((item, i) => {
          const p = picked[i];
          const tone = p == null ? 'var(--border-2)' : p === item.a ? 'var(--green)' : 'var(--red)';
          return (
            <button key={item.q} type="button" onClick={() => setQi(i)} title={`Câu ${i + 1} · ${item.topic}`}
              style={{
                flex: 1, height: 6, minWidth: 0, padding: 0, borderRadius: 3, cursor: 'pointer',
                background: tone, border: i === qi ? '1px solid var(--text-hi)' : '1px solid transparent',
              }} />
          );
        })}
      </div>

      {/* Câu hỏi */}
      <div style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', color, background: `color-mix(in srgb, ${color} 12%, transparent)`, borderRadius: 4, padding: '2px 8px' }}>
            {q.topic}
          </span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--faint-2)' }}>CÂU {qi + 1}</span>
        </div>
        <Html as="p" t={q.q} style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-hi)', margin: '12px 0 0', fontWeight: 600 }} />

        <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>
          {q.opts.map((opt, k) => {
            const isAnswer = k === q.a;
            const chosen = pick === k;
            const reveal = pick != null;
            const bd = reveal && isAnswer ? 'var(--green)' : reveal && chosen ? 'var(--red)' : 'var(--border-3)';
            return (
              <button key={opt} type="button" onClick={() => choose(k)} disabled={reveal}
                style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left', width: '100%',
                  minHeight: 44, padding: '11px 14px', borderRadius: 10, cursor: reveal ? 'default' : 'pointer',
                  border: `1px solid ${bd}`, fontFamily: 'inherit', fontSize: 13.5, lineHeight: 1.55,
                  background: reveal && isAnswer ? 'color-mix(in srgb, var(--green) 8%, transparent)'
                    : reveal && chosen ? 'color-mix(in srgb, var(--red) 8%, transparent)' : 'var(--panel)',
                  color: reveal && (isAnswer || chosen) ? 'var(--text-hi)' : 'var(--text-2)',
                }}>
                <span className="mono" style={{ fontSize: 11.5, color: reveal && isAnswer ? 'var(--green)' : reveal && chosen ? 'var(--red)' : 'var(--faint)', flex: '0 0 auto', paddingTop: 1 }}>
                  {reveal && isAnswer ? '✓' : reveal && chosen ? '✗' : String.fromCharCode(65 + k)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {pick != null ? (
          <div className="panel-inner" style={{ marginTop: 12, borderColor: `color-mix(in srgb, ${pick === q.a ? 'var(--green)' : 'var(--red)'} 30%, transparent)` }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '0.7px', color: pick === q.a ? 'var(--green)' : 'var(--red)' }}>
              {pick === q.a ? '✓ ĐÚNG' : '✗ CHƯA ĐÚNG'}
            </span>
            <Html as="p" t={q.ex} style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.7, margin: '7px 0 0' }} />
          </div>
        ) : null}

        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <button type="button" className="btn" onClick={() => setQi((x) => Math.max(0, x - 1))} disabled={qi === 0}>← Câu trước</button>
          <button type="button" className="btn btn--primary" onClick={() => setQi((x) => Math.min(qs.length - 1, x + 1))} disabled={qi >= qs.length - 1}>Câu tiếp →</button>
          {answered > 0 ? <button type="button" className="btn" onClick={restart}>↺ Làm lại từ đầu</button> : null}
        </div>
      </div>

      {/* Kết quả */}
      {done ? (
        <div className="panel-inner" style={{ marginTop: 16, borderColor: `color-mix(in srgb, ${scoreColorVar(result.score)} 35%, transparent)` }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: scoreColorVar(result.score) }}>
              {result.score}%
            </span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>đúng {result.correct}/{qs.length} câu</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
            <div>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--green)', fontWeight: 600 }}>VỮNG · </span>
              <span style={{ color: 'var(--text-2)' }}>{result.right.length ? result.right.join(' · ') : '—'}</span>
            </div>
            <div>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--red)', fontWeight: 600 }}>HỔNG · </span>
              <span style={{ color: 'var(--text-2)' }}>{result.wrong.length ? result.wrong.join(' · ') : 'Không sai chủ đề nào — ngon.'}</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, margin: '10px 0 0' }}>{quizTip(result.score)}</p>
          <p style={{ fontSize: 12, color: 'var(--faint)', lineHeight: 1.6, margin: '8px 0 0' }}>
            Điểm này đã ghi vào trang Lộ trình — mở card của buổi ra là thấy báo cáo mạnh/yếu.
          </p>
        </div>
      ) : null}
    </div>
  );
}

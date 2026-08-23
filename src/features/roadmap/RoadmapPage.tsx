import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCourse } from '@/content/courses';
import { useProgress } from '@/lib/useProgress';
import { addDays, fmtShort, intervals, quizTip, scoreColorVar, startOfToday, type ReviewScheme } from '@/lib/spaced-repetition';
import type { Session } from '@/content/types';
import NotFoundPage from '@/pages/NotFoundPage';

const mono = 'var(--font-mono)';
type Status = 'todo' | 'doing' | 'done';

interface TodayItem { tag: string; tagBg: string; text: string; href?: string; onMark?: () => void }

export default function RoadmapPage() {
  const { slug } = useParams();
  const course = getCourse(slug);
  const { db, update } = useProgress();
  const [scheme, setScheme] = useState<ReviewScheme>('1-3-7-14-30');
  const today = startOfToday();
  const ivs = intervals(scheme);

  const view = useMemo(() => {
    if (!course) return null;
    let doneCount = 0;
    const quizzes: number[] = [];
    let dueCount = 0;
    const todayItems: TodayItem[] = [];
    let nextSession: Session | undefined;
    for (const sd of course.sessions) {
      const rec = db.sessions[sd.id] || {};
      if ((rec.status || 'todo') === 'done') doneCount++;
      if (typeof rec.quizScore === 'number') quizzes.push(rec.quizScore);
      if (!nextSession && (rec.status || 'todo') !== 'done') nextSession = sd;
      if (rec.status === 'done' && rec.completedAt) {
        const doneIdx = rec.reviewsDone || [];
        ivs.forEach((n, i) => {
          const date = addDays(rec.completedAt!, n);
          if (!doneIdx.includes(i) && date <= today) {
            dueCount++;
            todayItems.push({
              tag: 'ÔN LẠI', tagBg: 'var(--yellow)',
              text: `${sd.title} — lần ôn thứ ${i + 1} (+${n} ngày, hạn ${fmtShort(date)}). Làm lại quiz, hoặc tự giải thích to các ý chính cho chính mình nghe.`,
              href: sd.lessonPath ? sd.lessonPath + '#quiz' : undefined,
              onMark: () => update((d) => {
                const r = d.sessions[sd.id] || (d.sessions[sd.id] = {});
                r.reviewsDone = [...(r.reviewsDone || []), i];
              }),
            });
          }
        });
      }
    }
    const pt = db.partTests || {};
    course.parts.forEach((p, i) => {
      const ids = course.sessions.filter((s) => s.part === i).map((s) => s.id);
      const allDone = ids.every((id) => (db.sessions[id] || {}).status === 'done');
      if (allDone && !pt[p.id]) {
        todayItems.push({ tag: 'KIỂM TRA', tagBg: p.color, text: `Bạn xong ${p.no} rồi — làm Kiểm tra tổng hợp để chốt lại trước khi sang phần mới.`, href: `/courses/${course.slug}/tests#p${i + 1}` });
      }
    });
    if (nextSession) {
      todayItems.push({ tag: 'HỌC TIẾP', tagBg: 'var(--cyan)', text: `${nextSession.title} (tuần ${nextSession.week}) — mở đầu bằng thẻ toán nền, kết lại bằng quiz.`, href: nextSession.lessonPath });
    }
    if (todayItems.length === 0) {
      todayItems.push({ tag: 'HOÀN TẤT', tagBg: 'var(--green)', text: 'Bạn học hết cả khóa rồi và không còn lịch ôn nào đến hạn. Nghỉ đi, xứng đáng mà 🎉' });
    }
    const avg = quizzes.length ? Math.round(quizzes.reduce((a, b) => a + b, 0) / quizzes.length) : null;
    return { doneCount, dueCount, todayItems, avg };
  }, [course, db, ivs, today, update]);

  if (!course || !view) return <NotFoundPage />;
  const total = course.sessions.length;

  const setStatus = (id: string, st: Status) => update((d) => {
    const r = d.sessions[id] || (d.sessions[id] = {});
    r.status = st;
    if (st === 'done' && !r.completedAt) r.completedAt = new Date().toISOString();
    if (st !== 'done') { delete r.completedAt; delete r.reviewsDone; }
  });

  const statCard = (label: string, value: React.ReactNode, sub: React.ReactNode) => (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 18px', minWidth: 110 }}>
      <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted-2)' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>{value}</div>
      {sub}
    </div>
  );

  return (
    <div className="container container--mid" style={{ padding: '38px 24px 90px' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 22 }}>
        <div style={{ minWidth: 300 }}>
          <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted-2)' }}>{course.org}</div>
          <h1 style={{ margin: '10px 0 6px', fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.14 }}>
            {course.title} <em style={{ color: 'var(--cyan)' }}>{course.titleAccent}</em>
          </h1>
          <div style={{ fontSize: 15, color: 'var(--muted-2)' }}>{course.subtitle}</div>
          <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, margin: '10px 0 0', maxWidth: 620, textWrap: 'pretty' }}>{course.description}</p>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {statCard('Tiến độ', <>{view.doneCount}<span style={{ fontSize: 14, color: 'var(--muted-2)', fontWeight: 400 }}> / {total} buổi</span></>,
            <div style={{ height: 5, background: 'var(--border)', borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--cyan)', borderRadius: 3, width: `${Math.round((view.doneCount / total) * 100)}%` }} />
            </div>)}
          {statCard('Quiz TB', <span style={{ color: scoreColorVar(view.avg) }}>{view.avg == null ? '—' : view.avg + '%'}</span>,
            <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 6 }}>trên các buổi đã làm</div>)}
          {statCard('Cần ôn hôm nay', <span style={{ color: view.dueCount > 0 ? 'var(--yellow)' : 'var(--green)' }}>{view.dueCount}</span>,
            <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 6 }}>
              theo lịch{' '}
              <button onClick={() => setScheme(scheme === '1-3-7-14-30' ? '2-5-10-21' : '1-3-7-14-30')}
                title="Bấm để đổi lịch ôn"
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--cyan)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
                {ivs.join('·')}
              </button>{' '}ngày
            </div>)}
        </div>
      </header>

      <section style={{ marginTop: 26, background: 'var(--panel)', border: '1px solid var(--border)', borderLeft: '4px solid var(--cyan)', borderRadius: 10, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan)', fontWeight: 600 }}>
            Hôm nay · {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted-2)' }}>tôi tự sinh từ tiến độ & lịch ôn của bạn</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {view.todayItems.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 14px', background: 'var(--panel-2)', border: '1px dashed var(--border-3)', borderRadius: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 4, color: 'var(--on-accent)', background: t.tagBg }}>{t.tag}</span>
              <span style={{ flex: 1, fontSize: 14.5, minWidth: 220 }}>{t.text}</span>
              {t.href ? <Link to={t.href} style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>Mở →</Link> : null}
              {t.onMark ? (
                <button onClick={t.onMark} className="btn" style={{ borderColor: 'var(--cyan)', color: 'var(--cyan)', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, padding: '5px 12px' }}>Đã ôn ✓</button>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 26, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
        {[
          ['01 · ACTIVE RECALL', 'Bắt bạn tự nhớ trước khi cho xem đáp án. Quiz và chế độ «đoán bước tiếp theo» trong mỗi bài đều làm đúng một việc: không cho bạn đọc lướt.'],
          ['02 · SPACED REPETITION', `Xong một buổi là lịch ôn tự đặt sau ${ivs.join('·')} ngày. Ôn đúng lúc sắp quên mới nhớ bền — ôn sớm quá thì phí công.`],
          ['03 · TOÁN NỀN TRƯỚC', 'Mỗi buổi mở màn bằng thẻ ôn toán 5–10 phút kèm thuật ngữ Anh–Việt, để lát nữa gặp công thức bạn không phải khựng lại.'],
          ['04 · BÁO CÁO SAU BUỔI', 'Quiz chấm theo chủ đề rồi tự sinh báo cáo mạnh/yếu ngay dưới mỗi buổi. Bạn khỏi phải đoán mình đang hổng chỗ nào.'],
        ].map(([k, v]) => (
          <div key={k} style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--cyan)', fontWeight: 600, letterSpacing: '0.1em' }}>{k}</div>
            <div style={{ fontSize: 13.5, marginTop: 7, lineHeight: 1.5, color: 'var(--text-2)' }}>{v}</div>
          </div>
        ))}
      </section>

      {course.parts.map((p, pi) => {
        const sessions = course.sessions.filter((s) => s.part === pi);
        const t = (db.partTests || {})[p.id];
        return (
          <section key={p.no} style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, borderBottom: `2px solid ${p.color}`, paddingBottom: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 600, color: 'var(--on-accent)', background: p.color, padding: '4px 10px', borderRadius: 5, letterSpacing: '0.08em' }}>{p.no}</span>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: 23, fontWeight: 700 }}>{p.title}</h2>
              <span style={{ fontFamily: mono, fontSize: 11.5, color: 'var(--muted-2)' }}>{p.en}</span>
              <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--muted-2)' }}>{p.range}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              {sessions.map((sd) => (
                <SessionCard key={sd.id} sd={sd} color={p.color} rec={db.sessions[sd.id] || {}} ivs={ivs} today={today}
                  onStatus={(st) => setStatus(sd.id, st)}
                  onReview={(i) => update((d) => { const r = d.sessions[sd.id]; if (r) r.reviewsDone = [...(r.reviewsDone || []), i]; })} />
              ))}
              <div style={{ background: 'var(--panel)', border: `1.5px dashed ${p.color}`, borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--on-accent)', background: p.color, borderRadius: 4, padding: '3px 8px' }}>KIỂM TRA TỔNG HỢP</span>
                <div style={{ flex: 1, minWidth: 220, fontSize: 13, color: 'var(--text-2)' }}>{p.testDesc} — làm khi bạn đã xong hết các buổi của phần.</div>
                {t ? <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 600, color: scoreColorVar(t.score) }}>ĐIỂM {t.score}%</span> : null}
                <Link to={`/courses/${course.slug}/tests#p${pi + 1}`} style={{ fontSize: 13, fontWeight: 700, background: 'var(--panel)', border: `1.5px solid ${p.color}`, color: p.color, padding: '7px 14px', borderRadius: 7 }}>
                  {t ? 'Làm lại' : 'Làm bài'} →
                </Link>
              </div>
            </div>
          </section>
        );
      })}

      <footer style={{ marginTop: 44, borderTop: '1px dashed var(--border-3)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 12, color: 'var(--muted-2)' }}>
        <div>Tiến độ lưu ngay trên trình duyệt này (localStorage) — không gửi đi đâu cả.</div>
      </footer>
    </div>
  );
}

function SessionCard({ sd, color, rec, ivs, today, onStatus, onReview }: {
  sd: Session;
  color: string;
  rec: { status?: Status; completedAt?: string; reviewsDone?: number[]; quizScore?: number; quizRight?: string[]; quizWrong?: string[] };
  ivs: number[];
  today: Date;
  onStatus: (st: Status) => void;
  onReview: (i: number) => void;
}) {
  const status: Status = rec.status || 'todo';
  const score = rec.quizScore;
  const right = rec.quizRight || [];
  const wrong = rec.quizWrong || [];
  const hasReport = status === 'done' || typeof score === 'number';
  const dot = status === 'done' ? 'var(--green)' : status === 'doing' ? 'var(--cyan)' : 'var(--panel)';
  const dotBd = status === 'done' ? 'var(--green)' : status === 'doing' ? 'var(--cyan)' : 'var(--border-3)';
  const segBtn = (label: string, st: Status, on: string) => (
    <button onClick={() => onStatus(st)} style={{
      border: 'none', borderLeft: st !== 'todo' ? '1px solid var(--border)' : 'none', cursor: 'pointer', padding: '6px 10px', fontSize: 11.5, fontWeight: 600, fontFamily: 'inherit',
      background: status === st ? on : 'var(--panel)', color: status === st ? 'var(--on-accent)' : 'var(--muted-2)',
    }}>{label}</button>
  );
  return (
    <article style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div style={{ textAlign: 'center', minWidth: 52 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.08em' }}>TUẦN</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 600, color, lineHeight: 1.1 }}>{String(sd.week).padStart(2, '0')}</div>
        <div style={{ width: 10, height: 10, borderRadius: '50%', margin: '8px auto 0', background: dot, border: `2px solid ${dotBd}` }} />
      </div>
      <div style={{ flex: '1 1 320px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{sd.title.replace(/^Buổi \d+ · /, '')}</h3>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted-2)' }}>{sd.en}</span>
          <span style={{ fontSize: 11.5, color: 'var(--muted-2)', background: 'var(--panel-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 7px' }}>{sd.hours}</span>
          {sd.labChip ? (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, color: 'var(--yellow)', background: 'color-mix(in srgb, var(--yellow) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--yellow) 35%, transparent)', borderRadius: 4, padding: '2px 7px' }}>{sd.labChip}</span>
          ) : null}
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 6, lineHeight: 1.55 }}>{sd.topics}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted-2)', marginTop: 8, lineHeight: 1.7 }}>
          <span style={{ color, fontWeight: 600 }}>TOÁN NỀN · </span>{sd.math}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10, fontSize: 12.5, alignItems: 'center' }}>
          {sd.lessonPath ? (
            <Link to={sd.lessonPath} style={{ fontWeight: 700, background: 'var(--cyan)', color: 'var(--on-accent)', padding: '7px 14px', borderRadius: 7 }}>Mở bài học tương tác →</Link>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--muted-2)', border: '1px dashed var(--border-3)', borderRadius: 7, padding: '7px 12px' }}>Bài học tương tác đang dựng</span>
          )}
          <span style={{ display: 'inline-flex', gap: 14, alignItems: 'center' }}>
            {sd.links.map((lk) => (
              <a key={lk.label} href={lk.href} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>{lk.label} ↗</a>
            ))}
          </span>
        </div>
        {hasReport ? (
          <div style={{ marginTop: 12, borderTop: '1px dashed var(--border)', paddingTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 8, fontSize: 12.5, lineHeight: 1.55 }}>
            <div><span className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--green)', fontWeight: 600 }}>ƯU ĐIỂM · </span>
              {right.length ? 'Trả lời đúng: ' + right.join(', ') + '.' : typeof score === 'number' ? 'Đã hoàn thành quiz.' : 'Đã đánh dấu hoàn thành.'}</div>
            <div><span className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--red)', fontWeight: 600 }}>CẦN CẢI THIỆN · </span>
              {wrong.length ? 'Trả lời sai: ' + wrong.join(', ') + '.' : typeof score === 'number' ? 'Không sai chủ đề nào — ngon.' : 'Chưa có dữ liệu quiz.'}</div>
            <div><span className="mono" style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--cyan)', fontWeight: 600 }}>GỢI Ý · </span>{quizTip(score)}</div>
          </div>
        ) : null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, minWidth: 150 }}>
        {typeof score === 'number' ? (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: scoreColorVar(score), background: `color-mix(in srgb, ${scoreColorVar(score)} 12%, transparent)`, borderRadius: 6, padding: '4px 10px' }}>QUIZ {score}%</div>
        ) : null}
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 7, overflow: 'hidden' }}>
          {segBtn('Chưa', 'todo', 'var(--text-hi)')}
          {segBtn('Đang', 'doing', 'var(--cyan)')}
          {segBtn('Xong ✓', 'done', 'var(--green)')}
        </div>
        {status === 'done' && rec.completedAt ? (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 9.5, color: 'var(--muted-2)', letterSpacing: '0.06em' }}>ÔN</span>
            {ivs.map((n, i) => {
              const date = addDays(rec.completedAt!, n);
              const isDone = (rec.reviewsDone || []).includes(i);
              const due = !isDone && date <= today;
              return (
                <button key={i} onClick={due ? () => onReview(i) : undefined}
                  title={`Ôn lần ${i + 1} · ${fmtShort(date)}` + (isDone ? ' · đã ôn' : due ? ' · ĐẾN HẠN' : '')}
                  style={{
                    width: 22, height: 22, borderRadius: '50%', cursor: due ? 'pointer' : 'default', fontFamily: 'var(--font-mono)', fontSize: 8.5, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1.5px solid ${isDone ? 'var(--green)' : due ? 'var(--yellow)' : 'var(--border)'}`,
                    background: isDone ? 'var(--green)' : due ? 'color-mix(in srgb, var(--yellow) 12%, transparent)' : 'var(--panel)',
                    color: isDone ? 'var(--on-accent)' : due ? 'var(--yellow)' : 'var(--faint)',
                  }}>+{n}</button>
              );
            })}
          </div>
        ) : null}
      </div>
    </article>
  );
}

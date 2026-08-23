import { Link } from 'react-router-dom';
import { courses } from '@/content/courses';

// Landing — chân dung blog/portfolio, hiện dẫn thẳng vào khóa học chính.
export default function HomePage() {
  const c = courses[0];
  return (
    <div className="container" style={{ padding: '70px 24px 90px' }}>
      <div className="mono" style={{ fontSize: 12, letterSpacing: '1.5px', color: 'var(--yellow)' }}>LEARN AI WITH ME</div>
      <h1 className="hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 52, lineHeight: 1.12, margin: '16px 0 0', maxWidth: 720 }}>
        Học AI từ số 0,<br />bằng <em style={{ color: 'var(--cyan)' }}>active recall</em> và bài học tương tác
      </h1>
      <p style={{ color: 'var(--text-2)', fontSize: 15.5, lineHeight: 1.75, maxWidth: 620, margin: '20px 0 0', textWrap: 'pretty' }}>
        Đây là sổ tay tự học của tôi, để công khai luôn. Mỗi khóa là một lộ trình có lịch ôn ngắt quãng, quiz chấm theo chủ đề, và phòng lab cho bạn xem thuật toán chạy từng bước ngay trong trình duyệt.
      </p>
      <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
        <Link to={`/courses/${c.slug}`} style={{ fontWeight: 700, background: 'var(--cyan)', color: 'var(--on-accent)', padding: '11px 20px', borderRadius: 9, fontSize: 14.5 }}>
          Vào khóa {c.code} →
        </Link>
        <Link to="/courses" className="btn" style={{ fontFamily: 'inherit', fontSize: 14, padding: '11px 18px' }}>Tất cả khóa học</Link>
      </div>

      <div style={{ marginTop: 64 }}>
        <div className="kicker">KHÓA HỌC</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 14, marginTop: 14 }}>
          {courses.map((course) => (
            <Link key={course.slug} to={`/courses/${course.slug}`} className="card" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.1em' }}>{course.code} · {course.weeks} TUẦN</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, marginTop: 8 }}>
                {course.title} <em style={{ color: 'var(--cyan)' }}>{course.titleAccent}</em>
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 8, lineHeight: 1.6 }}>{course.subtitle}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
                {course.parts.map((p) => (
                  <span key={p.no} className="chip chip--mono" style={{ fontSize: 10.5, color: p.color, borderColor: `color-mix(in srgb, ${p.color} 35%, transparent)` }}>
                    {p.no} · {p.title}
                  </span>
                ))}
              </div>
            </Link>
          ))}
          <div className="card" style={{ border: '1.5px dashed var(--border-3)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160 }}>
            <span style={{ color: 'var(--faint)', fontSize: 13.5 }}>Khóa tiếp theo — thêm một file data trong <span className="code-inline">src/content/courses/</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

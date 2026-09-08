import { UI } from '@/content/ui';
import { Link } from 'react-router-dom';
import { courses } from '@/content/courses';

// Landing — chân dung blog/portfolio, hiện dẫn thẳng vào khóa học chính.
export default function HomePage() {
  const c = courses[0];
  return (
    <div className="container" style={{ padding: '70px 24px 90px' }}>
      <div className="mono" style={{ fontSize: 12, letterSpacing: '1.5px', color: 'var(--yellow)' }}>{UI.home.kicker}</div>
      <h1 className="hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 52, lineHeight: 1.12, margin: '16px 0 0', maxWidth: 720 }}>
        {UI.home.titleA}<br />{UI.home.titleB}<em style={{ color: 'var(--cyan)' }}>{UI.home.titleAccent}</em>{UI.home.titleC}
      </h1>
      <p style={{ color: 'var(--text-2)', fontSize: 15.5, lineHeight: 1.75, maxWidth: 620, margin: '20px 0 0', textWrap: 'pretty' }}>
        {UI.home.lead}
      </p>
      <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
        <Link to={`/courses/${c.slug}`} style={{ fontWeight: 700, background: 'var(--cyan)', color: 'var(--on-accent)', padding: '11px 20px', borderRadius: 9, fontSize: 14.5 }}>
          {UI.home.enterCourse(c.code)}
        </Link>
        <Link to="/courses" className="btn" style={{ fontFamily: 'inherit', fontSize: 14, padding: '11px 18px' }}>{UI.home.allCourses}</Link>
      </div>

      <div style={{ marginTop: 64 }}>
        <div className="kicker">{UI.home.coursesKicker}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 14, marginTop: 14 }}>
          {courses.map((course) => (
            <Link key={course.slug} to={`/courses/${course.slug}`} className="card" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted-2)', letterSpacing: '0.1em' }}>{course.code} · {course.weeks} {UI.home.weeksUpper}</div>
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
            <span style={{ color: 'var(--faint)', fontSize: 13.5 }}>{UI.home.nextCourseA}<span className="code-inline">src/content/courses/</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

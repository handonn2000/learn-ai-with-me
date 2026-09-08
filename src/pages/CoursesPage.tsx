import { Link } from 'react-router-dom';
import { courses } from '@/content/courses';
import { UI } from '@/content/ui';

export default function CoursesPage() {
  return (
    <div className="container" style={{ padding: '48px 24px 90px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 700, margin: 0 }}>{UI.coursesPage.title}</h1>
      <p style={{ color: 'var(--muted-2)', fontSize: 14.5, margin: '8px 0 0' }}>{UI.coursesPage.lead}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 26, maxWidth: 760 }}>
        {courses.map((c) => (
          <Link key={c.slug} to={`/courses/${c.slug}`} className="card" style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
            <div style={{ display: 'flex', gap: 18, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span className="mono" style={{ fontSize: 12, color: 'var(--yellow)', fontWeight: 700 }}>{c.code}</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 700 }}>{c.title} {c.titleAccent}</span>
              <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--muted-2)' }}>{UI.coursesPage.meta(c.weeks, c.sessions.length, c.parts.length)}</span>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, margin: '10px 0 0', textWrap: 'pretty' }}>{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

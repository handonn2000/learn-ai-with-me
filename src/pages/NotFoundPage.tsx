import { Link } from 'react-router-dom';
import { UI } from '@/content/ui';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '90px 24px', textAlign: 'center' }}>
      <div className="mono" style={{ fontSize: 13, color: 'var(--yellow)' }}>404</div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 700, margin: '10px 0 0' }}>{UI.notFound.title}</h1>
      <p style={{ color: 'var(--muted-2)', marginTop: 10 }}>
        <Link to="/">{UI.notFound.back}</Link>
      </p>
    </div>
  );
}

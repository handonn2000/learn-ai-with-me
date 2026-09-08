import { Link, useLocation } from 'react-router-dom';
import { LangToggle } from '@/components/LangToggle';
import { useTheme } from '@/lib/theme';
import { UI } from '@/content/ui';

// Header chung của app (trên các trang không phải bài học full-bleed).
export function AppHeader() {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const item = (to: string, label: string) => (
    <Link
      to={to}
      style={{
        fontSize: 13,
        padding: '6px 10px',
        borderRadius: 7,
        color: pathname === to ? 'var(--text-hi)' : 'var(--muted)',
        background: pathname === to ? 'var(--panel)' : 'transparent',
        border: pathname === to ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      {label}
    </Link>
  );
  return (
    <header style={{ borderBottom: '1px solid var(--border-2)', background: 'var(--header-bg)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 60 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 24px', flexWrap: 'wrap' }}>
        <Link to="/" className="mono" style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-hi)', letterSpacing: '0.04em' }}>
          learn-ai<span style={{ color: 'var(--cyan)' }}>-with-me</span>
        </Link>
        <nav style={{ display: 'flex', gap: 4, marginLeft: 10 }}>
          {item('/', UI.header.home)}
          {item('/courses', UI.header.courses)}
          {item('/blog', UI.header.blog)}
        </nav>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <LangToggle />
          <button
            onClick={toggle}
            className="btn"
            aria-label={UI.header.themeAria}
            style={{ minHeight: 34, padding: '5px 12px' }}
          >
            {theme === 'dark' ? UI.header.dark : UI.header.light}
          </button>
        </span>
      </div>
    </header>
  );
}

import { UI } from '@/content/ui';
export default function BlogPage() {
  return (
    <div className="container" style={{ padding: '48px 24px 90px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 700, margin: 0 }}>{UI.blog.title}</h1>
      <p style={{ color: 'var(--muted-2)', fontSize: 14.5, margin: '8px 0 0', maxWidth: 560, lineHeight: 1.7 }}>
        {UI.blog.emptyA}<span className="code-inline">src/pages/BlogPage.tsx</span>{UI.blog.emptyB}
      </p>
    </div>
  );
}

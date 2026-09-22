/* Thẻ giới thiệu một thuật toán tìm kiếm — header + đoạn giảng + bốn ô đánh giá + hai link.
   Dùng ở cả Buổi 4 (nhóm mù) lẫn Buổi 5 (nhóm có thông tin), nên nằm ở search-lab chứ không
   thuộc feature của buổi nào. Nhãn nút "chạy trong Lab" truyền vào qua `labCta` vì mỗi bundle
   chữ của buổi giữ bản dịch riêng. */
import { Html } from '@/components/Html';
import { Reveal } from '@/components/Reveal';

interface Stat { k: string; v: string; cls?: string; bd?: string }
export function AlgoCard({ color, abbr, name, en, chips, body, stats, children, border, labCta }: {
  color: string; abbr: string; name: string; en: string; labCta: string;
  chips: [string, 'cyan' | 'yellow' | 'plain'][];
  body: string; stats: Stat[]; children?: React.ReactNode; border?: string;
}) {
  const chipStyle = (kind: string): React.CSSProperties =>
    kind === 'cyan'
      ? { color: 'var(--cyan-soft)', borderColor: 'color-mix(in srgb, var(--cyan) 40%, transparent)' }
      : kind === 'yellow'
        ? { color: 'var(--yellow)', borderColor: 'color-mix(in srgb, var(--yellow) 40%, transparent)' }
        : { color: 'var(--muted)' };
  return (
    <Reveal className="card" style={{ marginTop: 16, padding: '24px 26px', borderColor: border }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontWeight: 700, fontSize: 20, color }}>{abbr}</span>
        <span style={{ fontSize: 16, fontWeight: 600 }}>{name}</span>
        <span style={{ color: 'var(--faint)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>{en}</span>
        {chips.map(([label, kind]) => (
          <span key={label} className="chip chip--mono" style={{ fontSize: 11, ...chipStyle(kind) }}>{label}</span>
        ))}
      </div>
      <Html as="p" t={body} style={{ color: 'var(--text-2)', fontSize: 14.5, lineHeight: 1.75, margin: '14px 0 0', maxWidth: 860 }} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
        {stats.map((s) => (
          <div key={s.k} className={`stat ${s.cls ?? ''}`} style={{ borderColor: s.bd }}>
            <div className="stat__k">{s.k}</div>
            <Html as="div" t={s.v} className="stat__v" />
          </div>
        ))}
      </div>
      {children}
      <div style={{ marginTop: 14, display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 13 }}>
        <a href="#lab">{labCta}</a>
        <a href="#codelab">⌨ Pseudo-code + Python</a>
      </div>
    </Reveal>
  );
}

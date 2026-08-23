import { Html } from './Html';
import { Reveal } from './Reveal';

// Thẻ ôn toán nền mở đầu bài học — đúng lời hứa ở thẻ phương pháp 03 trang Lộ trình.
// Dữ liệu: src/content/courses/<slug>/math-primers.js, khóa theo id buổi.
export interface MathTerm {
  en: string;
  vn: string;
  what: string; // một câu định nghĩa, viết bằng giọng tôi/bạn
  why: string; // vì sao ĐÚNG buổi này cần nó — phần khiến người học chịu đọc
  note?: string; // ghi chú mono ngắn: độ phức tạp, ký hiệu, ví dụ số
}

export function MathPrimer({ minutes, lead, terms }: {
  minutes: number;
  lead: string;
  terms: MathTerm[];
}) {
  return (
    <Reveal className="card" style={{ marginTop: 26, borderColor: 'color-mix(in srgb, var(--purple) 30%, transparent)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--purple)', letterSpacing: '0.8px' }}>
          🧮 TOÁN NỀN — {minutes} PHÚT, ĐỌC TRƯỚC KHI VÀO BÀI
        </span>
        <span className="mono" style={{ fontSize: 11.5, color: 'var(--faint)' }}>{terms.length} thuật ngữ</span>
      </div>
      <Html as="p" t={lead} style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0', maxWidth: 840 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 12, marginTop: 16 }}>
        {terms.map((t) => (
          <div key={t.en} className="panel-inner" style={{ padding: '14px 16px', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--purple)' }}>{t.en}</span>
              <span style={{ fontSize: 12.5, color: 'var(--muted-2)', fontStyle: 'italic' }}>{t.vn}</span>
            </div>
            <Html as="p" t={t.what} style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.65, margin: '8px 0 0' }} />
            <Html as="p" t={'<span style="color:var(--cyan)">→</span> ' + t.why}
              style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.6, margin: '7px 0 0' }} />
            {t.note ? (
              <div className="mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 8, textAlign: 'right' }}>{t.note}</div>
            ) : null}
          </div>
        ))}
      </div>
    </Reveal>
  );
}

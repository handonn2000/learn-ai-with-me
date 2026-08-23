import { Html } from './Html';
import { Reveal } from './Reveal';

// Đầu mục bài học: số thứ tự + tiêu đề + tên tiếng Anh + gạch màu + đoạn dẫn.
export function SectionHead({ no, title, en, color = 'var(--cyan)', lead }: {
  no: string;
  title: string;
  en?: string;
  color?: string;
  lead?: string;
}) {
  return (
    <Reveal>
      <div className="sec-head">
        <span className="sec-head__no">{no}</span>
        <Html as="h2" t={title} className="sec-head__title" style={{ fontFamily: 'var(--font-serif)' }} />
        {en ? <span className="sec-head__en">{en}</span> : null}
      </div>
      <div className="sec-rule" style={{ '--rule-color': color } as React.CSSProperties} />
      {lead ? <Html as="p" t={lead} className="sec-lead" /> : null}
    </Reveal>
  );
}

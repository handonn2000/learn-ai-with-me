import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

// Hiện dần khi cuộn tới. Ghi opacity/transform trực tiếp lên element (không qua state/class)
// để re-render của cha không reset hiệu ứng; prefers-reduced-motion xử lý trong CSS (.mn).
export function Reveal({ children, delay = 0, style, className = '', as: Tag = 'div' }: {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
  className?: string;
  as?: 'div' | 'p' | 'section';
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.style.opacity === '1') return; // đã hiện (StrictMode remount / re-effect)
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((x) => {
          if (x.isIntersecting) {
            const t = x.target as HTMLElement;
            t.style.opacity = '1';
            t.style.transform = 'none';
            io.unobserve(t);
          }
        }),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={`mn ${className}`} style={{ transitionDelay: delay ? `${delay}s` : undefined, ...style }}>
      {children}
    </Tag>
  );
}

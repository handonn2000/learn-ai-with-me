import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Thanh điều hướng dính đầu trang bài học + vạch tiến độ cuộn.
export function LessonNav({ badge, title, backTo, items, right }: {
  badge: string;
  title: string;
  backTo: string;
  items: { href: string; label: string; hot?: boolean }[];
  right?: React.ReactNode; // chỗ cho nút đổi chế độ xem (DeckToggle)
}) {
  const bar = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (!bar.current) return;
      const h = document.documentElement;
      bar.current.style.width = (100 * h.scrollTop) / Math.max(1, h.scrollHeight - h.clientHeight) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="lesson-nav">
      {/* Hàng 1: danh tính bài + chỗ cho nút đổi chế độ xem. Hàng 2: mục lục.
          Tách hai hàng vì nhét chung một flex-wrap thì mục lục chiếm trọn dòng rồi
          đẩy nút xuống dòng dưới, trông như bị lỗi. */}
      <div className="lesson-nav__row">
        <Link to={backTo} className="lesson-nav__back">← Lộ trình</Link>
        <span className="lesson-nav__badge">{badge}</span>
        <span className="lesson-nav__title">{title}</span>
        <span className="lesson-nav__grow" />
        {right}
      </div>
      <nav className="lesson-nav__links" aria-label="Mục lục bài học">
        {items.map((it) => (
          <a key={it.href} href={it.href} className={it.hot ? 'is-hot' : ''}>{it.label}</a>
        ))}
      </nav>
      <div ref={bar} className="lesson-nav__progress" />
    </div>
  );
}

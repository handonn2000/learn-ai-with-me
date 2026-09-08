import { Children, useCallback, useEffect, useRef, useState } from 'react';
import { localStorageStore } from '@/lib/storage';
import { UI } from '@/content/ui';

/* Chế độ trình chiếu: cùng một nội dung, đổi cách xem từ CUỘN sang TRƯỢT TRÁI PHẢI.
   Xem ADR-0006 để biết vì sao chọn cách này.

   Hai điều quyết định toàn bộ thiết kế dưới đây:

   1. KHÔNG unmount slide ẩn. Lab hút bụi đang ở bước 12, quiz đang làm dở câu 5 — trượt qua
      slide khác rồi quay lại mà mất sạch thì tệ hơn là không có chế độ này. Nên mọi slide vẫn
      mount, chỉ `display: none`.
   2. KHÔNG đụng vào DOM do React quản. Bọc mỗi slide trong một div của riêng deck rồi bật tắt
      `display` trên div đó, thay vì sửa style của chính section — sửa thẳng là sớm muộn cũng bị
      React ghi đè lúc panel bên trong re-render.

   Mục cao hơn màn hình (lab, sơ đồ 5 nấc, bảng PEAS) vẫn cuộn dọc trong lòng slide. Đó là giới
   hạn thật của việc trình chiếu một bài học dài, không phải bug. */

const VIEW_KEY = 'lam-lesson-view';

export interface Slide { id: string; label: string }

export function useDeckMode(): [boolean, (v: boolean) => void] {
  const [on, setOn] = useState<boolean>(() => localStorageStore.get<string>(VIEW_KEY, 'scroll') === 'deck');
  const set = useCallback((v: boolean) => {
    setOn(v);
    localStorageStore.set(VIEW_KEY, v ? 'deck' : 'scroll');
  }, []);
  return [on, set];
}

export function LessonDeck({ on, slides, children }: { on: boolean; slides: Slide[]; children: React.ReactNode }) {
  const kids = Children.toArray(children);
  const [cur, setCur] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const last = Math.min(slides.length, kids.length) - 1;

  const go = useCallback((i: number) => {
    setCur(Math.max(0, Math.min(last, i)));
    document.documentElement.scrollTop = 0;
  }, [last]);

  // Thanh điều hướng của bài vẫn dùng href="#id" — ở chế độ trượt thì bắt lấy và nhảy slide,
  // vì phần tử đích đang display:none nên trình duyệt không cuộn tới được.
  useEffect(() => {
    if (!on) return;
    const jump = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const i = slides.findIndex((s) => s.id === id);
      if (i >= 0) go(i);
    };
    jump();
    window.addEventListener('hashchange', jump);
    return () => window.removeEventListener('hashchange', jump);
  }, [on, slides, go]);

  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(cur + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1); }
      if (e.key === 'Home') { e.preventDefault(); go(0); }
      if (e.key === 'End') { e.preventDefault(); go(last); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [on, cur, go, last]);

  if (!on) return <>{children}</>;

  const s = slides[cur];

  return (
    <div
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={(e) => {
        const t0 = touch.current;
        if (!t0) return;
        const dx = e.changedTouches[0].clientX - t0.x;
        const dy = e.changedTouches[0].clientY - t0.y;
        // chỉ tính là vuốt ngang khi rõ ràng ngang hơn dọc — nếu không thì người ta đang cuộn
        if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.6) go(cur + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}
    >
      {kids.map((kid, i) => (
        // Slide đang hiện KHÔNG đặt display inline: để class .deck-slide tự cho `flex` (căn giữa
        // theo chiều dọc). Đặt inline `block` ở đây là đè mất luật CSS — đã dính một lần rồi.
        <div key={slides[i]?.id || i} className={i === cur ? 'deck-slide' : undefined}
          style={i === cur ? undefined : { display: 'none' }} aria-hidden={i !== cur}>
          {kid}
        </div>
      ))}

      {/* Thanh lái, dính đáy màn hình */}
      <div className="deck-bar">
        <div className="deck-bar__row">
          <button type="button" className="btn" onClick={() => go(cur - 1)} disabled={cur === 0} aria-label={UI.deck.prev}>←</button>
          <div className="deck-bar__now">
            <span className="mono deck-bar__count">{String(cur + 1).padStart(2, '0')} / {last + 1}</span>
            <span className="deck-bar__label">{s?.label}</span>
          </div>
          <button type="button" className="btn btn--primary" onClick={() => go(cur + 1)} disabled={cur === last} aria-label={UI.deck.next}>→</button>
        </div>
        <div className="deck-bar__ticks">
          {slides.slice(0, last + 1).map((sl, i) => (
            <button key={sl.id} type="button" title={sl.label} aria-label={sl.label}
              onClick={() => go(i)} className={'deck-tick' + (i === cur ? ' is-on' : i < cur ? ' is-done' : '')} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Nút bật/tắt, đặt trong LessonNav. */
export function DeckToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className={'deck-toggle' + (on ? ' is-on' : '')} onClick={() => onChange(!on)}
      title={on ? UI.deck.toScroll : UI.deck.toDeck}>
      {on ? UI.deck.scroll : UI.deck.present}
    </button>
  );
}

import { useEffect, useRef } from 'react';

export interface SceneApi {
  clock: number; // giây, đã nhân speed
  w: number;
  h: number;
}
type DrawFn = (ctx: CanvasRenderingContext2D, api: SceneApi) => void;

// Canvas chạy requestAnimationFrame, tự resize theo devicePixelRatio.
// draw được gọi mỗi frame với clock cộng dồn (speed thay đổi được qua getSpeed).
export function CanvasScene({ height, draw, getSpeed, paused = false, style }: {
  height: number;
  draw: DrawFn;
  getSpeed?: () => number;
  paused?: boolean;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const speedRef = useRef(getSpeed);
  speedRef.current = getSpeed;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    let w = 0;
      // Đo bề rộng bằng ResizeObserver chứ không phải một lần lúc mount: ở chế độ trình chiếu
      // (ADR-0006) canvas mount lúc mục còn display:none nên clientWidth = 0. Bản cũ rơi vào
      // giá trị dự phòng 640 rồi không bao giờ đo lại — mục hiện ra là cảnh bị kéo giãn, và
      // vẽ theo w = 640 trong khi hiển thị ở 1070. KHÔNG đặt lại giá trị dự phòng: chưa có bề
      // rộng thật thì đừng vẽ, vòng lặp dưới đã có guard `if (ctx && w)`.
    const size = () => {
      const next = c.clientWidth;
      if (!next || next === w) return; // chưa có bề rộng thật, hoặc không đổi → khỏi xóa canvas
      w = next;
      const d = Math.min(2, window.devicePixelRatio || 1);
      c.width = w * d;
      c.height = height * d;
      c.getContext('2d')!.setTransform(d, 0, 0, d, 0, 0);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(c);
    let clock = 0;
    let pts: number | undefined;
    let raf = 0;
    const tick = (ts: number) => {
      const dt = Math.min(0.05, (ts - (pts ?? ts)) / 1000);
      pts = ts;
      if (!pausedRef.current) clock += dt * (speedRef.current?.() ?? 1);
      const ctx = c.getContext('2d');
      if (ctx && w) drawRef.current(ctx, { clock, w, h: height });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [height]);

  return <canvas ref={ref} style={{ width: '100%', height, display: 'block', ...style }} />;
}

/* ===== Vẽ tiện ích dùng chung cho các scene ===== */
export const MONO = "'JetBrains Mono',monospace";
export const SANS = "'Be Vietnam Pro',sans-serif";

export function rr(x: CanvasRenderingContext2D, bx: number, by: number, bw: number, bh: number, r: number) {
  if (x.roundRect) { x.beginPath(); x.roundRect(bx, by, bw, bh, r); return; }
  x.beginPath(); x.moveTo(bx + r, by); x.lineTo(bx + bw - r, by);
  x.quadraticCurveTo(bx + bw, by, bx + bw, by + r); x.lineTo(bx + bw, by + bh - r);
  x.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh); x.lineTo(bx + r, by + bh);
  x.quadraticCurveTo(bx, by + bh, bx, by + bh - r); x.lineTo(bx, by + r);
  x.quadraticCurveTo(bx, by, bx + r, by);
}
export function wrapText(x: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = String(text).split(' ');
  const lines: string[] = [];
  let cur = '';
  words.forEach((w) => {
    const t = cur ? cur + ' ' + w : w;
    if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t;
  });
  if (cur) lines.push(cur);
  return lines;
}
export const easeInOut = (ph: number) => (ph < 0.5 ? 2 * ph * ph : 1 - Math.pow(-2 * ph + 2, 2) / 2);

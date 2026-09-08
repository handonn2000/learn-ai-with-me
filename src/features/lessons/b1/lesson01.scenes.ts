// Đặt bí danh TXT: các hàm vẽ đã có biến cục bộ `T` là THỜI GIAN của vòng rAF.
import { T as TXT } from './lesson01.text';
// Ba cảnh canvas của Buổi 1 — port nguyên logic vẽ từ bản thiết kế HTML.
import { MONO, SANS, rr, wrapText, easeInOut, type SceneApi } from '@/components/CanvasScene';
import { QUAD, ERAS, WINTERS, TIMELINE } from '@/content/courses/csc14003/intro-ai.js';

type Ctx = CanvasRenderingContext2D;
interface QuadCell { id: string; col: number; row: number; en: string; vn: string; tag: string; color: string; caption: string }

export function drawQuad(x: Ctx, { clock, w, h }: SceneApi, rm: boolean) {
  x.clearRect(0, 0, w, h);
  const padL = 96, padT = 56, padR = 20, padB = 52;
  const gw = (w - padL - padR) / 2, gh = (h - padT - padB) / 2;
  const order = ['th', 'tr', 'ah', 'ar'];
  const active = rm ? 3 : Math.floor(clock / 2.6) % 4;
  const ph = rm ? 1 : Math.min(1, ((clock / 2.6) % 1) / 0.35);
  const ease = easeInOut(ph);
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = '700 11px ' + MONO; x.fillStyle = '#7A8399';
  x.fillText(TXT.scenes.s1, padL + gw / 2, padT - 30);
  x.fillText(TXT.scenes.s2, padL + gw * 1.5, padT - 30);
  x.textAlign = 'left'; x.font = '700 10.5px ' + MONO;
  x.fillStyle = '#7A8399'; x.fillText('THOUGHT', 14, padT + gh / 2 - 9);
  x.fillStyle = '#5C6579'; x.font = '10px ' + MONO; x.fillText(TXT.scenes.s3, 14, padT + gh / 2 + 8);
  x.font = '700 10.5px ' + MONO; x.fillStyle = '#7A8399'; x.fillText('BEHAVIOR', 14, padT + gh * 1.5 - 9);
  x.fillStyle = '#5C6579'; x.font = '10px ' + MONO; x.fillText(TXT.scenes.s4, 14, padT + gh * 1.5 + 8);
  x.strokeStyle = 'rgba(120,132,155,.22)'; x.lineWidth = 1;
  x.beginPath(); x.moveTo(padL + gw, padT - 12); x.lineTo(padL + gw, padT + gh * 2 + 8); x.stroke();
  x.beginPath(); x.moveTo(80, padT + gh); x.lineTo(w - padR + 6, padT + gh); x.stroke();
  let cap = '';
  (QUAD as QuadCell[]).forEach((q) => {
    const isOn = order[active] === q.id;
    const bx = padL + q.col * gw + 6, by = padT + q.row * gh + 6, bw = gw - 12, bh = gh - 12;
    rr(x, bx, by, bw, bh, 13);
    x.fillStyle = isOn ? 'rgba(18,21,26,1)' : '#0E1117'; x.fill();
    x.strokeStyle = isOn ? q.color : '#232836'; x.lineWidth = isOn ? 2 : 1.2;
    if (isOn) { x.shadowColor = q.color; x.shadowBlur = 12 * ease; }
    x.stroke(); x.shadowBlur = 0;
    x.textAlign = 'left'; x.textBaseline = 'top';
    x.font = '700 10px ' + MONO; x.fillStyle = isOn ? q.color : '#5C6579';
    x.fillText(q.tag, bx + 16, by + 15);
    x.font = '600 17px ' + SANS; x.fillStyle = isOn ? '#ECEFF4' : '#8B93A7';
    x.fillText(q.vn, bx + 16, by + 36);
    x.font = 'italic 12.5px ' + SANS; x.fillStyle = isOn ? '#97A0B5' : '#5C6579';
    x.fillText(q.en, bx + 16, by + 62);
    if (isOn) {
      cap = q.caption;
      x.globalAlpha = ease; x.fillStyle = q.color;
      rr(x, bx + 16, by + bh - 22, 34 * ease, 3, 2); x.fill(); x.globalAlpha = 1;
    }
  });
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = '11.5px ' + MONO; x.fillStyle = '#7A8399';
  x.globalAlpha = rm ? 1 : ease; x.fillText(cap, w / 2, h - 22); x.globalAlpha = 1;
}

export function drawTuring(x: Ctx, { clock, w, h }: SceneApi, rm: boolean) {
  x.clearRect(0, 0, w, h);
  const L = 11, T = rm ? 8.2 : clock % L;
  const ax = 34, aw = Math.min(190, w * 0.26), acy = h / 2;
  const wall = ax + aw + Math.max(70, (w - aw - 60) * 0.22);
  const bx = wall + 46, bw = Math.min(210, w - bx - 30);
  const hy = h * 0.27, my = h * 0.73;
  const box = (bx0: number, by0: number, bw0: number, bh0: number, col: string, tag: string, name: string) => {
    rr(x, bx0, by0 - bh0 / 2, bw0, bh0, 12);
    x.fillStyle = '#12151A'; x.fill(); x.strokeStyle = col; x.lineWidth = 1.5; x.stroke();
    x.textAlign = 'left'; x.textBaseline = 'top';
    x.font = '700 10px ' + MONO; x.fillStyle = col; x.fillText(tag, bx0 + 14, by0 - bh0 / 2 + 12);
    x.font = '600 15px ' + SANS; x.fillStyle = '#ECEFF4'; x.fillText(name, bx0 + 14, by0 - bh0 / 2 + 30);
  };
  box(ax, acy, aw, 84, '#F4D345', 'INTERROGATOR', TXT.scenes.s5);
  box(bx, hy, bw, 66, '#58C4DD', 'PLAYER A', TXT.scenes.s6);
  box(bx, my, bw, 66, '#C792EA', 'PLAYER B', TXT.scenes.s7);
  x.setLineDash([5, 6]); x.strokeStyle = 'rgba(160,170,190,.35)'; x.lineWidth = 1.4;
  x.beginPath(); x.moveTo(wall, 34); x.lineTo(wall, h - 46); x.stroke(); x.setLineDash([]);
  x.save(); x.translate(wall - 10, h / 2); x.rotate(-Math.PI / 2);
  x.textAlign = 'center'; x.textBaseline = 'bottom'; x.font = '10px ' + MONO;
  x.fillStyle = '#5C6579'; x.fillText(TXT.scenes.s8, 0, 0); x.restore();
  const sx = ax + aw, ey = [hy, my];
  ey.forEach((yy) => {
    x.strokeStyle = 'rgba(120,132,155,.25)'; x.lineWidth = 1.2;
    x.beginPath(); x.moveTo(sx, acy); x.bezierCurveTo(sx + 60, acy, bx - 60, yy, bx, yy); x.stroke();
  });
  const pt = (t: number, yy: number): [number, number] => {
    const p0 = [sx, acy], p1 = [sx + 60, acy], p2 = [bx - 60, yy], p3 = [bx, yy], u = 1 - t;
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ];
  };
  x.textAlign = 'center'; x.textBaseline = 'middle';
  if (T < 3) {
    const t = Math.min(1, T / 2.4);
    x.font = '10.5px ' + MONO; x.fillStyle = '#F4D345';
    x.fillText(TXT.scenes.s9, (sx + bx) / 2, acy - 44);
    ey.forEach((yy) => {
      const p = pt(t, yy);
      x.fillStyle = '#F4D345'; x.shadowColor = '#F4D345'; x.shadowBlur = 12;
      x.beginPath(); x.arc(p[0], p[1], 5, 0, 7); x.fill(); x.shadowBlur = 0;
    });
  } else if (T < 6) {
    const t = Math.min(1, (T - 3) / 2.4);
    x.font = '10.5px ' + MONO; x.fillStyle = '#83C167';
    x.fillText(TXT.scenes.s10, (sx + bx) / 2, acy + 44);
    ([['#58C4DD', hy], ['#C792EA', my]] as [string, number][]).forEach(([col, yy]) => {
      const p = pt(1 - t, yy);
      x.fillStyle = col; x.shadowColor = col; x.shadowBlur = 12;
      x.beginPath(); x.arc(p[0], p[1], 5, 0, 7); x.fill(); x.shadowBlur = 0;
    });
  } else if (T < 8.4) {
    const a = 0.45 + 0.55 * Math.abs(Math.sin((T - 6) * 2.2));
    x.font = '700 30px ' + MONO; x.globalAlpha = a; x.fillStyle = '#F4D345';
    x.fillText('?', ax + aw / 2, acy + 52); x.globalAlpha = 1;
    x.font = '11px ' + MONO; x.fillStyle = '#97A0B5';
    x.fillText(TXT.scenes.s11, (ax + aw / 2 + wall) / 2, h - 26);
  } else {
    const a = Math.min(1, (T - 8.4) / 0.6);
    x.globalAlpha = a;
    x.font = '700 13.5px ' + MONO; x.fillStyle = '#83C167';
    x.fillText(TXT.scenes.s12, w / 2, h - 24);
    x.strokeStyle = 'rgba(131,193,103,.6)'; x.lineWidth = 1.6;
    rr(x, bx - 4, my - 37, bw + 8, 74, 14); x.stroke();
    x.globalAlpha = 1;
  }
  x.textAlign = 'left'; x.font = '10px ' + MONO; x.fillStyle = '#5C6579';
  x.fillText('Turing (1950) — “Computing Machinery and Intelligence”', 16, h - 14);
}

export function drawTimeline(x: Ctx, { clock, w, h }: SceneApi, rm: boolean) {
  x.clearRect(0, 0, w, h);
  const Y0 = 1940, Y1 = 2026, padX = 30;
  const px = (y: number) => padX + ((y - Y0) / (Y1 - Y0)) * (w - 2 * padX);
  const axis = h - 74, eraY = 30;
  const LOOP = 30, T = rm ? LOOP : clock % LOOP;
  const head = Y0 + (Y1 - Y0) * Math.min(1, T / (LOOP * 0.88));
  (ERAS as { from: number; to: number; label: string }[]).forEach((e, i) => {
    const a = px(e.from), b = px(Math.min(e.to, Y1));
    rr(x, a + 1, eraY - 11, b - a - 2, 22, 6);
    x.fillStyle = i % 2 ? 'rgba(88,196,221,.06)' : 'rgba(244,211,69,.05)'; x.fill();
    x.strokeStyle = 'rgba(120,132,155,.18)'; x.lineWidth = 1; x.stroke();
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '9.5px ' + MONO;
    x.fillStyle = head >= e.from ? '#97A0B5' : '#3E4557';
    const lines = wrapText(x, e.label, b - a - 8);
    x.fillText(lines[0] || '', (a + b) / 2, eraY);
  });
  (WINTERS as { from: number; to: number; label: string; note: string }[]).forEach((wt) => {
    const a = px(wt.from), b = px(wt.to);
    x.fillStyle = 'rgba(252,98,85,.10)'; x.fillRect(a, eraY + 20, b - a, axis - eraY - 20);
    x.strokeStyle = 'rgba(252,98,85,.35)'; x.lineWidth = 1; x.setLineDash([3, 4]);
    x.beginPath(); x.moveTo(a, eraY + 20); x.lineTo(a, axis); x.moveTo(b, eraY + 20); x.lineTo(b, axis); x.stroke();
    x.setLineDash([]);
    x.save(); x.translate((a + b) / 2, eraY + 34); x.rotate(-Math.PI / 2);
    x.textAlign = 'right'; x.textBaseline = 'middle'; x.font = '700 9.5px ' + MONO;
    x.fillStyle = '#FC6255'; x.fillText(wt.label, 0, 0);
    x.font = '8.5px ' + MONO; x.fillStyle = 'rgba(252,98,85,.6)'; x.fillText(wt.note, 0, 11);
    x.restore();
  });
  x.strokeStyle = 'rgba(160,170,190,.4)'; x.lineWidth = 1.4;
  x.beginPath(); x.moveTo(padX, axis); x.lineTo(w - padX, axis); x.stroke();
  x.textAlign = 'center'; x.textBaseline = 'top'; x.font = '9.5px ' + MONO;
  for (let y = 1940; y <= 2020; y += 10) {
    x.strokeStyle = 'rgba(120,132,155,.3)'; x.lineWidth = 1;
    x.beginPath(); x.moveTo(px(y), axis - 4); x.lineTo(px(y), axis + 4); x.stroke();
    x.fillStyle = '#5C6579'; x.fillText(String(y), px(y), axis + 9);
  }
  let cur: { y: number; t: string } | null = null;
  (TIMELINE as { y: number; t: string }[]).forEach((m, i) => {
    if (m.y > head) return;
    const age = head - m.y, X = px(m.y);
    const fresh = age < ((Y1 - Y0) / (LOOP * 0.88)) * 1.6;
    if (fresh && !rm) cur = m;
    x.fillStyle = fresh ? '#F4D345' : 'rgba(88,196,221,.75)';
    if (fresh) { x.shadowColor = '#F4D345'; x.shadowBlur = 12; }
    x.beginPath(); x.arc(X, axis, fresh ? 5.5 : 3.4, 0, 7); x.fill(); x.shadowBlur = 0;
    if (rm || !fresh) {
      const up = i % 2 === 0;
      x.strokeStyle = 'rgba(120,132,155,.22)'; x.lineWidth = 1;
      x.beginPath(); x.moveTo(X, axis); x.lineTo(X, up ? axis - 12 : axis + 22); x.stroke();
      x.save(); x.translate(X, up ? axis - 15 : axis + 25); x.rotate(-Math.PI / 3.2);
      x.textAlign = up ? 'left' : 'right'; x.textBaseline = 'middle';
      x.font = '9px ' + MONO; x.fillStyle = '#5C6579'; x.fillText(String(m.y), 0, 0); x.restore();
    }
  });
  if (cur) {
    const m = cur as { y: number; t: string };
    const X = px(m.y);
    x.strokeStyle = 'rgba(244,211,69,.55)'; x.lineWidth = 1.2;
    x.beginPath(); x.moveTo(X, axis - 8); x.lineTo(X, axis - 26); x.stroke();
    x.font = '700 12px ' + MONO; x.textBaseline = 'alphabetic';
    x.textAlign = X > w * 0.62 ? 'right' : 'left';
    const tx = X > w * 0.62 ? X - 8 : X + 8;
    x.fillStyle = '#F4D345'; x.fillText(String(m.y), tx, axis - 30);
    x.font = '13px ' + SANS; x.fillStyle = '#D9DFEC';
    const lines = wrapText(x, m.t, Math.min(420, w * 0.5));
    lines.slice(0, 3).forEach((ln, k) => x.fillText(ln, tx, axis - 30 + 19 + k * 18));
  }
  if (!rm) {
    const X = px(head);
    x.strokeStyle = 'rgba(244,211,69,.5)'; x.lineWidth = 1.2;
    x.beginPath(); x.moveTo(X, eraY + 20); x.lineTo(X, axis + 20); x.stroke();
  }
  x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.font = '9.5px ' + MONO;
  x.fillStyle = '#3E4557'; x.fillText(TXT.scenes.s13, 16, h - 12);
}

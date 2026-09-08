// Hai cảnh phụ của Buổi 3: vụ nổ hàm mũ & phong cảnh leo đồi — port nguyên logic vẽ.
import { MONO, type SceneApi } from '@/components/CanvasScene';
import { T as TXT } from './lesson03.text';

type Ctx = CanvasRenderingContext2D;

export function drawGrow(x: Ctx, { clock, w, h }: SceneApi, rm: boolean) {
  x.clearRect(0, 0, w, h);
  const T = rm ? 6.5 : clock % 7.6; // rm: khung cuối — cây bung hết, tấm phủ hiện đủ
  const df = Math.min(4.35, T / 1.05);
  const lvY = (d: number) => 30 + d * ((h - 58) / 4);
  for (let d = 0; d <= 4; d++) {
    const a = Math.max(0, Math.min(1, df - d + 1));
    if (a <= 0) break;
    const n = Math.pow(3, d);
    for (let i = 0; i < n; i++) {
      const px = 20 + ((i + 0.5) / n) * (w - 40), py = lvY(d);
      if (d > 0) {
        const qx = 20 + ((Math.floor(i / 3) + 0.5) / (n / 3)) * (w - 40), qy = lvY(d - 1);
        x.strokeStyle = 'rgba(88,196,221,' + a * 0.3 + ')'; x.lineWidth = 1;
        x.beginPath(); x.moveTo(qx, qy); x.lineTo(px, py); x.stroke();
      }
      x.fillStyle = 'rgba(88,196,221,' + a * 0.95 + ')';
      x.beginPath(); x.arc(px, py, Math.max(1.6, 7 - d * 1.35), 0, 7); x.fill();
    }
  }
  let done = Math.min(4, Math.floor(df)), tot = 0;
  for (let i = 0; i <= done; i++) tot += Math.pow(3, i);
  x.font = '700 12.5px ' + MONO; x.fillStyle = '#F4D345'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
  x.fillText('b = 3 · d = ' + done + ' → ' + tot + TXT.scenes.s1, 14, 20);
  if (T > 5.4) {
    const a = Math.min(1, (T - 5.4) / 0.7);
    x.fillStyle = 'rgba(11,13,18,' + a * 0.84 + ')'; x.fillRect(0, 0, w, h);
    x.globalAlpha = a; x.textAlign = 'center';
    x.font = '700 17px ' + MONO; x.fillStyle = '#FC6255'; x.fillText(TXT.scenes.s2, w / 2, h / 2 - 8);
    x.font = '11.5px ' + MONO; x.fillStyle = '#97A0B5'; x.fillText(TXT.scenes.s3, w / 2, h / 2 + 16);
    x.globalAlpha = 1;
  }
}

let stuckX: number | null = null;
export function drawHill(x: Ctx, { clock, w, h }: SceneApi, rm: boolean) {
  x.clearRect(0, 0, w, h);
  const f = (t: number) =>
    0.6 * Math.exp(-Math.pow((t - 0.26) / 0.13, 2)) + 0.95 * Math.exp(-Math.pow((t - 0.74) / 0.11, 2)) + 0.3 * Math.exp(-Math.pow((t - 0.5) / 0.055, 2));
  const px = (t: number) => 26 + t * (w - 52), py = (v: number) => h - 38 - v * (h - 84);
  x.strokeStyle = 'rgba(120,132,155,.3)'; x.lineWidth = 1;
  x.beginPath(); x.moveTo(20, h - 30); x.lineTo(w - 20, h - 30); x.stroke();
  x.font = '10px ' + MONO; x.fillStyle = '#5C6579'; x.textAlign = 'right'; x.textBaseline = 'alphabetic';
  x.fillText(TXT.scenes.s4, w - 22, h - 14);
  x.textAlign = 'left'; x.fillText(TXT.scenes.s5, 14, 18);
  x.strokeStyle = '#58C4DD'; x.lineWidth = 2.4; x.beginPath();
  for (let i = 0; i <= 90; i++) { const t = 0.02 + (0.96 * i) / 90; const X0 = px(t), Y0 = py(f(t)); if (i) x.lineTo(X0, Y0); else x.moveTo(X0, Y0); }
  x.stroke();
  x.setLineDash([3, 4]); x.strokeStyle = 'rgba(131,193,103,.55)';
  x.beginPath(); x.moveTo(px(0.74), py(f(0.74))); x.lineTo(px(0.74), h - 30); x.stroke(); x.setLineDash([]);
  x.font = '10.5px ' + MONO; x.fillStyle = '#83C167'; x.textAlign = 'center'; x.fillText(TXT.scenes.s6, px(0.74), py(f(0.74)) - 12);
  const T = rm ? 8 : clock % 8; // rm: bi đã nằm ở cực trị địa phương, nhãn KẸT hiện sẵn
  if (stuckX == null) { let s = 0.06; while (f(s + 0.003) > f(s)) s += 0.003; stuckX = s; }
  const ph = Math.min(1, T / 3.4), ee = ph < 0.5 ? 2 * ph * ph : 1 - Math.pow(-2 * ph + 2, 2) / 2;
  const bx = 0.06 + (stuckX - 0.06) * ee, bY = f(bx);
  x.fillStyle = '#F4D345'; x.shadowColor = '#F4D345'; x.shadowBlur = 12;
  x.beginPath(); x.arc(px(bx), py(bY) - 8, 7, 0, 7); x.fill(); x.shadowBlur = 0;
  if (T > 3.6) {
    const a = rm ? 1 : 0.5 + 0.5 * Math.sin(clock * 5);
    x.strokeStyle = 'rgba(252,98,85,' + (0.4 + 0.5 * a) + ')'; x.lineWidth = 2;
    x.beginPath(); x.arc(px(bx), py(bY) - 8, 11 + 2.5 * a, 0, 7); x.stroke();
    x.font = '700 11px ' + MONO; x.fillStyle = '#FC6255'; x.textAlign = 'center';
    x.fillText(TXT.scenes.s7, px(bx) + 14, py(bY) - 32);
    x.font = '10px ' + MONO; x.fillStyle = '#97A0B5';
    x.fillText(TXT.scenes.s8, px(0.52), h - 44);
  }
}

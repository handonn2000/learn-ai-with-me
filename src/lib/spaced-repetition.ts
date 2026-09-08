// Lịch ôn ngắt quãng (spaced repetition) — thuần logic, không phụ thuộc UI.
import { LOCALE_TAG } from './locale';
export type ReviewScheme = '1-3-7-14-30' | '2-5-10-21';

export function intervals(scheme: ReviewScheme): number[] {
  return scheme === '2-5-10-21' ? [2, 5, 10, 21] : [1, 3, 7, 14, 30];
}
export function addDays(iso: string, n: number): Date {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d;
}
export function fmtShort(d: Date): string {
  return d.toLocaleDateString(LOCALE_TAG, { day: '2-digit', month: '2-digit' });
}
export function startOfToday(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}
/**
 * MỨC lời khuyên sau quiz, không phải câu chữ. Chữ nằm ở `content/ui/*` — tầng lib không chứa
 * chuỗi hiển thị, nếu không thì mỗi ngôn ngữ mới lại phải sửa vào tận đây (specs/00-architecture).
 * Ngưỡng 60 / 85 giữ nguyên, khớp với scoreColorVar và trang Kiểm tra tổng hợp.
 */
export type TipLevel = 'none' | 'low' | 'mid' | 'high';

export function quizTip(score: number | undefined | null): TipLevel {
  if (score == null) return 'none';
  if (score < 60) return 'low';
  if (score < 85) return 'mid';
  return 'high';
}
export function scoreColorVar(score: number | undefined | null): string {
  if (score == null) return 'var(--muted-2)';
  return score >= 85 ? 'var(--green)' : score >= 60 ? 'var(--yellow)' : 'var(--red)';
}

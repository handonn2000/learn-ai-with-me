// Lịch ôn ngắt quãng (spaced repetition) — thuần logic, không phụ thuộc UI.
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
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}
export function startOfToday(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}
export function quizTip(score: number | undefined | null): string {
  if (score == null) return 'Làm quiz trong bài học đi, rồi tôi báo cáo cho.';
  if (score < 60) return 'Học lại phần lý thuyết rồi mai làm lại quiz. Đừng làm lại ngay — phải để não kịp quên thì nhớ mới bền.';
  if (score < 85) return 'Xem lại đúng mấy chủ đề sai ở trên thôi, rồi 2 ngày nữa làm lại quiz.';
  return 'Nắm chắc rồi, sang buổi kế tiếp được. Chỉ cần ôn theo lịch nhắc là đủ.';
}
export function scoreColorVar(score: number | undefined | null): string {
  if (score == null) return 'var(--muted-2)';
  return score >= 85 ? 'var(--green)' : score >= 60 ? 'var(--yellow)' : 'var(--red)';
}

/** Dấu hiệu: hai ga nối bằng một đoạn tuyến. */
export function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M5 18 C 9 18, 9 6, 19 6" fill="none" stroke="var(--route)" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="5" cy="18" r="3.4" fill="var(--surface)" stroke="var(--route)" strokeWidth="2.6" />
      <circle cx="19" cy="6" r="3.4" fill="var(--signal)" stroke="var(--signal)" strokeWidth="2.6" />
    </svg>
  )
}

/** Nhãn mono nhỏ in hoa mở đầu một thẻ. Trước đây mỗi trang bài học tự khai báo một bản
 *  giống hệt nhau — gom về đây theo quy ước "≥2 feature dùng thì nâng lên components/". */
export function Kicker({ children, color = 'var(--faint)' }: { children: React.ReactNode; color?: string }) {
  return <div className="kicker" style={color === 'var(--faint)' ? undefined : { color }}>{children}</div>;
}

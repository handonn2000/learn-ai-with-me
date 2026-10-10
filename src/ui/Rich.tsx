/** Hiển thị chuỗi có HTML inline (<b>, <i>, <code>) do chính repo viết — không dùng cho dữ liệu người dùng. */
export function Rich({ html, as: Tag = 'span', className = '' }: { html: string; as?: 'span' | 'p' | 'div'; className?: string }) {
  return <Tag className={`rich ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
}

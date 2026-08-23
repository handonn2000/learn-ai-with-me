export default function BlogPage() {
  return (
    <div className="container" style={{ padding: '48px 24px 90px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 700, margin: 0 }}>Blog</h1>
      <p style={{ color: 'var(--muted-2)', fontSize: 14.5, margin: '8px 0 0', maxWidth: 560, lineHeight: 1.7 }}>
        Chưa có bài nào. Chỗ này tôi để dành cho ghi chú học tập và portfolio — route đã sẵn, chỉ còn thiếu chữ;
        thêm nội dung tại <span className="code-inline">src/pages/BlogPage.tsx</span> (xem .claude/specs/blog.md).
      </p>
    </div>
  );
}

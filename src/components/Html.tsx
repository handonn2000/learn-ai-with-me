import type { ElementType } from 'react';

// Render chuỗi nội dung có định dạng inline (em/strong/a/span class="hl-*").
// Nội dung bài học là dữ liệu tĩnh do repo quản lý (không phải input người dùng).
export function Html({ t, as: Tag = 'span', ...rest }: { t: string; as?: ElementType } & Record<string, unknown>) {
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: t }} />;
}

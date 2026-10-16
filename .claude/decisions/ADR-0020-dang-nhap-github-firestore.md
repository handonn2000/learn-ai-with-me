# ADR-0020 — Đăng nhập GitHub và đồng bộ tiến độ qua Firestore

Ngày: 2026-10-16 · Trạng thái: chấp nhận · Thêm dependency `firebase`

## Bối cảnh

Tiến độ chỉ nằm ở localStorage nên mất khi đổi máy, đổi trình duyệt hay xóa dữ liệu trang. User muốn có
đăng nhập và lưu tiến độ trên mây. Đã cân nhắc:

- Google + Firestore: đơn giản, nhưng user muốn đăng nhập bằng GitHub.
- GitHub OAuth + lưu vào Gist của người học: người học tự giữ dữ liệu, nhưng phải giữ token GitHub (quyền
  `gist` trên mọi gist) trong trình duyệt, cần proxy đổi token, không có dữ liệu tổng hợp.
- Tự dựng backend: quá nặng cho một document nhỏ mỗi người.

## Quyết định

- Firebase Auth với provider GitHub (Firebase giữ client secret, đổi token giùm) + Firestore. App vẫn tĩnh
  trên Firebase Hosting (ADR-0019); không có server.
- Đăng nhập không bắt buộc. localStorage (`learn-ai-v2`) vẫn là nơi lưu chính; shape store không đổi.
- Một document mỗi người: `users/{uid}` = `{ version, progress: { skills, lessonStep, follow }, updatedAt }`.
  Ngày lưu dạng chuỗi ISO như localStorage. Luật: chỉ chủ `uid` đọc/ghi, chỉ ba trường đó, `updatedAt` là
  giờ server.
- Đăng nhập: gộp bản máy với bản mây — mỗi kỹ năng giữ thẻ có `last_review` mới hơn (bằng nhau thì nhiều
  `reps` hơn), bước dở lấy bước xa hơn, mục tiêu theo bên học gần nhất. Không bao giờ bỏ kỹ năng của bên nào.
- Đang học: ghi cả document sau 2 giây không có thay đổi, và ghi ngay khi trang bị ẩn.
- Đăng xuất: ghi nốt, rồi xóa tiến độ trong máy (máy dùng chung không lộ hay gộp nhầm tiến độ người khác).
- `signInWithPopup`, bị chặn popup thì `signInWithRedirect`. `authDomain` = `learn-ai-with-me.web.app` (cùng
  tên miền Hosting) để không phụ thuộc cookie bên thứ ba.
- Firebase tải lười: chỉ khi bấm đăng nhập hoặc máy có cờ `learn-ai-v2-signed-in`. Chunk riêng ~165KB gzip;
  khách không đăng nhập không tải.

## Hệ quả

- Firestore `(default)` ở `asia-east1` (không đổi được).
- Dependency `firebase` (Apache-2.0). Bundle chính không đổi.
- Đổi shape store từ nay phải sửa cả `parseCloud` và `CLOUD_VERSION` trong `learning/sync.ts`.
- Bật provider GitHub cần một GitHub OAuth App (callback `https://learn-ai-with-me.web.app/__/auth/handler`),
  client id/secret dán vào Firebase Console — việc của chủ project.
- Thống kê trên nhiều người học giờ có thể làm (đọc Firestore bằng quyền admin), chưa làm.

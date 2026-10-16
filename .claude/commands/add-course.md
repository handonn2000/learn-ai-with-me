Thêm một khóa học mới vào app.

Đầu vào cần hỏi user nếu thiếu: slug, mã môn, tên, số tuần, **mô tả khóa** (`description`), danh sách phần (**`id` ổn định** + tên + màu token + range + testDesc), danh sách buổi (id, tuần, phần, tên vi/en, giờ, topics, toán nền, link tài liệu).

`Part.id` và `Course.description` là trường BẮT BUỘC trong `content/types.ts` — thiếu là lỗi tsc. `description` cũng là nơi duy nhất được ghi nguồn tham khảo của khóa.

Các bước:
1. Đọc .claude/specs/00-architecture.md và src/content/types.ts.
2. Tạo src/content/courses/<slug>/index.ts export const <slug>: Course (theo mẫu csc14003).
3. Nếu có tài liệu PDF: đặt vào public/materials/<slug>/ và trỏ link theo đó.
4. Thêm vào courses[] trong src/content/courses/index.ts.
5. Chạy npm run build; xác nhận /courses và /courses/<slug> render đúng.
6. Cập nhật .claude/progress.md.

## Bổ sung: baseline trước bài học và tiến độ riêng (2026-09-07)

Khi user chỉ yêu cầu baseline/curriculum/roadmap, có thể suy ra metadata hợp lý từ
nguồn và ghi rõ giả định; không bắt buộc hỏi lại từng field. Không sinh bài học/lab/quiz.
Dùng `roadmapOnly: true`, `hasPartTests: false`, `baseline`; `Session` có thể thêm
outcome/practice/prerequisiteIds. `Part.testDesc` lúc này là milestone brief.
Không tạo lessonPath hoặc link tài liệu khi chưa có nội dung được phép đưa vào app.
PDF nguồn có thể được phân tích tại chỗ, không bắt buộc copy vào public/materials.

Đăng ký cả VI/EN qua registry hiện tại; tham khảo thư mục data-engineering-foundation
để tách shared structure khỏi prose. Thêm unit i18n và kiểm giá trị bản dịch.
Roadmap phải gọi useProgress(slug); ID buổi chỉ cần duy nhất trong một khóa.
Không bật hasPartTests cho khóa khác cho tới khi registry đề được mở rộng: hiện ngân
hàng câu hỏi và SessionQuiz vẫn thuộc CSC14003.

Kiểm build, contract bằng `node scripts/check-course.mjs`, routes VI/EN, progress
isolation và link không tồn tại. Ghi kế hoạch/phân tích nguồn ở docs/courses/<slug>/;
cập nhật specs, ADR nếu có thay đổi kiến trúc, và progress.md.

# ADR-0003 — Nội dung khóa học là data, UI là hàm của data

Ngày: 2026-08-21 · Trạng thái: chấp nhận

## Bối cảnh
Người dùng muốn phát triển thành blog/portfolio nhiều khóa; thêm khóa mới không được đụng UI core.

## Quyết định
- types.ts định nghĩa Course/Part/Session/MaterialLink; courses/index.ts export courses[].
- RoadmapPage, CoursesPage, HomePage render thuần từ Course — thêm khóa = thêm folder data + push vào courses[].
- Bài học tương tác là NGOẠI LỆ có chủ đích: mỗi bài là một page React thủ công (nội dung giáo dục cần tự do trình bày), nối vào data qua Session.lessonPath. Không cố nhét bài học vào JSON.
- Mức chuẩn bị: dựng cấu trúc + 1 khóa mẫu (không abstract quá tay: chưa có course registry động, chưa i18n).

## Hệ quả
- Quiz kiểm tra tổng hợp hiện gắn csc14003 (PART_TESTS import thẳng). Khi có khóa thứ 2: chuyển part-tests vào Course hoặc map theo slug — ghi chú sẵn, chưa làm sớm.

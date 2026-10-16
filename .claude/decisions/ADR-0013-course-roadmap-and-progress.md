# ADR-0013 — Course baseline và tiến độ theo khóa

Ngày: 2026-09-07 · Trạng thái: accepted

## Bối cảnh

User yêu cầu Data Engineering Foundation từ 12 PDF (853 trang), chỉ baseline,
curriculum và roadmap. UI đã data-driven nhưng hook/storage mặc định AI; các khóa
cùng dùng b1 sẽ đụng tiến độ. Trang kiểm tra dùng ngân hàng AI cố định.

## Quyết định

- Course có baseline/roadmapOnly/hasPartTests tùy chọn; session có outcome/practice/
  prerequisiteIds. Không tạo nội dung hoặc CTA giả cho bài chưa viết.
- DEF giữ thứ tự 12 nguồn, 4 phase, 12 tuần đề xuất, 72–96 giờ. Shared structure giữ
  ID và dependency đồng nhất VI/EN; hai bundle chữ được kiểm kiểu và i18n.
- Storage nhận slug tùy chọn; default CSC14003 giữ nguyên key và migration cũ.
  Khóa khác dùng <slug>-progress và không chạy migration đặc thù AI.
- Hook gắn snapshot với slug; fallback DB mới mỗi lần để tránh chia sẻ mutation.
- Roadmap gate đề theo capability; PartTestPage guard cả flag lẫn slug cho đến khi
  có registry đề thật. Không mở rộng SessionQuiz khi chưa có bài học DEF.
- Dùng dependencies hiện có; script contract chạy Vite SSR với HMR transport không
  listen để kiểm cấu trúc nội dung và storage mà không cần thêm test framework.

## Hệ quả và kiểm chứng

Tiến độ hai ngôn ngữ vẫn dùng chung; hai khóa tách biệt dù trùng session IDs.
Manual progress/spaced review khả dụng cho người tự học ngoài app; nhãn nêu rõ kế
hoạch chưa có bài chi tiết. Source audit và curriculum nằm trong docs/courses/ để
người viết sau thấy khoảng trống (FastAPI/Feast, rerun/backfill, delivery guarantees).

12 contract checks đã qua; browser kiểm VI/EN, reload, locale switch, mobile 390px,
AI test route hoạt động, DEF test route báo chưa có đề. Không thêm dependency,
không copy PDF vào public, không deploy trong tác vụ này.

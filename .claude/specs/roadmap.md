# Spec — Lộ trình khóa học (/courses/:slug)

File: src/features/roadmap/RoadmapPage.tsx (+ lib/spaced-repetition.ts)

## Goal
Một trang trả lời "hôm nay học gì, ôn gì, đang vững đâu hổng đâu".

## Layout
Container 1060px. Header (title + 3 stat card) → khối "Hôm nay" (border-left 4px cyan) → 4 card phương pháp (grid auto-fit 220px) → các phần của khóa (hiện 4), mỗi phần: thanh tiêu đề gạch dưới 2px màu phần + danh sách SessionCard + hàng "Kiểm tra tổng hợp" (border dashed màu phần) → footer.

## Header
course.org (mono) → title + titleAccent → subtitle → **course.description** (đoạn giới thiệu khóa) → 3 stat card bên phải.

## Component: 3 stat card
- Tiến độ: X/11 + progress bar 5px (cyan trên --border).
- Quiz TB: trung bình quizScore các buổi đã có điểm; màu theo ngưỡng ≥85 green / ≥60 yellow / else red / null muted. Điểm do `<SessionQuiz>` trong trang bài học ghi (mục `#quiz`) — trang này chỉ đọc.
- Cần ôn hôm nay: đếm mốc ôn đến hạn; số lịch (1·3·7·14·30) bấm được để đổi scheme sang 2·5·10·21 (state cục bộ).

## Khối "Hôm nay" — thứ tự sinh gợi ý
1. Mỗi buổi done: mốc ôn i đến hạn (completedAt + interval ≤ hôm nay, chưa tick) → item "ÔN LẠI" (tag vàng, link `lessonPath + "#quiz"` để vào thẳng quiz) + nút "Đã ôn ✓" ghi reviewsDone.
2. Phần nào 100% done mà chưa có điểm test → item "KIỂM TRA" (tag màu phần) link tests#pN.
3. Buổi chưa done đầu tiên → item "HỌC TIẾP" (tag cyan).
4. Rỗng → item "HOÀN TẤT" (tag green).

## SessionCard
Trái: TUẦN + số 26px màu phần + dot trạng thái (done green / doing cyan / todo rỗng). Giữa: title (bỏ prefix theo `UI.roadmap.titlePrefix` — mẫu khác nhau giữa hai ngôn ngữ), en, chip giờ, chip LAB (vàng) nếu có; topics; "TOÁN NỀN ·" mono; hàng CTA: nút "Mở bài học tương tác →" (bg cyan) nếu có lessonPath, ngược lại chip dashed “Bài học tương tác đang dựng”; link tài liệu mở tab mới (“Bài tập”, “Bài tập 1/2” khi một buổi có hai đề như b3, “Lab N” — không có link tài liệu gốc). Báo cáo (khi done hoặc có điểm): ƯU ĐIỂM (quizRight) / CẦN CẢI THIỆN (quizWrong) — cả hai là `topicId`, hiển thị qua `topicLabel()` / GỢI Ý (`UI.tip[quizTip(score)]` — quizTip trả MỨC, chữ ở content/ui). Phải: badge QUIZ n% (màu ngưỡng), segmented Chưa/Đang/Xong (set status; done ghi completedAt, rời done xóa completedAt+reviewsDone), hàng 5 nút ôn tròn 22px (+n) — done green đặc / due viền vàng bấm được / chưa tới hạn mờ, tooltip ngày.

## Acceptance
- Đổi trạng thái ở đây → quay lại từ bài học (focus) thấy đúng; và ngược lại.
- Xong 1 buổi hôm nay → mai có 1 item ÔN LẠI (+1); tick → biến mất, dot ôn xanh.
- Điểm part test hiện ở hàng kiểm tra ("Làm lại" thay "Làm bài").

## Khóa chỉ có kế hoạch (2026-09-07)

Với `roadmapOnly: true`, hiện nhãn kế hoạch và `CourseBaseline`: đối tượng, đầu vào,
đầu ra, nhịp học; phần mở rộng cho phạm vi, công cụ, đích hoàn thành. Card buổi hiện
kiến thức chuẩn bị, outcome, practice brief và prerequisiteIds đã đổi thành tên buổi.
Không hiện thống kê quiz, báo cáo quiz hay phương pháp riêng của AI. Hôm nay/ôn tập
có lời dẫn phù hợp với kế hoạch. Vẫn cho phép tự đánh dấu tiến độ và lịch ôn.

`hasPartTests` quyết định CTA kiểm tra; nếu false/thiếu thì `Part.testDesc` mô tả
mốc hoàn thành đề xuất, không phải một đề kiểm tra đã có. Không có lessonPath thì
không tạo link bài học. `useProgress(slug)` tách dữ liệu theo khóa.

Đã kiểm DEF VI/EN: 12 card, không link lessons/tests, Done giữ qua reload và đổi ngôn
ngữ, mobile 390px không tràn ngang; tiến độ AI không đổi. Contract test:
`node scripts/check-course.mjs`. Baseline/course plan ở `docs/courses/data-engineering-foundation/`.

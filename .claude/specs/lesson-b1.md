# Spec — Buổi 1 · Nhập môn AI (/courses/csc14003/lessons/b1)

Files: features/lessons/b1/Lesson01Intro.tsx, lesson01.scenes.ts; data: content/courses/csc14003/intro-ai.js (QUAD, QUIZ, ERAS, WINTERS, TIMELINE, FIELDS, CANDO, TOPICS, CHECKS) + math-primers.js (MATH_PRIMERS.b1).

## Goal
Bài đọc tương tác zero→hero: 10 mục, 3 cảnh canvas tự chạy, quiz active-recall, checklist lưu máy.
Giọng tôi/bạn theo skill `lesson-voice`, **khuôn 7 — kể chuyện mở màn, đối thoại gỡ nút** (7 icon làm mốc).
Cảnh mở màn: 01 tấm bảng Feynman 1988 · 03 Turing trên *Mind* 10/1950 · 04 Newell & Simon 1961 bắt người
nghĩ thành tiếng · 07 Minsky hứa với Life 1970 · 08 Nobel 2024. Hai cụm đối thoại: mục 03 (vượt/trượt
phép thử Turing) và mục 05 (sang đường bị cửa máy bay rơi trúng). Không trích nguồn trong bài.

## Khung trang
LessonNav sticky (badge BUỔI 1, 11 anchor gồm TOÁN NỀN, mục 05 tô vàng, progress bar cuộn 2px gradient cyan→yellow). Mỗi mục: container 1120px, padding-top 78px, SectionHead (số vàng mono + title Spectral 31px + en nghiêng + gạch 110×3px màu mục) + sec-lead. Mọi khối hiện dần bằng <Reveal> (translateY 20px, stagger 0.05–0.2s).

## Nội dung từng mục
- Toán nền (#toan, không đánh số, ngay sau hero): `<MathPrimer>` 2 phút — buổi này không cần toán, chỉ 2 thuật ngữ Rational / Agent.
- Hero: kicker vàng, h1 52px "Trí tuệ nhân tạo là gì?", lead, công thức f: 𝓟 → 𝓐 serif italic 27px + 2 chip giải nghĩa, 4 chip meta; phải: bảng 2×2 mini float 7s.
- 01: lead + 2 card (Intelligence / AI) + 2 card (ngành mới + 5 chip nhân vật; 4 mặt mô phỏng).
- 02: canvas drawQuad 380px — bảng 2×2, ô active xoay vòng 2.6s/ô, glow màu ô, caption giữa đáy; card chú thích 4 chip cách đọc trục.
- 03: canvas drawTuring 300px — loop 11s: hỏi (chấm vàng theo bezier) → trả lời (chấm cyan/tím ngược) → "?" nhấp nháy → khung green "vượt phép thử"; 2 card biến thể + vì sao ít theo đuổi (border đỏ: lý do thực dụng → giới hạn tự thân của thước đo "hành vi người" vs "hành vi thông minh" → đố cừu/giẻ lau).
- 04: 2 card GPS/khoa học tri nhận (viền cyan) và Aristotle (viền tím, tam đoạn luận song ngữ, 2 chỗ vấp).
- 05: 3 card (agent là gì / rộng hơn luật tư duy / dễ làm khoa học) + **quiz 4 ô**: 8 câu QUIZ, bấm 1 trong 4 ô QUAD → đáp án đúng viền green, sai viền đỏ; feedback ✓/✗ + q.why; nút "Câu tiếp →"/"↺ Về câu 1"; đếm ĐÚNG x/8 (chỉ tính lần đầu mỗi câu, state answered[]); nút làm lại reset. State cục bộ, không lưu máy — nhưng điểm này KHÔNG ghi vào progress (quiz của buổi nằm trong tự kiểm; giữ đúng hành vi bản gốc). + card 4 tình huống tranh luận.
- 06: bảng FIELDS 8 hàng (mono cyan / vn / đóng góp) + card lồng AI⊃ML⊃DL + card Được/Mất.
- 07: canvas drawTimeline 340px — loop 30s, đầu đọc quét 1940→2026, mốc fresh vàng glow + label 3 dòng wrap, mùa đông đỏ dashed, eras dải trên; 4 card giai đoạn + đoạn nghiêng giải thích cơ chế mùa đông AI (hứa quá tay → hết tiền). TIMELINE chạy tới **2025** (GPT-4 2023 · Nobel Vật lý + Hóa học 2024 · AI agent thành dòng chính 2025).
- 08: lead mở bằng cảnh Nobel 2024; 3 card ứng dụng (MYCIN hội thoại mono) + chips CANDO **16 nút** toggle (green khi chọn, state cục bộ — 4 chip cuối là năng lực hiện đại: viết code từ mô tả, dựng video, tóm tắt tài liệu lạ, tự chia việc nhiều bước) + card GIỚI HẠN VÀ ĐẠO ĐỨC (4 ô rủi ro, border đỏ; có deepfake, dữ liệu vơ từ Internet, và ảo giác).
- 09: TOPICS 4 hàng border-left màu + CheckList key `b1-checks` (8 ô, localStorage). Không có khối tài liệu tham khảo — nguồn chỉ nằm ở Course.description.
- 10: **Quiz 8 câu** — `<SessionQuiz sessionId="b1">`, id `#quiz`, nav tô vàng. Chấm theo chủ đề trong buổi (Bốn hướng tiếp cận · Phép thử Turing · Nền tảng · Lịch sử · Agent duy lý · Ứng dụng & giới hạn); điểm ghi vào `sessions.b1.quiz*`. KHÁC với quiz 4 ô ở mục 05 — cái đó là bài tập phân loại nằm trong lúc giảng, không ghi điểm.
- 11: **không phải bài tập** — buổi 1 không có đề riêng (bộ đề của khóa bắt đầu từ nội dung buổi 2). Mục này là cầu nối: 3 card tự vấn rút từ chính nội dung buổi 1 (bốn ô / giới hạn phép thử Turing / cơ chế mùa đông AI), mỗi card có link ôn anchor; lead trỏ sang mục 10 của bài b2 nơi bốn câu PEAS được giao thật. + link về lộ trình.

## Acceptance
- 3 canvas chạy mượt, resize đúng, dừng ở khung thái tĩnh khi prefers-reduced-motion.
- Quiz: không đổi được đáp án sau khi chọn; điểm chỉ tăng lần trả lời đầu của mỗi câu.
- Checklist giữ trạng thái sau reload.

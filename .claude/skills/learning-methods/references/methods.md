# Thẻ phương pháp

Mỗi thẻ cùng một khung. **Bằng chứng** có ba mức:

- **vững**: nhiều thí nghiệm có đối chứng hoặc phân tích gộp, lặp lại được.
- **có cơ sở**: có nghiên cứu ủng hộ nhưng hiệu ứng phụ thuộc điều kiện, hoặc ít nghiên cứu.
- **kinh nghiệm**: thực hành của người dạy, chưa có đối chứng.

Nguồn ghi tên tác giả + năm để tra khi cần; không đưa vào nội dung bài học (CLAUDE.md: không
trích nguồn trong bài).

Mục lục: M1 đoán trước · M2 ví dụ làm mẫu rồi rút dần · M3 tự làm có thang gợi ý · M4 cặp đối
lập · M5 tìm lỗi · M6 tự giải thích · M7 nhớ lại tự do · M8 ôn ngắt quãng · M9 xen kẽ · M10 bối
cảnh mới · M11 tổ chức lại trên giấy · M12 ý chính trước chi tiết · M13 câu hỏi của người học ·
M14 độ chắc chắn · M15 thẻ ghi nhớ cho dữ kiện rời

---

## M1 · Đoán trước

- **Cơ chế:** cố đoán buộc não lục kiến thức cũ để dựng khung; đoán sai rồi được sửa thì câu đúng
  bám chắc hơn chỉ đọc. Sai lúc rất chắc lại càng nhớ lâu (hypercorrection).
- **Bằng chứng:** vững. Richland, Kornell & Kao 2009; Kornell, Hays & Bjork 2009; Butterfield &
  Metcalfe 2001.
- **Dùng khi:** mở đầu mọi ga; cuối buổi để mồi cho ga sau. Hợp nhất khi có một ngộ nhận phổ biến
  hoặc một cặp khái niệm hay đảo.
- **Không dùng khi:** câu hỏi đòi kiến thức người học không thể có để đoán có cơ sở (đoán bừa
  50/50 không tạo khung). Không biến thành bài kiểm tra tính điểm.
- **Trong v2:** `GuessStep` (`kind: 'guess'`), `wrongSure` cho ca sai mà rất chắc. Không ghi vào
  FSRS. Phản hồi phải hiện **ngay** sau khi chốt.
- **Làm sai thường gặp:** đáp án lộ trong `note` của phương án; câu đúng hiển nhiên đến mức không
  ai sai; phản hồi chỉ nói "sai rồi" mà không nói vì sao.

## M2 · Ví dụ làm mẫu rồi rút dần

- **Cơ chế:** người mới chưa có schema nên giải từ đầu tốn hết bộ nhớ làm việc cho việc mò. Xem
  một lời giải đầy đủ có lý do từng bước rồi tự làm phần còn lại giảm tải đó.
- **Bằng chứng:** vững. Sweller & Cooper 1985; Renkl & Atkinson 2003. Lưu ý *expertise reversal*
  (Kalyuga và cộng sự 2003): người đã giỏi thì ví dụ mẫu thành thừa.
- **Dùng khi:** loại T và M; bước giải thích đầu tiên.
- **Không dùng khi:** người học vào ga qua xếp lớp (đã biết) — để họ làm thẳng.
- **Trong v2:** `SearchPlayer`/`GraphView` trong MDX cho ví dụ mẫu; bài tập 1 là `trace` với
  `from` > 0 (chạy sẵn vài bước, người học làm tiếp); bài tập 2 tự làm từ đầu.
- **Làm sai thường gặp:** ví dụ mẫu chỉ đưa kết quả, không nói *vì sao* chọn bước đó; bài tập đầu
  đã đòi làm từ đầu trên bản đồ lạ.

## M3 · Tự làm có thang gợi ý

- **Cơ chế:** tự tạo ra câu trả lời là một lần truy xuất; gợi ý giữ người học ở vùng vừa sức thay
  vì kẹt hẳn. Phản hồi sau một lần làm trọn hiệu quả hơn được nhắc giữa chừng.
- **Bằng chứng:** vững cho hiệu ứng tạo sinh và kiểm tra (Slamecka & Graf 1978; Roediger &
  Karpicke 2006); có cơ sở cho thiết kế thang gợi ý cụ thể.
- **Dùng khi:** mọi bài tập.
- **Trong v2:** `hint` → `explain`; `HintLadder`. Điểm: sạch → Good, gợi ý hoặc sai ≥ 2 → Hard,
  xem lời giải → Again (`outcomeToRating`, `worstOutcome`).
- **Làm sai thường gặp:** `hint` đưa luôn đáp án (phải dừng ở khoảng nửa đường); `explain` lặp lại
  đề bài thay vì nói cách nghĩ.

## M4 · Cặp đối lập (so sánh, xếp hạng)

- **Cơ chế:** đặt hai thứ cạnh nhau buộc não tìm chỗ khác và chỗ giống; đó là lúc schema hình
  thành. Đánh giá cái nào quan trọng hơn cũng buộc phải so sánh.
- **Bằng chứng:** có cơ sở đến vững. Schwartz & Bransford 1998; Alfieri, Nokes-Malach & Schunn
  2013 (phân tích gộp về so sánh ca). Đây cũng là trục chính trong cách dạy của Justin Sung.
- **Dùng khi:** loại K (bắt buộc), loại P khi có cặp hay đảo; phần giải thích của K đưa cặp đối
  lập trước thuật ngữ.
- **Không dùng khi:** hai thứ khác nhau quá xa (so táo với xe tải không dạy gì).
- **Trong v2:** bài tập `choice`/`order`; hoặc `paper` với `reference` khi cần viết lời. Ví dụ cặp
  trong repo: BFS và UCS (ít chặng hay rẻ nhất), GBFS và A* (chỉ h hay g + h), S và A trong PEAS.
- **Làm sai thường gặp:** hỏi "A là gì, B là gì" (hai câu nhớ riêng) thay vì "A khác B ở đâu, khi
  nào khác biệt đó đổi kết quả".

## M5 · Tìm lỗi trong bài làm sai

- **Cơ chế:** nhận ra và sửa lỗi của người khác luyện đúng ranh giới của khái niệm, và an toàn hơn
  để người học tự mắc lỗi đó.
- **Bằng chứng:** có cơ sở. Große & Renkl 2007; McLaren và cộng sự 2016 (erroneous examples).
  Hợp với người đã có nền; người mới nên gặp sau ví dụ đúng.
- **Dùng khi:** loại P (bài tập 2), loại T cho lỗi kinh điển (dừng khi *thấy* đích thay vì khi
  *lấy ra* đích trong UCS).
- **Trong v2:** `classify` với đề "bạn này đặt nhầm, mục này thật ra thuộc đâu" (`peas-e2` là mẫu);
  `choice` "bước nào sai".
- **Làm sai thường gặp:** lỗi bịa ra không ai mắc thật; đặt bài tìm lỗi trước khi người học thấy
  một lời giải đúng.

## M6 · Tự giải thích

- **Cơ chế:** nói ra "vì sao bước này đúng" lấp khoảng trống giữa các bước và nối với nguyên lý.
- **Bằng chứng:** có cơ sở. Chi và cộng sự 1989, 1994; Dunlosky và cộng sự 2013 xếp mức vừa.
- **Dùng khi:** phần "giải thích vì sao" trong `can` (vd. `graph-search`, `admissible`, `bfs`).
- **Trong v2:** `paper` với `reference` (người học viết, rồi đối chiếu từng ý); câu nhớ lại dạng
  "Vì sao…?".
- **Làm sai thường gặp:** đòi giải thích mà không cho đáp án để đối chiếu; câu hỏi "vì sao" có thể
  trả lời bằng cách chép một câu trong bài.

## M7 · Nhớ lại tự do (không gợi ý)

- **Cơ chế:** tự lấy ra mà không có phương án làm bám luyện đúng kiểu truy xuất cần dùng thật;
  câu có phương án chỉ luyện nhận ra, và trí nhớ bị khóa vào kiểu gợi ý đó (cue-dependent
  forgetting).
- **Bằng chứng:** vững cho hiệu ứng kiểm tra; nhớ lại tự do mạnh hơn nhận ra (Roediger & Karpicke
  2006; Karpicke & Blunt 2011).
- **Dùng khi:** mọi kỹ năng có ít nhất một câu (luật 4 trong SKILL.md).
- **Trong v2:** `recalls` trong `src/content/recall.ts`; người học viết rồi tự đánh dấu ý; app gợi
  ý mức chấm, người học quyết (`recordRating`). Hiện có 4 kỹ năng; các kỹ năng còn lại là việc
  tồn đọng, không phải ngoại lệ.
- **Làm sai thường gặp:** `points` quá chi tiết đến mức không ai viết đủ (người học tự chấm Quên
  dù đã nắm ý chính); câu hỏi chỉ có một chữ trả lời (đó là thẻ ghi nhớ, không phải nhớ lại).

## M8 · Ôn ngắt quãng

- **Cơ chế:** ôn khi trí nhớ vừa bắt đầu phai làm lần truy xuất tốn sức hơn và nhớ lâu hơn ôn
  dồn.
- **Bằng chứng:** vững. Cepeda và cộng sự 2006 (phân tích gộp); FSRS là mô hình lịch được khớp
  trên dữ liệu ôn thật.
- **Dùng khi:** mọi kỹ năng sau khi học hoặc vượt xếp lớp.
- **Trong v2:** `ts-fsrs`, một thẻ cho mỗi kỹ năng, không có bước ngắn hạn, không fuzz; tối đa
  `MAX_REVIEW` = 5 câu mỗi lần; câu ôn xoay vòng giữa `checks`, bài tập và `recalls`.
- **Không làm:** thay bằng mốc cố định (1-3-7-14-30 là của v1); đẩy retention cao hơn mặc định
  để "chắc ăn" (số câu ôn tăng rất nhanh).

## M9 · Xen kẽ

- **Cơ chế:** trộn các loại bài gần giống nhau buộc người học trước hết phải *nhận ra* đây là loại
  nào; luyện theo khối bỏ qua bước đó.
- **Bằng chứng:** vững cho việc phân biệt các loại dễ lẫn (Kornell & Bjork 2008; Rohrer & Taylor
  2007). Ít lợi khi các loại không giống nhau.
- **Dùng khi:** câu ôn của các kỹ năng anh em: BFS/UCS/GBFS/A*; `env-dims`/`env-classify`/`peas`.
- **Trong v2:** **đề xuất, chưa làm.** Hàng ôn hiện xếp theo hạn (`dueSkills`). Nếu làm: trong 5
  câu đến hạn, tránh hai câu liền nhau cùng một kỹ năng, ưu tiên đặt kỹ năng anh em cạnh nhau.
  Không đổi lịch FSRS, chỉ đổi thứ tự trong một lần ôn.
- **Làm sai thường gặp:** xen kẽ ngay trong lesson khi người học chưa nắm từng loại (gây ngợp).

## M10 · Bối cảnh mới

- **Cơ chế:** cùng một kỹ năng ở nhiều bối cảnh giúp tách cái cốt lõi khỏi chi tiết bề mặt, nên
  dùng được ở chỗ chưa gặp.
- **Bằng chứng:** có cơ sở. Paas & van Merriënboer 1994 (biến thiên trong ví dụ mẫu); nghiên cứu
  chuyển giao nói chung.
- **Dùng khi:** câu ôn (luật 2), bài tập 2 trở đi, bước giấy.
- **Trong v2:** bản đồ khác trong `checks` (đáp án `trace` do engine tính, không gõ tay — xem
  `docs/DESIGN.md`); tác tử khác cho PEAS/môi trường (drone, robot hút bụi, hệ chẩn đoán).
- **Làm sai thường gặp:** đổi bối cảnh nhưng giữ nguyên đáp án; bối cảnh lạ đến mức phải học
  thêm kiến thức mới (vi phạm luật "bài tập không dạy cái mới").

## M11 · Tổ chức lại trên giấy

- **Cơ chế:** chuyển thông tin tuyến tính thành sơ đồ buộc ra quyết định về nhóm, quan hệ, hướng
  mũi tên; làm gấp sách thì thêm một lần truy xuất. Vị trí trên trang là mốc nhớ không gian.
- **Bằng chứng:** có cơ sở. Nesbit & Adesope 2006 (bản đồ khái niệm, hiệu ứng vừa); tóm tắt mở
  sách thì hiệu quả thấp (Dunlosky và cộng sự 2013). Phần "để rối rồi dọn" là kinh nghiệm
  (Justin Sung).
- **Dùng khi:** cuối buổi, mọi loại; vẽ lại trong Sổ tay khi kỹ năng sắp quên.
- **Trong v2:** `reorganize` (`ReorganizeData`: `frame`, `sketch`, `ideas`), `Reorganize.tsx`;
  vẽ lại 3 phút trong `NotebookPage`.
- **Hướng dẫn cho người học:** "gom theo nhóm *của bạn*, vẽ mũi tên cái nào dẫn tới cái nào", và
  so bằng câu hỏi "trang của bạn có đủ các ý này chưa", không phải "có giống sketch không".
- **Làm sai thường gặp:** sketch mẫu thành đáp án phải chép đúng bố cục; chỉ che chữ rồi lật (đó
  là nhận ra, không phải tổ chức lại).

## M12 · Ý chính trước chi tiết

- **Cơ chế:** biết trước khung và đích giúp chi tiết đến sau có chỗ để gắn vào.
- **Bằng chứng:** có cơ sở, hiệu ứng nhỏ. Ausubel 1960 (advance organizer); Luiten và cộng sự
  1980.
- **Dùng khi:** mở đầu ga; "Đào sâu" để chi tiết nâng cao ra khỏi luồng chính.
- **Trong v2:** `LessonIntro` (học xong làm được gì + cần biết trước kèm % nhớ); đoán trước ga sau
  ở cuối buổi; khối `Deep` thu gọn.
- **Làm sai thường gặp:** phần mở đầu thành một đoạn giải thích thứ tư (vượt ≤ 3 bước explain).

## M13 · Câu hỏi của người học

- **Cơ chế:** biến cảm giác bối rối mơ hồ thành câu hỏi cụ thể là chỉ ra chỗ hở trong schema; có
  câu hỏi thì việc đọc tiếp có hướng.
- **Bằng chứng:** có cơ sở cho việc tự đặt câu hỏi (Rosenshine, Meister & Chard 1996); "la bàn bối
  rối" là kinh nghiệm (Justin Sung).
- **Trong v2:** **đề xuất, chưa làm.** Ô "Tôi đang thắc mắc…" ở bước giải thích, lưu vào Sổ tay,
  hỏi lại ở màn Qua ga. Cần trường mới trong store `learn-ai-v2` → tăng `version` + migration.
- **Cũng dùng cho tác giả:** câu hỏi người học để lại là tín hiệu chỗ bài giải thích còn hở.

## M14 · Độ chắc chắn

- **Cơ chế:** người học thường tự tin quá mức sau khi đọc trôi chảy; thấy được "chắc mà sai" sửa
  lại cảm giác đó (siêu nhận thức).
- **Bằng chứng:** có cơ sở. Dunlosky & Rawson 2012 (tự tin quá mức làm dừng học sớm).
- **Trong v2:** `ConfidenceControl` trong `GuessStep`. **Đề xuất, chưa làm:** lưu lần đoán + độ
  chắc để hiện tỉ lệ "chắc mà sai" — gộp vào cùng lần đổi store với M13 để chỉ viết migration
  một lần.
- **Không làm:** chấm điểm người học theo độ chắc chắn, hay xếp hạng; đây là gương soi, không phải
  thành tích.

## M15 · Thẻ ghi nhớ cho dữ kiện rời

- **Cơ chế:** lặp lại có lịch giữ được những thứ không suy ra được từ đâu.
- **Bằng chứng:** vững cho dữ kiện (hiệu ứng kiểm tra + giãn cách).
- **Dùng khi:** phương án cuối cho loại D, sau khi đã thử nối vào một ga.
- **Trong v2:** một ý trong `recalls` của ga gần nhất; chưa có cơ chế thẻ rời và chưa cần.
- **Không làm:** biến kỹ năng T/K/P/M thành thẻ hỏi-đáp một dòng.

---

## Không có thẻ (nằm ở skill khác)

- **Hình + lời, animation, chọn 2D/3D:** `lesson-interactive` (lưu ý: phần ràng buộc kỹ thuật ở đó
  viết cho v1; nguyên tắc chọn hình thức vẫn dùng được).
- **Giọng văn:** `lesson-voice`.

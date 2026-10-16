# Evals — cải thiện skill dần dần

Bộ skill trong `.claude/skills/` sẽ được dùng đi dùng lại cho chín buổi còn lại. Câu hỏi
cần trả lời được mỗi khi sửa chúng: **sửa như vậy làm kết quả tốt lên hay xấu đi?**

Đoán bằng cảm giác thì không đáng tin, vì bạn vừa viết skill xong nên đọc gì cũng thấy hợp
lý. Hệ này thay cảm giác bằng hai lớp bằng chứng.

## Hai lớp bằng chứng

**Lớp 1 — máy chấm.** Build có sạch không, `check_lesson.py` có qua không, route có nối
không. Rẻ, khách quan, chạy lại bao nhiêu lần cũng ra một kết quả. **Đây là xương sống** —
nó bắt hồi quy, tức là chuyện skill sửa xong lại làm hỏng thứ vốn đang chạy.

**Lớp 2 — giám khảo chấm văn.** Một phiên `claude -p` đọc output và chấm theo `rubric.md`,
sáu tiêu chí × 2 điểm. Dao động ±1–2 điểm giữa các lần chạy, nên **chỉ tin khoảng cách ≥ 3
điểm** hoặc xu hướng lặp lại. Nó không thay việc bạn tự đọc — nó chỉ nói chỗ nào đáng đọc.

Và lớp 0 vẫn quan trọng nhất: **mở `artifacts/` ra đọc**. Không thang điểm nào bắt được
"đoạn này đúng nhưng chán".

## Chạy

```bash
python3 .claude/evals/run.py --case voice-rewrite    # rẻ nhất, bắt đầu từ đây
python3 .claude/evals/grade.py                       # chấm lần chạy mới nhất
```

Chạy hết:

```bash
python3 .claude/evals/run.py        # 3 case × 2 biến thể = 6 phiên Claude Code
python3 .claude/evals/grade.py
```

**Tốn tiền và thời gian thật.** Case `b4-full` là một phiên dựng bài học đầy đủ, có thể
mất 10–25 phút và vài đô. `run.py` in tổng chi phí ở cuối. Hai case nhẹ chạy nhanh và rẻ —
dùng chúng cho vòng lặp thường ngày, để dành `b4-full` cho lúc sắp chốt.

Cờ hay dùng:

| Cờ | Dùng khi |
|---|---|
| `--variant with` | chỉ chạy bản có skill, bỏ baseline — nhanh gấp đôi |
| `--case <id>` | chạy một case, lặp cờ được |
| `--keep-sandbox` | giữ bản sao ở `/tmp/lawm-evals/` để mở ra xem tận nơi |
| `--model opus` | ép model, mặc định theo cấu hình `claude` của bạn |
| `--permission-mode bypassPermissions` | nếu agent bị chặn quyền giữa chừng |

## Cách nó chạy

Mỗi lượt được cách ly hoàn toàn với repo thật:

1. `rsync` repo sang `/tmp/lawm-evals/<stamp>/<case>__<variant>/`, `node_modules` symlink.
2. Biến thể `without` bị **xóa `.claude/skills/`** và cắt mục Skill khỏi `CLAUDE.md` — nó
   thật sự không biết skill tồn tại. Đó là baseline lương thiện.
3. Chạy `claude -p "<prompt>"` với cwd là bản sao đó.
4. `diff -rq` với repo gốc để biết agent đã tạo/sửa file nào.
5. Chạy `npm run build` và `check_lesson.py --json` **ngay trong bản sao**.
6. Chép kết quả về `results/<stamp>/`, xóa bản sao (trừ khi `--keep-sandbox`).

Repo thật không bị đụng tới ở bất kỳ bước nào.

## Đọc kết quả

```
results/<stamp>/
├── runs.json                       # tổng hợp máy đọc
├── report.md                       # bảng + nhận xét, đọc cái này trước
└── <case>__<variant>/
    ├── meta.json                   # thời gian, chi phí, file đã đổi, máy chấm
    ├── answer.md                   # agent nói gì trong chat
    ├── grade.json                  # điểm giám khảo
    └── artifacts/                  # file agent tạo/sửa — ĐỌC CÁI NÀY
```

`report.md` có một mục tên **"Skill có ăn thua không"** so `with` với `without` từng case.
Chênh ≥ 3 điểm mới đáng kể.

So hai lần chạy để xem một lần sửa skill có hiệu quả không:

```bash
python3 .claude/evals/grade.py --compare 20260820-1100 20260821-1530
```

## Vòng lặp cải thiện

1. Chạy eval, lấy mốc.
2. Đọc `artifacts/` và mục nhận xét — tìm **cái sai lặp lại**, không phải cái sai một lần.
3. Sửa **skill**, đừng sửa output. Nếu ba lượt đều quên `paddingBottom: 90` thì đó là lỗi
   của skill, không phải của agent.
4. Chạy lại đúng những case đó, `--compare` với lần trước.
5. Giữ nếu tốt lên, hoàn tác nếu không. Lặp lại.

Vài điều học được từ việc viết skill này, đáng nhớ khi sửa:

- **Giải thích *vì sao*, đừng ra lệnh.** "Panel phải cho `minHeight` — không thì cả khung
  nhảy lên xuống mỗi bước" hiệu quả hơn "LUÔN LUÔN đặt minHeight".
- **Lỗi máy bắt được thì đưa vào `check_lesson.py`**, đừng nhồi thêm chữ vào skill. Kiểm
  tự động rẻ hơn và không bao giờ quên.
- **Đừng vá theo từng case.** Sửa hẹp cho `b4-full` qua được thì skill chỉ giỏi mỗi buổi 4.
  Nếu một chỗ cứ sai mãi, thử đổi cách nói hoặc đổi ví dụ, đừng thêm luật cứng.

## Thêm case

Thêm object vào `evals[]` trong `cases.json`:

```json
{
  "id": "b5-adversarial",
  "skills": ["new-lesson", "lesson-interactive"],
  "weight": "nặng",
  "prompt": "…đúng câu bạn sẽ gõ thật…",
  "lesson_id": "b5",
  "expect": "…mô tả kết quả đúng, dùng cho cả giám khảo lẫn bạn…"
}
```

`lesson_id` là `null` với case không tạo bài học (khi đó bỏ qua `check_lesson.py`).

Case tốt là câu **bạn sẽ gõ thật**, không phải đề bài sạch sẽ. Bộ hiện có cố ý phủ ba mức:
một case nặng đầu-cuối (`b4-full`), một case chỉ kiểm phần suy nghĩ (`b2-outline` — dàn ý,
không được sửa file), một case cô lập đúng skill giọng văn (`voice-rewrite`).

Ba case đó cũng đang kiểm ba thứ khác nhau: *làm được không* · *nghĩ trước khi làm không* ·
*viết có hay không*. Thêm case mới thì nghĩ xem nó kiểm cái gì mà ba case kia chưa kiểm.

## Giới hạn cần biết

- **Không kiểm được cảm nhận thị giác.** Bài học có đẹp không, canvas có dễ theo dõi không —
  phải mở trình duyệt xem. Eval chỉ kiểm được tới mức "build sạch và đúng quy ước".
- **Giám khảo cùng dòng model với thí sinh** nên có thiên vị nhẹ với văn phong máy viết.
  Điểm 11/12 không có nghĩa là hết việc.
- **Ba case là ít.** Đủ để bắt hồi quy, chưa đủ để khẳng định skill giỏi. Thêm case dần mỗi
  lần bạn gặp một kiểu yêu cầu mới.
- **`results/` không nên phình mãi.** Giữ vài lần chạy gần nhất và những lần làm mốc, xóa
  phần còn lại.

## Đừng lẫn hai vòng lặp

`evals/` đo **skill có ăn thua không**. `.claude/scripts/i18n_loop.py` đo **unit song ngữ đã
đóng được chưa**. Hai thứ khác nhau, và lẫn chúng là cách làm cho việc này tốn tiền:

- Vòng trong của việc dịch (`npm run build` + `check_i18n.py` + `check_lesson.py`) **hoàn toàn
  cục bộ, tất định, miễn phí** — lặp bao nhiêu cũng được.
- Giám khảo `i18n-fidelity-judge` chạy **một lần mỗi unit**, và chỉ sau khi Layer 1 đã xanh.
  Bốn lượt cho cả dự án, không phải bốn lượt mỗi vòng. `pairs_hash` tự vô hiệu phán quyết khi
  file dịch đổi, nên không cần chạy lại "cho chắc".
- Chạy `run.py` **chỉ khi sửa `english.md` hoặc prompt của giám khảo** — tức khi đang thay đổi
  chính cái thước đo.

Case nặng `b1-full-i18n` (dịch trọn một bài) cố ý CHƯA thêm. Thêm khi nào sắp đổi skill dịch và
cần một case đủ nặng để thấy khác biệt.

## Behavioral fixtures cho lesson-quality-judge

`lesson-quality-judge/evaluate.md` có ba case nhỏ để kiểm chính hành vi reviewer:
phát hiện lỗi/thiếu, chấp nhận bài đúng đã đính chính nguồn, và không PASS khi thiếu
hình nguồn. Chạy reviewer độc lập theo hướng dẫn đó, không đưa expected observations
cho reviewer. Fixture không dùng harness viết bài `run.py`; caller lưu và đối chiếu
report thực tế. Không cần chạy lại case dựng bài nặng chỉ để kiểm reviewer mới.

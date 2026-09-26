> Implementation update · 2026-09-15: b7 and b8 are implemented at `/courses/data-engineering-foundation/lessons/b7` and `/courses/data-engineering-foundation/lessons/b8`; b9–b11 were implemented on 2026-09-26; b12 was implemented on 2026-09-16 at `/courses/data-engineering-foundation/lessons/b12`. The files below preserve the original writing plan; actual b7 coverage is audited in `../reviews/b7-quality.md` and its ledger.

# Part III & IV — lesson design review

Status: Weeks 7–12 have implementations. Weeks 9–11 validation is recorded in `../reviews/b9-b11-validation.md`. Lesson 12 validation and source corrections are recorded in `../reviews/b12-source-audit.md` and companion review reports.

The requested lessons are **b7–b12**: ingestion, storage, Spark batch processing, Flink streaming, consumption, and orchestration. The design covers **396 source pages**, organized into **60 chapters** with **18 interaction specifications**.

- [English storyboards](storyboards.en.md): chapter scope, documentary narration samples, interaction behavior, numerical examples, and practice targets.
- [Kịch bản tiếng Việt](storyboards.vi.md): cùng phạm vi, mẫu lời dẫn và thiết kế tương tác bằng tiếng Việt.
- [Readiness glossary / Thuật ngữ đầu vào](readiness.md): short bilingual definitions and their role in each lesson.
- [Slide coverage map](slide-coverage.csv): one row per PDF page, including covers, agendas, dividers, references, and closing pages. Week 7 rows are linked to the implemented lesson and its review ledger; b8 coverage is recorded in `../reviews/b8-quality.md`; b12 implementation is mapped to the lesson and its source audit; b9–b11 rows now reference their implemented chapters and independent quality reviews.
- [Source corrections and authoring checks](source-corrections.md): confirmed corrections, incomplete examples, and version-sensitive claims to verify during implementation.

| Part | Lesson | Source pages | Main interaction |
|---|---|---:|---|
| III | 07 · Ingestion | 45 | Kafka routing, CDC, crash and replay |
| III | 08 · Storage | 59 | Storage access, data-swamp diagnosis, medallion trace |
| IV | 09 · Spark batch | 90 | Lazy execution, cache choices, skew and shuffle |
| IV | 10 · Flink streaming | 75 | Event-time windows, checkpoint recovery, backpressure |
| IV | 11 · Consumption | 64 | Modeling, SCD history, feature time travel |
| IV | 12 · Orchestration | 63 | Dependencies, concurrency, validation gates |

## Narrative direction

An illustrative retail order connects the six lessons. Each chapter starts with an observable event or problem, follows the mechanism, exposes a failure or tradeoff, and connects to what happens next. Technical definitions, original examples, tables, and code explanations remain explicit. The story supplies continuity; it does not replace technical detail.

Lời kể theo một đơn hàng bán lẻ giả lập xuyên qua sáu bài. Mỗi chương mở bằng một sự kiện hoặc vấn đề quan sát được, theo cơ chế vận hành, chỉ ra sự cố hoặc đánh đổi, rồi nối sang bước kế tiếp. Định nghĩa, ví dụ gốc, bảng và chú giải code vẫn được trình bày rõ. Câu chuyện tạo mạch nối, không thay cho kiến thức.

The source's advanced details are included even where the earlier foundation baseline proposed a lighter treatment. This expands the scope for these six lessons. Each lesson includes a short prerequisite bridge because lessons 1–6 are not yet available in the app.

## What approval covers

Approval of this design authorizes implementation of all six bilingual lessons, their diagrams and interactions, formative quizzes and self-checks, route/roadmap integration, and source-coverage and translation review. It also covers explaining verified source corrections and adding labeled explanations for topics that appear only in an agenda. It does not require copying the original PDFs into the public site.

Week 7 is implemented first as approved by the user. Continue with the remaining lessons when requested. Keep source-to-lesson mappings updated as sections become real. A page mapping is not proof that its content has been taught: the later reviewer must check the explanation, examples, numerical details, diagrams, and code at the mapped anchor.

Machine-readable chapter and interaction plans are in `chapter-map.json` and `interaction-designs.json`. They describe proposed behavior, not executable lesson data.

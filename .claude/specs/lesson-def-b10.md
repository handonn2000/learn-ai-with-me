# DEF Week 10 — Flink / Stream

Route `/courses/data-engineering-foundation/lessons/b10` (English under `/en`). Ten chapters, three simulations, prerequisite primer, ten-question quiz, summary, checklist and homework with answer guidance. Sixteen presentation slides.

Files: `src/features/lessons/def/b10/`, shared `DataLesson.tsx`/CSS, and `src/lib/useLessonLoop.ts`. VI/EN use identical structure and numerical fixtures. Course progress uses `data-engineering-foundation-progress`; checklist uses `data-engineering-foundation-b10-checks`. No dependencies added.

18 window configurations, four recovery configurations and four queue rates pass. Default watermark trace is 7,35,53,60,60,80,80. Completed checkpoint plus idempotent sink gives 60; blind replay can produce 90 or 120. B10-C01 (keyed timer requirement) was fixed in both languages and independently re-reviewed. Computed-count labels clarify retained trace output after state cleanup.

Auto loops pause outside viewport and while document hidden; reduced motion retains the whole trace. Keyboard controls and small-screen tables are supported. Source/fidelity review: `docs/courses/data-engineering-foundation/reviews/b10-quality.md`. Validation: `b9-b11-validation.md`.

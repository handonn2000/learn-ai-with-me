# DEF Week 11 — Consumption / Modeling

Route `/courses/data-engineering-foundation/lessons/b11` (English under `/en`). Ten chapters, three simulations, prerequisite primer, ten-question quiz, summary, checklist and homework with answer guidance. Sixteen presentation slides.

Files: `src/features/lessons/def/b11/`, shared `DataLesson.tsx`/CSS, and `src/lib/useLessonLoop.ts`. VI/EN use identical structure and numerical fixtures. Course progress uses `data-engineering-foundation-progress`; checklist uses `data-engineering-foundation-b11-checks`. No dependencies added.

Six aggregate combinations, twelve SCD configurations and feature TTL boundaries pass. SQL temporal joins and JSON fixtures validate; Feast example passes Python AST inspection and is explicitly not a complete project. Revenue is 1200; snapshot sum 300 is invalid for closing inventory, whose last value is 120. Feature at 09:55 is 45.73 for a 10:00 event; latest 47.10 leaks future information. Escaped bronze/silver placeholders now render literally in both languages (B11-Q1 resolved).

Auto loops pause outside viewport and while document hidden; reduced motion retains the whole trace. Keyboard controls and small-screen tables are supported. Source/fidelity review: `docs/courses/data-engineering-foundation/reviews/b11-quality.md`. Validation: `b9-b11-validation.md`.

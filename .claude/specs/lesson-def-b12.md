# DEF b12 — Orchestration and data quality

Implemented 2026-09-16. Route `/courses/data-engineering-foundation/lessons/b12`, with English via locale basename. Source: 63-page Lession_12_Data_Engineering_Orchestration_Layer.pdf. Follows existing approved 10-chapter outline.

- Full-bleed responsive page: hero, #toan, #ch01–#ch10, #summary, #checks, #quiz, #hw; 16 presentation slides.
- VI then EN text bundles; selector uses LOCALE. All ten quiz questions/explanations, code commentary, tables, instructions and checklist translated.
- Scheduling race: auto loop, two keyboard-accessible scenario tabs, five-frame persistent HTML trace, reduced-motion static story, viewport/visibility cleanup inherited from useLessonLoop.
- Interval exercise: three rows per date, repeat replaces partition; select older date for backfill.
- Pool simulation: two 100-task runs, one scheduler, 1-slot/1-tick tasks; adjustable parallelism, max_active_runs, pool slots; running/resource-waiting/run-waiting/done tracked separately.
- Quality gate: seven faults plus valid fixture; fixed timestamp, exact rule evidence, explicit validation, repair/recheck, and publication tied to unchanged passing snapshot. Consumers remain blocked before publication.
- Architecture paths distinguish control/state from datasets. Existing local Airflow/PostgreSQL logos. Lossless Python/JSON syntax coloring; dark code panels in both themes.
- Code examples are teaching snippets, not deployed Airflow. Target references core 3.1.0, standard 1.9.0, Docker 4.4.4. Provider version existence confirmed; exact pinned source not fetched. No remote side effects.
- SessionQuiz uses courseSlug=data-engineering-foundation, sessionId=b12; checklist key data-engineering-foundation-b12-checks. No storage schema changes or part-test activation.

Validation: 8 deterministic engine/content/Python/wiring checks; 12 course checks; isolated lesson tsc and Vite library build; i18n key/value/extraction checks; independent fidelity ĐẠT. Browser report covers both loop cycles/scenarios, all gate faults, lab controls, quiz persistence, deck mapping, 375px VI/EN dark/light, and no JS/network failures. Visibility-change test synthetic; no full Airflow runtime test.

Full npm build still fails on pre-existing missing b8 StorageLabs/lesson08.text and missing b7 failover locale object. Do not erase unrelated in-progress work to hide these errors. Source/correction audit, browser report and reviews live in docs/courses/data-engineering-foundation/reviews/b12-*.

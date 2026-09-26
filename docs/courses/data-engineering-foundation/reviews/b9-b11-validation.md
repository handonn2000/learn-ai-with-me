# DEF sessions 9–11 — final validation

2026-09-26. Implemented locally; no deployment or live framework service execution.

## Results

- `python3 .claude/scripts/i18n_loop.py def def-b9 def-b10 def-b11`: exit 0. Production TypeScript/Vite build, dependencies and bilingual checks pass. Independent fidelity verdicts match the final lesson text hashes. Two extraction warnings reflect intentional keyed-timer and escaped-placeholder corrections. The pre-existing roadmap unit `def` has no judged gate; the three new lesson units do.
- `node scripts/check-def-b9-b11.mjs`: PASS. Batch conservation/cache, stream time/replay/queue, SCD/PIT boundaries, 30 quizzes and three route registrations.
- `node scripts/check-course.mjs`: 12 checks PASS. Sessions 7–12 are linked; course storage and existing AI progress remain isolated.
- `node scripts/check-def-b9-b11-browser.mjs` with installed Playwright runtime and Chromium headless executable: 32 checks PASS, zero browser console/page errors. See [machine report](b9-b11-browser-checks.json).

Browser matrix: all three lessons, Vietnamese/English, 375/1440 px, dark/light. Checks cover all navigation anchors, images, no document overflow, local table scrolling, rendered code, all three labs per page, keyboard selects, ten correct quiz answers with stored score 100, checklist persistence and course storage boundaries, sixteen presentation slides and reduced-motion traces. Each explanatory trace was observed through two complete cycles and verified to pause offscreen without advancing its frame. Document-hidden lifecycle and unmount cleanup were inspected in the shared hook, not simulated with synthetic visibility events.

Captured desktop heroes and mobile labs were visually inspected. A mobile navigation overflow was fixed by wrapping its top-row controls within the new lesson scope. Code and tables retain local horizontal scrolling. Screenshots were saved under `/tmp/def-lessons/browser`; that temporary directory is not a repository artifact.

The existing b7 hook was moved unchanged into `src/lib/useLessonLoop.ts` and re-exported from its previous location. New lessons therefore do not import the b7 lesson bundle. No dependencies were added.

Spark/Flink/Feast code has explicit version/context boundaries. Framework snippets were checked for syntax where possible and against primary documentation; the browser labs execute teaching models, not real clusters. No claim of cluster performance or end-to-end service execution is made.

## Review artifacts

- [Batch quality and fidelity](b9-quality.md)
- [Stream quality and fidelity](b10-quality.md)
- [Consumption quality and fidelity](b11-quality.md)
- [Final source hashes](b9-b11-artifacts.json)
- [Page coverage map](../lesson-design/slide-coverage.csv)

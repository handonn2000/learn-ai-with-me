# DEF Week 8 — Storage Layer

Implemented at `/courses/data-engineering-foundation/lessons/b8`; the locale basename
adds `/en` for English. `Lesson08Storage.tsx` renders a full-bleed page with sixteen
presentation slides: hero, readiness, ten chapters, summary, checklist, quiz, practice.

Content follows the ten-chapter Week 8 storyboard and the 59-page Storage Layer PDF:
file/block/object; memory/cache; HDFS and historical storage; warehouse/model levels;
star/snowflake; lakes; swamp causes; governance; lakehouse; medallion. Main text lives
in `lesson08.text.vi.ts` and `.en.ts`; `lesson08.text.ts` selects through `LOCALE`.

`StorageLabs.tsx` provides storage access tabs, normal/fallback HDFS reads, star versus
snowflake joins, governance controls with explicit remaining issues, and medallion
processing/replay. Labs have their own flat VI/EN bundles. The TypeScript engine does
not call real services. Loops pause outside the viewport, while the document is hidden,
and under reduced motion. Static trace explanations remain available. Tabs support
keyboard navigation without changing the presentation slide.

The medallion fixture has five Bronze rows: valid order 101 at 120000 VND, its exact
retry, valid order 102 at 80000 VND, order 103 with an invalid amount, and a missing
order ID. Processing yields two valid Silver rows, two quarantined rows, one duplicate
and 200000 VND Gold revenue. Replay reuses retained Bronze, preserves the processed-row
ledger and derived records, skips processed raw IDs, and replaces the Gold aggregate.
This models a bounded deterministic replay, not arbitrary CDC conflict resolution.

Ten quiz questions use `def8.*` topic IDs and the existing `SessionQuiz` saving boundary
under course slug `data-engineering-foundation`, session `b8`. Checklist key:
`data-engineering-foundation-b8-checks`. VI/EN share progress; other courses stay separate.

The page has no added dependency. It reuses the lexical JSON `SyntaxCode` component
from b7 with locally scoped code colors and keeps existing b7 work intact.

Validation and independent source/fidelity reviews live in
`docs/courses/data-engineering-foundation/reviews/b8-*`. Commands:
`npm run build`, `node scripts/check-course.mjs`, `node scripts/check-def-b8.mjs`,
`node scripts/check-def-b8-engine.mjs`, and
`python3 .claude/scripts/i18n_loop.py def-b8`.

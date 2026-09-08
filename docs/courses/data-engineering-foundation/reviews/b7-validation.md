# Week 7 validation — 2026-09-08

The user approved Week 7 first. The original 45-page deck is accounted for by an
independent 75-unit ledger: 51 covered, 24 covered-with-correction. See b7-quality.md
and b7-coverage-ledger.md. Fidelity passed 469 pairs; see b7-fidelity.md.

- `npm run build`: TypeScript/Vite passes, 124 modules.
- `node scripts/check-course.mjs`: 12 checks pass, including legacy AI preservation.
- `node scripts/check-def-b7.mjs`: 5 grouped checks pass; includes all 8 crash cases,
  routing 1–4 partitions/keyed/unkeyed, offsets/groups, CDC/retention, locale/quiz parity,
  topic membership, route and storage namespaces.
- `python3 .claude/scripts/i18n_loop.py def-b7`: exit 0; judge hash 59138f35421202a3.
- Bilingual checks for chrome, b1, b2, b3, def and def-b7: no failures. Existing AI
  warnings retained. Week 7 has one intentional baseline-edit warning for the CDC
  paragraph extension, not a missing-string warning. The initial VI bundle snapshot
  records authored content; no legacy JSX extraction took place for this new lesson.
- Browser results: b7-browser-checks.json and b7-browser-final-checks.json. Isolated
  Chromium profile with synthetic progress; no actual user storage touched. Tested
  desktop 1440×1000, mobile 390×844, VI/EN, light/dark, reduced-motion step controls,
  normal play/pause/speed/end, keyboard stepping, presentation navigation, all lab
  branches, quiz score persistence and course isolation. Final console warnings/errors: 0.

The content review is independent static/source review; browser inspection was by
the author. Simulations do not execute Kafka, Debezium, a real DB or production sink.
No external deployment, new dependency or detailed Week 8–12 implementation occurred.
Local preview serves the built site on port 5174.

Optional future improvements are recorded in the quality report, separate from
required fixes. Source references and corrections are in the author-facing reports;
the lesson remains a narrative learning experience.

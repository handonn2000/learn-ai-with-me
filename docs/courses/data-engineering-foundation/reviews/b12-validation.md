# DEF b12 validation

Date: 2026-09-16.

## Passed

- `node scripts/check-def-b12.mjs`: 8 checks. All 32 pool-limit combinations complete with conserved task counts and resource bounds; rerun/backfill partitions; seven fault cases; freshness/count boundaries; empty/invalid input; exact validated snapshot binding; bilingual chapter/quiz shape; code lossless tokenization; Python syntax and actual extracted gate-function behavior; route/deck/persistence wiring.
- `node scripts/check-course.mjs`: 12 checks, including existing progress migration/isolation and identical VI/EN roadmap structure with b12 enabled.
- `python3 .claude/scripts/check_i18n.py def-b12`: 191 matching keys and 433 translated strings; HTML, numbers, anchors and code aligned. Extraction baseline retains all original VI content. Two deliberately expanded explanations are recognized as edits rather than missing text.
- Independent fidelity judge: ĐẠT on the entire VI/EN pair; current pair hash recorded in `.claude/i18n/judged/def-b12.json`.
- TypeScript compilation isolated to b12 and its transitive imports, using project settings and Vite client declarations: clean.
- Vite production library build isolated to b12: clean. This is evidence for this lesson’s imports and bundling, not a full application build.
- Isolated Chrome browser checks: see [machine report](b12-browser-checks.json). EN and VI render; every section at 375px in dark/light has no document overflow; local brand images load; all seven gate faults and fixes exercised; pool controls/reruns; every animation frame and two resets in each scenario; reduced-motion table; offscreen pause; synthetic document-visibility pause; keyboard tabs including presentation mode; 16 slide mapping; quiz 100% recorded under DEF b12 only; checklist interaction; no page errors or failed network responses.
- Visual review of desktop hero, VI mobile/light hero, gate evidence/lineage, resource control room; code remains dark with legible distinct syntax tokens in both themes.
- `git diff --check`: clean.

## Existing workspace blockers and limits

`npm run build` and the full `i18n_loop.py def-b12` build gate remain blocked by files already broken before lesson 12 work began:

- `src/features/lessons/def/b7/PartitionFailover.tsx`: the imported locale object has no `failover` property, with resulting implicit-any errors.
- `src/features/lessons/def/b8/Lesson08Storage.tsx`: missing `StorageLabs` and `lesson08.text` modules, with resulting implicit-any errors.

There are no b12 diagnostics in the whole-project TypeScript output. Existing unrelated in-progress files were preserved. The full i18n status remains unclosed due to this global build failure; `--no-build` is not presented as a whole-project pass.

Airflow/Docker/GX/Deequ services were not run. Python examples received AST syntax and extracted pure-function checks, not a provider integration test. Exact pinned provider source retrieval remained unavailable; code is explicitly illustrative. Background visibility was simulated through the document-hidden property/event, not observed in an actual background tab. No deployment or commit was performed.

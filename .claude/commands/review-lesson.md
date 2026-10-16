Review a completed lesson before handoff using the independent
`lesson-quality-judge` defined in `.claude/agents/lesson-quality-judge.md`.

Resolve from the request/conversation:
- Course slug and lesson ID (IDs such as b7 are not globally unique).
- Actual lesson files, imported content/simulation engines and available locale files.
- Source PDFs/slides and the user's coverage requirement: full source detail or an
  explicitly narrower scope.
- Audience/style, optional source-to-lesson map, and existing build/browser/i18n reports.
- Latest visual requirements and relevant asset/style files: explanatory loops with no
  playback buttons, use-case tabs, suitable varied 2D/3D/media, actual framework logos,
  syntax-colored JSON/code and selective emphasis. Keep functional quiz/lab controls.

Spawn the reviewer with those inputs and its agent instructions. Do not give it the
expected verdict or tell it which defects to find. It returns a report only; the
caller saves it under `docs/courses/<slug>/reviews/<lesson-id>-quality.md`, together
with a companion coverage ledger when needed. Avoid replacing an earlier report
unless the task calls for an update; identify the reviewed artifact snapshot.

Example request:

> Review Data Engineering Foundation b7 after implementation. Inspect the actual
> b7 lesson and its imports; source:
> /Users/handonn/Workplace/AIDE-01/slides/Lession_7_Data_Engineering_Ingestion_Layer.pdf.
> User scope: all substantive slide details, documentary narration, VI and EN,
> explanatory visuals that loop automatically without playback buttons, tabs for use
> cases, diverse suitable visual forms, actual framework logos, syntax-colored code/JSON
> and selective term/takeaway emphasis. Preserve functional quizzes. Check correctness independently of the slides,
> build a complete coverage ledger, and give prioritized fixes and sourced optional
> enhancements. Report actual inspection limits. Do not modify lesson files.

If independent-agent tools are unavailable, perform the same checks locally and
label the report **self-review, not independent review**. Never report an agent run
that did not occur. Missing lesson content permits design feedback only, not a PASS.

For animation changes, include transition and cycle-boundary evidence, every use-case
tab, viewport/document visibility pauses, unmount cleanup and a complete reduced-motion
static explanation. Check keyboard/mobile/light/dark behavior, stable accessible text,
code copying and syntax-versus-callout contrast. Do not present an unrun browser check
or a frame-by-frame live region as an accessibility pass. Component or library reuse
is not a quality requirement; judge conceptual fitness and documented tradeoffs.

Fix confirmed correctness and in-scope coverage issues within the existing task's
authorization. Optional additions stay recommendations unless already authorized.
Re-review affected content after fixes, then obtain the separate i18n-fidelity review
for the full VI/EN pairs. A quality report does not set the i18n `judged` gate.

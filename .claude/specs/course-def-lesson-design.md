# Spec — DEF Part III/IV lesson design

Status: user requested Week 8 on 2026-09-09 and resumed on 2026-09-15. b7 and b8 implemented; b12 added on 2026-09-16; b9–b11 remain planned.
See lesson-def-b7.md and docs/courses/data-engineering-foundation/reviews/b7-quality.md.

User requested six detailed lessons (b7–b12) before b1–b6, full substantive source
coverage, documentary narration, visualizations/animations/interactions, VI and EN.
This supersedes the baseline's lighter scope and original lesson authoring order.

Review package: docs/courses/data-engineering-foundation/lesson-design/README.md.
Bilingual storyboards describe 10 chapters per lesson (60 total), 18 interactive
models, narrator samples, quantitative anchors, prerequisites and practice targets.
slide-coverage.csv assigns all 396 pages to planned anchors or administrative roles.
A mapping is not a coverage verdict; b7/b8 implementation coverage is audited under reviews, and b9–b11 remain planned; b12 implementation and validation are documented in lesson-def-b12.md.

source-corrections.md separates primary-source-confirmed corrections from the
remaining version/technical verification backlog. readiness.md supplies short
bilingual definitions. Source PDFs remain at /Users/handonn/Workplace/AIDE-01/slides/.
Text extracted for each page; 51 selected figure/code pages rendered for the outline,
with key code images inspected at full size. No claim of completed lesson coverage.

The new-lesson skill requires a written outline; explicit implementation requests authorize work without another approval gate.
Implementation: implement course-specific pages, state/quiz/checklist namespaces,
slide mode, readable prose/code/tables and meaningful interactive models; use
lesson-quality-judge for correctness and VI coverage against all source details (the user's expanded scope overrides
the judge's ordinary topics-only rule), then fidelity judge on EN versus VI.
Do not reuse CSC14003 question banks or progress keys accidentally.

Validation completed for the design: all 396 unique page numbers accounted for,
10 chapters and 3 interactions per lesson, both language documents contain every
structured entry, local links resolve, no trailing whitespace. npm run build and
git diff --check pass. Translation/source judges have not run on lessons because
those lessons are not implemented yet.

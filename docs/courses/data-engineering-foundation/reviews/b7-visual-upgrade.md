# Week 7 visual review and implementation

Date: 2026-09-08. Scope: visual teaching aids and framework artwork for the existing
bilingual ingestion lesson. This is an implementation review, not a fresh independent
audit of the original 45-page source deck.

## Findings and changes

The lesson already covered the material and had three deterministic labs. Most earlier
chapter illustrations were ordered lists or tables, including concepts whose spatial
relationships matter: the Kafka ecosystem, physical storage layout, and broker failure.

Seven semantic HTML figures now introduce these mechanisms before the detailed prose:

| Chapter | Visual | What becomes visible |
| --- | --- | --- |
| 01 | Platform journey | Responsibility moves from source to staging, warehouse, mart, report. Airflow schedules jobs above the data path. |
| 02 | Storage rearrangement | The same nine cells move between row, column and grouped layouts; amount stays highlighted. |
| 03 | CDC fan-out | One committed change supplies search, cache and analytical storage through separate branches. |
| 04 | Kafka ecosystem | Connect Source → cluster → Connect Sink; Streams and MirrorMaker have separate, labeled relationships. |
| 06 | Offset walkthrough | Processing advances the next read before commit advances recovery progress. Records remain stored. |
| 08 | Broker failover | Broker 1 loss leaves P0 temporarily leaderless; broker 2 then leads P0 without changing P1/P2 leaders. |
| 10 | Debezium path | A PostgreSQL update passes through logical decoding, Debezium, Kafka and a configured sink. |

Four walkthroughs reuse finite playback with back/next, play/pause, speed and reset.
They start paused. Storage rearrangement animates stable cells. Reduced-motion mode
preserves manual controls and removes animated transitions. No GIF download is required.
The original explanatory prose, detail tables, labs, quiz and course progress wiring
remain available. The narrow Vietnamese toolbar now wraps within this lesson.

Nine original brand assets are stored locally: Kafka, Airflow, Debezium, PostgreSQL,
MySQL, MongoDB, Elasticsearch, Redis and Snowflake. Logo sources and licenses are
recorded in `public/frameworks/README.md`. Framework marks are not synthesized.

## Interpretation checks

- Airflow is a scheduling example, not an ingestion broker or a mandatory component.
  Role checked against https://airflow.apache.org/ and its official branding resources.
- Kafka Connect is shown outside brokers; Streams reads/writes cluster 1; MirrorMaker
  copies cluster 1 to cluster 2. Original distinctions remain in the lesson prose.
- Replica placement matches the existing four-broker table exactly; the intermediate
  failure frame does not promise instantaneous leader election or arbitrary recovery.
- Offset 2 is the next recovery position after processing 0 and 1. The example has
  five records and no gaps/control records; it does not generalize lag to event count.
- Storage is an illustrative value sequence, not byte-accurate ORC/Parquet internals.
  Grouped layout retains a visible boundary after the first two source rows.
- CDC uses a committed PostgreSQL update after the initial snapshot; the note keeps
  database-specific behavior and actual connector responsibilities explicit.
- Added VI/EN text was read side by side; no independent fidelity sign-off is claimed.

## Validation

- Production build and TypeScript: pass.
- `node scripts/check-def-b7.mjs`: all five existing model/locale/wiring checks pass.
- `python3 .claude/scripts/check_i18n.py def-b7`: pass, 612 paired strings; the
  existing single baseline CDC wording warning is unchanged. New renderer registered.
- Generic `check_lesson.py` does not understand nested course lessons: it reports
  `def` as a missing lesson folder. Used the course-specific checks above instead.
- Browser result details are recorded after the final run below.

Final isolated Chromium run: all checks pass; no page errors or console warnings.
Forward/back, play/pause, speed and reset were exercised in all four walkthroughs;
storage covered all three layouts. All nine brand assets loaded. EN light/dark
screenshots and VI 375px screenshots were captured; VI 375px/320px had no page or
figure overflow. Reduced-motion mode retains manual steps with transitions disabled.
Deck mode opens the replica visual through its chapter anchor.

Results and source hashes: `b7-visual-browser-checks.json`. Screenshots remain in
`/tmp/def-visual-check`; inspected examples include journey (dark), ecosystem (light),
failover (light), CDC (light), storage (light), and offsets (mobile). Element captures
can include the sticky lesson toolbar; this is not evidence of full-page clipping.
No new dependencies, real cluster execution, or production deployment.

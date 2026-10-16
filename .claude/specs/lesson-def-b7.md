# DEF b7 — Ingestion

Status: implemented; floating-city revision in verification as of 2026-09-15. Earlier looping-visual and island revisions completed 2026-09-09. The user approved Week 7 first after the six-lesson outline.
Source: Lession_7_Data_Engineering_Ingestion_Layer.pdf, 45 pages. All substantive details,
documentary narration, Vietnamese and English; source corrections preserved with evidence.

## Files and delivery

- `src/features/lessons/def/b7/`: Lesson07Ingestion.tsx, IngestionLabs.tsx, IngestionVisuals.tsx,
  LessonAnimation.tsx, SyntaxCode.tsx, DataWorld.tsx, data-world.scene.ts,
  data-world-timeline.ts, scoped visual/lab CSS, ingestion-engine.ts,
  lesson07.text.vi.ts/en.ts and selector.
- Route: `/courses/data-engineering-foundation/lessons/b7` (locale in basename).
- Readiness #toan; chapters #ch01–#ch10; #summary, #checks, #quiz, #hw; cover #hero.
  16 deck slides, using the same full content as scroll mode, with vertical scrolling.
- The new VI text was authored directly into its bundle; its snapshot is an initial
  content baseline, not proof of extracting existing JSX. Unit def-b7 tracks both
  bundles, deliberate bilingual glossary headings, unchanged engine and UI paths.

## Content and visuals

1. Sources/staging/warehouse/marts/users and five governance responsibilities.
2. Files, structure, OLTP/OLAP, ETL/ELT, logs, original row/column/grouped layouts.
3. Polling/triggers/log CDC, original row1122/Shadow Table and CDC destination fan-out.
4. Kafka core and branching Connect/Streams/MirrorMaker ecosystem, historical ZooKeeper.
5. Six terms, topic naming, original service/event flow and cluster decision map.
6. Parallelism, broker redistribution, qualified throughput estimate, routing, offsets/lag.
7. Consumer groups; routing lab with six events, independent groups and three scenario tabs.
8. Replication/ISR/acks/min ISR, original four-broker topology and conditional failover.
9. Delivery semantics; eight crash/replay scenarios, atomic sink assumption, trace table.
10. Retention/compaction, Debezium/source catalog, CDC+retention lab, Kafka challenges bridge.

Documentary story is fictional; simulations are labeled and have persistent readable
explanations. Explanatory scenes repeat automatically, with tabs for use cases and no transport
buttons. Reduced motion shows complete static states with persistent explanations
and trace tables. Routing traces use immutable engine snapshots.

## Assessment and progress

Eight formative questions with explanations. Shared SessionQuiz accepts the local bank,
courseSlug and topic-label resolver; scoring writes DEF progress, never CSC14003.
Checklist uses `data-engineering-foundation-b7-checks`. Practice has four tasks and
expandable criteria, no real cluster setup claim. Other lessons remain planned.

## Verification

`node scripts/check-def-b7.mjs`: crash outcomes, routing/offset/group independence,
CDC hard delete, retention, locale shape/answers, route+storage wiring.
`node scripts/check-course.mjs`: storage isolation and actual lesson availability.
`check_i18n.py def-b7`, independent quality and fidelity reports, production build,
plus isolated browser verification. Reports/evidence are under
`docs/courses/data-engineering-foundation/reviews/`.

## Visual expansion — 2026-09-08

A 3D data island appears in ch01; six complementary figure blocks appear before prose in ch02/ch03/ch04/ch06/ch08/ch10.
- Interactive Data Island: six framework landmarks, orbit/zoom/inspection and three repeating routes (CDC, Streams, scheduled batch).
- Animated row/column/row-group storage with stable cell identity, amount highlighting, and an explicit row-group boundary.
- CDC fan-out to Elasticsearch, Redis, and Snowflake.
- Kafka ecosystem tabs: Connect pipeline, circular Streams round trip, isometric MirrorMaker clusters.
- Offset walkthrough separating processed records, next read, committed recovery position, and log end.
- Four-broker failover preserving the original three-partition replica placement; a visible election-pending step precedes P0 promotion.
- Five-step PostgreSQL/WAL/Debezium/Kafka/sink path with the simplified event payload.

The original prose, source-detail figure tables, three labs, quiz and storage keys remain.
Ten existing scene clocks plus the WebGL island repeat independently only while visible and the document is in the
foreground, and clean up on unmount. Scenario tabs have keyboard navigation and reset
the illustration; read/commit controls, speed controls and playback buttons are removed.
Static reduced-motion views retain outcomes and supporting tables. Visual styles include
transit routes, repositioned storage tiles, branching signals, conveyors, 3D broker racks,
event postcards, receipt/commit filmstrips and retention archives.

JSON uses safely escaped, selectable syntax spans with theme tokens. Ten chapter callouts
and selective semantic term emphasis identify important conditions and conclusions in
both locales. The user-requested looping revision supersedes the former paused-player
behavior; details and evidence: `docs/courses/data-engineering-foundation/reviews/b7-loop-upgrade.md`.

Brand artwork resides in `public/frameworks/`, with sources and library licenses.
`FrameworkLogo` resolves the GitHub Pages base path, uses unmodified logos on a white
backing for contrast, and keeps visible names or image alternatives. Kafka, Airflow,
Debezium, PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch, and Snowflake are represented.
No external image hosts are needed at runtime. New copy lives in the existing VI/EN
bundles; the new renderer is included in the def-b7 language audit.

## Interactive data island — 2026-09-09 (historical visual direction)

`DataWorld.tsx` and its scoped CSS replace the chapter 1 transit figure. The lazily
imported `data-world.scene.ts` uses Three.js to construct a faceted island, mountain
ridge, river/waterfall, bridges, trees and six explorable landmarks. Camera controls
rotate, zoom and restore the whole-island view; canvas dragging and keyboard controls
support exploration. Logo labels and the station list open readable role details.

Use-case tabs show committed-change CDC, a Kafka Streams round trip, or a direct batch
load with separate gold Airflow scheduling arcs. Streams returns results to Kafka before
the warehouse. Paths abstract connectors/tasks as explained beside the map. All new
copy lives in `T.world` in both bundles. Unsupported WebGL uses the station list and full
HTML route explanation; reduced motion keeps an explorable static scene. See ADR-0016.

## Floating data city — 2026-09-15

This revision supersedes the island terrain described above. Chapter 1 now uses six
floating urban districts with architectural framework landmarks, glass office towers,
roads, elevated bridges and hover-engine details. The existing Three.js stack, real
framework logos, camera exploration and station inspection remain. See ADR-0017 for
the visual/state decisions and use of the requested 3Dviz skill.

`data-world-timeline.ts` defines the authoritative presentation state for each route.
The moving record, highlighted current bridge, stage title, numbered route reader and
syntax-colored JSON all describe the same step. Previously traversed paths soften;
arrows establish direction. A persistent HTML trace explains all steps even when
motion or WebGL is unavailable. The model is an illustrative route, not a real cluster
simulation; decorative building size and height do not encode capacity.

- CDC follows order 42 from its committed source row/WAL change through Debezium and
  Kafka to the warehouse. WAL capture precedes the CDC event representation.
- Streams follows the same order into the processing application, changes the example
  `amount: 12` to `amount_cents: 1200`, then returns the result to a Kafka output topic
  before the warehouse. Purple identifies the processed result; text explains the change.
- Batch separates gold dashed Airflow scheduling instructions from the solid route
  carrying three source rows. The records do not travel through the scheduler.

All three scenarios repeat with a readable result hold and a fresh illustration cycle;
no playback toolbar is added. Current revision build, timeline, browser and language
evidence must be recorded separately from the historical island checks. Verification
is pending in this spec until the current-city review is complete.

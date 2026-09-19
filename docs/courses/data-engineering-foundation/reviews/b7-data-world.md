# DEF Week 7 — interactive Data Island

Date: 2026-09-09. Scope: the user-requested explorable 3D world inspired by the attached
low-poly village reference. This is an addition to the existing lesson, not a new lesson
or a replacement for its detailed source explanations.

## Implementation

Chapter 1's transit animation becomes an actual Three.js world: a faceted floating
island, mountains, river/waterfall, footbridges, trees and six distinct framework
landmarks. The original local logos identify PostgreSQL, Debezium, Apache Kafka,
Kafka Streams, Snowflake and Apache Airflow. Projected HTML labels have collision
placement and leader lines; mobile uses 44px logo markers with full names in the
station list.

Three use-case tabs select committed-change CDC, stream processing with results
returning to Kafka, or a batch load scheduled by Airflow. Gold dotted control signals
remain separate from record paths. Routes intentionally abstract connectors/tasks as
explained in the adjacent HTML. The landscape makes no deployment, replication or
end-to-end delivery guarantee.

Pointer dragging, camera buttons and arrow/+/−/Home shortcuts explore the world.
Selecting a landmark or station opens its role description. Animations automatically
repeat; there is no playback toolbar. The same controls and explanations exist in VI/EN.

The renderer loads when the island first enters the viewport. It suspends when hidden,
offscreen or reduced-motion is enabled, caps DPR at 1.5, and disposes GPU resources,
observers/listeners and canvas on unmount. Reduced motion permits deliberate camera
changes over a static scene. Unsupported/lost WebGL leaves the complete HTML route,
scenario tabs and station inspector available. Both page themes retain twilight in the
3D canvas, with surrounding content following the page theme.

Three.js is an MIT dependency, added with TypeScript definitions; ADR-0016 records its
tradeoffs. The lazy chunk is about 561 kB minified / 143 kB gzip. The normal Vite chunk
warning is retained; this library is not part of the shared application startup bundle.

## Independent review

`data_world_review` completed a full static review of the new renderer, wrapper, CSS,
all added VI/EN `world` keys, chapter integration, supporting tabs/logos, logo provenance
and deck event handling. Verdict: PASS for this declared feature scope. It found and
verified corrections for inverted zoom factors and deck navigation consuming camera/tab
keys and touch gestures. A narrow follow-up checked collision placement, SVG leaders,
responsive measurement, supported shadow-map mode and elapsed-time metadata: PASS.

This is not a new full-PDF coverage review or a complete lesson fidelity stamp. The
reviewer did not execute browser checks. No historical judged hash was rewritten.

Primary references used to check role/path explanations:

- [Debezium PostgreSQL connector](https://debezium.io/documentation/reference/stable/connectors/postgresql.html)
- [Kafka Streams introduction](https://kafka.apache.org/41/streams/introduction/)
- [Airflow architecture](https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/overview.html)
- [Three.js renderer lifecycle](https://threejs.org/docs/pages/WebGLRenderer.html)

## Verification

Production TypeScript/Vite build, five focused DEF model/wiring checks, twelve course
checks, and the bilingual checker pass. The bilingual checker reports 824 paired
strings and preserves all 299 baseline strings; 15 intentional existing near-match
warnings remain. This feature adds copy without changing the extraction baseline.

Browser evidence is recorded in `b7-data-world-browser-checks.json`. Initial real-time
checks completed at least two packet cycles in each of the three scenarios and passed
camera controls, canvas dragging, all six station selectors, projected labels, keyboard
tabs, offscreen suspension, synthetic document-hidden suspension and reduced motion.
The timing suite ended at a later deck initialization timeout; its completed assertions
remain valid, while the remaining cases are covered by a separate focused browser run.

Screenshots and harnesses are local session artifacts under `/tmp/def-world-check`,
`/tmp/def-world-check.cjs` and `/tmp/def-world-final.cjs`. Synthetic touch propagation
and document visibility events are identified as such; they do not establish behavior
on a physical phone or an actual OS background-tab transition.

Final focused browser run: PASS for deck key/touch containment, hidden slide suspension,
actual SPA disposal, label collision placement at twelve angles for 1440/760/470/375/320px,
real WebGL context loss, unavailable-WebGL startup fallback, and the VI phone view.
Final light-theme inspection found a prose selector overriding the camera hint color;
the scoped contrast override was corrected, rebuilt and checked in-browser. The final
suite captured no page errors; software-renderer ReadPixels performance warnings during
screenshots remain recorded. They are not a claim of physical-device performance.

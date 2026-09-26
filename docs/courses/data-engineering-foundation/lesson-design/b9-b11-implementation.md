# Buổi 9–11 — implementation outline

Scope: implement curriculum sessions b9, b10 and b11 as bilingual lessons, using the existing ten-chapter storyboards and original PDFs. Audience: foundation students who can read small Python/SQL examples. VI first, then EN. Local fixtures and simulations are teaching supplements, not live framework benchmarks.

- b9: single-machine limits → execution → RDD/DataFrame → serialization → persistence → skew/schema → Catalyst → Tungsten/AQE → tuning → UI/allocation/compaction. Labs: lazy plan, cache capacity/reuse, skew/salting conservation. Numbers: 2 partitions; 700/10/8/12 million; five JVM storage levels.
- b10: architecture → clocks/watermarks → windows/triggers → late data → APIs → state → checkpoints → chaining → backpressure → deployment. Labs: event-time trace with explicit watermarks; checkpoint replay/external effects; bounded queue. Numbers: 58−5=53, 65−5=60; disorder 10s versus lateness 15s; 8 input versus 3 output.
- b11: warehouse → ER/normal forms → grain/additivity → star/snowflake → SCD → Vault → Inmon/Kimball → OLAP → ClickHouse/Pinot → feature stores. Labs: revenue/inventory aggregation; six SCD policies over two changes; point-in-time/TTL lookup. Numbers: revenue 500+700=1200; inventory 100/80/120; feature 45.73/46/47.10.

Each page includes the prerequisite card, readable examples, stable HTML explanations beside animation, a recap/checklist, ten-question course-scoped quiz, exercises with answer guidance, and presentation mode. Explanatory loops highlight complete traces with no playback controls. User-controlled experiments change meaningful parameters. Source corrections are tracked in the review audit. No production cluster is required to use these lessons.

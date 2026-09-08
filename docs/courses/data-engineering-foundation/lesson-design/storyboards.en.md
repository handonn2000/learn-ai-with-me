# Part III & IV — lesson storyboards

Status: outline review, before implementation · 2026-09-07

Six lessons, 396 source pages, 60 chapters and 18 interaction designs. This is a reviewable writing/implementation plan, not completed lessons. The user’s request expands the original foundation scope: every substantive slide detail is now in scope, including advanced subsections, code images and agenda-only topics. Covers/section dividers/references/closing pages are accounted for separately in the page map.

Narration: documentary-style written voice, not an automatically generated audio track. A clearly fictional retail pipeline supplies continuity; the original technical examples remain where they teach distinct details. Scene → mechanism → inspected example → failure/tradeoff → bridge to the next chapter. The opening passages below are tone samples, not the full lessons.

Interface: existing scroll and presentation modes, bilingual navigation/labels/narration/code commentary/feedback, searchable HTML explanations, readable tables/code, SVG/HTML diagrams, keyboard controls, responsive layouts and reduced-motion alternatives. Every animation starts in a meaningful state and supports pause/back/step/reset. Simulations are explicitly labeled; they do not pretend to run a real cluster.

Readiness cards use `#toan`; chapters use stable `#ch01`…`#ch10`; summary, self-check, formative quiz and practice follow. Full source coverage can make a chapter long: subsections and presentation scenes may expand without deleting material to fit an arbitrary length.

The old 72–96-hour course estimate is a baseline, not a validated estimate for this expanded treatment. Re-estimate after implementation; do not imply all 396 pages can be mastered within six short readings.

## 07 · Ingestion — the journey begins

**Source:** `Lession_7_Data_Engineering_Ingestion_Layer.pdf` · 45 pages. **Route:** `/courses/data-engineering-foundation/lessons/b7`.

**Readiness / #toan:** Read INSERT/UPDATE/DELETE and a small JSON record. Review ordered sequences (offsets), keys, throughput versus latency, and failure/retry: these distinguish where an event belongs from whether its effects were committed. The source-system section provides a bridge for starting before lessons 1–6 are written.

**Opening narration sample**

At the checkout, an order becomes a row. Somewhere else, an analyst is waiting for the sale, a stock service is waiting for the quantity, and a fraud system is waiting for a signal. Three destinations, one busy database. I’ll follow this order beyond that database. You’ll see why moving a record is only the beginning; preserving its meaning through delays and failures is the real work.

### Chapter plan

**01 · The order leaves its source** · PDF pages 4-7 · `#ch01`

Trace source → staging → warehouse → marts → users. Explain raw, summary and metadata; quality, security, lineage, metadata management and access control across layers. Relate source quality, CPU/memory limits, extraction speed, volume and format to ingestion design.

**Presentation:** Annotated architecture diagram and narrative trace.

**02 · Different sources, different clocks** · PDF pages 8-10,15-19 · `#ch02`

Files (CSV, JSON, XML, Parquet, images, PDF), local/cloud locations, batch and micro-batch; structured/semi-structured/unstructured data. OLTP and OLAP purpose, operations, access patterns, latency examples and ETL/ELT. Redraw row/column/hybrid layouts; cover system, application, debug, audit, security and network logs from containers, servers and IoT.

**Presentation:** Comparison table with worked records and explanatory prose.

**03 · Capture the change, including the deletion** · PDF pages 11-14 · `#ch03`

Compare timestamp polling, triggers and transaction-log CDC for INSERT/UPDATE/DELETE. Walk through LAST_MODIFIED indexing and soft deletes, audit-table writes and cascading-trigger maintenance, vendor log formats and transaction boundaries. Keep the source-load tradeoff; correct the claim that log-based CDC adds zero load.

**Presentation:** Comparison table with worked records and explanatory prose.

**04 · One event, several destinations** · PDF pages 20-25 · `#ch04`

Revisit the overloaded e-commerce database. Explain producer push, consumer pull, brokers/cluster, Kafka core versus Connect source/sink, Streams and MirrorMaker across two clusters. Preserve ZooKeeper's historical role and add the verified KRaft distinction. Account for the original Kafka use-case diagram.

**Presentation:** Annotated architecture diagram and narrative trace.

**05 · A topic becomes parallel lanes** · PDF pages 26-29 · `#ch05`

Define all six core terms: topic, partition, offset, producer, consumer, broker. Compare event/domain/environment topic naming. Show an ordered append log per partition; distinguish per-partition ordering from a global ordering claim.

**Presentation:** Before/after diagrams with mechanism cards.

**06 · More lanes do not mean free speed** · PDF pages 30-35 · `#ch06`

Explain independent readers, redistribution across brokers, throughput and controller overhead. Preserve the 16-consumer/16-partition example and identify 5–10 MB/s as a source estimate requiring context. Trace partition offsets, consumer position, log end and lag, replay/resume, keyed and unkeyed routing with client/version qualifications.

**Presentation:** Comparison table with worked records and explanatory prose.

**07 · The readers divide the work** · PDF pages 36 · `#ch07`

Show partition assignment within one consumer group, independent progress across different groups, parallelism and an idle consumer when readers outnumber partitions. Explain why exclusive partition ownership does not eliminate retry duplicates.

**Presentation:** Step player with a persistent HTML trace table.

**08 · A broker disappears** · PDF pages 37 · `#ch08`

Trace leader/follower replication, replication factor, in-sync replicas and election after a leader failure. Connect durability to acknowledgments, replica health and configuration; preserve the failure diagram without promising unconditional no-loss behavior.

**Presentation:** Annotated architecture diagram and narrative trace.

**09 · The crash between processing and commit** · PDF pages 38-39 · `#ch09`

Compare at-most-once, at-least-once and exactly-once with a crash timeline. Explain acks=0/1/all, retries, commit-before/after processing, producer idempotence and transactional boundaries. Explicitly repair the repeated heading and distinguish log deduplication from exactly-once external side effects.

**Presentation:** Failure case, decision tree and explained alternatives.

**10 · The log remembers; Debezium translates** · PDF pages 40-43 · `#ch10`

Compare time retention, size retention and compaction; retain the 7-day/1-GB-per-partition examples as configurations, not universal defaults. Trace database log → Debezium → Kafka → downstream sink. Explain binlog/WAL/redo conversion and preserve the source connector list with support/version caveats.

**Presentation:** Step player with a persistent HTML trace table.

### Interaction storyboards

The fixtures and numerical outcomes below are proposed teaching examples; they are not claimed to appear in the source slides.

**1. Routing and group lab**

Choose keyed/unkeyed mode, partition count and consumer count. Step six events through visible logs; switch groups and inspect separate offsets. With 3 partitions and 4 consumers in one illustrated group, one consumer is idle. Keyed routing uses an explicitly documented toy hash, not a claim to reproduce every Kafka client.

**2. Crash and replay timeline**

Select commit-before or commit-after, inject a crash before processing or after the side effect, then recover. Fixture: balance 0, event +10. Crash after applying but before commit gives 20 on an unprotected replay; idempotent sink stays 10. The complete event/commit/effect trace remains visible as a table.

**3. CDC comparison and retained log**

Apply insert/update/hard-delete to a small source table; compare timestamp/trigger/log captures. Switch retention time, size and compaction to see which historical records remain. Do not equate consuming a record with deleting it or model compaction as an immediate synchronous delete.

**Quantitative anchors:** 16 consumers need at least 16 partitions to all work concurrently in the illustrated group; the source’s 5–10 MB/s estimate needs a workload label; compare 7-day retention and 1 GB/partition as configurable examples; distinguish 3 delivery semantics.

**Self-check and practice targets:** Explain why a hard delete can disappear from timestamp polling; assign partitions to consumers; locate a duplicate-producing crash; distinguish a Kafka retry from an external double charge; design one CDC event contract.

## 08 · Storage — giving data a memory

**Source:** `Lession_8_Data_Engineering_Storage_Layer.pdf` · 59 pages. **Route:** `/courses/data-engineering-foundation/lessons/b8`.

**Readiness / #toan:** Review paths, IDs, metadata, rows/columns and latency units. Introduce entity/relationship/schema and retention: they explain why a file can exist while its meaning is lost. No calculus is required.

**Opening narration sample**

By morning, the orders have arrived. Thousands of files sit safely in storage, but the analyst still cannot answer yesterday’s sales question. One file has no owner. Another has a different schema. A third is a duplicate. I’ll trace how stored bytes become trusted records. You’ll watch that transformation happen through models, metadata, and rules for moving between layers.

### Chapter plan

**01 · The same bytes need different homes** · PDF pages 3-10 · `#ch01`

Explain why storage turns recorded information into a usable asset. Compare file hierarchy/path/NAS, block IDs/disks/SAN and object ID/metadata/data/buckets. Preserve every comparison axis: metadata, structure, latency, scaling, modification, cost and use case; label workload-dependent claims.

**Presentation:** Comparison table with worked records and explanatory prose.

**02 · Memory buys time, not permanence** · PDF pages 11-13 · `#ch02`

Redraw the latency ladder and distinguish illustrative orders of magnitude from measurements. Compare Redis, Memcached and Hazelcast across latency, partitioning, complex types, performance context, snapshots, replication, pub/sub and workloads. Explain cache durability and capacity tradeoffs.

**Presentation:** Comparison table with worked records and explanatory prose.

**03 · Finding the blocks across machines** · PDF pages 14-16 · `#ch03`

Trace HDFS client metadata requests to NameNode and data access to DataNodes; blocks, permissions, replica locations, heartbeats, block reports and racks. Separate the source's 64-MB example from a verified version default. Explain streaming/tiered storage, historical-read pressure and sink offload; source-system versus storage ownership and lifecycle.

**Presentation:** Annotated architecture diagram and narrative trace.

**04 · Stored data is not yet an agreed truth** · PDF pages 17-24 · `#ch04`

Explain warehouse/SSOT, data model → related dataset → access control → report flow. Compare conceptual, logical and physical models by purpose, focus, audience and concrete customer/order example; physical models include database-specific types, keys and constraints.

**Presentation:** Comparison table with worked records and explanatory prose.

**05 · Shape the model for the question** · PDF pages 25-26 · `#ch05`

Define fact measurements and descriptive dimensions. Draw a star and its normalized snowflake alternative with subdimensions. Explain joins, duplication and analytical usability; preview the deeper modeling treatment in lesson 11.

**Presentation:** Before/after diagrams with mechanism cards.

**06 · A lake keeps possibilities open** · PDF pages 27-31 · `#ch06`

Cover native formats, heterogeneous types, horizontal scaling, schema-on-read and raw retention. Trace ETL to ML/reporting and compare lake/warehouse type, format, schema, cost, workload and performance. Explain the Delta Lake bridge without presenting a warehouse as categorically unable to handle semi-structured data.

**Presentation:** Before/after diagrams with mechanism cards.

**07 · The lake becomes a swamp** · PDF pages 32-40 · `#ch07`

Explain each failure separately: missing metadata, governance, quality, ownership/stewardship, schema documentation and tooling. Connect them to discovery failure, duplication, wasted storage, slower insight, unreliable decisions and compliance exposure. Do not turn the compliance examples into legal advice.

**Presentation:** Failure case, decision tree and explained alternatives.

**08 · Give every dataset a steward and a trail** · PDF pages 41-48 · `#ch08`

Cover automated catalogs (Glue, Atlas, Amundsen), RBAC/lineage, profiling (GX, Monte Carlo), raw/cleansed/curated zones, Avro/Delta schema evolution, contracts, discovery tags, Airflow/OpenLineage monitoring, freshness/failure alerts, retention and archive/delete policies.

**Presentation:** Comparison table with worked records and explanatory prose.

**09 · One foundation, several analytical workloads** · PDF pages 49-51 · `#ch09`

Walk the lakehouse diagram from structured/unstructured/streaming sources through table reliability, schema and versioning to SQL/BI and ML, then analysts, business teams and engineers. Distinguish storage, table format and compute responsibilities.

**Presentation:** Annotated architecture diagram and narrative trace.

**10 · Three stages, increasing responsibility** · PDF pages 52-57 · `#ch10`

Define multi-hop and medallion. Bronze keeps source-shaped data plus load time/process ID, supports CDC archive, audit and replay. Silver cleans/matches/merges/standardizes/integrates with possible 3NF. Gold serves domain-ready, read-optimized star/OBT models, quality rules, analytics and ML. Preserve both batch and streaming paths.

**Presentation:** Step player with a persistent HTML trace table.

### Interaction storyboards

The fixtures and numerical outcomes below are proposed teaching examples; they are not claimed to appear in the source slides.

**1. Storage access explorer**

Select one workload and inspect the path/block/object access steps, metadata and update unit. Toggle the HDFS diagram to trace NameNode lookup, DataNode read and replica fallback. The UI explains the tradeoff instead of inventing universal benchmark rankings.

**2. Lake-to-swamp investigation**

A synthetic catalog contains an ownerless dataset, stale schema, duplicate and missing freshness. Toggle catalog, owner, validation, lineage and retention policies; inspect which issue each fixes and which it cannot. No arbitrary single quality score hides the remaining failures.

**3. Bronze–silver–gold trace**

Step five synthetic rows through raw preservation, quarantine/deduplication and aggregation. Two valid unique orders, one retry duplicate, one invalid amount and one missing key yield 5 bronze rows, 2 valid silver orders and 2 quarantined rows; duplicate handling is logged. Gold sums only accepted rows; replay must preserve the same result.

**Quantitative anchors:** 3 storage models serve different access patterns; 3 modeling levels answer different audiences; 3 medallion layers carry different responsibilities; the source’s 64-MB HDFS figure must be labeled against the selected version; latency powers of ten illustrate scale, not a benchmark.

**Self-check and practice targets:** Choose storage by access pattern and justify the tradeoff; trace an HDFS read; distinguish conceptual/logical/physical models; diagnose each swamp cause; specify bronze/silver/gold ownership, checks and replay policy.

## 09 · Batch — dividing the work without losing the result

**Source:** `Lession_9_Data_Engineering_Transformation_Layer_1_Batch.pdf` · 90 pages. **Route:** `/courses/data-engineering-foundation/lessons/b9`.

**Readiness / #toan:** Review Python collections/functions and SQL filter/join/grouping using a small annotated example. Refresh partition, sum, distinct count and memory units. Distinguish a record’s business key from its physical placement before introducing distributed execution.

**Opening narration sample**

The nightly report once finished on a single machine. Tonight, most workers finish quickly, but one partition is still processing hundreds of millions of rows. The rest of the cluster waits. I’ll take you inside that job, from the first lazy transformation to the final files. The machines are working; the shape of the work decides whether they can finish together.

### Chapter plan

**01 · One machine reaches its limit** · PDF pages 3-8 · `#ch01`

Trace the log-processing example: parse logs, count page views and generate reports. Explain storage/compute/reliability limits, distributed scheduler/workers, Spark's languages and batch/streaming/SQL/ML/graph roles. Separate Spark compute from HDFS/S3/Delta/Iceberg/database storage and resource management.

**Presentation:** Annotated architecture diagram and narrative trace.

**02 · A program becomes tasks** · PDF pages 9-16 · `#ch02`

Driver/SparkContext, cluster manager, workers, executors, tasks and cache; dataset partition versus task. Walk filter/select/show, lazy plan, application/job/stage/task hierarchy and the full eight-step execution flow. Explain stage boundaries rather than only listing the names.

**Presentation:** Step player with a persistent HTML trace table.

**03 · Two ways to describe distributed data** · PDF pages 17-30 · `#ch03`

RDD partitions/lineage/recomputation and SparkSession/SparkContext/local[*]/parallelize with two partitions. DataFrame row/column/schema/immutability and source support; compare APIs. Reconstruct image code for createDataFrame, toDF, CSV header, JSON and JDBC URL/driver/dbtable/options, with readable output tables.

**Presentation:** Readable code, input/output tables and line-by-line commentary.

**04 · Objects cross the network as bytes** · PDF pages 31-41 · `#ch04`

Explain serialization/deserialization at shuffle, caching and transfer, and CPU/RAM/network costs. Compare Java and Kryo, configuration before context creation, class registration and buffer considerations. Annotate the original setup example with JVM versus Python scope.

**Presentation:** Readable code, input/output tables and line-by-line commentary.

**05 · Remember what is worth reusing** · PDF pages 42-53 · `#ch05`

Disk versus RAM, lazy cache materialization, cache/persist and all five source storage choices: MEMORY_ONLY, MEMORY_AND_DISK, MEMORY_ONLY_SER, MEMORY_AND_DISK_SER, DISK_ONLY. Show recompute versus disk fallback and serialized versus deserialized tradeoffs; RDD/DataFrame/Python differences, reuse decisions and unpersist.

**Presentation:** Parameter controls, diagram and computed results.

**06 · The slowest partition sets the pace** · PDF pages 54-62 · `#ch06`

Teach skew (700M/10M/8M/12M rows), shuffle explosion, high cardinality, wide schemas and schema evolution independently. Explain groupBy/join/distinct/repartition, spill and network pressure; retain the day-1/day-30 schema example and show why more machines do not remove a hot key.

**Presentation:** Failure case, decision tree and explained alternatives.

**07 · Move the filter before the traffic jam** · PDF pages 63-67 · `#ch07`

Trace logical plan, analysis, optimized logical plan and physical plan. Reconstruct both source query diagrams and SQL, including t1/t2 join, t2.id threshold, projection and sum. Animate legal filter pushdown and explain assumptions for preserving query results.

**Presentation:** Before/after diagrams with mechanism cards.

**08 · A faster engine beneath the plan** · PDF pages 68-74 · `#ch08`

Tungsten binary layout, Java-object/GC overhead, optional off-heap memory, cache-aware access (L1/L2/L3/RAM) and whole-stage code generation. Distinguish latency illustrations from speedup guarantees. AQE uses runtime statistics to switch joins, coalesce shuffle partitions and split skewed joins.

**Presentation:** Annotated architecture diagram and narrative trace.

**09 · Tune the work before adding machines** · PDF pages 75-83 · `#ch09`

Partition count versus spill/scheduling overhead; early filtering, broadcast hash joins, pre-aggregation; identify/isolate/salt/merge heavy keys. Approximate distinct versus exact counts, early projection, Parquet/ORC column pruning versus CSV, schema enforcement/evolution with Delta/Iceberg.

**Presentation:** Parameter controls, diagram and computed results.

**10 · Read the traces left by a job** · PDF pages 84-88 · `#ch10`

Explain Spark UI active/pending/completed stages, duration, tasks and shuffle. Dynamic allocation scales executors using backlog and idle signals; retain 1s/60s as version-qualified values. Compaction via coalesce/repartition/Delta OPTIMIZE, file-open overhead and periodic maintenance; distinguish preserved logical records from physical byte-size changes.

**Presentation:** Comparison table with worked records and explanatory prose.

### Interaction storyboards

The fixtures and numerical outcomes below are proposed teaching examples; they are not claimed to appear in the source slides.

**1. Lazy-plan and shuffle player**

Add filter/select/groupBy, then invoke an action. No task runs before the action. Step the DAG through stages/partitions; toggle a valid filter pushdown and broadcast of a small relation, inspect rows moved and unchanged output. Counts are from the small fixture, not runtime performance claims.

**2. Cache and memory experiment**

Select a storage strategy, capacity and reuse count; inspect which partitions materialize, spill or recompute. First action fills cache, later action reuses it, unpersist releases it. Contrast JVM RDD and DataFrame defaults explicitly; explain why caching a one-use result may add work.

**3. Skew and operations workbench**

Switch balanced/skewed fixtures, inspect task bars, salt a heavy aggregate key then merge partial sums. The final aggregate stays identical while work distribution changes. A second view distinguishes executor scaling from file compaction and shows a mock Spark UI labeled as a teaching model.

**Quantitative anchors:** 700M versus 10M/8M/12M rows makes the straggler visible; 2 partitions make the initial RDD inspectable; 5 storage choices trade memory, disk and recomputation; 1s/60s allocation examples require a version label; the source’s ~1ns/~100ns figures do not imply an automatic 100× job speedup.

**Self-check and practice targets:** Predict which call starts execution; explain lineage recovery; select cache/persist for a reuse pattern; interpret a skewed stage; preserve query results when pushing filters; distinguish partition tuning, executor allocation and output compaction.

## 10 · Streaming — deciding when a moment is complete

**Source:** `Lession_10_Data_Engineering_Transformation_Layer_2_Stream.pdf` · 75 pages. **Route:** `/courses/data-engineering-foundation/lessons/b10`.

**Readiness / #toan:** Review event timestamps, time intervals, keys, counters and lesson 7 offsets. Use half-open intervals with explicit endpoint conventions. Explain operator state and input position separately before checkpoint recovery.

**Opening narration sample**

A payment happened before the minute ended. Its message arrived after the dashboard had already published that minute’s total. The clock is correct, and so is the timestamp. The result is still incomplete. I’ll follow the two timelines with you: when the event happened and when the system learned about it. Between them sit watermarks, windows, and the decision to revise the past.

### Chapter plan

**01 · A computation with no final record** · PDF pages 3-12 · `#ch01`

Bounded/unbounded streams; filtering, enrichment, aggregation and routing. JobManager/TaskManager/slots, shared CPU versus managed memory, operator/subtask/parallelism with 3-slot and 4-subtask examples. Execution graph, task assignment, monitoring, checkpoint completion and source rewind after failure.

**Presentation:** Annotated architecture diagram and narrative trace.

**02 · The event has more than one clock** · PDF pages 13-22 · `#ch02`

Processing, ingestion and event time; timestamp extraction, watermark generation and downstream progress. Retain 00:58−5s=00:53 and 01:05−5s=01:00; monotonous, bounded and custom strategies; 10:01:20−10s=10:01:10. Explain out-of-order tolerance, measurement tradeoffs and that watermarks are progress assumptions, not proof of completeness.

**Presentation:** Step player with a persistent HTML trace table.

**03 · Cut a moving stream into windows** · PDF pages 23-32 · `#ch03`

Tumbling, sliding, session and global windows, size/slide/inactivity gaps and event membership. Preserve revenue/hour, rolling 10-minute/1-minute, clickstream and 100-event examples. Separate window assignment, trigger firing, emission and state cleanup; explain time-domain-dependent defaults and global trigger behavior.

**Presentation:** Parameter controls, diagram and computed results.

**04 · The missing event arrives after the result** · PDF pages 33-40 · `#ch04`

Compare drop, allowed lateness and side output, including corrected count 3→4. Redraw the 10s disorder/15s lateness timeline with an explicit watermark at every arrival. Explain collecting/waiting/deleted states, repeated emissions, audit/reprocessing/alerts/DLQ and downstream upserts. Keep the latency/memory/correctness comparison with qualified costs.

**Presentation:** Step player with a persistent HTML trace table.

**05 · Several languages describe the flow** · PDF pages 41-50 · `#ch05`

DataStream, Table API, SQL and the agenda's ProcessFunction. Explain map/filter/flatMap/keyBy/window/aggregate/union/connect; dynamic tables, parser/optimizer/planner and interoperability. Rebuild Java/Python/SQL examples, source schema/WATERMARK, TUMBLE/HOP/SESSION; correct the undefined window_start and qualify equivalent-plan claims.

**Presentation:** Readable code, input/output tables and line-by-line commentary.

**06 · Each key carries a memory** · PDF pages 51-57 · `#ch06`

Explain running counts, failed logins, hourly revenue, sessions and fraud history. Walk event→read state→compute→write state→emit. Keyed versus operator state, source offsets, and the agenda-only window-state/scaling topics; verify PyFlink support before presenting a limitation as current.

**Presentation:** Annotated architecture diagram and narrative trace.

**07 · Recover a consistent past** · PDF pages 58-61 · `#ch07`

Checkpoint versus code backup; barrier injection, snapshots, async durable writes and all-task acknowledgments. Restore source positions and operator state from the latest completed checkpoint. Add explicit multi-input barrier coordination and source/sink conditions to explain the exactly-once promise made in the agenda.

**Presentation:** Step player with a persistent HTML trace table.

**08 · Remove the handoffs that do no work** · PDF pages 62-67 · `#ch08`

Cover watermark, chaining, memory and backpressure tuning categories. Contrast independent network/buffer/serialization/thread steps with compatible chained operators. Explain disableChaining/startNewChain for debugging, profiling and isolation; separate chain boundaries from slot-sharing/resource isolation.

**Presentation:** Step player with a persistent HTML trace table.

**09 · The bottleneck pushes upstream** · PDF pages 68-71 · `#ch09`

Trace slow downstream→full buffers→upstream throttling, queue/latency effects and protection limits. Explain UI pressure levels while checking downstream busy operators rather than assuming the first HIGH node is the cause. Evaluate per-operator parallelism, async I/O and RocksDB cache tuning from measured bottlenecks.

**Presentation:** Parameter controls, diagram and computed results.

**10 · Choose the failure boundary** · PDF pages 72-73 · `#ch10`

Compare shared session deployments with dedicated application deployments: isolation, resource sharing, startup/lifecycle and development/production tradeoffs. Preserve the source's recommendation as a recommendation, not a rule that session clusters cannot run production. Close with an end-to-end event-time design.

**Presentation:** Step player with a persistent HTML trace table.

### Interaction storyboards

The fixtures and numerical outcomes below are proposed teaching examples; they are not claimed to appear in the source slides.

**1. Event-time studio**

Change window type, size/slide/gap, disorder bound, allowed lateness and late-event policy. Step event/arrival timestamps and explicit watermarks; show initial, revised and side outputs plus state cleanup. Replay the source arithmetic and corrected timeline. For allowed lateness, advancing wall clock alone must not expire an event-time window.

**2. Checkpoint and failure player**

Step sources, barriers, keyed state and sink output. Inject failure before/after checkpoint completion; restore only a completed checkpoint with matching source positions. Compare an unprotected external sink with an idempotent/transactional illustrative sink, showing why state recovery alone cannot prevent duplicate side effects.

**3. Chaining and backpressure model**

Set source rate and downstream service rate, toggle compatible chaining and change bottleneck parallelism. Source 8 events/tick and sink 3 events/tick grow backlog by 5 per tick before capacity throttles upstream. Label this as a queue model, not a Flink benchmark; show backpressure upstream of the slow operator.

**Quantitative anchors:** 00:58−5s=00:53 and 01:05−5s=01:00 drive the first window; distinguish 10s out-of-order tolerance from 15s allowed lateness; a late count can change 3→4; 3 slots divide managed memory, not dedicated CPU cores; 4 subtasks represent parallel instances.

**Self-check and practice targets:** Assign events to each window type; compute the displayed watermark; predict accepted/refired/side-output records; restore state plus source positions after a crash; distinguish chaining from scaling and explain a downstream bottleneck.

## 11 · Consumption — making a number mean something

**Source:** `Lession_11_Data_Engineering_Consumption_Layer_2.pdf` · 64 pages. **Route:** `/courses/data-engineering-foundation/lessons/b11`.

**Readiness / #toan:** Review primary/foreign/composite keys, dependencies, joins, sums and averages. Define grain before fact tables, and event/effective timestamps before SCD and feature retrieval. Supply a short SQL bridge because the earlier database lesson is not yet implemented.

**Opening narration sample**

The customer moved, but yesterday’s sale did not. Yet a report now assigns that old sale to the new region. In another system, a model sees a spending average calculated differently from the one used in training. I’ll follow these small changes in meaning. You’ll see how a grain, a historical version, and a feature timestamp can decide whether a perfectly valid query tells the right story.

### Chapter plan

**01 · A warehouse answers a different question** · PDF pages 3-7 · `#ch01`

Warehouse, SSOT, source/staging/raw/summary/metadata/marts/users and ETL. Compare ER versus dimensional modeling by workload, goals and examples, clarifying that a warehouse is still a database system and does not replace transactional responsibilities.

**Presentation:** Annotated architecture diagram and narrative trace.

**02 · Separate entities without losing the order** · PDF pages 8-15 · `#ch02`

Entities/attributes/relationships; 1NF atomicity and repeating groups; 2NF composite/candidate keys and partial dependencies; 3NF transitive dependencies. Rebuild product-list and phone examples, then Order_Detail→Customers/Products/Orders/OrderItems with keys, rows and joins. Flag the source's changed quantity instead of silently copying inconsistent data.

**Presentation:** Readable code, input/output tables and line-by-line commentary.

**03 · Declare what one row means** · PDF pages 16-22 · `#ch03`

Dimensional objectives and consumption outputs: facts, dimensions, aggregates, analytical views. Explain grain, foreign keys, measures, date dimensions and filtering/grouping/hierarchies. Preserve sales 500+700=1,200 and inventory 100/80/120: sum 300 is inappropriate, ending 120 or average 100 fits the question. Rebuild fact/dimension examples.

**Presentation:** Comparison table with worked records and explanatory prose.

**04 · The shape changes the joins** · PDF pages 23-25 · `#ch04`

Star query workflow, sensor/machine/location/time example and customer→city→state→country snowflake. Compare joins, storage, usability, hierarchy and maintenance; show performance as a workload tradeoff rather than a guaranteed ordering.

**Presentation:** Before/after diagrams with mechanism cards.

**05 · A customer changes; history must choose** · PDF pages 26-34 · `#ch05`

Cover every supplied SCD type: 0, 1, 2, 3, 4, 6. Preserve Peter Pan GBP→USD, natural/surrogate keys, effective dates, current/previous values, history table and active/delete flag semantics. Trace historical fact joins and Type 6 current-value overwrite across versions. Explain the source's own Type 1 usage inconsistency and Type 4 naming context.

**Presentation:** Parameter controls, diagram and computed results.

**06 · Keep business keys and history apart** · PDF pages 35-38 · `#ch06`

Explain Data Vault motivation under schema change/multiple sources; hubs, links, satellites, load dates and source provenance. Rebuild customer/order/product hubs, order-customer/order-product links and name/address/price/category/status/amount satellites. Position this integration model relative to consumption models.

**Presentation:** Annotated architecture diagram and narrative trace.

**07 · Two routes toward shared business meaning** · PDF pages 39-42 · `#ch07`

Inmon top-down normalized enterprise warehouse and derived marts versus Kimball dimensional delivery, conformed dimensions and integration. Compare delivery time, consistency, cost and organizational fit. Map bronze/silver/gold to raw, cleaned/3NF/Vault and star/snowflake with every supplied naming convention.

**Presentation:** Comparison table with worked records and explanatory prose.

**08 · Read columns to answer large questions** · PDF pages 43-45 · `#ch08`

Columnar storage, vectorized execution and distributed queries; reproduce the four-pair vector addition with a qualified SIMD explanation. Compare OLTP/OLAP users, operations, row counts, freshness, schemas, response-time examples and engines, including Druid and Doris.

**Presentation:** Annotated architecture diagram and narrative trace.

**09 · Two engines, different serving priorities** · PDF pages 46-54 · `#ch09`

ClickHouse nodes, vectorized execution/cache, column blocks, object storage and coordination metadata; ZooKeeper versus Keeper and deployment variation. Pinot schema/dimension/metric/time columns; real-time, offline segment uploads and hybrid queries. Preserve all comparison axes while qualifying latency/freshness/throughput claims.

**Presentation:** Readable code, input/output tables and line-by-line commentary.

**10 · A model needs the past as it was** · PDF pages 55-62 · `#ch10`

Fraud transaction fields and behavioral features; training/serving mismatch in filters, rounding/nulls and duplicated team logic (45.73/46/47.10). Explain ingestion, offline/online store, training/serving retrieval, static/contextual/critical freshness and cost. Add a clearly labeled Feast bridge for the agenda-only practical: entities, views, point-in-time retrieval, materialization and online lookup.

**Presentation:** Parameter controls, diagram and computed results.

### Interaction storyboards

The fixtures and numerical outcomes below are proposed teaching examples; they are not claimed to appear in the source slides.

**1. Normalization and analytical query explorer**

Move from the source order table to normalized entities, then a star/snowflake view. Highlight keys, grain, joins and duplicate attributes. Use one consistent quantity fixture; calculate sales versus inventory aggregations and explain why the same SUM operator can be appropriate or misleading.

**2. SCD history studio**

Switch types 0/1/2/3/4/6; apply GBP→USD and a later change. Inspect rows, surrogate keys, intervals and current/previous attributes, then query an old sale. Type 1 loses prior values; Type 2 retains correct versions; Type 3 has limited history; Type 6 changes current columns across history rows.

**3. Feature time-travel lab**

A training event at 10:00 sees a 09:55 feature, never a 10:05 feature; online lookup may return the newest value. Toggle TTL, freshness and inconsistent null/filter logic, inspect the selected rows and values. The labeled Feast supplement maps the model to entity/view/historical retrieval/materialization/online lookup code.

**Quantitative anchors:** Sales 500+700=1,200 versus inventory 100+80+120=300 (wrong aggregation); ending inventory 120 versus average 100; SCD 0/1/2/3/4/6 preserve different history; 45.73, 46 and 47.10 illustrate feature disagreement; 1–5-minute feature refresh is a scenario choice.

**Self-check and practice targets:** Normalize the order example without changing quantities; declare fact grain and additive behavior; join a fact to its correct SCD version; map a business relationship to a Vault link; choose an OLAP tradeoff; reject future features in a training row.

## 12 · Orchestration — coordinating work you can trust

**Source:** `Lession_12_Data_Engineering_Orchestration_Layer.pdf` · 63 pages. **Route:** `/courses/data-engineering-foundation/lessons/b12`.

**Readiness / #toan:** Review directed graphs, dependencies, task states, retries, data intervals and validation rules. Explain a DAG’s acyclic constraint with a tiny example; distinguish executing Python locally from scheduling isolated tasks. No advanced graph theory is assumed.

**Opening narration sample**

At two in the morning, extraction begins. At three, transformation starts on schedule. The last source file will not arrive until twenty past three. Every clock has kept its promise; the pipeline has not. I’ll rewind this run and let dependencies take control. You’ll see why finishing a task is only one condition for publishing a result—the data itself must also earn passage.

### Chapter plan

**01 · Three correct clocks produce one wrong report** · PDF pages 3-10 · `#ch01`

Replay extract at 02:00, transform at 03:00, load at 04:00 with extraction delayed to 03:20. Explain dependencies, safe blocking and parallel customer/order extraction. Define orchestration as coordination and show state, scheduling and fault-tolerance responsibilities.

**Presentation:** Step player with a persistent HTML trace table.

**02 · A run needs a memory and a recovery path** · PDF pages 11-14 · `#ch02`

Time/manual/data-availability/event triggers; queued/running/success/failed/skipped/retrying states. Retry, logs, alerts, manual reruns and downstream blocking; resource coordination when 100 tasks hit the same database. Distinguish scheduling a run from coordinating its tasks.

**Presentation:** Step player with a persistent HTML trace table.

**03 · A timer cannot judge readiness** · PDF pages 15-17 · `#ch03`

Cron purpose and limitations: dependencies, DAGs, centralized metadata and recovery. Add explicitly sourced bridges for agenda-only idempotency, backfill and dynamic pipelines; distinguish retry/rerun/backfill, logical data intervals and duplicate-safe writes.

**Presentation:** Failure case, decision tree and explained alternatives.

**04 · A DAG is a plan; a run is an event** · PDF pages 18-24 · `#ch04`

Airflow capabilities and non-goals; DAG direction/acyclicity, task, DAG Run and Task Instance. Trace DAG files, scheduler, executor, workers, metadata and UI, preserving the source architecture while labeling its version assumptions and adding the current execution-API distinction.

**Presentation:** Annotated architecture diagram and narrative trace.

**05 · Tasks exchange references, not whole datasets** · PDF pages 25-29 · `#ch05`

Explain Python/Bash/SQL/S3 sensor/Docker/HTTP/email operators, TaskFlow decorator, file/table/API/workflow readiness sensors. Reconstruct image snippets and correct the FileSensor caption. Explain task isolation, XCom push/pull, paths/counts/model IDs and default-backend small-value boundaries.

**Presentation:** Readable code, input/output tables and line-by-line commentary.

**06 · Protect the systems beneath the scheduler** · PDF pages 30-38 · `#ch06`

Variables versus Connections, credential handling; Sequential/Local/Celery/Kubernetes executor scope and version support. Concurrency examples 200 tasks, parallelism=64, max_active_runs=1 and pool=5; distinguish task/run/resource limits. UI/grid/logs, alerts, Grafana/Datadog trends and queues.

**Presentation:** Comparison table with worked records and explanatory prose.

**07 · Green tasks can still carry bad data** · PDF pages 39-43 · `#ch07`

Preserve and investigate the Gartner/PHE/Unity anecdotes with provenance and corrections. Define fitness for purpose and bad-data forms; accuracy, completeness, consistency, timeliness, validity and uniqueness. Turn each into rules for nulls, IDs, email, positive price, future timestamps and a 30% row-count drop.

**Presentation:** Comparison table with worked records and explanatory prose.

**08 · Quality improves through a feedback loop** · PDF pages 44-48 · `#ch08`

Business case→profile→rules→monitor→correct. Preserve CRM findings (15% missing email, 10% invalid), email-or-phone rule, phone standardization, duplicate heuristics, 5% alert threshold and upstream training. Table/row/column coverage, alert context, resolution and scale; manual/rule/metric/ML detection approaches.

**Presentation:** Failure case, decision tree and explained alternatives.

**09 · A failed check must change execution** · PDF pages 49-52 · `#ch09`

Show the unsafe path where validation fails but transform/load continue. Build a validation gate/circuit-breaker pattern with fail/branch/alert and safe downstream dependencies. Explain logged evidence and recovery, including why a skipped or successful branch is not the same as publishing invalid data.

**Presentation:** Step player with a persistent HTML trace table.

**10 · Make the agreement executable** · PDF pages 53-61 · `#ch10`

Schema renames/removals/types/nullability, contracts for range/freshness/uniqueness at team boundaries. Compare GX, Deequ, dbt tests, Soda and DataHub roles. GX expectations/suites/backends/Airflow gate; Deequ profiling/analyzers/verification, >99% completeness, anomaly detection and incremental metrics; DataHub datasets/schemas/owners/pipelines/lineage/quality and impact analysis.

**Presentation:** Annotated architecture diagram and narrative trace.

### Interaction storyboards

The fixtures and numerical outcomes below are proposed teaching examples; they are not claimed to appear in the source slides.

**1. Cron versus dependency scheduler**

Run the 02:00/03:00/03:20/04:00 scenario in time-only and dependency modes; step, pause, retry and backfill a chosen interval. The safe scheduler never starts transform before extraction succeeds. Rerunning the same interval uses an idempotent fixture and leaves the published row count unchanged.

**2. Concurrency control room**

Set global task capacity, active DAG runs and database pool slots; step independent tasks into queued/running/success/failed states. The pool view never exceeds its slot capacity; changing max_active_runs changes run overlap, not the number of tasks in a single run. Show configuration references and XCom payloads.

**3. Validation gate and lineage investigation**

Inject a null key, duplicate ID, invalid amount, stale dataset or schema rename. Show exact failing rules, evidence, quarantine/stop decision and blocked consumers on a lineage graph. Fix input and rerun: only then can the downstream publication succeed. GX/Deequ examples remain distinct from the browser simulation.

**Quantitative anchors:** 02:00/03:00/03:20/04:00 expose the scheduling race; compare 200 tasks with a 5-slot database pool; distinguish parallelism=64 from max_active_runs=1; CRM 15% missing/10% invalid and a 5% alert threshold turn quality into a decision; preserve the 30% count-drop and >99% completeness examples.

**Self-check and practice targets:** Distinguish DAG/task definitions from run/instance; design dependency-safe retries and backfill; choose XCom payloads; protect a shared database with a pool; map each quality dimension to a rule; stop unsafe publication and use lineage to identify affected consumers.

## Implementation acceptance

- Every instructional page has a completed lesson anchor and a reviewer can locate its concepts, tables, diagrams, numerical examples and code. The current CSV statuses are **planned**, not coverage passes.
- Source contradictions get an explicit correction note and supporting official reference; no silent omission and no repetition of a known false claim. Agenda-only additions are labeled supplements.
- VI and EN match in scope, examples, numbers, code behavior, interactions and quiz explanations. VI is reviewed for source coverage; a separate fidelity reviewer checks EN against VI.
- Session IDs and progress are scoped to Data Engineering Foundation. AI quiz banks/checklists must never be reused accidentally. Part tests are not automatically enabled by adding lessons.
- Build, route/anchor checks, locale parity, meaningful simulation tests and browser checks pass, including narrow mobile width and reduced motion.
- Detailed lessons become available only when implemented; unfinished sessions retain their planned state.

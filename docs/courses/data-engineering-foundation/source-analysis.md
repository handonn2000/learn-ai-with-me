# Data Engineering Foundation — source analysis

Baseline v1 · 2026-09-06 · Scope: curriculum design, not detailed lessons.

## Source inventory and method

All 12 PDFs in `/Users/handonn/Workplace/AIDE-01/slides/` were inventoried and text-extracted (853 pages total). Page-level content was inspected across every deck; agendas and selected diagram/code pages were also rendered. Page references below are 1-based PDF pages, including covers. This is a curriculum analysis, not a line-by-line technical validation of every slide or runnable example.

The PDFs are source material, not instructions to execute their commands or adopt their agenda as complete coverage. No source PDF is copied into the public app. Filenames retain the original `Lession` spelling for traceability. Slides identify the EDAI/FSDS series; most credit Quan Dang, and lesson 5 also credits Nguyen Pham. The proposed course title and study schedule are our organization of these materials, not an official provider syllabus or duration.

| Lesson | Source PDF | Pages |
|---|---|---:|
| 1 | [Lesson1-Fundamentals_of_Engineering_Linux.pdf](</Users/handonn/Workplace/AIDE-01/slides/Lesson1-Fundamentals_of_Engineering_Linux.pdf>) | 78 |
| 2 | [Lesson_2_Fundamentals_of_Engineering_Python.pdf](</Users/handonn/Workplace/AIDE-01/slides/Lesson_2_Fundamentals_of_Engineering_Python.pdf>) | 73 |
| 3 | [Lesson_3_Fundamentals_of_Engineering_Database.pdf](</Users/handonn/Workplace/AIDE-01/slides/Lesson_3_Fundamentals_of_Engineering_Database.pdf>) | 80 |
| 4 | [Lesson_4_Web_APIs.pdf](</Users/handonn/Workplace/AIDE-01/slides/Lesson_4_Web_APIs.pdf>) | 87 |
| 5 | [Lesson_5_Validation_and_Verification.pdf](</Users/handonn/Workplace/AIDE-01/slides/Lesson_5_Validation_and_Verification.pdf>) | 70 |
| 6 | [Lession_6_Containerization_Orchestration.pdf](</Users/handonn/Workplace/AIDE-01/slides/Lession_6_Containerization_Orchestration.pdf>) | 69 |
| 7 | [Lession_7_Data_Engineering_Ingestion_Layer.pdf](</Users/handonn/Workplace/AIDE-01/slides/Lession_7_Data_Engineering_Ingestion_Layer.pdf>) | 45 |
| 8 | [Lession_8_Data_Engineering_Storage_Layer.pdf](</Users/handonn/Workplace/AIDE-01/slides/Lession_8_Data_Engineering_Storage_Layer.pdf>) | 59 |
| 9 | [Lession_9_Data_Engineering_Transformation_Layer_1_Batch.pdf](</Users/handonn/Workplace/AIDE-01/slides/Lession_9_Data_Engineering_Transformation_Layer_1_Batch.pdf>) | 90 |
| 10 | [Lession_10_Data_Engineering_Transformation_Layer_2_Stream.pdf](</Users/handonn/Workplace/AIDE-01/slides/Lession_10_Data_Engineering_Transformation_Layer_2_Stream.pdf>) | 75 |
| 11 | [Lession_11_Data_Engineering_Consumption_Layer_2.pdf](</Users/handonn/Workplace/AIDE-01/slides/Lession_11_Data_Engineering_Consumption_Layer_2.pdf>) | 64 |
| 12 | [Lession_12_Data_Engineering_Orchestration_Layer.pdf](</Users/handonn/Workplace/AIDE-01/slides/Lession_12_Data_Engineering_Orchestration_Layer.pdf>) | 63 |

## Lesson-by-lesson analysis

### 1. Fundamentals of Engineering: Linux — 78 pages

- **Observed coverage:** GNU/Linux, distributions, architecture, and filesystem (pp. 3–23); command-line tools, pipes, and text processing (24–48); editors and Bash syntax (49–62); compilation and Makefiles (63–71); cron scheduling and limitations (72–76).
- **Curricular role:** establishes the operating environment and the first automation model. Cron becomes a deliberate comparison point for Airflow in lesson 12; Make targets become repeatable project entry points.
- **Target depth:** practice shell/file operations and simple scripts; understand compilation stages without turning this into a C/C++ course. Distribution comparisons are orientation, not memorization.
- **Future evidence:** a repeatable file-processing task, its inputs/outputs, and an explanation of what happens when a scheduled task fails.

### 2. Fundamentals of Engineering: Python — 73 pages

- **Observed coverage:** virtual environments and virtualenv/Poetry/uv (pp. 4–23); syntax, collections, functions, parameters, and conditions (25–53); errors/context managers (55–56); files (58–60); argparse (62–63); standard-library modules (65–66); sync/async (68–72).
- **Curricular role:** shared language for extraction scripts, API clients, testing, database access, and workflow definitions.
- **Target depth:** choose one environment workflow when writing the lesson; make the alternatives comparison material. Emphasize resource lifetime and error handling. Async is an introduction, not a complete concurrency course.
- **Future evidence:** a configurable records-processing CLI with invalid-input behavior. Build on the lesson 1 file task.

### 3. Fundamentals of Engineering: Database — 80 pages

- **Observed coverage:** data/database/DBMS, keys, SQL/NoSQL, ACID/BASE, PostgreSQL and WAL (pp. 4–24); SQL groups, filtering, joins, aggregation, transactions, and logical query order (26–53); indexes, plans, normalization (55–64); SQLite/Python (66–68); SQLAlchemy Core/ORM (70–79).
- **Curricular role:** prerequisite for CDC, analytical modeling, SQL transformation, and understanding data persistence.
- **Target depth:** strongest emphasis on relational correctness and query reasoning; ORM convenience follows SQL understanding. The deck mixes SQL Server examples, PostgreSQL concepts, and SQLite; future executable examples need a declared dialect.
- **Future evidence:** an orders/customers schema, a join/aggregate with known results, and a plan comparison. Pages 57–58 on index types need engine-specific context before becoming PostgreSQL instruction.

### 4. Web APIs — 87 pages

- **Observed coverage:** network/application protocols, HTTP request/response structure, DNS and transport (pp. 4–35); REST, gRPC, WebSocket, SSE, and webhooks (37–61); AAA, Basic Auth, JWT, OAuth (63–76); health checks, metrics, load/stress testing (78–85).
- **Curricular role:** interfaces for collecting and exposing data; introduces contracts and failure boundaries that tests and containers build on.
- **Target depth:** understand requests and API patterns; keep network layers as supporting context. Separate authentication, authorization, token formats, and delegated access carefully when authoring.
- **Gap:** FastAPI is listed on agenda p. 2, but the deck ends without a developed FastAPI implementation section. A future API lab is supplemental material, not an existing source walkthrough.

### 5. Validation and Verification — 70 pages

- **Observed coverage:** V-model and verification/validation (pp. 4–10); testing methods, levels, functional/non-functional concerns (12–37); pytest classes/fixtures/markers/parametrization/mocks (39–59); Testcontainers, tox and coverage (60–64); TDD (66–68).
- **Curricular role:** develops confidence in code behavior before pipeline complexity grows. Distinguish software validation here from data-quality validation in lesson 12.
- **Sequencing bridge:** Testcontainers appears before Docker is taught. Teach its purpose in week 5, execute container-backed tests only after week 6.
- **Future evidence:** a test strategy and representative success/failure cases. Page 37 groups regression/smoke testing under a non-functional heading; classification needs careful review before reuse. Coverage percentages alone are not an acceptance rubric.

### 6. Containerization and Orchestration — 69 pages

- **Observed coverage:** VMs, hypervisors, containers, images, namespaces/cgroups (pp. 4–14); Docker architecture and runtime/build/image tools (16–31); commands and debugging (33–35); volumes/networks (37–42); registries (44–56); Compose (58–59); image build/run/optimization example (61–67).
- **Curricular role:** reproducible local environments for APIs, databases, ingestion, and integration tests.
- **Target depth:** Docker/Compose is the practical focus. Podman, containerd, CRI-O, Buildah, Kaniko, Skopeo, and cloud registries are ecosystem context. Kubernetes appears as background; this is not a Kubernetes operations course.
- **Future evidence:** a small persistent multi-service environment and a clean-start check. Container orchestration here is distinct from data-workflow orchestration in lesson 12.

### 7. Data Engineering: Ingestion Layer — 45 pages

- **Observed coverage:** architecture/source-system responsibilities (pp. 4–10); timestamp-, trigger-, and log-based CDC (11–14); OLTP/OLAP/logs (15–19); Kafka ecosystem (21–25); topics, partitions, offsets, producers, groups, replication, delivery, retention (27–40); Debezium (42–43).
- **Curricular role:** first explicit data-platform layer. Connect operational database changes to downstream processing without treating all sources alike.
- **Target depth:** explain partition-scoped ordering, replay, source load, and duplicate/loss tradeoffs; use a small event model. Debezium is introductory coverage rather than a complete connector setup lab.
- **Review priority:** p. 39 labels its last block “At least once” while its body claims “exactly once” from producer settings. Treat this as an unresolved source inconsistency; verify end-to-end guarantee conditions against the chosen Kafka version and sink before writing a lesson. Do not copy the statement into learning outcomes as a guarantee. The agenda's “Kafka’s Challenges” is not developed as a distinct extended section.

### 8. Data Engineering: Storage Layer — 59 pages

- **Observed coverage:** file/block/object storage, cache systems, HDFS, tiered storage (pp. 4–16); warehouse and conceptual/logical/physical models (17–24); star/snowflake (25–26); lake versus swamp and governance/quality/schema/lineage controls (28–48); lakehouse (50–51); multi-hop and medallion architecture (53–57).
- **Curricular role:** organizes persisted data into useful, governed stages. Introduces modeling vocabulary used more deeply in lesson 11.
- **Target depth:** choose storage and zones for a stated workload; describe ownership, quality, schema, and retention. Cache/HDFS/cloud-tool comparisons are awareness topics, not mandatory deployments.
- **Future evidence:** a raw/clean/serving diagram with contracts and metadata. Teach modeling here as architecture, then use fact grain/history to deepen it in lesson 11 rather than duplicating both decks verbatim.

### 9. Data Engineering: Transformation Layer 1 — Batch — 90 pages

- **Observed coverage:** distributed-processing motivation (pp. 4–8); driver/executor/partition/job/stage/task execution and laziness (10–16); RDD/DataFrame examples (18–30); serialization and memory/storage levels (32–53); skew, shuffle, cardinality, wide schemas and schema evolution (55–62); Catalyst/Tungsten/AQE (64–74); manual tuning (76–83); Spark UI, dynamic allocation, and compaction (85–88).
- **Curricular role:** batch transformation, joining earlier Python/SQL and storage knowledge to distributed execution.
- **Target depth:** a small DataFrame job and explanation of its plan/partitions. RDDs support the mental model. Kryo, off-heap mechanics, advanced salting, and dynamic allocation are deeper extensions; do not require mastery of all tuning material to pass a foundation course.
- **Future evidence:** reconciled transformed output plus one observed shuffle/caching/partition tradeoff. Verify storage-level and API-version details when choosing the implementation stack.

### 10. Data Engineering: Transformation Layer 2 — Stream — 75 pages

- **Observed coverage:** Flink architecture, slots, parallelism and recovery overview (pp. 4–12); time and watermark strategies (14–22); windows/triggers (24–32); lateness options (34–40); DataStream/Table/SQL (42–50); state/checkpoint/recovery (53–61); chaining/backpressure (63–71); deployment modes (73).
- **Curricular role:** explains what changes when input is unbounded and arrival order differs from event time.
- **Target depth:** time-based reasoning, state, and failure behavior first; compare APIs without implementing every API. Use local/small event examples before cluster deployment. The deck references language-specific capabilities, so future Java/Python examples need explicit version checks.
- **Future evidence:** manually predicted window results for out-of-order events, plus a checkpoint/replay scenario. Treat exactly-once and state-scaling agenda mentions as requiring expanded treatment, not as proof of complete end-to-end coverage.

### 11. Data Engineering: Consumption Layer — 64 pages

- **Observed coverage:** warehouse/ETL (pp. 4–5); ER and normalization to 3NF (7–15); facts/dimensions/star/snowflake (17–25); SCD variants (27–34); Data Vault (36–38); Inmon/Kimball and medallion mapping (40–42); OLAP, ClickHouse, Pinot (44–54); feature-store motivation and concepts (56–62).
- **Curricular role:** makes processed data usable for analytical questions and introduces ML feature serving as a downstream consumer.
- **Target depth:** declare fact grain and distinguish keys, measures, dimensions, and history. Focus practice on a star model and SCD policy; Data Vault and feature serving are conceptual extensions.
- **Gap:** agenda p. 2 promises “Feast: A Practical Feature Store”; the body mentions Feast in a table on p. 60 but does not provide a worked Feast setup. No full BI dashboard or model-training lab exists here. Broad performance/consistency claims should not become unconditional course promises.

### 12. Data Engineering: Orchestration Layer — 63 pages

- **Observed coverage:** dependency/failure/resource coordination (pp. 4–14); cron limits (16–17); Airflow/DAG/run/task/architecture (19–24); operators, sensors, XCom (25–29); variables/connections, executors, concurrency, pools and monitoring (31–38); data-quality dimensions/rules/lifecycle (40–48); validation gates/circuit breakers/contracts (49–55); GX, Deequ, DataHub (56–61).
- **Curricular role:** integrates previous layers into an operable system and makes data-quality failure affect downstream execution.
- **Target depth:** dependency-aware finite workflows, small task messages, validation decisions, and a clear failure/recovery procedure. Airflow coordinates work performed by other systems.
- **Gap:** section agenda p. 15 names idempotency, backfill, and dynamic pipelines, but pp. 16–17 cover cron limits before moving to Airflow. These concepts need explicit supplemental explanation and examples before the proposed rerun/backfill outcome can be assessed. Tool introductions are not a ready-made complete DAG implementation.

## Synthesis and authoring priorities

1. **Keep all 12 lessons, preserve the source order, and group them into four phases.** This retains traceability while making the progression visible.
2. **Separate familiarity from implementation depth.** A foundation course can explain Spark/Flink architecture and tool alternatives without requiring production operation of every named system.
3. **Bridge dependencies deliberately.** Prepare Git/project hygiene separately; defer Testcontainers practice until Docker; introduce storage models in lesson 8 and deepen them through consumption in lesson 11.
4. **Use one recurring dataset.** A synthetic orders/customers example is a proposed teaching device tying the layers together. It is not an existing 12-part lab package in the PDFs.
5. **Fill agenda-only gaps later.** FastAPI, practical Feast, and explicit idempotency/backfill/dynamic pipeline treatment are authoring backlog. Kafka delivery semantics require a technical check before reuse.
6. **Avoid unconditional claims and stale commands.** Provider market shares, throughput figures, blanket consistency statements, SQL dialect differences, and runtime/API behavior need checking during detailed lesson writing. This baseline deliberately does not reproduce them as guarantees.
7. **Publish a plan honestly.** Session outcomes, study hours, evidence targets, four milestones, and the capstone are proposed curriculum. The app should show these as planned, retain independent progress, and offer no unavailable lessons or AI-course quizzes under the new course.

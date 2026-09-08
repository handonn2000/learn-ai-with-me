# Data Engineering Foundation

Baseline v1 · 2026-09-06 · Course code: DEF · Slug: `data-engineering-foundation`

This is the original course baseline, curriculum, and roadmap. Status update 2026-09-08: Week 7 now has a bilingual Ingestion lesson, three browser simulations, a formative quiz, and practice prompts. Other detailed lessons and course assessments remain deferred. The baseline hour estimates have not been revalidated for the expanded all-slide-detail scope. The accompanying [source analysis](source-analysis.md) maps all 12 source PDFs to this plan and records coverage gaps.

**Authoring update · 2026-09-07:** the user has requested lessons 7–12 (Parts III and IV) first, with every substantive slide detail, documentary narration, visual interactions, and both Vietnamese and English. The [lesson design review](lesson-design/README.md) supersedes the later authoring order below for this work and expands those six lessons beyond the lighter foundation treatment. Its outlines are ready for review; implementation is pending.

## Baseline

**Purpose:** build enough software-engineering and data-platform understanding to design a small, reproducible pipeline from source records to useful analytical data, explain its tradeoffs, and plan its validation and recovery.

**Audience:** a beginner entering data engineering or a developer connecting familiar Python/SQL work to the complete data lifecycle. No previous AI course or machine-learning training is required.

**Entry readiness:** navigate files, install applications, use a text editor, and understand variables, conditions, and loops at an introductory level. Lessons 1–3 revisit shell, Python, and SQL; they are substantial modules rather than assumed professional experience. Mathematical prerequisites are arithmetic, sets, Boolean logic, aggregation, and time intervals; no calculus or advanced statistics is required.

**Optional preparation, outside the 12 weeks:** check terminal/editor access, learn basic Git commits, and establish a reproducible project folder. Git is an author-proposed bridge, not a dedicated topic in the supplied decks. Do not require a cloud account or a multi-node cluster to start. Tool versions, installation commands, and hardware requirements will be validated when the labs are authored.

**Pace:** 12 proposed weeks, one source deck per session, approximately **72–96 hours** total. These are planning estimates, not slide-provider durations. Read and recall first, reserve most remaining time for the future practice target, then review. Weeks 3, 9, 10, and 12 have larger workloads. You can spread each week over two calendar weeks without changing prerequisites. Continue spaced reviews after week 12.

**Scope boundary:** foundation-level design and small demonstrations. Kubernetes internals, enterprise cloud deployment, deep Spark/Flink tuning, production security certification, full Data Vault implementation, and ML model training are outside the required baseline. Tool comparisons remain conceptual unless a future lesson names a concrete exercise.

## Exit outcomes

By the end, you should be able to:

1. Package a parameterized Python data task with reproducible dependencies, explicit failures, and a documented shell entry point.
2. Model operational records with keys and relationships, query them with SQL, and explain a basic query plan.
3. Explain API requests, access controls, testing boundaries, and container-based service delivery.
4. Trace events through Kafka/CDC ingestion and select storage/modeling stages for raw, clean, and serving data.
5. Compare bounded Spark batch work with Flink event-time streaming, including late data, state, and recovery tradeoffs.
6. Design an analytical model with a declared grain and history policy, and explain where feature serving fits.
7. Plan an Airflow workflow with dependencies, validation gates, repeatable reruns, and a recovery procedure.

These are target outcomes. The roadmap does not certify that practical mastery or assessment content already exists.

## Curriculum and weekly roadmap

The lesson numbers preserve the source sequence. Prerequisites refer to prior sessions; learning outcomes and practice targets are author-proposed synthesis of the slides. Practice targets are briefs for later implementation, not generated labs.

| Week / ID | Session | Hours | Prerequisites | Outcome and future evidence |
|---|---|---:|---|---|
| 1 / b1 | Linux, shell & task automation | 4–6 | Entry readiness | Navigate and combine CLI tools; explain Bash, Make targets, and cron limits. Evidence: a parameterized file-processing task with a repeatable entry point. |
| 2 / b2 | Python for data tasks | 5–7 | b1 | Use isolated dependencies, collections, functions, file I/O, exceptions, context managers, and basic async reasoning. Evidence: a CLI that reads sample records and reports invalid input. |
| 3 / b3 | Databases, SQL & Python access | 7–9 | b2 | Explain keys, transactions, SQL groups, joins/aggregation, query plans, SQLite, and SQLAlchemy. Evidence: an operational schema and reconciled summary query. |
| 4 / b4 | Web APIs & service contracts | 5–7 | b2, b3 | Trace HTTP requests and compare REST, gRPC, WebSocket, SSE, and webhooks; explain security and health metrics. Evidence: an API contract and request/failure examples; a FastAPI implementation is a later supplement. |
| 5 / b5 | Verification, validation & testing | 5–7 | b2, b3, b4 | Select testing levels and use pytest concepts, fixtures, parametrization, mocking, coverage, and TDD. Evidence: a test strategy and cases for the data task. Defer Testcontainers execution until b6. |
| 6 / b6 | Containers & reproducible services | 5–7 | b1, b4, b5 | Explain VM/container differences, images, runtime, networks, volumes, registries, and Compose. Evidence: a future local service stack with persistent data and a clean-start check; revisit b5 integration tests. |
| 7 / b7 | Ingestion, Kafka & CDC | 6–8 | b3, b4, b6 | Identify sources, describe Kafka partitions/offsets/groups/retention, and explain CDC with Debezium. Evidence: an event contract and a replay/duplicate-handling experiment. |
| 8 / b8 | Storage, modeling & lakehouse layers | 5–7 | b3, b7 | Compare storage types, warehouse/lake/lakehouse, schema approaches, and governance. Evidence: a bronze/silver/gold design with ownership and retention decisions. |
| 9 / b9 | Batch transformation with Spark | 8–10 | b2, b3, b6, b8 | Explain distributed execution and DataFrame/RDD abstractions; recognize shuffle, skew, caching, and schema-change costs. Evidence: a small batch transformation and an execution-plan observation. |
| 10 / b10 | Stream transformation with Flink | 8–10 | b7, b8, b9 | Reason about event time, watermarks, windows, late data, keyed state, checkpoints, and backpressure. Evidence: an event timeline with expected window outputs and a recovery scenario. |
| 11 / b11 | Consumption & analytical models | 6–8 | b3, b8, b9, b10 | Declare fact grain, dimension/history policies, and compare OLAP and feature-serving needs. Evidence: an analytical model and business queries; feature-store design is an extension. |
| 12 / b12 | Orchestration & data quality | 8–10 | b5, b6, b9, b10, b11 | Plan Airflow dependencies, state, retries/resource limits, validation gates, and data contracts. Evidence: an end-to-end design with a failure drill and a rerun/backfill plan. |

## Four phases and exit milestones

### I. Engineering core — weeks 1–3

Connect shell automation, Python processing, and relational storage. Proposed milestone: explain and demonstrate how a sample file becomes queryable records, with a reproducible entry point and a known row count. Keep source data and derived output distinguishable.

### II. Reliable services — weeks 4–6

Define an API boundary, test its behavior, and package the components. Proposed milestone: a service contract, test plan, and reproducible local stack. Testing concepts precede containers; container-backed integration testing follows lesson 6.

### III. Data platform — weeks 7–8

Connect source events to governed storage. Proposed milestone: a source-to-storage diagram, event/schema contract, partition-key rationale, and raw/clean/serving boundaries. Explain replay and the consequences of duplicate events.

### IV. Processing, consumption & operation — weeks 9–12

Connect batch and stream transformations to analytical outputs and coordinated execution. Proposed milestone: a coherent pipeline design, measurable data-quality checks, and a recovery plan. Treat the first required implementation as batch-first; use a small streaming example to demonstrate time semantics without requiring every tool in one stack.

## Proposed capstone brief — for later lesson authoring

Use synthetic retail orders and customers as one recurring dataset. This keeps the learning focus on the pipeline rather than on twelve unrelated business examples. The slides contain retail/transaction examples, but this cross-course capstone is our proposal.

**Core path:** file/API or operational database → preserved raw records → batch-cleaned records → dimensional serving tables → analytical queries. Describe the ingestion contract, transformation rules, ownership, and freshness expectation. Introduce orchestration and quality gates as those concepts become available.

**Streaming extension:** publish order events, compute an event-time aggregate, explain late-event handling, and compare it with a reconciled batch result. A feature-store sketch is optional. An Airflow DAG can coordinate finite tasks or submit external jobs; the roadmap does not make Airflow the per-event stream processor.

**Proposed acceptance evidence:**

- Clean-start instructions reproduce the chosen small environment.
- Input/output counts and one business aggregate reconcile against a small fixture.
- Reprocessing the same input does not duplicate the intended result.
- Invalid records trigger a documented quarantine or stop decision.
- A dimension change follows an explicit history policy.
- A failed task can be recovered without blindly rerunning unrelated steps.
- A diagram and short runbook explain ownership, dependencies, and tradeoffs.

No capstone implementation, worked solution, quiz bank, scoring rubric, or certification is created in this phase.

## Later authoring order

1. Confirm the baseline pace and choose a small dataset; pin tool versions when writing actual labs.
2. Write lessons 1–3 and validate the reusable file/Python/database example.
3. Add API and testing material, then containers; revisit container-based tests after lesson 6.
4. Add ingestion and storage; resolve the source coverage caveats before teaching delivery guarantees.
5. Add Spark and Flink with bounded, inspectable examples; avoid making advanced tuning a beginner prerequisite.
6. Extend modeling in lesson 11 and add orchestration/quality in lesson 12. Develop the agenda-only material explicitly.
7. Add assessments only after the corresponding lessons exist. Until then the app shows planned milestones and manual progress, with no active quiz/test links.

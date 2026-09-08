import type { VI } from './curriculum.vi';

export const EN = {
  parts: {
    "engineering-core": {
      no: "PART I",
      title: "Engineering Core",
      en: "Nền tảng kỹ thuật",
      range: "Weeks 1–3",
      testDesc: "Target: a repeatable Python task that loads records into tables and reconciles query results."
    },
    "reliable-services": {
      no: "PART II",
      title: "Reliable Services",
      en: "Dịch vụ đáng tin cậy",
      range: "Weeks 4–6",
      testDesc: "Target: an API contract, a test plan, and a reproducible container-based service environment."
    },
    "data-platform": {
      no: "PART III",
      title: "Data Platform",
      en: "Nền tảng dữ liệu",
      range: "Weeks 7–8",
      testDesc: "Target: a source-to-storage diagram, an event contract, and explicit raw / clean / serving boundaries."
    },
    "processing-and-operation": {
      no: "PART IV",
      title: "Processing, Consumption & Operation",
      en: "Xử lý, phục vụ & vận hành",
      range: "Weeks 9–12",
      testDesc: "Target: an end-to-end pipeline design, data-quality checks, and a recovery plan for a failed task."
    }
  },
  sessions: {
    b1: {
      title: "Session 1 · Linux, Shell & Task Automation",
      en: "Linux, shell & tự động hóa",
      hours: "~4–6h",
      topics: "GNU/Linux and filesystems · CLI tools, pipes and text processing · Bash · compilation and Makefiles · cron and timer-based scheduling limits.",
      math: "Basic folder and editor skills; review paths, variables, conditions, and execution order.",
      outcome: "You can connect commands into a task with explicit inputs, outputs, and a schedule.",
      practice: "Planned: outline a parameterized file task, a Make target, and a way to recognize a failed run."
    },
    b2: {
      title: "Session 2 · Python for Data Tasks",
      en: "Python cho tác vụ dữ liệu",
      hours: "~5–7h",
      topics: "Isolated environments: virtualenv, Poetry, uv · collections and functions · exceptions, context managers · file I/O · argparse · standard library · sync/async.",
      math: "Review variables, loops, functions, sets, and key–value pairs; build on session 1 file operations.",
      outcome: "You can organize a data script with isolated dependencies, parameters, and explicit error behavior.",
      practice: "Planned: a CLI that reads sample records, writes results, and reports invalid data; compare one sync/async scenario."
    },
    b3: {
      title: "Session 3 · Databases, SQL & Python Access",
      en: "Database, SQL & truy cập từ Python",
      hours: "~7–9h",
      topics: "Database/DBMS · keys and relationships · SQL/NoSQL, ACID/BASE · PostgreSQL/WAL · SQL groups, JOINs, aggregation, transactions · indexes and query plans · SQLite · SQLAlchemy Core/ORM.",
      math: "Sets, relations, Boolean logic, and aggregation; be able to read Python functions and file-handling code.",
      outcome: "You can model records, query their relationships correctly, and explain a simple execution plan.",
      practice: "Planned: an orders/customers schema, an aggregate query with reconciled results, and a query-plan observation."
    },
    b4: {
      title: "Session 4 · Web APIs & Service Contracts",
      en: "Web API & hợp đồng dịch vụ",
      hours: "~5–7h",
      topics: "HTTP requests/responses, DNS and transport · REST, gRPC, WebSocket, SSE, webhooks · AAA, Basic Auth, JWT, OAuth · health checks · metrics and load testing.",
      math: "Python, data records, and JSON; review error rates, latency, and requests per second.",
      outcome: "You can read an HTTP exchange and choose a communication pattern, access controls, and health signals.",
      practice: "Planned: an API contract with successful and failed request examples. A FastAPI implementation will be added during lesson authoring."
    },
    b5: {
      title: "Session 5 · Verification, Validation & Testing",
      en: "Verification, validation & kiểm thử",
      hours: "~5–7h",
      topics: "V-model · testing levels and methods · pytest: fixtures, markers, parametrization, mocks · Testcontainers · tox · coverage · TDD.",
      math: "Python functions, databases, and API contracts; distinguish inputs, expected outputs, and dependency failures.",
      outcome: "You can choose testing boundaries and describe evidence for both success and failure paths.",
      practice: "Planned: a test strategy for the data task. Learn the purpose of Testcontainers here and run it after session 6."
    },
    b6: {
      title: "Session 6 · Containers & Reproducible Services",
      en: "Container & dịch vụ có thể tái tạo",
      hours: "~5–7h",
      topics: "VMs and containers · images/runtimes, namespaces/cgroups · Docker and alternatives · build/debug · volumes, networks · registries · Docker Compose · image optimization.",
      math: "Shell, processes, network ports, and API contracts; revisit session 5 integration testing.",
      outcome: "You can explain service packaging, data persistence, and component networking in a local environment.",
      practice: "Planned: design a small Compose stack, check a clean start, and run container-backed tests."
    },
    b7: {
      title: "Session 7 · Ingestion, Kafka & CDC",
      en: "Ingestion, Kafka & CDC",
      hours: "~6–8h",
      topics: "Source systems, files/logs, OLTP/OLAP · timestamp/trigger/log-based CDC · Kafka ecosystem · topics, partitions, offsets, producers, consumer groups · replication, delivery, retention · Debezium.",
      math: "Transactions, services, and containers; review event order, partition keys, and processing rates.",
      outcome: "You can trace a source change to a consumer and explain loss/duplicate risks during reprocessing.",
      practice: "Planned: an event contract, a partition-key rationale, and a replay experiment. Delivery-guarantee conditions will be verified during lesson authoring."
    },
    b8: {
      title: "Session 8 · Storage, Modeling & Lakehouse Layers",
      en: "Storage, mô hình & lakehouse",
      hours: "~5–7h",
      topics: "File/block/object storage · caches, HDFS · warehouses and conceptual/logical/physical models · star/snowflake · lakes, swamps, governance · lakehouses · bronze/silver/gold.",
      math: "Schemas, keys, and event sources; review capacity, retention, raw records, and derived data.",
      outcome: "You can choose storage layers and explain where data lives, who owns it, and when it is usable.",
      practice: "Planned: a bronze/silver/gold diagram with schemas, ownership, retention, and quality rules."
    },
    b9: {
      title: "Session 9 · Batch Transformation with Spark",
      en: "Xử lý batch với Spark",
      hours: "~8–10h",
      topics: "Drivers/executors, partitions, jobs/stages/tasks · lazy evaluation · RDDs/DataFrames · serialization, cache/persist · shuffle, skew, cardinality, schema evolution · Catalyst/Tungsten/AQE · Spark UI and compaction.",
      math: "Python, SQL, and storage models; review partitioning, aggregation, and data-movement costs.",
      outcome: "You can explain a batch job and recognize shuffle costs, skewed data, or unnecessary reads.",
      practice: "Planned: a small DataFrame transformation with reconciled output and an execution-plan observation; advanced tuning is an extension."
    },
    b10: {
      title: "Session 10 · Stream Transformation with Flink",
      en: "Xử lý stream với Flink",
      hours: "~8–10h",
      topics: "JobManager/TaskManager, slots, parallelism · event time and watermarks · windows, triggers, late data · DataStream/Table/SQL · state, checkpoints, recovery · chaining, backpressure · deployment modes.",
      math: "Kafka, partitioning, and distributed processing; review timestamps, intervals, and per-key state.",
      outcome: "You can predict window results for out-of-order events and explain the role of state and checkpoints.",
      practice: "Planned: an event timeline, expected window results, a late-data policy, and a recovery scenario."
    },
    b11: {
      title: "Session 11 · Consumption & Analytical Models",
      en: "Consumption & mô hình phân tích",
      hours: "~6–8h",
      topics: "ER/3NF and dimensional modeling · facts/dimensions, star/snowflake · SCD · Data Vault · Inmon/Kimball · ClickHouse/Pinot · feature stores, offline/online access, and training-serving skew.",
      math: "SQL, storage layers, and batch/stream processing; review record grain, aggregation, and change history.",
      outcome: "You can design a model for business questions and choose a dimension-history policy.",
      practice: "Planned: fact grain, dimensions, an SCD policy, and business queries. Feature-store design is an extension; a Feast lab will be written later."
    },
    b12: {
      title: "Session 12 · Orchestration & Data Quality",
      en: "Orchestration & chất lượng dữ liệu",
      hours: "~8–10h",
      topics: "Cron and dependency coordination · Airflow DAGs/runs/tasks, operators, sensors, XCom · connections, executors, concurrency, pools · monitoring · quality rules, circuit breakers, data contracts · GX/Deequ/DataHub.",
      math: "Pipeline stages and testing; review directed acyclic graphs, task states, and quality thresholds.",
      outcome: "You can design a workflow that blocks bad data and describe reruns and recovery after a task fails.",
      practice: "Planned: an end-to-end pipeline design and failure drill. Idempotency/backfill need supplemental explanation during lesson authoring."
    }
  }
} satisfies typeof VI;

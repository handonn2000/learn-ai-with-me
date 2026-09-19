# DEF b12 — source coverage ledger

Date: 2026-09-16. Prepared by the primary author from all 63 source-page extracts, source-image inspection, and independent reviewer findings. This is an evidence map, not a claim of deployed Airflow/provider integration. See [quality review](b12-quality.md), [source corrections and references](b12-source-audit.md), and [validation limits](b12-validation.md).

| Page | Source content | Implemented location | Treatment |
| --- | --- | --- | --- |
| 1 | EDAI-1-K9 / Data Engineering / Orchestration | `b12/hero` | Administrative/divider content accounted for; instructional topics developed at mapped location. |
| 2 | Learn / About Pipeline Orchestration01/ / 02/ Cron Job | `b12/navigation` | Administrative/divider content accounted for; instructional topics developed at mapped location. |
| 3 | Pipeline / Orchestratio / n | `b12/ch01` | Administrative/divider content accounted for; instructional topics developed at mapped location. |
| 4 | A Typical Daily Data Pipeline / A simple data pipeline may contain three main steps: / 1. Extract data from source systems | `b12/ch01` | Covered in prose/table/diagram, with fixtures where relevant. |
| 5 | The Naive Scheduling Approach / A common beginner solution: / ● 2:00 AM => Extract data | `b12/ch01` | Covered in prose/table/diagram, with fixtures where relevant. |
| 6 | Failure Scenario: Delayed Upstream Task / When Time-Based Scheduling Breaks / Scenario: | `b12/ch01` | Covered in prose/table/diagram, with fixtures where relevant. |
| 7 | The Core Problem: Coordination / Data pipelines need coordination across tasks. / A pipeline system must know: | `b12/ch01` | Covered in prose/table/diagram, with fixtures where relevant. |
| 8 | Pipeline Orchestration / Definition: / Pipeline Orchestration is the system responsible for coordinating, scheduling, and managing | `b12/ch01` | Covered in prose/table/diagram, with fixtures where relevant. |
| 9 | Benefit 1: Dependency Management / Orchestration ensures tasks run in the correct order. / Extract Orders | `b12/ch01` | Covered in prose/table/diagram, with fixtures where relevant. |
| 10 | Benefit 1: Dependency Management (cont) / Orchestration can run independent tasks at the same time. / Extract Customers | `b12/ch01` | Covered in prose/table/diagram, with fixtures where relevant. |
| 11 | Benefit 2: Automated Scheduling & Triggering / Orchestration can start workflows automatically based on different trigger types. / Scheduling starts the workflow. | `b12/ch02` | Covered in prose/table/diagram, with fixtures where relevant. |
| 12 | Benefit 3: State Tracking / An orchestrator tracks the state of every task. / Common states: | `b12/ch02` | Covered in prose/table/diagram, with fixtures where relevant. |
| 13 | Benefit 4: Failure Handling / When a task fails, orchestration can: / ● stop downstream tasks | `b12/ch02` | Covered in prose/table/diagram, with fixtures where relevant. |
| 14 | Benefit 5: Resource Coordination / Orchestration helps protect shared systems. / Example problem: | `b12/ch02` | Covered in prose/table/diagram, with fixtures where relevant. |
| 15 | Beyond The / Cron Job / 01/ | `b12/ch03` | Agenda-only bridges labeled; intervals/idempotency/dynamic mapping developed. |
| 16 | What is a Cronjob? / A cronjob is a time-based scheduler that runs a script automatically at a specified interval. / ● It is useful when a task only needs a timer. | `b12/ch03` | Five-field cron anatomy, ranges, wildcard and dialect caveat restored from source visual. |
| 17 | Cronjob’s Limitations for Data Pipelines / Cron Job scheduling often lacks advanced orchestration features. / Limitations: | `b12/ch03` | Covered in prose/table/diagram, with fixtures where relevant. |
| 18 | Airflow 01/ / 02/ Airflow Architecture / 03/ Operators & Data Passing | `b12/ch04` | Administrative/divider content accounted for; instructional topics developed at mapped location. |
| 19 | What Is Apache Airflow? / Apache Airflow is a workflow orchestration platform. / It helps data teams: | `b12/ch04` | Covered in prose/table/diagram, with fixtures where relevant. |
| 20 | What Airflow Is Not / Airflow is not: / ● a database | `b12/ch04` | Covered in prose/table/diagram, with fixtures where relevant. |
| 21 | Why Airflow Uses DAGs / A workflow must describe: / ● which tasks exist | `b12/ch04` | Covered in prose/table/diagram, with fixtures where relevant. |
| 22 | DAG, DAG Run, Task Instance / One DAG can have many DAG Runs. / Each DAG Run contains many Task Instances. | `b12/ch04` | Covered in prose/table/diagram, with fixtures where relevant. |
| 23 | Airflow Architecture / 1. DAG Files: / ● Define workflow structure as Python code. | `b12/ch04` | Covered in prose/table/diagram, with fixtures where relevant. |
| 24 | Airflow Component Interaction / Each component has a single responsibility. / The Metadata Database is the central source | `b12/ch04` | Historical DB-centric diagram distinguished from Airflow 3 Execution API. |
| 25 | Airflow Operators / Each task is defined as an Operator, and Airflow provides a wide range of built-in Operators for / various tasks, such as running Bash commands, Python scripts, or interacting with databases | `b12/ch05` | Readable source-image snippets; FileSensor presence and TaskFlow corrected; Docker environment made explicit. |
| 26 | Popular Airflow Operators / Some common Airflow Operators: / Operator What it does Example use case | `b12/ch05` | All seven roles retained; modern SQLExecuteQueryOperator explained. |
| 27 | Sensors: Waiting for Conditions / A Sensor is a special type of Operator that waits for a condition. / Examples: | `b12/ch05` | Covered in prose/table/diagram, with fixtures where relevant. |
| 28 | Why Task Communication Is Needed / One task may produce information another task needs. / Examples: | `b12/ch05` | Covered in prose/table/diagram, with fixtures where relevant. |
| 29 | What Is XCom? / XCom (short for cross-communication) is Airflow's built-in mechanism for tasks to push and / pull small values between each other. | `b12/ch05` | Default backend small-value boundary and shared model URI explained. |
| 30 | Airflow / Administration / & Scaling | `b12/ch06` | Administrative/divider content accounted for; instructional topics developed at mapped location. |
| 31 | Variables & Connections: No Hardcoding / Hardcoded in DAG file / Password = abc123“ host= “prod-db” Variables | `b12/ch06` | No hardcoded credentials; secure storage still needs configuration. |
| 32 | Executors: Choosing the Execution Mode / Airflow supports multiple execution modes. / Even with the right executor, running too many tasks at once can break shared systems. That is why we need concurrency control. | `b12/ch06` | SequentialExecutor explicitly historical/removed. |
| 33 | Why Concurrency Control Matters / ● By default, we may want tasks to run as fast as possible. / ● But too much parallelism can overload shared systems. | `b12/ch06` | Covered in prose/table/diagram, with fixtures where relevant. |
| 34 | Three Levels of Concurrency / Global level - parallelism setting / Max tasks running across the entire Airflow system at once. Set in airflow.cfg | `b12/ch06` | max_active_runs spelling and level corrected; pool is logical quota. |
| 35 | Global-Level Control: parallelism / parallelism controls the maximum number of task instances that can run across the entire / Airflow environment. | `b12/ch06` | parallelism qualified per scheduler; single-scheduler fixture. |
| 36 | DAG-Level Control: max_active_runs / max_active_runs limits how many DAG Runs of the same DAG can be active at the same time. / It answers: | `b12/ch06` | Covered in prose/table/diagram, with fixtures where relevant. |
| 37 | Resource-Level Control: Pools / Pools define the number of worker slots for each pool / Example: | `b12/ch06` | Pool slots distinct from physical workers; weighted slots noted. |
| 38 | Monitoring: Knowing Before Someone Tell You / Alerts / Email or Slack on failure or retry | `b12/ch06` | Covered in prose/table/diagram, with fixtures where relevant. |
| 39 | Data / Validation / Why Bad Data is Dangerous01/ | `b12/ch07` | Administrative/divider content accounted for; instructional topics developed at mapped location. |
| 40 | Why Bad Data Is Dangerous / ● According to Gartner, bad data quality costs organizations an average of $11.8M / per year | `b12/ch07` | PHE corrected; Gartner/Unity remain visibly unverified claims. |
| 41 | What Is Bad Data? / Data is bad when it is not fit for its intended use. / Common examples: | `b12/ch07` | Covered in prose/table/diagram, with fixtures where relevant. |
| 42 | Six Data Quality Dimensions / How do we know if the data quality is high? / Dimension Description Example | `b12/ch07` | Covered in prose/table/diagram, with fixtures where relevant. |
| 43 | From Quality Dimensions to Validation Rules / Data validation means turning quality expectations into / executable checks. | `b12/ch07` | Rules and 30% threshold preserved with business-contract caveats. |
| 44 | Data Quality Improvement Lifecycle / Business case / Data discovery | `b12/ch08` | Covered in prose/table/diagram, with fixtures where relevant. |
| 45 | Example of The Life Cycle (1) / ● Business case: A retail company. / ● Data discovery & profiling: | `b12/ch08` | All CRM findings, percentages, phone examples and duplicate heuristics preserved with caveats. |
| 46 | Example of the Life Cycle (2) / ● Monitoring: / A data quality dashboard is set up: | `b12/ch08` | Covered in prose/table/diagram, with fixtures where relevant. |
| 47 | Data Quality Monitoring Requirements / A successful data quality monitoring strategy must ensure 4 monitoring dimensions: / ● Detect quality issues at multiple levels: tables, rows and columns | `b12/ch08` | Covered in prose/table/diagram, with fixtures where relevant. |
| 48 | Approaches to Detect Data Quality Issues / Common approaches: / ● Manual method: | `b12/ch08` | Covered in prose/table/diagram, with fixtures where relevant. |
| 49 | Why Validation Belongs Inside Orchestration / Validation should not be separate from the pipeline. / A validation task should decide: | `b12/ch09` | Covered in prose/table/diagram, with fixtures where relevant. |
| 50 | The Problem: Bad Data Flowing Downstream / You run a data quality check. It fails. But your pipeline keeps running anyway - because nobody / told it to stop. | `b12/ch09` | Covered in prose/table/diagram, with fixtures where relevant. |
| 51 | The Circuit Breaker Pattern / ● In electrical systems, a circuit breaker cuts power when a fault is detected - before the / fault damages the rest of the circuit. | `b12/ch09` | Covered in prose/table/diagram, with fixtures where relevant. |
| 52 | Circuit Breaker in Airflow / A circuit breaker workflow usually contains: / But what if we could prevent bad data from being produced in the first place? That's what data contracts are for. | `b12/ch09` | Fail/BranchPythonOperator/TaskFlow branch/alert/downstream gating explained. |
| 53 | The Problem Data Contracts Solve / Downstream pipelines break when upstream data changes unexpectedly. / A data contract makes this agreement explicit and enforceable. | `b12/ch10` | Covered in prose/table/diagram, with fixtures where relevant. |
| 54 | Data Contracts / ● A data contract is a formal agreement between the team that produces data and the team / that consumes it. | `b12/ch10` | Covered in prose/table/diagram, with fixtures where relevant. |
| 55 | What a Data Contract Defines / Property Example / Schema Column user_id must exist and be type INTEGER | `b12/ch10` | All contract properties and numerical bounds included; JSON labeled illustrative. |
| 56 | Validation Frameworks / Now let’s look at tools and frameworks that help implement these ideas. / Common validation tools: | `b12/ch10` | Covered in prose/table/diagram, with fixtures where relevant. |
| 57 | Great Expectations (GX) / GX is a data validation framework that helps teams define and run data quality rules. / In GX, a validation rule is called an Expectation. | `b12/ch10` | Expectation families and suites/backends retained; legacy and current API styles distinguished. |
| 58 | GX in Airflow: Validation as a Pipeline Gate / GX can be used inside an Airflow DAG as a validation step. / Example workflow: | `b12/ch10` | GX validation success must govern Airflow execution. |
| 59 | Deequ / Deequ is a data quality library built for Apache Spark. / It is well suited for: | `b12/ch10` | Profiling/analyzing/verification and strict >99% preserved. |
| 60 | Deequ: Advanced Features / GX and Deequ help validate data inside pipelines. / But in large data platforms, teams also need metadata, ownership, and lineage visibility. | `b12/ch10` | Anomaly detection and valid incremental-state reuse retained. |
| 61 | DataHub / DataHub helps teams manage metadata across the data platform. [Demo] / It can track: | `b12/ch10` | Covered in prose/table/diagram, with fixtures where relevant. |
| 62 | fullstackdatascience.com / References / ● Data Quality Fundamentals | `reviews/b12-source-audit.md` | Administrative/divider content accounted for; instructional topics developed at mapped location. |
| 63 | Thank you | `b12/summary` | Administrative/divider content accounted for; instructional topics developed at mapped location. |

## Review findings closed

- Cron field anatomy was visible only in the PDF image, not its extracted text; chapter 03 now includes it in both locales.
- Docker example now separates daemon URL from registry-login connection and explicitly labels environment setup.
- Independent reviewer requested sourced bridges/provenance; these are recorded in the authoring audit according to the repository convention against inline source citations in lesson prose.

## Limits

Exact pinned provider API source retrieval and a deployed Airflow runtime were not verified. The source’s Docker image availability is not asserted. Gartner/Unity dollar claims remain unverified and are not taught as confirmed direct-loss figures.

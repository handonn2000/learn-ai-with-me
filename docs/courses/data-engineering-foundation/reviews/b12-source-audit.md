# Lesson 12 source and correction audit

Date: 2026-09-16. Course: Data Engineering Foundation. Route: `/courses/data-engineering-foundation/lessons/b12`.

Source: `/Users/handonn/Workplace/AIDE-01/slides/Lession_12_Data_Engineering_Orchestration_Layer.pdf` (63 pages; EDAI-1-K9, instructor Quan Dang, fullstackdatascience.com). The original PDF is not copied into this repository. Text from all pages was extracted using pypdf; selected diagrams/code were rendered using pypdfium2. Independent quality reviewer inspected all 63 rendered pages. Page 62 lists *Data Quality Fundamentals*, *Designing Data-Intensive Applications, 2nd Edition*, and *Orchestrating AI*; these references are retained here as source-deck references, not claims that the books were read.

## Written outline used for implementation

The accepted 10-chapter design in `../lesson-design/storyboards.en.md` / `.vi.md` is the authoring outline. Implemented structure:

1. Scheduling race (02:00/03:00/03:20/04:00), dependency safety, independent extraction.
2. Trigger types, task states, bounded recovery and resource coordination.
3. Cron anatomy/limits; labeled bridges for idempotency, intervals, reruns/backfills, dynamic pipelines.
4. DAG/Run/Task/Instance; older architecture and Airflow 3 execution boundary.
5. Operators, TaskFlow, sensors, isolated tasks, small XCom values; readable source-image code.
6. Variables/Connections/secrets; executors; scheduler, run and pool limits; monitoring.
7. Fitness for use; qualified historical claims; six quality dimensions and business rules.
8. CRM profiling, rules, weekly monitoring and upstream repair; detection methods.
9. Fail/branch quality gate, safe trigger rules, alerts, quarantine, recovery and affected consumers.
10. Contracts, GX, Deequ, dbt, Soda and DataHub; summary, checks, ten-question quiz and practice.

## Corrections and supporting primary references

| Pages | Lesson location | Treatment and evidence |
| --- | --- | --- |
| 15–17 | `#ch03` | Agenda-only idempotency/backfill/dynamic pipelines are labeled supplements. Stable intervals and partition replacement are teaching fixtures. [Airflow best practices](https://airflow.apache.org/docs/apache-airflow/3.0.0/best-practices.html), [DAG runs and intervals](https://airflow.apache.org/docs/apache-airflow/3.1.2/core-concepts/dag-run.html), [dynamic mapping](https://airflow.apache.org/docs/apache-airflow/3.1.0/authoring-and-scheduling/dynamic-task-mapping.html). Conventional Unix cron has five time fields plus command; scheduler dialects differ. |
| 23–24 | `#ch04` | Older direct metadata-DB diagram is described as historical. Airflow 3 task code uses the Task SDK/Execution API boundary; DAG processor, scheduler, executor, worker, metadata, API/UI and triggerer roles are separated. [3.1.0 architecture](https://airflow.apache.org/docs/apache-airflow/3.1.0/core-concepts/overview.html), [DAG serialization](https://airflow.apache.org/docs/apache-airflow/3.1.0/administration-and-deployment/dag-serialization.html). |
| 25 | `#ch05` | Source image labels `@task` as PythonOperator and says FileSensor waits for disappearance. Distinguish TaskFlow from explicit PythonOperator; FileSensor waits for presence. Reconstruct Bash `echo 1`, TaskFlow, file path and Docker mount/working-directory/command semantics. [FileSensor docs](https://airflow.apache.org/docs/apache-airflow-providers-standard/stable/sensors/file.html). |
| 25–26 | `#ch05` code | Examples target Python 3.11 / Airflow 3.1.0 / standard provider 1.9.0; Docker provider 4.4.4. These versions exist, but the exact versioned provider source endpoints could not be retrieved during review. Provider API behavior checked against available official stable documentation. No claim that a full Airflow/provider environment was executed. Docker `auto_remove` is a string; explicit local `docker_url` and registry `docker_conn_id` replace the source’s unauthenticated example daemon endpoint. [DockerOperator API](https://airflow.apache.org/docs/apache-airflow-providers-docker/stable/_api/airflow/providers/docker/operators/docker/index.html). Source image tag retained for illustration, availability not asserted. `SQLExecuteQueryOperator` represents modern SQL execution rather than treating historical PostgresOperator as universally available. |
| 28–29 | `#ch05` | Default XCom backend stores small values; an object-storage backend changes that boundary. A local `/models/v2` path is not automatically shared; show an accessible model URI. [Airflow 3.1.0 XComs](https://airflow.apache.org/docs/apache-airflow/3.1.0/core-concepts/xcoms.html). |
| 31–32 | `#ch06` | Variables/Connections still need access controls and secrets handling. SequentialExecutor is historical, removed in Airflow 3.0. [3.1.0 release notes](https://airflow.apache.org/docs/apache-airflow/3.1.0/release_notes.html), [executor concepts](https://airflow.apache.org/docs/apache-airflow/3.1.0/core-concepts/executor/index.html). |
| 34–37 | `#ch06` | Correct `max_activate_runs` to `max_active_runs`. `parallelism` is per scheduler in the selected docs; explicitly assume one scheduler. A pool is a logical resource quota, not a set of physical workers. [3.1.0 configuration](https://airflow.apache.org/docs/apache-airflow/3.1.0/configurations-ref.html#parallelism), [pools](https://airflow.apache.org/docs/apache-airflow/3.1.0/administration-and-deployment/pools.html). |
| 40 | `#ch07` | PHE: 15,841 cases delayed in daily reporting/contact tracing; people received test results normally. Not permanent loss of 16,000 test results. [PHE statement, 4 October 2020](https://www.gov.uk/government/news/phe-statement-on-delayed-reporting-of-covid-19-cases). Gartner $11.8M and Unity $5B remain visibly qualified as insufficiently sourced claims from the deck, not taught as established direct-loss costs. |
| 42–48 | `#ch07`–`#ch08` | Distinguish accuracy from syntactic validity. Rules are business-specific: free orders, market phone formats, future timestamps and seasonal count baselines need agreed scope. Preserve CRM 15%/10% and 5% alert threshold, with explicit denominators and duplicate-review caveats. |
| 49–52 | `#ch09` | Logging failure is insufficient. Raise/branch must govern publication; skipped is not failed; an all_done leaf can obscure run-level failure. Small Python fixture shows explicit gate dependency. [DAG Run status semantics](https://airflow.apache.org/docs/apache-airflow/3.1.2/core-concepts/dag-run.html), [Airflow tasks](https://airflow.apache.org/docs/apache-airflow/3.1.0/core-concepts/tasks.html). |
| 53–58 | `#ch10` | Contract JSON is illustrative, not an executable DataHub/GX schema. Expectation suite is the rule component of a broader agreement. Use returned validation `success` to control execution; distinguish legacy expect_* names from current Expectation classes. [GX validation definition](https://docs.greatexpectations.io/docs/core/run_validations/run_a_validation_definition/), [validation success](https://docs.greatexpectations.io/docs/reference/api/core/expectationsuitevalidationresult_class/). |
| 59–61 | `#ch10` | Preserve Deequ profile/analyze/verify, strict completeness >99%, anomaly metrics and incremental states. Explain DataHub metadata/lineage rather than treating catalog as automatic row-level validation. [Deequ project](https://github.com/awslabs/deequ), [DataHub project](https://github.com/datahub-project/datahub). |

## Authored fixtures and execution limits

- Scheduler: delayed extraction with 20-minute transform and 20-minute load; all steps otherwise succeed. Loop is illustrative, with a persistent HTML trace and a labeled fresh illustration cycle.
- Interval model: three rows per date, replacement rather than append; no real database writes or concurrency guarantees.
- Pool: two runs of 100 independent tasks, one slot and one tick per task, one scheduler, sufficient workers, no additional DAG task cap. All UI limit combinations are tested to completion.
- Gate: three synthetic orders, fixed check time, seven fault types, explicit evidence and snapshot-bound publication. Rule execution is JavaScript, not GX or Deequ. No external alerts are sent.
- Code declarations and complete tiny TaskFlow gate are readable illustrations. Python syntax and extracted gate function behavior are checked locally; no Airflow, Docker daemon, provider, GX or Deequ service was installed or invoked.
- Source citations live in this authoring audit per the repository’s lesson-voice convention, instead of interrupting learner-facing prose.

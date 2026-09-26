# DEF b9 — Spark / Batch: quality and fidelity

Reviewed 2026-09-26 by independent `quality_b9` reviewer. Final content/code/static-accessibility verdict: **PASS**. VI/EN fidelity: **ĐẠT**, pairs hash `e4404623c1aff2e8`. Source PDF: 90 pages, extracted text plus visual inspection of substantive diagrams/code. Reviewer did not edit the lesson.

## Coverage and corrections

All ten curriculum units are covered; no required source omission remains. Original page mappings are in [slide-coverage.csv](../lesson-design/slide-coverage.csv). Covers, agendas and closing/reference pages are organizational, not separate teaching objectives.

| Unit | Implemented explanation / correction |
|---|---|
| 1. Execution architecture | Driver, executors, jobs/stages/tasks; transformation versus action. |
| 2. RDD and DataFrame | Schema, lazy evaluation, projection/filter/aggregate and result reconciliation. |
| 3. Serialization | Java/Kryo tradeoffs; Kryo configuration has a separate SparkContext lifecycle. |
| 4. Persistence | Five JVM storage levels are distinguished from PySpark defaults; capacity and reuse matter. |
| 5. Skew and schema | Salting conserves 730 million rows; schema inference and explicit readers. |
| 6. Catalyst | Logical/physical plans, pushdown and optimization boundaries. |
| 7. Tungsten / AQE | Memory/code generation versus runtime adaptive planning; not blanket guarantees. |
| 8. Tuning | Partitions, shuffle, memory and spill tradeoffs. |
| 9. UI / allocation | Evidence-led troubleshooting and dynamic allocation prerequisites. |
| 10. Compaction | Small-file rewrite tradeoffs; core Spark versus table-format operations. |

## Evidence

Filter placement routes 6 versus 4 rows with the same VN=150/US=100 output; 60 cache combinations conserve four partitions; three salting configurations preserve 730 million rows. Python snippets pass AST parsing; the runnable fixture declares Python/Java/PySpark requirements. Reader snippets now create their own session after the standalone fixture stops its session.

Browser/mobile/theme/keyboard/storage/presentation evidence was subsequently collected by the parent in [browser checks](b9-b11-browser-checks.json). CSS mobile wrapping was corrected after static review. Runtime cluster execution was not performed; simulations establish only their documented teaching invariants. Optional additional diagrams or example metrics were suggestions, not blocking omissions.

## Authoritative correction references

- https://spark.apache.org/docs/3.5.7/rdd-programming-guide.html#rdd-persistence
- https://spark.apache.org/docs/3.5.7/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.cache.html
- https://spark.apache.org/docs/3.5.7/tuning.html#data-serialization
- https://spark.apache.org/docs/3.5.7/sql-performance-tuning.html#adaptive-query-execution
- https://spark.apache.org/docs/3.5.7/configuration.html#dynamic-allocation
- https://docs.delta.io/optimizations-oss/#compaction-bin-packing

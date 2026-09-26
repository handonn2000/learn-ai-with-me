# DEF b10 — Flink / Stream: quality and fidelity

Reviewed 2026-09-26 by independent `quality_b10` reviewer. Final content/code/static-accessibility verdict: **PASS**. VI/EN fidelity: **ĐẠT**, pairs hash `13cd5d514fd9681e`. Source PDF: 75 pages, extracted text plus visual inspection of substantive diagrams/code. Reviewer did not edit the lesson.

## Coverage and corrections

All ten curriculum units are covered; no required source omission remains. Original page mappings are in [slide-coverage.csv](../lesson-design/slide-coverage.csv). Covers, agendas and closing/reference pages are organizational, not separate teaching objectives.

| Unit | Implemented explanation / correction |
|---|---|
| 1. Architecture | Bounded/unbounded processing, runtime roles and dataflow. |
| 2. Time / watermarks | Event versus processing time; simplified seconds model versus real millisecond watermark emission. |
| 3. Windows | Tumbling/sliding/session concepts and default event-time triggering. |
| 4. Late data | First result, update, cleanup and side-output/drop policy are separate. |
| 5. APIs | DataStream/Table/SQL and ProcessFunction; keyed state AND timers explicitly require a keyed stream. |
| 6. State | Operator versus keyed state, state backend and serialization. |
| 7. Checkpoints | Consistent state/offset recovery; external exactly-once requires compatible source/sink semantics. |
| 8. Chaining | Operator chaining and network-boundary tradeoffs. |
| 9. Backpressure | Finite queue, downstream service rate and source waiting. |
| 10. Deployment | Session/application deployment and resource/lifecycle tradeoffs. |

## Evidence

18 window configurations, four recovery configurations and four queue rates pass. Default watermark trace is 7,35,53,60,60,80,80. Completed checkpoint plus idempotent sink gives 60; blind replay can produce 90 or 120. B10-C01 (keyed timer requirement) was fixed in both languages and independently re-reviewed. Computed-count labels clarify retained trace output after state cleanup.

Browser/mobile/theme/keyboard/storage/presentation evidence was subsequently collected by the parent in [browser checks](b9-b11-browser-checks.json). CSS mobile wrapping was corrected after static review. Runtime cluster execution was not performed; simulations establish only their documented teaching invariants. Optional additional diagrams or example metrics were suggestions, not blocking omissions.

## Authoritative correction references

- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/operators/process_function/
- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/event-time/generating_watermarks/
- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/datastream/operators/windows/
- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/dev/table/sql/queries/window-tvf/
- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/learn-flink/fault_tolerance/#exactly-once-end-to-end
- https://nightlies.apache.org/flink/flink-docs-release-1.20/docs/deployment/overview/#deployment-modes

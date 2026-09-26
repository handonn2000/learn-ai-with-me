# DEF b11 — Consumption / Modeling: quality and fidelity

Reviewed 2026-09-26 by independent `quality_b11` reviewer. Final content/code/static-accessibility verdict: **PASS**. VI/EN fidelity: **ĐẠT**, pairs hash `b2a63016edad6f77`. Source PDF: 64 pages, extracted text plus visual inspection of substantive diagrams/code. Reviewer did not edit the lesson.

## Coverage and corrections

All ten curriculum units are covered; no required source omission remains. Original page mappings are in [slide-coverage.csv](../lesson-design/slide-coverage.csv). Covers, agendas and closing/reference pages are organizational, not separate teaching objectives.

| Unit | Implemented explanation / correction |
|---|---|
| 1. Warehouse | Business-serving layer, users and analytical workload. |
| 2. ER / normal forms | Keys, dependencies, normalization and denormalization tradeoffs. |
| 3. Grain / additivity | Revenue can sum; inventory snapshots need time-aware aggregation. |
| 4. Star / snowflake | Fact/dimension relationships, surrogate keys and join cost. |
| 5. SCD | Types 0,1,2,3,4,6 over two changes; type 6 combines historical rows and current attributes. |
| 6. Data Vault | Hubs, links, satellites and history. |
| 7. Inmon / Kimball | Top-down integration versus conformed dimensions/bus; medallion naming is supplementary. |
| 8. OLAP | Roll-up, drill-down, slice, dice and pivot. |
| 9. Serving engines | ClickHouse replication is per replicated table; Pinot hybrid time boundary avoids overlap. |
| 10. Feature stores | Offline/online distinction, point-in-time joins, TTL and freshness; Feast is illustrative. |

## Evidence

Six aggregate combinations, twelve SCD configurations and feature TTL boundaries pass. SQL temporal joins and JSON fixtures validate; Feast example passes Python AST inspection and is explicitly not a complete project. Revenue is 1200; snapshot sum 300 is invalid for closing inventory, whose last value is 120. Feature at 09:55 is 45.73 for a 10:00 event; latest 47.10 leaks future information. Escaped bronze/silver placeholders now render literally in both languages (B11-Q1 resolved).

Browser/mobile/theme/keyboard/storage/presentation evidence was subsequently collected by the parent in [browser checks](b9-b11-browser-checks.json). CSS mobile wrapping was corrected after static review. Runtime cluster execution was not performed; simulations establish only their documented teaching invariants. Optional additional diagrams or example metrics were suggestions, not blocking omissions.

## Authoritative correction references

- https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/type-6/
- https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/kimball-data-warehouse-bus-architecture/
- https://clickhouse.com/docs/reference/engines/table-engines/mergetree-family/replication
- https://docs.pinot.apache.org/release-1.3.0/basics/concepts/components/table/time-boundary
- https://docs.feast.dev/v0.40-branch/getting-started/concepts/point-in-time-joins
- https://docs.feast.dev/v0.40-branch/getting-started/concepts/feature-retrieval

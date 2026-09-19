# B8 source audit - Storage Layer

Date: 2026-09-15. Reviewer: independent source-audit agent. This is the source inventory and authoring correction baseline, not a final lesson or browser pass.

Source: `/Users/handonn/Workplace/AIDE-01/slides/Lession_8_Data_Engineering_Storage_Layer.pdf`, 59 pages. All 59 pages were extracted with pypdf, rendered with Poppler, and visually inspected in six-page contact sheets. Pages 11, 30, 38 and 41 were additionally inspected individually at 1400px to read embedded details. No source pages or diagrams remain uninspected. Administrative material is separated below. The source has no runnable code examples. Image-only content is substantive, especially the latency ladder and architecture diagrams.

Read alongside `lesson-design/storyboards.en.md`, `storyboards.vi.md`, `source-corrections.md`, and `.claude/agents/lesson-quality-judge.md`. The scope is the repository's full substantive slide coverage; source errors must be corrected, not reproduced.

## Confirmed corrections and qualifications

| Source | Required lesson treatment | Primary evidence |
|---|---|---|
| pp6-10 | File, block and object are access abstractions, not universal price/performance rankings. Keep all eight comparison axes. Explain path hierarchy; block addressing with filesystem/database organization above it; object key, payload and metadata. Object storage can hold structured data too. Object replacement is a common API model, not the same as immutable data forever. Metadata has provider limits. | [S3 overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html); [S3 object metadata](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMetadata.html): user-defined metadata is limited to 2 KB in a PUT request; it is not nearly unlimited. |
| p11 | Preserve the powers-of-ten teaching ladder, but label numbers illustrative, not measurements, SLAs or product benchmarks. A network cache request is not a 100ns RAM access. Request size, topology, queueing, persistence and hardware affect latency. The app annotations do not establish product rankings. | [Memcached documentation](https://docs.memcached.org/) explicitly describes the network client/server cache architecture; [Redis latency investigation](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/latency/) should be used for actual workload measurement. The source's ladder links to ByteByteGo, not a reproducible benchmark. |
| pp12-13 | Redis: rich native structures, cluster partitioning, RDB/AOF options, replication and pub/sub are different capabilities. Remove the claim that ordinary Redis inherently outperforms when its dataset does not fit RAM. Treat cache use cases as workload choices. | [Redis data types](https://redis.io/docs/latest/develop/data-types/); [persistence](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/); [replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication/). Replication is asynchronous by default and is not a substitute for persistence. |
| pp12-13 | Memcached: simple opaque values rather than rich server-side structures; client/proxy routing can partition data; ordinary servers do not coordinate replicas. No native pub/sub or Redis-style snapshot/AOF recovery. Qualify the persistence statement: clean warm restarts are supported, but not general crash durability. | [Memcached architecture](https://docs.memcached.org/); [Warm Restart](https://docs.memcached.org/features/restart/), available since 1.5.18 and explicitly not crash safe. |
| pp12-13 | Hazelcast: partitioned distributed structures, partition backups and Topic pub/sub; recovery/persistence options depend on configuration and product edition/version. Do not equate every structure's durability with Redis RDB snapshots. No universal fast-join guarantee. | [Hazelcast 5.6 persistence](https://docs.hazelcast.com/hazelcast/5.6/storage/persistence); [Topic](https://docs.hazelcast.com/hazelcast/5.6/data-structures/topic); [map backup mechanism](https://docs.hazelcast.com/hazelcast/5.3/data-structures/backing-up-maps). |
| p14 | Label 64 MB as the slide's older/example setting. Hadoop 3.4.2 uses `dfs.blocksize=134217728`, exactly 128 MiB. The client gets metadata from NameNode, then reads bytes from DataNodes; NameNode is not the bulk-data proxy. Teach replica placement, heartbeats and block reports separately. | [Apache release-3.4.2 configuration](https://github.com/apache/hadoop/blob/rel/release-3.4.2/hadoop-hdfs-project/hadoop-hdfs/src/main/resources/hdfs-default.xml); [3.4.2 architecture](https://hadoop.apache.org/docs/r3.4.2/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html). |
| p14 version label | Do not call Hadoop 3.4.2 the latest release. It is a valid pinned teaching version. | [Apache releases](https://hadoop.apache.org/releases.html) lists 3.5.0 released 2026-04-02 and 3.4.3 released 2026-02-24 as of this audit. |
| p15 | Kafka tiered storage is an optional configured remote-log mechanism. A sink that materializes a database/lake is a separate strategy for independent historical-query compute. Keep source connector and sink connector roles distinct; not every sink is Debezium. | [Kafka 4.2 tiered storage](https://kafka.apache.org/42/operations/tiered-storage/): disabled by default and requires a configured RemoteStorageManager implementation. |
| pp17-20 | SSOT means governed, reconciled definitions and approved data, not necessarily a single physical machine or copying every byte into one place. A warehouse alone does not guarantee quality. Model-to-dataset access controls in the diagram are illustrative; storage access needs control too. | Architectural clarification consistent with the source's warehouse integration purpose. |
| pp29-31,54 | Schema-on-read means interpretation can occur at read/processing time; it does not remove metadata, parsing, compatibility, contracts or governance. Bronze can retain raw payloads in explicitly typed envelopes. Raw retention must still follow declared lifecycle policy. | [Avro 1.12 specification, serialization and schema resolution](https://avro.apache.org/docs/1.12.0/specification/#schema-resolution); [medallion layers](https://docs.databricks.com/aws/en/lakehouse/medallion). |
| p31 | Replace structured-only warehouse claim with a qualified comparison. Modern warehouses can load semi-structured data. Cost and performance depend on service, layout, compute, scanning, requests and workload. | [Snowflake semi-structured data](https://docs.snowflake.com/en/user-guide/semistructured-intro) documents VARIANT, ARRAY and OBJECT. |
| p38 | Preserve the contrast between managed compatibility and undocumented schema drift. Do not copy the diagram as a mandatory inline Kafka -> schema registry -> consumer data path. Schema lookup/compatibility is a distinct control interaction. | [Confluent Schema Registry introduction](https://docs.confluent.io/platform/current/schema-registry/index.html) is the primary source to verify if reproducing this example's mechanism. |
| pp30,45,50-51 | Separate object storage, table format/transaction metadata and compute engines. Delta Lake contributes table reliability, schema rules and versioning; its presence does not automatically validate business truth or convert every binary object into a useful analytical table. | [Delta Lake documentation](https://docs.delta.io/). |
| p45 | Avro defines schemas, encoding and writer/reader resolution, not a standalone governance/catalog/version-approval service. Contracts additionally specify meaning, units, ownership and compatibility. If adding an Avro evolution example, reader defaults fill missing writer fields; defaults do not make a field optional when encoding. | [Avro 1.12 specification](https://avro.apache.org/docs/1.12.0/specification/), Records and Schema Resolution. |
| pp47-48 | Airflow orchestrates/observes runs; OpenLineage emits lineage metadata. Neither alone certifies data quality. Pipeline success is distinct from dataset freshness/completeness. Retention/archive/delete policies require explicit ownership. | The source establishes monitoring and lifecycle responsibilities; executable API setup is outside this introductory scope. |
| pp53-57 | Medallion is a logical design pattern, not a product feature that itself guarantees atomic end-to-end execution. Bronze retains source evidence with ingest metadata; silver cleans/validates/deduplicates/integrates; gold serves business models and aggregates. Silver need not be 3NF or minimally transformed, and quality checks do not start only at gold. Both batch and streaming fit. | [Databricks medallion](https://docs.databricks.com/aws/en/lakehouse/medallion), describes a recommended but optional pattern and the roles of the three layers. |

External references above were opened via the web tool unless explicitly phrased as a source to verify. The XML endpoint cannot be parsed by that tool, so the pinned Apache GitHub source was opened instead and its `dfs.blocksize` value read directly. No services were installed or executed.

## Complete source page inventory

This is a page-to-required-unit inventory. A final coverage ledger must map each unit to actual learner-visible lesson keys and mark covered, covered-with-correction, thin or missing; planned anchors alone are not evidence.

| PDF page(s) | Required unit / embedded visual details | Planned lesson anchor |
|---|---|---|
| 1 | Cover, instructor and course identification; administrative. | Source attribution |
| 2 | Four-part agenda: warehouse/modeling, lake/swamp, lakehouse, multi-hop. | Chapter navigation |
| 3 | Part-one agenda: storage systems, warehouse, modeling levels, warehouse modeling techniques. | ch01-ch05 |
| 4 | Recorded data becomes useful through organization, processing and interpretation; business decisions and problem solving. | ch01 |
| 5 | Visual taxonomy of file hierarchy, blocks and object payloads. | ch01 |
| 6 | Files/folders/subfolders; full path and name; disks/NAS; nested teams/client-account/deal hierarchy example. Qualify simplicity/cost. | ch01 |
| 7 | Block IDs, division across disks, database/application and SAN use. Qualify faster/flexible/complex comparison. | ch01 |
| 8 | Object ID, metadata and payload; static movies/photos/music and heterogeneous content. | ch01 |
| 9 | Compare storage unit, metadata, structure and performance for all three abstractions. Correct unlimited metadata and blanket latency rankings. | ch01 |
| 10 | Compare scaling, modification unit, cost and workloads for all three. Preserve data lake/backup, DB/VM and sharing examples. | ch01 |
| 11 | Latency ladder spans 1ns to 10s: L1 1ns, L2 10ns, RAM 100ns, blank 1us rung, network 10us, SSD 100us, DB insert 1ms, HDD seek 10ms, CA-NL-CA packet 100ms, blank 1s rung, retry/refresh 10s. App annotations: Redis, Memcached over 1Gbps, RocksDB, PostgreSQL, remote Zoom, Grafana. All are illustrative, not validated benchmark results. | ch02 |
| 12 | Cache comparison: submillisecond potential, partitioning, complex data types, performance context. Redis lists/sets; Memcached opaque values; Hazelcast maps/queues/multimaps and distributed processing. | ch02 |
| 13 | Cache comparison: snapshot/recovery options, replication, pub/sub and application use cases. Explain durability and RAM-capacity tradeoffs without blanket rankings. | ch02 |
| 14 | Client metadata path, NameNode namespace/replication/permission/block-location metadata, DataNode read/write path, heartbeats/block reports, two racks, replicas and physically close nodes. Source pathname `/home/foo/data` with replica factor 3; correct 64MB default. | ch03 |
| 15 | Source -> source connector -> Kafka -> sink connector -> sink. Remote tiering and broker historical-read pressure; separate materialized sink offload. | ch03 |
| 16 | Source versus storage: purpose, typical team ownership, lifecycle position and examples (IoT/messages/transactional DB versus disks/SSD/RAM/DB/lake/warehouse). One system may occupy both roles. | ch03 |
| 17 | Transition from infrastructure durability/access to organization/modeling/analytics; SSOT motivation. Data-center illustration is contextual. | ch04 |
| 18 | Multiple sources integrated into cleaned, standardized, shared warehouse data; diagram leads to analysis/reporting/BI. | ch04 |
| 19 | Modeling defines structure, organization and relationships for efficient storage, queries and analysis. | ch04 |
| 20 | Producers build models from tables/SQL; related datasets carry business relationships and access; nontechnical users create reports and share through online/email/API. Diagram connects sales/customer datasets to sales/marketing/product reports. | ch04 |
| 21 | Three modeling levels form a hierarchy of detail. | ch04 |
| 22 | Conceptual purpose/focus/audience/use: customers, orders and markets; business rules and stakeholders before technical design. | ch04 |
| 23 | Logical purpose/focus/audience/use: tables, attributes, relationships and rules independent of DB product; architect/analyst audience. | ch04 |
| 24 | Physical purpose/focus/audience/use: actual database types, tables, columns, keys, constraints, implementation; developer/DBA audience. | ch04 |
| 25 | Star: central fact measurements/events/transactions surrounded by descriptive dimensions; explain analytical joins/usability and table grain. Source has five generic dimensions. | ch05 |
| 26 | Snowflake: normalize dimensions into related subdimensions; diagram shows added join hops. Contrast redundancy, joins and usability with star. | ch05 |
| 27 | Lake/swamp causes/prevention agenda; administrative. | ch06-ch08 |
| 28 | Lake retains structured, semi-structured and unstructured source data in native formats; scale, diversity and storage economics; S3/Azure Blob/GCS examples. | ch06 |
| 29 | Horizontal scale, raw retention, schema-on-read and diverse data (SQL, XML/JSON, images/PDF/text, audio/video/sensors). Qualify schema/contract absence. | ch06 |
| 30 | Diagram: lake -> preparation/validation -> data science -> ML; lake -> ETL -> real-time DB -> reports -> BI; ETL -> data marts. Delta/table reliability/versioning bridge to lakehouse. | ch06 |
| 31 | Lake/warehouse comparison across data type, storage format, schema, cost, use case and performance; correct structured-only warehouse claim. | ch06 |
| 32 | Swamp definition and retrieval/trust failure; image's messy lake obscures valuable raw data and downstream warehouse access. | ch07 |
| 33 | Causes overview: missing metadata, governance, quality, ownership, schema documentation; tooling added on p39. | ch07 |
| 34 | Missing metadata prevents discovering what exists, owner and structure. | ch07 |
| 35 | Missing access controls/versioning/lineage cause duplication/security exposure; illustration includes ownership, knowledge, access, quality and security. | ch07 |
| 36 | Inconsistent raw values/formats undermine analyst trust; image names incomplete, inconsistent, outdated, inaccurate and irrelevant data. Raw landing may preserve these; validated consumption must address them. | ch07 |
| 37 | Ownership versus stewardship/accountability and maintenance at scale; owner/steward/responsibilities/ownership-metadata image. | ch07 |
| 38 | Schema drift without updated definitions breaks transformations; managed compatibility versus unmanaged DIY schema path. Qualify inline-registry diagram. | ch07/ch08 |
| 39 | Catalog, lineage and observability tooling gaps. Decorative analysis-tool collage is illustrative, not an integration or product-support matrix. | ch07 |
| 40 | Four impacts: wasted duplicate/unused storage; slower discovery/cleaning; unreliable dashboards/decisions; compliance exposure. GDPR/HIPAA are examples, not universal applicability/legal advice. | ch07 |
| 41 | Automated metadata at ingest; Glue, Atlas, Amundsen. Embedded AWS diagram: S3/IAM, crawler/catalog statistics, Athena/Redshift Spectrum consumers, Lambda/EventBridge scheduling. | ch08 |
| 42 | Ownership/stewardship, RBAC and lineage. Diagram: administrators assign roles; roles carry permissions; users receive access through roles. | ch08 |
| 43 | Profiling/validation, missing values, schema drift, outliers; Great Expectations/Monte Carlo. Diagram also shows data docs plus logging/alerting after validation. | ch08 |
| 44 | Raw/cleansed/curated zones with ETL/ELT transition enforcement; analysts/ML consume fit-for-purpose data. | ch08 |
| 45 | Schema version/evolution and producer-consumer contracts; Avro versus Delta responsibilities require qualification. | ch08 |
| 46 | Searchable self-service catalog; purpose, owner, update frequency tags. Duplicate source bullet is one repeated unit. Discovery/collaboration/governance/compliance image. | ch08 |
| 47 | Pipeline observability; failures, latency spikes and missing data; Airflow and OpenLineage roles. | ch08 |
| 48 | Retention policies, archive/delete. Image lifecycle: creation/capture -> storage/organization -> usage/sharing -> archiving/retention -> deletion/disposal. | ch08 |
| 49 | Lakehouse section divider; administrative. | ch09 |
| 50 | Lakehouse combines lake flexibility with warehouse-style analytical capability; data science/ML/analytics consume common foundation. | ch09 |
| 51 | Architecture: structured/semi-structured/unstructured/streaming sources; ACID/schema/versioned tables; common lakehouse foundation; SQL/BI and ML; analysts/scientists/business/ML engineers. Distinguish storage, table and compute responsibilities. | ch09 |
| 52 | Multi-hop/medallion agenda; administrative. | ch10 |
| 53 | Raw -> multiple transforms/quality stages -> analytics; each hop has a purpose. | ch10 |
| 54 | Batch and streaming both feed bronze -> silver -> gold -> BI/ML. Landing versus structure/schema evolution versus consumption; correct 'no schema needed' and 'Sliver' typo. | ch10 |
| 55 | Bronze source-shaped history with load date/time/process ID, fast CDC, archival role, lineage/audit, replay without rereading source. Do not make CDC the only ingestion option or cold tier mandatory. | ch10 |
| 56 | Silver cleans/matches/merges/standardizes/integrates enterprise customers/stores/transactions; serves engineers/analysts/scientists, reporting/ML. 3NF and minimal ELT transforms are optional examples, not mandatory boundaries. | ch10 |
| 57 | Gold project/domain-ready, denormalized/read-optimized/fewer joins, final business rules; customer/product-quality/inventory analytics, star/OBT, cross-system ML. Quality enforcement also exists upstream. | ch10 |
| 58 | References: Databricks lakehouse blog (2020-01-30), Storage Systems book, Designing Data-Intensive Applications 2nd edition. Source references recorded, not independently read as entire books. | Sources |
| 59 | Thank-you slide; administrative. | None |

All 59 pages are accounted for above. This inventory does not infer a lesson coverage percentage from page count.

## Source link provenance

- Page 11 hyperlink: [ByteByteGo latency ladder](https://blog.bytebytego.com/p/ep22-latency-numbers-you-should-know), recorded from PDF annotations; not used as a primary benchmark source.
- Page 58: [Databricks original lakehouse article](https://www.databricks.com/blog/2020/01/30/what-is-a-data-lakehouse.html), [Storage Systems](https://www.oreilly.com/library/view/storage-systems/9780323908092/), [Designing Data-Intensive Applications, second edition](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/). Recorded links do not imply full-text review of the books.

## Added teaching fixture checks to apply to the finished lesson

The storyboard's synthetic five-row medallion example must preserve 5 bronze rows, accept 2 unique valid orders in silver, quarantine 2 invalid rows, and account for the remaining retry as a duplicate. Gold must aggregate only the accepted rows. A replay must not double-count; either replace/rebuild the target deterministically or use an explicitly defined idempotent key/write policy. The loop resetting its drawing must not appear to delete persisted bronze data.

For each loop, static HTML must teach every essential state and failure case; browser timing, reduced motion, keyboard, mobile readability and two-cycle observation remain the parent/browser review's responsibility. No browser execution is claimed by this audit.

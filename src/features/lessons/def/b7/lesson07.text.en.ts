import type { VI } from './lesson07.text.vi';
export const EN = {
  badge: "WEEK 7 · DEF",
  title: "Ingestion — the journey begins",
  cover: "Cover",
  eyebrow: "PART III / THE PATH OF DATA",
  hero: "One order.<br /><em>Many places waiting.</em>",
  intro: "At the checkout, an order becomes a row. Somewhere else, an analyst is waiting for the sale, a stock service is waiting for the quantity, and a fraud system is waiting for a signal. Three destinations, one busy database. I’ll follow this order beyond that database. You’ll see why moving a record is only the beginning; preserving its meaning through delays and failures is the real work.",
  premise: "The store in the story and the lab data are fictional. These models run in your browser; they don’t connect to a real Kafka cluster or database.",
  start: "Begin the journey",
  jump: "Go to the crash / replay lab",
  meta: "10 chapters · 3 interactive labs · VI / EN",
  readyTitle: "Before you follow the order",
  readyLead: "You can start here before taking weeks 1–6. No calculus is needed. I just need you to distinguish a record, a key, a change, and saved progress.",
  terms: [
    [
      "Record / Bản ghi",
      "A unit of data, such as an order with id and amount. JSON represents fields and values; null represents an empty value."
    ],
    [
      "INSERT · UPDATE · DELETE",
      "Add a row, change an existing row, or remove a row. A hard delete removes it; a soft delete retains it and changes an is_deleted flag."
    ],
    [
      "Key / Khóa",
      "A value used to identify or group related events. order_id keeps changes for the same order on one path when the routing rules remain stable."
    ],
    [
      "Throughput / Thông lượng · latency / Độ trễ",
      "Throughput measures work per unit of time; latency measures one record’s end-to-end travel time. More MB/s doesn’t mean each record arrives sooner."
    ],
    [
      "Offset · commit · retry",
      "An offset is a position within a partition. A commit saves a restart position; a retry attempts an operation again. Saved progress and completed effects can diverge."
    ]
  ],
  visuals: {
    "label": "VISUAL FIELD NOTES",
    "example": "Illustrative architecture",
    "journeyTitle": "Follow order 42 through the platform",
    "journeyHelp": "Follow the glowing order through the platform. This illustration repeats from the source; it shows responsibility, not measured processing time.",
    "journeySteps": [
        "The application commits order 42 in PostgreSQL.",
        "An ingestion job delivers the record to staging for validation.",
        "The warehouse retains the input and builds shared summaries.",
        "The Sales mart organizes the data for its business domain.",
        "A report can now use the order. Its freshness depends on the whole path."
    ],
    "stages": [
        "Source",
        "Ingestion / staging",
        "Warehouse",
        "Sales mart",
        "Report"
    ],
    "details": [
        "order_id = 42",
        "Validate + load",
        "Raw / summary / metadata",
        "Sales definitions",
        "Business users"
    ],
    "airflowRole": "Schedules and monitors the jobs",
    "airflowNote": "Airflow is an example orchestrator for scheduled jobs. Its control path sits above the data path; it is not the event broker.",
    "storageTitle": "Same records. Different physical neighbors.",
    "storageHelp": "Choose a storage layout. The same records regroup and the amount values light up together. The example uses groups of 2 rows; actual Parquet row groups and ORC stripes are configurable.",
    "layouts": [
        "Rows · CSV illustration",
        "Columns · ORC illustration",
        "Row groups · Parquet illustration"
    ],
    "storageNote": "Highlighted: amount. Columnar layout places values from the same column together; this picture does not claim that a query reads exactly these bytes.",
    "fields": [
        "Name",
        "Amount",
        "Month"
    ],
    "fanTitle": "One committed change, three target views",
    "fanHelp": "The same change can update search, a cache, and a warehouse. Each branch needs its own mapping and INSERT / UPDATE / DELETE handling.",
    "log": "Transaction log",
    "search": "Search index",
    "cache": "Cache",
    "warehouse": "Analytical warehouse",
    "ecosystemTitle": "Kafka at the center, tools around it",
    "ecosystemHelp": "Switch between three use cases. Follow the moving signals to see which systems read, write, or copy records.",
    "source": "Source database",
    "target": "Target",
    "cluster1": "Kafka · cluster 1",
    "cluster2": "Kafka · cluster 2",
    "streams": "Kafka Streams application",
    "streamsRole": "Read → transform → write to cluster 1",
    "mirror": "MirrorMaker",
    "mirrorRole": "Cluster 1 → cluster 2",
    "connectSource": "Kafka Connect · Source",
    "connectSink": "Kafka Connect · Sink",
    "workers": "Connectors run in Connect workers, outside the broker.",
    "offsetTitle": "The commit marker points to the next position",
    "offsetHelp": "Watch offsets 0 and 1 get processed before progress is committed. Each replay starts a fresh illustration; the five retained records are not deleted.",
    "offsetSteps": [
        "Five retained records; next read and committed position are both 0.",
        "Process offset 0. Next read is 1; committed position remains 0.",
        "Process offset 1. Next read is 2; committed position remains 0.",
        "Commit position 2. Recovery starts at 2; commit-based lag is 5 − 2 = 3."
    ],
    "readPosition": "Next read",
    "committed": "Committed",
    "logEnd": "Log end",
    "processed": "Processed",
    "pending": "Not processed",
    "replicaTitle": "A leader fails. Its other partitions keep their leaders.",
    "replicaHelp": "Watch the four-broker example lose and replace its P0 leader. Replication factor is 3 per partition; remaining followers are eligible ISR replicas and clean election succeeds. The loop then restarts the example.",
    "replicaSteps": [
        "All brokers are online. P0 is led by broker 1, P1 by broker 2, and P2 by broker 3.",
        "Broker 1 goes offline. P0 temporarily has no available leader; P1 and P2 keep theirs.",
        "Broker 2 is elected P0 leader. Existing records survive on its replica; no other leader changes."
    ],
    "broker": "Broker",
    "leader": "Leader",
    "follower": "Follower",
    "offline": "Offline",
    "electing": "P0: election pending",
    "cdcTitle": "Watch a database update become a Kafka event",
    "cdcHelp": "A committed PostgreSQL update flows through the system on repeat. This simplified path starts after the initial snapshot; other databases expose different logs or change streams.",
    "cdcStages": [
        "PostgreSQL",
        "WAL / logical decoding",
        "Debezium",
        "Apache Kafka",
        "Sink → target"
    ],
    "cdcDetails": [
        "42: amount 10 → 12",
        "Committed update",
        "Source connector",
        "orders · key 42",
        "Apply amount = 12"
    ],
    "cdcSteps": [
        "Order 42 changes from amount 10 to 12 in a committed transaction.",
        "Logical decoding exposes the committed change from PostgreSQL WAL.",
        "The Debezium source connector creates a change event with the row key.",
        "Kafka retains the event; independent consumers can read it.",
        "A configured sink applies the change to its target using the key and operation."
    ],
    "cdcNote": "The event format is simplified. A real connector also handles snapshots, source positions, schemas, and database-specific requirements.",
    "loopLabel": "Repeating illustration",
    "staticLabel": "Reduced motion · complete view",
    "ecosystemCases": [
        "Connect · move data",
        "Streams · transform",
        "MirrorMaker · copy clusters"
    ],
    "storageReading": "Amount values read together",
    "storageGrouping": "Records arrange in the selected layout",
    "replay": "Replay from the source",
    "partitionOrder": "Order is local to each partition",
    "callouts": [
        "Ingestion moves data into the platform; quality and reliability belong to that job.",
        "File format alone does not determine whether the data is structured.",
        "A hard DELETE leaves no row for timestamp polling to find.",
        "Kafka separates the pace of production from the pace of each consumer group.",
        "Kafka preserves order within a partition, not globally across partitions.",
        "A committed offset stores the next recovery position, not the last completed record.",
        "Reading does not delete data. Each consumer group keeps its own progress.",
        "acks=all concerns the ISR of the partition, not every broker in the cluster.",
        "Producer idempotence does not prevent a consumer from repeating an external effect.",
        "Compaction does not renumber offsets or instantly erase every older value."
    ],
    "keyIdea": "Keep this distinction"
},
  chapters: [
    {
      title: "The order leaves its source",
      lead: "The row exists, but the report can’t see it yet. Between them lies a chain of responsibilities.",
      body: [
        "A source system is where data originates or is stored before entering the data platform: an operational application, database, API, file, or third-party provider. Ingestion collects from these sources and delivers into the platform for further processing; both efficiency and reliability belong to this layer.",
        "In this architecture, staging receives data, validates it, and performs basic transformations. The warehouse centralizes structured data: raw retains input details, summary holds aggregates, and metadata describes the data. A central warehouse aims to provide a consistent source of figures, but it becomes trustworthy only through managed definitions and quality.",
        "Data marts organize data by business domain: Purchasing, Sales, Inventory. Analysts, business users, and data scientists then perform analytics, reporting, or mining. This diagram assigns responsibilities; ingestion doesn’t require every platform to contain exactly these boxes.",
        "I stop at the source before choosing tools. GIGO — poor input leads to poor output — appears as inaccurate, incomplete, or inconsistent data. A slow source limits extraction speed; CPU and memory used for exports still compete with live transactions. Volume and format influence the integration pattern: CSV/log files can arrive in batches, while databases can use CDC."
      ],
      cards: [
        {
          title: "🧭 Governance across the journey",
          text: "Quality checks accuracy, completeness, and consistency. Security protects data. Access control limits permissions by role. Lineage connects origins with transformations. Metadata management records definitions, types, and documentation. These responsibilities cross every layer; they don’t wait for a dashboard."
        }
      ],
      table: {
        headers: [],
        rows: []
      },
      flow: [
        "Sources: DB / API / files",
        "Ingestion → staging",
        "Warehouse: raw / summary / metadata",
        "Marts: Purchasing / Sales / Inventory",
        "Users: analytics / reporting / mining"
      ],
      figures: []
    },
    {
      title: "Different sources, different clocks",
      lead: "An end-of-day file and a payment that just completed don’t make the same promise about freshness.",
      body: [
        "A file is a collection of data stored in a computer system. CSV, JSON, XML, Parquet, images, and PDFs may reside on local servers or cloud storage. A system generates hourly or daily files; an ingestion job loads them in batches into a lake or warehouse. Micro-batching uses smaller, more frequent batches to reduce waiting time. This is a common pattern, not a rule that every file must wait for a widely spaced batch run.",
        "Structured data has a clear schema of rows and columns, making queries straightforward while requiring managed schema changes. Semi-structured formats such as JSON/XML have field names, hierarchy, and metadata but allow flexible shapes. Unstructured content such as free text, images, video, audio, or raw logs lacks a fixed analytical schema and needs further extraction. File format doesn’t determine data category: CSV and Parquet often hold structured data; a log can also be JSON.",
        "OLTP supports daily operations in banking, e-commerce, and ERP: placing orders, updating profiles, processing payments, and managing inventory. Follow this path: user → API → OLTP DB → Orders / Users / Payment tables → transaction → CDC → Kafka. OLAP uses historical data for analysis, reporting, and ML: source / Kafka → ETL or ELT → warehouse → tables, BI/dashboard, and ML models. ETL transforms before loading; ELT loads first and transforms at the destination.",
        "Logs record system events for investigation, analytics, and ML. System logs describe system activity; application logs describe application behavior; error/debug logs record failures and diagnostic detail; audit logs record changes; security logs record access or threats; network logs record traffic. Docker containers, servers, and IoT devices can all produce logs. A log line needs a timestamp and context to mean something, not merely a transport."
      ],
      cards: [
        {
          title: "🗂 Three layouts for the same data",
          text: "Take three rows: (a, 1, 2020-01), (b, 2, 2020-02), (c, 3, 2020-03). A row layout places each complete row together. A column layout places a/b/c together, then 1/2/3, then the dates. A grouping of 2 rows stores the columns for a/b within one group; the final group contains only 1 row, c. CSV illustrates sequential rows; ORC and Parquet are both columnar formats organized into stripes/row groups. Parquet isn’t a category outside columnar storage."
        },
        {
          title: "Choose what needs reading",
          text: "Reading a whole record often favors a row layout; scanning a few columns across many rows often favors columnar storage, reducing I/O and enabling compression. WHERE filters rows; SELECT projects columns. But CSV doesn’t automatically have an index for fast filtering. Physical layout, indexes, and workload jointly determine performance; an OLTP/OLAP label is no speed guarantee."
        }
      ],
      table: {
        headers: [
          "Comparison",
          "OLTP",
          "OLAP"
        ],
        rows: [
          [
            "Purpose",
            "Many operational transactions",
            "Large-scale analysis, often historical"
          ],
          [
            "Access",
            "Short SELECTs plus INSERT / UPDATE / DELETE",
            "Mostly SELECT, scans, and aggregation"
          ],
          [
            "Typical query complexity",
            "Narrow lookup / modification",
            "Complex joins / aggregation"
          ],
          [
            "Illustrative duration",
            "Milliseconds",
            "Seconds, minutes, or hours depending on the query"
          ],
          [
            "Examples",
            "Online booking, e-commerce",
            "Analytics, BI, ML"
          ]
        ]
      },
      flow: [],
      figures: [
        {
          title: "The same three rows, different layouts",
          text: "An illustrative layout, not a byte encoding. The smaller final group still preserves all data.",
          headers: [
            "Layout",
            "Illustrated sequence"
          ],
          rows: [
            [
              "Row / CSV",
              "a | 1 | 2020-01 → b | 2 | 2020-02 → c | 3 | 2020-03"
            ],
            [
              "Column / ORC",
              "a | b | c → 1 | 2 | 3 → 2020-01 | 2020-02 | 2020-03"
            ],
            [
              "Row group / Parquet",
              "[a | b ; 1 | 2 ; 2020-01 | 2020-02] → [c ; 3 ; 2020-03]"
            ]
          ]
        }
      ]
    },
    {
      title: "Capture the change, including deletion",
      lead: "The order has vanished from the source table. A query that sees only surviving rows may never know it existed.",
      body: [
        "CDC — Change Data Capture — tracks INSERT, UPDATE, and DELETE and sends changes downstream instead of rereading the whole table on every run. Three common approaches are timestamp polling, triggers, and transaction-log capture. The illustrated fan-out is source DB → transaction log → CDC → Elastic / Redis / Snowflake. One change stream can serve search, caching, and analytical storage; each target still needs appropriate INSERT/UPDATE/DELETE handling. They differ in where they observe changes and in the cost they impose on the source.",
        "Polling requires a LAST_MODIFIED or LAST_UPDATED column that reliably changes on every modification. Query rows after the saved marker; an index on that column can avoid a full-table scan. If is_deleted changes from false → true and the timestamp also changes, the soft-deleted row is visible. A hard DELETE leaves no row to query. I don’t treat timestamps as perfect clocks either: ties, low precision, or late transaction commits require a tie-breaker/overlapping reads and deduplication to avoid omissions.",
        "A trigger is a procedure invoked by a database event. The illustrated design attaches a trigger for each INSERT / UPDATE / DELETE on each table; many databases allow multiple triggers for an event, but details vary. Triggers write changes to a dedicated table such as audit_log, which the pipeline reads. This captures hard deletes and is widely supported, but adds writes and transaction work and becomes difficult to debug when triggers are complex or cascading.",
        "Log-based CDC reads an existing transaction log, often reducing impact compared with table scans or added audit writes and enabling low latency. MySQL binlog, PostgreSQL WAL, and Oracle redo have different formats; each connector must understand its database. A schema is the blueprint of tables, columns, and data types. Log capture often avoids adding timestamp columns to business tables, but still requires configuration, permissions, logging, and sometimes row-identification information.",
        "Low impact doesn’t mean zero load: decoding, transfer, initial snapshots, and retained logs all consume resources. The connector must respect transaction boundaries. In a stream of committed changes, a rolled-back transaction shouldn’t become a business change at the target. A compensating transaction after a commit is a new event to apply. Don’t assume every source rollback requires the target to reverse an event already emitted."
      ],
      cards: [],
      table: {
        headers: [
          "Observation method",
          "Captures hard DELETE?",
          "Cost / condition"
        ],
        rows: [
          [
            "Timestamp polling",
            "No, when querying only the current table",
            "Reliable change column; index; timestamp tie handling"
          ],
          [
            "Trigger + audit table",
            "Yes, when configured correctly",
            "Extra writes; trigger, ordering, and schema maintenance"
          ],
          [
            "Transaction log",
            "Yes, when the connector/log has enough information",
            "Permissions and log retention; database-specific decoder; transaction handling"
          ]
        ]
      },
      flow: [],
      figures: [
        {
          title: "Row 1122 remains after a soft delete",
          text: "The example changes the name/email and deletion flag while retaining the ID. The second row has a later Last Modified: polling can find is_deleted=true. Names/emails are illustrative values, not a real person’s history.",
          headers: [
            "ID",
            "First Name",
            "Last Name",
            "Email",
            "Last Modified",
            "is_deleted"
          ],
          rows: [
            [
              "1122",
              "Michael",
              "Jackson",
              "Michael1122@gmail.com",
              "2022-10-31T12:11:07",
              "false"
            ],
            [
              "1122",
              "George",
              "Clooney",
              "George.Clooney@gmail.com",
              "2023-10-13T02:17:08",
              "true"
            ]
          ]
        },
        {
          title: "Trigger → Shadow Table → Vendor Table",
          text: "In this example, the source Shadow Table records change ID, Table Name, RowID, Timestamp, and Operation. The audit event ID identifies one change, while RowID identifies a business row; one business row can have many audit events. The pipeline needs consistent key mapping to locate target rows; a shadow table doesn’t automatically hold sufficient before/after data for every design. Reliable detailed replay needs the necessary payload, especially after deletion. The target picture illustrates names/emails; its “Timestamp” header over email values is a labeling error, not a time type.",
          headers: [
            "ID",
            "Table Name",
            "RowID",
            "Timestamp",
            "Operation"
          ],
          rows: [
            [
              "1",
              "Vendor",
              "101",
              "11/02/21 12:15pm",
              "Insert"
            ],
            [
              "2",
              "Vendor",
              "127",
              "11/02/21 12:16pm",
              "Update"
            ],
            [
              "3",
              "Vendor",
              "142",
              "11/02/21 12:17pm",
              "Delete"
            ]
          ]
        }
      ]
    },
    {
      title: "One event, several destinations",
      lead: "Analytics, marketing, and fraud detection all pull order data. The sales database starts slowing down just as the store gets busy.",
      body: [
        "At first, each team receives a daily production-database export. As traffic grows, export queries compete with live transactions, reports arrive late, and individual integrations become hard to maintain. Kafka provides a shared event log that separates the pace of data creation from the pace of application reads.",
        "Apache Kafka is a distributed event streaming platform: it publishes, stores, and supports processing streams of records as they are generated. Producers push records to brokers; consumers pull when ready. A cluster is a group of brokers that store and manage topics/partitions. Picture three producers, three brokers holding partitions 0/1 of topics A/B/C, and three consumers. Multiple brokers support distribution and redundancy; protecting data requires suitable replicas, not just another server.",
        "Kafka connects databases, caches, microservices, data lakes, search systems, ML, monitoring, analytics, web, and IoT. These are event integration or processing use cases; Kafka doesn’t replace all these systems. Different consumer groups can use the same stream for different purposes.",
        "In older architectures, ZooKeeper coordinated brokers and metadata; records still traveled producer → broker → consumer, not through ZooKeeper. KRaft brings metadata management into Kafka through a controller quorum. Kafka 4.0 removed ZooKeeper mode; KRaft existed before that release. I keep those milestones distinct so you can read an old diagram without deploying the wrong new architecture."
      ],
      cards: [
        {
          title: "🛰 Kafka core and its extensions",
          text: "Core covers producer/consumer protocols, brokers, topics, and partitions. Kafka Connect Source brings external data into cluster 1; Connect Sink exports Kafka records to databases, warehouses, or storage. Connectors run in Connect workers, not automatically inside every broker."
        },
        {
          title: "Streams and MirrorMaker",
          text: "Kafka Streams is a library embedded in applications to filter, transform, or aggregate data read from Kafka and write results. MirrorMaker copies between cluster 1 and cluster 2 for multi-region distribution, backup, or disaster recovery. Cross-cluster copying is distinct from partition replication within a cluster; lag and configuration still need attention."
        }
      ],
      table: {
        headers: [],
        rows: []
      },
      flow: [
        "Source → Connect Source",
        "Kafka cluster 1",
        "Kafka Streams application ↔ cluster 1",
        "Connect Sink → target",
        "MirrorMaker: cluster 1 → cluster 2"
      ],
      figures: []
    },
    {
      title: "A topic becomes parallel lanes",
      lead: "Putting every event into a single queue simplifies ordering, but also concentrates the work on one reading path.",
      body: [
        "A topic is a logical name that organizes records. You can name topics by event type, such as user_created; by entity/domain, such as orders; or by environment: dev / test / prod. Naming also defines a contract: who can write, which schema is accepted, and who can read. Putting prod in a name doesn’t create a security boundary.",
        "Each topic is divided into partitions. Within a partition, records are appended to the log in offset order. Partitions enable parallel processing, distribution across machines, and higher throughput when resources allow. Kafka preserves log order within each partition; it doesn’t establish global ordering across all partitions.",
        "The producer chooses the topic, partition, and reliable sending behavior. The consumer subscribes/reads and tracks its position; the broker stores and serves partitions. An offset identifies a position within one partition, not a global business ID: P0:0 and P1:0 are different positions. These six terms give you the vocabulary to read a cluster diagram."
      ],
      cards: [],
      table: {
        headers: [
          "Term",
          "Responsibility",
          "The order’s trail"
        ],
        rows: [
          [
            "Topic",
            "Logical grouping",
            "orders"
          ],
          [
            "Partition",
            "Ordered log, unit of parallelism",
            "P0, P1, P2"
          ],
          [
            "Offset",
            "Local position in a partition",
            "P1:0 → P1:1"
          ],
          [
            "Producer",
            "Sending application",
            "Service / event-export connector"
          ],
          [
            "Consumer",
            "Reading application",
            "Fraud-processing application"
          ],
          [
            "Broker",
            "Storage and serving server",
            "A cluster member"
          ]
        ]
      },
      flow: [],
      figures: [
        {
          title: "Two event types across three services",
          text: "Service 1 produces E1 to Topic 1. Service 2 reads E1 and produces E2 to Topic 2. Service 3 reads both E1 and E2. A consumer can also produce the next event; one topic per event type doesn’t mean only one consumer exists.",
          headers: [
            "Service",
            "Reads",
            "Writes"
          ],
          rows: [
            [
              "1",
              "—",
              "E1 → Topic 1"
            ],
            [
              "2",
              "E1 ← Topic 1",
              "E2 → Topic 2"
            ],
            [
              "3",
              "E1 ← Topic 1; E2 ← Topic 2",
              "—"
            ]
          ]
        },
        {
          title: "One cluster or multiple clusters?",
          text: "Separating dev/test/prod topic names and separating clusters are different levels of isolation. This decision map lists considerations, not a rule that multiple clusters are automatically safer or cheaper. Check actual permissions, resources, operations, and costs. A heavy experimental workload can compete for CPU/network with production payments even in a different topic. ACLs and quotas help within a shared cluster; separate failure domains, maintenance schedules, or compliance boundaries may justify separate clusters. Data locality keeps processing near data; fine-tuning selects workload-specific settings; domain ownership assigns clear operational responsibility.",
          headers: [
            "Choice / branch",
            "Decision-map considerations"
          ],
          rows: [
            [
              "One shared cluster",
              "No technical constraint requiring separation; global event hub; potential lower cost of ownership"
            ],
            [
              "Multiple clusters: operational decoupling",
              "Maintainability; workload criticality; regulatory compliance"
            ],
            [
              "Multiple clusters: tenant isolation",
              "Resource isolation; security boundary; logical decoupling"
            ],
            [
              "Multiple clusters: use-case optimization",
              "Fine-tuning; data locality; purpose-built systems; domain ownership"
            ]
          ]
        }
      ]
    },
    {
      title: "More lanes don’t mean free speed",
      lead: "One reader is busy while the other machines wait. Splitting the log can open parallel paths, but each new partition has a cost.",
      body: [
        "With P0, P1, P2, consumers A, B, C can process partitions independently. A single queue makes its reader work sequentially; multiple partitions allow concurrent work. When expanding the cluster, partitions can be redistributed: initially machine 1 holds P0–P7; afterward machine 1 holds P0–P3 and machine 2 holds P4–P7. Redistribution needs operational tooling/policy; adding a machine doesn’t necessarily move every partition automatically.",
        "Partition count depends on required throughput, consumer parallelism, and broker/controller overhead. The example of 5–10 MB/s per partition is an illustrative estimate without an attached benchmark, not a Kafka capacity rating. Disk I/O, networking, record size, batching, compression, replication, and processing speed all matter. For 16 consumers to work concurrently in one group reading one topic, you need at least 16 partitions; additional partitions can still pressure metadata, files, and coordination.",
        "A keyed producer commonly hashes the key to choose a partition. The same key stays on the same partition only while the relevant partition count, serializer, and partitioner remain stable; a custom partitioner or explicit partition can change that behavior. Increasing partition count can remap keys. Without a key, clients distribute load: the Kafka 4.0 Java producer uses sticky/adaptive selection depending on configuration, not always round-robin. The lab uses a documented toy hash and round-robin model so you can see the mechanism, not mistake it for a real client.",
        "Offsets support progress tracking, recovery, and replay of retained data. Consumer position is the next read position in memory; committed offset is the saved recovery position. If a log contains records 0–4, its log end offset is 5. After processing 0 and 1 and committing 2, commit-based lag is 5 − 2 = 3 positions. The consumer may have fetched further without finishing processing. Transaction control records also occupy offsets; compaction leaves gaps. Offset distance therefore isn’t always the number of pending business records."
      ],
      cards: [],
      table: {
        headers: [
          "Before / after",
          "Placement",
          "Meaning"
        ],
        rows: [
          [
            "One machine",
            "Machine 1: P0 P1 P2 P3 P4 P5 P6 P7",
            "Concentrated resources"
          ],
          [
            "Two machines after reassignment",
            "Machine 1: P0 P1 P2 P3; machine 2: P4 P5 P6 P7",
            "More resources, more operational work"
          ],
          [
            "Example read markers",
            "Log end 5; commit 2; lag 3",
            "Commit saves the next position, not the one just completed"
          ]
        ]
      },
      flow: [],
      figures: []
    },
    {
      title: "The readers divide the work",
      lead: "Analytics adds another reader, but the topic has only three partitions. The fourth reader arrives and receives no lane.",
      body: [
        "A consumer group is a set of consumers sharing the reading work. In the conventional consumer-group model, each partition is assigned to at most one consumer in the group at a time; a consumer may hold several partitions. Three partitions and four consumers allow at most three consumers to hold partitions, leaving one idle. When members join or leave, assignments may change through rebalancing.",
        "Analytics and Fraud have separate assignments and committed offsets. Analytics finishing a read doesn’t deprive Fraud of the data. This both divides work within a group and lets multiple groups reuse a stream. Reading doesn’t delete a record.",
        "I want you to keep one boundary clear: exclusive assignment doesn’t mean every effect happens only once. The old consumer may have written to the target and died before committing; its replacement reads again from the old marker. The next lab exposes the gap between “processed” and “progress saved”."
      ],
      cards: [
        {
          title: "🎛 Try it in the lab",
          text: "Keep 3 partitions, choose 4 consumers, and send all 6 events. Switch Analytics to Fraud to see independent positions. Read + commit advances only the selected group; Back restores the whole snapshot. Changing configuration starts a new experiment."
        }
      ],
      table: {
        headers: [],
        rows: []
      },
      flow: [],
      figures: []
    },
    {
      title: "A broker disappears",
      lead: "The producer receives a success acknowledgment. Moments later, the leader’s machine fails. The promise made at send time now depends on the replicas left behind.",
      body: [
        "Replication factor is the number of replicas for each partition. A factor of 3 can place one leader and two followers on different brokers. In the usual reading model, producers write to the leader and consumers read from it; followers synchronize the log. Some configurations allow consumers to read a closer replica, so “all reads always go through the leader” is too absolute.",
        "ISR — In-Sync Replicas — contains replicas that keep up with the leader within allowed synchronization limits; they needn’t be identical at every nanosecond. If the leader fails, an eligible replica can be elected; the exact mechanism depends on version/configuration. In this clean-election model, a remaining ISR follower is selected. If no suitable replica remains, stopping safely is better than promising no data loss.",
        "acks=0 doesn’t wait for broker acknowledgment. acks=1 waits for the leader to write, but that leader can fail before a follower receives the record. acks=all waits for acknowledgments from replicas in the ISR, not every broker in the cluster. min.insync.replicas sets the minimum ISR size for accepting writes with acks=all. For example, replication factor 3 with min.insync.replicas=2 allows writes with two ISR members; with only one, writes are rejected. This trades availability for the durability condition.",
        "Placing replicas in different failure domains, monitoring ISR and lag, configuring elections, and retaining enough log reduce risk. Losing all suitable copies, accepting a stale replica, or exhausting retention can still lose data you need to read. Multiple brokers don’t create a “never loses data” guarantee."
      ],
      cards: [],
      table: {
        headers: [
          "P0 state",
          "Broker 1",
          "Broker 2",
          "Broker 3"
        ],
        rows: [
          [
            "Before failure",
            "Leader: 0, 1, 2",
            "ISR follower: 0, 1, 2",
            "ISR follower: 0, 1, 2"
          ],
          [
            "Leader 1 fails",
            "Offline",
            "New leader: 0, 1, 2",
            "ISR follower: 0, 1, 2"
          ],
          [
            "If only broker 2 remains",
            "Offline",
            "ISR size 1; reject writes when min ISR = 2",
            "Offline"
          ]
        ]
      },
      flow: [],
      figures: [
        {
          title: "Three partitions on four brokers",
          text: "Each partition has 3 replicas in this diagram. When broker 1 fails, broker 2 becomes P0 leader; P1 remains led by broker 2 and P2 by broker 3. A broker can hold several partitions and lead several of them. P0 failover doesn’t require replacing every leader. L = leader, F = follower.",
          headers: [
            "Broker",
            "Before failure",
            "After broker 1 fails"
          ],
          rows: [
            [
              "1",
              "P0 L; P2 F",
              "Offline"
            ],
            [
              "2",
              "P0 F; P1 L",
              "P0 L; P1 L"
            ],
            [
              "3",
              "P0 F; P1 F; P2 L",
              "P0 F; P1 F; P2 L"
            ],
            [
              "4",
              "P1 F; P2 F",
              "P1 F; P2 F"
            ]
          ]
        }
      ]
    },
    {
      title: "The moment between processing and commit",
      lead: "The balance has increased by 10. The progress marker hasn’t moved. A restart can turn one event into two additions.",
      body: [
        "At-most-once accepts that processing might never happen, without retrying under the illustrated policy. The consumer commits before processing: a crash after commit but before the effect causes the next run to skip the record. Lower-value telemetry/logging sometimes accepts a few lost points instead of retry costs, but that decision must follow business requirements.",
        "At-least-once processes first, commits afterward, and rereads after failure. A crash after the effect but before commit can repeat the effect. Waiting for producer acknowledgments and retrying can also create duplicate records without idempotence; consumer failure is a separate duplication window. I don’t infer end-to-end semantics from acks alone, or call one configuration the default for every client, connector, and sink.",
        "Producer idempotence removes recognized retry duplicates within the producer protocol. It doesn’t automatically identify two distinct business events sharing order_id, or stop a consumer calling a payment service twice. In the Kafka 4.0 Java producer, idempotence requires acks=all, retries greater than 0, and max.in.flight.requests.per.connection no greater than 5. A send timeout still needs handling according to the protocol and actual outcome.",
        "Exactly-once describes effects within a defined boundary. A Kafka transaction can atomically combine output records and committed input offsets; downstream consumers use read_committed to avoid seeing output from aborted transactions. Kafka Streams offers a processing mode based on this mechanism. An external database or API requires corresponding support: a transaction combining the dedup marker and effect, a sink-enforced idempotency key, or suitable commit coordination. Merely enabling acks=all and enable.idempotence=true doesn’t establish exactly-once external effects.",
        "In the lab, one event e1 adds 10 to an initial balance of 0. The protected sink model assumes that it persists the event ID and effect together atomically/durably, skipping repeats. This is a modeling assumption, not a claim that a browser Set makes a payment system crash-safe. Compare failures before processing and after the effect: omissions and duplicates live on opposite sides of the same gap."
      ],
      cards: [
        {
          title: "⚡ Three places to ask about “once”",
          text: "How many times was the record written to Kafka? How many times did the consumer execute? How many times was the business effect committed? An answer about the producer doesn’t answer the other two questions."
        }
      ],
      table: {
        headers: [
          "Policy",
          "Illustrated order",
          "Failure in the gap"
        ],
        rows: [
          [
            "At-most-once",
            "Commit → process",
            "The effect may be skipped"
          ],
          [
            "At-least-once",
            "Process → commit",
            "The effect may repeat"
          ],
          [
            "Exactly-once effects within a boundary",
            "Combine effect + progress, or atomic sink deduplication",
            "Execution may repeat; the committed effect counts once"
          ]
        ]
      },
      flow: [],
      figures: []
    },
    {
      title: "The log remembers; Debezium translates",
      lead: "The reader has moved on, but the record hasn’t vanished. Another group may need to start again tomorrow.",
      body: [
        "Retention determines what remains in the log, independently of reads. With a delete policy, examples such as 7 days or 1 GB per partition are configuration choices, not universal defaults. Cleanup works on log segments and a checking schedule; individual records don’t disappear at a perfectly precise instant. A consumer that falls behind the retention period may lose the ability to replay from its old position.",
        "Compaction retains the latest value for each key as the cleaner processes eligible log sections. It doesn’t renumber offsets or instantly remove every old value when an UPDATE arrives. A tombstone — a key with a null value — marks deletion; it remains for a time so consumers can observe it and may later be cleaned according to configuration. Time-based history and latest state by key meet different needs; compact and delete can be combined, with consequences to consider.",
        "Debezium is an open-source CDC platform. Its connectors capture row-level changes, commonly through transaction logs/replication streams such as MySQL binlog, PostgreSQL WAL, and Oracle redo, and produce similarly structured change events across databases. The path is source → Debezium source connector → Kafka → sink connector → target. An initial snapshot can read existing state before following the log. Data types, keys, transactions, and setup still differ between sources; a common format doesn’t erase semantic differences.",
        "The supplementary event contract below uses key order_id=42, op=u, before.amount=10, and after.amount=12. It’s a simplified update illustration, not a full payload or runnable connector configuration. A delete must retain key information so the target knows which row to remove. Downstream sinks are typically handled by Kafka Connect sink connectors; don’t assume every sink is Debezium or every connector uses the same worker deployment.",
        "The source names to recognize are MySQL, MariaDB, MongoDB, PostgreSQL, Oracle, SQL Server, Cassandra, Vitess, Spanner, and Informix. In the checked Debezium 3.6 catalog, Vitess and Informix are marked incubating; the others have source-connector pages, but prerequisites, deployment models, and support vary. MongoDB, for example, uses change streams, and Spanner has its own change streams; don’t apply the PostgreSQL WAL model to every database. Before a real deployment lab, select compatible database/connector versions and read that connector’s instructions.",
        "Kafka’s Challenges appears in the source agenda without a dedicated chapter. This supplementary synthesis connects the problems already encountered: a hot key congests one partition, too many partitions increase overhead, slow consumers accumulate lag, finite retention limits replay, schema changes can break consumers, and retries can repeat effects outside a transaction. Monitor lag/ISR, manage schemas and permissions, measure real workloads, and choose keys/retry policies around business requirements. Kafka decouples systems; operational responsibility remains."
      ],
      cards: [
        {
          title: "🧩 Follow the change all the way",
          text: "Step through INSERT → UPDATE → DELETE in the lab, selecting each CDC approach. Then compare history retained by time, size, and compaction. These are small models with explicit assumptions; a correct final state doesn’t prove every intermediate event was retained."
        }
      ],
      table: {
        headers: [],
        rows: []
      },
      flow: [
        "Database / transaction log",
        "Debezium source connector",
        "Kafka: change events",
        "Kafka Connect sink connector",
        "Target: database / warehouse / storage"
      ],
      figures: []
    }
  ],
  summaryTitle: "The map to take with you",
  summary: [
    "Sources set quality, speed, and integration constraints. Governance crosses every layer.",
    "File/batch ingestion and change-based CDC serve different rhythms; timestamp polling may miss hard deletes.",
    "Topics organize; partitions provide parallelism and local ordering; offsets track positions. Groups divide work and maintain separate progress.",
    "Replication and acks have conditions. Commit and effect are separate; safe retry requires the right boundary.",
    "Retention keeps finite history; compaction keeps keyed state. Debezium turns source changes into events for downstream systems."
  ],
  checkTitle: "Self-check",
  checks: [
    "I can explain staging, warehouses, marts, and the 5 governance responsibilities.",
    "I can distinguish file format, data structure, and OLTP/OLAP.",
    "I can explain why timestamp polling misses hard deletes.",
    "I can assign 3 partitions to 4 consumers and read lag using next-position markers.",
    "I can distinguish producer idempotence from an idempotent sink effect.",
    "I can explain failover conditions, ISR, acks, and min ISR.",
    "I can compare retention/compaction and trace source → Debezium → sink."
  ],
  quizTitle: "Check the trail",
  practiceTitle: "Design your first ingestion contract",
  practice: [
    "Draw a store pipeline with a daily CSV file, an Orders DB, and application logs. Locate staging, raw data, summaries, metadata, marts, and users; assign quality checks and access controls at each stage.",
    "Design change events for order_id=42: INSERT amount=10, UPDATE amount=12, DELETE. Specify key, op, before/after, and deletion handling. Explain what polling misses, what triggers add, and what the log connector requires.",
    "Choose 3 partitions and 4 consumers. Send 6 events in the lab; record assignments, final offsets, and both groups’ progress. Change partition count and explain why you can’t promise that a key will always retain its partition.",
    "Run all 8 combinations of commit before/after × crash before/after effect × plain/deduplicating sink. Record final balances and the conditions producing 0, 10, 20. Propose checks for a real sink; don’t treat the model as production evidence."
  ],
  practiceAnswer: "Open the review criteria",
  practiceGuide: "A sound design doesn’t equate CSV with unstructured data, treat a hard-deleted row as still visible to polling, assign two consumers the same partition within one modeled group, or infer exactly-once from acks. For a crash before the effect: commit-before gives 0, commit-after gives 10. For a crash after the effect: commit-before gives 10; commit-after gives 20 without deduplication or 10 with atomic sink deduplication.",
  next: "Week 8 continues with storage: the data has arrived, and now its physical and logical shape must be chosen.",
  diagramLabel: "Illustrated path",
  codeTitle: "Simplified change event · illustrative JSON",
  lab: {
    "model": "TEACHING SIMULATION",
    "back": "Back",
    "next": "Next",
    "play": "Play",
    "pause": "Pause",
    "reset": "Reset",
    "step": "Step",
    "of": "/",
    "trace": "Complete trace",
    "empty": "No records yet",
    "event": "Event",
    "partition": "Partition",
    "offset": "Offset",
    "consumer": "Consumer",
    "state": "State",
    "balance": "Balance",
    "commit": "Next committed offset",
    "action": "What happens",
    "routingTitle": "Lab 1 · Routing and reader groups",
    "routingHelp": "Illustrated assignment: partition p belongs to consumer p modulo consumer count. Keyed routing uses the sum of character codes modulo partition count; unkeyed routing cycles by send index. These are teaching algorithms, not Kafka defaults.",
    "keyed": "Keyed",
    "unkeyed": "Unkeyed · round-robin",
    "partitions": "Partitions",
    "consumers": "Consumers / group",
    "group": "Reading group",
    "send": "Send next event",
    "read": "Read + commit per partition",
    "routingSteps": [
        "Empty log; neither group has read.",
        "The producer appends an event; its chosen partition’s offset advances.",
        "The selected group reads at most one record per partition, then commits the next position.",
        "All fixture events are sent; you can still read or go back."
    ],
    "idle": "Consumers without an assigned partition",
    "lag": "Commit-based lag",
    "routingNote": "Each loop appends all 6 events, advances Analytics to the end, then advances Fraud independently. Tabs compare 3 partitions with 3 consumers, or 4 consumers with one idle. A new loop restarts the example; Kafka reads do not erase records.",
    "crashTitle": "Lab 2 · Crash between effect and commit",
    "crashHelp": "One event e1 at offset 0 adds 10; log end = 1. Switch the commit order, crash window, and sink protection. Each scenario repeats from balance 0. The protected sink assumes atomic, durable storage of the event ID with the effect.",
    "commitBefore": "Commit before processing",
    "commitAfter": "Commit after processing",
    "crashBefore": "Crash before effect",
    "crashAfter": "Crash after effect",
    "plain": "Plain additive sink",
    "dedup": "Atomic deduplicating sink",
    "crashSteps": [
        "Ready: e1 is unprocessed; commit remains 0.",
        "Commit position 1 before the effect.",
        "Apply e1: add 10 and, if protected, store the ID with the effect.",
        "Crash: the process stops; durable effect and commit survive.",
        "Restart from the saved committed position.",
        "Replay e1: add another 10.",
        "Replay e1: its ID is already applied, so don’t add again.",
        "Commit position 1 after processing.",
        "Finished: position 1 prevents e1 from being reread."
    ],
    "cdcTitle": "Lab 3 · CDC and log memory",
    "cdcHelp": "One row id=42 undergoes three committed operations on repeat. Polling runs after each operation and updated_at always increases. The model does not simulate snapshots, rollbacks, or tied timestamps. Tabs switch capture methods.",
    "cdcModes": [
        "Timestamp polling",
        "Trigger → audit log",
        "Transaction log"
    ],
    "cdcSteps": [
        "Empty source.",
        "INSERT: id=42, amount=10, updated_at=1.",
        "UPDATE: amount=12, updated_at=2.",
        "Hard DELETE: no row remains for polling."
    ],
    "sourceRow": "Current source table",
    "captured": "Captured changes",
    "notCaptured": "Not captured",
    "missedDelete": "Polling misses DELETE: the target copy still holds amount=12 without separate reconciliation/deletion handling.",
    "retentionTitle": "Try a retention policy",
    "retentionModes": [
        "Keep all",
        "By time",
        "By size",
        "Compaction completed"
    ],
    "retentionHelp": "Separate fixture: four records at offsets 0–3, each 1 MB, aged 9/6/2/1 days with keys A/B/A/C. The illustrative limits keep age ≤ 7 days or the two newest records within 2 MB. This is idealized record filtering; Kafka deletes segments and its cleaner doesn’t run instantly.",
    "retained": "Retained offsets",
    "retentionNote": "Completed compaction on this fixture retains the latest A/B/C: offsets 1, 2, 3. Offsets aren’t renumbered. There are no tombstones in the fixture; the chapter explains their handling.",
    "days": "Age (days)",
    "key": "Key",
    "value": "Value",
    "result": "Result",
    "finished": "Finished",
    "topicLabels": {
        "def7.sources": "Data sources",
        "def7.cdc": "CDC",
        "def7.kafka": "Kafka and consumer groups",
        "def7.delivery": "Durability and delivery",
        "def7.retention": "Retention and Debezium"
    },
    "speed": "Speed",
    "extraConsumers": "Keyed · extra consumer",
    "producer": "Producer",
    "groupProgress": "Independent group positions",
    "effect": "Durable effect",
    "durableId": "Durable event ID",
    "crashOutcomes": [
        "Effect lost · balance 0",
        "Applied once · balance 10",
        "Duplicate effect · balance 20"
    ],
    "retentionPhases": [
        "Original log · offsets stay fixed",
        "Apply the selected policy",
        "Completed policy · inspect retained offsets"
    ],
    "pruned": "Removed",
    "pending": "Pending",
    "applied": "Applied"
},
  quiz: [
    {
      topicId: "def7.sources",
      q: "A CSV file contains an Orders table with clear columns and types. Which category fits?",
      opts: [
        "Structured",
        "Always unstructured because it’s a file",
        "Cannot be batch-ingested",
        "Only usable in OLTP"
      ],
      a: 0,
      ex: "Saving data in a file doesn’t erase its row/column structure. CSV can contain structured data loaded in batches."
    },
    {
      topicId: "def7.cdc",
      q: "Polling reads only rows with a newer LAST_UPDATED. What happens when a row is hard-deleted?",
      opts: [
        "A delete event always appears",
        "The row has vanished, so deletion may go undetected",
        "An index recreates the deleted row",
        "Kafka commit automatically detects deletion"
      ],
      a: 1,
      ex: "There’s no row left to query. A soft-delete flag with an updated timestamp, audit/triggers, log CDC, or separate reconciliation provides the deletion signal."
    },
    {
      topicId: "def7.kafka",
      q: "A group has 4 consumers reading a 3-partition topic under this lesson’s model. At most how many consumers have partitions?",
      opts: [
        "1",
        "2",
        "3",
        "4"
      ],
      a: 2,
      ex: "A partition is assigned to at most one group member. With 3 partitions, at most 3 consumers have work; the remaining consumer is idle."
    },
    {
      topicId: "def7.kafka",
      q: "The log contains offsets 0–4; the group processes 0 and 1 and commits correctly. What are log end, commit, and commit-based lag?",
      opts: [
        "4, 1, 3",
        "5, 2, 3",
        "5, 1, 4",
        "4, 2, 2"
      ],
      a: 1,
      ex: "Log end is 5; the committed offset is the next position, 2. Their difference is 3. This example has no control records or compaction gaps."
    },
    {
      topicId: "def7.delivery",
      q: "Where does acks=all require acknowledgment from?",
      opts: [
        "Every broker worldwide",
        "Only the consumer",
        "Replicas in the ISR, subject to min.insync.replicas",
        "Only an external Kafka sink"
      ],
      a: 2,
      ex: "The ISR belongs to the partition being written. min.insync.replicas sets the minimum ISR size with acks=all; brokers without that replica needn’t acknowledge."
    },
    {
      topicId: "def7.delivery",
      q: "A consumer adds 10 and crashes before commit. Starting from 0, what final balance does replay produce without sink deduplication?",
      opts: [
        "0",
        "10",
        "20",
        "Retry is impossible"
      ],
      a: 2,
      ex: "The first effect survived, but the offset wasn’t committed. Replay adds another 10, giving 20. Producer idempotence doesn’t fix this repeated effect."
    },
    {
      topicId: "def7.delivery",
      q: "What establishes that a payment API outside Kafka creates only one effect?",
      opts: [
        "Producer idempotence alone",
        "A consumer group alone",
        "Longer retention alone",
        "Checking the API’s idempotency/transaction mechanism and the complete processing path"
      ],
      a: 3,
      ex: "Exactly-once needs a defined boundary. Kafka transactions don’t automatically include the effects of an external service."
    },
    {
      topicId: "def7.retention",
      q: "A consumer has read the whole topic. Are its records deleted immediately?",
      opts: [
        "Yes, reading means deletion",
        "No; retention/compaction controls what is retained",
        "Yes, with Debezium",
        "They always remain forever"
      ],
      a: 1,
      ex: "Reading progress is independent of retention. Other groups can replay while records remain; there’s no promise of permanent retention."
    }
  ]
} satisfies typeof VI;

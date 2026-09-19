import type { VI } from './lesson08.text.vi';

export const EN = {
  badge: 'WEEK 8 · DEF',
  title: 'Storage — giving data a memory',
  eyebrow: 'PART III / THE DATA JOURNEY',
  hero: 'The data arrived.<br /><em>Trust hasn\'t.</em>',
  intro: 'By morning, the orders have arrived. Thousands of files sit safely in storage, yet the analyst still can\'t report yesterday\'s revenue. One file has no owner. Another uses a different schema. A third is a duplicate. I\'ll follow the steps that turn stored bytes into trustworthy records. You\'ll see that change happen through models, metadata, and rules for moving between layers.',
  meta: '10 chapters · 3 interactive labs · VI / EN',
  start: 'Start the journey',
  jump: 'Follow bronze → gold',
  premise: 'The store, records, and labs are fictional examples running in your browser. The diagrams explain mechanisms; they don\'t connect to real HDFS, cloud storage, or databases and don\'t benchmark products.',
  cover: 'Cover',
  readyTitle: 'Before opening the storage doors',
  readyLead: 'No calculus needed. You need to know how a record is identified, what a schema promises, and how a duplicate can ruin a sum. I\'ll keep this refresher short enough for you to move straight on.',
  terms: [
    ['Path · ID · metadata', 'A path locates something in a directory tree; an ID or key identifies data through the system\'s interface. Metadata describes data: type, source, owner, creation time. This lesson needs both an address and an explanation of what lives there.'],
    ['Entity · relationship · schema', 'An entity is something such as Customer or Order; a relationship describes how entities connect. A schema defines structure, types, and constraints. You\'ll use these three terms to connect a business requirement to queryable tables.'],
    ['Row · column · key', 'A row is a record; a column is an attribute; a key identifies or links records. The same order_id appearing twice might be a retry, or it might represent two valid versions: you need the event\'s meaning.'],
    ['Latency · throughput', 'Latency is the wait for an operation; throughput is the amount of work per unit of time. 1 ms = 1000 μs = 1000000 ns. Knowing the units stops you from comparing a RAM read with an entire network round trip.'],
    ['Capacity · retention · raw / derived', 'Capacity is how much you can store; retention says how long to keep it; raw preserves input, while derived data is computed from it. At 10 GB/day for 30 days, the original data alone reaches 300 GB, before replicas, versions, compression, or derived results.']
  ],
  chapters: [
    {
      title: 'The same bytes, different homes',
      lead: 'Product images, shared files, and database pages are all bytes. Force them to use the same reading and editing interface, though, and at least one of them will struggle.',
      body: [
        '<strong class="def-term">Storage</strong> preserves information over time so other systems can find, read, and use it. A successful write is only the first promise: you still need to know where the data lives, who can read it, what unit can be changed, and what happens when a machine fails. I choose the access interface before choosing a service name.',
        '<strong class="def-term">File storage</strong> organizes files in a directory tree, addressed by paths such as /sales/2026/orders.csv. The filesystem tracks names, permissions, timestamps, and allocation information; NAS shares files over a network, often through NFS or SMB. It\'s useful when applications need directories, file operations, and collaboration within a shared namespace.',
        '<strong class="def-term">Block storage</strong> exposes a range of addressable blocks for an operating system or database to read and write. A filesystem above it turns blocks into files; the block device itself doesn\'t know which blocks contain orders or images. Local disks and SAN volumes are examples. Databases often need these small, random updates, alongside suitable durability and I/O guarantees.',
        '<strong class="def-term">Object storage</strong> addresses objects by keys within buckets; an object contains data and metadata. A key such as sales/2026/orders.parquet may look like a path, but / usually just marks a key prefix, not a POSIX directory. Common object interfaces read or replace objects; changing a field usually requires writing a new object version or using a table layer above it. Some services offer specialized capabilities, so check the actual API you use.',
        'These three models describe <strong class="def-condition">interfaces and access units</strong>, not three different physical materials. A file server also uses blocks underneath; a lake may use objects underneath. In the lab, switch workloads and follow the address, metadata, and update unit. You\'re choosing a way to work, not awarding a speed medal to a name.'
      ],
      cards: [
        { title: '🗂 Choose for the job', text: 'Shared files need suitable directory and file-locking semantics. Databases need checks for random I/O, latency, and durable writes. Images, backups, and lake data often suit object storage. A conclusion only means something alongside object size, read/write patterns, networking, durability, and operating costs.' }
      ],
      table: {
        headers: ['Axis', 'File', 'Block', 'Object'],
        rows: [
          ['Address / structure', 'Path; directory tree', 'Block address; volume', 'Bucket + key; object namespace'],
          ['Metadata', 'Names, permissions, timestamps; filesystem metadata', 'Device metadata; meaning managed above', 'System metadata and user-defined metadata'],
          ['Modification', 'Read/write file ranges through the API', 'Read/write block ranges', 'Usually replace an object or create a new version'],
          ['Latency', 'Depends on filesystem, NAS, and network', 'Can suit low-latency random I/O', 'Often includes request/network overhead; suits object access'],
          ['Scaling', 'Depends on namespace, servers, and distributed design', 'Depends on volume, IOPS, and system limits', 'Often scales many objects across machines'],
          ['Cost', 'Capacity, servers/services, operations', 'Capacity, provisioned IOPS/throughput', 'Capacity, requests, retrieval, and data transfer'],
          ['Applications', 'Shared files, application directories, NAS', 'Database or VM disks/volumes, SAN', 'Media, backup, archive, data lake storage']
        ]
      }
    },
    {
      title: 'Memory buys speed, not permanence',
      lead: 'A shopping page reads the same product price thousands of times. Keeping a copy in RAM shortens the trip, but when the price changes, that copy may still tell yesterday\'s story.',
      body: [
        'A <strong class="def-term">cache</strong> keeps data so the next access takes less work. A cache hit finds the copy; a cache miss requires reading the source or recomputing it. RAM is fast but finite, and usually costs more per unit of capacity than disk. Eviction frees space, and TTL limits a copy\'s lifetime; neither automatically keeps the cache synchronized with its source.',
        'The latency ladder helps you see orders of magnitude: CPU caches operate around ns, RAM often takes tens to hundreds of ns, SSD access can fall in the μs range, and spinning disks in the ms range. A network service adds transport, queues, and software. This is an illustration, <strong class="def-condition">not a benchmark or a promise for every device</strong>. I don\'t advertise an entire API\'s latency using the time to read a RAM location.',
        'One illustrative ladder places L1 at 1 ns, L2 at 10 ns, and RAM at 100 ns; after the 1 μs marker come network access at 10 μs, SSD at 100 μs, a database insert at 1 ms, an HDD seek at 10 ms, and a California–Netherlands–California round trip at 100 ms. The 1 s marker leads to retry/refresh at 10 s. These numbers sit together to convey the scale of waiting, not predict real operations; network distance, payload, durability, and load can change the result substantially.',
        'Redis/Memcached, a 1 Gbps network, RocksDB, PostgreSQL, Zoom, and Grafana are application annotations on the same ladder. 1 Gbps is bandwidth, not latency; a database insert depends on commit and durability settings; retry/refresh also reflects application decisions. You need measurements from your own workload before choosing tools.',
        'Redis provides server-side data structures, TTL, replication, and persistence options such as RDB snapshots or AOF. Redis Cluster shards data using hash slots; replication is generally asynchronous, so you still need to evaluate possible lost writes during failover. Redis Pub/Sub is a notification channel, not a durable replayable log like a retained stream.',
        'Memcached focuses on simple key–value caching; clients commonly decide how to distribute keys across servers. Its usual design doesn\'t include built-in replication, durable snapshots, or Pub/Sub. Features such as extstore or warm restart don\'t turn it into a general-purpose durable database. Hazelcast is a distributed platform with IMap, partitions, backups, and other structures/services; persistence, consistency, and pub/sub depend on configuration, APIs, and version/edition.',
        'In a real system, I document the authoritative source and how cache entries change when data changes: invalidation, updating copies, TTL, or a combination. If Redis or Hazelcast holds important state, you need a separate durability and recovery design. Replication doesn\'t mean every write is already safe on disk.'
      ],
      cards: [
        { title: '⚡ A fast read can still be wrong', text: 'TTL doesn\'t solve every freshness requirement: if a price changes just after caching, the copy can stay stale until invalidated or expired. Choose an acceptable staleness limit first, then design the cache policy around it.' }
      ],
      table: {
        headers: ['Axis', 'Redis', 'Memcached', 'Hazelcast'],
        rows: [
          ['Data types', 'Strings, hashes, lists, sets, and other structures', 'Key → opaque value', 'IMap and distributed structures/services'],
          ['Data distribution', 'Cluster distributes hash slots', 'Clients commonly distribute keys', 'Partitions and backups within the cluster'],
          ['Snapshots / persistence', 'RDB / AOF; configuration determines guarantees', 'Not a general-purpose durability mechanism', 'Depends on configuration, version, and edition'],
          ['Replication', 'Available; generally asynchronous', 'Not built into the usual design', 'Synchronous/asynchronous backups by configuration'],
          ['Pub/Sub', 'Available; Pub/Sub keeps no replay history', 'Not built in', 'Topic / Reliable Topic; different semantics'],
          ['Latency / performance', 'Depends on commands, payload, network, and persistence', 'Depends on hit rate, payload, clients, and network', 'Depends on partitions, backups, APIs, and network'],
          ['Typical applications', 'Cache, sessions, counters, state according to configuration', 'Caching results or recomputable data', 'Distributed caching/state and data processing']
        ]
      }
    },
    {
      title: 'Finding blocks across machines',
      lead: 'A large file has been split across machines. When you open it, the system must find the right pieces and keep reading when a machine disappears.',
      body: [
        '<strong class="def-term">HDFS</strong> divides files into large blocks distributed across DataNodes. The NameNode manages the namespace, permissions, file-to-block mappings, and replica locations. A client asks the NameNode for metadata, then <strong class="def-conclusion">reads data directly from a DataNode</strong>. The NameNode doesn\'t relay all the bytes for every read.',
        'DataNodes send heartbeats to report that they\'re alive and block reports to describe the blocks they hold. If one replica can\'t be read, the client can try another. The NameNode detects missing replicas and coordinates replacement copies according to policy. Rack awareness spreads replicas across failure domains; three copies in one rack don\'t protect against rack failure as deliberately distributed copies can.',
        'Historical examples often use <strong class="def-term">64 MB</strong> blocks. The default dfs.blocksize in <strong class="def-condition">Hadoop 3.4.2 is 128 MiB</strong>, and it\'s configurable; it isn\'t a constant across all HDFS deployments. Large blocks reduce lookup overhead and suit sequential reads of large files. Many small files burden metadata, while random updates to individual bytes aren\'t HDFS\'s design strength.',
        'In streaming systems, recent data and long-term history may occupy different storage tiers. Kafka <strong class="def-term">tiered storage</strong> moves eligible log segments to remote storage according to configuration while keeping them within the Kafka log lifecycle. Consumers can read history through that mechanism. Remote reads still use serving resources and have different latency; remote storage doesn\'t erase every cost.',
        'A separate sink that sends events to a lake or warehouse for historical scans and analytics is <strong class="def-term">offload</strong>, distinct from tiered storage. It has its own schema, freshness, permissions, and retention, and replication lag needs monitoring. Week 7 moved orders out of the source; here you decide the contract for keeping and serving that copy.',
        'Source system and storage are roles, not mutually exclusive product categories. A source database stores data too. But the operations team may own the order lifecycle at the source, while the data team owns analytical history. I always record who may update, delete, and restore data in each place; an analytical copy doesn\'t automatically become the authority for transactions.'
      ],
      cards: [
        { title: '🧭 Follow a read', text: 'The client requests block locations → receives replica locations → reads a DataNode → tries another replica if needed. Heartbeats and block reports are background management traffic. Keep them separate from the data flow in the diagram so you don\'t mistake the NameNode for a pipe carrying the file.' }
      ],
      table: {
        headers: ['Role', 'Holds or decides', 'Don\'t infer'],
        rows: [
          ['NameNode', 'Namespace, permissions, file–block mapping, replica locations and policy', 'Every byte must pass through the NameNode'],
          ['DataNode', 'Blocks and read/write serving; heartbeats, block reports', 'One failed machine means the entire file is lost'],
          ['Kafka tiered storage', 'Local/remote log segments within Kafka\'s lifecycle', 'You now have a warehouse for SQL queries'],
          ['Separate historical sink', 'A copy using the destination\'s model and retention', 'The copy is always fresh or has the source\'s permissions']
        ]
      }
    },
    {
      title: 'Stored data isn\'t yet a shared truth',
      lead: 'Sales counts revenue when an order is placed. Finance counts it when payment arrives. Putting both tables in a warehouse doesn\'t make the two numbers promise the same thing.',
      body: [
        'A <strong class="def-term">data warehouse</strong> organizes integrated data, often with history, for analytics and reporting. A single source of truth is a goal for trustworthy definitions and figures, not magic produced by collecting files in one place. You need to agree on what revenue means, what data has arrived, when it was updated, and who is responsible.',
        'You can read the path as a sequence: business requirements → data model → related datasets → access permissions → reports. The model expresses that a Customer places an Order; datasets make that relationship concrete; permissions limit who sees sensitive columns; reports apply agreed definitions. I keep each step visible because a modeling mistake often surfaces only after the dashboard looks polished.',
        'A <strong class="def-term">conceptual model</strong> describes entities and relationships in business language without choosing a database system. A logical model clarifies attributes, identifiers, cardinality, and relationships while remaining independent of specific physical storage choices. A physical model implements those choices in a target engine through tables, types, keys, constraints, and access structures.',
        'For example, a Customer can have many Orders, and each Order in this model belongs to one Customer. The logical model identifies customer_id as the link. The physical model might use BIGINT, DECIMAL, NOT NULL, and indexes suited to the workload. Foreign-key, uniqueness, and constraint enforcement varies by database system; writing a rule in documentation doesn\'t mean the engine enforces it.'
      ],
      cards: [
        { title: 'Three drawings for three audiences', text: 'Conceptual models let business stakeholders review meaning; logical models let architects and engineers review structure; physical models let implementers decide details for the target system. I don\'t skip conceptual modeling just because I can write CREATE TABLE: valid SQL can still describe the business incorrectly.' }
      ],
      table: {
        headers: ['Level', 'Purpose / focus', 'Audience', 'Customer–Order example'],
        rows: [
          ['Conceptual', 'Agree on business entities and relationships', 'Business stakeholders, product owners, architects', 'A Customer places an Order'],
          ['Logical', 'Attributes, identifiers, cardinality; engine-independent', 'Data modelers, architects, engineers', 'Customer(customer_id); Order(order_id, customer_id, amount)'],
          ['Physical', 'Tables, types, keys, constraints, indexes/partitions for the engine', 'Data engineers, DBAs, operators', 'customer_id BIGINT; amount DECIMAL; NOT NULL rules']
        ]
      }
    },
    {
      title: 'Shape the model around the question',
      lead: 'You want revenue by product, region, and month. A transactional table can record every change without necessarily having a shape that makes that question easy.',
      body: [
        'A <strong class="def-term">fact</strong> records measurements or events at a defined grain; a <strong class="def-term">dimension</strong> holds descriptive attributes for filtering, grouping, and explaining facts. An OrderLine fact might have one product line per order as its grain; quantity and line_amount are measures, while Product, Customer, and Date are dimensions. Set the grain before summing, or you might add an order total repeated on every line item.',
        'A <strong class="def-term">star schema</strong> places a fact table in the center, linked directly to dimensions. A Product dimension may keep the category name in the same table. Fewer join steps and an understandable structure often suit BI, in exchange for repeated descriptive attributes. Deliberate repetition within a dimension is a design decision, not automatically dirty data.',
        'A <strong class="def-term">snowflake schema</strong> normalizes dimensions into related tables, such as Product → Category or Store → City → Region. It reduces some repetition and makes hierarchies explicit, but queries may need more joins and BI tools must understand those relationships. The word snowflake here names a data model, not the Snowflake product.',
        'I don\'t declare stars universally faster than snowflakes. The optimizer, table sizes, caches, layout, and query patterns all matter. Choose a shape that helps users join correctly, then measure real workloads. Week 11 will go deeper into grain, serving models, and history; this week you need to read both diagrams and explain their tradeoffs.'
      ],
      cards: [
        { title: '⭐ Don\'t let a join multiply revenue', text: 'If a fact row unexpectedly joins to multiple dimension rows, SUM can grow without a new order. Dimension keys and historical semantics must select the right version; a handsome star diagram doesn\'t replace cardinality checks.' }
      ],
      table: {
        headers: ['Axis', 'Star', 'Snowflake'],
        rows: [
          ['Shape', 'Fact links directly to dimensions', 'Dimensions split into subdimensions'],
          ['Dimension normalization', 'Usually more denormalized', 'More normalized'],
          ['Typical joins', 'Fewer steps', 'Additional steps through hierarchies'],
          ['Repeated attributes', 'Category/region may repeat', 'Separate tables can reduce repetition'],
          ['Use', 'Approachable for analytics and BI', 'Useful for managing shared hierarchies']
        ]
      }
    },
    {
      title: 'A data lake keeps options open',
      lead: 'Today you only count orders. Next month the ML team needs product images, logs, and data from before a correction. Keep only a revenue total, and those questions have already lost their inputs.',
      body: [
        'A <strong class="def-term">data lake</strong> holds large volumes of data in different formats and stages of processing: tables, JSON, logs, images, audio, or video. Keeping inputs close to their original form lets you reprocess them when new questions arise. Lakes often use object storage or horizontally scalable distributed systems, but the architecture also needs metadata, compute, and governance.',
        '<strong class="def-term">Schema-on-read</strong> means applying an interpretation of structure when reading data for a task. It doesn\'t mean data has no schema, needs no documentation, or can safely rely on guessed types. CSV has columns, JSON has structure, and Parquet carries a schema; source and analytical schemas still need to be understood and managed.',
        'A typical path keeps raw data, then parses, cleans, standardizes, joins, and creates datasets for ML or reports. ETL transforms before loading a destination; ELT loads first and transforms within the destination platform. You can keep raw data in a lake and load standardized tables into a warehouse; lakes and warehouses don\'t have to eliminate each other.',
        'One branch from the lake passes through preparation and validation to data science and then ML. Another passes through ETL to a database serving fast updates, reports, and BI; data marts provide domain views. Freshness depends on the entire pipeline, so a real-time database label doesn\'t turn daily ETL into instant data.',
        'Warehouses commonly provide controlled tables and an optimized SQL/BI experience. Lakes prioritize retaining many data types and keeping processing choices separate. However, modern warehouses can also support semi-structured data, and lakes with well-managed tables can serve fast SQL. Cheap storage doesn\'t guarantee a cheap system: scans, compute, requests, transfer, and operational work still count.',
        'Delta Lake is an example of a table layer that adds a transaction log and capabilities such as ACID, schema checks, or versioning to data in a lake. It helps bridge raw files and reliable tables, but it doesn\'t define revenue or repair bad inputs for you. <a href="#ch09">Chapter 09</a> separates storage, tables, and compute.'
      ],
      cards: [
        { title: 'Keep raw data for a reason and a period', text: 'Raw data supports audits and replay, but retaining everything forever raises costs and access risks. I record purpose, ownership, retention, and handling of sensitive data at the input layer, before naming a bucket.' }
      ],
      table: {
        headers: ['Axis', 'Typical lake', 'Typical warehouse'],
        rows: [
          ['Data types', 'Structured, semi-structured, unstructured', 'Primarily tables; may support semi-structured data'],
          ['Formats', 'Many files/objects, original or standardized forms', 'Engine-managed tables; format depends on the system'],
          ['Schema', 'Interpretation at read time; tables still have schemas', 'Table schemas are defined and managed'],
          ['Applications', 'Exploration, raw processing, ML, analytics', 'SQL, reporting, BI, shared metrics'],
          ['Cost', 'Storage can be cheap; compute and operations still matter', 'Depends on compute/storage and pricing model'],
          ['Performance', 'Depends on format, partitions, tables, and compute', 'Depends on engine, model, workload, and resources']
        ]
      }
    },
    {
      title: 'When a data lake becomes a swamp',
      lead: 'The final_v2_final folder sits beside final_really_final. Every file opens; nobody dares use one. The data hasn\'t lost a byte, but it has lost the ability to answer.',
      body: [
        'A <strong class="def-term">data swamp</strong> develops when accumulated data becomes so hard to find, understand, and trust that its usefulness declines. Missing metadata breaks discovery; missing governance leaves permissions and policies unclear; poor quality produces missing, incorrect, duplicated, or inconsistent data. These are different problems, not something a universal clean-up button can fix.',
        'Without an owner, nobody is accountable for decisions and quality. Without a steward, definitions, documentation, and everyday management get neglected. Without a schema or schema documentation, amount can change units without users knowing. Without discovery, integration, and monitoring tools, faults stay hidden and users create more copies themselves.',
        'The failures reinforce each other: difficult discovery → another download → duplication and wasted storage → reconciliation work → slow analysis → decisions based on untrustworthy data. Sensitive data without suitable permissions, or retained beyond its purpose, also creates security and compliance risks; specific requirements depend on the policies applicable to the organization.',
        'In the lab, you\'ll enable measures one at a time and inspect the remaining faults. A catalog helps you find datasets but doesn\'t certify every value. Assigning an owner provides accountability but doesn\'t automatically fix schemas. I want you to identify <strong class="def-conclusion">which cause a measure addresses and which causes remain</strong>, instead of trusting a single aggregate quality score.'
      ],
      cards: [
        { title: '🔎 A name isn\'t yet a meaning', text: 'You may find the orders dataset while amount is changing from individual dong to thousands of dong. Search tags won\'t detect that semantic change. Contracts, owners, and targeted checks need to work together to prevent the dashboard from adding the wrong amounts.' }
      ],
      table: {
        headers: ['Cause', 'Symptom', 'Consequence'],
        rows: [
          ['Missing metadata', 'Unknown source, column meanings, or freshness', 'Hard to find, understand, and reuse'],
          ['Missing governance', 'Unclear permissions, retention, and policies', 'Improper access, excessive retention, compliance risks'],
          ['Poor quality', 'Nulls, wrong types, duplicates, inconsistent figures', 'Unreliable analysis and decisions'],
          ['No owner / steward', 'Nobody knows who should resolve an incident', 'Persistent faults and neglected definitions'],
          ['Missing schema documentation', 'Names/types/units change without notice', 'Broken pipelines or silent misinterpretation'],
          ['Missing tools', 'Manual discovery, profiling, and monitoring', 'Extra copies, wasted storage and time']
        ]
      }
    },
    {
      title: 'Give each dataset an owner and a trail',
      lead: 'After an incident, the data team has found the bad file. The harder part is knowing who receives the alert, which reports are affected, and how to stop it happening again next week.',
      body: [
        'A <strong class="def-term">catalog</strong> stores metadata for finding and understanding datasets. Automated collection can discover schemas, locations, and sources; owners/stewards still need to add business meanings, sensitivity, freshness commitments, and usage rules. AWS Glue Data Catalog, Apache Atlas, and Amundsen are examples with different scopes, not interchangeable copies of the same tool.',
        'In one AWS example, data lives in S3 and IAM defines permissions; a crawler reads the source and updates supported metadata/statistics in Glue Data Catalog. Athena or Redshift Spectrum uses the catalog to understand and query data. EventBridge can schedule work and Lambda can trigger automation. The catalog holds descriptions, not a copy of all the data, and doesn\'t automatically detect every semantic change.',
        '<strong class="def-term">RBAC</strong> grants access by role, alongside least privilege and enforcement at the appropriate storage, engine, or catalog. Lineage records which datasets depend on which sources and transformations; when amount changes, you can trace affected aggregates and dashboards. Lineage helps investigation; it doesn\'t automatically make incorrect data correct.',
        '<strong class="def-term">Profiling</strong> examines distributions, nulls, unusual values, and duplicates to understand data; validation checks specific expectations. Great Expectations (GX) supports expectation checks, while observability platforms such as Monte Carlo monitor anomalous signals according to their integrations. Checking that amount is numeric won\'t catch every order entered with the wrong price: rules need business meaning.',
        'Separate raw, cleansed, and curated zones make readiness explicit. A <strong class="def-term">data contract</strong> should record fields, types, units, keys, freshness, ownership, and change handling. Schema evolution supports controlled changes: Avro considers writer/reader schema compatibility; Delta provides enforcement/evolution mechanisms depending on the operation. Adding a field doesn\'t mean every old consumer can read it, and automatic schema acceptance doesn\'t replace compatibility checks.',
        'Avro is a schema/serialization mechanism, not a schema registry or governance system by itself. A registry can hold schema versions and check compatibility; producers/consumers or serializers consult it when needed. Don\'t draw the registry as a mandatory station through which every byte passes from Kafka to consumers: data and schema metadata take different paths.',
        'Domain and sensitivity tags make discovery meaningful. Airflow can orchestrate jobs and report their status; OpenLineage describes lineage events through integrations. A successful job can still produce an empty or stale table, so you need dataset freshness and volume/result checks. Alerts should reach an accountable person with a response procedure; profiling/validation results need logs and documentation updates so the next investigation has evidence.',
        'The lifecycle runs from create/capture → store/organize → use/share → archive/retain → delete. Retention says how long to keep data for its purpose and policies. Archiving changes where/how it\'s kept; deletion removes it through a defined process. Both must consider copies, snapshots, and recovery. I test restoration and replay before trusting a backup, then document recovery limits so users don\'t have to guess.'
      ],
      cards: [
        { title: 'A contract you can act on', text: 'For Orders: order_id must be present; amount is a positive integer in VND; Sales Data owns it; freshness and retention have agreed limits. Violations go to quarantine with reasons, the owner receives alerts, and downstream users can see what hasn\'t been accepted.' }
      ],
      table: {
        headers: ['Measure', 'What it can do', 'What it doesn\'t do automatically'],
        rows: [
          ['Catalog + tags + documentation', 'Discovery of datasets, schemas, and meaning', 'Guarantee all actual values are correct'],
          ['Owner + steward', 'Assign accountability and operational contacts', 'Automatically clean every row'],
          ['RBAC', 'Limit operations by role', 'Define the meaning of revenue'],
          ['Profiling + validation', 'Detect anomalies and rule violations', 'Prove every real-world fact'],
          ['Contract + schema evolution', 'Manage changes under defined conditions', 'Guarantee compatibility without checking consumers'],
          ['Lineage + freshness alerts', 'Trace impact and detect delayed data', 'Fix upstream or recompute every table'],
          ['Retention + archive / delete', 'Manage lifecycle and cost', 'Remove every copy without a designed process']
        ]
      }
    },
    {
      title: 'One platform, several kinds of analysis',
      lead: 'Analysts want SQL, the ML team wants detailed data, and the business wants trustworthy reports. Creating a separate copy for each team makes synchronization increasingly difficult.',
      body: [
        'A <strong class="def-term">lakehouse</strong> combines a lake\'s flexible storage with table-management and analytical-serving capabilities commonly associated with warehouses. Structured, unstructured, and streaming sources enter the platform; managed tables help SQL/BI and ML use data with clearer definitions, schemas, and versions.',
        'Separate three responsibilities: <strong class="def-term">storage</strong> holds objects/files; a <strong class="def-term">table format</strong> manages table metadata and state; <strong class="def-term">compute</strong> reads, transforms, and queries. For example, object storage holds Parquet files, Delta Lake or Apache Iceberg supplies the table layer, and Spark or a compatible engine performs computation. Parquet is a file format, not a complete transaction system by itself.',
        'Capabilities such as ACID, schema enforcement/evolution, snapshots, and versioning depend on the table format, engine, and supported operations. Time travel also depends on retained history and files; deleting old files can make an earlier version unreadable. I avoid promising that one bucket instantly provides every database guarantee.',
        'Analysts explore tables, business teams read BI, data engineers maintain pipelines, and data scientists create features and models. Sharing a storage foundation doesn\'t force everyone to read the same raw table. You still need purpose-appropriate datasets, access permissions, quality, and compute resources for each workload.',
        'A lakehouse doesn\'t automatically guarantee fast queries or simple operations either. Tiny files, skewed partitions, unwieldy metadata, and unsupported engine features can still cause trouble. The next chapter organizes the journey into layers with clear responsibilities, building reliability step by step.'
      ],
      cards: [
        { title: 'Three layers need separate answers', text: 'Where does the data live? Which table has a valid version? Which engine can read and update that version? If you answer all three with a single logo, reopen the diagram and find the hidden responsibilities.' }
      ],
      table: {
        headers: ['Layer', 'Responsibility', 'Examples'],
        rows: [
          ['Storage', 'Hold bytes, provide file/object access, configured durability', 'Object storage, distributed filesystems'],
          ['File format', 'Encode/lay out data within a file', 'Parquet'],
          ['Table format', 'Table state, metadata, supported snapshots/transactions', 'Delta Lake, Apache Iceberg'],
          ['Compute', 'Transform, join, aggregate, and query', 'Spark, compatible SQL engines'],
          ['Consumption', 'Use data according to purpose and permissions', 'SQL/BI, analytics, ML']
        ]
      }
    },
    {
      title: 'Three layers, growing responsibilities',
      lead: 'Five incoming rows don\'t mean five orders should contribute money. One is a retry, one has a bad amount, and one lacks a key. Folder names such as bronze, silver, and gold haven\'t resolved any of them.',
      body: [
        '<strong class="def-term">Multi-hop</strong> organizes data through several steps with clear responsibilities. <strong class="def-term">Medallion</strong> commonly names increasing levels of refinement bronze → silver → gold. It\'s an architectural pattern for both batch and streaming, not a requirement to use exactly three buckets or three products.',
        '<strong class="def-term">Bronze</strong> preserves inputs close to their source structure, with ingestion metadata such as load time, process ID, source, or event position. It supports CDC archives, audits, and replay. Keeping raw data doesn\'t mean abandoning permissions, retention, or checks for complete ingestion; data that hasn\'t been cleaned needs clear labeling.',
        '<strong class="def-term">Silver</strong> parses types, checks keys, cleans, deduplicates, matches/merges, standardizes, and integrates sources into more trustworthy datasets. It may use 3NF where appropriate for the domain; 3NF isn\'t a requirement for the silver label. Violations go to quarantine with reasons, while duplicates leave a processing trail that explains the counts.',
        '<strong class="def-term">Gold</strong> publishes data for particular domains and questions: star tables, OBT (one big table), aggregates, analytical features, or ML features. Design prioritizes read patterns, measure definitions, and users\' quality rules. Gold needn\'t consist only of aggregates; good gold data fulfills its serving contract.',
        'The lesson fixture keeps 5 bronze rows: order_id 101 with amount 120000; an identical retry of 101; order_id 102 with 80000; order_id 103 with an invalid amount type; and a row missing order_id with 50000. Acceptance requires a present key and a positive integer amount in VND. The result is <strong class="def-conclusion">2 silver orders, 2 quarantined rows, 1 duplicate, and gold of 200000 VND</strong>. The counts reconcile to the 5 input rows; no invalid row silently vanishes.',
        'Open the lab, change the checks, and run it again to see why revenue changes. Replay here reprocesses the same 5 retained bronze rows: the lab remembers processed raw-row IDs, skips them on replay, and preserves silver, quarantine, and the duplicate log; it recomputes and replaces gold from accepted silver, so the total stays 200000. Appending results or adding again to the old total would multiply money. Real CDC with multiple valid versions also needs event identity, ordering/version, and update rules; you can\'t discard every repeated order_id as though all of them were retries.'
      ],
      cards: [
        { title: '🥇 Gold is a conditional promise', text: 'I sum only accepted orders in this fixture, all in VND and without refunds. To call this production revenue, you must also define order status, refunds, taxes, business time, and late data. Correct arithmetic alone doesn\'t make a correct metric.' }
      ],
      table: {
        headers: ['Layer', 'Contract', 'Trail to retain'],
        rows: [
          ['Bronze', 'Keep inputs close to source form; define access and retention', 'Source, load time, process ID, position/event'],
          ['Silver', 'Valid types/keys, dedup, match/merge, and rule-based integration', 'Accepted rows, quarantine, reasons, and duplicate log'],
          ['Gold', 'Domain datasets with clear measures and read patterns', 'Definitions, versions, lineage, and reconciliation checks'],
          ['Replay', 'Reprocess retained inputs without multiplying effects', 'Stable identity, idempotent writes, or safe recomputation']
        ]
      }
    }
  ],
  summaryTitle: 'The map to take with you',
  summary: [
    'File, block, and object differ in interface, metadata, and update unit; choose for the workload and total cost.',
    'Caches need freshness and recovery policies. HDFS separates NameNode metadata from data read at DataNodes.',
    'Conceptual, logical, and physical are three levels of clarifying a model. Facts have a grain; dimensions explain facts.',
    'Lakes preserve options, but metadata, ownership, quality, permissions, and retention preserve usability.',
    'Lakehouses coordinate storage, table formats, and compute. No layer automatically replaces all the others.',
    'Bronze keeps inputs; silver accepts by rules; gold serves by definitions. Correct replay must preserve correct results.'
  ],
  checkTitle: 'Self-check',
  checks: [
    'I can choose file/block/object based on a workload\'s addressing, update units, latency, and cost.',
    'I can distinguish cache hits, staleness, eviction, persistence, and replication.',
    'I can trace an HDFS read and explain NameNodes, DataNodes, replicas, heartbeats, and block reports.',
    'I can distinguish conceptual/logical/physical models and draw facts and dimensions at a defined grain.',
    'I can identify each swamp cause separately and explain which measures leave it unresolved.',
    'I can assign ownership, contracts, lineage, freshness alerts, and retention to a dataset.',
    'I can reconcile 5 bronze rows into 2 silver rows, 2 quarantined rows, 1 duplicate, and a total of 200000.'
  ],
  quizTitle: 'Check the storage contract',
  quiz: [
    { topicId: 'def8.storage', q: 'An application needs small, random updates to a database volume. Which interface is worth considering first?', opts: ['Objects that can only be replaced as a whole', 'Block storage', 'A search catalog', 'A gold table'], a: 1, ex: 'Blocks allow reads/writes to addressable regions. You still need to check latency, IOPS, durability, and database requirements; the block label doesn\'t guarantee performance.' },
    { topicId: 'def8.cache', q: 'A product price changes at the source while its cached copy still has TTL remaining. Which conclusion is correct?', opts: ['The cache has definitely changed too', 'Replication detects every source change automatically', 'The cache may return the old price unless updated or invalidated', 'A cache hit proves the value is current'], a: 2, ex: 'TTL limits a copy\'s lifetime rather than synchronizing every change. You need an update/invalidation policy and an acceptable staleness bound.' },
    { topicId: 'def8.hdfs', q: 'During an HDFS read, where does the client get file bytes after receiving block locations?', opts: ['A DataNode holding a replica', 'Always through the NameNode', 'Only from block reports', 'Only from the business catalog'], a: 0, ex: 'The client asks the NameNode for metadata, then reads a DataNode. Heartbeats and block reports manage the cluster; they don\'t replace the data-read path.' },
    { topicId: 'def8.modeling', q: 'Choosing BIGINT, DECIMAL, and indexes for a target engine belongs to which modeling level?', opts: ['Conceptual', 'Engine-independent logical', 'Only a business description', 'Physical'], a: 3, ex: 'Physical modeling implements structure on the target engine. Conceptual describes entities/relationships; logical clarifies attributes and links without fixing physical storage.' },
    { topicId: 'def8.schemas', q: 'Product splits Category into a separate table, creating Fact → Product → Category. What changed?', opts: ['The dimension was normalized into a snowflake', 'Every fact became a raw file', 'The star always stays unchanged', 'Joins disappeared'], a: 0, ex: 'Snowflaking splits dimensions into related tables. It can reduce repeated attributes but adds join steps; performance still depends on the workload.' },
    { topicId: 'def8.lake', q: 'What does schema-on-read mean in a data lake?', opts: ['Schema documentation is unnecessary', 'All data is unstructured', 'Applying an interpretation of structure when reading for a task', 'Quality checks are forbidden'], a: 2, ex: 'Source data and files can still carry schemas. Schema-on-read doesn\'t remove the need for contracts, documentation, or compatibility checks.' },
    { topicId: 'def8.governance', q: 'A catalog and owner exist, but amount still contains an invalid string type. Which measure directly addresses this fault?', opts: ['Adding search tags', 'Type validation and quarantine with reasons', 'Renaming the bucket', 'Only increasing retention'], a: 1, ex: 'A catalog supports discovery; an owner accepts responsibility. Type checks detect the amount violation, and quarantine retains the bad row for investigation, correction, or reprocessing.' },
    { topicId: 'def8.lakehouse', q: 'Which statement correctly separates lakehouse layers?', opts: ['Parquet executes every table transaction by itself', 'Object storage defines revenue automatically', 'Compute only stores bytes and never queries', 'Storage holds bytes, table formats manage tables, compute processes/queries'], a: 3, ex: 'These responsibilities cooperate but differ. Transaction, schema, and versioning capabilities also depend on the table format, engine, and supported operations.' },
    { topicId: 'def8.medallion', q: 'Under the exact rules of the 5-row fixture, which result is correct?', opts: ['5 silver, gold 370000', '2 silver, 2 quarantined, 1 duplicate, gold 200000', '3 silver, gold 250000', '2 silver, no trail of excluded rows'], a: 1, ex: '101 contributes 120000 once; 102 contributes 80000. The retry of 101 is a duplicate; the bad amount and missing key go to quarantine. The accepted total is 200000.' },
    { topicId: 'def8.medallion', q: 'What happens when you reprocess the same retained bronze using idempotent silver writes and recompute gold from valid silver?', opts: ['Gold stays at 200000 for this fixture', 'Gold must double', 'All bronze must be deleted', 'Every repeated order_id event in every system is discarded'], a: 0, ex: 'Safe replay doesn\'t multiply the effects of the same inputs. The fixture has only an identical retry; real CDC must distinguish valid versions using event identity and ordering/version.' }
  ],
  topicLabels: {
    'def8.storage': 'File · block · object',
    'def8.cache': 'Caching and freshness',
    'def8.hdfs': 'HDFS and historical storage',
    'def8.modeling': 'Three modeling levels',
    'def8.schemas': 'Star and snowflake',
    'def8.lake': 'Lakes and warehouses',
    'def8.governance': 'Swamps and governance',
    'def8.lakehouse': 'Lakehouse layers',
    'def8.medallion': 'Bronze · silver · gold'
  },
  practiceTitle: 'Design storage you can explain',
  practice: [
    'Draw the path for Orders files, product images, and update events. Choose file/block/object for each role and explain the read/write patterns, metadata, costs, and durability you need to check.',
    'Draw Customer–Order at the conceptual/logical/physical levels; choose the analytical fact grain, then draw a star and a snowflake. State which measures can be summed.',
    'Define bronze/silver/gold for the 5-row fixture. At each layer, record schema, ownership, permissions, retention, lineage, and quality rules; retain quarantine reasons and the duplicate log.',
    'Run the fixture and reconcile both row counts and amount. Reprocess the same bronze to verify that the total stays unchanged; explain why adding again to the old total produces the wrong result.',
    'Choose one swamp fault in the lab, name a remedy and a remaining limitation. Design an alert for stale datasets even when the job succeeds, with an accountable recipient.'
  ],
  practiceAnswer: 'Open the comparison criteria',
  practiceGuide: 'Your design should separate access addressing from data format, business models from physical engines, and storage from table formats/compute. The fixture passes when bronze retains 5 rows, silver contains exactly 101 and 102, quarantine keeps the bad amount for 103 and the missing key, and the duplicate log records the retry of 101; gold = 120000 + 80000 = 200000 VND. Replaying the same inputs leaves the total unchanged. Ownership, schema, permissions, retention, and lineage need concrete responsibility; adding a catalog while skipping quality checks hasn\'t cured the whole swamp.',
  codeTitle: 'Bronze input · 5 fictional JSON rows',
  codeLead: 'Preserve the inputs for investigation. The identical retry is deliberate; the invalid amount type and missing order_id need explicit rules, not a silent conversion to 0.',
  next: 'Week 9 carries these contracts into batch processing with Spark: parsing, joining, and aggregating data that now has a home and explicit rules.'
} satisfies typeof VI;

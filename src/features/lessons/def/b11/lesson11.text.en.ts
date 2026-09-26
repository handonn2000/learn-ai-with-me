import type { VI } from './lesson11.text.vi';
export const EN = {
  "badge": "SESSION 11 · DEF",
  "title": "Consumption — give a number the right meaning",
  "hero": "The query is correct.<br /><em>Is the story?</em>",
  "intro": "A customer moves. Yesterday's transaction stays unchanged, but the report has just reassigned its revenue to the new region. Elsewhere, a model receives a feature that did not exist at prediction time. I'll help you check grain, history and time before trusting a dashboard number.",
  "meta": "10 chapters · 3 labs · 10 quiz questions · VI / EN",
  "premise": "Tables, SCD histories and features are teaching fixtures in your browser. SQL/Feast examples explain data contracts; the page does not deploy a warehouse, OLAP cluster or feature store.",
  "cover": "Cover",
  "start": "Check what the data means",
  "readyTitle": "🧭 Keys, grain and time",
  "readyLead": "You can write valid SQL and still add the wrong things. I start by asking what one row represents.",
  "terms": [
    [
      "Primary · candidate · foreign key",
      "A candidate key is a minimal set of attributes identifying a row; a primary key is one chosen candidate. A foreign key expresses a relationship; check separately whether the engine enforces it."
    ],
    [
      "Functional dependency",
      "X → Y means that X determines Y in the model. For composite keys, distinguish dependence on the whole key from dependence on only part of it."
    ],
    [
      "Grain · aggregate",
      "Grain defines what one row represents. SUM adds quantities; AVG requires correct weighting. Being numeric does not make a measure additive across every dimension."
    ],
    [
      "Effective · event · available time",
      "Effective time says when an attribute applies, event time says when an event happened, and available time says when the system could know the value. These times can differ."
    ]
  ],
  "chapters": [
    {
      "title": "A warehouse answers a different question",
      "lead": "The sales database knows the order just placed. A dashboard needs history and a shared definition of revenue.",
      "body": [
        "A data warehouse integrates data for analysis. Source → staging → transformation → warehouse → mart → user is one common path. ETL extracts from sources, transforms/validates and loads prepared data. ELT can change that order depending on the platform. Raw data, summaries and metadata have different responsibilities.",
        "<strong class=\"hl-yellow\">A single source of truth is a contract about meaning</strong>, not just a database address. I need to know whether revenue is counted at order time, payment time or after returns; ownership, freshness and quality rules must also be explicit. A warehouse is still a data system, but does not automatically replace the source’s daily transactional role.",
        "ER modeling identifies entities, attributes and relationships, often combined with normalization to reduce update inconsistencies. Dimensional modeling organizes data around analytical questions, making filtering, grouping and history easier to use. ER is not “retired” inside warehouses; integration and consumption models can coexist."
      ],
      "headers": [
        "Component",
        "Role / tradeoff"
      ],
      "rows": [
        [
          "Source / staging",
          "Extract, validate and standardize; retain provenance"
        ],
        [
          "Warehouse / metadata",
          "Integrated data and definitions, ownership and lineage"
        ],
        [
          "Mart / user",
          "Domain datasets for Sales, Purchasing and Inventory; BI, reporting and ML"
        ]
      ]
    },
    {
      "title": "Separate entities without losing an order",
      "lead": "A customer name repeats on every product line. Update one copy and forget another, and you have two truths.",
      "body": [
        "Entities include Customer, Order and Product; attributes include names, dates and prices; relationships include a customer placing an order and an order containing lines. <strong class=\"hl-yellow\">1NF</strong> requires atomic values within the domain and no repeating groups. Replace Phone1/Phone2/Phone3 with CustomerPhone(customer_id, phone); split a P01,P02 list into order lines. Atomicity depends on the domain, rather than universally prohibiting every complex type in every system.",
        "<strong class=\"hl-yellow\">2NF</strong> requires 1NF and full dependence of every non-prime attribute on every candidate key, without partial dependency. In the fixture, each product appears once per order: (order_id, product_id) determines quantity, while customer_name depends only on order_id and should be separated. If repeated products are allowed, use a suitable line_id instead of assuming that composite key always works.",
        "<strong class=\"hl-yellow\">3NF</strong> removes the problematic transitive dependency in this example: order_id → customer_id → customer_name/phone. More precisely, for each nontrivial dependency X → A, X is a superkey or A is prime (belongs to a candidate key). I keep the precise version because “no non-key depends on another non-key” is only a shortcut for simple models.",
        "Separating Customers, Products, Orders and OrderItems preserves quantities 1,2,1. Order 1001 appearing twice is not automatically a duplicate: the grain is an order line. Retain the transaction’s sale price in its fact/order line; joining today’s product price cannot reconstruct the historical sale price. Normalization changes structure, not facts."
      ],
      "headers": [
        "Component",
        "Role / tradeoff"
      ],
      "rows": [
        [
          "Customers",
          "C01 · Anna · 0901; key customer_id"
        ],
        [
          "Products",
          "P01 · Keyboard · 50; P02 · Mouse · 20; key product_id"
        ],
        [
          "Orders",
          "1001 · C01 · 2026-05-01; 1002 · C01 · 2026-05-02"
        ],
        [
          "OrderItems",
          "line 1: 1001/P01/1; line 2: 1001/P02/2; line 3: 1002/P01/1"
        ]
      ]
    },
    {
      "title": "📏 State what one row represents",
      "lead": "SUM works on both revenue and inventory; only one addition may answer the question you actually asked.",
      "body": [
        "A fact records an event or measurement at a <strong class=\"hl-yellow\">grain defined first</strong>. An order-line sales fact holds dimension keys, quantity, the transaction’s unit_price and sales_amount. Customer/Product/Date describe the context used for filtering/grouping. A factless fact can record events without numeric measures; not every fact must contain revenue.",
        "An additive measure such as revenue can sum across days: 500 + 700 = 1200, given consistent definitions and units. Semi-additive inventory snapshots 100,80,120 cannot be added over time to claim “inventory of 300”: ending inventory is 120, or the average of equally spaced snapshots is 100. Uneven snapshot intervals require time weighting. Ratios and unit prices usually need their own aggregation rules.",
        "A date dimension stores day/month/quarter/year for consistent grouping; OrderDateKey and ShipDateKey can reference the same date dimension in different roles. Dimensions are often smaller than facts and denormalized for usability, but those are not defining requirements. I check join cardinality: matching one fact to two dimension versions increases SUM without any new transaction."
      ],
      "headers": [
        "Component",
        "Role / tradeoff"
      ],
      "rows": [
        [
          "Sales fact",
          "One order line; order_line_id, customer_sk, product_sk, date_key, quantity, sales_amount"
        ],
        [
          "dimDate",
          "20260501 → 2026-05-01, month 5, quarter 2, year 2026"
        ],
        [
          "Dimension",
          "Product name, category and region; filtering and hierarchies"
        ],
        [
          "Consumption output",
          "Facts/dimensions, aggregates and analytical views with shared definitions"
        ]
      ]
    },
    {
      "title": "Model shape changes the joins",
      "lead": "The same country can repeat inside a dimension or live in its own table.",
      "body": [
        "A star connects facts directly to relatively flat dimensions. SensorMetrics might link Machine, Sensor, Location and Time; a query filters dimension attributes, joins keys and aggregates measures. The optimizer can change execution order, so the diagram expresses logical relationships rather than requiring the engine to scan the fact first.",
        "A snowflake separates hierarchies: Customer → City → State → Country. It reduces duplication of some attributes and supports hierarchy management, at the cost of more joins and BI complexity. I choose based on updates, access patterns and workload benchmarks; stars are not always faster, nor snowflakes always smaller in every engine.",
        "You need unique dimension-side keys and relationships consistent with the grain. A neat diagram cannot rescue an accidental many-to-many join. With Type 2 in the next section, the customer’s natural key is no longer unique across all versions; facts need a surrogate key or a temporal condition."
      ],
      "headers": [
        "Component",
        "Role / tradeoff"
      ],
      "rows": [
        [
          "Star",
          "Fact → Customer(region, country); fewer hops, easier use"
        ],
        [
          "Snowflake",
          "Fact → Customer → City → State → Country; hierarchy management"
        ],
        [
          "Both",
          "Check keys, grain and join cardinality; performance still depends on engine and data"
        ]
      ]
    },
    {
      "title": "🕰️ Changing attributes need a history policy",
      "lead": "Peter Pan changes preferred currency from GBP to USD. Should an old transaction change with it?",
      "body": [
        "Slowly Changing Dimensions are policies for changing dimension attributes. A <strong class=\"hl-yellow\">natural key</strong> identifies the customer in the business; a surrogate key identifies a dimension row/version. With Type 2, natural-key repetition is intentional, while the version table’s primary key is typically a surrogate key.",
        "Type 0 preserves the original value; Type 1 overwrites, which suits corrections or attributes that do not need history. Type 2 adds a row with a non-overlapping effective interval [from,to) for the business key. A transaction on 2025-09-20 uses GBP; at 2025-09-26 it uses USD. A current/active flag marks the current version, not automatically a business deletion of the customer.",
        "Type 3 stores current and one previous value, losing older history after further changes. Type 4 here means separate current and history tables; other references can use Type 4 differently. Type 6 combines Type 2 history rows, Type 1-style current values overwritten across versions, and Type 3-style previous values. State which columns are historical and which always reflect the present.",
        "I add another USD → EUR change in the lab to expose Type 3’s limitation. Type 2 retains GBP/USD/EUR by interval; Type 6 retains historical_currency on each row but sets current_currency to EUR everywhere. This is the <strong class=\"hl-yellow\">customer’s preferred currency</strong>, not a rewrite of the currency/amount recorded on a transaction."
      ],
      "headers": [
        "Component",
        "Role / tradeoff"
      ],
      "rows": [
        [
          "Type 0 / 1",
          "Preserve the original / overwrite without history"
        ],
        [
          "Type 2",
          "Add versions, surrogate keys, intervals and a current flag"
        ],
        [
          "Type 3",
          "Current + previous; limited history"
        ],
        [
          "Type 4",
          "Separate current/history tables under this lesson’s convention"
        ],
        [
          "Type 6",
          "Version history + current overwritten everywhere + previous"
        ]
      ]
    },
    {
      "title": "Separate business keys from attribute history",
      "lead": "CRM and ERP change schemas on different days. The analytical mart still needs a coherent story.",
      "body": [
        "Data Vault separates <strong class=\"hl-yellow\">hubs</strong> for business keys, <strong class=\"hl-yellow\">links</strong> for relationships and <strong class=\"hl-yellow\">satellites</strong> for attributes/history. Load dates and record sources provide provenance; load time is not automatically effective time. A new satellite can accommodate a source or attribute group without putting every change in one enormous table.",
        "For example: hub_customer, hub_order and hub_product; lnk_order_customer relates orders to customers, and lnk_order_product relates orders to products. sat_customer holds name/address, sat_product price/category, and sat_order status/total_amount. Relationships may repeat at order-line grain, so link grain must be explicit; three IDs do not necessarily express every business relationship.",
        "I treat Vault as a historical integration model, not a replacement for every mart. You still need business-key integration rules, data quality and a BI-friendly serving model. Placing Vault in silver is a choice; medallion does not require every silver table to use Vault or 3NF."
      ],
      "headers": [
        "Component",
        "Role / tradeoff"
      ],
      "rows": [
        [
          "Hub",
          "Business key + load metadata; what the entity is"
        ],
        [
          "Link",
          "Related hub keys + grain/metadata; which relationship exists"
        ],
        [
          "Satellite",
          "Attributes + history + provenance; how they change"
        ]
      ]
    },
    {
      "title": "Two paths to shared definitions",
      "lead": "Delivering a mart quickly is not enough if every team defines Customer differently.",
      "body": [
        "Inmon typically starts with an integrated, normalized enterprise warehouse, then derives domain marts. Kimball develops dimensional models by business process and integrates them through <strong class=\"hl-yellow\">conformed dimensions</strong> and consistent fact definitions. An arbitrary union of unrelated marts is not Kimball integration.",
        "Top-down design invests in shared modeling early, requiring coordination and potentially slower delivery. Incremental delivery produces value sooner but requires conformed-dimension discipline from the start. Both have costs and can be combined. I choose based on the organization, required history and decision-making needs, not a “modern” label.",
        "Bronze/silver/gold describes responsibilities: preserve raw data with metadata/contracts, clean/integrate, then serve business needs. These are not mandatory normal forms. Table names are team conventions: <code>bronze_&lt;source&gt;_&lt;entity&gt;</code> or raw_; <code>silver_&lt;entity&gt;</code>/stg_, hub_/lnk_/sat_; fact_/fct_, dim_ and mart_ for corresponding outputs."
      ],
      "headers": [
        "Component",
        "Role / tradeoff"
      ],
      "rows": [
        [
          "Inmon",
          "Integrated normalized warehouse → marts; early investment in a shared model"
        ],
        [
          "Kimball",
          "Business-process dimensional models + conformed dimensions; incremental integration"
        ],
        [
          "Medallion",
          "Quality/consumption responsibilities, not a mandatory engine or data model"
        ]
      ]
    },
    {
      "title": "📚 Read columns to answer large questions",
      "lead": "A revenue report needs only a few columns, even when the table has hundreds of attributes.",
      "body": [
        "OLAP optimizes analytical queries: scans, filters, GROUP BY and SUM/AVG/COUNT over many rows. Columnar storage avoids reading unused columns and often compresses well. Vectorized execution processes batches of values to reduce per-row overhead; SIMD is one possible technique, not a promise that every query becomes one CPU instruction.",
        "The example (1,2,3,4) + (5,6,7,8) = (6,8,10,12) illustrates parallel lanes when hardware, types and operations support them. Distributed queries divide work across nodes and combine results; network costs and skew still exist, as in session 9. I do not infer whole-engine performance from one vector addition.",
        "OLTP supports short transactions and a few-row updates with consistency requirements; OLAP supports analysts, BI and analytical applications reading many rows. Freshness, response times and schemas depend on deployment: OLAP can be near real time, and OLTP replicas can lag. Millisecond or second/minute examples are meaningful only alongside query, concurrency, hardware and SLA."
      ],
      "headers": [
        "Component",
        "Role / tradeoff"
      ],
      "rows": [
        [
          "OLTP",
          "Applications; INSERT/UPDATE/DELETE and lookups; PostgreSQL/MySQL, with other models depending on the system"
        ],
        [
          "OLAP",
          "BI/analytics; scans/aggregates; ClickHouse, Pinot, Druid, Doris and BigQuery"
        ],
        [
          "A useful comparison",
          "Purpose, operations, rows/query, freshness, schema, latency, concurrency and cost"
        ]
      ]
    },
    {
      "title": "Two engines, different serving priorities",
      "lead": "An internal dashboard and statistics served to thousands of customers have different workloads.",
      "body": [
        "ClickHouse is a column-oriented analytical database. Nodes use vectorized/parallel execution, read column data parts/blocks and use configurable caches. Storage may be local disk or object storage depending on deployment; a diagram containing S3 does not mean every installation requires S3.",
        "ClickHouse Keeper or ZooKeeper supplies coordination for the relevant replication setup. It holds coordination metadata, not all table data. Replicas fetch data parts through the engine’s mechanisms; the coordinator does not make every node hold identical data, since shards can differ. Update/delete support depends on engine/version, but assess the workload instead of treating it like an OLTP system with continuous individual-row updates.",
        "Pinot organizes tables/segments with schemas: dimensions for filtering/grouping, metrics for aggregation and timestamps according to configuration. Real-time tables ingest streams, offline tables receive batch-built segments, and hybrid tables combine both. The broker uses a time boundary to choose offline/real-time portions and avoid overlapping counts by design; that boundary does not remove all duplicates inside the data.",
        "I use ClickHouse as an example for analytical SQL/log workloads and Pinot for highly concurrent user-facing analytics. These are common emphases, not absolute limitations. Compare latency, throughput, freshness, join/query complexity, updates and cost on your workload. Do not turn “seconds” and “milliseconds” into a product ranking."
      ],
      "headers": [
        "Component",
        "Role / tradeoff"
      ],
      "rows": [
        [
          "ClickHouse",
          "Column parts and vectorized execution; analytical SQL/logs; Keeper/ZooKeeper according to configuration"
        ],
        [
          "Pinot REALTIME",
          "Consume streams → segments; measure ingestion lag and query load"
        ],
        [
          "Pinot OFFLINE / hybrid",
          "Upload batch segments; a boundary coordinates history with the recent stream"
        ]
      ]
    },
    {
      "title": "🧬 Features need the right past",
      "lead": "A model predicting at 10:00 must not see a feature derived from an event at 10:05.",
      "body": [
        "A fraud transaction includes transaction_id, user_id, timestamp, amount, currency, device/channel and country. The model also needs behavioral features such as avg_tx_30d, failures in the past hour or whether a device is new. A shared feature name does not guarantee a shared computation: SQL filtering SETTLED, handling NULL and rounding might give 45.73; different serving code gives 46; another team gets 47.10. These illustrate inconsistent logic, not three equally correct outputs of one contract.",
        "A feature store manages definitions/metadata and feature retrieval, connecting pipelines to offline history for training and online values for serving. A <strong class=\"hl-yellow\">point-in-time join</strong> selects an appropriately timestamped value at or before the training row’s time, within TTL. You must also consider when data was actually available and late backfills to reproduce what the model could know; correct timestamps alone do not eliminate all leakage.",
        "In the lab, a training row at 10:00 selects the 09:55 feature = 45.73 with TTL 10 minutes, not the 10:05 feature = 47.10. TTL 2 minutes expires the older value and returns missing instead of secretly using the future. An online lookup after 10:05 returns the latest value in this fixture; that serves the present, not historical reconstruction.",
        "Feast supplement: Entity declares user_id; FeatureView declares schema/TTL/source; get_historical_features retrieves point-in-time training data; materialization loads features into the online store; get_online_features looks up entities. A shared registry supports discovery/reuse but does not automatically align filters, rounding, NULL behavior and freshness. I still verify offline/online logic and monitor refresh lag.",
        "Static features may refresh daily/weekly; contextual features such as avg_tx_30d might use 1–5 minutes; critical features such as failures in a session may need every event. These are impact/cost choices, not default SLAs. A lookup below 10 ms is a scenario-specific target to measure across the full path, not a promise from every feature store."
      ],
      "headers": [
        "Component",
        "Role / tradeoff"
      ],
      "rows": [
        [
          "Offline",
          "History + timestamps; point-in-time retrieval for training"
        ],
        [
          "Online",
          "Latest values by entity; latency/freshness depend on backend and pipeline"
        ],
        [
          "Feature contract",
          "Logic, filters, NULL, rounding, event/available time, TTL and owner"
        ],
        [
          "Quality checks",
          "Offline/online parity, stale/missing data, leakage and purpose-specific drift"
        ]
      ]
    }
  ],
  "summaryTitle": "From tables to trustworthy answers",
  "summary": [
    "Define grain and metric meaning before writing aggregates.",
    "Normalization preserves facts; dimensional modeling serves questions.",
    "SCD is a history policy: keys, intervals and current columns must be explicit.",
    "Vault supports integration/provenance; marts and conformed dimensions provide shared meaning.",
    "Point-in-time correctness and freshness are separate conditions; a feature store does not replace logic checks."
  ],
  "checkTitle": "✅ Check your understanding",
  "checks": [
    "I can explain 1NF/2NF/3NF on the order fixture without changing quantities.",
    "I know why adding revenue works but summing inventory across days misstates its meaning.",
    "I can choose an SCD policy and join facts to the correct version.",
    "I can distinguish hubs/links/satellites and conformed dimensions.",
    "I can exclude future features and handle a TTL with no valid value."
  ],
  "quizTitle": "Quiz · check the meaning",
  "practiceTitle": "🧪 End-of-session exercises",
  "practice": [
    "Decompose the order fixture into four tables, specify primary/foreign keys and join it back. Verify quantities 1,2,1 and total revenue 140 at sale prices 50/20/50.",
    "Design an order-line sales fact, a Type 2 customer dimension and dimDate. Query revenue by region at sale time, not the current region.",
    "Use the SCD lab through GBP → USD → EUR. Explain which questions Types 1, 2, 3 and 6 can answer.",
    "Given a training row at 10:00 and features at 09:55 and 10:05, choose values with TTL 10 and then 2 minutes. Extend the design with available_time to handle late backfills."
  ],
  "answerTitle": "Check your reasoning",
  "answer": "Order 1001 has 50 × 1 + 20 × 2 = 90; order 1002 has 50, for a total of 140. Join facts using customer_sk resolved at sale time, or a business key plus event_time in [valid_from, valid_to). Type 1 loses GBP; after EUR, Type 3 retains only EUR/USD; Type 2 keeps all three versions; Type 6 keeps history and current EUR on every version. Training gets 45.73 with TTL 10; TTL 2 returns missing, not 47.10.",
  "next": "Session 12 connects these steps into a pipeline with schedules, dependencies, retries and a quality gate before publication.",
  "demo": "BROWSER SIMULATION",
  "loopNote": "The highlight follows an explanatory sequence and repeats; the history and fixture remain visible in the table.",
  "quiz": [
    {
      "topicId": "b11-1",
      "q": "Does a warehouse automatically create a single source of truth?",
      "opts": [
        "Yes, just collect the files",
        "Yes, if it is large enough",
        "No; shared definitions, owners and rules are needed",
        "Only a dashboard is needed"
      ],
      "a": 2,
      "ex": "Collecting data does not resolve competing definitions of revenue."
    },
    {
      "topicId": "b11-2",
      "q": "May normalization change quantity 1 into 2?",
      "opts": [
        "Yes, when splitting tables",
        "Yes, with a new key",
        "Yes, when moving to 3NF",
        "No; it must preserve the facts"
      ],
      "a": 3,
      "ex": "Normalization changes structure and dependencies, not recorded business facts."
    },
    {
      "topicId": "b11-3",
      "q": "Inventory is 100,80,120 over three days. What is ending inventory?",
      "opts": [
        "120",
        "300",
        "100",
        "80"
      ],
      "a": 0,
      "ex": "120 is the final snapshot. 100 is the average for equally spaced snapshots; 300 is not ending inventory."
    },
    {
      "topicId": "b11-4",
      "q": "What can accidentally double SUM after a join?",
      "opts": [
        "Long table names",
        "One fact matching several unintended dimension versions",
        "Using dimDate",
        "A correct primary key"
      ],
      "a": 1,
      "ex": "Check cardinality and time conditions or the version’s surrogate key."
    },
    {
      "topicId": "b11-5",
      "q": "How is a Type 2 version identified?",
      "opts": [
        "Only the customer natural key",
        "The customer name",
        "A surrogate key and effective interval",
        "A transaction deletion flag"
      ],
      "a": 2,
      "ex": "The natural key repeats across versions; each version needs its own identifier and explicit interval."
    },
    {
      "topicId": "b11-6",
      "q": "Where does an order–customer relationship belong in Data Vault?",
      "opts": [
        "Product hub",
        "Price satellite",
        "Only dimDate",
        "Order_customer link"
      ],
      "a": 3,
      "ex": "Links record relationships between business entities; satellites retain attributes/history."
    },
    {
      "topicId": "b11-7",
      "q": "How does Kimball integrate marts?",
      "opts": [
        "Conformed dimensions and shared fact definitions",
        "Arbitrarily union every table",
        "One dashboard color",
        "Remove every key"
      ],
      "a": 0,
      "ex": "Integration comes from shared meaning and consistent dimensions."
    },
    {
      "topicId": "b11-8",
      "q": "Does vectorized execution mean every query uses one instruction?",
      "opts": [
        "Yes",
        "No; it processes batches, with SIMD depending on operators/hardware",
        "Only on Pinot",
        "Only on ClickHouse"
      ],
      "a": 1,
      "ex": "Vectorization is broader than SIMD; it does not promise one instruction for a whole query."
    },
    {
      "topicId": "b11-9",
      "q": "What does a Pinot hybrid time boundary help with?",
      "opts": [
        "Automatically remove every duplicate",
        "Turn OLTP into OLAP",
        "Divide offline/real-time time ranges during queries",
        "Remove the schema"
      ],
      "a": 2,
      "ex": "The boundary avoids overlapping time portions by design, not every kind of record duplication."
    },
    {
      "topicId": "b11-10",
      "q": "Training at 10:00, TTL 2 minutes, features at 09:55 and 10:05: choose what?",
      "opts": [
        "09:55",
        "10:05",
        "Average both values",
        "No valid value"
      ],
      "a": 3,
      "ex": "09:55 is outside TTL and 10:05 is in the future. Return missing under an explicit handling policy."
    }
  ],
  "labs": {
    "aggregateTitle": "The same SUM, a different meaning",
    "aggregateHelp": "Change the measure and aggregation. For revenue, the target is the total across days; for inventory, it is the ending level or average of equally spaced snapshots.",
    "measure": "Measure",
    "measures": [
      "Revenue",
      "Inventory"
    ],
    "method": "Aggregation",
    "methods": [
      "SUM",
      "AVG",
      "LAST"
    ],
    "result": "Result",
    "valid": "Fits the stated question",
    "invalid": "Does not answer the stated question",
    "values": "Values",
    "scdTitle": "The SCD history lab",
    "scdHelp": "Customer 123456 · Peter Pan. Choose a policy, then inspect one or two changes in preferred currency. valid_to is exclusive. Type 6 updates current_currency even on historical rows.",
    "type": "SCD type",
    "changes": "Number of changes",
    "changeLabels": [
      "GBP → USD",
      "GBP → USD → EUR"
    ],
    "scdHeaders": [
      "Table",
      "SK",
      "Historical/retained currency",
      "Current",
      "Previous",
      "From",
      "To (exclusive)"
    ],
    "scdNote": "Types 0/1/3 retain no interval in this model. Type 4 moves old versions into history. For interval-based types, To = ∞ can indicate the current row; do not infer a customer deletion.",
    "featureTitle": "Which feature existed at prediction time?",
    "featureHelp": "The training row is at 10:00. Historical lookup applies timestamps and TTL; online latest models serving after 10:05. Change TTL to see why missing can be a valid result.",
    "mode": "Retrieval mode",
    "modes": [
      "Historical at 10:00",
      "Online latest after 10:05"
    ],
    "ttl": "Historical TTL (minutes)",
    "selected": "Selected value",
    "missing": "Missing",
    "leakage": "Using this value for training at 10:00 would look into the future.",
    "safe": "No future feature is selected; available time still needs checking when backfills occur.",
    "latestNote": "Online latest does not apply the historical TTL in this lab; actual online-backend expiry is a separate policy.",
    "featureHeaders": [
      "Feature time",
      "avg_tx_30d",
      "Relative to the training row"
    ],
    "past": "Past",
    "future": "Future",
    "flowTitle": "From data to a decision",
    "flowSteps": [
      [
        "Raw → integration",
        "Retain keys, timestamps and provenance."
      ],
      [
        "Fact / dimension",
        "Define grain, measures, versions and join relationships."
      ],
      [
        "BI / ML",
        "BI reads metrics; ML retrieves features by time and contract."
      ]
    ],
    "sqlTitle": "SQL for grain and an SCD join",
    "sqlNote": "The illustrative SQL declares the complete fixture with tables/CTEs. Half-open intervals make a transaction on the boundary choose one version; real systems must check for gaps and overlaps.",
    "feastTitle": "Supplement · the Feast lifecycle",
    "feastNote": "An API example for Feast 0.40, not a complete Feast project. Requires pandas, feast, feature_store.yaml configuring offline/online backends, and user_features.parquet containing user_id, event_timestamp and avg_tx_30d. Apply the registry before retrieval/materialization. Feast does not run in the browser."
  }
} satisfies typeof VI;

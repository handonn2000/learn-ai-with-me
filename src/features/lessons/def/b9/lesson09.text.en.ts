import type { VI } from './lesson09.text.vi';
export const EN = {
  "badge": "SESSION 9 · DEF",
  "title": "Batch — divide the work, preserve the result",
  "hero": "The cluster is waiting<br /><em>for one partition.</em>",
  "intro": "The nightly report used to finish on one machine. Tonight, most workers are done, but one partition still has hundreds of millions of rows to process. I'll follow that job from an unevaluated plan to its final files. You'll see why adding machines sometimes just makes the waiting room bigger.",
  "meta": "10 chapters · 3 labs · 10 quiz questions · VI / EN",
  "premise": "The browser labs use simulated data. They do not run Spark or benchmark a cluster. API examples target Spark 3.5.7; running them externally requires a suitable environment and connectors.",
  "cover": "Cover",
  "start": "Start the lesson",
  "readyTitle": "🧭 Before dividing the work",
  "readyLead": "You don't need advanced math. You need to read filters and grouping operations, and tell row counts from byte counts. I keep the examples small enough for you to check by hand.",
  "terms": [
    [
      "Collection · function",
      "Python holds records in a collection; a function takes a record and returns a result. Filter keeps matching rows, while map transforms each row."
    ],
    [
      "SQL · aggregate",
      "WHERE filters rows; GROUP BY groups by a key; SUM adds within each group. A join matches records by a condition and can multiply rows when keys are not unique."
    ],
    [
      "Partition · business key",
      "A partition is a portion of data for processing; a business key identifies a business entity. One customer can appear in several input partitions before a shuffle."
    ],
    [
      "Cardinality · memory",
      "Cardinality counts distinct values, unlike the frequency of a hot key. Maintaining 1 million groups and maintaining 1 very large group create different kinds of pressure."
    ]
  ],
  "chapters": [
    {
      "title": "One machine reaches its limit",
      "lead": "Logs keep arriving, but the reporting deadline doesn't move.",
      "body": [
        "A log pipeline might parse records, count page views, then produce a report. When data exceeds the storage, CPU or RAM of one machine, you divide the data and work among workers. A scheduler assigns tasks; workers compute their portions and combine results. The tradeoff is handling slow networks, failed machines and uneven data distribution.",
        "<strong class=\"hl-cyan\">Spark is a distributed compute engine</strong> for batch, SQL, streaming, ML and graph workloads. Python, Scala, Java and R APIs expose different capabilities. Spark can retain results in RAM when useful. Not all data fits in RAM, and distributing a computation does not always make it faster.",
        "I separate three roles: storage retains data, Spark transforms it, and a cluster manager provides resources. HDFS or S3 supplies storage; Delta/Iceberg adds table and metadata management over storage. Session 8 chose where to keep data; this session chooses how to process it without losing its meaning."
      ],
      "headers": [
        "Component",
        "Mechanism / decision"
      ],
      "rows": [
        [
          "Storage",
          "HDFS, object storage, databases; connector-specific reads and writes"
        ],
        [
          "Compute",
          "Spark: filter, join, aggregate; results still need storage"
        ],
        [
          "Resources",
          "Standalone, YARN or Kubernetes allocates resources according to the deployment"
        ]
      ]
    },
    {
      "title": "⚙️ From a program to tasks",
      "lead": "Writing three transformations doesn't mean three scans have already happened.",
      "body": [
        "The <strong class=\"hl-cyan\">driver</strong> runs the coordinating program, holds the SparkContext and schedules work. The cluster manager allocates resources; worker nodes run executors; executors execute tasks and may retain caches. A partition is data; a task processes one partition within a stage. An executor can run several tasks within its resource allocation.",
        "<code>filter</code>, <code>select</code> and <code>groupBy</code> build a lazy plan. An action such as <code>count</code>, <code>show</code> or a write requests execution of that computation. One action may create multiple jobs; schema inference or metadata discovery may read a source earlier. I mean execution of the transformation plan, not a promise that every command before an action performs no I/O.",
        "An application contains jobs. A job splits into stages; shuffle boundaries separate groups of tasks that must exchange data. Within a stage, narrow transformations can be pipelined on the same partition. Try both filter placements in the lab: the number of rows routed changes, but revenue must stay the same."
      ],
      "headers": [
        "Component",
        "Mechanism / decision"
      ],
      "rows": [
        [
          "1 → 2",
          "Write code → record transformations"
        ],
        [
          "3 → 4",
          "Action → analyze and optimize the plan"
        ],
        [
          "5 → 6",
          "Driver schedules jobs/stages/tasks → obtains resources (which may already be allocated)"
        ],
        [
          "7 → 8",
          "Executors run tasks on partitions → return or write results"
        ]
      ]
    },
    {
      "title": "Two ways to describe distributed data",
      "lead": "A familiar Python list doesn't tell the optimizer which field represents revenue.",
      "body": [
        "An <strong class=\"hl-cyan\">RDD</strong> is an immutable partitioned collection with lineage describing how to compute it. Spark can recompute a lost partition if the source and computation remain available. Lineage is not a permanent backup of the source. SparkSession is the SQL/DataFrame entry point; <code>spark.sparkContext</code> exposes lower-level RDD operations.",
        "A <strong class=\"hl-cyan\">DataFrame</strong> has rows, columns and a schema. A transformation returns a new DataFrame rather than modifying the old object in place; this does not make external source files immutable. Structured expressions help Catalyst understand and optimize the work. RDDs suit custom low-level operations; I usually start with DataFrames for tabular data.",
        "The example below creates 2 partitions, sums to 10, then constructs DataFrames with both <code>createDataFrame</code> and <code>toDF</code>. <code>local[*]</code> uses available local cores; it does not turn a laptop into a cluster. Avoid collecting a large dataset onto the driver. CSV needs header/schema decisions, JSON needs a line-delimited or multiline convention, and JDBC needs a driver and source configuration."
      ],
      "headers": [
        "Component",
        "Mechanism / decision"
      ],
      "rows": [
        [
          "RDD",
          "Functions on objects; low-level control; the optimizer cannot infer every function’s meaning"
        ],
        [
          "DataFrame",
          "Rows/columns/schema; SQL expressions; CSV, JSON, Parquet and JDBC support"
        ],
        [
          "Fixture output",
          "VN = 150; US = 100 after filtering paid orders; sort when you need stable ordering"
        ]
      ]
    },
    {
      "title": "Objects must become bytes",
      "lead": "An object in worker A's RAM cannot be sent to worker B simply by passing its memory address.",
      "body": [
        "<strong class=\"hl-cyan\">Serialization</strong> encodes objects into bytes; deserialization reconstructs data at the destination. Shuffles, network transfers and some cache modes need this conversion. Costs include encoding/decoding CPU, RAM and bytes over the network. A more compact serializer may help, but measure it on real data types.",
        "For JVM objects, Java serialization is easy to use; Kryo is often smaller and faster, with configuration and sometimes class registration as the tradeoff. Set the serializer before creating SparkContext; registered classes must be on the classpath. Kryo buffers must accommodate the largest object within the configured limits.",
        "I don't treat the Kryo switch as a cure for every Python job: Python objects have their own serialization path, while DataFrames use Spark SQL's internal representation. Changing <code>spark.serializer</code> does not automatically replace all Python serialization or guarantee a faster whole job."
      ],
      "headers": [
        "Component",
        "Mechanism / decision"
      ],
      "rows": [
        [
          "Object → bytes",
          "Encoding CPU; byte size determines part of the network cost"
        ],
        [
          "Bytes → object",
          "Decoding CPU; memory for the reconstructed representation"
        ],
        [
          "Java / Kryo",
          "Compare within the JVM scope; configure before the context and measure before/after"
        ]
      ]
    },
    {
      "title": "🧠 Keep what is worth reusing",
      "lead": "The first action cannot read a cache that has never been computed.",
      "body": [
        "<code>cache()</code> and <code>persist()</code> mark data for retention when computed. <strong class=\"hl-yellow\">The first action materializes the partitions it touches</strong>; later actions can reuse them. Count normally touches all partitions; show may need only some. Unpersist releases retained data when it is no longer needed.",
        "The five levels below describe JVM RDDs. With MEMORY_ONLY, partitions that cannot be retained must be recomputed; MEMORY_AND_DISK provides disk fallback. SER levels trade decoding CPU for a potentially compact representation. Python RDD objects are always stored serialized, so do not blindly copy JVM-only level names into PySpark.",
        "In Spark 3.5.7, RDD cache defaults to MEMORY_ONLY; DataFrame cache defaults to MEMORY_AND_DISK_DESER. I cache expensive, repeatedly used results, not every table. The lab assumes 4 equally sized partitions and a dedicated capacity, without eviction or competition from execution memory. Change RAM capacity and reuse count to see recomputation versus disk reads."
      ],
      "headers": [
        "Component",
        "Mechanism / decision"
      ],
      "rows": [
        [
          "MEMORY_ONLY",
          "JVM objects in RAM; recompute partitions that do not fit"
        ],
        [
          "MEMORY_AND_DISK",
          "JVM objects in RAM; remaining partitions on disk"
        ],
        [
          "MEMORY_ONLY_SER",
          "Bytes in RAM; compactness depends on the serializer; decoding required"
        ],
        [
          "MEMORY_AND_DISK_SER",
          "Bytes in RAM, then disk; I/O costs remain"
        ],
        [
          "DISK_ONLY",
          "Retain on disk without long-term RAM cache occupancy"
        ]
      ]
    },
    {
      "title": "The slowest partition holds the stage",
      "lead": "700 million rows in one partition; only 10, 8 and 12 million in the others.",
      "body": [
        "<strong class=\"hl-yellow\">Data skew</strong> means unevenly distributed load. One task processes 700M while the others finish early. Adding executors does not automatically split a hot key for the same aggregation. High cardinality means many distinct values; skew means uneven frequency or load. They can coexist, but they are not synonyms.",
        "GroupBy, join, distinct and repartition often require a shuffle to bring related data together; the actual shuffle depends on partitioning and the physical plan. Large shuffles increase network, memory and spill I/O. A wide schema makes each row heavier even when row count stays constant. You need both row and byte counts.",
        "Schemas change too: day 1 has user_id, event and ts; day 30 adds country and platform. A nullable addition may be compatible under an explicit policy; type changes or dropped columns can break consumers. I check contracts and schema versions instead of waiting for a failed job to reveal an upstream change."
      ],
      "headers": [
        "Component",
        "Mechanism / decision"
      ],
      "rows": [
        [
          "Skew",
          "Large differences in task duration or input; find hot keys"
        ],
        [
          "Shuffle explosion",
          "Many bytes exchanged; filter, project and pre-aggregate"
        ],
        [
          "High cardinality",
          "Many groups or distinct values; check memory and accuracy requirements"
        ],
        [
          "Wide schema / evolution",
          "Unneeded columns / changing contracts; two different problems"
        ]
      ]
    },
    {
      "title": "Move the filter ahead of the bottleneck",
      "lead": "Two queries with the same answer can make the network carry very different amounts of data.",
      "body": [
        "Catalyst proceeds through a logical plan, analysis to resolve names/types, an optimized logical plan, and a physical plan. It folds constants and moves filters when semantics are preserved. The physical plan chooses join, exchange and aggregation mechanisms. Inspect <code>explain(\"formatted\")</code> instead of inferring execution from code order.",
        "The t1/t2 inner-join example filters <code>t2.id &gt; 50 * 1000</code> and sums <code>1 + 2 + t1.value</code>. Filtering t2 before the join removes rows that cannot contribute; 1 + 2 can fold to 3. You must still preserve join multiplicity: two t2 rows with the same id make the matching t1 row contribute twice.",
        "<strong class=\"hl-yellow\">Moving a filter must preserve the result</strong>. Outer joins, NULL and nondeterministic functions require separate reasoning. I do not apply “filter early” by blindly moving a left-join predicate from WHERE to ON; those queries can have different meanings."
      ],
      "headers": [
        "Component",
        "Mechanism / decision"
      ],
      "rows": [
        [
          "Initial illustrative plan",
          "Scan t1 + Scan t2 → Join → Filter → Project → SUM"
        ],
        [
          "Optimized illustrative plan",
          "Scan t2 → Filter; combine with Scan t1 → Join → Project → SUM"
        ],
        [
          "Verification",
          "Use identical input, compare results and NULL behavior, and inspect the physical plan; no fixed plan shape is promised"
        ]
      ]
    },
    {
      "title": "The machinery beneath the plan",
      "lead": "A good plan can still spend time allocating objects and running the garbage collector.",
      "body": [
        "Tungsten reduces JVM object overhead through binary representations, cache-friendly access and whole-stage code generation for supported operators. L1/L2/L3 are closer to the CPU than RAM; sequential reads can use cache lines effectively. An illustrative comparison of roughly 1 ns and 100 ns does not mean a whole job becomes 100 times faster.",
        "<strong class=\"hl-yellow\">Binary layout does not mean off-heap is always enabled</strong>. Spark 3.5.7 disables spark.memory.offHeap.enabled by default; explicit Spark-managed off-heap memory requires enabling it and setting a positive size. Code generation can combine compatible scan/filter/project/aggregate operators, not every operator or Python UDF.",
        "AQE uses runtime statistics to adjust plans: coalesce small shuffle partitions, change join strategy when suitable, and split skewed join work. Spark 3.5.7 enables AQE by default, but results depend on configuration and query shape. I still inspect Spark UI: automatic optimization does not choose your grain, keys and schema for you."
      ],
      "headers": [
        "Component",
        "Mechanism / decision"
      ],
      "rows": [
        [
          "Catalyst",
          "Optimize expressions and plans before execution"
        ],
        [
          "Tungsten",
          "Data representation, memory and CPU during execution"
        ],
        [
          "AQE",
          "Use runtime statistics to revise some physical-plan decisions"
        ]
      ]
    },
    {
      "title": "🔧 Fix the work before adding machines",
      "lead": "Four powerful machines can still spend their time sending columns nobody needs.",
      "body": [
        "Too few partitions create large tasks and spill; too many create tiny tasks with scheduling overhead. Early filters and projections reduce rows/columns. Parquet/ORC support column pruning, while CSV generally still requires reading row bytes for parsing. Broadcasting a small table can avoid shuffling the large one, but requires enough executor RAM and suitable join semantics.",
        "For a hot key, isolate the heavy portion, add salt, aggregate partial groups, then <strong class=\"hl-cyan\">merge by the original key</strong>. SUM and COUNT can be merged; AVG requires merging sums/counts rather than averaging partial averages without weights. A salted join needs matching distribution of the opposite side to avoid losing or incorrectly multiplying rows.",
        "The lab divides 700M into ideal buckets and merges them back to 700M; the total remains 730M. This is ideal balancing, not a speed promise or core-contention simulation. When error is acceptable, approx_count_distinct trades accuracy for memory; financial reconciliation usually needs exact counts. Delta/Iceberg schema enforcement/evolution also needs compatibility policies and consumer checks."
      ],
      "headers": [
        "Component",
        "Mechanism / decision"
      ],
      "rows": [
        [
          "Broadcast",
          "Only when the small side fits; measure size and RAM"
        ],
        [
          "Pre-aggregation",
          "Compute partial results before shuffle when the operation allows it"
        ],
        [
          "Salting",
          "Split the hot key, then merge; verify conservation"
        ],
        [
          "Approximate distinct",
          "Declare error and purpose; do not treat it as exact"
        ]
      ]
    },
    {
      "title": "📊 Read a job’s evidence",
      "lead": "A stuck progress bar doesn't tell you whether to add RAM, add machines or rewrite a query.",
      "body": [
        "Spark UI shows running, pending and completed jobs/stages, task duration, input, shuffle read/write, spill and GC. One long task with large input suggests skew. If all tasks scan many columns but return little data, inspect the scan/filter. High GC or spill calls for checking task size and memory. Diagnosis follows evidence; symptoms do not map to universal repair buttons.",
        "Dynamic allocation changes executor count based on backlog/idle time when enabled with a suitable shuffle-preservation mechanism, such as shuffle tracking or an external shuffle service. In Spark 3.5.7, the illustrative 1s backlog timeout and 60s executor idle timeout are configuration defaults, not deadlines guaranteeing resources change at those exact moments; cached executors have separate policies.",
        "Compaction rewrites many small files into fewer larger ones to reduce file-open and metadata overhead. Coalesce usually reduces partitions without a full shuffle; repartition shuffles to redistribute data. Partition count need not equal file count when partitionBy or file limits apply. Delta OPTIMIZE belongs to Delta, not core Spark operating on every file. I verify that <strong class=\"hl-cyan\">logical records remain unchanged</strong>; physical bytes may change with compression and layout."
      ],
      "headers": [
        "Component",
        "Mechanism / decision"
      ],
      "rows": [
        [
          "Slow task",
          "Compare max/median, input, shuffle and spill; identify the bottleneck"
        ],
        [
          "Insufficient executors",
          "Check backlog and allocation limits; spare machines do not cure a hot key"
        ],
        [
          "Tiny files",
          "Compact with count, total and key checks; schedule maintenance"
        ]
      ]
    }
  ],
  "summaryTitle": "A map of a batch job",
  "summary": [
    "Storage retains data; the driver coordinates; executors run tasks on partitions.",
    "Transformations build a plan; actions request execution; shuffles divide stages.",
    "A cache can be reused only after materialization; plan when to unpersist.",
    "Reduce rows/columns and inspect skew before increasing resources.",
    "Every optimization must preserve results; measure a real job rather than infer speed from a model."
  ],
  "checkTitle": "✅ Check your understanding",
  "checks": [
    "I can identify an action and a shuffle boundary in a DataFrame pipeline.",
    "I can distinguish RDD cache, DataFrame cache and the JVM serializer.",
    "I can explain how high cardinality differs from skew.",
    "I can merge salted aggregates correctly and explain when broadcast is unsuitable.",
    "I can distinguish executor allocation from file compaction."
  ],
  "quizTitle": "Quiz · explain before choosing",
  "practiceTitle": "🧪 End-of-session exercises",
  "practice": [
    "Using the 6-order fixture, predict paid totals by region, run the PySpark example and compare. Inspect explain before and after projection/filtering.",
    "Choose RAM for 2 of 4 partitions and 3 uses. Compare MEMORY_ONLY with MEMORY_AND_DISK: how many partition computations and disk reads?",
    "Split the hot key into 4 salts and verify partial and original totals. Describe how to merge AVG using sum/count.",
    "Record a job’s input, output, max/median task duration, shuffle/spill and file count. Choose one improvement hypothesis and a way to test it."
  ],
  "answerTitle": "Check your reasoning",
  "answer": "VN = 150, US = 100. MEMORY_ONLY computes partitions 8 times; MEMORY_AND_DISK computes them 4 times and performs 4 disk reads during reuse. 4 salts split the hot key into 175M each, merging to 700M; the overall total is 730M. For AVG, add partial sums and divide by the total partial count. Keep fixtures and measurement conditions fixed when comparing plans.",
  "next": "Session 10 removes the assumption that all input is available: events keep arriving after you publish a result.",
  "demo": "BROWSER SIMULATION",
  "loopNote": "The highlight moves through a complete illustration, then starts a new cycle; all steps stay visible. Repeating the visual does not rerun or delete real data.",
  "quiz": [
    {
      "topicId": "b9-1",
      "q": "Which operation requests execution of a DataFrame result?",
      "opts": [
        "select",
        "filter",
        "count",
        "groupBy"
      ],
      "a": 2,
      "ex": "Count is an action. The others describe transformations; groupBy needs an aggregate to form a complete computation."
    },
    {
      "topicId": "b9-2",
      "q": "How does a partition differ from a task?",
      "opts": [
        "A partition is data; a task processes it",
        "Two names for the same executor",
        "A task is always one row",
        "A partition is always one machine"
      ],
      "a": 0,
      "ex": "A task processes one partition within a stage; a machine can execute many tasks."
    },
    {
      "topicId": "b9-3",
      "q": "How does lineage help after an RDD partition is lost?",
      "opts": [
        "It backs up every source automatically",
        "It recomputes from available sources and transformations",
        "It skips the partition",
        "It turns the driver into storage"
      ],
      "a": 1,
      "ex": "Recomputation depends on the source and computation remaining available."
    },
    {
      "topicId": "b9-4",
      "q": "Does enabling Kryo automatically replace Python object serialization?",
      "opts": [
        "Yes, all bytes use Kryo",
        "Only with 2 partitions",
        "Yes, after count",
        "No; distinguish JVM and Python paths"
      ],
      "a": 3,
      "ex": "The JVM serializer setting does not replace every Python encoding path."
    },
    {
      "topicId": "b9-5",
      "q": "What does the first action after cache() do?",
      "opts": [
        "Materialize and retain the partitions it computes",
        "Only read an existing cache",
        "Run nothing",
        "Automatically unpersist"
      ],
      "a": 0,
      "ex": "Caching is lazy; computation must happen before there is data to reuse."
    },
    {
      "topicId": "b9-6",
      "q": "One key accounts for most rows. What does that indicate?",
      "opts": [
        "Column pruning",
        "Skew",
        "Only high cardinality",
        "Schema evolution"
      ],
      "a": 1,
      "ex": "Skew is uneven load distribution. Cardinality counts distinct values."
    },
    {
      "topicId": "b9-7",
      "q": "When may a filter be pushed earlier?",
      "opts": [
        "Always",
        "When changing INNER to LEFT",
        "When semantics, NULL behavior and multiplicity are preserved",
        "Only after adding executors"
      ],
      "a": 2,
      "ex": "The optimizer must preserve the answer. Outer joins and NULL need separate reasoning."
    },
    {
      "topicId": "b9-8",
      "q": "What information does AQE use?",
      "opts": [
        "Only row counts written in code",
        "File names",
        "Only laptop RAM",
        "Statistics collected while the query runs"
      ],
      "a": 3,
      "ex": "AQE uses runtime statistics to adjust some execution decisions."
    },
    {
      "topicId": "b9-9",
      "q": "How should you merge AVG after salting?",
      "opts": [
        "Add sums, add counts, then divide",
        "Add the averages",
        "Choose the largest average",
        "Always average the averages"
      ],
      "a": 0,
      "ex": "Averaging averages is correct only under particular weighting conditions; sum/count is the general solution."
    },
    {
      "topicId": "b9-10",
      "q": "What must compaction preserve?",
      "opts": [
        "Every byte of the old files",
        "Logical records and their meaning",
        "Executor count",
        "File count"
      ],
      "a": 1,
      "ex": "File count and physical bytes can change, but logical data must not be corrupted."
    }
  ],
  "labs": {
    "planTitle": "From a lazy plan to a result",
    "planHelp": "Change where paid orders are filtered. The model routes individual rows by region without partial aggregation; inspect the routed row count, then verify unchanged totals.",
    "planModes": [
      "Filter before routing",
      "Filter after routing"
    ],
    "planSteps": [
      [
        "Plan",
        "filter / select / groupBy: no tasks for this plan have run yet."
      ],
      [
        "Action",
        "count / show / write requests computation."
      ],
      [
        "Stage before shuffle",
        "Read partitions and apply local transformations."
      ],
      [
        "Shuffle → next stage",
        "Route matching regions together; SUM and return the result."
      ]
    ],
    "moved": "Rows routed",
    "output": "Result",
    "headers": [
      "Region",
      "Paid total"
    ],
    "cacheTitle": "Does the cache have enough room?",
    "cacheHelp": "4 equally sized partitions. The first action reads all 4; later actions read all of them again. Change capacity and use count; these operation counts are not elapsed time.",
    "capacity": "Partition capacity in RAM",
    "uses": "Number of uses",
    "strategy": "Storage strategy",
    "computed": "Partition computations",
    "ram": "Partitions in RAM",
    "disk": "Partitions on disk",
    "diskReads": "Disk reads during reuse",
    "skewTitle": "Split the hot key, then merge",
    "skewHelp": "Try 1, 2 and 4 salts. Bars show millions of rows in idealized tasks on the same 700M scale, so you can see the largest portion shrink. Core limits and shuffle/merge overhead are not simulated.",
    "salts": "Hot-key salt count",
    "largest": "Largest task (M)",
    "total": "Total data (M)",
    "merged": "Merged hot key (M)",
    "codeTitle": "PySpark example · self-contained fixture",
    "codeNote": "Python 3.10/3.11, Java 17, pyspark==3.5.7. Run with spark-submit; the example includes input and assertions. Connector snippets are templates requiring files/JDBC drivers and a separate database; they do not run in this page.",
    "connectorTitle": "File and JDBC readers · configuration templates",
    "serializerTitle": "Kryo · JVM configuration before the context",
    "planCodeTitle": "SQL with two equivalent execution orders",
    "planCodeNote": "Create t1/t2 from VALUES; the total is 13. Follow the illustrative plans from scan to aggregate; a real physical plan may add exchanges or partial aggregation."
  }
} satisfies typeof VI;

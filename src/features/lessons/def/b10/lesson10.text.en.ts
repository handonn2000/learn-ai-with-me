import type { VI } from './lesson10.text.vi';
export const EN = {
  "badge": "SESSION 10 · DEF",
  "title": "Stream — when is the data complete enough?",
  "hero": "The event happened.<br /><em>It has not arrived.</em>",
  "intro": "A transaction happens before the minute ends, but its message arrives after the dashboard publishes the total. The timestamp and addition are correct; the result is still incomplete. I'll follow both timelines so you can decide when to emit a result and when to revise it.",
  "meta": "10 chapters · 3 labs · 10 quiz questions · VI / EN",
  "premise": "The timelines, checkpoints and queues are teaching models running in your browser, without a Flink or Kafka connection. API examples target Flink 1.20; real connectors and deployments require a separate environment.",
  "cover": "Cover",
  "start": "Follow the events",
  "readyTitle": "🧭 Time and state essentials",
  "readyLead": "Session 9 had finite input you could recompute. Here, you need to keep track of which events have arrived, which clock is advancing and what the system remembers.",
  "terms": [
    [
      "Timestamp · offset",
      "A timestamp describes a time; an offset identifies a position in a source partition. A larger offset does not guarantee a later event time."
    ],
    [
      "Half-open interval [start, end)",
      "The window [00:00, 01:00) accepts an event at 00:59 but not at 01:00. This boundary convention prevents double counting between tumbling windows."
    ],
    [
      "Key · state",
      "A key groups events for the same entity. State retains sums, counts or history needed by later computations; not every raw event must be retained."
    ],
    [
      "Rate · backlog",
      "If 8 events arrive and the destination processes 3 per tick, total outstanding work grows by 5 per tick when no data is lost. A bounded buffer eventually forces upstream to slow down."
    ]
  ],
  "chapters": [
    {
      "title": "A computation with no final record",
      "lead": "A payment stream has no ‘all data sent’ button.",
      "body": [
        "Flink processes unbounded streams and bounded datasets. Transformations can filter, enrich, aggregate or route events. With unbounded input, the engine maintains work over time, retains state and emits results under specified conditions instead of waiting for the entire input to end.",
        "The JobManager coordinates the execution graph, scheduling, checkpoints and recovery; TaskManagers execute subtasks. An operator is a processing step; parallelism 4 creates 4 parallel instances of it. Slots divide TaskManager resources: with 3 equally configured slots, each receives roughly 1/3 of managed memory. CPU is shared, not 3 dedicated cores.",
        "I distinguish operators, subtasks, chains and slots. Compatible subtasks can share a slot through slot sharing; a chain combines operators into one task/thread. Parallelism must fit available slots and key distribution. Changing the number of instances must not change business results."
      ],
      "headers": [
        "Concept",
        "Mechanism / condition"
      ],
      "rows": [
        [
          "Client → JobManager",
          "Submit the job, build/schedule the execution graph; SQL optimization depends on the API"
        ],
        [
          "TaskManager → slot",
          "Execute tasks and manage resources and local state according to the backend"
        ],
        [
          "Checkpoint → recovery",
          "Monitor, complete snapshots, and restore state together with source positions after failure"
        ]
      ]
    },
    {
      "title": "⏱️ Three clocks",
      "lead": "An event from 00:58 may not reach the processing machine until 01:10.",
      "body": [
        "<strong class=\"hl-purple\">Event time</strong> comes from the event; processing time comes from the machine clock during processing; ingestion time records entry into the system. Event time groups data by when business activity happened, but needs a progress signal because input can arrive out of order. Ingestion time is a source-entry concept; check the concrete API for your version.",
        "In this lesson’s seconds-based model, <strong class=\"hl-purple\">W = maximum observed event time − disorder bound</strong>. 00:58 − 5s = 00:53; after observing 01:05, W = 01:00. With 10s: 10:01:20 − 10s = 10:01:10. A watermark is an assumption about progress, not proof that every earlier event has arrived. It does not retreat when an old event appears.",
        "A timestamp extractor reads the time, a generator emits watermarks, and downstream operators use them. With multiple inputs, the watermark is usually the minimum across active inputs, so an idle partition can hold back progress; idleness handling is configurable. Monotonous strategies suit increasing timestamps; bounded strategies allow disorder within a chosen delay; custom strategies use special signals. P95 covers an observed proportion, not a hard maximum delay.",
        "The lab uses whole seconds and the end boundary for clarity. Flink 1.20 uses millisecond timestamps: a bounded generator typically emits max − bound − 1 ms, and a time window has maxTimestamp = end − 1 ms. Use that exact precision in an implementation; a whole-second illustration is not a millisecond boundary test."
      ],
      "headers": [
        "Concept",
        "Mechanism / condition"
      ],
      "rows": [
        [
          "Larger bound",
          "Wait longer and typically accommodate more out-of-order events"
        ],
        [
          "Smaller bound",
          "Earlier results; a suitable late-data policy becomes more important"
        ],
        [
          "Out-of-order ≠ discarded",
          "An event older than the maximum can still belong to a window that accepts data"
        ]
      ]
    },
    {
      "title": "Windows group; triggers emit",
      "lead": "An infinite stream needs finite groups before you can read its results.",
      "body": [
        "Tumbling windows use fixed, non-overlapping intervals. Sliding windows have a size and slide, and can overlap when slide is smaller than size. An event may belong to several sliding windows. Session windows group activity by inactivity gaps and may merge when a bridging event arrives. A global window has no natural time-based end.",
        "<strong class=\"hl-purple\">The window assigner chooses the group; the trigger chooses when to compute and emit</strong>. Firing need not delete state. Default event-time windows follow watermarks, processing-time windows follow the clock, and global windows need a suitable trigger because the default does not emit useful results automatically. I always separate emission from cleanup.",
        "An event at second 65 belongs to tumbling [60,120). With sliding size 60 and slide 30, it belongs to [30,90) and [60,120). A session gap of 10 with events at 0, 5 and 20 groups 0/5 separately from 20; a late event may bridge groups depending on boundaries and retained state. Arrival order alone cannot determine sessions."
      ],
      "headers": [
        "Concept",
        "Mechanism / condition"
      ],
      "rows": [
        [
          "Tumbling",
          "Hourly revenue; one window per event for its key"
        ],
        [
          "Sliding",
          "A 10-minute average updated every 1 minute; multiple windows"
        ],
        [
          "Session",
          "Clickstream grouped by inactivity; variable duration"
        ],
        [
          "Global",
          "For example, emit every 100 events; define a trigger and retention/cleanup policy"
        ]
      ]
    },
    {
      "title": "📨 Late data after the result",
      "lead": "The published count is 3. A fourth record for the same minute has just arrived.",
      "body": [
        "Allowed lateness retains state beyond a window’s end according to event time; <strong class=\"hl-yellow\">it differs from the disorder bound</strong>. The bound holds the watermark behind the maximum; lateness determines whether updates are accepted after the first emission. Neither is an arrival-clock sleep duration.",
        "For window [0,60), W reaching 60 emits count = 3. With lateness 15, an event at 50 arriving while W is still 60 finds retained state, increases the count to 4 and may cause the default event-time trigger to emit again. Once W reaches 75, this seconds-based model has cleaned up state; a later arrival from 55 goes to side output or is dropped. Waiting another 15 seconds on the machine clock alone does not advance W.",
        "A revision is a <strong class=\"hl-purple\">replacement value for the same key/window</strong>, not another transaction to add as 3 + 4. The sink needs upserts or appropriate changelog handling. Side output preserves excessively late events for auditing, reprocessing, alerts or a DLQ; that pipeline still costs storage/compute and can fail. Allowed lateness does not guarantee completeness for events arriving after cleanup.",
        "I make the boundaries explicit in the example with disorder 10s and lateness 15s: window [00:30,01:30) fires when the maximum reaches 01:40 and W=01:30. An event from 01:15 can still be accepted while W is below 01:45. Rejecting an event from 01:28 requires a watermark at or beyond 01:45, for example max=01:55; arrival=02:00 alone cannot establish that."
      ],
      "headers": [
        "Concept",
        "Mechanism / condition"
      ],
      "rows": [
        [
          "Drop",
          "No extra state retention for late updates; results may be incomplete"
        ],
        [
          "Allowed lateness",
          "Retain state longer and revise results; the sink must understand updates"
        ],
        [
          "Side output",
          "Preserve excessively late data through another path; neither free nor an automatic no-loss guarantee"
        ]
      ]
    },
    {
      "title": "One stream, several APIs",
      "lead": "A compact SQL query may not express your custom business timer.",
      "body": [
        "DataStream offers map 1→1, filter to keep/discard, flatMap 1→n, keyBy to partition by key, and window/aggregate to group and compute. Union combines streams of the same type; connect coordinates two potentially different types through suitable functions. ProcessFunction adds context for per-event processing; to use keyed state and timers, you must first keyBy and then use KeyedProcessFunction or ProcessFunction on the keyed stream.",
        "Table API views a stream as a dynamic table; table changes can produce inserts, updates and deletes in a changelog. The SQL parser checks syntax, the optimizer chooses transformations, and the planner builds execution. DataStream and SQL can express the same business result without necessarily producing identical execution plans or performance.",
        "The SQL example uses a window TVF: <code>TUMBLE</code> creates window_start/window_end before GROUP BY. HOP takes slide and size; SESSION support depends on the corresponding syntax/API/version. Do not group by a window_start column that has never been created. I spell out the Kafka connector, schema and watermark; the topic, JAR and connection permissions still need preparation.",
        "You can convert a DataStream to a Table and back, but must preserve event time, watermarks, types and changelog semantics. An append-only sink cannot consume every updating table. API interoperability involves more than renaming a variable."
      ],
      "headers": [
        "Concept",
        "Mechanism / condition"
      ],
      "rows": [
        [
          "DataStream / ProcessFunction",
          "Detailed custom logic, state and timers"
        ],
        [
          "Table API",
          "Relational expressions in Java/Python"
        ],
        [
          "SQL",
          "Declare schema, watermark, query and connector; share logic easily"
        ]
      ]
    },
    {
      "title": "Each key carries memory",
      "lead": "Counting orders per customer requires more than the record that just arrived.",
      "body": [
        "<strong class=\"hl-purple\">State</strong> is information from the past needed for future computation. An event arrives → read its key’s state → compute → write state → emit if appropriate. A running count needs a number; detecting 3 failed logins within 5 minutes needs enough timestamped information to expire old events; a session needs the latest activity time.",
        "Keyed state belongs to each key after keyBy; operator state belongs to an operator instance, such as partition-specific source state. Window state follows a window/key lifecycle and is commonly implemented using keyed state; not every “state type” in a diagram is an independent backend. Python APIs need not expose every Java capability. This is a conceptual model, not a promise of custom PyFlink operator-state support.",
        "Rescaling redistributes keyed state through key groups according to max parallelism; operator state needs appropriate redistribution rules. Durable state requires checkpoints and recoverable storage; a process-local dictionary is not a replacement for managed state. I check TTL/cleanup, state schema and capacity because unbounded state can break a job even when each input event is tiny."
      ],
      "headers": [
        "Concept",
        "Mechanism / condition"
      ],
      "rows": [
        [
          "Running count / sum",
          "Compact per-key state; requires consistent updates"
        ],
        [
          "Window / session / fraud",
          "Different lifecycles and history requirements"
        ],
        [
          "Source position",
          "Restore together with processing state; an offset does not replace state"
        ]
      ]
    },
    {
      "title": "🛟 Recover a consistent past",
      "lead": "Restoring yesterday’s state while reading from today’s source position leaves a hole between them.",
      "body": [
        "A checkpoint is a consistent snapshot of runtime state and source positions, not a code backup. The coordinator starts it, and sources insert barriers into their streams. With multiple inputs, aligned checkpoints coordinate matching barriers to separate before/after data consistently; unaligned checkpoints can include buffered in-flight data, depending on configuration.",
        "Tasks snapshot, write to durable storage with asynchronous portions, and acknowledge completion. <strong class=\"hl-yellow\">Only a completed checkpoint is a recovery point</strong>. After failure, restore state and source positions from that point, then replay. The source must support replay and retain the necessary data; checkpoint storage must survive the failure.",
        "Exactly-once state does not automatically turn an email or external write into an exactly-once effect. Sinks need coordinated transactions/checkpoints or suitable idempotent writes. In the lab, a=10 and b=20 are checkpointed; c=30 reaches the external sink before a crash. Replaying c restores state = 60, but a blindly additive sink reaches 90. Upserting by event ID preserves 60. I use this small example to make the guarantee’s boundary visible."
      ],
      "headers": [
        "Concept",
        "Mechanism / condition"
      ],
      "rows": [
        [
          "Barrier",
          "A coordination marker, not a revenue record"
        ],
        [
          "Completed checkpoint",
          "Consistent state and source positions have been acknowledged"
        ],
        [
          "External effect",
          "Requires a separate sink mechanism; checkpointing alone does not establish the guarantee"
        ]
      ]
    },
    {
      "title": "Remove unnecessary handoffs",
      "lead": "A map followed by a filter may spend more effort handing over records than computing them.",
      "body": [
        "Operator chaining combines compatible operators into one task/thread, reducing serialization, buffering and thread handoffs between them. Compatible forward edges and parallelism are typical requirements; keyBy repartitioning introduces an exchange boundary, so not every operator can simply join one chain.",
        "<code>disableChaining()</code> separates an operator; <code>startNewChain()</code> starts a new chain in Java DataStream. Separation can help debugging, metrics and profiling. <strong class=\"hl-yellow\">Breaking a chain does not allocate dedicated CPU</strong>: slot sharing, resource profiles and deployment determine resource isolation.",
        "Tuning includes watermarks, chains, memory and backpressure. You may reduce overhead while throughput remains limited by a slow database sink. I change one factor at a time and inspect throughput, latency and checkpoint duration. More configuration does not mean better understanding."
      ],
      "headers": [
        "Concept",
        "Mechanism / condition"
      ],
      "rows": [
        [
          "Without chaining",
          "Buffering/serialization where required; easier per-operator observation"
        ],
        [
          "Compatible chain",
          "One task/thread; less handoff overhead"
        ],
        [
          "Resource isolation",
          "Design slot sharing, resources and deployment; breaking a chain alone is insufficient"
        ]
      ]
    },
    {
      "title": "A bottleneck pushes upstream",
      "lead": "The source receives 8 per tick, while the sink consumes only 3. A buffer cannot grow forever.",
      "body": [
        "When downstream slows, buffers fill and upstream must slow down: this is <strong class=\"hl-purple\">backpressure</strong>. In the lab, outstanding work initially grows by 5 per tick; once buffer capacity is reached, backlog accumulates at the source. Backpressure limits in-flight data but does not prevent every OOM or ensure sufficient Kafka retention.",
        "A UI reporting pressure upstream may be showing a symptom of a downstream operator. I follow it to the busy sink/operator and inspect busy/idle/backpressured time, queues, checkpoints and external services before concluding. OK/LOW/HIGH labels summarize severity; the first red operator is not necessarily the cause.",
        "Increase parallelism at the bottleneck if the work can be divided; one hot key may still pin work to one subtask. Async I/O helps with external lookup waits but needs concurrency limits and timeouts. More RocksDB cache helps only when cache/state I/O is the bottleneck and the memory budget permits it. These are not three universal fixes."
      ],
      "headers": [
        "Concept",
        "Mechanism / condition"
      ],
      "rows": [
        [
          "Source 8, sink 3",
          "Total backlog grows by 5 per tick without dropping"
        ],
        [
          "Bounded buffer",
          "Upstream acceptance slows; source backlog grows"
        ],
        [
          "Diagnosis",
          "Trace downstream to the slow component rather than only inspecting where pressure is reported"
        ]
      ]
    },
    {
      "title": "🚦 Choose the failure boundary",
      "lead": "An experimental job might share a cluster with a customer-facing dashboard.",
      "body": [
        "Session mode shares a cluster across jobs, providing resource reuse and convenient startup at the cost of contention and shared failure scope. Application mode ties cluster lifecycle to an application, clarifying dependencies and operational isolation; an application may contain several jobs depending on its program.",
        "I do not label session mode “forbidden in production.” You choose based on isolation requirements, cost, orchestration and operating practices. A dedicated application often suits workloads needing clear failure boundaries; a session cluster can work when quotas, monitoring and isolation are designed appropriately.",
        "The final design should document event time, watermark, window, late policy, state, checkpoints and sink semantics. Session 11 consumes these outputs for BI/ML. Sending a fast number without stating whether it can still be revised simply passes ambiguity to the user."
      ],
      "headers": [
        "Concept",
        "Mechanism / condition"
      ],
      "rows": [
        [
          "Session",
          "Shared resources and cluster lifecycle; check noisy neighbors"
        ],
        [
          "Application",
          "Application-scoped lifecycle; isolation trades off against cost/startup"
        ],
        [
          "Output contract",
          "Key/window, revision, freshness, late corrections and retention"
        ]
      ]
    }
  ],
  "summaryTitle": "A map of a stateful stream",
  "summary": [
    "A watermark expresses event-time progress under a strategy; it does not prove complete input.",
    "Windows group, triggers emit and cleanup removes state. These are separate operations.",
    "Disorder bounds and allowed lateness act at different points.",
    "Recovery restores both state and source positions; the sink determines whether external effects duplicate.",
    "Trace backpressure to the slow downstream component; deployment determines the failure scope."
  ],
  "checkTitle": "✅ Check your understanding",
  "checks": [
    "I can calculate a watermark and explain why it does not move backward.",
    "I can assign events to [start,end) and distinguish firing from cleanup.",
    "I can predict updates and side output after late arrivals.",
    "I can explain how recovered state can be correct while a sink duplicates writes.",
    "I can distinguish chaining, slot sharing and resource isolation."
  ],
  "quizTitle": "Quiz · follow the clock",
  "practiceTitle": "🧪 End-of-session exercises",
  "practice": [
    "With bound 5 and lateness 15, record the watermark after each lab event. Identify the event that emits count 3, the one that revises it to 4, and the side-output event.",
    "Change lateness to 0, then bound to 10. Explain why the output policy changes while original timestamps stay the same.",
    "Fail after an external write but before checkpoint completion. Describe a sink contract that prevents duplicate effects, plus the source replay requirements.",
    "Source 8, sink 3, buffer 12: record buffered and source-pending events after 6 ticks. Propose one measurement to locate a real bottleneck."
  ],
  "answerTitle": "Check your reasoning",
  "answer": "With bound 5, W is 7, 35, 53, 60, 60, 80, 80. e4 emits 3; e5 revises it to 4; e7 is too late. The checkpoint after b restores state 30 and next offset 2; replaying c produces state 60. Blind accumulation reaches 90 at the sink; ID-based upserts retain 60. After 6 ticks, the buffer holds 9 and the source has 21 pending: total backlog 30, equal to 6 × (8 − 3).",
  "next": "Session 11 asks the next question: even when processing is correct, does the serving model answer the right business question?",
  "demo": "BROWSER SIMULATION",
  "loopNote": "The highlight repeats a fixed explanatory scenario. All steps remain visible; repeating the illustration is not a rollback of real data.",
  "quiz": [
    {
      "topicId": "b10-1",
      "q": "What does parallelism 4 mean?",
      "opts": [
        "4 permanent data copies",
        "4 operator instances",
        "4 mandatory dedicated CPU cores",
        "4 JobManagers"
      ],
      "a": 1,
      "ex": "Parallelism counts an operator’s subtasks; actual resources depend on slots and configuration."
    },
    {
      "topicId": "b10-2",
      "q": "max event time = 65s and bound = 5s: what is W in the model?",
      "opts": [
        "70s",
        "5s",
        "60s",
        "65s"
      ],
      "a": 2,
      "ex": "65 − 5 = 60. This uses the declared whole-second model."
    },
    {
      "topicId": "b10-3",
      "q": "Which tumbling window contains an event at 60s?",
      "opts": [
        "[0,60)",
        "Both windows",
        "Neither window",
        "[60,120)"
      ],
      "a": 3,
      "ex": "A half-open interval excludes its end, so 60 belongs to the next window."
    },
    {
      "topicId": "b10-4",
      "q": "W=60, window [0,60), lateness=15: an event from 50 arrives. What happens?",
      "opts": [
        "It can be accepted and trigger a revision",
        "It is always dropped",
        "W automatically drops to 50",
        "Wait 15s on the clock"
      ],
      "a": 0,
      "ex": "State remains until watermark-based cleanup; arrival-clock time alone cannot decide acceptance."
    },
    {
      "topicId": "b10-5",
      "q": "What must happen before SQL groups by window_start?",
      "opts": [
        "Any Kafka topic exists",
        "A window operation creates that column",
        "Rename amount",
        "Disable watermarks"
      ],
      "a": 1,
      "ex": "The window TVF creates window_start and window_end before grouping."
    },
    {
      "topicId": "b10-6",
      "q": "What kind of state belongs to each customer after keyBy?",
      "opts": [
        "Code backup",
        "Only the source offset",
        "Keyed state",
        "State that cannot be checkpointed"
      ],
      "a": 2,
      "ex": "Keyed state maintains separate information for each key."
    },
    {
      "topicId": "b10-7",
      "q": "A new checkpoint is incomplete at crash time. Which recovery point applies?",
      "opts": [
        "The new one even without acknowledgments",
        "The newest offset plus old state",
        "Delete all input",
        "The latest completed checkpoint"
      ],
      "a": 3,
      "ex": "State and source positions must come from the same completed snapshot."
    },
    {
      "topicId": "b10-8",
      "q": "Does breaking a chain guarantee dedicated CPU?",
      "opts": [
        "No; resources require separate configuration",
        "Yes, always",
        "Yes, if the operator is named",
        "It depends only on the watermark"
      ],
      "a": 0,
      "ex": "A chain is an execution boundary, not automatically a resource-isolation boundary."
    },
    {
      "topicId": "b10-9",
      "q": "An upstream operator reports high backpressure. What should you do first?",
      "opts": [
        "Increase every memory limit",
        "Inspect slow downstream components and related metrics",
        "Delete state",
        "Reduce Kafka retention"
      ],
      "a": 1,
      "ex": "Pressure can appear before the component causing the slowdown."
    },
    {
      "topicId": "b10-10",
      "q": "Can session mode be used in production?",
      "opts": [
        "Never",
        "Only without state",
        "Yes, when its sharing/isolation tradeoff fits",
        "It is always better than application mode"
      ],
      "a": 2,
      "ex": "It is a conditional operational choice, not a universal prohibition."
    }
  ],
  "labs": {
    "windowTitle": "Event-time lab · [0,60)",
    "windowHelp": "Events keep the same arrival order. Change bound and lateness, then read W before/after each event; count belongs only to [0,60). The highlight traverses the complete trace while the table stays visible.",
    "bound": "Disorder bound (s)",
    "lateness": "Allowed lateness (s)",
    "policy": "After cleanup",
    "policies": [
      "Side output",
      "Drop"
    ],
    "headers": [
      "ID · event/arrival (s)",
      "W before → after",
      "Action",
      "Computed count",
      "State"
    ],
    "actions": {
      "other": "Another window",
      "collect": "Accept event",
      "update": "Emit revision",
      "fire": "First emission",
      "side": "Side output",
      "drop": "Drop event"
    },
    "states": {
      "collecting": "Collecting",
      "retained": "Retained for updates",
      "deleted": "Cleaned up"
    },
    "recoveryTitle": "A valid checkpoint, but duplicate external effects?",
    "recoveryHelp": "a=10, b=20 and c=30 have reached the sink before a crash. Choose whether the checkpoint after b completed; the model also has an initial checkpoint at offset 0. Compare blind addition with event-ID upserts.",
    "checkpoint": "Checkpoint after b",
    "checkpoints": [
      "Completed",
      "Incomplete"
    ],
    "sink": "Sink write strategy",
    "sinks": [
      "Upsert by event ID",
      "Blind addition per delivery"
    ],
    "savedOffset": "Saved next offset",
    "savedState": "Saved state",
    "replayed": "Replayed events",
    "finalState": "Recovered state",
    "external": "External sink total",
    "effects": "External sink rows",
    "recoverySteps": [
      [
        "Capture the point",
        "The checkpoint retains state and offset at one logical point."
      ],
      [
        "Write, then crash",
        "External effects after the checkpoint may already have happened."
      ],
      [
        "Restore + replay",
        "Use the completed checkpoint and reread after its offset."
      ],
      [
        "Check the sink",
        "ID-based upserts prevent repeated effects in this fixture; blind addition does not."
      ]
    ],
    "queueTitle": "The buffer is full. Where does backlog go?",
    "queueHelp": "Each tick adds 8 new source events. Fill the buffer up to 12, then let the sink consume at the selected rate. Every event remains in the buffer or at the source until processed; nothing is dropped.",
    "sinkRate": "Sink events / tick",
    "queueHeaders": [
      "Tick",
      "Accepted into buffer",
      "Processed",
      "Still buffered",
      "Pending at source"
    ],
    "codeTitle": "Flink SQL 1.20 · window TVF",
    "codeNote": "A template for SQL Client with a Kafka SQL connector compatible with Flink 1.20 and JSON format. It requires broker localhost:9092, topic sales and records with product_id, amount and event_time formatted as yyyy-MM-dd HH:mm:ss.SSS. This application does not deploy the connector.",
    "apiTitle": "Java DataStream and PyFlink Table API · fragments",
    "apiNote": "These fragments assume a timestamped/watermarked Sales stream and a defined SalesAggregate, or a TableEnvironment with SalesEvents registered. They illustrate API correspondence, not standalone programs. Table API creates window w before grouping; event time and semantics must match when comparing results."
  }
} satisfies typeof VI;

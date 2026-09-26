export const SQL = `CREATE TABLE SalesEvents (
  product_id STRING,
  amount DECIMAL(12, 2),
  event_time TIMESTAMP(3),
  WATERMARK FOR event_time AS event_time - INTERVAL '5' SECOND
) WITH (
  'connector' = 'kafka',
  'topic' = 'sales',
  'properties.bootstrap.servers' = 'localhost:9092',
  'properties.group.id' = 'def-b10',
  'scan.startup.mode' = 'earliest-offset',
  'format' = 'json'
);
SELECT product_id, window_start, window_end, SUM(amount) AS total_sales
FROM TABLE(
  TUMBLE(TABLE SalesEvents, DESCRIPTOR(event_time), INTERVAL '1' MINUTE)
)
WHERE amount > 0
GROUP BY product_id, window_start, window_end;
-- Input: A/10.00/10:00:12, A/20.00/10:00:58.
-- After watermark progress: A/[10:00,10:01)/30.00.
-- A later event on each active input partition must advance the watermark.`;
export const JAVA = `// Fragment: stream is a timestamped DataStream<Sale>.
// SalesAggregate supplies createAccumulator/add/getResult/merge.
stream.keyBy(sale -> sale.productId)
    .window(TumblingEventTimeWindows.of(Duration.ofMinutes(1)))
    .aggregate(new SalesAggregate());`;
export const TABLE = `# Fragment: table_env has registered SalesEvents above.
from pyflink.table.expressions import col, lit
from pyflink.table.window import Tumble
sales = table_env.from_path("SalesEvents")
result = (sales.filter(col("amount") > 0)
    .window(Tumble.over(lit(1).minutes).on(col("event_time")).alias("w"))
    .group_by(col("product_id"), col("w"))
    .select(col("product_id"), col("w").start.alias("window_start"),
            col("w").end.alias("window_end"),
            col("amount").sum.alias("total_sales")))`;

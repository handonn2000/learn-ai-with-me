export const SPARK = `from pyspark.sql import SparkSession, functions as F
from pyspark import StorageLevel

spark = (SparkSession.builder.master("local[*]")
         .appName("def-b9").getOrCreate())
sc = spark.sparkContext
rdd = sc.parallelize([1, 2, 3, 4], 2)
assert rdd.getNumPartitions() == 2
assert rdd.sum() == 10
orders = [("o1", "VN", 100, True), ("o2", "US", 90, False),
          ("o3", "VN", 50, True), ("o4", "US", 70, True),
          ("o5", "US", 30, True), ("o6", "VN", 20, False)]
schema = "id string, region string, amount long, paid boolean"
df = spark.createDataFrame(orders, schema)
via_rdd = sc.parallelize(orders, 2).toDF(schema)
assert via_rdd.count() == 6
paid = df.filter(F.col("paid")).select("region", "amount")
paid.persist(StorageLevel.MEMORY_AND_DISK)
assert paid.count() == 4
result = paid.groupBy("region").agg(F.sum("amount").alias("total"))
result.explain("formatted")
assert [(r.region, r.total) for r in result.orderBy("region").collect()] == [
    ("US", 100), ("VN", 150)]
paid.unpersist()
spark.stop()`;
export const READERS = `# Standalone reader setup; independent of the stopped session above.
from pyspark.sql import SparkSession
spark = SparkSession.builder.master("local[*]").appName("readers").getOrCreate()
schema = "id string, region string, amount long, paid boolean"
# Prepare these files before reading.
import json
from pathlib import Path
Path("orders.csv").write_text(
    "id,region,amount,paid\\no1,VN,100,true\\no2,US,90,false\\n")
Path("orders.json").write_text("\\n".join(json.dumps(row) for row in [
    {"id": "o1", "region": "VN", "amount": 100, "paid": True},
    {"id": "o2", "region": "US", "amount": 90, "paid": False}]))
csv = spark.read.schema(schema).option("header", True).csv("orders.csv")
json_df = spark.read.schema(schema).json("orders.json")
# Both inputs contain o1 and o2; CSV is parsed with explicit types.
# Separate JDBC template: needs MySQL Connector/J on Spark's classpath.
# Source table demo.orders must exist; credentials come from environment.
import os
jdbc = (spark.read.format("jdbc")
    .option("url", "jdbc:mysql://localhost:3306/demo")
    .option("driver", "com.mysql.cj.jdbc.Driver")
    .option("dbtable", "orders")
    .option("user", os.environ["DB_USER"])
    .option("password", os.environ["DB_PASSWORD"]).load())`;
export const KRYO = `# Separate application: set before creating any SparkContext.
from pyspark import SparkConf, SparkContext
conf = (SparkConf().setMaster("local[*]").setAppName("kryo-example")
    .set("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
    .set("spark.kryoserializer.buffer", "64k")
    .set("spark.kryoserializer.buffer.max", "64m"))
# Optional JVM classes must exist on the classpath:
# conf.set("spark.kryo.classesToRegister", "com.example.MyClass")
sc = SparkContext(conf=conf)
sc.stop()`;
export const SQL = `WITH t1 AS (SELECT * FROM VALUES (50001, 10), (2, 20) AS t(id, value)),
     t2 AS (SELECT * FROM VALUES (50001), (2) AS t(id))
SELECT SUM(v)
FROM (
  SELECT t1.id, 1 + 2 + t1.value AS v
  FROM t1 JOIN t2 ON t1.id = t2.id
  WHERE t2.id > 50 * 1000
) AS selected;
-- Result: 13. Keep duplicate matching rows if the input has them.`;

export const SQL = `WITH dim_customer(customer_sk, customer_id, currency, valid_from, valid_to) AS (
  VALUES (1, '123456', 'GBP', '2025-09-01', '2025-09-26'),
         (2, '123456', 'USD', '2025-09-26', '9999-12-31')
), fact_sales(order_line_id, customer_id, event_date, sales_amount) AS (
  VALUES ('L1', '123456', '2025-09-20', 500),
         ('L2', '123456', '2025-09-26', 700)
)
SELECT f.order_line_id, d.customer_sk, d.currency, f.sales_amount
FROM fact_sales AS f
JOIN dim_customer AS d ON f.customer_id = d.customer_id
 AND f.event_date >= d.valid_from
 AND f.event_date < d.valid_to;
-- L1 / 1 / GBP / 500; L2 / 2 / USD / 700.
-- ISO date strings in this fixture sort chronologically.
-- Production schema: typed dates/timestamps with an explicit timezone policy.
-- currency is a customer preference, not transaction currency.`;
export const TRANSACTION = `{
  "transaction_id": "txn_9f3a21c8",
  "user_id": "user_48291",
  "timestamp": "2025-01-05T14:32:10Z",
  "amount": 1250.00,
  "currency": "USD",
  "card_present": false,
  "device_type": "mobile",
  "channel": "online",
  "user_country": "US",
  "ip_country": "US"
}`;
export const FEAST = `# Definition file: features.py (Feast 0.40 API example)
from datetime import timedelta
from feast import Entity, FeatureView, Field, FileSource
from feast.types import Float32
user = Entity(name="user", join_keys=["user_id"])
source = FileSource(path="data/user_features.parquet",
                    timestamp_field="event_timestamp")
user_stats = FeatureView(
    name="user_stats", entities=[user], ttl=timedelta(minutes=10),
    schema=[Field(name="avg_tx_30d", dtype=Float32)], source=source)

# Run separately after configuring feature_store.yaml and feast apply.
import pandas as pd
from datetime import datetime, timezone
from feast import FeatureStore
store = FeatureStore(repo_path=".")
entity_df = pd.DataFrame({
    "user_id": ["user_48291"],
    "event_timestamp": [pd.Timestamp("2025-01-05T10:00:00Z")]})
training = store.get_historical_features(
    entity_df=entity_df, features=["user_stats:avg_tx_30d"]).to_df()
store.materialize(
    start_date=datetime(2025, 1, 5, 9, 0, tzinfo=timezone.utc),
    end_date=datetime(2025, 1, 5, 10, 10, tzinfo=timezone.utc))
online = store.get_online_features(
    features=["user_stats:avg_tx_30d"],
    entity_rows=[{"user_id": "user_48291"}]).to_dict()`;

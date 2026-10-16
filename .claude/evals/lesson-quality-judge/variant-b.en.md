# Three moments in the data

## replay
I pause at an operation that can be repeated. Idempotency preserves the intended
final effect when the operation runs again; it does not promise a single invocation.
Starting from 0, order-a adds 10 and is sent again. Unchecked addition gives 20;
remembering the ID and skipping the duplicate leaves 10. Assume stable IDs, immutable
payloads and no concurrent failures. This memory lasts for one call, not across crashes.

## implementation
```js
function totalOnce(events) {
  let total = 0;
  const seen = new Set();
  for (const event of events) {
    if (!seen.has(event.id)) {
      total += event.amount;
      seen.add(event.id);
    }
  }
  return total;
}
```
Two copies of {id:'order-a',amount:10} return 10. Follow seen to understand why
the second iteration does not add again. This in-memory example does not promise
exactly-once payments in production.

## inventory
End-of-day stock is 100, then 80, then 120. Adding these to get 300 does not describe
current inventory. Ending stock is 120; the arithmetic average of the three snapshots
is (100 + 80 + 120) / 3 = 100. The business question determines the aggregation.

## sales
Day one contributes 500 and day two contributes 700, for total sales of 1,200.
The source says 1,300, but addition gives 1,200. These are flows across different days,
so adding is appropriate. You have seen why the same operation depends on the data's meaning.

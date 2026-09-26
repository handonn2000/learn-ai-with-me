/** Whole-second boundary model: W = max event time - disorder.
 * Flink's millisecond maxTimestamp/end-1 details are explained in the lesson.
 * Data arrives before a periodic watermark is emitted for that input event.
 */
export const EVENTS = [
  { id: 'e1', event: 12, arrival: 13 }, { id: 'e2', event: 40, arrival: 41 },
  { id: 'e3', event: 58, arrival: 59 }, { id: 'e4', event: 65, arrival: 66 },
  { id: 'e5', event: 50, arrival: 70 }, { id: 'e6', event: 85, arrival: 86 },
  { id: 'e7', event: 55, arrival: 90 },
];
export function windowTrace(disorder = 5, lateness = 15, side = true) {
  let max = -Infinity, watermark = -Infinity, count = 0, fired = false;
  return EVENTS.map(event => {
    const before = watermark;
    let action = 'other';
    if (event.event < 60) {
      if (before >= 60 + lateness) action = side ? 'side' : 'drop';
      else { count++; action = fired ? 'update' : 'collect'; }
    }
    max = Math.max(max, event.event);
    watermark = Math.max(watermark, max - disorder);
    if (!fired && watermark >= 60) { fired = true; action = 'fire'; }
    const state = watermark >= 60 + lateness ? 'deleted' : fired ? 'retained' : 'collecting';
    return { ...event, before, watermark, count, action, state };
  });
}
export function recoveryModel(protectedSink = true, complete = true) {
  const events = [{ id: 'a', amount: 10 }, { id: 'b', amount: 20 }, { id: 'c', amount: 30 }];
  const savedOffset = complete ? 2 : 0;
  const savedState = complete ? 30 : 0;
  const external = [...events]; // all three effects escaped before the crash
  let state = savedState;
  for (const event of events.slice(savedOffset)) { state += event.amount; external.push(event); }
  const effects = protectedSink ? [...new Map(external.map(e => [e.id, e])).values()] : external;
  return { savedOffset, savedState, replayed: events.length - savedOffset, state, effects: effects.length, externalTotal: effects.reduce((s, e) => s + e.amount, 0) };
}
export function queueTrace(sinkRate = 3, ticks = 6, capacity = 12) {
  let queue = 0, waiting = 0;
  return Array.from({ length: ticks }, (_, i) => {
    waiting += 8;
    const accepted = Math.min(waiting, capacity - queue);
    waiting -= accepted;
    const output = Math.min(sinkRate, queue + accepted);
    queue += accepted - output;
    return { tick: i + 1, accepted, output, queue, waiting };
  });
}

import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const root = 'src/features/lessons/def/b7/';
async function load(file) {
  const { outputText } = ts.transpileModule(fs.readFileSync(root + file, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  return import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'));
}
const { WORLD_TIMELINES: timelines, getWorldFrame } = await load('data-world-timeline.ts');
const { EN } = await load('lesson07.text.en.ts');
const { VI } = await load('lesson07.text.vi.ts');
let cases = 0;
for (const [scenario, stages] of timelines.entries()) {
  const total = stages.reduce((sum, stage) => sum + stage.duration, 0);
  assert.equal(EN.world.stageCopy[scenario].length, stages.length);
  assert.equal(VI.world.stageCopy[scenario].length, stages.length);
  let time = 0;
  for (const [index, stage] of stages.entries()) {
    assert.ok(stage.duration > 0);
    for (const [offset, progress] of [[0, 0], [stage.duration / 2, .5], [stage.duration - 1, 1 - 1 / stage.duration]]) {
      const frame = getWorldFrame(scenario, time + offset);
      assert.equal(frame.stage, index);
      assert.ok(Math.abs(frame.progress - progress) < 1e-8);
      assert.equal(frame.complete, index === stages.length - 1);
      cases++;
    }
    time += stage.duration;
  }
  for (const cycle of [1, 2]) assert.deepEqual(getWorldFrame(scenario, total * cycle), { scenario, stage: 0, progress: 0, cycle, complete: false });
  assert.deepEqual(getWorldFrame(scenario, -1), getWorldFrame(scenario, 0));
  assert.deepEqual(getWorldFrame(scenario, 99999, true), { scenario, stage: stages.length - 1, progress: 1, cycle: 0, complete: true });
}
// Technical meaning, independently stated: WAL precedes a CDC event; stream output
// returns to Kafka before loading; scheduler paths must never carry business rows.
for (const scenario of [0, 1]) {
  const capture = timelines[scenario].find(stage => stage.edge === '0>1');
  const publish = timelines[scenario].find(stage => stage.edge === '1>2');
  assert.equal(capture.packet, 'row');
  assert.equal(publish.packet, 'event');
}
assert.deepEqual(timelines[1].filter(stage => stage.edge && stage.packet === 'result').map(stage => stage.edge), ['3>2', '2>4']);
assert.deepEqual(timelines[2].filter(stage => stage.packet === 'control').map(stage => stage.edge), ['5>0', '5>4']);
assert.deepEqual(timelines[2].filter(stage => stage.edge && stage.packet !== 'control').map(stage => stage.edge), ['0>4']);
assert.ok(timelines.every(stages => !stages.at(-1).edge && stages.at(-1).duration >= 4000));
console.log(`PASS ${cases} timeline boundary/midpoint/end checks; loop resets, locale stage parity, static outcomes, and route semantics.`);

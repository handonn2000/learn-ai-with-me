import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
async function moduleAt(path) {
  const { outputText } = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  return import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'));
}
const base = 'src/features/lessons/def/b8/';
const e = await moduleAt(base + 'storage-engine.ts');
let checks = 0;
function check(name, test) { test(); checks++; console.log('PASS ' + name); }
check('five raw records partition into valid, quarantine and duplicate outputs', () => {
  const before = structuredClone(e.BRONZE), trace = e.pipelineTrace(), last = trace.at(-1).state;
  assert.equal(e.BRONZE.length, 5);
  assert.deepEqual(last.silver.map(row => [row.orderId, row.amount]), [[101,120000],[102,80000]]);
  assert.deepEqual(last.quarantine, [{rawId:'B04',reason:'amount'},{rawId:'B05',reason:'key'}]);
  assert.deepEqual(last.duplicates, [{rawId:'B02',originalRawId:'B01',orderId:101}]);
  assert.equal(last.gold, 200000);
  assert.equal(last.silver.length + last.quarantine.length + last.duplicates.length, 5);
  assert.deepEqual(e.BRONZE, before);
  assert.equal(trace[0].state.silver.length, 0);
  assert.equal(trace[1].state.silver.length, 1);
  assert.equal(trace[2].state.silver.length, 1);
  assert.equal(trace[5].state.gold, 0);
});
check('every replay frame preserves derived outputs and all counts', () => {
  const first = e.pipelineTrace().at(-1).state;
  let current = first;
  for (let replay = 0; replay < 4; replay++) {
    const trace = e.pipelineTrace(current);
    for (const frame of trace) assert.deepEqual(frame.state, first);
    assert.deepEqual(trace.slice(1,-1).map(frame => frame.action), Array(5).fill('replayed'));
    current = trace.at(-1).state;
  }
});
check('re-ingested retry is deduplicated by business key; conflict never silently overwrites', () => {
  const first = e.pipelineTrace().at(-1).state;
  const retry = e.processRow(first, {...e.BRONZE[0],rawId:'B06'});
  assert.equal(retry.action,'duplicate'); assert.equal(retry.state.silver.length,2); assert.equal(first.duplicates.length,1);
  const conflict = e.processRow(first, {...e.BRONZE[0],rawId:'B07',amount:1});
  assert.equal(conflict.action,'conflict'); assert.equal(conflict.state.silver[0].amount,120000);
  for (const amount of [NaN, Infinity, -1, '120000']) assert.equal(e.processRow(e.emptyPipeline(),{...e.BRONZE[0],amount}).action,'amount');
});
check('all policy combinations report exact fixed and unresolved failures', () => {
  for (let mask=0;mask<32;mask++) {
    const policy = Object.fromEntries(e.GOVERNANCE_CONTROLS.map((key,i)=>[key,Boolean(mask & (1<<i))]));
    for (const [issue,control] of [['discovery','catalog'],['accountability','owner'],['badAmount','validation'],['duplicate','validation'],['lineage','lineage'],['expired','retention']]) assert.equal(e.governanceStatus(issue,policy),policy[control]?'fixed':'open');
    assert.equal(e.governanceStatus('stale',policy),policy.validation?'detected':'open');
  }
});
check('HDFS obtains metadata before data; failure routes to another replica', () => {
  for (const fallback of [false,true]) {
    const trace=e.hdfsTrace(fallback);
    assert.deepEqual(trace.slice(0,3).map(frame=>frame.route),['idle','metadata-request','metadata-response']);
    assert.ok(trace.slice(0,3).every(frame=>!frame.bytesAtClient && frame.source==='none'));
    assert.equal(trace.find(frame=>frame.bytesAtClient).route,'data-response');
    assert.equal(trace.at(-1).source,fallback?'B':'A');
    assert.equal(trace.some(frame=>frame.route==='unavailable'),fallback);
    if(fallback) assert.ok(trace.findIndex(frame=>frame.route==='unavailable')<trace.findIndex(frame=>frame.route==='replica-request'));
  }
});
function shape(value) { if(Array.isArray(value))return value.map(shape);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,shape(v)]));return typeof value; }
const {VI}=await moduleAt(base+'storage-labs.text.vi.ts'),{EN}=await moduleAt(base+'storage-labs.text.en.ts');
check('lab bundles have equal structure and every engine outcome is labeled',()=>{
  assert.deepEqual(shape(VI),shape(EN));
  for(const bundle of [VI,EN]) {
    for(const frame of e.pipelineTrace())assert.ok(bundle.medallion.actions[frame.action]);
    for(const frame of e.hdfsTrace(true))assert.ok(bundle.hdfs.routes[frame.route]);
    for(const issue of e.GOVERNANCE_ISSUES)for(const enabled of [false,true]) {
      const policy=Object.fromEntries(e.GOVERNANCE_CONTROLS.map(key=>[key,enabled]));
      assert.ok(bundle.governance.issues[issue][e.governanceStatus(issue,policy)]);
    }
  }
});
console.log(`${checks} checks passed; deterministic fixture and locale coverage only.`);

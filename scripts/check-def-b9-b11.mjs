import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createServer } from 'vite';
import { createServer as createHttpServer } from 'node:http';
import { batchPlan, cacheModel, skewModel } from '../src/features/lessons/def/b9/batch-engine.js';
import { windowTrace, recoveryModel, queueTrace } from '../src/features/lessons/def/b10/stream-engine.js';
import { aggregateMeasure, scdRows, featureAt } from '../src/features/lessons/def/b11/consumption-engine.js';
assert.deepEqual(batchPlan(true).output,[{region:'VN',total:150},{region:'US',total:100}]);
assert.deepEqual(batchPlan(false).output,batchPlan(true).output);
assert.equal(batchPlan(true).moved,4);assert.equal(batchPlan(false).moved,6);
assert.deepEqual(cacheModel(2,3,'MEMORY_ONLY'),{ram:2,disk:0,computed:8,ramReads:4,diskReads:0});
assert.deepEqual(cacheModel(2,3,'MEMORY_AND_DISK'),{ram:2,disk:2,computed:4,ramReads:4,diskReads:4});
for(const c of [0,1,2,3,4])for(const s of ['MEMORY_ONLY','MEMORY_AND_DISK','DISK_ONLY']){assert.equal(cacheModel(c,1,s).computed,4);const r=cacheModel(c,4,s);assert.equal(r.computed+r.ramReads+r.diskReads,16);}
for(const salts of [1,2,4]){const r=skewModel(salts);assert.equal(r.total,730);assert.equal(r.partialSum,700);assert.equal(r.largest,700/salts);}
const trace=windowTrace();assert.deepEqual(trace.map(r=>r.watermark),[7,35,53,60,60,80,80]);
assert.equal(trace[3].action,'fire');assert.equal(trace[3].count,3);assert.equal(trace[4].action,'update');assert.equal(trace[4].count,4);assert.equal(trace[6].action,'side');
assert.equal(windowTrace(5,0,false)[4].action,'drop');assert.equal(windowTrace(5,30)[6].action,'update');
for(const bound of [0,5,10])for(const lateness of [0,15,30]){const t=windowTrace(bound,lateness);for(let i=1;i<t.length;i++)assert(t[i].watermark>=t[i-1].watermark);for(const row of t)if(['side','drop'].includes(row.action))assert(row.before>=60+lateness);}
for(const complete of [true,false]){assert.equal(recoveryModel(true,complete).externalTotal,60);assert.equal(recoveryModel(false,complete).state,60);}
assert.equal(recoveryModel(false,true).externalTotal,90);assert.equal(recoveryModel(false,false).externalTotal,120);
for(const rate of [3,6,8,10]){let output=0;for(const r of queueTrace(rate)){output+=r.output;assert.equal(output+r.queue+r.waiting,r.tick*8);assert(r.queue>=0&&r.queue<=12);}}
assert.deepEqual(queueTrace(3).at(-1),{tick:6,accepted:3,output:3,queue:9,waiting:21});
assert.equal(aggregateMeasure('revenue','sum').result,1200);assert.equal(aggregateMeasure('inventory','sum').appropriate,false);assert.equal(aggregateMeasure('inventory','average').result,100);assert.equal(aggregateMeasure('inventory','last').result,120);
assert.equal(scdRows(0,2)[0].currency,'GBP');assert.equal(scdRows(1,2)[0].currency,'EUR');assert.equal(scdRows(3,2)[0].previous,'USD');
for(const type of [2,4,6]){const rows=scdRows(type,2);assert.deepEqual(rows.map(r=>r.currency),['GBP','USD','EUR']);assert.equal(new Set(rows.map(r=>r.sk)).size,3);for(let i=1;i<3;i++)assert.equal(rows[i-1].to,rows[i].from);}
assert(scdRows(6,2).every(r=>r.current==='EUR'));
assert.equal(featureAt('historical',10).selected.value,45.73);assert.equal(featureAt('historical',5).selected.value,45.73);assert.equal(featureAt('historical',2).selected,null);assert.equal(featureAt('online',2).selected.value,47.10);
for(let time=580;time<=620;time++)for(const ttl of [2,5,10,20]){const r=featureAt('historical',ttl,time);if(r.selected){assert(r.selected.time<=time);assert(time-r.selected.time<=ttl);}assert.equal(r.leakage,false);}
const transport=createHttpServer();
const server=await createServer({server:{middlewareMode:true,hmr:{server:transport},watch:null},appType:'custom'});
try {
 const app=fs.readFileSync('src/App.tsx','utf8');
 for(const n of [9,10,11]){
  const base=`/src/features/lessons/def/b${n}/lesson${String(n).padStart(2,'0')}`;
  const {VI}=await server.ssrLoadModule(base+'.text.vi.ts');const{EN}=await server.ssrLoadModule(base+'.text.en.ts');
  assert.equal(VI.chapters.length,10);assert.equal(EN.chapters.length,10);assert.equal(VI.quiz.length,10);assert.equal(EN.quiz.length,10);
  assert(app.includes(`path="/courses/data-engineering-foundation/lessons/b${n}"`));
  for(let i=0;i<10;i++){assert.equal(VI.quiz[i].a,EN.quiz[i].a);assert.equal(VI.quiz[i].topicId,`b${n}-${i+1}`);assert.equal(new Set(VI.quiz[i].opts).size,4);assert(VI.quiz[i].a>=0&&VI.quiz[i].a<4);assert.equal(VI.chapters[i].body.length,EN.chapters[i].body.length);assert.equal(VI.chapters[i].rows.length,EN.chapters[i].rows.length);}
  const code=await server.ssrLoadModule(base+'.code.ts');for(const value of Object.values(code))assert.equal(typeof value,'string');
  if(n===11){assert.equal(JSON.parse(code.TRANSACTION).amount,1250);fs.writeFileSync('/tmp/def-lessons/scd-fixture.sql',code.SQL);}
 }
 console.log('PASS: batch conservation/cache, stream time/replay/queue, SCD/PIT boundaries, 30 quizzes and three lesson routes.');
}finally{await server.close();}

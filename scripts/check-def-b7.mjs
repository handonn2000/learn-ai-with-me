import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
async function moduleAt(path) {
  const source = fs.readFileSync(path, 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  return import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'));
}
const base = 'src/features/lessons/def/b7/';
const e = await moduleAt(base + 'ingestion-engine.ts');
const { VI } = await moduleAt(base + 'lesson07.text.vi.ts');
const { EN } = await moduleAt(base + 'lesson07.text.en.ts');
let checks = 0;
function check(name, test) { test(); checks++; console.log('PASS ' + name); }
check('all crash windows and sink protections', () => {
  for (const before of [false, true]) for (const after of [false, true]) for (const safe of [false, true]) {
    const trace = e.crashTrace(before, after, safe), last = trace.at(-1);
    const expected = before ? (after ? 10 : 0) : after && !safe ? 20 : 10;
    assert.equal(last.balance, expected); assert.equal(last.committed, 1);
    assert.equal(trace[0].balance, 0); assert.equal(trace[0].committed, 0);
    assert.ok(trace.some(f => f.action === 3));
  }
});
check('routing preserves per-key order, partition-local offsets, independent groups', () => {
  for (const n of [1,2,3,4]) for (const keyed of [false,true]) {
    const initial = e.initialRouting(n); let s = initial;
    for (let i=0; i<6; i++) s=e.sendEvent(s,keyed);
    assert.equal(initial.sent,0); assert.equal(initial.logs.flat().length,0);
    assert.equal(s.logs.flat().length,6); assert.equal(e.sendEvent(s,keyed),s);
    for (const log of s.logs) assert.deepEqual(log.map(x=>x.offset),log.map((_,i)=>i));
    if(keyed) for(const key of ['A','B','C']) assert.equal(new Set(s.logs.flat().filter(x=>x.key===key).map(x=>x.partition)).size,1);
    const old=s;
    for(let i=0;i<6;i++) s=e.readGroup(s,0);
    assert.deepEqual(s.commits[0],s.logs.map(log=>log.length)); assert.deepEqual(s.commits[1],Array(n).fill(0));
    assert.deepEqual(old.commits[0],Array(n).fill(0));
    s=e.readGroup(s,1); assert.ok(s.commits[1].some(v=>v===1));
  }
});
check('CDC hard-delete visibility and retention keep original offsets',()=> {
  assert.deepEqual(e.cdcCapture(3,0).map(x=>x.op),['INSERT','UPDATE']);
  for(const mode of [1,2]) assert.deepEqual(e.cdcCapture(3,mode).map(x=>x.op),['INSERT','UPDATE','DELETE']);
  [[0,1,2,3],[1,2,3],[2,3],[1,2,3]].forEach((offsets,policy)=>assert.deepEqual(e.retainedLog(policy).map(x=>x.offset),offsets));
});
function shape(v) { if(Array.isArray(v)) return v.map(shape); if(v && typeof v==='object') return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,shape(x)])); return typeof v; }
check('complete locale structure, chapters, quiz answer parity and validity',()=> {
  assert.deepEqual(shape(VI),shape(EN)); assert.equal(VI.chapters.length,10); assert.equal(VI.quiz.length,8);
  for(let i=0;i<8;i++){assert.ok(VI.lab.topicLabels[VI.quiz[i].topicId]);assert.ok(EN.lab.topicLabels[EN.quiz[i].topicId]);assert.equal(VI.quiz[i].a,EN.quiz[i].a);assert.equal(VI.quiz[i].topicId,EN.quiz[i].topicId);assert.ok(VI.quiz[i].a>=0 && VI.quiz[i].a<VI.quiz[i].opts.length);}
});
check('course-specific route, quiz storage and checklist namespace',()=> {
  const page=fs.readFileSync(base+'Lesson07Ingestion.tsx','utf8'),app=fs.readFileSync('src/App.tsx','utf8'),curr=fs.readFileSync('src/content/courses/data-engineering-foundation/curriculum.ts','utf8'),quiz=fs.readFileSync('src/components/SessionQuiz.tsx','utf8');
  for(const text of [app,curr]) assert.ok(text.includes('/courses/data-engineering-foundation/lessons/b7'));
  assert.ok(page.includes('courseSlug="data-engineering-foundation"')); assert.ok(page.includes('data-engineering-foundation-b7-checks')); assert.ok(quiz.includes('useProgress(courseSlug)'));
  assert.ok(page.includes('<LessonDeck on={deck} slides={SLIDES}>')); assert.ok(!page.includes('scrollIntoView'));
});
console.log(`${checks} checks passed; deterministic model, locale structure, and wiring only.`);

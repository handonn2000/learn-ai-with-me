import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { SESSION_QUIZZES as VI } from '../src/content/courses/csc14003/session-quizzes.js';
import { SESSION_QUIZZES as EN } from '../src/content/courses/csc14003/session-quizzes.en.js';
async function moduleAt(file) {
  const { outputText } = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  return import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'));
}
const base = 'src/features/lessons/b6/';
const e = await moduleAt(base + 'local-search-engine.ts');
let passed = 0;
function check(name, fn) { fn(); passed++; console.log('PASS ' + name); }
const board = s => [...s].map(Number);
check('all 256 four-queen states have 12 unique one-column neighbors and correct pair counts', () => {
  let solutions = 0;
  for (let code = 0; code < 256; code++) {
    const b = Array.from({length:4}, (_,i) => (Math.floor(code / 4 ** i) % 4) + 1);
    const pairs = [];
    for (let i=0;i<4;i++) for(let j=i+1;j<4;j++) if(b[i]===b[j] || b[i]-i===b[j]-j || b[i]+i===b[j]+j) pairs.push([i,j]);
    assert.deepEqual(e.attackingPairs(b), pairs);
    assert.equal(e.fitness(b),6-pairs.length);
    if(!pairs.length) solutions++;
    const neighbors = e.neighbors(b);
    assert.equal(neighbors.length,12); assert.equal(new Set(neighbors.map(String)).size,12);
    for(const n of neighbors) assert.equal(n.filter((v,i)=>v!==b[i]).length,1);
  }
  assert.equal(solutions,2);
});
check('source boards, strict local minimum, homework path and crossover counterexample', () => {
  assert.equal(e.conflicts(board('56745676')),17);
  assert.equal(Math.min(...e.neighbors(board('56745676')).map(e.conflicts)),12);
  assert.equal(e.conflicts(board('83742516')),1);
  assert.equal(Math.min(...e.neighbors(board('83742516')).map(e.conflicts)),2);
  assert.deepEqual(['1214','2214','2414','2413'].map(s=>e.conflicts(board(s))),[5,3,1,0]);
  assert.deepEqual(['2341','2132','1232','4321'].map(s=>e.fitness(board(s))),[2,3,1,0]);
  assert.deepEqual(e.crossover(board('2413'),board('3142'),2),board('2442'));
  assert.equal(e.fitness(board('2442')),2);
});
check('traces are deterministic, immutable and every move obeys its algorithm', () => {
  const initial = board('56745676');
  for(const algorithm of ['steepest','first','sideways','restart']) for(let seed=1;seed<=20;seed++) {
    const tr=e.queenTrace(initial,algorithm,seed);
    assert.deepEqual(tr,e.queenTrace(initial,algorithm,seed)); assert.deepEqual(initial,board('56745676'));
    assert.ok(tr.length<=242);
    for(let i=0;i<tr.length;i++) {
      const f=tr[i];assert.equal(f.h,e.conflicts(f.board));assert.ok(f.run<=30);
      if(!i)continue;
      const before=tr[i-1];assert.ok(f.evaluated>=before.evaluated);
      if(f.action==='improve' || f.action==='sideways') {
        assert.equal(f.board.filter((v,c)=>v!==before.board[c]).length,1);
        assert.ok(f.action==='improve'?f.h<before.h:f.h===before.h);
        if(algorithm!=='first') assert.equal(f.h,Math.min(...e.neighbors(before.board).map(e.conflicts)));
      }
      if(f.action==='restart'){ assert.equal(f.run,before.run+1); assert.equal(algorithm,'restart'); }
    }
    const final=tr.at(-1);
    if(final.action==='goal') assert.equal(final.h,0);
    else assert.ok(['stuck','limit'].includes(final.action));
  }
  assert.equal(e.queenTrace(board('83742516'),'restart',3).at(-1).h,0);
  assert.equal(e.queenTrace(board('83742516'),'restart',42).at(-1).action,'limit');
  assert.equal(e.queenTrace(board('2413'),'steepest').at(-1).action,'goal');
});
check('SA probabilities, zero temperature, fitness weights and mutation boundaries', () => {
  assert.equal(e.acceptance(-2,1),1);assert.equal(e.acceptance(0,1),1);assert.equal(e.acceptance(2,0),0);
  assert.ok(Math.abs(e.acceptance(2,2)-Math.exp(-1))<1e-12);
  assert.ok(e.acceptance(2,10)>e.acceptance(2,1));
  assert.deepEqual(e.selectionProbabilities(e.GA_POPULATION),[1/3,1/2,1/6,0]);
  assert.deepEqual(e.selectionProbabilities([board('1234'),board('4321')]),[0.5,0.5]);
  for(let cut=1;cut<=7;cut++){
    const child=e.crossover(...e.GA_PARENTS,cut);
    assert.equal(child.length,8);
    assert.deepEqual(child.slice(0,cut),e.GA_PARENTS[0].slice(0,cut));
    assert.deepEqual(child.slice(cut),e.GA_PARENTS[1].slice(cut));
    for(let col=0;col<8;col++)for(let row=1;row<=8;row++){
      const m=e.mutate(child,col,row); assert.equal(m[col],row);assert.ok(m.filter((v,i)=>v!==child[i]).length<=1);
    }
  }
});
check('graph coloring example follows all eleven drawn edges', () => {
  const edges=['AB','BC','AD','BD','BG','CG','DE','DF','DG','FG','GH'];
  const state={A:'b',B:'y',C:'b',D:'r',E:'b',F:'y',G:'b',H:'b'};
  const h=()=>edges.filter(([a,b])=>state[a]===state[b]).length;
  assert.equal(h(),2);state.C='r';assert.equal(h(),1);state.H='y';assert.equal(h(),0);
});
check('all eight quiz answers and topics align; question data is nonempty', () => {
  assert.equal(VI.b6.length,8); assert.equal(EN.b6.length,8);
  assert.deepEqual(VI.b6.map(q=>q.a),[1,1,2,1,2,2,2,3]);
  VI.b6.forEach((q,i)=>{assert.equal(q.topicId,EN.b6[i].topicId);assert.equal(q.a,EN.b6[i].a);assert.equal(q.opts.length,4);assert.equal(EN.b6[i].opts.length,4);assert.ok(q.ex && EN.b6[i].ex);});
});
const {PYTHON}=await moduleAt(base+'lesson06.code.ts');
check('every displayed Python block executes; saved best does not alias current/population', () => {
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'ai-b6-python-'));
  try {
    PYTHON.forEach((code,i)=>{
      const assertions=[
        '\nassert h(hill_climbing([8,3,7,4,2,5,1,6])) == 1\nassert h(hill_climbing([2,4,1,3])) == 0\n',
        '\nfor seed in range(10):\n    best,current=anneal([8,3,7,4,2,5,1,6],seed=seed)\n    assert h(best) <= h(current)\nassert anneal([2,4,1,3])[0] == [2,4,1,3]\n',
        '\nfor seed in range(5):\n    q=genetic(n=4, seed=seed)\n    assert len(q)==4 and all(1<=v<=4 for v in q)\nassert len(genetic(generations=0))==8\n',
      ];
      const file=path.join(temp,`sample-${i}.py`);fs.writeFileSync(file,code+assertions[i]);execFileSync('python3',[file],{timeout:15000,stdio:'pipe'});
    });
  } finally {fs.rmSync(temp,{recursive:true,force:true});}
});
console.log(`${passed} local-search checks passed.`);

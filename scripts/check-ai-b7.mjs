import assert from 'node:assert/strict';
import { analyzeGame } from '../src/features/lessons/b7/game-engine.js';

const defaults=analyzeGame();
assert.equal(defaults.value,3);
assert.equal(defaults.chosen,'A');
assert.equal(defaults.read.length,4);
assert.equal(analyzeGame([3,5,0,7],true,false,true).read.length,3);
assert.equal(analyzeGame([3,5,0,7],true,true,true).read.length,4);
assert.equal(analyzeGame([3,5,0,100]).chosen,'A');
assert.equal(analyzeGame([3,5,4,7]).chosen,'B');
assert.equal(analyzeGame([3,5,0,7],false).value,5);
assert.equal(analyzeGame([3,3,3,3],true,false,true).chosen,'A');
assert.equal(analyzeGame([3,3,3,3],true,true,true).chosen,'B');
assert.throws(()=>analyzeGame([1,2,Infinity,4]));

let seed=42;
const next=()=>{seed=(seed*1664525+1013904223)>>>0;return (seed%201)-100;};
for(let i=0;i<200;i++) {
  const scores=Array.from({length:4},next);
  for(const rootMax of [true,false]) for(const reverse of [true,false]) {
    const childOp=rootMax ? Math.min : Math.max;
    const rootOp=rootMax ? Math.max : Math.min;
    const childValues={A:childOp(scores[0],scores[1]),B:childOp(scores[2],scores[3])};
    const expected=rootOp(childValues.A,childValues.B);
    const full=analyzeGame(scores,rootMax,reverse,false);
    const alpha=analyzeGame(scores,rootMax,reverse,true);
    assert.equal(full.value,expected);
    assert.equal(alpha.value,expected);
    assert.equal(childValues[alpha.chosen],expected);
    assert.equal(alpha.read.length+alpha.skipped.length,4);
    assert.ok(alpha.skipped.every(id=>!alpha.read.includes(id)));
    for(const frame of alpha.trace) {
      if(frame.kind==='leaf') assert.ok(frame.read.includes(frame.id));
      if(frame.kind==='cut') {
        assert.ok(frame.bounds[frame.id].alpha>=frame.bounds[frame.id].beta);
        assert.equal(frame.exact[frame.id],false);
        const trueValue=childValues[frame.id];
        assert.ok(rootMax ? trueValue<=frame.score : trueValue>=frame.score);
      }
    }
  }
}
console.log('PASS: defaults, mutations, ties, MIN root, reverse ordering, invalid input; 800 generated cases preserve minimax value and valid cutoff bounds.');

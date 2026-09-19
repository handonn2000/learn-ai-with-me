import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createServer as createHttpServer } from 'node:http';
import { createServer } from 'vite';
import { advancePool, canPublish, INTERVALS, makeBatch, poolFrame, replacePartition, validateBatch } from '../src/features/lessons/def/b12/orchestration-engine.js';

let checks = 0;
function check(name, fn) { fn(); checks++; console.log(`✓ ${name}`); }
check('reruns replace the same interval and backfills add only selected partitions', () => {
  let partitions = replacePartition({}, INTERVALS[0]);
  for (let i = 0; i < 5; i++) partitions = replacePartition(partitions, INTERVALS[0]);
  assert.deepEqual(partitions, { '2026-05-15': 3 });
  partitions = replacePartition(partitions, INTERVALS[1]);
  assert.equal(Object.values(partitions).reduce((a, b) => a + b), 6);
  assert.throws(() => replacePartition(partitions, 'unknown'));
});
check('resource limits, run admission, accounting and completion hold at every tick', () => {
  for (const parallelism of [1, 4, 16, 64]) for (const maxRuns of [1, 2]) for (const slots of [1, 5, 10, 20]) {
    const limits = { parallelism, maxRuns, slots };
    let done = [0, 0];
    for (let tick = 0; tick <= 200; tick++) {
      const f = poolFrame(done, limits);
      const running = f.running.reduce((a, b) => a + b);
      assert(running <= Math.min(parallelism, slots));
      assert(f.running.filter(n => n > 0).length <= maxRuns);
      done.forEach((n, i) => assert.equal(n + f.running[i] + f.waiting[i] + f.blocked[i], 100));
      if (maxRuns === 1 && done[0] < 100) assert.equal(f.blocked[1], 100);
      if (done.every(n => n === 100)) break;
      assert(running > 0, 'unfinished work must make progress');
      done = advancePool(done, limits);
    }
    assert.deepEqual(done, [100, 100]);
  }
  const initial = poolFrame([0, 0], { parallelism: 64, maxRuns: 1, slots: 5 });
  assert.deepEqual(initial, { running: [5, 0], waiting: [95, 0], blocked: [0, 100], completed: [0, 0] });
});
check('each injected fault fails its intended rule and prevents publication', () => {
  const valid = makeBatch(0), result = validateBatch(valid);
  assert.equal(result.pass, true);
  assert.equal(canPublish(valid, null), false);
  assert.equal(canPublish(valid, result), true);
  const expected = [null, 1, 2, 3, 4, 0, 5, 6];
  for (let fault = 1; fault <= 7; fault++) {
    const batch = makeBatch(fault), r = validateBatch(batch);
    assert.equal(r.pass, false);
    assert.equal(r.checks[expected[fault]].pass, false);
    assert.equal(canPublish(batch, r), false);
    assert.equal(canPublish(batch, result), false, 'a stale passing result cannot approve changed input');
  }
});
check('quality boundaries are explicit; empty, invalid and stale batches fail safely', () => {
  const batch = makeBatch();
  batch.updatedAt = '2026-05-15T04:00:00Z';
  assert(validateBatch(batch).checks[4].pass, 'exactly 24 hours passes');
  batch.updatedAt = '2026-05-15T03:59:59Z';
  assert(!validateBatch(batch).checks[4].pass);
  batch.updatedAt = 'invalid'; assert(!validateBatch(batch).checks[4].pass);
  batch.rows = []; assert(!validateBatch(batch).pass);
  const b = makeBatch(); b.baseline = 10; b.rows = Array.from({ length: 7 }, (_, i) => ({ ...b.rows[0], order_id: i }));
  assert(validateBatch(b).checks[5].pass, 'exactly 30% drop passes');
  b.rows.pop(); assert(!validateBatch(b).checks[5].pass);
  const nan = makeBatch(); nan.rows[0].amount = NaN; assert(!validateBatch(nan).pass);
});
const transport = createHttpServer();
const server = await createServer({ server: { middlewareMode: true, hmr: { server: transport }, watch: null }, appType: 'custom' });
try {
  const { VI } = await server.ssrLoadModule('/src/features/lessons/def/b12/lesson12.text.vi.ts');
  const { EN } = await server.ssrLoadModule('/src/features/lessons/def/b12/lesson12.text.en.ts');
  const { CONTRACT, GATE, OPERATORS, XCOM } = await server.ssrLoadModule('/src/features/lessons/def/b12/lesson12.code.ts');
  check('both locales have ten chapters, ten valid questions and stable quiz IDs', () => {
    for (const t of [VI, EN]) {
      assert.equal(t.chapters.length, 10); assert.equal(t.quiz.length, 10);
      for (const c of t.chapters) { assert(c.body.length >= 4); assert(c.rows.every(r => r.length === c.headers.length)); }
      for (const q of t.quiz) { assert(t.topicLabels[q.topicId]); assert.equal(q.opts.length, 4); assert(q.a >= 0 && q.a < 4); }
    }
    assert.deepEqual(VI.quiz.map(q => [q.topicId, q.a]), EN.quiz.map(q => [q.topicId, q.a]));
    assert.equal(new Set(VI.labs.faults).size, 8);
  });
  check('all displayed code tokenizes losslessly; illustrative contract defines unique fields', () => {
    for (const code of [GATE, OPERATORS, XCOM, CONTRACT]) {
      const tokens = code.split(/(#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:from|import|def|return|if|or|and|in|for|raise|as|True|False|None|true|false|null)\b|\b\d+(?:\.\d+)?\b|@[\w.]+|[{}\[\]():,])/g);
      assert.equal(tokens.join(''), code);
    }
    const c = JSON.parse(CONTRACT); c.unique.forEach(field => assert(c.fields[field]));
  });
  check('Python samples parse and gate functions reject bad input before producing expected repaired output', () => {
    const python = `import ast, json, sys
samples = json.load(sys.stdin)
for code in samples.values(): ast.parse(code)
module = ast.parse(samples['GATE'])
outer = next(n for n in module.body if isinstance(n, ast.FunctionDef))
functions = [n for n in outer.body if isinstance(n, ast.FunctionDef)]
for function in functions: function.decorator_list = []
namespace = {}
exec(compile(ast.fix_missing_locations(ast.Module(body=functions, type_ignores=[])), '<teaching-functions>', 'exec'), namespace)
rows = namespace['extract']()
try:
 namespace['validate'](rows)
except ValueError: pass
else: raise AssertionError('null key should fail')
rows[1]['order_id'] = 102
assert namespace['publish'](namespace['validate'](rows)) == {'count': 2, 'total': 200000}
rows[1]['amount'] = 0
try:
 namespace['validate'](rows)
except ValueError: pass
else: raise AssertionError('nonpositive amount should fail')
`;
    const result = spawnSync('python3', ['-c', python], { input: JSON.stringify({ GATE, OPERATORS, XCOM }), encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  });
  check('route, course-scoped quiz/checklist, and lecture navigation are wired', () => {
    const app = readFileSync('src/App.tsx', 'utf8');
    const page = readFileSync('src/features/lessons/def/b12/Lesson12Orchestration.tsx', 'utf8');
    assert(app.includes('path="/courses/data-engineering-foundation/lessons/b12"'));
    assert(page.includes('courseSlug="data-engineering-foundation" sessionId="b12"'));
    assert(page.includes('storageKey="data-engineering-foundation-b12-checks"'));
    for (const id of ['hero', 'toan', 'summary', 'checks', 'quiz', 'hw']) assert(page.includes(`id="${id}"`));
    assert(page.includes('<LessonDeck on={deck} slides={SLIDES}>'));
    assert(!page.includes('scrollIntoView'));
  });
  console.log(`${checks} lesson checks passed.`);
} finally { await server.close(); }

// Focused checks for multi-course persistence and the planned DEF curriculum.
// Uses the existing Vite dependency to load TypeScript; adds no test framework.
import assert from 'node:assert/strict';
import { createServer as createHttpServer } from 'node:http';
import { createServer } from 'vite';

// Attach Vite's transport to an unlistened server so these checks never open a port.
const transport = createHttpServer();
const server = await createServer({ server: { middlewareMode: true, hmr: { server: transport }, watch: null }, appType: 'custom' });
let checks = 0;
function check(name, run) { run(); checks++; console.log(`✓ ${name}`); }
try {
  const { loadProgress, saveProgress, progressKey } = await server.ssrLoadModule('/src/lib/storage.ts');
  const { dataEngineeringFoundation: vi } = await server.ssrLoadModule('/src/content/courses/data-engineering-foundation/index.ts');
  const { dataEngineeringFoundationEn: en } = await server.ssrLoadModule('/src/content/courses/data-engineering-foundation/index.en.ts');
  const { csc14003: ai } = await server.ssrLoadModule('/src/content/courses/csc14003/index.ts');
  const values = new Map();
  const store = {
    get: (key, fallback) => values.has(key) ? JSON.parse(values.get(key)) : fallback,
    set: (key, value) => values.set(key, JSON.stringify(value)),
  };
  check('legacy AI key is preserved', () => assert.equal(progressKey(), 'csc14003-progress'));
  const legacy = { sessions: { b1: { status: 'done', quizWrong: ['Phép thử Turing'] } }, partTests: { '1': { score: 75, correct: 3, total: 4, right: ['Buổi 3'], wrong: ['Buổi 4'], at: '2026-09-01' } } };
  store.set(progressKey(), legacy);
  check('AI migrations still preserve completion and map legacy part/topic IDs', () => {
    const db = loadProgress(store);
    assert.equal(db.sessions.b1.status, 'done');
    assert.deepEqual(db.sessions.b1.quizWrong, ['turing-test']);
    assert.equal(db.partTests.searching.score, 75);
    assert.deepEqual(db.partTests.searching.right, ['b3']);
  });
  check('new course starts empty despite matching session IDs', () => assert.deepEqual(loadProgress(store, vi.slug), { sessions: {} }));
  const aiBefore = values.get(progressKey());
  const def = loadProgress(store, vi.slug);
  def.sessions.b1 = { status: 'doing' };
  saveProgress(def, store, vi.slug);
  check('saving DEF progress leaves AI bytes unchanged', () => {
    assert.equal(values.get(progressKey()), aiBefore);
    assert.equal(loadProgress(store, vi.slug).sessions.b1.status, 'doing');
  });
  check('AI-specific migrations do not rewrite another course', () => {
    store.set(progressKey('other'), { sessions: { b1: { quizWrong: ['Phép thử Turing'] } }, partTests: { '1': { score: 60 } } });
    const db = loadProgress(store, 'other');
    assert.deepEqual(db.sessions.b1.quizWrong, ['Phép thử Turing']);
    assert.equal(db.partTests['1'].score, 60);
  });
  check('empty stores do not share mutable progress objects', () => {
    const a = loadProgress(store, 'empty-a'), b = loadProgress(store, 'empty-b');
    a.sessions.b1 = { status: 'done' };
    assert.deepEqual(b.sessions, {});
    assert.deepEqual(loadProgress(store, 'empty-a'), { sessions: {} });
  });
  check('12 distinct sessions cover 12 consecutive weeks in 4 nonempty phases', () => {
    assert.equal(vi.sessions.length, 12);
    assert.equal(new Set(vi.sessions.map(s => s.id)).size, 12);
    assert.deepEqual(vi.sessions.map(s => s.week), Array.from({ length: 12 }, (_, i) => i + 1));
    assert.equal(vi.parts.length, 4);
    assert.equal(new Set(vi.parts.map(p => p.id)).size, 4);
    vi.parts.forEach((_, i) => assert(vi.sessions.some(s => s.part === i)));
  });
  check('all prerequisites exist and precede their dependent session', () => {
    for (const s of vi.sessions) for (const id of s.prerequisiteIds) {
      const previous = vi.sessions.find(p => p.id === id);
      assert(previous && previous.week < s.week, `${s.id} depends on ${id}`);
    }
  });
  check('VI/EN use identical structural IDs, schedule and prerequisite graph', () => {
    const shape = c => ({ slug: c.slug, code: c.code, weeks: c.weeks, parts: c.parts.map(p => [p.id, p.color]), sessions: c.sessions.map(s => [s.id, s.week, s.part, s.hours, s.prerequisiteIds, s.links, s.lessonPath]) });
    assert.deepEqual(shape(vi), shape(en));
    assert.deepEqual(Object.keys(vi.baseline), Object.keys(en.baseline));
    assert.equal(vi.baseline.outcomes.length, en.baseline.outcomes.length);
    assert.equal(vi.baseline.prerequisites.length, en.baseline.prerequisites.length);
  });
  check('every session supplies an outcome and planned evidence in both languages', () => {
    for (const c of [vi, en]) for (const s of c.sessions) {
      for (const key of ['title', 'topics', 'math', 'outcome', 'practice']) assert(s[key]?.length > 15, `${s.id}.${key}`);
    }
  });
  check('only implemented DEF week 7 links to a lesson; no active DEF part tests', () => {
    assert(!vi.roadmapOnly && !en.roadmapOnly);
    assert.equal(vi.hasPartTests, false);
    assert.equal(en.hasPartTests, false);
    for (const c of [vi, en]) for (const s of c.sessions) { assert.equal(s.lessonPath, s.id === 'b7' ? '/courses/data-engineering-foundation/lessons/b7' : undefined); assert.deepEqual(s.links, []); }
    assert.equal(ai.hasPartTests, true);
  });
  check('weekly workload reconciles to 72–96 hours', () => {
    const total = vi.sessions.reduce((acc, s) => {
      const [, lo, hi] = /~(\d+)–(\d+)h/.exec(s.hours);
      return [acc[0] + Number(lo), acc[1] + Number(hi)];
    }, [0, 0]);
    assert.deepEqual(total, [72, 96]);
  });
  console.log(`${checks} course checks passed.`);
} finally {
  await server.close();
}

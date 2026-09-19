import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

async function moduleAt(path) {
  const { outputText } = ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } });
  return import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'));
}
const base = 'src/features/lessons/def/b8/';
const { VI } = await moduleAt(base + 'lesson08.text.vi.ts');
const { EN } = await moduleAt(base + 'lesson08.text.en.ts');
const page = fs.readFileSync(base + 'Lesson08Storage.tsx', 'utf8');
const app = fs.readFileSync('src/App.tsx', 'utf8');
for (const text of [VI, EN]) {
  assert.equal(text.chapters.length, 10);
  assert.equal(text.quiz.length, 10);
  assert.ok(text.terms.length >= 4);
  for (const chapter of text.chapters) {
    assert.ok(chapter.body.length >= 2, chapter.title);
    for (const row of chapter.table.rows) assert.equal(row.length, chapter.table.headers.length, chapter.title);
  }
  for (const question of text.quiz) {
    assert.ok(question.a >= 0 && question.a < question.opts.length);
    assert.equal(new Set(question.opts).size, question.opts.length);
    assert.ok(question.topicId.startsWith('def8.') && text.topicLabels[question.topicId]);
    assert.ok(question.ex.length > 30);
  }
}
assert.deepEqual(VI.quiz.map(q => [q.topicId, q.a]), EN.quiz.map(q => [q.topicId, q.a]));
assert.match(app, /path="\/courses\/data-engineering-foundation\/lessons\/b8" element={<DefLesson08/);
assert.match(page, /storageKey="data-engineering-foundation-b8-checks"/);
assert.match(page, /sessionId="b8" courseSlug="data-engineering-foundation" questions={T.quiz}/);
for (const anchor of ['hero', 'toan', 'summary', 'checks', 'quiz', 'hw']) assert.ok(page.includes(`id="${anchor}"`), anchor);
assert.match(page, /const SLIDES = \[{ id: 'hero'/);
assert.ok(!page.includes('localStorage.') && !page.includes('scrollIntoView'));
console.log('PASS DEF b8: 10 chapters, rectangular tables, 10 bilingual quiz answers, topic IDs, route and course-scoped progress wiring.');

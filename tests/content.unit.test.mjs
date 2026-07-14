import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const moduleIds = ['introduction', 'elements-of-design', 'principles', 'typography', 'color-theory', 'grids', 'contrast-accessibility'];

async function loadBrowserScript(file, context = { window: {} }) {
  context.window.window = context.window;
  vm.runInNewContext(await readFile(file, 'utf8'), context, { filename: file });
  return context.window;
}

async function filesBelow(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const ignoreDirs = ['.git', '.github', 'node_modules', 'tests', 'tools', '.agents', '.tmp-edge-admin'];
      if (ignoreDirs.includes(entry.name)) return [];
      return filesBelow(full);
    }
    return [full];
  }))).flat();
}

test('course catalogue defines the seven expected modules in order', async () => {
  const window = await loadBrowserScript(path.join(root, 'data', 'course.js'));
  assert.deepEqual(Array.from(window.GD.course.modules, module => module.id), moduleIds);
  assert.equal(new Set(window.GD.course.modules.map(module => module.id)).size, 7);
});

for (const moduleId of moduleIds) {
  test(`${moduleId} dataset satisfies the shared lesson contract`, async () => {
    const context = { window: { GDLessons: {} } };
    const window = await loadBrowserScript(path.join(root, 'data', 'lessons', `${moduleId}.js`), context);
    const lesson = window.GDLessons[moduleId];
    assert.ok(lesson, 'dataset must register itself');
    assert.equal(lesson.id, moduleId);
    assert.ok(lesson.title && lesson.description && lesson.kicker);
    assert.ok(lesson.objectives.length >= 4);
    assert.ok(lesson.terms.length >= 6);
    assert.ok(lesson.misconceptions.length >= 3);
    assert.equal(lesson.sections.length, 8);
    assert.equal(new Set(lesson.sections.map(section => section.id)).size, 8);
    for (const section of lesson.sections) {
      assert.ok(section.title && section.eyebrow && section.example);
      assert.ok(section.body.length >= 1);
      assert.ok(section.keyPoints.length >= 2);
    }
    assert.ok(lesson.activity.type);
    assert.ok(lesson.review.length >= 5);
    assert.equal(lesson.quiz.length, 15);
    for (const question of lesson.quiz) {
      assert.equal(question.options.length, 4);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
      assert.ok(question.explanation.length >= 20);
    }
    assert.ok(lesson.summary.takeaways.length >= 5);
    assert.ok(lesson.summary.nextSteps);
  });
}

test('public text sources contain no common mojibake markers', async () => {
  const targets = (await filesBelow(root))
    .filter(file => /\.(?:html|css|js)$/.test(file));
  for (const file of targets) {
    const source = await readFile(file, 'utf8');
    assert.doesNotMatch(source, /â€|Ã.|ðŸ|Â©/, path.relative(root, file));
  }
});


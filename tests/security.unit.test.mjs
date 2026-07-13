import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');

test('Firestore rules use the admin custom claim and deny unmatched paths', async () => {
  const rules = await readFile(path.join(root, 'firestore.rules'), 'utf8');
  assert.match(rules, /request\.auth\.token\.admin\s*==\s*true/);
  assert.doesNotMatch(rules, /ADMIN_EMAIL|request\.auth\.token\.email\s*==\s*['"][^'"]+@/);
  assert.match(rules, /canUseModule\(uid, moduleId\)/);
  assert.match(rules, /data\.score\s*==\s*calculatedScore\(moduleId, data\.answers\)/);
  assert.match(rules, /data\.attempts\s*==\s*1/);
  assert.match(rules, /match \/\{document=\*\*\}/);
  assert.match(rules, /allow read, write: if false/);
});

test('Firestore quiz answer keys stay synchronized with all lesson datasets', async () => {
  const rules = await readFile(path.join(root, 'firestore.rules'), 'utf8');
  const moduleIds = ['introduction', 'elements-of-design', 'principles', 'typography', 'color-theory', 'grids', 'contrast-accessibility'];
  for (const moduleId of moduleIds) {
    const context = { window: { GDLessons: {} } };
    vm.runInNewContext(
      await readFile(path.join(root, 'public', 'data', 'lessons', `${moduleId}.js`), 'utf8'),
      context,
    );
    const answers = context.window.GDLessons[moduleId].quiz.map(question => question.answer).join(',');
    assert.ok(rules.includes(`moduleId == '${moduleId}' ? [${answers}]`), `${moduleId} answer key is out of sync`);
  }
});

test('Firebase web configuration contains placeholders and no private key', async () => {
  const config = await readFile(path.join(root, 'public', 'js', 'firebase-config.js'), 'utf8');
  assert.doesNotMatch(config, /PRIVATE KEY|private_key|service_account/);
  assert.match(config, /window\.GD_FIREBASE_CONFIG/);
});

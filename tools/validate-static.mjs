import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');
const failures = [];

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  }));
  return nested.flat();
}

const files = await listFiles(publicDir);
const htmlFiles = files.filter(file => file.endsWith('.html') && !file.includes(`${path.sep}legacy${path.sep}`));
const jsFiles = files.filter(file => file.endsWith('.js') && !file.includes(`${path.sep}legacy${path.sep}`));

for (const file of htmlFiles) {
  const source = await readFile(file, 'utf8');
  const ids = [...source.matchAll(/\sid=["']([^"']+)["']/g)].map(match => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) failures.push(`${path.relative(root, file)} has duplicate IDs: ${[...new Set(duplicates)].join(', ')}`);

  for (const match of source.matchAll(/(?:href|src)=["']([^"'#?]+)(?:[?#][^"']*)?["']/g)) {
    const ref = match[1];
    if (/^(?:https?:|mailto:|tel:|data:)/.test(ref)) continue;
    const target = path.resolve(path.dirname(file), ref);
    try {
      await access(target);
    } catch {
      if (!ref.includes('firebase-config.js') && !ref.startsWith('legacy/')) {
        failures.push(`${path.relative(root, file)} references missing ${ref}`);
      }
    }
  }
}

for (const file of jsFiles) {
  const source = await readFile(file, 'utf8');
  if (/\beval\s*\(|new\s+Function\s*\(/.test(source)) failures.push(`${path.relative(root, file)} uses dynamic code execution`);
  try {
    new vm.Script(source, { filename: path.relative(root, file) });
  } catch (error) {
    failures.push(`${path.relative(root, file)} has invalid JavaScript: ${error.message}`);
  }
}

const lessonDir = path.join(publicDir, 'data', 'lessons');
const lessonFiles = (await readdir(lessonDir)).filter(file => file.endsWith('.js'));
if (lessonFiles.length !== 7) failures.push(`Expected 7 lesson datasets, found ${lessonFiles.length}`);

if (failures.length) {
  console.error(failures.map(item => `- ${item}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Static validation passed: ${htmlFiles.length} pages, ${jsFiles.length} scripts, ${lessonFiles.length} lessons.`);
}

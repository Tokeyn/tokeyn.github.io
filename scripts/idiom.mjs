import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname);

const idiomJson = await import(`./idiom2.json`, {
  assert: { type: 'json' },
}).then(module => module.default);

const idiomJsonNew = Object.fromEntries(
  idiomJson
    .filter(item => item.word.length === 4)
    .map(item => [item.word, item.pinyin])
);
const outputFile = path.join(outputDir, `idiomNew4.json`);
await fs.writeFile(outputFile, JSON.stringify(idiomJsonNew, null, 2));

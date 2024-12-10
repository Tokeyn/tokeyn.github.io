import chalk from 'chalk';
import { LangZh } from 'ethers/wordlists-extra';
import fs from 'fs/promises';
import _ from 'lodash';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname);
const dataDir = path.join(outputDir, 'data');

await fs.mkdir(dataDir, { recursive: true });

console.log(chalk.bgWhite('===================================='));

const wordlistCn = LangZh.wordlist('cn');
// const wordlisTw = LangZh.wordlist('tw');

async function readAndParseFile(filePath) {
  const fileContent = await fs.readFile(path.join(__dirname, filePath), {
    encoding: 'utf-8',
  });
  return fileContent
    .split('\n')
    .filter(Boolean)
    .map(text => JSON.parse(text));
  // .filter(item => wordlistCn.getWordIndex(item.character) != -1);
}
async function readAndParseFile(filePath) {
  const fileContent = await fs.readFile(path.join(__dirname, filePath), {
    encoding: 'utf-8',
  });
  return fileContent
    .split('\n')
    .filter(Boolean)
    .map(text => JSON.parse(text));
  // .filter(item => wordlistCn.getWordIndex(item.character) != -1);
}

const [dictionaryItems, graphicsItems] = await Promise.all([
  readAndParseFile('./makemeahanzi/dictionary.txt'),
  readAndParseFile('./makemeahanzi/graphics.txt'),
]);
console.log(
  dictionaryItems.length === graphicsItems.length,
  'Dictionary and graphics mismatch'
);
for (let i = 0; i < dictionaryItems.length; i++) {
  const dictionaryItem = dictionaryItems[i];
  const graphicsItem = graphicsItems[i];
  if (dictionaryItem.character !== graphicsItem.character) {
    console.log('====================================');
    console.log(
      'Character mismatch at index',
      i,
      dictionaryItem.character,
      graphicsItem.character
    );
    console.log('====================================');
  }
}

/**
 * @typedef  {{ type: string; hint: string; }} Etymology
 * @typedef  {{ character: string; definition: string; pinyin: string[]; decomposition: string; etymology: Etymology; radical: string; matches: (number[]|null)[];}} DictionaryItem
 */
/**
 * @typedef  {{ character: string; strokes: string[]; medians: number[][][];}} GraphicsItem
 */

/**
 * @type {Record<string, DictionaryItem>}
 */
const dictionaryMap = Object.fromEntries(
  dictionaryItems.map(item => [item.character, item])
);

/**
 * @type {Record<string, GraphicsItem>}
 */
const graphicsMap = Object.fromEntries(
  graphicsItems.map(item => [item.character, item])
);

console.log('====================================');
console.log('Start', dictionaryItems.length, graphicsItems.length);
console.log('====================================');

const positioners = {
  '⿰': 2,
  '⿱': 2,
  '⿲': 3,
  '⿳': 3,
  '⿴': 2,
  '⿵': 2,
  '⿶': 2,
  '⿷': 2,
  '⿸': 2,
  '⿹': 2,
  '⿺': 2,
  '⿻': 2,
};
//   const missingMarker = '？';

// get_decomp_index 转为 js
/**
 *
 * @param {string} char
 * @returns
 */
function getDecompositionIndex(char) {
  const dictionaryItem = dictionaryMap[char];
  /**
   * @type {Array<{size: number, children: number, path: number[]}>}
   */
  const stack = [];

  if (dictionaryItem.decomposition) {
    for (const componentChar of dictionaryItem.decomposition) {
      // One component of the decomposition
      let lastNode = null;
      // 为什么需要 lastNode？

      /**
       * @type {number[]}
       */
      let path = []; // The path to the current node
      if (stack.length > 0) {
        lastNode = stack.pop();
        path = [...lastNode.path, lastNode.children];
        lastNode.children += 1;
        if (lastNode.children < lastNode.size) {
          stack.push(lastNode);
        }
      }
      if (componentChar in positioners) {
        /**
         * @type {{size: number, children: number, path: number[]}}
         */
        const node = {
          size: positioners[componentChar],
          children: 0,
          path,
        };
        stack.push(node);
      } else if (componentChar === dictionaryItem.radical) {
        return path;
      }
    }
  }

  return null;
}
/**
 *
 * @param {string} char
 * @returns
 */
function getRadicalStrokes(char) {
  const dictionaryItem = dictionaryMap[char];
  if (dictionaryItem.character === dictionaryItem.radical) {
    return null;
  }
  // 获取 decomposition index 位置，如果没有则返回 null
  const decompIndex = getDecompositionIndex(char);
  if (!decompIndex) {
    return null;
  }
  const radStrokes = [];

  for (let i = 0; i < dictionaryItem.matches.length; i++) {
    const matchIndex = dictionaryItem.matches[i];
    if (_.isEqual(matchIndex, decompIndex)) {
      radStrokes.push(i);
    }
  }
  return radStrokes;
}

// write out data graphics_data
for (const char in graphicsMap) {
  const graphicsItem = graphicsMap[char];
  const radStrokes = getRadicalStrokes(char);
  if (radStrokes != null && radStrokes.length > 0) {
    graphicsItem.radStrokes = radStrokes;
  }
}

// write out data
for (const char in graphicsMap) {
  const graphicsItem = graphicsMap[char];
  const outputFile = path.join(dataDir, `${graphicsItem.character}.json`);
  await fs.writeFile(outputFile, JSON.stringify(graphicsItem, null, 2));

  const original = await import(
    `hanzi-writer-data/${graphicsItem.character}.json`,
    { assert: { type: 'json' } }
  ).then(module => module.default);
  const character = graphicsItem.character;
  delete graphicsItem.character;
  if (_.isEqual(original, graphicsItem)) {
    process.stdout.write(chalk.green('.'));
  } else {
    if (_.isEqual(original.radStrokes, graphicsItem.radStrokes)) {
      process.stdout.write(chalk.yellow(character));
    } else {
      console.log();
      process.stdout.write(chalk.red(character));
      console.log(graphicsItem.radStrokes);
      console.log(original.radStrokes);
      console.log();
    }
  }
}
console.log();
console.log(chalk.bgWhite('===================================='));

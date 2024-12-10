import chalk from 'chalk';
import { ethers } from 'ethers';
import { fileURLToPath } from 'url';
import { isMainThread, parentPort, Worker, workerData } from 'worker_threads';

console.log('====================================');
console.log(chalk.bgRed('Start'));
console.log('====================================');

if (isMainThread) {
  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  // const __dirname = path.dirname(__filename); // get the name of the directory
  // const regex = /^0x(\d)\1\1\1|(\d)\2\2\2$/;
  // const regex = /^0x(\d)\1\1\1\1\1|(\d)\2\2\2\2\2$/;
  const worker = new Worker(__filename, {
    workerData: /(.)\1{6,}/i,
  });
  worker.on('message', message => {
    const result = JSON.parse(message);
    if (result) {
      process.stdout.write('\n');
      console.log(
        chalk.red.underline(
          result.address.replace(result.text, chalk.bgYellow(result.text))
        ),
        // chalk.bgYellow(result.address.substr(-1)),
        result.mnemonic
          .split(' ')
          .map(word => chalk.bgBlue(word.slice(0, 4)))
          .join(' ')
      );
    } else {
      process.stdout.write('.');
    }
  });
  // worker.on('error', ());
  // worker.on('exit', code => {
  //   if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
  // });
} else {
  console.log('Inside Worker!');
  console.log(isMainThread); // Prints 'false'.

  for (let i = 0; ; i++) {
    const randomBytes = ethers.randomBytes(32);
    const mnemonic = ethers.Mnemonic.fromEntropy(randomBytes, '');
    const wallet = ethers.Wallet.fromPhrase(mnemonic.phrase);
    // const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic);
    const match = wallet.address.match(workerData);
    if (match) {
      parentPort.postMessage(
        JSON.stringify({
          address: wallet.address,
          mnemonic: mnemonic.phrase,
          text: match[0],
          char: match[1],
        })
      );

      // console.log(`在字符串 "${str}" 中找到连续 5 个相同字符: ${match[0]}，重复字符是 "${match[1]}"`);
    } else {
      // print dot per 1000 times
      if (i % 10000 === 0) {
        parentPort.postMessage(JSON.stringify(null));
      }
    }
  }
}

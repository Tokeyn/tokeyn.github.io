import chalk from 'chalk';
import { ethers } from 'ethers';

// regex birthday
// const regex = /^0x\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])/;
const regex =
  /^0x(18\d{2}|19\d{2}|20\d{2}|2100)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])/;
const regex2 =
  /(18\d{2}|19\d{2}|20\d{2}|2100)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;

const regex3 = /^(\d)\1\1\1\1|(\d)\2\2\2\2$/;

console.log('====================================');
console.log(chalk.bgRed('Start'));
console.log('====================================');
for (let i = 0; ; i++) {
  const randomBytes = ethers.randomBytes(32);
  const mnemonic = ethers.Mnemonic.fromEntropy(randomBytes);
  // const wallet = ethers.Wallet.fromPhrase(mnemonic.phrase);
  const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonic);
  if (
    regex.test(wallet.address) ||
    regex2.test(wallet.address) ||
    regex3.test(wallet.address)
  ) {
    // new line
    process.stdout.write('\n');
    console.log(
      chalk.red.underline(wallet.address),
      mnemonic.phrase
        .split(' ')
        .map(word => chalk.bgBlue(word.slice(0, 4)))
        .join(' ')
    );
  } else {
    // print dot per 1000 times
    if (i % 1000 === 0) {
      process.stdout.write('.');
    }
  }
}

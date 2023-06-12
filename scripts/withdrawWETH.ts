import { ethers } from 'hardhat';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

async function main() {
  dotenvConfig({ path: resolve(__dirname, './.env') });
  const wethAddress = process.env.WETH || '';
  const [owner] = await ethers.getSigners();
  console.log('owner: ', owner.address);

  const WETH = await ethers.getContractAt('WETH9', wethAddress);
  const balance = await WETH.balanceOf(owner.address);
  if (balance != 0) {
    console.log('start withdraw: ', balance);
    const txn = await WETH.withdraw(balance);
    await txn.wait();
  }
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});

import { ethers } from 'hardhat';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

async function main() {
  dotenvConfig({ path: resolve(__dirname, './.env') });
  const RandomNumberGeneratorAddress = process.env.RandomNumberGenerator || '';
  const renkinLotteryAddress = process.env.RENKIN_LOTTERY_ADDRESS || '';

  const RandomNumberGenerator = await ethers.getContractAt(
    'RandomNumberGenerator',
    RandomNumberGeneratorAddress
  );
  const txn = await RandomNumberGenerator.setLotteryAddress(
    renkinLotteryAddress
  );
  await txn.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

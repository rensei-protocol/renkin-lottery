import { ethers } from 'hardhat';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

async function main() {
  dotenvConfig({ path: resolve(__dirname, './.env') });
  const renkinLotteryAddress = process.env.RenkinLotteryAddress || '';
  const [owner] = await ethers.getSigners();
  console.log('owner: ', owner.address);

  const RenkinLottery = await ethers.getContractAt(
    'RenkinLottery',
    renkinLotteryAddress
  );
  const txn = await RenkinLottery.drawFinalNumberAndMakeLotteryClaimable(
    1,
    false
  );
  console.log(txn.hash);
  await txn.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

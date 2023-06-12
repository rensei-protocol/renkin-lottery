import { ethers } from 'hardhat';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

async function main() {
  dotenvConfig({ path: resolve(__dirname, './.env') });
  const renkinLotteryAddress = process.env.RENKIN_LOTTERY_ADDRESS || '';
  const [owner] = await ethers.getSigners();
  console.log('owner: ', owner.address);

  const RenkinLottery = await ethers.getContractAt(
    'RenkinLottery',
    renkinLotteryAddress
  );
  const lottery = await RenkinLottery.viewLottery('1');
  console.log(lottery);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

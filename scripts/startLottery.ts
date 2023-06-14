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
  const endTime = Math.floor(Date.now() / 1000) + 360;

  console.log('endTime: ', endTime);
  const priceTicketInWeth = ethers.parseEther('0.005');
  const discountDivisor = 300;
  const rewardsBreakdown = [100, 500, 1000, 2000, 3000, 3400];
  const treasuryFee = 1000;
  const txn = await RenkinLottery.startLottery(
    endTime,
    priceTicketInWeth,
    discountDivisor,
    rewardsBreakdown,
    treasuryFee
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

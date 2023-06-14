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
  const txn = await RenkinLottery.setOperatorAndTreasuryAndInjectorAddresses(
    owner.address,
    owner.address,
    owner.address
  );
  console.log(txn.hash);
  await txn.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

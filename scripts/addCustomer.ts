import { ethers } from 'hardhat';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

async function main() {
  dotenvConfig({ path: resolve(__dirname, './.env') });
  const MockCoordinatorAddress = process.env.VRFCoordinatorV2Mock || '';
  const renkinLotteryAddress = process.env.RENKIN_LOTTERY_ADDRESS || '';
  const MockCoordinator = await ethers.getContractAt(
    'VRFCoordinatorV2Mock',
    MockCoordinatorAddress
  );
  const txn = await MockCoordinator.addConsumer('1', renkinLotteryAddress);
  await txn.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

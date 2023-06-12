import { ethers } from 'hardhat';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

async function main() {
  dotenvConfig({ path: resolve(__dirname, './.env') });
  const MockCoordinatorAddress = process.env.VRFCoordinatorV2Mock || '';
  const MockCoordinator = await ethers.getContractAt(
    'VRFCoordinatorV2Mock',
    MockCoordinatorAddress
  );
  await MockCoordinator.fundSubscription('1', '1000000000000000000');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

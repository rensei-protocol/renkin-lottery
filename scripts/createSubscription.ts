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
  await MockCoordinator.createSubscription();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

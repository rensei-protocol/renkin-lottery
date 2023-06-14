import { ethers } from 'hardhat';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

async function main() {
  dotenvConfig({ path: resolve(__dirname, './.env') });
  const keyHash = process.env.KeyHash || '';
  const subscriptionId = process.env.SubscriptionId || 0;
  const [owner] = await ethers.getSigners();
  console.log('owner: ', owner.address);
  console.log('Start deploying mock weth contract');
  const weth = await ethers.deployContract('WETH9');
  await weth.waitForDeployment();
  console.log('WETH Address: ', weth.target);

  // mock coordinator
  // console.log('Start deploying VRFCoordinatorV2Mock');
  // const mockCoordinator = await ethers.deployContract('VRFCoordinatorV2Mock', [
  //   '100000000000000000',
  //   '1000000000',
  // ]);
  // await mockCoordinator.waitForDeployment();
  // console.log('VRFCoordinatorV2Mock: ', mockCoordinator.target);

  // https://vrf.chain.link/goerli
  const vrfCoordinatorAddress = '0x2ca8e0c643bde4c2e08ab1fa0da3401adad7734d';
  // const vrfCoordinatorAddress = mockCoordinator.target;
  const randomNumberGenerator = await ethers.deployContract(
    'RandomNumberGenerator',
    [subscriptionId, vrfCoordinatorAddress, keyHash]
  );
  await randomNumberGenerator.waitForDeployment();
  console.log('RandomNumberGenerator Address: ', randomNumberGenerator.target);

  const renkinLottery = await ethers.deployContract('RenkinLottery', [
    weth.target,
    randomNumberGenerator.target,
  ]);
  await renkinLottery.waitForDeployment();
  console.log('RenkinLottery address: ', renkinLottery.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

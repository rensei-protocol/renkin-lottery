import { ethers } from 'hardhat';

async function main() {
  const [owner] = await ethers.getSigners();
  console.log('owner: ', owner.address);
  console.log('Start deploying mock weth contract');
  const weth = await ethers.deployContract('WETH9');
  await weth.waitForDeployment();
  console.log('WETH Address: ', weth.target);

  // mock coordinator
  console.log('Start deploying VRFCoordinatorV2Mock');
  const mockCoordinator = await ethers.deployContract('VRFCoordinatorV2Mock', [
    '100000000000000000',
    '1000000000',
  ]);
  await mockCoordinator.waitForDeployment();
  console.log('VRFCoordinatorV2Mock: ', mockCoordinator.target);

  // https://docs.chain.link/vrf/v2/direct-funding/supported-networks
  // const vrfCoordinatorAddress = "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D";
  const vrfCoordinatorAddress = mockCoordinator.target;
  const linkTokenAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';
  const randomNumberGenerator = await ethers.deployContract(
    'RandomNumberGenerator',
    [vrfCoordinatorAddress, linkTokenAddress]
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

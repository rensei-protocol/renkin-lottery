import { ethers } from "hardhat";

async function main() {
  const weth = await ethers.deployContract("WETH9");
  await weth.waitForDeployment();
  console.log("WETH Address: ", weth.target);

  // mock coordinator
  const mockCoordinator = await ethers.deployContract("VRFCoordinatorV2Mock",["100000000000000000","1000000000"]);
  await mockCoordinator.waitForDeployment();
  console.log("VRFCoordinatorV2Mock: ", mockCoordinator.target);

  // create subscription
  await mockCoordinator.createSubscription();

  // check subscription
  const sub = await mockCoordinator.getSubscription(1);
  console.log("subscription", sub);

  // fund subscription
  await mockCoordinator.fundSubscription(1,"1000000000000000000");

  // check subscription again
  const subAfter = await mockCoordinator.getSubscription(1);
  console.log("subscription after funding: ", subAfter);

  // https://docs.chain.link/vrf/v2/direct-funding/supported-networks
  // const vrfCoordinatorAddress = "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D";
  const vrfCoordinatorAddress = mockCoordinator.target;
  const linkTokenAddress = "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D";
  const randomNumberGenerator = await ethers.deployContract("RandomNumberGenerator", [vrfCoordinatorAddress, linkTokenAddress]);
  await randomNumberGenerator.waitForDeployment();
  console.log("RandomNumberGenerator Address: ", randomNumberGenerator.target);

  const renkinLottery = await ethers.deployContract("RenkinLottery", [weth.target, randomNumberGenerator.target]);
  await renkinLottery.waitForDeployment();
  console.log("RenkinLottery address: ", renkinLottery.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

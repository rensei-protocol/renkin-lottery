import { ethers } from "hardhat";

async function main() {
  const weth = await ethers.deployContract("WETH9");
  await weth.waitForDeployment();
  console.log("WETH Address: ", weth.target);

  // https://docs.chain.link/vrf/v2/direct-funding/supported-networks
  const vrfCoordinatorAddress = "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D";
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

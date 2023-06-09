import { ethers } from "hardhat";

async function main() {
  const weth = await ethers.deployContract("WETH9");
  // todo reandom number generator address
  const renkinLottery = await ethers.deployContract("RenkinLottery", [weth.target,weth.target]);
  await renkinLottery.waitForDeployment();
  console.log("RenkinLottery address: ", renkinLottery.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

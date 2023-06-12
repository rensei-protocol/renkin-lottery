import { ethers } from "hardhat";

async function main() {
  const renkinLotteryAddress= "0x61EE99710796728029D116A2a1DF70C61aE94ab3";
  const [owner] = await ethers.getSigners();
  console.log("owner: ", owner.address);

  const WETH = await ethers.getContractAt("WETH9", "0xf853F41c9D13B99ED8f23F086fBe226404745ACd");
  if (await WETH.balanceOf(owner.address) == 0) {
    console.log("weth balance is 0, start depositing")
    const txn = await WETH.deposit({value: ethers.parseEther("0.5")});
    await txn.wait();
  }

  const wethBalance = await WETH.balanceOf(owner.address);
  console.log("weth balance: ", wethBalance);

  if (await WETH.allowance(owner.address, renkinLotteryAddress) == 0) {
    console.log("allowance is 0, start approving");
    const txn = await WETH.approve(renkinLotteryAddress, "10000000000000000000000");
    await txn.wait();
  }

  const allowance = await WETH.allowance(owner.address, renkinLotteryAddress);
  console.log("allowance: ", allowance);


  const RenkinLottery = await ethers.getContractAt("RenkinLottery", renkinLotteryAddress);
  await RenkinLottery.buyTickets("1", [1000000,1000000,1000000,1000000,1000000,1000000]);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
})
import { ethers } from 'hardhat';

async function main() {
  const [owner] = await ethers.getSigners();
  console.log('owner: ', owner.address);

  const renkinLotteryAddress = '0x61EE99710796728029D116A2a1DF70C61aE94ab3';
  const RenkinLottery = await ethers.getContractAt(
    'RenkinLottery',
    renkinLotteryAddress
  );
  const txn = await RenkinLottery.drawFinalNumberAndMakeLotteryClaimable(
    1,
    false
  );
  await txn.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

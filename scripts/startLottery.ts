import { ethers } from 'hardhat';

async function main() {
  const [owner] = await ethers.getSigners();
  console.log('owner: ', owner.address);

  const renkinLotteryAddress = '0x61EE99710796728029D116A2a1DF70C61aE94ab3';
  const RenkinLottery = await ethers.getContractAt(
    'RenkinLottery',
    renkinLotteryAddress
  );
  const endTime = Math.floor(Date.now() / 1000) + 360;

  console.log('endTime: ', endTime);
  const priceTicketInWeth = ethers.parseEther('0.005');
  const discountDivisor = 300;
  const rewardsBreakdown = [100, 500, 1000, 2000, 3000, 3400];
  const treasuryFee = 1000;
  await RenkinLottery.startLottery(
    endTime,
    priceTicketInWeth,
    discountDivisor,
    rewardsBreakdown,
    treasuryFee
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

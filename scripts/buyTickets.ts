import { ethers } from 'hardhat';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

async function main() {
  dotenvConfig({ path: resolve(__dirname, './.env') });
  const renkinLotteryAddress = process.env.RenkinLotteryAddress || '';
  const wethAddress = process.env.WETH || '';

  const [owner] = await ethers.getSigners();
  console.log('owner: ', owner.address);

  const WETH = await ethers.getContractAt('WETH9', wethAddress);
  if ((await WETH.balanceOf(owner.address)) == 0) {
    console.log('weth balance is 0, start depositing');
    const txn = await WETH.deposit({ value: ethers.parseEther('0.5') });
    await txn.wait();
  }

  const wethBalance = await WETH.balanceOf(owner.address);
  console.log('weth balance: ', wethBalance);

  if ((await WETH.allowance(owner.address, renkinLotteryAddress)) == 0) {
    console.log('allowance is 0, start approving');
    const txn = await WETH.approve(
      renkinLotteryAddress,
      '10000000000000000000000'
    );
    await txn.wait();
  }

  const allowance = await WETH.allowance(owner.address, renkinLotteryAddress);
  console.log('allowance: ', allowance);

  const RenkinLottery = await ethers.getContractAt(
    'RenkinLottery',
    renkinLotteryAddress
  );
  const txn = await RenkinLottery.buyTickets(
    '1',
    [1000000, 1000000, 1000000, 1000000, 1000000, 1000000]
  );
  await txn.wait();
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});

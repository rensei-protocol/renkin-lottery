import { ethers } from 'hardhat';

async function main() {
  const [owner] = await ethers.getSigners();
  console.log('owner: ', owner.address);

  const WETH = await ethers.getContractAt(
    'WETH9',
    '0xf853F41c9D13B99ED8f23F086fBe226404745ACd'
  );
  const balance = await WETH.balanceOf(owner.address);
  if (balance != 0) {
    console.log('start withdraw: ', balance);
    const txn = await WETH.withdraw(balance);
    await txn.wait();
  }
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});

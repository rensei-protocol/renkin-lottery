import { ethers } from 'hardhat';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

async function main() {
  dotenvConfig({ path: resolve(__dirname, './.env') });
  const RandomNumberGeneratorAddress = process.env.RandomNumberGenerator || '';

  const RandomNumberGenerator = await ethers.getContractAt(
    'RandomNumberGenerator',
    RandomNumberGeneratorAddress
  );
  const txn = await RandomNumberGenerator.setKeyHash(
    '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc'
  );
  await txn.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

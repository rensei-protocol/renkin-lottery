import { ethers } from 'hardhat';

async function main() {
  const MockCoordinator = await ethers.getContractAt(
    'VRFCoordinatorV2Mock',
    '0x695a1207cdec657Ea8E268b3B7CAE1C12A8BBC18'
  );
  await MockCoordinator.createSubscription();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

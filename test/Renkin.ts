import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat';

describe('Lottery', function () {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    // deploy weth
    const WETH = await ethers.getContractFactory('WETH9');
    const weth = await WETH.deploy();

    // deploy mock coordinator
    const MockCoordinator = await ethers.getContractFactory(
      'VRFCoordinatorV2Mock'
    );
    const mockCoordinator = await MockCoordinator.deploy(
      '100000000000000000',
      '1000000000'
    );

    // deploy mock LINK
    const MockLink = await ethers.getContractFactory('LINK');
    const mockLink = await MockLink.deploy('10000000000000000000000');

    // deploy randomNumber generator
    const RandomNumberGenerator = await ethers.getContractFactory(
      'RandomNumberGenerator'
    );
    const randomNumberGenerator = await RandomNumberGenerator.deploy(
      1,
      mockCoordinator.target,
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc'
    );

    await mockLink.transfer(
      randomNumberGenerator.target,
      '100000000000000000000'
    );

    // deploy renkin lottery
    const RenkinLottery = await ethers.getContractFactory('RenkinLottery');
    const renkinLottery = await RenkinLottery.deploy(
      weth.target,
      randomNumberGenerator.target
    );

    await randomNumberGenerator.setLotteryAddress(renkinLottery.target);

    await renkinLottery.setOperatorAndTreasuryAndInjectorAddresses(
      owner.address,
      owner.address,
      owner.address
    );

    // deposit eth
    await weth.deposit({ value: ethers.parseEther('0.5') });

    // approve weth
    await weth.approve(renkinLottery.target, '10000000000000000000000');

    // create subscription
    await mockCoordinator.createSubscription();

    // fund subscription
    await mockCoordinator.fundSubscription('1', '1000000000000000000');

    // add customer
    await mockCoordinator.addConsumer('1', randomNumberGenerator.target);

    // start lottery
    const endTime = Math.floor(Date.now() / 1000) + 360;
    const priceTicketInWeth = ethers.parseEther('0.005');
    const discountDivisor = 300;
    const rewardsBreakdown = [100, 500, 1000, 2000, 3000, 3400];
    const treasuryFee = 1000; // 10%
    await renkinLottery.startLottery(
      endTime,
      priceTicketInWeth,
      discountDivisor,
      rewardsBreakdown,
      treasuryFee
    );

    return {
      weth,
      mockCoordinator,
      mockLink,
      randomNumberGenerator,
      renkinLottery,
      owner,
      otherAccount,
    };
  }

  describe('Deployment', function () {
    it('Should create correct lottery', async function () {
      const {
        mockCoordinator,
        renkinLottery,
        randomNumberGenerator,
        weth,
        owner,
      } = await loadFixture(deployFixture);

      // buy tickets
      await renkinLottery.buyTickets(
        '1',
        [1016461, 1016461, 1016461, 1016461, 1016461, 1016461]
      );

      // fast forward
      await increase(1);

      // close lottery
      await renkinLottery.closeLottery('1');

      // fulfill
      await mockCoordinator.fulfillRandomWords(
        '1',
        randomNumberGenerator.target
      );

      // draw
      await renkinLottery.drawFinalNumberAndMakeLotteryClaimable('1', false);

      // view lottery
      const l = await renkinLottery.viewLottery('1');
      console.log('lottery: ', l);

      // view numbers
      const n = await renkinLottery.viewNumbersAndStatusesForTicketIds([
        0, 1, 2, 3, 4, 5,
      ]);
      console.log('number: ', n);

      // view rewards
      for (let bracket = 0; bracket < 6; bracket++) {
        console.log('\n');
        console.log('bracket number: %d', bracket);
        for (let ticket = 0; ticket < 6; ticket++) {
          console.log(
            'rewards for ticket %d : ',
            ticket,
            await renkinLottery.viewRewardsForTicketId('1', ticket, bracket)
          );
        }
      }

      // claim tickets
      const wethBalanceBefore = await weth.balanceOf(owner.address);
      await renkinLottery.claimTickets(
        1,
        [0, 1, 2, 3, 4, 5],
        [3, 3, 3, 3, 3, 3]
      );
      const wethBalanceAfter = await weth.balanceOf(owner.address);
      const increased = wethBalanceAfter - wethBalanceBefore;
      console.log(
        'before: %d, after: %d, increased: %d',
        wethBalanceBefore,
        wethBalanceAfter,
        increased
      );
    });
  });
});

async function increase(n: number) {
  const days = n * 24 * 60 * 60;
  await ethers.provider.send('evm_increaseTime', [days]);
  await ethers.provider.send('evm_mine', []);
}

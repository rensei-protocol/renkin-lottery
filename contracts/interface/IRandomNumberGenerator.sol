// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IRandomNumberGenerator {
    function getRandomNumber() external;

    /**
     * View latest lotteryId numbers
     */
    function viewLatestLotteryId() external view returns (uint256);

    /**
     * Views random result
     */
    function viewRandomResult() external view returns (uint32);
}

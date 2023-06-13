// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IRenkinLottery} from "./interface/IRenkinLottery.sol";
import {IRandomNumberGenerator} from "./interface/IRandomNumberGenerator.sol";
import "hardhat/console.sol";

contract RandomNumberGenerator is
    VRFConsumerBaseV2,
    Ownable,
    IRandomNumberGenerator
{
    VRFCoordinatorV2Interface immutable COORDINATOR;
    uint64 immutable subscriptionId;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 constant CALLBACK_GAS_LIMIT = 100000;

    // The default is 3, but you can set this higher.
    uint16 constant REQUEST_CONFIRMATIONS = 3;

    // For this example, retrieve 1 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 constant NUM_WORDS = 1;

    uint256 public requestId;
    address public renkinLottery;
    bytes32 public keyHash;
    uint32 public randomResult;
    uint256 public latestLotteryId;

    constructor(
        uint64 _subscriptionId,
        address _vrfCoordinator,
        bytes32 _keyHash
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        subscriptionId = _subscriptionId;
        keyHash = _keyHash;
    }

    function getRandomNumber() external override {
        require(msg.sender == renkinLottery, "Only renkinLottery");
        require(keyHash != bytes32(0), "Must have valid key hash");

        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            subscriptionId,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            NUM_WORDS
        );
    }

    /**
     * @notice Change the keyHash
     * @param _keyHash: new keyHash
     */
    function setKeyHash(bytes32 _keyHash) external onlyOwner {
        keyHash = _keyHash;
    }

    function setLotteryAddress(address _renkinLottery) external onlyOwner {
        renkinLottery = _renkinLottery;
    }

    /**
     * @notice View latestLotteryId
     */
    function viewLatestLotteryId() external view override returns (uint256) {
        return latestLotteryId;
    }

    /**
     * @notice View random result
     */
    function viewRandomResult() external view override returns (uint32) {
        return randomResult;
    }

    /**
     * @notice Callback function used by ChainLink's VRF Coordinator
     */
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(requestId == _requestId, "Wrong requestId");
        randomResult = uint32(1000000 + (_randomWords[0] % 1000000));
        latestLotteryId = IRenkinLottery(renkinLottery).viewCurrentLotteryId();
    }
}

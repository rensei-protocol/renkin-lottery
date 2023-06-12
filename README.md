# Renkin Lottery

## User Inerface

### buyTickets

```solidity
/**
    * @notice Buy tickets for the current lottery
    * @param _lotteryId: lotteryId
    * @param _ticketNumbers: array of ticket numbers between 1,000,000 and 1,999,999
    * @dev Callable by users
    */
function buyTickets(
    uint256 _lotteryId,
    uint32[] calldata _ticketNumbers
) external override notContract nonReentrant
```

### claimTickets

```solidity
/**
    * @notice Claim a set of winning tickets for a lottery
    * @param _lotteryId: lottery id
    * @param _ticketIds: array of ticket ids
    * @param _brackets: array of brackets for the ticket ids
    * @dev Callable by users only, not contract!
    */
function claimTickets(
    uint256 _lotteryId,
    uint256[] calldata _ticketIds,
    uint32[] calldata _brackets
) external override notContract nonReentrant
```

## Workflow

1. startLottery
2. buyTickets

## Random number generator

1. https://docs.chain.link/vrf/v2/direct-funding
2. https://docs.chain.link/vrf/v2/direct-funding/supported-networks

## Deploy

```javascript
yarn hardhart run scripts/deploy.ts --network mainnet
```

// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.9;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LINK is ERC20 {
    constructor(uint256 initialSupply) ERC20("Chain LINK", "LINK") {
        _mint(msg.sender, initialSupply);
    }
}

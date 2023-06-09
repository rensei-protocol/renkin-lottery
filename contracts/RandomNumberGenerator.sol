// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {IRandomNumberGenerator} from "./interface/IRandomNumberGenerator";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract RandomNumberGenerator is IRandomNumberGenerator,Ownable {}
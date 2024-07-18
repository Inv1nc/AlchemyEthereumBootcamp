//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import {Contract} from "../src/Contract.sol";
import {console} from "forge-std/console.sol";

contract ContractTest is Test {
    Contract public winner;
    Attack public attack;

    function setUp() external {
        winner = new Contract();
        attack = new Attack();
    }

    function testWinner() external {
        attack.exploit(winner);
    }
}

contract Attack {
    function exploit(Contract winner) public {
        winner.attempt();
    }
}

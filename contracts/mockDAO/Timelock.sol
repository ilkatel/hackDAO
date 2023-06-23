// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Timelock {

    function executeTransaction(
        address target, 
        uint value, 
        string memory signature, 
        bytes memory data
    ) external payable returns (bytes memory) {
        bytes memory callData;

        if (bytes(signature).length == 0) {
            callData = data;
        } else {
            callData = abi.encodePacked(bytes4(keccak256(bytes(signature))), data);
        }

        (bool success, bytes memory returnData) = target.call{value: value}(callData);
        require(success, "Timelock::executeTransaction: Transaction execution reverted.");

        return returnData;
    }
}
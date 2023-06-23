// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract AttackerMaliciousProposal {
    
    string public testResult;

    /**
     * Used as a test to demonstrate that it is possible to change 
     * the bytecode of an already deployed contract.
     * In reality, this may be a more important function that can lead 
     * to critical consequences. For example, sending funds or calling an administrative function.
     */
    function test() external payable {
        testResult = "malicious";
    }
}
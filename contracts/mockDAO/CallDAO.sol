// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./ITimelock.sol";

contract CallDAO {

    struct Proposal {
        uint256 id;
        address[] targets;
        uint256[] values;
        string[] signatures;
        bytes[] calldatas;
        bool executed;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId;
    ITimelock public timelock;

    constructor(
        ITimelock _timelock
    ) {
        timelock = _timelock;
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas
    ) public returns (uint256 id) {
        uint256 l = targets.length;
        require(
            l == values.length && l == signatures.length && l == calldatas.length,
            "GovernorBravo::propose: proposal function information arity mismatch"
        );
        require(l != 0, "GovernorBravo::propose: must provide actions");

        id = nextProposalId;
        ++nextProposalId;

        Proposal memory newProposal = Proposal({
            id: id,
            targets: targets,
            values: values,
            signatures: signatures,
            calldatas: calldatas,
            executed: false
        });
        
        proposals[id] = newProposal;
    }

    function execute(uint256 proposalId) external payable {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Already executed");

        proposal.executed = true;
        for (uint256 i = 0; i < proposal.targets.length; i++) {
            timelock.executeTransaction{value: proposal.values[i]}(
                proposal.targets[i], proposal.values[i], proposal.signatures[i], proposal.calldatas[i]
            );
        }
    }
}
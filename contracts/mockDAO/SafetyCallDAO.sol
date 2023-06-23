// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./ITimelock.sol";

contract SafetyCallDAO {

    struct Proposal {
        uint256 id;
        address[] targets;
        uint256[] values;
        string[] signatures;
        bytes[] calldatas;
        bytes32[] codeHashes;
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
        uint256 l = targets.length;  // gas saving

        require(
            l == values.length && l == signatures.length && l == calldatas.length,
            "GovernorBravo::propose: proposal function information arity mismatch"
        );
        require(l != 0, "GovernorBravo::propose: must provide actions");

        id = nextProposalId;
        ++nextProposalId;

        bytes32[] memory codeHashes = new bytes32[](l);
        for (uint256 i; i < l; ) {
            codeHashes[i] = keccak256(targets[i].code);
            unchecked { ++i; }  // gas saving
        }

        Proposal memory newProposal = Proposal({
            id: id,
            targets: targets,
            values: values,
            signatures: signatures,
            calldatas: calldatas,
            codeHashes: codeHashes,
            executed: false
        });
        
        proposals[id] = newProposal;
    }

    function execute(uint256 proposalId) external payable {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Already executed");

        proposal.executed = true;
        uint256 l = proposal.targets.length;  // gas saving
        for (uint256 i; i < l; ) {
            require(proposal.codeHashes[i] == keccak256(proposal.targets[i].code), "Changes alert");

            timelock.executeTransaction{value: proposal.values[i]}(
                proposal.targets[i], proposal.values[i], proposal.signatures[i], proposal.calldatas[i]
            );

            unchecked { ++i; }  // gas saving
        }
    }
}
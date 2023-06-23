import { expect } from "chai";
import { ethers } from "hardhat";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

import { 
  Attacker01, Attacker01__factory,
  Timelock, Timelock__factory,
  CallDAO, CallDAO__factory,
  SafetyCallDAO, SafetyCallDAO__factory
} from "../typechain-types";

let admin: SignerWithAddress;
let attackerAdmin: SignerWithAddress;
let timelock: Timelock;
let dao: CallDAO;
let safetyDao: SafetyCallDAO;
let deployer: Attacker01;
let value: bigint;

describe("DAO tests", function () {

  beforeEach(async function () {
    [admin, attackerAdmin] = await ethers.getSigners();
    
    timelock = await new Timelock__factory(admin).deploy();
    await timelock.waitForDeployment();

    value = ethers.parseEther("5");
  });

  it("malicious proposal", async function () {
    // deploy contracts

    // deploy not safety dao
    dao = await new CallDAO__factory(admin).deploy(timelock.target);
    await dao.waitForDeployment();

    // deploy attacker deployer contract
    deployer = await new Attacker01__factory(attackerAdmin).deploy();
    await deployer.waitForDeployment();

    // deploy proposal deployer contract
    await deployer.deploy(true);

    // get deployed contracts and adresses
    const attackerProposalDeployerAddress = await deployer.deployedContract();
    const attackerProposalDeployer = await ethers.getContractAt("Attacker02", attackerProposalDeployerAddress, attackerAdmin);

    const proposalAddress = await attackerProposalDeployer.attacker();

    // propose to deployed proposalContract
    await dao.propose(
      [proposalAddress],
      [value],
      ["test()"],
      [Buffer.from("")]
    );
    
    // get last proposal id
    const id = (await dao.nextProposalId()) - BigInt(1);

    // redeploy proposal deployer contract and proposal contract
    await deployer.kill();
    await deployer.deploy(false);
    
    const newAttackerProposalDeployerAddress = await deployer.deployedContract();
    const newAttackerProposalDeployer = await ethers.getContractAt("Attacker02", newAttackerProposalDeployerAddress, attackerAdmin);
    // address not changed
    expect(newAttackerProposalDeployerAddress).to.be.eq(attackerProposalDeployerAddress);

    const newProposalAddress = await newAttackerProposalDeployer.attacker();
    // address not changed
    expect(newProposalAddress).to.be.eq(proposalAddress);

    const maliciousProposal = await ethers.getContractAt("AttackerMaliciousProposal", newProposalAddress, attackerAdmin);
    
    // execute proposal
    await expect(dao.execute(id, { value: value })).not.be.reverted;

    // yeah, we hacked it
    const result = await maliciousProposal.testResult();
    expect(result).to.be.eq("malicious");
  });

  it("safety dao", async function () {
    // deploy contracts

    // deploy not safety dao
    safetyDao = await new SafetyCallDAO__factory(admin).deploy(timelock.target);
    await safetyDao.waitForDeployment();

    // deploy attacker deployer contract
    deployer = await new Attacker01__factory(attackerAdmin).deploy();
    await deployer.waitForDeployment();

    // deploy proposal deployer contract
    await deployer.deploy(true);

    // get deployed contracts and adresses
    const attackerProposalDeployerAddress = await deployer.deployedContract();
    const attackerProposalDeployer = await ethers.getContractAt("Attacker02", attackerProposalDeployerAddress, attackerAdmin);

    const proposalAddress = await attackerProposalDeployer.attacker();

    // propose to deployed proposalContract
    await safetyDao.propose(
      [proposalAddress],
      [value],
      ["test()"],
      [Buffer.from("")]
    );
    
    // get last proposal id
    const id = (await safetyDao.nextProposalId()) - BigInt(1);

    // redeploy proposal deployer contract and proposal contract
    await deployer.kill();
    await deployer.deploy(false);
    
    const newAttackerProposalDeployerAddress = await deployer.deployedContract();
    const newAttackerProposalDeployer = await ethers.getContractAt("Attacker02", newAttackerProposalDeployerAddress, attackerAdmin);
    // address not changed
    expect(newAttackerProposalDeployerAddress).to.be.eq(attackerProposalDeployerAddress);

    const newProposalAddress = await newAttackerProposalDeployer.attacker();
    // address not changed
    expect(newProposalAddress).to.be.eq(proposalAddress);

    const maliciousProposal = await ethers.getContractAt("AttackerMaliciousProposal", newProposalAddress, attackerAdmin);
    
    // execute proposal
    await expect(safetyDao.execute(id, { value: value }))
      .to.be.revertedWith("Changes alert");

    // no, we not hacked it
    const result = await maliciousProposal.testResult();
    expect(result).not.be.eq("malicious");
  });
});

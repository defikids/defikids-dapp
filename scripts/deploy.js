"use strict";

const { ethers, upgrades } = require("hardhat");
require("dotenv").config();

async function main() {
  const privateKey = process.env.PRIVATE_KEY; // Replace with your private key
  if (!privateKey) {
    console.error("Private key is not provided in the environment.");
    return;
  }

  const deployer = new ethers.Wallet(privateKey);
  console.log("Deploying contracts with the account:", deployer.address);

  const Host = await ethers.getContractFactory("Host");

  const contract = await upgrades.deployProxy(Host, [], { from: deployer });

  await contract.deployed();

  console.log("Host deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

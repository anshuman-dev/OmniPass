const hre = require("hardhat");
const ethers = require("ethers");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // IdentityPassport Contract
  const IdentityPassport = await hre.ethers.getContractFactory("IdentityPassport");
  
  // Get the correct endpoint address with proper checksum
  // For Ethereum Sepolia - using a known valid LZ endpoint
  const endpointAddress = "0x6098e96a28E02f27B1e6BD381c29BbB8c1f41619".toLowerCase();
  
  console.log("Using endpoint address:", endpointAddress);

  // Deploy the contract
  const identityPassport = await IdentityPassport.deploy(endpointAddress, deployer.address);

  await identityPassport.deployed();

  console.log("IdentityPassport deployed to:", identityPassport.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
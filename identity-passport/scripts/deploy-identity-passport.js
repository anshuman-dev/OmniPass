const { ethers } = require("hardhat");

// LayerZero V2 Endpoint addresses - we'll use lowercase to avoid checksum issues
const ENDPOINTS = {
  "ethereum-sepolia": "0x6098e96a28E02f27B1e6BD381c29BbB8c1f41619", // Alternative Sepolia address
  "base-sepolia": "0x6EDCE65403992e310A62460808c4b910D972f10f", // Base Sepolia
};

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying IdentityPassport with account:", deployer.address);
  
  // Get the current network
  const networkName = hre.network.name;
  console.log("Network:", networkName);
  
  // Get the endpoint address for this network
  const endpointAddress = ENDPOINTS[networkName];
  if (!endpointAddress) {
    throw new Error(`No endpoint address configured for network: ${networkName}`);
  }
  console.log("Using LayerZero Endpoint address:", endpointAddress);
  
  // Compile the contract
  const IdentityPassport = await ethers.getContractFactory("IdentityPassport");
  
  // Deploy the contract
  console.log("Deploying...");
  const identityPassport = await IdentityPassport.deploy(endpointAddress, deployer.address);
  
  // Wait for deployment to finish
  await identityPassport.deployed();
  
  console.log("IdentityPassport deployed to:", identityPassport.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
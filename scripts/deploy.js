const hre = require("hardhat");

async function main() {
  console.log("Deploying OmniPass contracts...");

  // Get the network configuration
  const network = hre.network.name;
  console.log(`Network: ${network}`);

  // Get LayerZero endpoint for the current network
  let lzEndpointAddress;
  
  switch (network) {
    case "sepolia":
      lzEndpointAddress = "0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1";
      break;
    case "arbitrumGoerli":
      lzEndpointAddress = "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab";
      break;
    case "baseGoerli":
      lzEndpointAddress = "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab";
      break;
    default:
      throw new Error(`No LayerZero endpoint configured for network: ${network}`);
  }
  
  console.log(`LayerZero Endpoint: ${lzEndpointAddress}`);

  // Deploy PassportNFT
  const minGasToTransfer = 200000; // Adjust as needed for your use case
  const PassportNFT = await hre.ethers.getContractFactory("PassportNFT");
  const passportNFT = await PassportNFT.deploy(lzEndpointAddress, minGasToTransfer);
  await passportNFT.deployed();
  
  console.log(`PassportNFT deployed to: ${passportNFT.address}`);

  // Deploy CredentialManager
  const CredentialManager = await hre.ethers.getContractFactory("CredentialManager");
  const credentialManager = await CredentialManager.deploy(lzEndpointAddress);
  await credentialManager.deployed();
  
  console.log(`CredentialManager deployed to: ${credentialManager.address}`);

  // Deploy VerificationToken
  const VerificationToken = await hre.ethers.getContractFactory("VerificationToken");
  const verificationToken = await VerificationToken.deploy(
    "OmniPass Verification Token",
    "VERIFY",
    lzEndpointAddress,
    credentialManager.address
  );
  await verificationToken.deployed();
  
  console.log(`VerificationToken deployed to: ${verificationToken.address}`);

  console.log("Deployment complete!");
  
  // Save deployment addresses to a file for easy reference
  const fs = require("fs");
  const deployData = {
    network,
    lzEndpoint: lzEndpointAddress,
    passportNFT: passportNFT.address,
    credentialManager: credentialManager.address,
    verificationToken: verificationToken.address,
    deploymentTimestamp: new Date().toISOString()
  };
  
  const deploymentPath = `deployment-${network}.json`;
  fs.writeFileSync(
    deploymentPath,
    JSON.stringify(deployData, null, 2)
  );
  
  console.log(`Deployment data saved to ${deploymentPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

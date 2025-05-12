const hre = require("hardhat");
const fs = require("fs");

// LayerZero chain IDs
const CHAIN_IDS = {
  sepolia: 10161,
  arbitrumGoerli: 10143,
  baseGoerli: 10160
};

async function main() {
  console.log("Setting up trusted remotes...");
  
  // Load deployment data for each network
  const deployments = {};
  
  for (const network of Object.keys(CHAIN_IDS)) {
    const deploymentFile = `deployment-${network}.json`;
    
    if (fs.existsSync(deploymentFile)) {
      deployments[network] = JSON.parse(fs.readFileSync(deploymentFile));
      console.log(`Loaded deployment data for ${network}`);
    } else {
      console.error(`Deployment file not found: ${deploymentFile}`);
      console.error(`Please deploy to ${network} first`);
      return;
    }
  }
  
  // For each network, set trusted remotes for the other networks
  for (const sourceNetwork of Object.keys(deployments)) {
    console.log(`\nSetting up trusted remotes for ${sourceNetwork}...`);
    
    // Connect to the network using the deployer's private key
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      console.error("PRIVATE_KEY environment variable not set");
      return;
    }
    
    const provider = new hre.ethers.providers.JsonRpcProvider(
      hre.config.networks[sourceNetwork].url
    );
    const wallet = new hre.ethers.Wallet(privateKey, provider);
    
    // Get contracts on the current network
    const passportNFT = new hre.ethers.Contract(
      deployments[sourceNetwork].passportNFT,
      require("../artifacts/contracts/PassportNFT.sol/PassportNFT.json").abi,
      wallet
    );
    
    const credentialManager = new hre.ethers.Contract(
      deployments[sourceNetwork].credentialManager,
      require("../artifacts/contracts/CredentialManager.sol/CredentialManager.json").abi,
      wallet
    );
    
    const verificationToken = new hre.ethers.Contract(
      deployments[sourceNetwork].verificationToken,
      require("../artifacts/contracts/VerificationToken.sol/VerificationToken.json").abi,
      wallet
    );
    
    // For each target network, set trusted remote
    for (const targetNetwork of Object.keys(deployments)) {
      if (targetNetwork === sourceNetwork) continue;
      
      const sourceChainId = CHAIN_IDS[sourceNetwork];
      const targetChainId = CHAIN_IDS[targetNetwork];
      
      console.log(`Setting trusted remote for ${sourceNetwork} -> ${targetNetwork}`);
      
      // Set trusted remote for PassportNFT
      try {
        const tx1 = await passportNFT.setTrustedRemote(
          targetChainId,
          hre.ethers.utils.solidityPack(
            ['address', 'address'],
            [deployments[targetNetwork].passportNFT, deployments[sourceNetwork].passportNFT]
          )
        );
        await tx1.wait();
        console.log(`  - PassportNFT: Set trusted remote from ${sourceNetwork} to ${targetNetwork}`);
      } catch (error) {
        console.error(`  - PassportNFT: Error setting trusted remote: ${error.message}`);
      }
      
      // Set trusted remote for CredentialManager
      try {
        const tx2 = await credentialManager.setTrustedRemote(
          targetChainId,
          hre.ethers.utils.solidityPack(
            ['address', 'address'],
            [deployments[targetNetwork].credentialManager, deployments[sourceNetwork].credentialManager]
          )
        );
        await tx2.wait();
        console.log(`  - CredentialManager: Set trusted remote from ${sourceNetwork} to ${targetNetwork}`);
      } catch (error) {
        console.error(`  - CredentialManager: Error setting trusted remote: ${error.message}`);
      }
      
      // Set trusted remote for VerificationToken
      try {
        const tx3 = await verificationToken.setTrustedRemote(
          targetChainId,
          hre.ethers.utils.solidityPack(
            ['address', 'address'],
            [deployments[targetNetwork].verificationToken, deployments[sourceNetwork].verificationToken]
          )
        );
        await tx3.wait();
        console.log(`  - VerificationToken: Set trusted remote from ${sourceNetwork} to ${targetNetwork}`);
      } catch (error) {
        console.error(`  - VerificationToken: Error setting trusted remote: ${error.message}`);
      }
    }
  }
  
  console.log("\nTrusted remotes setup complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

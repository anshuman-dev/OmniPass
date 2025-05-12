const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Make sure the contract build directory exists in frontend
const frontendContractsDir = path.resolve(__dirname, '../frontend/src/contracts');
if (!fs.existsSync(frontendContractsDir)) {
  fs.mkdirSync(frontendContractsDir, { recursive: true });
}

console.log('Compiling contracts...');

// Compile contracts
exec('npx hardhat compile', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error compiling contracts: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Compilation stderr: ${stderr}`);
  }
  
  console.log(stdout);
  console.log('Contracts compiled successfully!');
  
  // Copy ABIs to frontend
  const contractsDir = path.resolve(__dirname, '../artifacts/contracts');
  const contractFiles = [
    'PassportNFT.sol/PassportNFT.json',
    'CredentialManager.sol/CredentialManager.json',
    'VerificationToken.sol/VerificationToken.json'
  ];
  
  contractFiles.forEach(file => {
    try {
      const contractPath = path.resolve(contractsDir, file);
      if (fs.existsSync(contractPath)) {
        const contractJson = require(contractPath);
        const contractName = path.basename(file, '.json');
        
        // Just save the ABI to the frontend
        fs.writeFileSync(
          path.resolve(frontendContractsDir, `${contractName}.json`),
          JSON.stringify(contractJson.abi, null, 2)
        );
        
        console.log(`ABI for ${contractName} copied to frontend`);
      } else {
        console.error(`Contract file not found: ${contractPath}`);
      }
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  });
});

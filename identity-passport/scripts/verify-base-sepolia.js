const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x8fe2511d9E7dD78Fdc64A1E34545b8a5ceD74cA8";
  const userAddress = process.env.USER_ADDRESS || "0x77f0E8A8C6ca05738E3605C65C53323601eEE0e3"; // Default to deployer
  
  console.log("Verifying user on Base Sepolia...");
  console.log("User address:", userAddress);
  
  const [signer] = await ethers.getSigners();
  const identityPassport = await ethers.getContractAt("IdentityPassport", contractAddress, signer);
  
  // Check if already verified
  const alreadyVerified = await identityPassport.isVerified(userAddress);
  if (alreadyVerified) {
    console.log("User is already verified!");
  } else {
    // Verify the user
    const tx = await identityPassport.verifyUser(userAddress);
    await tx.wait();
    
    console.log("Transaction hash:", tx.hash);
    console.log("User verified successfully!");
  }
  
  // Display verification status
  const isVerified = await identityPassport.isVerified(userAddress);
  console.log("Verification status:", isVerified);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
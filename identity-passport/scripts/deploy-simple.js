const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying SimpleIdentityPassport to Ethereum Sepolia...");
  console.log("Deployer address:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");

  // Deploy the simplified contract
  const SimpleIdentityPassport = await ethers.getContractFactory("SimpleIdentityPassport");
  const simpleIdentity = await SimpleIdentityPassport.deploy(deployer.address, {
    gasLimit: 3000000, // Manually set gas limit
  });

  await simpleIdentity.deployed();

  console.log("SimpleIdentityPassport deployed to:", simpleIdentity.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
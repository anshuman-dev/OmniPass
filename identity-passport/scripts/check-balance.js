const { ethers } = require("hardhat");

async function main() {
  const [account] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(account.address);
  
  console.log("Account address:", account.address);
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
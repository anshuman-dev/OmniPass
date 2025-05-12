require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Ethereum Sepolia
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_SEPOLIA}`,
      accounts: [PRIVATE_KEY]
    },
    // Arbitrum Goerli
    arbitrumGoerli: {
      url: `https://arb-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_ARBITRUM_GOERLI}`,
      accounts: [PRIVATE_KEY]
    },
    // Base Goerli
    baseGoerli: {
      url: `https://base-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_BASE_GOERLI}`,
      accounts: [PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
      arbitrumGoerli: process.env.ARBISCAN_API_KEY,
      baseGoerli: process.env.BASESCAN_API_KEY
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

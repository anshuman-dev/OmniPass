# OmniPass: Cross-Chain Credential Passport

A unified digital identity system that works seamlessly across multiple blockchains using LayerZero technology.

## Features

- **Cross-Chain Identity**: Create a unified digital identity (Passport NFT) that can move between chains
- **Synchronized Credentials**: Collect credentials on any chain that automatically sync across the ecosystem
- **Universal Verification**: Verify credentials for access to services from any chain
- **Seamless Experience**: Experience a chain-agnostic identity system

## Project Structure

- `/contracts`: Smart contract code for the Passport NFT, Credential Manager, and Verification Token
- `/frontend`: React application for the user interface
- `/scripts`: Deployment and utility scripts
- `/test`: Test cases for smart contracts

## Setup and Installation

### Prerequisites

- Node.js (v14+) and npm (v6+)
- MetaMask or another web3 wallet
- Test ETH for Sepolia, Arbitrum Goerli, and Base Goerli testnets

### Installation

1. Clone the repository:
git clone https://github.com/anshuman-dev/OmniPass.git
cd OmniPass

2. Install root dependencies:
npm install

3. Install frontend dependencies:
cd frontend
npm install
cd ..

4. Create a `.env` file in the root directory with the following variables:
PRIVATE_KEY=your_wallet_private_key
ALCHEMY_API_KEY_SEPOLIA=your_alchemy_key
ALCHEMY_API_KEY_ARBITRUM_GOERLI=your_alchemy_key
ALCHEMY_API_KEY_BASE_GOERLI=your_alchemy_key
ETHERSCAN_API_KEY=your_etherscan_key
ARBISCAN_API_KEY=your_arbiscan_key
BASESCAN_API_KEY=your_basescan_key

## Running the Application

### Development Mode

1. **Start the frontend development server**:
cd frontend
npm start
This will start the React development server at http://localhost:3000

2. **Compile smart contracts**:
npx hardhat compile
This will compile the smart contracts and generate the artifacts.

3. **Run tests**:
npx hardhat test
This will run the test cases for the smart contracts.

### Deployment

1. **Deploy to Sepolia testnet**:
npx hardhat run scripts/deploy.js --network sepolia

2. **Deploy to Arbitrum Goerli testnet**:
npx hardhat run scripts/deploy.js --network arbitrumGoerli

3. **Deploy to Base Goerli testnet**:
npx hardhat run scripts/deploy.js --network baseGoerli

4. **Set up cross-chain messaging**:
node scripts/setup-trusted-remotes.js
This will configure the trusted remotes for cross-chain communication.

5. **Copy contract ABIs to frontend**:
node scripts/compile.js
This will copy the contract ABIs to the frontend for interaction.

### Running in GitHub Codespaces

If you're using GitHub Codespaces (as indicated in your repository):

1. Open your repository in Codespaces
2. Run the installation commands above
3. To access the frontend, you'll need to use the port forwarding feature:
- Start the frontend server with `cd frontend && npm start`
- Look for the "Ports" tab in the lower panel of your Codespace
- Find port 3000 and click the globe icon to open the application in a new tab

## User Flow

### Initial Setup
1. Connect your wallet to the dApp
2. Create a Passport NFT on your preferred chain
3. Your Passport is minted and stored on the current chain

### Adding Credentials
1. Complete actions to earn credentials
2. Credential is recorded on current chain
3. LayerZero messages sync the credential to all chains
4. Your credential is synchronized across the ecosystem

### Verification
1. Request access to a service on any chain
2. Service checks for required credentials across all chains
3. Access is granted based on your cross-chain history
4. No need to move your Passport to the verification chain

### Moving Passport
1. Move your Passport NFT to another chain if desired
2. The system uses LayerZero's ONFT standard to transfer cross-chain
3. Your history remains accessible from all chains

## Technologies Used

- **Smart Contracts**: Solidity, Hardhat
- **LayerZero Integration**: OApp, ONFT, OFT
- **Frontend**: React, styled-components, ethers.js
- **Testing**: Hardhat, Chai

## License

This project is licensed under the MIT License.

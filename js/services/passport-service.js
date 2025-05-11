import { getProvider } from '../utils/web3.js';

// Mock API endpoints (in a real app, these would point to your backend)
const API_BASE_URL = 'https://api.example.com';

/**
 * Create a new passport
 */
export async function createPassport(data) {
  // In a real app, this would call your backend API
  console.log('Creating passport with data:', data);
  
  // For demo, return mock transaction data
  const provider = getProvider();
  const gasPrice = await provider.getGasPrice();
  
  // Mock passport contract address based on chain
  const contractAddress = getPassportContractAddress(data.chain_id);
  
  // Create mock transaction data
  return {
    transaction_data: {
      to: contractAddress,
      from: data.wallet_address,
      data: '0x1249c58b', // minting function selector
      gasPrice: gasPrice.toString(),
      gas: '3000000',
    },
    chain_id: data.chain_id
  };
}

/**
 * Get passport details
 */
export async function getPassport(passportId, chainId) {
  // In a real app, this would call your backend API
  console.log('Getting passport:', passportId, 'on chain:', chainId);
  
  // Return mock passport data
  return {
    id: passportId,
    owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    created_at: Date.now() - 86400000, // one day ago
    metadata_uri: 'ipfs://QmExample',
    current_chain_id: chainId
  };
}

/**
 * Get a list of user's passports
 */
export async function getUserPassports(walletAddress) {
  // In a real app, this would call your backend API
  console.log('Getting passports for user:', walletAddress);
  
  // Return mock data
  return [
    {
      id: 1,
      owner: walletAddress,
      created_at: Date.now() - 86400000, // one day ago
      metadata_uri: 'ipfs://QmExample',
      current_chain_id: 11155111 // Sepolia
    }
  ];
}

/**
 * Get supported chains
 */
export function getSupportedChains() {
  return {
    11155111: {
      name: 'Ethereum Sepolia',
      lz_chain_id: 10161,
      explorer_url: 'https://sepolia.etherscan.io'
    },
    421613: {
      name: 'Arbitrum Goerli',
      lz_chain_id: 10143,
      explorer_url: 'https://goerli.arbiscan.io'
    },
    84531: {
      name: 'Base Goerli',
      lz_chain_id: 10160,
      explorer_url: 'https://goerli.basescan.org'
    }
  };
}

/**
 * Get passport contract address for a chain
 */
function getPassportContractAddress(chainId) {
  const addresses = {
    11155111: '0x1234567890123456789012345678901234567890', // Sepolia
    421613: '0x1234567890123456789012345678901234567891',   // Arbitrum Goerli
    84531: '0x1234567890123456789012345678901234567892'     // Base Goerli
  };
  
  return addresses[chainId] || addresses[11155111]; // Default to Sepolia
}

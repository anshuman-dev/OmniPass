// Web3 utility functions
let provider = null;
let signer = null;

/**
 * Initialize Web3 providers
 */
export async function initWeb3() {
  if (window.ethereum) {
    try {
      // Connect to Ethereum provider (MetaMask)
      provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Check if already connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        signer = provider.getSigner();
        return true;
      }
    } catch (error) {
      console.error('Error initializing Web3:', error);
    }
  }
  return false;
}

/**
 * Connect wallet
 */
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('No Ethereum browser extension detected');
  }
  
  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    return true;
  } catch (error) {
    console.error('User rejected connection:', error);
    throw error;
  }
}

/**
 * Get the current account address
 */
export async function getAccount() {
  if (!provider) return null;
  
  try {
    const accounts = await provider.listAccounts();
    return accounts[0];
  } catch (error) {
    console.error('Error getting account:', error);
    return null;
  }
}

/**
 * Get the current chain ID
 */
export async function getChainId() {
  if (!provider) return null;
  
  try {
    const network = await provider.getNetwork();
    return network.chainId;
  } catch (error) {
    console.error('Error getting chain ID:', error);
    return null;
  }
}

/**
 * Switch to a different chain
 */
export async function switchChain(chainId) {
  if (!window.ethereum) {
    throw new Error('No Ethereum browser extension detected');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    
    return true;
  } catch (error) {
    console.error('Error switching chain:', error);
    throw error;
  }
}

/**
 * Sign and send a transaction
 */
export async function signTransaction(txData) {
  if (!signer) {
    throw new Error('Wallet not connected');
  }
  
  try {
    const tx = await signer.sendTransaction(txData);
    return tx;
  } catch (error) {
    console.error('Error signing transaction:', error);
    throw error;
  }
}

/**
 * Handle account changes
 */
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    // User disconnected their wallet
    signer = null;
    window.location.reload();
  } else {
    // User switched accounts
    signer = provider.getSigner();
  }
}

/**
 * Handle chain changes
 */
function handleChainChanged() {
  // Reload the page on chain change
  window.location.reload();
}

/**
 * Get provider instance
 */
export function getProvider() {
  return provider;
}

/**
 * Get signer instance
 */
export function getSigner() {
  return signer;
}

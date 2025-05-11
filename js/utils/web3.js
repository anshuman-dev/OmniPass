// Web3 utility functions
let provider = null;
let signer = null;

/**
 * Check if ethers is properly loaded
 */
function checkEthersAvailable() {
  if (typeof ethers === 'undefined') {
    console.error('Ethers.js library is not loaded');
    alert('Required libraries not loaded. Please refresh the page and try again.');
    return false;
  }
  return true;
}

/**
 * Initialize Web3 providers
 */
export async function initWeb3() {
  // First check if ethers is loaded
  if (!checkEthersAvailable()) return false;
  
  if (window.ethereum) {
    try {
      // Just initialize provider without requesting accounts yet
      provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Check if already connected (without prompting)
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts',  // This gets accounts without prompting
      });
      
      if (accounts.length > 0) {
        signer = provider.getSigner();
        updateConnectButtonText(accounts[0]);
        return true;
      }
    } catch (error) {
      console.error('Error initializing Web3:', error);
    }
  }
  return false;
}

/**
 * Connect wallet with proper error handling
 */
export async function connectWallet() {
  // First check if ethers is loaded
  if (!checkEthersAvailable()) return null;
  
  if (!window.ethereum) {
    // Display a more user-friendly error
    alert('No Ethereum wallet detected. Please install MetaMask from metamask.io');
    throw new Error('No Ethereum wallet detected');
  }
  
  try {
    // Request account access with proper options
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts'
    });
    
    if (accounts.length > 0) {
      provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      signer = provider.getSigner();
      updateConnectButtonText(accounts[0]);
      return accounts[0];
    } else {
      throw new Error('No accounts selected');
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    
    // Handle specific error types
    if (error.code === 4001) {
      // User rejected request
      alert('Connection rejected. Please approve the connection request in MetaMask.');
    } else if (error.code === -32002) {
      // Request already pending
      alert('Connection request already pending. Please check MetaMask extension.');
    } else {
      // Generic error handling
      alert('Failed to connect wallet: ' + (error.message || 'Unknown error'));
    }
    
    throw error;
  }
}

/**
 * Update the connect button text with shortened account address
 */
function updateConnectButtonText(account) {
  const connectButton = document.getElementById('connect-wallet');
  if (connectButton && account) {
    connectButton.textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
  }
}

/**
 * Get the current account address
 */
export async function getAccount() {
  if (!checkEthersAvailable() || !provider) return null;
  
  try {
    const accounts = await provider.listAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting account:', error);
    return null;
  }
}

/**
 * Get the current chain ID
 */
export async function getChainId() {
  if (!checkEthersAvailable() || !provider) return null;
  
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
  if (!checkEthersAvailable()) return false;
  
  if (!window.ethereum) {
    throw new Error('No Ethereum wallet detected');
  }
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    
    // Update provider after chain switch
    provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    if (signer) {
      signer = provider.getSigner();
    }
    
    return true;
  } catch (error) {
    console.error('Error switching chain:', error);
    
    // Handle chain not added to MetaMask error
    if (error.code === 4902) {
      try {
        await addChain(chainId);
        return true;
      } catch (addError) {
        throw addError;
      }
    }
    
    throw error;
  }
}

/**
 * Add a chain to MetaMask if not present
 */
async function addChain(chainId) {
  const chainParams = {
    // Sepolia
    11155111: {
      chainId: '0x' + (11155111).toString(16),
      chainName: 'Ethereum Sepolia Testnet',
      nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
      blockExplorerUrls: ['https://sepolia.etherscan.io']
    },
    // Arbitrum Goerli
    421613: {
      chainId: '0x' + (421613).toString(16),
      chainName: 'Arbitrum Goerli Testnet',
      nativeCurrency: { name: 'Arbitrum Goerli ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://goerli-rollup.arbitrum.io/rpc'],
      blockExplorerUrls: ['https://goerli.arbiscan.io']
    },
    // Base Goerli
    84531: {
      chainId: '0x' + (84531).toString(16),
      chainName: 'Base Goerli Testnet',
      nativeCurrency: { name: 'Base Goerli ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://goerli.base.org'],
      blockExplorerUrls: ['https://goerli.basescan.org']
    }
  };
  
  if (!chainParams[chainId]) {
    throw new Error(`Chain ${chainId} configuration not found`);
  }
  
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [chainParams[chainId]]
  });
}

/**
 * Sign and send a transaction
 */
export async function signTransaction(txData) {
  if (!checkEthersAvailable()) return null;
  
  if (!signer) {
    throw new Error('Wallet not connected');
  }
  
  try {
    const tx = await signer.sendTransaction(txData);
    return tx;
  } catch (error) {
    console.error('Error signing transaction:', error);
    
    // Handle specific transaction errors
    if (error.code === 4001) {
      alert('Transaction rejected. Please approve the transaction in MetaMask.');
    } else {
      alert('Transaction failed: ' + (error.message || 'Unknown error'));
    }
    
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
    const connectButton = document.getElementById('connect-wallet');
    if (connectButton) {
      connectButton.textContent = 'Connect Wallet';
    }
  } else {
    // User switched accounts
    updateConnectButtonText(accounts[0]);
    if (provider) {
      signer = provider.getSigner();
    }
  }
}

/**
 * Handle chain changes
 */
function handleChainChanged(chainIdHex) {
  // Update provider with new chain
  if (provider) {
    provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    if (signer) {
      signer = provider.getSigner();
    }
  }
  
  // Refresh UI
  const currentPage = document.querySelector('.nav-link.active');
  if (currentPage) {
    currentPage.click();
  }
}

/**
 * Get provider instance
 */
export function getProvider() {
  if (!checkEthersAvailable()) return null;
  return provider;
}

/**
 * Get signer instance
 */
export function getSigner() {
  if (!checkEthersAvailable()) return null;
  return signer;
}

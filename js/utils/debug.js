/**
 * Console debugging utilities
 */

// Log ethers library status
export function checkEthersStatus() {
  console.log('Checking ethers status...');
  if (typeof ethers === 'undefined') {
    console.error('✖️ ethers.js is not loaded');
    return false;
  } else {
    console.log('✓ ethers.js is loaded:', ethers.version);
    return true;
  }
}

// Log MetaMask status
export function checkMetaMaskStatus() {
  console.log('Checking MetaMask status...');
  if (typeof window.ethereum === 'undefined') {
    console.error('✖️ MetaMask is not installed or available');
    return false;
  } else {
    console.log('✓ MetaMask is available');
    
    // Check if MetaMask is the provider
    if (window.ethereum.isMetaMask) {
      console.log('✓ Provider is MetaMask');
    } else {
      console.warn('⚠️ Provider is not MetaMask, it might be another wallet');
    }
    
    return true;
  }
}

// Log connection status
export function checkConnectionStatus() {
  console.log('Checking connection status...');
  
  if (typeof window.ethereum === 'undefined') {
    console.error('✖️ No provider available');
    return false;
  }
  
  window.ethereum.request({ method: 'eth_accounts' })
    .then(accounts => {
      if (accounts.length === 0) {
        console.log('✖️ Not connected to any accounts');
      } else {
        console.log('✓ Connected to accounts:', accounts);
        
        // Get chain information
        window.ethereum.request({ method: 'eth_chainId' })
          .then(chainId => {
            console.log('✓ Connected to chain:', chainId);
            const chainNames = {
              '0x1': 'Ethereum Mainnet',
              '0xaa36a7': 'Sepolia Testnet',
              '0x66eed': 'Arbitrum Goerli',
              '0x14a33': 'Base Goerli'
            };
            console.log('Chain name:', chainNames[chainId] || 'Unknown chain');
          })
          .catch(error => {
            console.error('Error getting chain:', error);
          });
      }
    })
    .catch(error => {
      console.error('Error checking accounts:', error);
    });
}

// Initialize debugging
export function initDebug() {
  console.log('%c OmniPass Debug Mode ', 'background: #6CADF5; color: #000; font-weight: bold; padding: 4px;');
  checkEthersStatus();
  checkMetaMaskStatus();
  checkConnectionStatus();
  
  // Add global debug object
  window.debugOmniPass = {
    checkEthers: checkEthersStatus,
    checkMetaMask: checkMetaMaskStatus,
    checkConnection: checkConnectionStatus
  };
  
  console.log('Debug utilities initialized. Use window.debugOmniPass to access debug functions.');
}

// Export the init function
export default { initDebug };

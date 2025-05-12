import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';

// Import ABIs and contract addresses
const identityPassportABI = [
  "function isVerified(address _user) external view returns (bool)",
  "function verifyUser(address _user) external",
  "function propagateVerification(address _user, uint32 _dstEid, bytes calldata _options) external payable",
  "function owner() external view returns (address)",
  "function quotePropagateFee(uint32 _dstEid, bytes calldata _options) external view returns (tuple(uint256 nativeFee, uint256 lzTokenFee))"
];

const simpleIdentityPassportABI = [
  "function isVerified(address _user) external view returns (bool)",
  "function verifyUser(address _user) external",
  "function owner() external view returns (address)"
];

// Contract addresses
const BASE_SEPOLIA_CONTRACT = "0x8fe2511d9E7dD78Fdc64A1E34545b8a5ceD74cA8";
const ETHEREUM_SEPOLIA_CONTRACT = "0x8fe2511d9E7dD78Fdc64A1E34545b8a5ceD74cA8";

// Chain IDs
const BASE_SEPOLIA_CHAIN_ID = 84532;
const ETHEREUM_SEPOLIA_CHAIN_ID = 11155111;

// LayerZero Endpoint IDs
const ETHEREUM_SEPOLIA_LZ_EID = 10161; // Ethereum Sepolia EID

function App() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [baseSepolia, setBaseSepolia] = useState({
    isVerified: false,
    isOwner: false,
    contract: null
  });
  const [ethereumSepolia, setEthereumSepolia] = useState({
    isVerified: false,
    isOwner: false,
    contract: null
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      // Setup event listeners for account and chain changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkVerificationStatus(accounts[0]);
        } else {
          setAccount(null);
          resetContractStates();
        }
      });
      
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    
    // Cleanup
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const resetContractStates = () => {
    setBaseSepolia({
      isVerified: false,
      isOwner: false,
      contract: null
    });
    setEthereumSepolia({
      isVerified: false,
      isOwner: false,
      contract: null
    });
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install it to use this app.');
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdDec = parseInt(chainIdHex, 16);
      
      setAccount(accounts[0]);
      setChainId(chainIdDec);
      
      // Initialize contracts
      initializeContracts();
      
      // Check verification status
      await checkVerificationStatus(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Initialize contract instances
  const initializeContracts = () => {
    if (!window.ethereum) return;
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    const baseSepoliaContract = new ethers.Contract(
      BASE_SEPOLIA_CONTRACT,
      identityPassportABI,
      signer
    );
    
    const ethereumSepoliaContract = new ethers.Contract(
      ETHEREUM_SEPOLIA_CONTRACT,
      simpleIdentityPassportABI,
      signer
    );
    
    setBaseSepolia(prev => ({...prev, contract: baseSepoliaContract}));
    setEthereumSepolia(prev => ({...prev, contract: ethereumSepoliaContract}));
  };

  // Check verification status on both chains
  const checkVerificationStatus = async (userAddress) => {
    if (!userAddress) return;
    
    setLoading(true);
    setStatusMessage("Checking verification status...");
    
    try {
      console.log("Starting verification check for address:", userAddress);
      
      // Create providers for each chain
      const baseSepoliaProvider = new ethers.providers.JsonRpcProvider(
        "https://sepolia.base.org"
      );
      
      // Using a different provider for Ethereum Sepolia to resolve the connectivity issues
      const ethereumSepoliaProvider = new ethers.providers.JsonRpcProvider(
        "https://ethereum-sepolia.publicnode.com"
      );
      
      console.log("Created providers");
      
      // Create contract instances
      const baseSepoliaContract = new ethers.Contract(
        BASE_SEPOLIA_CONTRACT,
        identityPassportABI,
        baseSepoliaProvider
      );
      
      const ethereumSepoliaContract = new ethers.Contract(
        ETHEREUM_SEPOLIA_CONTRACT,
        simpleIdentityPassportABI,
        ethereumSepoliaProvider
      );
      
      console.log("Created contract instances");
      console.log("Base Sepolia Contract Address:", BASE_SEPOLIA_CONTRACT);
      console.log("Ethereum Sepolia Contract Address:", ETHEREUM_SEPOLIA_CONTRACT);
      
      try {
        // Check verification status on Base Sepolia
        console.log("Checking Base Sepolia verification...");
        const isVerifiedOnBaseSepolia = await baseSepoliaContract.isVerified(userAddress);
        console.log("Base Sepolia verification status:", isVerifiedOnBaseSepolia);
        
        // Check if the user is the owner on Base Sepolia
        const baseSepoliaOwner = await baseSepoliaContract.owner();
        console.log("Base Sepolia owner:", baseSepoliaOwner);
        console.log("User address:", userAddress);
        const isBaseSepoliaOwner = baseSepoliaOwner.toLowerCase() === userAddress.toLowerCase();
        console.log("Is Base Sepolia owner:", isBaseSepoliaOwner);
        
        setBaseSepolia(prev => ({
          ...prev,
          isVerified: isVerifiedOnBaseSepolia,
          isOwner: isBaseSepoliaOwner
        }));
      } catch (error) {
        console.error("Error checking Base Sepolia status:", error);
      }
      
      try {
        // Check verification status on Ethereum Sepolia
        console.log("Checking Ethereum Sepolia verification...");
        const isVerifiedOnEthereumSepolia = await ethereumSepoliaContract.isVerified(userAddress);
        console.log("Ethereum Sepolia verification status:", isVerifiedOnEthereumSepolia);
        
        // Check if the user is the owner on Ethereum Sepolia
        const ethereumSepoliaOwner = await ethereumSepoliaContract.owner();
        console.log("Ethereum Sepolia owner:", ethereumSepoliaOwner);
        const isEthereumSepoliaOwner = ethereumSepoliaOwner.toLowerCase() === userAddress.toLowerCase();
        console.log("Is Ethereum Sepolia owner:", isEthereumSepoliaOwner);
        
        setEthereumSepolia(prev => ({
          ...prev,
          isVerified: isVerifiedOnEthereumSepolia,
          isOwner: isEthereumSepoliaOwner
        }));
      } catch (error) {
        console.error("Error checking Ethereum Sepolia status:", error);
      }
      
      setStatusMessage("");
    } catch (error) {
      console.error("Error in verification check:", error);
      setStatusMessage("Error checking verification status. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Verify a user on Base Sepolia
  const verifyOnBaseSepolia = async (userAddress) => {
    if (!baseSepolia.contract || !baseSepolia.isOwner) return;
    
    setLoading(true);
    setStatusMessage("Verifying on Base Sepolia...");
    
    try {
      const tx = await baseSepolia.contract.verifyUser(userAddress);
      await tx.wait();
      
      setStatusMessage("Successfully verified on Base Sepolia!");
      await checkVerificationStatus(account);
    } catch (error) {
      console.error("Error verifying on Base Sepolia:", error);
      setStatusMessage("Error verifying on Base Sepolia. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify a user on Ethereum Sepolia
  const verifyOnEthereumSepolia = async (userAddress) => {
    if (!ethereumSepolia.contract || !ethereumSepolia.isOwner) return;
    
    setLoading(true);
    setStatusMessage("Verifying on Ethereum Sepolia...");
    
    try {
      const tx = await ethereumSepolia.contract.verifyUser(userAddress);
      await tx.wait();
      
      setStatusMessage("Successfully verified on Ethereum Sepolia!");
      await checkVerificationStatus(account);
    } catch (error) {
      console.error("Error verifying on Ethereum Sepolia:", error);
      setStatusMessage("Error verifying on Ethereum Sepolia. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Switch networks
  const switchNetwork = async (chainId) => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      // If the chain hasn't been added to MetaMask, let's add it
      if (error.code === 4902) {
        try {
          if (chainId === BASE_SEPOLIA_CHAIN_ID) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${BASE_SEPOLIA_CHAIN_ID.toString(16)}`,
                  chainName: 'Base Sepolia',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.base.org'],
                  blockExplorerUrls: ['https://sepolia.basescan.org/']
                },
              ],
            });
          } else if (chainId === ETHEREUM_SEPOLIA_CHAIN_ID) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${ETHEREUM_SEPOLIA_CHAIN_ID.toString(16)}`,
                  chainName: 'Ethereum Sepolia',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://ethereum-sepolia.publicnode.com'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io/']
                },
              ],
            });
          }
        } catch (addError) {
          console.error('Error adding chain:', addError);
        }
      } else {
        console.error('Error switching chains:', error);
      }
    }
  };

  // Propagate verification from Base to Ethereum via LayerZero
  const propagateVerification = async () => {
    if (!baseSepolia.contract || !baseSepolia.isVerified) {
      console.log("Can't propagate: contract or verification status issue");
      return;
    }
    
    // Make sure we're on Base Sepolia
    setLoading(true);
    setStatusMessage("Propagating verification across chains...");
    
    try {
      console.log("Starting verification propagation");
      
      // Setting proper options for LayerZero message - specifying gas for execution
      // Since we don't have direct access to the OptionsBuilder, we'll use a hex string
      // that represents 65000 gas for execution
      const options = "0x00030100110100000000000000000000000000fee0"; // 0xfee0 is hex for 65,000
      console.log("Using options:", options);
      
      // Get a contract instance connected to the current signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        BASE_SEPOLIA_CONTRACT,
        identityPassportABI,
        signer
      );
      
      try {
        // Try to get the fee estimation from the contract
        const feeEstimate = await connectedContract.quotePropagateFee(ETHEREUM_SEPOLIA_LZ_EID, options);
        console.log("Fee estimation:", feeEstimate);
        
        // Add a 20% buffer to the estimated fee
        const estimatedFee = feeEstimate.nativeFee;
        const feeWithBuffer = estimatedFee.mul(120).div(100); // 120% of the estimated fee
        console.log("Using fee with buffer:", ethers.utils.formatEther(feeWithBuffer), "ETH");
        
        // Use the estimated fee with buffer
        var fee = feeWithBuffer;
      } catch (error) {
        console.log("Could not estimate fee, using default:", error);
        // Fallback to a lower default fee if estimation fails
        const fee = ethers.utils.parseEther("0.002"); // Lower fee
        console.log("Using default fee:", ethers.utils.formatEther(fee), "ETH");
      }
      
      console.log("Calling propagateVerification with parameters:");
      console.log("- Account:", account);
      console.log("- Destination EID:", ETHEREUM_SEPOLIA_LZ_EID);
      console.log("- Value:", ethers.utils.formatEther(fee), "ETH");
      
      const tx = await connectedContract.propagateVerification(
        account,
        ETHEREUM_SEPOLIA_LZ_EID, // Destination endpoint ID
        options,
        { value: fee, gasLimit: 1000000 } // Add explicit gas limit
      );
      
      console.log("Transaction sent:", tx.hash);
      setStatusMessage(`Transaction sent: ${tx.hash}. Waiting for confirmation...`);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      
      setStatusMessage("Verification propagation initiated! It may take a few minutes to complete.");
      
      // Check verification status after a delay
      setTimeout(() => {
        checkVerificationStatus(account);
      }, 30000); // Check after 30 seconds
      
    } catch (error) {
      console.error("Error propagating verification:", error);
      setStatusMessage(`Error propagating verification: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // UI rendering
  return (
    <div className="App">
      <header className="App-header">
        <h1>LayerZero Identity Passport</h1>
        
        {!account ? (
          <button onClick={connectWallet} className="connect-button">
            Connect Wallet
          </button>
        ) : (
          <div className="content">
            <div className="account-info">
              <p>Connected Address: {account}</p>
              <p>Current Chain ID: {chainId}</p>
            </div>
            
            <div className="verification-status">
              <h2>Verification Status</h2>
              
              <div className="network-status">
                <h3>Base Sepolia</h3>
                <p>Status: {baseSepolia.isVerified ? "✅ Verified" : "❌ Not Verified"}</p>
                <p>Owner: {baseSepolia.isOwner ? "Yes" : "No"}</p>
                
                {baseSepolia.isOwner && !baseSepolia.isVerified && (
                  <button 
                    onClick={() => {
                      switchNetwork(BASE_SEPOLIA_CHAIN_ID)
                        .then(() => verifyOnBaseSepolia(account));
                    }}
                    disabled={loading}
                    className="network-button"
                  >
                    Verify Yourself
                  </button>
                )}
              </div>
              
              <div className="network-status">
                <h3>Ethereum Sepolia</h3>
                <p>Status: {ethereumSepolia.isVerified ? "✅ Verified" : "❌ Not Verified"}</p>
                <p>Owner: {ethereumSepolia.isOwner ? "Yes" : "No"}</p>
                
                {ethereumSepolia.isOwner && !ethereumSepolia.isVerified && (
                  <button 
                    onClick={() => {
                      switchNetwork(ETHEREUM_SEPOLIA_CHAIN_ID)
                        .then(() => verifyOnEthereumSepolia(account));
                    }}
                    disabled={loading}
                    className="network-button"
                  >
                    Verify Yourself
                  </button>
                )}
              </div>
            </div>
            
            <div className="propagation-section">
              <h2>Cross-Chain Verification</h2>
              
              {baseSepolia.isVerified && !ethereumSepolia.isVerified && (
                <button 
                  onClick={propagateVerification}
                  disabled={loading}
                  className="propagate-button"
                >
                  Propagate from Base to Ethereum
                </button>
              )}
              
              <p className="status-message">{statusMessage}</p>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
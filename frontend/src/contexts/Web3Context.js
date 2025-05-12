import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import PassportNFTAbi from '../contracts/PassportNFT.json';
import CredentialManagerAbi from '../contracts/CredentialManager.json';
import VerificationTokenAbi from '../contracts/VerificationToken.json';

// Create Web3 Context
const Web3Context = createContext(null);

// Contract addresses (these should be updated after deployment)
const CONTRACT_ADDRESSES = {
  // Local development
  "1337": {
    passportNFT: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    credentialManager: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    verificationToken: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  },
  // Sepolia
  "11155111": {
    passportNFT: "0x0000000000000000000000000000000000000000", // Replace with actual address
    credentialManager: "0x0000000000000000000000000000000000000000", // Replace with actual address
    verificationToken: "0x0000000000000000000000000000000000000000" // Replace with actual address
  }
  // Add other networks as needed
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [network, setNetwork] = useState('');
  const [chainId, setChainId] = useState('');
  const [contracts, setContracts] = useState({
    passportNFT: null,
    credentialManager: null,
    verificationToken: null
  });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize provider from window.ethereum when available
  useEffect(() => {
    if (window.ethereum) {
      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethersProvider);

      // Check if already connected
      ethersProvider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          handleAccountsChanged(accounts);
        }
      });

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Handle account changes
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // Disconnected
      setAccount('');
      setIsConnected(false);
      setSigner(null);
      setContracts({
        passportNFT: null,
        credentialManager: null,
        verificationToken: null
      });
    } else {
      // Connected
      const connectedAccount = accounts[0];
      setAccount(connectedAccount);
      setIsConnected(true);
      
      if (provider) {
        const signer = provider.getSigner();
        setSigner(signer);
        
        // Get network info
        const network = await provider.getNetwork();
        setNetwork(network.name);
        setChainId(network.chainId.toString());
        
        // Initialize contracts if we have addresses for this network
        initializeContracts(signer, network.chainId.toString());
      }
    }
  };

  // Handle chain changes
  const handleChainChanged = async (chainIdHex) => {
    const chainId = parseInt(chainIdHex, 16).toString();
    setChainId(chainId);
    
    // Reload the page as recommended by MetaMask
    window.location.reload();
  };

  // Initialize contracts
  const initializeContracts = (signer, chainId) => {
    // Check if we have contract addresses for this network
    if (!CONTRACT_ADDRESSES[chainId]) {
      console.warn(`No contract addresses available for chain ID: ${chainId}`);
      return;
    }
    
    try {
      const addresses = CONTRACT_ADDRESSES[chainId];
      
      const passportNFT = new ethers.Contract(
        addresses.passportNFT,
        PassportNFTAbi,
        signer
      );
      
      const credentialManager = new ethers.Contract(
        addresses.credentialManager,
        CredentialManagerAbi,
        signer
      );
      
      const verificationToken = new ethers.Contract(
        addresses.verificationToken,
        VerificationTokenAbi,
        signer
      );
      
      setContracts({
        passportNFT,
        credentialManager,
        verificationToken
      });
    } catch (err) {
      console.error("Error initializing contracts:", err);
      setError("Failed to initialize contracts");
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask not detected. Please install MetaMask.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Request accounts
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // handleAccountsChanged will be triggered by the accountsChanged event
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet (for UI purposes)
  const disconnectWallet = () => {
    // Note: There's no actual way to disconnect via MetaMask API
    // This just resets the UI state
    setAccount('');
    setIsConnected(false);
    setSigner(null);
    setContracts({
      passportNFT: null,
      credentialManager: null,
      verificationToken: null
    });
  };

  // Get short address for display
  const getShortAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Context value
  const contextValue = {
    account,
    chainId,
    network,
    provider,
    signer,
    contracts,
    isConnected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    getShortAddress
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

// Hook to use Web3Context
export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

export default Web3Context;

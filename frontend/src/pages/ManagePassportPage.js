import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import PassportCard from '../components/passport/PassportCard';
import CredentialCard from '../components/credential/CredentialCard';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import colors from '../theme/colors';

const PageTitle = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 2rem;
  font-weight: 400;
  color: ${colors.text.primary};
  margin-bottom: 1.5rem;
`;

const PageContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const PassportSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CredentialsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: ${colors.text.primary};
  margin-bottom: 1rem;
`;

const CredentialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: ${colors.background.secondary};
  border-radius: 8px;
  border: 1px solid ${colors.lines.primary};
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: ${colors.text.secondary};
`;

const EmptyStateTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: ${colors.text.primary};
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 1.5rem;
  max-width: 400px;
`;

const ErrorMessage = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: ${colors.accent.red};
  padding: 1rem;
  background-color: rgba(245, 104, 104, 0.1);
  border-radius: 4px;
  margin-bottom: 1.5rem;
`;

const MovePassportModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(10, 10, 10, 0.8);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${colors.background.secondary};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
`;

const ModalTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: ${colors.text.primary};
  margin-bottom: 1.5rem;
`;

const NetworkOptions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const NetworkOption = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: ${props => props.active ? props.activeColor : colors.background.primary};
  color: ${props => props.active ? colors.background.primary : props.color};
  border: 1px solid ${props => props.color};
  border-radius: 4px;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => !props.active && 'rgba(108, 173, 245, 0.1)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NetworkIcon = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ManagePassportPage = () => {
  const { 
    isConnected, 
    connectWallet, 
    account, 
    network, 
    contracts, 
    switchNetwork 
  } = useWeb3();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passports, setPassports] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [selectedPassport, setSelectedPassport] = useState(null);
  const [targetNetwork, setTargetNetwork] = useState('');
  const [movingPassport, setMovingPassport] = useState(false);
  
  useEffect(() => {
    if (isConnected && contracts.passportNFT && account) {
      loadPassports();
    }
  }, [isConnected, contracts.passportNFT, account, network]);
  
  useEffect(() => {
    if (isConnected && contracts.credentialManager && passports.length > 0) {
      loadCredentials();
    }
  }, [isConnected, contracts.credentialManager, passports, network]);
  
  const loadPassports = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real implementation, you would query the contract for the user's passports
      // For demo purposes, we'll create a dummy passport
      const dummyPassport = {
        id: 0,
        name: 'My OmniPass',
        image: 'https://via.placeholder.com/500',
        owner: account,
        creationTimestamp: Math.floor(Date.now() / 1000) - 86400 // Yesterday
      };
      
      setPassports([dummyPassport]);
    } catch (err) {
      console.error("Error loading passports:", err);
      setError("Failed to load passports. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const loadCredentials = async () => {
    setLoading(true);
    setError('');
    
    try {
      // In a real implementation, you would query the contract for credentials
      // For demo purposes, we'll create dummy credentials
      const dummyCredentials = [
        {
          credentialId: 0,
          passportId: 0,
          credentialType: 'Proof of Humanity',
          data: JSON.stringify({ verified: true, method: 'biometric', date: '2023-05-12' }, null, 2),
          issuanceTimestamp: Math.floor(Date.now() / 1000) - 86400 * 3, // 3 days ago
          issuer: '0x1234567890123456789012345678901234567890',
          isValid: true
        },
        {
          credentialId: 1,
          passportId: 0,
          credentialType: 'DAO Membership',
          data: JSON.stringify({ organization: 'Example DAO', role: 'Member', joinDate: '2023-06-01' }, null, 2),
          issuanceTimestamp: Math.floor(Date.now() / 1000) - 86400 * 10, // 10 days ago
          issuer: '0x2345678901234567890123456789012345678901',
          isValid: true
        }
      ];
      
      setCredentials(dummyCredentials);
    } catch (err) {
      console.error("Error loading credentials:", err);
      setError("Failed to load credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleMovePassport = (passport) => {
    setSelectedPassport(passport);
    setShowMoveModal(true);
  };
  
  const closeModal = () => {
    setShowMoveModal(false);
    setSelectedPassport(null);
    setTargetNetwork('');
    setMovingPassport(false);
  };
  
  const confirmMove = async () => {
    if (!selectedPassport || !targetNetwork) return;
    
    setMovingPassport(true);
    setError('');
    
    try {
      // In a real implementation, you would call the contract's sendFrom method
      // For demo purposes, we'll just simulate the process
      
      // Switch to the current network if not already on it
      if (network !== targetNetwork) {
        await switchNetwork(targetNetwork);
      }
      
      // Wait for 2 seconds to simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Close modal and refresh data
      closeModal();
      loadPassports();
      loadCredentials();
    } catch (err) {
      console.error("Error moving passport:", err);
      setError("Failed to move passport. Please try again.");
      setMovingPassport(false);
    }
  };
  
  const verifyCredential = (credential) => {
    // In a real implementation, you would interact with the contract
    // For demo purposes, we'll just log the action
    console.log(`Verifying credential: ${credential.credentialType}`);
  };
  
  const revokeCredential = async (credential) => {
    // In a real implementation, you would interact with the contract
    // For demo purposes, we'll just update the local state
    setCredentials(prevCredentials => 
      prevCredentials.map(cred => 
        cred.credentialId === credential.credentialId 
          ? { ...cred, isValid: false } 
          : cred
      )
    );
  };
  
  if (!isConnected) {
    return (
      <div>
        <PageTitle>Manage Passport</PageTitle>
        <EmptyState>
          <EmptyStateIcon>🔒</EmptyStateIcon>
          <EmptyStateTitle>Wallet Not Connected</EmptyStateTitle>
          <EmptyStateText>
            Please connect your wallet to view and manage your passports.
          </EmptyStateText>
          <Button onClick={connectWallet}>
            Connect Wallet
          </Button>
        </EmptyState>
      </div>
    );
  }
  
  return (
    <div>
      <PageTitle>Manage Passport</PageTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading && passports.length === 0 && credentials.length === 0 ? (
        <Loader text="Loading your passport data..." />
      ) : (
        <>
          {passports.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>📝</EmptyStateIcon>
              <EmptyStateTitle>No Passports Found</EmptyStateTitle>
              <EmptyStateText>
                You don't have any passports yet. Create your first passport to start building your cross-chain identity.
              </EmptyStateText>
              <Button as="a" href="/create-passport">
                Create Passport
              </Button>
            </EmptyState>
          ) : (
            <PageContent>
              <PassportSection>
                <SectionTitle>Your Passport</SectionTitle>
                {passports.map(passport => (
                  <PassportCard 
                    key={passport.id} 
                    passport={passport} 
                    currentChain={network}
                    onMove={() => handleMovePassport(passport)}
                  />
                ))}
              </PassportSection>
              
              <CredentialsSection>
                <SectionTitle>Your Credentials</SectionTitle>
                {credentials.length === 0 ? (
                  <EmptyState>
                    <EmptyStateIcon>🔖</EmptyStateIcon>
                    <EmptyStateTitle>No Credentials Yet</EmptyStateTitle>
                    <EmptyStateText>
                      You haven't collected any credentials yet. Add your first credential to enhance your digital identity.
                    </EmptyStateText>
                    <Button as="a" href="/add-credential">
                      Add Credential
                    </Button>
                  </EmptyState>
                ) : (
                  <CredentialGrid>
                    {credentials.map(credential => (
                      <CredentialCard 
                        key={credential.credentialId} 
                        credential={credential}
                        onVerify={verifyCredential}
                        onRevoke={revokeCredential}
                      />
                    ))}
                  </CredentialGrid>
                )}
              </CredentialsSection>
            </PageContent>
          )}
        </>
      )}
      
      {showMoveModal && (
        <MovePassportModal>
          <ModalContent>
            <ModalTitle>Move Passport to Another Chain</ModalTitle>
            
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <p style={{ 
              fontFamily: '"Roboto Mono", monospace', 
              fontSize: '0.875rem', 
              color: colors.text.secondary,
              marginBottom: '1.5rem'
            }}>
              Select the destination chain where you want to move your passport.
              Your credentials will remain accessible from all chains.
            </p>
            
            <NetworkOptions>
              <NetworkOption 
                active={targetNetwork === 'sepolia'}
                onClick={() => setTargetNetwork('sepolia')}
                color={colors.accent.blue}
                activeColor={colors.accent.blue}
                disabled={network === 'sepolia' || movingPassport}
              >
                <NetworkIcon color={colors.accent.blue} />
                Sepolia
              </NetworkOption>
              
              <NetworkOption 
                active={targetNetwork === 'arbitrumGoerli'}
                onClick={() => setTargetNetwork('arbitrumGoerli')}
                color={colors.accent.green}
                activeColor={colors.accent.green}
                disabled={network === 'arbitrumGoerli' || movingPassport}
              >
                <NetworkIcon color={colors.accent.green} />
                Arbitrum Goerli
              </NetworkOption>
              
              <NetworkOption 
                active={targetNetwork === 'baseGoerli'}
                onClick={() => setTargetNetwork('baseGoerli')}
                color={colors.accent.yellow}
                activeColor={colors.accent.yellow}
                disabled={network === 'baseGoerli' || movingPassport}
              >
                <NetworkIcon color={colors.accent.yellow} />
                Base Goerli
              </NetworkOption>
            </NetworkOptions>
            
            <ModalActions>
              <Button 
                variant="outline" 
                onClick={closeModal}
                disabled={movingPassport}
              >
                Cancel
              </Button>
              
              <Button 
                onClick={confirmMove}
                disabled={!targetNetwork || network === targetNetwork || movingPassport}
              >
                {movingPassport ? 'Moving...' : 'Move Passport'}
              </Button>
            </ModalActions>
            
            {movingPassport && (
              <div style={{ marginTop: '1.5rem' }}>
                <Loader text="Moving your passport to the destination chain..." />
              </div>
            )}
          </ModalContent>
        </MovePassportModal>
      )}
    </div>
  );
};

export default ManagePassportPage;

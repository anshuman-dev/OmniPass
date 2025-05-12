import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useWeb3 } from '../contexts/Web3Context';
import Card from '../components/ui/Card';
import TextField from '../components/ui/TextField';
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

const FormContainer = styled(Card)`
  max-width: 600px;
  margin: 2rem auto;
`;

const FormTitle = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: ${colors.text.primary};
  margin-bottom: 1.5rem;
`;

const FormInstruction = styled.p`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
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

const NetworkSelector = styled.div`
  margin-bottom: 2rem;
`;

const NetworkLabel = styled.label`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 0.5rem;
  display: block;
`;

const NetworkOptions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
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
`;

const NetworkIcon = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
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

const CreatePassportPage = () => {
  const navigate = useNavigate();
  const { isConnected, connectWallet, network, contracts, signer } = useWeb3();
  
  const [formData, setFormData] = useState({
    name: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  
  // Update form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle network selection
  const handleNetworkSelect = (networkName) => {
    setSelectedNetwork(networkName);
    // In a real app, we would switch networks here
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!selectedNetwork) {
      setError('Please select a network');
      return;
    }
    
    if (!formData.name.trim()) {
      setError('Please enter a name for your passport');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Create metadata object
      const metadata = {
        name: formData.name,
        description: `OmniPass NFT for ${formData.name}`,
        image: formData.image || 'https://via.placeholder.com/500',
        attributes: [
          {
            trait_type: 'Creation Date',
            value: new Date().toISOString()
          }
        ]
      };
      
      // In a real app, we would upload this to IPFS
      // For this demo, we'll just convert it to a data URI
      const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
      
      if (contracts.passportNFT) {
        // Call the contract method
        const tx = await contracts.passportNFT.mint(
          formData.name,
          formData.image || 'https://via.placeholder.com/500',
          tokenURI
        );
        
        // Wait for the transaction to be mined
        await tx.wait();
        
        // Navigate to manage passport page
        navigate('/manage-passport');
      } else {
        // For demo purposes, simulate success
        console.log("Creating passport with data:", { ...formData, tokenURI });
        
        // Wait for 2 seconds to simulate transaction
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        navigate('/manage-passport');
      }
    } catch (err) {
      console.error("Error creating passport:", err);
      setError(err.message || "Failed to create passport");
    } finally {
      setLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div>
        <PageTitle>Create Passport</PageTitle>
        <EmptyState>
          <EmptyStateIcon>🔒</EmptyStateIcon>
          <EmptyStateTitle>Wallet Not Connected</EmptyStateTitle>
          <EmptyStateText>
            Please connect your wallet to create a new Passport NFT.
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
      <PageTitle>Create Passport</PageTitle>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormTitle>Create a New Passport</FormTitle>
          <FormInstruction>
            Your Passport NFT is the foundation of your cross-chain identity.
            It will store all your credentials and can be moved between chains.
          </FormInstruction>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <NetworkSelector>
            <NetworkLabel>Select Network</NetworkLabel>
            <NetworkOptions>
              <NetworkOption 
                active={selectedNetwork === 'sepolia'}
                onClick={() => handleNetworkSelect('sepolia')}
                color={colors.accent.blue}
                activeColor={colors.accent.blue}
              >
                <NetworkIcon color={colors.accent.blue} />
                Sepolia
              </NetworkOption>
              
              <NetworkOption 
                active={selectedNetwork === 'arbitrumGoerli'}
                onClick={() => handleNetworkSelect('arbitrumGoerli')}
                color={colors.accent.green}
                activeColor={colors.accent.green}
              >
                <NetworkIcon color={colors.accent.green} />
                Arbitrum Goerli
              </NetworkOption>
              
              <NetworkOption 
                active={selectedNetwork === 'baseGoerli'}
                onClick={() => handleNetworkSelect('baseGoerli')}
                color={colors.accent.yellow}
                activeColor={colors.accent.yellow}
              >
                <NetworkIcon color={colors.accent.yellow} />
                Base Goerli
              </NetworkOption>
            </NetworkOptions>
          </NetworkSelector>
          
          <FormGroup>
            <TextField 
              label="Passport Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter a name for your passport"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <TextField 
              label="Image URL (Optional)"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter an image URL for your passport"
              helperText="Leave blank to use a default image"
            />
          </FormGroup>
          
          <FormActions>
            <Button 
              variant="secondary" 
              type="button"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              disabled={loading || !selectedNetwork}
            >
              {loading ? 'Creating...' : 'Create Passport'}
            </Button>
          </FormActions>
          
          {loading && <Loader text="Creating your passport..." />}
        </form>
      </FormContainer>
    </div>
  );
};

export default CreatePassportPage;

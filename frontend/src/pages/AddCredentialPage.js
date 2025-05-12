import React, { useState, useEffect } from 'react';
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
  max-width: 800px;
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const PassportSelector = styled.div`
  margin-bottom: 2rem;
`;

const PassportOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: ${colors.background.primary};
  border: 1px solid ${props => props.selected ? colors.accent.blue : colors.lines.primary};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.accent.blue};
  }
`;

const PassportInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PassportName = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  color: ${colors.text.primary};
`;

const PassportDetail = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.75rem;
  color: ${colors.text.secondary};
`;

const SelectIndicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid ${props => props.selected ? colors.accent.blue : colors.lines.primary};
  background-color: ${props => props.selected ? colors.accent.blue : 'transparent'};
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

const AddCredentialPage = () => {
  const navigate = useNavigate();
  const { isConnected, connectWallet, account, network, contracts } = useWeb3();
  
  const [passports, setPassports] = useState([]);
  const [selectedPassport, setSelectedPassport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    credentialType: '',
    data: ''
  });
  
  useEffect(() => {
    if (isConnected && contracts.passportNFT && account) {
      loadPassports();
    }
  }, [isConnected, contracts.passportNFT, account, network]);
  
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
        owner: account
      };
      
      setPassports([dummyPassport]);
      setSelectedPassport(dummyPassport);
    } catch (err) {
      console.error("Error loading passports:", err);
      setError("Failed to load passports. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!selectedPassport) {
      setError('Please select a passport');
      return;
    }
    
    if (!formData.credentialType.trim()) {
      setError('Please enter a credential type');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // In a real implementation, you would call the contract's createCredential method
      // For demo purposes, we'll just simulate the process
      
      // Wait for 2 seconds to simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to manage passport page
      navigate('/manage-passport');
    } catch (err) {
      console.error("Error adding credential:", err);
      setError(err.message || "Failed to add credential");
    } finally {
      setLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div>
        <PageTitle>Add Credential</PageTitle>
        <EmptyState>
          <EmptyStateIcon>🔒</EmptyStateIcon>
          <EmptyStateTitle>Wallet Not Connected</EmptyStateTitle>
          <EmptyStateText>
            Please connect your wallet to add credentials to your passport.
          </EmptyStateText>
          <Button onClick={connectWallet}>
            Connect Wallet
          </Button>
        </EmptyState>
      </div>
    );
  }
  
  if (passports.length === 0 && !loading) {
    return (
      <div>
        <PageTitle>Add Credential</PageTitle>
        <EmptyState>
          <EmptyStateIcon>📝</EmptyStateIcon>
          <EmptyStateTitle>No Passports Found</EmptyStateTitle>
          <EmptyStateText>
            You need a passport to add credentials. Create your first passport to start building your cross-chain identity.
          </EmptyStateText>
          <Button as="a" href="/create-passport">
            Create Passport
          </Button>
        </EmptyState>
      </div>
    );
  }
  
  return (
    <div>
      <PageTitle>Add Credential</PageTitle>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormTitle>Add a New Credential</FormTitle>
          <FormInstruction>
            Credentials are verifiable attestations that can be added to your passport.
            Once added, they will be synchronized across all chains using LayerZero.
          </FormInstruction>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <PassportSelector>
            <h3 style={{ 
              fontFamily: '"Roboto", sans-serif', 
              fontSize: '1rem', 
              color: colors.text.primary,
              marginBottom: '0.75rem'
            }}>
              Select Passport
            </h3>
            
            {passports.map(passport => (
              <PassportOption 
                key={passport.id}
                selected={selectedPassport && selectedPassport.id === passport.id}
                onClick={() => setSelectedPassport(passport)}
              >
                <PassportInfo>
                  <PassportName>{passport.name}</PassportName>
                  <PassportDetail>ID: {passport.id}</PassportDetail>
                </PassportInfo>
                <SelectIndicator selected={selectedPassport && selectedPassport.id === passport.id} />
              </PassportOption>
            ))}
          </PassportSelector>
          
          <FormGroup>
            <TextField 
              label="Credential Type"
              name="credentialType"
              value={formData.credentialType}
              onChange={handleChange}
              placeholder="e.g., Proof of Humanity, DAO Membership, etc."
              required
            />
          </FormGroup>
          
          <FormGroup>
            <TextField 
              label="Credential Data (JSON)"
              name="data"
              value={formData.data}
              onChange={handleChange}
              placeholder='{
  "attribute": "value",
  "verified": true,
  "timestamp": "2023-09-20T12:00:00Z"
}'
              multiline
              rows={5}
              helperText="Enter the credential data in JSON format"
            />
          </FormGroup>
          
          <FormActions>
            <Button 
              variant="outline" 
              type="button"
              onClick={() => navigate('/manage-passport')}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              disabled={loading || !selectedPassport}
            >
              {loading ? 'Adding...' : 'Add Credential'}
            </Button>
          </FormActions>
          
          {loading && <Loader text="Adding credential..." />}
        </form>
      </FormContainer>
    </div>
  );
};

export default AddCredentialPage;

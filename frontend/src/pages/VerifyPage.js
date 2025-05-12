import React, { useState } from 'react';
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

const FormActions = styled.div`
  display: flex;
  justify-content: center;
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

const VerificationResult = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => 
    props.success ? 'rgba(138, 224, 108, 0.1)' : 
    props.error ? 'rgba(245, 104, 104, 0.1)' : 
    colors.background.primary
  };
  border: 1px solid ${props => 
    props.success ? colors.accent.green : 
    props.error ? colors.accent.red : 
    colors.lines.primary
  };
`;

const ResultIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  color: ${props => 
    props.success ? colors.accent.green : 
    props.error ? colors.accent.red : 
    colors.text.secondary
  };
`;

const ResultTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: ${colors.text.primary};
  margin-bottom: 1rem;
`;

const ResultMessage = styled.p`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 1.5rem;
  max-width: 500px;
`;

const CredentialDetails = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: ${colors.background.primary};
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  .label {
    font-family: 'Roboto Mono', monospace;
    font-size: 0.75rem;
    color: ${colors.text.secondary};
  }
  
  .value {
    font-family: 'Roboto Mono', monospace;
    font-size: 0.75rem;
    color: ${colors.text.primary};
  }
`;

const TransactionLink = styled.a`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.75rem;
  color: ${colors.accent.blue};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
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

const VerifyPage = () => {
  const { isConnected, connectWallet, network, contracts } = useWeb3();
  
  const [passportId, setPassportId] = useState('');
  const [credentialType, setCredentialType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  
  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!passportId.trim()) {
      setError('Please enter a passport ID');
      return;
    }
    
    if (!credentialType.trim()) {
      setError('Please enter a credential type');
      return;
    }
    
    setError('');
    setLoading(true);
    setVerificationResult(null);
    
    try {
      // In a real implementation, you would call the contract's verifyCredential method
      // For demo purposes, we'll just simulate the process
      
      // Wait for 2 seconds to simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate verification result (success/failure based on input)
      if (passportId === '0' && (credentialType === 'Proof of Humanity' || credentialType === 'DAO Membership')) {
        setVerificationResult({
          success: true,
          message: `The passport has a valid ${credentialType} credential.`,
          details: {
            passportId,
            credentialType,
            issuer: '0x1234...5678',
            issuanceDate: '2023-09-15',
            chainId: network,
            transactionHash: '0xabcd...1234'
          }
        });
      } else {
        setVerificationResult({
          success: false,
          message: `No valid ${credentialType} credential found for the given passport.`,
          details: {
            passportId,
            credentialType,
            chainId: network
          }
        });
      }
    } catch (err) {
      console.error("Error verifying credential:", err);
      setError(err.message || "Failed to verify credential");
    } finally {
      setLoading(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div>
        <PageTitle>Verify Credentials</PageTitle>
        <EmptyState>
          <EmptyStateIcon>🔒</EmptyStateIcon>
          <EmptyStateTitle>Wallet Not Connected</EmptyStateTitle>
          <EmptyStateText>
            Please connect your wallet to verify credentials.
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
      <PageTitle>Verify Credentials</PageTitle>
      
      <FormContainer>
        <FormTitle>Verify a Credential</FormTitle>
        <FormInstruction>
          Enter the passport ID and credential type to verify if a passport has a valid credential.
          Verification works across all chains thanks to LayerZero's omnichain technology.
        </FormInstruction>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleVerify}>
          <FormGroup>
            <TextField 
              label="Passport ID"
              value={passportId}
              onChange={(e) => setPassportId(e.target.value)}
              placeholder="Enter the passport ID"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <TextField 
              label="Credential Type"
              value={credentialType}
              onChange={(e) => setCredentialType(e.target.value)}
              placeholder="e.g., Proof of Humanity, DAO Membership, etc."
              required
            />
          </FormGroup>
          
          <FormActions>
            <Button 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Credential'}
            </Button>
          </FormActions>
          
          {loading && <Loader text="Verifying credential..." />}
        </form>
        
        {verificationResult && (
          <VerificationResult
            success={verificationResult.success}
            error={!verificationResult.success}
          >
            <ResultIcon 
              success={verificationResult.success}
              error={!verificationResult.success}
            >
              {verificationResult.success ? '✅' : '❌'}
            </ResultIcon>
            
            <ResultTitle>
              {verificationResult.success ? 'Verification Successful' : 'Verification Failed'}
            </ResultTitle>
            
            <ResultMessage>
              {verificationResult.message}
            </ResultMessage>
            
            <CredentialDetails>
              <DetailRow>
                <span className="label">Passport ID:</span>
                <span className="value">{verificationResult.details.passportId}</span>
              </DetailRow>
              
              <DetailRow>
                <span className="label">Credential Type:</span>
                <span className="value">{verificationResult.details.credentialType}</span>
              </DetailRow>
              
              <DetailRow>
                <span className="label">Chain ID:</span>
                <span className="value">{verificationResult.details.chainId}</span>
              </DetailRow>
              
              {verificationResult.success && (
                <>
                  <DetailRow>
                    <span className="label">Issuer:</span>
                    <span className="value">{verificationResult.details.issuer}</span>
                  </DetailRow>
                  
                  <DetailRow>
                    <span className="label">Issuance Date:</span>
                    <span className="value">{verificationResult.details.issuanceDate}</span>
                  </DetailRow>
                  
                  <DetailRow>
                    <span className="label">Transaction:</span>
                    <TransactionLink 
                      href={`https://goerli.etherscan.io/tx/${verificationResult.details.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Explorer
                    </TransactionLink>
                  </DetailRow>
                </>
              )}
            </CredentialDetails>
            
            {verificationResult.success && (
              <Button variant="success">
                Grant Access
              </Button>
            )}
          </VerificationResult>
        )}
      </FormContainer>
    </div>
  );
};

export default VerifyPage;

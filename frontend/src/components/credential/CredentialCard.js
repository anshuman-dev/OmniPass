import React from 'react';
import styled from 'styled-components';
import Card from '../ui/Card';
import Button from '../ui/Button';
import colors from '../../theme/colors';

const CredentialContainer = styled(Card)`
  max-width: 360px;
  width: 100%;
`;

const CredentialHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CredentialTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  color: ${colors.text.primary};
  margin: 0;
`;

const CredentialStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: ${props => 
    props.isValid 
      ? 'rgba(138, 224, 108, 0.1)' 
      : 'rgba(245, 104, 104, 0.1)'
  };
  border-radius: 4px;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.75rem;
  color: ${props => 
    props.isValid 
      ? colors.accent.green 
      : colors.accent.red
  };
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => 
    props.isValid 
      ? colors.accent.green 
      : colors.accent.red
  };
`;

const CredentialInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const CredentialDetail = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.75rem;
  
  .label {
    color: ${colors.text.secondary};
  }
  
  .value {
    color: ${colors.text.primary};
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const CredentialData = styled.div`
  background-color: ${colors.background.primary};
  border-radius: 4px;
  padding: 0.75rem;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.75rem;
  color: ${colors.text.secondary};
  max-height: 100px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
  word-break: break-word;
`;

const getShortAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString();
};

const CredentialCard = ({ 
  credential = {},
  onVerify,
  onRevoke
}) => {
  const { 
    credentialId = 0,
    passportId = 0,
    credentialType = 'Default Credential',
    data = '{}',
    issuanceTimestamp = Math.floor(Date.now() / 1000),
    issuer = '0x0000000000000000000000000000000000000000',
    isValid = true
  } = credential;
  
  return (
    <CredentialContainer>
      <CredentialHeader>
        <CredentialTitle>{credentialType}</CredentialTitle>
        <CredentialStatus>
          <StatusDot isValid={isValid} />
          <StatusBadge isValid={isValid}>
            {isValid ? 'Valid' : 'Revoked'}
          </StatusBadge>
        </CredentialStatus>
      </CredentialHeader>
      
      <CredentialInfo>
        <CredentialDetail>
          <span className="label">Credential ID:</span>
          <span className="value">{credentialId}</span>
        </CredentialDetail>
        
        <CredentialDetail>
          <span className="label">Passport ID:</span>
          <span className="value">{passportId}</span>
        </CredentialDetail>
        
        <CredentialDetail>
          <span className="label">Issuer:</span>
          <span className="value">{getShortAddress(issuer)}</span>
        </CredentialDetail>
        
        <CredentialDetail>
          <span className="label">Issued:</span>
          <span className="value">{formatDate(issuanceTimestamp)}</span>
        </CredentialDetail>
      </CredentialInfo>
      
      <CredentialData>
        {data}
      </CredentialData>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {isValid && onVerify && (
          <Button 
            variant="primary" 
            fullWidth
            onClick={() => onVerify(credential)}
          >
            Verify
          </Button>
        )}
        
        {isValid && onRevoke && (
          <Button 
            variant="danger" 
            fullWidth
            onClick={() => onRevoke(credential)}
          >
            Revoke
          </Button>
        )}
      </div>
    </CredentialContainer>
  );
};

export default CredentialCard;

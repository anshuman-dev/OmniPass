import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import colors from '../../theme/colors';

const PassportContainer = styled(Card)`
  max-width: 360px;
  width: 100%;
`;

const PassportImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${colors.background.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PassportInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const PassportName = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  color: ${colors.text.primary};
  margin: 0;
`;

const PassportDetail = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.75rem;
  
  .label {
    color: ${colors.text.secondary};
  }
  
  .value {
    color: ${colors.text.primary};
  }
`;

const ChainBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: ${props => {
    switch (props.chainId) {
      case 'sepolia': return 'rgba(108, 173, 245, 0.1)';
      case 'arbitrumGoerli': return 'rgba(138, 224, 108, 0.1)';
      case 'baseGoerli': return 'rgba(241, 223, 56, 0.1)';
      default: return 'rgba(117, 117, 117, 0.1)';
    }
  }};
  border-radius: 4px;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.75rem;
  color: ${props => {
    switch (props.chainId) {
      case 'sepolia': return colors.accent.blue;
      case 'arbitrumGoerli': return colors.accent.green;
      case 'baseGoerli': return colors.accent.yellow;
      default: return colors.text.secondary;
    }
  }};
`;

const ChainIcon = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.chainId) {
      case 'sepolia': return colors.accent.blue;
      case 'arbitrumGoerli': return colors.accent.green;
      case 'baseGoerli': return colors.accent.yellow;
      default: return colors.text.secondary;
    }
  }};
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

const PassportCard = ({ 
  passport = {}, 
  showActions = true,
  currentChain = 'sepolia'
}) => {
  const { 
    id = 0,
    name = 'My Passport',
    image = '',
    owner = '0x0000000000000000000000000000000000000000',
    creationTimestamp = Math.floor(Date.now() / 1000)
  } = passport;
  
  return (
    <PassportContainer>
      <PassportImage>
        {image ? (
          <img src={image} alt={name} />
        ) : (
          <span style={{ color: colors.text.secondary }}>No Image</span>
        )}
      </PassportImage>
      
      <PassportInfo>
        <PassportName>{name}</PassportName>
        
        <ChainBadge chainId={currentChain}>
          <ChainIcon chainId={currentChain} />
          {currentChain.charAt(0).toUpperCase() + currentChain.slice(1)}
        </ChainBadge>
        
        <PassportDetail>
          <span className="label">Owner:</span>
          <span className="value">{getShortAddress(owner)}</span>
        </PassportDetail>
        
        <PassportDetail>
          <span className="label">Created:</span>
          <span className="value">{formatDate(creationTimestamp)}</span>
        </PassportDetail>
        
        <PassportDetail>
          <span className="label">Token ID:</span>
          <span className="value">{id}</span>
        </PassportDetail>
      </PassportInfo>
      
      {showActions && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button 
            as={Link} 
            to={`/manage-passport/${id}`} 
            variant="secondary" 
            fullWidth
          >
            Manage
          </Button>
          <Button
            variant="primary"
            fullWidth
          >
            Move
          </Button>
        </div>
      )}
    </PassportContainer>
  );
};

export default PassportCard;

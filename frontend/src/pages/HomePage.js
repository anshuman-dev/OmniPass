import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import colors from '../theme/colors';

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 64px 0;
`;

const Title = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 3.5rem;
  font-weight: 400;
  color: ${colors.text.primary};
  margin-bottom: 24px;
  letter-spacing: -1.5px;
  
  span {
    color: ${colors.accent.blue};
  }
`;

const Subtitle = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  color: ${colors.text.secondary};
  max-width: 800px;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const Button = styled(Link)`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &.primary {
    background-color: ${colors.accent.blue};
    color: ${colors.background.primary};
    
    &:hover {
      background-color: #8BC9FF;
    }
  }
  
  &.secondary {
    background-color: transparent;
    border: 1px solid ${colors.accent.blue};
    color: ${colors.accent.blue};
    
    &:hover {
      background-color: rgba(108, 173, 245, 0.1);
    }
  }
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin: 64px 0;
`;

const FeatureCard = styled.div`
  background-color: ${colors.background.secondary};
  border-radius: 8px;
  padding: 32px;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div`
  color: ${props => colors.accent[props.color] || colors.accent.blue};
  font-size: 2rem;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: ${colors.text.primary};
  margin-bottom: 16px;
`;

const FeatureDescription = styled.p`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  line-height: 1.6;
`;

const HomePage = () => {
  return (
    <>
      <HeroSection>
        <Title>
          <span>Omni</span>Pass: Cross-Chain Credential Passport
        </Title>
        <Subtitle>
          A unified digital identity system that works seamlessly across multiple blockchains, 
          allowing you to build your reputation once and use it everywhere.
        </Subtitle>
        <ButtonGroup>
          <Button to="/create-passport" className="primary">
            Create Passport
          </Button>
          <Button to="/manage-passport" className="secondary">
            Manage Passport
          </Button>
        </ButtonGroup>
      </HeroSection>
      
      <FeaturesSection>
        <FeatureCard>
          <FeatureIcon color="blue">🌉</FeatureIcon>
          <FeatureTitle>Cross-Chain Identity</FeatureTitle>
          <FeatureDescription>
            Create a unified digital identity that moves seamlessly between blockchains,
            eliminating the need to rebuild your reputation on each new chain.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon color="green">🔄</FeatureIcon>
          <FeatureTitle>Synchronized Credentials</FeatureTitle>
          <FeatureDescription>
            Collect credentials on any chain and have them automatically
            sync across the entire ecosystem using LayerZero technology.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon color="purple">✅</FeatureIcon>
          <FeatureTitle>Universal Verification</FeatureTitle>
          <FeatureDescription>
            Verify your credentials for access to services from any chain,
            without the need to move your Passport NFT.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
    </>
  );
};

export default HomePage;

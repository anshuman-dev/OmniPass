import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useWeb3 } from '../../contexts/Web3Context';
import colors from '../../theme/colors';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: ${colors.background.primary};
  border-bottom: 1px solid ${colors.lines.primary};
`;

const Logo = styled(Link)`
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: ${colors.text.primary};
  text-decoration: none;
  letter-spacing: -1px;
  
  span {
    color: ${colors.accent.blue};
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const NavLink = styled(Link)`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: ${({ active }) => (active ? colors.accent.blue : colors.text.secondary)};
  text-decoration: none;
  transition: color 0.2s ease-in-out;
  position: relative;
  
  &:hover {
    color: ${colors.text.primary};
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${colors.accent.blue};
    transform: scaleX(${({ active }) => (active ? 1 : 0)});
    transition: transform 0.2s ease-in-out;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const ConnectButton = styled.button`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  padding: 8px 16px;
  background-color: ${colors.accent.blue};
  color: ${colors.background.primary};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #8BC9FF;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const AccountButton = styled.button`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  padding: 8px 16px;
  background-color: transparent;
  color: ${colors.text.primary};
  border: 1px solid ${colors.lines.primary};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.text.primary};
  }
`;

const Header = () => {
  const location = useLocation();
  const { isConnected, connectWallet, disconnectWallet, getShortAddress, account, loading } = useWeb3();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <HeaderContainer>
      <Logo to="/">
        <span>Omni</span>Pass
      </Logo>
      <Nav>
        <NavLink to="/create-passport" active={isActive('/create-passport')}>
          Create Passport
        </NavLink>
        <NavLink to="/manage-passport" active={isActive('/manage-passport')}>
          My Passport
        </NavLink>
        <NavLink to="/add-credential" active={isActive('/add-credential')}>
          Add Credential
        </NavLink>
        <NavLink to="/verify" active={isActive('/verify')}>
          Verify
        </NavLink>
        <NavLink to="/history" active={isActive('/history')}>
          History
        </NavLink>
        
        {isConnected ? (
          <AccountButton onClick={disconnectWallet}>
            {getShortAddress(account)}
          </AccountButton>
        ) : (
          <ConnectButton onClick={connectWallet} disabled={loading}>
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </ConnectButton>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;

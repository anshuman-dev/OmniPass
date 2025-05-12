import React from 'react';
import styled from 'styled-components';
import colors from '../../theme/colors';

const ButtonBase = styled.button`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background-color: ${colors.accent.blue};
  color: ${colors.background.primary};
  
  &:hover:not(:disabled) {
    background-color: #8BC9FF;
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background-color: transparent;
  border: 1px solid ${colors.accent.blue};
  color: ${colors.accent.blue};
  
  &:hover:not(:disabled) {
    background-color: rgba(108, 173, 245, 0.1);
  }
`;

const DangerButton = styled(ButtonBase)`
  background-color: ${colors.accent.red};
  color: ${colors.background.primary};
  
  &:hover:not(:disabled) {
    background-color: #F78A8A;
  }
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  disabled = false, 
  onClick,
  ...props 
}) => {
  // Choose the appropriate button component based on the variant
  const ButtonComponent = {
    primary: PrimaryButton,
    secondary: SecondaryButton,
    danger: DangerButton
  }[variant] || PrimaryButton;
  
  return (
    <ButtonComponent 
      disabled={disabled} 
      onClick={onClick}
      {...props}
    >
      {children}
    </ButtonComponent>
  );
};

export default Button;

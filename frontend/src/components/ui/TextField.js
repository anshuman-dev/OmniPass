import React from 'react';
import styled from 'styled-components';
import colors from '../../theme/colors';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
`;

const Label = styled.label`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const StyledInput = styled.input`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  padding: 0.75rem;
  background-color: ${colors.background.primary};
  color: ${colors.text.primary};
  border: 1px solid ${colors.lines.primary};
  border-radius: 4px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.blue};
  }
  
  &::placeholder {
    color: ${colors.text.tertiary};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const StyledTextarea = styled.textarea`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  padding: 0.75rem;
  background-color: ${colors.background.primary};
  color: ${colors.text.primary};
  border: 1px solid ${colors.lines.primary};
  border-radius: 4px;
  transition: border-color 0.2s ease;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${colors.accent.blue};
  }
  
  &::placeholder {
    color: ${colors.text.tertiary};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const HelperText = styled.span`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.75rem;
  color: ${props => props.error ? colors.accent.red : colors.text.tertiary};
  margin-top: 0.25rem;
`;

const TextField = ({
  label,
  helperText,
  error,
  multiline = false,
  ...props
}) => {
  const InputComponent = multiline ? StyledTextarea : StyledInput;
  
  return (
    <InputContainer>
      {label && <Label>{label}</Label>}
      <InputComponent {...props} />
      {helperText && <HelperText error={error}>{helperText}</HelperText>}
    </InputContainer>
  );
};

export default TextField;

import React from 'react';
import styled, { keyframes } from 'styled-components';
import colors from '../../theme/colors';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1rem;
`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
`;

const Spinner = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 40px;
  height: 40px;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-top-color: ${colors.accent.blue};
`;

const LoadingText = styled.p`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: ${colors.text.secondary};
  margin-top: 1rem;
`;

const Loader = ({ text = 'Loading...' }) => {
  return (
    <LoaderContainer>
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
      <LoadingText>{text}</LoadingText>
    </LoaderContainer>
  );
};

export default Loader;

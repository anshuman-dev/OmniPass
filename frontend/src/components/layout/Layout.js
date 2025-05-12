import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import GeometricBackground from './GeometricBackground';
import colors from '../../theme/colors';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${colors.background.primary};
  color: ${colors.text.primary};
`;

const Main = styled.main`
  flex: 1;
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <GeometricBackground />
      <Header />
      <Main>{children}</Main>
    </LayoutContainer>
  );
};

export default Layout;

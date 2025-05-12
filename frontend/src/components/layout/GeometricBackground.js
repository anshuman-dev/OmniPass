import React from 'react';
import styled from 'styled-components';
import colors from '../../theme/colors';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  background-color: ${colors.background.primary};
`;

const GridPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.07;
  background-image: 
    linear-gradient(to right, ${colors.lines.primary} 1px, transparent 1px),
    linear-gradient(to bottom, ${colors.lines.primary} 1px, transparent 1px);
  background-size: 30px 30px;
`;

const CirclePattern = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border: 1px solid ${colors.lines.primary};
  border-radius: 50%;
  opacity: 0.15;
`;

const RayPattern = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  opacity: 0.15;
  
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: ${colors.lines.primary};
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    background-color: ${colors.lines.primary};
  }
`;

const DiagonalRay = styled(RayPattern)`
  transform: rotate(45deg);
`;

const GeometricBackground = () => {
  return (
    <BackgroundContainer>
      <GridPattern />
      
      <CirclePattern style={{ top: '10%', left: '5%' }} />
      <CirclePattern style={{ top: '30%', left: '60%', width: '150px', height: '150px' }} />
      <CirclePattern style={{ top: '70%', left: '20%', width: '120px', height: '120px' }} />
      <CirclePattern style={{ top: '60%', left: '80%', width: '80px', height: '80px' }} />
      
      <RayPattern style={{ top: '15%', left: '20%' }} />
      <RayPattern style={{ top: '40%', left: '75%' }} />
      <RayPattern style={{ top: '80%', left: '35%' }} />
      
      <DiagonalRay style={{ top: '25%', left: '40%' }} />
      <DiagonalRay style={{ top: '65%', left: '60%' }} />
    </BackgroundContainer>
  );
};

export default GeometricBackground;

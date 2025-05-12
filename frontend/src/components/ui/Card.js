import React from 'react';
import styled from 'styled-components';
import colors from '../../theme/colors';

const CardContainer = styled.div`
  background-color: ${colors.background.secondary};
  border-radius: 8px;
  border: 1px solid ${colors.lines.primary};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${colors.lines.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: ${colors.text.primary};
  margin: 0;
`;

const CardContent = styled.div`
  padding: 1.25rem;
`;

const CardFooter = styled.div`
  padding: 1.25rem;
  border-top: 1px solid ${colors.lines.primary};
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Card = ({ title, children, footer, action, ...props }) => {
  return (
    <CardContainer {...props}>
      {(title || action) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {action && action}
        </CardHeader>
      )}
      
      <CardContent>
        {children}
      </CardContent>
      
      {footer && (
        <CardFooter>
          {footer}
        </CardFooter>
      )}
    </CardContainer>
  );
};

export default Card;

import React from 'react';
import styled from 'styled-components';

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Poppins', 'Inter', sans-serif;
  cursor: pointer;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transform: rotate(45deg);
    animation: shine 3s infinite;
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
`;

const LogoText = styled.div`
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

const Logo = ({ size = 'normal' }) => {
  const isSmall = size === 'small';
  
  return (
    <LogoContainer>
      <LogoIcon style={{ 
        width: isSmall ? '32px' : '40px', 
        height: isSmall ? '32px' : '40px',
        fontSize: isSmall ? '1.2rem' : '1.5rem'
      }}>
        PN
      </LogoIcon>
      {!isSmall && <LogoText>Prep Nexus</LogoText>}
    </LogoContainer>
  );
};

export default Logo; 
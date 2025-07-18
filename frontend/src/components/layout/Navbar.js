import React from 'react';
import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi';
import Logo from '../Logo';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: #e2e8f0;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  
  &:hover {
    color: #6366f1;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #e2e8f0;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = ({ onMobileMenuOpen }) => {
  return (
    <NavbarContainer>
      <NavLogo>
        <Logo />
      </NavLogo>
      
      <NavLinks>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/#features">Features</NavLink>
        <NavLink href="/#pricing">Pricing</NavLink>
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/app">Dashboard</NavLink>
      </NavLinks>
      
      <MobileMenuButton onClick={onMobileMenuOpen}>
        <FiMenu />
      </MobileMenuButton>
    </NavbarContainer>
  );
};

export default Navbar; 
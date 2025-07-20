import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const MobileMenuContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const MobileNavLink = styled.a`
  color: #e2e8f0;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 600;
  transition: color 0.2s;
  
  &:hover {
    color: #6366f1;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: #e2e8f0;
  font-size: 2rem;
  cursor: pointer;
`;

const MobileMenu = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <MobileMenuContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
          <MobileNavLink href="/" onClick={onClose}>Home</MobileNavLink>
          <MobileNavLink href="/#features" onClick={onClose}>Features</MobileNavLink>
          <MobileNavLink href="/#pricing" onClick={onClose}>Pricing</MobileNavLink>
          <MobileNavLink href="/#blog" onClick={onClose}>Blog</MobileNavLink>
          <MobileNavLink href="/app" onClick={onClose}>Dashboard</MobileNavLink>
        </MobileMenuContainer>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu; 
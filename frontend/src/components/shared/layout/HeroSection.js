import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HeroContainer = styled.section`
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(99,102,241,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

const VersionBadge = styled.div`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  display: inline-block;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
`;

const HeroTitle = styled.h1`
  color: #f8fafc;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  margin: 0 0 1.5rem 0;
  line-height: 1.1;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: #e0e7ff;
  background: rgba(36, 40, 62, 0.25);
  border-radius: 1.2rem;
  padding: 1.2rem 2rem;
  box-shadow: 0 2px 16px #23294633;
  backdrop-filter: blur(8px);
  border: 1.5px solid #23294622;
  @media (max-width: 600px) {
    font-size: 1.05rem;
    padding: 1rem 1rem;
  }
`;

const CTAButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: #fff;
  color: #6366f1;
  font-size: 1.25rem;
  font-weight: 700;
  border: none;
  border-radius: 1.2rem;
  padding: 1.1rem 2.5rem;
  box-shadow: 0 4px 32px #23294644;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.2s;
  outline: none;
  z-index: 2;
  &:hover, &:focus {
    background: #6366f1;
    color: #fff;
    transform: translateY(-2px) scale(1.05);
  }
`;

const HeroSection = () => {
  return (
    <HeroContainer>
      <HeroContent>
        <VersionBadge>v2.1.0 - Latest Release</VersionBadge>
        <HeroTitle>
          Master Your Career with AI-Powered Prep
        </HeroTitle>
        <HeroSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Prep Nexus combines advanced AI with proven strategies to help you ace interviews, 
          optimize your resume, and land your dream job. Join thousands of successful professionals.
        </HeroSubtitle>
        <CTAButton
          onClick={() => window.location.href = '/app'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Get Started Free
          <FiArrowRight />
        </CTAButton>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection; 
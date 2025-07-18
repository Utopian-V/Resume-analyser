import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import HeroSection from './HeroSection';
import ReviewsSection from '../ReviewsSection';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(120deg, #0f172a 0%, #1e293b 100%);
  color: white;
`;

const StickyHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 4vw 1.2rem 4vw;
`;

const HeaderLinks = styled.div`
  display: flex;
  gap: 2.2rem;
  align-items: center;
`;

const HeaderLink = styled.a`
  color: #e2e8f0;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.2s;
  &:hover {
    color: #6366f1;
  }
`;

const HeaderButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  border-radius: 0.8rem;
  padding: 0.7rem 1.7rem;
  margin-left: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>Prep Nexus - AI Resume Review, DSA Prep, Interview Practice</title>
        <meta name="description" content="Master your career with AI-powered resume analysis, DSA practice, and interview preparation. Join thousands of successful professionals." />
        <meta name="keywords" content="resume review, interview prep, DSA practice, career development, AI analysis" />
        <meta property="og:title" content="Prep Nexus - AI Career Preparation Platform" />
        <meta property="og:description" content="Master your career with AI-powered resume analysis, DSA practice, and interview preparation." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prep-nexus.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prep Nexus - AI Career Preparation Platform" />
        <meta name="twitter:description" content="Master your career with AI-powered resume analysis, DSA practice, and interview preparation." />
      </Helmet>
      
      <PageWrapper>
        <StickyHeader>
          <HeaderLinks>
            <HeaderLink href="/#features">Features</HeaderLink>
            <HeaderLink href="/#pricing">Pricing</HeaderLink>
            <HeaderLink href="/#blog">Blog</HeaderLink>
          </HeaderLinks>
          <HeaderButton onClick={() => window.location.href = '/app'}>
            Get Started
          </HeaderButton>
        </StickyHeader>
        
        <MainContent>
          <HeroSection />
          <ReviewsSection />
        </MainContent>
      </PageWrapper>
    </>
  );
};

export default LandingPage; 
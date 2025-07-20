import React, { useRef } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import HeroSection from './HeroSection.js';
import ReviewsSection from '../ui/ReviewsSection.js';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

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
  cursor: pointer;
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

const Section = styled.section`
  max-width: 1100px;
  margin: 4rem auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.h2`
  color: #e2e8f0;
  font-size: 2.2rem;
  font-weight: 900;
  margin-bottom: 2rem;
  text-align: center;
`;

const SectionText = styled.p`
  color: #cbd5e1;
  font-size: 1.15rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const PricingGrid = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PricingCard = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1.5px solid rgba(99,102,241,0.15);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem;
  min-width: 260px;
  max-width: 320px;
  box-shadow: 0 4px 24px rgba(99,102,241,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: box-shadow 0.2s, transform 0.2s;
  &:hover {
    box-shadow: 0 8px 32px rgba(99,102,241,0.13);
    transform: translateY(-4px) scale(1.03);
  }
`;

const Price = styled.div`
  font-size: 2.2rem;
  font-weight: 900;
  color: #6366f1;
  margin-bottom: 0.5rem;
`;

const Plan = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 1rem;
`;

const FeaturesList = styled.ul`
  color: #cbd5e1;
  font-size: 1rem;
  margin-bottom: 2rem;
  list-style: none;
  padding: 0;
  text-align: left;
`;

const FeatureItem = styled.li`
  margin-bottom: 0.7rem;
  &:before {
    content: '✔';
    color: #10b981;
    margin-right: 0.7rem;
  }
`;

const Footer = styled.footer`
  background: rgba(15, 23, 42, 0.95);
  border-top: 1px solid rgba(255,255,255,0.07);
  padding: 2.5rem 0 1.5rem 0;
  margin-top: 4rem;
  color: #cbd5e1;
`;

const FooterGrid = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
`;

const FooterCol = styled.div`
  flex: 1 1 200px;
  min-width: 180px;
`;

const FooterTitle = styled.div`
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  color: #cbd5e1;
  text-decoration: none;
  display: block;
  margin-bottom: 0.7rem;
  font-size: 1rem;
  transition: color 0.2s;
  &:hover {
    color: #6366f1;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-top: 1rem;
`;

const Copyright = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 0.95rem;
  margin-top: 2rem;
`;

const scrollToSection = (ref) => {
  if (ref && ref.current) {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }
};

const LandingPage = () => {
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);
  const aboutRef = useRef(null);

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
            <HeaderLink onClick={() => scrollToSection(featuresRef)}>Features</HeaderLink>
            <HeaderLink onClick={() => scrollToSection(pricingRef)}>Pricing</HeaderLink>
            <HeaderLink href="/app/blog">Blog</HeaderLink>
            <HeaderLink onClick={() => scrollToSection(aboutRef)}>About</HeaderLink>
          </HeaderLinks>
          <HeaderButton onClick={() => window.location.href = '/app'}>
            Get Started
          </HeaderButton>
        </StickyHeader>
        <MainContent>
          <HeroSection />
          <Section ref={featuresRef} id="features">
            <SectionTitle>Features</SectionTitle>
            <SectionText>
              <b>Prep Nexus</b> offers AI-powered resume analysis, DSA practice, interview prep, aptitude tests, and a curated job board—all in one modern platform.
            </SectionText>
            <FeaturesList>
              <FeatureItem>AI Resume Review & Optimization</FeatureItem>
              <FeatureItem>DSA Practice Bank with Progress Tracking</FeatureItem>
              <FeatureItem>Mock Interview Practice with AI</FeatureItem>
              <FeatureItem>Aptitude Test Manager</FeatureItem>
              <FeatureItem>Curated Job Listings from Top Companies</FeatureItem>
              <FeatureItem>Blog, Resources, and Career Advice</FeatureItem>
            </FeaturesList>
          </Section>
          <Section ref={pricingRef} id="pricing">
            <SectionTitle>Pricing</SectionTitle>
            <PricingGrid>
              <PricingCard>
                <Plan>Starter</Plan>
                <Price>Free</Price>
                <FeaturesList>
                  <FeatureItem>Basic Resume Analysis</FeatureItem>
                  <FeatureItem>Limited DSA Practice</FeatureItem>
                  <FeatureItem>Access to Blog</FeatureItem>
                </FeaturesList>
              </PricingCard>
              <PricingCard style={{ border: '2.5px solid #6366f1', boxShadow: '0 8px 32px #6366f133' }}>
                <Plan>Pro <span style={{ color: '#6366f1', fontWeight: 700 }}>(Most Popular)</span></Plan>
                <Price>$9/mo</Price>
                <FeaturesList>
                  <FeatureItem>Full Resume Analysis & Suggestions</FeatureItem>
                  <FeatureItem>Unlimited DSA & Aptitude Practice</FeatureItem>
                  <FeatureItem>Mock Interviews with AI</FeatureItem>
                  <FeatureItem>Job Board & Analytics</FeatureItem>
                  <FeatureItem>Priority Support</FeatureItem>
                </FeaturesList>
              </PricingCard>
              <PricingCard>
                <Plan>Enterprise</Plan>
                <Price>Contact</Price>
                <FeaturesList>
                  <FeatureItem>Team Analytics & Reporting</FeatureItem>
                  <FeatureItem>Custom Integrations</FeatureItem>
                  <FeatureItem>Dedicated Account Manager</FeatureItem>
                </FeaturesList>
              </PricingCard>
            </PricingGrid>
          </Section>
          <ReviewsSection />
          <Section ref={aboutRef} id="about">
            <SectionTitle>About Prep Nexus</SectionTitle>
            <SectionText>
              Prep Nexus is built by engineers and career coaches passionate about helping you land your dream job. Our mission is to make world-class career prep accessible to everyone, everywhere.
            </SectionText>
          </Section>
        </MainContent>
        <Footer>
          <FooterGrid>
            <FooterCol>
              <FooterTitle>Prep Nexus</FooterTitle>
              <div>AI-powered career prep for the modern job seeker.</div>
              <SocialLinks>
                <FooterLink href="https://github.com/Utopian-V/Resume-analyser" target="_blank" rel="noopener noreferrer"><FiGithub size={22} /></FooterLink>
                <FooterLink href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><FiTwitter size={22} /></FooterLink>
                <FooterLink href="https://linkedin.com/" target="_blank" rel="noopener noreferrer"><FiLinkedin size={22} /></FooterLink>
              </SocialLinks>
            </FooterCol>
            <FooterCol>
              <FooterTitle>Product</FooterTitle>
              <FooterLink onClick={() => scrollToSection(featuresRef)}>Features</FooterLink>
              <FooterLink onClick={() => scrollToSection(pricingRef)}>Pricing</FooterLink>
              <FooterLink href="/app/blog">Blog</FooterLink>
            </FooterCol>
            <FooterCol>
              <FooterTitle>Company</FooterTitle>
              <FooterLink onClick={() => scrollToSection(aboutRef)}>About</FooterLink>
              <FooterLink href="mailto:hello@prepnexus.com">Contact</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </FooterCol>
          </FooterGrid>
          <Copyright>
            &copy; {new Date().getFullYear()} Prep Nexus. All rights reserved.
          </Copyright>
        </Footer>
      </PageWrapper>
    </>
  );
};

export default LandingPage; 
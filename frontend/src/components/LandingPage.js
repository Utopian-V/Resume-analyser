import React from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const gradientAnim = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnim = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #181c2f 0%, #232946 100%);
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: -2;
  overflow: hidden;
`;

const AnimatedGradient = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: -1;
  background: linear-gradient(135deg, #6366f1 0%, #a21caf 100%, #232946 100%);
  opacity: 0.18;
  filter: blur(80px);
  background-size: 200% 200%;
  animation: ${gradientAnim} 12s ease-in-out infinite;
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 4vw 1.5rem 4vw;
  background: rgba(24,28,47,0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1.5px solid #232946;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  font-family: 'Poppins', 'Inter', sans-serif;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2.5rem;
`;

const NavLink = styled.a`
  color: #c7d2fe;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
`;

const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding-top: 5vh;
  text-align: center;
`;

const Headline = styled(motion.h1)`
  font-size: 3.2rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 1.2rem;
  letter-spacing: 1.5px;
  line-height: 1.1;
  text-shadow: 0 4px 32px #23294699;
  @media (max-width: 600px) {
    font-size: 2.1rem;
  }
`;

const Subheadline = styled(motion.p)`
  font-size: 1.45rem;
  color: #c7d2fe;
  font-weight: 500;
  margin-bottom: 2.5rem;
  max-width: 600px;
  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

const CTAButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: linear-gradient(90deg, #6366f1 60%, #a21caf 100%);
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  border: none;
  border-radius: 1.2rem;
  padding: 1.1rem 2.5rem;
  box-shadow: 0 4px 32px #23294644;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: linear-gradient(90deg, #a21caf 0%, #6366f1 100%);
    transform: translateY(-2px) scale(1.04);
  }
`;

const FloatingText = styled(motion.div)`
  position: absolute;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  opacity: 0.18;
  pointer-events: none;
  user-select: none;
  animation: ${floatAnim} 6s ease-in-out infinite;
`;

const Section = styled.section`
  margin: 0 auto;
  max-width: 1100px;
  padding: 4rem 2vw 2rem 2vw;
  color: #e0e7ff;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2.5rem;
  margin-top: 2.5rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(36, 40, 62, 0.85);
  border-radius: 1.2rem;
  padding: 2.2rem 1.5rem 1.5rem 1.5rem;
  box-shadow: 0 2px 16px #23294633;
  border: 1.5px solid #232946;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.1rem;
`;

const FeatureTitle = styled.h3`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
`;

const FeatureDesc = styled.p`
  color: #c7d2fe;
  font-size: 1rem;
  margin: 0;
`;

const Footer = styled.footer`
  text-align: center;
  color: #c7d2fe;
  font-size: 1rem;
  padding: 2rem 0 1rem 0;
  opacity: 0.7;
`;

const floatingTexts = [
  { text: "AI-powered", top: "12%", left: "8%", delay: 0 },
  { text: "Career Growth", top: "22%", right: "10%", delay: 0.5 },
  { text: "ATS Optimized", top: "38%", left: "18%", delay: 1 },
  { text: "Instant Feedback", top: "60%", right: "12%", delay: 1.5 },
  { text: "DSA Practice", top: "75%", left: "10%", delay: 2 },
  { text: "Job Listings", top: "80%", right: "8%", delay: 2.5 },
];

const features = [
  {
    title: "Instant Resume Analysis",
    desc: "Upload your resume and get actionable, AI-powered feedback in seconds."
  },
  {
    title: "DSA & Interview Prep",
    desc: "Practice curated DSA questions and ace your interviews with confidence."
  },
  {
    title: "Personalized Job Matches",
    desc: "Discover jobs tailored to your skills and interests from top startups."
  },
  {
    title: "Beautiful, Modern UI",
    desc: "Enjoy a seamless, mobile-friendly experience with stunning visuals."
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <Background>
      <AnimatedGradient />
      <NavBar>
        <Logo>ResumeAI</Logo>
        <NavLinks>
          <NavLink href="#">Home</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </NavLinks>
      </NavBar>
      <Hero>
        <Headline
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Supercharge Your Career with <span style={{ color: "#6366f1" }}>AI</span>
        </Headline>
        <Subheadline
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Get instant, actionable feedback on your resume, practice DSA, and discover top jobs—all in one beautiful, modern platform.
        </Subheadline>
        <CTAButton
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/app")}
        >
          Let's Get Started <FiArrowRight size={22} />
        </CTAButton>
      </Hero>
      {floatingTexts.map((ft, i) => (
        <FloatingText
          key={i}
          style={{ top: ft.top, left: ft.left, right: ft.right }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.18, y: 0 }}
          transition={{ duration: 1, delay: ft.delay }}
        >
          {ft.text}
        </FloatingText>
      ))}
      <Section id="features">
        <motion.h2
          style={{ color: "#fff", fontSize: "2.1rem", fontWeight: 800, marginBottom: 24, textAlign: "center" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Why Choose ResumeAI?
        </motion.h2>
        <FeaturesGrid>
          {features.map((f, i) => (
            <FeatureCard
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
            >
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureDesc>{f.desc}</FeatureDesc>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>
      <Footer>
        &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
      </Footer>
    </Background>
  );
} 
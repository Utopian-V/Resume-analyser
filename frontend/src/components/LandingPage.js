import React from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiMail, FiUser, FiDollarSign } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Animated background blocks
const moveBlock = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 0.7; }
  50% { transform: translateY(-40px) scale(1.1); opacity: 1; }
  100% { transform: translateY(0) scale(1); opacity: 0.7; }
`;

const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #0a0c16 0%, #181c2f 100%);
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: -1;
  overflow-x: hidden;
`;

const AnimatedBlock = styled(motion.div)`
  position: absolute;
  border-radius: 1.5rem;
  opacity: 0.18;
  filter: blur(2px);
  pointer-events: none;
  z-index: 0;
  animation: ${moveBlock} 8s ease-in-out infinite;
`;

const GlassNavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5vw 1.2rem 5vw;
  background: rgba(24,28,47,0.7);
  backdrop-filter: blur(16px);
  border-bottom: 1.5px solid #232946;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 32px #000a;
  pointer-events: auto;
`;

const Logo = styled.div`
  font-size: 2.2rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  font-family: 'Poppins', 'Inter', sans-serif;
  cursor: pointer;
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
  transition: color 0.2s, border-bottom 0.2s;
  cursor: pointer;
  user-select: none;
  position: relative;
  z-index: 2;
  border-bottom: 2px solid transparent;
  padding-bottom: 2px;
  &:hover, &.active {
    color: #fff;
    border-bottom: 2px solid #6366f1;
  }
`;

const Section = styled.section`
  margin: 0 auto;
  max-width: 1100px;
  padding: 5rem 2vw 2rem 2vw;
  color: #e0e7ff;
  pointer-events: auto;
  z-index: 1;
`;

const Hero = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding-top: 7vh;
  pointer-events: auto;
  z-index: 1;
`;

const Headline = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 1.2rem;
  letter-spacing: 1.5px;
  line-height: 1.1;
  text-shadow: 0 4px 32px #23294699;
  @media (max-width: 600px) {
    font-size: 2.2rem;
  }
`;

const Subheadline = styled(motion.p)`
  font-size: 1.35rem;
  color: #e0e7ff;
  font-weight: 400;
  margin-bottom: 2.8rem;
  max-width: 600px;
  background: rgba(36, 40, 62, 0.45);
  border-radius: 1.2rem;
  padding: 1.2rem 2rem;
  box-shadow: 0 2px 16px #23294633;
  backdrop-filter: blur(8px);
  border: 1.5px solid #232946;
  letter-spacing: 0.01em;
  line-height: 1.6;
  @media (max-width: 600px) {
    font-size: 1.05rem;
    padding: 1rem 1rem;
  }
`;

const CTAButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  background: rgba(36, 40, 62, 0.25);
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  border: 1.5px solid #6366f1;
  border-radius: 1.2rem;
  padding: 1.1rem 2.5rem;
  box-shadow: 0 4px 32px #23294644;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, border 0.2s, color 0.2s;
  backdrop-filter: blur(8px);
  outline: none;
  z-index: 2;
  &:hover, &:focus {
    background: rgba(99,102,241,0.18);
    color: #a21caf;
    border: 1.5px solid #a21caf;
    transform: translateY(-2px) scale(1.05);
  }
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

const AboutSection = styled(Section)`
  background: rgba(24,28,47,0.7);
  border-radius: 1.5rem;
  margin-top: 3rem;
  box-shadow: 0 2px 24px #23294633;
  pointer-events: auto;
  z-index: 1;
`;

const PricingSection = styled(Section)`
  background: rgba(24,28,47,0.7);
  border-radius: 1.5rem;
  margin-top: 3rem;
  box-shadow: 0 2px 24px #23294633;
  pointer-events: auto;
  z-index: 1;
`;

const ContactSection = styled(Section)`
  background: rgba(24,28,47,0.7);
  border-radius: 1.5rem;
  margin-top: 3rem;
  box-shadow: 0 2px 24px #23294633;
  pointer-events: auto;
  z-index: 1;
`;

const Footer = styled.footer`
  text-align: center;
  color: #c7d2fe;
  font-size: 1rem;
  padding: 2rem 0 1rem 0;
  opacity: 0.7;
`;

const blocks = [
  { top: "10%", left: "5%", width: 120, height: 120, color: "#6366f1", delay: 0 },
  { top: "30%", right: "8%", width: 90, height: 90, color: "#a21caf", delay: 0.5 },
  { top: "60%", left: "12%", width: 70, height: 70, color: "#232946", delay: 1 },
  { top: "80%", right: "10%", width: 110, height: 110, color: "#6366f1", delay: 1.5 },
  { top: "50%", left: "40%", width: 60, height: 60, color: "#a21caf", delay: 2 },
];

const features = [
  {
    icon: <FiCheckCircle size={28} color="#6366f1" />, title: "Instant Resume Analysis",
    desc: "Upload your resume and get actionable, AI-powered feedback in seconds."
  },
  {
    icon: <FiCheckCircle size={28} color="#a21caf" />, title: "DSA & Interview Prep",
    desc: "Practice curated DSA questions and ace your interviews with confidence."
  },
  {
    icon: <FiCheckCircle size={28} color="#fff" />, title: "Personalized Job Matches",
    desc: "Discover jobs tailored to your skills and interests from top startups."
  },
  {
    icon: <FiCheckCircle size={28} color="#6366f1" />, title: "Beautiful, Modern UI",
    desc: "Enjoy a seamless, mobile-friendly experience with stunning visuals."
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  // Scroll to section
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Background />
      {/* Animated floating blocks */}
      {blocks.map((b, i) => (
        <AnimatedBlock
          key={i}
          style={{ top: b.top, left: b.left, right: b.right, width: b.width, height: b.height, background: b.color }}
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: b.delay, ease: "easeInOut" }}
        />
      ))}
      <GlassNavBar>
        <Logo onClick={() => scrollTo("hero")}>Prep Nexus</Logo>
        <NavLinks>
          <NavLink onClick={() => scrollTo("hero")}>Home</NavLink>
          <NavLink onClick={() => scrollTo("pricing")}>Pricing</NavLink>
          <NavLink onClick={() => scrollTo("about")}>About</NavLink>
          <NavLink onClick={() => scrollTo("contact")}>Contact</NavLink>
        </NavLinks>
      </GlassNavBar>
      <Hero id="hero">
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
          <span style={{ fontWeight: 600, color: '#6366f1', fontSize: '1.1em' }}>AI-powered career growth,</span> resume feedback, DSA prep, and curated jobs—all in one beautiful, modern platform.
        </Subheadline>
        <CTAButton
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/app")}
          tabIndex={0}
          aria-label="Let's Get Started"
        >
          Let's Get Started <FiArrowRight size={22} />
        </CTAButton>
      </Hero>
      <Section id="features">
        <motion.h2
          style={{ color: "#fff", fontSize: "2.1rem", fontWeight: 800, marginBottom: 24, textAlign: "center" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Why Choose Prep Nexus?
        </motion.h2>
        <FeaturesGrid>
          {features.map((f, i) => (
            <FeatureCard
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
            >
              {f.icon}
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureDesc>{f.desc}</FeatureDesc>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>
      <PricingSection id="pricing">
        <motion.h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, marginBottom: 18 }}>Pricing</motion.h2>
        <FeatureDesc>All core features are <b>free</b> for early users. Premium features coming soon!</FeatureDesc>
      </PricingSection>
      <AboutSection id="about">
        <motion.h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, marginBottom: 18 }}>About</motion.h2>
        <FeatureDesc>
          Prep Nexus is built to help you land your dream job with AI-powered resume analysis, DSA prep, and curated job listings. Our mission is to make career growth accessible, actionable, and beautiful.
        </FeatureDesc>
      </AboutSection>
      <ContactSection id="contact">
        <motion.h2 style={{ color: "#fff", fontSize: "2rem", fontWeight: 800, marginBottom: 18 }}>Contact</motion.h2>
        <FeatureDesc>
          Have questions or feedback? Email us at <a href="mailto:hello@resumeai.com" style={{ color: "#6366f1", textDecoration: "underline" }}>hello@resumeai.com</a>
        </FeatureDesc>
      </ContactSection>
      <Footer>
        &copy; {new Date().getFullYear()} Prep Nexus. All rights reserved.
      </Footer>
    </>
  );
} 
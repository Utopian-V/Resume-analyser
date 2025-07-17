import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiUser, FiZap, FiBookOpen, FiChevronDown, FiChevronUp, FiBriefcase, FiLayers, FiGlobe, FiTrendingUp } from "react-icons/fi";
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaGithub } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { blogs } from "./Blog";
import { Helmet } from "react-helmet-async";
import Logo from "./Logo";
import ReviewsSection from "./ReviewsSection";

// --- Styled Components ---

const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

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

const HeaderLink = styled(Link)`
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

const HeroSection = styled.section`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  background: linear-gradient(120deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  background-size: 200% 200%;
  animation: ${gradientMove} 12s ease-in-out infinite;
  color: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border-radius: 0 0 2.5rem 2.5rem;
  overflow: hidden;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.8rem;
  font-weight: 900;
  letter-spacing: 1.5px;
  margin-bottom: 1.2rem;
  line-height: 1.1;
  text-shadow: 0 4px 32px #23294699;
  @media (max-width: 600px) {
    font-size: 2.2rem;
  }
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

const TrustedBySection = styled.section`
  max-width: 1200px;
  margin: 2.5rem auto 0 auto;
  padding: 0 2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TrustedByTitle = styled.div`
  color: #6366f1;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
  letter-spacing: 1px;
`;

const LogoBar = styled.div`
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
`;

const CompanyLogo = styled.div`
  height: 36px;
  width: auto;
  color: #e2e8f0;
  font-weight: 700;
  font-size: 1.1rem;
  opacity: 0.8;
`;

const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2vw 2rem 2vw;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2.5rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1rem;
  min-height: 220px;
  
  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(99, 102, 241, 0.5);
  }
`;

const FeatureTitle = styled.h3`
  color: #e2e8f0;
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0;
`;

const FeatureDesc = styled.p`
  color: #cbd5e1;
  font-size: 1.05rem;
  margin: 0;
`;

const StepsSection = styled.section`
  max-width: 1100px;
  margin: 3rem auto 0 auto;
  padding: 0 2vw;
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: center;
`;

const StepCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.2rem;
  padding: 2rem 2rem 1.5rem 2rem;
  min-width: 260px;
  max-width: 320px;
  flex: 1 1 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(99, 102, 241, 0.5);
  }
`;

const StepIcon = styled.div`
  font-size: 2.5rem;
  color: #6366f1;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h4`
  color: #e2e8f0;
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
`;

const StepDesc = styled.p`
  color: #cbd5e1;
  font-size: 1rem;
  margin: 0;
`;

const BlogPreviewSection = styled.section`
  max-width: 1200px;
  margin: 3rem auto 0 auto;
  padding: 0 2vw;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
`;

const BlogCard = styled(motion.article)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.2rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 340px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(99, 102, 241, 0.5);
  }
`;

const BlogImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 0.8rem;
  margin-bottom: 1rem;
`;

const BlogTitle = styled.h3`
  color: #e2e8f0;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const BlogMeta = styled.div`
  color: #6366f1;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BlogSummary = styled.p`
  color: #cbd5e1;
  font-size: 1.05rem;
  margin-bottom: 1rem;
  min-height: 60px;
`;

const BlogReadMore = styled(Link)`
  background: #6366f1;
  color: #fff;
  padding: 0.5rem 1.2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  align-self: flex-end;
  transition: background 0.2s;
  &:hover {
    background: #3730a3;
  }
`;

const PricingSection = styled.section`
  max-width: 1200px;
  margin: 4rem auto 0 auto;
  padding: 0 2vw;
`;

const PricingGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PricingCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  min-height: 380px;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 320px;
  
  ${props => props.highlight && `
    transform: scale(1.05);
    border: 3px solid #6366f1;
    box-shadow: 0 8px 40px rgba(99, 102, 241, 0.3);
    background: rgba(255, 255, 255, 0.1);
  `}
  
  &:hover {
    transform: ${props => props.highlight ? 'scale(1.08)' : 'scale(1.02)'};
    background: rgba(255, 255, 255, 0.1);
    border-color: #6366f1;
  }
`;

const PricingBadge = styled.div`
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 1rem;
  padding: 0.5rem 1.5rem;
  box-shadow: 0 4px 16px #6366f133;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { transform: translateX(-50%) scale(1); }
    50% { transform: translateX(-50%) scale(1.05); }
  }
`;

const Price = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #e2e8f0;
  margin: 1.2rem 0 0.7rem 0;
`;

const PricePeriod = styled.span`
  font-size: 1.1rem;
  color: #6366f1;
  font-weight: 600;
`;

const PricingFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.2rem 0 1.5rem 0;
  color: #cbd5e1;
  font-size: 1.05rem;
  text-align: left;
  width: 100%;
`;

const PricingFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.7rem;
`;

const PricingCTA = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  border-radius: 0.8rem;
  padding: 0.8rem 2rem;
  margin-top: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }
`;

const FAQSection = styled.section`
  max-width: 900px;
  margin: 4rem auto 0 auto;
  padding: 0 2vw 4rem 2vw;
`;

const FAQTitle = styled.h2`
  color: #3730a3;
  font-weight: 900;
  font-size: 2.2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FAQCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.2rem;
  padding: 1.5rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(99, 102, 241, 0.5);
  }
`;

const FAQQuestion = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: #e2e8f0;
`;

const FAQAnswer = styled(motion.div)`
  color: #cbd5e1;
  font-size: 1.05rem;
  margin-top: 1rem;
  line-height: 1.6;
`;

const Footer = styled.footer`
  background: rgba(24,28,47,0.95);
  color: #c7d2fe;
  padding: 2.5rem 0 1.5rem 0;
  margin-top: auto;
  width: 100%;
  box-shadow: 0 -2px 24px #23294633;
`;

const FooterContent = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 12px;
  justify-content: center;
`;

// --- Data ---

const companyLogos = [
  "Google",
  "Microsoft", 
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Uber",
  "Stripe",
  "Airbnb",
  "Spotify",
  "Twitter",
  "LinkedIn"
];

const features = [
  {
    icon: <FiCheckCircle size={32} color="#6366f1" />, title: "Instant Resume Analysis",
    desc: "Upload your resume and get actionable, AI-powered feedback in seconds."
  },
  {
    icon: <FiZap size={32} color="#a21caf" />, title: "DSA & Interview Prep",
    desc: "Practice curated DSA questions and ace your interviews with confidence."
  },
  {
    icon: <FiUser size={32} color="#3730a3" />, title: "Personalized Job Matches",
    desc: "Discover jobs tailored to your skills and interests from top startups."
  },
  {
    icon: <FiBookOpen size={32} color="#6366f1" />, title: "Modern, Beautiful UI",
    desc: "Enjoy a seamless, mobile-friendly experience with stunning visuals."
  },
];

const steps = [
  {
    icon: <FiBriefcase size={36} color="#6366f1" />, title: "Upload Resume",
    desc: "Get instant, AI-powered feedback and actionable suggestions."
  },
  {
    icon: <FiLayers size={36} color="#a21caf" />, title: "Practice DSA & Interviews",
    desc: "Sharpen your skills with curated questions and mock interviews."
  },
  {
    icon: <FiGlobe size={36} color="#3730a3" />, title: "Explore Jobs",
    desc: "Browse curated job listings from top companies."
  },
  {
    icon: <FiTrendingUp size={36} color="#6366f1" />, title: "Track Progress",
    desc: "Visualize your growth and stay motivated on your journey."
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: 0,
    period: "/mo",
    features: [
      "Unlimited resume uploads",
      "Basic AI feedback",
      "Access to job board",
      "Community support"
    ],
    cta: "Get Started",
    highlight: false
  },
  {
    name: "Pro",
    price: 9,
    period: "/mo",
    features: [
      "Everything in Starter",
      "Advanced AI feedback",
      "DSA & Interview analytics",
      "Priority support",
      "Personalized job matches"
    ],
    cta: "Start Free Trial",
    highlight: true
  },
  {
    name: "Enterprise",
    price: 29,
    period: "/mo",
    features: [
      "Everything in Pro",
      "Team dashboard",
      "Custom integrations",
      "Dedicated account manager"
    ],
    cta: "Contact Sales",
    highlight: false
  }
];

const faqs = [
  {
    q: "What is Prep Nexus?",
    a: "Prep Nexus is an AI-powered platform for resume review, DSA prep, and curated job opportunities."
  },
  {
    q: "Is Prep Nexus free to use?",
    a: "All core features are free for early users. Premium features are coming soon."
  },
  {
    q: "How do I get resume feedback?",
    a: "Upload your resume and get instant, actionable feedback powered by AI."
  },
  {
    q: "How do I contact support?",
    a: "Email us at hello@resumeai.com."
  },
  {
    q: "Can I suggest new features?",
    a: "Absolutely! We welcome feedback and suggestions via email or social media."
  },
];

const socialData = [
  { label: "Twitter", url: "https://twitter.com/", icon: <FaTwitter size={22} />, color: "#1da1f2" },
  { label: "LinkedIn", url: "https://linkedin.com/", icon: <FaLinkedin size={22} />, color: "#0077b5" },
  { label: "Facebook", url: "https://facebook.com/", icon: <FaFacebook size={22} />, color: "#1877f3" },
  { label: "Instagram", url: "https://instagram.com/", icon: <FaInstagram size={22} />, color: "#e1306c" },
  { label: "GitHub", url: "https://github.com/", icon: <FaGithub size={22} />, color: "#fff" },
];

// --- Main Component ---

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <PageWrapper>
      <Helmet>
        <title>Prep Nexus – AI Resume Review, DSA Prep, and Job Opportunities</title>
        <meta name="description" content="AI-powered resume review, DSA prep, and job opportunities. Boost your career with actionable feedback and curated job listings." />
        <meta property="og:title" content="Prep Nexus – AI Resume Review, DSA Prep, and Job Opportunities" />
        <meta property="og:description" content="AI-powered resume review, DSA prep, and job opportunities. Boost your career with actionable feedback and curated job listings." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prepnexus.netlify.app/" />
        <meta property="og:image" content="https://prepnexus.netlify.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prep Nexus – AI Resume Review, DSA Prep, and Job Opportunities" />
        <meta name="twitter:description" content="AI-powered resume review, DSA prep, and job opportunities. Boost your career with actionable feedback and curated job listings." />
        <meta name="twitter:image" content="https://prepnexus.netlify.app/og-image.png" />
        <link rel="canonical" href="https://prepnexus.netlify.app/" />
      </Helmet>
      <StickyHeader>
        <Logo onClick={() => navigate("/")} />
        <HeaderLinks>
          <HeaderLink to="#features">Features</HeaderLink>
          <HeaderLink to="#pricing">Pricing</HeaderLink>
          <HeaderLink to="#blog">Blog</HeaderLink>
          <HeaderButton onClick={() => navigate("/app")}>Dashboard</HeaderButton>
        </HeaderLinks>
      </StickyHeader>
      <MainContent>
        <HeroSection>
          <HeroTitle
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Supercharge Your Career with <span style={{ color: "#fff", background: "#6366f1", borderRadius: 8, padding: "0 10px" }}>AI</span>
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span style={{ fontWeight: 600, color: '#fff', fontSize: '1.1em' }}>AI-powered career growth,</span> resume feedback, DSA prep, and curated jobs—all in one beautiful, modern platform.
          </HeroSubtitle>
          <CTAButton
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/app")}
            tabIndex={0}
            aria-label="Let's Get Started"
          >
            Let's Get Started <FiArrowRight size={22} />
          </CTAButton>
        </HeroSection>
        <TrustedBySection>
          <TrustedByTitle>Trusted by students and professionals from</TrustedByTitle>
          <LogoBar>
            {companyLogos.map((logo, i) => (
              <CompanyLogo key={i}>{logo}</CompanyLogo>
            ))}
          </LogoBar>
        </TrustedBySection>
        <FeaturesSection id="features">
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
        </FeaturesSection>
        <ReviewsSection />
        <StepsSection>
          {steps.map((step, i) => (
            <StepCard key={i}>
              <StepIcon>{step.icon}</StepIcon>
              <StepTitle>{step.title}</StepTitle>
              <StepDesc>{step.desc}</StepDesc>
            </StepCard>
          ))}
        </StepsSection>
        <BlogPreviewSection id="blog">
          <h2 style={{ color: '#e2e8f0', fontWeight: 900, fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Latest from the Prep Nexus Blog</h2>
          <BlogGrid>
            {(blogs && blogs.length > 0) ? blogs.slice(0, 3).map(blog => (
              <BlogCard
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <BlogImage src={blog.image} alt={blog.title} loading="lazy" />
                <BlogTitle>{blog.title}</BlogTitle>
                <BlogMeta>
                  <span>{blog.author.name}</span>
                  <span>{new Date(blog.date).toLocaleDateString()}</span>
                </BlogMeta>
                <BlogSummary>{blog.summary}</BlogSummary>
                <BlogReadMore to={`/blog/${blog.id}`}>Read More</BlogReadMore>
              </BlogCard>
            )) : <div style={{ color: '#6366f1', textAlign: 'center', gridColumn: '1/-1' }}>No blog posts yet. Check back soon!</div>}
          </BlogGrid>
        </BlogPreviewSection>
        <PricingSection id="pricing">
          <h2 style={{ color: '#e2e8f0', fontWeight: 900, fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Pricing</h2>
                  <PricingGrid>
          {pricingPlans.map((plan, i) => (
            <PricingCard key={i} highlight={plan.highlight}>
              {plan.highlight && <PricingBadge>Most Popular</PricingBadge>}
                <div style={{ fontWeight: 800, fontSize: 1.3 + 'rem', color: '#e2e8f0', marginBottom: 8 }}>{plan.name}</div>
                <Price>${plan.price}<PricePeriod>{plan.period}</PricePeriod></Price>
                <PricingFeatures>
                  {plan.features.map((f, idx) => (
                    <PricingFeature key={idx}><FiCheckCircle color="#6366f1" /> {f}</PricingFeature>
                  ))}
                </PricingFeatures>
                <PricingCTA>{plan.cta}</PricingCTA>
              </PricingCard>
            ))}
          </PricingGrid>
        </PricingSection>
        <FAQSection>
          <FAQTitle>Frequently Asked Questions</FAQTitle>
          <FAQList>
            {faqs.map((faq, idx) => (
              <FAQCard
                key={idx}
                layout
                initial={{ borderRadius: 20 }}
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                aria-expanded={openFAQ === idx}
                tabIndex={0}
              >
                <FAQQuestion>
                  {openFAQ === idx ? <FiChevronUp color="#6366f1" /> : <FiChevronDown color="#6366f1" />}
                  {faq.q}
                </FAQQuestion>
                <AnimatePresence>
                  {openFAQ === idx && (
                    <FAQAnswer
                      key="answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.a}
                    </FAQAnswer>
                  )}
                </AnimatePresence>
              </FAQCard>
            ))}
          </FAQList>
        </FAQSection>
      </MainContent>
      <Footer>
        <FooterContent>
          <div style={{ fontWeight: 900, fontSize: 24, color: '#fff', marginBottom: 8 }}>Prep Nexus</div>
          <div style={{ fontSize: 15, color: '#a5b4fc', marginBottom: 12, textAlign: 'center' }}>AI-powered career growth, resume feedback, DSA prep, and curated jobs.</div>
          <SocialLinks>
            {socialData.map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} style={{ color: s.color }}>
                {s.icon}
              </a>
            ))}
          </SocialLinks>
        </FooterContent>
        <div style={{ textAlign: 'center', color: '#a5b4fc', fontSize: 14, marginTop: 32, opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} Prep Nexus. All rights reserved.
        </div>
      </Footer>
    </PageWrapper>
  );
} 
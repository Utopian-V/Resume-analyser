import React from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiMail, FiUser, FiDollarSign } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { blogs } from './Blog';
import { Link } from 'react-router-dom';
import { Footer } from './LandingPage';
import { Helmet } from 'react-helmet-async';

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
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://prepnexus.netlify.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://prepnexus.netlify.app/blog" }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is Prep Nexus?",
              "acceptedAnswer": { "@type": "Answer", "text": "Prep Nexus is an AI-powered platform for resume review, DSA prep, and curated job opportunities." }
            },
            {
              "@type": "Question",
              "name": "Is Prep Nexus free to use?",
              "acceptedAnswer": { "@type": "Answer", "text": "All core features are free for early users. Premium features are coming soon." }
            },
            {
              "@type": "Question",
              "name": "How do I get resume feedback?",
              "acceptedAnswer": { "@type": "Answer", "text": "Upload your resume and get instant, actionable feedback powered by AI." }
            },
            {
              "@type": "Question",
              "name": "How do I contact support?",
              "acceptedAnswer": { "@type": "Answer", "text": "Email us at hello@resumeai.com." }
            },
            {
              "@type": "Question",
              "name": "Can I suggest new features?",
              "acceptedAnswer": { "@type": "Answer", "text": "Absolutely! We welcome feedback and suggestions via email or social media." }
            }
          ]
        })}</script>
      </Helmet>
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
      <Footer />
      <section id="blog-preview" style={{ maxWidth: '1100px', margin: '3rem auto', padding: '0 1rem' }}>
        <h2 style={{ color: '#3730a3', fontWeight: 900, fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Latest from the Prep Nexus Blog</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {(blogs && blogs.length > 0) ? blogs.slice(0, 3).map(blog => (
            <article key={blog.id} style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(99,102,241,0.07)', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <img src={blog.image} alt={blog.title} loading="lazy" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '0.8rem', marginBottom: '1rem' }} />
              <h3 style={{ color: '#3730a3', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{blog.title}</h3>
              <div style={{ color: '#6366f1', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>{blog.author.name}</span>
                <span>{new Date(blog.date).toLocaleDateString()}</span>
              </div>
              <p style={{ color: '#334155', fontSize: '1.05rem', marginBottom: '1rem', minHeight: '60px' }}>{blog.summary}</p>
              <Link to={`/blog/${blog.id}`} style={{ background: '#2563eb', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 500, alignSelf: 'flex-end', transition: 'background 0.2s' }}>Read More</Link>
            </article>
          )) : <div style={{ color: '#6366f1', textAlign: 'center', gridColumn: '1/-1' }}>No blog posts yet. Check back soon!</div>}
        </div>
      </section>
      <section id="faq" style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1rem' }}>
        <h2 style={{ color: '#3730a3', fontWeight: 900, fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Frequently Asked Questions</h2>
        <dl style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(99,102,241,0.07)', padding: '2rem', color: '#334155' }}>
          <dt style={{ fontWeight: 700, marginTop: 18 }}>What is Prep Nexus?</dt>
          <dd style={{ marginLeft: 0, marginBottom: 12 }}>Prep Nexus is an AI-powered platform for resume review, DSA prep, and curated job opportunities.</dd>
          <dt style={{ fontWeight: 700, marginTop: 18 }}>Is Prep Nexus free to use?</dt>
          <dd style={{ marginLeft: 0, marginBottom: 12 }}>All core features are free for early users. Premium features are coming soon.</dd>
          <dt style={{ fontWeight: 700, marginTop: 18 }}>How do I get resume feedback?</dt>
          <dd style={{ marginLeft: 0, marginBottom: 12 }}>Upload your resume and get instant, actionable feedback powered by AI.</dd>
          <dt style={{ fontWeight: 700, marginTop: 18 }}>How do I contact support?</dt>
          <dd style={{ marginLeft: 0, marginBottom: 12 }}>Email us at <a href="mailto:hello@resumeai.com" style={{ color: '#6366f1', textDecoration: 'underline' }}>hello@resumeai.com</a>.</dd>
          <dt style={{ fontWeight: 700, marginTop: 18 }}>Can I suggest new features?</dt>
          <dd style={{ marginLeft: 0, marginBottom: 12 }}>Absolutely! We welcome feedback and suggestions via email or social media.</dd>
        </dl>
      </section>
    </>
  );
}

export const Footer = () => (
  <footer style={{ background: 'rgba(24,28,47,0.9)', color: '#c7d2fe', padding: '2.5rem 0 1.5rem 0', marginTop: 40 }}>
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32 }}>
      <div>
        <div style={{ fontWeight: 900, fontSize: 24, color: '#fff', marginBottom: 8 }}>Prep Nexus</div>
        <div style={{ fontSize: 15, color: '#a5b4fc', marginBottom: 12 }}>AI-powered career growth, resume feedback, DSA prep, and curated jobs.</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <a href="#" aria-label="Twitter" style={{ color: '#1da1f2', fontSize: 22 }}>Twitter</a>
          <a href="#" aria-label="LinkedIn" style={{ color: '#0077b5', fontSize: 22 }}>LinkedIn</a>
          <a href="#" aria-label="Facebook" style={{ color: '#1877f3', fontSize: 22 }}>Facebook</a>
          <a href="#" aria-label="Instagram" style={{ color: '#e1306c', fontSize: 22 }}>Instagram</a>
          <a href="#" aria-label="GitHub" style={{ color: '#fff', fontSize: 22 }}>GitHub</a>
        </div>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }} aria-label="Footer Navigation">
        <a href="#pricing" style={{ color: '#c7d2fe', textDecoration: 'none', fontWeight: 600 }}>Pricing</a>
        <a href="#about" style={{ color: '#c7d2fe', textDecoration: 'none', fontWeight: 600 }}>About</a>
        <a href="#contact" style={{ color: '#c7d2fe', textDecoration: 'none', fontWeight: 600 }}>Contact</a>
      </nav>
      <div style={{ fontSize: 15, color: '#a5b4fc', maxWidth: 320 }}>
        <b>Contact:</b> <a href="mailto:hello@resumeai.com" style={{ color: '#6366f1', textDecoration: 'underline' }}>hello@resumeai.com</a><br/>
        <b>Address:</b> <span>123 Placeholder St, City, Country</span><br/>
        <b>Phone:</b> <span>+1-234-567-8900</span>
      </div>
    </div>
    <div style={{ textAlign: 'center', color: '#a5b4fc', fontSize: 14, marginTop: 32, opacity: 0.7 }}>
      &copy; {new Date().getFullYear()} Prep Nexus. All rights reserved.
    </div>
  </footer>
); 
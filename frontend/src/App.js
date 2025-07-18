import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiUser, FiSettings, FiLogOut, FiMessageSquare } from 'react-icons/fi';

// Components
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import JobListings from './components/JobListings';
import FileUpload from './components/FileUpload';
import AptitudeTest from './components/AptitudeTest';
import AptitudeQuestionManager from './components/AptitudeQuestionManager';
import EnhancedDSABank from './components/EnhancedDSABank';
import InterviewPrep from './components/InterviewPrep';
import Blog from './components/Blog';
import ReviewsSection from './components/ReviewsSection';
import Logo from './components/Logo';

// Global Styles
const GlobalStyle = styled.createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #0f172a;
    color: #e2e8f0;
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1e293b;
  }

  ::-webkit-scrollbar-thumb {
    background: #6366f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #8b5cf6;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: #0f172a;
`;

const Navbar = styled.nav`
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

const MobileMenu = styled(motion.div)`
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

const MainContent = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

const AppContent = styled.div`
  background: #0f172a;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  position: fixed;
  left: 0;
  top: 80px;
  bottom: 0;
  width: 280px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 0;
  overflow-y: auto;
  z-index: 100;
  
  @media (max-width: 768px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const SidebarHeader = styled.div`
  padding: 0 2rem 2rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  color: #e2e8f0;
  font-weight: 700;
  font-size: 1.1rem;
`;

const UserEmail = styled.div`
  color: #64748b;
  font-size: 0.9rem;
`;

const SidebarMenu = styled.div`
  padding: 0 2rem;
`;

const MenuItem = styled.div`
  margin-bottom: 0.5rem;
`;

const MenuLink = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
  }
  
  &.active {
    background: rgba(99, 102, 241, 0.2);
    color: #6366f1;
  }
`;

const ContentArea = styled.div`
  margin-left: 280px;
  padding: 2rem;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const FAQButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
  z-index: 1000;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(99, 102, 241, 0.4);
  }
`;

const FAQModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
`;

const FAQModal = styled.div`
  background: #1e293b;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FAQHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FAQTitle = styled.h3`
  color: #e2e8f0;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
`;

const FAQCloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: #e2e8f0;
  }
`;

const FAQChatContainer = styled.div`
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
`;

const FAQWelcomeMessage = styled.div`
  color: #cbd5e1;
  font-size: 1rem;
  padding: 1rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const FAQMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  ${props => props.isUser && `
    flex-direction: row-reverse;
  `}
`;

const FAQMessageBubble = styled.div`
  background: ${props => props.isUser ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isUser ? 'white' : '#e2e8f0'};
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  max-width: 80%;
  word-wrap: break-word;
`;

const FAQInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FAQInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
  
  &::placeholder {
    color: #64748b;
  }
`;

const FAQSendButton = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-weight: 600;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    background: #8b5cf6;
  }
`;

function App() {
  const [userId, setUserId] = useState('user123');
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqMessages, setFaqMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/app');

  const handleFAQOpen = () => setIsFAQModalOpen(true);
  const handleFAQClose = () => setIsFAQModalOpen(false);

  const handleFAQQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!faqQuestion.trim()) return;

    const userMessage = { type: 'user', content: faqQuestion };
    setFaqMessages(prev => [...prev, userMessage]);
    setFaqQuestion('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great question! Our resume analysis uses advanced AI to identify key skills and suggest improvements. It analyzes your experience, skills, and achievements to provide personalized recommendations.",
        "The aptitude tests cover logical reasoning, numerical ability, and verbal skills. They're designed to help you prepare for various job interviews and assessments.",
        "Our DSA practice includes problems from easy to hard difficulty levels. We recommend starting with easy problems and gradually moving to more challenging ones.",
        "The interview prep feature includes mock interviews with AI, common questions, and personalized feedback to help you improve your interview skills.",
        "You can track your progress in the dashboard, which shows your resume score, completed problems, and overall improvement over time."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setFaqMessages(prev => [...prev, { type: 'bot', content: randomResponse }]);
      setLoading(false);
    }, 1000);
  };

  const menuItems = [
    { path: '/app', label: 'Dashboard', icon: <FiHome /> },
    { path: '/app/jobs', label: 'Job Listings', icon: <FiUser /> },
    { path: '/app/resume', label: 'Resume Analysis', icon: <FiUser /> },
    { path: '/app/aptitude', label: 'Aptitude Tests', icon: <FiUser /> },
    { path: '/app/dsa', label: 'DSA Practice', icon: <FiUser /> },
    { path: '/app/interview', label: 'Interview Prep', icon: <FiUser /> },
    { path: '/app/blog', label: 'Blog', icon: <FiUser /> },
  ];

  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Navbar>
          <NavLogo>
            <Logo />
            Prep Nexus
          </NavLogo>
          
          <NavLinks>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/#features">Features</NavLink>
            <NavLink href="/#pricing">Pricing</NavLink>
            <NavLink href="/#blog">Blog</NavLink>
            <NavLink href="/app">Dashboard</NavLink>
          </NavLinks>
          
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
            <FiMenu />
          </MobileMenuButton>
        </Navbar>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <MobileMenu
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CloseButton onClick={() => setIsMobileMenuOpen(false)}>
                <FiX />
              </CloseButton>
              <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink href="/#features" onClick={() => setIsMobileMenuOpen(false)}>Features</MobileNavLink>
              <MobileNavLink href="/#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</MobileNavLink>
              <MobileNavLink href="/#blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</MobileNavLink>
              <MobileNavLink href="/app" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
            </MobileMenu>
          )}
        </AnimatePresence>

        <Routes>
          <Route path="/" element={
            <AppContent>
              <LandingPage />
            </AppContent>
          } />
          
          <Route path="/app" element={
            <AppContent>
              <Sidebar>
                <SidebarHeader>
                  <UserProfile>
                    <UserAvatar>JD</UserAvatar>
                    <UserInfo>
                      <UserName>John Doe</UserName>
                      <UserEmail>john@example.com</UserEmail>
                    </UserInfo>
                  </UserProfile>
                </SidebarHeader>
                
                <SidebarMenu>
                  {menuItems.map((item, index) => (
                    <MenuItem key={index}>
                      <MenuLink 
                        className={currentPath === item.path ? 'active' : ''}
                        onClick={() => setCurrentPath(item.path)}
                      >
                        {item.icon}
                        {item.label}
                      </MenuLink>
                    </MenuItem>
                  ))}
                </SidebarMenu>
              </Sidebar>
              
              <ContentArea>
                <UserDashboard userId={userId} setUserId={setUserId} />
              </ContentArea>
            </AppContent>
          } />
          
          <Route path="/app/jobs" element={
            <AppContent>
              <Sidebar>
                <SidebarHeader>
                  <UserProfile>
                    <UserAvatar>JD</UserAvatar>
                    <UserInfo>
                      <UserName>John Doe</UserName>
                      <UserEmail>john@example.com</UserEmail>
                    </UserInfo>
                  </UserProfile>
                </SidebarHeader>
                
                <SidebarMenu>
                  {menuItems.map((item, index) => (
                    <MenuItem key={index}>
                      <MenuLink 
                        className={currentPath === item.path ? 'active' : ''}
                        onClick={() => setCurrentPath(item.path)}
                      >
                        {item.icon}
                        {item.label}
                      </MenuLink>
                    </MenuItem>
                  ))}
                </SidebarMenu>
              </Sidebar>
              
              <ContentArea>
                <JobListings />
              </ContentArea>
            </AppContent>
          } />
          
          <Route path="/app/resume" element={
            <AppContent>
              <Sidebar>
                <SidebarHeader>
                  <UserProfile>
                    <UserAvatar>JD</UserAvatar>
                    <UserInfo>
                      <UserName>John Doe</UserName>
                      <UserEmail>john@example.com</UserEmail>
                    </UserInfo>
                  </UserProfile>
                </SidebarHeader>
                
                <SidebarMenu>
                  {menuItems.map((item, index) => (
                    <MenuItem key={index}>
                      <MenuLink 
                        className={currentPath === item.path ? 'active' : ''}
                        onClick={() => setCurrentPath(item.path)}
                      >
                        {item.icon}
                        {item.label}
                      </MenuLink>
                    </MenuItem>
                  ))}
                </SidebarMenu>
              </Sidebar>
              
              <ContentArea>
                <FileUpload />
              </ContentArea>
            </AppContent>
          } />
          
          <Route path="/app/aptitude" element={
            <AppContent>
              <Sidebar>
                <SidebarHeader>
                  <UserProfile>
                    <UserAvatar>JD</UserAvatar>
                    <UserInfo>
                      <UserName>John Doe</UserName>
                      <UserEmail>john@example.com</UserEmail>
                    </UserInfo>
                  </UserProfile>
                </SidebarHeader>
                
                <SidebarMenu>
                  {menuItems.map((item, index) => (
                    <MenuItem key={index}>
                      <MenuLink 
                        className={currentPath === item.path ? 'active' : ''}
                        onClick={() => setCurrentPath(item.path)}
                      >
                        {item.icon}
                        {item.label}
                      </MenuLink>
                    </MenuItem>
                  ))}
                </SidebarMenu>
              </Sidebar>
              
              <ContentArea>
                <AptitudeTest />
              </ContentArea>
            </AppContent>
          } />
          
          <Route path="/app/dsa" element={
            <AppContent>
              <Sidebar>
                <SidebarHeader>
                  <UserProfile>
                    <UserAvatar>JD</UserAvatar>
                    <UserInfo>
                      <UserName>John Doe</UserName>
                      <UserEmail>john@example.com</UserEmail>
                    </UserInfo>
                  </UserProfile>
                </SidebarHeader>
                
                <SidebarMenu>
                  {menuItems.map((item, index) => (
                    <MenuItem key={index}>
                      <MenuLink 
                        className={currentPath === item.path ? 'active' : ''}
                        onClick={() => setCurrentPath(item.path)}
                      >
                        {item.icon}
                        {item.label}
                      </MenuLink>
                    </MenuItem>
                  ))}
                </SidebarMenu>
              </Sidebar>
              
              <ContentArea>
                <EnhancedDSABank />
              </ContentArea>
            </AppContent>
          } />
          
          <Route path="/app/interview" element={
            <AppContent>
              <Sidebar>
                <SidebarHeader>
                  <UserProfile>
                    <UserAvatar>JD</UserAvatar>
                    <UserInfo>
                      <UserName>John Doe</UserName>
                      <UserEmail>john@example.com</UserEmail>
                    </UserInfo>
                  </UserProfile>
                </SidebarHeader>
                
                <SidebarMenu>
                  {menuItems.map((item, index) => (
                    <MenuItem key={index}>
                      <MenuLink 
                        className={currentPath === item.path ? 'active' : ''}
                        onClick={() => setCurrentPath(item.path)}
                      >
                        {item.icon}
                        {item.label}
                      </MenuLink>
                    </MenuItem>
                  ))}
                </SidebarMenu>
              </Sidebar>
              
              <ContentArea>
                <InterviewPrep />
              </ContentArea>
            </AppContent>
          } />
          
          <Route path="/app/blog" element={
            <AppContent>
              <Sidebar>
                <SidebarHeader>
                  <UserProfile>
                    <UserAvatar>JD</UserAvatar>
                    <UserInfo>
                      <UserName>John Doe</UserName>
                      <UserEmail>john@example.com</UserEmail>
                    </UserInfo>
                  </UserProfile>
                </SidebarHeader>
                
                <SidebarMenu>
                  {menuItems.map((item, index) => (
                    <MenuItem key={index}>
                      <MenuLink 
                        className={currentPath === item.path ? 'active' : ''}
                        onClick={() => setCurrentPath(item.path)}
                      >
                        {item.icon}
                        {item.label}
                      </MenuLink>
                    </MenuItem>
                  ))}
                </SidebarMenu>
              </Sidebar>
              
              <ContentArea>
                <Blog />
              </ContentArea>
            </AppContent>
          } />
          
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>

        <FAQButton
          onClick={handleFAQOpen}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiMessageSquare />
        </FAQButton>

        {isFAQModalOpen && (
          <FAQModalOverlay onClick={handleFAQClose}>
            <FAQModal onClick={(e) => e.stopPropagation()}>
              <FAQHeader>
                <FAQTitle>Prep Nexus Assistant</FAQTitle>
                <FAQCloseButton onClick={handleFAQClose}>×</FAQCloseButton>
              </FAQHeader>
              
              <FAQChatContainer>
                {faqMessages.length === 0 && (
                  <FAQWelcomeMessage>
                    👋 Hi! I'm your Prep Nexus assistant. Ask me anything about resume optimization, interview prep, or career advice!
                  </FAQWelcomeMessage>
                )}
                
                {faqMessages.map((message, index) => (
                  <FAQMessage key={index} isUser={message.type === 'user'}>
                    <FAQMessageBubble isUser={message.type === 'user'}>
                      {message.content}
                    </FAQMessageBubble>
                  </FAQMessage>
                ))}
                
                {loading && (
                  <FAQMessage isUser={false}>
                    <FAQMessageBubble isUser={false}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '16px', height: '16px', border: '2px solid #6366f1', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        Thinking...
                      </div>
                    </FAQMessageBubble>
                  </FAQMessage>
                )}
              </FAQChatContainer>
              
              <FAQInputContainer>
                <form onSubmit={handleFAQQuestionSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                  <FAQInput
                    type="text"
                    placeholder="Ask me anything..."
                    value={faqQuestion}
                    onChange={(e) => setFaqQuestion(e.target.value)}
                    disabled={loading}
                  />
                  <FAQSendButton type="submit" disabled={loading || !faqQuestion.trim()}>
                    Send
                  </FAQSendButton>
                </form>
              </FAQInputContainer>
            </FAQModal>
          </FAQModalOverlay>
        )}
      </AppContainer>
    </Router>
  );
}

export default App;
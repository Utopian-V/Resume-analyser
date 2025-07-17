import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { FiUploadCloud, FiCheckCircle, FiUser, FiCode, FiBriefcase, FiFolder, FiMessageSquare, FiLogOut, FiSun, FiMoon, FiMessageCircle } from "react-icons/fi";
import { BiBrain } from 'react-icons/bi';
import Sidebar from './components/Sidebar';
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import FileUpload from "./components/FileUpload";
import FeedbackDisplay from "./components/FeedbackDisplay";
import GraphicalAnalysis from "./components/GraphicalAnalysis";
import PDFViewer from "./components/PDFViewer";
import UserDashboard from "./components/UserDashboard";
import DSAPreparation from "./components/DSAPreparation";
import EnhancedDSABank from "./components/EnhancedDSABank";
import JobListings from "./components/JobListings";
import ProjectAnalysis from "./components/ProjectAnalysis";
import InterviewPrep from "./components/InterviewPrep";
import AptitudeTest from "./components/AptitudeTest";
import AptitudeQuestionManager from "./components/AptitudeQuestionManager";
import { uploadResume } from "./api";
import { registerFirebaseUser } from "./api";
import { AnimatePresence, motion } from "framer-motion";
import jsPDF from "jspdf";
import LandingPage from "./components/LandingPage";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Blog, { AuthorPage, TagPage } from './components/Blog';
import { NotFound } from './components/Blog';
import { HelmetProvider } from 'react-helmet-async';

const lightTheme = {
  background: "#f8fafc",
  card: "#fff",
  text: "#232946",
  accent: "#6366f1",
  accent2: "#a21caf",
  border: "#e0e7ff",
  shadow: "rgba(99,102,241,0.10)",
  tabActive: "#6366f1",
  tabInactive: "#fff",
  tabTextActive: "#fff",
  tabTextInactive: "#6366f1",
};
const darkTheme = {
  background: "#181c2f",
  card: "#232946",
  text: "#e0e7ff",
  accent: "#6366f1",
  accent2: "#a21caf",
  border: "#232946",
  shadow: "rgba(99,102,241,0.18)",
  tabActive: "#6366f1",
  tabInactive: "#232946",
  tabTextActive: "#fff",
  tabTextInactive: "#a5b4fc",
};

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', 'Poppins', sans-serif;
    background: ${({ theme }) => theme.background};
    min-height: 100vh;
    margin: 0;
    color: ${({ theme }) => theme.text};
    transition: background 0.3s, color 0.3s;
  }
  * {
    box-sizing: border-box;
  }
`;

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 2rem auto;
  gap: 2rem;
  padding: 0 2vw;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: ${({ theme }) => theme.card};
  padding: 1.5rem 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px ${({ theme }) => theme.shadow};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1`
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.accent};
  margin: 0;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.accent2};
  font-weight: 600;
  margin: 0;
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.text};
  font-weight: 600;
`;

const AuthButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: 2px solid ${({ theme }) => theme.accent};
  background: ${({ isLoggedIn, theme }) => isLoggedIn ? '#ef4444' : theme.accent};
  color: white;
  border-radius: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
    font-size: 1.1rem;
    padding: 1rem 0.5rem;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.accent};
  font-size: 1.7rem;
  cursor: pointer;
  margin-left: 1.2rem;
  transition: color 0.2s;
  &:hover {
    color: ${({ theme }) => theme.accent2};
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  background: ${({ theme }) => theme.card};
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 12px ${({ theme }) => theme.shadow};
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: 2px solid ${({ theme }) => theme.accent};
  background: ${({ active, theme }) => active ? theme.tabActive : theme.tabInactive};
  color: ${({ active, theme }) => active ? theme.tabTextActive : theme.tabTextInactive};
  border-radius: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${({ theme }) => theme.tabActive};
    color: #fff;
  }
`;

const ContentArea = styled.div`
  display: flex;
  gap: 2rem;
  @media (max-width: 1200px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  min-width: 300px;
  @media (max-width: 800px) {
    min-width: 0;
    width: 100%;
  }
`;

const RightPanel = styled.div`
  flex: 1.2;
  min-width: 300px;
  @media (max-width: 800px) {
    min-width: 0;
    width: 100%;
  }
`;

const UploadSection = styled.section`
  margin-bottom: 2rem;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #e0e7ff;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Success = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #22c55e;
  font-weight: 600;
  margin-top: 1rem;
`;

const ResumeSection = styled.div`
  display: flex;
  gap: 2rem;
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
`;

const LoginTitle = styled.h2`
  color: #3730a3;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;

const LoginText = styled.p`
  color: #6366f1;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const FloatingFAQ = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 200;
  background: ${({ theme }) => theme.accent};
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  box-shadow: 0 4px 24px ${({ theme }) => theme.shadow};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.accent2};
  }
`;

const FAQModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 201;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  backdrop-filter: blur(4px);
`;

const FAQModal = styled.div`
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  border-radius: 1.5rem 1.5rem 0 0;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  width: 400px;
  max-width: 95vw;
  height: 500px;
  margin: 0 2vw 2vw 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const FAQHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.accent};
  color: white;
`;

const FAQTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
`;

const FAQCloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FAQChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  ${props => props.isUser ? 'justify-content: flex-end;' : ''}
`;

const FAQMessageBubble = styled.div`
  background: ${props => props.isUser ? props.theme.accent : props.theme.tabInactive};
  color: ${props => props.isUser ? 'white' : props.theme.text};
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  max-width: 80%;
  word-wrap: break-word;
  font-size: 0.95rem;
  line-height: 1.4;
  
  ${props => props.isUser ? `
    border-bottom-right-radius: 0.25rem;
  ` : `
    border-bottom-left-radius: 0.25rem;
  `}
`;

const FAQInputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  gap: 0.5rem;
`;

const FAQInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 0.95rem;
  background: ${({ theme }) => theme.tabInactive};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent};
  }
`;

const FAQSendButton = styled.button`
  background: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.accent2};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FAQWelcomeMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
  padding: 1rem;
`;

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [highlighted, setHighlighted] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [faqMessages, setFaqMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
      if (firebaseUser) {
        try {
          await registerFirebaseUser({
            user_id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email
          });
        } catch (err) {
          // Optionally log or show error
          console.error('Failed to register user in backend:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode));
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      if (!auth || !googleProvider) {
        alert('Firebase authentication is not properly configured.');
        return;
      }
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      let errorMessage = 'Sign in failed. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Firebase authentication.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      alert(errorMessage);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert('Sign out failed. Please try again.');
    }
  };

  const handleFileSelected = async (file) => {
    console.log('Selected file:', file);
    setLoading(true);
    setFeedback(null);
    setSuccess(false);
    setPdfFile(file);
    setHighlighted([]);
    try {
      const result = await uploadResume(file);
      setFeedback(result);
      setSuccess(true);
    } catch (err) {
      setFeedback({ error: "Failed to analyze resume." });
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!feedback) return;
    const doc = new jsPDF();
    doc.setFont("Inter", "normal");
    doc.setFontSize(18);
    doc.text("AI Resume Review Feedback", 14, 18);
    doc.setFontSize(12);
    let y = 30;
    const addText = (label, value) => {
      doc.setFont(undefined, "bold");
      doc.text(label, 14, y);
      doc.setFont(undefined, "normal");
      if (typeof value === "string") {
        doc.text(value, 14, y + 6);
        y += 12;
      } else if (Array.isArray(value)) {
        value.forEach((v, i) => {
          doc.text("- " + v, 18, y + 6 + i * 6);
        });
        y += 6 * value.length + 6;
      } else if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([k, v]) => {
          doc.text(`${k}: ${Array.isArray(v) ? v.join(", ") : v}`, 18, y + 6);
          y += 6;
        });
        y += 6;
      }
    };
    addText("Score", String(feedback.score || "N/A"));
    addText("ATS Compliance", feedback.ats_compliance);
    addText("Improvements", feedback.improvements?.map(i => `${i.suggestion} (${i.reason})`));
    addText("Skill Match", feedback.skill_match);
    addText("Targeted Roles", feedback.targeted_roles);
    addText("Red Flags", feedback.red_flags);
    addText("Comments", feedback.comments);
    doc.save("resume_feedback.pdf");
  };

  const handleHighlight = (text) => {
    if (!text) return;
    const keywords = text.split(/\s+/).filter(w => w.length > 4);
    setHighlighted(keywords);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
  };

  const handleFAQQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!faqQuestion.trim()) return;
    
    const userMessage = { type: 'user', content: faqQuestion, timestamp: new Date() };
    setFaqMessages(prev => [...prev, userMessage]);
    setFaqQuestion('');
    
    setLoading(true);
    try {
      const answer = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/faq/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: faqQuestion }),
      }).then(res => res.json());
      
      const botMessage = { type: 'bot', content: answer.answer || 'I apologize, but I couldn\'t find a specific answer to your question. Please try rephrasing or ask something else.', timestamp: new Date() };
      setFaqMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const botMessage = { type: 'bot', content: 'Sorry, I\'m having trouble connecting right now. Please try again later.', timestamp: new Date() };
      setFaqMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleFAQClose = () => {
    setIsFAQModalOpen(false);
    setFaqQuestion('');
    setFaqMessages([]);
  };

  const renderTabContent = () => {
    if (activeTab === 'jobs') {
      return (
        <JobListings />
      );
    }
    if (!user) {
      return (
        <LoginPrompt>
          <LoginTitle>Welcome to AI Resume Reviewer</LoginTitle>
          <LoginText>Please sign in with Google to access all features</LoginText>
          <AuthButton isLoggedIn={false} onClick={handleGoogleSignIn}>
            <FiUser size={18} />
            Sign in with Google
          </AuthButton>
        </LoginPrompt>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <UserDashboard 
            userId={user.uid} 
            setUserId={() => {}} // Not needed with Firebase
            onResumeAnalyzed={feedback}
          />
        );
      case 'resume':
        return (
          <ResumeSection>
            <LeftPanel>
              <UploadSection>
                <FileUpload onFileSelected={handleFileSelected} />
              </UploadSection>
              {loading && <LoadingSpinner />}
              {success && (
                <Success>
                  <FiCheckCircle size={22} /> Resume analyzed!
                </Success>
              )}
              <AnimatePresence>
                {feedback && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.7 }}
                  >
                    <GraphicalAnalysis feedback={feedback} />
                    <FeedbackDisplay
                      feedback={feedback}
                      onDownload={handleDownload}
                      onFeedbackClick={handleHighlight}
                    />
                    <ProjectAnalysis projectAnalysis={feedback.project_analysis} />
                  </motion.div>
                )}
              </AnimatePresence>
            </LeftPanel>
            <RightPanel>
              {pdfFile && (
                <PDFViewer file={pdfFile} highlights={highlighted} />
              )}
            </RightPanel>
          </ResumeSection>
        );
      case 'dsa':
        return (
          <EnhancedDSABank userId={user?.uid} />
        );
      case 'interview':
        return (
          <InterviewPrep userId={user?.uid} />
        );
      case 'aptitude':
        return (
          <AptitudeTest userId={user?.uid} />
        );
      case 'question-manager':
        return (
          <AptitudeQuestionManager userId={user?.uid} />
        );
      default:
        return null;
    }
  };

  return (
    <HelmetProvider>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blog/author/:slug" element={<AuthorPage />} />
          <Route path="/blog/tag/:tag" element={<TagPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/app" element={
            <>
              {user ? (
                <Sidebar 
                  user={user}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onSignOut={handleSignOut}
                />
              ) : (
                <Header>
                  <HeaderLeft>
                    <Title>Prep Nexus</Title>
                    <Subtitle>AI-powered career growth and interview preparation</Subtitle>
                  </HeaderLeft>
                  <AuthSection>
                    {isLoading ? (
                      <div>Loading...</div>
                    ) : (
                      <AuthButton isLoggedIn={false} onClick={handleGoogleSignIn}>
                        <FiUser size={18} />
                        Sign in with Google
                      </AuthButton>
                    )}
                  </AuthSection>
                </Header>
              )}
              
              {user && (
                <div style={{ marginLeft: '280px', padding: '2rem' }}>
                  {renderTabContent()}
                </div>
              )}
              
              {!user && (
                <MainLayout>
                  <LoginPrompt>
                    <LoginTitle>Welcome to Prep Nexus</LoginTitle>
                    <LoginText>Please sign in with Google to access all features</LoginText>
                    <AuthButton isLoggedIn={false} onClick={handleGoogleSignIn}>
                      <FiUser size={18} />
                      Sign in with Google
                    </AuthButton>
                  </LoginPrompt>
                </MainLayout>
              )}
              
              <FloatingFAQ onClick={() => setIsFAQModalOpen(true)}>
                <FiMessageCircle />
              </FloatingFAQ>
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
            </>
          } />
        </Routes>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
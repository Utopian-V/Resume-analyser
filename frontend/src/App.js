import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { FiUploadCloud, FiCheckCircle, FiUser, FiCode, FiBriefcase, FiFolder, FiMessageSquare, FiLogOut } from "react-icons/fi";
import { BiBrain } from 'react-icons/bi';
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
import { AnimatePresence, motion } from "framer-motion";
import jsPDF from "jspdf";
import LandingPage from "./components/LandingPage";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', 'Poppins', sans-serif;
    background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
    min-height: 100vh;
    margin: 0;
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
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Mascot = styled.div`
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 8px #e0e7ff);
`;

const Title = styled.h1`
  font-family: 'Poppins', 'Inter', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  color: #3730a3;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #6366f1;
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
  color: #3730a3;
  font-weight: 600;
`;

const AuthButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: 2px solid #6366f1;
  background: ${props => props.isLoggedIn ? '#ef4444' : '#6366f1'};
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

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
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
  border: 2px solid #6366f1;
  background: ${props => props.active ? '#6366f1' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6366f1'};
  border-radius: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #6366f1;
    color: white;
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

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [highlighted, setHighlighted] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
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

  const renderTabContent = () => {
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
          <EnhancedDSABank userId={user.uid} />
        );
      case 'jobs':
        return (
          <JobListings 
            userId={user.uid}
            userSkills={feedback?.skill_match?.matched_skills || []}
          />
        );
      case 'interview':
        return (
          <InterviewPrep userId={user.uid} />
        );
      case 'aptitude':
        return (
          <AptitudeTest userId={user.uid} />
        );
      case 'question-manager':
        return (
          <AptitudeQuestionManager userId={user.uid} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={
            <>
              <Header>
                <HeaderLeft>
                  <Mascot>🦉</Mascot>
                  <div>
                    <Title>AI Resume Reviewer</Title>
                    <Subtitle>Get instant, actionable feedback and prepare for your dream job.</Subtitle>
                  </div>
                </HeaderLeft>
                <AuthSection>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : user ? (
                    <>
                      <UserInfo>
                        {user.photoURL && <img src={user.photoURL} alt={user.displayName} style={{ width: 32, height: 32, borderRadius: '50%' }} />}
                        {user.displayName}
                      </UserInfo>
                      <AuthButton isLoggedIn={true} onClick={handleSignOut}>
                        <FiLogOut size={18} />
                        Sign Out
                      </AuthButton>
                    </>
                  ) : (
                    <AuthButton isLoggedIn={false} onClick={handleGoogleSignIn}>
                      <FiUser size={18} />
                      Sign in with Google
                    </AuthButton>
                  )}
                </AuthSection>
              </Header>
              <MainLayout>
                {user && (
                  <TabContainer>
                    <Tab 
                      active={activeTab === 'dashboard'} 
                      onClick={() => setActiveTab('dashboard')}
                    >
                      <FiUser size={18} />
                      Dashboard
                    </Tab>
                    <Tab 
                      active={activeTab === 'resume'} 
                      onClick={() => setActiveTab('resume')}
                    >
                      <FiUploadCloud size={18} />
                      Resume Analysis
                    </Tab>
                    <Tab 
                      active={activeTab === 'dsa'} 
                      onClick={() => setActiveTab('dsa')}
                    >
                      <FiCode size={18} />
                      DSA Practice
                    </Tab>
                    <Tab 
                      active={activeTab === 'jobs'} 
                      onClick={() => setActiveTab('jobs')}
                    >
                      <FiBriefcase size={18} />
                      Job Opportunities
                    </Tab>
                    <Tab 
                      active={activeTab === 'interview'} 
                      onClick={() => setActiveTab('interview')}
                    >
                      <FiMessageSquare size={18} />
                      Interview Prep
                    </Tab>
                    <Tab 
                      active={activeTab === 'aptitude'} 
                      onClick={() => setActiveTab('aptitude')}
                    >
                      <BiBrain size={18} />
                      Aptitude Test
                    </Tab>
                    <Tab 
                      active={activeTab === 'question-manager'} 
                      onClick={() => setActiveTab('question-manager')}
                    >
                      <FiFolder size={18} />
                      Question Manager
                    </Tab>
                  </TabContainer>
                )}
                <ContentArea>
                  {renderTabContent()}
                </ContentArea>
              </MainLayout>
            </>
          } />
          <Route path="/aptitude" element={<AptitudeTest />} />
          <Route path="/aptitude/manage" element={<AptitudeQuestionManager />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { FiUploadCloud, FiCheckCircle, FiUser, FiCode, FiBriefcase, FiFolder } from "react-icons/fi";
import FileUpload from "./components/FileUpload";
import FeedbackDisplay from "./components/FeedbackDisplay";
import GraphicalAnalysis from "./components/GraphicalAnalysis";
import PDFViewer from "./components/PDFViewer";
import UserDashboard from "./components/UserDashboard";
import DSAPreparation from "./components/DSAPreparation";
import JobListings from "./components/JobListings";
import ProjectAnalysis from "./components/ProjectAnalysis";
import { uploadResume } from "./api";
import { AnimatePresence, motion } from "framer-motion";
import jsPDF from "jspdf";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Inter', 'Poppins', sans-serif;
    background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
    min-height: 100vh;
    margin: 0;
  }
`;

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 2rem auto;
  gap: 2rem;
  padding: 0 2rem;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
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
  margin: 0 0 1.5rem 0;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
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
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  min-width: 400px;
`;

const RightPanel = styled.div`
  flex: 1.2;
  min-width: 500px;
  @media (max-width: 1200px) {
    min-width: 0;
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

function App() {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [highlighted, setHighlighted] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

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
    switch (activeTab) {
      case 'dashboard':
        return (
          <UserDashboard 
            userId={userId} 
            setUserId={setUserId}
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
          <DSAPreparation 
            userId={userId}
            dsaRecommendations={feedback?.dsa_recommendations}
          />
        );
      case 'jobs':
        return (
          <JobListings 
            userId={userId}
            userSkills={feedback?.skill_match?.matched_skills || []}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <GlobalStyle />
      <Header>
        <Mascot>🦉</Mascot>
        <div>
          <Title>AI Resume Reviewer</Title>
          <Subtitle>Get instant, actionable feedback and prepare for your dream job.</Subtitle>
        </div>
      </Header>
      
      <MainLayout>
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
            DSA Preparation
          </Tab>
          <Tab 
            active={activeTab === 'jobs'} 
            onClick={() => setActiveTab('jobs')}
          >
            <FiBriefcase size={18} />
            Job Opportunities
          </Tab>
        </TabContainer>
        
        <ContentArea>
          {renderTabContent()}
        </ContentArea>
      </MainLayout>
    </>
  );
}

export default App; 
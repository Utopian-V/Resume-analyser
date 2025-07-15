import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { FiUploadCloud, FiCheckCircle } from "react-icons/fi";
import FileUpload from "./components/FileUpload";
import FeedbackDisplay from "./components/FeedbackDisplay";
import GraphicalAnalysis from "./components/GraphicalAnalysis";
import PDFViewer from "./components/PDFViewer";
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
  flex-direction: row;
  max-width: 1200px;
  margin: 2.5rem auto;
  gap: 2.5rem;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const LeftPanel = styled.div`
  flex: 1.2;
  min-width: 340px;
`;
const RightPanel = styled.div`
  flex: 1.5;
  min-width: 420px;
  @media (max-width: 900px) {
    min-width: 0;
  }
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

function App() {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [highlighted, setHighlighted] = useState([]);

  const handleFileSelected = async (file) => {
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

  // Highlight logic: when a feedback improvement is clicked, highlight keywords in PDF
  const handleHighlight = (text) => {
    if (!text) return;
    // Extract keywords (naive: split by space, filter stopwords, etc.)
    const keywords = text.split(/\s+/).filter(w => w.length > 4);
    setHighlighted(keywords);
  };

  return (
    <>
      <GlobalStyle />
      <Header>
        <Mascot>🦉</Mascot>
        <div>
          <Title>AI Resume Reviewer</Title>
          <Subtitle>Get instant, actionable, and graphical feedback on your resume.</Subtitle>
        </div>
      </Header>
      <MainLayout>
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
              </motion.div>
            )}
          </AnimatePresence>
        </LeftPanel>
        <RightPanel>
          {pdfFile && (
            <PDFViewer file={pdfFile} highlights={highlighted} />
          )}
        </RightPanel>
      </MainLayout>
    </>
  );
}

export default App; 
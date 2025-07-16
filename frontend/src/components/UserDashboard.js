import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiUser, FiTrendingUp, FiBriefcase, FiCode, FiAward, FiUploadCloud, FiMessageSquare, FiBriefcase as FiJob } from "react-icons/fi";
import { BiBrain } from 'react-icons/bi';
import { getUserProgress, updateResumeScore } from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Container = styled.div`
  background: linear-gradient(120deg, #f5f7ff 60%, #e0e7ff 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #3730a3;
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserInfo = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
  margin-bottom: 1.5rem;
`;

const UserName = styled.h4`
  color: #3730a3;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const UserEmail = styled.p`
  color: #6366f1;
  font-size: 1rem;
  margin: 0 0 1rem 0;
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ProgressCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
  text-align: center;
  border-left: 4px solid #6366f1;
`;

const ProgressNumber = styled.div`
  font-size: 2rem;
  font-weight: 900;
  color: #3730a3;
  margin-bottom: 0.5rem;
`;

const ProgressLabel = styled.div`
  color: #6366f1;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ProgressIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #6366f1;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
`;

const StatTitle = styled.h5`
  color: #3730a3;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #6366f1;
  margin-bottom: 0.3rem;
`;

const StatDescription = styled.p`
  color: #6366f1;
  font-size: 0.9rem;
  margin: 0;
`;

const WelcomeMessage = styled.div`
  background: linear-gradient(90deg, #f0f9ff 60%, #e0f2fe 100%);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid #6366f1;
`;

const WelcomeTitle = styled.h4`
  color: #3730a3;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const WelcomeText = styled.p`
  color: #6366f1;
  line-height: 1.5;
  margin: 0;
`;

const QuickLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;
const QuickLinkCard = styled.button`
  background: linear-gradient(90deg, #6366f1 60%, #3730a3 100%);
  color: white;
  border: none;
  border-radius: 1.2rem;
  padding: 1.2rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99,102,241,0.13);
  transition: background 0.2s, transform 0.1s;
  &:hover {
    background: linear-gradient(90deg, #3730a3 60%, #6366f1 100%);
    transform: translateY(-2px) scale(1.05);
  }
`;
const ProgressBar = styled.div`
  background: #e0e7ff;
  border-radius: 1rem;
  height: 18px;
  width: 100%;
  margin: 0.7rem 0 1.2rem 0;
  overflow: hidden;
`;
const ProgressFill = styled.div`
  background: linear-gradient(90deg, #22c55e 60%, #6366f1 100%);
  height: 100%;
  border-radius: 1rem;
  width: ${props => props.percent || 0}%;
  transition: width 0.5s;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
  text-align: center;
  flex: 1 1 200px;
  min-width: 180px;
`;

const IconContainer = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #6366f1;
`;

const Title = styled.h5`
  color: #3730a3;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const Description = styled.p`
  color: #6366f1;
  font-size: 0.9rem;
  margin: 0;
`;

const UserDashboard = ({ userId, setUserId, onResumeAnalyzed }) => {
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  // For navigation to other tabs (if using react-router)
  const navigate = useNavigate();

  const loadUserProgress = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const progress = await getUserProgress(userId);
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (score) => {
    if (userId) {
      try {
        await updateResumeScore(userId, score);
        await loadUserProgress();
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  // Load user progress when userId changes
  useEffect(() => {
    if (userId) {
      loadUserProgress();
    }
  }, [userId]);

  // Update progress when resume is analyzed
  useEffect(() => {
    if (onResumeAnalyzed && userId) {
      updateProgress(onResumeAnalyzed.score);
    }
  }, [onResumeAnalyzed]);

  // Recent activity
  const lastResume = userProgress?.last_analysis_date ? new Date(userProgress.last_analysis_date).toLocaleString() : 'Never';
  const lastDSA = userProgress?.completed_questions?.length ? userProgress.completed_questions[userProgress.completed_questions.length-1]?.title || 'N/A' : 'None';
  const lastJob = userProgress?.applied_jobs?.length ? userProgress.applied_jobs[userProgress.applied_jobs.length-1]?.title || 'N/A' : 'None';

  // Progress chart
  const dsaTotal = (userProgress?.completed_questions?.length || 0) + 10; // Example
  const dsaSolved = userProgress?.completed_questions?.length || 0;
  const dsaPercent = dsaTotal ? Math.round((dsaSolved/dsaTotal)*100) : 0;

  // Personalized greeting
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (!userId) {
    return (
      <Container>
        <SectionTitle>
          <FiUser size={24} />
          Welcome to Resume Review AI
        </SectionTitle>
        
        <WelcomeMessage>
          <WelcomeTitle>Get Started</WelcomeTitle>
          <WelcomeText>
            Please sign in with Google to access your personalized dashboard and track your progress.
          </WelcomeText>
        </WelcomeMessage>
      </Container>
    );
  }

  return (
    <Container>
      <SectionTitle>
        <FiUser size={24} />
        {greeting()}, here’s your dashboard
      </SectionTitle>
      <QuickLinks>
        <QuickLinkCard onClick={() => navigate('/resume')}>
          <FiUploadCloud size={22} /> Resume Upload
        </QuickLinkCard>
        <QuickLinkCard onClick={() => navigate('/dsa')}>
          <FiCode size={22} /> DSA Practice
        </QuickLinkCard>
        <QuickLinkCard onClick={() => navigate('/interview')}>
          <FiMessageSquare size={22} /> Interview Prep
        </QuickLinkCard>
        <Link to="/aptitude">
          <Card>
            <IconContainer>
              <BiBrain size={24} />
            </IconContainer>
            <Title>Aptitude Test</Title>
            <Description>Take an aptitude assessment to evaluate your analytical and problem-solving skills.</Description>
          </Card>
        </Link>
      </QuickLinks>
      <UserInfo>
        <UserName>Your Progress</UserName>
        <UserEmail>Last resume upload: {lastResume}</UserEmail>
        <UserEmail>Last DSA solved: {lastDSA}</UserEmail>
        <UserEmail>Last job applied: {lastJob}</UserEmail>
      </UserInfo>
      <ProgressGrid>
        <ProgressCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <ProgressIcon><FiAward /></ProgressIcon>
          <ProgressNumber>{userProgress?.resume_score || 0}</ProgressNumber>
          <ProgressLabel>Resume Score</ProgressLabel>
        </ProgressCard>
        <ProgressCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <ProgressIcon><FiCode /></ProgressIcon>
          <ProgressNumber>{dsaSolved}</ProgressNumber>
          <ProgressLabel>DSA Questions Completed</ProgressLabel>
          <ProgressBar><ProgressFill percent={dsaPercent} /></ProgressBar>
        </ProgressCard>
        <ProgressCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <ProgressIcon><FiBriefcase /></ProgressIcon>
          <ProgressNumber>{userProgress?.applied_jobs?.length || 0}</ProgressNumber>
          <ProgressLabel>Jobs Applied</ProgressLabel>
        </ProgressCard>
      </ProgressGrid>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ 
            border: '4px solid #e0e7ff', 
            borderTop: '4px solid #6366f1', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ color: '#6366f1', marginTop: '1rem' }}>Loading your progress...</p>
        </div>
      )}
    </Container>
  );
};

export default UserDashboard;
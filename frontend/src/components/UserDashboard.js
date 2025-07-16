import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiUser, FiTrendingUp, FiBriefcase, FiCode, FiAward } from "react-icons/fi";
import { getUserProgress, updateResumeScore } from "../api";

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

const UserDashboard = ({ userId, setUserId, onResumeAnalyzed }) => {
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);

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
        Your Dashboard
      </SectionTitle>
      
      {userProgress && (
        <>
          <ProgressGrid>
            <ProgressCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProgressIcon>
                <FiAward />
              </ProgressIcon>
              <ProgressNumber>{userProgress.resume_score || 0}</ProgressNumber>
              <ProgressLabel>Resume Score</ProgressLabel>
            </ProgressCard>
            
            <ProgressCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <ProgressIcon>
                <FiCode />
              </ProgressIcon>
              <ProgressNumber>{userProgress.completed_questions?.length || 0}</ProgressNumber>
              <ProgressLabel>DSA Questions Completed</ProgressLabel>
            </ProgressCard>
            
            <ProgressCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ProgressIcon>
                <FiBriefcase />
              </ProgressIcon>
              <ProgressNumber>{userProgress.applied_jobs?.length || 0}</ProgressNumber>
              <ProgressLabel>Jobs Applied</ProgressLabel>
            </ProgressCard>
          </ProgressGrid>
          
          <StatsContainer>
            <StatCard>
              <StatTitle>
                <FiTrendingUp size={16} />
                Recent Activity
              </StatTitle>
              <StatValue>
                {userProgress.last_analysis_date ? 
                  new Date(userProgress.last_analysis_date).toLocaleDateString() : 
                  'No recent activity'
                }
              </StatValue>
              <StatDescription>
                Last resume analysis
              </StatDescription>
            </StatCard>
            
            <StatCard>
              <StatTitle>
                <FiCode size={16} />
                DSA Progress
              </StatTitle>
              <StatValue>
                {userProgress.completed_questions?.length || 0} / {userProgress.completed_questions?.length + 10 || 10}
              </StatValue>
              <StatDescription>
                Questions completed this week
              </StatDescription>
            </StatCard>
            
            <StatCard>
              <StatTitle>
                <FiBriefcase size={16} />
                Job Applications
              </StatTitle>
              <StatValue>
                {userProgress.applied_jobs?.length || 0}
              </StatValue>
              <StatDescription>
                Applications submitted
              </StatDescription>
            </StatCard>
          </StatsContainer>
        </>
      )}
      
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
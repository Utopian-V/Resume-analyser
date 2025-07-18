import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiUser, FiTrendingUp, FiBriefcase, FiCode, FiAward, FiUploadCloud, FiMessageSquare, FiTarget, FiBookOpen, FiUsers, FiCalendar, FiCheckCircle, FiClock, FiStar, FiBarChart2 } from "react-icons/fi";
import { BiBrain } from 'react-icons/bi';
import { getUserProgress, updateResumeScore } from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const WelcomeSection = styled.div`
  flex: 1;
`;

const WelcomeTitle = styled.h1`
  color: #1e293b;
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
`;

const WelcomeSubtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
`;

const StatsOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: ${props => props.color || '#6366f1'};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContentSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h3`
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
`;

const ActionIcon = styled.div`
  font-size: 1.5rem;
`;

const ProgressSection = styled.div`
  margin-top: 1.5rem;
`;

const ProgressItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ProgressInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ProgressIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  background: ${props => props.color || '#6366f1'};
`;

const ProgressDetails = styled.div`
  flex: 1;
`;

const ProgressName = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const ProgressBar = styled.div`
  background: #e2e8f0;
  border-radius: 0.5rem;
  height: 6px;
  width: 100px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background: linear-gradient(90deg, #10b981 0%, #6366f1 100%);
  height: 100%;
  border-radius: 0.5rem;
  width: ${props => props.percent || 0}%;
  transition: width 0.5s ease;
`;

const ProgressPercent = styled.div`
  font-weight: 600;
  color: #6366f1;
  font-size: 0.9rem;
`;

const RecentActivity = styled.div`
  margin-top: 1.5rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: white;
  background: ${props => props.color || '#6366f1'};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
`;

const ActivityTime = styled.div`
  color: #64748b;
  font-size: 0.8rem;
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
`;

const UserDashboard = ({ userId, setUserId, onResumeAnalyzed }) => {
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      loadUserProgress();
    }
  }, [userId]);

  const loadUserProgress = async () => {
    try {
      setLoading(true);
      setError("");
      const progress = await getUserProgress(userId);
      setUserProgress(progress);
    } catch (error) {
      setError("Failed to load user progress. Showing demo data.");
      // Set default progress for demo
      setUserProgress({
        dsa_questions_completed: 45,
        aptitude_tests_taken: 3,
        resume_score: 75,
        total_questions_available: 200,
        streak_days: 7
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (score) => {
    try {
      await updateResumeScore(userId, score);
      await loadUserProgress();
      if (onResumeAnalyzed) {
        onResumeAnalyzed(score);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const chartData = [
    { name: 'Mon', questions: 5 },
    { name: 'Tue', questions: 8 },
    { name: 'Wed', questions: 12 },
    { name: 'Thu', questions: 6 },
    { name: 'Fri', questions: 10 },
    { name: 'Sat', questions: 15 },
    { name: 'Sun', questions: 7 }
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  if (loading) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div>Loading your dashboard...</div>
        </div>
      </DashboardContainer>
    );
  }
  if (error) {
    return (
      <DashboardContainer>
        <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>
          <b>Error:</b> {error}
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <WelcomeSection>
          <WelcomeTitle>{greeting()}, User!</WelcomeTitle>
          <WelcomeSubtitle>Here's your learning progress and recommendations</WelcomeSubtitle>
        </WelcomeSection>
      </Header>

      <StatsOverview>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatHeader>
            <div>
              <StatValue>{userProgress?.dsa_questions_completed || 0}</StatValue>
              <StatLabel>DSA Questions Completed</StatLabel>
            </div>
            <StatIcon color="#6366f1">
              <FiCode />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatHeader>
            <div>
              <StatValue>{userProgress?.aptitude_tests_taken || 0}</StatValue>
              <StatLabel>Aptitude Tests Taken</StatLabel>
            </div>
            <StatIcon color="#8b5cf6">
              <BiBrain />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatHeader>
            <div>
              <StatValue>{userProgress?.resume_score || 0}%</StatValue>
              <StatLabel>Resume Score</StatLabel>
            </div>
            <StatIcon color="#10b981">
              <FiAward />
            </StatIcon>
          </StatHeader>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatHeader>
            <div>
              <StatValue>{userProgress?.streak_days || 0}</StatValue>
              <StatLabel>Day Streak</StatLabel>
            </div>
            <StatIcon color="#f59e0b">
              <FiTrendingUp />
            </StatIcon>
          </StatHeader>
        </StatCard>
      </StatsOverview>

      <MainContent>
        <ContentSection>
          <SectionTitle>
            <FiBarChart2 />
            Weekly Progress
          </SectionTitle>
          
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="questions" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ContentSection>

        <ContentSection>
          <SectionTitle>
            <FiTarget />
            Quick Actions
          </SectionTitle>
          
          <QuickActions>
            <ActionButton
              onClick={() => navigate('/app/dsa')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ActionIcon><FiCode /></ActionIcon>
              DSA Practice
            </ActionButton>
            
            <ActionButton
              onClick={() => navigate('/app/aptitude')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ActionIcon><BiBrain /></ActionIcon>
              Aptitude Test
            </ActionButton>
            
            <ActionButton
              onClick={() => navigate('/app/resume')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ActionIcon><FiUploadCloud /></ActionIcon>
              Resume Analysis
            </ActionButton>
            
            <ActionButton
              onClick={() => navigate('/app/jobs')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ActionIcon><FiBriefcase /></ActionIcon>
              Job Search
            </ActionButton>
          </QuickActions>

          <ProgressSection>
            <SectionTitle>
              <FiTrendingUp />
              Your Progress
            </SectionTitle>
            
            <ProgressItem>
              <ProgressInfo>
                <ProgressIcon color="#6366f1">
                  <FiCode />
                </ProgressIcon>
                <ProgressDetails>
                  <ProgressName>DSA Questions</ProgressName>
                </ProgressDetails>
              </ProgressInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ProgressBar>
                  <ProgressFill percent={Math.min((userProgress?.dsa_questions_completed || 0) / 200 * 100, 100)} />
                </ProgressBar>
                <ProgressPercent>{Math.round((userProgress?.dsa_questions_completed || 0) / 200 * 100)}%</ProgressPercent>
              </div>
            </ProgressItem>

            <ProgressItem>
              <ProgressInfo>
                <ProgressIcon color="#8b5cf6">
                  <BiBrain />
                </ProgressIcon>
                <ProgressDetails>
                  <ProgressName>Aptitude Tests</ProgressName>
                </ProgressDetails>
              </ProgressInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ProgressBar>
                  <ProgressFill percent={Math.min((userProgress?.aptitude_tests_taken || 0) / 10 * 100, 100)} />
                </ProgressBar>
                <ProgressPercent>{Math.round((userProgress?.aptitude_tests_taken || 0) / 10 * 100)}%</ProgressPercent>
              </div>
            </ProgressItem>

            <ProgressItem>
              <ProgressInfo>
                <ProgressIcon color="#10b981">
                  <FiAward />
                </ProgressIcon>
                <ProgressDetails>
                  <ProgressName>Resume Score</ProgressName>
                </ProgressDetails>
              </ProgressInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ProgressBar>
                  <ProgressFill percent={userProgress?.resume_score || 0} />
                </ProgressBar>
                <ProgressPercent>{userProgress?.resume_score || 0}%</ProgressPercent>
              </div>
            </ProgressItem>
          </ProgressSection>
        </ContentSection>
      </MainContent>
    </DashboardContainer>
  );
};

export default UserDashboard;
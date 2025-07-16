import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiUser, FiLogIn, FiLogOut, FiTrendingUp, FiBriefcase, FiCode, FiAward } from "react-icons/fi";
import { registerUser, loginUser, getUserProgress, updateResumeScore } from "../api";

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

const AuthContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 2px solid #e0e7ff;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: #6366f1;
    color: white;
    &:hover {
      background: #3730a3;
    }
  }
  
  &.secondary {
    background: #e0e7ff;
    color: #6366f1;
    &:hover {
      background: #c7d2fe;
    }
  }
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

const LogoutButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid #ef4444;
  background: transparent;
  color: #ef4444;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #ef4444;
    color: white;
  }
`;

const UserDashboard = ({ userId, setUserId, onResumeAnalyzed }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    target_roles: ''
  });

  useEffect(() => {
    if (userId) {
      setIsLoggedIn(true);
      loadUserProgress();
    }
  }, [userId]);

  const loadUserProgress = async () => {
    try {
      const progress = await getUserProgress(userId);
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser(formData.email);
      setUserId(response.user_id);
      setIsLoggedIn(true);
      setUserData({ email: formData.email, name: 'User' });
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        target_roles: formData.target_roles.split(',').map(r => r.trim()).filter(r => r)
      };
      
      const response = await registerUser(userData);
      setUserId(response.user_id);
      setIsLoggedIn(true);
      setUserData(userData);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUserId(null);
    setIsLoggedIn(false);
    setUserData(null);
    setUserProgress(null);
    localStorage.removeItem('userId');
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

  // Update progress when resume is analyzed
  useEffect(() => {
    if (onResumeAnalyzed && userId) {
      updateProgress(onResumeAnalyzed.score);
    }
  }, [onResumeAnalyzed]);

  if (!isLoggedIn) {
    return (
      <Container>
        <SectionTitle>
          <FiUser size={24} />
          Welcome to Resume Review AI
        </SectionTitle>
        
        <AuthContainer>
          <div style={{ marginBottom: '1rem' }}>
            <Button 
              className={showLogin ? 'primary' : 'secondary'}
              onClick={() => setShowLogin(true)}
              style={{ marginRight: '0.5rem' }}
            >
              <FiLogIn size={16} />
              Login
            </Button>
            <Button 
              className={!showLogin ? 'primary' : 'secondary'}
              onClick={() => setShowLogin(false)}
            >
              Register
            </Button>
          </div>
          
          <Form onSubmit={showLogin ? handleLogin : handleRegister}>
            {!showLogin && (
              <Input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            {!showLogin && (
              <>
                <Input
                  type="text"
                  placeholder="Skills (comma-separated)"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
                <Input
                  type="text"
                  placeholder="Target Roles (comma-separated)"
                  value={formData.target_roles}
                  onChange={(e) => setFormData({...formData, target_roles: e.target.value})}
                />
              </>
            )}
            <Button type="submit" className="primary" disabled={loading}>
              {loading ? 'Loading...' : (showLogin ? 'Login' : 'Register')}
            </Button>
          </Form>
        </AuthContainer>
      </Container>
    );
  }

  return (
    <Container>
      <SectionTitle>
        <FiUser size={24} />
        Your Dashboard
      </SectionTitle>
      
      <UserInfo>
        <UserName>{userData?.name || 'User'}</UserName>
        <UserEmail>{userData?.email}</UserEmail>
        <LogoutButton onClick={handleLogout}>
          <FiLogOut size={16} />
          Logout
        </LogoutButton>
      </UserInfo>
      
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
                {userProgress.completed_questions?.length || 0} / 50
              </StatValue>
              <StatDescription>
                Questions completed out of recommended
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
                Total applications submitted
              </StatDescription>
            </StatCard>
          </StatsContainer>
        </>
      )}
    </Container>
  );
};

export default UserDashboard; 
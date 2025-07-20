import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiTarget, FiBookOpen, FiTrendingUp, FiCheckCircle, FiClock, FiStar, FiAward, FiUsers, FiCalendar } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: #3730a3;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #6366f1;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.15);
  border-left: 4px solid #6366f1;
`;

const CardTitle = styled.h3`
  color: #3730a3;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SkillItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  background: #f8fafc;
  border-left: 3px solid #6366f1;
`;

const SkillName = styled.div`
  font-weight: 600;
  color: #3730a3;
  font-size: 1rem;
`;

const SkillLevel = styled.div`
  font-size: 0.9rem;
  color: #6366f1;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  background: ${props => {
    switch(props.level) {
      case 'Advanced': return '#dcfce7';
      case 'Intermediate': return '#fef3c7';
      case 'Beginner': return '#f0f9ff';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch(props.level) {
      case 'Advanced': return '#166534';
      case 'Intermediate': return '#92400e';
      case 'Beginner': return '#1e40af';
      default: return '#64748b';
    }
  }};
`;

const ProgressBar = styled.div`
  background: #e0e7ff;
  border-radius: 1rem;
  height: 8px;
  width: 100%;
  margin: 0.5rem 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background: linear-gradient(90deg, #22c55e 60%, #6366f1 100%);
  height: 100%;
  border-radius: 1rem;
  width: ${props => props.percent || 0}%;
  transition: width 0.5s;
`;

const LearningPath = styled.div`
  background: linear-gradient(90deg, #f8fafc 60%, #f1f5f9 100%);
  border-radius: 0.8rem;
  padding: 1.5rem;
  margin: 1rem 0;
  border-left: 4px solid #6366f1;
`;

const PathTitle = styled.h4`
  color: #3730a3;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const PathDescription = styled.p`
  color: #6366f1;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PathSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: ${props => props.completed ? '#dcfce7' : '#f8fafc'};
  color: ${props => props.completed ? '#166534' : '#374151'};
`;

const StepIcon = styled.div`
  font-size: 1rem;
  color: ${props => props.completed ? '#22c55e' : '#6366f1'};
`;

const RecommendationCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
  margin-bottom: 1rem;
  border-left: 4px solid #22c55e;
`;

const RecTitle = styled.h5`
  color: #3730a3;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const RecDescription = styled.p`
  color: #6366f1;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #4f46e5;
    transform: translateY(-1px);
  }
`;

const SkillAssessment = ({ userId }) => {
  const [skills, setSkills] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkillData();
  }, [userId]);

  const loadSkillData = async () => {
    // Mock data - in real app, this would come from API
    setSkills([
      { name: "JavaScript", level: "Advanced", progress: 85 },
      { name: "React", level: "Intermediate", progress: 65 },
      { name: "Python", level: "Beginner", progress: 30 },
      { name: "DSA", level: "Intermediate", progress: 60 },
      { name: "System Design", level: "Beginner", progress: 20 },
      { name: "TypeScript", level: "Beginner", progress: 15 },
      { name: "Node.js", level: "Intermediate", progress: 45 },
      { name: "Database Design", level: "Beginner", progress: 25 }
    ]);

    setLearningPaths([
      {
        title: "Frontend Mastery",
        description: "Become a React expert with TypeScript and modern CSS",
        steps: [
          { text: "Master TypeScript fundamentals", completed: false },
          { text: "Learn advanced React patterns", completed: false },
          { text: "Master CSS Grid and Flexbox", completed: true },
          { text: "Build 3 portfolio projects", completed: false }
        ]
      },
      {
        title: "Backend Development",
        description: "Learn server-side development with Node.js and databases",
        steps: [
          { text: "Learn Node.js fundamentals", completed: true },
          { text: "Master Express.js framework", completed: false },
          { text: "Learn database design", completed: false },
          { text: "Build RESTful APIs", completed: false }
        ]
      },
      {
        title: "System Design",
        description: "Master scalable system architecture and design patterns",
        steps: [
          { text: "Learn basic system design concepts", completed: false },
          { text: "Study common design patterns", completed: false },
          { text: "Practice with real-world scenarios", completed: false },
          { text: "Build scalable system projects", completed: false }
        ]
      }
    ]);

    setRecommendations([
      {
        title: "Focus on TypeScript",
        description: "Your JavaScript is strong, but TypeScript will make you more marketable",
        priority: "High"
      },
      {
        title: "Complete System Design Course",
        description: "This is crucial for senior-level positions",
        priority: "Medium"
      },
      {
        title: "Build Full-Stack Projects",
        description: "Combine your frontend and backend skills",
        priority: "High"
      }
    ]);

    setLoading(false);
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ 
            border: '4px solid #e0e7ff', 
            borderTop: '4px solid #6366f1', 
            borderRadius: '50%', 
            width: '50px', 
            height: '50px', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ color: '#6366f1', marginTop: '1rem' }}>Analyzing your skills...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Skill Assessment & Learning Paths</Title>
        <Subtitle>Track your progress and discover personalized learning recommendations</Subtitle>
      </Header>

      <Grid>
        <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <CardTitle>
            <FiStar />
            Your Skills Assessment
          </CardTitle>
          {skills.map((skill, index) => (
            <SkillItem key={index}>
              <div>
                <SkillName>{skill.name}</SkillName>
                <ProgressBar>
                  <ProgressFill percent={skill.progress} />
                </ProgressBar>
              </div>
              <SkillLevel level={skill.level}>{skill.level}</SkillLevel>
            </SkillItem>
          ))}
        </Card>

        <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <CardTitle>
            <FiTarget />
            Learning Paths
          </CardTitle>
          {learningPaths.map((path, index) => (
            <LearningPath key={index}>
              <PathTitle>{path.title}</PathTitle>
              <PathDescription>{path.description}</PathDescription>
              <PathSteps>
                {path.steps.map((step, stepIndex) => (
                  <Step key={stepIndex} completed={step.completed}>
                    <StepIcon completed={step.completed}>
                      {step.completed ? <FiCheckCircle /> : <FiClock />}
                    </StepIcon>
                    {step.text}
                  </Step>
                ))}
              </PathSteps>
            </LearningPath>
          ))}
        </Card>
      </Grid>

      <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <CardTitle>
          <FiTrendingUp />
          Personalized Recommendations
        </CardTitle>
        {recommendations.map((rec, index) => (
          <RecommendationCard key={index}>
            <RecTitle>{rec.title}</RecTitle>
            <RecDescription>{rec.description}</RecDescription>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ 
                color: rec.priority === 'High' ? '#dc2626' : '#f59e0b',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                Priority: {rec.priority}
              </span>
              <Button>Start Learning</Button>
            </div>
          </RecommendationCard>
        ))}
      </Card>
    </Container>
  );
};

export default SkillAssessment; 
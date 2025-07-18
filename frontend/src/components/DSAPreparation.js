import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiCode, FiCheckCircle, FiExternalLink, FiTrendingUp } from "react-icons/fi";
import { getDSAQuestions, completeQuestion, getDSARecommendations } from "../api.js";

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

const ProgressCard = styled.div`
  background: linear-gradient(90deg, #6366f1 60%, #3730a3 100%);
  color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ProgressNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
`;

const ProgressText = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const QuestionCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
  border-left: 4px solid ${props => {
    if (props.completed) return '#22c55e';
    if (props.difficulty === 'Easy') return '#22c55e';
    if (props.difficulty === 'Medium') return '#f59e0b';
    return '#ef4444';
  }};
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(99,102,241,0.15);
  }
`;

const QuestionTitle = styled.h4`
  color: #3730a3;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuestionMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const DifficultyBadge = styled.span`
  background: ${props => {
    if (props.difficulty === 'Easy') return '#22c55e';
    if (props.difficulty === 'Medium') return '#f59e0b';
    return '#ef4444';
  }};
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
`;

const CategoryBadge = styled.span`
  background: #6366f1;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
`;

const QuestionDescription = styled.p`
  color: #6366f1;
  margin: 0.5rem 0;
  line-height: 1.4;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
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
  
  &.success {
    background: #22c55e;
    color: white;
    &:hover {
      background: #16a34a;
    }
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid #6366f1;
  background: ${props => props.active ? '#6366f1' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6366f1'};
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #6366f1;
    color: white;
  }
`;

const RecommendationsSection = styled.div`
  margin-bottom: 2rem;
`;

const DSAPreparation = ({ userId, dsaRecommendations }) => {
  const [questions, setQuestions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  useEffect(() => {
    loadQuestions();
    if (userId) {
      loadRecommendations();
    }
  }, [userId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await getDSAQuestions(userId);
      setQuestions(response.questions);
      
      // Calculate progress
      const completed = response.questions.filter(q => q.completed).length;
      setProgress(completed);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const response = await getDSARecommendations(userId);
      setRecommendations(response.recommendations);
      setProgress(response.progress);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const handleCompleteQuestion = async (questionId) => {
    try {
      await completeQuestion(questionId, userId);
      await loadQuestions();
      await loadRecommendations();
    } catch (error) {
      console.error('Error completing question:', error);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filter === 'completed' && !q.completed) return false;
    if (filter === 'pending' && q.completed) return false;
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
    return true;
  });

  const openLeetCode = (url) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return <Container>Loading DSA questions...</Container>;
  }

  return (
    <Container>
      <SectionTitle>
        <FiCode size={24} />
        DSA Preparation
      </SectionTitle>

      <ProgressCard>
        <ProgressNumber>{progress}</ProgressNumber>
        <ProgressText>Questions Completed</ProgressText>
      </ProgressCard>

      {userId && recommendations.length > 0 && (
        <RecommendationsSection>
          <SectionTitle>
            <FiTrendingUp size={20} />
            Recommended for You
          </SectionTitle>
          {recommendations.map((question) => (
            <QuestionCard
              key={question.id}
              difficulty={question.difficulty}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <QuestionTitle>
                {question.title}
                {question.completed && <FiCheckCircle color="#22c55e" />}
              </QuestionTitle>
              <QuestionMeta>
                <DifficultyBadge difficulty={question.difficulty}>
                  {question.difficulty}
                </DifficultyBadge>
                <CategoryBadge>{question.category}</CategoryBadge>
              </QuestionMeta>
              <QuestionDescription>{question.description}</QuestionDescription>
              <ActionButtons>
                <Button 
                  className="primary"
                  onClick={() => openLeetCode(question.leetcode_url)}
                >
                  <FiExternalLink size={14} />
                  Practice on LeetCode
                </Button>
                {!question.completed && (
                  <Button 
                    className="success"
                    onClick={() => handleCompleteQuestion(question.id)}
                  >
                    <FiCheckCircle size={14} />
                    Mark Complete
                  </Button>
                )}
              </ActionButtons>
            </QuestionCard>
          ))}
        </RecommendationsSection>
      )}

      <FilterContainer>
        <FilterButton 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All Questions
        </FilterButton>
        <FilterButton 
          active={filter === 'pending'} 
          onClick={() => setFilter('pending')}
        >
          Pending
        </FilterButton>
        <FilterButton 
          active={filter === 'completed'} 
          onClick={() => setFilter('completed')}
        >
          Completed
        </FilterButton>
      </FilterContainer>

      <FilterContainer>
        <FilterButton 
          active={difficultyFilter === 'all'} 
          onClick={() => setDifficultyFilter('all')}
        >
          All Difficulties
        </FilterButton>
        <FilterButton 
          active={difficultyFilter === 'Easy'} 
          onClick={() => setDifficultyFilter('Easy')}
        >
          Easy
        </FilterButton>
        <FilterButton 
          active={difficultyFilter === 'Medium'} 
          onClick={() => setDifficultyFilter('Medium')}
        >
          Medium
        </FilterButton>
        <FilterButton 
          active={difficultyFilter === 'Hard'} 
          onClick={() => setDifficultyFilter('Hard')}
        >
          Hard
        </FilterButton>
      </FilterContainer>

      {filteredQuestions.map((question) => (
        <QuestionCard
          key={question.id}
          difficulty={question.difficulty}
          completed={question.completed}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <QuestionTitle>
            {question.title}
            {question.completed && <FiCheckCircle color="#22c55e" />}
          </QuestionTitle>
          <QuestionMeta>
            <DifficultyBadge difficulty={question.difficulty}>
              {question.difficulty}
            </DifficultyBadge>
            <CategoryBadge>{question.category}</CategoryBadge>
          </QuestionMeta>
          <QuestionDescription>{question.description}</QuestionDescription>
          <ActionButtons>
            <Button 
              className="primary"
              onClick={() => openLeetCode(question.leetcode_url)}
            >
              <FiExternalLink size={14} />
              Practice on LeetCode
            </Button>
            {!question.completed && (
              <Button 
                className="success"
                onClick={() => handleCompleteQuestion(question.id)}
              >
                <FiCheckCircle size={14} />
                Mark Complete
              </Button>
            )}
          </ActionButtons>
        </QuestionCard>
      ))}
    </Container>
  );
};

export default DSAPreparation; 
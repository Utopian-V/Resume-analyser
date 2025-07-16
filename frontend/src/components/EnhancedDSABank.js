import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiCode, FiCheckCircle, FiExternalLink, FiTrendingUp, FiBookOpen, FiTarget, FiBarChart3 } from "react-icons/fi";

const Container = styled.div`
  background: linear-gradient(120deg, #f5f7ff 60%, #e0e7ff 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  color: #3730a3;
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressCard = styled.div`
  background: linear-gradient(90deg, #6366f1 60%, #3730a3 100%);
  color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  min-width: 200px;
`;

const ProgressNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
`;

const ProgressText = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const CategoryTab = styled.button`
  padding: 0.8rem 1.5rem;
  border: 2px solid #6366f1;
  background: ${props => props.active ? '#6366f1' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6366f1'};
  border-radius: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    background: #6366f1;
    color: white;
  }
`;

const QuestionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const QuestionCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
  border-left: 4px solid ${props => {
    if (props.status === 'solved') return '#22c55e';
    if (props.status === 'attempted') return '#f59e0b';
    if (props.difficulty === 'Easy') return '#22c55e';
    if (props.difficulty === 'Medium') return '#f59e0b';
    return '#ef4444';
  }};
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(99,102,241,0.15);
  }
`;

const QuestionTitle = styled.h4`
  color: #3730a3;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuestionMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
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

const StatusBadge = styled.span`
  background: ${props => {
    if (props.status === 'solved') return '#22c55e';
    if (props.status === 'attempted') return '#f59e0b';
    return '#6366f1';
  }};
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
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
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
  
  &.success {
    background: #22c55e;
    color: white;
    &:hover {
      background: #16a34a;
    }
  }
  
  &.warning {
    background: #f59e0b;
    color: white;
    &:hover {
      background: #d97706;
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

// Enhanced DSA question data based on Google Sheets
const dsaQuestions = {
  "Arrays": [
    {
      id: "arr1",
      title: "Two Sum",
      difficulty: "Easy",
      description: "Find two numbers that add up to target",
      leetcode_url: "https://leetcode.com/problems/two-sum/",
      gfg_url: "https://practice.geeksforgeeks.org/problems/two-sum/1",
      status: "unsolved"
    },
    {
      id: "arr2",
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      description: "Find maximum profit from buying and selling stock",
      leetcode_url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      gfg_url: "https://practice.geeksforgeeks.org/problems/stock-buy-and-sell-1587115621/1",
      status: "unsolved"
    },
    {
      id: "arr3",
      title: "Contains Duplicate",
      difficulty: "Easy",
      description: "Check if array contains any duplicates",
      leetcode_url: "https://leetcode.com/problems/contains-duplicate/",
      gfg_url: "https://practice.geeksforgeeks.org/problems/contains-duplicate/1",
      status: "unsolved"
    }
  ],
  "Strings": [
    {
      id: "str1",
      title: "Valid Parentheses",
      difficulty: "Easy",
      description: "Check if parentheses are valid",
      leetcode_url: "https://leetcode.com/problems/valid-parentheses/",
      gfg_url: "https://practice.geeksforgeeks.org/problems/parenthesis-checker2744/1",
      status: "unsolved"
    },
    {
      id: "str2",
      title: "Valid Anagram",
      difficulty: "Easy",
      description: "Check if two strings are anagrams",
      leetcode_url: "https://leetcode.com/problems/valid-anagram/",
      gfg_url: "https://practice.geeksforgeeks.org/problems/anagram-1587115620/1",
      status: "unsolved"
    }
  ],
  "Linked Lists": [
    {
      id: "ll1",
      title: "Reverse Linked List",
      difficulty: "Easy",
      description: "Reverse a singly linked list",
      leetcode_url: "https://leetcode.com/problems/reverse-linked-list/",
      gfg_url: "https://practice.geeksforgeeks.org/problems/reverse-a-linked-list/1",
      status: "unsolved"
    },
    {
      id: "ll2",
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      description: "Merge two sorted linked lists",
      leetcode_url: "https://leetcode.com/problems/merge-two-sorted-lists/",
      gfg_url: "https://practice.geeksforgeeks.org/problems/merge-two-sorted-linked-lists/1",
      status: "unsolved"
    }
  ],
  "Trees": [
    {
      id: "tree1",
      title: "Maximum Depth of Binary Tree",
      difficulty: "Easy",
      description: "Find the maximum depth of a binary tree",
      leetcode_url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      gfg_url: "https://practice.geeksforgeeks.org/problems/height-of-binary-tree/1",
      status: "unsolved"
    },
    {
      id: "tree2",
      title: "Invert Binary Tree",
      difficulty: "Easy",
      description: "Invert a binary tree",
      leetcode_url: "https://leetcode.com/problems/invert-binary-tree/",
      gfg_url: "https://practice.geeksforgeeks.org/problems/mirror-tree/1",
      status: "unsolved"
    }
  ],
  "Dynamic Programming": [
    {
      id: "dp1",
      title: "Climbing Stairs",
      difficulty: "Easy",
      description: "Count ways to climb n stairs",
      leetcode_url: "https://leetcode.com/problems/climbing-stairs/",
      gfg_url: "https://practice.geeksforgeeks.org/problems/count-ways-to-reach-the-nth-stair-1587115620/1",
      status: "unsolved"
    },
    {
      id: "dp2",
      title: "Fibonacci Number",
      difficulty: "Easy",
      description: "Calculate nth Fibonacci number",
      leetcode_url: "https://leetcode.com/problems/fibonacci-number/",
      gfg_url: "https://practice.geeksforgeeks.org/problems/nth-fibonacci-number1335/1",
      status: "unsolved"
    }
  ]
};

const EnhancedDSABank = ({ userId }) => {
  const [selectedCategory, setSelectedCategory] = useState("Arrays");
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [userProgress, setUserProgress] = useState({});

  const categories = Object.keys(dsaQuestions);

  const updateQuestionStatus = (questionId, status) => {
    setUserProgress(prev => ({
      ...prev,
      [questionId]: status
    }));
  };

  const getFilteredQuestions = () => {
    let questions = dsaQuestions[selectedCategory] || [];
    
    if (statusFilter !== "all") {
      questions = questions.filter(q => userProgress[q.id] === statusFilter);
    }
    
    if (difficultyFilter !== "all") {
      questions = questions.filter(q => q.difficulty === difficultyFilter);
    }
    
    return questions;
  };

  const getOverallProgress = () => {
    const allQuestions = Object.values(dsaQuestions).flat();
    const solved = allQuestions.filter(q => userProgress[q.id] === "solved").length;
    const attempted = allQuestions.filter(q => userProgress[q.id] === "attempted").length;
    const total = allQuestions.length;
    
    return { solved, attempted, total, percentage: Math.round((solved / total) * 100) };
  };

  const progress = getOverallProgress();

  return (
    <Container>
      <Header>
        <Title>
          <FiCode size={24} />
          DSA Question Bank
        </Title>
        <ProgressCard>
          <ProgressNumber>{progress.solved}/{progress.total}</ProgressNumber>
          <ProgressText>Solved ({progress.percentage}%)</ProgressText>
        </ProgressCard>
      </Header>

      <CategoryTabs>
        {categories.map(category => (
          <CategoryTab
            key={category}
            active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </CategoryTab>
        ))}
      </CategoryTabs>

      <FilterContainer>
        <FilterButton 
          active={statusFilter === 'all'} 
          onClick={() => setStatusFilter('all')}
        >
          All Status
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'solved'} 
          onClick={() => setStatusFilter('solved')}
        >
          Solved
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'attempted'} 
          onClick={() => setStatusFilter('attempted')}
        >
          Attempted
        </FilterButton>
        <FilterButton 
          active={statusFilter === 'unsolved'} 
          onClick={() => setStatusFilter('unsolved')}
        >
          Unsolved
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

      <QuestionGrid>
        {getFilteredQuestions().map((question, index) => (
          <QuestionCard
            key={question.id}
            difficulty={question.difficulty}
            status={userProgress[question.id] || 'unsolved'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <QuestionTitle>
              {question.title}
              {userProgress[question.id] === 'solved' && <FiCheckCircle color="#22c55e" />}
            </QuestionTitle>
            
            <QuestionMeta>
              <DifficultyBadge difficulty={question.difficulty}>
                {question.difficulty}
              </DifficultyBadge>
              <StatusBadge status={userProgress[question.id] || 'unsolved'}>
                {userProgress[question.id] || 'unsolved'}
              </StatusBadge>
            </QuestionMeta>
            
            <QuestionDescription>{question.description}</QuestionDescription>
            
            <ActionButtons>
              <Button 
                className="primary"
                onClick={() => window.open(question.leetcode_url, '_blank')}
              >
                <FiExternalLink size={14} />
                LeetCode
              </Button>
              <Button 
                className="primary"
                onClick={() => window.open(question.gfg_url, '_blank')}
              >
                <FiBookOpen size={14} />
                GeeksforGeeks
              </Button>
              {userProgress[question.id] !== 'solved' && (
                <Button 
                  className="success"
                  onClick={() => updateQuestionStatus(question.id, 'solved')}
                >
                  <FiCheckCircle size={14} />
                  Mark Solved
                </Button>
              )}
              {userProgress[question.id] !== 'attempted' && userProgress[question.id] !== 'solved' && (
                <Button 
                  className="warning"
                  onClick={() => updateQuestionStatus(question.id, 'attempted')}
                >
                  <FiTarget size={14} />
                  Mark Attempted
                </Button>
              )}
            </ActionButtons>
          </QuestionCard>
        ))}
      </QuestionGrid>
    </Container>
  );
};

export default EnhancedDSABank; 
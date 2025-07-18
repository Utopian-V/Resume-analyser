import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiSearch, 
  FiFilter, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiPlus,
  FiFileText,
  FiTag,
  FiBarChart2
} from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #6366f1;
  font-size: 2rem;
  font-weight: 900;
  margin: 0;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &.primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
    }
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  
  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 3rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 10px;
    color: #e2e8f0;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #6366f1;
      background: rgba(255, 255, 255, 0.1);
    }
    
    &::placeholder {
      color: #64748b;
    }
  }
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6366f1;
  }
`;

const FilterSelect = styled.select`
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
  
  option {
    background: #1e293b;
    color: #e2e8f0;
  }
`;

const QuestionGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const QuestionCard = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: all 0.2s;
  
  &:hover {
    border-color: #6366f1;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.1);
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const QuestionTitle = styled.h3`
  color: #e2e8f0;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
`;

const QuestionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 6px;
  padding: 0.5rem;
  color: #a5b4fc;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    color: white;
  }
  
  &.danger:hover {
    background: #ef4444;
    border-color: #ef4444;
  }
`;

const QuestionMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #a5b4fc;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const QuestionContent = styled.div`
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const QuestionTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const DifficultyBadge = styled.span`
  background: ${props => {
    switch (props.difficulty) {
      case 'easy': return 'rgba(34, 197, 94, 0.2)';
      case 'medium': return 'rgba(245, 158, 11, 0.2)';
      case 'hard': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(156, 163, 175, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.difficulty) {
      case 'easy': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#9ca3af';
    }
  }};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(99, 102, 241, 0.2);
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #a5b4fc;
  font-size: 0.9rem;
`;

export default function QuestionManagement() {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: 'Find the missing number in the sequence',
      content: 'What is the missing number in the sequence: 2, 4, 8, 16, __, 64?',
      type: 'aptitude',
      difficulty: 'medium',
      category: 'Number Series',
      tags: ['sequence', 'pattern', 'numbers'],
      stats: {
        attempts: 156,
        successRate: '78%',
        avgTime: '2.3min'
      }
    },
    {
      id: 2,
      title: 'Reverse a linked list',
      content: 'Write a function to reverse a singly linked list in-place.',
      type: 'dsa',
      difficulty: 'easy',
      category: 'Linked List',
      tags: ['linked-list', 'pointers', 'recursion'],
      stats: {
        attempts: 89,
        successRate: '65%',
        avgTime: '4.1min'
      }
    },
    {
      id: 3,
      title: 'Maximum subarray sum',
      content: 'Find the contiguous subarray with the largest sum (Kadane\'s algorithm).',
      type: 'dsa',
      difficulty: 'hard',
      category: 'Dynamic Programming',
      tags: ['dp', 'arrays', 'optimization'],
      stats: {
        attempts: 234,
        successRate: '45%',
        avgTime: '6.8min'
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || question.type === typeFilter;
    const matchesDifficulty = difficultyFilter === 'all' || question.difficulty === difficultyFilter;
    return matchesSearch && matchesType && matchesDifficulty;
  });

  const handleEdit = (questionId) => {
    console.log('Edit question:', questionId);
  };

  const handleDelete = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    }
  };

  const handleView = (questionId) => {
    console.log('View question:', questionId);
  };

  return (
    <Container>
      <Header>
        <Title>Question Management</Title>
        <Button className="primary">
          <FiPlus />
          Add New Question
        </Button>
      </Header>

      <SearchBar>
        <SearchInput>
          <FiSearch />
          <input
            type="text"
            placeholder="Search questions by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        <FilterSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="aptitude">Aptitude</option>
          <option value="dsa">DSA</option>
        </FilterSelect>
        <FilterSelect value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </FilterSelect>
      </SearchBar>

      <QuestionGrid>
        {filteredQuestions.map(question => (
          <QuestionCard key={question.id}>
            <QuestionHeader>
              <QuestionTitle>{question.title}</QuestionTitle>
              <QuestionActions>
                <ActionButton onClick={() => handleView(question.id)}>
                  <FiEye size={16} />
                </ActionButton>
                <ActionButton onClick={() => handleEdit(question.id)}>
                  <FiEdit size={16} />
                </ActionButton>
                <ActionButton className="danger" onClick={() => handleDelete(question.id)}>
                  <FiTrash2 size={16} />
                </ActionButton>
              </QuestionActions>
            </QuestionHeader>

            <QuestionMeta>
              <MetaItem>
                <FiFileText size={14} />
                {question.type.toUpperCase()}
              </MetaItem>
              <MetaItem>
                <FiTag size={14} />
                {question.category}
              </MetaItem>
              <DifficultyBadge difficulty={question.difficulty}>
                {question.difficulty}
              </DifficultyBadge>
            </QuestionMeta>

            <QuestionContent>{question.content}</QuestionContent>

            <QuestionTags>
              {question.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </QuestionTags>

            <Stats>
              <Stat>
                <FiBarChart2 size={14} />
                {question.stats.attempts} attempts
              </Stat>
              <Stat>
                <FiBarChart2 size={14} />
                {question.stats.successRate} success rate
              </Stat>
              <Stat>
                <FiBarChart2 size={14} />
                {question.stats.avgTime} avg time
              </Stat>
            </Stats>
          </QuestionCard>
        ))}
      </QuestionGrid>
    </Container>
  );
} 
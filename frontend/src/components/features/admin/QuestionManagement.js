import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #6366f1;
  margin-bottom: 2rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  background: #334155;
  border: 1px solid #475569;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  background: #334155;
  border: 1px solid #475569;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
  
  option {
    background: #1e293b;
    color: #fff;
  }
`;

const QuestionGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const QuestionCard = styled.div`
  background: #1e293b;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #334155;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const QuestionTitle = styled.h3`
  color: #fff;
  margin: 0;
  flex: 1;
`;

const QuestionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: #475569;
  border: 1px solid #64748b;
  border-radius: 4px;
  padding: 0.5rem;
  color: #fff;
  cursor: pointer;
  
  &:hover {
    background: #6366f1;
  }
  
  &.danger:hover {
    background: #ef4444;
  }
`;

const QuestionMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #94a3b8;
`;

const DifficultyBadge = styled.span`
  background: ${props => {
    switch (props.difficulty) {
      case 'easy': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#64748b';
    }
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
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
  background: #6366f1;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #334155;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #94a3b8;
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
      <Title>Question Management</Title>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search questions by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
                  View
                </ActionButton>
                <ActionButton onClick={() => handleEdit(question.id)}>
                  Edit
                </ActionButton>
                <ActionButton className="danger" onClick={() => handleDelete(question.id)}>
                  Delete
                </ActionButton>
              </QuestionActions>
            </QuestionHeader>

            <QuestionMeta>
              <span>Type: {question.type.toUpperCase()}</span>
              <span>Category: {question.category}</span>
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
                📊 {question.stats.attempts} attempts
              </Stat>
              <Stat>
                ✅ {question.stats.successRate} success rate
              </Stat>
              <Stat>
                ⏱️ {question.stats.avgTime} avg time
              </Stat>
            </Stats>
          </QuestionCard>
        ))}
      </QuestionGrid>
    </Container>
  );
} 
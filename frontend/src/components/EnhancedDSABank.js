import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiCode, FiCheckCircle, FiExternalLink, FiTrendingUp, FiBookOpen, FiTarget, FiBarChart3 } from "react-icons/fi";
import { parseCSV } from "../utils/csv";

const csvUrl = require('../data/dsa_questions.csv');

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

const MobileContainer = styled.div`
  @media (max-width: 700px) {
    padding: 0.5rem;
    font-size: 0.98rem;
    button, input, select {
      font-size: 1rem;
      padding: 0.5rem 0.7rem;
    }
    div[role='tablist'] {
      flex-direction: column;
    }
  }
`;

const EnhancedDSABank = ({ userId }) => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    fetch(csvUrl)
      .then(res => res.text())
      .then(text => {
        const parsed = parseCSV(text);
        setQuestions(parsed);
        const cats = Array.from(new Set(parsed.map(q => q.category)));
        setCategories(cats);
        setSelectedCategory(cats[0] || '');
      });
  }, []);

  const updateQuestionStatus = (title, status) => {
    setUserProgress(prev => ({ ...prev, [title]: status }));
  };

  const filteredQuestions = questions.filter(q =>
    (selectedCategory ? q.category === selectedCategory : true) &&
    (statusFilter === 'all' ? true : (userProgress[q.title] || q.status) === statusFilter) &&
    (search ? q.title.toLowerCase().includes(search.toLowerCase()) : true)
  );

  return (
    <MobileContainer>
      <div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ fontWeight: selectedCategory === cat ? 'bold' : 'normal' }}>{cat}</button>
          ))}
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginLeft: 16 }} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="unsolved">Unsolved</option>
            <option value="solved">Solved</option>
            <option value="attempted">Attempted</option>
          </select>
        </div>
        <div>
          {filteredQuestions.map(q => (
            <div key={q.title} style={{ border: '1px solid #eee', borderRadius: 8, margin: 8, padding: 12 }}>
              <div style={{ fontWeight: 600 }}>{q.title}</div>
              <div style={{ fontSize: 13, color: '#555' }}>{q.brief}</div>
              <a href={q.link} target="_blank" rel="noopener noreferrer">Link</a>
              <div style={{ marginTop: 8 }}>
                <button onClick={() => updateQuestionStatus(q.title, 'solved')}>Mark Solved</button>
                <button onClick={() => updateQuestionStatus(q.title, 'attempted')}>Mark Attempted</button>
              </div>
              <div>Status: {userProgress[q.title] || q.status}</div>
            </div>
          ))}
        </div>
      </div>
    </MobileContainer>
  );
};

export default EnhancedDSABank; 
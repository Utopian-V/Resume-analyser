import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiX } from 'react-icons/fi';

const Container = styled.div`
  background: linear-gradient(120deg, #f5f7ff 60%, #e0e7ff 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const InstructionsModal = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.15);
`;

const Timer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #6366f1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
`;

const QuestionCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  margin: 1rem 0;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
`;

const Option = styled.button`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  border: 2px solid #e0e7ff;
  border-radius: 0.5rem;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #6366f1;
  }
  
  &.selected {
    background: #6366f1;
    color: white;
    border-color: #6366f1;
  }
`;

const Button = styled.button`
  background: #6366f1;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  margin: 0.5rem;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #4f46e5;
  }
`;

const AptitudeTest = () => {
  const [test, setTest] = useState(null);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchTest();
  }, []);

  useEffect(() => {
    let timer;
    if (started && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && started) {
      submitTest();
    }
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const fetchTest = async () => {
    try {
      const response = await fetch('/api/aptitude/tests/test1');
      const data = await response.json();
      setTest(data);
      setTimeLeft(data.duration * 60);
    } catch (error) {
      console.error('Error fetching test:', error);
    }
  };

  const startTest = () => {
    setStarted(true);
  };

  const selectAnswer = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const submitTest = async () => {
    try {
      const response = await fetch('/api/aptitude/test/test1/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          answers,
          user_id: 'test-user' // Replace with actual user ID from auth
        })
      });
      const results = await response.json();
      setResults(results);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  if (!test) return <div>Loading...</div>;

  if (!started) {
    return (
      <Container>
        <InstructionsModal
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>{test.title}</h2>
          <ul>
            {test.instructions.map((instruction, i) => (
              <li key={i}>{instruction}</li>
            ))}
          </ul>
          <Button onClick={startTest}>Start Test</Button>
        </InstructionsModal>
      </Container>
    );
  }

  if (results) {
    return (
      <Container>
        <h2>Test Results</h2>
        <div>Score: {results.percentage.toFixed(2)}%</div>
        <div>
          {results.passed ? (
            <div style={{color: '#22c55e'}}>
              <FiCheckCircle /> Passed
            </div>
          ) : (
            <div style={{color: '#ef4444'}}>
              <FiX /> Failed
            </div>
          )}
        </div>
      </Container>
    );
  }

  const question = test.questions[currentQuestion];

  return (
    <Container>
      <Timer>
        <FiClock />
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
      </Timer>

      <QuestionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3>Question {currentQuestion + 1}/{test.questions.length}</h3>
        <p>{question.question_text}</p>
        <div>
          {question.options.map(option => (
            <Option
              key={option.id}
              className={answers[question.id] === option.id ? 'selected' : ''}
              onClick={() => selectAnswer(question.id, option.id)}
            >
              ({option.id.toUpperCase()}) {option.text}
            </Option>
          ))}
        </div>
      </QuestionCard>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <Button 
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(c => c - 1)}
        >
          Previous
        </Button>
        {currentQuestion === test.questions.length - 1 ? (
          <Button onClick={submitTest}>Submit Test</Button>
        ) : (
          <Button onClick={() => setCurrentQuestion(c => c + 1)}>Next</Button>
        )}
      </div>
    </Container>
  );
};

export default AptitudeTest;

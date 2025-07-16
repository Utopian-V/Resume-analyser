import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiX, FiAlertCircle } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  text-align: center;
  color: #6366f1;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.15);
`;

const Timer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #6366f1;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  box-shadow: 0 2px 12px rgba(99,102,241,0.2);
  z-index: 100;
`;

const Instructions = styled.ul`
  margin: 1.5rem 0;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.75rem;
    color: #4b5563;
  }
`;

const Button = styled.button`
  background: #6366f1;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #4f46e5;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuestionCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  margin: 1rem 0;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);

  h3 {
    color: #374151;
    margin-bottom: 1rem;
  }

  p {
    color: #4b5563;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
`;

const Option = styled.button`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;
  
  &:hover:not(.selected) {
    border-color: #6366f1;
    background: #f5f7ff;
  }
  
  &.selected {
    background: #6366f1;
    color: white;
    border-color: #6366f1;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
`;

const ResultCard = styled(Card)`
  text-align: center;

  h2 {
    color: #374151;
    margin-bottom: 1.5rem;
  }

  .score {
    font-size: 2rem;
    font-weight: 700;
    color: #6366f1;
    margin-bottom: 1rem;
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 2rem;

    &.passed {
      color: #22c55e;
    }

    &.failed {
      color: #ef4444;
    }
  }
`;

const AptitudeTest = () => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setTimeLeft(t => {
          if (t <= 1) {
            submitTest();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/aptitude/test/test1');
      if (!response.ok) {
        throw new Error('Failed to fetch test');
      }
      const data = await response.json();
      setTest(data);
      setTimeLeft(data.duration * 60);
      setError(null);
    } catch (error) {
      setError('Failed to load the test. Please try again.');
      console.error('Error fetching test:', error);
    } finally {
      setLoading(false);
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
      
      if (!response.ok) {
        throw new Error('Failed to submit test');
      }
      
      const results = await response.json();
      setResults(results);
    } catch (error) {
      setError('Failed to submit test. Please try again.');
      console.error('Error submitting test:', error);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div>Loading test...</div>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Container>
        <Card>
          <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiAlertCircle />
            {error}
          </div>
          <Button onClick={fetchTest} style={{ marginTop: '1rem' }}>
            Try Again
          </Button>
        </Card>
      </Container>
    );
  }

  if (!test) return null;

  if (!started) {
    return (
      <Container>
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>{test.title}</h2>
          <Instructions>
            {test.instructions.map((instruction, i) => (
              <li key={i}>{instruction}</li>
            ))}
          </Instructions>
          <Button onClick={startTest}>Start Test</Button>
        </Card>
      </Container>
    );
  }

  if (results) {
    return (
      <Container>
        <ResultCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Test Results</h2>
          <div className="score">{results.percentage.toFixed(1)}%</div>
          <div className={`status ${results.passed ? 'passed' : 'failed'}`}>
            {results.passed ? (
              <>
                <FiCheckCircle /> Passed
              </>
            ) : (
              <>
                <FiX /> Failed
              </>
            )}
          </div>
          <div>
            <p>Score: {results.score} out of {results.total_possible} points</p>
          </div>
        </ResultCard>
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
        key={question.id}
      >
        <h3>Question {currentQuestion + 1} of {test.questions.length}</h3>
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

        <NavigationButtons>
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
        </NavigationButtons>
      </QuestionCard>
    </Container>
  );
};

export default AptitudeTest;

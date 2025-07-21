import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FiClock, FiCheckCircle, FiAlertCircle, FiPlay, FiUser, FiCalendar } from 'react-icons/fi';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  background: rgba(30,41,59,0.95);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.13);
  padding: 2.5rem 2rem;
  color: #e2e8f0;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 2rem;
  color: #6366f1;
`;

const Subtitle = styled.h3`
  text-align: center;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #94a3b8;
`;

const Card = styled.div`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? 'transparent' : 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)'};
  color: #fff;
  border: ${props => props.variant === 'secondary' ? '2px solid #6366f1' : 'none'};
  border-radius: 0.8rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0.5rem;
  
  &:hover {
    background: ${props => props.variant === 'secondary' ? 'rgba(99, 102, 241, 0.1)' : 'linear-gradient(90deg, #4f46e5 0%, #3730a3 100%)'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Question = styled.div`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #fff;
  line-height: 1.6;
`;

const Option = styled.button`
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 1rem 1.5rem;
  border-radius: 0.8rem;
  border: 2px solid ${({ selected }) => (selected ? '#6366f1' : 'rgba(99, 102, 241, 0.3)')};
  background: ${({ selected }) => (selected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)')};
  color: ${({ selected }) => (selected ? '#fff' : '#e2e8f0')};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  
  &:hover {
    background: ${({ selected }) => (selected ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.1)')};
    border-color: #6366f1;
  }
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.8rem;
  padding: 0.8rem 1.5rem;
  color: #ef4444;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const TestInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 0.8rem;
  color: #6366f1;
  font-weight: 600;
`;

const TermsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const TermsItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  color: #94a3b8;
  font-size: 0.95rem;
  
  &:before {
    content: "•";
    color: #6366f1;
    font-weight: bold;
    margin-top: 0.1rem;
  }
`;

const ResultCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 1rem;
  margin-bottom: 2rem;
`;

const Score = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: #22c55e;
  margin-bottom: 1rem;
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;

const QuestionNav = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const QuestionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${props => {
    if (props.current) return '#6366f1';
    if (props.answered) return '#22c55e';
    return 'rgba(99, 102, 241, 0.3)';
  }};
  background: ${props => {
    if (props.current) return 'rgba(99, 102, 241, 0.2)';
    if (props.answered) return 'rgba(34, 197, 94, 0.2)';
    return 'transparent';
  }};
  color: ${props => {
    if (props.current) return '#6366f1';
    if (props.answered) return '#22c55e';
    return '#94a3b8';
  }};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

// Test data - in a real app, this would come from the backend
const testData = {
  id: "aptitude_test_1",
  title: "General Aptitude Assessment",
  duration: 30, // minutes
  totalQuestions: 25,
  instructions: [
    "This test contains 25 multiple-choice questions",
    "You have 30 minutes to complete the test",
    "Each question has only one correct answer",
    "You can navigate between questions using the question buttons",
    "Once you submit, you cannot change your answers",
    "Ensure you have a stable internet connection",
    "Do not refresh the page during the test"
  ],
  terms: [
    "By taking this test, you agree to complete it honestly and independently",
    "You will not use any external resources or assistance",
    "Your test results will be stored for analysis and improvement",
    "You can retake the test after 24 hours",
    "Test results are for educational purposes only",
    "We respect your privacy and will not share your results without consent"
  ],
  questions: [
    {
      id: "q1",
      question: "If a train travels at 60 km/h, how long will it take to travel 180 km?",
      options: [
        { id: "a", text: "2 hours" },
        { id: "b", text: "3 hours" },
        { id: "c", text: "4 hours" },
        { id: "d", text: "5 hours" }
      ],
      correct_answer: "b"
    },
    {
      id: "q2",
      question: "What is 15% of 200?",
      options: [
        { id: "a", text: "20" },
        { id: "b", text: "25" },
        { id: "c", text: "30" },
        { id: "d", text: "35" }
      ],
      correct_answer: "c"
    },
    {
      id: "q3",
      question: "If 3 workers can complete a task in 6 days, how many days will it take 2 workers to complete the same task?",
      options: [
        { id: "a", text: "4 days" },
        { id: "b", text: "6 days" },
        { id: "c", text: "9 days" },
        { id: "d", text: "12 days" }
      ],
      correct_answer: "c"
    },
    {
      id: "q4",
      question: "What is the next number in the sequence: 2, 6, 12, 20, 30, ?",
      options: [
        { id: "a", text: "40" },
        { id: "b", text: "42" },
        { id: "c", text: "44" },
        { id: "d", text: "46" }
      ],
      correct_answer: "b"
    },
    {
      id: "q5",
      question: "A shopkeeper marks his goods 20% above cost price and gives a discount of 10%. What is his profit percentage?",
      options: [
        { id: "a", text: "8%" },
        { id: "b", text: "10%" },
        { id: "c", text: "12%" },
        { id: "d", text: "15%" }
      ],
      correct_answer: "a"
    }
  ]
};

export default function AptitudeTest() {
  const [testState, setTestState] = useState('welcome'); // welcome, instructions, terms, test, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(testData.duration * 60); // in seconds
  const [testStartTime, setTestStartTime] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (testState === 'test' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testState, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setTestState('instructions');
  };

  const handleAcceptTerms = () => {
    if (agreedToTerms) {
      setTestState('test');
      setTestStartTime(new Date());
    }
  };

  const handleSelectAnswer = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitTest = () => {
    setTestState('results');
  };

  const handleRetakeTest = () => {
    setTestState('welcome');
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(testData.duration * 60);
    setTestStartTime(null);
    setAgreedToTerms(false);
  };

  const calculateScore = () => {
    const correctAnswers = testData.questions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.correct_answer ? 1 : 0);
    }, 0);
    return {
      correct: correctAnswers,
      total: testData.questions.length,
      percentage: Math.round((correctAnswers / testData.questions.length) * 100)
    };
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return "Excellent! You have exceptional aptitude skills! 🚀";
    if (percentage >= 80) return "Great job! You have strong aptitude skills! 🎉";
    if (percentage >= 70) return "Good work! You have solid aptitude skills! 👍";
    if (percentage >= 60) return "Not bad! Keep practicing to improve! 💪";
    return "Keep practicing! Focus on the areas you found challenging! 📚";
  };

  // Welcome Screen
  if (testState === 'welcome') {
    return (
      <Container>
        <Helmet>
          <title>Free Aptitude Test Online | Prep Nexus</title>
          <meta name="description" content="Take a free, time-bound aptitude test with instant results. Practice for your next job interview with Prep Nexus." />
          <link rel="canonical" href="https://resume-review-ai.netlify.app/aptitude-test" />
        </Helmet>
        
        <Title>🎯 Aptitude Assessment</Title>
        <Subtitle>Test your logical reasoning and problem-solving skills</Subtitle>
        
        <Card>
          <TestInfo>
            <InfoItem>
              <FiClock />
              <span>{testData.duration} minutes</span>
            </InfoItem>
            <InfoItem>
              <FiUser />
              <span>{testData.totalQuestions} questions</span>
            </InfoItem>
            <InfoItem>
              <FiCheckCircle />
              <span>Instant results</span>
            </InfoItem>
            <InfoItem>
              <FiCalendar />
              <span>Free retake after 24h</span>
            </InfoItem>
          </TestInfo>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Button onClick={handleStartTest}>
              <FiPlay style={{ marginRight: '0.5rem' }} />
              Start Test
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  // Instructions Screen
  if (testState === 'instructions') {
    return (
      <Container>
        <Title>📋 Test Instructions</Title>
        
        <Card>
          <h3 style={{ color: '#6366f1', marginBottom: '1rem' }}>Before you begin:</h3>
          <TermsList>
            {testData.instructions.map((instruction, index) => (
              <TermsItem key={index}>{instruction}</TermsItem>
            ))}
          </TermsList>
          
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Button onClick={() => setTestState('terms')}>
              Continue to Terms
            </Button>
            <Button variant="secondary" onClick={() => setTestState('welcome')}>
              Go Back
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  // Terms Screen
  if (testState === 'terms') {
    return (
      <Container>
        <Title>📜 Terms & Conditions</Title>
        
        <Card>
          <h3 style={{ color: '#6366f1', marginBottom: '1rem' }}>Please read and accept:</h3>
          <TermsList>
            {testData.terms.map((term, index) => (
              <TermsItem key={index}>{term}</TermsItem>
            ))}
          </TermsList>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span>I have read and agree to the terms and conditions</span>
            </label>
            
            <Button onClick={handleAcceptTerms} disabled={!agreedToTerms}>
              Start Test Now
            </Button>
            <Button variant="secondary" onClick={() => setTestState('instructions')}>
              Go Back
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  // Test Screen
  if (testState === 'test') {
    const question = testData.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / testData.questions.length) * 100;
    const answeredQuestions = Object.keys(answers).length;

    return (
      <Container>
        <Title>{testData.title}</Title>
        
        <Timer>
          <FiClock />
          Time Remaining: {formatTime(timeLeft)}
        </Timer>
        
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.9rem', color: '#94a3b8' }}>
          <span>Question {currentQuestion + 1} of {testData.questions.length}</span>
          <span>{answeredQuestions} answered</span>
        </div>
        
        <Question>
          <strong>Q{currentQuestion + 1}:</strong> {question.question}
        </Question>
        
        <div>
          {question.options.map(option => (
            <Option
              key={option.id}
              selected={answers[question.id] === option.id}
              onClick={() => handleSelectAnswer(question.id, option.id)}
            >
              <strong>({option.id.toUpperCase()})</strong> {option.text}
            </Option>
          ))}
        </div>
        
        <QuestionNav>
          {testData.questions.map((q, index) => (
            <QuestionButton
              key={q.id}
              current={index === currentQuestion}
              answered={answers[q.id]}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </QuestionButton>
          ))}
        </QuestionNav>
        
        <Nav>
          <Button
            variant="secondary"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          
          <div>
            {currentQuestion === testData.questions.length - 1 ? (
              <Button onClick={handleSubmitTest}>
                Submit Test
              </Button>
            ) : (
              <Button onClick={() => setCurrentQuestion(Math.min(testData.questions.length - 1, currentQuestion + 1))}>
                Next
              </Button>
            )}
          </div>
        </Nav>
      </Container>
    );
  }

  // Results Screen
  if (testState === 'results') {
    const score = calculateScore();
    
    return (
      <Container>
        <Title>🎉 Test Results</Title>
        
        <ResultCard>
          <Score>{score.percentage}%</Score>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            {score.correct} out of {score.total} questions correct
          </div>
          <div style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            {getPerformanceMessage(score.percentage)}
          </div>
        </ResultCard>
        
        <Card>
          <h3 style={{ color: '#6366f1', marginBottom: '1rem' }}>Question Review:</h3>
          {testData.questions.map((q, index) => (
            <div key={q.id} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Q{index + 1}:</strong> {q.question}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                Your answer: <span style={{ color: answers[q.id] === q.correct_answer ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>
                  {answers[q.id] ? q.options.find(o => o.id === answers[q.id])?.text : 'Not answered'}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                Correct answer: <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
                  {q.options.find(o => o.id === q.correct_answer)?.text}
                </span>
              </div>
            </div>
          ))}
        </Card>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Button onClick={handleRetakeTest}>
            Take Test Again
          </Button>
        </div>
      </Container>
    );
  }

  return null;
}
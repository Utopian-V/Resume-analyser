import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiX, FiAlertCircle, FiBarChart2 } from 'react-icons/fi';
import { getAptitudeTest, submitAptitudeTest, getAptitudeLeaderboard } from '../api';

const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.15);
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  text-align: center;
  color: #6366f1;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #e0e7ff;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin-bottom: 2rem;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const LoadingSubtext = styled.div`
  color: #6b7280;
  font-size: 1rem;
`;

const Timer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: #6366f1;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 20px rgba(99,102,241,0.3);
  z-index: 100;
  min-width: 120px;
  justify-content: center;
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
  padding: 3rem;
  border-radius: 1.2rem;
  margin: 1rem 0;
  box-shadow: 0 4px 20px rgba(99,102,241,0.12);
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    color: #374151;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
  }

  p {
    color: #4b5563;
    font-size: 1.3rem;
    margin-bottom: 2.5rem;
    line-height: 1.6;
  }
`;

const Option = styled.button`
  width: 100%;
  padding: 1.5rem;
  margin: 0.8rem 0;
  border: 2px solid #e5e7eb;
  border-radius: 0.8rem;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
  color: #374151;
  font-size: 1.1rem;
  
  &:hover:not(.selected) {
    border-color: #6366f1;
    background: #f5f7ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99,102,241,0.15);
  }
  
  &.selected {
    background: #6366f1;
    color: white;
    border-color: #6366f1;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
`;

const ResultCard = styled(motion.div)`
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

const ProgressBar = styled.div`
  width: 100%;
  background: #e0e7ff;
  border-radius: 0.5rem;
  height: 12px;
  margin-bottom: 1.5rem;
  overflow: hidden;
`;
const Progress = styled.div`
  height: 100%;
  background: #6366f1;
  width: ${props => props.percent}%;
  transition: width 0.4s cubic-bezier(.4,2,.3,1);
`;

const ReviewCard = styled(motion.div)`
  text-align: left;
  h3 { color: #6366f1; margin-bottom: 1rem; }
  ul { padding-left: 1.5rem; }
`;

const LeaderboardButton = styled(Button)`
  background: #22c55e;
  margin-top: 1.5rem;
  &:hover { background: #16a34a; }
`;

const LeaderboardModal = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30,41,59,0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LeaderboardCard = styled.div`
  background: white;
  border-radius: 1.2rem;
  padding: 2.5rem 2rem 2rem 2rem;
  min-width: 350px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(99,102,241,0.18);
  text-align: center;
`;
const LeaderboardTitle = styled.h2`
  color: #6366f1;
  margin-bottom: 1.5rem;
`;
const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
  th, td { padding: 0.7rem 0.5rem; }
  th { background: #f3f4f6; color: #6366f1; font-weight: 700; }
  td { border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) td { background: #f8fafc; }
`;
const CloseButton = styled(Button)`
  background: #ef4444;
  margin-top: 1rem;
  &:hover { background: #dc2626; }
`;

const AptitudeTest = ({ userId }) => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [review, setReview] = useState(false);
  const [results, setResults] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState(null);
  const [testLoaded, setTestLoaded] = useState(false); // Cache flag

  useEffect(() => {
    if (!testLoaded) {
      fetchTest();
    }
  }, [testLoaded]);

  useEffect(() => {
    let timer;
    if (started && timeLeft > 0 && !review && !results) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleSubmit();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, timeLeft, review, results]);

  useEffect(() => {
    if (showLeaderboard) fetchLeaderboard();
    // eslint-disable-next-line
  }, [showLeaderboard]);

  const fetchTest = async () => {
    if (testLoaded) return; // Skip if already loaded
    
    try {
      setLoading(true);
      setError(null);
      const data = await getAptitudeTest('test1');
      if (!data || !data.questions) {
        throw new Error('Invalid test data received');
      }
      setTest(data);
      setTimeLeft(data.duration * 60);
      setTestLoaded(true); // Mark test as loaded
    } catch (error) {
      setError(`Failed to load the test: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    setStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setReview(false);
    setResults(null);
  };

  const selectAnswer = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleReview = () => {
    setReview(true);
  };

  const handleEdit = () => {
    setReview(false);
  };

  const handleSubmit = async () => {
    if (!userId) {
      setError('User not logged in.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await submitAptitudeTest('test1', answers, userId);
      setResults(res);
    } catch (error) {
      setError('Failed to submit test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    setLeaderboardError(null);
    try {
      const data = await getAptitudeLeaderboard('test1');
      setLeaderboard(data.leaderboard || []);
    } catch (err) {
      setLeaderboardError('Failed to load leaderboard.');
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // --- UI Renders ---
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading your aptitude test...</LoadingText>
        <LoadingSubtext>Preparing 20 comprehensive questions for you</LoadingSubtext>
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
          <Button onClick={fetchTest} style={{ marginTop: '1rem' }}>Try Again</Button>
        </Card>
      </Container>
    );
  }
  if (!test) return null;
  if (!started) {
    return (
      <Container>
        <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
        <ResultCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2>Test Results</h2>
          <div className="score">{results.percentage.toFixed(1)}%</div>
          <div className={`status ${results.passed ? 'passed' : 'failed'}`}>{results.passed ? (<><FiCheckCircle /> Passed</>) : (<><FiX /> Failed</>)}</div>
          <div><p>Score: {results.score} out of {results.total_possible} points</p></div>
          <h3>Detailed Feedback</h3>
          <ul style={{ textAlign: 'left', margin: '1.5rem auto', maxWidth: 600 }}>
            {results.results.map((r, i) => (
              <li key={r.question_id} style={{ marginBottom: '1.2rem', background: r.is_correct ? '#dcfce7' : '#fee2e2', borderRadius: 8, padding: 12 }}>
                <b>Q{i+1}:</b> {r.question_text}<br/>
                <span style={{ color: r.is_correct ? '#16a34a' : '#991b1b', fontWeight: 600 }}>{r.is_correct ? 'Correct' : 'Incorrect'}</span><br/>
                <span>Your answer: <b>{r.user_answer ? r.user_answer.toUpperCase() : '—'}</b></span> | <span>Correct: <b>{r.correct_answer.toUpperCase()}</b></span><br/>
                {r.explanation && <span style={{ color: '#6366f1' }}>Explanation: {r.explanation}</span>}
              </li>
            ))}
          </ul>
          <LeaderboardButton onClick={() => setShowLeaderboard(true)}><FiBarChart2 /> View Leaderboard</LeaderboardButton>
        </ResultCard>
        {showLeaderboard && (
          <LeaderboardModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLeaderboard(false)}
          >
            <LeaderboardCard onClick={e => e.stopPropagation()}>
              <LeaderboardTitle>Leaderboard</LeaderboardTitle>
              {leaderboardLoading ? (
                <div>Loading...</div>
              ) : leaderboardError ? (
                <div style={{ color: '#ef4444' }}>{leaderboardError}</div>
              ) : (
                <LeaderboardTable>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>User</th>
                      <th>Score</th>
                      <th>Percent</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.length === 0 ? (
                      <tr><td colSpan={5} style={{ color: '#9ca3af' }}>No entries yet.</td></tr>
                    ) : leaderboard.map((entry, i) => (
                      <tr key={entry.user_id + entry.date} style={{ fontWeight: entry.user_id === userId ? 700 : 400, color: entry.user_id === userId ? '#6366f1' : undefined }}>
                        <td>{i + 1}</td>
                        <td>{entry.user_name || entry.user_id.slice(0, 8)}</td>
                        <td>{entry.score}</td>
                        <td>{entry.percentage?.toFixed(1)}%</td>
                        <td>{entry.date ? new Date(entry.date).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </LeaderboardTable>
              )}
              <CloseButton onClick={() => setShowLeaderboard(false)}>Close</CloseButton>
            </LeaderboardCard>
          </LeaderboardModal>
        )}
      </Container>
    );
  }
  if (review) {
    // Review screen before submission
    return (
      <Container>
        <ReviewCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3>Review Your Answers</h3>
          <ul>
            {test.questions.map((q, i) => (
              <li key={q.id} style={{ marginBottom: 10 }}>
                <b>Q{i+1}:</b> {q.question_text}<br/>
                <span>Selected: <b>{answers[q.id] ? answers[q.id].toUpperCase() : '—'}</b></span>
              </li>
            ))}
          </ul>
          <Button onClick={handleEdit} style={{ marginRight: 12 }}>Edit Answers</Button>
          <Button onClick={handleSubmit} style={{ background: '#6366f1' }}>Submit Test</Button>
        </ReviewCard>
      </Container>
    );
  }
  // Main test UI
  const question = test.questions[currentQuestion];
  const percent = ((currentQuestion) / test.questions.length) * 100;
  return (
    <Container>
      <Timer><FiClock />{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</Timer>
      <ProgressBar><Progress percent={percent} /></ProgressBar>
      <QuestionCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={question.id}>
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
          <Button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(c => c - 1)}>Previous</Button>
          {currentQuestion === test.questions.length - 1 ? (
            <Button onClick={handleReview} disabled={Object.keys(answers).length !== test.questions.length}>Review & Submit</Button>
          ) : (
            <Button onClick={() => setCurrentQuestion(c => c + 1)} disabled={!answers[question.id]}>Next</Button>
          )}
        </NavigationButtons>
      </QuestionCard>
    </Container>
  );
};

export default AptitudeTest;

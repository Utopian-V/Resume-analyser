import React, { useState } from 'react';
import styled from 'styled-components';
import aptitudeTests from '../../../data/aptitude_tests.json';
import { Helmet } from 'react-helmet-async';

const Container = styled.div`
  max-width: 600px;
  margin: 3rem auto;
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

const Question = styled.div`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #fff;
`;

const Option = styled.button`
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 1rem;
  border-radius: 0.8rem;
  border: 2px solid #6366f1;
  background: ${({ selected }) => (selected ? '#6366f1' : 'rgba(255,255,255,0.05)')};
  color: ${({ selected }) => (selected ? '#fff' : '#e2e8f0')};
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #6366f1;
    color: #fff;
  }
`;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const Button = styled.button`
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 0.8rem 1.7rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #4f46e5;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Result = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const Score = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #22c55e;
  margin-bottom: 1rem;
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  text-align: center;
  margin: 2rem 0;
`;

export default function AptitudeTest() {
  // --- Load test data ---
  const test = aptitudeTests['test1'];
  if (!test || !test.questions) {
    return <ErrorMsg>No test data found. Please check your JSON file and import path.</ErrorMsg>;
  }

  // --- State ---
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // --- Handlers ---
  const handleSelect = (qid, oid) => {
    setAnswers({ ...answers, [qid]: oid });
  };

  const handleNext = () => {
    if (current < test.questions.length - 1) setCurrent(current + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  // --- Results ---
  let score = 0;
  if (showResults) {
    score = test.questions.reduce(
      (acc, q) => acc + (answers[q.id] === q.correct_answer ? 1 : 0),
      0
    );
  }

  // --- UI ---
  if (showResults) {
    return (
      <Container>
        <Title>{test.title} - Results</Title>
        <Score>
          {score} / {test.questions.length}
        </Score>
        <div style={{ marginBottom: 24 }}>
          {score === test.questions.length
            ? "Perfect! 🚀"
            : score >= test.questions.length * 0.7
            ? "Great job! 🎉"
            : "Keep practicing! 💪"}
        </div>
        <div>
          {test.questions.map((q, i) => (
            <div key={q.id} style={{ marginBottom: 18, textAlign: 'left' }}>
              <b>Q{i + 1}:</b> {q.question}
              <br />
              <span>
                Your answer:{" "}
                <b style={{ color: answers[q.id] === q.correct_answer ? "#22c55e" : "#ef4444" }}>
                  {answers[q.id] ? q.options.find(o => o.id === answers[q.id])?.text : "—"}
                </b>
                <br />
                Correct: <b>{q.options.find(o => o.id === q.correct_answer)?.text}</b>
              </span>
            </div>
          ))}
        </div>
        <Button onClick={() => { setShowResults(false); setCurrent(0); setAnswers({}); }}>
          Try Again
        </Button>
      </Container>
    );
  }

  const q = test.questions[current];

  return (
    <Container>
      <Helmet>
        <title>Free Aptitude Test Online | Prep Nexus</title>
        <meta name="description" content="Take a free, time-bound aptitude test with instant results. Practice for your next job interview with Prep Nexus." />
        <link rel="canonical" href="https://prepnexus.netlify.app/aptitude-test" />
      </Helmet>
      <Title>{test.title}</Title>
      <Question>
        <b>Question {current + 1} of {test.questions.length}:</b>
        <br />
        {q.question}
      </Question>
      <div>
        {q.options.map(option => (
          <Option
            key={option.id}
            selected={answers[q.id] === option.id}
            onClick={() => handleSelect(q.id, option.id)}
          >
            ({option.id.toUpperCase()}) {option.text}
          </Option>
        ))}
      </div>
      <Nav>
        <Button onClick={handlePrev} disabled={current === 0}>Previous</Button>
        {current === test.questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={Object.keys(answers).length !== test.questions.length}>
            Submit
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!answers[q.id]}>
            Next
          </Button>
        )}
      </Nav>
    </Container>
  );
}
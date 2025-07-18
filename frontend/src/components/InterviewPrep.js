import React from 'react';
import styled from 'styled-components';
import { FiMessageSquare } from 'react-icons/fi';

const Container = styled.div`
  max-width: 700px;
  margin: 3rem auto;
  background: rgba(30,41,59,0.95);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.13);
  padding: 3rem 2rem;
  color: #e2e8f0;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  color: #6366f1;
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  color: #a5b4fc;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
`;

const ChatPlaceholder = styled.div`
  background: rgba(255,255,255,0.04);
  border-radius: 1.2rem;
  padding: 2.5rem 1.5rem;
  margin: 2rem 0;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
`;

const ChatIcon = styled.div`
  font-size: 3.5rem;
  color: #6366f1;
  margin-bottom: 1.2rem;
`;

const CTA = styled.button`
  background: linear-gradient(90deg, #6366f1 60%, #3730a3 100%);
  color: #fff;
  border: none;
  border-radius: 1.2rem;
  padding: 1rem 2.2rem;
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 2rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99,102,241,0.13);
  transition: background 0.2s, transform 0.1s;
  &:hover {
    background: linear-gradient(90deg, #3730a3 60%, #6366f1 100%);
    transform: translateY(-2px) scale(1.05);
  }
`;

export default function InterviewPrep() {
  return (
    <Container>
      <Title>Interview Prep</Title>
      <Subtitle>
        Practice mock interviews and get AI-powered feedback.<br/>
        (Real interview chat coming soon!)
      </Subtitle>
      <ChatPlaceholder>
        <ChatIcon><FiMessageSquare /></ChatIcon>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>
          No interview chat available right now
        </div>
        <div style={{ color: '#a5b4fc', marginBottom: 18 }}>
          We’re building a smart interview assistant for you.<br/>
          Please check back soon or connect your own AI/chat data!
        </div>
        <CTA onClick={() => window.location.reload()}>
          <FiMessageSquare style={{ marginRight: 8 }} /> Refresh
        </CTA>
      </ChatPlaceholder>
    </Container>
  );
} 
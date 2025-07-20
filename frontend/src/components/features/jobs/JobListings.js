import React from 'react';
import styled from 'styled-components';
import { FiBriefcase, FiSearch } from 'react-icons/fi';

const Container = styled.div`
  max-width: 900px;
  margin: 3rem auto;
  background: rgba(30,41,59,0.95);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.13);
  padding: 3rem 2rem;
  color: #e2e8f0;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 900;
  color: #6366f1;
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  color: #a5b4fc;
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
`;

const PlaceholderIcon = styled.div`
  font-size: 4rem;
  color: #6366f1;
  margin-bottom: 1.5rem;
`;

const Placeholder = styled.div`
  background: rgba(255,255,255,0.04);
  border-radius: 1.2rem;
  padding: 2.5rem 1.5rem;
  margin: 2rem 0;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
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

export default function JobListings() {
  return (
    <Container>
      <Title>Job Opportunities</Title>
      <Subtitle>
        Discover and apply to jobs from the world’s top companies.<br/>
        (Real-time job data coming soon!)
      </Subtitle>
      <Placeholder>
        <PlaceholderIcon><FiBriefcase /></PlaceholderIcon>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 12 }}>
          No jobs available right now
        </div>
        <div style={{ color: '#a5b4fc', marginBottom: 18 }}>
          We’re working hard to bring you real-time job listings.<br/>
          Please check back soon or connect your own job data source!
        </div>
        <CTA onClick={() => window.location.reload()}>
          <FiSearch style={{ marginRight: 8 }} /> Refresh
        </CTA>
      </Placeholder>
    </Container>
  );
} 
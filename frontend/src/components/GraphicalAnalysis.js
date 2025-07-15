import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Card = styled(motion.div)`
  background: linear-gradient(120deg, #f5f7ff 60%, #e0e7ff 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #3730a3;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  letter-spacing: 0.01em;
`;

const ProgressBar = styled.div`
  background: linear-gradient(90deg, #e0e7ff 60%, #f5f7ff 100%);
  border-radius: 1.2rem;
  height: 20px;
  width: 100%;
  margin-bottom: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(99,102,241,0.07);
`;
const Progress = styled.div`
  background: linear-gradient(90deg, #6366f1 0%, #22c55e 100%);
  height: 100%;
  border-radius: 1.2rem;
  transition: width 0.7s cubic-bezier(.4,0,.2,1);
`;

const Tag = styled.span`
  display: inline-block;
  background: linear-gradient(90deg, #6366f1 60%, #3730a3 100%);
  color: #fff;
  border-radius: 0.9em;
  padding: 0.25em 1em;
  font-size: 1em;
  margin: 0.2em 0.3em 0.2em 0;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(99,102,241,0.10);
`;

const CheckList = styled.ul`
  margin: 0 0 0 1.2rem;
  padding: 0;
  font-size: 1.05em;
`;
const CheckItem = styled.li`
  color: ${props => props.passed ? '#22c55e' : '#ef4444'};
  font-weight: 700;
  margin-bottom: 0.2em;
`;

const GraphicalAnalysis = ({ feedback }) => {
  if (!feedback) return null;
  // Score
  const score = Number(feedback.score) || 0;
  // ATS Compliance
  const ats = feedback.ats_compliance && typeof feedback.ats_compliance === 'object'
    ? feedback.ats_compliance.score || 0
    : 0;
  const atsPassed = feedback.ats_compliance?.passed_checks || [];
  const atsFailed = feedback.ats_compliance?.failed_checks || [];
  const atsIssues = feedback.ats_compliance?.issues || [];
  // Skill Match
  const matchedSkills = feedback.skill_match?.matched_skills || [];
  const missingSkills = feedback.skill_match?.missing_skills || [];
  // Targeted Roles
  const roles = feedback.targeted_roles || [];
  // Red Flags
  const redFlags = feedback.red_flags || [];

  return (
    <>
      <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <SectionTitle>Resume Score</SectionTitle>
        <ProgressBar>
          <Progress style={{ width: `${score}%` }} />
        </ProgressBar>
        <div style={{ fontWeight: 700, color: '#3730a3', fontSize: '1.3em' }}>{score}/100</div>
      </Card>
      <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <SectionTitle>ATS Compliance</SectionTitle>
        <ProgressBar>
          <Progress style={{ width: `${ats}%`, background: 'linear-gradient(90deg, #f59e42 0%, #22c55e 100%)' }} />
        </ProgressBar>
        <div style={{ fontWeight: 700, color: '#f59e42', fontSize: '1.1em' }}>{ats}%</div>
        <CheckList>
          {atsPassed.map((item, idx) => <CheckItem key={"p"+idx} passed>{item}</CheckItem>)}
          {atsFailed.map((item, idx) => <CheckItem key={"f"+idx} passed={false}>{item}</CheckItem>)}
        </CheckList>
        {atsIssues.length > 0 && <div style={{ color: '#ef4444', marginTop: 8 }}>Issues: {atsIssues.join(", ")}</div>}
      </Card>
      <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
        <SectionTitle>Skill Match</SectionTitle>
        <div style={{ marginTop: 8 }}>
          <span style={{ color: '#22c55e', fontWeight: 600 }}>Matched:</span>
          {matchedSkills.length === 0 ? <span style={{ color: '#ef4444', marginLeft: 8 }}>None</span> : matchedSkills.map(skill => <Tag key={skill}>{skill}</Tag>)}
        </div>
        <div style={{ marginTop: 8 }}>
          <span style={{ color: '#ef4444', fontWeight: 600 }}>Missing:</span>
          {missingSkills.length === 0 ? <span style={{ color: '#22c55e', marginLeft: 8 }}>None</span> : missingSkills.map(skill => <Tag key={skill}>{skill}</Tag>)}
        </div>
      </Card>
      <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.0 }}>
        <SectionTitle>Targeted Roles</SectionTitle>
        <div style={{ marginTop: 8 }}>
          {roles.length === 0 ? <span style={{ color: '#6366f1' }}>No roles detected</span> : roles.map(role => <Tag key={role}>{role}</Tag>)}
        </div>
      </Card>
      <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1 }}>
        <SectionTitle>Red Flags</SectionTitle>
        {redFlags.length === 0 ? <div style={{ color: '#22c55e' }}>None detected</div> : (
          <ul style={{ color: '#ef4444', margin: 0, paddingLeft: 18 }}>
            {redFlags.map((flag, idx) => <li key={idx}>{flag}</li>)}
          </ul>
        )}
      </Card>
    </>
  );
};

export default GraphicalAnalysis; 
import React from "react";
import styled, { keyframes } from "styled-components";
import { FiDownload, FiAward, FiList, FiStar, FiInfo } from "react-icons/fi";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
`;

const Card = styled.div`
  background: #f5f7ff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.04);
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  margin-bottom: 1.2rem;
  animation: ${fadeIn} 0.7s cubic-bezier(.4,0,.2,1);
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3730a3;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.7rem 0;
`;

const Score = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: #22c55e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ImprovementsList = styled.ul`
  margin: 0 0 0 1.2rem;
  padding: 0;
  color: #6366f1;
  font-size: 1rem;
`;

const ImprovementItem = styled.li`
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 0.5em;
  padding: 0.1em 0.3em;
  margin-bottom: 0.5em;
  &:hover {
    background: #e0e7ff;
    color: #3730a3;
  }
`;

const Reason = styled.div`
  color: #6366f1;
  font-size: 0.97em;
  margin-left: 0.5em;
  margin-bottom: 0.2em;
`;

const DownloadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 0.8rem;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(99,102,241,0.10);
  transition: background 0.2s, transform 0.1s;
  &:hover {
    background: #3730a3;
    transform: translateY(-2px) scale(1.04);
  }
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  background: #fef2f2;
  border-radius: 0.7rem;
  padding: 1rem;
  margin-bottom: 1.2rem;
  font-weight: 600;
`;

const FeedbackDisplay = ({ feedback, onDownload, onFeedbackClick }) => {
  if (!feedback) return null;
  if (feedback.error) return <ErrorMsg>{feedback.error}</ErrorMsg>;

  return (
    <>
      <Card>
        <SectionTitle><FiAward /> Resume Score</SectionTitle>
        <Score><FiStar /> {feedback.score || "N/A"}</Score>
      </Card>
      <Card>
        <SectionTitle><FiList /> Suggested Improvements</SectionTitle>
        <ImprovementsList>
          {Array.isArray(feedback.improvements) && feedback.improvements.length > 0 ? (
            feedback.improvements.map((item, idx) => (
              <ImprovementItem
                key={idx}
                onClick={() => onFeedbackClick && onFeedbackClick(item.highlight_text || item.suggestion)}
                title={item.reason}
              >
                <div><b>{item.suggestion}</b></div>
                {item.reason && <Reason>Reason: {item.reason}</Reason>}
              </ImprovementItem>
            ))
          ) : (
            <li>No suggestions found</li>
          )}
        </ImprovementsList>
      </Card>
      <Card>
        <SectionTitle><FiInfo /> Skill Match</SectionTitle>
        <div style={{ color: '#3730a3', fontWeight: 600 }}>
          {typeof feedback.skill_match === 'string'
            ? feedback.skill_match
            : feedback.skill_match && typeof feedback.skill_match === 'object'
              ? (
                <ul style={{ paddingLeft: 16 }}>
                  {Object.entries(feedback.skill_match).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              )
              : null
          }
        </div>
      </Card>
      <Card>
        <SectionTitle>💡 Comments</SectionTitle>
        <div style={{ color: '#6366f1', fontWeight: 500 }}>{feedback.comments}</div>
      </Card>
      <DownloadButton onClick={onDownload}>
        <FiDownload size={20} /> Download Feedback
      </DownloadButton>
    </>
  );
};

export default FeedbackDisplay; 
import React from "react";
import styled, { keyframes } from "styled-components";
import { FiDownload, FiAward, FiList, FiStar, FiInfo } from "react-icons/fi";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
`;

const Card = styled.div`
  background: linear-gradient(120deg, #f5f7ff 60%, #e0e7ff 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.7s cubic-bezier(.4,0,.2,1);
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3730a3;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  letter-spacing: 0.01em;
`;

const Score = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #22c55e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 2px 8px #e0e7ff;
`;

const ImprovementsList = styled.ul`
  margin: 0 0 0 1.2rem;
  padding: 0;
  color: #6366f1;
  font-size: 1.05rem;
`;

const ImprovementItem = styled.li`
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  border-radius: 0.7em;
  padding: 0.2em 0.5em;
  margin-bottom: 0.5em;
  box-shadow: 0 1px 4px rgba(99,102,241,0.07);
  &:hover {
    background: linear-gradient(90deg, #e0e7ff 60%, #f5f7ff 100%);
    color: #3730a3;
    box-shadow: 0 2px 8px rgba(99,102,241,0.13);
  }
`;

const Reason = styled.div`
  color: #6366f1;
  font-size: 0.97em;
  margin-left: 0.5em;
  margin-bottom: 0.2em;
  font-style: italic;
`;

const DownloadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #6366f1 60%, #3730a3 100%);
  color: #fff;
  border: none;
  border-radius: 1.2rem;
  padding: 0.8rem 1.6rem;
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99,102,241,0.13);
  transition: background 0.2s, transform 0.1s;
  &:hover {
    background: linear-gradient(90deg, #3730a3 60%, #6366f1 100%);
    transform: translateY(-2px) scale(1.05);
  }
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  background: linear-gradient(90deg, #fef2f2 60%, #fee2e2 100%);
  border-radius: 1rem;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.1rem;
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
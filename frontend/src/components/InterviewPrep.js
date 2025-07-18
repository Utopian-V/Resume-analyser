import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiMessageSquare, FiSend, FiUser, FiMessageCircle, FiBriefcase, FiTarget } from "react-icons/fi";
import { sendInterviewMessage } from "../api";
import { getInterviewQuestionsByRole } from "../utils/interviewCsv";

const csvUrl = require('../data/interview_questions.csv');

const Container = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #e2e8f0;
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0;
`;

const RoleSelector = styled.div`
  margin-bottom: 2rem;
`;

const RoleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  margin: 0.5rem;
  border: 2px solid #6366f1;
  background: ${props => props.active ? '#6366f1' : 'transparent'};
  color: ${props => props.active ? 'white' : '#6366f1'};
  border-radius: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #6366f1;
    color: white;
  }
`;

const ChatContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.08);
  margin-bottom: 1.5rem;
  height: 500px;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 0.5rem;
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin-bottom: 1rem;
  animation: fadeIn 0.3s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const MessageAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  background: ${props => props.isUser ? '#6366f1' : '#22c55e'};
  color: white;
`;

const MessageContent = styled.div`
  background: ${props => props.isUser ? '#6366f1' : '#f1f5f9'};
  color: ${props => props.isUser ? 'white' : '#374151'};
  padding: 1rem;
  border-radius: 1rem;
  max-width: 70%;
  word-wrap: break-word;
  line-height: 1.4;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 1rem;
  border: 2px solid #e0e7ff;
  border-radius: 0.8rem;
  font-size: 1rem;
  resize: none;
  min-height: 50px;
  max-height: 120px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 0.8rem;
  background: #6366f1;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #3730a3;
  }
  
  &:disabled {
    background: #e5e7eb;
    cursor: not-allowed;
  }
`;

const StartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 1rem;
  background: linear-gradient(90deg, #6366f1 60%, #3730a3 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(99,102,241,0.3);
  }
`;

const InfoCard = styled.div`
  background: linear-gradient(90deg, #f0f9ff 60%, #e0f2fe 100%);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-left: 4px solid #6366f1;
`;

const InfoTitle = styled.h3`
  color: #3730a3;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoText = styled.p`
  color: #6366f1;
  line-height: 1.5;
  margin: 0;
`;

const roles = [
  "Software Engineer",
  "Frontend Developer", 
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Product Manager",
  "UI/UX Designer"
];

const InterviewPrep = ({ userId }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [questionFlow, setQuestionFlow] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [csvLoaded, setCsvLoaded] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedRole) {
      fetch(csvUrl)
        .then(res => res.text())
        .then(text => {
          setQuestionFlow(getInterviewQuestionsByRole(text, selectedRole));
          setCsvLoaded(true);
        });
    }
  }, [selectedRole]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startInterview = () => {
    if (!selectedRole || !csvLoaded) return;
    setMessages([]);
    setIsInterviewStarted(true);
    setConversationId(`conv_${Date.now()}`);
    setCurrentQ(0);
    // Start with the first question from the flow
    if (questionFlow.length > 0) {
      setMessages([{ id: Date.now(), text: questionFlow[0].question, isUser: false, timestamp: new Date() }]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError("");
    try {
      // If there are more scripted questions, use them
      if (currentQ + 1 < questionFlow.length) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: questionFlow[currentQ + 1].question,
            isUser: false,
            timestamp: new Date()
          }]);
          setCurrentQ(currentQ + 1);
          setIsLoading(false);
        }, 700);
      } else {
        // Otherwise, fallback to AI for dynamic follow-up
        const response = await sendInterviewMessage(userId, selectedRole, inputMessage, conversationId);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: response.response,
          isUser: false,
          timestamp: new Date()
        }]);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError("Sorry, something went wrong. Please try again later.");
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble processing your response right now. Could you please try again?",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetInterview = () => {
    setMessages([]);
    setIsInterviewStarted(false);
    setSelectedRole("");
    setConversationId(null);
  };

  return (
    <Container>
      <Header>
        <Title>
          <FiMessageSquare size={24} />
          AI Interview Preparation
        </Title>
      </Header>

      <InfoCard>
        <InfoTitle>
          <FiTarget size={20} />
          How it works
        </InfoTitle>
        <InfoText>
          Choose a role and start a conversation with our AI interviewer. The AI will ask relevant questions 
          based on the position you're applying for. Practice your responses and get instant feedback to 
          improve your interview skills.
        </InfoText>
      </InfoCard>

      {!isInterviewStarted ? (
        <>
          <RoleSelector>
            <h3 style={{ color: '#3730a3', marginBottom: '1rem' }}>
              <FiBriefcase size={20} style={{ marginRight: '0.5rem' }} />
              Select Role for Interview
            </h3>
            {roles.map(role => (
              <RoleButton
                key={role}
                active={selectedRole === role}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </RoleButton>
            ))}
          </RoleSelector>

          {selectedRole && (
            <StartButton onClick={startInterview}>
              <FiMessageSquare size={20} />
              Start Interview for {selectedRole}
            </StartButton>
          )}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#3730a3', margin: 0 }}>
              Interviewing for: <span style={{ color: '#6366f1' }}>{selectedRole}</span>
            </h3>
            <button
              onClick={resetInterview}
              style={{
                padding: '0.5rem 1rem',
                border: '2px solid #ef4444',
                background: 'transparent',
                color: '#ef4444',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Reset Interview
            </button>
          </div>

          <ChatContainer>
            <MessagesContainer>
              {messages.map((message) => (
                <Message key={message.id}>
                  <MessageAvatar isUser={message.isUser}>
                    {message.isUser ? <FiUser /> : <FiMessageCircle />}
                  </MessageAvatar>
                  <MessageContent isUser={message.isUser}>
                    {message.text}
                  </MessageContent>
                </Message>
              ))}
              {isLoading && (
                <Message>
                  <MessageAvatar isUser={false}>
                    <FiMessageCircle />
                  </MessageAvatar>
                  <MessageContent isUser={false}>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', animation: 'bounce 1s infinite' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', animation: 'bounce 1s infinite 0.2s' }}></div>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1', animation: 'bounce 1s infinite 0.4s' }}></div>
                    </div>
                  </MessageContent>
                </Message>
              )}
              {error && <div style={{ color: '#ef4444', marginBottom: 16, fontWeight: 600 }}>{error}</div>}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputContainer>
              <MessageInput
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response..."
                disabled={isLoading}
              />
              <SendButton onClick={sendMessage} disabled={!inputMessage.trim() || isLoading}>
                <FiSend size={20} />
              </SendButton>
            </InputContainer>
          </ChatContainer>
        </>
      )}
    </Container>
  );
};

export default InterviewPrep; 
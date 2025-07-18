import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMessageSquare } from 'react-icons/fi';

const FAQButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FAQModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const FAQModal = styled.div`
  background: #1e293b;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const FAQHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const FAQTitle = styled.h3`
  color: #e2e8f0;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const FAQCloseButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #e2e8f0;
  }
`;

const FAQChatContainer = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 400px;
`;

const FAQWelcomeMessage = styled.div`
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
  color: #e2e8f0;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const FAQMessage = styled.div`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 1rem;
`;

const FAQMessageBubble = styled.div`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background: ${props => props.isUser ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isUser ? 'white' : '#e2e8f0'};
  font-size: 0.9rem;
  line-height: 1.4;
`;

const FAQInputContainer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FAQInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: #e2e8f0;
  font-size: 0.9rem;
  
  &::placeholder {
    color: #94a3b8;
  }
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const FAQSendButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FAQChat = ({ 
  isOpen, 
  onOpen, 
  onClose, 
  faqQuestion, 
  setFaqQuestion, 
  faqMessages, 
  loading, 
  onSubmit 
}) => {
  return (
    <>
      <FAQButton
        onClick={onOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiMessageSquare />
      </FAQButton>

      {isOpen && (
        <FAQModalOverlay onClick={onClose}>
          <FAQModal onClick={(e) => e.stopPropagation()}>
            <FAQHeader>
              <FAQTitle>Prep Nexus Assistant</FAQTitle>
              <FAQCloseButton onClick={onClose}>×</FAQCloseButton>
            </FAQHeader>
            
            <FAQChatContainer>
              {faqMessages.length === 0 && (
                <FAQWelcomeMessage>
                  👋 Hi! I'm your Prep Nexus assistant. Ask me anything about resume optimization, interview prep, or career advice!
                </FAQWelcomeMessage>
              )}
              
              {faqMessages.map((message, index) => (
                <FAQMessage key={index} isUser={message.type === 'user'}>
                  <FAQMessageBubble isUser={message.type === 'user'}>
                    {message.content}
                  </FAQMessageBubble>
                </FAQMessage>
              ))}
              
              {loading && (
                <FAQMessage isUser={false}>
                  <FAQMessageBubble isUser={false}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '16px', height: '16px', border: '2px solid #6366f1', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      Thinking...
                    </div>
                  </FAQMessageBubble>
                </FAQMessage>
              )}
            </FAQChatContainer>
            
            <FAQInputContainer>
              <form onSubmit={onSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <FAQInput
                  type="text"
                  placeholder="Ask me anything..."
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  disabled={loading}
                />
                <FAQSendButton type="submit" disabled={loading || !faqQuestion.trim()}>
                  Send
                </FAQSendButton>
              </form>
            </FAQInputContainer>
          </FAQModal>
        </FAQModalOverlay>
      )}
    </>
  );
};

export default FAQChat; 
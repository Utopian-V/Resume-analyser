import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

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

const Title = styled.h2`
  color: #374151;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  min-height: ${props => props.large ? '200px' : '120px'};
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
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
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    background: #4f46e5;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  
  &.success {
    background: #dcfce7;
    color: #166534;
  }
  
  &.error {
    background: #fee2e2;
    color: #991b1b;
  }
`;

const AptitudeQuestionManager = () => {
  const [questionText, setQuestionText] = useState('');
  const [optionsText, setOptionsText] = useState('');
  const [category, setCategory] = useState('Numerical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [timeLimit, setTimeLimit] = useState(90);
  const [points, setPoints] = useState(5);
  const [message, setMessage] = useState(null);

  const parseOptions = (text) => {
    // Parse options from formats like:
    // (A) option1 (B) option2
    // A) option1 B) option2
    // A. option1 B. option2
    const optionRegex = /(?:\\(([A-D])\\)|([A-D])[).]) *([^\\n(A-D)]+)/g;
    const options = [];
    let match;

    while ((match = optionRegex.exec(text)) !== null) {
      const optionLetter = match[1] || match[2];
      const optionText = match[3].trim();
      options.push({
        id: optionLetter.toLowerCase(),
        text: optionText,
        is_correct: false
      });
    }

    return options;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const options = parseOptions(optionsText);
      
      if (options.length === 0) {
        setMessage({
          type: 'error',
          text: 'Please enter options in the correct format: (A) option1 (B) option2...'
        });
        return;
      }

      if (options.length !== 4) {
        setMessage({
          type: 'error',
          text: 'Please provide exactly 4 options (A, B, C, D)'
        });
        return;
      }

      // Set the first option as correct by default
      options[0].is_correct = true;

      const question = {
        question_text: questionText,
        category,
        difficulty,
        time_limit: parseInt(timeLimit),
        points: parseInt(points),
        options
      };

      const response = await fetch('/api/aptitude/questions/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question)
      });

      if (!response.ok) {
        throw new Error('Failed to add question');
      }

      setMessage({
        type: 'success',
        text: 'Question added successfully!'
      });
      
      // Clear form
      setQuestionText('');
      setOptionsText('');
      setCategory('Numerical');
      setDifficulty('Medium');
      setTimeLimit(90);
      setPoints(5);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error adding question: ' + error.message
      });
    }
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Title>Add Aptitude Question</Title>

        {message && (
          <Message
            className={message.type}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
            {message.text}
          </Message>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Question Text</Label>
            <TextArea
              large
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              placeholder="Enter the question text..."
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Options (Format: (A) option1 (B) option2 ...)</Label>
            <TextArea
              value={optionsText}
              onChange={e => setOptionsText(e.target.value)}
              placeholder="(A) First option&#10;(B) Second option&#10;(C) Third option&#10;(D) Fourth option"
              required
            />
          </FormGroup>

          <Grid>
            <FormGroup>
              <Label>Category</Label>
              <Select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Numerical">Numerical</option>
                <option value="Verbal">Verbal</option>
                <option value="Logical">Logical</option>
                <option value="Data Interpretation">Data Interpretation</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Difficulty</Label>
              <Select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Time Limit (seconds)</Label>
              <Select value={timeLimit} onChange={e => setTimeLimit(e.target.value)}>
                <option value="60">60</option>
                <option value="90">90</option>
                <option value="120">120</option>
                <option value="180">180</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Points</Label>
              <Select value={points} onChange={e => setPoints(e.target.value)}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </Select>
            </FormGroup>
          </Grid>

          <Button type="submit">Add Question</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AptitudeQuestionManager;

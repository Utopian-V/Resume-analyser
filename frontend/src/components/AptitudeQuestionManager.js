import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { addAptitudeQuestion } from '../api';
import aptitudeTests from '../data/aptitude_tests.json';

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
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #374151;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
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

const AptitudeQuestionManager = ({ userId }) => {
  const [questionText, setQuestionText] = useState('');
  const [optionsText, setOptionsText] = useState('');
  const [category, setCategory] = useState('Numerical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [timeLimit, setTimeLimit] = useState(90);
  const [points, setPoints] = useState(5);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  // Add state for preview
  const [previewOptions, setPreviewOptions] = useState([]);

  // Update preview when optionsText changes
  useEffect(() => {
    setPreviewOptions(parseOptions(optionsText));
    // eslint-disable-next-line
  }, [optionsText]);

  const parseOptions = (text) => {
    const options = [];
    let correctOption = null;

    // Split by newlines and process each line
    const lines = text.split('\n').filter(line => line.trim());
    
    for (let line of lines) {
      // Match patterns like (A), (B), A), A., etc.
      const optionMatch = line.match(/^[\(]?([A-D])[\)\.]?\s*(.+)$/i);
      if (optionMatch) {
        const optionLetter = optionMatch[1].toLowerCase();
        let optionText = optionMatch[2].trim();
        
        // Check if this option is marked as correct
        const isCorrect = optionText.toLowerCase().includes('(correct)') || 
                         optionText.toLowerCase().includes('[correct]') ||
                         optionText.toLowerCase().includes('*correct*');
        
        if (isCorrect) {
          correctOption = optionLetter;
        }

        // Clean up the option text
        optionText = optionText.replace(/[\(\[]correct[\)\]]/gi, '').trim();

        options.push({
          id: optionLetter,
          text: optionText,
          is_correct: false // Will be set after all options are parsed
        });
      }
    }

    // If no correct option was marked, use the first one
    if (!correctOption && options.length > 0) {
      correctOption = options[0].id;
    }

    // Set the correct option
    options.forEach(option => {
      option.is_correct = option.id === correctOption;
    });

    return options;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate question text
      if (!questionText.trim()) {
        throw new Error('Please enter a question text');
      }
      
      // Validate options text
      if (!optionsText.trim()) {
        throw new Error('Please enter options');
      }
      
      const options = parseOptions(optionsText);
      
      if (options.length === 0) {
        throw new Error('Please enter options in the correct format. Example:\n(A) First option (correct)\n(B) Second option\n(C) Third option\n(D) Fourth option');
      }

      if (options.length !== 4) {
        throw new Error(`Please provide exactly 4 options (A, B, C, D). Found ${options.length} options.`);
      }
      
      // Validate that all options have text
      const emptyOptions = options.filter(opt => !opt.text.trim());
      if (emptyOptions.length > 0) {
        throw new Error('All options must have text content');
      }
      
      // Validate that exactly one option is marked as correct
      const correctOptions = options.filter(opt => opt.is_correct);
      if (correctOptions.length !== 1) {
        throw new Error('Please mark exactly one option as correct using "(correct)"');
      }

      const question = {
        question_text: questionText,
        category,
        difficulty,
        time_limit: parseInt(timeLimit),
        points: parseInt(points),
        options
      };

      await addAptitudeQuestion(question);

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
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Error adding question. Please try again.'
      });
    } finally {
      setLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Title>Add Aptitude Question</Title>
        <Subtitle>
          Add new questions to the aptitude test bank. Questions will be immediately available for testing.
        </Subtitle>

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
            <Label>Options (One per line, mark correct with "(correct)")</Label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Button 
                type="button" 
                onClick={() => setOptionsText(`(A) First option (correct)
(B) Second option
(C) Third option
(D) Fourth option`)}
                style={{ background: '#10b981', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                Load Example
              </Button>
              <Button 
                type="button" 
                onClick={() => setOptionsText('')}
                style={{ background: '#6b7280', fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                Clear
              </Button>
            </div>
            <TextArea
              value={optionsText}
              onChange={e => setOptionsText(e.target.value)}
              placeholder="(A) First option (correct)
(B) Second option
(C) Third option
(D) Fourth option"
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

          <Button type="submit" disabled={loading}>
            {loading ? 'Adding Question...' : 'Add Question'}
          </Button>
        </Form>

        {/* Live Preview */}
        <div style={{ marginTop: 32, background: '#f3f4f6', borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: '#6366f1', marginBottom: 12 }}>Live Preview</h3>
          <div style={{ marginBottom: 8 }}><b>Question:</b> {questionText || <span style={{ color: '#9ca3af' }}>[Enter question text]</span>}</div>
          <ul style={{ paddingLeft: 24 }}>
            {previewOptions.length > 0 ? previewOptions.map(opt => (
              <li key={opt.id} style={{ color: opt.is_correct ? '#22c55e' : '#374151', fontWeight: opt.is_correct ? 700 : 400 }}>
                ({opt.id.toUpperCase()}) {opt.text} {opt.is_correct && <span style={{ fontSize: 12, color: '#22c55e' }}>(Correct)</span>}
              </li>
            )) : <li style={{ color: '#9ca3af' }}>[Options will appear here]</li>}
          </ul>
          <div style={{ marginTop: 8, color: '#64748b' }}>
            <b>Category:</b> {category} | <b>Difficulty:</b> {difficulty} | <b>Time Limit:</b> {timeLimit}s | <b>Points:</b> {points}
          </div>
          
          {/* Validation Status */}
          {optionsText.trim() && (
            <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: previewOptions.length === 4 && previewOptions.filter(o => o.is_correct).length === 1 ? '#dcfce7' : '#fef3c7', color: previewOptions.length === 4 && previewOptions.filter(o => o.is_correct).length === 1 ? '#166534' : '#92400e' }}>
              <b>Validation:</b> {
                previewOptions.length === 0 ? 'No options detected' :
                previewOptions.length !== 4 ? `Found ${previewOptions.length} options (need 4)` :
                previewOptions.filter(o => o.is_correct).length !== 1 ? 'Need exactly one correct option' :
                '✓ Valid question ready to submit'
              }
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
};

export default AptitudeQuestionManager;

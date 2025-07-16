import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  min-height: 200px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
`;

const Button = styled.button`
  background: #6366f1;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background: #4f46e5;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AptitudeQuestionManager = () => {
  const [questionText, setQuestionText] = useState('');
  const [optionsText, setOptionsText] = useState('');
  const [category, setCategory] = useState('Numerical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [timeLimit, setTimeLimit] = useState(90);
  const [points, setPoints] = useState(5);

  const parseOptions = (text) => {
    // Parse options from formats like:
    // (A) option1 (B) option2
    // A) option1 B) option2
    // A. option1 B. option2
    const optionRegex = /(?:\(([A-D])\)|([A-D])[).]) *([^\n(A-D)]+)/g;
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
        alert('Please enter options in the correct format: (A) option1 (B) option2...');
        return;
      }

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

      alert('Question added successfully!');
      setQuestionText('');
      setOptionsText('');
    } catch (error) {
      alert('Error adding question: ' + error.message);
    }
  };

  return (
    <Container>
      <h2>Add Aptitude Question</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Question Text</Label>
          <TextArea
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
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
        </div>

        <Button type="submit">Add Question</Button>
      </Form>
    </Container>
  );
};

export default AptitudeQuestionManager;

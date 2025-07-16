export const sampleQuestions = [
  {
    id: 'q3',
    question_text: 'Which sequence comes next in the pattern? 2, 6, 12, 20, 30, __',
    category: 'Logical',
    difficulty: 'Medium',
    time_limit: 120,
    points: 10,
    options: [
      { id: 'a', text: '42', is_correct: true },
      { id: 'b', text: '40', is_correct: false },
      { id: 'c', text: '36', is_correct: false },
      { id: 'd', text: '44', is_correct: false }
    ],
    explanation: 'The difference between consecutive terms increases by 2: 4, 6, 8, 10, 12'
  },
  {
    id: 'q4',
    question_text: 'If the cost of 12 pens is Rs. 180, what is the cost of 5 pens?',
    category: 'Numerical',
    difficulty: 'Easy',
    time_limit: 60,
    points: 5,
    options: [
      { id: 'a', text: 'Rs. 60', is_correct: false },
      { id: 'b', text: 'Rs. 75', is_correct: true },
      { id: 'c', text: 'Rs. 80', is_correct: false },
      { id: 'd', text: 'Rs. 90', is_correct: false }
    ],
    explanation: 'Cost of one pen = 180/12 = 15, Cost of 5 pens = 15 × 5 = 75'
  },
  {
    id: 'q5',
    question_text: 'A pipe can fill a tank in 8 hours. Another pipe can empty it in 12 hours. If both pipes are opened together, in how many hours will the tank be filled?',
    category: 'Numerical',
    difficulty: 'Hard',
    time_limit: 180,
    points: 15,
    options: [
      { id: 'a', text: '24 hours', is_correct: true },
      { id: 'b', text: '20 hours', is_correct: false },
      { id: 'c', text: '16 hours', is_correct: false },
      { id: 'd', text: '18 hours', is_correct: false }
    ],
    explanation: 'Rate of filling = 1/8 tank/hr, Rate of emptying = -1/12 tank/hr, Net rate = 1/8 - 1/12 = 1/24 tank/hr, Time to fill = 24 hours'
  }
];

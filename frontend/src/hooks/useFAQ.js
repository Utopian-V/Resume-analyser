import { useState } from 'react';

export const useFAQ = () => {
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqMessages, setFaqMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFAQOpen = () => setIsFAQModalOpen(true);
  const handleFAQClose = () => setIsFAQModalOpen(false);

  const handleFAQQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!faqQuestion.trim()) return;

    const userMessage = { type: 'user', content: faqQuestion };
    setFaqMessages(prev => [...prev, userMessage]);
    setFaqQuestion('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great question! Our resume analysis uses advanced AI to identify key skills and suggest improvements. It analyzes your experience, skills, and achievements to provide personalized recommendations.",
        "The aptitude tests cover logical reasoning, numerical ability, and verbal skills. They're designed to help you prepare for various job interviews and assessments.",
        "Our DSA practice includes problems from easy to hard difficulty levels. We recommend starting with easy problems and gradually moving to more challenging ones.",
        "The interview prep feature includes mock interviews with AI, common questions, and personalized feedback to help you improve your interview skills.",
        "You can track your progress in the dashboard, which shows your resume score, completed problems, and overall improvement over time."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setFaqMessages(prev => [...prev, { type: 'bot', content: randomResponse }]);
      setLoading(false);
    }, 1000);
  };

  return {
    isFAQModalOpen,
    faqQuestion,
    setFaqQuestion,
    faqMessages,
    loading,
    handleFAQOpen,
    handleFAQClose,
    handleFAQQuestionSubmit
  };
}; 
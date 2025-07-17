import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FiStar, FiQuote } from 'react-icons/fi';

const slideAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
`;

const ReviewsContainer = styled.section`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 2vw;
  overflow: hidden;
`;

const ReviewsTitle = styled.h2`
  color: #1e293b;
  font-size: 2.5rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 1rem;
`;

const ReviewsSubtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 3rem;
`;

const ReviewsTrack = styled.div`
  display: flex;
  gap: 2rem;
  animation: ${slideAnimation} 30s linear infinite;
  
  &:hover {
    animation-play-state: paused;
  }
`;

const ReviewCard = styled(motion.div)`
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  min-width: 350px;
  flex-shrink: 0;
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 20px;
    font-size: 4rem;
    color: #6366f1;
    font-family: serif;
    opacity: 0.3;
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 700;
  color: #1e293b;
  font-size: 1.1rem;
`;

const UserRole = styled.div`
  color: #64748b;
  font-size: 0.9rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  color: #fbbf24;
`;

const ReviewText = styled.p`
  color: #475569;
  line-height: 1.6;
  font-size: 1rem;
  margin: 0;
`;

const reviews = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    avatar: "SC",
    rating: 5,
    text: "Prep Nexus transformed my interview preparation. The AI resume analysis was incredibly accurate and the DSA practice questions are top-notch. Landed my dream job at Google!"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Full Stack Developer",
    company: "Microsoft",
    avatar: "MR",
    rating: 5,
    text: "The aptitude tests and interview prep features are game-changers. The personalized feedback helped me identify and improve my weak areas. Highly recommended!"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Frontend Developer",
    company: "Netflix",
    avatar: "EW",
    rating: 5,
    text: "Finally, a platform that combines resume optimization with actual interview preparation. The job matching feature is spot-on and helped me find the perfect role."
  },
  {
    id: 4,
    name: "David Kim",
    role: "Backend Engineer",
    company: "Amazon",
    avatar: "DK",
    rating: 5,
    text: "The comprehensive approach to career preparation is what sets Prep Nexus apart. From resume analysis to mock interviews, everything is designed for success."
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "DevOps Engineer",
    company: "Meta",
    avatar: "LT",
    rating: 5,
    text: "Incredible platform! The AI-powered insights are incredibly valuable. The DSA practice helped me ace technical interviews at top tech companies."
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Product Manager",
    company: "Apple",
    avatar: "JW",
    rating: 5,
    text: "Prep Nexus is the complete package for career advancement. The resume analysis is thorough and the interview prep resources are comprehensive."
  },
  {
    id: 7,
    name: "Anna Patel",
    role: "Data Scientist",
    company: "Uber",
    avatar: "AP",
    rating: 5,
    text: "The personalized learning path and progress tracking features are excellent. Helped me transition from academia to industry successfully."
  },
  {
    id: 8,
    name: "Robert Johnson",
    role: "Senior Developer",
    company: "Stripe",
    avatar: "RJ",
    rating: 5,
    text: "Best investment I made in my career. The platform's approach to interview preparation is systematic and effective. Highly recommend!"
  }
];

const ReviewsSection = () => {
  return (
    <ReviewsContainer>
      <ReviewsTitle>Trusted by 10,000+ Developers</ReviewsTitle>
      <ReviewsSubtitle>See what our users say about their experience</ReviewsSubtitle>
      
      <ReviewsTrack>
        {[...reviews, ...reviews].map((review, index) => (
          <ReviewCard
            key={`${review.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ReviewHeader>
              <UserAvatar>{review.avatar}</UserAvatar>
              <UserInfo>
                <UserName>{review.name}</UserName>
                <UserRole>{review.role} at {review.company}</UserRole>
              </UserInfo>
              <Stars>
                {[...Array(review.rating)].map((_, i) => (
                  <FiStar key={i} size={16} fill="#fbbf24" />
                ))}
              </Stars>
            </ReviewHeader>
            <ReviewText>{review.text}</ReviewText>
          </ReviewCard>
        ))}
      </ReviewsTrack>
    </ReviewsContainer>
  );
};

export default ReviewsSection; 
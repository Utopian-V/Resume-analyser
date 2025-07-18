import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ReviewsContainer = styled.section`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 2rem;
`;

const ReviewsTitle = styled.h2`
  color: #e2e8f0;
  font-size: 2.5rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 3rem;
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ReviewCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(99, 102, 241, 0.5);
    transform: translateY(-4px);
  }
  
  ${props => props.featured && `
    grid-column: span 2;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
    border-color: rgba(99, 102, 241, 0.3);
    
    @media (max-width: 768px) {
      grid-column: span 1;
    }
  `}
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h4`
  color: #e2e8f0;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
`;

const UserRole = styled.p`
  color: #6366f1;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const Star = styled.span`
  color: #fbbf24;
  font-size: 1.1rem;
`;

const ReviewText = styled.p`
  color: #cbd5e1;
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0;
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.4rem 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
`;

const reviews = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Software Engineer",
    avatar: "SC",
    rating: 5,
    text: "Prep Nexus transformed my job search! The resume analysis was incredibly accurate and the interview prep helped me land my dream role at Google. Highly recommended!",
    featured: true
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Data Scientist",
    avatar: "MR",
    rating: 5,
    text: "The DSA practice questions are top-notch. I improved my problem-solving skills significantly and finally cracked the FAANG interviews. This platform is a game-changer!"
  },
  {
    id: 3,
    name: "Emily Johnson",
    role: "Product Manager",
    avatar: "EJ",
    rating: 5,
    text: "The aptitude tests helped me prepare for consulting interviews. The platform is intuitive and the feedback is detailed. Got offers from McKinsey and BCG!"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Frontend Developer",
    avatar: "DK",
    rating: 5,
    text: "Amazing resource for technical interviews. The mock interviews with AI are incredibly realistic and helped me build confidence. Landed a role at Stripe!"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Backend Engineer",
    avatar: "LW",
    rating: 5,
    text: "The resume optimization feature is brilliant. It highlighted areas I never thought about and helped me showcase my skills better. Got 3 offers within 2 weeks!"
  },
  {
    id: 6,
    name: "Alex Thompson",
    role: "DevOps Engineer",
    avatar: "AT",
    rating: 5,
    text: "Comprehensive platform that covers everything from resume building to interview prep. The job recommendations are spot-on and helped me find the perfect role."
  }
];

export default function ReviewsSection() {
  return (
    <ReviewsContainer>
      <ReviewsTitle>What Our Users Say</ReviewsTitle>
      <ReviewsGrid>
        {reviews.map((review, index) => (
          <ReviewCard
            key={review.id}
            featured={review.featured}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            {review.featured && <FeaturedBadge>Featured</FeaturedBadge>}
            <ReviewHeader>
              <UserAvatar>{review.avatar}</UserAvatar>
              <UserInfo>
                <UserName>{review.name}</UserName>
                <UserRole>{review.role}</UserRole>
              </UserInfo>
            </ReviewHeader>
            <Stars>
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i}>★</Star>
              ))}
            </Stars>
            <ReviewText>{review.text}</ReviewText>
          </ReviewCard>
        ))}
      </ReviewsGrid>
    </ReviewsContainer>
  );
} 
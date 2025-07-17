import React, { useState } from 'react';
import styled from 'styled-components';
import { FiBookOpen, FiUser, FiCalendar, FiArrowRight } from 'react-icons/fi';

export const blogs = [
  {
    id: 1,
    title: 'How to Make Your Resume Stand Out in 2024',
    author: 'Jane Doe',
    date: '2024-07-18',
    summary: 'Discover the latest tips and tricks to craft a resume that catches recruiters’ eyes and lands you more interviews.',
    content: `In today’s competitive job market, your resume needs to do more than just list your experience. Here’s how to make it shine:

1. Use a clean, modern format with plenty of white space.
2. Highlight measurable achievements, not just responsibilities.
3. Tailor your resume for each job application.
4. Use strong action verbs and avoid clichés.
5. Keep it concise—one page is best for most roles.

Remember, your resume is your personal marketing document. Make every word count!`,
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Mastering DSA for Tech Interviews',
    author: 'John Smith',
    date: '2024-07-15',
    summary: 'A practical guide to preparing for data structures and algorithms interviews, with resources and study plans.',
    content: `Tech interviews often focus on DSA. Here’s how to prepare:

- Start with basics: arrays, strings, linked lists.
- Practice with LeetCode, HackerRank, or Prep Nexus DSA Bank.
- Focus on problem-solving patterns, not just memorizing solutions.
- Simulate real interviews with a timer.
- Review your mistakes and learn from them.

Consistency is key. Set a schedule and stick to it!`,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'The Power of Networking in Your Job Search',
    author: 'Priya Patel',
    date: '2024-07-10',
    summary: 'Learn why networking is still the #1 way to land your dream job and how to do it effectively, even online.',
    content: `Networking opens doors that resumes can’t. Here’s how to do it right:

- Attend virtual meetups and webinars in your field.
- Reach out to alumni and professionals on LinkedIn.
- Don’t just ask for jobs—ask for advice and insights.
- Follow up and stay in touch.
- Give back: share opportunities and help others.

Your network is your net worth. Start building it today!`,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
];

const BlogContainer = styled.div`
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: 'Inter', 'Nunito', sans-serif;
`;

const BlogHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const BlogTitle = styled.h1`
  color: #3730a3;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
`;

const BlogCard = styled.div`
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(99,102,241,0.07);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  cursor: pointer;
  &:hover {
    box-shadow: 0 6px 32px rgba(99,102,241,0.13);
    transform: translateY(-4px) scale(1.02);
  }
`;

const BlogImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 0.8rem;
  margin-bottom: 1rem;
`;

const BlogCardTitle = styled.h2`
  color: #3730a3;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const BlogMeta = styled.div`
  color: #6366f1;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BlogSummary = styled.p`
  color: #334155;
  font-size: 1.05rem;
  margin-bottom: 1rem;
  min-height: 60px;
`;

const ReadMoreBtn = styled.button`
  background: #2563eb;
  color: #fff;
  padding: 0.5rem 1.2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  border: none;
  transition: background 0.2s;
  cursor: pointer;
  align-self: flex-end;
  &:hover {
    background: #1d4ed8;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30,41,59,0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalContent = styled.div`
  background: #fff;
  border-radius: 1.2rem;
  padding: 2.5rem 2rem 2rem 2rem;
  min-width: 350px;
  max-width: 95vw;
  max-height: 90vh;
  box-shadow: 0 8px 32px rgba(99,102,241,0.18);
  text-align: left;
  overflow-y: auto;
`;
const CloseBtn = styled.button`
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  float: right;
  &:hover { background: #dc2626; }
`;

const Blog = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  return (
    <BlogContainer>
      <BlogHeader>
        <BlogTitle><FiBookOpen style={{ marginRight: 8 }} /> Prep Nexus Blog</BlogTitle>
        <p style={{ color: '#6366f1', fontSize: '1.1rem', marginBottom: 0 }}>
          Insights, tips, and guides to help you grow your career.
        </p>
      </BlogHeader>
      <main>
        <BlogGrid>
          {blogs.map(blog => (
            <article key={blog.id} itemScope itemType="https://schema.org/BlogPosting" onClick={() => setSelectedBlog(blog)}>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: blog.title,
                image: blog.image,
                author: { '@type': 'Person', name: blog.author },
                datePublished: blog.date,
                description: blog.summary,
                articleBody: blog.content,
                publisher: { '@type': 'Organization', name: 'Prep Nexus' },
                mainEntityOfPage: `https://prepnexus.netlify.app/blog/${blog.id}`
              }) }} />
              <BlogImage src={blog.image} alt={blog.title} />
              <BlogCardTitle as="h2">{blog.title}</BlogCardTitle>
              <BlogMeta>
                <span><FiUser /> {blog.author}</span>
                <span><FiCalendar /> {new Date(blog.date).toLocaleDateString()}</span>
              </BlogMeta>
              <BlogSummary>{blog.summary}</BlogSummary>
              <ReadMoreBtn>Read More <FiArrowRight /></ReadMoreBtn>
            </article>
          ))}
        </BlogGrid>
      </main>
      {selectedBlog && (
        <ModalOverlay onClick={() => setSelectedBlog(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <header>
              <h1 style={{ color: '#3730a3', fontWeight: 800 }}>{selectedBlog.title}</h1>
              <BlogMeta>
                <span><FiUser /> {selectedBlog.author}</span>
                <span><FiCalendar /> {new Date(selectedBlog.date).toLocaleDateString()}</span>
              </BlogMeta>
            </header>
            <BlogImage src={selectedBlog.image} alt={selectedBlog.title} style={{ maxHeight: 220 }} />
            <main>
              <div style={{ color: '#334155', fontSize: '1.1rem', margin: '1.5rem 0', whiteSpace: 'pre-line' }}>{selectedBlog.content}</div>
            </main>
            <CloseBtn onClick={() => setSelectedBlog(null)}>Close</CloseBtn>
          </ModalContent>
        </ModalOverlay>
      )}
    </BlogContainer>
  );
};

export default Blog; 
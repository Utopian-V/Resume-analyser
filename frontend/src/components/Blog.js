import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiBookOpen, FiUser, FiCalendar, FiTag, FiArrowRight, FiX, FiLoader } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// --- Fallback Blog Data (used when API is unavailable) ---
export const fallbackBlogs = [
  {
    id: 1,
    title: 'How to Make Your Resume Stand Out in 2024',
    author: {
      name: 'Jane Doe',
      slug: 'jane-doe',
      bio: 'Career coach and resume expert.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    date: '2024-07-18',
    summary: 'Discover the latest tips and tricks to craft a resume that catches recruiters\' eyes and lands you more interviews.',
    content: `In today’s competitive job market, your resume needs to do more than just list your experience. Here’s how to make it shine:

1. Use a clean, modern format with plenty of white space.
2. Highlight measurable achievements, not just responsibilities.
3. Tailor your resume for each job application.
4. Use strong action verbs and avoid clichés.
5. Keep it concise—one page is best for most roles.

Remember, your resume is your personal marketing document. Make every word count!`,
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
    tags: ['Resume', 'Career', 'Tips']
  },
  {
    id: 2,
    title: 'Mastering DSA for Tech Interviews',
    author: {
      name: 'John Smith',
      slug: 'john-smith',
      bio: 'Software engineer and interview prep mentor.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
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
    tags: ['DSA', 'Interview', 'Preparation']
  },
  {
    id: 3,
    title: 'The Power of Networking in Your Job Search',
    author: {
      name: 'Priya Patel',
      slug: 'priya-patel',
      bio: 'Recruiter and networking advocate.',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
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
    tags: ['Networking', 'Career', 'Advice']
  },
  {
    id: 4,
    title: 'Top 10 Resume Mistakes to Avoid',
    author: {
      name: 'Alex Kim',
      slug: 'alex-kim',
      bio: 'HR specialist and hiring manager.',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    date: '2024-07-05',
    summary: 'Avoid these common pitfalls to ensure your resume gets noticed for the right reasons.',
    content: `A single typo or a generic objective can cost you an interview. Here are the top mistakes:

1. Typos and grammatical errors
2. Using the same resume for every job
3. Listing duties instead of achievements
4. Overly long or short resumes
5. Unprofessional email addresses

Proofread, tailor, and keep it professional!`,
    image: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80',
    tags: ['Resume', 'Mistakes', 'Career']
  },
  {
    id: 5,
    title: 'How to Ace Behavioral Interviews',
    author: {
      name: 'Sara Lee',
      slug: 'sara-lee',
      bio: 'Behavioral interview coach.',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    date: '2024-06-28',
    summary: 'Master the STAR method and answer behavioral questions with confidence.',
    content: `Behavioral interviews are about storytelling. Use the STAR method:

- Situation: Set the context
- Task: What was your responsibility?
- Action: What did you do?
- Result: What was the outcome?

Practice with real examples from your experience.`,
    image: 'https://images.unsplash.com/photo-1515168833906-d2a3b82b302b?auto=format&fit=crop&w=600&q=80',
    tags: ['Interview', 'Behavioral', 'STAR']
  },
  {
    id: 6,
    title: '5 Tech Trends Shaping the Future of Work',
    author: {
      name: 'Priya Singh',
      slug: 'priya-singh',
      bio: 'Tech journalist and futurist.',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    date: '2024-06-20',
    summary: 'From AI to remote work, here are the trends you need to watch to stay ahead.',
    content: `The workplace is evolving fast. Key trends:

1. AI-powered productivity tools
2. Remote and hybrid work
3. Upskilling and lifelong learning
4. Automation and new job roles
5. Focus on mental health and well-being

Stay adaptable and keep learning!`,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
    tags: ['Tech', 'Trends', 'Future']
  },
  {
    id: 7,
    title: 'Productivity Hacks for Busy Professionals',
    author: {
      name: 'David Chen',
      slug: 'david-chen',
      bio: 'Productivity coach and author.',
      avatar: 'https://randomuser.me/api/portraits/men/77.jpg'
    },
    date: '2024-06-12',
    summary: 'Simple strategies to get more done in less time, without burning out.',
    content: `Try these hacks:

- Time blocking your calendar
- The 2-minute rule
- Batch similar tasks
- Take regular breaks
- Use productivity tools (but don’t overdo it)

Remember, rest is productive too!`,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
    tags: ['Productivity', 'Hacks', 'Work']
  },
  {
    id: 8,
    title: 'Building a Personal Brand Online',
    author: {
      name: 'Emily Carter',
      slug: 'emily-carter',
      bio: 'Personal branding strategist.',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    date: '2024-06-01',
    summary: 'Your online presence matters. Here’s how to stand out and attract opportunities.',
    content: `Start with a strong LinkedIn profile, share your expertise, and engage with your community. Consistency and authenticity are key.`,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    tags: ['Branding', 'Online', 'Career']
  },
  {
    id: 9,
    title: 'DSA vs. System Design: What Matters More?',
    author: {
      name: 'Ravi Kumar',
      slug: 'ravi-kumar',
      bio: 'Senior software architect.',
      avatar: 'https://randomuser.me/api/portraits/men/29.jpg'
    },
    date: '2024-05-25',
    summary: 'Understand the difference and why both are important for tech interviews.',
    content: `DSA tests your problem-solving, while system design shows your architectural thinking. Prepare for both to maximize your chances.`,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
    tags: ['DSA', 'System Design', 'Interview']
  }
];
// Helper functions that work with dynamic blog data
export const getAuthors = (blogList) => Array.from(new Map(blogList.map(b => [b.author.slug, b.author])).values());
export const getTags = (blogList) => Array.from(new Set(blogList.flatMap(b => b.tags)));

export function getPostsByAuthor(slug, blogList = fallbackBlogs) {
  return blogList.filter(b => b.author.slug === slug);
}
export function getPostsByTag(tag, blogList = fallbackBlogs) {
  return blogList.filter(b => b.tags.includes(tag));
}
export function getRelatedPosts(post, blogList = fallbackBlogs, count = 2) {
  // Related by tag, then by author
  const byTag = blogList.filter(b => b.id !== post.id && b.tags.some(t => post.tags.includes(t)));
  if (byTag.length >= count) return byTag.slice(0, count);
  const byAuthor = blogList.filter(b => b.id !== post.id && b.author.slug === post.author.slug);
  const combined = [...byTag, ...byAuthor.filter(b => !byTag.includes(b))];
  return combined.slice(0, count);
}

export const NotFound = () => (
  <div style={{ color: '#ef4444', textAlign: 'center', margin: '4rem 0', fontWeight: 700, fontSize: '2rem' }}>
    404 – Page Not Found
  </div>
);

// --- Styled Components ---
const BlogContainer = styled.div`
  max-width: 1200px;
  margin: 2.5rem auto;
  padding: 0 1rem;
  font-family: 'Inter', 'Nunito', sans-serif;
`;
const HeroSection = styled.div`
  background: linear-gradient(120deg, #232946 60%, #3730a3 100%);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(99,102,241,0.13);
  padding: 2.5rem 2rem 2rem 2rem;
  margin-bottom: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2.5rem;
`;
const HeroImage = styled.img`
  width: 340px;
  height: 220px;
  object-fit: cover;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px rgba(99,102,241,0.10);
`;
const HeroContent = styled.div`
  flex: 1;
  min-width: 260px;
`;
const HeroTitle = styled.h1`
  color: #fff;
  font-size: 2.3rem;
  font-weight: 900;
  margin-bottom: 1rem;
`;
const HeroMeta = styled.div`
  color: #a5b4fc;
  font-size: 1rem;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;
const HeroSummary = styled.p`
  color: #e0e7ff;
  font-size: 1.15rem;
  margin-bottom: 1.5rem;
`;
const ReadMoreBtn = styled.button`
  background: #6366f1;
  color: #fff;
  padding: 0.7rem 1.5rem;
  border-radius: 0.7rem;
  font-weight: 700;
  border: none;
  font-size: 1.1rem;
  box-shadow: 0 2px 12px rgba(99,102,241,0.10);
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #3730a3; }
`;
const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 2rem;
`;
const BlogCard = styled.div`
  background: rgba(30,41,59,0.95);
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
  height: 160px;
  object-fit: cover;
  border-radius: 0.8rem;
  margin-bottom: 1rem;
`;
const BlogCardTitle = styled.h2`
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;
const BlogMeta = styled.div`
  color: #a5b4fc;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const BlogSummary = styled.p`
  color: #cbd5e1;
  font-size: 1.05rem;
  margin-bottom: 1rem;
  min-height: 60px;
`;
const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;
const BlogTag = styled.span`
  background: linear-gradient(90deg, #6366f1 60%, #3730a3 100%);
  color: #fff;
  border-radius: 0.7em;
  padding: 0.2em 0.9em;
  font-size: 0.95em;
  font-weight: 700;
`;

const TrendingSection = styled.div`
  margin: 3rem 0 2rem 0;
  position: relative;
  overflow: hidden;
`;

const TrendingTags = styled.div`
  margin: 3rem 0;
  position: relative;
`;

const TagsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #6366f1;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border-radius: 2px;
  }
`;

const TagsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.8rem;
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem;
  background: rgba(99, 102, 241, 0.05);
  border-radius: 2rem;
  border: 1px solid rgba(99, 102, 241, 0.15);
  backdrop-filter: blur(25px);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 60%);
    border-radius: 2rem;
    pointer-events: none;
  }
`;

const TrendingTag = styled.button`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 1rem;
  padding: 0.8rem 1rem;
  color: #6366f1;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 12px 30px rgba(99, 102, 241, 0.25);
    color: #fff;
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 1;
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
  background: #181e2a;
  border-radius: 1.2rem;
  padding: 2.5rem 2rem 2rem 2rem;
  min-width: 350px;
  max-width: 95vw;
  max-height: 90vh;
  box-shadow: 0 8px 32px rgba(99,102,241,0.18);
  text-align: left;
  overflow-y: auto;
  color: #e2e8f0;
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

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Markdown formatting function
function formatMarkdown(content) {
  if (!content) return '';
  
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 2rem 0 1rem 0;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 2.5rem 0 1rem 0;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 2.2rem; font-weight: 900; color: #1e293b; margin: 2.5rem 0 1rem 0;">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<li style="margin: 0.5rem 0;">$1</li>')
    .replace(/^- (.*$)/gim, '<li style="margin: 0.5rem 0;">$1</li>')
    .replace(/(<li.*<\/li>)/s, '<ul style="margin: 1.5rem 0; padding-left: 1.5rem;">$1</ul>')
    
    // Numbered lists
    .replace(/^\d+\. (.*$)/gim, '<li style="margin: 0.5rem 0;">$1</li>')
    .replace(/(<li.*<\/li>)/s, '<ol style="margin: 1.5rem 0; padding-left: 1.5rem;">$1</ol>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #6366f1; text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre style="background: #f1f5f9; padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1.5rem 0;"><code style="font-family: monospace;">$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code style="background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace;">$1</code>')
    
    // Paragraphs
    .replace(/\n\n/g, '</p><p style="margin: 1rem 0;">')
    .replace(/^(.+)$/gm, '<p style="margin: 1rem 0;">$1</p>')
    
    // Clean up empty paragraphs
    .replace(/<p style="margin: 1rem 0;"><\/p>/g, '')
    .replace(/<p style="margin: 1rem 0;"><\/p>/g, '');
}

export default function Blog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalBlog, setModalBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blogs/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Extract blogs array from API response
        const blogsArray = data.blogs || data;
        setBlogs(blogsArray);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setError("Failed to load blog posts. Please try again later.");
        setBlogs(fallbackBlogs); // Fallback to local data on error
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Featured post (first blog)
  const featured = blogs[0];
  const latest = blogs.slice(1);

  if (loading && !blogs.length) {
    return (
      <BlogContainer>
        <Helmet>
          <title>Prep Nexus Blog – Loading...</title>
          <meta name="description" content="Loading blog posts from Prep Nexus." />
        </Helmet>
        <LoadingSpinner>
          <FiLoader size={50} className="spinner" />
          <h2>Loading blog posts...</h2>
        </LoadingSpinner>
      </BlogContainer>
    );
  }

  if (error) {
    return (
      <BlogContainer>
        <Helmet>
          <title>Prep Nexus Blog – Error</title>
          <meta name="description" content="Error loading blog posts from Prep Nexus." />
        </Helmet>
        <div style={{ textAlign: 'center', margin: '4rem 0' }}>
          <h2>{error}</h2>
          <p>Please try again later or check your network connection.</p>
        </div>
      </BlogContainer>
    );
  }

  if (!blogs.length) {
    return <NotFound />;
  }

  return (
    <BlogContainer>
      <Helmet>
        <title>Prep Nexus Blog – Career Tips, DSA, Resume, and More</title>
        <meta name="description" content="Insights, tips, and guides to help you grow your career. Read the latest from Prep Nexus." />
        <meta name="keywords" content="career tips, DSA, resume writing, interview preparation, job search, tech interviews, coding, programming" />
        <meta property="og:title" content="Prep Nexus Blog – Career Tips, DSA, Resume, and More" />
        <meta property="og:description" content="Insights, tips, and guides to help you grow your career. Read the latest from Prep Nexus." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prepnexus.netlify.app/blog" />
        <meta property="og:image" content="https://prepnexus.netlify.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prep Nexus Blog – Career Tips, DSA, Resume, and More" />
        <meta name="twitter:description" content="Insights, tips, and guides to help you grow your career. Read the latest from Prep Nexus." />
        <meta name="twitter:image" content="https://prepnexus.netlify.app/og-image.png" />
        <link rel="canonical" href="https://prepnexus.netlify.app/blog" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Prep Nexus Blog",
          "description": "Insights, tips, and guides to help you grow your career",
          "url": "https://prepnexus.netlify.app/blog",
          "publisher": {
            "@type": "Organization",
            "name": "Prep Nexus",
            "url": "https://prepnexus.netlify.app"
          },
          "blogPost": blogs.map(blog => ({
            "@type": "BlogPosting",
            "headline": blog.title,
            "author": {
              "@type": "Person",
              "name": blog.author.name
            },
            "datePublished": blog.date,
            "dateModified": blog.date,
            "description": blog.summary || blog.content.substring(0, 160),
            "image": blog.image,
            "url": `https://prepnexus.netlify.app/blog/${blog.id}`
          }))
        })}</script>
      </Helmet>
      {/* Hero Section */}
      <HeroSection>
        <HeroImage src={featured.image} alt={featured.title} />
        <HeroContent>
          <HeroTitle>{featured.title}</HeroTitle>
          <HeroMeta>
            <span><FiUser /> {featured.author.name}</span>
            <span><FiCalendar /> {featured.date}</span>
          </HeroMeta>
          <HeroSummary>{featured.summary}</HeroSummary>
          <TagList>
            {featured.tags.map(tag => <BlogTag key={tag}><FiTag style={{marginRight: 4}} />{tag}</BlogTag>)}
          </TagList>
          <ReadMoreBtn onClick={() => setModalBlog(featured)}>
            Read Full Article <FiArrowRight style={{marginLeft: 6}} />
          </ReadMoreBtn>
        </HeroContent>
      </HeroSection>

      {/* Trending Tags */}
      <TrendingSection>
        <TrendingTags>
          <TagsTitle>Trending Topics</TagsTitle>
          <TagsContainer>
            <TrendingTag>AI</TrendingTag>
            <TrendingTag>ML</TrendingTag>
            <TrendingTag>DSA</TrendingTag>
            <TrendingTag>System Design</TrendingTag>
            <TrendingTag>Behavioral</TrendingTag>
            <TrendingTag>Resume</TrendingTag>
            <TrendingTag>Networking</TrendingTag>
            <TrendingTag>Leadership</TrendingTag>
            <TrendingTag>Startups</TrendingTag>
            <TrendingTag>Remote</TrendingTag>
            <TrendingTag>Career Growth</TrendingTag>
            <TrendingTag>Tech Trends</TrendingTag>
            <TrendingTag>Productivity</TrendingTag>
            <TrendingTag>Branding</TrendingTag>
            <TrendingTag>Innovation</TrendingTag>
          </TagsContainer>
        </TrendingTags>
      </TrendingSection>

      {/* Latest Articles Grid */}
      <BlogGrid>
        {latest.map(blog => (
          <BlogCard key={blog.id} onClick={() => navigate(`/blog/${blog.id}`)}>
            <BlogImage src={blog.image} alt={blog.title} />
            <BlogCardTitle>{blog.title}</BlogCardTitle>
            <BlogMeta>
              <span><FiUser /> {blog.author.name}</span>
              <span><FiCalendar /> {blog.date}</span>
            </BlogMeta>
            <BlogSummary>{blog.summary}</BlogSummary>
            <TagList>
              {blog.tags.map(tag => <BlogTag key={tag}>{tag}</BlogTag>)}
            </TagList>
            <ReadMoreBtn style={{marginTop: 8}}>Read More <FiArrowRight style={{marginLeft: 6}} /></ReadMoreBtn>
          </BlogCard>
        ))}
      </BlogGrid>

      {/* Blog Modal */}
      {modalBlog && (
        <ModalOverlay onClick={() => setModalBlog(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseBtn onClick={() => setModalBlog(null)}><FiX /> Close</CloseBtn>
            <h2 style={{color:'#fff', marginBottom: 8}}>{modalBlog.title}</h2>
            <BlogMeta style={{marginBottom: 18}}>
              <span><FiUser /> {modalBlog.author.name}</span>
              <span><FiCalendar /> {modalBlog.date}</span>
            </BlogMeta>
            <TagList style={{marginBottom: 18}}>
              {modalBlog.tags.map(tag => <BlogTag key={tag}>{tag}</BlogTag>)}
            </TagList>
            <img src={modalBlog.image} alt={modalBlog.title} style={{width:'100%', borderRadius:12, marginBottom:18, maxHeight:220, objectFit:'cover'}} />
            <div style={{whiteSpace:'pre-line', color:'#e2e8f0', fontSize:'1.13rem', lineHeight:1.7}}>{modalBlog.content}</div>
          </ModalContent>
        </ModalOverlay>
      )}
    </BlogContainer>
  );
}

export function AuthorPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchAuthorBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blogs/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const blogsArray = data.blogs || data;
        setBlogs(blogsArray);
        
        // Find author from blogs
        const authorBlog = blogsArray.find(b => b.author.slug === slug);
        if (authorBlog) {
          setAuthor(authorBlog.author);
        }
      } catch (err) {
        console.error("Failed to fetch author blogs:", err);
        setError("Failed to load author posts. Please try again later.");
        // Fallback to local data
        const fallbackAuthorBlog = fallbackBlogs.find(b => b.author.slug === slug);
        if (fallbackAuthorBlog) {
          setAuthor(fallbackAuthorBlog.author);
          setBlogs(fallbackBlogs);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorBlogs();
  }, [slug]);

  const posts = getPostsByAuthor(slug, blogs);

  if (loading) {
    return (
      <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <FiLoader size={50} className="animate-spin text-blue-500" />
        <h2>Loading author posts...</h2>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div style={{ color: '#ef4444', textAlign: 'center', margin: '3rem' }}>
        {error || 'Author not found.'}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
      <Helmet>
        <title>Posts by {author ? author.name : 'Author'} – Prep Nexus Blog</title>
        <meta name="description" content={author ? `Read all posts by ${author.name} on Prep Nexus Blog.` : 'Author not found.'} />
        <meta property="og:title" content={`Posts by ${author ? author.name : 'Author'} – Prep Nexus Blog`} />
        <meta property="og:description" content={author ? `Read all posts by ${author.name} on Prep Nexus Blog.` : 'Author not found.'} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`https://prepnexus.netlify.app/blog/author/${slug}`} />
        <meta property="og:image" content={author ? author.avatar : 'https://prepnexus.netlify.app/og-image.png'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Posts by ${author ? author.name : 'Author'} – Prep Nexus Blog`} />
        <meta name="twitter:description" content={author ? `Read all posts by ${author.name} on Prep Nexus Blog.` : 'Author not found.'} />
        <meta name="twitter:image" content={author ? author.avatar : 'https://prepnexus.netlify.app/og-image.png'} />
        <link rel="canonical" href={`https://prepnexus.netlify.app/blog/author/${slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://prepnexus.netlify.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://prepnexus.netlify.app/blog" },
            { "@type": "ListItem", "position": 3, "name": author ? author.name : 'Author', "item": `https://prepnexus.netlify.app/blog/author/${slug}` }
          ]
        })}</script>
      </Helmet>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
        <img src={author.avatar} alt={author.name} loading="lazy" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #6366f1' }} />
        <div>
          <h1 style={{ color: '#3730a3', fontWeight: 900, fontSize: '2.2rem', margin: 0 }}>{author.name}</h1>
          <div style={{ color: '#6366f1', fontWeight: 600 }}>{author.bio}</div>
        </div>
      </div>
      <h2 style={{ color: '#3730a3', fontWeight: 800, fontSize: '1.4rem', marginBottom: 18 }}>Posts by {author.name}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {posts.length > 0 ? posts.map(blog => (
          <article key={blog.id} style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(99,102,241,0.07)', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <img src={blog.image} alt={blog.title} loading="lazy" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '0.8rem', marginBottom: '1rem' }} />
            <h3 style={{ color: '#3730a3', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{blog.title}</h3>
            <div style={{ color: '#6366f1', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>{blog.author.name}</span>
              <span>{new Date(blog.date).toLocaleDateString()}</span>
            </div>
            <p style={{ color: '#334155', fontSize: '1.05rem', marginBottom: '1rem', minHeight: '60px' }}>{blog.summary}</p>
          </article>
        )) : <div style={{ color: '#6366f1', textAlign: 'center', gridColumn: '1/-1' }}>No posts by this author yet.</div>}
      </div>
    </div>
  );
}

export function TagPage() {
  const { tag } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchTagBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blogs/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const blogsArray = data.blogs || data;
        setBlogs(blogsArray);
      } catch (err) {
        console.error("Failed to fetch tag blogs:", err);
        setError("Failed to load tag posts. Please try again later.");
        setBlogs(fallbackBlogs); // Fallback to local data
      } finally {
        setLoading(false);
      }
    };
    fetchTagBlogs();
  }, [tag]);

  const posts = getPostsByTag(tag, blogs);

  if (loading) {
    return (
      <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <FiLoader size={50} className="animate-spin text-blue-500" />
        <h2>Loading tag posts...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: '#ef4444', textAlign: 'center', margin: '3rem' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
      <Helmet>
        <title>Posts tagged "{tag}" – Prep Nexus Blog</title>
        <meta name="description" content={`Read all posts tagged "${tag}" on Prep Nexus Blog.`} />
        <meta property="og:title" content={`Posts tagged "${tag}" – Prep Nexus Blog`} />
        <meta property="og:description" content={`Read all posts tagged "${tag}" on Prep Nexus Blog.`} />
        <meta property="og:type" content="blog" />
        <meta property="og:url" content={`https://prepnexus.netlify.app/blog/tag/${tag}`} />
        <meta property="og:image" content="https://prepnexus.netlify.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Posts tagged "${tag}" – Prep Nexus Blog`} />
        <meta name="twitter:description" content={`Read all posts tagged "${tag}" on Prep Nexus Blog.`} />
        <meta name="twitter:image" content="https://prepnexus.netlify.app/og-image.png" />
        <link rel="canonical" href={`https://prepnexus.netlify.app/blog/tag/${tag}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://prepnexus.netlify.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://prepnexus.netlify.app/blog" },
            { "@type": "ListItem", "position": 3, "name": tag, "item": `https://prepnexus.netlify.app/blog/tag/${tag}` }
          ]
        })}</script>
      </Helmet>
      <h1 style={{ color: '#3730a3', fontWeight: 900, fontSize: '2.2rem', marginBottom: 0 }}>Posts tagged "{tag}"</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginTop: 32 }}>
        {posts.length > 0 ? posts.map(blog => (
          <article key={blog.id} style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(99,102,241,0.07)', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <img src={blog.image} alt={blog.title} loading="lazy" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '0.8rem', marginBottom: '1rem' }} />
            <h3 style={{ color: '#3730a3', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{blog.title}</h3>
            <div style={{ color: '#6366f1', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>{blog.author.name}</span>
              <span>{new Date(blog.date).toLocaleDateString()}</span>
            </div>
            <p style={{ color: '#334155', fontSize: '1.05rem', marginBottom: '1rem', minHeight: '60px' }}>{blog.summary}</p>
          </article>
        )) : <div style={{ color: '#6366f1', textAlign: 'center', gridColumn: '1/-1' }}>No posts with this tag yet.</div>}
      </div>
    </div>
  );
}

export function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError("Blog post not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <BlogContainer>
        <Helmet>
          <title>Loading... - Prep Nexus Blog</title>
        </Helmet>
        <LoadingSpinner>
          <FiLoader size={50} className="spinner" />
          <h2>Loading blog post...</h2>
        </LoadingSpinner>
      </BlogContainer>
    );
  }

  if (error || !blog) {
    return (
      <BlogContainer>
        <Helmet>
          <title>Blog Not Found - Prep Nexus Blog</title>
        </Helmet>
        <NotFound />
      </BlogContainer>
    );
  }

  return (
    <BlogContainer>
      <Helmet>
        <title>{blog.title} - Prep Nexus Blog</title>
        <meta name="description" content={blog.summary || blog.content.substring(0, 160)} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.summary || blog.content.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://prepnexus.netlify.app/blog/${blog.id}`} />
        <meta property="og:image" content={blog.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.summary || blog.content.substring(0, 160)} />
        <meta name="twitter:image" content={blog.image} />
        <link rel="canonical" href={`https://prepnexus.netlify.app/blog/${blog.id}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": blog.title,
          "author": {
            "@type": "Person",
            "name": blog.author.name
          },
          "datePublished": blog.date,
          "dateModified": blog.date,
          "description": blog.summary || blog.content.substring(0, 160),
          "image": blog.image,
          "url": `https://prepnexus.netlify.app/blog/${blog.id}`,
          "publisher": {
            "@type": "Organization",
            "name": "Prep Nexus",
            "url": "https://prepnexus.netlify.app"
          }
        })}</script>
      </Helmet>

      {/* Blog Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/blog')}
          style={{
            background: 'none',
            border: 'none',
            color: '#6366f1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '1rem',
            fontSize: '1rem'
          }}
        >
          <FiArrowRight style={{ transform: 'rotate(180deg)' }} />
          Back to Blog
        </button>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '900', 
          color: '#1e293b', 
          marginBottom: '1rem',
          lineHeight: '1.2'
        }}>
          {blog.title}
        </h1>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          color: '#64748b'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiUser />
            {blog.author.name}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiCalendar />
            {blog.date}
          </span>
        </div>
        
        {blog.image && (
          <img 
            src={blog.image} 
            alt={blog.title}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '2rem'
            }}
          />
        )}
      </div>

      {/* Blog Content */}
      <div 
        style={{
          fontSize: '1.1rem',
          lineHeight: '1.8',
          color: '#334155',
          maxWidth: '800px'
        }}
        dangerouslySetInnerHTML={{ __html: formatMarkdown(blog.content) }}
      />
    </BlogContainer>
  );
}

const CTAButton = styled.button`
  background: linear-gradient(90deg, #6366f1 60%, #3730a3 100%);
  color: #fff;
  padding: 0.8rem 2rem;
  border-radius: 0.7rem;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  box-shadow: 0 2px 12px rgba(99,102,241,0.10);
  cursor: pointer;
  margin-top: 1.5rem;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: linear-gradient(90deg, #3730a3 60%, #6366f1 100%);
    transform: translateY(-2px) scale(1.03);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 4rem 0;
  
  .spinner {
    animation: spin 1s linear infinite;
    color: #6366f1;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  h2 {
    color: #6366f1;
    font-weight: 600;
    margin: 0;
  }
`; 
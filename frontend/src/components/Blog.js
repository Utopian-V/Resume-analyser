import React, { useState } from 'react';
import styled from 'styled-components';
import { FiBookOpen, FiUser, FiCalendar, FiTag, FiArrowRight, FiX } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// --- Blog Data (keep as is for now) ---
export const blogs = [
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
    summary: 'Discover the latest tips and tricks to craft a resume that catches recruiters’ eyes and lands you more interviews.',
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
];
export const authors = Array.from(new Map(blogs.map(b => [b.author.slug, b.author])).values());
export const tags = Array.from(new Set(blogs.flatMap(b => b.tags)));

export function getPostsByAuthor(slug) {
  return blogs.filter(b => b.author.slug === slug);
}
export function getPostsByTag(tag) {
  return blogs.filter(b => b.tags.includes(tag));
}
export function getRelatedPosts(post, count = 2) {
  // Related by tag, then by author
  const byTag = blogs.filter(b => b.id !== post.id && b.tags.some(t => post.tags.includes(t)));
  if (byTag.length >= count) return byTag.slice(0, count);
  const byAuthor = blogs.filter(b => b.id !== post.id && b.author.slug === post.author.slug);
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
const Tag = styled.span`
  background: linear-gradient(90deg, #6366f1 60%, #3730a3 100%);
  color: #fff;
  border-radius: 0.7em;
  padding: 0.2em 0.9em;
  font-size: 0.95em;
  font-weight: 700;
`;
const TrendingSection = styled.div`
  margin: 3rem 0 2rem 0;
`;
const TrendingTitle = styled.h3`
  color: #6366f1;
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;
const TrendingTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
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

export default function Blog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalBlog, setModalBlog] = useState(null);

  // Featured post (first blog)
  const featured = blogs[0];
  const latest = blogs.slice(1);

  return (
    <BlogContainer>
      <Helmet>
        <title>Prep Nexus Blog – Career Tips, DSA, Resume, and More</title>
        <meta name="description" content="Insights, tips, and guides to help you grow your career. Read the latest from Prep Nexus." />
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
            {featured.tags.map(tag => <Tag key={tag}><FiTag style={{marginRight: 4}} />{tag}</Tag>)}
          </TagList>
          <ReadMoreBtn onClick={() => setModalBlog(featured)}>
            Read Full Article <FiArrowRight style={{marginLeft: 6}} />
          </ReadMoreBtn>
        </HeroContent>
      </HeroSection>

      {/* Trending Tags */}
      <TrendingSection>
        <TrendingTitle>Trending Topics</TrendingTitle>
        <TrendingTags>
          {tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
        </TrendingTags>
      </TrendingSection>

      {/* Latest Articles Grid */}
      <BlogGrid>
        {latest.map(blog => (
          <BlogCard key={blog.id} onClick={() => setModalBlog(blog)}>
            <BlogImage src={blog.image} alt={blog.title} />
            <BlogCardTitle>{blog.title}</BlogCardTitle>
            <BlogMeta>
              <span><FiUser /> {blog.author.name}</span>
              <span><FiCalendar /> {blog.date}</span>
            </BlogMeta>
            <BlogSummary>{blog.summary}</BlogSummary>
            <TagList>
              {blog.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
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
              {modalBlog.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
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
  const author = authors.find(a => a.slug === slug);
  const posts = getPostsByAuthor(slug);
  if (!author) return <div style={{ color: '#ef4444', textAlign: 'center', margin: '3rem' }}>Author not found.</div>;
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
            {/* The original code had a Link component here, but Link is not imported.
                Assuming the intent was to navigate to the blog post directly or that
                the Link component was intended to be added. For now, removing the
                Link component as it's not available. */}
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
  const posts = getPostsByTag(tag);
  return (
    <div style={{ maxWidth: 1100, margin: '2rem auto', padding: '0 1rem' }}>
      <Helmet>
        <title>Posts tagged “{tag}” – Prep Nexus Blog</title>
        <meta name="description" content={`Read all posts tagged “${tag}” on Prep Nexus Blog.`} />
        <meta property="og:title" content={`Posts tagged “${tag}” – Prep Nexus Blog`} />
        <meta property="og:description" content={`Read all posts tagged “${tag}” on Prep Nexus Blog.`} />
        <meta property="og:type" content="blog" />
        <meta property="og:url" content={`https://prepnexus.netlify.app/blog/tag/${tag}`} />
        <meta property="og:image" content="https://prepnexus.netlify.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Posts tagged “${tag}” – Prep Nexus Blog`} />
        <meta name="twitter:description" content={`Read all posts tagged “${tag}” on Prep Nexus Blog.`} />
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
      <h1 style={{ color: '#3730a3', fontWeight: 900, fontSize: '2.2rem', marginBottom: 0 }}>Posts tagged “{tag}”</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginTop: 32 }}>
        {posts.length > 0 ? posts.map(blog => (
          <article key={blog.id} style={{ background: '#fff', borderRadius: '1.2rem', boxShadow: '0 2px 16px rgba(99,102,241,0.07)', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* The original code had a Link component here, but Link is not imported.
                Assuming the intent was to navigate to the blog post directly or that
                the Link component was intended to be added. For now, removing the
                Link component as it's not available. */}
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
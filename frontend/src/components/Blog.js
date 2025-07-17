import React, { useState } from 'react';
import styled from 'styled-components';
import { FiBookOpen, FiUser, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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
  const { id } = useParams();
  const navigate = useNavigate();
  const selectedBlog = id ? blogs.find(b => String(b.id) === String(id)) : null;

  // Blog List View
  if (!selectedBlog) {
    return (
      <BlogContainer>
        <Helmet>
          <title>Prep Nexus Blog – Career Tips, DSA, Resume, and More</title>
          <meta name="description" content="Insights, tips, and guides to help you grow your career. Read the latest from Prep Nexus." />
          <meta property="og:title" content="Prep Nexus Blog – Career Tips, DSA, Resume, and More" />
          <meta property="og:description" content="Insights, tips, and guides to help you grow your career. Read the latest from Prep Nexus." />
          <meta property="og:type" content="blog" />
          <meta property="og:url" content="https://prepnexus.netlify.app/blog" />
          <meta property="og:image" content="https://prepnexus.netlify.app/og-image.png" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Prep Nexus Blog – Career Tips, DSA, Resume, and More" />
          <meta name="twitter:description" content="Insights, tips, and guides to help you grow your career. Read the latest from Prep Nexus." />
          <meta name="twitter:image" content="https://prepnexus.netlify.app/og-image.png" />
          <link rel="canonical" href="https://prepnexus.netlify.app/blog" />
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://prepnexus.netlify.app/" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://prepnexus.netlify.app/blog" }
            ]
          })}</script>
        </Helmet>
        <BlogHeader>
          <BlogTitle><FiBookOpen style={{ marginRight: 8 }} /> Prep Nexus Blog</BlogTitle>
          <p style={{ color: '#6366f1', fontSize: '1.1rem', marginBottom: 0 }}>
            Insights, tips, and guides to help you grow your career.
          </p>
        </BlogHeader>
        <main>
          <BlogGrid>
            {blogs.map(blog => (
              <article key={blog.id} itemScope itemType="https://schema.org/BlogPosting">
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'BlogPosting',
                  headline: blog.title,
                  image: blog.image,
                  author: { '@type': 'Person', name: blog.author.name },
                  datePublished: blog.date,
                  description: blog.summary,
                  articleBody: blog.content,
                  publisher: { '@type': 'Organization', name: 'Prep Nexus' },
                  mainEntityOfPage: `https://prepnexus.netlify.app/blog/${blog.id}`
                }) }} />
                <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <BlogImage src={blog.image} alt={blog.title} loading="lazy" />
                  <BlogCardTitle as="h2">{blog.title}</BlogCardTitle>
                  <BlogMeta>
                    <span><FiUser /> {blog.author.name}</span>
                    <span><FiCalendar /> {new Date(blog.date).toLocaleDateString()}</span>
                  </BlogMeta>
                  <BlogSummary>{blog.summary}</BlogSummary>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    <Link to={`/blog/author/${blog.author.slug}`} style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'underline', fontSize: 14 }}>By {blog.author.name}</Link>
                    {blog.tags.map(tag => (
                      <Link key={tag} to={`/blog/tag/${tag}`} style={{ color: '#a21caf', fontWeight: 600, textDecoration: 'underline', fontSize: 14, marginLeft: 8 }}>#{tag}</Link>
                    ))}
                  </div>
                  <ReadMoreBtn as="span">Read More <FiArrowRight /></ReadMoreBtn>
                </Link>
              </article>
            ))}
          </BlogGrid>
        </main>
        <div style={{ textAlign: 'center', margin: '3rem 0 1rem 0' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <CTAButton>← Back to Prep Nexus Home</CTAButton>
          </Link>
        </div>
      </BlogContainer>
    );
  }

  // Single Blog Post View
  return (
    <BlogContainer>
      <nav style={{ marginBottom: 24 }}>
        <Link to="/blog" style={{ color: '#6366f1', fontWeight: 700, textDecoration: 'none', fontSize: 18 }}>
          ← Back to Blog
        </Link>
      </nav>
      <article itemScope itemType="https://schema.org/BlogPosting">
        <Helmet>
          <title>{selectedBlog.title} – Prep Nexus Blog</title>
          <meta name="description" content={selectedBlog.summary} />
          <meta property="og:title" content={`${selectedBlog.title} – Prep Nexus Blog`} />
          <meta property="og:description" content={selectedBlog.summary} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://prepnexus.netlify.app/blog/${selectedBlog.id}`} />
          <meta property="og:image" content={selectedBlog.image} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${selectedBlog.title} – Prep Nexus Blog`} />
          <meta name="twitter:description" content={selectedBlog.summary} />
          <meta name="twitter:image" content={selectedBlog.image} />
          <link rel="canonical" href={`https://prepnexus.netlify.app/blog/${selectedBlog.id}`} />
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://prepnexus.netlify.app/" },
              { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://prepnexus.netlify.app/blog" },
              { "@type": "ListItem", "position": 3, "name": selectedBlog.title, "item": `https://prepnexus.netlify.app/blog/${selectedBlog.id}` }
            ]
          })}</script>
        </Helmet>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: selectedBlog.title,
          image: selectedBlog.image,
          author: { '@type': 'Person', name: selectedBlog.author.name },
          datePublished: selectedBlog.date,
          description: selectedBlog.summary,
          articleBody: selectedBlog.content,
          publisher: { '@type': 'Organization', name: 'Prep Nexus' },
          mainEntityOfPage: `https://prepnexus.netlify.app/blog/${selectedBlog.id}`
        }) }} />
        <BlogImage src={selectedBlog.image} alt={selectedBlog.title} loading="lazy" style={{ maxHeight: 320 }} />
        <BlogCardTitle as="h1" style={{ fontSize: '2.2rem', marginTop: 16 }}>{selectedBlog.title}</BlogCardTitle>
        <BlogMeta>
          <span><FiUser /> {selectedBlog.author.name}</span>
          <span><FiCalendar /> {new Date(selectedBlog.date).toLocaleDateString()}</span>
        </BlogMeta>
        <BlogSummary style={{ fontSize: '1.2rem', color: '#6366f1', fontWeight: 600 }}>{selectedBlog.summary}</BlogSummary>
        <main>
          <div style={{ color: '#334155', fontSize: '1.15rem', margin: '2rem 0', whiteSpace: 'pre-line', lineHeight: 1.7 }}>{selectedBlog.content}</div>
        </main>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <Link to={`/blog/author/${selectedBlog.author.slug}`} style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'underline', fontSize: 15 }}>By {selectedBlog.author.name}</Link>
          {selectedBlog.tags.map(tag => (
            <Link key={tag} to={`/blog/tag/${tag}`} style={{ color: '#a21caf', fontWeight: 600, textDecoration: 'underline', fontSize: 15, marginLeft: 8 }}>#{tag}</Link>
          ))}
        </div>
        <div style={{ margin: '2.5rem 0 1.5rem 0', textAlign: 'center' }}>
          <CTAButton onClick={() => navigate('/')}>Visit Prep Nexus Main Site</CTAButton>
        </div>
        <div style={{ display: 'flex', gap: 16, margin: '1.5rem 0' }}>
          <a href={`https://twitter.com/intent/tweet?url=https://prepnexus.netlify.app/blog/${selectedBlog.id}&text=${encodeURIComponent(selectedBlog.title)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1da1f2', fontWeight: 700 }}>Share on Twitter</a>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=https://prepnexus.netlify.app/blog/${selectedBlog.id}&title=${encodeURIComponent(selectedBlog.title)}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5', fontWeight: 700 }}>Share on LinkedIn</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=https://prepnexus.netlify.app/blog/${selectedBlog.id}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1877f3', fontWeight: 700 }}>Share on Facebook</a>
        </div>
        <section style={{ marginTop: 40 }}>
          <h3 style={{ color: '#3730a3', fontWeight: 800, fontSize: '1.3rem', marginBottom: 12 }}>Read More Career Tips</h3>
          <BlogGrid>
            {blogs.filter(b => b.id !== selectedBlog.id).map(blog => (
              <article key={blog.id} itemScope itemType="https://schema.org/BlogPosting">
                <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <BlogImage src={blog.image} alt={blog.title} loading="lazy" />
                  <BlogCardTitle as="h2">{blog.title}</BlogCardTitle>
                  <BlogMeta>
                    <span><FiUser /> {blog.author.name}</span>
                    <span><FiCalendar /> {new Date(blog.date).toLocaleDateString()}</span>
                  </BlogMeta>
                  <BlogSummary>{blog.summary}</BlogSummary>
                  <ReadMoreBtn as="span">Read More <FiArrowRight /></ReadMoreBtn>
                </Link>
              </article>
            ))}
          </BlogGrid>
        </section>
        <section style={{ marginTop: 40 }}>
          <h3 style={{ color: '#3730a3', fontWeight: 800, fontSize: '1.3rem', marginBottom: 12 }}>Related Posts</h3>
          <BlogGrid>
            {getRelatedPosts(selectedBlog, 2).map(blog => (
              <article key={blog.id} itemScope itemType="https://schema.org/BlogPosting">
                <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <BlogImage src={blog.image} alt={blog.title} loading="lazy" />
                  <BlogCardTitle as="h2">{blog.title}</BlogCardTitle>
                  <BlogMeta>
                    <span><FiUser /> {blog.author.name}</span>
                    <span><FiCalendar /> {new Date(blog.date).toLocaleDateString()}</span>
                  </BlogMeta>
                  <BlogSummary>{blog.summary}</BlogSummary>
                </Link>
              </article>
            ))}
          </BlogGrid>
        </section>
      </article>
    </BlogContainer>
  );
};

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
            <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={blog.image} alt={blog.title} loading="lazy" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '0.8rem', marginBottom: '1rem' }} />
              <h3 style={{ color: '#3730a3', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{blog.title}</h3>
              <div style={{ color: '#6366f1', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>{blog.author.name}</span>
                <span>{new Date(blog.date).toLocaleDateString()}</span>
              </div>
              <p style={{ color: '#334155', fontSize: '1.05rem', marginBottom: '1rem', minHeight: '60px' }}>{blog.summary}</p>
            </Link>
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
            <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={blog.image} alt={blog.title} loading="lazy" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '0.8rem', marginBottom: '1rem' }} />
              <h3 style={{ color: '#3730a3', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{blog.title}</h3>
              <div style={{ color: '#6366f1', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>{blog.author.name}</span>
                <span>{new Date(blog.date).toLocaleDateString()}</span>
              </div>
              <p style={{ color: '#334155', fontSize: '1.05rem', marginBottom: '1rem', minHeight: '60px' }}>{blog.summary}</p>
            </Link>
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

export default Blog; 
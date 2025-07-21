import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUser, FiCalendar, FiTag, FiArrowRight, FiLoader } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Configuration
const API_BASE_URL = process.env.REACT_API_URL;

// Shared Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const LoadingState = ({ title }) => (
  <Container>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '400px' 
    }}>
      <FiLoader size={50} style={{ animation: 'spin 1s linear infinite' }} />
      <h2>Loading...</h2>
    </div>
  </Container>
);

const ErrorState = ({ title, message }) => (
  <Container>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
      <h2>{message}</h2>
      <p>Please try again later or check your network connection.</p>
    </div>
  </Container>
);

const BlogMeta = ({ author, date }) => (
  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', opacity: 0.9 }}>
    <span><FiUser /> {author}</span>
    <span><FiCalendar /> {date}</span>
  </div>
);

const BlogTags = ({ tags, variant = 'default' }) => {
  if (!tags || tags.length === 0) return null;
  
  const tagStyle = variant === 'hero' 
    ? { background: 'rgba(255, 255, 255, 0.2)', color: 'white' }
    : { background: '#f3f4f6', color: '#374151' };
  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
      {tags.map(tag => (
        <span key={tag} style={{
          ...tagStyle,
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <FiTag />{tag}
        </span>
      ))}
    </div>
  );
};

const Button = styled.button`
  background: ${props => props.variant === 'hero' ? 'rgba(255, 255, 255, 0.2)' : '#6366f1'};
  border: 1px solid ${props => props.variant === 'hero' ? 'rgba(255, 255, 255, 0.3)' : '#6366f1'};
  color: ${props => props.variant === 'hero' ? 'white' : 'white'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.variant === 'hero' ? 'rgba(255, 255, 255, 0.3)' : '#5855eb'};
  }
`;

// Blog Card Component
const BlogCard = ({ blog, onClick, variant = 'grid' }) => {
  const isHero = variant === 'hero';
  
  // Handle different author formats
  const authorName = typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Unknown Author';
  const authorAvatar = typeof blog.author === 'object' ? blog.author.avatar : null;
  
  if (isHero) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        color: 'white'
      }}>
        <img 
          src={blog.image} 
          alt={blog.title}
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop";
          }}
        />
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', lineHeight: '1.2' }}>
            {blog.title}
          </h1>
          <BlogMeta author={authorName} date={blog.date} />
          <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
            {blog.content.substring(0, 200)}...
          </p>
          <BlogTags tags={blog.tags} variant="hero" />
          <Button variant="hero" onClick={onClick}>
            Read Full Article <FiArrowRight />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <img 
        src={blog.image} 
        alt={blog.title}
        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop";
        }}
      />
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', lineHeight: '1.3' }}>
          {blog.title}
        </h3>
        <BlogMeta author={authorName} date={blog.date} />
        <p style={{ color: '#555', lineHeight: '1.5', marginBottom: '1rem' }}>
          {blog.content.substring(0, 150)}...
        </p>
        <BlogTags tags={blog.tags} />
      </div>
    </div>
  );
};

// Custom Hook for Blog Data
const useBlogs = () => {
  const [state, setState] = useState({ loading: true, error: null, blogs: [] });
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const response = await fetch(`${API_BASE_URL}/api/blogs/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle both array and object responses
        const blogs = data.blogs || data || [];
        
        setState({ loading: false, error: null, blogs });
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setState({ 
          loading: false, 
          error: "Failed to load blog posts. Please try again later.", 
          blogs: [] 
        });
      }
    };
    fetchBlogs();
  }, []);
  
  return state;
};

const useBlog = (id) => {
  const [state, setState] = useState({ loading: true, error: null, blog: null });
  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Blog post not found");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setState({ loading: false, error: null, blog: data });
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setState({ 
          loading: false, 
          error: err.message || "Failed to load blog post. Please try again later.", 
          blog: null 
        });
      }
    };
    fetchBlog();
  }, [id]);
  
  return state;
};

// Main Components
export default function Blog() {
  const navigate = useNavigate();
  const { loading, error, blogs } = useBlogs();
  
  if (loading) return <LoadingState title="Prep Nexus Blog – Loading..." />;
  if (error) return <ErrorState title="Prep Nexus Blog – Error" message={error} />;
  if (!blogs.length) return <ErrorState title="Prep Nexus Blog" message="No blog posts found" />;
  
  const [featured, ...latest] = blogs;
  
  return (
    <Container>
      <Helmet>
        <title>Prep Nexus Blog – Career Tips, DSA, Resume, and More</title>
        <meta name="description" content="Insights, tips, and guides to help you grow your career. Read the latest from Prep Nexus." />
      </Helmet>
      
      <BlogCard 
        blog={featured} 
        variant="hero" 
        onClick={() => navigate(`/blog/${featured.id}`)} 
      />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '2rem' 
      }}>
        {latest.map(blog => (
          <BlogCard 
            key={blog.id} 
            blog={blog} 
            onClick={() => navigate(`/blog/${blog.id}`)} 
          />
        ))}
      </div>
    </Container>
  );
}

export function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, error, blog } = useBlog(id);
  
  if (loading) return <LoadingState title="Loading blog post..." />;
  if (error || !blog) return <ErrorState title="Blog Error" message={error || "Blog post not found"} />;
  
  // Handle different author formats
  const authorName = typeof blog.author === 'string' ? blog.author : blog.author?.name || 'Unknown Author';
  
  return (
    <Container>
      <Helmet>
        <title>{blog.title} – Prep Nexus Blog</title>
        <meta name="description" content={blog.content.substring(0, 160)} />
      </Helmet>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop";
          }}
        />
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          {blog.title}
        </h1>
        
        <BlogMeta author={authorName} date={blog.date} />
        <BlogTags tags={blog.tags} />
        
        <div 
          style={{ 
            lineHeight: '1.8', 
            fontSize: '1.1rem',
            color: '#333',
            marginBottom: '3rem'
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
        <div style={{ textAlign: 'center' }}>
          <Button onClick={() => navigate('/blog')}>
            ← Back to All Posts
          </Button>
        </div>
      </div>
    </Container>
  );
} 
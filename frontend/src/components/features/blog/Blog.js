import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_API_URL || 'https://resume-analyser-o3eu.onrender.com';
const ACCENT = '#6366f1';
const BG = '#f6f8fa';

function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
      <div style={{
        border: `4px solid #f3f3f3`,
        borderTop: `4px solid ${ACCENT}`,
        borderRadius: '50%',
        width: 44,
        height: 44,
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function BlogCard({ blog, onReadMore }) {
  // Strip HTML and get excerpt
  const excerpt = blog.content
    ? blog.content.replace(/<[^>]+>/g, '').slice(0, 150) + (blog.content.length > 150 ? '...' : '')
    : '';
  return (
    <div style={{
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 2px 16px rgba(99,102,241,0.07)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.2s, transform 0.2s',
      border: '1px solid #ececec',
      maxWidth: 420,
      minWidth: 320,
      margin: '1.5rem auto',
      cursor: 'pointer',
      position: 'relative',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 6px 24px ${ACCENT}22`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(99,102,241,0.07)'}
    >
      <img
        src={blog.image}
        alt={blog.title}
        style={{ width: '100%', height: 210, objectFit: 'cover', background: '#eee' }}
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop'; }}
      />
      <div style={{ padding: '1.5rem 1.3rem 1.2rem 1.3rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#23272f', lineHeight: 1.25 }}>{blog.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0 0.7rem 0' }}>
          <img
            src={blog.author?.avatar || 'https://randomuser.me/api/portraits/men/29.jpg'}
            alt={blog.author?.name || 'Author'}
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginRight: 12, border: `2px solid ${ACCENT}22` }}
            onError={e => { e.target.src = 'https://randomuser.me/api/portraits/men/29.jpg'; }}
          />
          <div style={{ fontSize: '1rem', color: '#555', fontWeight: 600 }}>{blog.author?.name || 'Unknown'}</div>
          <div style={{ fontSize: '0.97rem', color: '#888', marginLeft: 14 }}>{blog.date || 'No date'}</div>
        </div>
        <div style={{ color: '#444', fontSize: '1.08rem', marginBottom: 18, minHeight: 48 }}>{excerpt}</div>
        <button
          onClick={() => onReadMore(blog.id)}
          style={{
            background: ACCENT,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.6rem 1.4rem',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            alignSelf: 'flex-start',
            marginTop: 'auto',
            boxShadow: `0 2px 8px ${ACCENT}22`,
            transition: 'background 0.2s',
          }}
        >
          Read More
        </button>
      </div>
    </div>
  );
}

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [fetchTime, setFetchTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.time('fetchBlogs');
    const start = performance.now();
    fetch(`${API_BASE_URL}/api/blogs/`)
      .then(res => res.json())
      .then(data => {
        setBlogs(data.blogs || []);
        const duration = performance.now() - start;
        setFetchTime(duration);
        setLoading(false);
        console.timeEnd('fetchBlogs');
        console.log(`Fetched blogs in ${duration.toFixed(2)} ms`);
      })
      .catch(err => {
        setError('Failed to fetch');
        setLoading(false);
        setFetchTime(null);
        console.timeEnd('fetchBlogs');
      });
  }, []);

  if (error) return <div style={{ textAlign: 'center', color: '#c00', marginTop: '2rem' }}>{error}</div>;
  if (loading) return <Loader />;
  if (blogs.length === 0) return <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>No blogs found.</div>;

  return (
    <div style={{ background: BG, minHeight: '100vh', padding: '0 0 4rem 0', paddingTop: '72px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1rem 0 1rem' }}>
        <h1 style={{ fontWeight: 900, fontSize: '2.3rem', color: '#23272f', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
          Latest Blogs
        </h1>
        {fetchTime !== null && (
          <div style={{ color: '#888', margin: '0 0 1.5rem 0', fontSize: '1rem' }}>
            Data loaded in <b>{fetchTime.toFixed(2)} ms</b>
          </div>
        )}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.2rem',
        }}>
          {blogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} onReadMore={id => navigate(`/blog/${id}`)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch');
        setLoading(false);
      });
  }, [id]);

  if (error) return <div style={{ textAlign: 'center', color: '#c00', marginTop: '2rem' }}>{error}</div>;
  if (loading) return <Loader />;
  if (!blog) return <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>Blog not found.</div>;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px rgba(99,102,241,0.10)', padding: '2.5rem 2rem' }}>
      <img
        src={blog.image}
        alt={blog.title}
        style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 12, background: '#eee', marginBottom: 24 }}
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop'; }}
      />
      <h1 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: 12, color: '#23272f' }}>{blog.title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <img
          src={blog.author?.avatar || 'https://randomuser.me/api/portraits/men/29.jpg'}
          alt={blog.author?.name || 'Author'}
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginRight: 12, border: `2px solid ${ACCENT}22` }}
          onError={e => { e.target.src = 'https://randomuser.me/api/portraits/men/29.jpg'; }}
        />
        <div style={{ fontSize: '1rem', color: '#555', fontWeight: 600 }}>{blog.author?.name || 'Unknown'}</div>
        <div style={{ fontSize: '0.97rem', color: '#888', marginLeft: 14 }}>{blog.date || 'No date'}</div>
      </div>
      <div style={{ lineHeight: '1.7', color: '#222', fontSize: '1.13rem' }} dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
}

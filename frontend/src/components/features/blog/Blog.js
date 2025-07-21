import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_API_URL || 'https://resume-analyser-o3eu.onrender.com';

function BlogCard({ blog }) {
  return (
    <div style={{
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      borderRadius: 12,
      background: '#fff',
      overflow: 'hidden',
      margin: '1rem',
      width: 320,
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.2s',
    }}>
      <img
        src={blog.image}
        alt={blog.title}
        style={{ width: '100%', height: 180, objectFit: 'cover', background: '#eee' }}
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop'; }}
      />
      <div style={{ padding: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#222' }}>{blog.title}</h3>
        <div style={{ fontSize: '0.95rem', color: '#666', marginTop: 8 }}>
          {blog.author?.name || 'Unknown'} &middot; {blog.date || 'No date'}
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [fetchTime, setFetchTime] = useState(null);

  useEffect(() => {
    console.time('fetchBlogs');
    const start = performance.now();
    fetch(`${API_BASE_URL}/api/blogs/`)
      .then(res => res.json())
      .then(data => {
        setBlogs(data.blogs || []);
        const duration = performance.now() - start;
        setFetchTime(duration);
        console.timeEnd('fetchBlogs');
        console.log(`Fetched blogs in ${duration.toFixed(2)} ms`);
      })
      .catch(err => {
        setError('Failed to fetch');
        console.error(err);
        setFetchTime(null);
        console.timeEnd('fetchBlogs');
      });
  }, []);

  if (error) return <div>{error}</div>;
  if (blogs.length === 0) return <div>Loading...</div>;

  return (
    <div>
      {fetchTime !== null && (
        <div style={{ textAlign: 'center', color: '#888', margin: '1rem 0' }}>
          Data loaded in <b>{fetchTime.toFixed(2)} ms</b>
        </div>
      )}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        background: '#f6f8fa',
        minHeight: '100vh',
        padding: '2rem 0',
      }}>
        {blogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}

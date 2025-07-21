import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_API_URL || 'https://resume-analyser-o3eu.onrender.com';

export default function Blog() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blogs/`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.blogs) && data.blogs.length > 0) {
          setTitle(data.blogs[0].title);
        } else {
          setTitle('No blogs found');
        }
      })
      .catch(err => {
        setError('Failed to fetch');
      });
  }, []);

  if (error) return <div>{error}</div>;
  return <div>{title}</div>;
} 
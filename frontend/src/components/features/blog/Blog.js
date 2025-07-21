import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_API_URL || 'https://resume-analyser-o3eu.onrender.com';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching from:', `${API_BASE_URL}/api/blogs/`);

    fetch(`${API_BASE_URL}/api/blogs/`)
      .then(res => {
        console.log('Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Raw data received:', data);

        if (Array.isArray(data.blogs)) {
          const parsedBlogs = data.blogs.map(blog => ({
            ...blog,
            tags: JSON.parse(blog.tags), // Convert string to array
          }));
          console.log('Parsed blogs:', parsedBlogs);
          setBlogs(parsedBlogs);
        } else {
          setError('Invalid data format');
        }
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to fetch blogs');
      });
  }, []);

  return (
    <div>
      <h1>Blog List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {blogs.length === 0 && !error && <p>Loading...</p>}
      {blogs.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Content</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => (
              <tr key={index}>
                <td>{blog.id}</td>
                <td>{blog.title}</td>
                <td>{blog.content}</td>
                <td>{new Date(blog.createdAt).toLocaleString()}</td>
                <td>{new Date(blog.updatedAt).toLocaleString()}</td>
                <td>{blog.tags.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Blog;

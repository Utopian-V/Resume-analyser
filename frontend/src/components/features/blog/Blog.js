import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://resume-analyser-o3eu.onrender.com';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blogs/`)
      .then(res => res.json())
      .then(data => {
        setBlogs(data.blogs || []);
        console.log("Fetched blogs:", data.blogs);
      })
      .catch(err => {
        setError('Failed to fetch');
        console.error(err);
      });
  }, []);

  if (error) return <div>{error}</div>;
  if (blogs.length === 0) return <div>Loading...</div>;

  return (
    <table border="1" cellPadding="10">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Author</th>
          <th>Date</th>
          <th>Content Preview</th>
        </tr>
      </thead>
      <tbody>
        {blogs.map(blog => (
          <tr key={blog.id}>
            <td>{blog.id}</td>
            <td>{blog.title}</td>
            <td>{blog.author?.name}</td>
            <td>{blog.date}</td>
            <td>{blog.content_preview || blog.content?.slice(0, 100)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

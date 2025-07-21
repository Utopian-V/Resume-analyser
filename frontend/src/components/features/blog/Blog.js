import React, { useEffect, useState } from 'react';

const API_BASE_URL = process.env.REACT_API_URL || 'https://resume-analyser-o3eu.onrender.com';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/blogs/`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched blogs:", data.blogs);
        setBlogs(data.blogs || []);
      })
      .catch(err => {
        setError('Failed to fetch');
        console.error(err);
      });
  }, []);

  if (error) return <div>{error}</div>;
  if (blogs.length === 0) return <div>Loading...</div>;

  return (
    <table border="1" cellPadding="10" cellSpacing="0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Author</th>
          <th>Date</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {blogs.map(blog => (
          <tr key={blog.id}>
            <td>{blog.id}</td>
            <td>{blog.title}</td>
            <td>{blog.author?.name || 'Unknown'}</td>
            <td>{blog.date}</td>
            <td>
              {blog.image ? (
                <img src={blog.image} alt="blog" width="100" />
              ) : (
                'No Image'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

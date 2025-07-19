import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: #6366f1;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 2rem;
  
  &:hover {
    background: #5855eb;
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  background: #334155;
  border: 1px solid #475569;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  background: #334155;
  border: 1px solid #475569;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
  
  option {
    background: #1e293b;
    color: #fff;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const BlogCard = styled.div`
  background: #1e293b;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #334155;
`;

const BlogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const BlogTitle = styled.h3`
  color: #fff;
  margin: 0;
  flex: 1;
`;

const BlogActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: #475569;
  border: 1px solid #64748b;
  border-radius: 4px;
  padding: 0.5rem;
  color: #fff;
  cursor: pointer;
  
  &:hover {
    background: #6366f1;
  }
  
  &.danger:hover {
    background: #ef4444;
  }
`;

const BlogMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #94a3b8;
`;

const StatusBadge = styled.span`
  background: ${props => {
    switch (props.status) {
      case 'published': return '#22c55e';
      case 'draft': return '#64748b';
      case 'archived': return '#ef4444';
      default: return '#64748b';
    }
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
`;

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'How to Ace Technical Interviews',
      author: 'John Doe',
      status: 'published',
      publishDate: '2024-01-15',
      views: 1247,
      likes: 89
    },
    {
      id: 2,
      title: 'Mastering Data Structures and Algorithms',
      author: 'Jane Smith',
      status: 'draft',
      publishDate: null,
      views: 0,
      likes: 0
    },
    {
      id: 3,
      title: 'Career Growth Strategies for Developers',
      author: 'Mike Johnson',
      status: 'published',
      publishDate: '2024-01-10',
      views: 892,
      likes: 67
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (blogId) => {
    console.log('Edit blog:', blogId);
  };

  const handleDelete = (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setBlogs(prev => prev.filter(blog => blog.id !== blogId));
    }
  };

  const handleView = (blogId) => {
    console.log('View blog:', blogId);
  };

  return (
    <Container>
      <Title>Blog Management</Title>
      
      <Button onClick={() => window.location.href = '/admin/new-blog'}>
        Create New Blog
      </Button>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Search blogs by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </FilterSelect>
      </SearchBar>

      <BlogGrid>
        {filteredBlogs.map(blog => (
          <BlogCard key={blog.id}>
            <BlogHeader>
              <BlogTitle>{blog.title}</BlogTitle>
              <BlogActions>
                <ActionButton onClick={() => handleView(blog.id)}>
                  View
                </ActionButton>
                <ActionButton onClick={() => handleEdit(blog.id)}>
                  Edit
                </ActionButton>
                <ActionButton className="danger" onClick={() => handleDelete(blog.id)}>
                  Delete
                </ActionButton>
              </BlogActions>
            </BlogHeader>

            <BlogMeta>
              <span>By: {blog.author}</span>
              <StatusBadge status={blog.status}>
                {blog.status}
              </StatusBadge>
              {blog.publishDate && (
                <span>Published: {blog.publishDate}</span>
              )}
              <span>Views: {blog.views}</span>
              <span>Likes: {blog.likes}</span>
            </BlogMeta>
          </BlogCard>
        ))}
      </BlogGrid>
    </Container>
  );
} 
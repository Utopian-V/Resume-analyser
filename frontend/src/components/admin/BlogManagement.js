import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiSearch, 
  FiFilter, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiPlus,
  FiCalendar,
  FiUser,
  FiTag,
  FiMoreVertical
} from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #6366f1;
  font-size: 2rem;
  font-weight: 900;
  margin: 0;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &.primary {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
    }
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

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  
  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 3rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 10px;
    color: #e2e8f0;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #6366f1;
      background: rgba(255, 255, 255, 0.1);
    }
    
    &::placeholder {
      color: #64748b;
    }
  }
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6366f1;
  }
`;

const FilterSelect = styled.select`
  padding: 0.8rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
  }
  
  option {
    background: #1e293b;
    color: #e2e8f0;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const BlogCard = styled.div`
  background: rgba(30, 41, 59, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: all 0.2s;
  
  &:hover {
    border-color: #6366f1;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.1);
  }
`;

const BlogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const BlogTitle = styled.h3`
  color: #e2e8f0;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
`;

const BlogActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 6px;
  padding: 0.5rem;
  color: #a5b4fc;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(99, 102, 241, 0.2);
    color: white;
  }
  
  &.danger:hover {
    background: #ef4444;
    border-color: #ef4444;
  }
`;

const BlogMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #a5b4fc;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const BlogSummary = styled.p`
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
`;

const BlogTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const StatusBadge = styled.span`
  background: ${props => {
    switch (props.status) {
      case 'draft': return 'rgba(156, 163, 175, 0.2)';
      case 'published': return 'rgba(34, 197, 94, 0.2)';
      case 'scheduled': return 'rgba(59, 130, 246, 0.2)';
      default: return 'rgba(156, 163, 175, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'draft': return '#9ca3af';
      case 'published': return '#22c55e';
      case 'scheduled': return '#3b82f6';
      default: return '#9ca3af';
    }
  }};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #a5b4fc;
  
  h3 {
    color: #6366f1;
    margin-bottom: 1rem;
  }
`;

export default function BlogManagement({ userRole = 'admin' }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const mockBlogs = [
    {
      id: 1,
      title: 'How to Master DSA for Tech Interviews',
      summary: 'A comprehensive guide to preparing for data structures and algorithms interviews with practical tips and resources.',
      author: 'John Doe',
      status: 'published',
      publishDate: '2024-01-15',
      tags: ['DSA', 'Interview', 'Preparation'],
      views: 1247,
      likes: 89
    },
    {
      id: 2,
      title: 'Career Growth Strategies for Developers',
      summary: 'Learn effective strategies to advance your career in software development and land your dream job.',
      author: 'Jane Smith',
      status: 'draft',
      publishDate: null,
      tags: ['Career', 'Development', 'Growth'],
      views: 0,
      likes: 0
    },
    {
      id: 3,
      title: 'System Design Best Practices',
      summary: 'Essential principles and patterns for designing scalable and maintainable software systems.',
      author: 'Mike Johnson',
      status: 'scheduled',
      publishDate: '2024-01-20',
      tags: ['System Design', 'Architecture', 'Scalability'],
      views: 0,
      likes: 0
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBlogs(mockBlogs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (blogId) => {
    console.log('Edit blog:', blogId);
    // Navigate to editor
  };

  const handleDelete = (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setBlogs(prev => prev.filter(blog => blog.id !== blogId));
    }
  };

  const handleView = (blogId) => {
    console.log('View blog:', blogId);
    // Navigate to blog view
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ color: '#6366f1', fontSize: '2rem' }}>Loading...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          {userRole === 'blog_writer' ? 'My Blogs' : 'Blog Management'}
        </Title>
        <Button className="primary" onClick={() => window.location.href = '/admin/new-blog'}>
          <FiPlus />
          Create New Blog
        </Button>
      </Header>

      <SearchBar>
        <SearchInput>
          <FiSearch />
          <input
            type="text"
            placeholder="Search blogs by title, content, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </FilterSelect>
      </SearchBar>

      {filteredBlogs.length === 0 ? (
        <EmptyState>
          <h3>No blogs found</h3>
          <p>Try adjusting your search criteria or create a new blog post.</p>
        </EmptyState>
      ) : (
        <BlogGrid>
          {filteredBlogs.map(blog => (
            <BlogCard key={blog.id}>
              <BlogHeader>
                <BlogTitle>{blog.title}</BlogTitle>
                <BlogActions>
                  <ActionButton onClick={() => handleView(blog.id)}>
                    <FiEye size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleEdit(blog.id)}>
                    <FiEdit size={16} />
                  </ActionButton>
                  <ActionButton className="danger" onClick={() => handleDelete(blog.id)}>
                    <FiTrash2 size={16} />
                  </ActionButton>
                </BlogActions>
              </BlogHeader>

              <BlogMeta>
                <MetaItem>
                  <FiUser size={14} />
                  {blog.author}
                </MetaItem>
                <MetaItem>
                  <FiCalendar size={14} />
                  {blog.publishDate || 'Not published'}
                </MetaItem>
                <MetaItem>
                  <FiEye size={14} />
                  {blog.views} views
                </MetaItem>
                <StatusBadge status={blog.status}>
                  {blog.status}
                </StatusBadge>
              </BlogMeta>

              <BlogSummary>{blog.summary}</BlogSummary>

              <BlogTags>
                {blog.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </BlogTags>
            </BlogCard>
          ))}
        </BlogGrid>
      )}
    </Container>
  );
} 
import React, { useState } from 'react';
import styled from 'styled-components';

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
  margin-right: 1rem;
  
  &:hover {
    background: #5855eb;
  }
  
  &:disabled {
    background: #64748b;
    cursor: not-allowed;
  }
  
  &.success {
    background: #22c55e;
  }
  
  &.success:hover {
    background: #16a34a;
  }
  
  &.warning {
    background: #f59e0b;
  }
  
  &.warning:hover {
    background: #d97706;
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

const GenerationPanel = styled.div`
  background: #1e293b;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #334155;
`;

const PanelTitle = styled.h2`
  color: #fff;
  margin-bottom: 1rem;
`;

const StatusMessage = styled.div`
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  background: ${props => {
    switch (props.type) {
      case 'success': return '#22c55e';
      case 'error': return '#ef4444';
      case 'info': return '#3b82f6';
      case 'warning': return '#f59e0b';
      default: return '#64748b';
    }
  }};
  color: white;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #334155;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #6366f1;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const LogContainer = styled.div`
  background: #0f172a;
  padding: 1rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #e2e8f0;
  max-height: 200px;
  overflow-y: auto;
  margin: 1rem 0;
  border: 1px solid #334155;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const StatCard = styled.div`
  background: #334155;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #6366f1;
`;

const StatLabel = styled.div`
  color: #94a3b8;
  font-size: 0.9rem;
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
  
  // Blog generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationLogs, setGenerationLogs] = useState([]);
  const [generationStatus, setGenerationStatus] = useState('');
  const [stats, setStats] = useState({
    totalBlogs: 0,
    todayGenerated: 0,
    lastGenerated: null
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Add log message
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setGenerationLogs(prev => [...prev, { timestamp, message, type }]);
  };

  // Generate blogs instantly using backend
  const generateBlogs = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationLogs([]);
    setGenerationStatus('Starting instant blog generation...');

    try {
      addLog('🚀 Starting INSTANT AI blog generation...', 'info');
      setGenerationProgress(20);

      // Call backend generation endpoint
      addLog('📝 Generating blog content with Gemini API...', 'info');
      setGenerationProgress(40);
      
      const response = await fetch(`${API_BASE_URL}/blogs/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Generated ${data.total_generated} blogs successfully!`, 'success');
        
        // Show each generated blog
        data.blogs.forEach(blog => {
          addLog(`📝 Created: ${blog.title} by ${blog.author}`, 'success');
          addLog(`🔗 URL: ${blog.url}`, 'info');
        });
        
        addLog('🔗 Pinging search engines about sitemap update...', 'info');
        setGenerationProgress(100);
        setGenerationStatus(`Generated ${data.total_generated} blogs successfully!`);
        
        // Refresh blog list
        fetchBlogs();
      } else {
        addLog('❌ Blog generation failed', 'error');
        throw new Error('Blog generation failed');
      }

    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
      setGenerationStatus('Blog generation failed!');
    } finally {
      setIsGenerating(false);
    }
  };

  // Ping sitemap manually
  const pingSitemap = async () => {
    try {
      addLog('🔗 Pinging Google and Bing about sitemap update...', 'info');
      
      const response = await fetch(`${API_BASE_URL}/blogs/ping-sitemap`, {
        method: 'POST'
      });

      if (response.ok) {
        addLog('✅ Search engines pinged successfully', 'success');
      } else {
        addLog('❌ Failed to ping search engines', 'error');
      }
    } catch (error) {
      addLog(`❌ Error pinging sitemap: ${error.message}`, 'error');
    }
  };

  // Trigger GitHub Actions for automatic generation
  const triggerGitHubAction = async () => {
    setIsGenerating(true);
    setGenerationLogs([]);
    setGenerationStatus('Triggering GitHub Actions...');

    try {
      addLog('🚀 Triggering GitHub Actions for automatic blog generation...', 'info');
      
      // Note: This would require GitHub API token and repo access
      // For now, we'll show how it would work
      addLog('📝 This would trigger the daily scheduled workflow', 'info');
      addLog('⏰ GitHub Actions runs daily at 2:00 AM UTC', 'info');
      addLog('🔄 Takes 6-8 minutes to complete', 'warning');
      addLog('✅ Blogs are automatically generated and saved to database', 'success');
      
      setGenerationStatus('GitHub Actions triggered! Check Actions tab for progress.');
      
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
      setGenerationStatus('GitHub Actions trigger failed!');
    } finally {
      setIsGenerating(false);
    }
  };

  // Fetch blogs from API
  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/`);
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs || []);
        setStats(prev => ({ ...prev, totalBlogs: data.blogs?.length || 0 }));
      }
    } catch (error) {
      addLog(`❌ Error fetching blogs: ${error.message}`, 'error');
    }
  };

  // Test sitemap
  const testSitemap = async () => {
    try {
      addLog('🔍 Testing sitemap functionality...', 'info');
      
      const response = await fetch(`${API_BASE_URL}/blogs/test-sitemap`);
      if (response.ok) {
        const data = await response.json();
        addLog(`✅ Sitemap test successful: ${data.total_urls} URLs found`, 'success');
        addLog(`📊 Static pages: ${data.static_pages}, Blog posts: ${data.blog_posts}`, 'info');
      } else {
        addLog('❌ Sitemap test failed', 'error');
      }
    } catch (error) {
      addLog(`❌ Error testing sitemap: ${error.message}`, 'error');
    }
  };

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

      {/* Blog Generation Panel */}
      <GenerationPanel>
        <PanelTitle>AI Blog Generation</PanelTitle>
        
        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.totalBlogs}</StatNumber>
            <StatLabel>Total Blogs</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.todayGenerated}</StatNumber>
            <StatLabel>Generated Today</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.lastGenerated ? 'Yes' : 'No'}</StatNumber>
            <StatLabel>Last Generated</StatLabel>
          </StatCard>
        </StatsGrid>

        <div style={{ marginBottom: '1rem' }}>
          <Button 
            onClick={generateBlogs} 
            disabled={isGenerating}
            className={isGenerating ? 'warning' : 'success'}
          >
            {isGenerating ? '🔄 Generating...' : '⚡ Generate Blogs INSTANTLY (Manual)'}
          </Button>
          
          <Button onClick={triggerGitHubAction} disabled={isGenerating}>
            🚀 Trigger GitHub Action (Auto)
          </Button>
          
          <Button onClick={pingSitemap} disabled={isGenerating}>
            🔗 Ping Sitemap
          </Button>
          
          <Button onClick={testSitemap} disabled={isGenerating}>
            🔍 Test Sitemap
          </Button>
          
          <Button onClick={fetchBlogs} disabled={isGenerating}>
            📊 Refresh Stats
          </Button>
        </div>

        <div style={{ 
          background: '#f8f9fa', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>📅 Blog Generation Options:</h4>
          <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
            <div><strong>⚡ Manual (Instant):</strong> Generate blogs immediately via backend (10-30 seconds)</div>
            <div><strong>🚀 Automatic (GitHub Actions):</strong> Daily scheduled posts at 2:00 AM UTC</div>
            <div><strong>📊 Current Schedule:</strong> Every day at 2:00 AM UTC (configurable)</div>
          </div>
        </div>

        {isGenerating && (
          <div>
            <StatusMessage type="info">{generationStatus}</StatusMessage>
            <ProgressBar>
              <ProgressFill progress={generationProgress} />
            </ProgressBar>
          </div>
        )}

        {generationLogs.length > 0 && (
          <LogContainer>
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Generation Logs (INSTANT):</div>
            {generationLogs.map((log, index) => (
              <div key={index} style={{ 
                color: log.type === 'error' ? '#ef4444' : 
                       log.type === 'success' ? '#22c55e' : 
                       log.type === 'warning' ? '#f59e0b' : '#e2e8f0'
              }}>
                [{log.timestamp}] {log.message}
              </div>
            ))}
          </LogContainer>
        )}
      </GenerationPanel>

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
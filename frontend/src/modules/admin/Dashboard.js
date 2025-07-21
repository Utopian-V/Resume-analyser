/**
 * Admin Dashboard
 * Handled by: Admin Team
 * Responsibilities: System overview, quick actions, monitoring
 */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import analytics from '../analytics/tracker';

const DashboardContainer = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  min-height: 100vh;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #495057;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .value {
    font-size: 2rem;
    font-weight: bold;
    color: #212529;
    margin-bottom: 0.5rem;
  }
  
  .change {
    font-size: 0.9rem;
    color: ${props => props.trend === 'up' ? '#22c55e' : props.trend === 'down' ? '#ef4444' : '#6c757d'};
  }
`;

const QuickActions = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'primary' ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SystemStatus = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const StatusIndicator = styled.div`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.status === 'healthy' ? '#22c55e' : props.status === 'warning' ? '#f59e0b' : '#ef4444'};
  margin-right: 0.5rem;
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    blogsLast24h: 0,
    totalUsers: 0,
    activeUsers: 0
  });
  
  const [systemStatus, setSystemStatus] = useState('loading');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    analytics.trackPageView('admin_dashboard');
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch system metrics
      const metricsResponse = await fetch('https://resume-analyser-o3eu.onrender.com/api/performance/metrics');
      const metrics = await metricsResponse.json();
      
      // Fetch health status
      const healthResponse = await fetch('https://resume-analyser-o3eu.onrender.com/api/performance/health');
      const health = await healthResponse.json();
      
      setStats({
        totalBlogs: metrics.total_blogs || 0,
        blogsLast24h: metrics.blogs_last_24h || 0,
        totalUsers: metrics.user_activity_last_24h || 0,
        activeUsers: Math.floor((metrics.user_activity_last_24h || 0) * 0.3) // Estimate
      });
      
      setSystemStatus(health.status || 'unknown');
      setLoading(false);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setSystemStatus('error');
      setLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    analytics.trackButtonClick(action, 'admin_dashboard');
    
    switch (action) {
      case 'generate_blogs':
        // Trigger blog generation
        try {
          const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
          const response = await fetch(`${API_BASE_URL}/api/blogs/generate`, {
            method: 'POST'
          });
          if (response.ok) {
            alert('Blog generation started!');
            fetchDashboardData(); // Refresh stats
          }
        } catch (error) {
          alert('Failed to generate blogs');
        }
        break;
        
      case 'ping_sitemap':
        // Ping sitemap
        try {
          const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
          const response = await fetch(`${API_BASE_URL}/api/seo/ping-sitemap`, {
            method: 'POST'
          });
          if (response.ok) {
            alert('Sitemap pinged successfully!');
          }
        } catch (error) {
          alert('Failed to ping sitemap');
        }
        break;
        
      default:
        break;
    }
  };

  if (loading) {
    return <DashboardContainer>Loading dashboard...</DashboardContainer>;
  }

  return (
    <DashboardContainer>
      <h1>Admin Dashboard</h1>
      
      <StatsGrid>
        <StatCard>
          <h3>Total Blogs</h3>
          <div className="value">{stats.totalBlogs}</div>
          <div className="change">+{stats.blogsLast24h} in last 24h</div>
        </StatCard>
        
        <StatCard>
          <h3>Active Users</h3>
          <div className="value">{stats.activeUsers}</div>
          <div className="change">Last 24 hours</div>
        </StatCard>
        
        <StatCard>
          <h3>System Status</h3>
          <div className="value">
            <StatusIndicator status={systemStatus} />
            {systemStatus}
          </div>
          <div className="change">All systems operational</div>
        </StatCard>
        
        <StatCard>
          <h3>User Activity</h3>
          <div className="value">{stats.totalUsers}</div>
          <div className="change">Events in last 24h</div>
        </StatCard>
      </StatsGrid>
      
      <QuickActions>
        <h3>Quick Actions</h3>
        <ActionButton 
          variant="primary" 
          onClick={() => handleQuickAction('generate_blogs')}
        >
          ⚡ Generate Blogs
        </ActionButton>
        
        <ActionButton onClick={() => handleQuickAction('ping_sitemap')}>
          🔗 Ping Sitemap
        </ActionButton>
        
        <ActionButton onClick={() => handleQuickAction('refresh_stats')}>
          📊 Refresh Stats
        </ActionButton>
        
        <ActionButton onClick={() => handleQuickAction('view_logs')}>
          📋 View Logs
        </ActionButton>
      </QuickActions>
      
      <SystemStatus>
        <h3>System Status</h3>
        <p>
          <StatusIndicator status={systemStatus} />
          Overall system status: <strong>{systemStatus}</strong>
        </p>
        <p>Last updated: {new Date().toLocaleString()}</p>
      </SystemStatus>
    </DashboardContainer>
  );
};

export default AdminDashboard; 
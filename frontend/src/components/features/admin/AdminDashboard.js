import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout.js';
import WriterProfile from './WriterProfile.js';
import BlogEditor from './BlogEditor.js';
import BlogManagement from './BlogManagement.js';
import UserManagement from './UserManagement.js';
import QuestionManagement from './QuestionManagement.js';
import SystemSettings from './SystemSettings.js';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/profile" element={<WriterProfile />} />
        <Route path="/new-blog" element={<BlogEditor />} />
        <Route path="/blogs" element={<BlogManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/questions" element={<QuestionManagement />} />
        <Route path="/settings" element={<SystemSettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
}

// Simple Dashboard Home Component
function DashboardHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalQuestions: 0,
    activeWriters: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch basic stats (you can implement these endpoints)
      setStats({
        totalUsers: 1247,
        totalBlogs: 89,
        totalQuestions: 456,
        activeWriters: 12
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleQuickAction = async (action) => {
    setLoading(true);
    try {
      switch (action) {
        case 'generate_blogs':
          // Trigger blog generation
          const response = await fetch(`${API_BASE_URL}/api/blogs/generate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            alert(`✅ ${result.message}`);
            // Refresh stats
            fetchStats();
          } else {
            const error = await response.json();
            alert(`❌ Failed to generate blogs: ${error.detail || 'Unknown error'}`);
          }
          break;
          
        default:
          console.log('Action not implemented:', action);
      }
    } catch (error) {
      console.error('Quick action failed:', error);
      alert('❌ Action failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: '#6366f1', marginBottom: '2rem' }}>Admin Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} />
        <StatCard title="Total Blogs" value={stats.totalBlogs.toLocaleString()} />
        <StatCard title="Total Questions" value={stats.totalQuestions.toLocaleString()} />
        <StatCard title="Active Writers" value={stats.activeWriters.toLocaleString()} />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1rem'
      }}>
        <QuickActions onAction={handleQuickAction} loading={loading} />
        <RecentActivity />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={{
      background: '#1e293b',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #334155'
    }}>
      <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{title}</div>
      <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</div>
    </div>
  );
}

function QuickActions({ onAction, loading }) {
  return (
    <div style={{
      background: '#1e293b',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #334155'
    }}>
      <h3 style={{ color: '#6366f1', marginBottom: '1rem' }}>Quick Actions</h3>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <button 
          onClick={() => onAction('generate_blogs')}
          disabled={loading}
          style={{
            background: loading ? '#64748b' : '#6366f1',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? '⏳ Generating...' : '⚡ Generate Blogs'}
        </button>
        <button 
          onClick={() => window.location.href = '/admin/new-blog'}
          style={{
            background: '#6366f1',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create New Blog
        </button>
        <button 
          onClick={() => window.location.href = '/admin/users'}
          style={{
            background: '#6366f1',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Manage Users
        </button>
        <button 
          onClick={() => window.location.href = '/admin/questions'}
          style={{
            background: '#6366f1',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Manage Questions
        </button>
      </div>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    { id: 1, text: 'New blog published: "How to Ace Technical Interviews"', time: '2 hours ago' },
    { id: 2, text: 'User registration: john.doe@example.com', time: '4 hours ago' },
    { id: 3, text: 'Question added: "Reverse Linked List"', time: '6 hours ago' },
    { id: 4, text: 'Blog writer profile updated', time: '1 day ago' }
  ];

  return (
    <div style={{
      background: '#1e293b',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #334155'
    }}>
      <h3 style={{ color: '#6366f1', marginBottom: '1rem' }}>Recent Activity</h3>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {activities.map(activity => (
          <div key={activity.id} style={{ 
            padding: '0.5rem', 
            background: '#334155', 
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}>
            <div style={{ color: '#fff' }}>{activity.text}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 
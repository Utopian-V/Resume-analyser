import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout.js';
import WriterProfile from './WriterProfile.js';
import BlogEditor from './BlogEditor.js';
import BlogManagement from './BlogManagement.js';
import UserManagement from './UserManagement.js';
import QuestionManagement from './QuestionManagement.js';
import SystemSettings from './SystemSettings.js';

// Mock data for demonstration
const mockStats = {
  totalUsers: 1247,
  totalBlogs: 89,
  totalQuestions: 456,
  activeWriters: 12,
  monthlyViews: '45.2K',
  engagementRate: '78%'
};

export default function AdminDashboard() {
  const [userRole, setUserRole] = useState('admin'); // 'admin', 'blog_writer', 'moderator'
  const [currentUser] = useState({
    name: 'Admin User',
    email: 'admin@prepnexus.com',
    role: 'admin',
    avatar: null
  });

  // Dashboard Overview Component
  const DashboardOverview = () => (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#6366f1', fontSize: '2rem', fontWeight: 900, margin: 0 }}>
          Welcome back, {currentUser.name}!
        </h1>
        <p style={{ color: '#a5b4fc', margin: '0.5rem 0 0 0' }}>
          Here's what's happening with your platform today.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Total Users"
          value={mockStats.totalUsers}
          icon="👥"
          color="#6366f1"
        />
        <StatCard
          title="Total Blogs"
          value={mockStats.totalBlogs}
          icon="📝"
          color="#8b5cf6"
        />
        <StatCard
          title="Total Questions"
          value={mockStats.totalQuestions}
          icon="❓"
          color="#06b6d4"
        />
        <StatCard
          title="Active Writers"
          value={mockStats.activeWriters}
          icon="✍️"
          color="#10b981"
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem'
      }}>
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  );

  return (
    <AdminLayout userRole={userRole}>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/profile" element={<WriterProfile />} />
        <Route path="/new-blog" element={<BlogEditor />} />
        <Route path="/blogs" element={<BlogManagement />} />
        <Route path="/my-blogs" element={<BlogManagement userRole="blog_writer" />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/questions" element={<QuestionManagement />} />
        <Route path="/settings" element={<SystemSettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
}

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div style={{
    background: 'rgba(30, 41, 59, 0.95)',
    borderRadius: '15px',
    padding: '1.5rem',
    border: `1px solid rgba(99, 102, 241, 0.2)`,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      background: `linear-gradient(135deg, ${color}, ${color}80)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem'
    }}>
      {icon}
    </div>
    <div>
      <div style={{ color: '#a5b4fc', fontSize: '0.9rem', fontWeight: 600 }}>
        {title}
      </div>
      <div style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 900 }}>
        {value}
      </div>
    </div>
  </div>
);

// Quick Actions Component
const QuickActions = () => (
  <div style={{
    background: 'rgba(30, 41, 59, 0.95)',
    borderRadius: '15px',
    padding: '1.5rem',
    border: '1px solid rgba(99, 102, 241, 0.2)'
  }}>
    <h3 style={{ color: '#6366f1', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>
      Quick Actions
    </h3>
    <div style={{ display: 'grid', gap: '0.8rem' }}>
      <QuickActionButton
        icon="✍️"
        label="Create New Blog"
        onClick={() => window.location.href = '/admin/new-blog'}
      />
      <QuickActionButton
        icon="👥"
        label="Manage Users"
        onClick={() => window.location.href = '/admin/users'}
      />
      <QuickActionButton
        icon="❓"
        label="Add Questions"
        onClick={() => window.location.href = '/admin/questions'}
      />
      <QuickActionButton
        icon="⚙️"
        label="System Settings"
        onClick={() => window.location.href = '/admin/settings'}
      />
    </div>
  </div>
);

const QuickActionButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '10px',
      padding: '1rem',
      color: '#e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      width: '100%',
      textAlign: 'left',
      fontSize: '1rem'
    }}
    onMouseEnter={(e) => {
      e.target.style.background = 'rgba(99, 102, 241, 0.1)';
      e.target.style.borderColor = '#6366f1';
    }}
    onMouseLeave={(e) => {
      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
      e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
    }}
  >
    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
    {label}
  </button>
);

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'blog',
      action: 'published',
      title: 'How to Master DSA for Tech Interviews',
      author: 'John Doe',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'user',
      action: 'registered',
      title: 'New writer joined',
      author: 'Jane Smith',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'question',
      action: 'added',
      title: '15 new aptitude questions',
      author: 'System',
      time: '6 hours ago'
    },
    {
      id: 4,
      type: 'blog',
      action: 'drafted',
      title: 'Career Growth Strategies',
      author: 'Mike Johnson',
      time: '1 day ago'
    }
  ];

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.95)',
      borderRadius: '15px',
      padding: '1.5rem',
      border: '1px solid rgba(99, 102, 241, 0.2)'
    }}>
      <h3 style={{ color: '#6366f1', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>
        Recent Activity
      </h3>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {activities.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
};

const ActivityItem = ({ activity }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'blog': return '📝';
      case 'user': return '👤';
      case 'question': return '❓';
      default: return '📌';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'blog': return '#8b5cf6';
      case 'user': return '#06b6d4';
      case 'question': return '#10b981';
      default: return '#6366f1';
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.8rem',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '8px',
      border: '1px solid rgba(99, 102, 241, 0.1)'
    }}>
      <div style={{
        width: '35px',
        height: '35px',
        borderRadius: '8px',
        background: `linear-gradient(135deg, ${getColor(activity.type)}, ${getColor(activity.type)}80)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1rem'
      }}>
        {getIcon(activity.type)}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600 }}>
          {activity.title}
        </div>
        <div style={{ color: '#a5b4fc', fontSize: '0.8rem' }}>
          by {activity.author} • {activity.time}
        </div>
      </div>
      <div style={{
        padding: '0.3rem 0.8rem',
        background: 'rgba(99, 102, 241, 0.2)',
        color: '#6366f1',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 600,
        textTransform: 'capitalize'
      }}>
        {activity.action}
      </div>
    </div>
  );
}; 
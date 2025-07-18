import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiUsers, 
  FiFileText, 
  FiSettings, 
  FiLogOut, 
  FiUser, 
  FiShield,
  FiMenu,
  FiX,
  FiHome,
  FiEdit,
  FiImage,
  FiUpload
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  display: flex;
`;

const Sidebar = styled.div`
  width: 280px;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(99, 102, 241, 0.2);
  padding: 2rem 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    width: 100%;
    max-width: 320px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 280px;
  padding: 2rem;
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 2rem 2rem;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
  margin-bottom: 2rem;
`;

const AdminTitle = styled.h1`
  color: #6366f1;
  font-size: 1.5rem;
  font-weight: 900;
  margin: 0;
`;

const AdminSubtitle = styled.p`
  color: #a5b4fc;
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
`;

const NavSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: #6366f1;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 1rem 2rem;
`;

const NavItem = styled.div`
  padding: 0.8rem 2rem;
  color: ${props => props.active ? '#fff' : '#a5b4fc'};
  background: ${props => props.active ? 'rgba(99, 102, 241, 0.2)' : 'transparent'};
  border-right: ${props => props.active ? '3px solid #6366f1' : 'none'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: ${props => props.active ? '600' : '500'};
  
  &:hover {
    background: ${props => props.active ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'};
    color: #fff;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: #6366f1;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  color: white;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const UserInfo = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid rgba(99, 102, 241, 0.2);
  margin-top: auto;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const UserName = styled.div`
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
`;

const UserRole = styled.div`
  color: #a5b4fc;
  font-size: 0.8rem;
`;

// Permission-based navigation items
const getNavItems = (userRole) => {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/admin' }
  ];

  const roleItems = {
    'admin': [
      { id: 'users', label: 'User Management', icon: FiUsers, path: '/admin/users' },
      { id: 'profiles', label: 'Writer Profiles', icon: FiUser, path: '/admin/profiles' },
      { id: 'blogs', label: 'Blog Management', icon: FiFileText, path: '/admin/blogs' },
      { id: 'questions', label: 'Question Bank', icon: FiEdit, path: '/admin/questions' },
      { id: 'settings', label: 'System Settings', icon: FiSettings, path: '/admin/settings' }
    ],
    'blog_writer': [
      { id: 'profile', label: 'My Profile', icon: FiUser, path: '/admin/profile' },
      { id: 'my-blogs', label: 'My Blogs', icon: FiFileText, path: '/admin/my-blogs' },
      { id: 'new-blog', label: 'Create Blog', icon: FiEdit, path: '/admin/new-blog' },
      { id: 'media', label: 'Media Library', icon: FiImage, path: '/admin/media' }
    ],
    'moderator': [
      { id: 'blogs', label: 'Blog Review', icon: FiFileText, path: '/admin/blogs' },
      { id: 'questions', label: 'Question Review', icon: FiEdit, path: '/admin/questions' },
      { id: 'users', label: 'User Management', icon: FiUsers, path: '/admin/users' }
    ]
  };

  return [...baseItems, ...(roleItems[userRole] || [])];
};

export default function AdminLayout({ children, userRole = 'admin' }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = getNavItems(userRole);

  const handleNavClick = (item) => {
    setActiveSection(item.id);
    navigate(item.path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  return (
    <AdminContainer>
      <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </MobileMenuButton>
      
      <Overlay isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(false)} />
      
      <Sidebar isOpen={isMobileMenuOpen}>
        <SidebarHeader>
          <AdminTitle>Prep Nexus</AdminTitle>
          <AdminSubtitle>Admin Portal</AdminSubtitle>
        </SidebarHeader>

        <NavSection>
          <SectionTitle>Navigation</SectionTitle>
          {navItems.map(item => (
            <NavItem
              key={item.id}
              active={activeSection === item.id}
              onClick={() => handleNavClick(item)}
            >
              <item.icon size={18} />
              {item.label}
            </NavItem>
          ))}
        </NavSection>

        <UserInfo>
          <UserAvatar>
            <FiShield size={16} />
          </UserAvatar>
          <UserName>Admin User</UserName>
          <UserRole>{userRole.replace('_', ' ').toUpperCase()}</UserRole>
        </UserInfo>
      </Sidebar>

      <MainContent>
        {children}
      </MainContent>
    </AdminContainer>
  );
} 
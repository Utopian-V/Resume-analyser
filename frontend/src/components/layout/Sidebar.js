import React from 'react';
import styled from 'styled-components';
import { FiHome, FiUser } from 'react-icons/fi';

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 80px;
  bottom: 0;
  width: 280px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 0;
  overflow-y: auto;
  z-index: 100;
  
  @media (max-width: 768px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
`;

const SidebarHeader = styled.div`
  padding: 0 2rem 2rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
`;

const SidebarMenu = styled.div`
  padding: 0 1rem;
`;

const MenuItem = styled.div`
  margin-bottom: 0.5rem;
`;

const MenuLink = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
  }
  
  &.active {
    background: rgba(99, 102, 241, 0.2);
    color: #6366f1;
  }
`;

const menuItems = [
  { path: '/app', label: 'Dashboard', icon: <FiHome /> },
  { path: '/app/jobs', label: 'Job Listings', icon: <FiUser /> },
  { path: '/app/resume', label: 'Resume Analysis', icon: <FiUser /> },
  { path: '/app/aptitude', label: 'Aptitude Tests', icon: <FiUser /> },
  { path: '/app/dsa', label: 'DSA Practice', icon: <FiUser /> },
  { path: '/app/interview', label: 'Interview Prep', icon: <FiUser /> },
  { path: '/app/blog', label: 'Blog', icon: <FiUser /> },
];

const Sidebar = ({ currentPath, setCurrentPath }) => {
  return (
    <SidebarContainer>
      <SidebarHeader>
        <UserProfile>
          <UserAvatar>JD</UserAvatar>
          <UserInfo>
            <UserName>John Doe</UserName>
            <UserEmail>john@example.com</UserEmail>
          </UserInfo>
        </UserProfile>
      </SidebarHeader>
      
      <SidebarMenu>
        {menuItems.map((item, index) => (
          <MenuItem key={index}>
            <MenuLink 
              className={currentPath === item.path ? 'active' : ''}
              onClick={() => setCurrentPath(item.path)}
            >
              {item.icon}
              {item.label}
            </MenuLink>
          </MenuItem>
        ))}
      </SidebarMenu>
    </SidebarContainer>
  );
};

export default Sidebar; 
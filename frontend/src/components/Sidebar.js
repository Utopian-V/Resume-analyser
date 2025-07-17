import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiUploadCloud, FiCode, FiBriefcase, FiMessageSquare, FiBrain, FiFolder, FiLogOut, FiSettings, FiHome } from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';
import Logo from './Logo';

const SidebarContainer = styled.div`
  width: 280px;
  height: 100vh;
  background: ${({ theme }) => theme.card};
  border-right: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
`;

const SidebarHeader = styled.div`
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
`;

const NavigationMenu = styled.nav`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
`;

const NavItem = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: ${({ theme, active }) => active ? '#6366f1' : theme.textSecondary};
  font-size: 1rem;
  font-weight: ${({ active }) => active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: ${({ theme }) => theme.tabInactive};
    color: #6366f1;
  }
  
  ${({ active }) => active && `
    background: rgba(99, 102, 241, 0.1);
    border-right: 3px solid #6366f1;
  `}
`;

const NavIcon = styled.div`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
`;

const SidebarFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: none;
  border: none;
  color: #ef4444;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
`;

const MainContent = styled.div`
  margin-left: 280px;
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
`;

const Sidebar = ({ user, activeTab, setActiveTab, onSignOut }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
    { id: 'resume', label: 'Resume Analysis', icon: <FiUploadCloud /> },
    { id: 'dsa', label: 'DSA Practice', icon: <FiCode /> },
    { id: 'jobs', label: 'Job Opportunities', icon: <FiBriefcase /> },
    { id: 'interview', label: 'Interview Prep', icon: <FiMessageSquare /> },
    { id: 'aptitude', label: 'Aptitude Test', icon: <BiBrain /> },
    { id: 'question-manager', label: 'Question Manager', icon: <FiFolder /> },
  ];

  const getUserInitials = (user) => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <>
      <SidebarContainer>
        <SidebarHeader>
          <Logo size="small" />
        </SidebarHeader>
        
        <UserProfile>
          <UserAvatar>
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName} 
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            ) : (
              getUserInitials(user)
            )}
          </UserAvatar>
          <UserInfo>
            <UserName>{user?.displayName || 'User'}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </UserInfo>
        </UserProfile>
        
        <NavigationMenu>
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <NavIcon>{item.icon}</NavIcon>
              {item.label}
            </NavItem>
          ))}
        </NavigationMenu>
        
        <SidebarFooter>
          <LogoutButton onClick={onSignOut}>
            <FiLogOut />
            Sign Out
          </LogoutButton>
        </SidebarFooter>
      </SidebarContainer>
      
      <MainContent>
        {/* Content will be rendered here */}
      </MainContent>
    </>
  );
};

export default Sidebar; 
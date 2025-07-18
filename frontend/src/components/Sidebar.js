import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, FiX, FiUser, FiCode, FiBriefcase, FiFolder, 
  FiMessageSquare, FiLogOut, FiBarChart3, FiTarget,
  FiHome, FiFileText, FiBookOpen, FiTrendingUp
} from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const HamburgerButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.shadows.medium};
  
  &:hover {
    transform: scale(1.05);
    background: ${props => props.theme.colors.secondary};
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const SidebarPanel = styled(motion.div)`
  background: ${props => props.theme.colors.card};
  border-right: 1px solid ${props => props.theme.colors.border};
  width: 280px;
  height: 100vh;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: ${props => props.theme.shadows.large};
  
  @media (max-width: 768px) {
    position: fixed;
    left: ${props => props.isOpen ? '0' : '-280px'};
    transition: left 0.3s ease;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
  
  &:hover {
    color: ${props => props.theme.colors.text};
    background: ${props => props.theme.colors.cardHover};
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.cardHover};
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;
`;

const UserEmail = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.8rem;
`;

const NavSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-size: 0.95rem;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.cardHover};
    transform: translateX(4px);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: transparent;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: auto;
  
  &:hover {
    background: ${props => props.theme.colors.error};
    color: white;
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
  { id: 'resume', label: 'Resume Analysis', icon: <FiFileText /> },
  { id: 'dsa', label: 'DSA Practice', icon: <FiCode /> },
  { id: 'interview', label: 'Interview Prep', icon: <FiMessageSquare /> },
  { id: 'aptitude', label: 'Aptitude Tests', icon: <FiTarget /> },
  { id: 'jobs', label: 'Job Listings', icon: <FiBriefcase /> },
  { id: 'question-manager', label: 'Question Manager', icon: <FiFolder /> }
];

const Sidebar = ({ user, activeTab, setActiveTab, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <HamburgerButton onClick={toggleSidebar}>
        <FiMenu size={24} />
      </HamburgerButton>
      
      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      
      <SidebarContainer>
        <SidebarPanel
          isOpen={isOpen}
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <SidebarHeader>
            <Logo>
              <BiBrain size={24} />
              Prep Nexus
            </Logo>
            <CloseButton onClick={() => setIsOpen(false)}>
              <FiX />
            </CloseButton>
          </SidebarHeader>
          
          <UserSection>
            <UserAvatar>
              {getUserInitials(user?.displayName || user?.email)}
            </UserAvatar>
            <UserInfo>
              <UserName>{user?.displayName || 'User'}</UserName>
              <UserEmail>{user?.email}</UserEmail>
            </UserInfo>
          </UserSection>
          
          <NavSection>
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                active={activeTab === item.id}
                onClick={() => handleNavClick(item.id)}
              >
                {item.icon}
                {item.label}
              </NavItem>
            ))}
          </NavSection>
          
          <LogoutButton onClick={onSignOut}>
            <FiLogOut />
            Sign Out
          </LogoutButton>
        </SidebarPanel>
      </SidebarContainer>
    </>
  );
};

export default Sidebar; 